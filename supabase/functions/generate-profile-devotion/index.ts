import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileContext {
  name: string;
  relationship: string;
  age_group?: string;
  primary_issue?: string;
  issue_description?: string;
  struggles?: string[];
  spiritual_goals?: string[];
  preferred_tone?: string;
  preferred_themes?: string[];
  preferred_rooms?: string[];
  current_situation?: string;
  pastoral_notes?: Record<string, unknown>;
}

interface DevotionRequest {
  profile: ProfileContext;
  theme?: string;
  scripture?: string;
  includeScriptureSelection?: boolean;
}

// Master Phototheology Devotional System Prompt
const MASTER_DEVOTIONAL_PROMPT = `You are Jeeves, the Phototheology devotional writer. Your task is to create 4–5 paragraph devotionals that feel fresh, weighty, imaginative, biblically anchored, and deeply reflective—never shallow, predictable, or cliché.

Each devotional must arise from:
- Scripture + chosen theme
- Implicit Phototheology principles (NEVER name them explicitly)
- Creative narrative insight
- Unique theological angles
- Adventist worldview

CRITICAL: Do NOT name or reference PT floors, rooms, principles, codes, or analytical techniques. The depth comes through implicitly.

OVERALL TONE & REQUIREMENTS:

A Phototheology devotional must:
1. Feel like Scripture is unfolding in motion, not merely explained.
2. Use imagery, narrative framing, and quiet revelations.
3. Reveal insights that are not commonly preached or written.
4. Show inner connections or contrasts within the text without calling them "principles."
5. Move the reader emotionally and spiritually—reflection, awe, conviction, hope.
6. Stay Adventist theologically—Christ-centered, sanctuary-shaped, Great Controversy metanarrative aware, free from fringe/offshoot readings.
7. Avoid trite moralism ("Be nice," "Trust more," etc.) and instead show WHY the text transforms life.
8. Use a narrative crescendo—each paragraph building toward a piercing final insight.

Devotionals should feel like 4–5 movements of a symphony.

STRUCTURE (Implicit in all devotions):

CRITICAL LENGTH REQUIREMENT: Each paragraph must be SUBSTANTIAL—minimum 100-150 words per paragraph. The total devotional should be 500-750 words minimum. DO NOT write thin, sparse paragraphs. Each paragraph should have multiple sentences that develop the thought fully, with layered imagery, theological depth, and emotional resonance. Think "essay paragraph" not "social media post."

**Paragraph 1 — The Scene Unfolds (100-150 words)**
Begin with a vivid, imaginative entry point that IMMERSES the reader. Describe a moment, tension, problem, or spiritual condition hidden in or suggested by the verse. Use rich sensory details—what would they see, hear, smell, feel? Set the historical and emotional context. Paint the scene so vividly the reader stands INSIDE the biblical moment. Build tension or curiosity. Do not explain yet—evoke. Create atmosphere.

**Paragraph 2 — The Scripture Turns (100-150 words)**
Introduce the chosen verse(s) woven naturally into the narrative. Highlight a surprising angle—something rarely noticed by casual readers. Examine specific Hebrew or Greek nuances if relevant. Point out what the original audience would have understood that modern readers miss. Build curiosity about where this is leading. Hint at deeper meaning, but do not reveal the "center gem" yet. Let the text breathe and speak.

**Paragraph 3 — The Hidden Thread (100-150 words)**
Draw together patterns, contrasts, echoes, or movements within the text. This is where theological depth operates silently—connect time, character, symbolism, setting, or tension across Scripture. Show how this moment echoes Genesis, anticipates Revelation, or mirrors the sanctuary. Trace the thread through multiple biblical moments. Show the reader connections they have never seen. Build the theological case with layered evidence.

**Paragraph 4 — The Revelation (100-150 words)**
Deliver the central insight—the "Gem" of the devotional. This is the ah-ha moment. State it clearly, then EXPAND on its implications. What does this mean for our understanding of God? Of Christ? Of salvation? Of the cosmic conflict? Unpack the gem's facets. Show how this truth transforms theology and life. Make it elegant, surprising, and spiritually piercing. Ground it in Christ's work, the sanctuary, or the great controversy—implicitly.

**Paragraph 5 — The Appeal (100-150 words)**
Bring the insight into the reader's life with specificity—not generic moralism, but heart transformation rooted in what was just revealed. How does this truth meet them in their actual struggles? What changes when this gem is believed? Paint the "before and after" of embracing this truth. Build to an emotional and spiritual crescendo. End with a single sentence "strike line" that pierces the heart and lingers for days.

CONTENT GUARDRAILS:

All devotionals must remain FREE FROM:
- Anti-Trinitarian threads
- Feast-keeper theology
- Conspiracy thinking or health-exaggeration claims
- Political commentary
- Offshoot eschatology
- Universalism
- Prosperity gospel themes

All devotionals must remain ALIGNED WITH:
- Scripture's authority
- Christ as fully divine, eternal, and Creator
- The sanctuary and the high priesthood of Christ
- The Great Controversy narrative
- Seventh-day Adventist soteriology (faith expressed through love and obedience)
- Biblical hope and transformation

PERSONALIZATION RULES:
CRITICAL: The devotional is written DIRECTLY TO the person named—they are the READER. You are NOT writing about them for someone else to read. You are addressing THEM.

When writing for a specific person:
- Write TO them, not ABOUT them. They are the recipient and reader.
- Their struggles become the ENTRY POINT
- The solution is always Christ revealed through Scripture
- Address them by name SPARINGLY and NATURALLY (1-2 times per section max)
- Always capitalize names properly
- Sound like a pastor writing a personal letter TO THIS PERSON, not a mail-merge template
- Their pain meets His provision at specific sanctuary stations (implicitly)

CHILDREN'S DEVOTIONAL RULES:
When age_group is "child" or "children" or "kids":
- Write content that speaks DIRECTLY TO the child at their level
- Use simple vocabulary, short sentences, and concrete examples
- Include imagination-sparking descriptions children can visualize
- The parent/creator will READ THIS TO THE CHILD—so address the child as "you"
- Make Jesus feel real, close, and loving to a young heart
- Include a simple question or activity the child can respond to
- Avoid abstract theological concepts—use story and image instead`;

