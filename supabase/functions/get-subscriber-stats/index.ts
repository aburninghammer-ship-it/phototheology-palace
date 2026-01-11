import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBSCRIBER-STATS] ${step}${detailsStr}`);
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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const userClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Invalid authorization");
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminCheck) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified, fetching stats");

    // Get database stats from profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_status, payment_source, created_at, has_lifetime_access");

    if (profilesError) {
      throw profilesError;
    }

    // Calculate database statistics
    const dbStats = {
      total_users: profiles.length,
      by_tier: { free: 0, essential: 0, premium: 0, student: 0, patron: 0, null: 0 },
      by_status: { none: 0, trial: 0, active: 0, cancelled: 0, expired: 0, null: 0 },
      by_payment_source: { stripe: 0, patreon: 0, manual: 0, promotional: 0, lifetime: 0, null: 0 },
      lifetime_access: 0,
    };

    profiles.forEach((profile: any) => {
      const tier = profile.subscription_tier || "null";
      if (tier in dbStats.by_tier) {
        dbStats.by_tier[tier as keyof typeof dbStats.by_tier]++;
      }

      const status = profile.subscription_status || "null";
      if (status in dbStats.by_status) {
        dbStats.by_status[status as keyof typeof dbStats.by_status]++;
      }

      const source = profile.payment_source || "null";
      if (source in dbStats.by_payment_source) {
        dbStats.by_payment_source[source as keyof typeof dbStats.by_payment_source]++;
      }

      if (profile.has_lifetime_access) {
        dbStats.lifetime_access++;
      }
    });

    // Get Patreon stats
    const { data: patreonConnections } = await supabase
      .from("patreon_connections")
      .select("is_active_patron, entitled_cents")
      .eq("is_active_patron", true);

    const patreonStats = {
      total_connected: patreonConnections?.length || 0,
      active_patrons: patreonConnections?.filter((p: any) => p.is_active_patron).length || 0,
      at_20_or_above: patreonConnections?.filter((p: any) => p.entitled_cents >= 2000).length || 0,
      below_20: patreonConnections?.filter((p: any) => p.entitled_cents < 2000 && p.entitled_cents > 0).length || 0,
    };

    // Recent signups
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = profiles.filter((p: any) => new Date(p.created_at) > thirtyDaysAgo).length;

    // NOW GET REAL STRIPE DATA
    let stripeStats = {
      active_subscriptions: 0,
      trialing_subscriptions: 0,
      canceled_subscriptions: 0,
      by_tier: { essential: 0, premium: 0, student: 0, unknown: 0 },
      total_mrr_cents: 0,
      error: null as string | null,
    };

    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        logStep("Fetching Stripe subscriptions");

        // Get active subscriptions
        const activeSubscriptions = await stripe.subscriptions.list({
          status: "active",
          limit: 100,
          expand: ['data.items.data.price'],
        });

        stripeStats.active_subscriptions = activeSubscriptions.data.length;

        // Count by tier and calculate MRR
        activeSubscriptions.data.forEach((sub: any) => {
          const priceId = sub.items.data[0]?.price?.id;
          const tier = priceToTier[priceId] || 'unknown';
          if (tier in stripeStats.by_tier) {
            stripeStats.by_tier[tier as keyof typeof stripeStats.by_tier]++;
          }
          // Calculate MRR
          const amount = sub.items.data[0]?.price?.unit_amount || 0;
          const interval = sub.items.data[0]?.price?.recurring?.interval;
          if (interval === 'year') {
            stripeStats.total_mrr_cents += Math.round(amount / 12);
          } else {
            stripeStats.total_mrr_cents += amount;
          }
        });

        // Get trialing subscriptions
        const trialingSubscriptions = await stripe.subscriptions.list({
          status: "trialing",
          limit: 100,
        });
        stripeStats.trialing_subscriptions = trialingSubscriptions.data.length;

        // Get canceled subscriptions - only count ones with our app's price IDs
        const canceledSubscriptions = await stripe.subscriptions.list({
          status: "canceled",
          limit: 100,
          expand: ['data.items.data.price'],
        });
        
        // Filter to only our app's subscriptions (prices we recognize)
        const appPriceIds = Object.keys(priceToTier);
        stripeStats.canceled_subscriptions = canceledSubscriptions.data.filter((sub: any) => {
          const priceId = sub.items.data[0]?.price?.id;
          return appPriceIds.includes(priceId);
        }).length;

        logStep("Stripe stats fetched", stripeStats);

      } catch (stripeError: any) {
        logStep("Stripe API error", { error: stripeError.message });
        stripeStats.error = stripeError.message;
      }
    } else {
      stripeStats.error = "STRIPE_SECRET_KEY not configured";
    }

    // Calculate summary stats
    const summary = {
      total_paying_stripe: stripeStats.active_subscriptions,
      total_paying_patreon: patreonStats.active_patrons,
      total_trialing: stripeStats.trialing_subscriptions,
      total_lifetime: dbStats.lifetime_access,
      total_with_access: stripeStats.active_subscriptions + patreonStats.active_patrons + dbStats.lifetime_access,
      monthly_recurring_revenue: `$${(stripeStats.total_mrr_cents / 100).toFixed(2)}`,
    };

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          summary,
          stripe: stripeStats,
          patreon: patreonStats,
          database: dbStats,
          recent_signups_30d: recentSignups,
          generated_at: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Get subscriber stats error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
