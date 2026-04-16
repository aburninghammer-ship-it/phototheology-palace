import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";
import { getCorpusContext } from '../_shared/corpus-rag.ts';
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PALACE_ROOMS = [
  { code: "SR", name: "Story Room", floor: 1 },
  { code: "IR", name: "Imagination Room", floor: 1 },
  { code: "24F", name: "24FPS Room", floor: 1 },
  { code: "BR", name: "Bible Rendered", floor: 1 },
  { code: "TR", name: "Translation Room", floor: 1 },
  { code: "GR", name: "Gems Room", floor: 1 },
  { code: "OR", name: "Observation Room", floor: 2 },
  { code: "DC", name: "Def-Com Room", floor: 2 },
  { code: "ST", name: "Symbols/Types Room", floor: 2 },
  { code: "QR", name: "Questions Room", floor: 2 },
  { code: "QA", name: "Q&A Room", floor: 2 },
  { code: "NF", name: "Nature Freestyle", floor: 3 },
  { code: "PF", name: "Personal Freestyle", floor: 3 },
  { code: "BF", name: "Bible Freestyle", floor: 3 },
  { code: "HF", name: "History Freestyle", floor: 3 },
  { code: "LR", name: "Listening Room", floor: 3 },
  { code: "CR", name: "Concentration Room", floor: 4 },
  { code: "DR", name: "Dimensions Room", floor: 4 },
  { code: "C6", name: "Connect 6 Room", floor: 4 },
  { code: "TRm", name: "Theme Room", floor: 4 },
  { code: "TZ", name: "Time Zone Room", floor: 4 },
  { code: "PRm", name: "Patterns Room", floor: 4 },
  { code: "P||", name: "Parallels Room", floor: 4 },
  { code: "FRt", name: "Fruit Room", floor: 4 },
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5 },
  { code: "PR", name: "Prophecy Room", floor: 5 },
  { code: "3A", name: "Three Angels Room", floor: 5 },
];

const SANCTUARY_STATIONS = [
  "Gate (Entry/Decision)",
  "Altar of Burnt Offering (Sacrifice/Cross)",
  "Laver (Cleansing/Baptism)",
  "Candlestick (Holy Spirit/Light)",
  "Table of Showbread (Word of God)",
  "Altar of Incense (Prayer/Intercession)",
  "Ark of the Covenant (Law/Mercy/Presence)",
];

