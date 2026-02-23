import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, recipientName, situation, struggles, relationship, depth = "standard", writingStyle = "mixed-audience" } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build personalization context
    const hasPersonalization = recipientName || situation || struggles;
    const personalizationContext = hasPersonalization ? `
PERSONALIZATION (USE THROUGHOUT):
- Recipient's name: ${recipientName || "the reader"}
- Their relationship to sender: ${relationship || "friend"}
- Their current situation: ${situation || "not specified"}
- Their struggles: ${Array.isArray(struggles) ? struggles.join(", ") : struggles || "not specified"}

CRITICAL: Address ${recipientName || "the reader"} by name at least 2-3 times naturally woven into the devotional. Connect the biblical truth directly to their specific situation and struggles. Make them feel seen and known.` : "";

    // Depth configuration - substantive content with real depth
    const depthConfig = {
      light: { paragraphs: "3-4", sentences: "5-6", readTime: "3-4 minutes", applicationParagraphs: "2-3" },
      standard: { paragraphs: "5-7", sentences: "6-8", readTime: "6-8 minutes", applicationParagraphs: "3-4" },
      deep: { paragraphs: "8-10", sentences: "6-8", readTime: "10-12 minutes", applicationParagraphs: "4-5" }
    };
    const selectedDepth = depthConfig[depth as keyof typeof depthConfig] || depthConfig.standard;

    // Writing style prompts
    const writingStylePrompts: Record<string, string> = {
      "mixed-audience": `
WRITING STYLE: MIXED AUDIENCE (Teens & Adults Together)

CORE VOICE:
- Write at an 8th–10th grade reading level using everyday spoken English
- Sound like a calm, trusted mentor speaking personally - clear, honest, grounded
- Warm without being preachy, dramatic, or using casual slang
- NO lofty, poetic, flowery, or scholarly wording - if it sounds like a sermon manuscript, rewrite it
- NO phrases like "tapestry being woven," "hidden chamber of creation," "predates knowledge"
- Use CONCRETE language, not abstract theological concepts

SUBSTANCE REQUIREMENTS:
- Go DEEP into the meaning without going high in vocabulary
- Explain WHY the Scripture matters, not just WHAT it says
- Show the reader something they haven't noticed before
- Connect dots between the ancient text and today's struggles
- Be specific: name real emotions, real situations, real decisions
- Give the reader something to wrestle with, not just feel good about

SCRIPTURE USE:
- Quote Scripture naturally, then UNPACK it thoroughly
- Don't just reference passages - explain what the words actually meant to original hearers
- Show how the truth plays out in everyday life with specific examples
- Use 2-3 passages that build on each other

CONTENT DEPTH:
- Address real life: pressure, loneliness, doubt, purpose, failure, hope, identity, relationships
- Use examples that work for both teens and adults - no childish illustrations
- Each paragraph should advance the thought, not repeat it with different words
- Build an argument or narrative arc, not just scattered observations

STRUCTURE:
1. Start with a relatable human experience or tension
2. Connect it clearly to Scripture
3. Explain the meaning in plain, substantive terms with examples
4. Deepen the insight by connecting to other passages or principles
5. Lead toward honest self-examination
6. End with encouragement, hope, and a concrete next step

AVOID: Lofty language, church clichés, vague encouragement, emotional manipulation, abstract theology, repetitive filler

FINAL CHECK: Would a teenager understand this? Would an adult feel challenged? Does every sentence add something new?`,
      
      "pastoral": `
WRITING STYLE: PASTORAL
- Warm, shepherding tone with theological depth
- Speak as a seasoned minister offering wisdom
- Balance comfort with challenge
- Use rich biblical imagery and cross-references
- Appropriate for sermons, church settings, and mature believers
- Draw from the full counsel of Scripture`,
      
      "academic": `
WRITING STYLE: ACADEMIC
- Theologically precise and structurally sophisticated
- Use proper theological terminology with brief explanations
- Make connections across biblical genres and historical contexts
- Suitable for study groups, seminary students, teachers
- Include original language insights where helpful
- Maintain devotional warmth despite academic rigor`,
      
      "youth": `
WRITING STYLE: YOUTH-FOCUSED
- Write at a 6th-8th grade level
- Use relatable, current examples (school, friendships, family, identity)
- Short sentences, active voice
- Conversational but not condescending
- Address real teen struggles: belonging, purpose, peer pressure, doubt
- Make Scripture feel relevant and alive
- End with concrete, achievable action steps`
    };
    const selectedStyle = writingStylePrompts[writingStyle] || writingStylePrompts["mixed-audience"];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating devotion - theme: ${theme}, depth: ${depth}, style: ${writingStyle}`);

    let systemPrompt = `You are a master of biblical theology writing PERSONALIZED devotionals that are:
