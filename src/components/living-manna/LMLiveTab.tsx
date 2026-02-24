import { useState, useEffect, useRef } from "react";
import { Radio, Users, Mic, MicOff, Monitor, MonitorOff, Video, VideoOff, MessageCircle, Send, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLiveDemo } from "@/hooks/useLiveDemo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLiveKitToken } from "@/hooks/useLiveKitToken";
import { LiveKitRoom } from "@livekit/components-react";
import { useLocalParticipant } from "@livekit/components-react";
import { LiveVideoRenderer } from "./LiveVideoRenderer";
// LiveKit styles handled via Tailwind

interface ChatMessage {
  id: string;
  user_id: string;
  display_name: string;
  message: string;
  timestamp: string;
}

interface LMLiveTabProps {
  churchId: string;
}

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

/** Host media controls rendered inside <LiveKitRoom> */
function HostControls({ onEndStream }: { onEndStream: () => void }) {
  const { localParticipant } = useLocalParticipant();
  const isCameraOn = localParticipant.isCameraEnabled;
  const isMicOn = localParticipant.isMicrophoneEnabled;
  const isScreenSharing = localParticipant.isScreenShareEnabled;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => localParticipant.setMicrophoneEnabled(!isMicOn)}
        className={isMicOn ? "bg-primary text-primary-foreground" : ""}
      >
        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => localParticipant.setCameraEnabled(!isCameraOn)}
        className={isCameraOn ? "bg-primary text-primary-foreground" : ""}
      >
        {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => localParticipant.setScreenShareEnabled(!isScreenSharing)}
        className={isScreenSharing ? "bg-primary text-primary-foreground" : ""}
      >
        {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
      </Button>
      <Button variant="destructive" size="sm" onClick={onEndStream}>
        End Stream
      </Button>
    </div>
  );
}

/** Member mic toggle rendered inside <LiveKitRoom> */
function MemberMicToggle() {
  const { localParticipant } = useLocalParticipant();
  const isMicOn = localParticipant.isMicrophoneEnabled;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Your Microphone</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => localParticipant.setMicrophoneEnabled(!isMicOn)}
            className={isMicOn ? "bg-primary text-primary-foreground" : ""}
          >
            {isMicOn ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
            {isMicOn ? "Mute" : "Unmute"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LMLiveTab({ churchId }: LMLiveTabProps) {
  const { user } = useAuth();
  const {
    activeSession,
    viewers,
    viewerCount,
    isHost,
    loading,
    pastSessions,
    startSession,
    endSession,
    deleteSession,
    fetchPastSessions,
    joinSession,
    leaveSession,
  } = useLiveDemo();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Live");
  const [displayName, setDisplayName] = useState("Anonymous");

  const chatChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // LiveKit room name derived from active session
  const roomName = activeSession ? `live-session-${activeSession.id}` : null;
  const { token, isLoading: tokenLoading } = useLiveKitToken(roomName, displayName);

  // Fetch display name for LiveKit participant identity
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    };
    fetchProfile();
  }, [user]);

  // Join session when it's active
  useEffect(() => {
    if (activeSession && user) {
      joinSession(activeSession.id);

      chatChannelRef.current = supabase
        .channel(`live-chat-${activeSession.id}`)
        .on("broadcast", { event: "chat_message" }, ({ payload }) => {
          setChatMessages((prev) => [...prev, payload as ChatMessage]);
        })
        .subscribe();
    }

    return () => {
      if (activeSession) {
        leaveSession(activeSession.id);
      }
      if (chatChannelRef.current) {
        supabase.removeChannel(chatChannelRef.current);
      }
    };
  }, [activeSession?.id, user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Host: Go live
  const handleGoLive = async () => {
    await startSession(sessionTitle);
  };

  // Host: End stream
  const handleEndStream = async () => {
    await endSession();
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession || !user) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user.id,
      display_name: displayName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    await chatChannelRef.current?.send({
      type: "broadcast",
      event: "chat_message",
      payload: message,
    });

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Checking for live sessions...</p>
        </div>
      </div>
    );
  }

  // No active session — member view
  if (!activeSession && !isHost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Live Session Right Now</h2>
            <p className="text-muted-foreground max-w-md">
              When an admin goes live, you'll be able to watch, chat, and join the voice room here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Host pre-live setup (no active session, but user is host)
  if (!activeSession && isHost) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Session Setup</h3>
            <Input
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Enter session title..."
              className="mb-3"
            />

            <p className="text-sm text-muted-foreground">
              When you go live, all church members will be able to watch and participate.
              Your camera, mic, and screen share will be managed via LiveKit once the session starts.
            </p>

            <Button onClick={handleGoLive} className="w-full bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </CardContent>
        </Card>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Past Sessions
              </h3>
              <div className="space-y-2">
                {pastSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.viewer_count} viewers &middot;{" "}
                        {new Date(session.started_at || "").toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={async () => {
                        const success = await deleteSession(session.id);
                        if (success) fetchPastSessions();
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Active session — waiting for LiveKit token
  if (tokenLoading || !token) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Connecting to live stream...</p>
        </div>
      </div>
    );
  }

  // Active session — full live view (host and members) wrapped in LiveKitRoom
  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={false}
      video={false}
    >
      <div className="space-y-4">
        {/* Live header bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium uppercase">Live</span>
            </div>
            <h2 className="font-semibold">{activeSession?.title}</h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{viewerCount} watching</span>
            </div>
          </div>

          {/* Host media controls */}
          {isHost && <HostControls onEndStream={handleEndStream} />}
        </div>

        {/* Main grid: video + controls on left, chat on right */}
        <div className="grid lg:grid-cols-[1fr,350px] gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Video area */}
            <LiveVideoRenderer />

            {/* Member mic toggle */}
            {!isHost && <MemberMicToggle />}

            {/* Viewers list */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Viewers ({viewerCount})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewers.slice(0, 20).map((viewer, i) => (
                    <div
                      key={viewer.user_id || i}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {viewer.display_name || "Anonymous"}
                    </div>
                  ))}
                  {viewerCount > 20 && (
                    <div className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      +{viewerCount - 20} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat sidebar */}
          <Card className="flex flex-col h-[calc(100vh-300px)] min-h-[400px]">
            <div className="p-4 border-b">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="font-medium text-primary">{msg.display_name}</span>
                    <span className="text-muted-foreground ml-2">{msg.message}</span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    No messages yet. Say hello!
                  </p>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                  disabled={!activeSession}
                />
                <Button type="submit" size="icon" disabled={!activeSession || !newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </LiveKitRoom>
  );
}
