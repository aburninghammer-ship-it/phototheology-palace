import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * SMS Webhook Handler (AWS SNS)
 *
 * Handles incoming SNS notifications for:
 * 1. Delivery status notifications (success/failure from SNS delivery status logging)
 * 2. Incoming SMS via Amazon Pinpoint/SNS (if configured)
 *
 * Configure an SNS subscription to point to this endpoint for delivery receipts.
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const contentType = req.headers.get('content-type') || '';

    // Handle SNS subscription confirmation
    const snsMessageType = req.headers.get('x-amz-sns-message-type');
    
    if (snsMessageType === 'SubscriptionConfirmation') {
      const body = await req.json();
      console.log(`[SNS Webhook] Subscription confirmation received. SubscribeURL: ${body.SubscribeURL}`);
      
      // Auto-confirm by visiting the SubscribeURL
      if (body.SubscribeURL) {
        await fetch(body.SubscribeURL);
        console.log('[SNS Webhook] Subscription confirmed');
      }

      return new Response(JSON.stringify({ success: true, message: 'Subscription confirmed' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle SNS notification (delivery status or incoming message)
    if (snsMessageType === 'Notification') {
      const body = await req.json();
      let message: any;
      
      try {
        message = JSON.parse(body.Message);
      } catch {
        message = { body: body.Message };
      }

      console.log(`[SNS Webhook] Notification received:`, JSON.stringify(message).slice(0, 200));

      // Handle delivery status notification
      if (message.notificationType === 'Delivery' || message.status) {
        const messageId = message.providerResponse?.id || message.messageId || '';
        const status = message.status === 'SUCCESS' ? 'delivered' : 'failed';

        if (messageId) {
          const updateData: any = { status };
          if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
          }
          if (status === 'failed') {
            updateData.error_message = message.providerResponse?.statusMessage || 'Delivery failed';
          }

          const { data: logEntry } = await supabase
            .from('sms_send_log')
            .update(updateData)
            .eq('twilio_sid', messageId)
            .select('recipient_id, recipient_type')
            .single();

          if (logEntry?.recipient_id && logEntry.recipient_type === 'standalone') {
            await supabase
              .from('sms_devotional_recipients')
              .update({ last_delivery_status: status })
              .eq('id', logEntry.recipient_id);
          }
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Handle incoming SMS (if using Amazon Pinpoint two-way SMS)
      if (message.messageBody || message.body) {
        const incomingBody = (message.messageBody || message.body || '').toUpperCase().trim();
        const from = message.originationNumber || message.from || '';

        console.log(`[SNS Webhook] Incoming SMS from ${from}: "${incomingBody}"`);

        const cleanPhone = from.replace(/^\+/, '').replace(/\D/g, '');
        const phoneVariants = [from, `+${cleanPhone}`, cleanPhone, cleanPhone.slice(-10)];

        const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'QUIT', 'END', 'STOPALL', 'STOP ALL'];
        const optInKeywords = ['START', 'YES', 'UNSTOP', 'SUBSCRIBE'];

        if (optOutKeywords.includes(incomingBody)) {
          console.log(`[SNS Webhook] Processing opt-out for ${from}`);
          for (const phoneVariant of phoneVariants) {
            await supabase
              .from('devotional_profiles')
              .update({ sms_opt_in: false })
              .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);

            await supabase
              .from('sms_devotional_recipients')
              .update({
                opted_out_at: new Date().toISOString(),
                opt_out_reason: 'user_reply_stop',
                is_active: false,
              })
              .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
          }

          await supabase.from('sms_send_log').insert({
            phone_number: from,
            message_type: 'opt_out_confirm',
            message_body: incomingBody,
            status: 'received',
          });

          console.log(`[SNS Webhook] Opt-out processed for ${from}`);
        } else if (optInKeywords.includes(incomingBody)) {
          console.log(`[SNS Webhook] Processing opt-in for ${from}`);
          for (const phoneVariant of phoneVariants) {
            await supabase
              .from('devotional_profiles')
              .update({ sms_opt_in: true })
              .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);

            await supabase
              .from('sms_devotional_recipients')
              .update({ opted_out_at: null, opt_out_reason: null, is_active: true })
              .or(`phone_number.eq.${phoneVariant},phone_number.ilike.%${cleanPhone.slice(-10)}`);
          }
          console.log(`[SNS Webhook] Opt-in processed for ${from}`);
        } else {
          console.log(`[SNS Webhook] Unknown message from ${from}: ${incomingBody}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fallback for unrecognized requests
    return new Response(JSON.stringify({ success: true, message: 'No action taken' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in sms-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
