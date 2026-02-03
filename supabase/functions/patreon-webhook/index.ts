import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-patreon-signature, x-patreon-event",
};

// Helper to send welcome email for new patrons
async function sendWelcomeEmail(email: string, name: string, pledgeAmount: number) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase credentials for welcome email");
      return;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        email,
        name,
        source: "patreon",
        pledgeAmount,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send welcome email:", await response.text());
    } else {
      console.log("Welcome email triggered for:", email);
    }
  } catch (error) {
    console.error("Error triggering welcome email:", error);
  }
}

// Minimum pledge for premium access: $15/month = 1500 cents
const MINIMUM_PLEDGE_CENTS = 1500;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("PATREON_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!webhookSecret) {
      console.error("PATREON_WEBHOOK_SECRET not configured");
      throw new Error("Webhook secret not configured");
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Get the raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-patreon-signature");
    const eventType = req.headers.get("x-patreon-event");

    console.log("Received Patreon webhook:", eventType);

    // Verify signature (MD5 HMAC) - Patreon uses MD5
    if (signature) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(webhookSecret);
      const messageData = encoder.encode(rawBody);

      // Import the key for HMAC-MD5
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "MD5" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(rawBody);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract member data from webhook payload
    const memberData = payload.data;
    const attributes = memberData?.attributes || {};
    const relationships = memberData?.relationships || {};

    // Get the user from included data
    const included = payload.included || [];
    const userData = included.find((item: any) => item.type === "user");
    const patreonUserId = userData?.id || relationships?.user?.data?.id;
    const patreonEmail = userData?.attributes?.email;
    const patreonName = userData?.attributes?.full_name || attributes.full_name || "Patron";

    console.log("Processing webhook for Patreon user:", patreonUserId, "Event:", eventType);

    // Get pledge info
    const patronStatus = attributes.patron_status;
    const entitledCents = attributes.currently_entitled_amount_cents || 0;
    const willPayCents = attributes.will_pay_amount_cents || 0;
    const lastChargeStatus = attributes.last_charge_status;
    const pledgeAmount = Math.max(entitledCents, willPayCents);

    // Determine if still active patron with minimum pledge
    const isActivePatron =
      patronStatus === "active_patron" ||
      (lastChargeStatus === "Paid" && pledgeAmount > 0) ||
      willPayCents > 0;

    const meetsMinimumPledge = pledgeAmount >= MINIMUM_PLEDGE_CENTS;
    const hasAccess = isActivePatron && meetsMinimumPledge;

    console.log("Patron status:", {
      patronStatus,
      entitledCents,
      willPayCents,
      isActivePatron,
      meetsMinimumPledge,
      hasAccess
    });

    // Check if this is a NEW qualifying patron (members:pledge:create event with qualifying amount)
    const isNewPatronEvent = eventType === "members:pledge:create";
    if (isNewPatronEvent && hasAccess && patreonEmail) {
      console.log("New qualifying patron detected! Sending welcome email to:", patreonEmail);
      await sendWelcomeEmail(patreonEmail, patreonName, pledgeAmount);
    }

    // Find the user in our database by Patreon user ID
    const { data: connection, error: findError } = await supabase
      .from("patreon_connections")
      .select("user_id")
      .eq("patreon_user_id", patreonUserId)
      .single();

    if (findError || !connection) {
      // Try finding by email if we have it
      if (patreonEmail) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", patreonEmail)
          .single();

        if (profile) {
          // Create/update the connection
          await supabase.from("patreon_connections").upsert({
            user_id: profile.id,
            patreon_user_id: patreonUserId,
            patreon_email: patreonEmail,
            is_active_patron: isActivePatron,
            entitled_cents: pledgeAmount,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

          // Update profile subscription
          await updateUserAccess(supabase, profile.id, hasAccess, pledgeAmount);
        }
      }

      console.log("No existing connection found for Patreon user:", patreonUserId);
      return new Response(JSON.stringify({ success: true, message: "No matching user found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = connection.user_id;

    // Update the Patreon connection
    await supabase.from("patreon_connections").update({
      is_active_patron: isActivePatron,
      entitled_cents: pledgeAmount,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);

    // Update user access based on new status
    await updateUserAccess(supabase, userId, hasAccess, pledgeAmount);

    console.log("Successfully processed webhook for user:", userId);

    return new Response(
      JSON.stringify({ success: true, userId, hasAccess }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Patreon webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function updateUserAccess(supabase: any, userId: string, hasAccess: boolean, pledgeAmount: number) {
  if (hasAccess) {
    // Grant/maintain premium access - clear any pending expiration
    await supabase.from("patreon_connections").update({
      pledge_status: "active",
      access_expires_at: null,
    }).eq("user_id", userId);

    // Update user_subscriptions table (where subscription data now lives)
    const { error: subError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        subscription_tier: "premium",
        subscription_status: "active",
        payment_source: "patreon",
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (subError) {
      console.error("Failed to update user_subscriptions:", subError);
    }

    // Also update profiles for backwards compatibility
    await supabase.from("profiles").update({
      subscription_tier: "premium",
      subscription_status: "active",
      payment_source: "patreon",
      updated_at: new Date().toISOString(),
    }).eq("id", userId);
    console.log("Granted/maintained premium access for user:", userId);
  } else {
    // Check current status - only downgrade if they were using Patreon
    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_source, subscription_tier")
      .eq("id", userId)
      .single();

    const { data: connection } = await supabase
      .from("patreon_connections")
      .select("access_expires_at, pledge_status")
      .eq("user_id", userId)
      .single();

    if (profile?.payment_source === "patreon") {
      // Check if grace period already started
      if (!connection?.access_expires_at) {
        // Start 30-day grace period - access continues until billing period ends
        const gracePeriodEnd = new Date();
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);

        await supabase.from("patreon_connections").update({
          pledge_status: "cancelled",
          access_expires_at: gracePeriodEnd.toISOString(),
        }).eq("user_id", userId);

        console.log("Started grace period for user:", userId, "- access until:", gracePeriodEnd.toISOString());
      } else if (new Date(connection.access_expires_at) < new Date()) {
        // Grace period has ended - now revoke access
        // Update user_subscriptions table
        await supabase.from("user_subscriptions").update({
          subscription_tier: "free",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        }).eq("user_id", userId);

        // Also update profiles for backwards compatibility
        await supabase.from("profiles").update({
          subscription_tier: "free",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        }).eq("id", userId);

        await supabase.from("patreon_connections").update({
          pledge_status: "expired",
        }).eq("user_id", userId);

        console.log("Revoked premium access for user:", userId, "- grace period ended");
      }
      // If grace period is active, do nothing - they keep access
    }
  }
}
