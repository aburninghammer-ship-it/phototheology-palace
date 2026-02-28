import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ChatInput';
import { PublicChatMessage, ReactionGroup, ReactionsMap } from '@/hooks/usePublicChat';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquareText, Trash2 } from 'lucide-react';
import { renderWithMentions } from '@/components/MentionAutocomplete';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const QUICK_REACTIONS = ['❤️', '🙏', '🔥', '👏', '💎', '✝️'];

interface LiveChatThreadPanelProps {
  parentMessage: PublicChatMessage;
  threadMessages: PublicChatMessage[];
  currentUserId: string;
  onClose: () => void;
  onSendReply: (content: string, parentId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  reactions: ReactionsMap;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

function ThreadMessage({
  message,
  isOwn,
  onDelete,
  reactionGroups,
  onToggleReaction,
  currentUserId,
}: {
  message: PublicChatMessage;
  isOwn: boolean;
  onDelete: (id: string) => void;
  reactionGroups: ReactionGroup[];
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUserId: string;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const initials = (message.sender?.display_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isDeleted = (message as any).is_deleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
        <AvatarImage src={message.sender?.avatar_url || undefined} />
        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={`max-w-[80%] space-y-0.5 ${isOwn ? 'items-end' : ''}`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-[11px] font-semibold text-foreground/80">
            {message.sender?.display_name || 'Unknown'}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
        <div
          className={`relative rounded-xl px-3 py-2 text-sm leading-relaxed ${
            isDeleted
              ? 'bg-muted/40 italic text-muted-foreground'
              : isOwn
              ? 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-sm'
              : 'bg-muted/70 rounded-bl-sm'
          }`}
        >
          {isDeleted ? 'This message was deleted' : renderWithMentions(message.content)}
        </div>
        {/* Reaction summary badges */}
        {reactionGroups.length > 0 && (
          <div className={`flex flex-wrap gap-1 ${isOwn ? 'justify-end' : ''}`}>
            {reactionGroups.map(g => {
              const isMine = g.user_ids.includes(currentUserId);
              return (
                <button
                  key={g.emoji}
                  onClick={() => onToggleReaction(message.id, g.emoji)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
                    isMine
                      ? 'bg-primary/20 ring-1 ring-primary/40 text-primary'
                      : 'bg-muted/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span>{g.emoji}</span>
                  <span className="font-medium">{g.user_ids.length}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick reaction bar */}
        <AnimatePresence>
          {showReactions && !isDeleted && (
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
                  onClick={() => onToggleReaction(message.id, emoji)}
                  className="text-sm hover:scale-125 transition-transform p-0.5 rounded hover:bg-muted"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              {isOwn && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="ml-0.5 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete message?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This message will be removed for everyone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(message.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function LiveChatThreadPanel({
  parentMessage,
  threadMessages,
  currentUserId,
  onClose,
  onSendReply,
  onDeleteMessage,
  reactions,
  onToggleReaction,
}: LiveChatThreadPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length]);

  const parentInitials = (parentMessage.sender?.display_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-0 z-10 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/30 px-4 py-3 bg-muted/30">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <MessageSquareText className="h-4 w-4 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Thread</p>
          <p className="text-xs text-muted-foreground truncate">
            {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
          </p>
        </div>
      </div>

      {/* Parent message */}
      <div className="border-b border-border/20 px-4 py-3 bg-primary/5">
        <div className="flex gap-2.5">
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
            <AvatarImage src={parentMessage.sender?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/30 to-accent/30 text-primary font-bold">
              {parentInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold">{parentMessage.sender?.display_name}</span>
              <span className="text-[10px] text-muted-foreground/60">
                {formatRelativeTime(parentMessage.created_at)}
              </span>
            </div>
            <p className="text-sm mt-1">{parentMessage.content}</p>
          </div>
        </div>
      </div>

      {/* Thread replies */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-4">
          {threadMessages.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center text-muted-foreground">
              <MessageSquareText className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No replies yet</p>
              <p className="text-xs opacity-60">Be the first to reply!</p>
            </div>
          )}
          {threadMessages.map(msg => (
            <ThreadMessage
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUserId}
              onDelete={onDeleteMessage}
              reactionGroups={reactions[msg.id] || []}
              onToggleReaction={onToggleReaction}
              currentUserId={currentUserId}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Reply input */}
      <div className="border-t border-border/30 bg-muted/20 p-3">
        <ChatInput
          onSend={(content) => onSendReply(content, parentMessage.id)}
          placeholder="Reply to thread... ✨"
        />
      </div>
    </motion.div>
  );
}
