import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Patreon callback started");
    
    const clientId = Deno.env.get("PATREON_CLIENT_ID");
    const clientSecret = Deno.env.get("PATREON_CLIENT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!clientId || !clientSecret) {
      console.error("Patreon credentials not configured");
      throw new Error("Patreon credentials not configured");
    }

    const { code, redirectUri, userId: bodyUserId } = await req.json();
    
    // Try to get userId from auth header first (more reliable), fall back to body
    let userId = bodyUserId;
    const authHeader = req.headers.get("Authorization");
    if (authHeader && supabaseUrl && supabaseServiceKey) {
      const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey);
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAuth.auth.getUser(token);
      if (user) {
        userId = user.id;
        console.log("Got userId from auth header:", userId);
      }
    }
    
    console.log("Request params:", { code: code ? "present" : "missing", redirectUri, userId: userId || "not provided" });
    
    if (!code || !redirectUri) {
      throw new Error("code and redirectUri are required");
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://www.patreon.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      throw new Error("Failed to exchange code for token. Please try connecting again.");
    }

    const tokens = await tokenResponse.json();
    console.log("Token exchange successful, expires_in:", tokens.expires_in);

    // Fetch Patreon identity and memberships - include campaign data for yearly subscriptions
    const identityResponse = await fetch(
      "https://www.patreon.com/api/oauth2/v2/identity?include=memberships,memberships.campaign&fields%5Buser%5D=full_name,email&fields%5Bmember%5D=patron_status,currently_entitled_amount_cents,last_charge_status,last_charge_date,pledge_cadence,will_pay_amount_cents&fields%5Bcampaign%5D=creation_name",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!identityResponse.ok) {
      const identityError = await identityResponse.text();
      console.error("Failed to fetch Patreon identity:", identityError);
      throw new Error("Failed to fetch Patreon identity. Please try again.");
    }

    const identity = await identityResponse.json();
    console.log("Patreon identity response:", JSON.stringify(identity, null, 2));
    
    const patreonUser = identity.data;
    const patreonEmail = patreonUser.attributes?.email;
    const memberships = identity.included?.filter((i: any) => i.type === "member") || [];
    
    console.log("Found memberships:", memberships.length, "Patreon email:", patreonEmail);
    memberships.forEach((m: any, i: number) => {
      console.log(`Membership ${i}:`, JSON.stringify(m.attributes, null, 2));
    });
    
    // Check if they're an active patron - accept multiple valid statuses
    const isActivePatron = memberships.some((m: any) => {
      const status = m.attributes?.patron_status;
      const lastChargeStatus = m.attributes?.last_charge_status;
      const entitledCents = m.attributes?.currently_entitled_amount_cents || 0;
      const willPayCents = m.attributes?.will_pay_amount_cents || 0;
      const pledgeCadence = m.attributes?.pledge_cadence;
      
      console.log(`Checking membership - status: ${status}, lastChargeStatus: ${lastChargeStatus}, entitledCents: ${entitledCents}, willPayCents: ${willPayCents}, pledgeCadence: ${pledgeCadence}`);
      
      return status === "active_patron" || 
             (lastChargeStatus === "Paid" && entitledCents > 0) ||
             willPayCents > 0 ||
             (status && status !== "former_patron" && status !== "declined_patron" && (entitledCents > 0 || willPayCents > 0));
    });
    
    // Get entitled cents - use will_pay_amount_cents if currently_entitled is 0 (yearly subscribers)
    const entitledCents = memberships.reduce(
      (max: number, m: any) => {
        const current = m.attributes?.currently_entitled_amount_cents || 0;
        const willPay = m.attributes?.will_pay_amount_cents || 0;
        return Math.max(max, current, willPay);
      },
      0
    );

    // Minimum pledge required for premium access: $15/month = 1500 cents
    const MINIMUM_PLEDGE_CENTS = 1500;
    const meetsMinimumPledge = entitledCents >= MINIMUM_PLEDGE_CENTS;

    console.log("Final determination - isActivePatron:", isActivePatron, "entitledCents:", entitledCents, "meetsMinimumPledge:", meetsMinimumPledge);

    // Store connection in database
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // If no userId was provided, try to find user by Patreon email
      if (!userId && patreonEmail) {
        console.log("No userId provided, looking up user by Patreon email:", patreonEmail);
        const { data: users } = await supabase.auth.admin.listUsers();
        const matchingUser = users?.users?.find(u => u.email?.toLowerCase() === patreonEmail.toLowerCase());
        if (matchingUser) {
          userId = matchingUser.id;
          console.log("Found user by email:", userId);
        } else {
          console.log("No user found with Patreon email. User needs to sign up first.");
        }
      }

      if (userId) {
        // Store raw tokens — the database trigger (encrypt_patreon_tokens) handles encryption automatically
        const { error: upsertError } = await supabase
          .from("patreon_connections")
          .upsert({
            user_id: userId,
            patreon_user_id: patreonUser.id,
            patreon_email: patreonEmail,
            patreon_name: patreonUser.attributes?.full_name,
            is_active_patron: isActivePatron,
            entitled_cents: entitledCents,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
            connected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });

        if (upsertError) {
          console.error("Failed to save Patreon connection:", upsertError);
          throw new Error("Failed to save Patreon connection");
        }

        // Only grant premium access if active patron AND meets $15/month minimum
        if (isActivePatron && meetsMinimumPledge) {
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
            // Fallback: try updating profiles table for backwards compatibility
            await supabase
              .from("profiles")
              .update({
                subscription_tier: "premium",
                subscription_status: "active",
                updated_at: new Date().toISOString()
              })
              .eq("id", userId);
          }
          console.log("Granted premium access to user:", userId, "- pledge:", entitledCents, "cents");
        } else if (isActivePatron && !meetsMinimumPledge) {
          console.log("User is patron but below $15/month minimum:", userId, "- pledge:", entitledCents, "cents");
        }
      } else {
        console.log("No userId available - Patreon verified but not linked to app account");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        isActivePatron,
        entitledCents,
        meetsMinimumPledge,
        minimumPledgeCents: MINIMUM_PLEDGE_CENTS,
        hasAccess: isActivePatron && meetsMinimumPledge,
        patreonName: patreonUser.attributes?.full_name,
        patreonEmail,
        userLinked: !!userId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Patreon callback error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});