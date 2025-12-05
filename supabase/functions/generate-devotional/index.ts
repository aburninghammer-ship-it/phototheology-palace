import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

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
      "Breath prayer: Inhale 'Fear not,' exhale 'I am with you'",
      "Scripture reframing: When a fearful thought comes, counter it with a specific Bible verse",
      "Physical grounding: Feel your feet on the floor, remind yourself you are safe in this moment",
      "Name the fear specifically - vague fears are harder to fight than named ones"
    ]
  }
};

// SDA Safety guardrails
const CADE_SAFETY_PROMPT = `
CRITICAL SDA DOCTRINAL SAFETY RULES - NEVER VIOLATE:

NEVER:
- Identify the scapegoat as Jesus/Christ
- Identify Daniel 8's little horn as Antiochus Epiphanes  
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      issueSeverity
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Update plan status to generating
    await supabase
      .from("devotional_plans")
      .update({ status: "generating" })
      .eq("id", planId);

    const formatInstructions = getFormatInstructions(format, duration);
    
    // Build personalization note - capitalize name properly
    const capitalizedName = profileName ? profileName.charAt(0).toUpperCase() + profileName.slice(1).toLowerCase() : "";
    
    let personalizationNote = "";
    if (capitalizedName) {
      personalizationNote = `\n\nPERSONALIZATION FOR ${capitalizedName.toUpperCase()}:
- Address them as "${capitalizedName}" (properly capitalized) - NOT lowercase
- Use their name SPARINGLY and NATURALLY - once or twice per section maximum
- Write as a caring pastor speaking to a friend, not as an AI inserting a name
- Vary how you address them: "You, ${capitalizedName}..." or "Dear friend..." or just "you"
- The tone should feel like a personal letter, not a mail merge
- NEVER use awkward constructions like "He invites us, ${capitalizedName.toLowerCase()}" - instead say "He invites you, ${capitalizedName}"`;
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

    const systemPrompt = `You are Jeeves, the Phototheology AI assistant. You create PREMIUM-QUALITY, Christ-centered devotionals using the Palace method.

=== CRITICAL WRITING QUALITY STANDARDS ===
Your output MUST meet PUBLISHER-GRADE quality:

1. PERFECT GRAMMAR & SPELLING
   - No typos (e.g., "crying" NOT "cryin")
   - Proper capitalization of names (always capitalize: "Tom" NOT "tom")
   - Correct punctuation and sentence structure
   - No mid-sentence random capitalizations

2. NATURAL PERSONALIZATION (when a name is provided)
   - Use their name SPARINGLY - 1-2 times per section maximum
   - Write "You, Tom..." or "Tom, consider..." NOT "He invites us, tom"
   - Always capitalize names properly
   - Vary between using their name and using "you" or "friend"
   - Sound like a pastor writing a personal letter, NOT a mail-merge template

3. PREMIUM WRITING ELEMENTS (include in each devotional):
   - ONE theological gem per day: A memorable, quotable insight
     Example: "The 'secret place' is not a location but a relationship—trust is the door, surrender is the key."
   - ONE life hook per day: Connect to modern, everyday experience
     Example: "In a world where anxiety follows you like a shadow, Psalm 91 reminds you that another shadow is stronger."
   - ONE sensory detail: Make it visceral and memorable
     Example: "Imagine the warmth of His wings, the hush of His presence quieting your fears."

4. PROFESSIONAL TONE
   - Warm but not saccharine
   - Pastoral but not preachy
   - Personal but not invasive
   - Hopeful but not dismissive of pain

${CADE_SAFETY_PROMPT}

PALACE ROOMS AVAILABLE:
${PALACE_ROOMS.map(r => `${r.code}: ${r.name} (Floor ${r.floor})`).join("\n")}

SANCTUARY STATIONS (for Blueprint format):
${SANCTUARY_STATIONS.join("\n")}

${formatInstructions}${personalizationNote}${cadeSection}

VARIETY & FRESHNESS - CRITICAL:
- DO NOT use the same format/structure for every day
- Rotate through ALL palace principles across all 8 floors
- Some days use vivid imagery, other days detective-style questions, others historical parallels
- Mix up the presentation style to keep it fresh and engaging

