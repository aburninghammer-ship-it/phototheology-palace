import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * SMS Status Checker (AWS SNS)
 * 
 * AWS SNS doesn't provide per-message status lookups like Twilio.
 * Instead, delivery status is tracked via SNS delivery status logging
 * and CloudWatch. This function checks pending messages in the log
 * and marks old ones as assumed-delivered or timed-out.
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { messageSid, checkPending } = await req.json().catch(() => ({}));
    const results: any[] = [];

    if (messageSid) {
      // For AWS SNS, we can't query individual message status via API.
      // Just look up the log entry and return its current status.
      const { data: logEntry } = await supabase
        .from('sms_send_log')
        .select('*')
        .eq('twilio_sid', messageSid)
        .single();

      if (logEntry) {
        results.push({
          sid: logEntry.twilio_sid,
          status: logEntry.status,
          errorCode: logEntry.error_code,
          errorMessage: logEntry.error_message,
        });
      }
    } else if (checkPending) {
      // Check all pending messages from last 24 hours
      // AWS SNS messages sent successfully are assumed delivered after a timeout
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: pendingMessages } = await supabase
        .from('sms_send_log')
        .select('id, twilio_sid, phone_number, sent_at, status')
        .in('status', ['queued', 'sending', 'sent', 'accepted'])
        .gte('sent_at', yesterday.toISOString())
        .not('twilio_sid', 'is', null);

      console.log(`[SNS Check] Found ${pendingMessages?.length || 0} pending messages to check`);

      for (const msg of pendingMessages || []) {
        const sentAt = new Date(msg.sent_at);
        const ageMinutes = (Date.now() - sentAt.getTime()) / (1000 * 60);

        // Messages older than 5 minutes with 'sent' status → assume delivered
        if (ageMinutes > 5 && msg.status === 'sent') {
          await supabase
            .from('sms_send_log')
            .update({
              status: 'delivered',
              delivered_at: new Date().toISOString(),
            })
            .eq('id', msg.id);

          results.push({
            phone: msg.phone_number,
            sid: msg.twilio_sid,
            status: 'delivered',
          });
        } else {
          results.push({
            phone: msg.phone_number,
            sid: msg.twilio_sid,
            status: msg.status,
          });
        }
      }
    }

    const delivered = results.filter(r => r.status === 'delivered').length;
    const failed = results.filter(r => r.status === 'failed' || r.status === 'undelivered').length;
    const pending = results.filter(r => ['queued', 'sending', 'sent', 'accepted'].includes(r.status)).length;

    console.log(`[SNS Check] Results: ${delivered} delivered, ${failed} failed, ${pending} pending`);

    return new Response(
      JSON.stringify({
        success: true,
        checked: results.length,
        summary: { delivered, failed, pending },
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in sms-check-status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
