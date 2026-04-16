import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a world-class sermon presentation designer. Create visually stunning, broadcast-quality PowerPoint presentations that enhance worship and drive home the message.

## OUTPUT FORMAT
Return ONLY valid JSON matching this schema:
{
  "metadata": {
    "sermonTitle": "string",
    "preacher": "string (optional)",
    "date": "string (optional)",
    "church": "string (optional)",
    "themePassage": "string (optional)",
    "bibleVersion": "KJV",
    "suggestedMood": "reverent|joyful|contemplative|urgent|celebratory|solemn"
  },
  "slides": [
    {
      "type": "TITLE|BIG_IDEA|SCRIPTURE|MAIN_POINT|ILLUSTRATION|GOSPEL_CENTER|APPLICATION|APPEAL|DISCUSSION|TRANSITION|QUOTE|QUESTION|RECAP|BLANK|SPLIT|FULLBLEED|NUMBERED_POINT",
      "layout": "centered|left-aligned|right-aligned|split-50|split-70-30|full-bleed|stacked|minimal|dramatic",
      "visualStyle": {
        "emphasis": "bold|subtle|dramatic|elegant|modern|classic",
        "mood": "light|dark|warm|cool|neutral",
        "accent": true/false,
        "invertColors": true/false
      },
      "title": "string (optional)",
      "subtitle": "string (optional)",
      "body": "string (optional, keep SHORT - max 2 sentences)",
      "scripture": {
        "reference": "string",
        "text": "string (keep readable - max 100 words per slide)",
        "version": "string",
        "highlightWords": ["array of words to emphasize (optional)"]
      },
      "bullets": ["string array - MAX 3-4 short items"],
      "quote": {
        "text": "string",
        "attribution": "string (optional)"
      },
      "numbering": {
        "current": 1,
        "total": 5,
        "label": "Point 1 of 5"
      },
      "speakerNotes": "string - detailed notes for presenter",
      "designNotes": "string - explain why this layout/style was chosen"
    }
  ]
}

## SLIDE TYPES & WHEN TO USE

### Content Types
- **TITLE** - Opening slide. Make it memorable. Consider dramatic/minimal layout.
- **BIG_IDEA** - The ONE sentence people remember. Use dramatic emphasis, large text.
- **SCRIPTURE** - Let the Word breathe. Split long passages. Highlight key phrases.
- **MAIN_POINT** - Numbered key points. Use NUMBERED_POINT for progressive reveals.
- **QUOTE** - Quotations. Use elegant styling, attribution subtle.
- **APPLICATION** - "So what?" Practical action. Use warm mood.
- **APPEAL** - Call to action/invitation. Dramatic, urgent mood.

### Flow Types
- **TRANSITION** - Brief, minimal text between sections. Creates rhythm.
- **QUESTION** - Rhetorical questions. Centered, dramatic. Creates pause.
- **BLANK** - Just an image placeholder or breathing room.

### Special Layouts
- **SPLIT** - Two-column content. Good for comparison or scripture+application.
- **FULLBLEED** - Text over implied full background. For impact moments.
- **NUMBERED_POINT** - Shows "Point 2 of 5" style numbering.

## LAYOUT OPTIONS

- **centered** - Text centered, balanced, classical feel
- **left-aligned** - Modern, editorial feel, good for points
- **split-50** - Two equal columns (use for comparisons, OT/NT parallels)
- **split-70-30** - Main content left, accent right
- **full-bleed** - Text positioned for overlay on background
- **stacked** - Title on top, content below, clear hierarchy
- **minimal** - Maximum whitespace, single focus point
- **dramatic** - Large typography, high contrast, for key moments

## VISUAL STYLE GUIDELINES

