import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameChat } from "@/hooks/useGameChat";
import { useAuth } from "@/hooks/useAuth";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const { messages, sendMessage } = useGameChat(roomId, gameType);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

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
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
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
