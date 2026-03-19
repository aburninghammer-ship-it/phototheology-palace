import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID") ?? "";
    const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "";
    const awsRegion = Deno.env.get("AWS_REGION") ?? "us-east-1";
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";

    if (!awsAccessKeyId || !awsSecretAccessKey) {
      throw new Error("Missing AWS credentials");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const forceNow = body.forceNow === true;

    const now = new Date();
    console.log(`[AudioDevSMS] Starting at ${now.toISOString()}${forceNow ? " (FORCE)" : ""}`);

    // Get active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("daily_devotional_sms_subscribers")
      .select("*")
      .eq("is_active", true);

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active subscribers" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = { sent: 0, skipped: 0, errors: 0, details: [] as any[] };

    for (const sub of subscribers) {
      // Check if it's the right hour for this subscriber
      if (!forceNow) {
        const subHour = getHourInTimezone(now, sub.timezone);
        if (subHour !== sub.preferred_send_hour) {
          results.skipped++;
          continue;
        }
      }

      // Check if already sent today
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const { data: alreadySent } = await supabase
        .from("daily_devotional_sms_log")
        .select("id")
        .eq("subscriber_id", sub.id)
        .gte("sent_at", todayStart.toISOString())
        .limit(1);

      if (alreadySent && alreadySent.length > 0 && !forceNow) {
        results.skipped++;
        continue;
      }

      // Get the user's display name from profiles
      let userName = "friend";
      if (sub.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, username")
          .eq("id", sub.user_id)
          .single();
        
        if (profile) {
          const displayName = profile.display_name || profile.username || "";
          userName = displayName.split(" ")[0] || "friend";
        }
      }

      // Get today's devotional
      const dayNumber = sub.current_day || 1;
      const { data: devotional } = await supabase
        .from("daily_audio_devotionals")
        .select("*")
        .eq("day_number", dayNumber)
        .eq("status", "ready")
        .single();

      if (!devotional) {
        results.skipped++;
        console.warn(`[AudioDevSMS] Day ${dayNumber} not ready, skipping`);
        continue;
      }

      // Generate personalized audio intro clip for this subscriber
      let personalizedAudioUrl: string | null = null;
      if (OPENAI_API_KEY && userName !== "friend") {
        try {
          personalizedAudioUrl = await generatePersonalizedIntro(
            supabase, OPENAI_API_KEY, sub.id, dayNumber, userName, devotional.title
          );
        } catch (introErr: any) {
          console.warn(`[AudioDevSMS] Intro generation failed for ${sub.id}: ${introErr.message}`);
        }
      }

      // Build personalized SMS with CTA
      const appUrl = "https://phototheology-palace.lovable.app";
      const cta = devotional.call_to_action 
        ? `\n💡 ${devotional.call_to_action.replace(/\{\{name\}\}/g, userName)}`
        : "";
      
      // Link to personalized audio if available, otherwise main devotional
      const listenUrl = personalizedAudioUrl
        ? `${appUrl}/daily-devotional?intro=${encodeURIComponent(personalizedAudioUrl)}`
        : `${appUrl}/daily-devotional`;

      const smsBody = `📖 ${userName}, Day ${dayNumber}: ${devotional.title}\n` +
        `🎧 Listen: ${listenUrl}\n` +
        `"${devotional.scripture_reference}"` +
        cta +
        `\n-Phototheology Palace`;

      const phoneNumber = `${sub.phone_country_code}${sub.phone_number}`;
      const sendResult = await sendSNSSMS(awsAccessKeyId, awsSecretAccessKey, awsRegion, phoneNumber, smsBody);

      // Log
      await supabase.from("daily_devotional_sms_log").insert({
        subscriber_id: sub.id,
        devotional_id: devotional.id,
        day_number: dayNumber,
        phone_number: phoneNumber,
        message_body: smsBody,
        sns_message_id: sendResult.messageId || null,
        status: sendResult.success ? "sent" : "failed",
        error_message: sendResult.errorMessage || null,
      });

      if (sendResult.success) {
        const nextDay = dayNumber >= 365 ? 1 : dayNumber + 1;
        await supabase
          .from("daily_devotional_sms_subscribers")
          .update({ current_day: nextDay, last_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("id", sub.id);
        results.sent++;
      } else {
        results.errors++;
      }

      results.details.push({
        subscriber: sub.id,
        day: dayNumber,
        userName,
        hasPersonalizedIntro: !!personalizedAudioUrl,
        status: sendResult.success ? "sent" : "failed",
        error: sendResult.errorMessage,
      });
    }

    console.log(`[AudioDevSMS] Done: sent=${results.sent}, skipped=${results.skipped}, errors=${results.errors}`);
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[AudioDevSMS] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate a short personalized intro clip (~5 seconds) with the subscriber's name.
 * E.g. "Good morning, David! Here's your devotional for today."
 * Cached per subscriber+day so re-runs don't regenerate.
 */
async function generatePersonalizedIntro(
  supabase: any,
  openaiKey: string,
  subscriberId: string,
  dayNumber: number,
  userName: string,
  devotionalTitle: string,
): Promise<string | null> {
  const storagePath = `intros/${subscriberId}/day-${String(dayNumber).padStart(3, "0")}.mp3`;

  // Check if already generated
  const { data: existing } = supabase.storage
    .from("daily-devotional-audio")
    .getPublicUrl(storagePath);

  // Quick existence check via HEAD
  try {
    const headResp = await fetch(existing.publicUrl, { method: "HEAD" });
    if (headResp.ok) {
      console.log(`[AudioDevSMS] Intro already exists for ${subscriberId} day ${dayNumber}`);
      return existing.publicUrl;
    }
  } catch { /* not found, generate */ }

  // Pick a greeting based on time of day variety
  const greetings = [
    `Good morning, ${userName}! Here's your devotional for today.`,
    `Hey ${userName}! Take a moment with God's Word today.`,
    `${userName}, God has something special for you today. Let's listen.`,
    `Welcome back, ${userName}! Day ${dayNumber}: ${devotionalTitle}.`,
    `${userName}, pause for just a few minutes. God is speaking to you today.`,
  ];
  const introText = greetings[dayNumber % greetings.length];

  // Generate short TTS clip
  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: introText,
      voice: "nova",
      response_format: "mp3",
      speed: 1.0,
    }),
  });

  if (!ttsResponse.ok) {
    const errText = await ttsResponse.text();
    throw new Error(`TTS intro failed: ${ttsResponse.status} - ${errText}`);
  }

  const audioBuffer = new Uint8Array(await ttsResponse.arrayBuffer());

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("daily-devotional-audio")
    .upload(storagePath, audioBuffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("daily-devotional-audio")
    .getPublicUrl(storagePath);

  console.log(`[AudioDevSMS] Generated intro for ${userName} day ${dayNumber}`);
  return urlData.publicUrl;
}