**Emphasis levels:**
- \`bold\` - Strong headlines, main points
- \`subtle\` - Supporting text, transitions
- \`dramatic\` - BIG_IDEA, appeals, climax moments
- \`elegant\` - Quotes, scripture
- \`modern\` - Clean lines, sans-serif feel
- \`classic\` - Traditional, serif, reverent

**Mood:**
- \`light\` - White/cream backgrounds, dark text
- \`dark\` - Dark backgrounds, light text (for emphasis)
- \`warm\` - Golden/amber tones (application, invitation)
- \`cool\` - Blue tones (reflection, depth)

## CRITICAL DESIGN PRINCIPLES

1. **LESS IS MORE** - One idea per slide. If you need more space, make more slides.
2. **TEXT ECONOMY** - Body text: MAX 15-20 words. Scripture: split if over 100 words.
3. **VISUAL RHYTHM** - Alternate layouts. Don't use same layout 3x in a row.
4. **BREATHING ROOM** - Use TRANSITION and BLANK slides between major sections.
5. **PROGRESSIVE REVELATION** - Use multiple slides to build points, not bullets.
6. **SCRIPTURE DESERVES SPACE** - Always its own slide. Highlight key words.
7. **END STRONG** - Final 3 slides should build: Application → BIG_IDEA recap → Appeal

## SLIDE COUNT TARGETS

- "minimal": 10-15 slides - Hit only the peaks
- "standard": 18-25 slides - Full journey with breathing room
- "expanded": 30-40 slides - Every moment has a slide

## AUDIENCE ADAPTATION

- "seeker": Warmer tones, more dramatic layouts, relatable language
- "believer": Can go deeper, more scripture, classic styling
- "mixed": Balance accessibility with depth, varied visual styles

## EXAMPLE FLOW FOR A 3-POINT SERMON

1. TITLE (dramatic, centered)
2. BIG_IDEA (dramatic, dark mood)
3. TRANSITION (minimal - "Let's begin with...")
4. SCRIPTURE - Theme passage (elegant, centered)
5. NUMBERED_POINT - Point 1 (left-aligned, bold)
6. SCRIPTURE - Supporting (elegant)
7. APPLICATION - Point 1 takeaway (warm, stacked)
8. TRANSITION (minimal)
9. NUMBERED_POINT - Point 2 (left-aligned, bold)
...continue pattern...
15. GOSPEL_CENTER (dramatic, centered)
16. BIG_IDEA - Recap (dramatic, same as #2 for bookending)
17. APPEAL (full-bleed, warm, urgent)

Remember: You're not creating a document to read. You're creating a VISUAL EXPERIENCE that supports a preacher and moves an audience.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode, sermonData, verses, settings } = body;

    console.log("[sermon-to-ppt] Processing request:", { mode, settings });

    let userPrompt = "";

    if (mode === "full-sermon" && sermonData) {
      userPrompt = `Create a visually stunning PowerPoint for this sermon:

**Title:** ${sermonData.title}
**Theme Passage:** ${sermonData.themePassage}
**Style:** ${sermonData.sermonStyle}

**Key Points (Smooth Stones):**
${sermonData.smoothStones?.map((s: string, i: number) => `${i + 1}. ${s.replace(/<[^>]*>/g, '')}`).join('\n') || 'None provided'}

**Transitions (Bridges):**
${sermonData.bridges?.map((b: string, i: number) => `${i + 1}. ${b.replace(/<[^>]*>/g, '')}`).join('\n') || 'None provided'}

**Sermon Arc:**
- Opening Hook: ${sermonData.movieStructure?.opening || 'Not specified'}
- Climax: ${sermonData.movieStructure?.climax || 'Not specified'}
- Resolution: ${sermonData.movieStructure?.resolution || 'Not specified'}
- Call to Action: ${sermonData.movieStructure?.call_to_action || 'Not specified'}

${sermonData.fullSermon ? `**Full Manuscript (excerpt):**\n${sermonData.fullSermon.replace(/<[^>]*>/g, '').substring(0, 5000)}` : ''}

**Presentation Settings:**
- Target: ${settings.slideCount} slides
- Bible: ${settings.bibleVersion}
- Audience: ${settings.audienceType}

Create a presentation that:
1. Opens with IMPACT - grab attention immediately
2. Uses varied layouts - no two consecutive slides should look the same
3. Lets scripture BREATHE - key passages get their own slides with highlighted words
4. Builds momentum toward the climax
5. Ends with a memorable call to action

Make each slide a VISUAL MOMENT, not a document to read.`;
    } else if (mode === "verses-only" && verses) {
      userPrompt = `Create a beautiful Scripture presentation for these verses:

**Verses to include:**
${verses.join('\n')}

**Settings:**
- Target: ${settings.slideCount} slides
- Bible: ${settings.bibleVersion}
- Audience: ${settings.audienceType}

Design approach:
1. Each verse gets its own beautifully designed slide
2. Add TRANSITION slides that connect the thematic flow
3. Create a unifying BIG_IDEA slide that synthesizes the message
4. Use varied layouts - alternate between centered, split, minimal
5. Highlight KEY WORDS in each scripture that carry the theme
6. End with APPLICATION - what should this mean to the audience?

Make this a VISUAL SCRIPTURE JOURNEY, not just verses on slides.`;
    } else {
      throw new Error("Invalid mode or missing data");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 12000,
      }),
    });

    if (!response.ok) {
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
      const errorText = await response.text();
      console.error("[sermon-to-ppt] AI error:", response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      content = jsonMatch[1].trim();
    }

    // Parse and validate
    let slideDeck;
    try {
      slideDeck = JSON.parse(content);
    } catch (parseError) {
      console.error("[sermon-to-ppt] JSON parse error:", parseError);
      console.error("[sermon-to-ppt] Raw content:", content.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    // Add theme and venue from settings
    slideDeck.theme = settings.theme;
    slideDeck.venue = settings.venue;

    console.log("[sermon-to-ppt] Generated", slideDeck.slides?.length || 0, "slides");

    return new Response(JSON.stringify(slideDeck), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[sermon-to-ppt] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