CONTENT GUIDELINES (adapt based on the day's approach):
- scripture_text: Include the FULL passage (3-8 verses minimum)
- visual_imagery: OPTIONAL - use when passage naturally lends itself to mental pictures
- memory_hook: OPTIONAL - a key insight, quotable truth, or memorable phrase
- application: 4-6 sentences with SPECIFIC, practical steps
- prayer: Heartfelt, 5-8 sentences - vary style (praise, lament, petition)
- challenge: 2-3 DOABLE actions
- journal_prompt: 2-4 reflection questions
- christ_connection: 4-6 sentences showing how this reveals Christ with theological depth

PALACE APPROACH VARIETY - Rotate through ALL of these across the devotional:

FLOOR 1 - FURNISHING (Memory & Visualization):
- Story Room (SR): Retell the biblical narrative with vivid detail
- Imagination Room (IR): Paint a mental picture, immerse the reader in the scene with sensory details
- 24FPS (24F): Create a memorable symbolic frame/image for the passage
- Bible Rendered (BR): Summarize the chapter/passage in one striking image
- Translation Room (TR): Turn abstract truths into concrete visual pictures
- Gems Room (GR): Extract and highlight a precious insight or discovery

FLOOR 2 - INVESTIGATION (Detective Work):
- Observation Room (OR): Notice specific details - words, repetition, structure
- Def-Com Room (DC): Explore word definitions, Greek/Hebrew meanings, cultural context
- Symbols/Types Room (ST): Identify symbols, types, and shadows pointing to Christ
- Questions Room (QR): Lead with probing questions about the text
- Q&A Room (QA): Let Scripture answer Scripture - chain verses together

FLOOR 3 - FREESTYLE (Daily Connections):
- Nature Freestyle (NF): Connect the passage to something in nature
- Personal Freestyle (PF): Apply to personal life experiences
- Bible Freestyle (BF): Show verse genetics - how this verse relates to others
- History Freestyle (HF): Connect to historical events or church history
- Listening Room (LR): Reflect on what God is saying through this passage

FLOOR 4 - NEXT LEVEL (Christ-Centered Depth):
- Concentration Room (CR): Focus intensely on how Christ is revealed
- Dimensions Room (DR): Explore literal, Christ, personal, church, and eternal dimensions
- Connect 6 (C6): Identify the genre and interpret accordingly
- Theme Room (TRm): Connect to major biblical themes (Sanctuary, Great Controversy, Gospel)
- Time Zone Room (TZ): Place in past, present, or future context
- Patterns Room (PRm): Show recurring biblical patterns
- Parallels Room (P||): Draw parallels with other biblical events
- Fruit Room (FRt): Test interpretation against spiritual fruit

FLOOR 5 - VISION (Prophecy & Sanctuary):
- Blue Room/Sanctuary (BL): Connect to sanctuary furniture and services
- Prophecy Room (PR): Link to prophetic timelines and fulfillment
- Three Angels Room (3A): Connect to the three angels' messages

FLOOR 6 - THREE HEAVENS (Cycles & Context):
- Place the passage within biblical cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re)
- Connect to the three heavens framework (1H, 2H, 3H)
- Juice Room (JR): Extract maximum meaning by applying multiple principles

FLOOR 7 - SPIRITUAL/EMOTIONAL (Heart Engagement):
- Fire Room (FRm): Engage the emotions - conviction, comfort, awe
- Meditation Room (MR): Slow, contemplative reflection
- Speed Room (SRm): Quick, practical application

FLOOR 8 - MASTER (Reflexive Integration):
- Seamlessly blend multiple principles without being formulaic

