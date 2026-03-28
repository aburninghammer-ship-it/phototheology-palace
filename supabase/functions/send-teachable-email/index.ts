import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_EMAIL = "Phototheology <support@thephototheologyapp.com>";

interface EmailRequest {
  subject: string;
  htmlContent: string;
  filter: 'all' | 'master_class_active' | 'master_class_inactive' | 'free_signup' | 'linked' | 'unlinked' | 'premium_paying' | 'not_paying' | 'not_suite_subscribers';
  testMode: boolean;
  testEmail?: string;
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-TEACHABLE-EMAIL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin status
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!adminData && !roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { subject, htmlContent, filter, testMode, testEmail }: EmailRequest = await req.json();

    if (!subject || !htmlContent) {
      return new Response(
        JSON.stringify({ error: "Subject and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Test mode — single send
    if (testMode) {
      if (!testEmail) {
        return new Response(
          JSON.stringify({ error: "Test email required in test mode" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [testEmail],
          subject: `[TEST] ${subject}`,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Resend error: ${err}`);
      }

      logStep("Test email sent", { testEmail });

      return new Response(
        JSON.stringify({ success: true, sent: 1, total: 1, message: `Test email sent to ${testEmail}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Special filter: Teachable users NOT subscribed to PhototheologyOS
    // These are users in teachable_students whose linked app account has no active/trial subscription
    // OR who have no linked account at all (unlinked).
    let emails: string[] = [];

    if (filter === 'not_suite_subscribers') {
      // 1. Get all teachable students (paginated)
      let allStudents: Array<{ teachable_email: string | null; user_id: string | null }> = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 1000;
      while (hasMore) {
        const { data: pageData, error: pageError } = await supabase
          .from("teachable_students")
          .select("teachable_email, user_id")
          .range(offset, offset + pageSize - 1);
        if (pageError) throw pageError;
        if (pageData && pageData.length > 0) {
          allStudents = allStudents.concat(pageData);
          offset += pageSize;
          hasMore = pageData.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      // 2. Collect user_ids that are linked
      const linkedUserIds = allStudents
        .map(s => s.user_id)
        .filter((id): id is string => !!id);

      // 3. Get active/trial subscriber user_ids from user_subscriptions
      let activeSubscriberIds = new Set<string>();
      if (linkedUserIds.length > 0) {
        // Batch in chunks of 500 to avoid query size limits
        const chunkSize = 500;
        for (let i = 0; i < linkedUserIds.length; i += chunkSize) {
          const chunk = linkedUserIds.slice(i, i + chunkSize);
          const { data: subData } = await supabase
            .from("user_subscriptions")
            .select("user_id")
            .in("user_id", chunk)
            .in("subscription_status", ["active", "trial", "trialing"]);
          (subData || []).forEach(s => activeSubscriberIds.add(s.user_id));
        }

        // Also check profiles for lifetime access
        for (let i = 0; i < linkedUserIds.length; i += chunkSize) {
          const chunk = linkedUserIds.slice(i, i + chunkSize);
          const { data: lifetimeData } = await supabase
            .from("profiles")
            .select("id")
            .in("id", chunk)
            .eq("has_lifetime_access", true);
          (lifetimeData || []).forEach(p => activeSubscriberIds.add(p.id));
        }
      }

      // 4. Filter: keep students who are unlinked OR linked but not active subscribers
      const filtered = allStudents.filter(s => {
        if (!s.teachable_email) return false;
        if (!s.user_id) return true; // unlinked = never used the app = not a subscriber
        return !activeSubscriberIds.has(s.user_id); // linked but not paying
      });

      emails = [...new Set(filtered.map(s => s.teachable_email).filter((e): e is string => !!e && e.trim() !== ''))];
      logStep("not_suite_subscribers filter result", { total: allStudents.length, filtered: emails.length });

    } else {
      // Fetch all students with pagination (bypass 1000 row limit)
      let allStudents: Array<{ teachable_email: string | null; user_id: string | null; is_active: boolean | null; mrr: number | null }> = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 1000;

      while (hasMore) {
        let query = supabase
          .from("teachable_students")
          .select("teachable_email, user_id, is_active, mrr")
          .range(offset, offset + pageSize - 1);

        switch (filter) {
          case 'master_class_active':
            query = query.eq("is_master_class", true).eq("is_active", true);
            break;
          case 'master_class_inactive':
            query = query.eq("is_master_class", true).eq("is_active", false);
            break;
          case 'free_signup':
            query = query.eq("is_master_class", false);
            break;
          case 'linked':
            query = query.not("user_id", "is", null);
            break;
          case 'unlinked':
            query = query.is("user_id", null);
            break;
          case 'premium_paying':
            query = query.gte("mrr", 15);
            break;
          case 'not_paying':
            query = query.or("mrr.is.null,mrr.eq.0");
            break;
        }

        const { data: pageData, error: pageError } = await query;
        if (pageError) throw pageError;

        if (pageData && pageData.length > 0) {
          allStudents = allStudents.concat(pageData);
          offset += pageSize;
          hasMore = pageData.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      emails = [...new Set(
        allStudents
          .map(s => s.teachable_email)
          .filter((e): e is string => !!e && e.trim() !== '')
      )];
    }

    logStep("Emails fetched", { filter, count: emails.length });

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, total: 0, message: "No Teachable students found matching the filter" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const campaignName = `Teachable Campaign - ${filter} - ${new Date().toISOString().split('T')[0]}`;
    // Use Resend batch API — up to 100 per request
    const BATCH_SIZE = 100;
    let sentCount = 0;
    let errorCount = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch.map(email => ({
            from: FROM_EMAIL,
            to: [email],
            subject,
            html: htmlContent,
          }))),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logStep("Batch send error", { batchIndex: i, error: errorText });
          errorMessages.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${errorText}`);
          errorCount += batch.length;

          // Log failures
          await supabase.from("email_campaign_logs").insert(
            batch.map(email => ({
              campaign_name: campaignName,
              email_type: "teachable",
              recipient_email: email,
              status: "failed",
              error_message: errorText,
              sent_at: new Date().toISOString(),
            }))
          );
        } else {
          const result = await response.json();
          sentCount += batch.length;
          logStep("Batch sent", { batchIndex: i, count: batch.length });

          // Log successes
          await supabase.from("email_campaign_logs").insert(
            batch.map((email, idx) => ({
              campaign_name: campaignName,
              email_type: "teachable",
              recipient_email: email,
              status: "sent",
              sent_at: new Date().toISOString(),
              resend_email_id: result?.data?.[idx]?.id || null,
            }))
          );
        }
      } catch (batchErr) {
        const msg = batchErr instanceof Error ? batchErr.message : String(batchErr);
        logStep("Batch exception", { batchIndex: i, error: msg });
        errorMessages.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${msg}`);
        errorCount += batch.length;
      }

      // 1 second delay between batches to stay well under rate limits
      if (i + BATCH_SIZE < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    logStep("Campaign complete", { sentCount, errorCount });

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: emails.length,
        errors: errorCount,
        message: `Successfully sent ${sentCount} of ${emails.length} emails to Teachable students`,
        errorDetails: errorMessages.length > 0 ? errorMessages : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in send-teachable-email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
