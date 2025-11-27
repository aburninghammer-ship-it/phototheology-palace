import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  userId: string;
  name: string;
  isMuted: boolean;
}

export const useVoiceCall = (roomId: string, userId: string, userName: string) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = (remoteUserId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            from: userId,
            to: remoteUserId,
          },
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      const audioElement = new Audio();
      audioElement.srcObject = remoteStream;
      audioElement.play();
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}:`, pc.connectionState);
    };

    return pc;
  };

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false 
      });
      
      localStreamRef.current = stream;
      setIsInCall(true);

      const channel = supabase.channel(`voice-room:${roomId}`)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const presentUsers = Object.values(state).flat().map((p: any) => ({
            userId: p.userId,
            name: p.name,
            isMuted: p.isMuted,
          }));
          setParticipants(presentUsers);
        })
        .on('presence', { event: 'join' }, async ({ newPresences }) => {
          for (const presence of (newPresences as any[])) {
            if (presence.userId !== userId) {
              await initiateCall(presence.userId);
            }
          }
        })
        .on('broadcast', { event: 'offer' }, async ({ payload }) => {
          if (payload.to === userId) {
            await handleOffer(payload);
          }
        })
        .on('broadcast', { event: 'answer' }, async ({ payload }) => {
          if (payload.to === userId) {
            await handleAnswer(payload);
          }
        })
        .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
          if (payload.to === userId) {
            await handleIceCandidate(payload);
          }
        })
        .on('broadcast', { event: 'mute-status' }, ({ payload }) => {
          setParticipants(prev => 
            prev.map(p => 
              p.userId === payload.userId 
                ? { ...p, isMuted: payload.isMuted }
                : p
            )
          );
        });

      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
            name: userName,
            isMuted: false,
          });
        }
      });

      channelRef.current = channel;

      toast({
        title: "Joined call",
        description: "You're now in the voice room",
      });
    } catch (error) {
      console.error('Error joining call:', error);
      toast({
        title: "Failed to join call",
        description: "Please check your microphone permissions",
        variant: "destructive",
      });
    }
  };

  const initiateCall = async (remoteUserId: string) => {
    const pc = createPeerConnection(remoteUserId);
    peerConnectionsRef.current.set(remoteUserId, pc);

    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'offer',
      payload: {
        offer,
        from: userId,
        to: remoteUserId,
      },
    });
  };

  const handleOffer = async (payload: any) => {
    const pc = createPeerConnection(payload.from);
    peerConnectionsRef.current.set(payload.from, pc);

    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'answer',
      payload: {
        answer,
        from: userId,
        to: payload.from,
      },
    });
  };

  const handleAnswer = async (payload: any) => {
    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
    }
  };

  const handleIceCandidate = async (payload: any) => {
    const pc = peerConnectionsRef.current.get(payload.from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);

      channelRef.current?.send({
        type: 'broadcast',
        event: 'mute-status',
        payload: { userId, isMuted: !audioTrack.enabled },
      });
    }
  };

  const leaveCall = () => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    channelRef.current?.unsubscribe();
    
    setIsInCall(false);
    setIsMuted(false);
    setParticipants([]);

    toast({
      title: "Left call",
      description: "You've disconnected from the voice room",
    });
  };

  useEffect(() => {
    return () => {
      if (isInCall) {
        leaveCall();
      }
    };
  }, []);

  return {
    isInCall,
    isMuted,
    participants,
    joinCall,
    leaveCall,
    toggleMute,
  };
};
