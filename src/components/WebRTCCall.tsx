import { useEffect, useRef, useState, useCallback } from "react";
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
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);
  // Buffer for ICE candidates that arrive before remote description is set
  const iceCandidateBufferRef = useRef<{ [key: string]: RTCIceCandidateInit[] }>({});

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
    ],
    iceCandidatePoolSize: 10,
  };

  const processBufferedCandidates = async (remoteUserId: string) => {
    const pc = peerConnectionsRef.current[remoteUserId];
    const buffer = iceCandidateBufferRef.current[remoteUserId];
    
    if (pc && pc.remoteDescription && buffer && buffer.length > 0) {
      console.log(`Processing ${buffer.length} buffered ICE candidates for ${remoteUserId}`);
      for (const candidate of buffer) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Added buffered ICE candidate successfully");
        } catch (error) {
          console.error("Error adding buffered ICE candidate:", error);
        }
      }
      // Clear the buffer
      iceCandidateBufferRef.current[remoteUserId] = [];
    }
  };

  const startCall = async () => {
    try {
      console.log("Starting call for user:", userId, "in room:", roomId);
      setConnectionStatus("Getting media...");
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      localStreamRef.current = stream;
      console.log("Got local stream with tracks:", stream.getTracks().map(t => `${t.kind}:${t.enabled}`));
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setConnectionStatus("Connecting...");

      // Set up Supabase realtime channel
      const channel = supabase.channel(`webrtc_${roomId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: userId },
        },
      });
      channelRef.current = channel;

      // Track presence
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          console.log("Presence sync - raw state:", JSON.stringify(state));
          const users = Object.keys(state);
          const otherUsers = users.filter((u) => u !== userId);
          console.log("Presence sync - other users:", otherUsers);
          
          // Only update participants if we have other users, don't clear existing ones
          if (otherUsers.length > 0) {
            setParticipants(prev => {
              // Merge existing participants with new ones from sync
              const merged = [...new Set([...prev, ...otherUsers])];
              console.log("Participants after sync merge:", merged);
              return merged;
            });
            
            // Create peer connections for existing users
            otherUsers.forEach((remoteUserId) => {
              if (!peerConnectionsRef.current[remoteUserId]) {
                // Only the user with the lower ID initiates
                if (userId < remoteUserId) {
                  console.log("Creating peer connection for existing user (sync):", remoteUserId);
                  createPeerConnection(remoteUserId);
                }
              }
            });
          }
        })
        .on("presence", { event: "join" }, ({ key }) => {
          console.log("User joined:", key);
          if (key !== userId) {
            // Add to participants list immediately
            setParticipants(prev => {
              if (!prev.includes(key)) {
                console.log("Adding participant to list:", key);
                return [...prev, key];
              }
              return prev;
            });
            
            if (!peerConnectionsRef.current[key]) {
              // Only the user with the lower ID initiates the connection to avoid dual offers
              if (userId < key) {
                console.log("We initiate connection to:", key);
                createPeerConnection(key);
              } else {
                console.log("Waiting for connection from:", key);
              }
            }
          }
        })
        .on("presence", { event: "leave" }, ({ key }) => {
          console.log("User left:", key);
          closePeerConnection(key);
          setParticipants(prev => prev.filter(p => p !== key));
        })
        .on("broadcast", { event: "offer" }, ({ payload }) => {
          console.log("Received offer broadcast:", payload.from);
          if (payload.to === userId) {
            handleOffer(payload);
          }
        })
        .on("broadcast", { event: "answer" }, ({ payload }) => {
          console.log("Received answer broadcast:", payload.from);
          if (payload.to === userId) {
            handleAnswer(payload);
          }
        })
        .on("broadcast", { event: "ice-candidate" }, ({ payload }) => {
          if (payload.to === userId) {
            handleIceCandidate(payload);
          }
        })
        .subscribe(async (status) => {
          console.log("Channel subscription status:", status);
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: userId,
              user_name: userName,
              online_at: new Date().toISOString(),
            });
            setConnectionStatus("In call - establishing connection...");
          }
        });

      setIsCallActive(true);
      toast.success("Call started - waiting for others to join");
    } catch (error) {
      console.error("Error starting call:", error);
      setConnectionStatus("Error");
      toast.error("Failed to start call. Please check camera/microphone permissions.");
    }
  };

  const createPeerConnection = async (remoteUserId: string) => {
    console.log("Creating peer connection to:", remoteUserId);
    
    // Initialize ICE candidate buffer for this peer
    iceCandidateBufferRef.current[remoteUserId] = [];

    const pc = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[remoteUserId] = pc;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track.kind);
        pc.addTrack(track, localStreamRef.current!);
      });
    } else {
      console.warn("No local stream available when creating peer connection");
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind, "streams:", event.streams.length);
      const remoteVideo = remoteVideosRef.current[remoteUserId];
      if (remoteVideo && event.streams[0]) {
        console.log("Setting remote video srcObject");
        remoteVideo.srcObject = event.streams[0];
        // Ensure the video plays
        remoteVideo.play().catch(e => console.log("Video play error (expected):", e));
      } else {
        console.warn("No remote video element found for:", remoteUserId);
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

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${remoteUserId}:`, pc.iceConnectionState);
      setConnectionStatus(`ICE: ${pc.iceConnectionState}`);
      
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionStatus("Connected!");
        toast.success("Connected to peer!");
      } else if (pc.iceConnectionState === 'disconnected') {
        setConnectionStatus("Disconnected - attempting reconnection...");
      } else if (pc.iceConnectionState === 'failed') {
        toast.error('Connection failed. Please try again.');
        setConnectionStatus("Connection failed");
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

    // Handle negotiation needed
    pc.onnegotiationneeded = async () => {
      console.log("Negotiation needed for:", remoteUserId);
    };

    // Create and send offer
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
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
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleOffer = async ({ offer, from }: any) => {
    console.log("Handling offer from:", from);
    
    // Initialize ICE candidate buffer for this peer
    iceCandidateBufferRef.current[from] = [];

    const pc = new RTCPeerConnection(configuration);
    peerConnectionsRef.current[from] = pc;

    // Add local stream tracks BEFORE setting remote description
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        console.log("Adding track to answering peer connection:", track.kind);
        pc.addTrack(track, localStreamRef.current!);
      });
    } else {
      console.warn("No local stream available when handling offer");
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log("Received remote track (answer):", event.track.kind, "streams:", event.streams.length);
      const remoteVideo = remoteVideosRef.current[from];
      if (remoteVideo && event.streams[0]) {
        console.log("Setting remote video srcObject (answer)");
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.play().catch(e => console.log("Video play error (expected):", e));
      } else {
        console.warn("No remote video element found for (answer):", from);
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

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${from}:`, pc.iceConnectionState);
      setConnectionStatus(`ICE: ${pc.iceConnectionState}`);
      
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionStatus("Connected!");
        toast.success("Connected to peer!");
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

    try {
      console.log("Setting remote description (offer)");
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Process any buffered ICE candidates
      await processBufferedCandidates(from);
      
      console.log("Creating answer");
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
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async ({ answer, from }: any) => {
    console.log("Handling answer from:", from);
    const pc = peerConnectionsRef.current[from];
    if (pc) {
      try {
        console.log("Setting remote description (answer)");
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Set remote description (answer) successfully");
        
        // Process any buffered ICE candidates
        await processBufferedCandidates(from);
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    } else {
      console.warn("No peer connection found for answer from:", from);
    }
  };

  const handleIceCandidate = async ({ candidate, from }: any) => {
    console.log("Handling ICE candidate from:", from);
    const pc = peerConnectionsRef.current[from];
    
    if (!pc) {
      console.log("Buffering ICE candidate - no peer connection yet for:", from);
      if (!iceCandidateBufferRef.current[from]) {
        iceCandidateBufferRef.current[from] = [];
      }
      iceCandidateBufferRef.current[from].push(candidate);
      return;
    }
    
    if (!pc.remoteDescription) {
      console.log("Buffering ICE candidate - no remote description yet for:", from);
      if (!iceCandidateBufferRef.current[from]) {
        iceCandidateBufferRef.current[from] = [];
      }
      iceCandidateBufferRef.current[from].push(candidate);
      return;
    }
    
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Added ICE candidate successfully");
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };

  const closePeerConnection = (remoteUserId: string) => {
    console.log("Closing peer connection for:", remoteUserId);
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
    
    // Clear ICE candidate buffer
    delete iceCandidateBufferRef.current[remoteUserId];
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
    console.log("Ending call");
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

    // Clear ICE candidate buffers
    iceCandidateBufferRef.current = {};

    setIsCallActive(false);
    setParticipants([]);
    setConnectionStatus("");
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
            {connectionStatus && (
              <div className={`text-center text-sm mb-2 ${
                connectionStatus.includes("Connected!") 
                  ? "text-green-500 font-medium" 
                  : connectionStatus.includes("failed") 
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}>
                Status: {connectionStatus}
                {participants.length > 0 && !connectionStatus.includes("Connected!") && (
                  <span className="ml-2">• {participants.length} participant(s) in call</span>
                )}
              </div>
            )}
            
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
                  You {isMuted && "(muted)"}
                </div>
              </div>

              {participants.map((participantId) => (
                <div
                  key={participantId}
                  className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        remoteVideosRef.current[participantId] = el;
                        // If we already have a stream for this participant, set it
                        const pc = peerConnectionsRef.current[participantId];
                        if (pc) {
                          const receivers = pc.getReceivers();
                          const videoReceiver = receivers.find(r => r.track?.kind === 'video');
                          if (videoReceiver && videoReceiver.track) {
                            const stream = new MediaStream([videoReceiver.track]);
                            const audioReceiver = receivers.find(r => r.track?.kind === 'audio');
                            if (audioReceiver && audioReceiver.track) {
                              stream.addTrack(audioReceiver.track);
                            }
                            el.srcObject = stream;
                          }
                        }
                      }
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
              
              {participants.length === 0 && (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="animate-pulse mb-2">
                      <Phone className="h-8 w-8 text-muted-foreground mx-auto" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Waiting for others to join...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share this room link with others
                    </p>
                  </div>
                </div>
              )}
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
