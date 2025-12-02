import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Check for admin auth (optional - you can remove this for one-time use)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    let hasMore = true;
    let startingAfter: string | undefined;

    // Fetch all active subscriptions from Stripe
    while (hasMore) {
      const subscriptions = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        starting_after: startingAfter,
        expand: ["data.customer"],
      });

      for (const sub of subscriptions.data) {
        const customer = sub.customer as Stripe.Customer;
        if (!customer.email) continue;

        const email = customer.email;
        const customerId = customer.id;
        const renewalDate = new Date(sub.current_period_end * 1000);
        const isTrialing = sub.status === "trialing";
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

        // Find user by email in auth.users via profiles
        // First get user_id from auth.users
        const { data: authUser } = await supabase.auth.admin.listUsers();
        const user = authUser?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
          results.push({
            email,
            status: "skipped",
            reason: "No matching user found",
          });
          continue;
        }

        // Check current profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status, stripe_customer_id")
          .eq("id", user.id)
          .single();

        // Skip if already properly synced
        if (profile?.stripe_customer_id === customerId && profile?.subscription_status === "active") {
          results.push({
            email,
            status: "already_synced",
          });
          continue;
        }

        // Determine tier from price
        const priceId = sub.items.data[0]?.price?.id;
        let tier = "premium"; // default
        if (priceId?.includes("essential") || priceId === "price_1SZNyCFGDAd3RU8IPwPJVesp" || priceId === "price_1SZNyVFGDAd3RU8IPgRPqKXH") {
          tier = "essential";
        }

        // Update profile
        const updateData: Record<string, any> = {
          subscription_status: isTrialing ? "trial" : "active",
          subscription_tier: tier,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          subscription_renewal_date: renewalDate.toISOString(),
          payment_source: "stripe",
          is_recurring: true,
        };

        if (trialEnd) {
          updateData.trial_ends_at = trialEnd.toISOString();
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user.id);

        if (updateError) {
          results.push({
            email,
            status: "error",
            error: updateError.message,
          });
        } else {
          results.push({
            email,
            status: "updated",
            tier,
            subscription_status: isTrialing ? "trial" : "active",
          });
        }
      }

      hasMore = subscriptions.has_more;
      if (hasMore && subscriptions.data.length > 0) {
        startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
      }
    }

    // Also check for trialing subscriptions
    const trialingSubscriptions = await stripe.subscriptions.list({
      status: "trialing",
      limit: 100,
      expand: ["data.customer"],
    });

    for (const sub of trialingSubscriptions.data) {
      const customer = sub.customer as Stripe.Customer;
      if (!customer.email) continue;

      const email = customer.email;
      const { data: authUser } = await supabase.auth.admin.listUsers();
      const user = authUser?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!user) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_customer_id === customer.id) continue;

      const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "trial",
          subscription_tier: "premium",
          stripe_customer_id: customer.id,
          stripe_subscription_id: sub.id,
          trial_ends_at: trialEnd?.toISOString(),
          payment_source: "stripe",
          is_recurring: true,
        })
        .eq("id", user.id);

      results.push({
        email,
        status: updateError ? "error" : "updated_trial",
        error: updateError?.message,
      });
    }

    const summary = {
      total: results.length,
      updated: results.filter(r => r.status === "updated" || r.status === "updated_trial").length,
      already_synced: results.filter(r => r.status === "already_synced").length,
      skipped: results.filter(r => r.status === "skipped").length,
      errors: results.filter(r => r.status === "error").length,
    };

    console.log("Sync completed:", summary);
    console.log("Details:", results);

    return new Response(JSON.stringify({ summary, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Sync error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
