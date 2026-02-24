import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * SMS Webhook Handler
 *
 * Handles incoming SMS messages and status callbacks from Twilio.
 * 
 * Two webhook types:
 * 1. Incoming SMS (opt-out keywords: STOP, UNSUBSCRIBE, etc.)
 * 2. Status callbacks (delivery confirmations/failures)
 *
 * Configure these webhook URLs in your Twilio phone number settings:
 * - Messaging webhook: https://[project].supabase.co/functions/v1/sms-webhook
 * - Status callback: Set in code when sending (or add to number settings)
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse Twilio webhook data (form-urlencoded)
    const formData = await req.formData();
    
    // Check if this is a status callback or incoming message
    const messageStatus = formData.get('MessageStatus')?.toString();
    const messageSid = formData.get('MessageSid')?.toString() || formData.get('SmsSid')?.toString() || '';
    
    // STATUS CALLBACK HANDLING
    if (messageStatus) {
      console.log(`[SMS Status] SID: ${messageSid}, Status: ${messageStatus}`);
      
      const errorCode = formData.get('ErrorCode')?.toString();
      const errorMessage = formData.get('ErrorMessage')?.toString();
      
      // Update the send log with delivery status
      const updateData: any = {
        status: messageStatus,
      };
      
      if (messageStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }
      
      if (errorCode) {
        updateData.error_code = errorCode;
        updateData.error_message = errorMessage || `Error code: ${errorCode}`;
        console.log(`[SMS Status] Error: ${errorCode} - ${errorMessage}`);
      }
      
      // Also update recipient's last_delivery_status
      const { data: logEntry } = await supabase
        .from('sms_send_log')
        .update(updateData)
        .eq('twilio_sid', messageSid)
        .select('recipient_id, recipient_type')
        .single();
      
      if (logEntry?.recipient_id && logEntry.recipient_type === 'standalone') {
        await supabase
          .from('sms_devotional_recipients')
          .update({ last_delivery_status: messageStatus })
          .eq('id', logEntry.recipient_id);
      }
      
      // Return empty TwiML (no response needed for status callbacks)
      return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
        headers: { ...corsHeaders, "Content-Type": "text/xml" },
      });
    }

    // INCOMING MESSAGE HANDLING
    const body = formData.get('Body')?.toString().toUpperCase().trim() || '';
    const from = formData.get('From')?.toString() || '';

    console.log(`[SMS Webhook] Received from ${from}: "${body}" (SID: ${messageSid})`);

    // Clean phone number (remove country code formatting variations)
    const cleanPhone = from.replace(/^\+/, '').replace(/\D/g, '');
    const phoneVariants = [
      from,
      `+${cleanPhone}`,
      cleanPhone,
      cleanPhone.slice(-10), // Last 10 digits (US number without country code)
    ];

    // Check for opt-out keywords
    const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'QUIT', 'END', 'STOPALL', 'STOP ALL'];
    const optInKeywords = ['START', 'YES', 'UNSTOP', 'SUBSCRIBE'];

    let responseMessage = '';

    if (optOutKeywords.includes(body)) {
      // Opt-out: Update both profile and standalone recipients
      console.log(`[SMS Webhook] Processing opt-out for ${from}`);

      // Update devotional_profiles
      for (const phoneVariant of phoneVariants) {
        await supabase
          .from('devotional_profiles')
          .update({
            sms_opt_in: false,
          })
          .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
      }

      // Update sms_devotional_recipients
      for (const phoneVariant of phoneVariants) {
        await supabase
          .from('sms_devotional_recipients')
          .update({
            opted_out_at: new Date().toISOString(),
            opt_out_reason: 'user_reply_stop',
            is_active: false,
          })
          .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
      }

      // Log the opt-out
      await supabase.from('sms_send_log').insert({
        phone_number: from,
        message_type: 'opt_out_confirm',
        message_body: body,
        twilio_sid: messageSid,
        status: 'received',
      });

      responseMessage = 'You have been unsubscribed. Reply START to resubscribe.';
      console.log(`[SMS Webhook] Opt-out processed for ${from}`);

    } else if (optInKeywords.includes(body)) {
      // Opt-in: Reactivate recipients
      console.log(`[SMS Webhook] Processing opt-in for ${from}`);

      // Reactivate devotional_profiles
      for (const phoneVariant of phoneVariants) {
        await supabase
          .from('devotional_profiles')
          .update({
            sms_opt_in: true,
          })
          .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
      }

      // Reactivate sms_devotional_recipients
      for (const phoneVariant of phoneVariants) {
        await supabase
          .from('sms_devotional_recipients')
          .update({
            opted_out_at: null,
            opt_out_reason: null,
            is_active: true,
          })
          .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
      }

      responseMessage = 'Welcome back! You are resubscribed. Reply STOP to unsubscribe.';
      console.log(`[SMS Webhook] Opt-in processed for ${from}`);

    } else {
      // Unknown message - provide help
      responseMessage = 'Reply STOP to unsubscribe or visit phototheology.app';
      console.log(`[SMS Webhook] Unknown message from ${from}: ${body}`);
    }

    // Return TwiML response
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;

    return new Response(twimlResponse, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/xml",
      },
    });

  } catch (error: any) {
    console.error("Error in sms-webhook:", error);

    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, an error occurred. Visit phototheology.app</Message>
</Response>`;

    return new Response(errorTwiml, {
      status: 200, // Twilio expects 200 even for errors
      headers: {
        ...corsHeaders,
        "Content-Type": "text/xml",
      },
    });
  }
});
