import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { VersePanel } from "@/components/study-experience/VersePanel";
import { RoomBox } from "@/components/study-experience/RoomBox";
import { AnalysisCard, type StudyLayer } from "@/components/study-experience/AnalysisCard";
import { UserLedInput } from "@/components/study-experience/UserLedInput";
import { ROOM_SUB_PRINCIPLES } from "@/components/mind-map/data/roomSubPrinciples";
import type { SubPrinciple } from "@/components/mind-map/data/roomSubPrinciples";
import { callJeeves } from "@/lib/jeevesClient";
import { cn } from "@/lib/utils";

// The 6 showcase rooms in display order
const SHOWCASE_ROOMS = [
  { id: "dr", floor: 4 },
  { id: "c6", floor: 4 },
  { id: "tz", floor: 4 },
  { id: "cr", floor: 4 },
  { id: "bl", floor: 5 },
  { id: "cec", floor: 5 },
] as const;

type Mode = "jeeves-led" | "user-led";

function getJeevesResponse(data: unknown): string {
  if (typeof data === "string") return data;
  if (
    data &&
    typeof data === "object" &&
    "response" in data &&
    typeof data.response === "string"
  ) {
    return data.response;
  }

  return "";
}

function parseVerseRef(ref: string): { book: string; chapter: string; verse: string } | null {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+.*)$/);
  if (!m) return null;
  return { book: m[1], chapter: m[2], verse: m[3] };
}

