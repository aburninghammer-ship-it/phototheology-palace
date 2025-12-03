import { ReactNode } from "react";
import { useLiveNotifications } from "@/hooks/useLiveNotifications";
import { DailyVerseNotification } from "./notifications/DailyVerseNotification";
import { StudyRemindersNotification } from "./notifications/StudyRemindersNotification";

interface LiveNotificationsProviderProps {
  children: ReactNode;
}

export function LiveNotificationsProvider({ children }: LiveNotificationsProviderProps) {
  // Initialize live notifications for this user
  useLiveNotifications();
  
  return (
    <>
      {children}
      <DailyVerseNotification />
      <StudyRemindersNotification />
    </>
  );
}