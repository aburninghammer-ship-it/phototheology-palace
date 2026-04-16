import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  subject: string;
  htmlContent: string;
  filter: 'all' | 'paid' | 'unpaid' | 'linked' | 'unlinked';
  testMode: boolean;
  testEmail?: string;
}

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

    // If test mode, just send to test email
    if (testMode) {
      if (!testEmail) {
        return new Response(
          JSON.stringify({ error: "Test email required in test mode" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const testResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PhotoTheology <support@thephototheologyapp.com>",
          to: [testEmail],
          subject: `[TEST] ${subject}`,
          html: htmlContent,
        }),
      });

      console.log("Test email sent:", testResponse.status);

      return new Response(
        JSON.stringify({
          success: true,
          sent: 1,
          total: 1,
          message: `Test email sent to ${testEmail}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build query based on filter
    let query = supabase.from("pickaxe_connections").select("pickaxe_email");

    switch (filter) {
      case 'paid':
        query = query.eq("is_paid_user", true);
        break;
      case 'unpaid':
        query = query.or("is_paid_user.is.null,is_paid_user.eq.false");
        break;
      case 'linked':
        query = query.not("user_id", "is", null);
        break;
      case 'unlinked':
        query = query.is("user_id", null);
        break;
      // 'all' - no additional filter
    }

    const { data: pickaxeMembers, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching Pickaxe members:", fetchError);
      throw fetchError;
    }

    if (!pickaxeMembers || pickaxeMembers.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          sent: 0,
          total: 0,
          message: "No Pickaxe members found matching the filter",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get unique emails
    const emails = [...new Set(pickaxeMembers.map(m => m.pickaxe_email).filter(Boolean))];
    console.log(`Sending to ${emails.length} Pickaxe members with filter: ${filter}`);

    const RESEND_API_KEY_VAL = Deno.env.get("RESEND_API_KEY")!;
    let sentCount = 0;
    let errorCount = 0;

    const campaignName = `Pickaxe Campaign - ${filter} - ${new Date().toISOString().split('T')[0]}`;

    // Use Resend batch API — 100 per request, no rate limit issues
    const BATCH_SIZE = 100;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY_VAL}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch.map(email => ({
            from: "PhotoTheology <support@thephototheologyapp.com>",
            to: [email],
            subject,
            html: htmlContent,
          }))),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Batch ${i / BATCH_SIZE} error:`, errorText);

          await supabase.from("email_campaign_logs").insert(
            batch.map(email => ({
              campaign_name: campaignName,
              recipient_email: email,
              email_type: "pickaxe",
              status: "failed",
              error_message: errorText,
              sent_at: new Date().toISOString(),
            }))
          );
          errorCount += batch.length;
        } else {
          const result = await response.json();
          sentCount += batch.length;
          console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} sent: ${batch.length} emails`);

          await supabase.from("email_campaign_logs").insert(
            batch.map((email, idx) => ({
              campaign_name: campaignName,
              recipient_email: email,
              email_type: "pickaxe",
              status: "sent",
              sent_at: new Date().toISOString(),
              resend_email_id: result?.data?.[idx]?.id || null,
            }))
          );

          // Update pickaxe_connections timestamp in bulk
          await supabase.from("pickaxe_connections")
            .update({ email_sent_at: new Date().toISOString() })
            .in("pickaxe_email", batch);
        }
      } catch (batchErr) {
        const msg = batchErr instanceof Error ? batchErr.message : String(batchErr);
        console.error(`Batch ${i / BATCH_SIZE} exception:`, msg);
        errorCount += batch.length;
      }

      // 1 second delay between batches
      if (i + BATCH_SIZE < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Email campaign complete: ${sentCount} sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: emails.length,
        message: `Successfully sent ${sentCount} emails to Pickaxe members`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in send-pickaxe-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
