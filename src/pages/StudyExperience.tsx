import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, Share2, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
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

function buildAllRooms(): FloorGroup[] {
  return palaceFloors.map((f) => ({
    floor: f.number,
    name: f.name,
    rooms: f.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      room: ROOM_SUB_PRINCIPLES[r.id] || null,
    })),
  }));
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

type Mode = "jeeves-led" | "user-led";

function parseVerseRef(ref: string): { book: string; chapter: string; verse: string } | null {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+.*)$/);
  if (!m) return null;
  return { book: m[1], chapter: m[2], verse: m[3] };
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

  // User-led state
  const [suggestedRoom, setSuggestedRoom] = useState<{ roomId: string; principleId: string } | null>(null);
  const [userInput, setUserInput] = useState("");

  // All rooms organized by floor
  const allFloors = useMemo(() => buildAllRooms(), []);

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
    if (!parsed) return;

    setVerseRef(ref);
    setParsedRef(parsed);
    setVerseText("");
    setLayers([]);
    setSynthesizedOutput(null);
    setSuggestedRoom(null);
    setUserInput("");
    setExpandedRoom(null);
    setExpandedFloor(4); // Default open Floor 4

    if (mode === "user-led") {
      fetchCrossRoomSuggestion(parsed, ref);
    }
  }, [mode]);

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
      toast.success("Layer accepted! Add more layers and Build to synthesize.");
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

  // Deep, profound Jeeves prompt for Jeeves-led mode
  const buildDeepPrompt = (roomName: string, roomId: string, principleName: string, description: string) => {
    return `${roomName} (${roomId.toUpperCase()}): ${principleName} - ${description}

IMPORTANT INSTRUCTIONS FOR DEPTH:
- Provide a DEEP, PROFOUND, and THOROUGH analysis — not surface-level.
- Begin with the verse text if not already provided.
- Show how this principle SPECIFICALLY illuminates this verse in ways the reader may never have considered.
- Include at minimum: (1) The direct application of this principle, (2) A cross-reference to at least one other Scripture that deepens the insight, (3) A practical or devotional takeaway that makes this personal.
- Use the Phototheology study method language naturally.
- End with a "Spark" — one sentence of surprising, memorable insight that the reader will carry with them. Format it as: ✨ Spark: [your insight]`;
  };

  const handlePrincipleClick = useCallback(async (roomId: string, principle: SubPrinciple) => {
    if (!parsedRef || loadingPrinciple) return;

    // If principle already used, remove its layer (toggle off)
    if (usedPrinciples.has(principle.id)) {
      handleRemoveLayer(principle.id);
      return;
    }

    if (mode === "user-led") return;

    // Look up room name from either sub-principles or palace data
    const subRoom = ROOM_SUB_PRINCIPLES[roomId];
    const palaceRoom = palaceFloors.flatMap((f) => f.rooms).find((r) => r.id === roomId);
    const roomName = subRoom?.roomName || palaceRoom?.name || roomId;

    setLoadingPrinciple(principle.id);
    try {
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: buildDeepPrompt(roomName, roomId, principle.name, principle.description),
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
  }, [parsedRef, loadingPrinciple, mode, verseText, usedPrinciples, handleRemoveLayer]);

  // Handle click on a room that has NO sub-principles (single-principle room)
  const handleSingleRoomClick = useCallback(async (roomId: string, roomName: string) => {
    if (!parsedRef || loadingPrinciple) return;

    const syntheticId = `${roomId}-main`;

    if (usedPrinciples.has(syntheticId)) {
      handleRemoveLayer(syntheticId);
      return;
    }

    if (mode === "user-led") return;

    const palaceRoom = palaceFloors.flatMap((f) => f.rooms).find((r) => r.id === roomId);
    const purpose = palaceRoom?.purpose || `Apply the ${roomName} lens`;
    const coreQuestion = palaceRoom?.coreQuestion || "";

    setLoadingPrinciple(syntheticId);
    try {
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: buildDeepPrompt(roomName, roomId, roomName, `${purpose}${coreQuestion ? ` Core question: ${coreQuestion}` : ""}`),
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
  }, [parsedRef, loadingPrinciple, mode, verseText, usedPrinciples, handleRemoveLayer]);

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
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: `${roomName} (${suggestedRoom.roomId.toUpperCase()}): ${principleName}`,
        message: `The student's connection: "${userInput}". Evaluate their insight thoroughly — what they got right, what they missed, and what deeper layers they could explore. Then provide the full analysis with a ✨ Spark at the end.`,
      }, "study-experience");

      const response = typeof data === "string" ? data : (data as any)?.response || "";

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
    } catch (err) {
      console.error("Jeeves user-led evaluation failed:", err);
    }
    setLoadingPrinciple(null);
  }, [parsedRef, suggestedRoom, userInput, verseText, verseRef]);

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setSuggestedRoom(null);
    setUserInput("");
    if (newMode === "user-led" && parsedRef) {
      fetchCrossRoomSuggestion(parsedRef, verseRef);
    }
  };

  // Save study to localStorage
  const handleSave = () => {
    if (!verseRef || layers.length === 0) return;
    const saved = loadSavedStudies();
    saved.push({ ref: verseRef, layers, timestamp: Date.now() });
    const trimmed = saved.slice(-20);
    localStorage.setItem(SAVE_KEY, JSON.stringify(trimmed));
    toast.success(`Study on ${verseRef} saved! (${layers.length} layers)`);
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
            Study Experience
          </h1>
          <p className="text-lg text-primary/80 font-medium mb-2">
            One Verse. Endless Combinations.
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Select a verse. Choose a room. Watch understanding unfold.
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
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
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
            {mode === "user-led" && suggestedRoomData && suggestedPrincipleData && parsedRef && (
              <UserLedInput
                roomName={suggestedRoomData.roomName}
                principleName={suggestedPrincipleData.name}
                userInput={userInput}
                onChange={setUserInput}
                onSubmit={handleUserLedSubmit}
                loading={loadingPrinciple !== null}
              />
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
                <TextShareButton
                  type="study"
                  title={`Study Experience: ${verseRef}`}
                  description={shareDescription}
                  variant="outline"
                  size="sm"
                />
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
                    verseRef={verseRef}
                    verseText={verseText}
                    onRemove={handleRemoveLayer}
                    onAccept={handleAcceptLayer}
                    onRebuild={handleRebuildLayer}
                    onSaveLayer={handleSaveLayer}
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
            <div className="hidden md:flex flex-col gap-2 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
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

  return (
    <div className="rounded-lg border border-border/40 bg-card/40 overflow-hidden">
      <button
        onClick={() => setExpandedFloor(isOpen ? null : fg.floor)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary/70 w-5">F{fg.floor}</span>
          <span className="text-sm font-medium">{fg.name}</span>
          {roomsUsed > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
              {roomsUsed}/{fg.rooms.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-2 pb-2 space-y-2">
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
