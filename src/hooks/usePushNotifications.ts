import { useState, useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface NotificationPreferences {
  enabled: boolean;
  events: boolean;
  messages: boolean;
  announcements: boolean;
  study_reminders: boolean;
  prayer_requests: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  events: true,
  messages: true,
  announcements: true,
  study_reminders: true,
  prayer_requests: true,
};

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Check if push notifications are supported (native only)
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setIsSupported(platform === "ios" || platform === "android");
  }, []);

  // Load user's notification preferences
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_preferences, push_token")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        if (data.notification_preferences) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...(data.notification_preferences as NotificationPreferences) });
        }
        if (data.push_token) {
          setToken(data.push_token);
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Register for push notifications
  const register = useCallback(async () => {
    if (!isSupported) {
      console.log("Push notifications not supported on this platform");
      return { success: false, error: "Not supported" };
    }

    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive !== "granted") {
        toast.error("Push notification permission denied");
        return { success: false, error: "Permission denied" };
      }

      // Register with APNs/FCM
      await PushNotifications.register();

      // Listen for registration success
      PushNotifications.addListener("registration", async (token: Token) => {
        console.log("Push registration success, token:", token.value);
        setToken(token.value);
        setIsRegistered(true);

        // Save token to database
        if (user) {
          await supabase
            .from("profiles")
            .update({ push_token: token.value })
            .eq("id", user.id);
        }

        toast.success("Push notifications enabled!");
      });

      // Listen for registration errors
      PushNotifications.addListener("registrationError", (error) => {
        console.error("Push registration error:", error);
        toast.error("Failed to enable push notifications");
      });

      // Listen for incoming notifications
      PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
        console.log("Push notification received:", notification);
        // Show in-app notification if app is open
        toast(notification.title || "New Notification", {
          description: notification.body,
        });
      });

      // Listen for notification actions (when user taps)
      PushNotifications.addListener("pushNotificationActionPerformed", (action: ActionPerformed) => {
        console.log("Push notification action:", action);
        // Handle navigation based on notification data
        handleNotificationAction(action.notification);
      });

      return { success: true };
    } catch (error: any) {
      console.error("Push notification registration error:", error);
      return { success: false, error: error.message };
    }
  }, [isSupported, user]);

  // Unregister from push notifications
  const unregister = useCallback(async () => {
    try {
      await PushNotifications.removeAllListeners();

      if (user) {
        await supabase
          .from("profiles")
          .update({ push_token: null })
          .eq("id", user.id);
      }

      setToken(null);
      setIsRegistered(false);
      toast.success("Push notifications disabled");

      return { success: true };
    } catch (error: any) {
      console.error("Push notification unregister error:", error);
      return { success: false, error: error.message };
    }
  }, [user]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<NotificationPreferences>) => {
    if (!user) return { success: false };

    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: updated })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Notification preferences saved");
      return { success: true };
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to save preferences");
      return { success: false, error: error.message };
    }
  }, [user, preferences]);

  // Handle notification tap
  const handleNotificationAction = (notification: PushNotificationSchema) => {
    const data = notification.data as Record<string, string> | undefined;
    if (!data) return;

    // Navigate based on notification type
    switch (data.type) {
      case "event":
        // Navigate to event
        window.location.href = `/living-manna?tab=events&event=${data.event_id}`;
        break;
      case "message":
        // Navigate to chat
        window.location.href = `/living-manna?tab=connect&chat=${data.room_id}`;
        break;
      case "announcement":
        // Navigate to announcements
        window.location.href = `/living-manna?tab=home`;
        break;
      case "study":
        // Navigate to study
        window.location.href = `/living-manna?tab=learn&study=${data.study_id}`;
        break;
      default:
        // Default to home
        window.location.href = "/living-manna";
    }
  };

  // Get badge count (for iOS)
  const getBadgeCount = useCallback(async () => {
    if (!isSupported) return 0;
    try {
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications.length;
    } catch {
      return 0;
    }
  }, [isSupported]);

  // Clear all delivered notifications
  const clearNotifications = useCallback(async () => {
    if (!isSupported) return;
    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }, [isSupported]);

  return {
    isSupported,
    isRegistered,
    token,
    preferences,
    loading,
    register,
    unregister,
    updatePreferences,
    getBadgeCount,
    clearNotifications,
  };
}

// Utility function to send push notification via edge function
export async function sendPushNotification(params: {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  try {
    const { error } = await supabase.functions.invoke("send-push-notification", {
      body: params,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    return { success: false, error: error.message };
  }
}
