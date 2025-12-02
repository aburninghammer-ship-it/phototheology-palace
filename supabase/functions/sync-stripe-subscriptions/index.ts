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

    console.log("Starting Stripe subscription sync...");

    const results: any[] = [];

    // Get all users from auth
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (authError) {
      console.error("Error listing users:", authError);
      throw new Error("Failed to list users: " + authError.message);
    }

    const users = authData?.users || [];
    console.log(`Found ${users.length} users to check`);

    // For each user, check if they have a Stripe subscription
    for (const user of users) {
      if (!user.email) continue;

      // Search for Stripe customer by email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length === 0) continue;

      const customer = customers.data[0];
      
      // Check for active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      // Also check trialing
      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "trialing",
        limit: 1,
      });

      const activeSub = subscriptions.data[0] || trialingSubscriptions.data[0];

      if (!activeSub) {
        // Check if profile already has this customer ID without active sub
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status, stripe_customer_id")
          .eq("id", user.id)
          .single();

        if (profile?.stripe_customer_id === customer.id && profile?.subscription_status !== "active") {
          results.push({
            email: user.email,
            status: "no_active_subscription",
          });
        }
        continue;
      }

      // Get current profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, stripe_customer_id")
        .eq("id", user.id)
        .single();

      // Skip if already synced correctly
      if (profile?.stripe_customer_id === customer.id && 
          (profile?.subscription_status === "active" || profile?.subscription_status === "trial")) {
        results.push({
          email: user.email,
          status: "already_synced",
          current_status: profile.subscription_status,
        });
        continue;
      }

      // Determine tier from price
      const priceId = activeSub.items.data[0]?.price?.id;
      let tier = "premium"; // default
      
      // Essential tier price IDs
      const essentialPrices = [
        "price_1SZNyCFGDAd3RU8IPwPJVesp", // Essential monthly
        "price_1SZNyVFGDAd3RU8IPgRPqKXH", // Essential annual
      ];
      if (essentialPrices.includes(priceId || "")) {
        tier = "essential";
      }

      const isTrialing = activeSub.status === "trialing";
      const renewalDate = new Date(activeSub.current_period_end * 1000);
      const trialEnd = activeSub.trial_end ? new Date(activeSub.trial_end * 1000) : null;

      // Update profile
      const updateData: Record<string, any> = {
        subscription_status: isTrialing ? "trial" : "active",
        subscription_tier: tier,
        stripe_customer_id: customer.id,
        stripe_subscription_id: activeSub.id,
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
          email: user.email,
          status: "error",
          error: updateError.message,
        });
        console.error(`Error updating ${user.email}:`, updateError);
      } else {
        results.push({
          email: user.email,
          status: "updated",
          tier,
          subscription_status: isTrialing ? "trial" : "active",
          previous_status: profile?.subscription_status || "none",
        });
        console.log(`Updated ${user.email}: ${tier} (${isTrialing ? "trial" : "active"})`);
      }
    }

    const summary = {
      total_users_checked: users.length,
      updated: results.filter(r => r.status === "updated").length,
      already_synced: results.filter(r => r.status === "already_synced").length,
      no_subscription: results.filter(r => r.status === "no_active_subscription").length,
      errors: results.filter(r => r.status === "error").length,
    };

    console.log("Sync completed:", summary);

    return new Response(JSON.stringify({ 
      success: true,
      summary, 
      updated_users: results.filter(r => r.status === "updated"),
      errors: results.filter(r => r.status === "error"),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Sync error:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
