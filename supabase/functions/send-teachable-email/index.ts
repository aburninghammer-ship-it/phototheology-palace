import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  subject: string;
  htmlContent: string;
  filter: 'all' | 'active' | 'inactive' | 'linked' | 'unlinked' | 'premium_paying' | 'not_paying';
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

      const resend = new Resend(RESEND_API_KEY);
      
      const emailResponse = await resend.emails.send({
        from: "PhotoTheology <noreply@phototheology.app>",
        to: [testEmail],
        subject: `[TEST] ${subject}`,
        html: htmlContent,
      });

      console.log("Test email sent:", emailResponse);

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

    // Build query based on filter - fetch ALL rows (no default 1000 limit)
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
        case 'active':
          query = query.eq("is_active", true);
          break;
        case 'inactive':
          query = query.or("is_active.is.null,is_active.eq.false");
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
        // 'all' - no additional filter
      }

      const { data: pageData, error: pageError } = await query;

      if (pageError) {
        console.error("Error fetching Teachable students page:", pageError);
        throw pageError;
      }

      if (pageData && pageData.length > 0) {
        allStudents = allStudents.concat(pageData);
        offset += pageSize;
        hasMore = pageData.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const teachableStudents = allStudents;

    if (!teachableStudents || teachableStudents.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          sent: 0,
          total: 0,
          message: "No Teachable students found matching the filter",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get unique emails (filter out nulls and cast to string)
    const emails = [...new Set(
      teachableStudents
        .map(s => s.teachable_email)
        .filter((e): e is string => e !== null && e !== undefined && e.trim() !== '')
    )];
    console.log(`Sending to ${emails.length} Teachable students with filter: ${filter}`);

    const resend = new Resend(RESEND_API_KEY);
    let sentCount = 0;
    let errorCount = 0;

    // Send emails in batches of 50 for better throughput
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const promises = batch.map(async (email) => {
        try {
          await resend.emails.send({
            from: "PhotoTheology <noreply@phototheology.app>",
            to: [email],
            subject,
            html: htmlContent,
          });
          sentCount++;
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          errorCount++;
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Email campaign complete: ${sentCount} sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: emails.length,
        message: `Successfully sent ${sentCount} emails to Teachable students`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in send-teachable-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
