import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePublicChat, PublicChatMessage } from '@/hooks/usePublicChat';
import { ChatInput } from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Pin, Reply, X, Loader2, Sparkles, Users, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ─── palette of subtle glass tints for "other" bubbles ─── */
const BUBBLE_TINTS = [
  'from-blue-500/10 to-indigo-500/8',
  'from-violet-500/10 to-purple-500/8',
  'from-rose-500/10 to-pink-500/8',
  'from-amber-500/10 to-orange-500/8',
  'from-emerald-500/10 to-teal-500/8',
  'from-cyan-500/10 to-sky-500/8',
];

function hashColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return BUBBLE_TINTS[Math.abs(h) % BUBBLE_TINTS.length];
}

const PublicChat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    rooms,
    messages,
    activeRoomId,
    activeRoomSlug,
    setActiveRoom,
    typingUsers,
    isLoading,
    sendMessage,
    updateTypingIndicator,
    pinnedMessages,
  } = usePublicChat();

  const [replyTo, setReplyTo] = useState<PublicChatMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string, images?: string[]) => {
    await sendMessage(content, images, replyTo?.id || null);
    setReplyTo(null);
  };

  const handleTyping = () => {
    updateTypingIndicator(true);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-140px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Hero strip */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/5 to-primary/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto w-full px-4 py-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/25">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              Global Fellowship
              <Sparkles className="h-5 w-5 text-primary/50" />
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Real-time conversation with the community
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted/60 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground border border-border/40">
            <Users className="h-3.5 w-3.5" />
            <span className="font-semibold">{messages.length > 0 ? 'Active' : 'Open'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4 pb-24">
        {/* Room Tabs */}
        <Tabs value={activeRoomSlug || 'global'} onValueChange={setActiveRoom} className="mb-5">
          <TabsList className="w-full overflow-x-auto flex justify-start gap-1.5 h-auto p-1.5 bg-muted/40 backdrop-blur-sm border border-border/30 rounded-xl">
            {rooms.map((room) => (
              <TabsTrigger
                key={room.id}
                value={room.slug}
                className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 transition-all"
              >
                <span className="text-base">{room.icon}</span>
                <span>{room.name}</span>
                {room.unread_count > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-xs px-1.5">
                    {room.unread_count > 99 ? '99+' : room.unread_count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Room Header */}
        {activeRoom && (
          <div className="mb-5 pb-3 border-b border-border/30">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="text-xl">{activeRoom.icon}</span> {activeRoom.name}
            </h2>
            <p className="text-sm text-muted-foreground/80">{activeRoom.description}</p>
          </div>
        )}

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="mb-5 rounded-xl p-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/8 backdrop-blur-sm border border-amber-500/20 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">
              <Pin className="h-4 w-4" /> Pinned
            </div>
            {pinnedMessages.slice(0, 2).map((msg) => (
              <p key={msg.id} className="text-sm text-amber-900 dark:text-amber-200 truncate">
                <span className="font-semibold">{msg.sender?.display_name}:</span> {msg.content}
              </p>
            ))}
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollRef}>
          <div className="space-y-5 pb-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 backdrop-blur-sm border border-primary/10 shadow-lg shadow-primary/10">
                  <MessageSquare className="h-10 w-10 text-primary/40" />
                </div>
                <p className="text-lg font-bold text-foreground/70">{t('public.noMessagesYet')}</p>
                <p className="mt-1 text-sm text-muted-foreground/60">{t('public.beFirstToConverse')}</p>
                <p className="mt-4 text-xs text-muted-foreground/40 flex items-center gap-1.5">
                  <Heart className="h-3 w-3" /> Share a word of encouragement
                </p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message, idx) => {
                  const isOwn = message.sender_id === user?.id;
                  const tint = hashColor(message.sender_id);
                  const initials = (message.sender?.display_name || '?')
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut', delay: idx < 20 ? idx * 0.02 : 0 }}
                      className={cn('group flex gap-3', isOwn && 'flex-row-reverse')}
                    >
                      {/* Avatar with glow ring */}
                      <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/15 ring-offset-2 ring-offset-background shadow-md">
                        <AvatarImage src={message.sender?.avatar_url || ''} />
                        <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/25 to-accent/25 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className={cn('max-w-[75%] min-w-0', isOwn && 'items-end')}>
                        {/* Name & time */}
                        <div className={cn('flex items-center gap-2 mb-1.5', isOwn && 'flex-row-reverse')}>
                          <span className="text-sm font-bold tracking-tight text-foreground/85">
                            {message.sender?.display_name || t('public.anonymous')}
                          </span>
                          <span className="text-[11px] text-muted-foreground/50 font-medium">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </span>
                          {message.is_pinned && (
                            <Pin className="h-3 w-3 text-amber-500" />
                          )}
                        </div>

                        {/* Reply preview */}
                        {message.reply_to && (
                          <div className={cn(
                            'text-xs text-muted-foreground/70 bg-muted/30 backdrop-blur-sm p-2 rounded-lg mb-1.5 border-l-2 border-primary/50 max-w-full',
                            isOwn && 'border-r-2 border-l-0 border-primary/50'
                          )}>
                            <span className="font-semibold">{message.reply_to.sender?.display_name}:</span>{' '}
                            <span className="truncate inline">{message.reply_to.content.slice(0, 50)}{message.reply_to.content.length > 50 ? '...' : ''}</span>
                          </div>
                        )}

                        {/* Message bubble — glassy & colorful */}
                        <div className={cn(
                          'relative rounded-2xl px-4 py-3 break-words shadow-sm transition-shadow hover:shadow-md',
                          isOwn
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md shadow-primary/15'
                            : `bg-gradient-to-br ${tint} backdrop-blur-md border border-border/30 rounded-bl-md`
                        )}>
                          {/* Subtle shimmer overlay */}
                          {!isOwn && (
                            <div className="absolute inset-0 rounded-2xl rounded-bl-md bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                          )}
                          <p className={cn(
                            'relative whitespace-pre-wrap break-words leading-relaxed',
                            isOwn ? 'text-sm' : 'text-sm text-foreground/90'
                          )}>
                            {message.content}
                          </p>

                          {message.images && message.images.length > 0 && (
                            <div className="flex gap-2 mt-2.5 flex-wrap relative">
                              {message.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt=""
                                  className="max-w-[200px] max-h-[200px] rounded-xl object-cover shadow-md ring-1 ring-border/20"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Reply button */}
                        {!isOwn && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1.5 h-7 text-xs px-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                            onClick={() => setReplyTo(message)}
                          >
                            <Reply className="h-3 w-3 mr-1" /> {t('public.reply')}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 py-2 text-sm text-muted-foreground"
            >
              <span className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="italic text-xs">
                {typingUsers.length === 1
                  ? t('public.isTyping', { name: typingUsers[0].display_name })
                  : t('public.areTyping', { names: typingUsers.map(u => u.display_name).join(', ') })}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reply Preview */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm rounded-t-xl border border-b-0 border-border/30"
            >
              <Reply className="h-4 w-4 text-primary/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground">{t('public.replyingTo')} </span>
                <span className="text-xs font-bold">{replyTo.sender?.display_name}</span>
                <p className="text-sm truncate text-foreground/70">{replyTo.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => setReplyTo(null)}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Input */}
        <div className={cn(
          'pt-4 border-t border-border/30 bg-background',
          replyTo && 'pt-0 border-t-0'
        )} onKeyDown={handleTyping}>
          <ChatInput
            onSend={handleSend}
            placeholder={`Share with ${activeRoom?.name || 'the community'}... ✨`}
            disabled={!user}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicChat;
