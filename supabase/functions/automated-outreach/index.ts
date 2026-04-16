import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTOMATED-OUTREACH] ${step}${detailsStr}`);
};

// Email templates
const getPatreonOutreachEmail = (name: string | null) => ({
  subject: "🏛️ Your Phototheology App Access is Waiting!",
  html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .feature { background: #f8f5ff; padding: 12px 16px; border-radius: 6px; margin: 8px 0; border-left: 4px solid #8B5CF6; }
  </style>
</head>
<body>
  <h2>Hey ${escapeHtml(name || 'there')}, Your Premium Access Awaits!</h2>
  <p>As a Phototheology Patreon supporter, you have <strong>FREE premium access</strong> to the Phototheology App — but you haven't claimed it yet!</p>
  <p><strong>Here's what you're missing:</strong></p>
  <div class="feature">🤖 <strong>Jeeves AI</strong> — Your personal Bible study companion</div>
  <div class="feature">🏛️ <strong>The Palace Method</strong> — Revolutionary Scripture memorization</div>
  <div class="feature">📖 <strong>Living Manna</strong> — Daily guided devotionals</div>
  <div class="feature">🎮 <strong>Bible Games</strong> — Fun ways to learn and retain</div>
  <div class="feature">💎 <strong>Gem Collection</strong> — Save and organize insights</div>
  <p style="margin: 24px 0;">
    <a href="https://phototheologybible.com/auth" class="cta">Claim Your Free Access →</a>
  </p>
  <p><strong>How to activate:</strong></p>
  <ol>
    <li>Click the button above</li>
    <li>Sign up with the <strong>same email</strong> you use on Patreon</li>
    <li>Your premium access activates automatically!</li>
  </ol>
  <p>Questions? Just reply to this email.</p>
  <p style="color: #666;">— Ivor &amp; The Phototheology Team</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #999;">You're receiving this because you're a Patreon supporter. <a href="https://phototheologybible.com/unsubscribe">Unsubscribe</a></p>
</body>
</html>
  `
});

