import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AWS SNS configuration
const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1';

const snsConfigured = !!(awsAccessKeyId && awsSecretAccessKey);

/**
 * AWS Signature V4 helper for SNS
 */
async function hmacSha256(key: Uint8Array, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key as unknown as ArrayBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

async function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Promise<Uint8Array> {
  const kDate = new Uint8Array(await hmacSha256(new TextEncoder().encode('AWS4' + key), dateStamp));
  const kRegion = new Uint8Array(await hmacSha256(kDate, region));
  const kService = new Uint8Array(await hmacSha256(kRegion, service));
  const kSigning = new Uint8Array(await hmacSha256(kService, 'aws4_request'));
  return kSigning;
}

async function sha256Hash(message: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Send SMS via AWS SNS REST API (no SDK needed)
 */
async function sendSNSSMS(to: string, body: string): Promise<{ messageId: string; status: string }> {
  const service = 'sns';
  const host = `sns.${awsRegion}.amazonaws.com`;
  const endpoint = `https://${host}/`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const dateStamp = amzDate.slice(0, 8);

  const params = new URLSearchParams();
  params.append('Action', 'Publish');
  params.append('PhoneNumber', to);
  params.append('Message', body);
  params.append('MessageAttributes.entry.1.Name', 'AWS.SNS.SMS.SMSType');
  params.append('MessageAttributes.entry.1.Value.DataType', 'String');
  params.append('MessageAttributes.entry.1.Value.StringValue', 'Transactional');
  params.sort();

  const requestBody = params.toString();
  const payloadHash = await sha256Hash(requestBody);
  const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-date';
  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateStamp}/${awsRegion}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hash(canonicalRequest)}`;
  const signingKey = await getSignatureKey(awsSecretAccessKey!, dateStamp, awsRegion, service);
  const signature = Array.from(new Uint8Array(await hmacSha256(signingKey, stringToSign))).map(b => b.toString(16).padStart(2, '0')).join('');
  const authHeader = `AWS4-HMAC-SHA256 Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Amz-Date': amzDate,
      'Authorization': authHeader,
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AWS SNS error ${response.status}: ${errorText}`);
  }

  const responseText = await response.text();
  // Extract MessageId from XML response
  const messageIdMatch = responseText.match(/<MessageId>(.*?)<\/MessageId>/);
  const messageId = messageIdMatch ? messageIdMatch[1] : 'unknown';

  return { messageId, status: 'sent' };
}

/**
 * Check if it's the right hour to send SMS to a recipient based on their timezone
 * Returns true if the current hour in recipient's timezone matches their preferred send hour
 */
function shouldSendNow(timezone: string = 'America/New_York', preferredHour: number = 8): boolean {
  try {
    // Get current hour in recipient's timezone
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    };
    const currentHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now), 10);
    return currentHour === preferredHour;
  } catch (e) {
    // If timezone is invalid, default to always send (fallback behavior)
    console.warn(`Invalid timezone "${timezone}", defaulting to send`);
    return true;
  }
}

/**
 * Generate SMS message for a devotional (must fit in ~160 chars)
 */
function generateSMSMessage(
  dayContent: { title: string; scripture_reference: string },
  planId: string,
  dayNumber: number,
  recipientName?: string
): string {
  const name = recipientName ? `${recipientName}: ` : "";
  const title = dayContent.title.length > 35 ? dayContent.title.substring(0, 32) + "..." : dayContent.title;
  const scripture = dayContent.scripture_reference.length > 20
    ? dayContent.scripture_reference.substring(0, 17) + "..."
    : dayContent.scripture_reference;

  // Format: "Name: Day N - Title | Scripture\nlink"
  return `${name}Day ${dayNumber}: ${title}\n${scripture}\nphototheology.app/d/${planId}`;
}

/**
 * Generate a single devotional day on-demand
 */
async function generateDevotionalDay(
  supabase: any,
  planId: string,
  dayNumber: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return { success: false, error: "LOVABLE_API_KEY not configured" };
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('devotional_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return { success: false, error: "Plan not found" };
    }

    // Get personalization info if this is for a devotional profile
    let personName = "";
    let primaryIssue = "";
    let issueDescription = "";

    const { data: profile } = await supabase
      .from('devotional_profiles')
      .select('name, primary_issue, current_situation, issue_description_encrypted')
      .eq('active_plan_id', planId)
      .maybeSingle();

    if (profile) {
      personName = profile.name;
      primaryIssue = profile.primary_issue || "";

      // Prefer decrypted issue_description; fall back to current_situation
      if (profile.issue_description_encrypted) {
        const { data: decrypted, error: decErr } = await supabase.rpc('decrypt_token', {
          encrypted_token: profile.issue_description_encrypted,
        });
        if (!decErr && typeof decrypted === 'string') {
          issueDescription = decrypted;
        }
      }

      if (!issueDescription) {
        issueDescription = profile.current_situation || "";
      }
    }

    const forPersonNote = personName ? `\nThis devotional is written PERSONALLY for: ${personName}. Address ${personName} BY NAME at least 2-3 times throughout the devotional.` : "";
    const issueNote = primaryIssue
      ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}`
      : (issueDescription ? `\nSITUATION DETAILS: ${issueDescription}` : "");
    const systemPrompt = `You are Jeeves, the Phototheology devotional writer. Write devotionals as 3-5 FLOWING PARAGRAPHS of continuous prose.

FORMAT: NO bullet points. NO section headers. NO labeled parts. Just essay-style reading.
NEVER use "dear" in any form - no "Dear friend", "dear one", "my dear", etc.

${personName ? `CRITICAL PERSONALIZATION RULES:
- This devotional is for a SPECIFIC PERSON named ${personName}
- Address ${personName} BY NAME 2-3 times throughout (naturally woven in)
- Use their name at key moments: opening greeting, mid-devotional encouragement, closing charge
- Sound like a pastor writing a personal letter to ${personName}, not a generic template
- Example: "${personName}, consider how..." or "This is where you find yourself, ${personName}..."
- Their struggles become the ENTRY POINT to Christ's provision
- NEVER use "Dear ${personName}" - just use their name directly` : ""}

SAMPLE STYLE:
"At first glance, rest feels passive. Scripture seems to confirm it: 'Be still, and know that I am God.' Stillness sounds like absence—of effort, of struggle, of resistance. Yet when Israel was commanded to rest, it was not because nothing was happening, but because something sacred already was..."

Write 500-750 words of flowing, contemplative prose that:
- Uses 2-4 Scriptures woven naturally into the text
- Reveals unexpected connections
- Moves from observation → tension → illumination → call
- Ends with stillness or resolve, not hype`;

    // Add date for uniqueness
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const userPrompt = `Create day ${dayNumber} of a ${plan.duration}-day devotional on the theme: "${plan.theme}" for ${dateStr}.
${forPersonNote}${issueNote}

Generate ONLY day ${dayNumber} as flowing paragraphs. This day should build on the journey so far while offering FRESH insight.

CRITICAL REQUIREMENTS:
- Create a UNIQUE title (not generic like "Walking in Faith" or "Trust and Obey")
- Include at least ONE specific biblical example, story, or character to illustrate your point
- Paint vivid scenes from Scripture - don't just quote verses, tell the story
- The lesson must be DIFFERENT from typical devotional themes - find a fresh angle`;

    console.log(`Generating day ${dayNumber} for plan ${planId}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_devotional_days",
              description: "Return an array of devotional day objects.",
              parameters: {
                type: "object",
                properties: {
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day_number: { type: "integer" },
                        title: { type: "string", description: "UNIQUE evocative title (3-6 words) - avoid generic phrases like 'Walking in Faith', 'Trust in Him', etc. Be specific to THIS day's insight" },
                        scripture_reference: { type: "string", description: "Primary passage reference" },
                        devotional_text: { type: "string", description: "3-5 paragraph essay-style devotional (500-750 words). NO headers. NO bullet points." },
                        memory_hook: { type: "string", description: "One-line quotable insight" },
                      },
                      required: ["day_number", "title", "scripture_reference", "devotional_text", "memory_hook"],
                    },
                  },
                },
                required: ["days"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotional_days" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return { success: false, error: `AI generation failed: ${response.status}` };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      return { success: false, error: "No tool call in response" };
    }

    const argsObj = JSON.parse(toolCall.function.arguments);
    const days = argsObj.days;

    if (!Array.isArray(days) || days.length === 0) {
      return { success: false, error: "No days in response" };
    }

    const day = days[0];
    
    // Insert the generated day with new essay-style format
    const { error: insertError } = await supabase
      .from('devotional_days')
      .insert({
        plan_id: planId,
        day_number: day.day_number || dayNumber,
        title: day.title,
        scripture_reference: day.scripture_reference,
        devotional_text: day.devotional_text,
        memory_hook: day.memory_hook,
        // Legacy fields for backwards compatibility
        scripture_text: "",
        christ_connection: day.devotional_text?.substring(0, 500) || "",
        application: "",
        prayer: "",
        challenge: "",
        journal_prompt: "",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return { success: false, error: "Failed to save devotional day" };
    }

    console.log(`Day ${dayNumber} generated and saved for plan ${planId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error generating devotional day:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Daily Devotional Sender
 * 
 * This function:
 * 1. Finds all active devotional plans
 * 2. For each plan, checks which day should be unlocked based on started_at
 * 3. Generates the day's content if not already present
 * 4. Sends email with that day's content
 * 5. Creates in-app notification
 * 
 * Should be called daily via cron job at user's preferred time (default 6am)
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body for optional parameters
    let requestBody: { force?: boolean; planId?: string } = {};
    try {
      requestBody = await req.json();
    } catch {
      // No body or invalid JSON — that's fine for cron calls
    }
    const forceMode = requestBody.force === true;
    const filterPlanId = requestBody.planId || null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (forceMode) {
      console.log(`[FORCE MODE] Bypassing time checks. Plan filter: ${filterPlanId || 'none'}`);
    }

    console.log(`[${today}] Starting daily devotional delivery...`);

    // Get all active devotional plans with their users
    let plansQuery = supabase
      .from('devotional_plans')
      .select(`
        id,
        user_id,
        title,
        theme,
        duration,
        started_at,
        current_day
      `)
      .eq('status', 'active')
      .not('started_at', 'is', null);

    // If a specific plan is requested, filter to just that plan
    if (filterPlanId) {
      plansQuery = plansQuery.eq('id', filterPlanId);
    }

    const { data: activePlans, error: plansError } = await plansQuery;

    if (plansError) {
      console.error('Error fetching plans:', plansError);
      throw plansError;
    }

    console.log(`Found ${activePlans?.length || 0} active plans`);

    let emailsSent = 0;
    let notificationsCreated = 0;
    let smsSent = 0;

    for (const plan of activePlans || []) {
      try {
        // Calculate which day number should be available today
        const startedAt = new Date(plan.started_at);
        // Use UTC date boundaries to avoid timezone-related off-by-one errors
        const startDate = new Date(Date.UTC(startedAt.getUTCFullYear(), startedAt.getUTCMonth(), startedAt.getUTCDate()));
        const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const daysSinceStart = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const rawDayNumber = daysSinceStart + 1;
        const currentDayNumber = Math.min(rawDayNumber, plan.duration);

        console.log(`Plan ${plan.id}: Day ${currentDayNumber} of ${plan.duration}`);

        // If the plan has already run its course, mark it completed once and stop sending.
        if (rawDayNumber > plan.duration) {
          console.log(`Plan ${plan.id} exceeded duration, marking completed and skipping`);

          await supabase
            .from('devotional_plans')
            .update({
              status: 'completed',
              current_day: plan.duration,
              completed_at: new Date().toISOString(),
            })
            .eq('id', plan.id)
            .eq('status', 'active');

          continue;
        }

        // Check if we already sent for THIS DAY NUMBER today (prevent duplicates)
        // Must check day_number in metadata to allow multiple days per calendar day
        const { data: existingNotif } = await supabase
          .from('notifications')
          .select('id, metadata')
          .eq('user_id', plan.user_id)
          .eq('type', 'daily_devotional')
          .gte('created_at', `${today}T00:00:00`)
          .limit(10);

        const alreadySentForThisDay = existingNotif?.some(n => {
          const meta = n.metadata as { plan_id?: string; day_number?: number } | null;
          return meta?.plan_id === plan.id && meta?.day_number === currentDayNumber;
        });

        if (alreadySentForThisDay && !forceMode) {
          console.log(`Already sent devotional for plan ${plan.id} day ${currentDayNumber} today, skipping`);
          continue;
        }

        // Get today's devotional day content
        let { data: dayContent, error: dayError } = await supabase
          .from('devotional_days')
          .select('*')
          .eq('plan_id', plan.id)
          .eq('day_number', currentDayNumber)
          .single();

        // If content doesn't exist yet, generate it on-demand
        if (dayError || !dayContent) {
          console.log(`No content for plan ${plan.id} day ${currentDayNumber}, generating...`);
          
          const generateResult = await generateDevotionalDay(supabase, plan.id, currentDayNumber);
          
          if (!generateResult.success) {
            console.error(`Failed to generate day ${currentDayNumber}:`, generateResult.error);
            continue;
          }
          
          // Fetch the newly generated content
          const { data: newDayContent, error: newDayError } = await supabase
            .from('devotional_days')
            .select('*')
            .eq('plan_id', plan.id)
            .eq('day_number', currentDayNumber)
            .single();
          
          if (newDayError || !newDayContent) {
            console.error(`Still no content after generation for plan ${plan.id} day ${currentDayNumber}`);
            continue;
          }
          
          dayContent = newDayContent;
        }

        // Get user email
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(plan.user_id);

        if (userError || !userData?.user?.email) {
          console.error(`No email for user ${plan.user_id}:`, userError);
          continue;
        }

        const userEmail = userData.user.email;

        // Get user profile for name
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', plan.user_id)
          .single();

        const userName = profile?.display_name || 'Friend';

        // Get the devotional text - use new format if available, fall back to legacy
        const devotionalText = dayContent.devotional_text || dayContent.christ_connection || "";
        const memoryHook = dayContent.memory_hook || "";

        // Send email with today's devotional - essay style
        const emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white;">📖 Your Devotional Journey</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Day ${currentDayNumber} of ${plan.duration} · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #a78bfa; margin: 0 0 8px 0; font-size: 22px;">${dayContent.title}</h2>
              <p style="color: #8b5cf6; margin: 0 0 25px 0; font-size: 14px; font-style: italic;">${dayContent.scripture_reference}</p>
              
              <div style="color: #e4e4e7; line-height: 1.8; font-size: 16px;">
                ${devotionalText.split('\n\n').map((p: string) => `<p style="margin: 0 0 20px 0;">${p}</p>`).join('')}
              </div>
              
              ${memoryHook ? `
              <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 16px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="font-style: italic; color: #a78bfa; margin: 0; font-size: 15px;">"${memoryHook}"</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://phototheology.app/devotionals/${plan.id}"
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  📚 Continue Reading & Journal
                </a>
              </div>

              <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <p style="color: #a78bfa; font-size: 14px; margin: 0 0 12px 0; font-weight: bold;">✨ Explore the PhototheologyOS</p>
                <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 15px 0; line-height: 1.6;">
                  Deepen your understanding with visual memory tools, Hebrew/Greek word studies,
                  commentary insights, and more. Share these devotionals with friends!
                </p>
                <a href="https://phototheology.app/bible-study"
                   style="display: inline-block; background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; border: 1px solid rgba(139, 92, 246, 0.3);">
                  🔍 Explore PhototheologyOS →
                </a>
              </div>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding: 20px; text-align: center;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                Phototheology - Master Scripture Through Visual Memory
              </p>
              <p style="margin: 8px 0 0 0; color: #71717a; font-size: 11px;">
                <a href="https://phototheologybible.com/devotionals" style="color: #71717a;">Send devotionals to a friend</a>
                &nbsp;·&nbsp;
                <a href="https://phototheologybible.com/devotionals?unsubscribe=${plan.id}" style="color: #71717a;">Unsubscribe from this devotional</a>
              </p>
            </div>
          </div>
        `;

        const { error: emailError } = await resend.emails.send({
          from: "Phototheology Devotionals <devotionals@thephototheologyapp.com>",
          replyTo: "support@phototheologybible.com",
          to: userEmail,
          subject: `📖 Day ${currentDayNumber}: ${dayContent.title} — Your Devotional Journey (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Email error for ${userEmail}:`, emailError);
        } else {
          emailsSent++;
          console.log(`Email sent to ${userEmail} for day ${currentDayNumber}`);
        }

        // Create in-app notification
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: plan.user_id,
            type: 'daily_devotional',
            title: `📖 Day ${currentDayNumber}: ${dayContent.title}`,
            message: `Your devotional for today is ready!`,
            link: `/devotionals/${plan.id}`,
            metadata: {
              plan_id: plan.id,
              day_number: currentDayNumber,
              day_id: dayContent.id,
            },
          });

        if (notifError) {
          console.error(`Notification error for ${plan.user_id}:`, notifError);
        } else {
          notificationsCreated++;
        }

        // Update progress and close the plan once the final devotional has been delivered.
        const isFinalDay = currentDayNumber >= plan.duration;

        await supabase
          .from('devotional_plans')
          .update(
            isFinalDay
              ? {
                  current_day: currentDayNumber,
                  status: 'completed',
                  completed_at: new Date().toISOString(),
                }
              : { current_day: currentDayNumber }
          )
          .eq('id', plan.id);

        // Send SMS to opted-in recipients
        if (!snsConfigured) {
          console.warn(`[SMS] AWS SNS not configured (missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY). Skipping SMS for plan ${plan.id}.`);
        }
        if (snsConfigured) {
          try {
            // Get profiles with SMS enabled for this plan (include timezone)
            const { data: profilesWithSMS } = await supabase
              .from('devotional_profiles')
              .select('id, name, phone_number, phone_country_code, timezone, preferred_send_hour')
              .eq('active_plan_id', plan.id)
              .eq('sms_opt_in', true)
              .not('phone_number', 'is', null);

            // Get standalone SMS recipients for this plan (include timezone)
            const { data: smsRecipients } = await supabase
              .from('sms_devotional_recipients')
              .select('id, name, phone_number, phone_country_code, timezone, preferred_send_hour')
              .eq('plan_id', plan.id)
              .eq('is_active', true)
              .is('opted_out_at', null);

            const allSMSRecipients = [
              ...(profilesWithSMS || []).map(p => ({ ...p, recipientType: 'profile' as const })),
              ...(smsRecipients || []).map(r => ({ ...r, recipientType: 'standalone' as const }))
            ].filter(recipient => {
              if (forceMode) {
                console.log(`[FORCE] Including ${recipient.name} (time check bypassed)`);
                return true;
              }
              const tz = recipient.timezone || 'America/New_York';
              const hour = recipient.preferred_send_hour ?? 8;
              const send = shouldSendNow(tz, hour);
              if (!send) {
                console.log(`Skipping ${recipient.name} - not ${hour}:00 in ${tz} yet`);
              }
              return send;
            });

            console.log(`Found ${allSMSRecipients.length} SMS recipients for plan ${plan.id}`);

            for (const recipient of allSMSRecipients) {
              try {
                const fullPhone = `${recipient.phone_country_code || '+1'}${recipient.phone_number.replace(/\D/g, '')}`;
                const smsBody = generateSMSMessage(dayContent, plan.id, currentDayNumber, recipient.name);

                const message = await sendSNSSMS(fullPhone, smsBody);

                await supabase.from('sms_send_log').insert({
                  user_id: plan.user_id,
                  recipient_type: recipient.recipientType,
                  recipient_id: recipient.id,
                  phone_number: fullPhone,
                  plan_id: plan.id,
                  day_number: currentDayNumber,
                  message_body: smsBody,
                  twilio_sid: message.messageId,
                  status: message.status,
                });

                if (recipient.recipientType === 'profile') {
                  await supabase
                    .from('devotional_profiles')
                    .update({
                      last_sms_sent_at: new Date().toISOString(),
                      total_sms_sent: (await supabase.from('devotional_profiles').select('total_sms_sent').eq('id', recipient.id).single()).data?.total_sms_sent + 1 || 1
                    })
                    .eq('id', recipient.id);
                } else {
                  await supabase
                    .from('sms_devotional_recipients')
                    .update({
                      last_sms_sent_at: new Date().toISOString(),
                      total_sms_sent: (await supabase.from('sms_devotional_recipients').select('total_sms_sent').eq('id', recipient.id).single()).data?.total_sms_sent + 1 || 1,
                      last_delivery_status: message.status
                    })
                    .eq('id', recipient.id);
                }

                smsSent++;
                console.log(`SMS sent to ${recipient.name} at ${fullPhone}`);
              } catch (smsError: any) {
                console.error(`SMS error for ${recipient.name}:`, smsError.message);

                await supabase.from('sms_send_log').insert({
                  user_id: plan.user_id,
                  recipient_type: recipient.recipientType,
                  recipient_id: recipient.id,
                  phone_number: `${recipient.phone_country_code || '+1'}${recipient.phone_number}`,
                  plan_id: plan.id,
                  day_number: currentDayNumber,
                  status: 'failed',
                  error_message: smsError.message,
                });
              }
            }
          } catch (smsBlockError: any) {
            console.error(`Error in SMS block for plan ${plan.id}:`, smsBlockError.message);
          }
        }

      } catch (planError) {
        console.error(`Error processing plan ${plan.id}:`, planError);
      }
    }

    console.log(`Completed: ${emailsSent} emails, ${notificationsCreated} notifications, ${smsSent} SMS sent`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        notificationsCreated,
        smsSent,
        plansProcessed: activePlans?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-daily-devotional:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