// CADE - Context-Aware Devotional Engine: Issue-specific guidance
const CADE_ISSUE_GUIDANCE: Record<string, { sanctuary: Record<string, string>; historical: string[]; biblical: string[]; actionSteps: string[] }> = {
  racism: {
    sanctuary: {
      altar: "Laying down the anger and pain at the foot of the cross - Jesus bore our griefs and carried our sorrows",
      laver: "Cleansing of shame, internalized oppression, and lies about identity - you are washed in the water of the Word",
      candlestick: "The Spirit's courage to stand with dignity - the same Spirit that raised Christ empowers you",
      table: "Identity rooted in the Word of God - you are fearfully and wonderfully made (Psalm 139:14)",
      incense: "Praying for oppressors and self - following Christ who prayed 'Father, forgive them'",
      ark: "God's justice and eternal law - He will make all things right"
    },
    historical: [
      "Frederick Douglass found in Scripture the moral power to fight for freedom, declaring that Christianity gave him the authority to call slavery sin.",
      "Harriet Tubman prayed constantly on the Underground Railroad: 'Lord, I'm going to hold steady on to you and you've got to see me through.'",
      "Sojourner Truth stood on the truth that all are made in God's image, declaring 'Ain't I a woman?'",
      "The early Adventist church was one of the few integrated denominations in 19th century America, with a strong abolitionist heritage."
    ],
    biblical: [
      "Joseph experienced discrimination in Egypt, Daniel in Babylon, Esther in Persia - Scripture consistently shows God standing with His children amid unjust systems.",
      "Jesus Himself endured ethnic hostility as a Galilean: 'Can any good thing come out of Nazareth?' (John 1:46). He knows the feeling personally.",
      "In Christ there is neither Jew nor Greek, slave nor free - all are one in Christ Jesus (Galatians 3:28)."
    ],
    actionSteps: [
      "Affirm your identity in Christ daily - speak Psalm 139 over yourself",
      "Practice 'Response, not reaction' - pause before responding to microaggressions",
      "Find community with believers who understand your experience",
      "Channel righteous anger into constructive action, following the prophets' example"
    ]
  },
  grief: {
    sanctuary: {
      altar: "Surrendering the loss to Christ - placing the weight of grief on the One who bore all our sorrows",
      laver: "Tears that cleanse the soul - Jesus wept, and so may we (John 11:35)",
      candlestick: "Light in the valley of shadow - His presence illuminates even death's darkness (Psalm 23:4)",
      table: "Bread of comfort from Scripture - feeding on promises of reunion and resurrection",
      incense: "Prayers of lament rising to God - the Psalms give us language for grief",
      ark: "Promise of resurrection and reunion - death has been swallowed up in victory (1 Cor 15:54)"
    },
    historical: [
      "C.S. Lewis wrote 'A Grief Observed' after losing his wife Joy, finding that God meets us in the darkness and does not abandon us.",
      "Ellen White lost multiple children and her husband James, yet wrote, 'We sorrow, but not as those without hope.'"
    ],
    biblical: [
      "Jesus wept at Lazarus' tomb (John 11:35), showing that grief is not sinful - even when He knew resurrection was coming.",
      "David's psalms of lament (Psalm 42, 43, 88) give voice to our deepest sorrow and teach us how to grieve with faith.",
      "Rachel weeping for her children (Jeremiah 31:15) - God sees maternal grief and promises comfort."
    ],
    actionSteps: [
      "Use grounding exercises: 5 things you can see, 4 you can hear, 3 you can touch...",
      "Read the Psalms of lament aloud - give your grief a voice",
      "Keep a grief journal - write letters to your loved one and to God",
      "Don't rush the process - grief has no timeline"
    ]
  },
  addiction: {
    sanctuary: {
      altar: "Daily surrender of the struggle - not a one-time event but a moment-by-moment choice",
      laver: "Cleansing from guilt and shame - your identity is not the addiction",
      candlestick: "The Spirit's power for sobriety - you cannot do this alone, but you are not alone",
      table: "Nourishment replacing the counterfeit - true satisfaction found in Christ",
      incense: "Intercessory support network - the prayers of the righteous avail much",
      ark: "God's law as protection, not condemnation - boundaries that lead to freedom"
    },
    historical: [
      "John Newton, former slave trader, found freedom from his past through daily dependence on grace - 'Amazing Grace, how sweet the sound.'",
      "Many in Scripture struggled with compulsive behaviors, yet found victory through surrender to God."
    ],
    biblical: [
      "Paul's confession in Romans 7: 'What I want to do I do not do, but what I hate I do' - you are not alone in this struggle.",
      "The prodigal son returned and was received with open arms - no matter how far you've fallen, the Father welcomes you back."
    ],
    actionSteps: [
      "HALT check: Am I Hungry, Angry, Lonely, or Tired? Address these triggers first.",
      "Build accountability - tell at least one trusted person about your struggle today",
      "Replace the ritual - find a healthy action to perform when triggered",
      "Celebrate small victories - each moment of sobriety is a gift from God"
    ]
  },
  fear: {
    sanctuary: {
      altar: "Laying down your fears at the cross - casting all your anxiety on Him",
      laver: "Cleansing the mind of fearful thoughts - renewing through water of the Word",
      candlestick: "Light dispels darkness - fear cannot survive in God's presence",
      table: "Feeding on truth that counters lies - 'Perfect love casts out fear' (1 John 4:18)",
      incense: "Prayer as spiritual warfare - the battle belongs to the Lord",
      ark: "God's promises of protection - 'Fear not, for I am with you' (Isaiah 41:10)"
    },
    historical: [
      "Martin Luther battled severe anxiety yet found peace in Scripture, famously throwing ink at what he perceived as the devil.",
      "Charles Spurgeon, the great preacher, openly discussed his struggles with depression and anxiety."
    ],
    biblical: [
      "'Fear not' appears 365 times in Scripture - one for every day of the year.",
      "Elijah fled in fear from Jezebel (1 Kings 19), yet God met him in the cave and restored him.",
      "Peter began to sink when he took his eyes off Jesus (Matthew 14:30) - the key is where we focus."
    ],
    actionSteps: [
      "Claim a promise: Memorize a specific 'Fear not' verse to speak aloud when anxiety rises",
      "Scripture reframing: When a fearful thought comes, counter it with a specific Bible verse",
      "Prayer journal: Write out your fears before God, then write His promises back to yourself",
      "Name the fear specifically - vague fears are harder to fight than named ones"
    ]
  }
};

