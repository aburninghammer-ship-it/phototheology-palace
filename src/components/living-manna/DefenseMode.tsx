import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Swords, Send, Loader2, RotateCcw, ArrowRight,
  Trophy, ChevronRight, Volume2, Mic, Zap, X, Sparkles, BookOpen,
  FlaskConical, Target, Save, Archive, Trash2, ChevronDown, ChevronUp,
  Warehouse, ArrowLeft, Users, Share2, Crown, Flame, MessageSquare,
  GraduationCap, Youtube, Link, ClipboardPaste, Search, Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CommunityArmory } from "./CommunityArmory";
import { CheckmateMode } from "./CheckmateMode";
import { InterdenominationalLibrary } from "./InterdenominationalLibrary";
import { ForgeDefendHub } from "./ForgeDefendHub";
import { OpponentProfileDialog } from "./OpponentProfileDialog";
import { FortyDayChallenge } from "./FortyDayChallenge";
import { AATSTraining } from "./AATSTraining";
import { ProphecyComparisonMode } from "./ProphecyComparisonMode";
import { BibleDetectiveMode } from "./BibleDetectiveMode";
import { SpiritualCharacterSimulator } from "./SpiritualCharacterSimulator";
import { BibleDiscoveryBoard } from "./BibleDiscoveryBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  onNavigateToAATS?: (avatarId: string) => void;
}

type Phase = "setup" | "sparring" | "responding" | "coaching" | "review";

interface ChatMessage {
  id: string;
  role: "opponent" | "disciple" | "coach" | "assist" | "system";
  content: string;
  timestamp: Date;
  score?: number;
}

type DefenseSubMode = "sparring" | "library" | "analyze-weapon" | "analyze-attack" | "arsenal" | "community-armory" | "checkmate" | "forge-defend" | "forty-day" | "aats" | "bible-detective" | "character-sim" | "discovery-board" | "prophecy-compare";

interface ArsenalWeapon {
  id: string;
  name?: string;
  subtitle?: string;
  argument: string;
  analysis: string;
  topic: string;
  savedAt: string;
  imageUrl?: string;
}

interface SavedDebate {
  id: string;
  title?: string;
  opponent_id: string;
  opponent_name: string;
  topic_id?: string;
  topic_name?: string;
  difficulty: string;
  round_count: number;
  messages: ChatMessage[];
  saved_at: string;
}

