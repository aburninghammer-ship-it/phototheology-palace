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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, theme, format, duration, studyStyle, profileName } = await req.json();

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
    
    const personalizationNote = profileName 
      ? `\n\nPERSONALIZATION: This devotional is for someone named "${profileName}". Address them by name throughout the devotional - in prayers, applications, challenges, and encouragement. Make it feel personal and caring, as if you are speaking directly to ${profileName}.`
      : "";

    const systemPrompt = `You are Jeeves, the Phototheology AI assistant. You create EXTENSIVE, Christ-centered devotionals using the Palace method.

CRITICAL RULES:
1. Every devotional MUST end with a clear connection to Jesus Christ
2. Use Seventh-day Adventist theological framework
3. Never identify the scapegoat as Jesus/Christ
4. Never identify Daniel 8's little horn as Antiochus Epiphanes
5. Always use KJV Scripture references
6. Each day must have vivid visual imagery for memory
7. MAKE CONTENT EXTENSIVE - each field should be thorough and detailed${personalizationNote}

PALACE ROOMS AVAILABLE:
${PALACE_ROOMS.map(r => `${r.code}: ${r.name} (Floor ${r.floor})`).join("\n")}

SANCTUARY STATIONS (for Blueprint format):
${SANCTUARY_STATIONS.join("\n")}

${formatInstructions}

CONTENT LENGTH REQUIREMENTS:
- scripture_text: Include the FULL passage (3-8 verses minimum), not just one verse
- visual_imagery: 3-5 sentences painting a vivid mental picture with sensory details
- memory_hook: A memorable phrase PLUS explanation of the mnemonic connection (2-3 sentences)
- application: 4-6 sentences with SPECIFIC, practical steps for daily life, addressing different life situations
- prayer: A heartfelt, 5-8 sentence prayer that incorporates the day's themes and scripture
- challenge: 2-3 specific actions with explanation of WHY and HOW to do them
- journal_prompt: 3-4 deep reflection questions that encourage self-examination
- christ_connection: 4-6 sentences showing EXACTLY how this passage reveals Christ's character, work, or plan of salvation

OUTPUT FORMAT - Return a JSON array of ${duration} days with this exact structure for each day:
{
  "day_number": number,
  "title": "string",
  "scripture_reference": "Book Chapter:Verses (KJV)",
  "scripture_text": "The FULL passage text - include multiple verses for context",
  "room_assignment": "Room code from list above",
  "floor_number": number,
  "visual_imagery": "An extensive, vivid mental picture with sensory details (sight, sound, smell, touch) to anchor this day's truth in memory",
  "memory_hook": "A memorable phrase or image connection with explanation of the mnemonic technique",
  "cross_references": ["verse1", "verse2", "verse3", "verse4"],
  "application": "Detailed, practical steps for applying this truth TODAY - be specific about situations, relationships, and choices",
  "prayer": "An extensive, heartfelt prayer incorporating the scripture and themes",
  "challenge": "Specific actions to take with clear instructions on how to accomplish them",
  "journal_prompt": "Multiple deep reflection questions for self-examination and spiritual growth",
  "sanctuary_station": "Which sanctuary station this connects to (if applicable)",
  "christ_connection": "An extensive explanation of how this passage points to Jesus Christ - His character, sacrifice, ministry, or return - REQUIRED and DETAILED"
}`;

    const forPersonNote = profileName ? `\nThis devotional is specifically for: ${profileName}. Address them by name throughout.` : "";

    const userPrompt = `Create a ${duration}-day devotional on the theme: "${theme}"
Format: ${format}
Study Style: ${studyStyle}${forPersonNote}

Generate all ${duration} days as a JSON array. Each day should progressively build understanding while always pointing to Christ.`;

    console.log("Calling AI to generate devotional...");

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
        temperature: 0.7,
      }),
    });

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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON from the response
    let days;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      let jsonString = jsonMatch ? jsonMatch[1] : content;
      
      // Escape literal newlines/tabs within JSON string values
      // Walk through and find content between quotes, escape control chars there
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
          // Escape control characters inside strings
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
      
      days = JSON.parse(result.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw content (first 2000 chars):", content.substring(0, 2000));
      throw new Error("Failed to parse devotional content");
    }

    if (!Array.isArray(days) || days.length === 0) {
      throw new Error("Invalid devotional format received");
    }

    // Insert all days into the database
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
      JSON.stringify({ success: true, daysGenerated: days.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-devotional:", error);
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
