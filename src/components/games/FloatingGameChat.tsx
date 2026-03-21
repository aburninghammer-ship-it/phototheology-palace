import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameChat } from "@/hooks/useGameChat";
import { useAuth } from "@/hooks/useAuth";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const REACTION_EMOJIS = ['❤️', '🔥', '👏', '🙏', '💡', '😂'];

interface FloatingGameChatProps {
  /** For multiplayer rooms (DB-backed) */
  roomId?: string | null;
  /** For game lobbies (broadcast-based ephemeral) */
  gameType?: string;
}

function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 65%)`;
}

export function FloatingGameChat({ roomId, gameType }: FloatingGameChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, Record<string, string[]>>>({});
  const { messages, sendMessage } = useGameChat(roomId, gameType);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const channelRef = useRef<any>(null);

  // Set up reaction broadcast channel
  useEffect(() => {
    const channelName = roomId ? `chat-reactions-${roomId}` : gameType ? `chat-reactions-${gameType}` : null;
    if (!channelName) return;

    const channel = supabase.channel(channelName);
    channel
      .on('broadcast', { event: 'emoji-reaction' }, ({ payload }) => {
        const { messageId, emoji, userName } = payload as { messageId: string; emoji: string; userName: string };
        setReactions(prev => {
          const msgReactions = { ...(prev[messageId] || {}) };
          const names = msgReactions[emoji] ? [...msgReactions[emoji]] : [];
          if (!names.includes(userName)) names.push(userName);
          msgReactions[emoji] = names;
          return { ...prev, [messageId]: msgReactions };
        });
      })
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [roomId, gameType]);

  const sendReaction = useCallback((messageId: string, emoji: string) => {
    const userName = user?.user_metadata?.display_name || 'Player';
    channelRef.current?.send({ type: 'broadcast', event: 'emoji-reaction', payload: { messageId, emoji, userName } });
    // Optimistic update
    setReactions(prev => {
      const msgReactions = { ...(prev[messageId] || {}) };
      const names = msgReactions[emoji] ? [...msgReactions[emoji]] : [];
      if (!names.includes(userName)) names.push(userName);
      msgReactions[emoji] = names;
      return { ...prev, [messageId]: msgReactions };
    });
    setReactionPickerFor(null);
  }, [user]);

  // Track unread messages
  useEffect(() => {
    if (!isOpen && messages.length > prevCountRef.current) {
      setUnread((prev) => prev + (messages.length - prevCountRef.current));
    }
    prevCountRef.current = messages.length;
  }, [messages.length, isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  if (!roomId && !gameType) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    setEmojiOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-3 w-80 h-96 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Game Chat</span>
                <span className="text-xs text-muted-foreground">
                  {roomId ? "Room" : "Lobby"}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No messages yet. Say hi! 👋
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.user_id === user?.id;
                const msgReactions = reactions[msg.id] || {};
                const hasReactions = Object.values(msgReactions).some(n => n.length > 0);
                const currentUserName = user?.user_metadata?.display_name || 'Player';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col group relative ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span
                      className="text-[10px] font-medium mb-0.5 px-1"
                      style={{ color: hashColor(msg.user_id) }}
                    >
                      {msg.display_name}
                    </span>
                    <div
                      className={`px-3 py-1.5 rounded-2xl text-sm max-w-[85%] break-words ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.message}
                    </div>

                    {/* Reaction badges */}
                    {hasReactions && (
                      <div className="flex flex-wrap gap-1 mt-0.5 px-1">
                        {Object.entries(msgReactions).map(([emoji, names]) =>
                          names.length > 0 ? (
                            <button
                              key={emoji}
                              onClick={() => sendReaction(msg.id, emoji)}
                              className={cn(
                                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors',
                                names.includes(currentUserName)
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

                    {/* Add reaction trigger */}
                    <div className={`absolute -bottom-1 ${isMe ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                      <button
                        onClick={() => setReactionPickerFor(reactionPickerFor === msg.id ? null : msg.id)}
                        className="h-5 w-5 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-primary/10"
                      >
                        <Smile className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Reaction picker */}
                    <AnimatePresence>
                      {reactionPickerFor === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute -bottom-7 ${isMe ? 'left-0' : 'right-0'} z-20 bg-background border rounded-full shadow-lg px-1.5 py-1 flex gap-0.5`}
                        >
                          {REACTION_EMOJIS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => sendReaction(msg.id, emoji)}
                              className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-sm hover:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-border bg-muted/30">
              <div className="flex gap-1.5 items-center">
                <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-0 z-[9999]" align="start" side="top" sideOffset={8}>
                    <EmojiPickerReact
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={350}
                      searchPlaceHolder="Search..."
                      previewConfig={{ showPreview: false }}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="h-8 text-sm rounded-xl"
                />
                <Button
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-xl"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center relative"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {unread > 0 && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
