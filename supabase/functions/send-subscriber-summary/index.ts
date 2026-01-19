import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Fetching active subscribers...");

    // Get all active subscribers from user_subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("user_subscriptions")
      .select(`
        user_id,
        subscription_tier,
        subscription_status,
        stripe_customer_id,
        stripe_subscription_id,
        payment_source,
        created_at
      `)
      .eq("subscription_status", "active")
      .not("subscription_tier", "is", null)
      .order("created_at", { ascending: false });

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      throw subError;
    }

    console.log(`Found ${subscriptions?.length || 0} active subscribers`);

    // Get profile info for each subscriber
    const userIds = subscriptions?.map(s => s.user_id) || [];
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, username")
      .in("id", userIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
    }

    // Get emails from auth.users using admin API
    const subscriberDetails = [];
    for (const sub of subscriptions || []) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(sub.user_id);
      
      const profile = profiles?.find(p => p.id === sub.user_id);
      
      subscriberDetails.push({
        email: authUser?.user?.email || "Unknown",
        name: profile?.display_name || profile?.username || "Unknown",
        tier: sub.subscription_tier,
        paymentSource: sub.payment_source || "Unknown",
        stripeCustomerId: sub.stripe_customer_id,
        stripeSubscriptionId: sub.stripe_subscription_id,
        subscribedAt: sub.created_at,
      });
    }

    console.log(`Compiled details for ${subscriberDetails.length} subscribers`);

    // Group by tier
    const tierGroups: Record<string, typeof subscriberDetails> = {};
    for (const sub of subscriberDetails) {
      const tier = sub.tier || "unknown";
      if (!tierGroups[tier]) tierGroups[tier] = [];
      tierGroups[tier].push(sub);
    }

    // Build HTML table
    let tableRows = "";
    for (const sub of subscriberDetails) {
      const stripeLink = sub.stripeCustomerId 
        ? `<a href="https://dashboard.stripe.com/customers/${sub.stripeCustomerId}" style="color: #007bff;">View</a>`
        : "N/A";
      
      const tierEmoji = sub.tier === "premium" ? "👑" 
        : sub.tier === "essential" ? "⭐" 
        : sub.tier === "student" ? "🎓"
        : "💰";

      tableRows += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${sub.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><a href="mailto:${sub.email}" style="color: #007bff;">${sub.email}</a></td>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${tierEmoji} ${sub.tier}</td>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${sub.paymentSource}</td>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${stripeLink}</td>
          <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${new Date(sub.subscribedAt).toLocaleDateString()}</td>
        </tr>
      `;
    }

    // Count by tier
    const tierCounts = Object.entries(tierGroups).map(([tier, subs]) => 
      `${tier.charAt(0).toUpperCase() + tier.slice(1)}: ${subs.length}`
    ).join(" | ");

    const emailResponse = await resend.emails.send({
      from: "Phototheology Notifications <noreply@thephototheologyapp.com>",
      to: ["aburninghammer@gmail.com"],
      subject: `📊 Active Subscriber Summary: ${subscriberDetails.length} Total Subscribers`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5d742; margin: 0; font-size: 24px;">
              📊 Active Subscriber Summary
            </h1>
            <p style="color: #adb5bd; margin: 8px 0 0 0;">
              ${subscriberDetails.length} total active subscribers
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef;">
            <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <strong style="color: #2e7d32;">Breakdown:</strong> ${tierCounts}
            </div>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #212529; color: white;">
                  <th style="padding: 12px 8px; text-align: left;">Name</th>
                  <th style="padding: 12px 8px; text-align: left;">Email</th>
                  <th style="padding: 12px 8px; text-align: left;">Tier</th>
                  <th style="padding: 12px 8px; text-align: left;">Source</th>
                  <th style="padding: 12px 8px; text-align: left;">Stripe</th>
                  <th style="padding: 12px 8px; text-align: left;">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          
          <div style="background: #212529; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #adb5bd; margin: 0; font-size: 12px;">
              Generated at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Summary email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      subscriberCount: subscriberDetails.length,
      emailResponse 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending subscriber summary:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
