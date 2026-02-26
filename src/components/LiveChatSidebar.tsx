import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatInput } from '@/components/ChatInput';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { usePublicChat, PublicChatMessage } from '@/hooks/usePublicChat';
import { useAuth } from '@/hooks/useAuth';

function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function MessageBubble({ message, isOwn }: { message: PublicChatMessage; isOwn: boolean }) {
  const initials = (message.sender?.display_name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.sender?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] space-y-1 ${isOwn ? 'items-end' : ''}`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-medium">{message.sender?.display_name || 'Unknown'}</span>
          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(message.created_at)}</span>
        </div>
        {message.reply_to && (
          <div className="rounded border-l-2 border-primary/40 bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            <span className="font-medium">{message.reply_to.sender.display_name}:</span>{' '}
            {message.reply_to.content.slice(0, 80)}
          </div>
        )}
        <div
          className={`rounded-xl px-3 py-2 text-sm ${
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {message.content}
          {message.images && message.images.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {message.images.map((img, i) => (
                <img key={i} src={img} alt="" className="max-h-40 rounded-lg" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LiveChatSidebar() {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useLiveChat();
  const {
    messages,
    activeRoomId,
    typingUsers,
    sendMessage,
    updateTypingIndicator,
    markRoomAsRead,
  } = usePublicChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);

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
    sendMessage(content, images, replyTo);
    setReplyTo(null);
  };

  const handleTyping = () => {
    updateTypingIndicator(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-lg">Live Chat</SheetTitle>
          <SheetDescription className="sr-only">Global live chat room</SheetDescription>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3 p-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.sender_id === user.id}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-1 text-xs text-muted-foreground animate-pulse">
            {typingUsers.map(u => u.display_name).join(', ')}{' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Reply preview */}
        {replyTo && (
          <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-xs">
            <span className="truncate text-muted-foreground">
              Replying to message...
            </span>
            <button onClick={() => setReplyTo(null)} className="ml-2 text-muted-foreground hover:text-foreground">
              &times;
            </button>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-3" onKeyDown={handleTyping}>
          <ChatInput
            onSend={handleSend}
            placeholder="Type a message..."
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