const getTeachableOutreachEmail = (name: string | null, courseName: string | null) => ({
  subject: "📚 Continue Your Phototheology Journey in the App!",
  html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .feature { background: #f8f5ff; padding: 12px 16px; border-radius: 6px; margin: 8px 0; border-left: 4px solid #8B5CF6; }
  </style>
</head>
<body>
  <h2>Hey ${escapeHtml(name || 'there')}!</h2>
  ${courseName ? `<p>You enrolled in <strong>"${escapeHtml(courseName)}"</strong> — great choice!</p>` : ''}
  <p>Did you know there's a <strong>companion app</strong> that takes your Phototheology learning to the next level?</p>
  <p><strong>The Phototheology App includes:</strong></p>
  <div class="feature">🤖 <strong>Jeeves AI</strong> — Ask any Bible question, get deep answers</div>
  <div class="feature">🏛️ <strong>Interactive Palace</strong> — Practice what you learned in the course</div>
  <div class="feature">📖 <strong>Study Tools</strong> — Bible reader with Palace lens</div>
  <div class="feature">🎯 <strong>Daily Challenges</strong> — Keep your skills sharp</div>
  <p style="margin: 24px 0;">
    <a href="https://phototheologybible.com/auth" class="cta">Try the App Free →</a>
  </p>
  <p>As a Teachable student, you get special access to features that complement your course!</p>
  <p style="color: #666;">— Ivor &amp; The Phototheology Team</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #999;">You're receiving this because you enrolled in a Phototheology course. <a href="https://phototheologybible.com/unsubscribe">Unsubscribe</a></p>
</body>
</html>
  `
});

const getPickaxeOutreachEmail = (name: string | null, isPaid: boolean) => ({
  subject: isPaid
    ? "🎉 Your Premium Phototheology App Access is Ready!"
    : "🏛️ Discover the Complete Phototheology App",
  html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .feature { background: #f8f5ff; padding: 12px 16px; border-radius: 6px; margin: 8px 0; border-left: 4px solid #8B5CF6; }
  </style>
</head>
<body>
  <h2>Hey ${escapeHtml(name || 'there')}!</h2>
  <p>The Phototheology App has powerful tools to help you master Scripture:</p>
  <div class="feature">📖 <strong>Interactive Bible Reader</strong> with Palace lens</div>
  <div class="feature">🤖 <strong>Jeeves AI</strong> — Your personal study companion</div>
  <div class="feature">🎯 <strong>Daily Challenges</strong> to sharpen your skills</div>
  <div class="feature">💎 <strong>Gem Collection</strong> — Save your insights</div>
  <p style="text-align: center; margin: 32px 0;">
    <a href="https://phototheologybible.com/auth" class="cta">Try the App Free →</a>
  </p>
  <p style="color: #666;">— The Phototheology Team</p>
</body>
</html>
  `
});

// HTML escape helper to prevent injection
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== MANDATORY AUTH + ADMIN CHECK =====
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // ===== END AUTH CHECK =====

    logStep("Starting automated outreach");

    // Get all app users' emails for comparison
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers({ perPage: 10000 });
    if (listError) throw listError;

    const appUserEmails = new Set(
      authUsers.users?.map(u => u.email?.toLowerCase()).filter(Boolean) || []
    );
    logStep("App users fetched", { count: appUserEmails.size });

    const results = {
      patreon: { sent: 0, skipped: 0, errors: 0 },
      teachable: { sent: 0, skipped: 0, errors: 0 },
      pickaxe: { sent: 0, skipped: 0, errors: 0 },
    };

    // 1. PATREON OUTREACH
    logStep("Processing Patreon members");
    const { data: patreonMembers } = await supabase
      .from("patreon_members")
      .select("email, full_name, patron_status")
      .not("email", "is", null);

    for (const member of patreonMembers || []) {
      if (!member.email) continue;
      const emailLower = member.email.toLowerCase();
      if (appUserEmails.has(emailLower)) { results.patreon.skipped++; continue; }
      const { data: recentEmail } = await supabase
        .from("email_campaign_logs").select("id")
        .eq("recipient_email", emailLower).eq("campaign_name", "automated_patreon_outreach")
        .gte("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).maybeSingle();
      if (recentEmail) { results.patreon.skipped++; continue; }
      try {
        const emailContent = getPatreonOutreachEmail(member.full_name);
        await resend.emails.send({ from: "Phototheology <ivor@thephototheologyapp.com>", to: [member.email], subject: emailContent.subject, html: emailContent.html });
        await supabase.from("email_campaign_logs").insert({ campaign_name: "automated_patreon_outreach", recipient_email: emailLower, recipient_name: member.full_name, email_type: "patreon_outreach", status: "sent", sent_at: new Date().toISOString() });
        results.patreon.sent++;
      } catch (err) { logStep("Patreon email error", { error: err }); results.patreon.errors++; }
    }

    // 2. TEACHABLE OUTREACH
    logStep("Processing Teachable students");
    const { data: teachableStudents } = await supabase
      .from("teachable_students").select("email, name, course_name").not("email", "is", null);
    for (const student of teachableStudents || []) {
      if (!student.email) continue;
      const emailLower = student.email.toLowerCase();
      if (appUserEmails.has(emailLower)) { results.teachable.skipped++; continue; }
      const { data: recentEmail } = await supabase
        .from("email_campaign_logs").select("id")
        .eq("recipient_email", emailLower).eq("campaign_name", "automated_teachable_outreach")
        .gte("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).maybeSingle();
      if (recentEmail) { results.teachable.skipped++; continue; }
      try {
        const emailContent = getTeachableOutreachEmail(student.name, student.course_name);
        await resend.emails.send({ from: "Phototheology <ivor@thephototheologyapp.com>", to: [student.email], subject: emailContent.subject, html: emailContent.html });
        await supabase.from("email_campaign_logs").insert({ campaign_name: "automated_teachable_outreach", recipient_email: emailLower, recipient_name: student.name, email_type: "teachable_outreach", status: "sent", sent_at: new Date().toISOString() });
        results.teachable.sent++;
      } catch (err) { logStep("Teachable email error", { error: err }); results.teachable.errors++; }
    }

    // 3. PICKAXE OUTREACH
    logStep("Processing Pickaxe users");
    const { data: pickaxeUsers } = await supabase
      .from("pickaxe_connections").select("pickaxe_email, pickaxe_name, subscription_type").not("pickaxe_email", "is", null);
    for (const pu of pickaxeUsers || []) {
      if (!pu.pickaxe_email) continue;
      const emailLower = pu.pickaxe_email.toLowerCase();
      if (appUserEmails.has(emailLower)) { results.pickaxe.skipped++; continue; }
      const { data: recentEmail } = await supabase
        .from("email_campaign_logs").select("id")
        .eq("recipient_email", emailLower).eq("campaign_name", "automated_pickaxe_outreach")
        .gte("sent_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).maybeSingle();
      if (recentEmail) { results.pickaxe.skipped++; continue; }
      try {
        const isPaid = pu.subscription_type === "paid";
        const emailContent = getPickaxeOutreachEmail(pu.pickaxe_name, isPaid);
        await resend.emails.send({ from: "Phototheology <ivor@thephototheologyapp.com>", to: [pu.pickaxe_email], subject: emailContent.subject, html: emailContent.html });
        await supabase.from("email_campaign_logs").insert({ campaign_name: "automated_pickaxe_outreach", recipient_email: emailLower, recipient_name: pu.pickaxe_name, email_type: isPaid ? "pickaxe_paid_outreach" : "pickaxe_free_outreach", status: "sent", sent_at: new Date().toISOString() });
        results.pickaxe.sent++;
      } catch (err) { logStep("Pickaxe email error", { error: err }); results.pickaxe.errors++; }
    }

    logStep("Outreach complete", results);
    return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