OUTPUT FORMAT - Return a JSON array of \${duration} days:
{
  "day_number": number,
  "title": "string - creative, varied titles (not formulaic)",
  "scripture_reference": "Book Chapter:Verses (KJV)",
  "scripture_text": "The FULL passage text",
  "room_assignment": "Primary room code used",
  "floor_number": number,
  "visual_imagery": "string or null - include ONLY when using Imagination/Story approach",
  "memory_hook": "string or null - a key insight, quotable truth, or memorable phrase",
  "cross_references": ["verse1", "verse2", "verse3", "verse4"],
  "application": "Practical steps for TODAY",
  "prayer": "Heartfelt prayer - varied in style",
  "challenge": "Specific doable actions",
  "journal_prompt": "Reflection questions",
  "sanctuary_station": "string or null - include only when relevant",
  "christ_connection": "How this points to Jesus with theological depth"
}`;

    const forPersonNote = capitalizedName ? `\nThis devotional is specifically for: ${capitalizedName}. Use their name naturally and sparingly (1-2 times per section). Always capitalize their name properly.` : "";
    const issueNote = primaryIssue ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}` : "";

    const userPrompt = `Create a ${duration}-day devotional on the theme: "${theme}"
Format: ${format}
Study Style: ${studyStyle}${forPersonNote}${issueNote}

Generate all ${duration} days as a JSON array. Each day should progressively build understanding while always pointing to Christ${primaryIssue ? " and addressing their specific struggle with compassion and biblical wisdom" : ""}.`;

    console.log("Calling AI to generate devotional...");
    console.log("CADE enabled:", !!primaryIssue);

    // For large devotionals, use batching to avoid timeouts
    // Use smaller batches for faster generation
    const batchSize = duration > 14 ? 7 : duration; // Generate in batches of 7 days max
    const batches = Math.ceil(duration / batchSize);
    let allDays: any[] = [];
    
    for (let batch = 0; batch < batches; batch++) {
      const startDay = batch * batchSize + 1;
      const endDay = Math.min((batch + 1) * batchSize, duration);
      const daysInBatch = endDay - startDay + 1;
      
      console.log(`Generating batch ${batch + 1}/${batches}: days ${startDay}-${endDay}`);
      
      const batchUserPrompt = batches > 1 
        ? `Create days ${startDay} to ${endDay} of a ${duration}-day devotional on the theme: "${theme}"
Format: ${format}
Study Style: ${studyStyle}${forPersonNote}${issueNote}

Generate ${daysInBatch} days (starting from day_number ${startDay}) as a JSON array. Each day should progressively build understanding while always pointing to Christ${primaryIssue ? " and addressing their specific struggle with compassion and biblical wisdom" : ""}.

IMPORTANT: Start numbering from day_number: ${startDay}`
        : userPrompt;
      
      // Create AbortController with 90 second timeout for each batch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite", // Use faster model for devotionals
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: batchUserPrompt },
            ],
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
        
        const data = await response.json();
        console.log(`Batch ${batch + 1} response received, parsing content...`);
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error(`No content generated for batch ${batch + 1}`);
        }
        
        console.log(`Batch ${batch + 1} content length:`, content.length);
        
        // Parse batch days from content
        let batchDays;
        try {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          let jsonString = jsonMatch ? jsonMatch[1] : content;
          
          // Escape literal newlines/tabs within JSON string values
          let result = '';
          let inString = false;
          let escaped = false;
          
          for (let i = 0; i < jsonString.length; i++) {
            const char = jsonString[i];
            
            if (escaped) {
              result += char;
              escaped = false;
              continue;
            }
            
            if (char === '\\') {
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
              if (char === '\n') {
                result += '\\n';
              } else if (char === '\r') {
                result += '\\r';
              } else if (char === '\t') {
                result += '\\t';
              } else {
                result += char;
              }
            } else {
              result += char;
            }
          }
          
          batchDays = JSON.parse(result.trim());
          console.log(`Batch ${batch + 1}: parsed ${batchDays.length} days`);
        } catch (parseError) {
          console.error(`JSON parse error for batch ${batch + 1}:`, parseError);
          throw new Error(`Failed to parse devotional content for batch ${batch + 1}`);
        }
        
        allDays = [...allDays, ...batchDays];
        
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error(`Generation timeout for batch ${batch + 1}. Try a shorter devotional duration.`);
        }
        throw fetchError;
      }
    }

    // Use allDays from batching
    const days = allDays;
    
    if (!Array.isArray(days) || days.length === 0) {
      throw new Error("Invalid devotional format received");
    }
    
    console.log("Total days generated:", days.length);

    console.log("Inserting days into database...");
    const daysToInsert = days.map((day: any) => ({
      plan_id: planId,
      day_number: day.day_number,
      title: day.title,
      scripture_reference: day.scripture_reference,
      scripture_text: day.scripture_text,
      room_assignment: day.room_assignment,
      floor_number: day.floor_number || 1,
      visual_imagery: day.visual_imagery,
      memory_hook: day.memory_hook,
      cross_references: day.cross_references || [],
      application: day.application,
      prayer: day.prayer,
      challenge: day.challenge,
      journal_prompt: day.journal_prompt,
      sanctuary_station: day.sanctuary_station,
      christ_connection: day.christ_connection,
    }));

    const { error: insertError } = await supabase
      .from("devotional_days")
      .insert(daysToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save devotional days");
    }

    // Update plan status to active
    await supabase
      .from("devotional_plans")
      .update({ status: "active", started_at: new Date().toISOString() })
      .eq("id", planId);

    return new Response(
      JSON.stringify({ success: true, daysGenerated: days.length, cadeEnabled: !!primaryIssue }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-devotional:", error);
    
    // Reset plan status to draft on failure so user can retry
    try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const body = await req.clone().json().catch(() => ({}));
        if (body.planId) {
          await supabase
            .from("devotional_plans")
            .update({ status: "draft" })
            .eq("id", body.planId);
          console.log("Reset plan status to draft for retry");
        }
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
- Use the 24FPS Room technique: one symbolic image per day
- Images should connect to form a narrative arc`;

    case "blueprint":
      return `BLUEPRINT/SANCTUARY FORMAT:
- Cycle through the 7 sanctuary stations over the devotional
- Day pattern: Gate → Altar → Laver → Candlestick → Table → Incense → Ark → repeat
- Each day should apply the sanctuary station to the theme
- Show how Christ fulfills each station`;

    case "room-driven":
      return `ROOM-DRIVEN PALACE TOUR FORMAT:
- Each day visits a different Palace room
- Cycle through floors progressively
- Teach the room's method while exploring the theme
- By the end, user has "toured" multiple Palace principles`;

    case "verse-genetics":
      return `VERSE GENETICS FORMAT:
- Start with one key verse for the theme
- Each day explores a different "genetic" connection from that verse
- Show cross-floor insights, memory connections, and applications
- Build a family tree of meaning from the central verse`;

    default:
      return `STANDARD THEME-BASED FORMAT:
- Progressive exploration of the theme
- Mix different Palace rooms naturally
- Balance reading, reflection, and application
- Build toward deeper understanding each day`;
  }
}
