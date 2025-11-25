import { createContext, useContext, ReactNode } from 'react';
import { useDirectMessages, Conversation, Message } from '@/hooks/useDirectMessages';

interface DirectMessagesContextType {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  startConversation: (otherUserId: string) => Promise<string>;
  sendMessage: (content: string, images?: string[]) => Promise<void>;
  sendNudge: () => Promise<void>;
  updateTypingIndicator: (isTyping: boolean) => Promise<void>;
  typingUsers: Set<string>;
  isLoading: boolean;
  refreshConversations: () => Promise<void>;
}

const DirectMessagesContext = createContext<DirectMessagesContextType | undefined>(undefined);

export function DirectMessagesProvider({ children }: { children: ReactNode }) {
  const directMessages = useDirectMessages();

  return (
    <DirectMessagesContext.Provider value={directMessages}>
      {children}
    </DirectMessagesContext.Provider>
  );
}

export function useDirectMessagesContext() {
  const context = useContext(DirectMessagesContext);
  if (context === undefined) {
    throw new Error('useDirectMessagesContext must be used within DirectMessagesProvider');
  }
  return context;
}