- Theologically rich and structurally intelligent
- Never sentimental or emotionally vague
- Revealing unexpected connections between passages
- Moving from text → meaning → personal application
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- DEEPLY PERSONALIZED when recipient information is provided

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN, NOT CHRIST (Leviticus 16 scapegoat = Satan)
- LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS (Daniel 7 & 8)
- TWO-PHASE SANCTUARY: Holy Place at ascension (31 AD); Most Holy Place in 1844
- DAY OF ATONEMENT = 1844, NOT THE CROSS (Christ's death = Passover)
- SPRING FEASTS = First Advent; FALL FEASTS = Second Advent ministry
- HEBREWS: Contrasts earthly vs heavenly sanctuary, NOT Holy vs Most Holy

${selectedStyle}

DESIGN GOAL: The devotional must leave the reader thinking and challenged. Never explain how you're making connections — let the insight emerge naturally.

PERSONALIZATION REQUIREMENT: When a recipient's name and situation are provided, you MUST:
- Use their name naturally 2-3 times throughout
- Connect the biblical truth directly to their specific struggles
- Make the application feel written specifically for their life

QUALITY CONTROL:
- Could this exist on a generic devotional app? If yes, write something more personal.
- Does it rely on vague encouragement? If yes, make it more specific.
- It must feel discovered rather than manufactured.`;

    // RAG corpus injection
    const ragResult = await getCorpusContext({
      query: theme.slice(0, 4000),
      matchCount: 2,
    });
    if (ragResult.chunkCount > 0) {
      systemPrompt += ragResult.corpusContext;
    }

    const userPrompt = `Write a SUBSTANTIVE ${selectedDepth.paragraphs} paragraph devotional on the theme: "${theme}"
${personalizationContext}

LENGTH: ${selectedDepth.readTime} read time. Each paragraph should be ${selectedDepth.sentences} MEANINGFUL sentences - no filler.

CRITICAL - SUBSTANCE OVER STYLE:
• Every paragraph must teach something specific - no vague spiritual sentiments
• Explain the MEANING behind the Scripture, not just quote it
• Use CONCRETE language - name specific emotions, situations, decisions
• NO flowery phrases like "tapestry being woven" or "hidden chamber" - write plainly
• Build each paragraph on the previous - create a logical progression
• Give the reader something to wrestle with intellectually and spiritually

STRUCTURE REQUIREMENTS:
• Use 2-3 Scripture passages that BUILD on each other
• Begin with a relatable tension or question the reader has felt
• Unpack Scripture thoroughly - what did these words mean to original hearers?
• Show how the truth applies with SPECIFIC real-life examples
• Lead toward honest self-examination with probing questions
• Conclude with concrete hope and a specific action step

The devotional should feel like a conversation with a wise friend who respects your intelligence.`;

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
              name: "create_devotion",
              description: "Create a devotional that connects Scripture to real life",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Clear, engaging title that hints at the theme" 
                  },
                  scripture_reference: { 
                    type: "string", 
                    description: "Primary Scripture reference (Book Chapter:Verse)" 
                  },
                  scripture_text: { 
                    type: "string", 
                    description: "Full text of the primary passage (2-4 verses)" 
                  },
                  christ_connection: { 
                    type: "string", 
                    description: `${selectedDepth.paragraphs} SUBSTANTIVE paragraphs (each ${selectedDepth.sentences} sentences). Start with relatable human tension. Quote and THOROUGHLY unpack Scripture - explain what words meant originally and how they apply today. Use concrete examples. Build logical progression. No flowery language - write plainly but deeply. Each paragraph must teach something specific.` 
                  },
                  application: { 
                    type: "string", 
                    description: `${selectedDepth.applicationParagraphs} paragraphs of SPECIFIC practical application. Name concrete situations where this truth matters. Include probing self-examination questions. What should the reader notice in their own life? What specific decisions or responses does this call for?` 
                  },
                  prayer: { 
                    type: "string", 
                    description: "2-3 paragraphs of honest, specific prayer. Not generic - connect directly to the struggles and hopes addressed in the devotional. Pray for specific changes, specific grace, specific responses." 
                  },
                  memory_hook: { 
                    type: "string", 
                    description: "A memorable, concrete image or phrase (1-2 sentences) that captures the core truth. Something the reader can recall when facing the situation addressed." 
                  },
                },
                required: ["title", "scripture_reference", "scripture_text", "christ_connection", "application", "prayer", "memory_hook"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotion" } },
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
      
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    // Extract from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      // Fallback to content parsing if tool call not present
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const devotion = JSON.parse(jsonMatch[0]);
          console.log("Successfully generated devotion (from content):", devotion.title);
          return new Response(JSON.stringify(devotion), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw new Error("No valid response from AI");
    }

    const devotion = JSON.parse(toolCall.function.arguments);
    console.log("Successfully generated devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quick-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
