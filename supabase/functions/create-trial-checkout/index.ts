import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRIAL-CHECKOUT] ${step}${detailsStr}`);
};

// Price IDs for trial subscriptions
const PLAN_PRICES = {
  essential_monthly: "price_1STVXrFGDAd3RU8Ia2NbKJWo", // Essential monthly
  essential_annual: "price_1STVXrFGDAd3RU8Ia2NbKJWo", // Essential annual (update with actual)
  premium_monthly: "price_1STVXrFGDAd3RU8Ia2NbKJWo", // Premium monthly (update with actual)
  premium_annual: "price_1STVXrFGDAd3RU8Ia2NbKJWo", // Premium annual (update with actual)
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
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

    const { plan, billing } = await req.json();
    const planKey = `${plan}_${billing}` as keyof typeof PLAN_PRICES;
    const priceId = PLAN_PRICES[planKey];
    
    if (!priceId) {
      throw new Error(`Invalid plan configuration: ${planKey}`);
    }

    logStep("Plan selected", { plan, billing, priceId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    const origin = req.headers.get("origin") || "https://phototheologypalace.com";

    // Create checkout session with 7-day trial (requires payment method)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      payment_method_collection: "always", // Require credit card
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          user_id: user.id,
          plan: plan,
          billing: billing,
        },
      },
      success_url: `${origin}/pricing?trial=success`,
      cancel_url: `${origin}/pricing?trial=cancelled`,
      metadata: {
        user_id: user.id,
        plan: plan,
        billing: billing,
        is_trial: "true",
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
