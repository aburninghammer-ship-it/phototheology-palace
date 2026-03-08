import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Radio, Users, Mic, MicOff, Monitor, MonitorOff, Video, VideoOff, ArrowLeft, MessageCircle, Send, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLiveDemo } from "@/hooks/useLiveDemo";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLiveKitToken } from "@/hooks/useLiveKitToken";
import { LiveKitRoom, useLocalParticipant } from "@livekit/components-react";
import { LiveVideoRenderer } from "@/components/living-manna/LiveVideoRenderer";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

interface ChatMessage {
  id: string;
  user_id: string;
  display_name: string;
  message: string;
  timestamp: string;
}

/** Host media controls rendered inside <LiveKitRoom> */
function HostControls({ onEndStream }: { onEndStream: () => void }) {
  const { t } = useTranslation();
  const { localParticipant } = useLocalParticipant();
  const isCameraOn = localParticipant.isCameraEnabled;
  const isMicOn = localParticipant.isMicrophoneEnabled;
  const isScreenSharing = localParticipant.isScreenShareEnabled;

  return (
    <>
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
        title={isCameraOn ? t('liveDemo.stopCamera') : t('liveDemo.startCamera')}
      >
        {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => localParticipant.setScreenShareEnabled(!isScreenSharing)}
        className={isScreenSharing ? "bg-primary text-primary-foreground" : ""}
        title={isScreenSharing ? t('liveDemo.stopScreenShare') : t('liveDemo.shareScreen')}
      >
        {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
      </Button>
      <Button variant="destructive" onClick={onEndStream}>
        {t('liveDemo.endStream')}
      </Button>
    </>
  );
}

/** Active live session content rendered inside <LiveKitRoom> */
function LiveSessionContent({
  isHost,
  activeSession,
  viewers,
  viewerCount,
  chatMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleEndStream,
  chatScrollRef,
  navigate,
}: {
  isHost: boolean;
  activeSession: { id: string; title: string; description: string | null };
  viewers: { user_id: string; display_name: string | null }[];
  viewerCount: number;
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (v: string) => void;
  handleSendMessage: () => void;
  handleEndStream: () => void;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium uppercase">{t('liveDemo.live')}</span>
                </div>
                <h1 className="font-semibold">{activeSession.title}</h1>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{t('liveDemo.watching', { count: viewerCount })}</span>
              </div>
            </div>
          </div>

          {isHost && (
            <div className="flex items-center gap-2">
              <HostControls onEndStream={handleEndStream} />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr,350px] gap-6">
          {/* Video area */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <LiveVideoRenderer />
            </motion.div>

            {/* Viewers list */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('liveDemo.viewers', { count: viewerCount })}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewers.slice(0, 20).map((viewer, i) => (
                    <div
                      key={viewer.user_id || i}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {viewer.display_name || 'Anonymous'}
                    </div>
                  ))}
                  {viewerCount > 20 && (
                    <div className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                      {t('liveDemo.moreViewers', { count: viewerCount - 20 })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat sidebar */}
          <Card className="flex flex-col h-[calc(100vh-200px)]">
            <div className="p-4 border-b">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {t('liveDemo.liveChat')}
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
                    {t('liveDemo.noMessages')}
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
                  placeholder={t('liveDemo.sendMessagePlaceholder')}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LiveDemo() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeSession, viewers, viewerCount, isHost, loading, pastSessions, startSession, endSession, deleteSession, fetchPastSessions, joinSession, leaveSession } = useLiveDemo();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Live");
  const [displayName, setDisplayName] = useState("Anonymous");
  const [isTestingCamera, setIsTestingCamera] = useState(false);

  const testVideoRef = useRef<HTMLVideoElement>(null);
  const testStreamRef = useRef<MediaStream | null>(null);
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

      // Subscribe to chat channel
      chatChannelRef.current = supabase
        .channel(`live-chat-${activeSession.id}`)
        .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
          setChatMessages(prev => [...prev, payload as ChatMessage]);
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

  // Host: Test camera before going live
  const handleTestCamera = async () => {
    if (isTestingCamera) {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach(track => track.stop());
        testStreamRef.current = null;
      }
      setIsTestingCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
        testStreamRef.current = stream;
        setIsTestingCamera(true);
      } catch (error) {
        console.error('Error testing camera:', error);
      }
    }
  };

  // Attach test stream to video element when testing starts
  useEffect(() => {
    if (isTestingCamera && testVideoRef.current && testStreamRef.current) {
      testVideoRef.current.srcObject = testStreamRef.current;
    }
  }, [isTestingCamera]);

  // Host: Go live
  const handleGoLive = async () => {
    // Stop camera test if running
    if (isTestingCamera) {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach(track => track.stop());
        testStreamRef.current = null;
      }
      setIsTestingCamera(false);
    }
    await startSession(sessionTitle, "Live demonstration of Phototheology features");
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
      timestamp: new Date().toISOString()
    };

    await chatChannelRef.current?.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: message
    });

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t('liveDemo.signInRequired')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('liveDemo.signInDescription')}
            </p>
            <Button onClick={() => navigate('/auth')}>{t('common.signIn')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">{t('common.loading')}</h2>
            <p className="text-muted-foreground">{t('liveDemo.checkingForSessions')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No active session - viewer
  if (!activeSession && !isHost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t('liveDemo.noLiveSession')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('liveDemo.noSessionDescription')}
            </p>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.goBack')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No active session - host setup
  if (!activeSession && isHost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-semibold">{sessionTitle}</h1>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t('liveDemo.watching', { count: 0 })}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleGoLive} className="bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              {t('liveDemo.goLive')}
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">{t('liveDemo.sessionSetup')}</h3>
              <Input
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder={t('liveDemo.sessionTitlePlaceholder')}
                className="mb-3"
              />

              {/* Camera Test Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('liveDemo.testCameraMic')}</span>
                  <Button
                    variant={isTestingCamera ? "destructive" : "outline"}
                    size="sm"
                    onClick={handleTestCamera}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {isTestingCamera ? t('liveDemo.stopTest') : t('liveDemo.testCamera')}
                  </Button>
                </div>

                {isTestingCamera && (
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={testVideoRef}
                      autoPlay
                      playsInline
                      muted={false}
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                      {t('liveDemo.cameraMicActive')}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {t('liveDemo.goLiveNotice')}
              </p>
            </CardContent>
          </Card>

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  {t('liveDemo.pastSessions')}
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
                          {session.viewer_count} viewers • {new Date(session.started_at || '').toLocaleDateString()}
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
      </div>
    );
  }

  // Active session - waiting for LiveKit token
  if (tokenLoading || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">{t('liveDemo.live')}</h2>
            <p className="text-muted-foreground">{t('liveDemo.checkingForSessions')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active session - wrapped in LiveKitRoom for real streaming
  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={false}
      video={false}
    >
      <LiveSessionContent
        isHost={isHost}
        activeSession={activeSession}
        viewers={viewers}
        viewerCount={viewerCount}
        chatMessages={chatMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleEndStream={handleEndStream}
        chatScrollRef={chatScrollRef}
        navigate={navigate}
      />
    </LiveKitRoom>
  );
}
