import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIGNUP_URL = "https://phototheology-palace.lovable.app/auth";

const buildEmailHTML = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Come Back to the Palace</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ec;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:40px 40px 30px;text-align:center;">
              <div style="font-size:32px;margin-bottom:12px;">🏰</div>
              <h1 style="color:#d4af37;font-size:24px;margin:0 0 8px;font-weight:700;letter-spacing:0.5px;">
                The Palace Has Been Upgraded
              </h1>
              <p style="color:#c0c0c0;font-size:14px;margin:0;">
                Phototheology Palace • PhototheologyOS
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#2d2d2d;font-size:17px;line-height:1.7;margin:0 0 20px;">
                Dear ${name},
              </p>
              <p style="color:#2d2d2d;font-size:17px;line-height:1.7;margin:0 0 20px;">
                We noticed you created an account but never got the chance to fully explore what the Phototheology Palace has to offer. Since then, we've been building — and the Suite is better than ever.
              </p>
              <p style="color:#2d2d2d;font-size:17px;line-height:1.7;margin:0 0 20px;">
                We're so convinced it will transform how you study Scripture that we want you to <strong>try it for 7 days completely free — no credit card required.</strong>
              </p>

              <!-- What's New -->
              <div style="background-color:#f8f6f2;border-left:4px solid #d4af37;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0;">
                <p style="color:#1a1a2e;font-size:15px;font-weight:700;margin:0 0 12px;">What's waiting for you:</p>
                <ul style="color:#444;font-size:15px;line-height:1.8;margin:0;padding-left:20px;">
                  <li>Study Buddy AI — your personal Bible study companion</li>
                  <li>The 8-Floor Palace method — structured depth like nowhere else</li>
                  <li>Interactive challenges, drills, and memory tools</li>
                  <li>Church community features and collaborative study</li>
                  <li>New rooms, exercises, and content added regularly</li>
                </ul>
              </div>

              <p style="color:#2d2d2d;font-size:17px;line-height:1.7;margin:24px 0;">
                All you need to do is sign up again with this same email address. Your <strong>7 days of full premium access</strong> will activate automatically — no payment information needed.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${SIGNUP_URL}" 
                       style="display:inline-block;background:linear-gradient(135deg,#d4af37 0%,#b8962e 100%);color:#1a1a2e;font-size:17px;font-weight:700;padding:16px 48px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(212,175,55,0.3);">
                      Return to the Palace →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#666;font-size:14px;line-height:1.6;margin:0;text-align:center;font-style:italic;">
                "These are they which testify of me." — John 5:39
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f6f2;padding:24px 40px;text-align:center;border-top:1px solid #e8e4de;">
              <p style="color:#888;font-size:13px;margin:0 0 8px;">
                This is a one-time invitation from the Phototheology Palace team.
              </p>
              <p style="color:#aaa;font-size:12px;margin:0;">
                © 2026 Phototheology Palace. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseAdmin.auth.getUser(token);
    if (!userData?.user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (!isAdmin) throw new Error("Admin access required");

    // Get all abandoned users with emails
    const { data: users, error: usersError } = await supabaseAdmin
      .from("profiles")
      .select("email, display_name")
      .eq("payment_source", "manual")
      .in("subscription_tier", ["free"])
      .eq("has_lifetime_access", false)
      .not("email", "is", null);

    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No users to email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for email queue infrastructure
    const results: { email: string; status: string; error?: string }[] = [];

    for (const user of users) {
      if (!user.email) continue;

      const name = user.display_name?.split(" ")[0] || "Friend";

      try {
        // Try to enqueue via the email queue system
        const { error: rpcError } = await supabaseAdmin.rpc("enqueue_email", {
          p_queue_name: "transactional_emails",
          p_message: JSON.stringify({
            to: user.email,
            subject: "The Palace Has Been Upgraded — Try It Free for 7 Days",
            html: buildEmailHTML(name),
            template_name: "winback_7day",
            idempotency_key: `winback-7day-${user.email}`,
          }),
        });

        if (rpcError) {
          // Fallback: try direct send via Lovable email API
          const callbackUrl = Deno.env.get("LOVABLE_EMAIL_CALLBACK_URL");
          const apiKey = Deno.env.get("LOVABLE_API_KEY");
          
          if (callbackUrl && apiKey) {
            const emailRes = await fetch(callbackUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                to: user.email,
                subject: "The Palace Has Been Upgraded — Try It Free for 7 Days",
                html: buildEmailHTML(name),
              }),
            });

            if (!emailRes.ok) {
              throw new Error(`Email API error: ${emailRes.status}`);
            }
            results.push({ email: user.email, status: "sent_direct" });
          } else {
            results.push({ email: user.email, status: "queued_failed", error: rpcError.message });
          }
        } else {
          results.push({ email: user.email, status: "queued" });
        }
      } catch (err) {
        results.push({ 
          email: user.email, 
          status: "failed", 
          error: err instanceof Error ? err.message : String(err) 
        });
      }
    }

    const sent = results.filter(r => r.status === "queued" || r.status === "sent_direct").length;
    const failed = results.filter(r => r.status === "failed" || r.status === "queued_failed").length;

    return new Response(JSON.stringify({ 
      total: users.length, 
      sent, 
      failed,
      results 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[send-winback-email] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
