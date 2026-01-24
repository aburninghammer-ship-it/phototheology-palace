import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYTICS-SNAPSHOT] ${step}${detailsStr}`);
};

// Price ID to tier mapping
const priceToTier: Record<string, string> = {
  'price_1SZNyCFGDAd3RU8IPwPJVesp': 'essential',
  'price_1SZNyVFGDAd3RU8IPgRPqKXH': 'essential',
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': 'premium',
  'price_1SZNyuFGDAd3RU8IjeGIvPEb': 'premium',
  'price_1STVXrFGDAd3RU8Ia2NbKJWo': 'student',
  'price_1SKn0VFGDAd3RU8Io19mT9No': 'premium',
  'price_1SKn12FGDAd3RU8IBpc45ctZ': 'essential',
  'price_1ONMQ9FGDAd3RU8IcBaBYmoJ': 'premium',
  'price_1SNEzoFGDAd3RU8Iwa8PSyLw': 'church',
  'price_1SNFDxFGDAd3RU8IrvW3c5eS': 'church',
  'price_1SNFFMFGDAd3RU8IoasLs7ag': 'church',
};

const appPriceIds = Object.keys(priceToTier);

// Helper to fetch all Stripe subscriptions with pagination
async function fetchAllStripeSubscriptions(
  stripe: Stripe, 
  status: 'active' | 'trialing' | 'canceled'
): Promise<Stripe.Subscription[]> {
  const allSubscriptions: Stripe.Subscription[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const params: Stripe.SubscriptionListParams = {
      status,
      limit: 100,
      expand: ['data.items.data.price'],
    };
    if (startingAfter) params.starting_after = startingAfter;

    const batch = await stripe.subscriptions.list(params);
    
    const appSubs = batch.data.filter((sub: any) => {
      const priceId = sub.items.data[0]?.price?.id;
      return appPriceIds.includes(priceId);
    });
    
    allSubscriptions.push(...appSubs);
    hasMore = batch.has_more;
    if (batch.data.length > 0) {
      startingAfter = batch.data[batch.data.length - 1].id;
    }
  }

  return allSubscriptions;
}

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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Optional: Verify admin if called manually
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, supabaseServiceKey, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user }, error: authError } = await userClient.auth.getUser();
      if (user) {
        const { data: adminCheck } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .single();
        if (!adminCheck) {
          throw new Error("Admin access required");
        }
      }
    }

    logStep("Starting analytics snapshot");

    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a snapshot for today
    const { data: existingSnapshot } = await supabase
      .from("subscription_analytics_snapshots")
      .select("id")
      .eq("snapshot_date", today)
      .single();

    // Get total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("id", { count: 'exact', head: true });

    // Get lifetime access count
    const { count: lifetimeAccess } = await supabase
      .from("user_subscriptions")
      .select("id", { count: 'exact', head: true })
      .eq("has_lifetime_access", true);

    // Get active patrons
    const { count: activePatrons } = await supabase
      .from("patreon_connections")
      .select("id", { count: 'exact', head: true })
      .eq("is_active_patron", true);

    // Get Pickaxe paid users
    const { count: pickaxePaid } = await supabase
      .from("pickaxe_connections")
      .select("id", { count: 'exact', head: true })
      .eq("is_paid_user", true);

    let snapshotData = {
      snapshot_date: today,
      total_users: totalUsers || 0,
      lifetime_access: lifetimeAccess || 0,
      active_patrons: activePatrons || 0,
      pickaxe_paid: pickaxePaid || 0,
      active_subscriptions: 0,
      trialing_subscriptions: 0,
      canceled_subscriptions: 0,
      mrr_cents: 0,
      essential_count: 0,
      premium_count: 0,
      student_count: 0,
      church_count: 0,
    };

    // Get Stripe data if available
    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        logStep("Fetching Stripe data");

        const activeSubscriptions = await fetchAllStripeSubscriptions(stripe, 'active');
        const trialingSubscriptions = await fetchAllStripeSubscriptions(stripe, 'trialing');
        const canceledSubscriptions = await fetchAllStripeSubscriptions(stripe, 'canceled');

        snapshotData.active_subscriptions = activeSubscriptions.length;
        snapshotData.trialing_subscriptions = trialingSubscriptions.length;
        snapshotData.canceled_subscriptions = canceledSubscriptions.length;

        // Count by tier and calculate MRR
        activeSubscriptions.forEach((sub: any) => {
          const priceId = sub.items.data[0]?.price?.id;
          const tier = priceToTier[priceId] || 'unknown';
          const interval = sub.items.data[0]?.price?.recurring?.interval;
          const amount = sub.items.data[0]?.price?.unit_amount || 0;

          switch (tier) {
            case 'essential': snapshotData.essential_count++; break;
            case 'premium': snapshotData.premium_count++; break;
            case 'student': snapshotData.student_count++; break;
            case 'church': snapshotData.church_count++; break;
          }

          // Calculate MRR
          if (interval === 'year') {
            snapshotData.mrr_cents += Math.round(amount / 12);
          } else {
            snapshotData.mrr_cents += amount;
          }
        });

        logStep("Stripe data collected", {
          active: snapshotData.active_subscriptions,
          trialing: snapshotData.trialing_subscriptions,
          mrr: snapshotData.mrr_cents
        });

      } catch (stripeError: any) {
        logStep("Stripe API error", { error: stripeError.message });
      }
    }

    // Upsert the snapshot (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from("subscription_analytics_snapshots")
      .upsert(snapshotData, { onConflict: 'snapshot_date' });

    if (upsertError) {
      throw upsertError;
    }

    logStep("Snapshot saved successfully", snapshotData);

    return new Response(
      JSON.stringify({
        success: true,
        message: existingSnapshot ? "Snapshot updated" : "Snapshot created",
        snapshot: snapshotData,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Record analytics snapshot error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
