// In-Game Chat Panel
// Real-time chat with emojis and emoji reactions

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ChevronRight, ChevronLeft, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const QUICK_EMOJIS = ['🙏', '🔥', '💡', '📖', '✝️', '⭐', '👏', '❤️', '😊', '🎯', '💪', '🕊️'];
const REACTION_EMOJIS = ['❤️', '🔥', '👏', '🙏', '💡', '😂'];

interface ChatMessage {
  id: string;
  playerName: string;
  message: string;
  timestamp: string;
  reactions?: Record<string, string[]>; // emoji → list of playerNames
}

interface FloatingEmoji {
  id: string;
  x: number;
  emoji: string;
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel(`game-chat-${gameId}`);
    channel
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        const msg = payload as ChatMessage;
        setMessages(prev => [...prev, { ...msg, reactions: msg.reactions || {} }]);
        if (!isOpen) setUnreadCount(prev => prev + 1);
      })
      .on('broadcast', { event: 'emoji-reaction' }, ({ payload }) => {
        const { messageId, emoji, player } = payload as { messageId: string; emoji: string; player: string };
        spawnFloatingEmoji(emoji);
        setMessages(prev => prev.map(m => {
          if (m.id !== messageId) return m;
          const reactions = { ...(m.reactions || {}) };
          const names = reactions[emoji] ? [...reactions[emoji]] : [];
          if (!names.includes(player)) names.push(player);
          reactions[emoji] = names;
          return { ...m, reactions };
        }));
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

  const spawnFloatingEmoji = useCallback((emoji: string) => {
    const item: FloatingEmoji = { id: crypto.randomUUID(), x: Math.random() * 60 + 20, emoji };
    setFloatingEmojis(prev => [...prev, item]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(h => h.id !== item.id)), 2000);
  }, []);

  const sendReaction = useCallback((messageId: string, emoji: string) => {
    if (!channelRef.current) return;
    channelRef.current.send({ type: 'broadcast', event: 'emoji-reaction', payload: { messageId, emoji, player: playerName } });
    spawnFloatingEmoji(emoji);
    // Optimistic local update
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const reactions = { ...(m.reactions || {}) };
      const names = reactions[emoji] ? [...reactions[emoji]] : [];
      if (!names.includes(playerName)) names.push(playerName);
      reactions[emoji] = names;
      return { ...m, reactions };
    }));
    setReactionPickerFor(null);
  }, [playerName, spawnFloatingEmoji]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !channelRef.current) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      playerName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
    };
    channelRef.current.send({ type: 'broadcast', event: 'chat-message', payload: msg });
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  }, [newMessage, playerName]);

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const totalReactions = (reactions: Record<string, string[]>) =>
    Object.values(reactions).reduce((sum, names) => sum + names.length, 0);

  return (
    <div className={cn('fixed right-0 top-20 bottom-44 z-30 flex transition-all duration-300', isOpen ? 'w-72 md:w-80' : 'w-10', className)}>
      {/* Floating emojis */}
      <AnimatePresence>
        {floatingEmojis.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -200, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none text-2xl"
            style={{ left: `${item.x}%`, bottom: '30%' }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-4 z-50 h-6 w-6 rounded-full bg-background border shadow-sm"
        onClick={() => { setIsOpen(!isOpen); setReactionPickerFor(null); }}
      >
        {isOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Collapsed */}
      {!isOpen && (
        <div className="w-10 h-full bg-background/80 backdrop-blur border-l flex flex-col items-center py-4 gap-2 relative">
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
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
              <div key={msg.id} className={cn('p-2 rounded-lg text-sm group relative', msg.playerName === playerName ? 'bg-primary/10 ml-4' : 'bg-muted mr-4')}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs">{msg.playerName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.message}</p>

                {/* Existing reactions */}
                {msg.reactions && totalReactions(msg.reactions) > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {Object.entries(msg.reactions).map(([emoji, names]) =>
                      names.length > 0 ? (
                        <button
                          key={emoji}
                          onClick={() => sendReaction(msg.id, emoji)}
                          className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] border transition-colors',
                            names.includes(playerName)
                              ? 'bg-primary/15 border-primary/30 text-primary'
                              : 'bg-muted/50 border-border/50 hover:bg-primary/10'
                          )}
                          title={names.join(', ')}
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{names.length}</span>
                        </button>
                      ) : null
                    )}
                  </div>
                )}

                {/* Add reaction button — visible on hover or tap */}
                <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => setReactionPickerFor(reactionPickerFor === msg.id ? null : msg.id)}
                    className="h-5 w-5 rounded-full bg-background border shadow-sm flex items-center justify-center text-[10px] hover:bg-primary/10"
                  >
                    <Smile className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>

                {/* Reaction picker popup */}
                <AnimatePresence>
                  {reactionPickerFor === msg.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 4 }}
                      className="absolute -bottom-8 right-0 z-20 bg-background border rounded-full shadow-lg px-1.5 py-1 flex gap-0.5"
                    >
                      {REACTION_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => sendReaction(msg.id, emoji)}
                          className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-base hover:scale-125"
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Emoji picker for composing */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t"
              >
                <div className="p-2 grid grid-cols-6 gap-1">
                  {QUICK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="h-8 w-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-2 border-t flex gap-1.5 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
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
