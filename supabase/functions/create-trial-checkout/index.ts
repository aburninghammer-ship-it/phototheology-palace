import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRIAL-CHECKOUT] ${step}${detailsStr}`);
};

// Price IDs for trial subscriptions - UPDATED with correct Stripe prices
const PLAN_PRICES = {
  essential_monthly: "price_1SZNyCFGDAd3RU8IPwPJVesp", // Essential $9/month
  essential_annual: "price_1SZNyVFGDAd3RU8IPgRPqKXH",  // Essential $90/year
  premium_monthly: "price_1SZNyiFGDAd3RU8I4JHYEsEi",   // Premium $15/month
  premium_annual: "price_1SZNyuFGDAd3RU8IjeGIvPEb",    // Premium $150/year
};

// Price amounts in cents
const PLAN_AMOUNTS: Record<string, number> = {
  essential_monthly: 900,
  essential_annual: 9000,
  premium_monthly: 1500,
  premium_annual: 15000,
};

// Map plan to tier for profile update
const PLAN_TIERS = {
  essential_monthly: "essential",
  essential_annual: "essential",
  premium_monthly: "premium",
  premium_annual: "premium",
};

// Send notification email directly
async function sendTrialNotification(
  userEmail: string,
  userName: string,
  amount: number,
  tier: string,
  billing: string,
  stripeCustomerId?: string,
) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    logStep("RESEND_API_KEY not set, skipping notification");
    return;
  }

  try {
    const resend = new Resend(resendKey);
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);

    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
    const billingLabel = billing === 'annual' ? 'year' : 'month';

    const purchaseTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    const formattedTrialEnd = trialEndDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const stripeCustomerLink = stripeCustomerId 
      ? `https://dashboard.stripe.com/customers/${stripeCustomerId}`
      : null;

    await resend.emails.send({
      from: "Phototheology Notifications <noreply@thephototheologyapp.com>",
      to: ["aburninghammer@gmail.com"],
      subject: `🆓 New Trial Started: ${userName || userEmail} → ${tierLabel} (${formattedAmount}/${billingLabel} after trial)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5d742; margin: 0; font-size: 24px;">
              🆓 New Trial Started!
            </h1>
            <p style="color: #adb5bd; margin: 8px 0 0 0; font-size: 14px;">
              Someone started a 7-day free trial
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Customer</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${userName || 'Not provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Email</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  <a href="mailto:${userEmail}" style="color: #007bff;">${userEmail}</a>
                </td>
              </tr>
              <tr style="background: #fff3e0;">
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #ef6c00;">⏳ Trial Status</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right; color: #ef6c00;">
                  7-Day Free Trial (ends ${formattedTrialEnd})
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Plan After Trial</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${tierLabel} (${billing === 'annual' ? 'Annual' : 'Monthly'}) - ${formattedAmount}/${billingLabel}
                </td>
              </tr>
            </table>
            
            ${stripeCustomerLink ? `
            <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #dee2e6;">
              <strong style="color: #6c757d; font-size: 12px; text-transform: uppercase;">Stripe Dashboard</strong>
              <div style="margin-top: 8px;">
                <a href="${stripeCustomerLink}" style="color: #007bff;">View Customer →</a>
              </div>
            </div>
            ` : ''}
          </div>
          
          <div style="background: #212529; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #adb5bd; margin: 0; font-size: 12px;">
              Trial started at: ${purchaseTime}
            </p>
          </div>
        </div>
      `,
    });

    logStep("Trial notification email sent successfully");
  } catch (error) {
    logStep("Failed to send notification email", { error: String(error) });
  }
}

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
    const tier = PLAN_TIERS[planKey];
    const amount = PLAN_AMOUNTS[planKey] || 0;
    
    if (!priceId) {
      throw new Error(`Invalid plan configuration: ${planKey}. Available: ${Object.keys(PLAN_PRICES).join(', ')}`);
    }

    logStep("Plan selected", { plan, billing, planKey, priceId, tier, amount });

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
        trial_period_days: 7, // 7-day full access trial
        metadata: {
          user_id: user.id,
          plan: plan,
          billing: billing,
          tier: tier,
        },
      },
      success_url: `${origin}/gatehouse?trial=success`,
      cancel_url: `${origin}/auth?trial=cancelled`,
      metadata: {
        user_id: user.id,
        plan: plan,
        billing: billing,
        tier: tier,
        is_trial: "true",
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url, priceId, tier });
    // NOTE: Notification is NOT sent here - it's sent by stripe-webhook after payment success

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