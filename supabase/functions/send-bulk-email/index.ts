import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-BULK-EMAIL] ${step}${detailsStr}`);
};

interface EmailRequest {
  subject: string;
  htmlContent: string;
  filter: 'all' | 'active' | 'not_paid' | 'paid_only' | 'teachable_not_signed_up';
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

    const { subject, htmlContent, filter, testMode, testEmail }: EmailRequest = await req.json();
    logStep("Request parsed", { filter, testMode, subject });

    if (!subject || !htmlContent) {
      throw new Error("Subject and content are required");
    }

    let emails: string[] = [];

    if (testMode && testEmail) {
      // Test mode - only send to test email
      emails = [testEmail];
      logStep("Test mode - sending to", { testEmail });
    } else if (filter === 'teachable_not_signed_up') {
      // Special filter: Teachable members who haven't signed up for PhototheologyOS
      // Pull all teachable emails
      const { data: teachableStudents, error: teachableError } = await supabaseClient
        .from("teachable_students")
        .select("teachable_email");
      
      if (teachableError) throw teachableError;
      logStep("Teachable students fetched", { count: teachableStudents?.length });

      // Get all emails that already have a PhototheologyOS account (from auth)
      const { data: authUsers } = await supabaseClient.auth.admin.listUsers({ perPage: 1000 });
      const osEmails = new Set(
        (authUsers?.users || []).map(u => u.email?.toLowerCase()).filter(Boolean)
      );

      // Return only Teachable members NOT already in PhototheologyOS
      const teachableEmails = (teachableStudents || [])
        .map(s => s.teachable_email?.toLowerCase())
        .filter((email): email is string => !!email && !osEmails.has(email));

      // Deduplicate
      emails = [...new Set(teachableEmails)];
      logStep("Teachable-only emails filtered", { total: teachableStudents?.length, notInOS: emails.length });
    } else {
      // Get all users with emails from auth.users using admin API
      const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers({ perPage: 1000 });
      if (authError) throw authError;

      logStep("Auth users fetched", { count: authUsers.users?.length });

      // Get subscription status for each user
      const { data: subscriptions } = await supabaseClient
        .from("user_subscriptions")
        .select("user_id, status, subscription_tier, payment_source");

      const subscriptionMap = new Map(
        subscriptions?.map(s => [s.user_id, s]) || []
      );

      // Get profiles with lifetime access
      const { data: lifetimeProfiles } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("has_lifetime_access", true);
      
      const lifetimeUserIds = new Set(lifetimeProfiles?.map(p => p.id) || []);

      // Filter based on criteria
      const filteredUsers = authUsers.users?.filter(user => {
        if (!user.email) return false;

        const sub = subscriptionMap.get(user.id);
        const hasLifetime = lifetimeUserIds.has(user.id);
        const isPaid = sub?.status === 'active' || sub?.status === 'trialing' || hasLifetime;

        switch (filter) {
          case 'all':
            return true;
          case 'active':
            // Active = logged in within last 30 days
            if (user.last_sign_in_at) {
              const lastSignIn = new Date(user.last_sign_in_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return lastSignIn >= thirtyDaysAgo;
            }
            return false;
          case 'not_paid':
            return !isPaid;
          case 'paid_only':
            return isPaid;
          default:
            return true;
        }
      }) || [];

      emails = filteredUsers.map(u => u.email).filter(Boolean) as string[];
      logStep("Emails filtered", { filter, count: emails.length });
    }

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No recipients found for this filter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send emails in batches of 50 (Resend limit)
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: totalSent, 
        total: emails.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully sent ${totalSent} of ${emails.length} emails` 
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
