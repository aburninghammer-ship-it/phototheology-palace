import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-STRIPE-SUB] ${step}${detailsStr}`);
};

// Price ID to tier mapping - PHOTOTHEOLOGY APP ONLY
const priceToTier: Record<string, string> = {
  // Current subscriptions (2026)
  'price_1SZNyCFGDAd3RU8IPwPJVesp': 'essential',      // Essential Monthly $9
  'price_1SZNyVFGDAd3RU8IPgRPqKXH': 'essential',      // Essential Annual $90
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': 'premium',        // Premium Monthly $15
  'price_1SZNyuFGDAd3RU8IjeGIvPEb': 'premium',        // Premium Annual $150
  'price_1STVXrFGDAd3RU8Ia2NbKJWo': 'student',        // Student Monthly $4.99
  // Legacy Phototheology App subscriptions
  'price_1SKn0VFGDAd3RU8Io19mT9No': 'premium',        // Legacy Premium $15/mo
  'price_1SKn12FGDAd3RU8IBpc45ctZ': 'essential',      // Legacy Essential $9/mo
  // Even older legacy prices (for full coverage)
  'price_1SJJhAFGDAd3RU8IH8B7ejdt': 'premium',        // Old Premium $15/mo
  // Church tiers
  'price_1SNEzoFGDAd3RU8Iwa8PSyLw': 'church',         // Church Basic $199/mo
  'price_1SNFDxFGDAd3RU8IrvW3c5eS': 'church',         // Church Standard $399/mo
  'price_1SNFFMFGDAd3RU8IoasLs7ag': 'church',         // Church Premium $899/mo
};

// Only these price IDs count as Phototheology subscriptions.
const appPriceIds = new Set(Object.keys(priceToTier));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Search for customer by email (case insensitive)
    const customers = await stripe.customers.list({ 
      email: user.email.toLowerCase(), 
      limit: 1 
    });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found for email", { email: user.email });
      return new Response(JSON.stringify({ 
        subscribed: false,
        tier: null,
        subscription_end: null,
        source: 'stripe_direct'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    // Also check trialing subscriptions
    const trialingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 10,
    });

    // Check for past_due / unpaid subscriptions (payment failed)
    const pastDueSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "past_due",
      limit: 10,
    });

    const unpaidSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "unpaid",
      limit: 10,
    });

    const failedSubs = [...pastDueSubscriptions.data, ...unpaidSubscriptions.data];
    const failedAppSubs = failedSubs.filter((sub: any) => {
      const items = sub?.items?.data || [];
      return items.some((item: any) => {
        const priceId = item?.price?.id;
        return typeof priceId === 'string' && appPriceIds.has(priceId);
      });
    });

    // If there are past_due/unpaid subscriptions, immediately flag payment failure
    if (failedAppSubs.length > 0) {
      const failedSub = failedAppSubs[0];
      logStep("PAYMENT FAILED — subscription past_due/unpaid", {
        subscriptionId: failedSub.id,
        status: failedSub.status,
      });

      // Update DB to reflect failed payment
      await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_status: 'payment_failed',
          stripe_customer_id: customerId,
          stripe_subscription_id: failedSub.id,
          payment_source: 'stripe',
          is_recurring: true,
        }, { onConflict: 'user_id' });

      await supabaseClient
        .from('profiles')
        .update({
          subscription_status: 'payment_failed',
          payment_source: 'stripe',
        })
        .eq('id', user.id);

      return new Response(JSON.stringify({
        subscribed: false,
        payment_failed: true,
        status: failedSub.status,
        tier: null,
        subscription_end: null,
        source: 'stripe_direct'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const allSubs = [...subscriptions.data, ...trialingSubscriptions.data];

    // Filter to ONLY this app's subscriptions (ignore any other Stripe products, incl. SamCart/external)
    const appSubs = allSubs
      .filter((sub: any) => {
        const items = sub?.items?.data || [];
        return items.some((item: any) => {
          const priceId = item?.price?.id;
          return typeof priceId === 'string' && appPriceIds.has(priceId);
        });
      })
      .sort((a: any, b: any) => (b?.current_period_end || 0) - (a?.current_period_end || 0));
    
    if (appSubs.length === 0) {
      logStep("No active/trialing subscriptions found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        tier: null,
        subscription_end: null,
        source: 'stripe_direct'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get the most recent active subscription
    const subscription = appSubs[0];
    const periodEnd = subscription.current_period_end;
    const subscriptionEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;

    const priceId = (subscription.items.data || [])
      .map((item: any) => item?.price?.id)
      .find((id: any) => typeof id === 'string' && appPriceIds.has(id));

    // Safety: if we somehow have a subscription but no recognized app price, treat as not subscribed.
    if (!priceId) {
      logStep("Subscription found but no Phototheology price ID matched", { subscriptionId: subscription.id });
      return new Response(JSON.stringify({
        subscribed: false,
        tier: null,
        subscription_end: null,
        source: 'stripe_direct'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const tier = priceToTier[priceId];
    
    logStep("Active subscription found", { 
      subscriptionId: subscription.id, 
      status: subscription.status,
      priceId,
      tier,
      endDate: subscriptionEnd 
    });

    // Sync to database - update user_subscriptions table
    const updateData = {
      user_id: user.id,
      subscription_status: subscription.status === 'trialing' ? 'trial' : 'active',
      subscription_tier: tier,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_renewal_date: subscriptionEnd,
      payment_source: 'stripe',
      is_recurring: true,
    };

    const { error: upsertError } = await supabaseClient
      .from('user_subscriptions')
      .upsert(updateData, { onConflict: 'user_id' });

    if (upsertError) {
      logStep("Warning: Failed to sync subscription to user_subscriptions", { error: upsertError });
    } else {
      logStep("Subscription synced to user_subscriptions", { userId: user.id, tier });
    }

    // ALSO sync to profiles table for accurate analytics
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        subscription_status: subscription.status === 'trialing' ? 'trial' : 'active',
        subscription_tier: tier,
        payment_source: 'stripe',
      })
      .eq('id', user.id);

    if (profileError) {
      logStep("Warning: Failed to sync subscription to profiles", { error: profileError });
    } else {
      logStep("Subscription synced to profiles", { userId: user.id, tier });
    }

    return new Response(JSON.stringify({
      subscribed: true,
      tier,
      subscription_end: subscriptionEnd,
      status: subscription.status,
      source: 'stripe_direct'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-stripe-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