// SDA Safety guardrails
const CADE_SAFETY_PROMPT = `
CRITICAL SDA DOCTRINAL SAFETY RULES - NEVER VIOLATE:

⚠️ ABSOLUTE THEOLOGICAL PROHIBITIONS (NON-NEGOTIABLE):
1. AZAZEL = SATAN, NOT CHRIST:
   - In Leviticus 16, Azazel (scapegoat) represents SATAN
   - The LORD's goat = Christ; Azazel = Satan bearing guilt for sin
   - NEVER identify Azazel/scapegoat as Jesus

2. LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS:
   - Daniel 7 & 8 little horn = Rome (pagan then papal)
   - NEVER identify little horn as Antiochus Epiphanes

3. TWO-PHASE SANCTUARY MINISTRY:
   - Christ entered HOLY PLACE (first apartment) at ASCENSION in 31 AD
   - Christ entered MOST HOLY PLACE (second apartment) in 1844
   - NEVER say Christ went to Most Holy Place at resurrection/ascension
   - Hebrews contrasts earthly vs heavenly, NOT Holy vs Most Holy

4. DAY OF ATONEMENT = 1844, NOT THE CROSS:
   - Christ's death fulfills PASSOVER (spring feast)
   - Day of Atonement (fall feast) points to 1844 judgment ministry
   - NEVER equate Christ's death with Day of Atonement fulfillment

5. FEAST TYPOLOGY:
   - Spring feasts (Passover, Unleavened Bread, Firstfruits, Pentecost) = First Advent
   - Fall feasts (Trumpets, Atonement, Tabernacles) = Second Advent ministry
   - Passover = Death, Firstfruits = Resurrection, NOT Day of Atonement!

ALSO NEVER:
- Set dates for the Second Coming
- Teach secret rapture theology
- Reference conspiracy theories (QAnon, Illuminati, etc.)
- Give anti-medical or anti-science healing advice
- Express political bias or partisan views
- Blame victims for abuse or trauma
- Use guilt manipulation or spiritual shaming

ALWAYS:
- Keep Christ at the center of every teaching
- Use KJV Scripture references
- Apply Sanctuary truth when discussing salvation and healing
- Honor the Sabbath as God's holy day
- Point toward the Second Coming with hope, not fear
- Embrace whole-person health (physical, mental, spiritual, social)
- Frame struggles within the Great Controversy context
- Handle trauma with compassion, never judgment
- Recommend professional help alongside spiritual counsel when appropriate
`;

