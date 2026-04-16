import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Video, Users, Send, ArrowLeft, Share2, Copy, Loader2 } from "lucide-react";
import { SimpleVoiceRoom } from "@/components/voice";

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

interface ParticipantLocation {
  userId: string;
  username: string;
  currentPath: string;
  timestamp: string;
}

const LiveStudyRoom = () => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [userDisplayName, setUserDisplayName] = useState<string>("");
  const [participantLocations, setParticipantLocations] = useState<ParticipantLocation[]>([]);
  const [showLocations, setShowLocations] = useState(true);

  useEffect(() => {
    if (!roomId || !user) return;

    fetchUserProfile();
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

    // Subscribe to location sharing
    const locationChannel = supabase
      .channel(`room_${roomId}_locations`);
    
    locationChannel
      .on("presence", { event: "sync" }, () => {
        const state = locationChannel.presenceState();
        const locations: ParticipantLocation[] = [];
        
        Object.entries(state).forEach(([key, values]: [string, any[]]) => {
          if (values[0] && values[0].userId !== user.id) {
            locations.push(values[0] as ParticipantLocation);
          }
        });
        
        setParticipantLocations(locations);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track current location
          await locationChannel.track({
            userId: user.id,
            username: userDisplayName || "User",
            currentPath: window.location.pathname,
            timestamp: new Date().toISOString(),
          });
        }
      });

    // Update location when route changes
    const handleLocationChange = async () => {
      const currentState = locationChannel.state;
      if (currentState === "joined") {
        await locationChannel.track({
          userId: user.id,
          username: userDisplayName || "User",
          currentPath: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(participantsChannel);
      supabase.removeChannel(locationChannel);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [roomId, user, userDisplayName]);

  const fetchUserProfile = async () => {
    const { data: profile } = await supabase
      .from("profiles_public_info")
      .select("display_name, username")
      .eq("id", user!.id)
      .maybeSingle();

    setUserDisplayName(profile?.display_name || profile?.username || "User");
  };

  const fetchRoomDetails = async () => {
    setRoomLoading(true);
    setRoomError(null);

    const { data, error } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error || !data) {
      setRoom(null);
      setRoomError(t('liveStudyRoom.roomNotFound'));
      setRoomLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles_public_info")
      .select("username")
      .eq("id", data.host_id)
      .maybeSingle();

    setRoom({ ...data, profiles: profile || { username: "Unknown" } });
    setRoomLoading(false);
  };

  const joinRoom = async () => {
    const { error } = await supabase
      .from("study_room_participants")
      .upsert({ room_id: roomId, user_id: user!.id });

    if (error && error.code !== "23505") {
      toast({
        title: t('liveStudyRoom.errorJoiningRoom'),
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
            .from("profiles_public_info")
            .select("username")
            .eq("id", msg.user_id)
            .maybeSingle();
          
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
            .from("profiles_public_info")
            .select("username")
            .eq("id", participant.user_id)
            .maybeSingle();
          
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
        title: t('liveStudyRoom.errorSendingMessage'),
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
        title: t('liveStudyRoom.linkCopied'),
        description: t('liveStudyRoom.linkCopiedDesc'),
      });
    }).catch(() => {
      toast({
        title: t('liveStudyRoom.failedToCopy'),
        description: t('liveStudyRoom.pleaseTryAgain'),
        variant: "destructive",
      });
    });
  };

  const shareInviteLink = async () => {
    const inviteLink = `${window.location.origin}/live-study/${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('liveStudyRoom.joinRoomTitle', { name: room?.name }),
          text: t('liveStudyRoom.joinRoomText'),
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

  const followParticipant = (path: string) => {
    navigate(path);
    toast({
      title: t('liveStudyRoom.followingParticipant'),
      description: t('liveStudyRoom.navigatingToLocation'),
    });
  };

  const getPathLabel = (path: string) => {
    const pathMap: { [key: string]: string } = {
      "/": "Home",
      "/palace": "Palace",
      "/bible": "Bible",
      "/games": "Games",
      "/community": "Community",
      "/training-drills": "Training Drills",
      "/chain-chess": "Chain Chess",
      "/flashcards": "Flashcards",
    };
    return pathMap[path] || path.split("/").pop() || "Unknown";
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">{t('liveStudyRoom.loadingRoom')}</p>
        </div>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>{t('liveStudyRoom.unableToLoad')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{roomError}</p>
              <Button onClick={() => navigate("/live-study")}>{t('liveStudyRoom.backToLiveStudy')}</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
                {t('liveStudyRoom.back')}
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 break-words">
                  <Video className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                  <span className="break-words">{room.name}</span>
                </h1>
                <p className="text-muted-foreground break-words">
                  {t('liveStudyRoom.host', { name: room.profiles?.username || t('liveStudyRoom.unknown') })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('liveStudyRoom.participantsCount', { count: participants.length })}
              </Badge>
              <Button variant="outline" onClick={shareInviteLink}>
                <Share2 className="h-4 w-4 mr-2" />
                {t('liveStudyRoom.share')}
              </Button>
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="h-4 w-4 mr-2" />
                {t('liveStudyRoom.copyLink')}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <SimpleVoiceRoom
                roomId={roomId!}
                userId={user!.id}
                userName={userDisplayName || "User"}
              />

              <Card>
                <CardHeader>
                  <CardTitle>{t('liveStudyRoom.chat')}</CardTitle>
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
                      placeholder={t('liveStudyRoom.typeMessage')}
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
                <CardTitle>{t('liveStudyRoom.participants')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    {participants.map((participant) => {
                      const location = participantLocations.find(
                        (loc) => loc.userId === participant.user_id
                      );
                      return (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium block truncate">
                                {participant.profiles?.username || "Unknown"}
                              </span>
                              {showLocations && location && (
                                <span className="text-xs text-muted-foreground block truncate">
                                  📍 {getPathLabel(location.currentPath)}
                                </span>
                              )}
                            </div>
                          </div>
                          {showLocations && location && location.currentPath !== window.location.pathname && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => followParticipant(location.currentPath)}
                              className="flex-shrink-0"
                            >
                              {t('liveStudyRoom.follow')}
                            </Button>
                          )}
                        </div>
                      );
                    })}
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
