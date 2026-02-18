import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Swords, Send, Loader2, RotateCcw, ArrowRight, Trophy, ChevronRight, Volume2, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import {
  DEFENSE_OPPONENTS,
  DEFENSE_TOPICS,
  DIFFICULTY_LEVELS,
  type DefenseOpponent,
  type DefenseTopic,
} from "@/data/defenseModeOpponents";

interface DefenseModeProps {
  churchId: string;
}

type Phase = "setup" | "sparring" | "responding" | "coaching" | "review";

interface ChatMessage {
  id: string;
  role: "opponent" | "disciple" | "coach" | "system";
  content: string;
  timestamp: Date;
  score?: number;
}

export function DefenseMode({ churchId }: DefenseModeProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Setup state
  const [selectedOpponent, setSelectedOpponent] = useState<DefenseOpponent | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<DefenseTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");

  // Combat state
  const [phase, setPhase] = useState<Phase>("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Audio state
  const [audioMode, setAudioMode] = useState(false);
  const [autoSpeakId, setAutoSpeakId] = useState<string | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-speak opponent/coach messages when audio mode is on
  useEffect(() => {
    if (!audioMode) return;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;
    if (lastMsg.role !== "opponent" && lastMsg.role !== "coach") return;
    // Only auto-speak new messages we haven't spoken yet
    if (lastMsg.id === autoSpeakId) return;
    setAutoSpeakId(lastMsg.id);
    // Trigger cloud TTS via the text-to-speech edge function
    autoSpeak(lastMsg.content);
  }, [messages, audioMode]);

  const autoSpeak = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "onyx", returnType: "url" },
      });
      if (error || !data) {
        // Fallback to browser TTS
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          speechSynthesis.speak(utterance);
        }
        return;
      }
      const audioSrc = data.audioUrl
        ? await fetch(data.audioUrl).then((r) => r.ok ? URL.createObjectURL(r.blob()) : data.audioUrl).catch(() => data.audioUrl)
        : `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioSrc as string);
      audio.volume = 0.9;
      await audio.play().catch(() => {
        // Autoplay blocked — fallback to browser TTS
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          speechSynthesis.speak(utterance);
        }
      });
    } catch {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
      }
    }
  }, []);

  const addMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
    ]);
  };

  const buildConversationHistory = () => {
    return messages
      .filter((m) => m.role !== "system")
      .map((m) => {
        const label =
          m.role === "opponent"
            ? `[${selectedOpponent?.name}]`
            : m.role === "disciple"
            ? "[Disciple]"
            : "[Coach Jeeves]";
        return `${label}: ${m.content}`;
      })
      .join("\n\n");
  };

  const startSparring = async () => {
    if (!selectedOpponent || !selectedTopic) return;

    setPhase("sparring");
    setIsLoading(true);
    setRoundCount(1);

    addMessage({
      role: "system",
      content: `Round 1 — ${selectedOpponent.name} vs. You on "${selectedTopic.name}" (${selectedDifficulty})`,
    });

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-sparring",
          opponent: selectedOpponent.id,
          defenseTopicId: selectedTopic.id,
          defenseTopicName: selectedTopic.name,
          difficulty: selectedDifficulty,
          opponentWorldview: selectedOpponent.worldview,
          opponentStyle: selectedOpponent.argumentStyle,
          opponentTargets: selectedOpponent.attackTargets,
          opponentEndPrompt: selectedOpponent.endPrompt,
          opponentSteelmanRules: selectedOpponent.steelmanRules,
          isSignatureTopic: !!selectedTopic.isSignature,
          phase: "opening",
        },
      });

      if (error) throw error;

      addMessage({
        role: "opponent",
        content: data.content || "The opponent could not formulate an argument.",
      });
      setPhase("responding");
    } catch (err) {
      console.error("Sparring error:", err);
      addMessage({
        role: "system",
        content: "Failed to start sparring. Please try again.",
      });
      setPhase("setup");
    } finally {
      setIsLoading(false);
    }
  };

  const submitDefense = () => {
    if (userInput.trim().length < 50) return;

    addMessage({ role: "disciple", content: userInput.trim() });
    setUserInput("");
    setPhase("sparring"); // Waiting state before coaching
  };

  const requestCoaching = async () => {
    setPhase("coaching");
    setIsLoading(true);

    const opponentAttack =
      messages
        .filter((m) => m.role === "opponent")
        .pop()?.content || "";
    const discipleResponse =
      messages
        .filter((m) => m.role === "disciple")
        .pop()?.content || "";

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-coach",
          defenseTopicName: selectedTopic?.name,
          opponentAttack,
          discipleResponse,
        },
      });

      if (error) throw error;

      const score = data.score || 0;
      setLastScore(score);

      addMessage({
        role: "coach",
        content: data.content || "Coaching unavailable.",
        score,
      });
      setPhase("review");
    } catch (err) {
      console.error("Coaching error:", err);
      addMessage({
        role: "system",
        content: "Coaching request failed. Please try again.",
      });
      setPhase("responding");
    } finally {
      setIsLoading(false);
    }
  };

  const continueSparring = async () => {
    if (!selectedOpponent || !selectedTopic) return;

    const nextRound = roundCount + 1;
    setRoundCount(nextRound);
    setPhase("sparring");
    setIsLoading(true);

    addMessage({
      role: "system",
      content: `Round ${nextRound} — ${selectedOpponent.name} presses deeper...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-sparring",
          opponent: selectedOpponent.id,
          defenseTopicId: selectedTopic.id,
          defenseTopicName: selectedTopic.name,
          difficulty: selectedDifficulty,
          opponentWorldview: selectedOpponent.worldview,
          opponentStyle: selectedOpponent.argumentStyle,
          opponentTargets: selectedOpponent.attackTargets,
          opponentEndPrompt: selectedOpponent.endPrompt,
          opponentSteelmanRules: selectedOpponent.steelmanRules,
          isSignatureTopic: !!selectedTopic?.isSignature,
          phase: "follow-up",
          conversationHistory: buildConversationHistory(),
        },
      });

      if (error) throw error;

      addMessage({
        role: "opponent",
        content: data.content || "The opponent could not continue.",
      });
      setPhase("responding");
    } catch (err) {
      console.error("Follow-up sparring error:", err);
      addMessage({
        role: "system",
        content: "Failed to continue sparring. Please try again.",
      });
      setPhase("review");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMatch = () => {
    // Stop any playing audio
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setPhase("setup");
    setMessages([]);
    setSelectedOpponent(null);
    setSelectedTopic(null);
    setSelectedDifficulty("intermediate");
    setUserInput("");
    setRoundCount(0);
    setLastScore(null);
    setAutoSpeakId(null);
  };

  // Handle voice transcript — append to current input
  const handleVoiceTranscript = useCallback((text: string) => {
    setUserInput((prev) => {
      const separator = prev.trim() ? " " : "";
      return prev + separator + text;
    });
  }, []);

  // Check if the last disciple message is long enough for coaching
  const lastDiscipleMsg = messages.filter((m) => m.role === "disciple").pop();
  const canRequestCoaching =
    phase === "sparring" &&
    !isLoading &&
    lastDiscipleMsg &&
    lastDiscipleMsg.content.length >= 50 &&
    messages[messages.length - 1]?.role === "disciple";

  // ─── SETUP SCREEN ────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-7 w-7 text-red-500" />
            <h2 className="text-2xl font-bold">Defense Mode</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Theological Combat Simulator — Train to defend the faith against
            real-world challengers. Select your opponent, topic, and difficulty.
          </p>
        </div>

        {/* Opponent Grid */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Choose Your Opponent
          </h3>
          <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-4"} gap-3`}>
            {DEFENSE_OPPONENTS.map((opp) => (
              <motion.div
                key={opp.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  variant="glass"
                  className={`cursor-pointer transition-all ${opp.color} border-2 ${
                    selectedOpponent?.id === opp.id
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedOpponent(opp)}
                >
                  <CardContent className="p-3 text-center space-y-1">
                    <div className="text-3xl">{opp.emoji}</div>
                    <p className="font-semibold text-sm">{opp.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {opp.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Topic Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Select Topic
          </h3>
          {/* Core SDA Topics */}
          <div className="flex flex-wrap gap-2">
            {DEFENSE_TOPICS.filter((t) => !t.isSignature).map((topic) => (
              <Badge
                key={topic.id}
                variant={selectedTopic?.id === topic.id ? "default" : "outline"}
                className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                  selectedTopic?.id === topic.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.name}
              </Badge>
            ))}
          </div>
          {/* Signature Topics (shown when opponent is selected) */}
          {selectedOpponent && (() => {
            const sigTopics = DEFENSE_TOPICS.filter(
              (t) => t.isSignature && selectedOpponent.signatureTopics.includes(t.id)
            );
            if (sigTopics.length === 0) return null;
            return (
              <div>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">
                  {selectedOpponent.name}'s Home Turf
                </p>
                <div className="flex flex-wrap gap-2">
                  {sigTopics.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant={selectedTopic?.id === topic.id ? "default" : "outline"}
                      className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                        selectedTopic?.id === topic.id
                          ? "bg-orange-600 text-white shadow border-orange-600"
                          : "border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                      }`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })()}
          {selectedTopic && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedTopic.description}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Difficulty
          </h3>
          <div className="flex gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <Button
                key={level.id}
                variant={selectedDifficulty === level.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(level.id)}
                className="flex-1"
              >
                {level.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {DIFFICULTY_LEVELS.find((l) => l.id === selectedDifficulty)?.description}
          </p>
        </div>

        {/* Audio Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-black/5">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Voice Mode</p>
              <p className="text-xs text-muted-foreground">AI speaks aloud, respond with your mic</p>
            </div>
          </div>
          <Button
            variant={audioMode ? "default" : "outline"}
            size="sm"
            onClick={() => setAudioMode(!audioMode)}
            className={audioMode ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            {audioMode ? (
              <><Mic className="h-4 w-4 mr-1" /> On</>
            ) : (
              "Off"
            )}
          </Button>
        </div>

        {/* Begin Button */}
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
          disabled={!selectedOpponent || !selectedTopic}
          onClick={startSparring}
        >
          <Swords className="h-5 w-5 mr-2" />
          Begin Sparring
        </Button>
      </div>
    );
  }

  // ─── SPARRING ARENA ──────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Opponent Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedOpponent?.emoji}</span>
          <div>
            <p className="font-semibold text-sm">{selectedOpponent?.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedTopic?.name} · Round {roundCount}
            </p>
          </div>
          <Badge variant="outline" className="text-xs ml-2">
            {selectedDifficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {/* Audio mode toggle in arena */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setAudioMode(!audioMode);
              if (audioMode && "speechSynthesis" in window) speechSynthesis.cancel();
            }}
            className={audioMode ? "text-purple-400" : "text-muted-foreground"}
            title={audioMode ? "Voice Mode On" : "Voice Mode Off"}
          >
            {audioMode ? <Volume2 className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-40" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetMatch}>
            <RotateCcw className="h-4 w-4 mr-1" />
            New Match
          </Button>
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[
          { label: "Attack", active: phase === "sparring" && messages[messages.length - 1]?.role === "opponent" },
          { label: "Respond", active: phase === "responding" },
          { label: "Coach", active: phase === "coaching" || phase === "review" },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-1">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                step.active
                  ? "bg-primary shadow-sm shadow-primary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
            <span
              className={`text-xs ${
                step.active ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </div>
        ))}
      </div>

      {/* Message Thread */}
      <ScrollArea className={`${isMobile ? "h-[350px]" : "h-[450px]"} rounded-lg border border-border/50 bg-black/10 p-3`}>
        <div ref={scrollRef} className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${
                  msg.role === "disciple"
                    ? "justify-end"
                    : msg.role === "system"
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                {msg.role === "system" ? (
                  <p className="text-xs text-muted-foreground italic text-center px-4 py-1">
                    {msg.content}
                  </p>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap ${
                      msg.role === "opponent"
                        ? "bg-red-950/40 border border-red-800/50 text-foreground"
                        : msg.role === "disciple"
                        ? "bg-blue-950/40 border border-blue-800/50 text-foreground"
                        : "bg-amber-950/30 border border-amber-700/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.role === "opponent" && (
                        <>
                          <span className="text-xs font-semibold text-red-400">
                            {selectedOpponent?.emoji} {selectedOpponent?.name}
                          </span>
                          <QuickAudioButton
                            text={msg.content}
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-auto text-red-400/60 hover:text-red-400"
                          />
                        </>
                      )}
                      {msg.role === "disciple" && (
                        <span className="text-xs font-semibold text-blue-400">
                          You
                        </span>
                      )}
                      {msg.role === "coach" && (
                        <>
                          <Shield className="h-3 w-3 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-400">
                            Coach Jeeves
                          </span>
                          {msg.score !== undefined && msg.score > 0 && (
                            <Badge variant="outline" className="text-xs ml-auto border-amber-500/50 text-amber-400">
                              <Trophy className="h-3 w-3 mr-1" />
                              {msg.score}/40
                            </Badge>
                          )}
                          <QuickAudioButton
                            text={msg.content}
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 text-amber-400/60 hover:text-amber-400"
                          />
                        </>
                      )}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 border border-border/50 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {phase === "coaching" ? "Jeeves is analyzing your defense..." : "Opponent is thinking..."}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      {phase === "responding" && (
        <div className="space-y-2">
          <Textarea
            placeholder={audioMode ? "Speak or type your defense... (minimum 50 characters)" : "Type your defense... (minimum 50 characters)"}
            className="min-h-[80px] max-h-[160px] bg-background/50"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && userInput.trim().length >= 50) {
                e.preventDefault();
                submitDefense();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${userInput.trim().length >= 50 ? "text-green-500" : "text-muted-foreground"}`}>
                {userInput.trim().length}/50 min characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice Input — always available */}
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                variant="icon"
              />
              <Button
                size="sm"
                disabled={userInput.trim().length < 50}
                onClick={submitDefense}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-1" />
                Submit Defense
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Get Coaching Button */}
      {canRequestCoaching && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
            onClick={requestCoaching}
          >
            <Shield className="h-5 w-5 mr-2" />
            Get Coaching from Jeeves
          </Button>
        </motion.div>
      )}

      {/* Review Actions */}
      {phase === "review" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Score Display */}
          {lastScore !== null && (
            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-amber-950/30 to-yellow-950/30 border border-amber-700/30">
              <Trophy className="h-8 w-8 text-amber-400 mx-auto mb-1" />
              <p className="text-3xl font-bold text-amber-400">{lastScore}/40</p>
              <p className="text-xs text-muted-foreground mt-1">
                {lastScore >= 32
                  ? "Outstanding defense!"
                  : lastScore >= 24
                  ? "Solid defense — room to sharpen."
                  : lastScore >= 16
                  ? "Developing — keep training."
                  : "Keep studying — the truth is worth defending."}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={continueSparring}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Continue Sparring
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={resetMatch}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              New Match
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