export default function StudyExperience() {
  const [verseRef, setVerseRef] = useState("");
  const [parsedRef, setParsedRef] = useState<{ book: string; chapter: string; verse: string } | null>(null);
  const [verseText, setVerseText] = useState("");
  const [mode, setMode] = useState<Mode>("jeeves-led");
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [layers, setLayers] = useState<StudyLayer[]>([]);
  const [loadingPrinciple, setLoadingPrinciple] = useState<string | null>(null);
  const [verseLookupLoading, setVerseLookupLoading] = useState(false);

  // User-led state
  const [suggestedRoom, setSuggestedRoom] = useState<{ roomId: string; principleId: string } | null>(null);
  const [userInput, setUserInput] = useState("");

  const usedPrinciples = new Set(layers.map((l) => l.principleId));

  const handleStudyVerse = useCallback(async (ref: string) => {
    const parsed = parseVerseRef(ref);
    if (!parsed) return;

    setVerseRef(ref);
    setParsedRef(parsed);
    setVerseText("");
    setLayers([]);
    setSuggestedRoom(null);
    setUserInput("");
    setExpandedRoom(null);

    // Fetch verse text from database
    try {
      setVerseLookupLoading(true);
      const { data: verseData } = await supabase
        .from("bible_verses_tokenized")
        .select("text_kjv")
        .ilike("book", parsed.book)
        .eq("chapter", parseInt(parsed.chapter))
        .eq("verse_num", parseInt(parsed.verse.split("-")[0]))
        .maybeSingle();

      if (verseData?.text_kjv) {
        setVerseText(verseData.text_kjv);
      }
    } catch (err) {
      console.error("Failed to fetch verse text:", err);
    } finally {
      setVerseLookupLoading(false);
    }

    // If user-led, immediately fetch cross-room suggestion
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

      const response = getJeevesResponse(data);
      if (!response) {
        setVerseLookupLoading(false);
        return;
      }

      // Try to parse JSON array from response
      try {
        const suggestions = JSON.parse(response);
        if (Array.isArray(suggestions)) {
          // Find first suggestion that matches one of our showcase rooms
          const showcaseIds = SHOWCASE_ROOMS.map((r) => r.id);
          for (const s of suggestions) {
            const roomId = s.roomId || s.room_id || s.room;
            if (roomId && showcaseIds.includes(roomId)) {
              const room = ROOM_SUB_PRINCIPLES[roomId];
              if (room) {
                const principleId = s.principleId || s.principle_id || room.subPrinciples[0]?.id;
                const matchedPrinciple = room.subPrinciples.find(
                  (p) => p.id === principleId || p.shortName?.toLowerCase() === (s.principle || "").toLowerCase()
                );
                setSuggestedRoom({
                  roomId,
                  principleId: matchedPrinciple?.id || room.subPrinciples[0]?.id,
                });
                setExpandedRoom(roomId);
                setVerseLookupLoading(false);
                return;
              }
            }
          }
        }
      } catch {
        // Not JSON — just pick a default suggestion
      }

      // Fallback: suggest Dimensions Room, Christological
      setSuggestedRoom({ roomId: "dr", principleId: "dr-christ" });
      setExpandedRoom("dr");
    } catch {
      setSuggestedRoom({ roomId: "dr", principleId: "dr-christ" });
      setExpandedRoom("dr");
    }
    setVerseLookupLoading(false);
  };

  const handleRemoveLayer = useCallback((principleId: string) => {
    setLayers((prev) => prev.filter((l) => l.principleId !== principleId));
  }, []);

  const handlePrincipleClick = useCallback(async (roomId: string, principle: SubPrinciple) => {
    if (!parsedRef || loadingPrinciple) return;

    const room = ROOM_SUB_PRINCIPLES[roomId];
    if (!room) return;

    // If principle already used, remove its layer (toggle off)
    if (usedPrinciples.has(principle.id)) {
      handleRemoveLayer(principle.id);
      return;
    }

    if (mode === "user-led") {
      // In user-led mode, clicking a principle triggers Jeeves analysis too
      // (same as jeeves-led behavior)
    }

    // Jeeves-led: call principle-amplification
    setLoadingPrinciple(principle.id);
    try {
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: `${room.roomName} (${roomId.toUpperCase()}): ${principle.name} - ${principle.description}`,
      }, "study-experience");

      const response = getJeevesResponse(data);

      // Extract verse text from first response if we don't have it
      if (!verseText && response) {
        const vMatch = response.match(/[""]([^""]+)[""]/);
        if (vMatch) setVerseText(vMatch[1]);
      }

      setLayers((prev) => [
        ...prev,
        {
          roomId,
          roomName: room.roomName,
          principleId: principle.id,
          principleName: principle.name,
          analysis: response,
        },
      ]);
    } catch (err) {
      console.error("Jeeves principle-amplification failed:", err);
    }
    setLoadingPrinciple(null);
  }, [parsedRef, loadingPrinciple, mode, verseText]);

  const handleUserLedSubmit = useCallback(async () => {
    if (!parsedRef || !suggestedRoom || !userInput.trim()) return;

    const room = ROOM_SUB_PRINCIPLES[suggestedRoom.roomId];
    const principle = room?.subPrinciples.find((p) => p.id === suggestedRoom.principleId);
    if (!room || !principle) return;

    setLoadingPrinciple(principle.id);
    try {
      const { data } = await callJeeves({
        mode: "principle-amplification",
        book: parsedRef.book,
        chapter: parsedRef.chapter,
        verse: parsedRef.verse,
        verseText: verseText,
        principle: `${room.roomName} (${suggestedRoom.roomId.toUpperCase()}): ${principle.name} - ${principle.description}`,
        message: `The student's connection: "${userInput}". Evaluate their insight (what they got right, what they missed), then provide the full analysis.`,
      }, "study-experience");

      const response = getJeevesResponse(data);

      // Try to split evaluation from full analysis
      const evalSplit = response.split(/(?:full analysis|here'?s? (?:the )?(?:full|complete) (?:analysis|breakdown))/i);
      const evaluation = evalSplit.length > 1 ? evalSplit[0].trim() : undefined;
      const analysis = evalSplit.length > 1 ? evalSplit[1].trim() : response;

      if (!verseText && response) {
        const vMatch = response.match(/[""]([^""]+)[""]/);
        if (vMatch) setVerseText(vMatch[1]);
      }

      setLayers((prev) => [
        ...prev,
        {
          roomId: suggestedRoom.roomId,
          roomName: room.roomName,
          principleId: principle.id,
          principleName: principle.name,
          analysis,
          userAttempt: userInput,
          jeevesEvaluation: evaluation,
        },
      ]);

      setUserInput("");
      setSuggestedRoom(null);

      // Fetch next suggestion
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

  const suggestedPrinciple = mode === "user-led" ? suggestedRoom?.principleId ?? null : null;
  const suggestedRoomData = suggestedRoom ? ROOM_SUB_PRINCIPLES[suggestedRoom.roomId] : null;
  const suggestedPrincipleData = suggestedRoomData?.subPrinciples.find(
    (p) => p.id === suggestedRoom?.principleId
  );

  const innerContent = (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-14">
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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
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

            {/* Analysis stack */}
            {layers.length > 0 && (
              <div className="space-y-4 p-4 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-xl shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] ring-1 ring-white/5">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Analysis Layers ({layers.length})
                </h3>
                {layers.map((layer, i) => (
                  <AnalysisCard
                    key={`${layer.principleId}-${i}`}
                    layer={layer}
                    index={i}
                    onRemove={handleRemoveLayer}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column: Room boxes */}
          <div className="order-first md:order-last">
            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {SHOWCASE_ROOMS.map(({ id, floor }) => {
                const room = ROOM_SUB_PRINCIPLES[id];
                if (!room) return null;
                return (
                  <div key={id} className="min-w-[260px] flex-shrink-0">
                    <RoomBox
                      room={room}
                      floor={floor}
                      expanded={expandedRoom === id}
                      onToggle={() => setExpandedRoom(expandedRoom === id ? null : id)}
                      onPrincipleClick={(p) => handlePrincipleClick(id, p)}
                      usedPrinciples={usedPrinciples}
                      loadingPrinciple={loadingPrinciple}
                      suggestedPrinciple={suggestedPrinciple}
                      disabled={!parsedRef}
                    />
                  </div>
                );
              })}
            </div>

            {/* Desktop: vertical stack */}
            <div className="hidden md:flex flex-col gap-3 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
              {SHOWCASE_ROOMS.map(({ id, floor }) => {
                const room = ROOM_SUB_PRINCIPLES[id];
                if (!room) return null;
                return (
                  <RoomBox
                    key={id}
                    room={room}
                    floor={floor}
                    expanded={expandedRoom === id}
                    onToggle={() => setExpandedRoom(expandedRoom === id ? null : id)}
                    onPrincipleClick={(p) => handlePrincipleClick(id, p)}
                    usedPrinciples={usedPrinciples}
                    loadingPrinciple={loadingPrinciple}
                    suggestedPrinciple={suggestedPrinciple}
                    disabled={!parsedRef}
                  />
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-background/90 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <Navigation />
      <div className="relative z-10">{innerContent}</div>
      <Footer />
    </div>
  );
}

