import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Swords, Send, Loader2, RotateCcw, ArrowRight,
  Trophy, ChevronRight, Volume2, Mic, Zap, X, Sparkles, BookOpen,
  FlaskConical, Target,
} from "lucide-react";
import { InterdenominationalLibrary } from "./InterdenominationalLibrary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import {
  DEFENSE_OPPONENTS,
  DEFENSE_TOPICS,
  DIFFICULTY_LEVELS,
  TEMPERAMENT_TRAITS,
  type DefenseOpponent,
  type DefenseTopic,
} from "@/data/defenseModeOpponents";

interface DefenseModeProps {
  churchId: string;
}

type Phase = "setup" | "sparring" | "responding" | "coaching" | "review";

interface ChatMessage {
  id: string;
  role: "opponent" | "disciple" | "coach" | "assist" | "system";
  content: string;
  timestamp: Date;
  score?: number;
}

type DefenseSubMode = "sparring" | "library" | "analyze-weapon" | "analyze-attack";

export function DefenseMode({ churchId }: DefenseModeProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sub-mode: sparring arena vs 3AM library
  const [subMode, setSubMode] = useState<DefenseSubMode>("sparring");

  // Setup state
  const [selectedOpponent, setSelectedOpponent] = useState<DefenseOpponent | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<DefenseTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>(["polite"]);
  const [assistMode, setAssistMode] = useState(true);

  // Combat state
  const [phase, setPhase] = useState<Phase>("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAssistLoading, setIsAssistLoading] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Audio state
  const [audioMode, setAudioMode] = useState(false);
  const [autoSpeakId, setAutoSpeakId] = useState<string | null>(null);

  // Analyze My Weapon state
  const [weaponInput, setWeaponInput] = useState("");
  const [weaponTopic, setWeaponTopic] = useState("");
  const [weaponAnalysis, setWeaponAnalysis] = useState<string | null>(null);
  const [weaponLoading, setWeaponLoading] = useState(false);

  // Analyze This Attack state
  const [attackInput, setAttackInput] = useState("");
  const [attackTopic, setAttackTopic] = useState("");
  const [attackAnalysis, setAttackAnalysis] = useState<string | null>(null);
  const [attackLoading, setAttackLoading] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isAssistLoading]);

  // Auto-speak opponent/coach messages when audio mode is on
  useEffect(() => {
    if (!audioMode) return;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;
    if (lastMsg.role !== "opponent" && lastMsg.role !== "coach") return;
    if (lastMsg.id === autoSpeakId) return;
    setAutoSpeakId(lastMsg.id);
    autoSpeak(lastMsg.content);
  }, [messages, audioMode]);

  const autoSpeak = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "onyx", returnType: "url" },
      });
      if (error || !data) {
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          speechSynthesis.speak(utterance);
        }
        return;
      }
      const audioSrc = data.audioUrl
        ? await fetch(data.audioUrl).then(async (r) => r.ok ? URL.createObjectURL(await r.blob()) : data.audioUrl).catch(() => data.audioUrl)
        : `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioSrc as string);
      audio.volume = 0.9;
      await audio.play().catch(() => {
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
      .filter((m) => m.role !== "system" && m.role !== "assist")
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

  const toggleTemperament = (id: string) => {
    setSelectedTemperaments((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Trigger Jeeves assist after opponent speaks
  const triggerAssist = useCallback(async (opponentAttack: string) => {
    if (!assistMode || !selectedOpponent || !selectedTopic) return;
    setIsAssistLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-assist",
          opponentAttack,
          opponentName: selectedOpponent.name,
          defenseTopicName: selectedTopic.name,
          opponentPersonality: selectedTemperaments.join(", "),
        },
      });
      if (error) throw error;
      if (data?.content) {
        addMessage({ role: "assist", content: data.content });
      }
    } catch (err) {
      console.error("Assist error:", err);
    } finally {
      setIsAssistLoading(false);
    }
  }, [assistMode, selectedOpponent, selectedTopic, selectedTemperaments]);

  // ─── Analyze My Weapon handler ────────────────────────────────
  const analyzeWeapon = async () => {
    if (weaponInput.trim().length < 50) return;
    setWeaponLoading(true);
    setWeaponAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-analyze-weapon",
          userArgument: weaponInput.trim(),
          doctrineTopic: weaponTopic || undefined,
        },
      });
      if (error) throw error;
      setWeaponAnalysis(data?.content || "Analysis unavailable. Please try again.");
    } catch (err) {
      console.error("Weapon analysis error:", err);
      setWeaponAnalysis("Failed to analyze. Please try again.");
    } finally {
      setWeaponLoading(false);
    }
  };

  // ─── Analyze This Attack handler ─────────────────────────────
  const analyzeAttack = async () => {
    if (attackInput.trim().length < 50) return;
    setAttackLoading(true);
    setAttackAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-analyze-attack",
          criticArgument: attackInput.trim(),
          doctrineTopic: attackTopic || undefined,
        },
      });
      if (error) throw error;
      setAttackAnalysis(data?.content || "Analysis unavailable. Please try again.");
    } catch (err) {
      console.error("Attack analysis error:", err);
      setAttackAnalysis("Failed to analyze. Please try again.");
    } finally {
      setAttackLoading(false);
    }
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
          temperament: selectedTemperaments,
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

      const opponentContent = data.content || "The opponent could not formulate an argument.";
      addMessage({ role: "opponent", content: opponentContent });
      setPhase("responding");

      // Trigger real-time assist
      triggerAssist(opponentContent);
    } catch (err) {
      console.error("Sparring error:", err);
      addMessage({ role: "system", content: "Failed to start sparring. Please try again." });
      setPhase("setup");
    } finally {
      setIsLoading(false);
    }
  };

  const submitDefense = () => {
    if (userInput.trim().length < 50) return;
    addMessage({ role: "disciple", content: userInput.trim() });
    setUserInput("");
    setPhase("sparring");
  };

  const requestCoaching = async () => {
    setPhase("coaching");
    setIsLoading(true);

    const opponentAttack = messages.filter((m) => m.role === "opponent").pop()?.content || "";
    const discipleResponse = messages.filter((m) => m.role === "disciple").pop()?.content || "";

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
      addMessage({ role: "coach", content: data.content || "Coaching unavailable.", score });
      setPhase("review");
    } catch (err) {
      console.error("Coaching error:", err);
      addMessage({ role: "system", content: "Coaching request failed. Please try again." });
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
          temperament: selectedTemperaments,
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

      const opponentContent = data.content || "The opponent could not continue.";
      addMessage({ role: "opponent", content: opponentContent });
      setPhase("responding");

      // Trigger real-time assist for follow-up
      triggerAssist(opponentContent);
    } catch (err) {
      console.error("Follow-up sparring error:", err);
      addMessage({ role: "system", content: "Failed to continue sparring. Please try again." });
      setPhase("review");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMatch = () => {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setPhase("setup");
    setMessages([]);
    setSelectedOpponent(null);
    setSelectedTopic(null);
    setSelectedDifficulty("intermediate");
    setSelectedTemperaments(["polite"]);
    setUserInput("");
    setRoundCount(0);
    setLastScore(null);
    setAutoSpeakId(null);
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    setUserInput((prev) => {
      const separator = prev.trim() ? " " : "";
      return prev + separator + text;
    });
  }, []);

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
            Theological Combat Simulator — Train to defend the faith against real-world challengers.
          </p>
        </div>

        {/* Sub-mode Toggle: 4 tabs */}
        <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-1.5 p-1 rounded-lg bg-black/20 border border-border/50 max-w-2xl mx-auto`}>
          {([
            { id: "sparring" as const, label: "Sparring Arena", icon: Swords, gradient: "from-red-600 to-orange-600" },
            { id: "library" as const, label: "3AM Library", icon: BookOpen, gradient: "from-amber-600 to-yellow-600" },
            { id: "analyze-weapon" as const, label: "Analyze My Weapon", icon: FlaskConical, gradient: "from-blue-600 to-cyan-600" },
            { id: "analyze-attack" as const, label: "Analyze This Attack", icon: Target, gradient: "from-purple-600 to-pink-600" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubMode(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                subMode === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className={isMobile ? "text-xs" : ""}>{tab.label}</span>
            </button>
          ))}</div>

        {/* Render based on sub-mode */}
        {subMode === "library" ? (
          <InterdenominationalLibrary />
        ) : subMode === "analyze-weapon" ? (
          /* ─── ANALYZE MY WEAPON TAB ─────────────────────────────── */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <FlaskConical className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-bold">Analyze My Weapon</h3>
              </div>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Submit your argument or defense and let Jeeves analyze its strength, identify weaknesses, and show you how to make it even more powerful.
              </p>
            </div>

            {/* Optional topic context */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Doctrine Topic (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFENSE_TOPICS.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={weaponTopic === topic.id ? "default" : "outline"}
                    className={`cursor-pointer text-xs py-1 px-2.5 transition-all ${
                      weaponTopic === topic.id
                        ? "bg-cyan-600 text-white border-cyan-600"
                        : "hover:bg-cyan-600/10"
                    }`}
                    onClick={() => setWeaponTopic(weaponTopic === topic.id ? "" : topic.id)}
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Argument input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Your Argument / Defense
              </label>
              <Textarea
                placeholder="Paste or type your argument here... (minimum 50 characters)&#10;&#10;Example: 'The Sabbath was established at creation in Genesis 2:1-3, before any Jewish nation existed. God blessed and sanctified the seventh day for all humanity...'"
                className="min-h-[160px] max-h-[300px] bg-background/50"
                value={weaponInput}
                onChange={(e) => setWeaponInput(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs ${weaponInput.trim().length >= 50 ? "text-green-500" : "text-muted-foreground"}`}>
                  {weaponInput.trim().length}/50 min characters
                </span>
                <Button
                  size="sm"
                  disabled={weaponInput.trim().length < 50 || weaponLoading}
                  onClick={analyzeWeapon}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {weaponLoading ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...</>
                  ) : (
                    <><FlaskConical className="h-4 w-4 mr-1" /> Analyze My Weapon</>
                  )}
                </Button>
              </div>
            </div>

            {/* Analysis result */}
            {weaponLoading && !weaponAnalysis && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card variant="glass" className="border-cyan-500/30 bg-cyan-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">Jeeves is examining your weapon...</p>
                      <p className="text-xs text-muted-foreground">Checking biblical accuracy, logical structure, rhetorical power, and persuasive force.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {weaponAnalysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card variant="glass" className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-blue-950/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm font-bold text-cyan-300">Jeeves \u2014 Weapon Analysis</span>
                      <QuickAudioButton
                        text={weaponAnalysis}
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto text-cyan-400/60 hover:text-cyan-400"
                      />
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {weaponAnalysis}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setWeaponAnalysis(null); setWeaponInput(""); setWeaponTopic(""); }}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Analyze Another
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : subMode === "analyze-attack" ? (
          /* ─── ANALYZE THIS ATTACK TAB ───────────────────────────── */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-bold">Analyze This Attack</h3>
              </div>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Submit an argument from a critic or challenger and let Jeeves expose the errors, logical fallacies, misquotations, and weaknesses \u2014 then arm you with a devastating counter.
              </p>
            </div>

            {/* Optional topic context */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Doctrine Under Attack (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFENSE_TOPICS.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={attackTopic === topic.id ? "default" : "outline"}
                    className={`cursor-pointer text-xs py-1 px-2.5 transition-all ${
                      attackTopic === topic.id
                        ? "bg-purple-600 text-white border-purple-600"
                        : "hover:bg-purple-600/10"
                    }`}
                    onClick={() => setAttackTopic(attackTopic === topic.id ? "" : topic.id)}
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Critic's argument input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                The Critic's Argument / Attack
              </label>
              <Textarea
                placeholder="Paste or type the critic's argument here... (minimum 50 characters)&#10;&#10;Example: 'The Sabbath was only for Jews. Colossians 2:16 says not to let anyone judge you regarding sabbath days, proving it was nailed to the cross...'"
                className="min-h-[160px] max-h-[300px] bg-background/50"
                value={attackInput}
                onChange={(e) => setAttackInput(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs ${attackInput.trim().length >= 50 ? "text-green-500" : "text-muted-foreground"}`}>
                  {attackInput.trim().length}/50 min characters
                </span>
                <Button
                  size="sm"
                  disabled={attackInput.trim().length < 50 || attackLoading}
                  onClick={analyzeAttack}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {attackLoading ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Target className="h-4 w-4 mr-1" /> Analyze This Attack</>
                  )}
                </Button>
              </div>
            </div>

            {/* Analysis result */}
            {attackLoading && !attackAnalysis && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card variant="glass" className="border-purple-500/30 bg-purple-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    <div>
                      <p className="text-sm font-semibold text-purple-300">Jeeves is dissecting this attack...</p>
                      <p className="text-xs text-muted-foreground">Scanning for logical fallacies, scriptural misuse, historical errors, and rhetorical tricks.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {attackAnalysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card variant="glass" className="border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-pink-950/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      <span className="text-sm font-bold text-purple-300">Jeeves \u2014 Attack Dissection</span>
                      <QuickAudioButton
                        text={attackAnalysis}
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto text-purple-400/60 hover:text-purple-400"
                      />
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {attackAnalysis}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setAttackAnalysis(null); setAttackInput(""); setAttackTopic(""); }}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Analyze Another
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : (
        <>

        {/* Opponent Grid */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Choose Your Opponent
          </h3>
          <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-4"} gap-3`}>
            {DEFENSE_OPPONENTS.map((opp) => (
              <motion.div key={opp.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                    <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-current mb-1">
                      <img src={opp.avatar} alt={opp.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-semibold text-sm">{opp.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{opp.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Topic Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Topic</h3>
          <div className="flex flex-wrap gap-2">
            {DEFENSE_TOPICS.filter((t) => !t.isSignature).map((topic) => (
              <Badge
                key={topic.id}
                variant={selectedTopic?.id === topic.id ? "default" : "outline"}
                className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                  selectedTopic?.id === topic.id ? "bg-primary text-primary-foreground shadow" : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.name}
              </Badge>
            ))}
          </div>
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
            <p className="text-xs text-muted-foreground mt-1">{selectedTopic.description}</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Difficulty</h3>
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

        {/* Challenger Temperament */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Challenger Personality
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Select one or more traits. Real challengers aren't always polite.
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPERAMENT_TRAITS.map((trait) => (
              <button
                key={trait.id}
                onClick={() => toggleTemperament(trait.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedTemperaments.includes(trait.id)
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                title={trait.description}
              >
                <span>{trait.emoji}</span>
                <span>{trait.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Assist Mode Toggle */}
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Jeeves Assist Mode</p>
                <p className="text-xs text-muted-foreground">
                  Jeeves coaches you live after each opponent attack — fallacies, counters, composure
                </p>
              </div>
            </div>
            <Switch
              checked={assistMode}
              onCheckedChange={setAssistMode}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
          {assistMode && (
            <p className="text-xs text-amber-400/80 border-t border-amber-500/20 pt-2">
              ✓ Jeeves will whisper in your corner — exposing fallacies, blind spots, and coaching your composure before you respond.
            </p>
          )}
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
            {audioMode ? <><Mic className="h-4 w-4 mr-1" /> On</> : "Off"}
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
        </>)}
      </div>
    );
  }

  // ─── SPARRING ARENA ──────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Opponent Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-current shrink-0">
            <img src={selectedOpponent?.avatar} alt={selectedOpponent?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-sm">{selectedOpponent?.name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedTopic?.name} · Round {roundCount}
            </p>
          </div>
          <Badge variant="outline" className="text-xs ml-2">{selectedDifficulty}</Badge>
          {selectedTemperaments.length > 0 && (
            <div className="flex gap-1 ml-1">
              {selectedTemperaments.slice(0, 3).map((t) => {
                const trait = TEMPERAMENT_TRAITS.find((tr) => tr.id === t);
                return trait ? (
                  <span key={t} title={trait.label} className="text-sm">{trait.emoji}</span>
                ) : null;
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {assistMode && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-950/30 border border-amber-500/30">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">Assist</span>
            </div>
          )}
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
            <div className={`h-2.5 w-2.5 rounded-full transition-colors ${step.active ? "bg-primary shadow-sm shadow-primary/50" : "bg-muted-foreground/30"}`} />
            <span className={`text-xs ${step.active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              {step.label}
            </span>
            {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </div>
        ))}
      </div>

      {/* Message Thread */}
      <ScrollArea className={`${isMobile ? "h-[370px]" : "h-[480px]"} rounded-lg border border-border/50 bg-black/10 p-3`}>
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
                    : msg.role === "assist"
                    ? "justify-start"
                    : "justify-start"
                }`}
              >
                {msg.role === "system" ? (
                  <p className="text-xs text-muted-foreground italic text-center px-4 py-1">
                    {msg.content}
                  </p>
                ) : msg.role === "assist" ? (
                  /* Jeeves Assist — Corner Coach bubble */
                  <div className="max-w-[90%] rounded-xl p-3 text-sm whitespace-pre-wrap bg-gradient-to-br from-amber-950/60 to-yellow-950/40 border border-amber-500/40">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">JEEVES — Your Corner</span>
                      </div>
                      <span className="text-xs text-amber-500/60 font-medium">ASSIST</span>
                    </div>
                    <div className="text-amber-100/90 text-xs leading-relaxed">{msg.content}</div>
                  </div>
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
                          <img
                            src={selectedOpponent?.avatar}
                            alt={selectedOpponent?.name}
                            className="w-5 h-5 rounded-full object-cover border border-red-700/50"
                          />
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
                        <span className="text-xs font-semibold text-blue-400">You</span>
                      )}
                      {msg.role === "coach" && (
                        <>
                          <Shield className="h-3 w-3 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-400">Coach Jeeves</span>
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

          {/* Loading indicators */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 border border-border/50 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {phase === "coaching" ? "Jeeves is analyzing your defense..." : "Opponent is thinking..."}
              </div>
            </motion.div>
          )}
          {isAssistLoading && assistMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-amber-950/30 border border-amber-500/30 p-3 text-xs text-amber-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Jeeves is analyzing the attack for you...
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
            <span className={`text-xs ${userInput.trim().length >= 50 ? "text-green-500" : "text-muted-foreground"}`}>
              {userInput.trim().length}/50 min characters
            </span>
            <div className="flex items-center gap-2">
              <VoiceInput onTranscript={handleVoiceTranscript} variant="icon" />
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
            Get Full Coaching from Jeeves
          </Button>
        </motion.div>
      )}

      {/* Review Actions */}
      {phase === "review" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
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
            <Button variant="outline" className="flex-1" onClick={continueSparring}>
              <ArrowRight className="h-4 w-4 mr-1" />
              Continue Sparring
            </Button>
            <Button variant="outline" className="flex-1" onClick={resetMatch}>
              <RotateCcw className="h-4 w-4 mr-1" />
              New Match
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
