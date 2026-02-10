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

interface ChatMessage {
  id: string;
  user_id: string;
  display_name: string;
  message: string;
  timestamp: string;
}

export default function LiveDemo() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeSession, viewers, viewerCount, isHost, loading, pastSessions, startSession, endSession, deleteSession, fetchPastSessions, joinSession, leaveSession } = useLiveDemo();
  
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

  // Host: Start screen sharing
  const handleStartScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
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
      console.error('Error starting screen share:', error);
    }
  };

  const handleStopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    if (videoRef.current && !isCameraOn) {
      videoRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  };

  // Host: Start camera sharing
  const handleStartCamera = async () => {
    try {
      // Stop screen share if active
      if (isScreenSharing) {
        handleStopScreenShare();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false // Audio handled separately
      });
      
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const handleStopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
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
        console.error('Error accessing microphone:', error);
      }
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      setIsMuted(true);
    }
  };

  // Host: Test camera before going live
  const handleTestCamera = async () => {
    if (isTestingCamera) {
      // Stop test
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach(track => track.stop());
        testStreamRef.current = null;
      }
      setIsTestingCamera(false);
    } else {
      // Start test
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

  // Attach camera/screen stream to video element when it mounts
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
    handleStopScreenShare();
    handleStopCamera();
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    await endSession();
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession || !user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      user_id: user.id,
      display_name: profile?.display_name || 'Anonymous',
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

  // No active session
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
                {activeSession && (
                  <div className="flex items-center gap-1.5 text-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium uppercase">{t('liveDemo.live')}</span>
                  </div>
                )}
                <h1 className="font-semibold">{activeSession?.title || sessionTitle}</h1>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{t('liveDemo.watching', { count: viewerCount })}</span>
              </div>
            </div>
          </div>

          {isHost && (
            <div className="flex items-center gap-2">
              {!activeSession ? (
                <Button onClick={handleGoLive} className="bg-red-600 hover:bg-red-700">
                  <Radio className="w-4 h-4 mr-2" />
                  {t('liveDemo.goLive')}
                </Button>
              ) : (
                <>
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
                    title={isCameraOn ? t('liveDemo.stopCamera') : t('liveDemo.startCamera')}
                  >
                    {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isScreenSharing ? handleStopScreenShare : handleStartScreenShare}
                    className={isScreenSharing ? "bg-primary text-primary-foreground" : ""}
                    title={isScreenSharing ? t('liveDemo.stopScreenShare') : t('liveDemo.shareScreen')}
                  >
                    {isScreenSharing ? <Monitor className="w-4 h-4" /> : <MonitorOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="destructive" onClick={handleEndStream}>
                    {t('liveDemo.endStream')}
                  </Button>
                </>
              )}
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
              className="relative aspect-video bg-black rounded-xl overflow-hidden"
            >
              {(isScreenSharing || isCameraOn) ? (
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
                        <p>{t('liveDemo.clickToStart')}</p>
                      </>
                    ) : (
                      <>
                        <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>{t('liveDemo.waitingForHost')}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Host setup (before going live) */}
            {isHost && !activeSession && (
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
            )}

            {/* Past Sessions (Host only, when not live) */}
            {isHost && !activeSession && pastSessions.length > 0 && (
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

            {/* Viewers list */}
            {activeSession && (
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
            )}
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
    </div>
  );
}
