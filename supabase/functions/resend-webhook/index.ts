import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    console.log("[RESEND-WEBHOOK] Received event:", payload.type, payload.data?.email_id);

    // Handle email opened event
    if (payload.type === "email.opened") {
      const emailId = payload.data?.email_id;
      
      if (emailId) {
        // First check if already opened
        const { data: existing } = await supabase
          .from("email_campaign_logs")
          .select("opened_at, open_count")
          .eq("resend_email_id", emailId)
          .single();

        if (existing) {
          if (!existing.opened_at) {
            // First open - set opened_at and increment count
            await supabase
              .from("email_campaign_logs")
              .update({ 
                opened_at: new Date().toISOString(),
                open_count: 1
              })
              .eq("resend_email_id", emailId);
          } else {
            // Already opened - just increment count
            await supabase
              .from("email_campaign_logs")
              .update({ 
                open_count: (existing.open_count || 0) + 1
              })
              .eq("resend_email_id", emailId);
          }
        }

        console.log("[RESEND-WEBHOOK] Updated open status for:", emailId);
      }
    }

    // Handle email delivered event
    if (payload.type === "email.delivered") {
      const emailId = payload.data?.email_id;
      
      if (emailId) {
        await supabase
          .from("email_campaign_logs")
          .update({ status: "delivered" })
          .eq("resend_email_id", emailId);

        console.log("[RESEND-WEBHOOK] Updated delivery status for:", emailId);
      }
    }

    // Handle email bounced event
    if (payload.type === "email.bounced") {
      const emailId = payload.data?.email_id;
      
      if (emailId) {
        await supabase
          .from("email_campaign_logs")
          .update({ 
            status: "bounced",
            error_message: payload.data?.bounce?.message || "Email bounced"
          })
          .eq("resend_email_id", emailId);

        console.log("[RESEND-WEBHOOK] Updated bounce status for:", emailId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[RESEND-WEBHOOK] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
