import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  churchId: string;
  notificationType: "announcement" | "event" | "community_post";
  referenceId: string;
  title: string;
  message: string;
  authorName?: string;
  eventDate?: string;
  eventLocation?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Verify caller is admin of the church (or allow service-role calls)
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      if (userData?.user) {
        const { data: isAdmin } = await supabase.rpc("is_church_admin", {
          _user_id: userData.user.id,
          _church_id: (await req.clone().json()).churchId,
        });
        // Allow if admin or if called internally
      }
    }

    const body: NotificationRequest = await req.json();
    const { churchId, notificationType, referenceId, title, message, authorName, eventDate, eventLocation } = body;

    console.log(`[CHURCH-EMAIL] Sending ${notificationType} emails for church ${churchId}`);

    // Get church info
    const { data: church } = await supabase
      .from("churches")
      .select("name, logo_url")
      .eq("id", churchId)
      .single();

    if (!church) throw new Error("Church not found");

    // Get all members with their emails
    const { data: members, error: membersError } = await supabase
      .from("church_members")
      .select("user_id")
      .eq("church_id", churchId);

    if (membersError) throw membersError;
    if (!members || members.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "No members found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get emails from auth.users
    const userIds = members.map((m) => m.user_id);
    const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    const memberEmails = authUsers?.users
      ?.filter((u) => userIds.includes(u.id) && u.email)
      .map((u) => ({ userId: u.id, email: u.email! })) || [];

    console.log(`[CHURCH-EMAIL] Found ${memberEmails.length} members with emails`);

    // Check which have already been emailed for this reference
    const { data: alreadySent } = await supabase
      .from("church_email_log")
      .select("recipient_user_id")
      .eq("reference_id", referenceId)
      .eq("notification_type", notificationType);

    const alreadySentIds = new Set(alreadySent?.map((s) => s.recipient_user_id) || []);
    const toSend = memberEmails.filter((m) => !alreadySentIds.has(m.userId));

    console.log(`[CHURCH-EMAIL] ${toSend.length} new recipients (${alreadySentIds.size} already sent)`);

    if (toSend.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, message: "All members already notified" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build email content
    const typeLabel = notificationType === "announcement" ? "📢 Announcement" 
      : notificationType === "event" ? "📅 Event" 
      : "💬 Community Post";

    const eventDetails = notificationType === "event" && eventDate
      ? `<tr><td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">
          📅 <strong>Date:</strong> ${new Date(eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
          ${eventLocation ? `<br/>📍 <strong>Location:</strong> ${eventLocation}` : ""}
        </td></tr>` : "";

    const subject = `${church.name}: ${title}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-radius:16px;border:1px solid #334155;overflow:hidden;">
            <!-- Header -->
            <tr><td style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#f0fdfa;font-size:22px;font-weight:700;">${church.name}</h1>
              <p style="margin:8px 0 0;color:#99f6e4;font-size:13px;letter-spacing:1px;">${typeLabel}</p>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:32px;">
              <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 16px;">${title}</h2>
              ${authorName ? `<p style="color:#64748b;font-size:13px;margin:0 0 16px;">By ${authorName}</p>` : ""}
              <div style="color:#cbd5e1;font-size:15px;line-height:1.7;margin-bottom:16px;">${message}</div>
              ${eventDetails}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr><td align="center">
                  <a href="https://phototheologybible.com/church-hub" style="display:inline-block;background:linear-gradient(135deg,#0d9488,#0f766e);color:#f0fdfa;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
                    View in Church Hub →
                  </a>
                </td></tr>
              </table>
            </td></tr>
            <!-- Footer -->
            <tr><td style="padding:20px 32px;border-top:1px solid #1e293b;text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0;">Sent from ${church.name} via PhotoTheology Bible</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    // Send in batches of 10, 1.2s delay between sends
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < toSend.length; i++) {
      const recipient = toSend[i];
      try {
        if (i > 0) await new Promise((r) => setTimeout(r, 1200));

        await resend.emails.send({
          from: `${church.name} <support@thephototheologyapp.com>`,
          to: [recipient.email],
          subject,
          html: htmlContent,
        });

        // Log the send
        await supabase.from("church_email_log").insert({
          church_id: churchId,
          recipient_user_id: recipient.userId,
          recipient_email: recipient.email,
          notification_type: notificationType,
          reference_id: referenceId,
          subject,
        });

        totalSent++;
        console.log(`[CHURCH-EMAIL] Sent to ${recipient.email} (${i + 1}/${toSend.length})`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${recipient.email}: ${msg}`);
        console.error(`[CHURCH-EMAIL] Error sending to ${recipient.email}:`, msg);
      }
    }

    console.log(`[CHURCH-EMAIL] Complete: ${totalSent}/${toSend.length} sent`);

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, total: toSend.length, errors: errors.length > 0 ? errors : undefined }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CHURCH-EMAIL] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
