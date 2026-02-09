import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePublicChat, PublicChatMessage } from '@/hooks/usePublicChat';
import { ChatInput } from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Pin, Reply, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PublicChat = () => {
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

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4 pb-24">
        {/* Room Tabs */}
        <Tabs value={activeRoomSlug || 'global'} onValueChange={setActiveRoom} className="mb-4">
          <TabsList className="w-full overflow-x-auto flex justify-start gap-1 h-auto p-1 bg-muted/50">
            {rooms.map((room) => (
              <TabsTrigger
                key={room.id}
                value={room.slug}
                className="relative flex items-center gap-1 px-3 py-2 text-sm whitespace-nowrap"
              >
                <span>{room.icon}</span>
                <span className="hidden sm:inline">{room.name}</span>
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
          <div className="mb-4 pb-3 border-b">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              {activeRoom.icon} {activeRoom.name}
            </h1>
            <p className="text-sm text-muted-foreground">{activeRoom.description}</p>
          </div>
        )}

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <Card className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
              <Pin className="h-4 w-4" /> Pinned Messages
            </div>
            {pinnedMessages.slice(0, 2).map((msg) => (
              <p key={msg.id} className="text-sm truncate text-amber-900 dark:text-amber-200">
                <span className="font-medium">{msg.sender?.display_name}:</span> {msg.content}
              </p>
            ))}
          </Card>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Be the first to start the conversation!</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isOwn = message.sender_id === user?.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-3',
                        isOwn && 'flex-row-reverse'
                      )}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={message.sender?.avatar_url || ''} />
                        <AvatarFallback className="text-sm">
                          {message.sender?.display_name?.charAt(0)?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className={cn(
                        'max-w-[75%] min-w-0',
                        isOwn && 'items-end'
                      )}>
                        <div className={cn(
                          'flex items-center gap-2 mb-1',
                          isOwn && 'flex-row-reverse'
                        )}>
                          <span className="text-sm font-medium truncate">
                            {message.sender?.display_name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </span>
                          {message.is_pinned && (
                            <Pin className="h-3 w-3 text-amber-500" />
                          )}
                        </div>

                        {message.reply_to && (
                          <div className={cn(
                            'text-xs text-muted-foreground bg-muted/50 p-2 rounded mb-1 border-l-2 border-primary max-w-full',
                            isOwn && 'border-r-2 border-l-0'
                          )}>
                            <span className="font-medium">{message.reply_to.sender?.display_name}:</span>{' '}
                            <span className="truncate inline">{message.reply_to.content.slice(0, 50)}{message.reply_to.content.length > 50 ? '...' : ''}</span>
                          </div>
                        )}

                        <div className={cn(
                          'rounded-2xl px-4 py-2 break-words',
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}>
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>

                          {message.images && message.images.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {message.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt=""
                                  className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {!isOwn && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-6 text-xs px-2"
                            onClick={() => setReplyTo(message)}
                          >
                            <Reply className="h-3 w-3 mr-1" /> Reply
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
        {typingUsers.length > 0 && (
          <div className="text-sm text-muted-foreground italic py-2">
            {typingUsers.map(u => u.display_name).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Reply Preview */}
        {replyTo && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-t-lg border-b">
            <Reply className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-muted-foreground">Replying to </span>
              <span className="text-xs font-medium">{replyTo.sender?.display_name}</span>
              <p className="text-sm truncate">{replyTo.content}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setReplyTo(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Chat Input */}
        <div className={cn('pt-4 border-t bg-background', replyTo && 'pt-0 border-t-0')}>
          <ChatInput
            onSend={handleSend}
            placeholder={`Message ${activeRoom?.name || 'public chat'}...`}
            disabled={!user}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicChat;
