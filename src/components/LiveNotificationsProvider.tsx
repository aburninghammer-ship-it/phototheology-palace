import { ReactNode } from "react";
import { useLiveNotifications } from "@/hooks/useLiveNotifications";

interface LiveNotificationsProviderProps {
  children: ReactNode;
}

export function LiveNotificationsProvider({ children }: LiveNotificationsProviderProps) {
  // Initialize live notifications for this user
  useLiveNotifications();
  
  return <>{children}</>;
}