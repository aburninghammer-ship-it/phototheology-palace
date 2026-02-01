import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FIX-SUBSCRIPTION-MISMATCH] ${step}${detailsStr}`);
};

// Price ID to tier mapping - PHOTOTHEOLOGY APP ONLY
const priceToTier: Record<string, string> = {
  // Current subscriptions
  'price_1SZNyCFGDAd3RU8IPwPJVesp': 'essential',
  'price_1SZNyVFGDAd3RU8IPgRPqKXH': 'essential',
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': 'premium',
  'price_1SZNyuFGDAd3RU8IjeGIvPEb': 'premium',
  'price_1STVXrFGDAd3RU8Ia2NbKJWo': 'student',
  // Legacy Phototheology App subscriptions
  'price_1SKn0VFGDAd3RU8Io19mT9No': 'premium',
  'price_1SKn12FGDAd3RU8IBpc45ctZ': 'essential',
  // Church tiers
  'price_1SNEzoFGDAd3RU8Iwa8PSyLw': 'church',
  'price_1SNFDxFGDAd3RU8IrvW3c5eS': 'church',
  'price_1SNFFMFGDAd3RU8IoasLs7ag': 'church',
};

// Only these price IDs count as Phototheology subscriptions.
const appPriceIds = new Set(Object.keys(priceToTier));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!roleData && !adminUser) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id, action } = await req.json();
    
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Processing user", { user_id, action });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get user email from auth
    const { data: authData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    
    if (userError || !authData?.user?.email) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = authData.user.email;
    logStep("Found user email", { email: userEmail });

    // Search for Stripe customer
    const customers = await stripe.customers.list({
      email: userEmail.toLowerCase(),
      limit: 1,
    });

    let stripeCustomerId: string | null = null;
    let stripeSubscriptionId: string | null = null;
    let subscriptionStatus = "free";
    let subscriptionTier: string | null = null;
    let subscriptionRenewalDate: string | null = null;
    let isRecurring = false;

    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId: stripeCustomerId });

      // Check for active/trialing subscriptions (filter to Phototheology price IDs)
      const activeSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "active",
        limit: 10,
        expand: ["data.items.data.price"],
      });

      const trialingSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "trialing",
        limit: 10,
        expand: ["data.items.data.price"],
      });

      const candidates = [...activeSubscriptions.data, ...trialingSubscriptions.data];
      const appCandidates = candidates
        .filter((sub: any) => {
          const items = sub?.items?.data || [];
          return items.some((item: any) => {
            const priceId = item?.price?.id;
            return typeof priceId === "string" && appPriceIds.has(priceId);
          });
        })
        .sort((a: any, b: any) => (b?.current_period_end || 0) - (a?.current_period_end || 0));

      const activeSub = appCandidates[0];

      if (activeSub) {
        stripeSubscriptionId = activeSub.id;
        subscriptionStatus = activeSub.status === "trialing" ? "trial" : "active";
        isRecurring = true;

        const priceId = (activeSub.items.data || [])
          .map((item: any) => item?.price?.id)
          .find((id: any) => typeof id === "string" && appPriceIds.has(id));

        if (!priceId) {
          // Not a Phototheology subscription; treat as no valid subscription for this app.
          stripeSubscriptionId = null;
          subscriptionStatus = "free";
          subscriptionTier = null;
          subscriptionRenewalDate = null;
          isRecurring = false;
          logStep("Subscription found but not a Phototheology price", { subscriptionId: activeSub.id });
        } else {
          subscriptionTier = priceToTier[priceId];
        }

        if (stripeSubscriptionId && activeSub.current_period_end) {
          subscriptionRenewalDate = new Date(activeSub.current_period_end * 1000).toISOString();
        }

        if (stripeSubscriptionId) {
          logStep("Found Phototheology subscription", {
            subscriptionId: stripeSubscriptionId,
            status: subscriptionStatus,
            tier: subscriptionTier,
          });
        }
      } else {
        logStep("No active subscription found in Stripe");
      }
    } else {
      logStep("No Stripe customer found");
    }

    // Update user_subscriptions table
    const updateData: Record<string, any> = {
      user_id,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      payment_source: stripeSubscriptionId ? "stripe" : null,
      is_recurring: !!stripeSubscriptionId && isRecurring,
    };

    // If user has no Stripe subscription and no lifetime access, reset to free
    const { data: currentSub } = await supabase
      .from("user_subscriptions")
      .select("has_lifetime_access")
      .eq("user_id", user_id)
      .single();

    const hasLifetimeAccess = currentSub?.has_lifetime_access || false;

    if (!stripeSubscriptionId && !hasLifetimeAccess) {
      // No valid subscription source - set to free
      updateData.subscription_status = "free";
      updateData.subscription_tier = null;
      updateData.subscription_renewal_date = null;
      logStep("Setting user to free tier - no valid subscription source");
    } else if (stripeSubscriptionId) {
      // Has Stripe subscription - sync it
      updateData.subscription_status = subscriptionStatus;
      updateData.subscription_tier = subscriptionTier;
      if (subscriptionRenewalDate) {
        updateData.subscription_renewal_date = subscriptionRenewalDate;
      }
    }
    // If has lifetime or church access but no Stripe, leave status as is

    const { error: upsertError } = await supabase
      .from("user_subscriptions")
      .upsert(updateData, { onConflict: "user_id" });

    if (upsertError) {
      logStep("Error updating subscription", { error: upsertError });
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also update profiles table, but only when we have explicit values to write.
    // (Avoid accidentally overwriting lifetime/church users to "free".)
    const profileUpdate: Record<string, any> = {
      payment_source: stripeSubscriptionId ? "stripe" : null,
    };

    if (updateData.subscription_status !== undefined) {
      profileUpdate.subscription_status = updateData.subscription_status;
    }
    if (updateData.subscription_tier !== undefined) {
      profileUpdate.subscription_tier = updateData.subscription_tier;
    }

    if (Object.keys(profileUpdate).length > 0) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", user_id);

      if (profileError) {
        logStep("Warning: Failed to update profiles", { error: profileError });
      }
    }

    logStep("Successfully fixed subscription", updateData);

    return new Response(JSON.stringify({
      success: true,
      user_id,
      email: userEmail,
      previous_status: currentSub,
      new_status: {
        subscription_status: updateData.subscription_status,
        subscription_tier: updateData.subscription_tier,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
