import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRecipient {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  phone_country_code: string;
  plan_id: string | null;
  is_active: boolean;
  opted_out_at: string | null;
  timezone: string;
  preferred_send_hour: number;
  total_sms_sent: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID') ?? '';
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY') ?? '';
    const awsRegion = Deno.env.get('AWS_REGION') ?? 'us-east-1';

    if (!awsAccessKeyId || !awsSecretAccessKey) {
      console.error('Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in Supabase Edge Function secrets.');
      return new Response(
        JSON.stringify({ error: 'Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in Supabase Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const forceNow = body.forceNow === true;
    const skipDailyCheck = body.skipDailyCheck === true;
    const testRecipientId = body.recipientId;

    const now = new Date();
    const currentUtcHour = now.getUTCHours();
    
    console.log(`[SMS Send] Starting at UTC hour ${currentUtcHour}${forceNow ? ' (FORCE MODE)' : ''}`);

    // Get all active SMS recipients
    let recipientsQuery = supabase
      .from('sms_devotional_recipients')
      .select('*')
      .eq('is_active', true)
      .is('opted_out_at', null);

    if (testRecipientId) {
      recipientsQuery = recipientsQuery.eq('id', testRecipientId);
    }

    const { data: allRecipients, error: recipientsError } = await recipientsQuery;

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
      throw recipientsError;
    }

    // Also check devotional_profiles with SMS opt-in
    const { data: profileRecipients, error: profilesError } = await supabase
      .from('devotional_profiles')
      .select('*')
      .eq('sms_opt_in', true)
      .not('phone_number', 'is', null);

    if (profilesError) {
      console.error('Error fetching profile recipients:', profilesError);
    }

    console.log(`[SMS Send] Found ${allRecipients?.length || 0} standalone recipients and ${profileRecipients?.length || 0} profile recipients`);

    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[]
    };

    // Process standalone SMS recipients
    for (const recipient of (allRecipients || [])) {
      results.processed++;
      
      if (!forceNow) {
        const recipientHour = getHourInTimezone(now, recipient.timezone);
        if (recipientHour !== recipient.preferred_send_hour) {
          results.skipped++;
          console.log(`[SMS Send] Skipping ${recipient.name} - current hour ${recipientHour} != preferred ${recipient.preferred_send_hour}`);
          continue;
        }
      } else {
        console.log(`[SMS Send] Force sending to ${recipient.name} (bypassing time check)`);
      }

      if (!skipDailyCheck) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const { data: todaysLog } = await supabase
          .from('sms_send_log')
          .select('id')
          .eq('recipient_id', recipient.id)
          .eq('recipient_type', 'standalone')
          .gte('sent_at', todayStart.toISOString())
          .limit(1);

        if (todaysLog && todaysLog.length > 0) {
          results.skipped++;
          console.log(`[SMS Send] Skipping ${recipient.name} - already sent today`);
          continue;
        }
      }

      let messageBody = '';
      let dayNumber = 1;

      if (recipient.plan_id) {
        const { data: plan } = await supabase
          .from('devotional_plans')
          .select('*')
          .eq('id', recipient.plan_id)
          .single();

        if (plan) {
          dayNumber = (recipient.total_sms_sent % (plan.duration || 30)) + 1;
          
          const { data: dayContent } = await supabase
            .from('devotional_days')
            .select('*')
            .eq('plan_id', recipient.plan_id)
            .eq('day_number', dayNumber)
            .single();

          if (dayContent) {
            messageBody = formatDevotionalMessage(recipient.name, dayNumber, dayContent);
          } else {
            messageBody = `Day ${dayNumber}: Your devotional awaits!\n📖 Open the app to read today's study.\n-PT`;
          }
        }
      }

      if (!messageBody) {
        messageBody = `📖 Your daily devotional is ready!\nOpen the app to begin.\n-PT`;
      }

      const phoneNumber = `${recipient.phone_country_code}${recipient.phone_number}`;
      const sendResult = await sendSNSSMS(awsAccessKeyId, awsSecretAccessKey, awsRegion, phoneNumber, messageBody);

      await supabase.from('sms_send_log').insert({
        user_id: recipient.user_id,
        recipient_type: 'standalone',
        recipient_id: recipient.id,
        phone_number: phoneNumber,
        plan_id: recipient.plan_id,
        day_number: dayNumber,
        message_type: 'devotional',
        message_body: messageBody,
        twilio_sid: sendResult.messageId, // reuse column for SNS message ID
        status: sendResult.status,
        error_code: sendResult.errorCode,
        error_message: sendResult.errorMessage,
        segments: 1,
      });

      if (sendResult.success) {
        await supabase
          .from('sms_devotional_recipients')
          .update({
            last_sms_sent_at: new Date().toISOString(),
            total_sms_sent: recipient.total_sms_sent + 1,
            last_delivery_status: sendResult.status,
          })
          .eq('id', recipient.id);

        results.sent++;
        console.log(`[SMS Send] Sent to ${recipient.name} (${phoneNumber})`);
      } else {
        results.errors++;
        console.error(`[SMS Send] Failed for ${recipient.name}: ${sendResult.errorMessage}`);
      }

      results.details.push({
        name: recipient.name,
        success: sendResult.success,
        status: sendResult.status,
        error: sendResult.errorMessage,
      });
    }

    // Process devotional_profiles with SMS opt-in
    for (const profile of (profileRecipients || [])) {
      results.processed++;

      const alreadyProcessed = results.details.some(d => d.name === profile.name);
      if (alreadyProcessed) {
        results.skipped++;
        continue;
      }

      if (!forceNow) {
        const recipientHour = getHourInTimezone(now, 'America/New_York');
        if (recipientHour !== 8) {
          results.skipped++;
          continue;
        }
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const { data: todaysLog } = await supabase
        .from('sms_send_log')
        .select('id')
        .eq('recipient_id', profile.id)
        .eq('recipient_type', 'profile')
        .gte('sent_at', todayStart.toISOString())
        .limit(1);

      if (todaysLog && todaysLog.length > 0) {
        results.skipped++;
        continue;
      }

      let messageBody = '';
      const dayNumber = profile.current_day || 1;

      if (profile.plan_id) {
        const { data: dayContent } = await supabase
          .from('devotional_days')
          .select('*')
          .eq('plan_id', profile.plan_id)
          .eq('day_number', dayNumber)
          .single();

        if (dayContent) {
          messageBody = formatDevotionalMessage(profile.name, dayNumber, dayContent);
        }
      }

      if (!messageBody) {
        messageBody = `Day ${dayNumber}: Your devotional awaits!\n📖 Open the app to read today.\n-PT`;
      }

      const phoneNumber = `${profile.phone_country_code || '+1'}${profile.phone_number}`;
      const sendResult = await sendSNSSMS(awsAccessKeyId, awsSecretAccessKey, awsRegion, phoneNumber, messageBody);

      await supabase.from('sms_send_log').insert({
        user_id: profile.user_id,
        recipient_type: 'profile',
        recipient_id: profile.id,
        phone_number: phoneNumber,
        plan_id: profile.plan_id,
        day_number: dayNumber,
        message_type: 'devotional',
        message_body: messageBody,
        twilio_sid: sendResult.messageId,
        status: sendResult.status,
        error_code: sendResult.errorCode,
        error_message: sendResult.errorMessage,
        segments: 1,
      });

      if (sendResult.success) {
        // Advance current_day for next send
        const { data: planData } = profile.plan_id ? await supabase
          .from('devotional_plans')
          .select('duration')
          .eq('id', profile.plan_id)
          .single() : { data: null };

        const maxDay = planData?.duration || 30;
        const nextDay = dayNumber >= maxDay ? 1 : dayNumber + 1;

        await supabase
          .from('devotional_profiles')
          .update({
            current_day: nextDay,
            last_sms_sent_at: new Date().toISOString(),
            total_sms_sent: (profile.total_sms_sent || 0) + 1,
          })
          .eq('id', profile.id);

        results.sent++;
        console.log(`[SMS Send] Sent to profile ${profile.name} (day ${dayNumber} -> next: ${nextDay})`);
      } else {
        results.errors++;
        console.error(`[SMS Send] Failed for profile ${profile.name}: ${sendResult.errorMessage}`);
      }

      results.details.push({
        name: profile.name,
        type: 'profile',
        success: sendResult.success,
        status: sendResult.status,
        error: sendResult.errorMessage,
      });
    }

    console.log(`[SMS Send] Complete: ${results.sent} sent, ${results.skipped} skipped, ${results.errors} errors`);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in sms-send-devotionals:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getHourInTimezone(date: Date, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find(p => p.type === 'hour');
    return hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
  } catch {
    return date.getUTCHours();
  }
}

function formatDevotionalMessage(name: string, dayNumber: number, dayContent: any): string {
  const scripture = dayContent.scripture_reference || '';
  const theme = dayContent.theme || '';
  
  let message = `Day ${dayNumber}`;
  
  if (theme) {
    const shortTheme = theme.length > 40 ? theme.substring(0, 37) + '...' : theme;
    message += `: ${shortTheme}`;
  }
  
  if (scripture) {
    message += `\n📖 ${scripture}`;
  }
  
  const devotionalText = dayContent.devotional_text || '';
  const remainingChars = 145 - message.length;
  
  if (devotionalText && remainingChars > 30) {
    const firstSentence = devotionalText.split(/[.!?]/)[0];
    if (firstSentence && firstSentence.length < remainingChars - 5) {
      message += `\n${firstSentence}.`;
    }
  }
  
  message += `\n-PT`;
  
  if (message.length > 160) {
    message = message.substring(0, 157) + '...';
  }

  return message;
}

// AWS Signature V4 helper for SNS
async function sendSNSSMS(
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  phoneNumber: string,
  message: string
): Promise<{
  success: boolean;
  messageId?: string;
  status?: string;
  errorCode?: string;
  errorMessage?: string;
}> {
  try {
    const endpoint = `https://sns.${region}.amazonaws.com/`;
    const params = new URLSearchParams({
      Action: 'Publish',
      PhoneNumber: phoneNumber,
      Message: message,
      'MessageAttributes.entry.1.Name': 'AWS.SNS.SMS.SMSType',
      'MessageAttributes.entry.1.Value.DataType': 'String',
      'MessageAttributes.entry.1.Value.StringValue': 'Transactional',
    });

    const body = params.toString();
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').slice(0, 15) + 'Z';
    const dateStamp = amzDate.slice(0, 8);

    const canonicalUri = '/';
    const canonicalQueryString = '';
    const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:sns.${region}.amazonaws.com\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-date';

    const bodyHash = await sha256Hex(new TextEncoder().encode(body).buffer);
    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      bodyHash,
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/sns/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      await sha256Hex(new TextEncoder().encode(canonicalRequest).buffer),
    ].join('\n');

    const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, 'sns');
    const signature = await hmacHex(signingKey, stringToSign);

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Amz-Date': amzDate,
        'Authorization': authorizationHeader,
      },
      body,
    });

    const responseText = await response.text();

    if (!response.ok) {
      // Parse XML error
      const codeMatch = responseText.match(/<Code>([^<]+)<\/Code>/);
      const messageMatch = responseText.match(/<Message>([^<]+)<\/Message>/);
      return {
        success: false,
        errorCode: codeMatch?.[1],
        errorMessage: messageMatch?.[1] || `SNS error: ${response.status}`,
      };
    }

    // Parse MessageId from XML response
    const messageIdMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/);
    return {
      success: true,
      messageId: messageIdMatch?.[1],
      status: 'sent',
    };
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error.message || 'Failed to send SMS via SNS',
    };
  }
}

// AWS Signature V4 crypto helpers using Web Crypto API
async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function hmacHex(key: ArrayBuffer, data: string): Promise<string> {
  const sig = await hmacSha256(key, data);
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSigningKey(secretKey: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode('AWS4' + secretKey).buffer, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, 'aws4_request');
}
