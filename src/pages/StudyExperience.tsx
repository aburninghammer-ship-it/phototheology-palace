import { useState, useCallback, useEffect, useMemo } from "react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Share2, Sparkles, ChevronDown, ChevronRight, FileText, ClipboardCopy, Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { VersePanel } from "@/components/study-experience/VersePanel";
import { RoomBox } from "@/components/study-experience/RoomBox";
import { AnalysisCard, type StudyLayer } from "@/components/study-experience/AnalysisCard";
import { UserLedInput } from "@/components/study-experience/UserLedInput";
import { ROOM_SUB_PRINCIPLES } from "@/components/mind-map/data/roomSubPrinciples";
import type { RoomSubPrinciples, SubPrinciple } from "@/components/mind-map/data/roomSubPrinciples";
import { palaceFloors } from "@/data/palaceData";
import { callJeeves } from "@/lib/jeevesClient";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer } from "@/components/sparks";
import { TextShareButton } from "@/components/TextShareButton";
import { cn } from "@/lib/utils";

// Build ALL rooms organized by floor from palaceData
interface FloorGroup {
  floor: number;
  name: string;
  rooms: { id: string; name: string; room: RoomSubPrinciples | null }[];
}

// Demo mode: 2 representative rooms per floor (Show Me preview)
const DEMO_ROOM_IDS = new Set([
  "sr",       // F1: Story Room
  "ir",       // F1: Imagination Room
  "or",       // F2: Observation Room
  "st",       // F2: Symbols/Types Room
  "nf",       // F3: Nature Freestyle
  "bf",       // F3: Bible Freestyle
  "dr",       // F4: Dimensions Room
  "c6",       // F4: Connect-6
  "bl",       // F5: Blue Room — Sanctuary
  "cec",      // F5: Christ in Every Chapter
  "123h",     // F6: Three Heavens
  "cycles",   // F6: Eight Cycles
  "frm",      // F7: Fire Room
  "mr",       // F7: Meditation Room
  "infinity", // F8: Reflexive Mastery
  "freestyle",// F8: Palace Freestyle
]);

function buildAllRooms(demo: boolean): FloorGroup[] {
  return palaceFloors.map((f) => ({
    floor: f.number,
    name: f.name,
    rooms: f.rooms
      .filter((r) => !demo || DEMO_ROOM_IDS.has(r.id))
      .map((r) => ({
        id: r.id,
        name: r.name,
        room: ROOM_SUB_PRINCIPLES[r.id] || null,
      })),
  })).filter((f) => f.rooms.length > 0);
}

// For rooms without sub-principles, create a synthetic one using the room itself
function getSyntheticPrinciple(roomId: string, roomName: string): SubPrinciple {
  return {
    id: `${roomId}-main`,
    name: roomName,
    shortName: roomName,
    description: `Apply the ${roomName} lens to this verse`,
  };
}

type Mode = "jeeves-led" | "user-led" | "teach";

