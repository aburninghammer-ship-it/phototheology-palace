// In-Game Chat Panel
// Real-time chat using Supabase broadcast channels during PT Scrabble games

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  playerName: string;
  message: string;
  timestamp: string;
}

interface InGameChatProps {
  gameId: string;
  playerName: string;
  className?: string;
}

export function InGameChat({ gameId, playerName, className }: InGameChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel(`game-chat-${gameId}`);
    channel
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        const msg = payload as ChatMessage;
        setMessages(prev => [...prev, msg]);
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [gameId]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [isOpen, messages.length]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !channelRef.current) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      playerName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    channelRef.current.send({ type: 'broadcast', event: 'chat-message', payload: msg });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  }, [newMessage, playerName]);

  return (
    <div className={cn('fixed right-0 top-20 bottom-44 z-30 flex transition-all duration-300', isOpen ? 'w-72 md:w-80' : 'w-10', className)}>
      {/* Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-4 z-50 h-6 w-6 rounded-full bg-background border shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Collapsed */}
      {!isOpen && (
        <div className="w-10 h-full bg-background/80 backdrop-blur border-l flex flex-col items-center py-4 gap-2 relative">
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Chat
          </span>
        </div>
      )}

      {/* Expanded */}
      {isOpen && (
        <div className="w-72 md:w-80 h-full bg-background/95 backdrop-blur border-l flex flex-col">
          <div className="p-3 border-b flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="font-semibold">Game Chat</span>
            <span className="text-xs text-muted-foreground ml-auto">{messages.length} msgs</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={cn('p-2 rounded-lg text-sm', msg.playerName === playerName ? 'bg-primary/10 ml-4' : 'bg-muted mr-4')}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{msg.playerName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button size="icon" className="h-8 w-8 shrink-0" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
