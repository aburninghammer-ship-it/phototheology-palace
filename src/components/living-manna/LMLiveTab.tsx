import { useState, useEffect, useRef } from "react";
import { Radio, Users, Mic, MicOff, Monitor, MonitorOff, Video, VideoOff, MessageCircle, Send, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLiveDemo } from "@/hooks/useLiveDemo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";

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

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Live");
  const [isTestingCamera, setIsTestingCamera] = useState(false);

  const testVideoRef = useRef<HTMLVideoElement>(null);
  const testStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const chatChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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

  // Host: Start screen sharing
  const handleStartScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScreenSharing(true);

      stream.getVideoTracks()[0].onended = () => {
        handleStopScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const handleStopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (videoRef.current && !isCameraOn) {
      videoRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  };

  // Host: Start camera
  const handleStartCamera = async () => {
    try {
      if (isScreenSharing) {
        handleStopScreenShare();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const handleStopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current && !isScreenSharing) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  // Host: Toggle microphone
  const handleToggleMic = async () => {
    if (isMuted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setIsMuted(false);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
      setIsMuted(true);
    }
  };

  // Host: Test camera before going live
  const handleTestCamera = async () => {
    if (isTestingCamera) {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach((track) => track.stop());
        testStreamRef.current = null;
      }
      setIsTestingCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        testStreamRef.current = stream;
        setIsTestingCamera(true);
      } catch (error) {
        console.error("Error testing camera:", error);
      }
    }
  };

  // Attach test stream to video element
  useEffect(() => {
    if (isTestingCamera && testVideoRef.current && testStreamRef.current) {
      testVideoRef.current.srcObject = testStreamRef.current;
    }
  }, [isTestingCamera]);

  // Attach camera/screen stream to video element
  useEffect(() => {
    if (videoRef.current) {
      if (cameraStreamRef.current) {
        videoRef.current.srcObject = cameraStreamRef.current;
      } else if (screenStreamRef.current) {
        videoRef.current.srcObject = screenStreamRef.current;
      }
    }
  }, [isCameraOn, isScreenSharing]);

  // Host: Go live
  const handleGoLive = async () => {
    if (isTestingCamera) {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach((track) => track.stop());
        testStreamRef.current = null;
      }
      setIsTestingCamera(false);
    }
    await startSession(sessionTitle);
  };

  // Host: End stream
  const handleEndStream = async () => {
    handleStopScreenShare();
    handleStopCamera();
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    await endSession();
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession || !user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user.id,
      display_name: profile?.display_name || "Anonymous",
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

        {/* Voice room always available */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Voice Room</h3>
            <VoiceChatWidget roomType="study" roomId={`lm-live-${churchId}`} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Host pre-live setup (no active session, but user is host)
  if (!activeSession && isHost) {
    return (
      <div className="space-y-6">
        {/* Session setup */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Session Setup</h3>
            <Input
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Enter session title..."
              className="mb-3"
            />

            {/* Camera Test */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Test Camera & Mic</span>
                <Button
                  variant={isTestingCamera ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleTestCamera}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isTestingCamera ? "Stop Test" : "Test Camera"}
                </Button>
              </div>

              {isTestingCamera && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={testVideoRef}
                    autoPlay
                    playsInline
                    muted={false}
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <div className="absolute bottom-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                    Camera & mic active
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              When you go live, all church members will be able to watch and participate.
            </p>

            <Button onClick={handleGoLive} className="w-full bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </CardContent>
        </Card>

        {/* Voice room */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Voice Room</h3>
            <VoiceChatWidget roomType="study" roomId={`lm-live-${churchId}`} />
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

  // Active session — full live view (host and members)
  return (
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
        {isHost && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleMic}
              className={!isMuted ? "bg-primary text-primary-foreground" : ""}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isCameraOn ? handleStopCamera : handleStartCamera}
              className={isCameraOn ? "bg-primary text-primary-foreground" : ""}
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isScreenSharing ? handleStopScreenShare : handleStartScreenShare}
              className={isScreenSharing ? "bg-primary text-primary-foreground" : ""}
            >
              {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleEndStream}>
              End Stream
            </Button>
          </div>
        )}
      </div>

      {/* Main grid: video + voice on left, chat on right */}
      <div className="grid lg:grid-cols-[1fr,350px] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Video area */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            {isScreenSharing || isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  {isHost ? (
                    <>
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Share your camera or screen to start broadcasting</p>
                    </>
                  ) : (
                    <>
                      <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Waiting for host to start broadcasting...</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Voice room */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Voice Room</h3>
              <VoiceChatWidget
                roomType="study"
                roomId={`lm-live-${activeSession?.id || churchId}`}
              />
            </CardContent>
          </Card>

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
  );
}
