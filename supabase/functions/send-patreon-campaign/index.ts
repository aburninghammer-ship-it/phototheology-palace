import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-PATREON-CAMPAIGN] ${step}${detailsStr}`);
};

interface CampaignRequest {
  subject: string;
  htmlContent: string;
  filter: 'not_signed_up' | 'not_signed_up_active' | 'all_patrons' | 'active_patrons' | 'free_members' | 'former_patrons' | 'trial_conversion' | 'all_members';
  testMode?: boolean;
  testEmail?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified", { userId: userData.user.id });

    const { subject, htmlContent, filter, testMode, testEmail }: CampaignRequest = await req.json();
    logStep("Request parsed", { filter, testMode, subject });

    if (!subject || !htmlContent) {
      throw new Error("Subject and content are required");
    }

    let emails: string[] = [];

    if (testMode && testEmail) {
      emails = [testEmail];
      logStep("Test mode - sending to", { testEmail });
    } else {
      // Get all patreon members with emails
      const { data: patreonMembers, error: membersError } = await supabaseClient
        .from("patreon_members")
        .select("email, full_name, patron_status, pledge_cents");

      if (membersError) throw membersError;
      logStep("Patreon members fetched", { count: patreonMembers?.length });

      // Get all app users' emails
      const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
      if (authError) throw authError;

      const appUserEmails = new Set(
        authUsers.users?.map(u => u.email?.toLowerCase()).filter(Boolean) || []
      );
      logStep("App users fetched", { count: appUserEmails.size });

      // Filter based on criteria
      const filteredMembers = patreonMembers?.filter(member => {
        if (!member.email) return false;
        const emailLower = member.email.toLowerCase();
        const isSignedUp = appUserEmails.has(emailLower);

        switch (filter) {
          case 'not_signed_up':
            // ALL Patreon members who haven't signed up to the app (regardless of patron status)
            return !isSignedUp;
          case 'not_signed_up_active':
            // Only active paying patrons who haven't signed up
            return !isSignedUp && member.patron_status === 'active_patron';
          case 'all_patrons':
            // All paying patrons (active or with pledge)
            return member.patron_status === 'active_patron' || member.pledge_cents > 0;
          case 'active_patrons':
            // Currently active patrons only
            return member.patron_status === 'active_patron';
          case 'free_members':
            // Free followers only (null status or free_member)
            return (!member.patron_status || member.patron_status === 'free_member') && !isSignedUp;
          case 'former_patrons':
            // Winback: Former patrons who cancelled
            return member.patron_status === 'former_patron' || member.patron_status === 'declined_patron';
          case 'trial_conversion':
            // Free followers who haven't converted to paying
            return !member.patron_status || member.patron_status === 'free_member';
          case 'all_members':
            // Every single Patreon member with an email
            return true;
          default:
            return false;
        }
      }) || [];

      emails = filteredMembers.map(m => m.email).filter(Boolean) as string[];
      logStep("Emails filtered", { filter, count: emails.length });
    }

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients found for this filter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send emails in batches of 50
    const batchSize = 50;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch.map(email => ({
            from: "PhotoTheology <support@thephototheologyapp.com>",
            to: [email],
            subject: subject,
            html: htmlContent,
          }))),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logStep("Batch send error", { batch: i / batchSize, error: errorText });
          errors.push(`Batch ${i / batchSize}: ${errorText}`);
        } else {
          totalSent += batch.length;
          logStep("Batch sent successfully", { batch: i / batchSize, count: batch.length });
        }
      } catch (batchError: unknown) {
        const errorMsg = batchError instanceof Error ? batchError.message : String(batchError);
        errors.push(`Batch ${i / batchSize}: ${errorMsg}`);
      }

      // Small delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    logStep("Email sending complete", { totalSent, errors: errors.length });

    // Send notification email to admin
    const adminEmail = userData.user.email;
    if (adminEmail && !testMode) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PhotoTheology <support@thephototheologyapp.com>",
            to: [adminEmail],
            subject: `✅ Patreon Campaign Sent: "${subject}"`,
            html: `
              <h2>Campaign Sent Successfully!</h2>
              <p>Your Patreon email campaign has been sent.</p>
              <table style="border-collapse: collapse; margin: 16px 0;">
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${subject}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Filter:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${filter}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Emails Sent:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${totalSent} of ${emails.length}</td></tr>
                ${errors.length > 0 ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Errors:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${errors.length}</td></tr>` : ''}
              </table>
              <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
            `,
          }),
        });
        logStep("Admin notification sent", { adminEmail });
      } catch (notifyError) {
        logStep("Failed to send admin notification", { error: notifyError });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: totalSent, 
        total: emails.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully sent ${totalSent} of ${emails.length} emails`,
        notified: !testMode && !!adminEmail,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
