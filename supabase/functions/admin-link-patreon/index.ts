import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-LINK-PATREON] ${step}${detailsStr}`);
};

// Minimum pledge for premium access: $15/month = 1500 cents
const MINIMUM_PLEDGE_CENTS = 1500;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified", { adminId: userData.user.id });

    const { action, appEmail, patreonEmail, userId, patreonMemberId } = await req.json();

    // ACTION: Search for app user by email
    if (action === "search_app_user") {
      if (!appEmail) throw new Error("appEmail is required");

      const { data: users } = await supabase.auth.admin.listUsers();
      const matchingUsers = users?.users?.filter(u =>
        u.email?.toLowerCase().includes(appEmail.toLowerCase())
      ).slice(0, 10);

      // Get profile info for matching users
      const userDetails = await Promise.all(
        (matchingUsers || []).map(async (u) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, subscription_tier")
            .eq("id", u.id)
            .single();

          const { data: patreonConn } = await supabase
            .from("patreon_connections")
            .select("patreon_email, is_active_patron, entitled_cents")
            .eq("user_id", u.id)
            .single();

          return {
            id: u.id,
            email: u.email,
            displayName: profile?.display_name,
            subscriptionTier: profile?.subscription_tier,
            patreonConnected: !!patreonConn,
            patreonEmail: patreonConn?.patreon_email,
            isActivePatron: patreonConn?.is_active_patron,
            entitledCents: patreonConn?.entitled_cents,
          };
        })
      );

      return new Response(
        JSON.stringify({ success: true, users: userDetails }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Search for Patreon member by email
    if (action === "search_patreon_member") {
      if (!patreonEmail) throw new Error("patreonEmail is required");

      const { data: members, error } = await supabase
        .from("patreon_members")
        .select("*")
        .ilike("email", `%${patreonEmail}%`)
        .limit(10);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, members: members || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Link Patreon member to app user
    if (action === "link") {
      if (!userId) throw new Error("userId is required");
      if (!patreonMemberId) throw new Error("patreonMemberId is required");

      // Get the Patreon member details
      const { data: patreonMember, error: memberError } = await supabase
        .from("patreon_members")
        .select("*")
        .eq("id", patreonMemberId)
        .single();

      if (memberError || !patreonMember) {
        throw new Error("Patreon member not found");
      }

      logStep("Linking Patreon member to user", {
        userId,
        patreonMemberId,
        patreonEmail: patreonMember.email,
        patronStatus: patreonMember.patron_status,
        pledgeCents: patreonMember.pledge_cents
      });

      // Check if user already has a Patreon connection
      const { data: existingConn } = await supabase
        .from("patreon_connections")
        .select("id")
        .eq("user_id", userId)
        .single();

      // Create or update patreon_connections
      const connectionData = {
        user_id: userId,
        patreon_user_id: patreonMember.patreon_user_id,
        patreon_email: patreonMember.email,
        patreon_name: patreonMember.full_name,
        is_active_patron: patreonMember.patron_status === "active_patron",
        entitled_cents: patreonMember.pledge_cents || 0,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingConn) {
        const { error: updateError } = await supabase
          .from("patreon_connections")
          .update(connectionData)
          .eq("id", existingConn.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("patreon_connections")
          .insert(connectionData);

        if (insertError) throw insertError;
      }

      // Grant premium access if they meet the minimum pledge
      const pledgeCents = patreonMember.pledge_cents || 0;
      const isActivePatron = patreonMember.patron_status === "active_patron";
      const meetsMinimum = pledgeCents >= MINIMUM_PLEDGE_CENTS;

      if (isActivePatron && meetsMinimum) {
        // Update user_subscriptions
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
          logStep("Failed to update user_subscriptions, trying profiles", { error: subError });
          // Fallback to profiles table
          await supabase
            .from("profiles")
            .update({
              subscription_tier: "premium",
              subscription_status: "active",
              updated_at: new Date().toISOString()
            })
            .eq("id", userId);
        }

        logStep("Granted premium access", { userId, pledgeCents });
      } else {
        logStep("Linked but no premium access", {
          userId,
          isActivePatron,
          pledgeCents,
          meetsMinimum,
          reason: !isActivePatron ? "Not active patron" : "Below $15/month minimum"
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          linked: true,
          grantedPremium: isActivePatron && meetsMinimum,
          patreonEmail: patreonMember.email,
          pledgeCents,
          message: isActivePatron && meetsMinimum
            ? `Linked and granted premium access (${(pledgeCents/100).toFixed(2)}/month)`
            : isActivePatron
              ? `Linked but below $15/month minimum (${(pledgeCents/100).toFixed(2)}/month)`
              : "Linked but not an active patron"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Get unlinked Patreon members (those not connected to any app user)
    if (action === "get_unlinked") {
      // Get all Patreon members
      const { data: allPatreonMembers } = await supabase
        .from("patreon_members")
        .select("id, email, full_name, patron_status, pledge_cents")
        .eq("patron_status", "active_patron")
        .order("pledge_cents", { ascending: false });

      // Get all app users' emails
      const { data: users } = await supabase.auth.admin.listUsers();
      const appEmails = new Set(
        users?.users?.map(u => u.email?.toLowerCase()).filter(Boolean) || []
      );

      // Get already connected Patreon emails
      const { data: connections } = await supabase
        .from("patreon_connections")
        .select("patreon_email");
      const connectedEmails = new Set(
        connections?.map(c => c.patreon_email?.toLowerCase()).filter(Boolean) || []
      );

      // Filter to unlinked members
      const unlinkedMembers = (allPatreonMembers || []).filter(m => {
        const email = m.email?.toLowerCase();
        // Not in app AND not already connected
        return email && !appEmails.has(email) && !connectedEmails.has(email);
      });

      // Also find members who ARE in app but not connected
      const inAppNotConnected = (allPatreonMembers || []).filter(m => {
        const email = m.email?.toLowerCase();
        return email && appEmails.has(email) && !connectedEmails.has(email);
      });

      return new Response(
        JSON.stringify({
          success: true,
          notInApp: unlinkedMembers,
          inAppNotConnected,
          stats: {
            totalActivePatrons: allPatreonMembers?.length || 0,
            notInApp: unlinkedMembers.length,
            inAppNotConnected: inAppNotConnected.length,
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action. Use: search_app_user, search_patreon_member, link, or get_unlinked");

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message });
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
