import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Swords, Send, Loader2, Trophy, Flame, Calendar,
  ChevronRight, ArrowLeft, Star, Lock, CheckCircle2, XCircle,
  Target, Zap, Crown, Award, RotateCcw, MessageSquare, Eye,
  ScrollText, Unlock, RefreshCw, AlertTriangle, Share2, Globe,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  generate40DaySchedule,
  getXPLevel,
  BADGE_MILESTONES,
  type DayConfig,
} from "@/data/fortyDayChallengeConfig";
import {
  DEFENSE_OPPONENTS,
  DEFENSE_TOPICS,
} from "@/data/defenseModeOpponents";

interface ChatMessage {
  role: "opponent" | "defender";
  content: string;
}

interface TurnAnalysis {
  id: string;
  turn_index: number;
  turn_role: string;
  status: string;
  analysis_text: string | null;
}

type Phase = "overview" | "enroll" | "daily-map" | "debating" | "verdict" | "review" | "debrief";

export function FortyDayChallenge() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("overview");
  const [enrollment, setEnrollment] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<DayConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Debate state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [verdict, setVerdict] = useState<any>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [jeevesCoaching, setJeevesCoaching] = useState<string | null>(null);
  const [isJeevesLoading, setIsJeevesLoading] = useState(false);
  const [showJeevesPanel, setShowJeevesPanel] = useState(false);
  const [jeevesInput, setJeevesInput] = useState("");
  const [reviewSession, setReviewSession] = useState<any>(null);
  const [jeevesRecap, setJeevesRecap] = useState<string | null>(null);
  const [isRecapLoading, setIsRecapLoading] = useState(false);

  // Sealed envelope state — tracks which turns have been analyzed
  const [sealedTurns, setSealedTurns] = useState<Set<number>>(new Set());
  const [turnAnalyses, setTurnAnalyses] = useState<TurnAnalysis[]>([]);
  const [expandedTurnAnalysis, setExpandedTurnAnalysis] = useState<number | null>(null);
  const [sharingSessionId, setSharingSessionId] = useState<string | null>(null);

  const togglePublicDebate = async (sessionId: string, currentlyPublic: boolean) => {
    setSharingSessionId(sessionId);
    try {
      if (currentlyPublic) {
        // Make private
        await (supabase as any).from("debate_challenge_sessions").update({ is_public: false }).eq("id", sessionId);
        toast.success("Debate is now private.");
        // Update local state
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, is_public: false } : s));
        if (reviewSession?.id === sessionId) setReviewSession((prev: any) => ({ ...prev, is_public: false }));
        if (currentSession?.id === sessionId) setCurrentSession((prev: any) => ({ ...prev, is_public: false }));
      } else {
        // Generate share token and make public
        const shareToken = 'DB' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
        await (supabase as any).from("debate_challenge_sessions").update({ is_public: true, share_token: shareToken }).eq("id", sessionId);
        const shareUrl = `${window.location.origin}/shared/debate/${shareToken}`;
        
        // Update local state
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, is_public: true, share_token: shareToken } : s));
        if (reviewSession?.id === sessionId) setReviewSession((prev: any) => ({ ...prev, is_public: true, share_token: shareToken }));
        if (currentSession?.id === sessionId) setCurrentSession((prev: any) => ({ ...prev, is_public: true, share_token: shareToken }));
        
        // Copy to clipboard or share
        if (typeof navigator.share === "function") {
          await navigator.share({
            title: `40 Days of Smoke Debate`,
            text: `🔥 Check out this theological debate!`,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Public link copied to clipboard!");
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Share error:", err);
        toast.error("Failed to update sharing settings.");
      }
    } finally {
      setSharingSessionId(null);
    }
  };

  // Load enrollment data
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const initialLoadDone = useRef(false);

  const loadData = async () => {
    if (!user) return;
    if (!initialLoadDone.current) setLoading(true);
    try {
      const { data: enrollments } = await supabase
        .from("debate_challenge_enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (enrollments && enrollments.length > 0) {
        const e = enrollments[0];
        setEnrollment(e);
        setSchedule(generate40DaySchedule(e.id));

        const { data: sess } = await supabase
          .from("debate_challenge_sessions")
          .select("*")
          .eq("enrollment_id", e.id)
          .order("day_number");
        setSessions(sess || []);

        const { data: bdgs } = await supabase
          .from("debate_challenge_badges")
          .select("*")
          .eq("enrollment_id", e.id);
        setBadges(bdgs || []);

        setPhase("daily-map");
      } else {
        setPhase("overview");
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
      initialLoadDone.current = true;
    }
  };

  const handleEnroll = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("debate_challenge_enrollments")
        .insert({
          user_id: user.id,
          difficulty: selectedDifficulty,
          current_day: 1,
          last_activity_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) throw error;
      setEnrollment(data);
      setSchedule(generate40DaySchedule(data.id));
      setPhase("daily-map");
      toast.success("🔥 40-Day Challenge begun! Your first opponent awaits.");
    } catch (err: any) {
      toast.error(err.message || "Failed to enroll");
    }
  };

  const handleRestart = async () => {
    if (!user || !enrollment) return;
    try {
      // Archive the current enrollment
      await supabase
        .from("debate_challenge_enrollments")
        .update({ status: "abandoned" })
        .eq("id", enrollment.id);

      // Create fresh enrollment
      const { data, error } = await supabase
        .from("debate_challenge_enrollments")
        .insert({
          user_id: user.id,
          difficulty: selectedDifficulty || enrollment.difficulty,
          current_day: 1,
          last_activity_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (error) throw error;

      setEnrollment(data);
      setSchedule(generate40DaySchedule(data.id));
      setSessions([]);
      setBadges([]);
      toast.success("🔥 Challenge reset! A fresh 40 days begins now.");
    } catch (err: any) {
      toast.error(err.message || "Failed to restart");
    }
  };

  const isDebateWindowOpen = (): boolean => {
    const now = new Date();
    return now.getHours() >= 6;
  };

  const getTimeUntil6am = (): string => {
    const now = new Date();
    const sixAm = new Date(now);
    if (now.getHours() >= 6) {
      sixAm.setDate(sixAm.getDate() + 1);
    }
    sixAm.setHours(6, 0, 0, 0);
    const diff = sixAm.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const isDebateExpired = (session: any): boolean => {
    if (!session || session.completed_at) return false;
    if (session.session_date) {
      const [year, month, day] = session.session_date.split('-').map(Number);
      const midnight = new Date(year, month - 1, day + 1, 0, 0, 0);
      return new Date() >= midnight;
    }
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return now >= midnight;
  };

  const getTimeUntilMidnight = (): string => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  // Get the calendar date for a specific day number based on enrollment start
  const getDayDate = (dayNum: number): string => {
    if (!enrollment?.started_at) return "";
    const started = new Date(enrollment.started_at);
    const dayDate = new Date(started.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
    return dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const [smokeAlertShown, setSmokeAlertShown] = useState(false);
  useEffect(() => {
    if (!enrollment || smokeAlertShown) return;
    if (isDebateWindowOpen()) {
      const todayNumber = enrollment.current_day || 1;
      const todaySession = sessions.find(s => s.day_number === todayNumber);
      if (!todaySession?.completed_at) {
        const dayConfig = schedule[todayNumber - 1];
        if (dayConfig) {
          toast("🔥 Today's Smoke is ready!", {
            description: `Day ${todayNumber} — A new opponent and doctrine await you. Step into the arena.`,
            duration: 8000,
          });
          setSmokeAlertShown(true);
        }
      }
    }
  }, [enrollment, sessions, schedule, smokeAlertShown]);

  useEffect(() => {
    if (!sessions.length || !enrollment) return;
    const expireSessions = async () => {
      let needsReload = false;
      for (const s of sessions) {
        if (!s.completed_at && isDebateExpired(s)) {
          await supabase
            .from("debate_challenge_sessions")
            .update({
              completed_at: new Date().toISOString(),
              outcome: "loss",
              ai_verdict: "Debate expired at midnight. Try to complete your next debate within the day!",
              xp_earned: 25,
            })
            .eq("id", s.id);

          // Advance current_day so user isn't stuck on an expired day
          if (s.day_number === enrollment.current_day) {
            const nextDay = Math.min(enrollment.current_day + 1, 40);
            await supabase
              .from("debate_challenge_enrollments")
              .update({
                current_day: nextDay,
                completed_days: enrollment.completed_days + 1,
                total_xp: enrollment.total_xp + 25,
              })
              .eq("id", enrollment.id);
            needsReload = true;
          }
        }
      }
      if (needsReload) {
        loadData();
      }
    };
    expireSessions();
  }, [sessions]);

  // ─── FIRE BACKGROUND JEEVES TURN ANALYSIS ─────────────────
  const triggerTurnAnalysis = useCallback(async (
    sessionId: string,
    turnIndex: number,
    turnRole: "opponent" | "defender",
    allMsgs: ChatMessage[],
    opponentName: string,
    topicName: string,
  ) => {
    try {
      const dName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Defender";
      
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forty-day-debate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "analyze-turn",
          sessionId,
          turnIndex,
          turnRole,
          allMessages: allMsgs,
          opponentName,
          topicName,
          defenderName: dName,
        }),
      });

      if (resp.ok) {
        // Mark turn as sealed
        setSealedTurns(prev => new Set(prev).add(turnIndex));
      }
    } catch (err) {
      console.warn("Turn analysis trigger failed (non-blocking):", err);
    }
  }, [user]);

  const startDayDebate = async (dayNumber: number) => {
    if (!enrollment || !user) return;
    const dayConfig = schedule[dayNumber - 1];
    if (!dayConfig) return;

    const opponent = DEFENSE_OPPONENTS.find(o => o.id === dayConfig.opponentId);
    const topic = DEFENSE_TOPICS.find(t => t.id === dayConfig.topicId);
    if (!opponent || !topic) {
      toast.error("Configuration error for this day");
      return;
    }

    if (!isDebateWindowOpen()) {
      toast.error("Today's Smoke drops at 6:00 AM. Come back then!");
      return;
    }

    const existing = sessions.find(s => s.day_number === dayNumber);
    
    if (existing?.completed_at) {
      toast.info("You've already completed this day's debate!");
      return;
    }
    if (existing && isDebateExpired(existing)) {
      toast.error("This debate expired at midnight. Move to the next day.");
      return;
    }

    setIsAiLoading(true);
    setMessages([]);
    setVerdict(null);
    setSealedTurns(new Set());
    setTurnAnalyses([]);

    try {
      let session = existing;
      if (!session) {
        const { data, error } = await supabase
          .from("debate_challenge_sessions")
          .insert({
            enrollment_id: enrollment.id,
            user_id: user.id,
            day_number: dayNumber,
            opponent_id: opponent.id,
            opponent_name: opponent.name,
            topic_id: topic.id,
            topic_name: topic.name,
            difficulty: enrollment.difficulty,
          })
          .select()
          .single();
        if (error) throw error;
        session = data;
      }

      setCurrentSession(session);

      if (session.messages && Array.isArray(session.messages) && (session.messages as any[]).length > 0) {
        const existingMsgs = session.messages as ChatMessage[];
        setMessages(existingMsgs);
        setPhase("debating");
        setIsAiLoading(false);
        // Restore sealed state for existing messages
        const sealed = new Set<number>();
        existingMsgs.forEach((_, i) => sealed.add(i));
        setSealedTurns(sealed);
        return;
      }

      const { data: aiData, error: aiError } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "open",
          opponentWorldview: opponent.worldview,
          opponentStyle: opponent.argumentStyle,
          opponentName: opponent.name,
          opponentPronouns: opponent.pronouns,
          topicName: topic.name,
          topicDescription: topic.description,
          difficulty: enrollment.difficulty,
        },
      });

      if (aiError) throw aiError;

      const opening: ChatMessage = { role: "opponent", content: aiData.response };
      setMessages([opening]);
      setPhase("debating");

      await supabase
        .from("debate_challenge_sessions")
        .update({ messages: [opening] as unknown as any })
        .eq("id", session.id);

      // 🔥 Fire Jeeves analysis on the opening attack
      triggerTurnAnalysis(session.id, 0, "opponent", [opening], opponent.name, topic.name);

    } catch (err: any) {
      console.error("Debate start error:", err);
      toast.error("Connection issue — please try again. " + (err.message || ""));
    } finally {
      setIsAiLoading(false);
    }
  };

  const sendReply = async () => {
    if (!userInput.trim() || !currentSession || isAiLoading) return;

    const opponent = DEFENSE_OPPONENTS.find(o => o.id === currentSession.opponent_id);
    const topic = DEFENSE_TOPICS.find(t => t.id === currentSession.topic_id);
    if (!opponent || !topic) return;

    const userMsg: ChatMessage = { role: "defender", content: userInput.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserInput("");
    setIsAiLoading(true);

    // 🔥 Fire Jeeves analysis on the user's defense
    const defenderTurnIndex = newMessages.length - 1;
    triggerTurnAnalysis(
      currentSession.id, defenderTurnIndex, "defender",
      newMessages, opponent.name, topic.name,
    );

    try {
      const { data, error } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "reply",
          messages: newMessages,
          userMessage: userMsg.content,
          opponentWorldview: opponent.worldview,
          opponentStyle: opponent.argumentStyle,
          opponentName: opponent.name,
          opponentPronouns: opponent.pronouns,
          topicName: topic.name,
          topicDescription: topic.description,
          difficulty: enrollment.difficulty,
        },
      });

      if (error) throw error;

      const aiReply: ChatMessage = { role: "opponent", content: data.response };
      const updatedMessages = [...newMessages, aiReply];
      setMessages(updatedMessages);

      await supabase
        .from("debate_challenge_sessions")
        .update({
          messages: updatedMessages as unknown as any,
          rounds_completed: Math.floor(updatedMessages.filter(m => m.role === "defender").length),
        })
        .eq("id", currentSession.id);

      // 🔥 Fire Jeeves analysis on opponent's new attack
      const opponentTurnIndex = updatedMessages.length - 1;
      triggerTurnAnalysis(
        currentSession.id, opponentTurnIndex, "opponent",
        updatedMessages, opponent.name, topic.name,
      );

      if (data.conceded) {
        toast.success("🏆 Your opponent conceded! Victory is yours!");
        setTimeout(() => endDebateWithConcession(updatedMessages), 1500);
        return;
      }

      if (enrollment.difficulty === "beginner") {
        fetchJeevesCoaching(updatedMessages, opponent.name, topic.name);
      }

    } catch (err: any) {
      toast.error(err.message || "AI response failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const endDebateWithConcession = async (debateMessages: ChatMessage[]) => {
    if (!currentSession) return;
    setIsAiLoading(true);
    try {
      const opponent = DEFENSE_OPPONENTS.find(o => o.id === currentSession.opponent_id);

      const { data, error } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "verdict",
          messages: debateMessages,
          opponentName: opponent?.name || currentSession.opponent_name,
          topicName: currentSession.topic_name,
        },
      });

      if (error) throw error;

      const verdictData = { ...data, outcome: "win", xp: Math.max(data.xp || 150, 150) };
      if (!verdictData.badge) {
        verdictData.badge = { type: "concession_victory", name: "Smoke Screen", icon: "💨", description: "Forced your opponent to concede" };
      }
      setVerdict(verdictData);

      await supabase
        .from("debate_challenge_sessions")
        .update({
          messages: debateMessages as unknown as any,
          completed_at: new Date().toISOString(),
          xp_earned: verdictData.xp,
          outcome: "win",
          ai_verdict: verdictData.verdict + " [CONCESSION VICTORY]",
          rounds_completed: debateMessages.filter(m => m.role === "defender").length,
        })
        .eq("id", currentSession.id);

      const today = new Date().toISOString().split("T")[0];
      const newStreak = enrollment.last_activity_date === today ? enrollment.streak :
        (daysSince(enrollment.last_activity_date) <= 2 ? enrollment.streak + 1 : 1);

      await supabase
        .from("debate_challenge_enrollments")
        .update({
          completed_days: enrollment.completed_days + 1,
          current_day: Math.min(enrollment.current_day + 1, 40),
          total_xp: enrollment.total_xp + verdictData.xp,
          streak: newStreak,
          longest_streak: Math.max(enrollment.longest_streak, newStreak),
          last_activity_date: today,
          status: enrollment.current_day >= 40 ? "completed" : "active",
          completed_at: enrollment.current_day >= 40 ? new Date().toISOString() : null,
        })
        .eq("id", enrollment.id);

      if (verdictData.badge && user) {
        await supabase.from("debate_challenge_badges").insert({
          user_id: user.id,
          enrollment_id: enrollment.id,
          badge_type: verdictData.badge.type,
          badge_name: verdictData.badge.name,
          badge_icon: verdictData.badge.icon,
          badge_description: verdictData.badge.description,
        });
      }

      setPhase("verdict");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process concession verdict");
    } finally {
      setIsAiLoading(false);
    }
  };

  const fetchJeevesCoaching = async (debateMessages: ChatMessage[], opponentName: string, topicName: string, question?: string) => {
    setIsJeevesLoading(true);
    setShowJeevesPanel(true);
    try {
      const { data, error } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "jeeves-coach",
          messages: debateMessages,
          opponentName,
          topicName,
          userMessage: question || "",
          difficulty: enrollment?.difficulty || "intermediate",
        },
      });
      if (error) throw error;
      setJeevesCoaching(data.response);
    } catch (err: any) {
      setJeevesCoaching("Jeeves is momentarily unavailable. Trust your training — the Palace is with you.");
    } finally {
      setIsJeevesLoading(false);
    }
  };

  const handleAskJeeves = () => {
    if (!currentSession) return;
    const opponent = DEFENSE_OPPONENTS.find(o => o.id === currentSession.opponent_id);
    const topic = DEFENSE_TOPICS.find(t => t.id === currentSession.topic_id);
    fetchJeevesCoaching(messages, opponent?.name || "", topic?.name || "", jeevesInput.trim() || undefined);
    setJeevesInput("");
  };

  const endDebate = async () => {
    if (!currentSession || messages.length < 2) {
      toast.error("Complete at least one exchange first");
      return;
    }

    setIsAiLoading(true);
    try {
      const opponent = DEFENSE_OPPONENTS.find(o => o.id === currentSession.opponent_id);
      
      const { data, error } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "verdict",
          messages,
          opponentName: opponent?.name || currentSession.opponent_name,
          topicName: currentSession.topic_name,
        },
      });

      if (error) throw error;
      setVerdict(data);

      await supabase
        .from("debate_challenge_sessions")
        .update({
          messages: messages as unknown as any,
          completed_at: new Date().toISOString(),
          xp_earned: data.xp || 100,
          outcome: data.outcome || "draw",
          ai_verdict: data.verdict,
          rounds_completed: messages.filter(m => m.role === "defender").length,
        })
        .eq("id", currentSession.id);

      const today = new Date().toISOString().split("T")[0];
      const newStreak = enrollment.last_activity_date === today ? enrollment.streak : 
        (daysSince(enrollment.last_activity_date) <= 2 ? enrollment.streak + 1 : 1);

      await supabase
        .from("debate_challenge_enrollments")
        .update({
          completed_days: enrollment.completed_days + 1,
          current_day: Math.min(enrollment.current_day + 1, 40),
          total_xp: enrollment.total_xp + (data.xp || 100),
          streak: newStreak,
          longest_streak: Math.max(enrollment.longest_streak, newStreak),
          last_activity_date: today,
          status: enrollment.current_day >= 40 ? "completed" : "active",
          completed_at: enrollment.current_day >= 40 ? new Date().toISOString() : null,
        })
        .eq("id", enrollment.id);

      if (data.badge && user) {
        await supabase.from("debate_challenge_badges").insert({
          user_id: user.id,
          enrollment_id: enrollment.id,
          badge_type: data.badge.type,
          badge_name: data.badge.name,
          badge_icon: data.badge.icon,
          badge_description: data.badge.description,
        });
      }

      setPhase("verdict");
      loadData();

    } catch (err: any) {
      toast.error(err.message || "Failed to get verdict");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Rematch on a draw — keep the drawn session, create a fresh one (max 1 rematch per day)
  const startRematch = async () => {
    if (!currentSession || !enrollment || !user) return;

    const dayNumber = currentSession.day_number;
    const dayConfig = schedule[dayNumber - 1];
    if (!dayConfig) return;

    const opponent = DEFENSE_OPPONENTS.find(o => o.id === dayConfig.opponentId);
    const topic = DEFENSE_TOPICS.find(t => t.id === dayConfig.topicId);
    if (!opponent || !topic) return;

    // Guard: only one rematch allowed per day
    const sessionsForDay = sessions.filter(s => s.day_number === dayNumber);
    if (sessionsForDay.length >= 2) {
      toast.error("You've already used your rematch for this day.");
      return;
    }

    setIsAiLoading(true);
    try {
      // Roll back enrollment progress that endDebate advanced
      await supabase
        .from("debate_challenge_enrollments")
        .update({
          completed_days: Math.max(0, enrollment.completed_days - 1),
          current_day: Math.max(1, enrollment.current_day - 1),
          total_xp: Math.max(0, enrollment.total_xp - (verdict?.xp || 0)),
        })
        .eq("id", enrollment.id);

      // Create a new session for the rematch (drawn session stays as history)
      const { data: newSession, error: sessionError } = await supabase
        .from("debate_challenge_sessions")
        .insert({
          enrollment_id: enrollment.id,
          user_id: user.id,
          day_number: dayNumber,
          opponent_id: opponent.id,
          opponent_name: opponent.name,
          topic_id: topic.id,
          topic_name: topic.name,
          difficulty: enrollment.difficulty,
        })
        .select()
        .single();
      if (sessionError) throw sessionError;

      // Reset local state
      setMessages([]);
      setVerdict(null);
      setCurrentSession(newSession);
      setSealedTurns(new Set());
      setTurnAnalyses([]);

      // Get opponent's opening attack
      const { data: aiData, error: aiError } = await supabase.functions.invoke("forty-day-debate", {
        body: {
          action: "open",
          opponentWorldview: opponent.worldview,
          opponentStyle: opponent.argumentStyle,
          opponentName: opponent.name,
          opponentPronouns: opponent.pronouns,
          topicName: topic.name,
          topicDescription: topic.description,
          difficulty: enrollment.difficulty,
        },
      });
      if (aiError) throw aiError;

      const opening: ChatMessage = { role: "opponent", content: aiData.response };
      setMessages([opening]);
      setPhase("debating");

      await supabase
        .from("debate_challenge_sessions")
        .update({ messages: [opening] as unknown as any })
        .eq("id", newSession.id);

      triggerTurnAnalysis(newSession.id, 0, "opponent", [opening], opponent.name, topic.name);

      await loadData();
    } catch (err: any) {
      console.error("Rematch error:", err);
      toast.error("Failed to start rematch. Try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Load sealed turn analyses for a session (for debrief)
  const loadTurnAnalyses = async (sessionId: string) => {
    try {
      const { data } = await supabase
        .from("debate_turn_analyses")
        .select("*")
        .eq("session_id", sessionId)
        .order("turn_index");
      setTurnAnalyses((data as TurnAnalysis[]) || []);
    } catch (err) {
      console.error("Failed to load turn analyses:", err);
    }
  };

  // Open the Tactical Debrief page
  const openDebrief = (session: any) => {
    setReviewSession(session);
    setMessages((session.messages as ChatMessage[]) || []);
    setExpandedTurnAnalysis(null);
    loadTurnAnalyses(session.id);
    setPhase("debrief");
  };

  const reviewDebate = (session: any) => {
    setReviewSession(session);
    setMessages((session.messages as ChatMessage[]) || []);
    setJeevesRecap(null);
    setPhase("review");
  };

  const isRecapComplete = (text: string): boolean => {
    const finalMarkers = ["Study Assignment", "## 📚", "## 9.", "🏆 Final Verdict"];
    const hasFinalSection = finalMarkers.some(marker => text.includes(marker));
    const lastLine = text.trim().split("\n").pop() || "";
    const endsCleanly = lastLine.endsWith(".") || lastLine.endsWith(")") || lastLine.endsWith('"') || lastLine.endsWith("*") || lastLine.endsWith("|") || lastLine.endsWith("---");
    return hasFinalSection && endsCleanly;
  };

  const fetchJeevesRecap = async (session: any, forceRegenerate = false) => {
    setIsRecapLoading(true);
    setJeevesRecap("⏳ Generating your full forensic tactical analysis... This may take 1-2 minutes for a thorough breakdown.");
    try {
      const opponent = DEFENSE_OPPONENTS.find(o => o.id === session.opponent_id);
      const dName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Defender";

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forty-day-debate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "recap",
          messages: session.messages || [],
          opponentName: opponent?.name || session.opponent_name,
          topicName: session.topic_name,
          defenderName: dName,
          sessionId: session.id,
          forceRegenerate,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) { toast.error("Rate limited — please wait a moment and try again."); return; }
        if (resp.status === 402) { toast.error("AI credits depleted. Please add credits in your workspace settings."); return; }
        throw new Error(`Analysis failed (${resp.status})`);
      }

      const result = await resp.json();
      
      if (result.status === "ready" && result.analysis) {
        setJeevesRecap(result.analysis);
        return;
      }

      const pollAnalysisId = result.analysisId;
      if (!pollAnalysisId) throw new Error("No analysis ID returned");

      let attempts = 0;
      const maxAttempts = 40;
      
      const poll = async (): Promise<string | null> => {
        while (attempts < maxAttempts) {
          attempts++;
          await new Promise(r => setTimeout(r, 5000));
          
          try {
            const statusResp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/forty-day-debate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({
                action: "recap-status",
                analysisId: pollAnalysisId,
              }),
            });

            if (!statusResp.ok) continue;
            const statusResult = await statusResp.json();
            
            if (statusResult.status === "ready" && statusResult.analysis) {
              return statusResult.analysis;
            }
            if (statusResult.status === "error") {
              throw new Error(statusResult.error || "Analysis generation failed");
            }
            
            setJeevesRecap(`⏳ Generating your full forensic tactical analysis... (${attempts * 5}s elapsed). Jeeves is meticulously reviewing every argument.`);
          } catch (pollErr) {
            console.warn("Poll error (retrying):", pollErr);
          }
        }
        return null;
      };

      const analysis = await poll();
      if (analysis) {
        setJeevesRecap(analysis);
      } else {
        throw new Error("Analysis timed out. Please try again.");
      }
    } catch (err: any) {
      console.error("Jeeves recap error:", err);
      const msg = err?.message || "Failed to load Jeeves analysis.";
      if (!msg.includes("402") && !msg.includes("429")) {
        toast.error(msg);
      }
      setJeevesRecap(null);
    } finally {
      setIsRecapLoading(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ─── OVERVIEW / ENROLLMENT ────────────────────────────────
  if (phase === "overview" || phase === "enroll") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-red-500/30 bg-gradient-to-br from-red-950/20 via-background to-amber-950/20 overflow-hidden">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Flame className="h-10 w-10 text-red-500" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  40 Days of Smoke
                </h2>
                <Flame className="h-10 w-10 text-amber-500" />
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                Face a different AI opponent every day for 40 days. You won't know who you're facing until the debate begins.
                Defend the faith. Earn XP. Forge your theological steel.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Swords className="h-5 w-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-red-300">40 Debates</p>
                  <p className="text-[10px] text-muted-foreground">Blind matchups</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-amber-300">XP & Badges</p>
                  <p className="text-[10px] text-muted-foreground">Gamified progress</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Shield className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-purple-300">2-Day Grace</p>
                  <p className="text-[10px] text-muted-foreground">Miss up to 2 days</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Choose Your Level</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "beginner", label: "Beginner", icon: "🛡️", desc: "Jeeves coaches you live" },
                    { id: "intermediate", label: "Intermediate", icon: "⚔️", desc: "Ask Jeeves on demand" },
                    { id: "advanced", label: "Advanced", icon: "🔥", desc: "Jeeves reviews after only" },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDifficulty(d.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedDifficulty === d.id
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-lg">{d.icon}</span>
                      <p className="text-xs font-bold mt-1">{d.label}</p>
                      <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleEnroll}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold mt-4"
                size="lg"
              >
                <Flame className="h-5 w-5 mr-2" />
                Begin the 40-Day Challenge
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── DAILY MAP ────────────────────────────────────────────
  if (phase === "daily-map") {
    const xpLevel = getXPLevel(enrollment?.total_xp || 0);
    const completedDays = sessions.filter(s => s.completed_at).map(s => s.day_number);
    const todayNumber = enrollment?.current_day || 1;
    const todaySession = sessions.find(s => s.day_number === todayNumber);
    const isInProgress = todaySession && !todaySession.completed_at && !isDebateExpired(todaySession);
    const windowOpen = isDebateWindowOpen();
    const canDebateToday = windowOpen && !completedDays.includes(todayNumber) && (!todaySession || isInProgress);

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{xpLevel.emoji}</span>
                <div>
                  <p className="text-sm font-bold">{xpLevel.title}</p>
                  <p className="text-xs text-muted-foreground">Level {xpLevel.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{enrollment?.total_xp || 0} XP</p>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Flame className="h-3 w-3" />
                  <span>{enrollment?.streak || 0} day streak</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Day {todayNumber} / 40 {getDayDate(todayNumber) && `· ${getDayDate(todayNumber)}`}</span>
                <span>{Math.round((completedDays.length / 40) * 100)}% complete</span>
              </div>
              <Progress value={(completedDays.length / 40) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <Badge key={b.id} variant="outline" className="gap-1 border-amber-500/40 text-amber-300">
                <span>{b.badge_icon}</span>
                <span className="text-[10px]">{b.badge_name}</span>
              </Badge>
            ))}
          </div>
        )}

        {!windowOpen && !completedDays.includes(todayNumber) && (
          <Card className="border-muted-foreground/20 bg-muted/10">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-muted-foreground mb-1">
                🌅 Day {todayNumber} — Smoke drops at 6:00 AM
              </p>
              <p className="text-xs text-muted-foreground">
                A new opponent and a fresh doctrine will be waiting. Get some rest — your next debate opens in {getTimeUntil6am()}.
              </p>
            </CardContent>
          </Card>
        )}

        {canDebateToday && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="border-red-500/40 bg-gradient-to-r from-red-950/30 to-amber-950/30">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-bold text-red-300 mb-1">
                  {isInProgress ? "Day " + todayNumber + " — Debate In Progress" : "🔥 Day " + todayNumber + " — Today's Smoke Is Ready"}
                  {getDayDate(todayNumber) && <span className="text-red-300/60 ml-1">({getDayDate(todayNumber)})</span>}
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  {isInProgress
                    ? "Pick up where you left off. Take your time — respond when you're ready."
                    : "A new opponent and a new doctrine await. You won't know who you're facing until the debate begins."}
                </p>
                <p className="text-[10px] text-amber-400 mb-3 flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Arena open 6 AM — midnight • {getTimeUntilMidnight()} remaining
                </p>
                <Button
                  onClick={() => startDayDebate(todayNumber)}
                  className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
                  disabled={isAiLoading}
                >
                  {isAiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isInProgress ? (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  ) : (
                    <Swords className="h-4 w-4 mr-2" />
                  )}
                  {isInProgress ? "Resume Debate" : "Enter the Arena"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Progress Map
            </h3>
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 40 }, (_, i) => {
                const dayNum = i + 1;
                const session = sessions.find(s => s.day_number === dayNum);
                const isCompleted = !!session?.completed_at;
                const isExpired = session?.outcome === "expired";
                const isSessionInProgress = session && !session.completed_at && !isDebateExpired(session);
                const isCurrent = dayNum === todayNumber && !isCompleted;
                const isLocked = dayNum > todayNumber;
                const won = session?.outcome === "win";
                const lost = session?.outcome === "loss";

                return (
                  <button
                    key={dayNum}
                    title={`Day ${dayNum}${getDayDate(dayNum) ? ` · ${getDayDate(dayNum)}` : ""}${won ? " — Win" : lost ? " — Loss" : isExpired ? " — Expired" : ""}`}
                    onClick={() => {
                      if (isCurrent || isSessionInProgress) startDayDebate(dayNum);
                      else if (isCompleted && session) reviewDebate(session);
                    }}
                    disabled={isLocked}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-[10px] font-bold
                      transition-all relative
                      ${isCompleted && won ? "bg-green-500/20 border border-green-500/40 text-green-300" : ""}
                      ${isCompleted && lost ? "bg-red-500/20 border border-red-500/40 text-red-300" : ""}
                      ${isExpired ? "bg-muted/30 border border-muted-foreground/30 text-muted-foreground" : ""}
                      ${isCompleted && !won && !lost && !isExpired ? "bg-amber-500/20 border border-amber-500/40 text-amber-300" : ""}
                      ${isSessionInProgress ? "bg-blue-500/20 border-2 border-blue-500/40 text-blue-300 animate-pulse" : ""}
                      ${isCurrent && !isSessionInProgress ? "bg-primary/20 border-2 border-primary text-primary animate-pulse" : ""}
                      ${isLocked ? "bg-muted/20 border border-border text-muted-foreground/40" : ""}
                    `}
                  >
                    {isSessionInProgress ? (
                      <RotateCcw className="h-3 w-3" />
                    ) : isCompleted ? (
                      isExpired ? <XCircle className="h-3 w-3" /> :
                      won ? <CheckCircle2 className="h-3 w-3" /> : lost ? <XCircle className="h-3 w-3" /> : <Star className="h-3 w-3" />
                    ) : isLocked ? (
                      <Lock className="h-2.5 w-2.5" />
                    ) : (
                      dayNum
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-400" /> Win</span>
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Loss</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /> Draw</span>
              <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3 text-blue-400" /> In Progress</span>
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Locked</span>
            </div>
          </CardContent>
        </Card>

        {/* Restart Challenge */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Restart 40 Days of Smoke
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Restart the Challenge?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This will archive your current progress and start a completely fresh 40-day challenge with new opponent matchups.</p>
                <p className="font-medium text-foreground">Current progress: Day {todayNumber}/40 • {completedDays.length} debates completed • {enrollment?.total_xp || 0} XP earned</p>
                <p className="text-destructive/80 text-xs">⚠️ This cannot be undone. Your previous run will be archived but no longer active.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Going</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRestart}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart Challenge
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── DEBATING ─────────────────────────────────────────────
  if (phase === "debating" && currentSession) {
    const opponent = DEFENSE_OPPONENTS.find(o => o.id === currentSession.opponent_id);
    const defenderRounds = messages.filter(m => m.role === "defender").length;
    const sealedCount = sealedTurns.size;

    return (
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setPhase("daily-map"); setCurrentSession(null); }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {opponent?.avatar && (
              <img src={opponent.avatar} alt={opponent.name} className="h-10 w-10 rounded-full object-cover border-2 border-red-500/40 shrink-0" />
            )}
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                Day {currentSession.day_number} — {opponent?.name || "Unknown Opponent"}
                <Badge variant="outline" className="text-[10px]">
                  {currentSession.difficulty}
                </Badge>
              </p>
              <p className="text-[10px] text-muted-foreground">
                Topic: {currentSession.topic_name}
              </p>
              <p className="text-[10px] text-amber-400 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                Arena: 6 AM — midnight • {getTimeUntilMidnight()} left
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Sealed scroll counter */}
            {sealedCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                <ScrollText className="h-3 w-3 text-purple-400" />
                <span className="text-[10px] font-bold text-purple-300">{sealedCount} sealed</span>
              </div>
            )}
            {defenderRounds >= 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={endDebate}
                disabled={isAiLoading}
                className="text-xs"
              >
                <Target className="h-3 w-3 mr-1" />
                End & Judge
              </Button>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={`flex ${msg.role === "defender" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      msg.role === "defender"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {msg.role === "opponent" ? (
                          <>
                            {opponent?.avatar ? (
                              <img src={opponent.avatar} alt="" className="h-5 w-5 rounded-full object-cover border border-red-500/40" />
                            ) : (
                              <span className="text-xs">{opponent?.emoji || "👤"}</span>
                            )}
                            <span className="text-[10px] font-bold text-red-300">{opponent?.name || "Opponent"}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary">You</span>
                          </>
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  {/* Sealed Envelope Badge */}
                  {sealedTurns.has(i) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`flex ${msg.role === "defender" ? "justify-end" : "justify-start"} mt-1`}
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25">
                        <ScrollText className="h-3 w-3 text-purple-400" />
                        <span className="text-[9px] font-medium text-purple-300">
                          📜 Jeeves has analyzed this — sealed until debrief
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                  <span className="text-xs text-muted-foreground">Opponent is responding...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Jeeves Coaching Panel */}
        {showJeevesPanel && (enrollment?.difficulty === "beginner" || enrollment?.difficulty === "intermediate") && (
          <div className="mx-3 mb-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-blue-300 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Jeeves — Debate Coach
              </p>
              <button onClick={() => setShowJeevesPanel(false)} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>
            </div>
            {isJeevesLoading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                <span className="text-[10px] text-muted-foreground">Jeeves is analyzing...</span>
              </div>
            ) : jeevesCoaching ? (
              <div className="prose prose-sm prose-invert max-w-none text-[11px] leading-relaxed text-blue-200/80">
                <ReactMarkdown>{jeevesCoaching}</ReactMarkdown>
              </div>
            ) : null}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border">
          {enrollment?.difficulty === "intermediate" && !showJeevesPanel && messages.length >= 2 && (
            <div className="mb-2 flex gap-2">
              <input
                value={jeevesInput}
                onChange={e => setJeevesInput(e.target.value)}
                placeholder="Ask Jeeves for coaching..."
                className="flex-1 rounded-md bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAskJeeves();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAskJeeves}
                disabled={isJeevesLoading}
                className="text-[10px] border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Ask Jeeves
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Defend the faith... Use Scripture, reason clearly, and stand firm."
              className="min-h-[100px] max-h-[220px] resize-y text-sm"
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendReply();
                }
              }}
            />
            <Button
              onClick={sendReply}
              disabled={!userInput.trim() || isAiLoading}
              size="icon"
              className="h-[100px] w-[60px] shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            Round {defenderRounds + 1} • {enrollment?.difficulty === "beginner" ? "Jeeves is coaching you" : enrollment?.difficulty === "intermediate" ? "Ask Jeeves when you need help" : "Jeeves will review after the debate"} • Arena closes at midnight
          </p>
        </div>
      </div>
    );
  }

  // ─── VERDICT ──────────────────────────────────────────────
  if (phase === "verdict" && verdict) {
    const outcomeConfig = {
      win: { color: "text-green-400", bg: "from-green-950/30", icon: Trophy, label: "VICTORY" },
      loss: { color: "text-red-400", bg: "from-red-950/30", icon: XCircle, label: "DEFEAT" },
      draw: { color: "text-amber-400", bg: "from-amber-950/30", icon: Star, label: "DRAW" },
    };
    const oc = outcomeConfig[verdict.outcome as keyof typeof outcomeConfig] || outcomeConfig.draw;
    const Icon = oc.icon;

    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className={`border-${verdict.outcome === "win" ? "green" : verdict.outcome === "loss" ? "red" : "amber"}-500/30 bg-gradient-to-br ${oc.bg} to-background`}>
            <CardContent className="p-6 text-center space-y-4">
              <Icon className={`h-16 w-16 mx-auto ${oc.color}`} />
              <h2 className={`text-3xl font-black ${oc.color}`}>{oc.label}</h2>
              <p className="text-muted-foreground text-sm">{verdict.verdict}</p>
              {verdict.jeeves_note && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-300 italic flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span>Jeeves: {verdict.jeeves_note}</span>
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-6 py-3">
                <div>
                  <p className="text-2xl font-bold text-primary">+{verdict.xp}</p>
                  <p className="text-[10px] text-muted-foreground">XP Earned</p>
                </div>
                {verdict.badge && (
                  <div className="text-center">
                    <p className="text-2xl">{verdict.badge.icon}</p>
                    <p className="text-[10px] text-amber-300 font-bold">{verdict.badge.name}</p>
                  </div>
                )}
              </div>

              {verdict.strengths?.length > 0 && (
                <div className="text-left bg-green-500/5 rounded-lg p-3 border border-green-500/20">
                  <p className="text-xs font-bold text-green-300 mb-1">💪 Strengths</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {verdict.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {verdict.improvements?.length > 0 && (
                <div className="text-left bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-300 mb-1">📈 Areas to Sharpen</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {verdict.improvements.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Zap className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {verdict.killer_argument && (
                <div className="text-left bg-red-500/5 rounded-lg p-3 border border-red-500/20">
                  <p className="text-xs font-bold text-red-300 mb-1">⚔️ Debate Ender — The Killer Argument</p>
                  <p className="text-xs text-muted-foreground">{verdict.killer_argument}</p>
                </div>
              )}

              {verdict.debate_ender_tip && (
                <div className="text-left bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs font-bold text-blue-300 mb-1">🎯 Stop the Circles</p>
                  <p className="text-xs text-muted-foreground">{verdict.debate_ender_tip}</p>
                </div>
              )}

              {/* Sealed Scrolls CTA */}
              {currentSession && (
                <Button
                  onClick={() => openDebrief(currentSession)}
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
                  size="lg"
                >
                  <Unlock className="h-5 w-5 mr-2" />
                  Unseal Jeeves's Tactical Debrief
                </Button>
              )}

              <Button
                onClick={() => {
                  if (currentSession) {
                    reviewDebate(currentSession);
                  } else {
                    setPhase("daily-map");
                  }
                }}
                variant="outline"
                className="w-full mt-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                Review Full Debate
              </Button>
              {/* Share as Public */}
              {currentSession?.completed_at && (
                <Button
                  onClick={() => togglePublicDebate(currentSession.id, currentSession.is_public)}
                  variant="outline"
                  className="w-full mt-2"
                  disabled={sharingSessionId === currentSession.id}
                >
                  {sharingSessionId === currentSession.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : currentSession.is_public ? (
                    <Globe className="h-4 w-4 mr-2 text-green-400" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  {currentSession.is_public ? "Debate is Public — Tap to Make Private" : "Make Debate Public & Share"}
                </Button>
              )}
              {/* Rematch button — only on draws, max 1 rematch per day */}
              {verdict.outcome === "draw" && (() => {
                const sessionsForDay = sessions.filter(s => s.day_number === currentSession?.day_number);
                const rematchAvailable = sessionsForDay.length < 2;
                return rematchAvailable ? (
                  <Button
                    onClick={startRematch}
                    disabled={isAiLoading}
                    className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold"
                    size="lg"
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Swords className="h-5 w-5 mr-2" />
                    )}
                    Rematch — Settle the Score!
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Rematch already used for this day.
                  </p>
                );
              })()}
              <Button onClick={() => setPhase("daily-map")} className="w-full mt-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Progress Map
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── TACTICAL DEBRIEF (Sealed Scrolls Revealed) ──────────
  if (phase === "debrief" && reviewSession) {
    const opponent = DEFENSE_OPPONENTS.find(o => o.id === reviewSession.opponent_id);
    const reviewMessages = (reviewSession.messages as ChatMessage[]) || [];
    const analysesReady = turnAnalyses.filter(a => a.status === "ready").length;
    const totalTurns = reviewMessages.length;

    return (
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setPhase("daily-map"); setReviewSession(null); setTurnAnalyses([]); }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(200 80% 55%))" }}>
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "hsl(270 80% 80%)" }}>
                Tactical Debrief — Day {reviewSession.day_number}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {opponent?.name || reviewSession.opponent_name} • {reviewSession.topic_name} • {analysesReady}/{totalTurns} analyses
              </p>
            </div>
          </div>
        </div>

        {/* Full Tactical Analysis Button */}
        <div className="p-3 border-b border-border">
          {jeevesRecap ? (
            <div className="relative text-left rounded-xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(270 80% 60% / 0.6), hsl(200 90% 50% / 0.4), hsl(330 80% 55% / 0.4))" }}>
              <div className="rounded-xl p-4 backdrop-blur-xl"
                style={{ background: "linear-gradient(135deg, hsl(270 50% 15% / 0.85), hsl(220 40% 12% / 0.9))" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4" style={{ color: "hsl(270 80% 75%)" }} />
                    <p className="text-xs font-bold" style={{ color: "hsl(270 80% 80%)" }}>
                      Full Tactical Analysis
                    </p>
                  </div>
                  <button
                    onClick={() => fetchJeevesRecap(reviewSession, true)}
                    disabled={isRecapLoading}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors hover:bg-white/10 disabled:opacity-40"
                    style={{ color: "hsl(200 60% 70%)" }}
                  >
                    {isRecapLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                    Regenerate
                  </button>
                </div>
                <ScrollArea className="max-h-[70vh]">
                  <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed
                    [&_h2]:text-[13px] [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-purple-500/20
                    [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_strong]:font-semibold
                    [&_ul]:space-y-1 [&_li]:leading-relaxed"
                    style={{ color: "hsl(220 20% 85%)" }}>
                    <ReactMarkdown>{jeevesRecap}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fetchJeevesRecap(reviewSession)}
              disabled={isRecapLoading}
              className="w-full relative rounded-xl p-[1px] overflow-hidden group disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, hsl(270 80% 60% / 0.5), hsl(200 90% 50% / 0.3), hsl(330 80% 55% / 0.3))" }}
            >
              <div className="rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all group-hover:brightness-125"
                style={{ background: "linear-gradient(135deg, hsl(270 50% 18% / 0.9), hsl(220 40% 14% / 0.95))" }}>
                {isRecapLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: "hsl(270 80% 75%)" }} />
                    <span className="text-sm font-medium" style={{ color: "hsl(270 80% 80%)" }}>Generating full analysis...</span>
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5" style={{ color: "hsl(270 80% 75%)" }} />
                    <span className="text-sm font-medium" style={{ color: "hsl(270 80% 80%)" }}>Generate Full Tactical Analysis</span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Debate Transcript with Unsealed Per-Turn Analyses */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {reviewMessages.map((msg, i) => {
              const turnAnalysis = turnAnalyses.find(a => a.turn_index === i);
              const isExpanded = expandedTurnAnalysis === i;

              return (
                <div key={i}>
                  {/* Message bubble */}
                  <div className={`flex ${msg.role === "defender" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      msg.role === "defender"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {msg.role === "opponent" ? (
                          <>
                            {opponent?.avatar ? (
                              <img src={opponent.avatar} alt="" className="h-5 w-5 rounded-full object-cover border border-red-500/40" />
                            ) : (
                              <span className="text-xs">{opponent?.emoji || "👤"}</span>
                            )}
                            <span className="text-[10px] font-bold text-red-300">{opponent?.name || "Opponent"}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary">You</span>
                          </>
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* Unsealed Analysis Card */}
                  {turnAnalysis?.status === "ready" && turnAnalysis.analysis_text && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-2 ${msg.role === "defender" ? "ml-4" : "mr-4"}`}
                    >
                      <button
                        onClick={() => setExpandedTurnAnalysis(isExpanded ? null : i)}
                        className={`w-full text-left rounded-lg p-[1px] overflow-hidden transition-all ${
                          msg.role === "opponent"
                            ? "bg-gradient-to-r from-red-500/30 to-purple-500/30"
                            : "bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                        }`}
                      >
                        <div className={`rounded-lg px-3 py-2 ${
                          msg.role === "opponent"
                            ? "bg-red-950/60"
                            : "bg-blue-950/60"
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Unlock className="h-3 w-3 text-purple-400" />
                              <span className="text-[10px] font-bold text-purple-300">
                                {msg.role === "opponent" ? "🔍 Jeeves's Attack Breakdown" : "📋 Jeeves's Defense Evaluation"}
                              </span>
                            </div>
                            <ChevronRight className={`h-3 w-3 text-purple-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className={`mt-1 rounded-lg p-3 border ${
                              msg.role === "opponent"
                                ? "bg-red-950/30 border-red-500/20"
                                : "bg-blue-950/30 border-blue-500/20"
                            }`}>
                              <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed
                                [&_h2]:text-[12px] [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1
                                [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1
                                [&_strong]:font-semibold [&_ul]:space-y-0.5"
                                style={{ color: "hsl(220 20% 85%)" }}>
                                <ReactMarkdown>{turnAnalysis.analysis_text}</ReactMarkdown>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Still processing indicator */}
                  {turnAnalysis?.status === "processing" && (
                    <div className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/5 border border-purple-500/15 ${msg.role === "defender" ? "ml-4" : "mr-4"}`}>
                      <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                      <span className="text-[9px] text-purple-300">Jeeves is still analyzing this turn...</span>
                    </div>
                  )}

                  {/* No analysis available */}
                  {!turnAnalysis && (
                    <div className={`mt-1 flex items-center gap-1.5 px-2 ${msg.role === "defender" ? "ml-4" : "mr-4"}`}>
                      <span className="text-[9px] text-muted-foreground/50">No real-time analysis for this turn</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Verdict Summary */}
            {reviewSession.ai_verdict && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                <p className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Jeeves's Verdict
                </p>
                <p className="text-xs text-muted-foreground">{reviewSession.ai_verdict}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border flex gap-2">
          <Button onClick={() => { setPhase("daily-map"); setReviewSession(null); setTurnAnalyses([]); }} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
          <Button onClick={() => reviewDebate(reviewSession)} variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Simple Review
          </Button>
        </div>
      </div>
    );
  }

  // ─── REVIEW (legacy simple view) ─────────────────────────
  if (phase === "review" && reviewSession) {
    const opponent = DEFENSE_OPPONENTS.find(o => o.id === reviewSession.opponent_id);
    const reviewMessages = (reviewSession.messages as ChatMessage[]) || [];

    return (
      <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setPhase("daily-map"); setReviewSession(null); setJeevesRecap(null); }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {opponent?.avatar && (
              <img src={opponent.avatar} alt={opponent.name} className="h-10 w-10 rounded-full object-cover border-2 border-red-500/40 shrink-0" />
            )}
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                Day {reviewSession.day_number} — {opponent?.name || reviewSession.opponent_name}
                <Badge variant={reviewSession.outcome === "win" ? "default" : reviewSession.outcome === "loss" ? "destructive" : "secondary"} className="text-[10px]">
                  {reviewSession.outcome?.toUpperCase() || "N/A"}
                </Badge>
              </p>
              <p className="text-[10px] text-muted-foreground">
                Topic: {reviewSession.topic_name} • {reviewSession.rounds_completed} rounds
              </p>
            </div>
          </div>
        </div>

        {/* Debrief CTA */}
        <div className="p-3 border-b border-border">
          <Button
            onClick={() => openDebrief(reviewSession)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
          >
            <Unlock className="h-4 w-4 mr-2" />
            Open Tactical Debrief (Sealed Analyses)
          </Button>
        </div>

        {/* Jeeves Tactical Analysis - Glassmorphism style */}
        <div className="p-3 border-b border-border">
          {jeevesRecap ? (
            <div className="relative text-left rounded-xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(270 80% 60% / 0.6), hsl(200 90% 50% / 0.4), hsl(330 80% 55% / 0.4))" }}>
              <div className="rounded-xl p-4 backdrop-blur-xl"
                style={{ background: "linear-gradient(135deg, hsl(270 50% 15% / 0.85), hsl(220 40% 12% / 0.9))" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(200 80% 55%))" }}>
                      <Crown className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "hsl(270 80% 80%)" }}>
                        Jeeves's Tactical Analysis
                      </p>
                      <p className="text-[9px]" style={{ color: "hsl(200 60% 70%)" }}>
                        Post-debate analysis & coaching
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); fetchJeevesRecap(reviewSession, true); }}
                    disabled={isRecapLoading}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors hover:bg-white/10 disabled:opacity-40"
                    style={{ color: "hsl(200 60% 70%)" }}
                    title="Regenerate full analysis"
                  >
                    {isRecapLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                    Regenerate
                  </button>
                </div>
                <ScrollArea className="max-h-[70vh]">
                  <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed
                    [&_h2]:text-[13px] [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-purple-500/20
                    [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_strong]:font-semibold
                    [&_ul]:space-y-1 [&_li]:leading-relaxed"
                    style={{ color: "hsl(220 20% 85%)" }}>
                    <ReactMarkdown>{jeevesRecap}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fetchJeevesRecap(reviewSession)}
              disabled={isRecapLoading}
              className="w-full relative rounded-xl p-[1px] overflow-hidden group disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, hsl(270 80% 60% / 0.5), hsl(200 90% 50% / 0.3), hsl(330 80% 55% / 0.3))" }}
            >
              <div className="rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all group-hover:brightness-125"
                style={{ background: "linear-gradient(135deg, hsl(270 50% 18% / 0.9), hsl(220 40% 14% / 0.95))" }}>
                {isRecapLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: "hsl(270 80% 75%)" }} />
                    <span className="text-sm font-medium" style={{ color: "hsl(270 80% 80%)" }}>Jeeves is analyzing the debate...</span>
                  </>
                ) : (
                  <>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(200 80% 55%))" }}>
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "hsl(270 80% 80%)" }}>Show Jeeves's Tactical Analysis</span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Transcript */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {reviewMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "defender" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === "defender"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-red-500/10 border border-red-500/20"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {msg.role === "opponent" ? (
                      <>
                        {opponent?.avatar ? (
                          <img src={opponent.avatar} alt="" className="h-5 w-5 rounded-full object-cover border border-red-500/40" />
                        ) : (
                          <span className="text-xs">{opponent?.emoji || "👤"}</span>
                        )}
                        <span className="text-[10px] font-bold text-red-300">{opponent?.name || "Opponent"}</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary">You</span>
                      </>
                    )}
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {reviewSession.ai_verdict && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                <p className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Jeeves's Verdict
                </p>
                <p className="text-xs text-muted-foreground">{reviewSession.ai_verdict}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border space-y-2">
          {reviewSession.completed_at && (
            <Button
              onClick={() => togglePublicDebate(reviewSession.id, reviewSession.is_public)}
              variant="outline"
              className="w-full"
              disabled={sharingSessionId === reviewSession.id}
            >
              {sharingSessionId === reviewSession.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : reviewSession.is_public ? (
                <Globe className="h-4 w-4 mr-2 text-green-400" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {reviewSession.is_public ? "Public — Tap to Make Private" : "Make Public & Share"}
            </Button>
          )}
          <Button onClick={() => { setPhase("daily-map"); setReviewSession(null); setJeevesRecap(null); }} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Progress Map
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}
