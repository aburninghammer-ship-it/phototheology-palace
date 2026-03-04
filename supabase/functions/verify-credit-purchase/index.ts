import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Auth check
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("Not authenticated");

    const { packId, credits } = await req.json();
    if (!packId) throw new Error("Missing pack ID");

    const isUnlimited = credits === -1;

    // Upsert credit balance
    const { data: existing } = await supabaseAdmin
      .from("ai_credit_balances")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      if (isUnlimited) {
        await supabaseAdmin
          .from("ai_credit_balances")
          .update({
            has_unlimited: true,
            unlimited_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        await supabaseAdmin
          .from("ai_credit_balances")
          .update({
            credits_balance: existing.credits_balance + credits,
            lifetime_purchased: existing.lifetime_purchased + credits,
          })
          .eq("user_id", user.id);
      }
    } else {
      await supabaseAdmin.from("ai_credit_balances").insert({
        user_id: user.id,
        credits_balance: isUnlimited ? 100 : 100 + credits,
        has_unlimited: isUnlimited,
        unlimited_expires_at: isUnlimited
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null,
        lifetime_purchased: isUnlimited ? 0 : credits,
      });
    }

    // Log purchase
    await supabaseAdmin.from("ai_credit_purchases").insert({
      user_id: user.id,
      pack_id: packId,
      credits_added: credits,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
