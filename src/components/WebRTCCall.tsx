import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WebRTCCallProps {
  roomId: string;
  userId: string;
  userName: string;
}

export function WebRTCCall({ roomId, userId, userName }: WebRTCCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Set up Supabase realtime channel
      const channel = supabase.channel(`webrtc_${roomId}`);
      channelRef.current = channel;

      // Track presence
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          const users = Object.keys(state);
          setParticipants(users.filter((u) => u !== userId));
        })
        .on("presence", { event: "join" }, ({ key }) => {
          if (key !== userId) {
            createPeerConnection(key);
          }
        })
        .on("presence", { event: "leave" }, ({ key }) => {
          closePeerConnection(key);
        })
        .on("broadcast", { event: "offer" }, ({ payload }) => {
          handleOffer(payload);
        })
        .on("broadcast", { event: "answer" }, ({ payload }) => {
          handleAnswer(payload);
        })
        .on("broadcast", { event: "ice-candidate" }, ({ payload }) => {
          handleIceCandidate(payload);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: userId,
              user_name: userName,
              online_at: new Date().toISOString(),
            });
          }
        });

      setIsCallActive(true);
      toast.success("Call started");
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start call. Please check camera/microphone permissions.");
    }
  };

  const createPeerConnection = async (remoteUserId: string) => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[remoteUserId] = pc;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      const remoteVideo = remoteVideosRef.current[remoteUserId];
      if (remoteVideo && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log("Sending ICE candidate to", remoteUserId);
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: {
            candidate: event.candidate.toJSON(),
            from: userId,
            to: remoteUserId,
          },
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}:`, pc.connectionState);
      if (pc.connectionState === 'failed') {
        toast.error('Connection failed. Retrying...');
        closePeerConnection(remoteUserId);
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    console.log("Sending offer to", remoteUserId);
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "offer",
        payload: {
          offer: { type: offer.type, sdp: offer.sdp },
          from: userId,
          to: remoteUserId,
        },
      });
    }
  };

  const handleOffer = async ({ offer, from }: any) => {
    if (from === userId) return;

    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[from] = pc;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      const remoteVideo = remoteVideosRef.current[from];
      if (remoteVideo && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        console.log("Sending ICE candidate (answer) to", from);
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: {
            candidate: event.candidate.toJSON(),
            from: userId,
            to: from,
          },
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${from}:`, pc.connectionState);
      if (pc.connectionState === 'failed') {
        toast.error('Connection failed. Retrying...');
        closePeerConnection(from);
      }
    };

    console.log("Received offer from", from);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    console.log("Sending answer to", from);
    if (channelRef.current) {
      channelRef.current.send({
        type: "broadcast",
        event: "answer",
        payload: {
          answer: { type: answer.type, sdp: answer.sdp },
          from: userId,
          to: from,
        },
      });
    }
  };

  const handleAnswer = async ({ answer, from }: any) => {
    if (from === userId) return;

    console.log("Received answer from", from);
    const pc = peerConnectionsRef.current[from];
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Set remote description (answer) successfully");
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }
  };

  const handleIceCandidate = async ({ candidate, from, to }: any) => {
    if (from === userId || (to && to !== userId)) return;

    console.log("Received ICE candidate from", from);
    const pc = peerConnectionsRef.current[from];
    if (pc && pc.remoteDescription) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE candidate successfully");
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };

  const closePeerConnection = (remoteUserId: string) => {
    const pc = peerConnectionsRef.current[remoteUserId];
    if (pc) {
      pc.close();
      delete peerConnectionsRef.current[remoteUserId];
    }

    const remoteVideo = remoteVideosRef.current[remoteUserId];
    if (remoteVideo) {
      remoteVideo.srcObject = null;
      delete remoteVideosRef.current[remoteUserId];
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close all peer connections
    Object.keys(peerConnectionsRef.current).forEach((key) => {
      closePeerConnection(key);
    });

    // Unsubscribe from channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setIsCallActive(false);
    setParticipants([]);
    toast.info("Call ended");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {!isCallActive ? (
          <Button onClick={startCall} className="w-full" size="lg">
            <Phone className="mr-2 h-5 w-5" />
            Start Audio/Video Call
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
              </div>

              {participants.map((participantId) => (
                <div
                  key={participantId}
                  className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                >
                  <video
                    ref={(el) => {
                      if (el) remoteVideosRef.current[participantId] = el;
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Participant
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant={isVideoOff ? "destructive" : "secondary"}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
              <Button variant="destructive" size="icon" onClick={endCall}>
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