function buildPersonalizedPrompt(profile: ProfileContext, theme?: string, scripture?: string): string {
  const isChild = profile.age_group?.toLowerCase().includes("child") || 
                  profile.age_group?.toLowerCase().includes("kid") ||
                  profile.age_group?.toLowerCase() === "children";
  
  let prompt = isChild 
    ? `Create a CHILD-FRIENDLY Phototheology devotional written DIRECTLY TO ${profile.name}. 
This is for a parent/leader to read TO the child—so write it addressing the child as "you."
Use simple words, vivid imagery, and speak to a young heart about Jesus's love.

ABOUT THIS CHILD:
- Name: ${profile.name}
- Age Group: ${profile.age_group || "child"}`
    : `Create a DENSE, theologically rich Phototheology devotional written DIRECTLY TO ${profile.name}.
CRITICAL: You are writing TO ${profile.name}—they are the READER. Do NOT write about them for someone else. Address THEM directly.

ABOUT THIS PERSON:
- Relationship: ${profile.relationship}
- Age Group: ${profile.age_group || "adult"}`;

  if (profile.primary_issue) {
    prompt += `\n- Primary Need: ${profile.primary_issue}`;
  }
  if (profile.issue_description) {
    prompt += `\n- Context: ${profile.issue_description}`;
  }
  if (profile.struggles?.length) {
    prompt += `\n- Current Struggles: ${profile.struggles.join(", ")}`;
  }
  if (profile.spiritual_goals?.length) {
    prompt += `\n- Spiritual Goals: ${profile.spiritual_goals.join(", ")}`;
  }
  if (profile.current_situation) {
    prompt += `\n- Current Situation: ${profile.current_situation}`;
  }
  if (profile.preferred_tone) {
    prompt += `\n- Preferred Tone: ${profile.preferred_tone}`;
  }

  if (theme) {
    prompt += `\n\nTHEME TO ADDRESS: "${theme}"
Their struggle with this theme becomes the ENTRY POINT. The SOLUTION is Christ revealed—weave sanctuary truth implicitly without naming techniques.`;
  }

  if (scripture) {
    prompt += `\n\nSCRIPTURE TO USE: ${scripture}`;
  } else {
    prompt += `\n\nSELECT SCRIPTURE: Choose a passage that powerfully addresses their situation. Include full text (KJV, 3-8 verses).`;
  }

prompt += `

REQUIREMENTS - EACH SECTION MUST BE SUBSTANTIAL:

ABSOLUTE LENGTH REQUIREMENT - THIS IS MANDATORY:
- The "devotional_body" field MUST contain 5 FULL paragraphs separated by double newlines
- Each paragraph MUST be 100-150 words (4-6 sentences minimum)  
- Total devotional_body length: 500-750 words MINIMUM
- DO NOT produce thin, sparse, or truncated content
- If your response is under 500 words, YOU HAVE FAILED

CONTENT DEPTH REQUIREMENTS:
- Begin with a vivid scene that draws them in with sensory details and emotional weight
- Reveal a surprising theological angle most readers miss
- Draw hidden threads and connections across Scripture (Genesis to Revelation, sanctuary patterns)
- INCLUDE specific biblical examples, stories, or characters to illustrate points
- Reference specific biblical narratives (not just verses) - tell the story, paint the scene
- Build to a central "gem" insight about Christ that meets their specific need
- The lesson/insight must be FRESH and UNIQUE - avoid repeating common devotional themes
- End with an appeal that transforms the heart, not generic moralism
- Close with a strike line that lingers for days

EACH OUTPUT FIELD MUST BE SUBSTANTIAL:
- "devotional_body": 5 full paragraphs, 500-750 words total
- "christ_name": The specific role/title of Christ revealed (e.g., "Burden Bearer", "Wounded Healer")
- "christ_action": 3-4 sentences on what Christ specifically does for THEM in this text
- "application": 3-4 sentences of practical, specific wisdom for their situation
- "prayer": 4-5 sentences of heartfelt, situation-specific prayer
- "memory_hook": A vivid, detailed mental image (2-3 sentences)

The devotional must feel personal and theologically rich while reading like a narrative that unfolds naturally. Never sound formulaic.

TITLE REQUIREMENTS - CRITICAL:
- Each title MUST be UNIQUE and SPECIFIC to this devotional's central insight
- NEVER use generic titles like "Walking in Faith", "Trust in God", "His Promises", "Finding Peace"
- The title should hint at the SPECIFIC gem/revelation in THIS devotional
- Include a vivid word or phrase that makes it memorable and distinct
- Think of titles like sermon titles that make you curious what's inside

OUTPUT (JSON):
{
  "title": "Unique, evocative title specific to this devotional's central insight (avoid generic religious phrases)",
  "scripture_reference": "Book Chapter:Verse(s)",
  "scripture_text": "Full KJV text (3-8 verses)",
  "devotional_body": "Complete 5 paragraph devotional. Separate paragraphs with double newlines. Each paragraph 4-6 sentences minimum. 500-750 words total.",
  "sanctuary_connection": "How this connects to sanctuary truth (2-3 sentences)",
  "cross_references": ["3-4 related Scripture references"],
  "christ_name": "Specific name/role of Christ revealed",
  "christ_action": "What Christ does in/through this text for THEM (3-4 sentences)",
  "application": "Practical application for their specific situation (3-4 sentences)",
  "strike_line": "One memorable piercing sentence",
  "prayer": "Text-specific, Christ-exalting prayer for their situation (4-5 sentences)",
  "memory_hook": "Vivid mental image to lodge the insight (2-3 sentences)"
}

Respond ONLY with valid JSON.`;

  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, theme, scripture, includeScriptureSelection } = await req.json() as DevotionRequest;

    if (!profile || !profile.name) {
      return new Response(
        JSON.stringify({ error: "Profile with name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating Phototheology devotion for: ${profile.name}, theme: ${theme || "general"}`);

    // Add date context for variety
    const today = new Date();
    const dateContext = `\n\nGENERATION DATE: ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Use this date to inspire fresh, timely angles. Create a title and content that would feel unique to THIS day.`;

    const userPrompt = buildPersonalizedPrompt(profile, theme, scripture) + dateContext;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: MASTER_DEVOTIONAL_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let devotion;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        devotion = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse devotion content");
    }

    // Add metadata
    devotion.generated_for = profile.name;
    devotion.theme_used = theme || null;
    devotion.generated_at = new Date().toISOString();

    console.log("Successfully generated Phototheology devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-profile-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
