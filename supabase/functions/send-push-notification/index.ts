import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushPayload {
  user_ids: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_ids, title, body, data }: PushPayload = await req.json();

    if (!user_ids || user_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "No user_ids provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get active push tokens for these users
    const { data: tokens, error: tokensError } = await supabase
      .from("push_tokens")
      .select("token, platform, user_id")
      .in("user_id", user_ids)
      .eq("is_active", true);

    if (tokensError) {
      console.error("Error fetching tokens:", tokensError);
      throw tokensError;
    }

    if (!tokens || tokens.length === 0) {
      console.log("No active push tokens found for users");
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No active tokens" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Group tokens by platform
    const iosTokens = tokens.filter(t => t.platform === "ios").map(t => t.token);
    const androidTokens = tokens.filter(t => t.platform === "android").map(t => t.token);

    let sentCount = 0;
    const errors: string[] = [];

    // Send to iOS via APNs (simplified - in production use a service like OneSignal or Firebase)
    // For now, we'll use Firebase Cloud Messaging which handles both iOS and Android

    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");

    if (fcmServerKey && (iosTokens.length > 0 || androidTokens.length > 0)) {
      const allTokens = [...iosTokens, ...androidTokens];

      // Send in batches of 500 (FCM limit)
      for (let i = 0; i < allTokens.length; i += 500) {
        const batch = allTokens.slice(i, i + 500);

        const fcmPayload = {
          registration_ids: batch,
          notification: {
            title,
            body,
            sound: "default",
            badge: 1,
          },
          data: data || {},
          priority: "high",
          content_available: true,
        };

        try {
          const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `key=${fcmServerKey}`,
            },
            body: JSON.stringify(fcmPayload),
          });

          const fcmResult = await fcmResponse.json();

          if (fcmResult.success) {
            sentCount += fcmResult.success;
          }

          if (fcmResult.failure > 0 && fcmResult.results) {
            // Handle invalid tokens
            fcmResult.results.forEach((result: any, index: number) => {
              if (result.error === "NotRegistered" || result.error === "InvalidRegistration") {
                // Deactivate invalid token
                const invalidToken = batch[index];
                supabase
                  .from("push_tokens")
                  .update({ is_active: false })
                  .eq("token", invalidToken)
                  .then(() => {});
              }
              if (result.error) {
                errors.push(`Token ${index}: ${result.error}`);
              }
            });
          }
        } catch (fcmError) {
          console.error("FCM error:", fcmError);
          errors.push(`FCM batch error: ${fcmError}`);
        }
      }
    } else if (!fcmServerKey) {
      console.log("FCM_SERVER_KEY not configured, skipping push notifications");

      // Fallback: Create in-app notifications instead
      const notifications = user_ids.map(userId => ({
        user_id: userId,
        type: data?.type || "message",
        title,
        message: body,
        link: data?.link || null,
        metadata: data || {},
      }));

      const { error: notifError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notifError) {
        console.error("Error creating in-app notifications:", notifError);
      } else {
        sentCount = user_ids.length;
      }
    }

    console.log(`[send-push-notification] Sent ${sentCount} notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[send-push-notification] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
