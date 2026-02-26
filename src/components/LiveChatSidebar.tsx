import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatInput } from '@/components/ChatInput';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { PublicChatMessage } from '@/hooks/usePublicChat';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Sparkles, Reply, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const QUICK_REACTIONS = ['❤️', '🙏', '🔥', '👏', '💎', '✝️'];

function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function MessageBubble({
  message,
  isOwn,
  onReply,
}: {
  message: PublicChatMessage;
  isOwn: boolean;
  onReply: (msg: PublicChatMessage) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const initials = (message.sender?.display_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      {!isOwn && (
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20 ring-offset-1 ring-offset-background">
          <AvatarImage src={message.sender?.avatar_url || undefined} />
          <AvatarFallback className="text-xs bg-gradient-to-br from-primary/30 to-accent/30 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[78%] space-y-1 ${isOwn ? 'items-end' : ''}`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-semibold text-foreground/80">
            {message.sender?.display_name || 'Unknown'}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {formatRelativeTime(message.created_at)}
          </span>
        </div>

        {/* Reply preview */}
        {message.reply_to && (
          <div className="rounded-lg border-l-2 border-primary/50 bg-primary/5 px-2.5 py-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-primary/70">
              {message.reply_to.sender.display_name}:
            </span>{' '}
            {message.reply_to.content.slice(0, 80)}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
            isOwn
              ? 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md'
              : 'bg-muted/70 backdrop-blur-sm rounded-bl-md'
          }`}
        >
          {message.content}
          {message.images && message.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {message.images.map((img, i) => (
                <img key={i} src={img} alt="" className="max-h-44 rounded-xl shadow-md" />
              ))}
            </div>
          )}
        </div>

        {/* Quick reaction bar */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-0.5 ${isOwn ? 'justify-end' : ''}`}
            >
              {QUICK_REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  className="text-sm hover:scale-125 transition-transform p-0.5 rounded hover:bg-muted"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onReply(message)}
                    className="ml-1 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Reply className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Reply</TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function LiveChatSidebar() {
  const { user } = useAuth();
  const {
    isOpen,
    setIsOpen,
    messages,
    activeRoomId,
    typingUsers,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
  } = useLiveChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<PublicChatMessage | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when opening
  useEffect(() => {
    if (isOpen && activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [isOpen, activeRoomId, markRoomAsRead]);

  if (!user) return null;

  const handleSend = (content: string, images?: string[]) => {
    sendMessage(content, images, replyTo?.id || null);
    setReplyTo(null);
  };

  const handleTyping = () => {
    updateTypingIndicator(true);
  };

  const onlineCount = typingUsers.length + 1; // simplified

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md border-l border-border/30 bg-background/95 backdrop-blur-xl">
        {/* Gradient Header */}
        <SheetHeader className="relative overflow-hidden border-b border-border/30 px-5 py-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                Live Chat
                <Sparkles className="h-4 w-4 text-primary/60" />
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Global fellowship room
              </SheetDescription>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium">{messages.length > 0 ? 'Active' : 'Open'}</span>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15">
                  <MessageSquare className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No messages yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Start the conversation! 💬
                </p>
              </motion.div>
            )}
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.sender_id === user.id}
                onReply={setReplyTo}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Typing indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 py-1.5 text-xs text-muted-foreground flex items-center gap-2"
            >
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="italic">
                {typingUsers.map(u => u.display_name).join(', ')}{' '}
                {typingUsers.length === 1 ? 'is' : 'are'} typing
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reply preview */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-3 border-t border-primary/20 bg-primary/5 px-4 py-2.5"
            >
              <Reply className="h-4 w-4 text-primary/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary/70">
                  {replyTo.sender?.display_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {replyTo.content.slice(0, 60)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setReplyTo(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="border-t border-border/30 bg-muted/20 p-3" onKeyDown={handleTyping}>
          <ChatInput
            onSend={handleSend}
            placeholder="Say something... ✨"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
