import React, { createContext, useContext, useState } from 'react';
import { usePublicChat, PublicChatMessage, ReactionsMap } from '@/hooks/usePublicChat';

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
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  getThreadMessages: (parentId: string) => PublicChatMessage[];
  reactions: ReactionsMap;
  toggleReaction: (messageId: string, emoji: string) => Promise<void>;
  draftMessage: string;
  setDraftMessage: (msg: string) => void;
  draftImages: string[];
  setDraftImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(undefined);

export function LiveChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const {
    messages,
    activeRoomId,
    typingUsers,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
    totalUnread,
    deleteMessage,
    editMessage,
    getThreadMessages,
    reactions,
    toggleReaction,
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
        deleteMessage,
        editMessage,
        getThreadMessages,
        reactions,
        toggleReaction,
        draftMessage,
        setDraftMessage,
        draftImages,
        setDraftImages,
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