// Auto-pick a random room + principle that hasn't been used yet
function autoPickPrinciple(
  allFloors: FloorGroup[],
  usedPrincipleIds: Set<string>
): { roomId: string; roomName: string; principle: SubPrinciple } | null {
  const candidates: { roomId: string; roomName: string; principle: SubPrinciple }[] = [];
  for (const fg of allFloors) {
    for (const r of fg.rooms) {
      if (r.room) {
        for (const p of r.room.subPrinciples) {
          if (!usedPrincipleIds.has(p.id)) {
            candidates.push({ roomId: r.id, roomName: r.room.roomName, principle: p });
          }
        }
      } else {
        const synId = `${r.id}-main`;
        if (!usedPrincipleIds.has(synId)) {
          candidates.push({
            roomId: r.id,
            roomName: r.name,
            principle: { id: synId, name: r.name, shortName: r.name, description: `Apply the ${r.name} lens` },
          });
        }
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function parseVerseRef(ref: string): { book: string; chapter: string; verse: string } | null {
  // Match "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
  const m = ref.match(/^(.+?)\s+(\d+):(\d+(?:\s*[-–—]\s*\d+)?)$/);
  if (m) return { book: m[1], chapter: m[2], verse: m[3] };
  // Match "Book Chapter" (whole chapter, e.g. "Genesis 8")
  const m2 = ref.match(/^(.+?)\s+(\d+)$/);
  if (m2) return { book: m2[1], chapter: m2[2], verse: "" };
  return null;
}

// Determine if input is a verse reference or a topic/theme/story
function isTopicInput(ref: string): boolean {
  return !parseVerseRef(ref);
}

const SAVE_KEY = "study-experience-saved";

function loadSavedStudies(): { ref: string; layers: StudyLayer[]; timestamp: number }[] {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function StudyExperience() {
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const { isBasic } = useExperienceMode();

  const [verseRef, setVerseRef] = useState("");
  const [parsedRef, setParsedRef] = useState<{ book: string; chapter: string; verse: string } | null>(null);
  const [verseText, setVerseText] = useState("");
  const [mode, setMode] = useState<Mode>("jeeves-led");
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const [layers, setLayers] = useState<StudyLayer[]>([]);
  const [loadingPrinciple, setLoadingPrinciple] = useState<string | null>(null);
  const [verseLookupLoading, setVerseLookupLoading] = useState(false);
  const [synthesizedOutput, setSynthesizedOutput] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);
  const [pendingLayer, setPendingLayer] = useState<StudyLayer | null>(null);
  const [abChoice, setAbChoice] = useState<{ a: ReturnType<typeof autoPickPrinciple>; b: ReturnType<typeof autoPickPrinciple> } | null>(null);

  // User-led state
  const [suggestedRoom, setSuggestedRoom] = useState<{ roomId: string; principleId: string } | null>(null);
  const [userInput, setUserInput] = useState("");
  const [userLedTeach, setUserLedTeach] = useState(false);

  // All rooms organized by floor (demo mode shows only 2 per floor)
  const allFloors = useMemo(() => buildAllRooms(isDemo), [isDemo]);

  // Sparks integration
  const {
    sparks,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
  } = useSparks({
    surface: "study",
    contextType: "study",
    contextId: verseRef || "study-experience",
  });

  // Generate sparks when layers accumulate
  useEffect(() => {
    if (layers.length > 0 && layers.length % 2 === 0) {
      const content = layers.map((l) => `${l.roomName} - ${l.principleName}: ${l.analysis}`).join("\n\n");
      if (content.length >= 100) {
        generateSpark(content.slice(-1000), verseRef || undefined);
      }
    }
  }, [layers.length]);

  const usedPrinciples = new Set(layers.map((l) => l.principleId));
  const usedRoomIds = new Set(layers.map((l) => l.roomId));

  const handleStudyVerse = useCallback(async (ref: string) => {
    const parsed = parseVerseRef(ref);
    const isTopic = isTopicInput(ref);

    // Must be either a valid verse ref or a topic
    if (!parsed && !isTopic) return;

    setVerseRef(ref);
    setParsedRef(parsed || { book: ref, chapter: "", verse: "" });
    setVerseText("");
    setLayers([]);
    setSynthesizedOutput(null);
    setSuggestedRoom(null);
    setUserInput("");
    setExpandedRoom(null);
    setExpandedFloor(null);

    // For topics, ask Jeeves to identify the key scripture passage(s)
    if (isTopic) {
      setVerseLookupLoading(true);
      try {
        const { data } = await callJeeves({
          mode: "topic-scripture-lookup",
          message: `The student wants to study the biblical topic/theme/object: "${ref}".

Your task: Identify the PRIMARY scripture passage(s) where this topic is found or most clearly taught. 
Provide the KEY BIBLE TEXTS (KJV) that a student must read to study "${ref}".

Format your response as:
📖 KEY PASSAGES FOR "${ref.toUpperCase()}"

Then for each passage (2-4 passages max):
📍 [Reference]
"[Full KJV text of the passage]"

Then a brief 1-2 sentence overview of why these passages are central to understanding "${ref}".

Use KJV text only. Be precise with references.`,
        }, "study-experience");

        const response = typeof data === "string" ? data : (data as any)?.response || "";
        if (response) {
          setVerseText(response);
        }
      } catch (err) {
        console.error("Topic scripture lookup failed:", err);
      }
      setVerseLookupLoading(false);
    }

    if (mode === "user-led" && parsed) {
      fetchCrossRoomSuggestion(parsed, ref);
    } else if (mode === "jeeves-led" || mode === "teach") {
      setTimeout(() => {
        autoPickAndApply(parsed || { book: ref, chapter: "", verse: "" }, ref, new Set());
      }, 100);
    }
  }, [mode]);

  const autoPickAndApply = useCallback(async (
    ref: { book: string; chapter: string; verse: string },
    refStr: string,
    existingUsed?: Set<string>
  ) => {
    const used = existingUsed || new Set(layers.map((l) => l.principleId));
    const pick = autoPickPrinciple(allFloors, used);
    if (!pick) { toast("All principles explored! 🎉"); return; }
    setLoadingPrinciple(pick.principle.id);
    try {
      const promptBuilder = mode === "teach" ? buildTeachPrompt : buildDeepPrompt;
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: ref.book, chapter: ref.chapter, verse: ref.verse,
        verseText: verseText,
        principle: promptBuilder(pick.roomName, pick.roomId, pick.principle.name, pick.principle.description),
      }, "study-experience");
      const response = typeof data === "string" ? data : (data as any)?.response || "";
      if (!verseText && response) {
        const vMatch = response.match(/[""\u201C\u201D]([^""\u201C\u201D]{10,})["""\u201C\u201D]/);
        if (vMatch) setVerseText(vMatch[1]);
      }
      setPendingLayer({ roomId: pick.roomId, roomName: pick.roomName, principleId: pick.principle.id, principleName: pick.principle.name, analysis: response });
    } catch (err) {
      console.error("Auto-pick analysis failed:", err);
      toast.error("Analysis failed — try again.");
    }
    setLoadingPrinciple(null);
  }, [allFloors, layers, mode, verseText]);

  const handleAcceptPending = useCallback(() => {
    if (!pendingLayer) return;
    setLayers((prev) => [...prev, { ...pendingLayer, accepted: true }]);
    setPendingLayer(null);
    toast.success("Layer accepted!");
  }, [pendingLayer]);

  const handleRejectPending = useCallback(() => {
    setPendingLayer(null);
    toast("Layer rejected.", { icon: "🔄" });
  }, []);

  const handleContinueBuilding = useCallback(() => {
    if (!parsedRef) return;
    const used = new Set(layers.map((l) => l.principleId));
    const pickA = autoPickPrinciple(allFloors, used);
    if (!pickA) { toast("All principles explored! 🎉"); return; }
    const usedPlusA = new Set([...used, pickA.principle.id]);
    const pickB = autoPickPrinciple(allFloors, usedPlusA);
    if (!pickB) {
      // Only one option left, just run it directly
      autoPickAndApply(parsedRef, verseRef);
      return;
    }
    setAbChoice({ a: pickA, b: pickB });
  }, [parsedRef, verseRef, autoPickAndApply, allFloors, layers]);

  const handleAbSelect = useCallback(async (choice: "a" | "b") => {
    if (!abChoice || !parsedRef) return;
    const pick = choice === "a" ? abChoice.a : abChoice.b;
    if (!pick) return;
    setAbChoice(null);
    setLoadingPrinciple(pick.principle.id);
    try {
      const promptBuilder = mode === "teach" ? buildTeachPrompt : buildDeepPrompt;
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book, chapter: parsedRef.chapter, verse: parsedRef.verse,
        verseText: verseText,
        principle: promptBuilder(pick.roomName, pick.roomId, pick.principle.name, pick.principle.description),
      }, "study-experience");
      const response = typeof data === "string" ? data : (data as any)?.response || "";
      setPendingLayer({ roomId: pick.roomId, roomName: pick.roomName, principleId: pick.principle.id, principleName: pick.principle.name, analysis: response });
    } catch (err) {
      console.error("A/B analysis failed:", err);
      toast.error("Analysis failed — try again.");
    }
    setLoadingPrinciple(null);
  }, [abChoice, parsedRef, mode, verseText]);

  const fetchCrossRoomSuggestion = async (
    parsed: { book: string; chapter: string; verse: string },
    ref: string
  ) => {
    setVerseLookupLoading(true);
    try {
      const { data } = await callJeeves({
        mode: "cross-room-linking",
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse,
        verseText: "",
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response;
      if (response) {
        try {
          const suggestions = JSON.parse(response);
          if (Array.isArray(suggestions)) {
            const allRoomIds = allFloors.flatMap((f) => f.rooms.map((r) => r.id));
            for (const s of suggestions) {
              const roomId = s.roomId || s.room_id || s.room;
              if (roomId && allRoomIds.includes(roomId)) {
                const room = ROOM_SUB_PRINCIPLES[roomId];
                if (room) {
                  const matchedPrinciple = room.subPrinciples.find(
                    (p) => p.id === (s.principleId || s.principle_id) || p.shortName?.toLowerCase() === (s.principle || "").toLowerCase()
                  );
                  setSuggestedRoom({
                    roomId,
                    principleId: matchedPrinciple?.id || room.subPrinciples[0]?.id,
                  });
                  setExpandedRoom(roomId);
                  // Open the floor containing this room
                  const floorNum = allFloors.find((f) => f.rooms.some((r) => r.id === roomId))?.floor;
                  if (floorNum) setExpandedFloor(floorNum);
                  setVerseLookupLoading(false);
                  return;
                } else {
                  // Room without sub-principles
                  setSuggestedRoom({ roomId, principleId: `${roomId}-main` });
                  setExpandedRoom(roomId);
                  const floorNum = allFloors.find((f) => f.rooms.some((r) => r.id === roomId))?.floor;
                  if (floorNum) setExpandedFloor(floorNum);
                  setVerseLookupLoading(false);
                  return;
                }
              }
            }
          }
        } catch {
          // Not JSON
        }
      }
      // Fallback
      setSuggestedRoom({ roomId: "dr", principleId: "dr-christ" });
      setExpandedRoom("dr");
      setExpandedFloor(4);
    } catch {
      setSuggestedRoom({ roomId: "dr", principleId: "dr-christ" });
      setExpandedRoom("dr");
      setExpandedFloor(4);
    }
    setVerseLookupLoading(false);
  };

  const handleRemoveLayer = useCallback((principleId: string) => {
    setLayers((prev) => prev.filter((l) => l.principleId !== principleId));
  }, []);

  // Accept (Build) a layer — marks it as accepted
  const handleAcceptLayer = useCallback(async (principleId: string) => {
    // Mark this layer as accepted
    setLayers((prev) => prev.map((l) => l.principleId === principleId ? { ...l, accepted: true } : l));

    // Check how many accepted layers we now have (including this one)
    const updatedLayers = layers.map((l) => l.principleId === principleId ? { ...l, accepted: true } : l);
    const acceptedLayers = updatedLayers.filter((l) => l.accepted);

    if (acceptedLayers.length < 2) {
      toast.success("Layer accepted! Choose A or B to continue building.");
      // Auto-generate A/B choices for jeeves-led and teach modes
      if (mode === "jeeves-led" || mode === "teach") {
        setTimeout(() => handleContinueBuilding(), 100);
      }
      return;
    }

    // Synthesize all accepted layers into one seamless output
    setSynthesizing(true);
    toast("Jeeves is weaving your layers together…", { icon: "🧵" });

    try {
      const layerSummaries = acceptedLayers.map((l, i) =>
        `LAYER ${i + 1} — ${l.roomName} / ${l.principleName}:\n${l.analysis}`
      ).join("\n\n---\n\n");

      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef?.book || "",
        chapter: parsedRef?.chapter || "",
        verse: parsedRef?.verse || "",
        verseText: verseText,
        principle: "Synthesis — Unified Study Output",
        message: `You have ${acceptedLayers.length} separate study layers on ${verseRef}. The student has accepted all of them and wants you to BUILD — meaning weave them into ONE seamless, unified theological narrative.

HERE ARE THE ACCEPTED LAYERS:
${layerSummaries}

INSTRUCTIONS FOR SYNTHESIS:
- Combine all insights into ONE flowing, cohesive study — NOT a list of separate sections.
- Thread together the principles naturally: show how each lens (${acceptedLayers.map(l => l.principleName).join(", ")}) illuminates the verse from different angles that converge on Christ.
- Start with the verse text, then build layer upon layer of meaning like a master painter adding depth.
- Use smooth transitions between insights — the reader should feel the connections, not see the seams.
- Include all key cross-references and KJV quotes from the individual layers.
- End with a powerful unified ✨ Spark that captures the combined insight.
- End with a 💎 Gem that only becomes visible when ALL these principles are combined.
- Write in a warm, pastoral, scholarly tone. This is the crown jewel of their study session.`,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";
      setSynthesizedOutput(response);
      toast.success("Study synthesized! Scroll down to see your unified output.");
    } catch (err) {
      console.error("Synthesis failed:", err);
      toast.error("Synthesis failed — try again.");
    }
    setSynthesizing(false);
  }, [layers, parsedRef, verseText, verseRef]);

  // Rebuild a layer — removes it so the user can re-click the principle
  const handleRebuildLayer = useCallback((principleId: string) => {
    setLayers((prev) => prev.filter((l) => l.principleId !== principleId));
    toast("Layer removed — click the same principle again for a fresh analysis.", { icon: "🔄" });
  }, []);

  // Save individual layer
  const handleSaveLayer = useCallback((layer: StudyLayer) => {
    const saved = loadSavedStudies();
    saved.push({ ref: verseRef, layers: [layer], timestamp: Date.now() });
    const trimmed = saved.slice(-50);
    localStorage.setItem(SAVE_KEY, JSON.stringify(trimmed));
  }, [verseRef]);

  // Determine if the current study is topic-based
  const isCurrentTopicStudy = verseRef ? isTopicInput(verseRef) : false;

  // Build a TEACH mode prompt — Jeeves teaches the principle, then applies it
  const buildTeachPrompt = (roomName: string, roomId: string, principleName: string, description: string) => {
    const subjectLine = isCurrentTopicStudy
      ? `The student is studying the biblical topic/theme/story: "${verseRef}".`
      : `The student is studying ${verseRef}.`;

    return `You are in TEACH MODE — your role is to be a master teacher training the student to THINK like a Phototheologian.

ROOM: ${roomName} (${roomId.toUpperCase()})
PRINCIPLE: ${principleName} — ${description}
${subjectLine}

YOUR TEACHING STRUCTURE (follow this order):

📚 **WHAT IS THIS PRINCIPLE?**
- Explain "${principleName}" in clear, accessible language. What does this principle DO? Why does it exist in the Palace? What kind of insight does it unlock?
- Use a vivid analogy to make it click (e.g., "Think of it like a detective dusting for fingerprints…").

🔍 **HOW TO SPOT THE CONNECTION**
- Teach the student what to LOOK FOR when applying this principle to any text.
- What are the clues, keywords, patterns, or structural features that signal this principle is active?
- Give 1-2 brief examples from OTHER well-known passages to show the principle in action elsewhere.

🧠 **THINKING OUTSIDE THE BOX**
- Teach the student how to push beyond the obvious. What would a MASTER-level student see that a beginner would miss?
- Show them how to ask unexpected questions, flip perspectives, or trace connections they'd never consider.
- Encourage creative, Spirit-led thinking — not just mechanical application.

🔗 **HOW TO MAKE IT RELEVANT**
- Show the student how to connect this principle to real life, personal growth, and practical discipleship.
- What does this principle reveal about Christ, about their walk, about the church today?

🎯 **DIRECT APPLICATION TO "${verseRef}"**
- NOW apply the principle fully to the passage. Quote specific KJV scriptures.
- Show the student exactly how everything you just taught them plays out in THIS specific text.
- Include cross-references that deepen the insight.

💎 **Gem**: End with one stunning insight that only becomes visible when this principle is applied to this text.
✨ **Spark**: One sentence of surprising, memorable insight.

GUARDRAILS:
- IMPORTANT: Do NOT name the room, principle label, or method code in your output. Do NOT say "Meditation Room" or "MR" or label the principle explicitly. The teaching should feel organic — the student learns the thinking pattern without seeing Palace labels. Just teach the concept and apply it.
- STRICTLY BIBLICAL: All parallels and connections must be to Scripture — not secular history or extra-biblical sources.
- PROPHECY GUARDRAIL: Follow historicist interpretation. Do NOT present Antiochus Epiphanes as fulfillment of Daniel 7 or 8.
${roomId === "hf" ? `- HISTORY FREESTYLE GUARDRAIL: Use SECULAR history and culture as source material — not biblical history.` : ""}
- Use KJV text for all Scripture quotes.
- Be warm, encouraging, and conversational — like a wise mentor sitting with a student.`;
  };

  // Deep, profound Jeeves prompt for Jeeves-led mode
  const buildDeepPrompt = (roomName: string, roomId: string, principleName: string, description: string) => {
    const subjectLine = isCurrentTopicStudy
      ? `The student is studying the biblical topic/theme/story: "${verseRef}".`
      : `The student is studying ${verseRef}.`;

    return `${roomName} (${roomId.toUpperCase()}): ${principleName} - ${description}

${subjectLine}

CRITICAL INSTRUCTION — DIRECT APPLICATION REQUIRED:
You MUST directly APPLY the principle "${principleName}" to the subject "${verseRef}".
- Do NOT merely describe what the principle is or how it works in general.
- Instead, DEMONSTRATE the principle by finding and citing the specific biblical content that connects "${verseRef}" to "${principleName}".
${principleName.toLowerCase().includes("parable") 
  ? `- You MUST identify a specific parable from the Bible that directly connects to or illuminates "${verseRef}". Quote the parable text (KJV), explain the connection, and show how the parable deepens understanding of "${verseRef}".`
  : principleName.toLowerCase().includes("type") || principleName.toLowerCase().includes("symbol")
  ? `- You MUST identify specific types, shadows, or symbols from Scripture that directly connect to "${verseRef}". Quote the relevant texts (KJV) and trace the typological connection.`
  : principleName.toLowerCase().includes("pattern")
  ? `- You MUST identify a specific recurring biblical pattern that "${verseRef}" fits into. Show the pattern across multiple texts with KJV citations.`
  : principleName.toLowerCase().includes("parallel")
  ? `- You MUST find a specific biblical event or action that mirrors/parallels "${verseRef}". Quote both texts (KJV) and show how they reflect each other.`
  : `- Pick and quote specific KJV scriptures. Identify concrete historical or theological connections.`}

${isCurrentTopicStudy
  ? `- Since this is a TOPIC study, identify and cite the KEY SCRIPTURES most relevant to "${verseRef}" and this principle.
- Ground every claim in specific Bible texts (KJV preferred).`
  : `- Begin with the verse text if not already provided.
- Show how this principle SPECIFICALLY illuminates this verse in ways the reader may never have considered.`}
- Include at minimum: (1) The direct application of this principle with specific scripture, (2) A cross-reference to at least one other Scripture that deepens the insight, (3) A practical or devotional takeaway.
- Use the Phototheology study method language naturally.
- IMPORTANT: Do NOT name the room, principle, or method label in your output. Do NOT say "Meditation Room" or "MR" or "Applied to..." with a principle label. Just deliver the insight directly as if the reader doesn't know which lens was used. The principle should be invisible — only the result should be visible.
- STRICTLY BIBLICAL: All parallels, cross-references, and connections must be to OTHER SCRIPTURE — not to historical figures, secular history, or extra-biblical sources. Stay within the 66 books of the Bible. Do not reference Josephus, church fathers, or any non-biblical source as a parallel. The Bible interprets itself.
- PROPHECY GUARDRAIL: Do NOT present Antiochus Epiphanes as a biblical fulfillment of Daniel 7 or Daniel 8. The little horn of Daniel 7 and Daniel 8 points to a greater prophetic power, not a historical Greek king. Follow the historicist interpretation — the Bible's own prophetic framework.
${roomId === "hf" ? `- HISTORY FREESTYLE GUARDRAIL: This is the History/Social Freestyle room. Use SECULAR history, culture, and current events as the source material — NOT biblical history. The goal is to find gospel illustrations and spiritual parallels in SECULAR events, trends, and historical figures. Do not analyze biblical narratives here — that belongs to other rooms. Draw from world history, social movements, science, art, politics, and culture to illuminate the biblical text.` : ""}
- End with a "Spark" — one sentence of surprising, memorable insight. Format it as: ✨ Spark: [your insight]`;
  };

  const handlePrincipleClick = useCallback(async (roomId: string, principle: SubPrinciple) => {
    if (!parsedRef || loadingPrinciple) return;

    if (mode === "user-led") return;

    // Look up room name from either sub-principles or palace data
    const subRoom = ROOM_SUB_PRINCIPLES[roomId];
    const palaceRoom = palaceFloors.flatMap((f) => f.rooms).find((r) => r.id === roomId);
    const roomName = subRoom?.roomName || palaceRoom?.name || roomId;

    // If principle already used, re-apply it with a fresh angle
    const previousLayers = layers.filter((l) => l.principleId === principle.id);
    const reApplyNote = previousLayers.length > 0
      ? `\n\nIMPORTANT — FRESH ANGLE REQUIRED: The student has already explored "${principle.name}" for this text ${previousLayers.length} time(s). You MUST take a completely DIFFERENT angle this time. Do NOT repeat any of the same points, scriptures, or insights from before. Find a FRESH connection, a new cross-reference, a different facet of this principle that hasn't been explored yet. Surprise the student with something they haven't considered.`
      : "";

    setLoadingPrinciple(principle.id);
    try {
      const promptBuilder = mode === "teach" ? buildTeachPrompt : buildDeepPrompt;
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: promptBuilder(roomName, roomId, principle.name, principle.description) + reApplyNote,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";

      if (!verseText && response) {
        const vMatch = response.match(/[""\u201C\u201D]([^""\u201C\u201D]{10,})["""\u201C\u201D]/);
        if (vMatch) setVerseText(vMatch[1]);
      }

      setLayers((prev) => [
        ...prev,
        {
          roomId,
          roomName,
          principleId: principle.id,
          principleName: principle.name,
          analysis: response,
        },
      ]);
    } catch (err) {
      console.error("Jeeves principle-amplification failed:", err);
    }
    setLoadingPrinciple(null);
  }, [parsedRef, loadingPrinciple, mode, verseText, layers]);

  // Handle click on a room that has NO sub-principles (single-principle room)
  const handleSingleRoomClick = useCallback(async (roomId: string, roomName: string) => {
    if (!parsedRef || loadingPrinciple) return;

    const syntheticId = `${roomId}-main`;

    if (mode === "user-led") return;

    const palaceRoom = palaceFloors.flatMap((f) => f.rooms).find((r) => r.id === roomId);
    const purpose = palaceRoom?.purpose || `Apply the ${roomName} lens`;
    const coreQuestion = palaceRoom?.coreQuestion || "";

    // If room already used, re-apply with a fresh angle
    const previousLayers = layers.filter((l) => l.principleId === syntheticId);
    const reApplyNote = previousLayers.length > 0
      ? `\n\nIMPORTANT — FRESH ANGLE REQUIRED: The student has already explored "${roomName}" for this text ${previousLayers.length} time(s). You MUST take a completely DIFFERENT angle this time. Do NOT repeat any of the same points, scriptures, or insights from before. Find a FRESH connection, a new cross-reference, a different facet that hasn't been explored yet. Surprise the student with something they haven't considered.`
      : "";

    setLoadingPrinciple(syntheticId);
    try {
      const promptBuilder = mode === "teach" ? buildTeachPrompt : buildDeepPrompt;
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: promptBuilder(roomName, roomId, roomName, `${purpose}${coreQuestion ? ` Core question: ${coreQuestion}` : ""}`) + reApplyNote,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";

      if (!verseText && response) {
        const vMatch = response.match(/[""\u201C\u201D]([^""\u201C\u201D]{10,})["""\u201C\u201D]/);
        if (vMatch) setVerseText(vMatch[1]);
      }

      setLayers((prev) => [
        ...prev,
        {
          roomId,
          roomName,
          principleId: syntheticId,
          principleName: roomName,
          analysis: response,
        },
      ]);
    } catch (err) {
      console.error("Jeeves single-room analysis failed:", err);
    }
    setLoadingPrinciple(null);
  }, [parsedRef, loadingPrinciple, mode, verseText, layers]);

  const handleUserLedSubmit = useCallback(async () => {
    if (!parsedRef || !suggestedRoom || !userInput.trim()) return;

    const subRoom = ROOM_SUB_PRINCIPLES[suggestedRoom.roomId];
    const palaceRoom = palaceFloors.flatMap((f) => f.rooms).find((r) => r.id === suggestedRoom.roomId);
    const roomName = subRoom?.roomName || palaceRoom?.name || suggestedRoom.roomId;

    let principleName = roomName;
    if (subRoom) {
      const p = subRoom.subPrinciples.find((p) => p.id === suggestedRoom.principleId);
      if (p) principleName = p.name;
    }

    setLoadingPrinciple(suggestedRoom.principleId);
    try {
      const teachMeMessage = userLedTeach
        ? `You are in TEACH ME mode — a Socratic mentor. The student is trying to apply "${principleName}" from the ${roomName} to ${verseRef}.

The student wrote: "${userInput}"

YOUR ROLE — GUIDE, DO NOT GIVE ANSWERS:
- Do NOT provide the analysis yourself. Do NOT reveal the connections directly.
- Instead, GUIDE the student to discover the insight on their own.
- Acknowledge what they got right — affirm any correct thinking.
- If they're on the right track, push them deeper with probing questions: "What else do you notice?" "What if you looked at the surrounding context?" "Who else in Scripture faced something similar?"
- If they're off track, gently redirect WITHOUT giving the answer: "That's an interesting angle — but what if we look at the actual words more carefully?" "What does the original action in the text suggest?"
- Teach them the CRITICAL THINKING PROCESS: How to observe, how to ask the right questions, how to trace connections, how to think like a Phototheologian.
- Offer 2-3 specific guiding questions that will lead them closer to the insight.
- If they seem stuck, give a small hint — like a breadcrumb, not the full loaf.
- Encourage them warmly. Make them feel like a scholar-in-training, not a student being tested.
- End with a clear next prompt: "Try again with this in mind…" or "What do you think now?"
- NEVER give the full principle application. The student must earn the discovery.`
        : `The student's connection: "${userInput}". Evaluate their insight thoroughly — what they got right, what they missed, and what deeper layers they could explore. Then provide the full analysis with a ✨ Spark at the end.`;

      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: `${roomName} (${suggestedRoom.roomId.toUpperCase()}): ${principleName}`,
        message: teachMeMessage,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";

      if (userLedTeach) {
        // In teach-me mode, keep the same room/principle active so the student can try again
        setLayers((prev) => [
          ...prev,
          {
            roomId: suggestedRoom.roomId,
            roomName,
            principleId: `${suggestedRoom.principleId}-teach-${Date.now()}`,
            principleName: `🎓 ${principleName} (Guided)`,
            analysis: response,
            userAttempt: userInput,
          },
        ]);
        setUserInput("");
        // Don't clear suggestedRoom — let them try again with the same principle
      } else {
        const evalSplit = response.split(/(?:full analysis|here'?s? (?:the )?(?:full|complete) (?:analysis|breakdown))/i);
        const evaluation = evalSplit.length > 1 ? evalSplit[0].trim() : undefined;
        const analysis = evalSplit.length > 1 ? evalSplit[1].trim() : response;

        if (!verseText && response) {
          const vMatch = response.match(/[""\u201C\u201D]([^""\u201C\u201D]{10,})["""\u201C\u201D]/);
          if (vMatch) setVerseText(vMatch[1]);
        }

        setLayers((prev) => [
          ...prev,
          {
            roomId: suggestedRoom.roomId,
            roomName,
            principleId: suggestedRoom.principleId,
            principleName,
            analysis,
            userAttempt: userInput,
            jeevesEvaluation: evaluation,
          },
        ]);

        setUserInput("");
        setSuggestedRoom(null);

        setTimeout(() => {
          fetchCrossRoomSuggestion(parsedRef, verseRef);
        }, 500);
      }
    } catch (err) {
      console.error("Jeeves user-led evaluation failed:", err);
    }
    setLoadingPrinciple(null);
  }, [parsedRef, suggestedRoom, userInput, verseText, verseRef, userLedTeach]);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setSuggestedRoom(null);
    setUserInput("");
    if (newMode === "user-led" && parsedRef) {
      fetchCrossRoomSuggestion(parsedRef, verseRef);
    }
  };

  // Compound — Jeeves combines all layers up to a given index into one smooth summary
  const [compounding, setCompounding] = useState(false);

  const handleCompound = useCallback(async (upToIndex: number) => {
    if (!parsedRef || compounding) return;

    // Compound ALL accepted layers in the build, not just up to an index
    const allAcceptedLayers = layers.filter(l => l.accepted && l.roomId !== "compound");
    if (allAcceptedLayers.length < 2) {
      toast.error("Need at least 2 layers to compound.");
      return;
    }

    setCompounding(true);
    toast("Jeeves is compounding your entire build…", { icon: "🧬" });

    try {
      const layerSummaries = allAcceptedLayers.map((l, i) =>
        `LAYER ${i + 1} — ${l.roomName} / ${l.principleName}:\n${l.analysis}`
      ).join("\n\n---\n\n");

      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: "Compound — Unified Summary of Entire Build",
        message: `The student has built ${allAcceptedLayers.length} study layers on ${verseRef}. They want you to COMPOUND the ENTIRE BUILD — meaning weave ALL layers into ONE smooth, cohesive, flowing theological narrative that reads as a single unified thought.

HERE ARE ALL THE LAYERS IN THE BUILD:
${layerSummaries}

INSTRUCTIONS FOR COMPOUNDING:
- Combine ALL ${allAcceptedLayers.length} layers into ONE seamless, flowing theological narrative — a single cohesive thought.
- Do NOT list them separately — thread the principles (${allAcceptedLayers.map(l => l.principleName).join(", ")}) together naturally so it reads like ONE unified meditation.
- Show how each lens builds on the previous: the reader should feel momentum and cumulative depth.
- Preserve the best cross-references and KJV quotes from each layer.
- Write as a unified study passage — like a chapter in a study Bible, not a list of bullet points.
- End with a transitional invitation: "The foundation is laid. What lens will you add next?"
- Include a 💎 Compound Gem — an insight that only becomes visible when ALL these principles are combined.
- Warm, pastoral, scholarly tone. This is the compounded bedrock of their study.
- STRICTLY BIBLICAL: All references must be to Scripture. No extra-biblical sources.`,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";

      // ADD the compound as a new layer — do NOT replace existing layers
      const compoundLayer: StudyLayer = {
        roomId: "compound",
        roomName: "🧬 Compound",
        principleId: `compound-${Date.now()}`,
        principleName: `${allAcceptedLayers.map(l => l.principleName).join(" + ")}`,
        analysis: response,
        accepted: true,
      };

      setLayers((prev) => [...prev, compoundLayer]);

      toast.success("Entire build compounded into a unified narrative!");
    } catch (err) {
      console.error("Compound failed:", err);
      toast.error("Compounding failed — try again.");
    }
    setCompounding(false);
  }, [layers, parsedRef, verseText, verseRef, compounding]);

  // Recap — Jeeves summarizes all current layers into one smooth output
  const [recapText, setRecapText] = useState<string | null>(null);
  const [recapLoading, setRecapLoading] = useState(false);

  const handleRecap = useCallback(async () => {
    if (layers.length === 0 || !parsedRef) return;

    setRecapLoading(true);
    setRecapText(null);
    toast("Jeeves is preparing your recap…", { icon: "📋" });

    try {
      const layerSummaries = layers.map((l, i) =>
        `LAYER ${i + 1} — ${l.roomName} / ${l.principleName}:\n${l.analysis}`
      ).join("\n\n---\n\n");

      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: "Recap — Summary of Study So Far",
        message: `The student has built ${layers.length} study layers on ${verseRef} so far. Give a smooth, flowing RECAP of everything discovered — not a list, but a unified narrative that ties all insights together.

HERE ARE THE LAYERS SO FAR:
${layerSummaries}

INSTRUCTIONS FOR RECAP:
- Write ONE flowing summary that weaves all the insights together naturally.
- Show how the different rooms and principles (${[...new Set(layers.map(l => `${l.roomName}: ${l.principleName}`))].join(", ")}) combine to reveal a richer picture of this verse.
- Keep it concise but meaningful — this is a recap, not a full re-analysis. Aim for 200-400 words.
- Use smooth transitions so the reader feels the connections between insights.
- STRICTLY BIBLICAL: All references must be to Scripture. No extra-biblical sources.
- End with a brief note of what dimensions remain unexplored — invite the student to keep going.
- Warm, pastoral tone. This should feel like a wise teacher summarizing what you've uncovered together.`,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";
      setRecapText(response);
    } catch (err) {
      console.error("Recap failed:", err);
      toast.error("Recap failed — try again.");
    }
    setRecapLoading(false);
  }, [layers, parsedRef, verseText, verseRef]);

  // Save study to localStorage
  const handleSave = () => {
    if (!verseRef || layers.length === 0) return;
    const saved = loadSavedStudies();
    saved.push({ ref: verseRef, layers, timestamp: Date.now() });
    const trimmed = saved.slice(-20);
    localStorage.setItem(SAVE_KEY, JSON.stringify(trimmed));
    toast.success(`Study on ${verseRef} saved! (${layers.length} layers)`);
  };

  // Export full study as formatted text
  const handleExport = () => {
    if (!verseRef || layers.length === 0) return;
    const lines = [
      `ULTIMATE STUDY EXPERIENCE (U.S.E)`,
      `Study: ${verseRef}`,
      verseText ? `"${verseText}"` : "",
      `Layers: ${layers.length}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      "─".repeat(40),
      "",
    ];
    layers.forEach((l, i) => {
      lines.push(`[${i + 1}] ${l.roomName}: ${l.principleName}`);
      if (l.userAttempt) {
        lines.push(`\nYour Connection:\n${l.userAttempt}`);
      }
      lines.push(`\n${l.analysis}`);
      lines.push("");
      lines.push("─".repeat(40));
      lines.push("");
    });
    if (recapText) {
      lines.push("RECAP");
      lines.push(recapText);
      lines.push("");
    }
    lines.push("— Generated with Phototheology Palace");
    const text = lines.filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Full study exported to clipboard!");
  };

  const suggestedPrinciple = mode === "user-led" ? suggestedRoom?.principleId ?? null : null;
  const suggestedRoomData = suggestedRoom ? ROOM_SUB_PRINCIPLES[suggestedRoom.roomId] : null;
  const suggestedPrincipleData = suggestedRoomData?.subPrinciples.find(
    (p) => p.id === suggestedRoom?.principleId
  );

  // Build share description from layers
  const shareDescription = layers.length > 0
    ? `${layers.length} layers of analysis using: ${[...new Set(layers.map((l) => l.roomName))].join(", ")}`
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-background/90 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Navigation />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Ultimate Study Experience <span className="text-primary/60 font-normal">(U.S.E)</span>
          </h1>
          <p className="text-lg text-primary/80 font-medium mb-2">
            One Verse. Endless Combinations.
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {mode === "user-led"
              ? "Select a verse. Choose a room. Watch understanding unfold."
              : "Enter a verse or theme. Jeeves will choose the lens."}
          </p>

          {/* Mode toggle */}
          <div className="inline-flex rounded-lg bg-muted/50 p-1 border border-border/50">
            <button
              onClick={() => handleModeSwitch("jeeves-led")}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "jeeves-led"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Jeeves-led
            </button>
            <button
              onClick={() => handleModeSwitch("teach")}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "teach"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              🎓 Teach
            </button>
            <button
              onClick={() => handleModeSwitch("user-led")}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "user-led"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              User-led
            </button>
          </div>
          {mode === "teach" && (
            <p className="text-xs text-amber-400/80 mt-2 max-w-md mx-auto">
              Jeeves teaches each principle, shows you how to spot connections and think like a Phototheologian, then applies it to your text.
            </p>
          )}
        </motion.div>

        {/* Main layout */}
        <div className={cn("grid grid-cols-1 gap-6", mode === "user-led" && !isBasic && "md:grid-cols-[1fr_340px]")}>
          {/* Left column: Verse + Analysis */}
          <div className="space-y-6 min-w-0">
            <VersePanel
              verseRef={verseRef}
              parsedRef={parsedRef}
              verseText={verseText}
              onStudy={handleStudyVerse}
              loading={verseLookupLoading}
            />

            {/* User-led input */}
            {mode === "user-led" && parsedRef && (
              <div className="space-y-3">
                {/* Teach Me toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setUserLedTeach(!userLedTeach)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      userLedTeach
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400"
                        : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    🎓 Teach Me
                  </button>
                  {userLedTeach && (
                    <p className="text-[10px] text-amber-400/70">
                      Jeeves will guide you — not give answers. Think it through!
                    </p>
                  )}
                </div>

                {suggestedRoomData && suggestedPrincipleData && (
                  <UserLedInput
                    roomName={suggestedRoomData.roomName}
                    principleName={suggestedPrincipleData.name}
                    principleId={suggestedPrincipleData.id}
                    principleDescription={suggestedPrincipleData.description}
                    userInput={userInput}
                    onChange={setUserInput}
                    onSubmit={handleUserLedSubmit}
                    loading={loadingPrinciple !== null}
                    teachMe={userLedTeach}
                  />
                )}
              </div>
            )}

            {/* Jeeves-led: loading spinner */}
            {(mode === "jeeves-led" || mode === "teach") && loadingPrinciple && !pendingLayer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-primary/20 bg-card/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <div>
                    <p className="text-sm text-primary font-medium">Jeeves is selecting a principle…</p>
                    <p className="text-xs text-muted-foreground mt-1">Analyzing your text with a fresh lens</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pending layer for accept/reject */}
            {pendingLayer && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-card/60 to-card/40 backdrop-blur-xl overflow-hidden shadow-[0_0_30px_-8px_rgba(251,191,36,0.3)]">
                <div className="px-5 py-3 border-b border-amber-500/20 bg-amber-500/5 flex items-center gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">🎯 Applied to {verseRef}</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400">Review</span>
                </div>
                <div className="p-5 max-h-[400px] overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{pendingLayer.analysis}</p>
                </div>
                <div className="px-5 py-3 border-t border-amber-500/20 bg-amber-500/5 flex items-center gap-3 flex-wrap">
                  <Button size="sm" onClick={handleAcceptPending} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Check className="w-4 h-4" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRejectPending} className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <X className="w-4 h-4" /> Reject
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setPendingLayer(null); handleContinueBuilding(); }} className="gap-1.5 text-muted-foreground hover:text-foreground ml-auto">
                    <RefreshCw className="w-4 h-4" /> Try Different Lens
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Save + Share bar */}
            {layers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
                  <Save className="w-4 h-4" />
                  Save Study
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRecap}
                  disabled={recapLoading || layers.length < 2}
                  className="gap-1.5"
                >
                  {recapLoading ? (
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  Recap
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                  <ClipboardCopy className="w-4 h-4" />
                  Export Study
                </Button>
                <TextShareButton
                  type="study"
                  title={`Study Experience: ${verseRef}`}
                  description={shareDescription}
                  variant="outline"
                  size="sm"
                />
              </motion.div>
            )}

            {/* Recap Output */}
            {recapText && !recapLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card/60 to-card/40 backdrop-blur-xl shadow-[0_0_30px_-8px_hsl(var(--primary)/0.2)]"
              >
                <div className="px-5 py-3 border-b border-primary/20 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Study Recap</span>
                  <span className="text-xs text-muted-foreground ml-auto">{layers.length} layers</span>
                </div>
                <div className="p-5">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{recapText}</p>
                </div>
              </motion.div>
            )}

            {recapLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-primary/20 bg-card/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-primary font-medium">Jeeves is preparing your recap…</p>
                </div>
              </motion.div>
            )}

            {/* Sparks */}
            {sparks.length > 0 && (
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Sparks</span>
                </div>
                <SparkContainer
                  sparks={sparks}
                  onOpen={openSpark}
                  onSave={saveSpark}
                  onDismiss={dismissSpark}
                  onExplore={exploreSpark}
                  position="inline"
                />
              </div>
            )}

            {/* Analysis stack */}
            {layers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Analysis Layers ({layers.length})
                </h3>
                {layers.map((layer, i) => (
                  <AnalysisCard
                    key={`${layer.principleId}-${i}`}
                    layer={layer}
                    index={i}
                    totalLayers={layers.length}
                    verseRef={verseRef}
                    verseText={verseText}
                    onRemove={handleRemoveLayer}
                    onAccept={handleAcceptLayer}
                    onRebuild={handleRebuildLayer}
                    onCompound={handleCompound}
                    compounding={compounding}
                    onSaveLayer={handleSaveLayer}
                    onContinueBuilding={(mode === "jeeves-led" || mode === "teach") && !abChoice ? handleContinueBuilding : undefined}
                    showAbChoice={(mode === "jeeves-led" || mode === "teach") && !!abChoice && !pendingLayer && !loadingPrinciple && layer.accepted && i === layers.length - 1}
                    onAbSelect={handleAbSelect}
                  />
                ))}
              </div>
            )}

            {/* Synthesized Output */}
            {synthesizing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-primary/40 bg-card/30 backdrop-blur-xl p-6 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] ring-1 ring-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-primary font-medium">Jeeves is synthesizing your study layers…</p>
                </div>
              </motion.div>
            )}

            {synthesizedOutput && !synthesizing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card/40 to-violet-500/5 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_-8px_hsl(var(--primary)/0.35)] ring-1 ring-primary/20"
              >
                <div className="px-5 py-3 border-b border-primary/20 bg-primary/5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">Unified Study — {verseRef}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {layers.filter(l => l.accepted).length} layers combined
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{synthesizedOutput}</p>
                </div>
                <div className="px-5 py-3 border-t border-primary/20 bg-primary/5 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                    onClick={() => {
                      const saved = loadSavedStudies();
                      saved.push({ ref: verseRef, layers: [{ roomId: "synthesis", roomName: "Unified Study", principleId: "synthesis", principleName: "Combined Analysis", analysis: synthesizedOutput!, accepted: true }], timestamp: Date.now() });
                      localStorage.setItem(SAVE_KEY, JSON.stringify(saved.slice(-50)));
                      toast.success("Unified study saved!");
                    }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Unified Study
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column: ALL rooms by floor */}
          {!isBasic && mode === "user-led" && (
          <div className="order-first md:order-last">
            {/* Mobile: horizontal scroll of floor groups */}
            <div className="md:hidden space-y-3">
              {allFloors.map((fg) => (
                <FloorSection
                  key={fg.floor}
                  fg={fg}
                  expandedFloor={expandedFloor}
                  setExpandedFloor={setExpandedFloor}
                  expandedRoom={expandedRoom}
                  setExpandedRoom={setExpandedRoom}
                  usedPrinciples={usedPrinciples}
                  usedRoomIds={usedRoomIds}
                  loadingPrinciple={loadingPrinciple}
                  suggestedPrinciple={suggestedPrinciple}
                  disabled={!parsedRef}
                  onPrincipleClick={handlePrincipleClick}
                  onSingleRoomClick={handleSingleRoomClick}
                />
              ))}
            </div>

            {/* Desktop: vertical stack */}
            <div className="hidden md:flex flex-col gap-2 pr-1">
              {allFloors.map((fg) => (
                <FloorSection
                  key={fg.floor}
                  fg={fg}
                  expandedFloor={expandedFloor}
                  setExpandedFloor={setExpandedFloor}
                  expandedRoom={expandedRoom}
                  setExpandedRoom={setExpandedRoom}
                  usedPrinciples={usedPrinciples}
                  usedRoomIds={usedRoomIds}
                  loadingPrinciple={loadingPrinciple}
                  suggestedPrinciple={suggestedPrinciple}
                  disabled={!parsedRef}
                  onPrincipleClick={handlePrincipleClick}
                  onSingleRoomClick={handleSingleRoomClick}
                />
              ))}
            </div>
          </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Floor section component — collapsible floor header with rooms inside
function FloorSection({
  fg,
  expandedFloor,
  setExpandedFloor,
  expandedRoom,
  setExpandedRoom,
  usedPrinciples,
  usedRoomIds,
  loadingPrinciple,
  suggestedPrinciple,
  disabled,
  onPrincipleClick,
  onSingleRoomClick,
}: {
  fg: FloorGroup;
  expandedFloor: number | null;
  setExpandedFloor: (f: number | null) => void;
  expandedRoom: string | null;
  setExpandedRoom: (r: string | null) => void;
  usedPrinciples: Set<string>;
  usedRoomIds: Set<string>;
  loadingPrinciple: string | null;
  suggestedPrinciple: string | null;
  disabled: boolean;
  onPrincipleClick: (roomId: string, p: SubPrinciple) => void;
  onSingleRoomClick: (roomId: string, roomName: string) => void;
}) {
  const isOpen = expandedFloor === fg.floor;
  const roomsUsed = fg.rooms.filter((r) => usedRoomIds.has(r.id)).length;

  const floorColors: Record<number, { bg: string; border: string; text: string; badge: string }> = {
    1: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500/20" },
    2: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/20" },
    3: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/20" },
    4: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20" },
    5: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", badge: "bg-rose-500/20" },
    6: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", badge: "bg-cyan-500/20" },
    7: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20" },
    8: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-500/20" },
  };
  const colors = floorColors[fg.floor] || floorColors[1];

  return (
    <div className={cn("rounded-lg border", colors.border, colors.bg)}>
      <button
        onClick={() => setExpandedFloor(isOpen ? null : fg.floor)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold w-5", colors.text)}>F{fg.floor}</span>
          <span className="text-sm font-medium">{fg.name}</span>
          {roomsUsed > 0 && (
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full text-green-400", colors.badge)}>
              {roomsUsed}/{fg.rooms.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className={cn("w-3.5 h-3.5", colors.text)} />
        ) : (
          <ChevronRight className={cn("w-3.5 h-3.5", colors.text)} />
        )}
      </button>

      {isOpen && (
        <div className="px-2 pb-2 space-y-2 overflow-y-auto min-h-0">
          {fg.rooms.map(({ id, name, room }) =>
            room ? (
              <RoomBox
                key={id}
                room={room}
                floor={fg.floor}
                expanded={expandedRoom === id}
                onToggle={() => setExpandedRoom(expandedRoom === id ? null : id)}
                onPrincipleClick={(p) => onPrincipleClick(id, p)}
                usedPrinciples={usedPrinciples}
                loadingPrinciple={loadingPrinciple}
                suggestedPrinciple={suggestedPrinciple}
                disabled={disabled}
              />
            ) : (
              <SingleRoomButton
                key={id}
                roomId={id}
                roomName={name}
                isUsed={usedRoomIds.has(id)}
                isLoading={loadingPrinciple === `${id}-main`}
                disabled={disabled}
                onClick={() => onSingleRoomClick(id, name)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// Simple clickable button for rooms without sub-principles
function SingleRoomButton({
  roomId,
  roomName,
  isUsed,
  isLoading,
  disabled,
  onClick,
}: {
  roomId: string;
  roomName: string;
  isUsed: boolean;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all",
        isUsed
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-blue-500/30 bg-card/60 hover:border-blue-400/50 text-muted-foreground hover:text-foreground",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <span className="flex-1 font-medium">{roomName}</span>
      {isUsed && <span className="text-green-400 text-xs">✓</span>}
      {isLoading && (
        <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      )}
    </button>
  );
}
