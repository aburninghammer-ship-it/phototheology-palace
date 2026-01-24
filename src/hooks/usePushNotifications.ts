import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

// Capacitor imports for native push notifications
let PushNotifications: any = null;
let Capacitor: any = null;

// Dynamic import for Capacitor (only available on native platforms)
try {
  const capacitorCore = require("@capacitor/core");
  Capacitor = capacitorCore.Capacitor;
  
  if (Capacitor?.isNativePlatform?.()) {
    const capacitorPush = require("@capacitor/push-notifications");
    PushNotifications = capacitorPush.PushNotifications;
  }
} catch (e) {
  // Capacitor not available (web platform)
}

interface PushNotificationPreferences {
  events_enabled: boolean;
  messages_enabled: boolean;
  announcements_enabled: boolean;
  study_reminders_enabled: boolean;
  prayer_requests_enabled: boolean;
}

const DEFAULT_PREFERENCES: PushNotificationPreferences = {
  events_enabled: true,
  messages_enabled: true,
  announcements_enabled: true,
  study_reminders_enabled: true,
  prayer_requests_enabled: true,
};

export function usePushNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNative, setIsNative] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<PushNotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Check if running on native platform
  useEffect(() => {
    const native = Capacitor?.isNativePlatform?.() ?? false;
    setIsNative(native);
  }, []);

  // Fetch user preferences
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("push_notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPreferences({
            events_enabled: data.events_enabled ?? true,
            messages_enabled: data.messages_enabled ?? true,
            announcements_enabled: data.announcements_enabled ?? true,
            study_reminders_enabled: data.study_reminders_enabled ?? true,
            prayer_requests_enabled: data.prayer_requests_enabled ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching push preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  // Initialize push notifications on native platforms
  useEffect(() => {
    if (!isNative || !PushNotifications || !user) return;

    const initializePush = async () => {
      try {
        // Check current permission status
        const result = await PushNotifications.checkPermissions();
        setPermissionStatus(result.receive);

        if (result.receive === "granted") {
          await registerForPush();
        }
      } catch (error) {
        console.error("Push notification init error:", error);
      }
    };

    const registerForPush = async () => {
      try {
        await PushNotifications.register();

        // Listen for registration success
        PushNotifications.addListener("registration", async (tokenData: { value: string }) => {
          setToken(tokenData.value);
          await saveToken(tokenData.value);
        });

        // Listen for registration errors
        PushNotifications.addListener("registrationError", (error: any) => {
          console.error("Push registration error:", error);
        });

        // Listen for push notifications received
        PushNotifications.addListener("pushNotificationReceived", (notification: any) => {
          toast({
            title: notification.title || "Notification",
            description: notification.body,
          });
        });

        // Listen for notification action performed
        PushNotifications.addListener("pushNotificationActionPerformed", (action: any) => {
          console.log("Push action performed:", action);
          // Handle navigation based on notification data
        });
      } catch (error) {
        console.error("Push registration error:", error);
      }
    };

    initializePush();

    return () => {
      if (PushNotifications) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [isNative, user]);

  const saveToken = async (pushToken: string) => {
    if (!user) return;

    try {
      const platform = Capacitor?.getPlatform?.() ?? "web";

      await (supabase as any).from("push_notification_tokens").upsert(
        {
          user_id: user.id,
          token: pushToken,
          platform,
        },
        { onConflict: "user_id,token" }
      );
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };

  const requestPermission = useCallback(async () => {
    if (!isNative || !PushNotifications) {
      toast({
        title: "Not Available",
        description: "Push notifications are only available on mobile devices.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await PushNotifications.requestPermissions();
      setPermissionStatus(result.receive);

      if (result.receive === "granted") {
        await PushNotifications.register();
        return true;
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your device settings.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Permission request error:", error);
      return false;
    }
  }, [isNative, toast]);

  const updatePreferences = useCallback(
    async (newPreferences: Partial<PushNotificationPreferences>) => {
      if (!user) return;

      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);

      try {
        await (supabase as any).from("push_notification_preferences").upsert(
          {
            user_id: user.id,
            ...updated,
          },
          { onConflict: "user_id" }
        );

        toast({
          title: "Preferences Updated",
          description: "Your notification settings have been saved.",
        });
      } catch (error) {
        console.error("Error updating preferences:", error);
        toast({
          title: "Error",
          description: "Failed to update preferences.",
          variant: "destructive",
        });
      }
    },
    [user, preferences, toast]
  );

  return {
    isNative,
    permissionStatus,
    token,
    preferences,
    isLoading,
    requestPermission,
    updatePreferences,
  };
}
