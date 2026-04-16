import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatInput } from '@/components/ChatInput';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { PublicChatMessage, ReactionGroup } from '@/hooks/usePublicChat';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Sparkles, Reply, X, Trash2, MessageSquareText, Pencil, Check } from 'lucide-react';
import { renderWithMentions } from '@/components/MentionAutocomplete';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LiveChatThreadPanel } from '@/components/LiveChatThreadPanel';
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
  onOpenThread,
  onDelete,
  onEdit,
  threadCount,
  reactionGroups,
  onToggleReaction,
  currentUserId,
}: {
  message: PublicChatMessage;
  isOwn: boolean;
  onReply: (msg: PublicChatMessage) => void;
  onOpenThread: (msg: PublicChatMessage) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  threadCount: number;
  reactionGroups: ReactionGroup[];
  onToggleReaction: (messageId: string, emoji: string) => void;
  currentUserId: string;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const initials = (message.sender?.display_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isDeleted = (message as any).is_deleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
      onTouchStart={() => setShowReactions(prev => !prev)}
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

        {/* Message bubble */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[60px] text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editText.trim()) {
                    onEdit(message.id, editText);
                    setIsEditing(false);
                  }
                }
                if (e.key === 'Escape') setIsEditing(false);
              }}
            />
            <div className="flex gap-1.5">
              <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => { onEdit(message.id, editText); setIsEditing(false); }}>
                <Check className="h-3 w-3 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`relative rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
              isDeleted
                ? 'bg-muted/40 italic text-muted-foreground'
                : isOwn
                ? 'bg-gradient-to-br from-primary to-primary/85 text-primary-foreground rounded-br-md'
                : 'bg-muted/70 backdrop-blur-sm rounded-bl-md'
            }`}
          >
            {isDeleted ? 'This message was deleted' : renderWithMentions(message.content)}
            {!isDeleted && (message as any).updated_at && (message as any).updated_at !== message.created_at && !isDeleted && (
              <span className="text-[10px] opacity-60 ml-1">(edited)</span>
            )}
            {!isDeleted && message.images && message.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {message.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="max-h-44 rounded-xl shadow-md" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thread indicator */}
        {threadCount > 0 && (
          <button
            onClick={() => onOpenThread(message)}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <MessageSquareText className="h-3 w-3" />
            {threadCount} {threadCount === 1 ? 'reply' : 'replies'}
          </button>
        )}

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onOpenThread(message)}
                    className="ml-1.5 px-1.5 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-[10px] font-medium"
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Reply in thread</TooltipContent>
              </Tooltip>
              {isOwn && !isDeleted && (
                <>
                  <button
                    onClick={() => { setIsEditing(true); setEditText(message.content); }}
                    className="ml-0.5 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="ml-0.5 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
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
                </>
              )}
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
    deleteMessage,
    editMessage,
    getThreadMessages,
    reactions,
    toggleReaction,
    draftMessage,
    setDraftMessage,
    draftImages,
    setDraftImages,
  } = useLiveChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [threadParent, setThreadParent] = useState<PublicChatMessage | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!threadParent) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, threadParent]);

  // Mark as read when opening
  useEffect(() => {
    if (isOpen && activeRoomId) {
      markRoomAsRead(activeRoomId);
    }
  }, [isOpen, activeRoomId, markRoomAsRead]);

  if (!user) return null;

  const handleSend = (content: string, images?: string[]) => {
    sendMessage(content, images, null);
  };

  const handleTyping = () => {
    updateTypingIndicator(true);
  };

  // Only show top-level messages (no reply_to_id)
  const topLevelMessages = messages.filter(m => !m.reply_to_id);

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

        {/* Main content area - relative for thread panel overlay */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-4 p-4">
              {topLevelMessages.length === 0 && (
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
                  <p className="mt-3 text-[11px] text-muted-foreground/50 flex items-center gap-1.5">
                    <MessageSquareText className="h-3 w-3" />
                    Hover any message to reply in a thread
                  </p>
                </motion.div>
              )}
              {topLevelMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === user.id}
                  onReply={() => {}}
                  onOpenThread={setThreadParent}
                  onDelete={deleteMessage}
                  onEdit={editMessage}
                  threadCount={getThreadMessages(msg.id).length}
                  reactionGroups={reactions[msg.id] || []}
                  onToggleReaction={toggleReaction}
                  currentUserId={user.id}
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

          {/* Input */}
          <div className="border-t border-border/30 bg-muted/20 p-3 space-y-1.5" onKeyDown={handleTyping}>
            <ChatInput
              onSend={handleSend}
              placeholder="Say something... ✨"
              externalMessage={draftMessage}
              onExternalMessageChange={setDraftMessage}
              externalImages={draftImages}
              onExternalImagesChange={setDraftImages}
            />
            <p className="text-[10px] text-muted-foreground/50 text-center flex items-center justify-center gap-1">
              <MessageSquareText className="h-2.5 w-2.5" />
              Hover a message &amp; tap <Reply className="h-2.5 w-2.5 inline" /> to start a thread
            </p>
          </div>

          {/* Thread panel overlay */}
          <AnimatePresence>
            {threadParent && (
              <LiveChatThreadPanel
                parentMessage={threadParent}
                threadMessages={getThreadMessages(threadParent.id)}
                currentUserId={user.id}
                onClose={() => setThreadParent(null)}
                onSendReply={(content, parentId) => {
                  sendMessage(content, undefined, parentId);
                }}
                onDeleteMessage={deleteMessage}
                reactions={reactions}
                onToggleReaction={toggleReaction}
              />
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
