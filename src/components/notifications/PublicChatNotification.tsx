import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatNotification {
  id: string;
  content: string;
  senderName: string;
  senderAvatar: string | null;
  roomName: string;
  roomIcon: string;
  timestamp: Date;
}

export function PublicChatNotification() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);

  // Don't show notifications if already on the public chat page
  const isOnChatPage = location.pathname === '/public-chat';

  useEffect(() => {
    if (!user) return;

    // Subscribe to new public chat messages
    const channel = supabase
      .channel('public-chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'public_chat_messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;

          // Don't notify for own messages
          if (newMessage.sender_id === user.id) return;

          // Don't show if already on chat page
          if (isOnChatPage) return;

          // Fetch sender info
          const { data: sender } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          // Fetch room info
          const { data: room } = await (supabase as any)
            .from('public_chat_rooms')
            .select('name, icon')
            .eq('id', newMessage.room_id)
            .single();

          const notification: ChatNotification = {
            id: newMessage.id,
            content: newMessage.content,
            senderName: sender?.display_name || 'Someone',
            senderAvatar: sender?.avatar_url || null,
            roomName: room?.name || 'Public Chat',
            roomIcon: room?.icon || '💬',
            timestamp: new Date(),
          };

          setNotifications((prev) => [...prev.slice(-2), notification]); // Keep max 3

          // Auto-dismiss after 5 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isOnChatPage]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClick = (notification: ChatNotification) => {
    dismissNotification(notification.id);
    navigate('/public-chat');
  };

  if (!user || isOnChatPage) return null;

  return (
    <div className="fixed top-20 right-4 z-[70] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'bg-background/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-lg',
              'p-3 cursor-pointer hover:bg-muted/50 transition-colors'
            )}
            onClick={() => handleClick(notification)}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.senderAvatar || ''} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {notification.senderName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 text-sm">
                  {notification.roomIcon}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">
                    {notification.senderName}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {notification.roomName}
                </p>
                <p className="text-sm mt-1 line-clamp-2">
                  {notification.content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <MessageCircle className="h-3 w-3" />
              <span>Tap to open chat</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
