import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PickaxeUser {
  email: string;
  name: string | null;
  type: "member" | "paid";
}

const getPaidUserEmail = (name: string | null, appUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin-bottom: 10px;">🎉 Great News, ${name || 'Friend'}!</h1>
  </div>
  
  <p style="font-size: 16px;">Because you're a <strong>paid Phototheology subscriber</strong>, you now have <strong>automatic premium access</strong> to our brand new Phototheology App!</p>
  
  <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 12px; padding: 24px; margin: 24px 0; color: white;">
    <h2 style="margin: 0 0 12px 0; color: white;">What's Included:</h2>
    <ul style="margin: 0; padding-left: 20px;">
      <li>✨ Full AI-powered Bible study tools</li>
      <li>📖 Interactive Palace exploration</li>
      <li>🎯 Daily challenges & devotionals</li>
      <li>💎 Gem collection & study tracking</li>
      <li>🤖 Jeeves - Your AI study companion</li>
    </ul>
  </div>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="${appUrl}/auth" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">
      Access Your Premium Account →
    </a>
  </div>
  
  <p style="font-size: 14px; color: #666;">Simply sign up or log in with the same email address you used for your Pickaxe subscription (<strong>${name ? 'this email' : 'your email'}</strong>), and your premium access will be automatically activated!</p>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    Thank you for being part of the Phototheology community!<br>
    Questions? Reply to this email.
  </p>
</body>
</html>
`;

const getPromoEmail = (name: string | null, appUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin-bottom: 10px;">Hey ${name || 'Friend'}, We've Built Something Special! 🏛️</h1>
  </div>
  
  <p style="font-size: 16px;">Since you've tried our Phototheology tools, we wanted to let you know about our <strong>all-new Phototheology App</strong> — the complete Bible study platform!</p>
  
  <div style="background: #f8f5ff; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #e9d5ff;">
    <h2 style="color: #7c3aed; margin: 0 0 12px 0;">The Complete PhototheologyOS:</h2>
    <ul style="margin: 0; padding-left: 20px; color: #4a4a4a;">
      <li>📖 <strong>Interactive Bible Reader</strong> with Palace lens</li>
      <li>🤖 <strong>Jeeves AI</strong> - Your personal study companion</li>
      <li>🎯 <strong>Daily Challenges</strong> to sharpen your skills</li>
      <li>💎 <strong>Gem Collection</strong> - Save your insights</li>
      <li>📚 <strong>Devotional Plans</strong> generated just for you</li>
      <li>🏆 <strong>Progress Tracking</strong> & achievements</li>
    </ul>
  </div>
  
  <p style="font-size: 16px;">Try it free, or upgrade to Premium for unlimited access to all features!</p>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="${appUrl}/auth" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">
      Try the App Free →
    </a>
  </div>
  
  <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>🎁 Special Offer:</strong> Subscribe to any paid tier and get access to ALL Phototheology tools!
    </p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    Thank you for being part of the Phototheology community!<br>
    Questions? Reply to this email.
  </p>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { users, campaignName = "pickaxe_migration", appUrl, dryRun = false, fromEmail = "Phototheology <hello@phototheology.com>" } = await req.json() as { 
      users: PickaxeUser[];
      campaignName?: string;
      appUrl: string;
      dryRun?: boolean;
      fromEmail?: string;
    };
    
    if (!users || !Array.isArray(users)) {
      throw new Error("Invalid users data");
    }
    if (!appUrl) {
      throw new Error("appUrl is required");
    }

    console.log(`Starting email campaign: ${campaignName} for ${users.length} users (dryRun: ${dryRun})`);

    const results = {
      total: users.length,
      paidEmails: 0,
      promoEmails: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const user of users) {
      const isPaid = user.type === "paid";
      const emailType = isPaid ? "paid_access" : "subscription_promo";
      
      // Check if already sent
      const { data: existingLog } = await supabase
        .from("email_campaign_logs")
        .select("id")
        .eq("campaign_name", campaignName)
        .eq("recipient_email", user.email.toLowerCase())
        .eq("status", "sent")
        .maybeSingle();

      if (existingLog) {
        results.skipped++;
        console.log(`Skipping ${user.email} - already sent`);
        continue;
      }

      try {
        if (!dryRun) {
          const htmlContent = isPaid 
            ? getPaidUserEmail(user.name, appUrl)
            : getPromoEmail(user.name, appUrl);

          const subject = isPaid
            ? "🎉 Your Premium Phototheology App Access is Ready!"
            : "🏛️ Discover the Complete Phototheology App";

          const emailResponse = await resend.emails.send({
            from: fromEmail,
            to: [user.email],
            subject,
            html: htmlContent,
          });

          console.log(`Email sent to ${user.email}:`, emailResponse);

          // Log the sent email
          await supabase.from("email_campaign_logs").insert({
            campaign_name: campaignName,
            recipient_email: user.email.toLowerCase(),
            recipient_name: user.name,
            email_type: emailType,
            status: "sent",
            sent_at: new Date().toISOString(),
          });

          // Update pickaxe_connections with email sent timestamp
          await supabase
            .from("pickaxe_connections")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("pickaxe_email", user.email.toLowerCase());
        }

        if (isPaid) {
          results.paidEmails++;
        } else {
          results.promoEmails++;
        }
      } catch (emailError) {
        const errorMsg = emailError instanceof Error ? emailError.message : "Unknown error";
        results.errors.push(`Failed to email ${user.email}: ${errorMsg}`);
        
        // Log the failed attempt
        await supabase.from("email_campaign_logs").insert({
          campaign_name: campaignName,
          recipient_email: user.email.toLowerCase(),
          recipient_name: user.name,
          email_type: emailType,
          status: "failed",
          error_message: errorMsg,
        });
      }
    }

    console.log("Campaign results:", results);

    return new Response(JSON.stringify({ success: true, results, dryRun }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Email campaign error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
