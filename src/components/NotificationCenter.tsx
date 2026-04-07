import { Bell, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (notification: any) => {
    console.log('🔔 NotificationCenter: Notification clicked', {
      id: notification.id,
      type: notification.type,
      metadata: notification.metadata,
      is_read: notification.is_read
    });
    
    // Mark as read first and wait for it to complete (only if not already read)
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Handle message notifications by opening the messaging sidebar
    if (notification.type === 'message' || notification.type === 'direct_message') {
      // Try to get conversation ID or user ID from metadata
      const conversationId = notification.metadata?.conversation_id || notification.metadata?.conversationId;
      const userId = notification.metadata?.sender_id || notification.metadata?.user_id || notification.metadata?.userId;
      
      console.log('🔔 NotificationCenter: Dispatching open-chat-sidebar event', {
        conversationId,
        userId
      });
      
      // Dispatch custom event to open messaging sidebar
      window.dispatchEvent(new CustomEvent('open-chat-sidebar', {
        detail: { 
          conversationId,
          userId 
        }
      }));
      
      console.log('🔔 NotificationCenter: Event dispatched successfully');
    } else {
      // Handle non-message notifications with navigation links
      // Prefer explicit link field, then metadata.link, then type-specific defaults
      const explicitLink = notification.link || notification.metadata?.link;
      const fallbackLink = !explicitLink && notification.type === 'daily_verse'
        ? '/daily-verse'
        : undefined;
      const link = explicitLink || fallbackLink;

      if (link) {
        console.log('🔔 NotificationCenter: Navigating to', link);
        navigate(link);
      } else {
        console.log('🔔 NotificationCenter: No navigation link found for notification', {
          id: notification.id,
          type: notification.type,
          metadata: notification.metadata,
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                  !notification.is_read ? 'bg-muted/50' : ''
                }`}
                onSelect={(e) => {
                  e.preventDefault();
                  handleNotificationClick(notification);
                }}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-full hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}