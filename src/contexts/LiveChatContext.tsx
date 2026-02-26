import React, { createContext, useContext, useState } from 'react';
import { usePublicChat, PublicChatMessage } from '@/hooks/usePublicChat';

interface TypingUser {
  user_id: string;
  display_name: string;
}

interface LiveChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: PublicChatMessage[];
  activeRoomId: string | null;
  typingUsers: TypingUser[];
  sendMessage: (content: string, images?: string[], replyToId?: string | null) => Promise<void>;
  updateTypingIndicator: (isTyping: boolean) => void;
  markRoomAsRead: (roomId: string) => Promise<void>;
  totalUnread: number;
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(undefined);

export function LiveChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    activeRoomId,
    typingUsers,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
    totalUnread,
  } = usePublicChat();

  return (
    <LiveChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        activeRoomId,
        typingUsers,
        sendMessage,
        updateTypingIndicator,
        markRoomAsRead,
        totalUnread,
      }}
    >
      {children}
    </LiveChatContext.Provider>
  );
}

export function useLiveChat() {
  const context = useContext(LiveChatContext);
  if (!context) {
    throw new Error('useLiveChat must be used within a LiveChatProvider');
  }
  return context;
}
