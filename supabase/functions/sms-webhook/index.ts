import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * SMS Webhook Handler
 *
 * Handles incoming SMS messages from Twilio, particularly opt-out keywords.
 * Configure this webhook URL in your Twilio phone number settings.
 *
 * Supported keywords: STOP, UNSUBSCRIBE, CANCEL, QUIT, END
 * Re-subscribe: START, YES, UNSTOP
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
    const body = formData.get('Body')?.toString().toUpperCase().trim() || '';
    const from = formData.get('From')?.toString() || '';
    const messageSid = formData.get('MessageSid')?.toString() || '';

    console.log(`Received SMS from ${from}: "${body}" (SID: ${messageSid})`);

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
      console.log(`Processing opt-out for ${from}`);

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

      responseMessage = 'You have been unsubscribed from Phototheology devotionals. Reply START to resubscribe.';
      console.log(`Opt-out processed for ${from}`);

    } else if (optInKeywords.includes(body)) {
      // Opt-in: Reactivate recipients
      console.log(`Processing opt-in for ${from}`);

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

      responseMessage = 'Welcome back! You have been resubscribed to Phototheology devotionals. Reply STOP to unsubscribe.';
      console.log(`Opt-in processed for ${from}`);

    } else {
      // Unknown message - provide help
      responseMessage = 'Phototheology Devotionals. Reply STOP to unsubscribe or visit phototheology.app for more.';
      console.log(`Unknown message from ${from}: ${body}`);
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
  <Message>Sorry, we encountered an error. Please try again or visit phototheology.app</Message>
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
