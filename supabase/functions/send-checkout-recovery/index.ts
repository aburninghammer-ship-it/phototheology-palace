import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ABANDONED-CHECKOUT-RECOVERY] ${step}${detailsStr}`);
};

// Price IDs matching create-trial-checkout
const PLAN_PRICES = {
  premium_monthly: "price_1SZNyiFGDAd3RU8I4JHYEsEi",
  premium_annual: "price_1SZNyuFGDAd3RU8IjeGIvPEb",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const resend = new Resend(resendKey);
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find users who:
    // 1. Have payment_source = 'manual' (no Stripe payment)
    // 2. Have subscription_tier = 'free' or null
    // 3. Created between 1-48 hours ago (gives time for checkout but before cleanup)
    // 4. Haven't been sent a recovery email already (tracked via metadata)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const { data: abandonedUsers, error: fetchError } = await supabase
      .from("profiles")
      .select("id, email, display_name, created_at, recovery_email_count")
      .eq("payment_source", "manual")
      .in("subscription_tier", ["free", "pending"])
      .eq("has_lifetime_access", false)
      .gte("created_at", fortyEightHoursAgo.toISOString())
      .lte("created_at", oneHourAgo.toISOString())
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    logStep("Found abandoned signups", { count: abandonedUsers?.length ?? 0 });

    let sentCount = 0;

    for (const user of abandonedUsers || []) {
      const hoursSinceSignup = (now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60);
      const emailsSent = user.recovery_email_count || 0;

      // Determine which email to send based on timing
      // Email 1: After 1 hour  
      // Email 2: After 12 hours
      // Email 3: After 24 hours (last chance before 48hr cleanup)
      let shouldSend = false;
      let emailType = "";

      if (emailsSent === 0 && hoursSinceSignup >= 1) {
        shouldSend = true;
        emailType = "gentle_reminder";
      } else if (emailsSent === 1 && hoursSinceSignup >= 12) {
        shouldSend = true;
        emailType = "value_showcase";
      } else if (emailsSent === 2 && hoursSinceSignup >= 24) {
        shouldSend = true;
        emailType = "last_chance";
      }

      if (!shouldSend || !user.email) continue;

      // Create a fresh checkout session for this user
      let checkoutUrl = "https://phototheologypalace.com/auth";
      try {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          customer_email: customerId ? undefined : user.email,
          payment_method_collection: "always",
          line_items: [{ price: PLAN_PRICES.premium_monthly, quantity: 1 }],
          mode: "subscription",
          subscription_data: {
            trial_period_days: 7,
            metadata: { user_id: user.id, plan: "premium", billing: "monthly", tier: "premium" },
          },
          success_url: "https://phototheologypalace.com/gatehouse?trial=success",
          cancel_url: "https://phototheologypalace.com/auth?trial=cancelled",
          metadata: { user_id: user.id, plan: "premium", billing: "monthly", tier: "premium", is_trial: "true" },
        });
        if (session.url) checkoutUrl = session.url;
      } catch (stripeErr) {
        logStep("Failed to create checkout for user, using fallback URL", { userId: user.id, error: String(stripeErr) });
      }

      const firstName = (user.display_name || "").split(" ")[0] || "Friend";
      const emailContent = getEmailContent(emailType, firstName, checkoutUrl);

      try {
        await resend.emails.send({
          from: "Phototheology Palace <noreply@thephototheologyapp.com>",
          to: [user.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        // Track that we sent a recovery email
        await supabase
          .from("profiles")
          .update({ recovery_email_count: emailsSent + 1, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        sentCount++;
        logStep(`Sent ${emailType} email`, { userId: user.id, email: user.email, emailNumber: emailsSent + 1 });
      } catch (emailErr) {
        logStep("Failed to send email", { userId: user.id, error: String(emailErr) });
      }
    }

    logStep("Recovery complete", { totalSent: sentCount });

    return new Response(JSON.stringify({ success: true, emailsSent: sentCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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

function getEmailContent(type: string, firstName: string, checkoutUrl: string) {
  const baseStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;`;
  const buttonStyle = `display: inline-block; padding: 14px 32px; background: #9b87f5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;`;

  if (type === "gentle_reminder") {
    return {
      subject: `${firstName}, your Palace awaits 🏰`,
      html: `
        <div style="${baseStyle}">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #f5d742; margin: 0; font-size: 28px;">🏰 Your Palace is Ready</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">Hey ${firstName},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Looks like you started setting up your Phototheology Palace but didn't finish the last step. 
              No worries — your account is saved and ready.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Just add your card to start a <strong>free 7-day trial</strong>. 
              You won't be charged until the trial ends, and you can cancel anytime.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${checkoutUrl}" style="${buttonStyle}">Complete My Free Trial →</a>
            </div>
            <p style="font-size: 14px; color: #888;">No charge during trial. Cancel anytime.</p>
          </div>
        </div>
      `,
    };
  }

  if (type === "value_showcase") {
    return {
      subject: `Here's what's inside the Palace, ${firstName} 👀`,
      html: `
        <div style="${baseStyle}">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #f5d742; margin: 0; font-size: 28px;">👀 A Peek Inside</h1>
          </div>
          <div style="padding: 32px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">Hey ${firstName},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Here's what members are exploring right now in the Palace:
            </p>
            <ul style="font-size: 15px; color: #333; line-height: 2;">
              <li>🧠 <strong>8 Floors</strong> of progressive Bible study methods</li>
              <li>🤖 <strong>Jeeves AI</strong> — your personal Bible study assistant</li>
              <li>📖 <strong>Interactive Bible Reader</strong> with commentary & audio</li>
              <li>🎮 <strong>Challenges & Games</strong> that train Scripture memory</li>
              <li>⛪ <strong>Church Community</strong> features for group study</li>
            </ul>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Your free trial gives you <strong>full access to everything</strong> for 7 days.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${checkoutUrl}" style="${buttonStyle}">Start Exploring Free →</a>
            </div>
          </div>
        </div>
      `,
    };
  }

  // last_chance
  return {
    subject: `⏰ Last chance, ${firstName} — your account expires soon`,
    html: `
      <div style="${baseStyle}">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ff6b6b; margin: 0; font-size: 28px;">⏰ Account Expiring Soon</h1>
        </div>
        <div style="padding: 32px; background: #ffffff;">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hey ${firstName},</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Your Phototheology account will be automatically removed in <strong>less than 24 hours</strong> 
            since signup wasn't completed.
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            If you still want to try the Palace, just complete your free trial setup — it only takes a minute, 
            and you won't be charged for 7 days.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${checkoutUrl}" style="${buttonStyle}">Save My Account →</a>
          </div>
          <p style="font-size: 13px; color: #999; text-align: center;">
            If you're not interested, no action needed — your data will be safely removed.
          </p>
        </div>
      </div>
    `,
  };
}
