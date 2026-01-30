import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Twilio Message Status Checker
 * 
 * Queries Twilio API to get the current status of sent messages.
 * Can check individual messages or all pending messages from the log.
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID') ?? '';
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN') ?? '';

    if (!twilioAccountSid || !twilioAuthToken) {
      return new Response(
        JSON.stringify({ error: 'Missing Twilio credentials' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { messageSid, checkPending } = await req.json().catch(() => ({}));

    const results: any[] = [];

    if (messageSid) {
      // Check specific message
      const status = await getTwilioMessageStatus(twilioAccountSid, twilioAuthToken, messageSid);
      results.push(status);

      // Update in database
      if (status.sid) {
        await supabase
          .from('sms_send_log')
          .update({
            status: status.status,
            error_code: status.errorCode,
            error_message: status.errorMessage,
            delivered_at: status.status === 'delivered' ? new Date().toISOString() : null,
          })
          .eq('twilio_sid', messageSid);
      }
    } else if (checkPending) {
      // Check all pending messages from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: pendingMessages } = await supabase
        .from('sms_send_log')
        .select('id, twilio_sid, phone_number')
        .in('status', ['queued', 'sending', 'sent', 'accepted'])
        .gte('sent_at', yesterday.toISOString())
        .not('twilio_sid', 'is', null);

      console.log(`[Twilio Check] Found ${pendingMessages?.length || 0} pending messages to check`);

      for (const msg of pendingMessages || []) {
        if (!msg.twilio_sid) continue;

        const status = await getTwilioMessageStatus(twilioAccountSid, twilioAuthToken, msg.twilio_sid);
        
        // Update database
        await supabase
          .from('sms_send_log')
          .update({
            status: status.status,
            error_code: status.errorCode,
            error_message: status.errorMessage,
            delivered_at: status.status === 'delivered' ? new Date().toISOString() : null,
            price: status.price,
          })
          .eq('id', msg.id);

        results.push({
          phone: msg.phone_number,
          ...status,
        });

        // Rate limit to avoid Twilio API limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Summary stats
    const delivered = results.filter(r => r.status === 'delivered').length;
    const failed = results.filter(r => r.status === 'failed' || r.status === 'undelivered').length;
    const pending = results.filter(r => ['queued', 'sending', 'sent', 'accepted'].includes(r.status)).length;

    console.log(`[Twilio Check] Results: ${delivered} delivered, ${failed} failed, ${pending} pending`);

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
    console.error("Error in twilio-check-status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getTwilioMessageStatus(
  accountSid: string,
  authToken: string,
  messageSid: string
): Promise<{
  sid: string;
  status: string;
  errorCode?: string;
  errorMessage?: string;
  price?: number;
  dateCreated?: string;
  dateSent?: string;
  dateUpdated?: string;
}> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages/${messageSid}.json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        sid: messageSid,
        status: 'error',
        errorCode: data.code?.toString(),
        errorMessage: data.message || 'Failed to fetch status',
      };
    }

    return {
      sid: data.sid,
      status: data.status,
      errorCode: data.error_code?.toString(),
      errorMessage: data.error_message,
      price: data.price ? parseFloat(data.price) : undefined,
      dateCreated: data.date_created,
      dateSent: data.date_sent,
      dateUpdated: data.date_updated,
    };
  } catch (error: any) {
    return {
      sid: messageSid,
      status: 'error',
      errorMessage: error.message,
    };
  }
}
