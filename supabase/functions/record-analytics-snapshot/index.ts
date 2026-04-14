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

// Price ID to tier mapping - PHOTOTHEOLOGY APP ONLY (excludes SamCart/external)
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

const appPriceIds = Object.keys(priceToTier);

// Helper function to handle backfilling missing dates
async function handleBackfill(supabase: any, stripeKey: string | undefined, startDate: string) {
  const today = new Date();
  const start = new Date(startDate);
  const results: string[] = [];

  // Get current snapshot data (we'll use this for all backfilled dates)
  const currentData = await getCurrentSnapshotData(supabase, stripeKey);

  // Get existing snapshot dates
  const { data: existingSnapshots } = await supabase
    .from("analytics_snapshots")
    .select("snapshot_date")
    .gte("snapshot_date", startDate)
    .order("snapshot_date", { ascending: true });

  const existingDates = new Set(existingSnapshots?.map((s: any) => s.snapshot_date) || []);

  // Loop through each date from start to today
  const current = new Date(start);
  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];

    if (!existingDates.has(dateStr)) {
      // Insert snapshot for this date
      const snapshotData = {
        ...currentData,
        snapshot_date: dateStr,
        new_signups_today: 0, // Can't know historical signups
      };

      const { error } = await supabase
        .from("analytics_snapshots")
        .upsert(snapshotData, { onConflict: 'snapshot_date' });

      if (!error) {
        results.push(dateStr);
      }
    }

    current.setDate(current.getDate() + 1);
  }

  logStep("Backfill complete", { filled: results.length, dates: results });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Backfilled ${results.length} missing days`,
      dates: results,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Get current snapshot data
async function getCurrentSnapshotData(supabase: any, stripeKey: string | undefined) {
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

  // Get active churches count
  const { count: activeChurches } = await supabase
    .from("churches")
    .select("id", { count: 'exact', head: true })
    .eq("subscription_status", "active");

  let snapshotData: Record<string, any> = {
    total_users: totalUsers || 0,
    lifetime_access: lifetimeAccess || 0,
    patreon_active: activePatrons || 0,
    pickaxe_count: pickaxePaid || 0,
    stripe_active: 0,
    stripe_trialing: 0,
    stripe_cancelled: 0,
    mrr_cents: 0,
    tier_essential: 0,
    tier_premium: 0,
    tier_student: 0,
    tier_church: 0,
    new_signups_today: 0,
    active_churches: activeChurches || 0,
  };

  // Get Stripe data if available
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

      const activeSubscriptions = await fetchAllStripeSubscriptions(stripe, 'active');
      const trialingSubscriptions = await fetchAllStripeSubscriptions(stripe, 'trialing');
      const canceledSubscriptions = await fetchAllStripeSubscriptions(stripe, 'canceled');

      snapshotData.stripe_active = activeSubscriptions.length;
      snapshotData.stripe_trialing = trialingSubscriptions.length;
      snapshotData.stripe_cancelled = canceledSubscriptions.length;

      // Count by tier and calculate MRR (include both active AND trialing since they have cards on file)
      const allPayingSubs = [...activeSubscriptions, ...trialingSubscriptions];
      allPayingSubs.forEach((sub: any) => {
        const priceId = sub.items.data[0]?.price?.id;
        const tier = priceToTier[priceId] || 'unknown';
        const interval = sub.items.data[0]?.price?.recurring?.interval;
        const amount = sub.items.data[0]?.price?.unit_amount || 0;

        // Only count tiers for active subs (trialing counted separately)
        if (sub.status === 'active') {
          switch (tier) {
            case 'essential': snapshotData.tier_essential++; break;
            case 'premium': snapshotData.tier_premium++; break;
            case 'student': snapshotData.tier_student++; break;
            case 'church': snapshotData.tier_church++; break;
          }
        }

        // Calculate MRR - include trialing users since they have cards on file
        if (interval === 'year') {
          snapshotData.mrr_cents += Math.round(amount / 12);
        } else {
          snapshotData.mrr_cents += amount;
        }
      });
    } catch (stripeError: any) {
      logStep("Stripe API error in backfill", { error: stripeError.message });
    }
  }

  return snapshotData;
}

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

    // ===== MANDATORY AUTH + ADMIN CHECK =====
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: adminCheck } = await supabase
      .from("admin_users").select("user_id").eq("user_id", user.id).single();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for backfill mode
    const url = new URL(req.url);
    const backfillFrom = url.searchParams.get("backfill_from"); // e.g., "2026-01-17"

    if (backfillFrom) {
      logStep("Backfill mode activated", { from: backfillFrom });
      return await handleBackfill(supabase, stripeKey, backfillFrom);
    }

    logStep("Starting analytics snapshot");

    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a snapshot for today
    const { data: existingSnapshot } = await supabase
      .from("analytics_snapshots")
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

    // Get active churches count
    const { count: activeChurches } = await supabase
      .from("churches")
      .select("id", { count: 'exact', head: true })
      .eq("subscription_status", "active");

    // Get new signups today (use UTC for consistency with DB timestamps)
    const todayUTC = new Date().toISOString().split('T')[0]; // e.g., "2026-02-04"
    const todayStartUTC = `${todayUTC}T00:00:00.000Z`;
    const { count: newSignups } = await supabase
      .from("profiles")
      .select("id", { count: 'exact', head: true })
      .gte("created_at", todayStartUTC);
    
    logStep("Counting new signups", { todayStartUTC, newSignups });

    let snapshotData: Record<string, any> = {
      snapshot_date: today,
      total_users: totalUsers || 0,
      lifetime_access: lifetimeAccess || 0,
      patreon_active: activePatrons || 0,
      pickaxe_count: pickaxePaid || 0,
      stripe_active: 0,
      stripe_trialing: 0,
      stripe_cancelled: 0,
      mrr_cents: 0,
      tier_essential: 0,
      tier_premium: 0,
      tier_student: 0,
      tier_church: 0,
      new_signups_today: newSignups || 0,
      active_churches: activeChurches || 0,
    };

    // Get Stripe data if available
    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        logStep("Fetching Stripe data");

        const activeSubscriptions = await fetchAllStripeSubscriptions(stripe, 'active');
        const trialingSubscriptions = await fetchAllStripeSubscriptions(stripe, 'trialing');
        const canceledSubscriptions = await fetchAllStripeSubscriptions(stripe, 'canceled');

        snapshotData.stripe_active = activeSubscriptions.length;
        snapshotData.stripe_trialing = trialingSubscriptions.length;
        snapshotData.stripe_cancelled = canceledSubscriptions.length;

        // Count by tier and calculate MRR (include both active AND trialing since they have cards on file)
        const allPayingSubs = [...activeSubscriptions, ...trialingSubscriptions];
        allPayingSubs.forEach((sub: any) => {
          const priceId = sub.items.data[0]?.price?.id;
          const tier = priceToTier[priceId] || 'unknown';
          const interval = sub.items.data[0]?.price?.recurring?.interval;
          const amount = sub.items.data[0]?.price?.unit_amount || 0;

          // Only count tiers for active subs (trialing counted separately)
          if (sub.status === 'active') {
            switch (tier) {
              case 'essential': snapshotData.tier_essential++; break;
              case 'premium': snapshotData.tier_premium++; break;
              case 'student': snapshotData.tier_student++; break;
              case 'church': snapshotData.tier_church++; break;
            }
          }

          // Calculate MRR - include trialing users since they have cards on file
          if (interval === 'year') {
            snapshotData.mrr_cents += Math.round(amount / 12);
          } else {
            snapshotData.mrr_cents += amount;
          }
        });

        logStep("Stripe data collected", {
          active: snapshotData.stripe_active,
          trialing: snapshotData.stripe_trialing,
          mrr: snapshotData.mrr_cents
        });

      } catch (stripeError: any) {
        logStep("Stripe API error", { error: stripeError.message });
      }
    }

    // Upsert the snapshot (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from("analytics_snapshots")
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
