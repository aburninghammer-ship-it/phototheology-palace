import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Video, Users, Send, ArrowLeft, Share2, Copy } from "lucide-react";
import { WebRTCCall } from "@/components/WebRTCCall";

interface ChatMessage {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
  };
}

interface Room {
  id: string;
  name: string;
  host_id: string;
  current_verse: string | null;
  profiles?: {
    username: string;
  };
}

const LiveStudyRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (!roomId || !user) return;

    fetchRoomDetails();
    joinRoom();
    fetchMessages();
    fetchParticipants();

    // Subscribe to chat messages
    const chatChannel = supabase
      .channel(`room_${roomId}_chat`)
      .on("postgres_changes", { event: "*", schema: "public", table: "study_room_chat", filter: `room_id=eq.${roomId}` }, () => {
        fetchMessages();
      })
      .subscribe();

    // Subscribe to participants
    const participantsChannel = supabase
      .channel(`room_${roomId}_participants`)
      .on("postgres_changes", { event: "*", schema: "public", table: "study_room_participants", filter: `room_id=eq.${roomId}` }, () => {
        fetchParticipants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [roomId, user]);

  const fetchRoomDetails = async () => {
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", roomId)
      .single();
    
    if (data) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.host_id)
        .single();
      
      setRoom({ ...data, profiles: profile || { username: "Unknown" } });
    }
  };

  const joinRoom = async () => {
    const { error } = await supabase
      .from("study_room_participants")
      .upsert({ room_id: roomId, user_id: user!.id });

    if (error && error.code !== "23505") {
      toast({
        title: "Error joining room",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    const { data: chatData } = await supabase
      .from("study_room_chat")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    
    if (chatData) {
      const messagesWithProfiles = await Promise.all(
        chatData.map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", msg.user_id)
            .single();
          
          return { ...msg, profiles: profile || { username: "Unknown" } };
        })
      );
      setMessages(messagesWithProfiles);
    }
  };

  const fetchParticipants = async () => {
    const { data: participantsData } = await supabase
      .from("study_room_participants")
      .select("*")
      .eq("room_id", roomId);
    
    if (participantsData) {
      const participantsWithProfiles = await Promise.all(
        participantsData.map(async (participant) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", participant.user_id)
            .single();
          
          return { ...participant, profiles: profile || { username: "Unknown" } };
        })
      );
      setParticipants(participantsWithProfiles);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage, "Room ID:", roomId, "User ID:", user?.id);

    const { data, error } = await supabase
      .from("study_room_chat")
      .insert({
        room_id: roomId,
        user_id: user!.id,
        message: newMessage,
      })
      .select();

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      console.log("Message sent successfully:", data);
      setNewMessage("");
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/live-study/${roomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: "Link copied!",
        description: "Share this link with your friends to invite them.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    });
  };

  const shareInviteLink = async () => {
    const inviteLink = `${window.location.origin}/live-study/${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${room?.name} on Phototheology Palace`,
          text: `Join me in this live study session!`,
          url: inviteLink,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyInviteLink();
        }
      }
    } else {
      copyInviteLink();
    }
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button variant="ghost" onClick={() => navigate("/live-study")} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 break-words">
                  <Video className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="break-words">{room.name}</span>
                </h1>
                <p className="text-muted-foreground break-words">
                  Host: {room.profiles?.username || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {participants.length} participants
              </Badge>
              <Button variant="outline" onClick={shareInviteLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <WebRTCCall
                roomId={roomId!}
                userId={user!.id}
                userName={user!.email || "User"}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {msg.profiles?.username || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm bg-muted p-2 rounded-lg">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {participant.profiles?.username || "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveStudyRoom;