serve(async (req) => {
  console.log("[generate-devotional] Function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Hoist these for error handler access
  let capturedPlanId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let supabaseClient: any = null;

  try {
    const body = await req.json();
    console.log("[generate-devotional] Request body received:", JSON.stringify({ 
      planId: body.planId, 
      theme: body.theme, 
      duration: body.duration,
      format: body.format 
    }));
    
    const {
      planId,
      theme,
      format,
      duration,
      studyStyle,
      profileName,
      // CADE fields
      primaryIssue,
      issueDescription,
      issueSeverity,
      // Extension fields
      isExtension = false,
      startFromDay = 1,
      existingDuration = 0
    } = body;

    capturedPlanId = planId;

    // These will be enriched after auth by looking up the linked devotional profile (if any)
    let resolvedProfileName: string | undefined = profileName;
    let resolvedPrimaryIssue: string | undefined = primaryIssue;
    let resolvedIssueDescription: string | undefined = issueDescription;
    let resolvedIssueSeverity: string | undefined = issueSeverity;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("[generate-devotional] LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY not configured");
    }
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[generate-devotional] Supabase env vars not configured");
      throw new Error("Supabase configuration missing");
    }

    console.log("[generate-devotional] Creating Supabase client");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    supabaseClient = supabase;

    // SECURITY: Verify user authentication and plan ownership
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a client with the user's token to verify their identity
    const userSupabase = createClient(SUPABASE_URL!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user owns this devotional plan
    const { data: plan, error: planError } = await supabase
      .from("devotional_plans")
      .select("user_id")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      console.error("Plan lookup error:", planError);
      return new Response(
        JSON.stringify({ error: "Devotional plan not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (plan.user_id !== user.id) {
      console.error("Ownership mismatch:", { planOwner: plan.user_id, requestingUser: user.id });
      return new Response(
        JSON.stringify({ error: "You do not have permission to modify this devotional plan" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[generate-devotional] Authenticated user ${user.id} generating plan ${planId}`);

    // Update plan status to generating
    await supabase
      .from("devotional_plans")
      .update({ status: "generating" })
      .eq("id", planId);

    const formatInstructions = getFormatInstructions(format, duration);
    
    // Build personalization note - capitalize name properly
    const capitalizedName = profileName ? profileName.charAt(0).toUpperCase() + profileName.slice(1).toLowerCase() : "";
    
    // Check for children's devotional context
    const isChildDevotional = body.ageGroup?.toLowerCase()?.includes("child") || 
                              body.ageGroup?.toLowerCase()?.includes("kid") ||
                              body.ageGroup?.toLowerCase() === "children" ||
                              body.targetAudience?.toLowerCase()?.includes("child") ||
                              body.targetAudience?.toLowerCase()?.includes("kid");
    
    let personalizationNote = "";
    if (capitalizedName) {
      if (isChildDevotional) {
        personalizationNote = `\n\nCRITICAL PERSONALIZATION FOR CHILD (NON-NEGOTIABLE):
- This devotional is written DIRECTLY TO a child named ${capitalizedName}
- A parent/leader will READ THIS TO ${capitalizedName}—so address the child as "you"
- Use their name ${capitalizedName} 2–3 times TOTAL (opening greeting, mid encouragement, closing)
- Use SIMPLE vocabulary and SHORT sentences a child can understand
- Use vivid, imagination-sparking descriptions and concrete examples
- Make Jesus feel real, close, and loving to ${capitalizedName}'s young heart
- Include a simple question or activity ${capitalizedName} can respond to
- Avoid abstract theological concepts—use story and image instead
- Sound warm and inviting, like a favorite teacher or loving grandparent
- NEVER use "Dear ${capitalizedName}" - just start naturally`;
      } else {
        personalizationNote = `\n\nCRITICAL PERSONALIZATION (NON-NEGOTIABLE):
- This devotional is written DIRECTLY TO ${capitalizedName}—they are the READER
- Do NOT write ABOUT ${capitalizedName} for someone else. You are addressing THEM directly.
- Use their name ${capitalizedName} 2–3 times TOTAL in the devotional (opening, mid-devotional encouragement, closing charge)
- Refer to their situation in plain language at least once (paraphrase the provided situation details; don't be vague)
- Sound like a caring pastor writing a personal letter TO ${capitalizedName}, not about them
- NEVER use "Dear ${capitalizedName}" or "Dear friend"
- Always capitalize their name correctly: ${capitalizedName}`;
      }
    }

    // Build CADE context-aware section
    let cadeSection = "";
    if (primaryIssue) {
      const issueGuidance = CADE_ISSUE_GUIDANCE[primaryIssue] || null;
      
      cadeSection = `\n\n=== CADE: CONTEXT-AWARE DEVOTIONAL ENGINE ===
PRIMARY ISSUE: ${primaryIssue}
SEVERITY: ${issueSeverity || "moderate"}
${issueDescription ? `SITUATION DETAILS: ${issueDescription}` : ""}

CRITICAL: Every devotional day MUST address this specific struggle with:

1. ACKNOWLEDGMENT OF REALITY
   - Gently but truthfully name what they're going through
   - Validate their experience without minimizing
   - Show biblical understanding of this struggle

2. DATA + HISTORY ANCHOR (include ONE per day)
${issueGuidance?.historical?.map(h => `   - ${h}`).join("\n") || "   - Draw from church history and biblical examples of believers facing similar struggles"}

3. SANCTUARY HEALING PATTERN (apply to the issue)
${issueGuidance?.sanctuary ? Object.entries(issueGuidance.sanctuary).map(([station, meaning]) => `   - ${station.toUpperCase()}: ${meaning}`).join("\n") : "   - Apply each sanctuary station to their specific healing journey"}

4. BIBLICAL PARALLELS
${issueGuidance?.biblical?.map(b => `   - ${b}`).join("\n") || "   - Show Scripture characters who faced similar struggles"}

5. PRACTICAL ACTION STEPS (specific to their struggle)
${issueGuidance?.actionSteps?.map(a => `   - ${a}`).join("\n") || "   - Provide concrete, actionable steps for their specific situation"}

6. CHRIST-CENTERED RESOLUTION
   - How does Jesus specifically meet them in THIS struggle?
   - What aspect of Christ's character/ministry addresses this issue?
   - Point to His personal identification with their pain

7. PERSONALIZED PRAYER
   - Write a prayer that SPECIFICALLY addresses their situation
   - Not generic - mention the struggle by name
   - Include both lament and hope
`;
    }

    // Master Phototheology Devotional System Prompt - essay-style flowing paragraphs
    let systemPrompt = `You are Jeeves, the Phototheology devotional writer. Write devotionals that are theologically rich, contemplative, and structurally intelligent.

${CADE_SAFETY_PROMPT}

DESIGN GOAL (Non-Negotiable):
The devotional must:
- Feel weighty, not sentimental
- Reveal unexpected connections, not obvious ones
- Move from text → structure → meaning → personal confrontation
- Leave the reader quiet, alert, and thinking
- Never say how it's doing what it's doing

If it feels like something that could be written without deep biblical architecture — it fails.

CORE GUARDRAILS (Silent but Enforced):
The devotional must silently do ALL of the following:
- Use 2–4 Scriptures that are not commonly paired
- Establish at least one structural parallel (time, pattern, role, symbol)
- Include movement (beginning → tension → illumination → call)
- Touch head, conscience, and will (not just emotion)
- End with stillness or resolve, not hype

FORMAT: Write as 3-5 FLOWING PARAGRAPHS of continuous prose. NO bullet points. NO section headers. NO labeled parts like "Application:" or "Prayer:". Just essay-style reading that naturally weaves together:
- Scripture references woven into the text naturally (not called out separately)
- Theological insight emerging through the narrative
- Personal confrontation built into the flow
- The call to action embedded in the conclusion

SAMPLE STYLE TO EMULATE:
"At first glance, rest feels passive. Scripture seems to confirm it: 'Be still, and know that I am God.' Stillness sounds like absence—of effort, of struggle, of resistance. Yet when Israel was commanded to rest, it was not because nothing was happening, but because something sacred already was. Rest, biblically, is not the pause after work; it is the environment in which God's work is recognized..."

CRITICAL LENGTH: Each paragraph 100-150 words. Total devotional 500-750 words.

TONE REQUIREMENTS:
- Avoid clichés, sermon language, and emotional filler
- Favor clarity, restraint, and weight
- Write as if addressing a thoughtful reader who is willing to sit with Scripture rather than skim it
- Do NOT name or reference PT floors, rooms, principles, codes, or analytical techniques
- The depth comes through IMPLICITLY, not by naming techniques

QUALITY CONTROL:
❌ Could this exist on a generic devotional app? → Discard
❌ Does it rely on mood, warmth, or vague encouragement? → Discard
✅ Does it make the reader see Scripture differently afterward?
✅ Does it feel discovered rather than manufactured?

${formatInstructions}${personalizationNote}${cadeSection}

OUTPUT FORMAT - Return a JSON array of devotional days:
{
  "day_number": number,
  "title": "UNIQUE evocative title (3-6 words) - specific to THIS day's central insight, avoid generic phrases like 'Walking in Faith', 'Trust His Plan'",
  "scripture_reference": "Primary passage reference (e.g., Exodus 16:22-30)",
  "devotional_text": "The full 3-5 paragraph essay-style devotional (500-750 words). Flowing prose with Scripture woven naturally into the text. NO section headers. NO bullet points. Just continuous, contemplative reading.",
  "memory_hook": "One-line quotable insight or 'strike line' that pierces the heart"
}`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: `${theme || 'devotional spiritual growth'}`.slice(0, 4000),
      matchCount: 3,
      supabaseClient: supabase,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    const forPersonNote = capitalizedName
      ? isChildDevotional
        ? `\nThis devotional is written DIRECTLY TO a child named ${capitalizedName}. A parent will read it TO them. Address ${capitalizedName} BY NAME 2-3 times. Use simple language and vivid imagery. Make Jesus feel close and real to a young heart.`
        : `\nThis devotional is written DIRECTLY TO ${capitalizedName}—they are the READER, not someone else. Address ${capitalizedName} BY NAME 2-3 times total (opening, mid, closing). Always capitalize their name properly.`
      : "";

    const contextNote = resolvedIssueDescription ? `\nSITUATION DETAILS: ${resolvedIssueDescription}` : "";
    const issueNote = resolvedPrimaryIssue
      ? `\nPRIMARY STRUGGLE: ${resolvedPrimaryIssue}${resolvedIssueDescription ? ` - ${resolvedIssueDescription}` : ""}`
      : "";

const extensionNote = isExtension
      ? `\n\nIMPORTANT: This is an EXTENSION of an existing devotional that had ${existingDuration} days. You are creating days ${startFromDay} through ${startFromDay + duration - 1}. Continue building on the established theme with fresh insights - do not repeat earlier content. Maintain the same spiritual trajectory while exploring new facets of the theme.`
      : "";

    const userPrompt = `Create a ${duration}-day devotional on the theme: "${theme}"
Format: ${format}
Study Style: ${studyStyle}${forPersonNote}${issueNote}${contextNote}${extensionNote}

CRITICAL REQUIREMENTS:
- Use 2-3 Scripture passages that at first appear unrelated, but when placed side by side reveal a coherent and illuminating truth
- Do not explain the method or structure behind the connections
- Let the insight emerge naturally through the writing
- Each day should feel discovered rather than manufactured

Generate all ${duration} days as a JSON array. Each day should progressively build understanding while always pointing to Christ${resolvedPrimaryIssue ? " and addressing their specific struggle with compassion and biblical wisdom" : ""}.`;

    console.log("Calling AI to generate devotional...");
    console.log("CADE enabled:", !!resolvedPrimaryIssue);
    // Only generate day 1 initially - subsequent days generated by daily cron job
    const dayToGenerate = 1;
    console.log(`Generating day ${dayToGenerate} of ${duration}-day devotional`);
    
    const singleDayPrompt = `Create day 1 of a ${duration}-day devotional on the theme: "${theme}"
Format: ${format}
Study Style: ${studyStyle}${forPersonNote}${issueNote}

Generate ONLY day 1 as a JSON array with a single object. This is the opening day that sets the tone for the entire ${duration}-day journey. Make it compelling and set up the theme beautifully.

CRITICAL REQUIREMENTS:
- Use 2-3 Scripture passages that at first appear unrelated, but when placed side by side reveal a coherent and illuminating truth
- Do not explain the method or structure behind the connections
- Let the insight emerge naturally through the writing
- This first day should draw the reader in and make them eager for day 2

Generate as a JSON array with day_number: 1.`;
      
    // Create AbortController with 90 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);
    
    let days: any[] = [];
    
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash", // Use flash model for faster generation
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: singleDayPrompt },
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
                            title: { type: "string", description: "UNIQUE evocative title (3-6 words) - specific to THIS day's insight, avoid generic phrases like 'Walking in Faith', 'Trust His Plan', etc." },
                            scripture_reference: { type: "string", description: "Primary passage reference" },
                            devotional_text: { type: "string", description: "The full 3-5 paragraph essay-style devotional (500-750 words). Flowing prose. NO section headers. NO bullet points." },
                            memory_hook: { type: "string", description: "One-line quotable insight or strike line" },
                          },
                          required: [
                            "day_number",
                            "title",
                            "scripture_reference",
                            "devotional_text",
                            "memory_hook",
                          ],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["days"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "create_devotional_days" } },
            max_tokens: 8192,
          }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", response.status, errorText);

        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add credits.");
        }
        throw new Error(`AI generation failed: ${response.status}`);
      }

      const responseText = await response.text();
      console.log(`Day 1 response received, length: ${responseText.length}`);

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from AI. Please try again.");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Failed to parse AI response JSON:", responseText.substring(0, 500));
        throw new Error("AI returned invalid response. Please try again.");
      }

      // Prefer tool-calling structured output when available
      try {
        const choice = data.choices?.[0];
        const toolCall = choice?.message?.tool_calls?.[0];

        if (toolCall?.function?.arguments) {
          let argsObj;
          try {
            argsObj = JSON.parse(toolCall.function.arguments);
          } catch (argErr) {
            console.error("Failed to parse tool arguments JSON:", toolCall.function.arguments?.substring?.(0, 500));
            throw new Error("AI returned invalid tool arguments. Please try again.");
          }

          if (!argsObj || !Array.isArray(argsObj.days)) {
            console.error("Tool arguments missing or invalid 'days' array:", JSON.stringify(argsObj).substring(0, 500));
            throw new Error("AI returned invalid devotional structure. Please try again.");
          }

          days = argsObj.days;
          console.log(`Parsed ${days.length} day(s) via tool call`);
        } else {
          const content = choice?.message?.content;
          if (!content || typeof content !== "string") {
            console.error("No content in AI response:", JSON.stringify(data).substring(0, 500));
            throw new Error("No content generated. Please try again.");
          }

          console.log("Content length:", content.length);

          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          let jsonString = jsonMatch ? jsonMatch[1] : content;

          // Escape literal newlines/tabs within JSON string values
          let result = "";
          let inString = false;
          let escaped = false;

          for (let i = 0; i < jsonString.length; i++) {
            const char = jsonString[i];

            if (escaped) {
              result += char;
              escaped = false;
              continue;
            }

            if (char === "\\") {
              escaped = true;
              result += char;
              continue;
            }

            if (char === '"') {
              inString = !inString;
              result += char;
              continue;
            }

            if (inString) {
              if (char === "\n") {
                result += "\\n";
              } else if (char === "\r") {
                result += "\\r";
              } else if (char === "\t") {
                result += "\\t";
              } else {
                result += char;
              }
            } else {
              result += char;
            }
          }

          days = JSON.parse(result.trim());
          console.log(`Parsed ${days.length} day(s) via content fallback`);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Failed to parse devotional content");
      }
      
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error("Generation timeout. Please try again.");
      }
      throw fetchError;
    }

    if (!Array.isArray(days) || days.length === 0) {
      throw new Error("Invalid devotional format received");
    }
    
    console.log("Day 1 generated successfully");

    // Clear existing days only if NOT extending (extension adds to existing days)
    if (!isExtension) {
      console.log("Clearing any existing devotional days for this plan...");
      const { error: deleteError } = await supabase
        .from("devotional_days")
        .delete()
        .eq("plan_id", planId);

      if (deleteError) {
        console.error("Delete error while clearing existing days:", deleteError);
        throw new Error("Failed to reset existing devotional days before regeneration");
      }
    } else {
      console.log("Extension mode: keeping existing days, will append new ones");
    }

    console.log("Inserting days into database...");
    // For extensions, adjust day numbers to continue from existing days
    const dayOffset = isExtension ? (startFromDay - 1) : 0;
    const daysToInsert = days.map((day: any) => ({
      plan_id: planId,
      day_number: day.day_number + dayOffset,
      title: day.title,
      scripture_reference: day.scripture_reference,
      devotional_text: day.devotional_text,
      memory_hook: day.memory_hook,
      // Keep legacy fields populated for backwards compatibility
      scripture_text: "",
      christ_connection: day.devotional_text?.substring(0, 500) || "",
      application: "",
      prayer: "",
      challenge: "",
      journal_prompt: "",
    }));

    const { error: insertError } = await supabase
      .from("devotional_days")
      .insert(daysToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save devotional days");
    }

    // Update plan status
    if (isExtension) {
      // For extensions: update duration and ensure status is active
      const newTotalDuration = existingDuration + duration;
      console.log(`Extension complete: updating duration from ${existingDuration} to ${newTotalDuration}`);
      await supabase
        .from("devotional_plans")
        .update({
          status: "active",
          duration: newTotalDuration,
          completed_at: null // Clear completed status
        })
        .eq("id", planId);
    } else {
      // For new plans: set to active with start date
      const startedAt = new Date().toISOString();
      await supabase
        .from("devotional_plans")
        .update({ status: "active", started_at: startedAt })
        .eq("id", planId);
    }

    // Get user info for notification
    const { data: planData } = await supabase
      .from("devotional_plans")
      .select("user_id, title")
      .eq("id", planId)
      .single();

    if (planData) {
      // Create persistent in-app notification
      const notificationTitle = isExtension
        ? "🎉 Devotional Extended!"
        : "🎉 Your Devotional is Ready!";
      const notificationMessage = isExtension
        ? `"${planData.title}" has been extended by ${duration} days. Day ${startFromDay} is now available!`
        : `"${planData.title}" has been generated. Day 1 is now available!`;

      await supabase
        .from("notifications")
        .insert({
          user_id: planData.user_id,
          type: isExtension ? "devotional_extended" : "devotional_ready",
          title: notificationTitle,
          message: notificationMessage,
          link: `/devotionals/${planId}`,
          metadata: {
            plan_id: planId,
            duration: isExtension ? existingDuration + duration : days.length,
            extended_by: isExtension ? duration : undefined,
            theme,
          },
        });

      console.log(`Created ${isExtension ? "extension" : "devotional ready"} notification for user:`, planData.user_id);

      // Get user email for welcome email
      const { data: userData } = await supabase.auth.admin.getUserById(planData.user_id);
      
      if (userData?.user?.email) {
        // Get profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", planData.user_id)
          .single();

        const userName = profile?.display_name || "Friend";
        const firstDay = daysToInsert[0];

        // Send initial email with Day 1
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
          const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              type: "devotional-ready",
              data: {
                email: userData.user.email,
                name: userName,
                planTitle: planData.title,
                planId: planId,
                duration: days.length,
                theme,
                firstDayTitle: firstDay.title,
                firstDayScripture: firstDay.scripture_reference,
              },
            }),
          });
          console.log("Sent devotional ready email:", response.ok);
        } catch (emailErr) {
          console.error("Failed to send devotional ready email:", emailErr);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, daysGenerated: days.length, cadeEnabled: !!primaryIssue }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-devotional:", error);
    
    // Reset plan status to draft on failure so user can retry
    // Note: planId is already captured earlier in the function
    try {
    if (supabaseClient && capturedPlanId) {
      await supabaseClient
        .from("devotional_plans")
        .update({ status: "failed" })
        .eq("id", capturedPlanId);
      console.log("Marked devotional plan as failed after error");
      }
    } catch (resetError) {
      console.error("Failed to reset plan status:", resetError);
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getFormatInstructions(format: string, duration: number): string {
  switch (format) {
    case "24fps":
      return `24FPS FORMAT:
- Each day is ONE FRAME of a mental movie
- Focus on vivid visual imagery that builds a sequence
- By day ${duration}, the user should have a complete "film" in their mind
- One striking symbolic image per day that connects to the next
- Images should form a narrative arc of spiritual growth`;

    case "blueprint":
      return `SANCTUARY JOURNEY FORMAT:
- Cycle through the 7 sanctuary stations over the devotional
- Day pattern: Gate → Altar → Laver → Candlestick → Table → Incense → Ark → repeat
- Each day applies the sanctuary station to the theme WITHOUT naming it as a "technique"
- Show how Christ fulfills each station naturally in the narrative
- Let the sanctuary truth emerge through the story, not through explanation`;

    case "room-driven":
      return `PROGRESSIVE DEPTH FORMAT:
- Each day explores the theme from a different angle
- Progress from simple observation to deeper theological connection
- Vary between imagery, investigation, connection, and application approaches
- Build layers of understanding naturally across the devotional
- DO NOT name or reference Palace rooms - let the approach speak for itself`;

    case "verse-genetics":
      return `VERSE FAMILY TREE FORMAT:
- Start with one key verse for the theme
- Each day explores a different connection from that verse
- Show how one verse branches into cross-references and deeper meaning
- Build a network of meaning from the central verse
- Reveal connections without naming them as "techniques"`;

    default:
      return `STANDARD NARRATIVE FORMAT:
- Progressive exploration of the theme through 4-5 paragraph devotionals
- Each day: vivid scene → surprising Scripture angle → hidden connections → revelation → transformative appeal
- Balance reading, reflection, and application naturally
- Build toward deeper understanding each day
- Every day should feel fresh and never formulaic`;
  }
}
