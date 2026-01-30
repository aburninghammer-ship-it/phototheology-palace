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

interface DevotionalPlan {
  id: string;
  title: string;
  user_id: string;
}

interface DevotionalDay {
  day_number: number;
  devotional_text: string;
  scripture_reference: string;
  theme: string;
}

interface DevotionalProfile {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  phone_country_code: string;
  plan_id: string;
  current_day: number;
  sms_opt_in: boolean;
}

/**
 * SMS Devotional Sender
 * 
 * Sends daily devotionals via SMS to opted-in recipients.
 * Called by cron job at the top of each hour.
 * 
 * Flow:
 * 1. Get all active recipients whose preferred send hour matches current hour in their timezone
 * 2. For each recipient, get their devotional plan and current day
 * 3. Send SMS via Twilio
 * 4. Log the result
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
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') ?? '';

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error('Missing Twilio credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Twilio credentials' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for test mode options
    const body = await req.json().catch(() => ({}));
    const forceNow = body.forceNow === true; // Bypass time check
    const skipDailyCheck = body.skipDailyCheck === true; // Bypass "already sent today" check
    const testRecipientId = body.recipientId; // Send to specific recipient only

    // Get current UTC hour
    const now = new Date();
    const currentUtcHour = now.getUTCHours();
    
    console.log(`[SMS Send] Starting at UTC hour ${currentUtcHour}${forceNow ? ' (FORCE MODE)' : ''}`);

    // Get all active SMS recipients
    let recipientsQuery = supabase
      .from('sms_devotional_recipients')
      .select('*')
      .eq('is_active', true)
      .is('opted_out_at', null);

    // If testing specific recipient, filter by ID
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
      
      // Check if it's the right time for this recipient's timezone (skip if forceNow)
      if (!forceNow) {
        const recipientHour = getHourInTimezone(now, recipient.timezone);
        
        if (recipientHour !== recipient.preferred_send_hour) {
          results.skipped++;
          console.log(`[SMS Send] Skipping ${recipient.name} - current hour ${recipientHour} != preferred ${recipient.preferred_send_hour} in ${recipient.timezone}`);
          continue;
        }
      } else {
        console.log(`[SMS Send] Force sending to ${recipient.name} (bypassing time check)`);
      }

      // Check if already sent today (skip if skipDailyCheck)
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

      // Get devotional content
      let messageBody = '';
      let dayNumber = 1;

      if (recipient.plan_id) {
        // Get plan details
        const { data: plan } = await supabase
          .from('devotional_plans')
          .select('*')
          .eq('id', recipient.plan_id)
          .single();

        if (plan) {
          // Get current day (based on total sent + 1)
          dayNumber = (recipient.total_sms_sent % (plan.total_days || 30)) + 1;
          
          // Get the day's devotional
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

      // Send SMS via Twilio
      const sendResult = await sendTwilioSMS(
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        `${recipient.phone_country_code}${recipient.phone_number}`,
        messageBody
      );

      // Log the result
      await supabase.from('sms_send_log').insert({
        user_id: recipient.user_id,
        recipient_type: 'standalone',
        recipient_id: recipient.id,
        phone_number: `${recipient.phone_country_code}${recipient.phone_number}`,
        plan_id: recipient.plan_id,
        day_number: dayNumber,
        message_type: 'devotional',
        message_body: messageBody,
        twilio_sid: sendResult.sid,
        status: sendResult.status,
        error_code: sendResult.errorCode,
        error_message: sendResult.errorMessage,
        segments: sendResult.segments || 1,
      });

      // Update recipient stats
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
        console.log(`[SMS Send] Sent to ${recipient.name} (${recipient.phone_country_code}${recipient.phone_number})`);
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

      // Check if already processed as standalone
      const alreadyProcessed = results.details.some(
        d => d.name === profile.name
      );
      if (alreadyProcessed) {
        results.skipped++;
        continue;
      }

      // Check timezone and preferred hour (default to 8 AM Eastern)
      const recipientHour = getHourInTimezone(now, 'America/New_York');
      
      if (recipientHour !== 8) {
        results.skipped++;
        continue;
      }

      // Check if already sent today
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

      // Get devotional content
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

      // Send SMS
      const sendResult = await sendTwilioSMS(
        twilioAccountSid,
        twilioAuthToken,
        twilioPhoneNumber,
        phoneNumber,
        messageBody
      );

      // Log
      await supabase.from('sms_send_log').insert({
        user_id: profile.user_id,
        recipient_type: 'profile',
        recipient_id: profile.id,
        phone_number: phoneNumber,
        plan_id: profile.plan_id,
        day_number: dayNumber,
        message_type: 'devotional',
        message_body: messageBody,
        twilio_sid: sendResult.sid,
        status: sendResult.status,
        error_code: sendResult.errorCode,
        error_message: sendResult.errorMessage,
        segments: sendResult.segments || 1,
      });

      if (sendResult.success) {
        results.sent++;
        console.log(`[SMS Send] Sent to profile ${profile.name}`);
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
      JSON.stringify({
        success: true,
        results,
      }),
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
    // Default to UTC if timezone is invalid
    return date.getUTCHours();
  }
}

function formatDevotionalMessage(name: string, dayNumber: number, dayContent: any): string {
  const scripture = dayContent.scripture_reference || '';
  const theme = dayContent.theme || '';
  
  // SHORTENED: Keep under 160 chars (1 segment) to avoid carrier filtering
  // Format: "Day X: Theme\nScripture\n-PT"
  let message = `Day ${dayNumber}`;
  
  if (theme) {
    // Truncate theme to ~40 chars
    const shortTheme = theme.length > 40 ? theme.substring(0, 37) + '...' : theme;
    message += `: ${shortTheme}`;
  }
  
  if (scripture) {
    message += `\n📖 ${scripture}`;
  }
  
  // Add a brief excerpt if space allows (aim for 160 total)
  let devotionalText = dayContent.devotional_text || '';
  const remainingChars = 145 - message.length;
  
  if (devotionalText && remainingChars > 30) {
    // Extract first sentence or truncate
    const firstSentence = devotionalText.split(/[.!?]/)[0];
    if (firstSentence && firstSentence.length < remainingChars - 5) {
      message += `\n${firstSentence}.`;
    }
  }
  
  message += `\n-PT`;
  
  // Hard cap at 160 chars (1 SMS segment)
  if (message.length > 160) {
    message = message.substring(0, 157) + '...';
  }

  return message;
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

async function sendTwilioSMS(
  accountSid: string,
  authToken: string,
  from: string,
  to: string,
  body: string
): Promise<{
  success: boolean;
  sid?: string;
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  segments?: number;
}> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Add status callback URL for delivery tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const statusCallbackUrl = `${supabaseUrl}/functions/v1/sms-webhook`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: body,
        StatusCallback: statusCallbackUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errorCode: data.code?.toString(),
        errorMessage: data.message || 'Twilio API error',
      };
    }

    return {
      success: true,
      sid: data.sid,
      status: data.status,
      segments: data.num_segments ? parseInt(data.num_segments, 10) : 1,
    };
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error.message || 'Failed to send SMS',
    };
  }
}