function getHourInTimezone(date: Date, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find(p => p.type === "hour");
    return hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
  } catch {
    return date.getUTCHours();
  }
}

// AWS Signature V4 helper for SNS
async function sendSNSSMS(
  accessKeyId: string, secretAccessKey: string, region: string,
  phoneNumber: string, message: string
): Promise<{ success: boolean; messageId?: string; errorMessage?: string }> {
  try {
    const endpoint = `https://sns.${region}.amazonaws.com/`;
    const params = new URLSearchParams({
      Action: "Publish",
      PhoneNumber: phoneNumber,
      Message: message,
      "MessageAttributes.entry.1.Name": "AWS.SNS.SMS.SMSType",
      "MessageAttributes.entry.1.Value.DataType": "String",
      "MessageAttributes.entry.1.Value.StringValue": "Transactional",
    });

    const body = params.toString();
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const dateStamp = amzDate.slice(0, 8);

    const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:sns.${region}.amazonaws.com\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "content-type;host;x-amz-date";
    const bodyHash = await sha256Hex(new TextEncoder().encode(body).buffer);
    const canonicalRequest = ["POST", "/", "", canonicalHeaders, signedHeaders, bodyHash].join("\n");

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/sns/aws4_request`;
    const stringToSign = [algorithm, amzDate, credentialScope, await sha256Hex(new TextEncoder().encode(canonicalRequest).buffer)].join("\n");

    const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, "sns");
    const signature = await hmacHex(signingKey, stringToSign);

    const authHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Amz-Date": amzDate, Authorization: authHeader },
      body,
    });

    const responseText = await response.text();
    if (!response.ok) {
      const msgMatch = responseText.match(/<Message>([^<]+)<\/Message>/);
      return { success: false, errorMessage: msgMatch?.[1] || `SNS error: ${response.status}` };
    }

    const idMatch = responseText.match(/<MessageId>([^<]+)<\/MessageId>/);
    return { success: true, messageId: idMatch?.[1] };
  } catch (error: any) {
    return { success: false, errorMessage: error.message };
  }
}

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}

async function hmacHex(key: ArrayBuffer, data: string): Promise<string> {
  const sig = await hmacSha256(key, data);
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getSigningKey(secretKey: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(new TextEncoder().encode("AWS4" + secretKey).buffer, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, "aws4_request");
}
