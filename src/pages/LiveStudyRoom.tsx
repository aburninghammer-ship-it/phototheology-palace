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
import { Video, Users, Send, ArrowLeft } from "lucide-react";

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

    const { error } = await supabase
      .from("study_room_chat")
      .insert({
        room_id: roomId,
        user_id: user!.id,
        message: newMessage,
      });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/live-study")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Video className="h-6 w-6 text-blue-500" />
                  {room.name}
                </h1>
                <p className="text-muted-foreground">
                  Host: {room.profiles?.username || "Unknown"}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {participants.length} participants
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
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
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

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
