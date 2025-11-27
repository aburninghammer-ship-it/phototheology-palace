import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bell, MessageSquare, Reply, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  post_id: string;
  comment_id: string | null;
  type: "reply" | "comment" | "mention";
  is_read: boolean;
  created_at: string;
  post_title?: string;
}

interface CommunityNotificationsProps {
  userId: string;
  onNavigateToPost: (postId: string) => void;
}

export const CommunityNotifications = ({ 
  userId, 
  onNavigateToPost 
}: CommunityNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    const channel = supabase
      .channel("community_notifications")
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "community_post_notifications",
          filter: `user_id=eq.${userId}`
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("community_post_notifications")
      .select(`
        *,
        community_posts:post_id(title)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data.map(n => ({
        id: n.id,
        post_id: n.post_id,
        comment_id: n.comment_id,
        type: n.type as "reply" | "comment" | "mention",
        is_read: n.is_read ?? false,
        created_at: n.created_at ?? new Date().toISOString(),
        post_title: (n.community_posts as any)?.title
      })));
    }
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from("community_post_notifications")
      .update({ is_read: true })
      .eq("id", id);
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    await supabase
      .from("community_post_notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onNavigateToPost(notification.post_id);
    setOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "reply": return Reply;
      case "comment": return MessageSquare;
      default: return Bell;
    }
  };

  const getMessage = (notification: Notification) => {
    switch (notification.type) {
      case "reply":
        return "Someone replied to your comment";
      case "comment":
        return "Someone commented on your post";
      default:
        return "You have a new notification";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    className={`w-full p-3 text-left hover:bg-muted/50 transition-colors ${
                      !notification.is_read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        !notification.is_read ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          !notification.is_read ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.is_read ? "font-medium" : ""}`}>
                          {getMessage(notification)}
                        </p>
                        {notification.post_title && (
                          <p className="text-xs text-muted-foreground truncate">
                            on "{notification.post_title}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
