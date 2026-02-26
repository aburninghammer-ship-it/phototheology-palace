import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { usePublicChat } from '@/hooks/usePublicChat';

export function LiveChatToggle() {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useLiveChat();
  const { totalUnread } = usePublicChat();

  if (!user || isOpen) return null;

  return (
    <Button
      onClick={() => setIsOpen(true)}
      size="icon"
      className="fixed bottom-[88px] right-4 z-[55] h-14 w-14 rounded-full shadow-lg md:bottom-6"
    >
      <MessageSquare className="h-6 w-6" />
      {totalUnread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">
          {totalUnread > 99 ? '99+' : totalUnread}
        </span>
      )}
    </Button>
  );
}
