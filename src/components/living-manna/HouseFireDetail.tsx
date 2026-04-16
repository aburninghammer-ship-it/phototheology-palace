import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useHouseFireChat } from "@/hooks/useHouseFireChat";
import { toast } from "sonner";
import {
  ArrowLeft, Send, Users, Copy, BookOpen, Zap, Shield, Heart,
  Globe, Settings, LogOut, Clock, MessageSquare, Flame
} from "lucide-react";

const GROUP_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  study: { label: "Study Group", icon: BookOpen, color: "text-blue-500" },
  freestyle: { label: "Freestyle Training", icon: Zap, color: "text-yellow-500" },
  apologetics: { label: "Apologetics Lab", icon: Shield, color: "text-purple-500" },
  prayer: { label: "Prayer & Formation", icon: Heart, color: "text-pink-500" },
  ministry: { label: "Ministry Launch", icon: Globe, color: "text-green-500" },
};

interface HouseFireDetailProps {
  groupId: string;
  onBack: () => void;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  display_name: string;
  avatar_url: string | null;
}

export function HouseFireDetail({ groupId, onBack }: HouseFireDetailProps) {
  const { user } = useAuth();
  const { messages, loading: chatLoading, sendMessage } = useHouseFireChat(groupId);
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadGroupDetails = async () => {
    const { data: groupData } = await (supabase
      .from('small_groups' as any)
      .select('*, profiles:leader_id (display_name)')
      .eq('id', groupId)
      .single() as any);

    if (groupData) setGroup(groupData);

    const { data: memberData } = await (supabase
      .from('small_group_members' as any)
      .select('id, user_id, role, profiles:user_id (display_name, avatar_url)')
      .eq('group_id', groupId)
      .eq('is_active', true) as any);

    if (memberData) {
      setMembers(memberData.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        display_name: m.profiles?.display_name || 'Unknown',
        avatar_url: m.profiles?.avatar_url || null
      })));
    }
  };

  const handleSend = async () => {
    if (!messageInput.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!user) return;
    try {
      await (supabase
        .from('small_group_members' as any)
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id) as any);
      toast.success("Left the group");
      onBack();
    } catch {
      toast.error("Failed to leave group");
    }
  };

  const copyInviteCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      toast.success("Invite code copied!");
    }
  };

  if (!group) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const typeConfig = GROUP_TYPE_CONFIG[group.group_type] || GROUP_TYPE_CONFIG.study;
  const TypeIcon = typeConfig.icon;
  const isLeader = user?.id === group.leader_id;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {group.name}
              <Badge variant="outline" className="text-xs gap-1">
                <TypeIcon className={`h-3 w-3 ${typeConfig.color}`} />
                {typeConfig.label}
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground">
              {members.length}/{group.max_members} members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {group.is_private && group.invite_code && (
            <Button variant="outline" size="sm" onClick={copyInviteCode}>
              <Copy className="h-4 w-4 mr-1" />
              {group.invite_code}
            </Button>
          )}
          {isLeader && (
            <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {!isLeader && (
            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleLeaveGroup}>
              <LogOut className="h-4 w-4 mr-1" />
              Leave
            </Button>
          )}
        </div>
      </div>

      {/* Members Strip */}
      <Card variant="glass">
        <CardContent className="py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            {members.map((member) => (
              <div key={member.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {member.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {member.role === 'leader' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                      <Flame className="h-2 w-2 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground max-w-[60px] truncate">
                  {member.display_name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chat Section */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Group Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-3 mb-3">
              {chatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : ''}`}>
                        {!isMe && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={msg.sender_avatar || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {(msg.sender_name || '?').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-3 py-2`}>
                          {!isMe && (
                            <p className="text-[10px] font-medium opacity-70 mb-0.5">{msg.sender_name}</p>
                          )}
                          <p className="text-sm break-words">{msg.content}</p>
                          <p className={`text-[9px] mt-1 ${isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={sending}
              />
              <Button type="submit" size="icon" disabled={sending || !messageInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Meeting Flow Card */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Meeting Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "5 min", label: "Check-in", desc: "How is everyone doing?" },
                { time: "20 min", label: "Study", desc: "Dive into the Word together" },
                { time: "15 min", label: "Discussion", desc: "Share insights and questions" },
                { time: "10 min", label: "Prayer", desc: "Close in prayer for one another" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                  <Badge variant="outline" className="shrink-0 text-[10px]">{step.time}</Badge>
                  <div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {group.current_cycle && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Current Study</p>
                <p className="text-sm font-medium">{group.current_cycle}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
