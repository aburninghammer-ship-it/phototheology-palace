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

      const resend = new Resend(RESEND_API_KEY);
      
      const emailResponse = await resend.emails.send({
        from: "PhotoTheology <noreply@thephototheologyapp.com>",
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

    const resend = new Resend(RESEND_API_KEY);
    let sentCount = 0;
    let errorCount = 0;

    // Create a campaign name for logging
    const campaignName = `Pickaxe Campaign - ${filter} - ${new Date().toISOString().split('T')[0]}`;

    // Send emails in batches of 10
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      // Send emails sequentially within batch to respect rate limits (2 req/sec)
      for (const email of batch) {
        try {
          await resend.emails.send({
            from: "PhotoTheology <noreply@thephototheologyapp.com>",
            to: [email],
            subject,
            html: htmlContent,
          });
          
          // Log successful send
          await supabase.from("email_campaign_logs").insert({
            campaign_name: campaignName,
            recipient_email: email,
            email_type: "pickaxe",
            status: "sent",
            sent_at: new Date().toISOString(),
          });
          
          // Update pickaxe_connections with email_sent_at
          await supabase.from("pickaxe_connections")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("pickaxe_email", email);
          
          sentCount++;
          console.log(`Sent email ${sentCount} to ${email}`);
        } catch (err) {
          console.error(`Failed to send to ${email}:`, err);
          
          // Log failed send
          await supabase.from("email_campaign_logs").insert({
            campaign_name: campaignName,
            recipient_email: email,
            email_type: "pickaxe",
            status: "failed",
            error_message: err instanceof Error ? err.message : "Unknown error",
          });
          
          errorCount++;
        }
        
        // Delay between each email to respect Resend rate limit (2 req/sec = 600ms delay)
        await new Promise(resolve => setTimeout(resolve, 600));
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
