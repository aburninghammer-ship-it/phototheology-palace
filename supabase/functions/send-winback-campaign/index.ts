import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Verify admin via user auth OR service_role key in Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const token = authHeader.replace("Bearer ", "");
    
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const isServiceRole = token === serviceRoleKey;
    
    if (!isServiceRole) {
      const { data: userData } = await supabase.auth.getUser(token);
      if (!userData?.user) throw new Error("Invalid auth");

      const { data: adminCheck } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!adminCheck) throw new Error("Admin access required");
    }
    
    console.log("[WinBack] Authenticated, isServiceRole:", isServiceRole);

    // Get unredeemed AND not-yet-emailed pre-approved emails
    const { data: recipients, error: fetchError } = await supabase
      .from("pre_approved_emails")
      .select("id, email, access_type")
      .is("redeemed_at", null)
      .is("winback_email_sent_at", null);

    if (fetchError) throw new Error(`Failed to fetch recipients: ${fetchError.message}`);
    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0, total: 0, message: "No new recipients to email (all have already been sent or redeemed)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: { email: string; success: boolean; error?: string }[] = [];
    const appUrl = "https://phototheology-palace.lovable.app";

    for (const recipient of recipients) {
      const isLifetime = recipient.access_type === "lifetime";
      const is7Day = recipient.access_type?.includes("7_days");
      
      let subjectLine: string;
      let accessDescription: string;
      let ctaText: string;

      if (isLifetime) {
        subjectLine = "Your Lifetime Access to Phototheology Palace is Waiting";
        accessDescription = "permanent lifetime access";
        ctaText = "Claim Your Lifetime Access";
      } else if (is7Day) {
        subjectLine = "Try Phototheology Palace Free for 7 Days — No Card Needed";
        accessDescription = "7 days of full premium access — no credit card required";
        ctaText = "Start Your Free 7 Days";
      } else {
        subjectLine = "Come Back to Phototheology Palace — Premium Access Awaits";
        accessDescription = "premium access";
        ctaText = "Claim Your Access";
      }

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f8f6f3; color: #2d2a26; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 32px; text-align: center; }
    .header h1 { color: #c9a84c; font-size: 28px; margin: 0 0 8px 0; font-weight: 700; letter-spacing: 0.5px; }
    .header p { color: #a0a0b0; font-size: 14px; margin: 0; letter-spacing: 1.5px; text-transform: uppercase; }
    .body-content { padding: 40px 32px; }
    .body-content h2 { font-size: 22px; color: #1a1a2e; margin: 0 0 16px 0; line-height: 1.3; }
    .body-content p { font-size: 16px; line-height: 1.7; color: #4a4744; margin: 0 0 20px 0; }
    .highlight-box { background: #fdf8ed; border-left: 4px solid #c9a84c; padding: 20px 24px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .highlight-box p { margin: 0; font-size: 15px; color: #5a5650; }
    .new-feature { background: #eef6ff; border: 2px solid #3b82f6; padding: 20px 24px; margin: 24px 0; border-radius: 8px; text-align: center; }
    .new-feature h3 { color: #1e40af; font-size: 18px; margin: 0 0 8px 0; }
    .new-feature p { margin: 0; font-size: 14px; color: #3b5998; }
    .cta-wrapper { text-align: center; margin: 32px 0; }
    .cta-btn { display: inline-block; background: #c9a84c; color: #1a1a2e; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; letter-spacing: 0.5px; }
    .features { margin: 28px 0; }
    .feature { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 15px; color: #4a4744; }
    .feature-icon { margin-right: 12px; font-size: 18px; flex-shrink: 0; }
    .footer { background: #f0ede8; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 13px; color: #8a8680; margin: 0 0 8px 0; }
    .footer a { color: #c9a84c; text-decoration: none; }
  </style>
</head>
<body>
  <div style="padding: 24px 16px; background: #f8f6f3;">
    <div class="container">
      <div class="header">
        <h1>Phototheology Palace</h1>
        <p>See Christ in Every Chapter</p>
      </div>
      <div class="body-content">
        <h2>We saved your spot.</h2>
        <p>You started a journey into Phototheology — a method that transforms Bible study from passive reading into an immersive, Christ-centered experience. We'd love you to come back.</p>
        
        <div class="highlight-box">
          <p><strong>Your offer:</strong> ${accessDescription}. Just sign up with this email address and your access activates automatically.</p>
        </div>

        <div class="new-feature">
          <h3>🆕 New Feature: Test Me — PT Diagnostic Assessment</h3>
          <p>Discover your Phototheology strengths and blind spots with our AI-powered diagnostic. Get a personalized 7-day growth plan tailored to your palace mastery level.</p>
        </div>

        <p>Here's what's waiting for you inside the Palace:</p>
        
        <div class="features">
          <div class="feature"><span class="feature-icon">🏛️</span> <span>8 floors of structured Bible study — from memory to mastery</span></div>
          <div class="feature"><span class="feature-icon">🔍</span> <span>Detective-style investigation rooms that sharpen your eye</span></div>
          <div class="feature"><span class="feature-icon">🎤</span> <span>Freestyle training — see Scripture in nature, life, and history</span></div>
          <div class="feature"><span class="feature-icon">✝️</span> <span>Christ in Every Chapter — trace Jesus through all 66 books</span></div>
          <div class="feature"><span class="feature-icon">📝</span> <span><strong>NEW:</strong> Test Me diagnostic — AI-graded assessments with growth plans</span></div>
          <div class="feature"><span class="feature-icon">🎮</span> <span>Games, drills, and challenges that make Scripture stick</span></div>
          <div class="feature"><span class="feature-icon">⛪</span> <span>Church communities, live study groups, and prayer teams</span></div>
        </div>

        <div class="cta-wrapper">
          <a href="${appUrl}/auth" class="cta-btn">${ctaText}</a>
        </div>
        
        <p style="font-size: 14px; color: #8a8680; text-align: center;">Just sign up with <strong>${recipient.email}</strong> and your access activates instantly.</p>
      </div>
      <div class="footer">
        <p>Phototheology Palace — Where Scripture becomes a living palace of meaning.</p>
        <p style="font-size: 11px; margin-top: 12px;">If you no longer wish to receive emails, simply ignore this message.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

      try {
        await resend.emails.send({
          from: "Phototheology Palace <hello@notify.phototheologybible.com>",
          to: [recipient.email],
          subject: subjectLine,
          html: emailHtml,
        });
        results.push({ email: recipient.email, success: true });

        // Mark as sent so we don't email them again
        await supabase
          .from("pre_approved_emails")
          .update({ winback_email_sent_at: new Date().toISOString() })
          .eq("id", recipient.id);
      } catch (sendErr: unknown) {
        const errMsg = sendErr instanceof Error ? sendErr.message : "Unknown error";
        results.push({ email: recipient.email, success: false, error: errMsg });
      }

      // Rate limit: 100ms between sends
      await new Promise((r) => setTimeout(r, 100));
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: recipients.length, details: results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[WinBack] Error:", errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
