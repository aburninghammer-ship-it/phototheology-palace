import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2, ArrowLeft, Trophy, Users, Plus, LogIn,
  Send, Heart, Flame, BookOpen, MessageSquare, Copy, Check,
  AlertTriangle, Lock, ChevronDown, ChevronUp, HandHeart, Landmark,
  Timer, Play, Pause, Square, TrendingUp, Ear, PenLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DEATH_CHAMBER_DAYS,
  DEATH_CHAMBER_WEEKS,
  DEATH_CHAMBER_WELCOME,
  DEATH_CHAMBER_COMPLETION,
  DeathChamberDay,
} from "@/data/deathChamberProgram";

type View = "welcome" | "mode-select" | "solo" | "group-lobby" | "active" | "tomb-space" | "completion";
type MessageType = "reflection" | "encouragement" | "prayer" | "testimony" | "question";

interface DayProgress {
  day_number: number;
  completed_at: string;
  reflection: string;
}

interface GroupInfo {
  id: string;
  name: string;
  room_code: string;
  created_by: string;
  current_day: number;
  started_at: string | null;
}

interface GroupMember {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  days_completed: number;
}

interface TombMessage {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  message_type: MessageType;
  day_number: number | null;
  content: string;
  created_at: string;
  reactions?: { reaction: string; count: number; user_reacted: boolean }[];
}

