import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushNotificationRequest {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  // Optional: filter by notification type preference
  notificationType?: 'events' | 'messages' | 'announcements' | 'study_reminders' | 'prayer_requests';
}

interface NotificationPreferences {
  enabled: boolean;
  events: boolean;
  messages: boolean;
  announcements: boolean;
  study_reminders: boolean;
  prayer_requests: boolean;
}

// Send push notification via Firebase Cloud Messaging
async function sendFCMNotification(token: string, title: string, body: string, data?: Record<string, string>) {
  const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");

  if (!fcmServerKey) {
    console.error("FCM_SERVER_KEY not configured");
    return { success: false, error: "FCM not configured" };
  }

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Authorization": `key=${fcmServerKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title,
          body,
          sound: "default",
          badge: "1",
        },
        data: data || {},
        priority: "high",
        content_available: true,
      }),
    });

    const result = await response.json();

    if (result.success === 1) {
      return { success: true };
    } else {
      console.error("FCM send failed:", result);
      return { success: false, error: result.results?.[0]?.error || "Unknown error" };
    }
  } catch (error: any) {
    console.error("FCM request error:", error);
    return { success: false, error: error.message };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userIds, title, body, data, notificationType }: PushNotificationRequest = await req.json();

    console.log("Sending push notifications:", { userIds: userIds.length, title, notificationType });

    if (!userIds || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No user IDs provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch push tokens and notification preferences for users
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, push_token, notification_preferences")
      .in("id", userIds)
      .not("push_token", "is", null);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log("No users with push tokens found");
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No users with push tokens" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Filter users based on notification preferences
    const eligibleProfiles = profiles.filter(profile => {
      const prefs = profile.notification_preferences as NotificationPreferences | null;

      // If no preferences set, assume all enabled
      if (!prefs) return true;

      // Check if notifications are globally enabled
      if (!prefs.enabled) return false;

      // If no specific type, allow if globally enabled
      if (!notificationType) return true;

      // Check specific notification type preference
      return prefs[notificationType] !== false;
    });

    console.log(`Sending to ${eligibleProfiles.length} eligible users out of ${profiles.length}`);

    // Send notifications to all eligible users
    const results = await Promise.allSettled(
      eligibleProfiles.map(profile =>
        sendFCMNotification(profile.push_token, title, body, data)
      )
    );

    const successful = results.filter(r => r.status === "fulfilled" && (r.value as any).success).length;
    const failed = results.length - successful;

    // Log any failed sends
    results.forEach((result, index) => {
      if (result.status === "rejected" || !(result.value as any).success) {
        console.error(`Failed to send to user ${eligibleProfiles[index].id}:`,
          result.status === "rejected" ? result.reason : (result.value as any).error
        );
      }
    });

    // Log notification to database for tracking
    try {
      await supabase.from("push_notification_logs").insert({
        user_ids: userIds,
        title,
        body,
        data,
        notification_type: notificationType,
        sent_count: successful,
        failed_count: failed,
      });
    } catch (logErr) {
      console.log("Could not log notification:", logErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed,
        total: eligibleProfiles.length
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending push notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
