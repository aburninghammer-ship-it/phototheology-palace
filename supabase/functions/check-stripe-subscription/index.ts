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

// Price ID to tier mapping
const priceToTier: Record<string, string> = {
  // Monthly prices
  'price_1SKn0VFGDAd3RU8Io19mT9No': 'essential',
  'price_1SKn12FGDAd3RU8IBpc45ctZ': 'premium',
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': 'premium',
  // Legacy prices
  'price_1ONMQ9FGDAd3RU8IcBaBYmoJ': 'premium',
  'price_1ONjHsFGDAd3RU8IsHMybTX6': 'premium',
  // Student prices
  'price_1SKWM6FGDAd3RU8IcmNNhmKO': 'student',
  'price_1SKWMLFGDAd3RU8IBXO8pKxd': 'student',
};

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

    const allSubs = [...subscriptions.data, ...trialingSubscriptions.data];
    
    if (allSubs.length === 0) {
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
    const subscription = allSubs[0];
    const periodEnd = subscription.current_period_end;
    const subscriptionEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
    const priceId = subscription.items.data[0]?.price?.id;
    const tier = priceToTier[priceId] || 'premium'; // Default to premium if unknown price
    
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
