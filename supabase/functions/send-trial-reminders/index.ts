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

    // Calculate target dates for reminders (14-day trial)
    const day7Target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const day3Target = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const day0Target = today;

    logStep("Checking for trials expiring on dates", { day7Target, day3Target, day0Target });

    // First, get users who should be EXCLUDED from trial reminders:
    // 1. Users with lifetime access in profiles
    // 2. Users with active Patreon connections ($15+/month)
    // 3. Users with payment_source = 'patreon' and active status in profiles
    // 4. Users with active church membership (Living Manna, etc.)

    const { data: lifetimeUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('has_lifetime_access', true);
    const lifetimeUserIds = new Set((lifetimeUsers || []).map(u => u.id));
    logStep("Users with lifetime access", { count: lifetimeUserIds.size });

    const { data: patreonUsers } = await supabase
      .from('patreon_connections')
      .select('user_id')
      .eq('is_active_patron', true)
      .gte('entitled_cents', 1500); // $15/month minimum
    const patreonUserIds = new Set((patreonUsers || []).map(u => u.user_id));
    logStep("Users with active Patreon", { count: patreonUserIds.size });

    const { data: patreonProfileUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('payment_source', 'patreon')
      .eq('subscription_status', 'active');
    const patreonProfileUserIds = new Set((patreonProfileUsers || []).map(u => u.id));
    logStep("Users with Patreon in profile", { count: patreonProfileUserIds.size });

    // 4. Users with active church membership (Living Manna, etc.)
    const { data: churchMembers } = await supabase
      .from('church_members')
      .select('user_id, church_id')
      .in('church_id',
        (await supabase
          .from('churches')
          .select('id')
          .eq('subscription_status', 'active')
        ).data?.map(c => c.id) || []
      );
    const churchMemberUserIds = new Set((churchMembers || []).map(u => u.user_id));
    logStep("Users with church membership", { count: churchMemberUserIds.size });

    // Combine all excluded users
    const excludedUserIds = new Set([...lifetimeUserIds, ...patreonUserIds, ...patreonProfileUserIds, ...churchMemberUserIds]);
    logStep("Total excluded users", { count: excludedUserIds.size });

    // Get trials expiring in 7 days (Day 7 reminder - halfway through)
    const { data: day7Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day7Target}T00:00:00`)
      .lt('trial_ends_at', `${day7Target}T23:59:59`);

    // Get trials expiring in 3 days (Day 11 reminder - urgent)
    const { data: day3Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day3Target}T00:00:00`)
      .lt('trial_ends_at', `${day3Target}T23:59:59`);

    // Get trials expiring today (Day 14 reminder - last chance)
    const { data: day0Trials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, stripe_subscription_id')
      .eq('subscription_status', 'trial')
      .eq('has_lifetime_access', false)
      .gte('trial_ends_at', `${day0Target}T00:00:00`)
      .lt('trial_ends_at', `${day0Target}T23:59:59`);

    // Filter out excluded users (lifetime, Patreon, etc.)
    const allTrialsRaw = [
      ...(day7Trials || []).map(t => ({ ...t, reminderType: 'day7' })),
      ...(day3Trials || []).map(t => ({ ...t, reminderType: 'day3' })),
      ...(day0Trials || []).map(t => ({ ...t, reminderType: 'day0' })),
    ];

    const allTrials = allTrialsRaw.filter(t => !excludedUserIds.has(t.user_id));

    logStep("Found trials to remind", {
      day7Raw: day7Trials?.length || 0,
      day3Raw: day3Trials?.length || 0,
      day0Raw: day0Trials?.length || 0,
      totalRaw: allTrialsRaw.length,
      afterExclusions: allTrials.length,
      excluded: allTrialsRaw.length - allTrials.length
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
          heading = "You're halfway through your 14-day trial";
          message = "You've been exploring the Palace for a week now. Have you discovered the Concentration Room? Tried the 24FPS challenge? There's so much more waiting for you.";
          urgency = "";
          break;
        case 'day3':
          subject = "⚠️ Only 3 days left on your Phototheology trial!";
          heading = "Your trial ends in 3 days";
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
                  <a href="https://phototheologybible.com/pricing" style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #a78520 100%); color: #0a0a0a; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    Upgrade Now →
                  </a>
                </div>

                <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

                <p style="font-size: 14px; color: #666; text-align: center;">
                  Questions? Reply to this email or visit our <a href="https://phototheologybible.com/support" style="color: #c9a227;">support page</a>.
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
