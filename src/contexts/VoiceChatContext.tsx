import React, { createContext, useContext, useState, useCallback } from 'react';

interface VoiceChatContextType {
  isVoiceChatActive: boolean;
  currentRoom: string | null;
  isMuted: boolean;
  isDoNotDisturb: boolean;
  joinVoiceChat: (roomId: string) => void;
  leaveVoiceChat: () => void;
  toggleMute: () => void;
  toggleDoNotDisturb: () => void;
}

const VoiceChatContext = createContext<VoiceChatContextType | undefined>(undefined);

export function VoiceChatProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDoNotDisturb, setIsDoNotDisturb] = useState(false);

  const joinVoiceChat = useCallback((roomId: string) => {
    if (isDoNotDisturb) {
      return; // Prevent joining if DND is active
    }
    setCurrentRoom(roomId);
    setIsVoiceChatActive(true);
  }, [isDoNotDisturb]);

  const leaveVoiceChat = useCallback(() => {
    setCurrentRoom(null);
    setIsVoiceChatActive(false);
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleDoNotDisturb = useCallback(() => {
    setIsDoNotDisturb(prev => !prev);
  }, []);

  return (
    <VoiceChatContext.Provider
      value={{
        isVoiceChatActive,
        currentRoom,
        isMuted,
        isDoNotDisturb,
        joinVoiceChat,
        leaveVoiceChat,
        toggleMute,
        toggleDoNotDisturb,
      }}
    >
      {children}
    </VoiceChatContext.Provider>
  );
}

export function useVoiceChat() {
  const context = useContext(VoiceChatContext);
  if (!context) {
    throw new Error('useVoiceChat must be used within VoiceChatProvider');
  }
  return context;
}
