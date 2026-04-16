import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-SUBSCRIPTIONS] ${step}${detailsStr}`);
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

const appPriceIds = new Set(Object.keys(priceToTier));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get the authorization header
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
      logStep("Authentication error", { error: authError });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user has admin role OR is in admin_users table
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
      logStep("Admin role check failed");
      return new Response(JSON.stringify({ error: "Forbidden: Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Admin user verified", { email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    logStep("Starting Stripe-first subscription sync...");

    // STRIPE-FIRST APPROACH: Fetch ALL active/trialing subscriptions from Stripe with pagination
    const allStripeSubscriptions: Stripe.Subscription[] = [];
    let hasMore = true;
    let startingAfter: string | undefined;

    // Fetch active subscriptions with pagination
    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: "active",
        limit: 100,
        expand: ['data.customer', 'data.items.data.price'],
      };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.subscriptions.list(params);
      
      // Filter to only our app's subscriptions
      const appSubs = batch.data.filter((sub: any) => {
        const items = sub?.items?.data || [];
        return items.some((item: any) => {
          const priceId = item?.price?.id;
          return typeof priceId === 'string' && appPriceIds.has(priceId);
        });
      });
      
      allStripeSubscriptions.push(...appSubs);
      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      }
    }

    // Fetch trialing subscriptions with pagination
    hasMore = true;
    startingAfter = undefined;
    while (hasMore) {
      const params: Stripe.SubscriptionListParams = {
        status: "trialing",
        limit: 100,
        expand: ['data.customer', 'data.items.data.price'],
      };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.subscriptions.list(params);
      
      // Filter to only our app's subscriptions
      const appSubs = batch.data.filter((sub: any) => {
        const items = sub?.items?.data || [];
        return items.some((item: any) => {
          const priceId = item?.price?.id;
          return typeof priceId === 'string' && appPriceIds.has(priceId);
        });
      });
      
      allStripeSubscriptions.push(...appSubs);
      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      }
    }

    logStep(`Fetched ${allStripeSubscriptions.length} active/trialing Stripe subscriptions`);

    // Get all auth users to match by email
    const { data: authData, error: listError } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });

    if (listError) {
      logStep("Error listing users", { error: listError });
      throw new Error("Failed to list users: " + listError.message);
    }

    const users = authData?.users || [];
    const usersByEmail = new Map<string, { id: string; email: string }>();
    users.forEach(u => {
      if (u.email) {
        usersByEmail.set(u.email.toLowerCase(), { id: u.id, email: u.email });
      }
    });

    logStep(`Loaded ${users.length} app users for email matching`);

    // Get existing subscriptions from DB
    const { data: existingSubs } = await supabase
      .from("user_subscriptions")
      .select("user_id, stripe_subscription_id, subscription_status, payment_source, is_recurring");

    const existingSubsByUserId = new Map<string, any>();
    existingSubs?.forEach(sub => {
      existingSubsByUserId.set(sub.user_id, sub);
    });

    const results: any[] = [];
    const unmatchedStripeSubscriptions: any[] = [];

    // Process each Stripe subscription
    for (const sub of allStripeSubscriptions) {
      try {
        const customer = sub.customer as Stripe.Customer;
        const customerEmail = customer.email?.toLowerCase();

        if (!customerEmail) {
          unmatchedStripeSubscriptions.push({
            subscription_id: sub.id,
            customer_id: customer.id,
            reason: "no_customer_email",
          });
          continue;
        }

        const matchedUser = usersByEmail.get(customerEmail);
        
        if (!matchedUser) {
          unmatchedStripeSubscriptions.push({
            subscription_id: sub.id,
            customer_id: customer.id,
            customer_email: customerEmail,
            reason: "no_matching_app_user",
          });
          continue;
        }

        // Check if already fully synced
        const existingSub = existingSubsByUserId.get(matchedUser.id);
        if (existingSub?.stripe_subscription_id === sub.id && 
            existingSub?.payment_source === "stripe" &&
            existingSub?.is_recurring === true &&
            (existingSub?.subscription_status === "active" || existingSub?.subscription_status === "trial")) {
          results.push({
            email: matchedUser.email,
            status: "already_synced",
            current_status: existingSub.subscription_status,
          });
          continue;
        }

        // Determine tier from price
        const priceId = (sub.items.data || [])
          .map((item: any) => item?.price?.id)
          .find((id: any) => typeof id === 'string' && appPriceIds.has(id));

        if (!priceId) {
          // Shouldn't happen due to earlier filtering, but keep safe.
          logStep("Skipping subscription without Phototheology price", { subscriptionId: sub.id });
          continue;
        }

        const tier = priceToTier[priceId];
        if (!tier) {
          logStep("Skipping subscription with unmapped Phototheology price", { subscriptionId: sub.id, priceId });
          continue;
        }
        const isTrialing = sub.status === "trialing";

        // Safely create renewal date
        let renewalDateStr: string | null = null;
        const periodEnd = sub.current_period_end;
        if (periodEnd && typeof periodEnd === 'number' && periodEnd > 0) {
          try {
            const renewalDate = new Date(periodEnd * 1000);
            if (!isNaN(renewalDate.getTime())) {
              renewalDateStr = renewalDate.toISOString();
            }
          } catch (e) {
            logStep("Invalid current_period_end", { email: matchedUser.email, value: periodEnd });
          }
        }

        // Safely create trial end date
        let trialEndStr: string | null = null;
        const trialEndVal = sub.trial_end;
        if (trialEndVal && typeof trialEndVal === 'number' && trialEndVal > 0) {
          try {
            const trialEnd = new Date(trialEndVal * 1000);
            if (!isNaN(trialEnd.getTime())) {
              trialEndStr = trialEnd.toISOString();
            }
          } catch (e) {
            logStep("Invalid trial_end", { email: matchedUser.email, value: trialEndVal });
          }
        }

        // Upsert to user_subscriptions table
        const updateData: Record<string, any> = {
          user_id: matchedUser.id,
          subscription_status: isTrialing ? "trial" : "active",
          subscription_tier: tier,
          stripe_customer_id: customer.id,
          stripe_subscription_id: sub.id,
          payment_source: "stripe",
          is_recurring: true,
        };

        if (renewalDateStr) {
          updateData.subscription_renewal_date = renewalDateStr;
        }

        if (trialEndStr) {
          updateData.trial_ends_at = trialEndStr;
        }

        const { error: upsertError } = await supabase
          .from("user_subscriptions")
          .upsert(updateData, { onConflict: 'user_id' });

        if (upsertError) {
          results.push({
            email: matchedUser.email,
            status: "error",
            error: upsertError.message,
          });
          logStep(`Error updating ${matchedUser.email}`, { error: upsertError });
        } else {
          results.push({
            email: matchedUser.email,
            status: "updated",
            tier,
            subscription_status: isTrialing ? "trial" : "active",
            previous_status: existingSub?.subscription_status || "none",
          });
          logStep(`Updated ${matchedUser.email}: ${tier} (${isTrialing ? "trial" : "active"})`);
        }
      } catch (subError) {
        const errorMsg = subError instanceof Error ? subError.message : String(subError);
        logStep(`Error processing subscription ${sub.id}`, { error: errorMsg });
        results.push({
          subscription_id: sub.id,
          status: "error",
          error: errorMsg,
        });
      }
    }

    const summary = {
      total_stripe_subscriptions: allStripeSubscriptions.length,
      updated: results.filter(r => r.status === "updated").length,
      already_synced: results.filter(r => r.status === "already_synced").length,
      errors: results.filter(r => r.status === "error").length,
      unmatched_stripe_subscriptions: unmatchedStripeSubscriptions.length,
    };

    logStep("Sync completed", summary);

    return new Response(JSON.stringify({ 
      success: true,
      summary, 
      updated_users: results.filter(r => r.status === "updated"),
      errors: results.filter(r => r.status === "error"),
      unmatched_subscriptions: unmatchedStripeSubscriptions,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Sync error", { error: error instanceof Error ? error.message : "Unknown" });
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