export function DefenseMode({ churchId, onNavigateToAATS }: DefenseModeProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const topicSectionRef = useRef<HTMLDivElement>(null);

  // Sub-mode: sparring arena vs 3AM library
  const [subMode, setSubMode] = useState<DefenseSubMode>("sparring");
  const [profileOpponent, setProfileOpponent] = useState<DefenseOpponent | null>(null);

  // Setup state
  const [selectedOpponent, setSelectedOpponent] = useState<DefenseOpponent | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<DefenseTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>(["polite"]);
  const [assistMode, setAssistMode] = useState(true);
  const [goliathScoutMode, setGoliathScoutMode] = useState(false);

  // Custom Battle state
  const [isCustomBattle, setIsCustomBattle] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCustomSetupLoading, setIsCustomSetupLoading] = useState(false);
  const [customSetupError, setCustomSetupError] = useState<string | null>(null);
  const [customOpponentData, setCustomOpponentData] = useState<DefenseOpponent | null>(null);
  const [customTopicData, setCustomTopicData] = useState<DefenseTopic | null>(null);

  // YouTube Transcript Analysis state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [transcriptAnalysis, setTranscriptAnalysis] = useState<string | null>(null);
  const [transcriptAnalysisLoading, setTranscriptAnalysisLoading] = useState(false);
  const [showManualTranscript, setShowManualTranscript] = useState(false);
  const [manualTranscriptInput, setManualTranscriptInput] = useState("");
  const [transcriptTopicFilter, setTranscriptTopicFilter] = useState("");

  // Master Mode Jeeves standby state
  const [jeevesPreBriefing, setJeevesPreBriefing] = useState<string | null>(null);
  const [isPreBriefingLoading, setIsPreBriefingLoading] = useState(false);
  const [showJeevesStandby, setShowJeevesStandby] = useState(false);
  const [jeevesStandbyMsg, setJeevesStandbyMsg] = useState<string | null>(null);
  const [isStandbyLoading, setIsStandbyLoading] = useState(false);
  const [jeevesStandbyInput, setJeevesStandbyInput] = useState("");

  const isMasterMode = selectedDifficulty === "master";

  const isGoliath = selectedOpponent?.id === "goliath";

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
  const [weaponTarget, setWeaponTarget] = useState("");
  const [weaponTopic, setWeaponTopic] = useState("");
  const [forgeAutoSaveRestored, setForgeAutoSaveRestored] = useState(false);
  const [weaponAnalysis, setWeaponAnalysis] = useState<string | null>(null);
  const [weaponLoading, setWeaponLoading] = useState(false);
  const [jeevesGenerating, setJeevesGenerating] = useState(false);

  // Arsenal state (DB-backed for cross-device sync)
  const [arsenal, setArsenal] = useState<ArsenalWeapon[]>([]);
  const [arsenalLoading, setArsenalLoading] = useState(false);

  // Saved Debates state (DB-backed for cross-device sync)
  const [savedDebates, setSavedDebates] = useState<SavedDebate[]>([]);
  const [debatesLoading, setDebatesLoading] = useState(false);
  const [showSaveDebateDialog, setShowSaveDebateDialog] = useState(false);
  const [showLoadDebatesDialog, setShowLoadDebatesDialog] = useState(false);
  const [debateTitle, setDebateTitle] = useState("");

  // Extract weapons from debate state
  const [extractingWeapons, setExtractingWeapons] = useState(false);
  const [extractedWeapons, setExtractedWeapons] = useState<Array<{ argument: string; topic: string; name: string; subtitle: string }>>([]);
  const [extractionComplete, setExtractionComplete] = useState(false);

  // Load arsenal from DB
  const loadArsenal = useCallback(async () => {
    if (!user) return;
    setArsenalLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("defense_arsenal")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });
      if (error) throw error;
      setArsenal((data || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        subtitle: w.subtitle,
        argument: w.argument,
        analysis: w.analysis,
        topic: w.topic,
        savedAt: w.saved_at,
        imageUrl: w.image_url,
      })));
    } catch (e) {
      console.error("Failed to load arsenal:", e);
    } finally {
      setArsenalLoading(false);
    }
  }, [user]);

  // Load arsenal + migrate localStorage weapons once
  useEffect(() => {
    const migrateLocalArsenal = async () => {
      if (!user) return;
      try {
        const saved = localStorage.getItem("defense-arsenal");
        if (!saved) return;
        const local: ArsenalWeapon[] = JSON.parse(saved);
        if (!local.length) {
          localStorage.removeItem("defense-arsenal");
          return;
        }
        // Use insert (not upsert) — generate fresh DB UUIDs, ignore client IDs
        const rows = local.map((w) => ({
          user_id: user.id,
          name: w.name || null,
          argument: w.argument,
          analysis: w.analysis,
          topic: w.topic || "General",
          saved_at: w.savedAt || new Date().toISOString(),
        }));
        const { error } = await (supabase as any).from("defense_arsenal").insert(rows);
        if (error) {
          console.error("Arsenal migration insert error:", error);
          // Don't remove localStorage if migration failed
          return;
        }
        // Only remove localStorage after successful migration
        localStorage.removeItem("defense-arsenal");
        console.log(`[Arsenal] Migrated ${rows.length} weapons to database`);
      } catch (e) {
        console.error("Arsenal migration error:", e);
      }
    };
    migrateLocalArsenal().then(() => loadArsenal());
  }, [loadArsenal, user]);

   // Load saved debates on mount (moved after loadSavedDebates definition via eslint-disable)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useEffect(() => {
    if (user) {
      loadSavedDebates(); // eslint-disable-line @typescript-eslint/no-use-before-define
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-generate images for weapons that don't have one yet
  useEffect(() => {
    if (!arsenal.length) return;
    const weaponsWithoutImages = arsenal.filter(w => !w.imageUrl);
    if (!weaponsWithoutImages.length) return;

    const generateMissing = async () => {
      for (const weapon of weaponsWithoutImages) {
        const weaponName = weapon.name || getWeaponInfo(weapon.topic).name;
        const imageUrl = await generateWeaponImage(weaponName);
        if (imageUrl) {
          await (supabase as any)
            .from("defense_arsenal")
            .update({ image_url: imageUrl })
            .eq("id", weapon.id);
        }
      }
      loadArsenal(); // Reload to show new images
    };
    generateMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arsenal.length]);

  // Forge weapon state (scoring + gating)
  const [forgeLoading, setForgeLoading] = useState(false);
  const [forgeResult, setForgeResult] = useState<{
    passed: boolean;
    score: number;
    message: string;
  } | null>(null);

  // Refine weapon state
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineResult, setRefineResult] = useState<string | null>(null);

  const refineWeapon = async () => {
    if (!weaponInput.trim()) return;
    setRefineLoading(true);
    setRefineResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-refine-weapon",
          userArgument: weaponInput.trim(),
          weaponTarget: weaponTarget.trim() || undefined,
          analysis: weaponAnalysis || "",
          doctrineTopic: weaponTopic || undefined,
        },
      });
      if (error) throw error;
      const content = data?.content || "Unable to refine at this time.";
      setRefineResult(content);
    } catch {
      setRefineResult("Failed to refine weapon. Please try again.");
    } finally {
      setRefineLoading(false);
    }
  };

  const generateWeaponImage = async (weaponName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-visual-anchor", {
        body: {
          prompt: `A single dramatic weapon called "${weaponName}" floating against a dark background. The weapon should match its name literally — if it's a claw, show an iron claw; if it's a sword, show a glowing sword; if it's a shield, show a divine shield. Epic fantasy art style, dramatic lighting, no text, no watermarks. Single weapon only, centered composition.`,
          style: "epic",
        },
      });
      if (error) throw error;
      return data?.image || null;
    } catch (e) {
      console.error("Failed to generate weapon image:", e);
      return null;
    }
  };

  const saveWeaponToDB = async (weapon: Omit<ArsenalWeapon, "id">) => {
    if (!user) return;
    try {
      // Generate weapon image in background
      const weaponName = weapon.name || getWeaponInfo(weapon.topic).name;
      const imageUrl = await generateWeaponImage(weaponName);

      await (supabase as any).from("defense_arsenal").insert({
        user_id: user.id,
        name: weapon.name || null,
        subtitle: weapon.subtitle || null,
        argument: weapon.argument,
        analysis: weapon.analysis,
        topic: weapon.topic,
        saved_at: weapon.savedAt,
        image_url: imageUrl,
      });
      loadArsenal();
    } catch (e) {
      console.error("Failed to save weapon:", e);
    }
  };

  // Sharpen a saved weapon further
  const [sharpenLoading, setSharpenLoading] = useState(false);
  const [sharpenResult, setSharpenResult] = useState<string | null>(null);

  const sharpenWeapon = async (weapon: ArsenalWeapon) => {
    setSharpenLoading(true);
    setSharpenResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-refine-weapon",
          userArgument: weapon.argument,
          analysis: weapon.analysis,
          doctrineTopic: weapon.topic || undefined,
        },
      });
      if (error) throw error;
      setSharpenResult(data?.content || "Unable to sharpen at this time.");
    } catch {
      setSharpenResult("Failed to sharpen weapon. Please try again.");
    } finally {
      setSharpenLoading(false);
    }
  };

  const applySharpenToWeapon = async (weapon: ArsenalWeapon, newArgument: string) => {
    try {
      await (supabase as any).from("defense_arsenal").update({
        argument: newArgument,
        analysis: weapon.analysis,
      }).eq("id", weapon.id);
      setSharpenResult(null);
      setSelectedArsenalWeapon({ ...weapon, argument: newArgument });
      loadArsenal();
    } catch (e) {
      console.error("Failed to apply sharpening:", e);
    }
  };

  const forgeWeapon = async () => {
    if (!weaponInput.trim() || !weaponAnalysis) return;
    setForgeLoading(true);
    setForgeResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-forge-weapon",
          userArgument: weaponInput.trim(),
          weaponTarget: weaponTarget.trim() || undefined,
          analysis: weaponAnalysis,
          doctrineTopic: weaponTopic || undefined,
        },
      });
      if (error) throw error;

      const content = data?.content || "";
      // Extract the overall score (FORGE SCORE or WEAPON RATING), not sub-category scores
      const forgeScoreMatch = content.match(/(?:FORGE\s*SCORE|WEAPON\s*RATING)[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const score = forgeScoreMatch ? Math.round(parseFloat(forgeScoreMatch[1])) : (() => {
        // Fallback: grab last X/10 pattern (the overall score tends to come after sub-scores)
        const allScores = [...content.matchAll(/(\d+(?:\.\d+)?)\s*\/\s*10/g)];
        return allScores.length > 0 ? Math.round(parseFloat(allScores[0][1])) : 5;
      })();
      const passed = score >= 8;

      // Parse subtitle from AI response
      const subtitleMatch = content.match(/📌\s*\*?\*?SUBTITLE\*?\*?:?\s*(.+)/i);
      const subtitle = subtitleMatch ? subtitleMatch[1].replace(/\*+/g, '').trim() : undefined;

      if (passed) {
        const topicName = weaponTopic
          ? DEFENSE_TOPICS.find((t) => t.id === weaponTopic)?.name || weaponTopic
          : "General";
        await saveWeaponToDB({
          argument: weaponInput.trim(),
          analysis: content || weaponAnalysis,
          subtitle,
          topic: topicName,
          savedAt: new Date().toISOString(),
        });
        localStorage.removeItem(FORGE_AUTOSAVE_KEY);
      }

      setForgeResult({ passed, score, message: content });
    } catch {
      const topicName = weaponTopic
        ? DEFENSE_TOPICS.find((t) => t.id === weaponTopic)?.name || weaponTopic
        : "General";
      await saveWeaponToDB({
        argument: weaponInput.trim(),
        analysis: weaponAnalysis || "Analysis unavailable — weapon saved directly.",
        topic: topicName,
        savedAt: new Date().toISOString(),
      });
      setForgeResult({ passed: true, score: 8, message: "Weapon forged and added to your arsenal!" });
    } finally {
      setForgeLoading(false);
    }
  };

  const removeFromArsenal = async (weaponId: string) => {
    try {
      await (supabase as any).from("defense_arsenal").delete().eq("id", weaponId);
      setArsenal((prev) => prev.filter((w) => w.id !== weaponId));
    } catch (e) {
      console.error("Failed to remove weapon:", e);
    }
  };

  const renameWeapon = async (weaponId: string, newName: string) => {
    try {
      await (supabase as any).from("defense_arsenal").update({ name: newName }).eq("id", weaponId);
      setArsenal((prev) => prev.map((w) => w.id === weaponId ? { ...w, name: newName } : w));
      if (selectedArsenalWeapon?.id === weaponId) {
        setSelectedArsenalWeapon({ ...selectedArsenalWeapon, name: newName });
      }
    } catch (e) {
      console.error("Failed to rename weapon:", e);
    }
  };

  // Load saved debates from DB
  const loadSavedDebates = useCallback(async () => {
    if (!user) return;
    setDebatesLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("defense_debates")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });
      if (error) throw error;
      setSavedDebates((data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        opponent_id: d.opponent_id,
        opponent_name: d.opponent_name,
        topic_id: d.topic_id,
        topic_name: d.topic_name,
        difficulty: d.difficulty,
        round_count: d.round_count,
        messages: d.messages,
        saved_at: d.saved_at,
      })));
    } catch (e) {
      console.error("Failed to load debates:", e);
    } finally {
      setDebatesLoading(false);
    }
  }, [user]);

  // Save current debate to DB
  const saveDebate = async (title?: string) => {
    if (!user || !selectedOpponent || messages.length === 0) return;
    try {
      // For custom battles, embed opponent/topic data in messages so we can restore without DB migration
      const messagesToSave = isCustomBattle && customOpponentData && customTopicData
        ? [
            {
              id: "__custom_meta__",
              role: "system" as const,
              content: JSON.stringify({ custom_opponent_data: customOpponentData, custom_topic_data: customTopicData }),
              timestamp: new Date(),
            },
            ...messages,
          ]
        : messages;

      const { error } = await (supabase as any).from("defense_debates").insert({
        user_id: user.id,
        title: title || null,
        opponent_id: selectedOpponent.id,
        opponent_name: selectedOpponent.name,
        topic_id: selectedTopic?.id || null,
        topic_name: selectedTopic?.name || null,
        difficulty: selectedDifficulty,
        round_count: roundCount,
        messages: messagesToSave,
        saved_at: new Date().toISOString(),
      });
      if (error) throw error;
      await loadSavedDebates();
      setShowSaveDebateDialog(false);
      setDebateTitle("");
    } catch (e) {
      console.error("Failed to save debate:", e);
    }
  };

  // Extract weapons from a debate transcript using Jeeves
  const extractWeaponsFromDebate = async (debateMessages?: ChatMessage[]) => {
    const msgs = debateMessages || messages;
    if (!user || msgs.length < 4) {
      toast.error("Need at least a few exchanges to extract weapons.");
      return;
    }

    setExtractingWeapons(true);
    setExtractedWeapons([]);
    setExtractionComplete(false);

    try {
      const transcript = msgs
        .filter(m => m.role === "opponent" || m.role === "disciple")
        .map(m => `[${m.role === "opponent" ? (selectedOpponent?.name || "Opponent") : "You"}]: ${m.content}`)
        .join("\n\n");

      const topicName = selectedTopic?.name || "General Apologetics";

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-extract-weapons",
          transcript,
          topicName,
          opponentName: selectedOpponent?.name || "Unknown",
          difficulty: selectedDifficulty,
        },
      });

      if (error) throw error;

      const content = data?.content || data?.response || "";
      // Parse JSON array of weapons from response
      let weapons: Array<{ argument: string; topic: string; name: string; subtitle: string }> = [];
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          weapons = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // If JSON parsing fails, try to extract from markdown
        const blocks = content.split(/---|\n\n\n/).filter((b: string) => b.trim().length > 50);
        weapons = blocks.slice(0, 5).map((block: string, i: number) => ({
          argument: block.trim(),
          topic: topicName,
          name: `Debate Weapon ${i + 1}`,
          subtitle: `Extracted from ${selectedOpponent?.name || "debate"}`,
        }));
      }

      if (weapons.length === 0) {
        toast.info("No strong weapons found in this debate. Keep sparring!");
      } else {
        setExtractedWeapons(weapons);
        // Auto-save all extracted weapons to arsenal
        for (const w of weapons) {
          await saveWeaponToDB({
            argument: w.argument,
            analysis: `Auto-extracted from debate vs ${selectedOpponent?.name || "opponent"} on "${topicName}"`,
            topic: w.topic || topicName,
            name: w.name,
            subtitle: w.subtitle,
            savedAt: new Date().toISOString(),
          });
        }
        toast.success(`${weapons.length} weapon${weapons.length > 1 ? "s" : ""} forged and added to your Arsenal!`);
      }
      setExtractionComplete(true);
    } catch (e) {
      console.error("Failed to extract weapons:", e);
      toast.error("Failed to extract weapons. Try again.");
    } finally {
      setExtractingWeapons(false);
    }
  };

  // Load a saved debate back into the UI
  const loadDebate = (debate: SavedDebate) => {
    if (debate.opponent_id === "__custom__") {
      // Extract custom data from embedded metadata message
      const metaMsg = debate.messages.find(m => m.id === "__custom_meta__");
      if (metaMsg) {
        try {
          const meta = JSON.parse(metaMsg.content);
          const customOpp = meta.custom_opponent_data as DefenseOpponent;
          const customTop = meta.custom_topic_data as DefenseTopic;
          setCustomOpponentData(customOpp);
          setCustomTopicData(customTop);
          setSelectedOpponent(customOpp);
          setSelectedTopic(customTop);
          setIsCustomBattle(true);
          setSelectedDifficulty(debate.difficulty);
          setRoundCount(debate.round_count);
          setMessages(debate.messages.filter(m => m.id !== "__custom_meta__"));
          setPhase("sparring");
          setSubMode("sparring");
          return;
        } catch (e) {
          console.error("Failed to parse custom debate data:", e);
        }
      }
    }

    const opponent = DEFENSE_OPPONENTS.find(o => o.id === debate.opponent_id);
    const topic = DEFENSE_TOPICS.find(t => t.id === debate.topic_id);

    if (opponent) {
      setSelectedOpponent(opponent);
      setSelectedTopic(topic || null);
      setSelectedDifficulty(debate.difficulty);
      setRoundCount(debate.round_count);
      setMessages(debate.messages);
      setPhase("sparring");
      setSubMode("sparring");
    }
  };

  // Delete a saved debate
  const deleteDebate = async (debateId: string) => {
    try {
      await (supabase as any).from("defense_debates").delete().eq("id", debateId);
      setSavedDebates((prev) => prev.filter((d) => d.id !== debateId));
    } catch (e) {
      console.error("Failed to delete debate:", e);
    }
  };

  // Arsenal room state
  const [selectedArsenalWeapon, setSelectedArsenalWeapon] = useState<ArsenalWeapon | null>(null);

  // Weapon naming based on topic
  const getWeaponInfo = (topic: string): { name: string; emoji: string } => {
    const t = topic.toLowerCase();
    if (t.includes("sabbath")) return { name: "Sabbath Sword", emoji: "\u2694\uFE0F" };
    if (t.includes("law") || t.includes("decalogue") || t.includes("commandment")) return { name: "Decalogue Shield", emoji: "\uD83D\uDEE1\uFE0F" };
    if (t.includes("second coming") || t.includes("advent") || t.includes("return")) return { name: "Advent Lance", emoji: "\uD83D\uDD31" };
    if (t.includes("sanctuary")) return { name: "Sanctuary Breastplate", emoji: "\uD83C\uDFDB\uFE0F" };
    if (t.includes("dead") || t.includes("soul") || t.includes("death") || t.includes("sleep")) return { name: "Soul Rest Hammer", emoji: "\uD83D\uDD28" };
    if (t.includes("trinity") || t.includes("deity")) return { name: "Trinity Helm", emoji: "\uD83D\uDC51" };
    if (t.includes("creation") || t.includes("creator")) return { name: "Creation Bow", emoji: "\uD83C\uDFF9" };
    if (t.includes("health") || t.includes("temperance")) return { name: "Temperance Staff", emoji: "\uD83E\uDE84" };
    if (t.includes("baptism")) return { name: "Baptism Trident", emoji: "\uD83D\uDD31" };
    if (t.includes("prophecy") || t.includes("daniel") || t.includes("revelation")) return { name: "Prophecy Crossbow", emoji: "\uD83C\uDFAF" };
    if (t.includes("papacy") || t.includes("antichrist") || t.includes("rome")) return { name: "Reformation Axe", emoji: "\uD83E\uDE93" };
    if (t.includes("judgment") || t.includes("investigative")) return { name: "Judgment Gavel", emoji: "\u2696\uFE0F" };
    if (t.includes("millennium") || t.includes("1000")) return { name: "Millennium Mace", emoji: "\uD83D\uDD28" };
    if (t.includes("historicism")) return { name: "Historicist Halberd", emoji: "\u2694\uFE0F" };
    if (t.includes("gift") || t.includes("spirit")) return { name: "Spirit Scepter", emoji: "\uD83E\uDE84" };
    if (t.includes("remnant")) return { name: "Remnant Banner", emoji: "\uD83D\uDEA9" };
    if (t.includes("three angel")) return { name: "Angels' Trumpet", emoji: "\uD83D\uDCEF" };
    if (t.includes("hell") || t.includes("annihil") || t.includes("punishment")) return { name: "Purifier's Flame", emoji: "\uD83D\uDD25" };
    if (t.includes("azazel") || t.includes("scapegoat")) return { name: "Azazel Chains", emoji: "\u26D3\uFE0F" };
    if (t.includes("scripture") || t.includes("bible") || t.includes("sola")) return { name: "Scripture Scepter", emoji: "\uD83D\uDCDC" };
    return { name: "Truth Blade", emoji: "\u2694\uFE0F" };
  };

  // Analyze This Attack state
  const [attackInput, setAttackInput] = useState("");
  const [attackTopic, setAttackTopic] = useState("");
  const [attackAnalysis, setAttackAnalysis] = useState<string | null>(null);
  const [attackLoading, setAttackLoading] = useState(false);

  // ─── TAB PERSISTENCE ─────────────────────────────────────────
  const SESSION_KEY = "defense-mode-session";

  // Save state to sessionStorage when tab becomes hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && phase !== "setup") {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            phase, messages, subMode, roundCount, lastScore,
            selectedOpponentId: selectedOpponent?.id || null,
            selectedTopicId: selectedTopic?.id || null,
            selectedDifficulty, selectedTemperaments, assistMode,
            userInput, audioMode, ts: Date.now(),
          }));
        } catch { /* quota */ }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase, messages, subMode, roundCount, lastScore, selectedOpponent, selectedTopic, selectedDifficulty, selectedTemperaments, assistMode, userInput, audioMode]);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      // Expire after 30 minutes
      if (saved.ts && Date.now() - saved.ts > 1800000) {
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      if (saved.selectedOpponentId) {
        const opp = DEFENSE_OPPONENTS.find(o => o.id === saved.selectedOpponentId);
        if (opp) setSelectedOpponent(opp);
      }
      if (saved.selectedTopicId) {
        const topic = DEFENSE_TOPICS.find(t => t.id === saved.selectedTopicId);
        if (topic) setSelectedTopic(topic);
      }
      if (saved.phase && saved.phase !== "setup") setPhase(saved.phase);
      if (saved.messages?.length) setMessages(saved.messages);
      if (saved.subMode) setSubMode(saved.subMode);
      if (saved.roundCount) setRoundCount(saved.roundCount);
      if (saved.lastScore !== undefined) setLastScore(saved.lastScore);
      if (saved.selectedDifficulty) setSelectedDifficulty(saved.selectedDifficulty);
      if (saved.selectedTemperaments) setSelectedTemperaments(saved.selectedTemperaments);
      if (saved.assistMode !== undefined) setAssistMode(saved.assistMode);
      if (saved.userInput) setUserInput(saved.userInput);
      if (saved.audioMode !== undefined) setAudioMode(saved.audioMode);
      sessionStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── JEEVES MASTER MODE FUNCTIONS ────────────────────────────
  const fetchPreBriefing = useCallback(async (opponent: DefenseOpponent, topic: DefenseTopic | null) => {
    setIsPreBriefingLoading(true);
    setJeevesPreBriefing(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-pre-briefing",
          opponentName: opponent.name,
          opponentPronouns: opponent.pronouns,
          opponentWorldview: opponent.worldview,
          opponentStyle: opponent.argumentStyle,
          opponentTargets: opponent.attackTargets,
          defenseTopicName: topic?.name || "Unknown — Blind Engagement",
          difficulty: "master",
        },
      });
      if (error) throw error;
      setJeevesPreBriefing(data?.content || "Briefing unavailable. Trust your training.");
    } catch {
      setJeevesPreBriefing("Jeeves couldn't prepare a briefing. Stand on the Word — you've trained for this.");
    } finally {
      setIsPreBriefingLoading(false);
    }
  }, []);

  const askJeevesStandby = useCallback(async (question?: string) => {
    if (!selectedOpponent) return;
    setIsStandbyLoading(true);
    setShowJeevesStandby(true);
    try {
      const conversationContext = messages
        .filter(m => m.role !== "system" && m.role !== "assist")
        .map(m => `[${m.role === "opponent" ? selectedOpponent.name : m.role === "disciple" ? "You" : "Jeeves"}]: ${m.content}`)
        .join("\n\n");

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-master-standby",
          opponentName: selectedOpponent.name,
          defenseTopicName: selectedTopic?.name || "Blind Engagement",
          conversationHistory: conversationContext,
          userMessage: question || "Analyze the current debate state and advise me.",
          difficulty: "master",
        },
      });
      if (error) throw error;
      setJeevesStandbyMsg(data?.content || "Jeeves is processing...");
    } catch {
      setJeevesStandbyMsg("Jeeves is momentarily unavailable. Trust your Palace training.");
    } finally {
      setIsStandbyLoading(false);
    }
  }, [selectedOpponent, selectedTopic, messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

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
          opponentPronouns: selectedOpponent.pronouns,
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

  // ─── Forge Auto-Save ──────────────────────────────────────────
  const FORGE_AUTOSAVE_KEY = "forge_weapon_autosave";

  // Restore on mount (once)
  useEffect(() => {
    if (forgeAutoSaveRestored) return;
    try {
      const raw = localStorage.getItem(FORGE_AUTOSAVE_KEY);
      if (!raw) { setForgeAutoSaveRestored(true); return; }
      const saved = JSON.parse(raw);
      // Expire after 24 hours
      if (saved.ts && Date.now() - saved.ts > 86400000) {
        localStorage.removeItem(FORGE_AUTOSAVE_KEY);
        setForgeAutoSaveRestored(true);
        return;
      }
      if (saved.weaponInput) setWeaponInput(saved.weaponInput);
      if (saved.weaponTarget) setWeaponTarget(saved.weaponTarget);
      if (saved.weaponTopic) setWeaponTopic(saved.weaponTopic);
      if (saved.weaponAnalysis) setWeaponAnalysis(saved.weaponAnalysis);
      if (saved.refineResult) setRefineResult(saved.refineResult);
      setForgeAutoSaveRestored(true);
    } catch { setForgeAutoSaveRestored(true); }
  }, [forgeAutoSaveRestored]);

  // Auto-save whenever forge inputs change (debounced via effect)
  const forgeAutoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!forgeAutoSaveRestored) return;
    // Only save if there's meaningful content
    const hasContent = weaponInput.trim().length > 0 || weaponTarget.trim().length > 0;
    if (!hasContent) {
      localStorage.removeItem(FORGE_AUTOSAVE_KEY);
      return;
    }
    if (forgeAutoSaveTimer.current) clearTimeout(forgeAutoSaveTimer.current);
    forgeAutoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(FORGE_AUTOSAVE_KEY, JSON.stringify({
          weaponInput, weaponTarget, weaponTopic,
          weaponAnalysis, refineResult, ts: Date.now(),
        }));
      } catch { /* ignore quota */ }
    }, 1500);
    return () => { if (forgeAutoSaveTimer.current) clearTimeout(forgeAutoSaveTimer.current); };
  }, [weaponInput, weaponTarget, weaponTopic, weaponAnalysis, refineResult, forgeAutoSaveRestored]);

  // ─── Forge New Weapon (reset all forge state) ──────────────────
  const forgeNewWeapon = () => {
    setWeaponInput("");
    setWeaponTarget("");
    setWeaponTopic("");
    setWeaponAnalysis(null);
    setForgeResult(null);
    setRefineResult(null);
    localStorage.removeItem(FORGE_AUTOSAVE_KEY);
  };

  // ─── Analyze My Weapon handler ────────────────────────────────
  const analyzeWeapon = async () => {
    if (weaponInput.trim().length < 50 || weaponTarget.trim().length < 20) return;
    setWeaponLoading(true);
    setWeaponAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-analyze-weapon",
          userArgument: weaponInput.trim(),
          weaponTarget: weaponTarget.trim(),
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

  // ─── Jeeves Generate Weapon handler ─────────────────────────────
  const jeevesGenerateWeapon = async () => {
    if (weaponTarget.trim().length < 20) return;
    setJeevesGenerating(true);
    setWeaponAnalysis(null);
    setWeaponInput("");
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-jeeves-generate",
          weaponTarget: weaponTarget.trim(),
          doctrineTopic: weaponTopic || undefined,
        },
      });
      if (error) throw error;
      setWeaponAnalysis(data?.content || "Generation failed. Please try again.");
    } catch (err) {
      console.error("Jeeves generate weapon error:", err);
      setWeaponAnalysis("Failed to generate weapon. Please try again.");
    } finally {
      setJeevesGenerating(false);
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

  // ─── Custom Battle: Generate opponent from free-form prompt ─────
  const generateCustomOpponent = async () => {
    if (customPrompt.trim().length < 20) return;
    setIsCustomSetupLoading(true);
    setCustomSetupError(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-custom-setup",
          customPrompt: customPrompt.trim(),
        },
      });
      if (error) throw error;
      const content = data?.content || "";
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      if (!jsonMatch) throw new Error("Failed to parse opponent data");
      const parsed = JSON.parse(jsonMatch[1]);

      const opponent: DefenseOpponent = {
        id: "__custom__",
        name: parsed.opponentName || "Custom Opponent",
        emoji: "⚡",
        avatar: "",
        color: "border-cyan-500",
        description: `Custom battle: ${parsed.topicName || "Theology"}`,
        pronouns: (parsed.opponentPronouns || "he/him") as "he/him" | "she/her" | "they/them",
        worldview: parsed.opponentWorldview || "",
        argumentStyle: parsed.opponentStyle || "",
        attackTargets: parsed.opponentTargets || [],
        signatureTopics: [],
        steelmanRules: parsed.opponentSteelmanRules || "",
        endPrompt: parsed.opponentEndPrompt || "",
      };
      const topic: DefenseTopic = {
        id: "__custom__",
        name: parsed.topicName || "Custom Topic",
        description: parsed.topicDescription || "",
      };

      setCustomOpponentData(opponent);
      setCustomTopicData(topic);
      setSelectedOpponent(opponent);
      setSelectedTopic(topic);
    } catch (err) {
      console.error("Custom setup error:", err);
      setCustomSetupError("Failed to generate opponent. Please try again.");
    } finally {
      setIsCustomSetupLoading(false);
    }
  };

  // ─── YouTube Transcript: Extract and Analyze ───────────────────
  const extractAndAnalyzeTranscript = async (transcriptOverride?: string) => {
    const transcript = transcriptOverride || transcriptText;
    if (!transcript && !youtubeUrl.trim()) return;

    // Step 1: Extract transcript if we don't have one
    if (!transcript) {
      setTranscriptLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("extract-youtube-transcript", {
          body: { youtubeUrl: youtubeUrl.trim() },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        const extractedTranscript = data?.transcript;
        if (!extractedTranscript) throw new Error("No transcript returned");
        setTranscriptText(extractedTranscript);
        setTranscriptLoading(false);
        // Now analyze
        await analyzeTranscript(extractedTranscript);
      } catch (err: any) {
        console.error("Transcript extraction error:", err);
        setTranscriptLoading(false);
        setShowManualTranscript(true);
        setTranscriptAnalysis(null);
        setCustomSetupError(err?.message || "No transcript available — captions may be disabled. Try pasting the transcript manually.");
      }
      return;
    }

    // Step 2: Analyze existing transcript
    await analyzeTranscript(transcript);
  };

  const analyzeTranscript = async (transcript: string) => {
    setTranscriptAnalysisLoading(true);
    setTranscriptAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-analyze-transcript",
          transcript,
          doctrineTopic: transcriptTopicFilter || undefined,
        },
      });
      if (error) throw error;
      setTranscriptAnalysis(data?.content || "Analysis unavailable. Please try again.");
    } catch (err) {
      console.error("Transcript analysis error:", err);
      setTranscriptAnalysis("Failed to analyze transcript. Please try again.");
    } finally {
      setTranscriptAnalysisLoading(false);
    }
  };

  const startSparring = async () => {
    // Goliath blind mode: topic is optional
    if (!selectedOpponent) return;
    if (!isGoliath && !selectedTopic) return;

    // Master Mode: fire pre-briefing in parallel
    if (isMasterMode) {
      fetchPreBriefing(selectedOpponent, selectedTopic || null);
      setShowJeevesStandby(true);
    }

    setPhase("sparring");
    setIsLoading(true);
    setRoundCount(1);

    const isBlindGoliath = isGoliath && !selectedTopic;

    addMessage({
      role: "system",
      content: isBlindGoliath
        ? `Round 1 — ${selectedOpponent.name} has entered the arena. You don't know what's coming... (${selectedDifficulty})`
        : `Round 1 — ${selectedOpponent.name} vs. You on "${selectedTopic!.name}" (${selectedDifficulty})`,
    });

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-sparring",
          opponent: selectedOpponent.id,
          defenseTopicId: isBlindGoliath ? "__goliath_blind__" : selectedTopic!.id,
          defenseTopicName: isBlindGoliath ? "Unknown — Goliath chooses" : selectedTopic!.name,
          difficulty: selectedDifficulty,
          temperament: selectedTemperaments,
          opponentWorldview: selectedOpponent.worldview,
          opponentStyle: selectedOpponent.argumentStyle,
          opponentTargets: selectedOpponent.attackTargets,
          opponentEndPrompt: selectedOpponent.endPrompt,
          opponentSteelmanRules: selectedOpponent.steelmanRules,
          opponentPronouns: selectedOpponent.pronouns,
          isSignatureTopic: isBlindGoliath ? false : !!selectedTopic?.isSignature,
          isGoliathBlindMode: isBlindGoliath,
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
      setPhase("review");
    } finally {
      setIsLoading(false);
    }
  };

  const submitDefense = async () => {
    if (userInput.trim().length < 50) return;
    const response = userInput.trim();
    addMessage({ role: "disciple", content: response });
    setUserInput("");

    // Automatically get opponent's next response
    const nextRound = roundCount + 1;
    setRoundCount(nextRound);
    setPhase("sparring");
    setIsLoading(true);

    addMessage({
      role: "system",
      content: `Round ${nextRound} — ${selectedOpponent?.name} responds...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-sparring",
          opponent: selectedOpponent?.id,
          defenseTopicId: isGoliath && !selectedTopic ? "__goliath_blind__" : selectedTopic?.id,
          defenseTopicName: isGoliath && !selectedTopic ? "Unknown — Goliath chooses" : selectedTopic?.name,
          difficulty: selectedDifficulty,
          temperament: selectedTemperaments,
          opponentWorldview: selectedOpponent?.worldview,
          opponentStyle: selectedOpponent?.argumentStyle,
          opponentTargets: selectedOpponent?.attackTargets,
          opponentEndPrompt: selectedOpponent?.endPrompt,
          opponentSteelmanRules: selectedOpponent?.steelmanRules,
          opponentPronouns: selectedOpponent?.pronouns,
          isSignatureTopic: selectedTopic ? !!selectedTopic.isSignature : false,
          isGoliathBlindMode: isGoliath && !selectedTopic,
          phase: "follow-up",
          conversationHistory: buildConversationHistory() + `\n\n[Disciple]: ${response}`,
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
      addMessage({ role: "system", content: "Opponent failed to respond. You can request coaching or continue." });
      setPhase("review");
    } finally {
      setIsLoading(false);
    }
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
          opponentName: selectedOpponent?.name,
          opponentPronouns: selectedOpponent?.pronouns,
          opponentAttack,
          discipleResponse,
        },
      });

      if (error) throw error;

      let content = data.content || "Coaching unavailable.";
      let score = data.score || 0;

      // Check if response is truncated (missing key sections)
      const hasScore = /TOTAL SCORE:\s*\d+\s*\/\s*40/i.test(content);
      const hasModelDefense = /MODEL DEFENSE:/i.test(content);
      const isComplete = hasScore && hasModelDefense && content.length > 500;

      if (!isComplete && content.length > 200) {
        // Attempt up to 2 continuations to get the full analysis
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const { data: contData, error: contError } = await supabase.functions.invoke("jeeves", {
              body: {
                mode: "defense-coach-continue",
                defenseTopicName: selectedTopic?.name,
                partialResponse: content,
              },
            });

            if (contError) break;

            const continuation = contData.content || "";
            if (!continuation) break;

            content = content + "\n\n" + continuation;

            // Extract score from combined content
            const combinedScoreMatch = content.match(/TOTAL SCORE:\s*(\d+)\s*\/\s*40/i);
            if (combinedScoreMatch) {
              score = parseInt(combinedScoreMatch[1], 10);
            } else if (contData.score) {
              score = contData.score;
            }

            // Check if now complete
            const nowHasScore = /TOTAL SCORE:\s*\d+\s*\/\s*40/i.test(content);
            const nowHasDefense = /MODEL DEFENSE:/i.test(content);
            if (nowHasScore && nowHasDefense) break;
          } catch {
            break;
          }
        }
      }

      setLastScore(score);
      addMessage({ role: "coach", content, score });

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
    if (!selectedOpponent) return;

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
          defenseTopicId: isGoliath && !selectedTopic ? "__goliath_blind__" : selectedTopic?.id,
          defenseTopicName: isGoliath && !selectedTopic ? "Unknown — Goliath chooses" : selectedTopic?.name,
          difficulty: selectedDifficulty,
          temperament: selectedTemperaments,
          opponentWorldview: selectedOpponent.worldview,
          opponentStyle: selectedOpponent.argumentStyle,
          opponentTargets: selectedOpponent.attackTargets,
          opponentEndPrompt: selectedOpponent.endPrompt,
          opponentSteelmanRules: selectedOpponent.steelmanRules,
          opponentPronouns: selectedOpponent.pronouns,
          isSignatureTopic: selectedTopic ? !!selectedTopic.isSignature : false,
          isGoliathBlindMode: isGoliath && !selectedTopic,
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
    // Clear custom battle state
    setIsCustomBattle(false);
    setCustomPrompt("");
    setCustomSetupError(null);
    setCustomOpponentData(null);
    setCustomTopicData(null);
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

        {/* Sub-mode Toggle: 5 tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-black/20 border border-border/50 max-w-5xl mx-auto justify-center">
          {([
            { id: "sparring" as const, label: "Sparring Arena", icon: Swords, gradient: "from-red-600 to-orange-600" },
            { id: "library" as const, label: "3AM Library", icon: BookOpen, gradient: "from-amber-600 to-yellow-600" },
            { id: "analyze-weapon" as const, label: "Forge Weapon", icon: FlaskConical, gradient: "from-blue-600 to-cyan-600" },
            { id: "analyze-attack" as const, label: "Analyze Attack", icon: Target, gradient: "from-purple-600 to-pink-600" },
            { id: "arsenal" as const, label: `Arsenal${arsenal.length > 0 ? ` (${arsenal.length})` : ""}`, icon: Warehouse, gradient: "from-emerald-600 to-teal-600" },
            { id: "community-armory" as const, label: "Community Armory", icon: Users, gradient: "from-amber-600 to-orange-600" },
            { id: "forge-defend" as const, label: "Forge & Defend", icon: Trophy, gradient: "from-violet-600 to-fuchsia-600" },
            { id: "forty-day" as const, label: "40 Days of Smoke", icon: Flame, gradient: "from-red-600 to-red-800" },
            { id: "aats" as const, label: "AATS", icon: GraduationCap, gradient: "from-sky-600 to-indigo-600" },
            { id: "prophecy-compare" as const, label: "Prophecy Compare", icon: Eye, gradient: "from-indigo-600 to-purple-600" },
            { id: "bible-detective" as const, label: "Bible Detective", icon: Search, gradient: "from-amber-700 to-yellow-700" },
            { id: "character-sim" as const, label: "Character Sim", icon: Users, gradient: "from-teal-600 to-cyan-600" },
            { id: "discovery-board" as const, label: "Discovery Board", icon: Sparkles, gradient: "from-yellow-600 to-amber-600" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubMode(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                subMode === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className={isMobile ? "text-[10px]" : ""}>{tab.label}</span>
            </button>
          ))}</div>

        {/* Render based on sub-mode */}
        {subMode === "prophecy-compare" ? (
          <ProphecyComparisonMode />
        ) : subMode === "bible-detective" ? (
          <BibleDetectiveMode />
        ) : subMode === "character-sim" ? (
          <SpiritualCharacterSimulator />
        ) : subMode === "discovery-board" ? (
          <BibleDiscoveryBoard />
        ) : subMode === "aats" ? (
          <AATSTraining churchId={churchId} onNavigateToDefense={() => setSubMode("sparring")} />
        ) : subMode === "forty-day" ? (
          <FortyDayChallenge />
        ) : subMode === "forge-defend" ? (
          <ForgeDefendHub churchId={churchId} />
        ) : subMode === "community-armory" ? (
          <CommunityArmory onGoToForge={() => setSubMode("analyze-weapon")} />
        ) : subMode === "checkmate" ? (
          <CheckmateMode onBack={() => setSubMode("analyze-weapon")} />
        ) : subMode === "library" ? (
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
              {/* Auto-save indicator */}
              {(weaponInput.trim().length > 0 || weaponTarget.trim().length > 0) && !forgeResult?.passed && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Save className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500/80">Draft auto-saved</span>
                </div>
              )}
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

            {/* What is this weapon defending against? (REQUIRED) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                <Target className="h-3.5 w-3.5 inline mr-1 text-red-400" />
                What Is This Weapon Defending Against? <span className="text-red-400">*</span>
              </label>
              <Textarea
                placeholder="Describe the opposing argument, doctrine, or objection you're building this weapon to refute... (minimum 20 characters)&#10;&#10;Example: 'The claim that the Sabbath was only for Jews and was abolished at the cross...'"
                className="min-h-[100px] max-h-[200px] bg-background/50 border-red-500/20 focus:border-red-500/40"
                value={weaponTarget}
                onChange={(e) => setWeaponTarget(e.target.value)}
              />
              <span className={`text-xs ${weaponTarget.trim().length >= 20 ? "text-green-500" : "text-muted-foreground"}`}>
                {weaponTarget.trim().length}/20 min characters
              </span>
            </div>

            {/* Argument input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Your Argument / Defense <span className="text-red-400">*</span>
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
                  disabled={weaponInput.trim().length < 50 || weaponTarget.trim().length < 20 || weaponLoading}
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

            {/* Jeeves Generate divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-muted-foreground/20" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">or let Jeeves forge one</span>
              <div className="flex-1 border-t border-muted-foreground/20" />
            </div>

            <div className="text-center">
              <Button
                size="sm"
                disabled={weaponTarget.trim().length < 20 || jeevesGenerating || weaponLoading}
                onClick={jeevesGenerateWeapon}
                className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white"
              >
                {jeevesGenerating ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Jeeves is Forging...</>
                ) : (
                  <><Swords className="h-4 w-4 mr-1" /> Let Jeeves Forge a Weapon</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Jeeves will create an original, arsenal-grade weapon using Scripture, logic, and PT principles
              </p>
            </div>

            {/* Analysis result */}
            {(weaponLoading || jeevesGenerating) && !weaponAnalysis && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card variant="glass" className="border-cyan-500/30 bg-cyan-950/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">
                        {jeevesGenerating ? "Jeeves is forging an original weapon..." : "Jeeves is examining your weapon..."}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {jeevesGenerating
                          ? "Using Scripture chains, sanctuary typology, prophetic patterns, and PT Palace rooms to forge something devastating."
                          : "Checking biblical accuracy, logical structure, rhetorical power, and persuasive force."}
                      </p>
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
                    <div className="prose prose-sm prose-invert max-w-none leading-relaxed text-foreground/90 [&_strong]:text-cyan-300 [&_h2]:text-cyan-300 [&_h3]:text-cyan-300 [&_hr]:border-cyan-500/20 [&_li]:marker:text-cyan-400 [&_code]:text-cyan-300 [&_code]:bg-cyan-950/40 [&_blockquote]:border-l-cyan-500/40 [&_blockquote]:text-cyan-200/80">
                      <ReactMarkdown>{weaponAnalysis}</ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={forgeNewWeapon}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Forge New Weapon
                      </Button>
                      {!forgeResult && (
                        <>
                          <Button
                            size="sm"
                            onClick={refineWeapon}
                            disabled={refineLoading}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                          >
                            {refineLoading ? (
                              <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Refining...</>
                            ) : (
                              <><Sparkles className="h-3.5 w-3.5 mr-1" /> Refine This Weapon</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={forgeWeapon}
                            disabled={forgeLoading}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          >
                            {forgeLoading ? (
                              <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Forging...</>
                            ) : (
                              <><Swords className="h-3.5 w-3.5 mr-1" /> Forge This Weapon</>
                            )}
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Refine result */}
                    {refineResult && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/40 to-orange-950/30 border border-amber-500/40">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-amber-400" />
                            <span className="text-sm font-bold text-amber-300">Jeeves — Refined Weapon</span>
                            <QuickAudioButton
                              text={refineResult}
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-auto text-amber-400/60 hover:text-amber-400"
                            />
                          </div>
                          <div className="prose prose-xs prose-invert max-w-none leading-relaxed text-foreground/90 [&_strong]:text-amber-300 [&_h2]:text-amber-300 [&_h3]:text-amber-300 [&_hr]:border-amber-500/20 [&_li]:marker:text-amber-400 [&_blockquote]:border-l-amber-500/40">
                            <ReactMarkdown>{refineResult}</ReactMarkdown>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              onClick={() => {
                                // Replace weapon input with ONLY the refined version
                                setWeaponInput(refineResult || "");
                                setRefineResult(null);
                                setWeaponAnalysis(null);
                              }}
                            >
                              <ArrowRight className="h-3.5 w-3.5 mr-1" />
                              Apply Refinement
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              onClick={() => setRefineResult(null)}
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Forge result */}
                    {forgeResult && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        {forgeResult.passed ? (
                          <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/40 to-green-950/30 border border-emerald-500/40">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{getWeaponInfo(weaponTopic ? DEFENSE_TOPICS.find((t) => t.id === weaponTopic)?.name || "General" : "General").emoji}</span>
                              <div>
                                <p className="text-sm font-bold text-emerald-300">
                                  Weapon Forged! — {getWeaponInfo(weaponTopic ? DEFENSE_TOPICS.find((t) => t.id === weaponTopic)?.name || "General" : "General").name}
                                </p>
                                <p className="text-xs text-emerald-400/80">Score: {forgeResult.score}/10 — Added to your Arsenal</p>
                              </div>
                              <Badge className="ml-auto bg-emerald-600 text-white text-xs">{forgeResult.score}/10</Badge>
                            </div>
                            <div className="prose prose-xs prose-invert max-w-none text-emerald-200/80 [&_strong]:text-emerald-300 [&_hr]:border-emerald-500/20 [&_li]:marker:text-emerald-400"><ReactMarkdown>{forgeResult.message}</ReactMarkdown></div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => setSubMode("arsenal")}
                            >
                              <Warehouse className="h-3.5 w-3.5 mr-1" />
                              View Arsenal
                            </Button>
                            <Button
                              size="sm"
                              className="mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                              onClick={async () => {
                                const topicName = weaponTopic
                                  ? DEFENSE_TOPICS.find((t) => t.id === weaponTopic)?.name || weaponTopic
                                  : "General";
                                const info = getWeaponInfo(topicName);
                                try {
                                  await supabase.from("community_armory").insert({
                                    user_id: (await supabase.auth.getUser()).data.user?.id || "",
                                    topic: topicName,
                                    weapon_name: info.name,
                                    weapon_emoji: info.emoji,
                                    argument: weaponInput.trim(),
                                    analysis: weaponAnalysis || "",
                                    score: forgeResult?.score || 8,
                                  });
                                } catch {}
                              }}
                            >
                              <Share2 className="h-3.5 w-3.5 mr-1" />
                              Share to Community Armory
                            </Button>
                            <Button
                              size="sm"
                              className="mt-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white"
                              onClick={() => setSubMode("checkmate")}
                            >
                              <Crown className="h-3.5 w-3.5 mr-1" />
                              Set Up Checkmate
                            </Button>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-gradient-to-r from-red-950/40 to-orange-950/30 border border-red-500/40">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-5 w-5 text-red-400" />
                              <div>
                                <p className="text-sm font-bold text-red-300">Weapon Rejected — Needs More Work</p>
                                <p className="text-xs text-red-400/80">Score: {forgeResult.score}/10 — Minimum 8/10 required</p>
                              </div>
                              <Badge className="ml-auto bg-red-600 text-white text-xs">{forgeResult.score}/10</Badge>
                            </div>
                            <div className="prose prose-xs prose-invert max-w-none text-red-200/80 [&_strong]:text-red-300 [&_hr]:border-red-500/20 [&_li]:marker:text-red-400"><ReactMarkdown>{forgeResult.message}</ReactMarkdown></div>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Refine your argument above and try forging again. A strong weapon must be biblically sound, logically airtight, and historically accurate.
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                              onClick={() => { setForgeResult(null); }}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Try Again
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : subMode === "arsenal" ? (
          /* ─── ARSENAL ROOM TAB ─────────────────────────────────── */
          <div className="space-y-5">
            {/* Arsenal Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Warehouse className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  The Arsenal
                </h3>
              </div>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Your collection of forged weapons. Each one has been tested and proven ready for battle.
              </p>
            </div>

            {selectedArsenalWeapon ? (
              /* ─── SELECTED WEAPON DETAIL VIEW ─── */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedArsenalWeapon(null); setSharpenResult(null); }}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Arsenal
                </Button>
                <Card variant="glass" className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-teal-950/20">
                  <CardContent className="p-5 space-y-4">
                    {/* Weapon header */}
                    <div className="text-center space-y-2">
                      {/* Weapon image or emoji */}
                      {selectedArsenalWeapon.imageUrl ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/40 mx-auto shadow-lg shadow-emerald-500/10">
                          <img src={selectedArsenalWeapon.imageUrl} alt={selectedArsenalWeapon.name || getWeaponInfo(selectedArsenalWeapon.topic).name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-5xl block">{getWeaponInfo(selectedArsenalWeapon.topic).emoji}</span>
                      )}
                      <input
                        type="text"
                        defaultValue={selectedArsenalWeapon.name || getWeaponInfo(selectedArsenalWeapon.topic).name}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val && val !== getWeaponInfo(selectedArsenalWeapon.topic).name) {
                            renameWeapon(selectedArsenalWeapon.id, val);
                          }
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                        className="text-lg font-bold text-emerald-300 bg-transparent border-b border-dashed border-emerald-500/40 text-center w-full focus:outline-none focus:border-emerald-400 placeholder:text-emerald-500/50"
                        title="Click to rename weapon"
                      />
                      {selectedArsenalWeapon.subtitle && (
                        <p className="text-xs text-emerald-400/70 italic">{selectedArsenalWeapon.subtitle}</p>
                      )}
                      <Badge className="bg-emerald-600/30 text-emerald-300 border-emerald-500/30">
                        {selectedArsenalWeapon.topic}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Forged on {new Date(selectedArsenalWeapon.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* The argument */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Your Argument</h5>
                      <div className="prose prose-sm prose-invert max-w-none leading-relaxed p-3 rounded-lg bg-black/20 border border-border/30 [&_strong]:text-emerald-300">
                        <ReactMarkdown>{selectedArsenalWeapon.argument}</ReactMarkdown>
                      </div>
                    </div>
                    {/* Jeeves analysis */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Jeeves Analysis</h5>
                        <QuickAudioButton
                          text={selectedArsenalWeapon.analysis}
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 text-emerald-400/60 hover:text-emerald-400"
                        />
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none leading-relaxed p-3 rounded-lg bg-black/20 border border-border/30 [&_strong]:text-emerald-300 [&_h2]:text-emerald-300 [&_h3]:text-emerald-300 [&_hr]:border-emerald-500/20 [&_li]:marker:text-emerald-400 [&_blockquote]:border-l-emerald-500/40">
                        <ReactMarkdown>{selectedArsenalWeapon.analysis}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Sharpen result */}
                    {sharpenResult && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/40 to-orange-950/30 border border-amber-500/40">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-amber-400" />
                            <span className="text-sm font-bold text-amber-300">Jeeves — Sharpened Weapon</span>
                            <QuickAudioButton
                              text={sharpenResult}
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-auto text-amber-400/60 hover:text-amber-400"
                            />
                          </div>
                          <div className="prose prose-xs prose-invert max-w-none leading-relaxed text-foreground/90 [&_strong]:text-amber-300 [&_h2]:text-amber-300 [&_h3]:text-amber-300 [&_hr]:border-amber-500/20 [&_li]:marker:text-amber-400 [&_blockquote]:border-l-amber-500/40">
                            <ReactMarkdown>{sharpenResult}</ReactMarkdown>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              onClick={() => applySharpenToWeapon(selectedArsenalWeapon, sharpenResult || "")}
                            >
                              <ArrowRight className="h-3.5 w-3.5 mr-1" />
                              Apply Sharpening
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              onClick={() => setSharpenResult(null)}
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => sharpenWeapon(selectedArsenalWeapon)}
                        disabled={sharpenLoading}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      >
                        {sharpenLoading ? (
                          <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Sharpening...</>
                        ) : (
                          <><Sparkles className="h-3.5 w-3.5 mr-1" /> Sharpen Further</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          removeFromArsenal(selectedArsenalWeapon.id);
                          setSelectedArsenalWeapon(null);
                          setSharpenResult(null);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Discard Weapon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : arsenal.length === 0 ? (
              /* ─── EMPTY ARSENAL ─── */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-950/40 border-2 border-emerald-500/20 flex items-center justify-center">
                  <Swords className="h-10 w-10 text-emerald-500/40" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-foreground/70">Your Arsenal Awaits</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Every great defender needs weapons. Go to the <strong className="text-cyan-400">Forge Weapon</strong> tab,
                    craft an argument, and if it passes Jeeves' scrutiny, it'll appear here — battle-ready.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSubMode("analyze-weapon")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  <FlaskConical className="h-4 w-4 mr-1" />
                  Forge Your First Weapon
                </Button>
              </motion.div>
            ) : (
              /* ─── WEAPON ROOM GRID ─── */
              <div className="space-y-6">
                {/* Encouragement banner */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-300">
                    {arsenal.length < 5
                      ? `${arsenal.length} weapon${arsenal.length !== 1 ? "s" : ""} forged. Keep building! A well-stocked arsenal makes an unshakeable defender.`
                      : arsenal.length < 15
                      ? `${arsenal.length} weapons strong. Your arsenal is growing — forge weapons for every doctrine to be ready for any challenger.`
                      : `${arsenal.length} weapons forged! You are becoming a formidable defender of the faith.`}
                  </p>
                </div>

                {/* Categorized weapons */}
                {(() => {
                  const categories = arsenal.reduce<Record<string, ArsenalWeapon[]>>((acc, w) => {
                    const cat = w.topic || "General";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(w);
                    return acc;
                  }, {});
                  const sortedCategories = Object.entries(categories).sort((a, b) => b[1].length - a[1].length);

                  return sortedCategories.map(([category, weapons]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getWeaponInfo(category).emoji}</span>
                        <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">{category}</h4>
                        <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 ml-auto">
                          {weapons.length} weapon{weapons.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-4"} gap-3`}>
                        {weapons.map((weapon) => {
                          const info = getWeaponInfo(weapon.topic);
                          return (
                            <motion.div
                              key={weapon.id}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedArsenalWeapon(weapon)}
                              className="cursor-pointer"
                            >
                              <Card variant="glass" className="border-emerald-500/20 bg-gradient-to-b from-emerald-950/30 to-black/40 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all h-full">
                                <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
                                  {/* Weapon mount — image or emoji */}
                                  {weapon.imageUrl ? (
                                    <div className="w-14 h-14 rounded-full overflow-hidden border border-emerald-500/30 shadow-inner">
                                      <img src={weapon.imageUrl} alt={weapon.name || info.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-900/60 to-teal-900/40 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                                      <span className="text-2xl">{info.emoji}</span>
                                    </div>
                                  )}
                                  {/* Weapon nameplate */}
                                  <p className="text-xs font-bold text-emerald-300 leading-tight">{weapon.name || info.name}</p>
                                  <p className="text-[10px] text-emerald-400/70 italic leading-snug line-clamp-2">
                                    {weapon.subtitle 
                                      ? weapon.subtitle 
                                      : weapon.topic 
                                        ? `${info.name} — ${weapon.topic}` 
                                        : weapon.argument.replace(/^(Greetings|Dear|Hello|Welcome)[^.]*\.\s*/i, '').slice(0, 80)}
                                  </p>
                                  <span className="text-[9px] text-emerald-500/60">{new Date(weapon.savedAt).toLocaleDateString()}</span>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}

                {/* Forge more CTA */}
                <div className="text-center pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSubMode("analyze-weapon")}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <FlaskConical className="h-4 w-4 mr-1" />
                    Forge Another Weapon
                  </Button>
                </div>
              </div>
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

            {/* ─── YOUTUBE TRANSCRIPT ANALYSIS ────────────────────────── */}
            <div className="pt-4 border-t border-border/30 space-y-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Youtube className="h-5 w-5 text-red-400" />
                  <h3 className="text-lg font-bold">Analyze Video</h3>
                </div>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Paste a YouTube link and Jeeves will extract the transcript, identify every theological argument, and arm you with a devastating rebuttal.
                </p>
              </div>

              {/* Optional topic filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Focus Area (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFENSE_TOPICS.map((topic) => (
                    <Badge
                      key={topic.id}
                      variant={transcriptTopicFilter === topic.id ? "default" : "outline"}
                      className={`cursor-pointer text-xs py-1 px-2.5 transition-all ${
                        transcriptTopicFilter === topic.id
                          ? "bg-red-600 text-white border-red-600"
                          : "hover:bg-red-600/10"
                      }`}
                      onClick={() => setTranscriptTopicFilter(transcriptTopicFilter === topic.id ? "" : topic.id)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* YouTube URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  YouTube URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3 py-2 rounded-md bg-background/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={!youtubeUrl.trim() || transcriptLoading || transcriptAnalysisLoading}
                    onClick={() => extractAndAnalyzeTranscript()}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                  >
                    {transcriptLoading ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Extracting...</>
                    ) : transcriptAnalysisLoading ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Youtube className="h-4 w-4 mr-1" /> Extract & Analyze</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Manual transcript fallback */}
              {showManualTranscript && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardPaste className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-300">Manual Paste Fallback</span>
                    </div>
                    <p className="text-xs text-amber-200/70 mb-2">
                      No transcript available — captions may be disabled. Paste the transcript manually below.
                    </p>
                    <Textarea
                      placeholder="Paste the video transcript here... (minimum 100 characters)"
                      className="min-h-[120px] max-h-[250px] bg-background/50 border-amber-500/30"
                      value={manualTranscriptInput}
                      onChange={(e) => setManualTranscriptInput(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${manualTranscriptInput.trim().length >= 100 ? "text-green-500" : "text-muted-foreground"}`}>
                        {manualTranscriptInput.trim().length}/100 min characters
                      </span>
                      <Button
                        size="sm"
                        disabled={manualTranscriptInput.trim().length < 100 || transcriptAnalysisLoading}
                        onClick={() => {
                          setTranscriptText(manualTranscriptInput.trim());
                          extractAndAnalyzeTranscript(manualTranscriptInput.trim());
                        }}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      >
                        {transcriptAnalysisLoading ? (
                          <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Analyzing...</>
                        ) : (
                          <><Target className="h-4 w-4 mr-1" /> Analyze Transcript</>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Transcript preview */}
              {transcriptText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <details className="rounded-lg border border-border/30 bg-black/20 overflow-hidden">
                    <summary className="p-3 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Transcript Preview ({transcriptText.length.toLocaleString()} characters)
                    </summary>
                    <div className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed max-h-[200px] overflow-y-auto">
                      {transcriptText.substring(0, 1000)}{transcriptText.length > 1000 ? "..." : ""}
                    </div>
                  </details>
                </motion.div>
              )}

              {/* Analysis loading */}
              {transcriptAnalysisLoading && !transcriptAnalysis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card variant="glass" className="border-red-500/30 bg-red-950/20">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-red-400" />
                      <div>
                        <p className="text-sm font-semibold text-red-300">Jeeves is analyzing this transcript...</p>
                        <p className="text-xs text-muted-foreground">Identifying arguments, checking Scripture usage, and building a comprehensive rebuttal.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Analysis result */}
              {transcriptAnalysis && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card variant="glass" className="border-red-500/30 bg-gradient-to-br from-red-950/30 to-orange-950/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-400" />
                        <span className="text-sm font-bold text-red-300">Jeeves — Transcript Analysis</span>
                        <QuickAudioButton
                          text={transcriptAnalysis}
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-auto text-red-400/60 hover:text-red-400"
                        />
                      </div>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                        {transcriptAnalysis}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTranscriptAnalysis(null);
                          setTranscriptText(null);
                          setYoutubeUrl("");
                          setShowManualTranscript(false);
                          setManualTranscriptInput("");
                          setTranscriptTopicFilter("");
                        }}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Analyze Another Video
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
        <>

        {/* Saved Debates Button */}
        {savedDebates.length > 0 && (
          <div className="flex justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoadDebatesDialog(true)}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Archive className="h-4 w-4 mr-2" />
              Load Saved Debate ({savedDebates.length})
            </Button>
          </div>
        )}

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
                  onClick={() => setProfileOpponent(opp)}
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

            {/* Custom Battle Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                variant="glass"
                className={`cursor-pointer transition-all border-2 border-dashed ${
                  isCustomBattle
                    ? "border-cyan-400 ring-2 ring-cyan-400 ring-offset-2 ring-offset-background shadow-lg shadow-cyan-500/20"
                    : "border-cyan-500/50 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-500/10"
                }`}
                onClick={() => {
                  setIsCustomBattle(!isCustomBattle);
                  if (isCustomBattle) {
                    // Toggling off — clear custom state
                    setCustomPrompt("");
                    setCustomSetupError(null);
                    setCustomOpponentData(null);
                    setCustomTopicData(null);
                    setSelectedOpponent(null);
                    setSelectedTopic(null);
                  } else {
                    // Toggling on — clear regular selection
                    setSelectedOpponent(null);
                    setSelectedTopic(null);
                  }
                }}
              >
                <CardContent className="p-3 text-center space-y-1">
                  <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500 mb-1 flex items-center justify-center bg-gradient-to-br from-cyan-950/60 to-blue-950/60">
                    <Zap className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="font-semibold text-sm text-cyan-300">Custom Battle</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">Create any opponent on any topic</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Custom Battle Setup Panel */}
        {isCustomBattle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {!customOpponentData ? (
              <div className="p-4 rounded-lg border border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 to-blue-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-cyan-300">Custom Battle Setup</h3>
                </div>
                <p className="text-xs text-cyan-200/70">
                  Describe any debate scenario. Who do you want to spar against, and on what topic?
                </p>
                <Textarea
                  placeholder='e.g. "Debate a Hebrew Israelite on the woman of Revelation 12" or "Argue with a Catholic priest about the Sabbath vs Sunday"'
                  className="min-h-[80px] max-h-[160px] bg-background/50 border-cyan-500/30 focus:border-cyan-400"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${customPrompt.trim().length >= 20 ? "text-green-500" : "text-muted-foreground"}`}>
                    {customPrompt.trim().length}/20 min characters
                  </span>
                  <Button
                    size="sm"
                    disabled={customPrompt.trim().length < 20 || isCustomSetupLoading}
                    onClick={generateCustomOpponent}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                  >
                    {isCustomSetupLoading ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...</>
                    ) : (
                      <><Zap className="h-4 w-4 mr-1" /> Generate Scenario</>
                    )}
                  </Button>
                </div>
                {customSetupError && (
                  <p className="text-xs text-red-400">{customSetupError}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 to-blue-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-cyan-300">Opponent Generated</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomOpponentData(null);
                        setCustomTopicData(null);
                        setSelectedOpponent(null);
                        setSelectedTopic(null);
                      }}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs h-7"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCustomBattle(false);
                        setCustomPrompt("");
                        setCustomOpponentData(null);
                        setCustomTopicData(null);
                        setSelectedOpponent(null);
                        setSelectedTopic(null);
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded bg-black/30 border border-cyan-500/20">
                    <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider">Opponent</p>
                    <p className="text-sm font-semibold text-cyan-200">{customOpponentData.name}</p>
                  </div>
                  <div className="p-2 rounded bg-black/30 border border-cyan-500/20">
                    <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider">Topic</p>
                    <p className="text-sm font-semibold text-cyan-200">{customTopicData?.name}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Scroll target after opponent selection */}
        <div ref={topicSectionRef} />

        {/* Goliath Blind Mode Banner */}
        {isGoliath && !goliathScoutMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border border-purple-500/40 bg-gradient-to-br from-purple-950/40 to-black/60 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-purple-300">Blind Engagement Mode</h3>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              You don't know what doctrine Goliath will attack, or from what worldview. He picks the angle and strikes first. 
              Prepare to think on your feet — this is the ultimate test.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-amber-300/80">Want to preview the topic?</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGoliathScoutMode(true)}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs h-7"
              >
                Enable Scout Mode
              </Button>
            </div>
          </motion.div>
        )}

        {/* Scout Mode Active Banner */}
        {isGoliath && goliathScoutMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-300">Scout Mode Active</p>
                <p className="text-[10px] text-amber-400/70">Select a topic below, or go back to blind mode</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setGoliathScoutMode(false); setSelectedTopic(null); }}
              className="text-amber-400 hover:text-amber-300 text-xs h-7"
            >
              <X className="h-3 w-3 mr-1" />
              Go Blind
            </Button>
          </motion.div>
        )}

        {/* Topic Selector — hidden for Goliath blind mode (shown for Scout Mode) and custom battle */}
        {!isCustomBattle && (!isGoliath || goliathScoutMode) && (
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
        )}

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
          className={`w-full text-white ${
            isGoliath && !goliathScoutMode
              ? "bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-800 hover:to-fuchsia-800"
              : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          }`}
          disabled={!selectedOpponent || (!isCustomBattle && !isGoliath && !selectedTopic) || (isGoliath && goliathScoutMode && !selectedTopic)}
          onClick={startSparring}
        >
          {isGoliath && !goliathScoutMode ? (
            <><Crown className="h-5 w-5 mr-2" /> Enter the Arena Blind</>
          ) : (
            <><Swords className="h-5 w-5 mr-2" /> Begin Sparring</>
          )}
        </Button>
        </>)}
        <OpponentProfileDialog
          opponent={profileOpponent}
          open={!!profileOpponent}
          onOpenChange={(open) => { if (!open) setProfileOpponent(null); }}
          onSelectOpponent={(opp) => {
            setSelectedOpponent(opp);
            setProfileOpponent(null);
            // Auto-scroll to topic section on mobile after opponent selection
            setTimeout(() => {
              topicSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
          }}
          onNavigateToAATS={onNavigateToAATS}
        />
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
              {selectedTopic ? selectedTopic.name : "⚡ Blind Engagement"} · Round {roundCount}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setExtractedWeapons([]); setExtractionComplete(false); setShowSaveDebateDialog(true); }}
            disabled={messages.length === 0}
            title="Save this debate"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => extractWeaponsFromDebate()}
            disabled={messages.length < 4 || extractingWeapons}
            title="Extract weapons from this debate"
            className="text-amber-400 hover:text-amber-300"
          >
            {extractingWeapons ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <FlaskConical className="h-4 w-4 mr-1" />
            )}
            {isMobile ? "" : "Extract"}
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
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 border border-border/50 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {phase === "coaching" ? "Jeeves is analyzing your defense..." : "Opponent is thinking..."}
              </div>
            </motion.div>
          )}
          {isAssistLoading && assistMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-amber-950/30 border border-amber-500/30 p-3 text-xs text-amber-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Jeeves is analyzing the attack for you...
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* ─── JEEVES MASTER MODE STANDBY PANEL ───────────────────── */}
      {isMasterMode && (
        <div className="rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 p-3 space-y-2">
          {/* Pre-briefing (shows at start) */}
          {jeevesPreBriefing && !showJeevesStandby && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-blue-300 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> JEEVES — Pre-Battle Briefing
                </p>
                <button onClick={() => setJeevesPreBriefing(null)} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-[11px] leading-relaxed text-blue-200/80">
                <ReactMarkdown>{jeevesPreBriefing}</ReactMarkdown>
              </div>
            </div>
          )}
          {isPreBriefingLoading && (
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              <span className="text-[10px] text-blue-300">Jeeves is preparing your pre-battle briefing...</span>
            </div>
          )}

          {/* Standby coaching panel */}
          {showJeevesStandby && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-blue-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> JEEVES — On Standby
                </p>
                <button onClick={() => setShowJeevesStandby(false)} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>
              </div>
              {isStandbyLoading ? (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                  <span className="text-[10px] text-muted-foreground">Jeeves is analyzing...</span>
                </div>
              ) : jeevesStandbyMsg ? (
                <div className="prose prose-sm prose-invert max-w-none text-[11px] leading-relaxed text-blue-200/80">
                  <ReactMarkdown>{jeevesStandbyMsg}</ReactMarkdown>
                </div>
              ) : null}
              <div className="flex gap-2">
                <input
                  value={jeevesStandbyInput}
                  onChange={e => setJeevesStandbyInput(e.target.value)}
                  placeholder="Ask Jeeves anything..."
                  className="flex-1 rounded-md bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      askJeevesStandby(jeevesStandbyInput.trim() || undefined);
                      setJeevesStandbyInput("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    askJeevesStandby(jeevesStandbyInput.trim() || undefined);
                    setJeevesStandbyInput("");
                  }}
                  disabled={isStandbyLoading}
                  className="text-[10px] border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Ask
                </Button>
              </div>
            </div>
          )}

          {/* Toggle standby visibility */}
          {!showJeevesStandby && !isPreBriefingLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowJeevesStandby(true);
                if (!jeevesStandbyMsg) askJeevesStandby();
              }}
              className="text-[10px] text-blue-400 hover:text-blue-300 w-full"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Open Jeeves Standby Panel
            </Button>
          )}
        </div>
      )}

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
            <Button variant="outline" className="flex-1" onClick={messages.some(m => m.role === "opponent") ? continueSparring : startSparring}>
              <ArrowRight className="h-4 w-4 mr-1" />
              {messages.some(m => m.role === "opponent") ? "Continue Sparring" : "Retry"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={resetMatch}>
              <RotateCcw className="h-4 w-4 mr-1" />
              New Match
            </Button>
          </div>
        </motion.div>
      )}

      {/* Save Debate Dialog */}
      <Dialog open={showSaveDebateDialog} onOpenChange={setShowSaveDebateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save This Debate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="debate-title">Title (Optional)</Label>
              <Textarea
                id="debate-title"
                placeholder="e.g., 'Debating Sunday Law with Evangelical'"
                value={debateTitle}
                onChange={(e) => setDebateTitle(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p><strong>Opponent:</strong> {selectedOpponent?.name}</p>
              <p><strong>Topic:</strong> {selectedTopic?.name || "Blind Engagement"}</p>
              <p><strong>Rounds:</strong> {roundCount}</p>
              <p><strong>Messages:</strong> {messages.length}</p>
            </div>
            {extractionComplete && extractedWeapons.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <Warehouse className="h-4 w-4" />
                  {extractedWeapons.length} weapon{extractedWeapons.length > 1 ? "s" : ""} added to Arsenal!
                </div>
                {extractedWeapons.map((w, i) => (
                  <div key={i} className="text-xs text-muted-foreground pl-6">
                    ⚔️ {w.name}{w.subtitle ? ` — ${w.subtitle}` : ""}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end flex-wrap">
              <Button variant="outline" onClick={() => setShowSaveDebateDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => extractWeaponsFromDebate()}
                disabled={messages.length < 4 || extractingWeapons || extractionComplete}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                {extractingWeapons ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FlaskConical className="h-4 w-4 mr-2" />
                )}
                {extractionComplete ? "Weapons Extracted" : "Extract Weapons"}
              </Button>
              <Button
                onClick={async () => {
                  await saveDebate(debateTitle || undefined);
                  if (!extractionComplete && messages.length >= 4) {
                    await extractWeaponsFromDebate();
                  }
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save & Extract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Saved Debates Dialog */}
      <Dialog open={showLoadDebatesDialog} onOpenChange={setShowLoadDebatesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Saved Debates</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-4">
              {debatesLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : savedDebates.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Archive className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No saved debates yet</p>
                  <p className="text-xs">Save your sparring sessions to review later</p>
                </div>
              ) : (
                savedDebates.map((debate) => (
                  <Card key={debate.id} variant="glass" className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {debate.title || `${debate.opponent_name} - ${debate.topic_name || "Blind"}`}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(debate.saved_at).toLocaleDateString()} • {debate.opponent_name} • {debate.topic_name || "Blind Engagement"}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {debate.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{debate.round_count} rounds</span>
                          <span>•</span>
                          <span>{debate.messages.length} messages</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => {
                              loadDebate(debate);
                              setShowLoadDebatesDialog(false);
                            }}
                          >
                            <ArrowRight className="h-3.5 w-3.5 mr-1" />
                            Load
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            disabled={extractingWeapons || debate.messages.length < 4}
                            onClick={() => {
                              // Set opponent/topic context for extraction
                              const opp = DEFENSE_OPPONENTS.find(o => o.id === debate.opponent_id);
                              const topic = DEFENSE_TOPICS.find(t => t.id === debate.topic_id);
                              if (opp) setSelectedOpponent(opp);
                              if (topic) setSelectedTopic(topic);
                              extractWeaponsFromDebate(debate.messages);
                            }}
                            title="Extract weapons from this debate"
                          >
                            {extractingWeapons ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <FlaskConical className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => deleteDebate(debate.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <OpponentProfileDialog
        opponent={profileOpponent}
        open={!!profileOpponent}
        onOpenChange={(open) => { if (!open) setProfileOpponent(null); }}
        onSelectOpponent={(opp) => {
          setSelectedOpponent(opp);
          setProfileOpponent(null);
        }}
        onNavigateToAATS={onNavigateToAATS}
      />
    </div>
  );
}
