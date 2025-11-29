import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, PhoneOff, Phone, Users, Volume2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { VoiceChatInviteDialog } from "./VoiceChatInviteDialog";

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking?: boolean;
}

interface SimpleVoiceRoomProps {
  roomId: string;
  userId: string;
  userName: string;
  roomName?: string;
  className?: string;
}

export function SimpleVoiceRoom({ roomId, userId, userName, roomName, className }: SimpleVoiceRoomProps) {
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const iceConfig: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const cleanup = useCallback(() => {
    // Stop local stream
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;

    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    // Remove audio elements
    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.srcObject = null;
    });
    audioElementsRef.current.clear();

    // Unsubscribe from channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  const createPeerConnection = useCallback((remoteUserId: string): RTCPeerConnection => {
    console.log(`Creating peer connection for: ${remoteUserId}`);
    
    const pc = new RTCPeerConnection(iceConfig);

    // Add local tracks
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice",
          payload: {
            candidate: event.candidate.toJSON(),
            from: userId,
            to: remoteUserId,
          },
        });
      }
    };

    // Handle remote audio
    pc.ontrack = (event) => {
      console.log(`Received audio track from: ${remoteUserId}`, event.track);
      const [stream] = event.streams;
      
      if (!stream) {
        console.error(`No stream received from: ${remoteUserId}`);
        return;
      }
      
      // Remove existing audio element if any
      const existingAudio = audioElementsRef.current.get(remoteUserId);
      if (existingAudio) {
        existingAudio.pause();
        existingAudio.srcObject = null;
      }
      
      // Create new audio element with proper settings
      const audio = new Audio();
      audio.autoplay = true;
      audio.setAttribute('playsinline', 'true');
      audio.volume = 1.0;
      audio.muted = false;
      audioElementsRef.current.set(remoteUserId, audio);
      
      // Set stream and play with retry
      audio.srcObject = stream;
      
      const playAudio = async () => {
        try {
          await audio.play();
          console.log(`Audio playing for: ${remoteUserId}`);
        } catch (e) {
          console.warn("Audio play blocked, retrying on user interaction:", e);
          // Add click handler to body for user interaction
          const playOnClick = async () => {
            try {
              await audio.play();
              console.log(`Audio playing after interaction for: ${remoteUserId}`);
              document.body.removeEventListener('click', playOnClick);
            } catch (err) {
              console.error("Audio play error:", err);
            }
          };
          document.body.addEventListener('click', playOnClick, { once: true });
          toast.info("Click anywhere to enable audio from other users");
        }
      };
      
      playAudio();
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}: ${pc.connectionState}`);
      if (pc.connectionState === "connected") {
        toast.success(`Connected to ${remoteUserId.slice(0, 8)}...`);
      }
    };

    return pc;
  }, [userId, iceConfig]);

  const sendOffer = useCallback(async (remoteUserId: string) => {
    const pc = createPeerConnection(remoteUserId);
    peerConnectionsRef.current.set(remoteUserId, pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    channelRef.current?.send({
      type: "broadcast",
      event: "offer",
      payload: {
        sdp: offer.sdp,
        type: offer.type,
        from: userId,
        to: remoteUserId,
      },
    });
  }, [createPeerConnection, userId]);

  const handleOffer = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;
    console.log(`Received offer from: ${payload.from}`);

    const pc = createPeerConnection(payload.from);
    peerConnectionsRef.current.set(payload.from, pc);

    await pc.setRemoteDescription({ type: payload.type, sdp: payload.sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    channelRef.current?.send({
      type: "broadcast",
      event: "answer",
      payload: {
        sdp: answer.sdp,
        type: answer.type,
        from: userId,
        to: payload.from,
      },
    });
  }, [createPeerConnection, userId]);

  const handleAnswer = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;
    console.log(`Received answer from: ${payload.from}`);

    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription({ type: payload.type, sdp: payload.sdp });
    }
  }, [userId]);

  const handleIce = useCallback(async (payload: any) => {
    if (payload.to !== userId) return;

    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc && pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    }
  }, [userId]);

  const joinRoom = async () => {
    setIsConnecting(true);
    try {
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;

      // Create channel
      const channel = supabase.channel(`voice-${roomId}`, {
        config: { presence: { key: userId } },
      });
      channelRef.current = channel;

      // Handle presence
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: Participant[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          const p = (presences as any[])[0];
          if (p) {
            users.push({
              id: key,
              name: p.name || key.slice(0, 8),
              isMuted: p.isMuted || false,
            });
          }
        });
        
        setParticipants(users);
      });

      channel.on("presence", { event: "join" }, async ({ key, newPresences }) => {
        if (key !== userId) {
          console.log(`User joined: ${key}`);
          // Lower ID initiates connection
          if (userId < key) {
            await sendOffer(key);
          }
        }
      });

      channel.on("presence", { event: "leave" }, ({ key }) => {
        console.log(`User left: ${key}`);
        const pc = peerConnectionsRef.current.get(key);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(key);
        }
        const audio = audioElementsRef.current.get(key);
        if (audio) {
          audio.pause();
          audio.srcObject = null;
          audioElementsRef.current.delete(key);
        }
      });

      // Handle signaling
      channel.on("broadcast", { event: "offer" }, ({ payload }) => handleOffer(payload));
      channel.on("broadcast", { event: "answer" }, ({ payload }) => handleAnswer(payload));
      channel.on("broadcast", { event: "ice" }, ({ payload }) => handleIce(payload));

      await channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name: userName, isMuted: false });
          setIsInRoom(true);
          setIsConnecting(false);
          toast.success("Joined voice room");
        }
      });
    } catch (error) {
      console.error("Error joining room:", error);
      setIsConnecting(false);
      toast.error("Failed to join. Check microphone permissions.");
      cleanup();
    }
  };

  const leaveRoom = () => {
    cleanup();
    setIsInRoom(false);
    setIsMuted(false);
    setParticipants([]);
    toast.info("Left voice room");
  };

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
      
      // Update presence
      channelRef.current?.track({ name: userName, isMuted: !track.enabled });
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!isInRoom) {
    return (
      <Button
        onClick={joinRoom}
        disabled={isConnecting}
        variant="outline"
        className={cn("gap-2", className)}
      >
        <Phone className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Join Voice"}
      </Button>
    );
  }

  return (
    <Card className={cn("bg-card/50 backdrop-blur", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants.length} in room</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Live</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {participants.map((p) => (
            <div
              key={p.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                p.id === userId
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {p.isMuted ? (
                <MicOff className="h-3 w-3 text-destructive" />
              ) : (
                <Mic className="h-3 w-3 text-green-500" />
              )}
              <span>{p.id === userId ? "You" : p.name}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleMute}
            variant={isMuted ? "destructive" : "secondary"}
            size="sm"
            className="flex-1"
          >
            {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <VoiceChatInviteDialog roomId={roomId} roomName={roomName || roomId} />
          <Button onClick={leaveRoom} variant="outline" size="sm">
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
