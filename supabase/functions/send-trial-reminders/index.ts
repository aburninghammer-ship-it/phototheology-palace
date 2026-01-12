import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import Stripe from "https://esm.sh/stripe@18.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-08-27.basil',
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[TRIAL-REMINDERS] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Calculate target dates for reminders
    const day7Target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const day2Target = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const day0Target = today;

    logStep("Checking for trials expiring on dates", { day7Target, day2Target, day0Target });

    // Get trials expiring in 7 days (Day 7 reminder - halfway through)
    // IMPORTANT: Also check that user doesn't have an active paid subscription
    // This prevents sending trial reminders to users who have already converted
    const { data: day7Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day7Target}T00:00:00`)
      .lt('trial_ends_at', `${day7Target}T23:59:59`);

    // Get trials expiring in 2 days (Day 12 reminder - urgent)
    const { data: day2Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day2Target}T00:00:00`)
      .lt('trial_ends_at', `${day2Target}T23:59:59`);

    // Get trials expiring today (Day 14 reminder - last chance)
    const { data: day0Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day0Target}T00:00:00`)
      .lt('trial_ends_at', `${day0Target}T23:59:59`);

    const allTrials = [
      ...(day7Trials || []).map(t => ({ ...t, reminderType: 'day7' })),
      ...(day2Trials || []).map(t => ({ ...t, reminderType: 'day2' })),
      ...(day0Trials || []).map(t => ({ ...t, reminderType: 'day0' })),
    ];

    logStep("Found trials to remind", { 
      day7: day7Trials?.length || 0, 
      day2: day2Trials?.length || 0, 
      day0: day0Trials?.length || 0 
    });

    if (allTrials.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No reminders to send" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user emails from auth
    const userIds = allTrials.map(t => t.user_id);
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const userMap = new Map(users?.map(u => [u.id, u]) || []);

    // Get display names from profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds);
    const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

    let sentCount = 0;
    const errors: string[] = [];

    for (const trial of allTrials) {
      const user = userMap.get(trial.user_id);
      if (!user?.email) {
        logStep("No email for user", { userId: trial.user_id });
        continue;
      }

      // CRITICAL: Verify with Stripe that this user hasn't already paid
      // This catches cases where webhook failed to update database
      if (trial.stripe_subscription_id) {
        try {
          const subscription = await stripe.subscriptions.retrieve(trial.stripe_subscription_id);
          // If subscription is active (not trialing), skip sending reminder
          if (subscription.status === 'active') {
            logStep("Skipping user - Stripe shows active subscription (not trial)", {
              email: user.email,
              stripeStatus: subscription.status
            });

            // Also fix the database while we're at it
            await supabase
              .from('user_subscriptions')
              .update({ subscription_status: 'active' })
              .eq('user_id', trial.user_id);

            continue;
          }
        } catch (stripeError: any) {
          // If subscription not found, continue with email (user may have cancelled)
          logStep("Could not verify Stripe subscription", {
            subscriptionId: trial.stripe_subscription_id,
            error: stripeError.message
          });
        }
      }

      const displayName = profileMap.get(trial.user_id) || 'there';
      const expiryDate = new Date(trial.trial_ends_at).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });

      let subject: string;
      let heading: string;
      let message: string;
      let urgency: string;

      switch (trial.reminderType) {
        case 'day7':
          subject = "⏳ Your Phototheology trial is halfway through!";
          heading = "You're halfway through your trial";
          message = "You've been exploring the Palace for a week now. Have you discovered the Concentration Room? Tried the 24FPS challenge? There's so much more waiting for you.";
          urgency = "";
          break;
        case 'day2':
          subject = "⚠️ Only 2 days left on your Phototheology trial!";
          heading = "Your trial ends in 2 days";
          message = "Don't lose access to Jeeves, the daily challenges, and all 8 floors of the Palace. Upgrade now to keep your progress and unlock premium features.";
          urgency = "🔥 Act now to lock in your access";
          break;
        case 'day0':
          subject = "🚨 Last chance! Your Phototheology trial ends today";
          heading = "Your trial ends TODAY";
          message = "This is your final reminder. After today, you'll lose access to premium features. Upgrade now to continue your journey through the Palace.";
          urgency = "⏰ Upgrade before midnight to keep your access";
          break;
        default:
          continue;
      }

      try {
        await resend.emails.send({
          from: "Phototheology <noreply@thephototheologyapp.com>",
          to: [user.email],
          subject,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #fafafa; padding: 40px 20px; margin: 0;">
              <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); border-radius: 16px; padding: 40px; border: 1px solid #333;">
                
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #c9a227; margin: 0; font-size: 28px;">${heading}</h1>
                </div>

                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
                  Hi ${displayName},
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #ccc; margin-bottom: 20px;">
                  ${message}
                </p>

                ${urgency ? `<p style="font-size: 16px; font-weight: bold; color: #f59e0b; margin-bottom: 20px;">${urgency}</p>` : ''}

                <p style="font-size: 14px; color: #888; margin-bottom: 30px;">
                  Your trial expires: <strong style="color: #fafafa;">${expiryDate}</strong>
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://phototheology.com/pricing" style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #a78520 100%); color: #0a0a0a; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    Upgrade Now →
                  </a>
                </div>

                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

                <p style="font-size: 14px; color: #666; text-align: center;">
                  Questions? Reply to this email or visit our <a href="https://phototheology.com/support" style="color: #c9a227;">support page</a>.
                </p>

              </div>
            </body>
            </html>
          `,
        });

        sentCount++;
        logStep("Email sent", { email: user.email, type: trial.reminderType });

        // Log the reminder to avoid duplicates (optional: create a table for this)
        await supabase.from('user_events').insert({
          user_id: trial.user_id,
          event_type: 'trial_reminder_sent',
          event_data: { reminder_type: trial.reminderType, sent_at: now.toISOString() }
        });

      } catch (emailError: any) {
        logStep("Failed to send email", { email: user.email, error: emailError.message });
        errors.push(`${user.email}: ${emailError.message}`);
      }
    }

    logStep("Completed", { sent: sentCount, errors: errors.length });

    return new Response(JSON.stringify({ 
      success: true, 
      sent: sentCount, 
      errors: errors.length > 0 ? errors : undefined 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    logStep("Error", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
