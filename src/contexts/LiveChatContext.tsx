import React, { createContext, useContext, useState } from 'react';

interface LiveChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const LiveChatContext = createContext<LiveChatContextType | undefined>(undefined);

export function LiveChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LiveChatContext.Provider value={{ isOpen, setIsOpen }}>
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