export const DeathChamber = () => {
  const [view, setView] = useState<View>("welcome");
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ display_name: string; avatar_url: string | null } | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [progress, setProgress] = useState<DayProgress[]>([]);
  const [reflection, setReflection] = useState("");
  const [spiritJournal, setSpiritJournal] = useState("");
  const [surrenderDone, setSurrenderDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerGoalMinutes, setTimerGoalMinutes] = useState(15);
  const [sessionMeditationMinutes, setSessionMeditationMinutes] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [meditationHistory, setMeditationHistory] = useState<{ day: number; minutes: number }[]>([]);

  // Group state
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Tomb Space state
  const [tombMessages, setTombMessages] = useState<TombMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("reflection");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId && (view === "active" || view === "solo")) {
      fetchProgress();
    }
  }, [userId, view, groupInfo?.id]);

  useEffect(() => {
    if (groupInfo?.id && view === "tomb-space") {
      fetchTombMessages();
      const channel = supabase
        .channel(`tomb-space-${groupInfo.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'tomb_space_messages',
          filter: `group_id=eq.${groupInfo.id}`,
        }, (payload) => {
          setTombMessages(prev => [...prev, payload.new as any]);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [groupInfo?.id, view]);

  // Timer effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Load meditation history from localStorage
  useEffect(() => {
    if (userId) {
      const stored = localStorage.getItem(`dc_meditation_history_${userId}`);
      if (stored) {
        try { setMeditationHistory(JSON.parse(stored)); } catch {}
      }
    }
  }, [userId]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const stopTimer = () => {
    setTimerRunning(false);
    const minutes = Math.round(timerSeconds / 60);
    if (minutes > 0) {
      setSessionMeditationMinutes(prev => prev + minutes);
    }
    setTimerSeconds(0);
  };

  const saveMeditationTime = (minutes: number) => {
    if (!userId || minutes === 0) return;
    const updated = [...meditationHistory.filter(h => h.day !== currentDay), { day: currentDay, minutes }];
    setMeditationHistory(updated);
    localStorage.setItem(`dc_meditation_history_${userId}`, JSON.stringify(updated));
  };

  const totalMeditationMinutes = meditationHistory.reduce((sum, h) => sum + h.minutes, 0);
  const averageMeditationMinutes = meditationHistory.length > 0
    ? Math.round(totalMeditationMinutes / meditationHistory.length)
    : 0;
  const longestSession = meditationHistory.length > 0
    ? Math.max(...meditationHistory.map(h => h.minutes))
    : 0;
  const timerGoalReached = timerSeconds >= timerGoalMinutes * 60;
  const timerProgress = Math.min((timerSeconds / (timerGoalMinutes * 60)) * 100, 100);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (profile) setUserProfile(profile);
    }
  };

  const fetchProgress = async () => {
    if (!userId) return;
    const query = (supabase as any)
      .from('death_chamber_progress')
      .select('day_number, completed_at, reflection')
      .eq('user_id', userId)
      .order('day_number');

    if (groupInfo?.id) {
      query.eq('group_id', groupInfo.id);
    } else {
      query.is('group_id', null);
    }

    const { data, error } = await query;
    if (!error && data) {
      setProgress(data);
      const completedDays = data.map(p => p.day_number);
      const nextDay = Array.from({ length: 30 }, (_, i) => i + 1)
        .find(day => !completedDays.includes(day)) || 30;
      setCurrentDay(nextDay);
      if (completedDays.length === 30) {
        setView("completion");
      }
    }
  };

  const handleCompleteDay = async () => {
    if (!userId) {
      toast.error("Please log in to track your progress");
      return;
    }
    if (!reflection.trim()) {
      toast.error("Write your reflection before completing this day");
      return;
    }
    if (!spiritJournal.trim()) {
      toast.error("Write down what the Spirit said to you before completing this day");
      return;
    }
    if (!surrenderDone) {
      toast.error("Complete your meditation time first");
      return;
    }

    // Save meditation time
    const totalMinutes = sessionMeditationMinutes + Math.round(timerSeconds / 60);
    saveMeditationTime(totalMinutes > 0 ? totalMinutes : 15); // default 15 if timer wasn't used

    setIsLoading(true);
    try {
      // Refresh session before save — meditation sessions can be long
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session || sessionError) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          toast.error("Your session expired. Please log in again.");
          setIsLoading(false);
          return;
        }
      }

      // Check if this day was already completed (guard against double-save)
      const groupId = groupInfo?.id || null;
      const existingQuery = (supabase as any)
        .from('death_chamber_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('day_number', currentDay);
      if (groupId) {
        existingQuery.eq('group_id', groupId);
      } else {
        existingQuery.is('group_id', null);
      }
      const { data: existing } = await existingQuery;
      if (existing && existing.length > 0) {
        toast.success(`Day ${currentDay} was already completed.`);
        await fetchProgress();
        setIsLoading(false);
        return;
      }

      const { error } = await (supabase as any)
        .from('death_chamber_progress')
        .insert({
          user_id: userId,
          group_id: groupId,
          day_number: currentDay,
          reflection: `${reflection}\n\n--- What the Spirit Said ---\n${spiritJournal}`,
          tomb_affirmation_accepted: true,
          surrender_exercise_completed: true,
        });

      if (error) throw error;

      // Update group member progress
      if (groupInfo?.id) {
        await (supabase as any)
          .from('death_chamber_group_members')
          .update({ days_completed: progress.length + 1 })
          .eq('group_id', groupInfo.id)
          .eq('user_id', userId);
      }

      toast.success(`Day ${currentDay} complete. The tomb deepens.`);
      setReflection("");
      setSpiritJournal("");
      setSurrenderDone(false);
      setTimerSeconds(0);
      setTimerRunning(false);
      setSessionMeditationMinutes(0);
      await fetchProgress();

      if (currentDay === 30) {
        setView("completion");
      }
    } catch (error: any) {
      console.error("Error completing day:", error);
      if (error?.code === '42501' || error?.message?.includes('policy')) {
        toast.error("Session error — please refresh the page and try again.");
      } else if (error?.code === '23505') {
        toast.success(`Day ${currentDay} was already saved.`);
        await fetchProgress();
      } else {
        toast.error("Failed to save progress. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Group functions
  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const createGroup = async () => {
    if (!userId || !userProfile || !groupName.trim()) {
      toast.error("Enter a group name");
      return;
    }

    setIsLoading(true);
    try {
      const roomCode = generateRoomCode();
      const { data: group, error: groupError } = await (supabase as any)
        .from('death_chamber_groups')
        .insert({
          name: groupName.trim(),
          room_code: roomCode,
          created_by: userId,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      await (supabase as any).from('death_chamber_group_members').insert({
        group_id: group.id,
        user_id: userId,
        display_name: userProfile.display_name || 'Anonymous',
        avatar_url: userProfile.avatar_url,
      });

      setGroupInfo(group);
      setView("group-lobby");
      toast.success("Tomb Space created. Share the code with your group.");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async () => {
    if (!userId || !userProfile || !joinCode.trim()) {
      toast.error("Enter a room code");
      return;
    }

    setIsLoading(true);
    try {
      const { data: group, error: groupError } = await (supabase as any)
        .from('death_chamber_groups')
        .select('*')
        .eq('room_code', joinCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (groupError || !group) {
        toast.error("Invalid room code. Check and try again.");
        return;
      }

      // Check if already a member
      const { data: existing } = await (supabase as any)
        .from('death_chamber_group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', userId)
        .single();

      if (!existing) {
        await (supabase as any).from('death_chamber_group_members').insert({
          group_id: group.id,
          user_id: userId,
          display_name: userProfile.display_name || 'Anonymous',
          avatar_url: userProfile.avatar_url,
        });
      }

      setGroupInfo(group);
      await fetchGroupMembers(group.id);
      setView("group-lobby");
      toast.success(`Joined "${group.name}". Welcome to the tomb.`);
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupMembers = async (gId?: string) => {
    const id = gId || groupInfo?.id;
    if (!id) return;
    const { data } = await (supabase as any)
      .from('death_chamber_group_members')
      .select('*')
      .eq('group_id', id)
      .eq('is_active', true)
      .order('joined_at');
    if (data) setGroupMembers(data as GroupMember[]);
  };

  const startGroupChallenge = async () => {
    if (!groupInfo?.id) return;
    await (supabase as any)
      .from('death_chamber_groups')
      .update({ current_day: 1, started_at: new Date().toISOString() })
      .eq('id', groupInfo.id);
    setGroupInfo({ ...groupInfo, current_day: 1, started_at: new Date().toISOString() });
    setView("active");
  };

  const copyCode = () => {
    if (groupInfo?.room_code) {
      navigator.clipboard.writeText(groupInfo.room_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // Tomb Space functions
  const fetchTombMessages = async () => {
    if (!groupInfo?.id) return;
    const { data } = await (supabase as any)
      .from('tomb_space_messages')
      .select('*')
      .eq('group_id', groupInfo.id)
      .order('created_at', { ascending: true })
      .limit(100);
    if (data) setTombMessages(data as TombMessage[]);
  };

  const sendTombMessage = async () => {
    if (!userId || !userProfile || !groupInfo?.id || !newMessage.trim()) return;

    try {
      await (supabase as any).from('tomb_space_messages').insert({
        group_id: groupInfo.id,
        user_id: userId,
        display_name: userProfile.display_name || 'Anonymous',
        avatar_url: userProfile.avatar_url,
        message_type: messageType,
        day_number: currentDay,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const reactToMessage = async (messageId: string, reaction: string) => {
    if (!userId) return;
    try {
      const { error } = await (supabase as any).from('tomb_space_reactions').insert({
        message_id: messageId,
        user_id: userId,
        reaction,
      });
      if (error?.code === '23505') {
        // Already reacted, remove it
        await (supabase as any).from('tomb_space_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', userId)
          .eq('reaction', reaction);
      }
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  // Computed
  const completedDays = progress.length;
  const progressPercent = (completedDays / 30) * 100;
  const currentDayData = DEATH_CHAMBER_DAYS[currentDay - 1];
  const currentWeek = currentDayData ? DEATH_CHAMBER_WEEKS[currentDayData.week - 1] : null;

  const messageTypeIcons: Record<MessageType, typeof Heart> = {
    reflection: BookOpen,
    encouragement: Heart,
    prayer: HandHeart,
    testimony: Flame,
    question: MessageSquare,
  };

  // =============== RENDER ===============

  // Welcome Screen
  if (view === "welcome") {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-gray-600 mx-auto">
            <Landmark className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{DEATH_CHAMBER_WELCOME.title}</h1>
          <p className="text-lg text-muted-foreground italic">{DEATH_CHAMBER_WELCOME.subtitle}</p>
          <div className="bg-muted/50 rounded-lg p-4 max-w-lg mx-auto border border-border">
            <p className="text-sm italic text-muted-foreground">
              "{DEATH_CHAMBER_WELCOME.epigraph}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">— {DEATH_CHAMBER_WELCOME.epigraphRef}</p>
          </div>
        </motion.div>

        <Card className="border-gray-700 bg-gradient-to-b from-gray-950/50 to-background max-w-2xl mx-auto">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {DEATH_CHAMBER_WELCOME.description}
            </p>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Rules of the Tomb
              </h3>
              <ul className="space-y-1">
                {DEATH_CHAMBER_WELCOME.rules.map((rule, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-gray-500 font-mono text-xs mt-0.5">{i + 1}.</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3">
              <p className="text-xs text-red-300/80 italic">{DEATH_CHAMBER_WELCOME.warning}</p>
            </div>

            <Button
              onClick={() => setView("mode-select")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              size="lg"
            >
              <Landmark className="w-4 h-4 mr-2" />
              Enter the Death Chamber
            </Button>
          </CardContent>
        </Card>

        {/* Week Overview */}
        <div className="grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
          {DEATH_CHAMBER_WEEKS.map((week) => (
            <Card key={week.week} className="border-gray-800">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-xs">Week {week.week}</Badge>
                <CardTitle className="text-sm">{week.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{week.focus}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Mode Select (Solo vs Group)
  if (view === "mode-select") {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Button variant="ghost" onClick={() => setView("welcome")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Choose Your Path</h2>
          <p className="text-muted-foreground text-sm">Enter the tomb alone, or die alongside others.</p>
        </div>

        <div className="grid gap-4">
          <Card
            className="border-2 hover:border-gray-500 cursor-pointer transition-all"
            onClick={() => { setGroupInfo(null); setView("active"); }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <CardTitle className="text-lg">Solo — Enter Alone</CardTitle>
                  <CardDescription>Face the tomb by yourself. Just you and God.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="border-2 hover:border-primary cursor-pointer transition-all"
            onClick={() => setView("group-lobby")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Group — Die Together</CardTitle>
                  <CardDescription>Walk through the tomb with friends. Share reflections in the Tomb Space.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Group Lobby
  if (view === "group-lobby" && !groupInfo) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Button variant="ghost" onClick={() => setView("mode-select")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" /> Create Group
            </TabsTrigger>
            <TabsTrigger value="join">
              <LogIn className="w-4 h-4 mr-2" /> Join Group
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Create a Tomb Space</CardTitle>
                <CardDescription>Start a group Death Chamber. Share the code with friends to join.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Group name (e.g., 'The Burial Ground')"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button
                  onClick={createGroup}
                  disabled={isLoading || !groupName.trim()}
                  className="w-full bg-gray-800 hover:bg-gray-700"
                >
                  {isLoading ? "Creating..." : "Create Tomb Space"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Join a Tomb Space</CardTitle>
                <CardDescription>Enter the 6-character code from your group leader.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Room code (e.g., ABC123)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                />
                <Button
                  onClick={joinGroup}
                  disabled={isLoading || joinCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? "Joining..." : "Enter the Tomb"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Group Lobby (group exists, waiting to start)
  if (view === "group-lobby" && groupInfo) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <Button variant="ghost" onClick={() => { setGroupInfo(null); setView("mode-select"); }}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Leave Group
        </Button>

        <Card className="border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{groupInfo.name}</CardTitle>
            <CardDescription>Tomb Space</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Room Code */}
            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <span className="text-3xl font-mono font-bold tracking-widest text-primary">
                {groupInfo.room_code}
              </span>
              <Button variant="ghost" size="sm" onClick={copyCode}>
                {codeCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">Share this code with your group</p>

            {/* Members */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members ({groupMembers.length})
              </h4>
              <div className="space-y-1">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback>{member.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.display_name}</span>
                    {member.user_id === groupInfo.created_by && (
                      <Badge variant="outline" className="text-xs ml-auto">Leader</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Start button (creator only) */}
            {userId === groupInfo.created_by && !groupInfo.started_at && (
              <Button
                onClick={startGroupChallenge}
                className="w-full bg-gray-800 hover:bg-gray-700"
                size="lg"
              >
                <Landmark className="w-4 h-4 mr-2" />
                Begin the 30-Day Death Chamber
              </Button>
            )}

            {groupInfo.started_at && (
              <Button
                onClick={() => setView("active")}
                className="w-full"
                size="lg"
              >
                Continue Challenge (Day {currentDay})
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => { fetchGroupMembers(); }}
              className="w-full"
            >
              Refresh Members
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion Screen
  if (view === "completion") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 mx-auto">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{DEATH_CHAMBER_COMPLETION.title}</h1>
          <p className="text-lg text-muted-foreground italic">{DEATH_CHAMBER_COMPLETION.subtitle}</p>
        </motion.div>

        <Card className="border-amber-800/30 bg-gradient-to-b from-amber-950/20 to-background">
          <CardContent className="pt-6 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm italic">"{DEATH_CHAMBER_COMPLETION.scripture}"</p>
              <p className="text-xs text-muted-foreground mt-1">— {DEATH_CHAMBER_COMPLETION.scriptureRef}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Your Completion Covenant</h3>
              <p className="text-sm whitespace-pre-line leading-relaxed">{DEATH_CHAMBER_COMPLETION.covenant}</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <p className="text-sm italic text-gray-300">{DEATH_CHAMBER_COMPLETION.closingWord}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setView("active")} variant="outline" className="flex-1">
                Review My Journey
              </Button>
              {groupInfo && (
                <Button onClick={() => setView("tomb-space")} className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" /> Tomb Space
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tomb Space
  if (view === "tomb-space" && groupInfo) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setView("active")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Challenge
          </Button>
          <Badge variant="outline">{groupInfo.name}</Badge>
        </div>

        <Card className="border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Tomb Space
            </CardTitle>
            <CardDescription>Share reflections, prayers, and encouragements with your group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Messages */}
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {tombMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    The tomb is silent. Be the first to share.
                  </p>
                )}
                <AnimatePresence>
                  {tombMessages.map((msg) => {
                    const Icon = messageTypeIcons[msg.message_type] || BookOpen;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-3 rounded-lg border",
                          msg.user_id === userId ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-7 w-7 mt-0.5">
                            <AvatarImage src={msg.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {msg.display_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium">{msg.display_name}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                                <Icon className="w-3 h-3" />
                                {msg.message_type}
                              </Badge>
                              {msg.day_number && (
                                <span className="text-[10px] text-muted-foreground">Day {msg.day_number}</span>
                              )}
                            </div>
                            <p className="text-sm mt-1 whitespace-pre-wrap">{msg.content}</p>
                            <div className="flex items-center gap-1 mt-2">
                              {["pray", "amen", "fire", "heart"].map((r) => (
                                <Button
                                  key={r}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => reactToMessage(msg.id, r)}
                                >
                                  {r === "pray" && "🙏"}
                                  {r === "amen" && "🙌"}
                                  {r === "fire" && "🔥"}
                                  {r === "heart" && "❤️"}
                                </Button>
                              ))}
                              <span className="text-[10px] text-muted-foreground ml-auto">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex gap-1">
                {(["reflection", "encouragement", "prayer", "testimony", "question"] as MessageType[]).map((type) => {
                  const Icon = messageTypeIcons[type];
                  return (
                    <Button
                      key={type}
                      variant={messageType === type ? "default" : "ghost"}
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setMessageType(type)}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Share a ${messageType}...`}
                  className="min-h-[60px] flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendTombMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendTombMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Group members progress */}
            <div className="border-t pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Group Progress</h4>
              <div className="space-y-1">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px]">
                        {member.display_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs flex-1">{member.display_name}</span>
                    <Progress value={(member.days_completed / 30) * 100} className="h-1.5 w-20" />
                    <span className="text-[10px] text-muted-foreground">{member.days_completed}/30</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Challenge (both solo and group)
  if (!currentDayData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Day data not found.</p>
          <Button onClick={() => setView("welcome")}>Back</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setView(groupInfo ? "group-lobby" : "mode-select")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {groupInfo && (
            <Button variant="outline" size="sm" onClick={() => { fetchTombMessages(); fetchGroupMembers(); setView("tomb-space"); }}>
              <MessageSquare className="w-4 h-4 mr-2" /> Tomb Space
            </Button>
          )}
          <Badge variant="outline" className="text-sm px-3 py-1">
            Day {currentDay} / 30
          </Badge>
        </div>
      </div>

      {/* Week Banner */}
      {currentWeek && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-600 text-xs">
              Week {currentWeek.week}
            </Badge>
            <span className="text-sm font-semibold text-gray-200">{currentWeek.title}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{currentWeek.focus}</p>
        </div>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress: {completedDays} / 30 days</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCompleted = progress.some(p => p.day_number === day);
              const isCurrent = day === currentDay;
              const isLocked = day > currentDay && !isCompleted;
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center text-[10px] font-semibold transition-all",
                    isCompleted && "bg-green-600 text-white",
                    isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background bg-gray-800 text-white",
                    isLocked && "bg-muted text-muted-foreground opacity-50",
                    !isCompleted && !isCurrent && !isLocked && "bg-muted"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : isLocked ? <Lock className="w-2.5 h-2.5" /> : day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Header */}
      <Card className="border-gray-700 bg-gradient-to-b from-gray-950/30 to-background">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-gray-800 text-gray-200">Day {currentDay}</Badge>
              <Badge variant="outline" className="text-xs">{currentDayData.theme}</Badge>
            </div>
            <CardTitle className="text-xl">{currentDayData.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Scripture */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">{currentDayData.scripture}</p>
            <p className="text-sm italic">"{currentDayData.scriptureText}"</p>
          </div>
        </CardContent>
      </Card>

      {/* PRIMARY: Tomb Meditation (15+ minutes) */}
      <Card className="border-2 border-primary/30 bg-gradient-to-b from-gray-950/50 to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Tomb Meditation</CardTitle>
              <CardDescription>At least 15 minutes. This is the heart of the Death Chamber.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-line">{currentDayData.tombMeditation}</p>
          </div>

          {/* Confession Focus */}
          <div className="bg-red-950/10 border border-red-900/20 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-red-300">
              <Landmark className="w-4 h-4" />
              What to Confess
            </h4>
            <p className="text-sm leading-relaxed">{currentDayData.confessionFocus}</p>
          </div>

          {/* Meditation Prompts */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Sit with These Questions Before God:</h4>
            <div className="space-y-2">
              {currentDayData.meditationPrompts.map((prompt, i) => (
                <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-lg p-3">
                  <span className="text-primary font-mono text-xs mt-0.5">{i + 1}.</span>
                  <p className="text-sm italic">{prompt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Listening Focus — Holy Spirit's Classroom */}
          <div className="bg-indigo-950/20 border border-indigo-800/30 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-indigo-300">
              <Ear className="w-4 h-4" />
              Now Listen — The Holy Spirit is the Teacher
            </h4>
            <p className="text-xs text-indigo-200/70 italic">
              You are a student. He is the Divine Teacher. Stop talking. Stop striving. Be still and listen. He will bring Scriptures to mind, lay impressions on your heart, and speak into your situation. Receive what He gives.
            </p>
            <p className="text-sm leading-relaxed">{currentDayData.listeningFocus}</p>
          </div>

          {/* Tomb Affirmation */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Today's Tomb Affirmation</p>
            <p className="text-sm font-semibold italic text-gray-300">"{currentDayData.tombAffirmation}"</p>
          </div>

          {/* Meditation Timer */}
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                Meditation Timer
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Goal:</span>
                <select
                  value={timerGoalMinutes}
                  onChange={(e) => setTimerGoalMinutes(Number(e.target.value))}
                  className="text-xs bg-muted border border-border rounded px-2 py-1"
                  disabled={timerRunning}
                >
                  {[5, 10, 15, 20, 25, 30, 45, 60, 90].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center space-y-3">
              <div className={cn(
                "text-5xl font-mono font-bold tracking-wider transition-colors",
                timerGoalReached ? "text-green-400" : timerRunning ? "text-primary" : "text-foreground"
              )}>
                {formatTime(timerSeconds)}
              </div>
              <Progress
                value={timerProgress}
                className={cn("h-2", timerGoalReached && "[&>div]:bg-green-500")}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0 min</span>
                {timerGoalReached && (
                  <span className="text-green-400 font-semibold">Goal reached!</span>
                )}
                <span>{timerGoalMinutes} min</span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                {!timerRunning && timerSeconds === 0 && (
                  <Button onClick={startTimer} size="lg" className="gap-2">
                    <Play className="w-5 h-5" /> Begin Meditation
                  </Button>
                )}
                {timerRunning && (
                  <Button onClick={pauseTimer} variant="outline" size="lg" className="gap-2">
                    <Pause className="w-5 h-5" /> Pause
                  </Button>
                )}
                {!timerRunning && timerSeconds > 0 && (
                  <>
                    <Button onClick={startTimer} size="lg" className="gap-2">
                      <Play className="w-5 h-5" /> Resume
                    </Button>
                    <Button onClick={stopTimer} variant="outline" size="lg" className="gap-2">
                      <Square className="w-4 h-4" /> End Session
                    </Button>
                  </>
                )}
              </div>

              {sessionMeditationMinutes > 0 && (
                <p className="text-xs text-muted-foreground">
                  Total today: {sessionMeditationMinutes} min recorded
                  {timerSeconds > 0 && ` + ${formatTime(timerSeconds)} current`}
                </p>
              )}
            </div>
          </div>

          {/* Meditation Growth Stats */}
          {meditationHistory.length > 1 && (
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3" /> Your Growth in the Tomb
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold text-primary">{totalMeditationMinutes}</p>
                  <p className="text-[10px] text-muted-foreground">Total Minutes</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold text-primary">{averageMeditationMinutes}</p>
                  <p className="text-[10px] text-muted-foreground">Avg / Day</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold text-primary">{longestSession}</p>
                  <p className="text-[10px] text-muted-foreground">Longest (min)</p>
                </div>
              </div>
              {averageMeditationMinutes > 0 && (
                <p className="text-xs text-muted-foreground mt-2 text-center italic">
                  {averageMeditationMinutes < 15
                    ? "Push deeper. Aim for at least 15 minutes in the tomb."
                    : averageMeditationMinutes < 25
                    ? "Good discipline. Can you push to 25 minutes? The deeper you go, the more you die."
                    : averageMeditationMinutes < 40
                    ? "Strong. You are learning to dwell in the tomb. Keep pressing in."
                    : "Warrior-level meditation. The tomb is becoming your home. Christ is being formed in you."}
                </p>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer border-t border-border pt-3">
            <input
              type="checkbox"
              checked={surrenderDone}
              onChange={(e) => setSurrenderDone(e.target.checked)}
              className="rounded border-gray-600"
            />
            <span className="text-sm">I have completed my meditation time</span>
          </label>
        </CardContent>
      </Card>

      {/* SECONDARY: Rest of Day Instructions */}
      <Card className="border-gray-800">
        <CardHeader>
          <CardTitle className="text-base">For the Rest of Your Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{currentDayData.restOfDay}</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Practical Actions:</p>
            {currentDayData.practicalActions.map((action, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What the Spirit Said — Journal */}
      <Card className="border-2 border-indigo-800/30 bg-gradient-to-b from-indigo-950/20 to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <PenLine className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-base">What the Spirit Said</CardTitle>
              <CardDescription>Write down the verses, impressions, and words the Holy Spirit spoke to you during your time in the tomb. Only record what is confirmed by Scripture.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-indigo-950/10 border border-indigo-900/20 rounded-lg p-3">
            <p className="text-xs text-indigo-300/80 italic">
              "My sheep hear my voice, and I know them, and they follow me." — John 10:27
            </p>
          </div>
          <Textarea
            value={spiritJournal}
            onChange={(e) => setSpiritJournal(e.target.value)}
            placeholder="What Scriptures did the Spirit bring to mind? What impressions did He lay on your heart? What did He say about your situation today? Write it here..."
            className="min-h-[140px] border-indigo-800/20"
          />
          <p className="text-[10px] text-muted-foreground italic">
            Remember: test everything against Scripture (1 Thessalonians 5:21). The Spirit will never contradict the Word.
          </p>
        </CardContent>
      </Card>

      {/* Reflection */}
      <Card className="border-gray-800">
        <CardHeader>
          <CardTitle className="text-base">Your Reflection</CardTitle>
          <CardDescription className="italic">{currentDayData.reflectionPrompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your honest reflection here..."
            className="min-h-[120px]"
          />

          <Button
            onClick={handleCompleteDay}
            disabled={isLoading || !reflection.trim() || !spiritJournal.trim() || !surrenderDone}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            size="lg"
          >
            {isLoading ? "Sealing the tomb..." : `Complete Day ${currentDay}`}
          </Button>
        </CardContent>
      </Card>

      {/* Past Days */}
      {progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Journey Through the Tomb</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {[...progress].reverse().map((p) => {
                  const dayData = DEATH_CHAMBER_DAYS[p.day_number - 1];
                  const isExpanded = expandedDay === p.day_number;
                  return (
                    <Card
                      key={p.day_number}
                      className="border-gray-800 cursor-pointer"
                      onClick={() => setExpandedDay(isExpanded ? null : p.day_number)}
                    >
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <Badge variant="outline" className="text-xs">Day {p.day_number}</Badge>
                            <span className="text-sm font-medium">{dayData?.title}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        {isExpanded && (
                          <div className="mt-3 pl-6 space-y-2">
                            <p className="text-sm text-muted-foreground">{p.reflection}</p>
                            <p className="text-xs text-muted-foreground">
                              Completed: {new Date(p.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
