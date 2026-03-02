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
  Skull, CheckCircle2, ArrowLeft, Trophy, Users, Plus, LogIn,
  Send, Heart, Flame, BookOpen, MessageSquare, Copy, Check,
  AlertTriangle, Lock, ChevronDown, ChevronUp, HandHeart
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
  const [surrenderDone, setSurrenderDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

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
    const query = supabase
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
    if (!surrenderDone) {
      toast.error("Complete the surrender exercise first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('death_chamber_progress')
        .insert({
          user_id: userId,
          group_id: groupInfo?.id || null,
          day_number: currentDay,
          reflection,
          tomb_affirmation_accepted: true,
          surrender_exercise_completed: true,
        });

      if (error) throw error;

      // Update group member progress
      if (groupInfo?.id) {
        await supabase
          .from('death_chamber_group_members')
          .update({ days_completed: progress.length + 1 })
          .eq('group_id', groupInfo.id)
          .eq('user_id', userId);
      }

      toast.success(`Day ${currentDay} complete. The tomb deepens.`);
      setReflection("");
      setSurrenderDone(false);
      await fetchProgress();

      if (currentDay === 30) {
        setView("completion");
      }
    } catch (error) {
      console.error("Error completing day:", error);
      toast.error("Failed to save progress");
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
      const { data: group, error: groupError } = await supabase
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
      await supabase.from('death_chamber_group_members').insert({
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
      const { data: group, error: groupError } = await supabase
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
      const { data: existing } = await supabase
        .from('death_chamber_group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', userId)
        .single();

      if (!existing) {
        await supabase.from('death_chamber_group_members').insert({
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
    const { data } = await supabase
      .from('death_chamber_group_members')
      .select('*')
      .eq('group_id', id)
      .eq('is_active', true)
      .order('joined_at');
    if (data) setGroupMembers(data);
  };

  const startGroupChallenge = async () => {
    if (!groupInfo?.id) return;
    await supabase
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
    const { data } = await supabase
      .from('tomb_space_messages')
      .select('*')
      .eq('group_id', groupInfo.id)
      .order('created_at', { ascending: true })
      .limit(100);
    if (data) setTombMessages(data);
  };

  const sendTombMessage = async () => {
    if (!userId || !userProfile || !groupInfo?.id || !newMessage.trim()) return;

    try {
      await supabase.from('tomb_space_messages').insert({
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
      const { error } = await supabase.from('tomb_space_reactions').insert({
        message_id: messageId,
        user_id: userId,
        reaction,
      });
      if (error?.code === '23505') {
        // Already reacted, remove it
        await supabase.from('tomb_space_reactions')
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
            <Skull className="w-10 h-10 text-gray-300" />
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
              <Skull className="w-4 h-4 mr-2" />
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
                  <Skull className="w-6 h-6 text-gray-300" />
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
                <Skull className="w-4 h-4 mr-2" />
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

      {/* Today's Challenge */}
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
        <CardContent className="space-y-5">
          {/* Scripture */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">{currentDayData.scripture}</p>
            <p className="text-sm italic">"{currentDayData.scriptureText}"</p>
          </div>

          {/* Instruction */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Today's Instruction</h4>
            <p className="text-sm leading-relaxed">{currentDayData.instruction}</p>
          </div>

          {/* Surrender Exercise */}
          <div className="bg-red-950/10 border border-red-900/20 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Skull className="w-4 h-4 text-red-400" />
              Surrender Exercise
            </h4>
            <p className="text-sm">{currentDayData.surrenderExercise}</p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Practical Actions:</p>
              {currentDayData.practicalActions.map((action, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs">{action}</p>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={surrenderDone}
                onChange={(e) => setSurrenderDone(e.target.checked)}
                className="rounded border-gray-600"
              />
              <span className="text-sm">I have completed the surrender exercise</span>
            </label>
          </div>

          {/* Tomb Affirmation */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Today's Tomb Affirmation</p>
            <p className="text-sm font-semibold italic text-gray-300">"{currentDayData.tombAffirmation}"</p>
          </div>

          {/* Reflection */}
          <div>
            <h4 className="text-sm font-semibold mb-1">Your Reflection</h4>
            <p className="text-xs text-muted-foreground mb-2 italic">{currentDayData.reflectionPrompt}</p>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your honest reflection here..."
              className="min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isLoading || !reflection.trim() || !surrenderDone}
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
