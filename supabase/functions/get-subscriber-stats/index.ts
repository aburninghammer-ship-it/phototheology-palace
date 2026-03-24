import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBSCRIBER-STATS] ${step}${detailsStr}`);
};

// Price ID to tier mapping - used for tier classification
// Product names will be fetched from Stripe directly for accurate display
const priceToTierMap: Record<string, { tier: string; monthlyPrice: number }> = {
  // ========== CURRENT SUBSCRIPTION PRODUCTS ==========
  'price_1SZNyCFGDAd3RU8IPwPJVesp': { tier: 'essential', monthlyPrice: 9 },
  'price_1SZNyVFGDAd3RU8IPgRPqKXH': { tier: 'essential', monthlyPrice: 7.5 }, // $90/12
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': { tier: 'premium', monthlyPrice: 15 },
  'price_1SZNyuFGDAd3RU8IjeGIvPEb': { tier: 'premium', monthlyPrice: 12.5 }, // $150/12

  // ========== STUDENT ==========
  'price_1STVXrFGDAd3RU8Ia2NbKJWo': { tier: 'student', monthlyPrice: 4.99 },

  // ========== LEGACY PHOTOTHEOLOGY APP SUBSCRIPTIONS ==========
  'price_1SKn0VFGDAd3RU8Io19mT9No': { tier: 'premium', monthlyPrice: 15 },
  'price_1SKn12FGDAd3RU8IBpc45ctZ': { tier: 'essential', monthlyPrice: 9 },

  // ========== CHURCH TIERS ==========
  'price_1SNEzoFGDAd3RU8Iwa8PSyLw': { tier: 'church', monthlyPrice: 199 },
  'price_1SNFDxFGDAd3RU8IrvW3c5eS': { tier: 'church', monthlyPrice: 399 },
  'price_1SNFFMFGDAd3RU8IoasLs7ag': { tier: 'church', monthlyPrice: 899 },
};

// Legacy compatibility object
const priceToInfo: Record<string, { tier: string; name: string; price: number }> = {
  'price_1SZNyCFGDAd3RU8IPwPJVesp': { tier: 'essential', name: 'Essential Monthly', price: 9 },
  'price_1SZNyVFGDAd3RU8IPgRPqKXH': { tier: 'essential', name: 'Essential Annual', price: 90 },
  'price_1SZNyiFGDAd3RU8I4JHYEsEi': { tier: 'premium', name: 'Premium Monthly', price: 15 },
  'price_1SZNyuFGDAd3RU8IjeGIvPEb': { tier: 'premium', name: 'Premium Annual', price: 150 },
  'price_1STVXrFGDAd3RU8Ia2NbKJWo': { tier: 'student', name: 'Student Discount', price: 4.99 },
  'price_1SKn0VFGDAd3RU8Io19mT9No': { tier: 'premium', name: 'Phototheology App', price: 15 },
  'price_1SKn12FGDAd3RU8IBpc45ctZ': { tier: 'essential', name: 'Phototheology App Lite', price: 9 },
  'price_1SNEzoFGDAd3RU8Iwa8PSyLw': { tier: 'church', name: 'Small Church', price: 199 },
  'price_1SNFDxFGDAd3RU8IrvW3c5eS': { tier: 'church', name: 'Tier 1: 50 Seats', price: 399 },
  'price_1SNFFMFGDAd3RU8IoasLs7ag': { tier: 'church', name: 'Tier 2: 150 Seats', price: 899 },
};

// For backward compatibility
const priceToTier: Record<string, string> = Object.fromEntries(
  Object.entries(priceToInfo).map(([id, info]) => [id, info.tier])
);

const appPriceIds = Object.keys(priceToInfo);

// Only these tiers count as Phototheology app subscription tiers in the database.
// (Prevents old/incorrect records synced from unrelated Stripe products from inflating counts.)
const appStripeTiers = new Set(['essential', 'premium', 'student', 'church']);

// Helper to fetch all Stripe subscriptions with pagination
// Now fetches ALL subscriptions (not filtered by price ID) to show full Stripe picture
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

    // Include ALL subscriptions - no filtering by price ID
    allSubscriptions.push(...batch.data);
    hasMore = batch.has_more;
    if (batch.data.length > 0) {
      startingAfter = batch.data[batch.data.length - 1].id;
    }
  }

  return allSubscriptions;
}

// Helper to get product name - fetches from Stripe if needed
async function getProductName(
  stripe: Stripe,
  productId: string | Stripe.Product,
  productCache: Map<string, string>
): Promise<string> {
  if (typeof productId === 'object' && productId.name) {
    return productId.name;
  }
  const id = typeof productId === 'string' ? productId : productId.id;
  if (productCache.has(id)) {
    return productCache.get(id)!;
  }
  try {
    const product = await stripe.products.retrieve(id);
    productCache.set(id, product.name);
    return product.name;
  } catch {
    return 'Unknown Product';
  }
}

Deno.serve(async (req) => {
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
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Authorization required");
    }

    // Use service role client to verify user token (ES256 compatible)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
      logStep("Auth failed", { error: authError?.message });
      throw new Error("Invalid authorization");
    }

    const userId = authUser.id;

    // (supabase is already the service role client from above)

    // Check if user is admin (using admin_users table)
    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!adminCheck) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified, fetching stats");

    // Get database stats from user_subscriptions (the authoritative source)
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("user_subscriptions")
      .select("subscription_tier, subscription_status, payment_source, created_at, has_lifetime_access, is_recurring, stripe_subscription_id, trial_ends_at");

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    // Also get profile count for total users
    const { count: profileCount } = await supabase
      .from("profiles")
      .select("id", { count: 'exact', head: true });

    // Count active database trials (trial status + trial_ends_at in the future)
    const now = new Date();
    const activeDbTrials = subscriptions.filter((sub: any) => 
      sub.subscription_status === 'trial' && 
      sub.trial_ends_at && 
      new Date(sub.trial_ends_at) > now
    ).length;

    // Calculate database statistics
    const dbStats = {
      total_users: profileCount || 0,
      active_trials: activeDbTrials,
      by_tier: { free: 0, essential: 0, premium: 0, student: 0, church: 0, patron: 0, null: 0 },
      by_status: { none: 0, trial: 0, active: 0, cancelled: 0, expired: 0, null: 0 },
      by_payment_source: { stripe: 0, patreon: 0, manual: 0, promotional: 0, lifetime: 0, null: 0 },
      lifetime_access: 0,
      stripe_linked_count: 0,
    };

    subscriptions.forEach((sub: any) => {
      const tier = sub.subscription_tier || "null";
      if (tier in dbStats.by_tier) {
        dbStats.by_tier[tier as keyof typeof dbStats.by_tier]++;
      }

      const status = sub.subscription_status || "null";
      if (status in dbStats.by_status) {
        dbStats.by_status[status as keyof typeof dbStats.by_status]++;
      }

      // Count as stripe ONLY if it looks like a Phototheology recurring subscription.
      // (Avoid counting unrelated Stripe products or legacy bad sync rows.)
      const isStripeRecurring = sub.payment_source === 'stripe' && sub.stripe_subscription_id && sub.is_recurring;
      const isAppTier = typeof sub.subscription_tier === 'string' && appStripeTiers.has(sub.subscription_tier);
      const isActiveOrTrial = sub.subscription_status === 'active' || sub.subscription_status === 'trial';

      if (isStripeRecurring && isAppTier && isActiveOrTrial) {
        dbStats.by_payment_source.stripe++;
        dbStats.stripe_linked_count++;
      } else if (sub.payment_source === 'patreon') {
        dbStats.by_payment_source.patreon++;
      } else if (sub.payment_source === 'manual') {
        dbStats.by_payment_source.manual++;
      } else if (sub.payment_source === 'promotional') {
        dbStats.by_payment_source.promotional++;
      } else if (sub.payment_source === 'lifetime' || sub.has_lifetime_access) {
        dbStats.by_payment_source.lifetime++;
      }

      if (sub.has_lifetime_access) {
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

    // Recent signups from subscriptions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = subscriptions.filter((s: any) => new Date(s.created_at) > thirtyDaysAgo).length;

    // NOW GET REAL STRIPE DATA WITH PAGINATION
    let stripeStats = {
      active_subscriptions: 0,
      trialing_subscriptions: 0,
      canceled_subscriptions: 0,
      by_tier: { essential: 0, premium: 0, student: 0, church: 0, unknown: 0 },
      by_product: {} as Record<string, { active: number; trialing: number }>,
      active_mrr_cents: 0,      // MRR from active subscriptions only
      trialing_mrr_cents: 0,    // MRR from trialing subscriptions (card on file)
      total_mrr_cents: 0,       // Combined (active + trialing)
      error: null as string | null,
      unlinked_count: 0,
    };

    logStep("Stripe key check", { hasKey: !!stripeKey, keyPrefix: stripeKey?.substring(0, 10) });

    if (stripeKey) {
      try {
        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        logStep("Fetching Stripe subscriptions with pagination");

        // Product name cache to avoid repeated API calls
        const productCache = new Map<string, string>();

        // Get ALL active subscriptions with pagination
        const activeSubscriptions = await fetchAllStripeSubscriptions(stripe, 'active');
        stripeStats.active_subscriptions = activeSubscriptions.length;

        // Count by tier, by product name (from Stripe), and calculate MRR
        for (const sub of activeSubscriptions) {
          const priceId = sub.items.data[0]?.price?.id;
          const priceObj = sub.items.data[0]?.price;
          const productId = priceObj?.product;

          // Get product name - use cache or fetch from Stripe
          let productName = 'Unknown';
          if (productId) {
            productName = await getProductName(stripe, productId, productCache);
          } else if (priceToInfo[priceId]) {
            productName = priceToInfo[priceId].name;
          }

          // Get tier from our mapping
          const tierInfo = priceToTierMap[priceId];
          const tier = tierInfo?.tier || 'unknown';

          if (tier in stripeStats.by_tier) {
            stripeStats.by_tier[tier as keyof typeof stripeStats.by_tier]++;
          }

          // Track by product name (from Stripe)
          if (!stripeStats.by_product[productName]) {
            stripeStats.by_product[productName] = { active: 0, trialing: 0 };
          }
          stripeStats.by_product[productName].active++;

          // Calculate MRR from Stripe's unit_amount (active subs)
          const amount = priceObj?.unit_amount || 0;
          const interval = priceObj?.recurring?.interval;
          const monthlyAmount = interval === 'year' ? Math.round(amount / 12) : amount;

          stripeStats.active_mrr_cents += monthlyAmount;
          stripeStats.total_mrr_cents += monthlyAmount;
        }

        // Get ALL trialing subscriptions with pagination
        const trialingSubscriptions = await fetchAllStripeSubscriptions(stripe, 'trialing');
        stripeStats.trialing_subscriptions = trialingSubscriptions.length;
        
        // Count trialing by product name AND include in MRR (card verified, will convert)
        for (const sub of trialingSubscriptions) {
          const priceId = sub.items.data[0]?.price?.id;
          const priceObj = sub.items.data[0]?.price;
          const productId = priceObj?.product;

          // Get product name - use cache or fetch from Stripe
          let productName = 'Unknown';
          if (productId) {
            productName = await getProductName(stripe, productId, productCache);
          } else if (priceToInfo[priceId]) {
            productName = priceToInfo[priceId].name;
          }

          if (!stripeStats.by_product[productName]) {
            stripeStats.by_product[productName] = { active: 0, trialing: 0 };
          }
          stripeStats.by_product[productName].trialing++;

          // Calculate trialing MRR (cards on file, will convert after 7 days)
          const amount = priceObj?.unit_amount || 0;
          const interval = priceObj?.recurring?.interval;
          const monthlyAmount = interval === 'year' ? Math.round(amount / 12) : amount;

          stripeStats.trialing_mrr_cents += monthlyAmount;
          stripeStats.total_mrr_cents += monthlyAmount;
        }

        // Get canceled subscriptions with pagination
        const canceledSubscriptions = await fetchAllStripeSubscriptions(stripe, 'canceled');
        stripeStats.canceled_subscriptions = canceledSubscriptions.length;

        // Calculate unlinked: Stripe active/trialing - DB linked
        const totalStripeActive = stripeStats.active_subscriptions + stripeStats.trialing_subscriptions;
        stripeStats.unlinked_count = Math.max(0, totalStripeActive - dbStats.stripe_linked_count);

        logStep("Stripe stats fetched with pagination", stripeStats);

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
      // Current MRR - from active paying subscriptions only
      current_mrr: `$${(stripeStats.active_mrr_cents / 100).toFixed(2)}`,
      current_mrr_cents: stripeStats.active_mrr_cents,
      // Projected MRR - includes trialing users with cards on file
      projected_mrr: `$${(stripeStats.total_mrr_cents / 100).toFixed(2)}`,
      projected_mrr_cents: stripeStats.total_mrr_cents,
      // Trialing MRR - amount from users in trial period
      trialing_mrr: `$${(stripeStats.trialing_mrr_cents / 100).toFixed(2)}`,
      trialing_mrr_cents: stripeStats.trialing_mrr_cents,
      // Legacy field for backward compatibility
      monthly_recurring_revenue: `$${(stripeStats.active_mrr_cents / 100).toFixed(2)}`,
      stripe_unlinked_subscriptions: stripeStats.unlinked_count,
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
        debug: {
          hasStripeKey: !!stripeKey,
          stripeKeyPrefix: stripeKey ? stripeKey.substring(0, 7) + '...' : 'NOT SET',
          stripeError: stripeStats.error,
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
