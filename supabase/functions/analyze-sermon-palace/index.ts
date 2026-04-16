import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getContentBehavioralEngine } from "../_shared/content-behavioral-engine.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Palace room definitions for prompts
const FLOOR_ROOMS: Record<number, { name: string; rooms: { code: string; name: string; description: string }[] }> = {
  1: {
    name: "Furnishing Floor (Memory & Visualization)",
    rooms: [
      { code: "SR", name: "Story Room", description: "Recall and sequence the stories, images, and narratives present in this sermon" },
      { code: "IR", name: "Imagination Room", description: "Step inside the scenes — what would you see, hear, feel, smell?" },
      { code: "24F", name: "24FPS Room", description: "Assign one symbolic frame/image per major section of this sermon" },
      { code: "BR", name: "Bible Rendered", description: "Create one master image that captures the sermon's sweep" },
      { code: "TR", name: "Translation Room", description: "Convert abstract concepts into concrete, vivid images" },
      { code: "GR", name: "Gems Room", description: "Extract the striking insights, surprises, and powerful points" },
    ],
  },
  2: {
    name: "Investigation Floor (Detective Work)",
    rooms: [
      { code: "OR", name: "Observation Room", description: "List 20+ observations — details, phrases, repetitions, oddities" },
      { code: "DC", name: "Def-Com Room", description: "Examine key Greek/Hebrew words and historical/cultural context" },
      { code: "ST", name: "Symbols/Types Room", description: "Identify all symbols, types, and shadows of Christ" },
      { code: "QR", name: "Questions Room", description: "Generate intratextual, intertextual, and Phototheological questions" },
      { code: "QA", name: "Q&A Room", description: "Cross-reference Scripture witnesses to answer the questions raised" },
    ],
  },
  3: {
    name: "Freestyle Floor (Connections)",
    rooms: [
      { code: "NF", name: "Nature Freestyle", description: "Connect the sermon to lessons from nature (Romans 1:20)" },
      { code: "PF", name: "Personal Freestyle", description: "How does this sermon connect to everyday life experiences?" },
      { code: "BF", name: "Bible Freestyle (Verse Genetics)", description: "Trace verse family trees — siblings, cousins, distant relatives" },
      { code: "HF", name: "History/Social Freestyle", description: "Connect to secular history, culture, current events" },
      { code: "LR", name: "Listening Room", description: "What echoes from other sermons, testimonies, or conversations?" },
    ],
  },
  4: {
    name: "Next Level Floor (Christ-Centered Depth)",
    rooms: [
      { code: "CR", name: "Concentration Room", description: "How does every section reveal Christ?" },
      { code: "DR", name: "Dimensions Room", description: "5 dimensions: Literal, Christ, Me, Church, Heaven" },
      { code: "C6", name: "Connect 6 Room", description: "Classify by genre: Prophecy, Poetry, History, Gospel, Epistle, Parable" },
      { code: "TRm", name: "Theme Room", description: "Map onto walls: Sanctuary, Life of Christ, Great Controversy, Time Prophecy, Gospel Floor, Heaven Ceiling" },
      { code: "TZ", name: "Time Zone Room", description: "Place in past/present/future × heaven/earth (6 zones)" },
      { code: "PRm", name: "Patterns Room", description: "Identify recurring patterns (40 days, 3 days, deliverer stories)" },
      { code: "P‖", name: "Parallels Room", description: "Find mirrored actions across time (Babel/Pentecost, etc.)" },
      { code: "FRt", name: "Fruit Room", description: "Does the interpretation produce love, joy, peace? (Gal 5:22-23)" },
      { code: "CEC", name: "Christ in Every Chapter", description: "Name and trace the line to Christ in every major section" },
      { code: "R66", name: "Room 66", description: "Trace one theme from this sermon through all 66 books" },
    ],
  },
  5: {
    name: "Vision Floor (Prophecy & Sanctuary)",
    rooms: [
      { code: "BL", name: "Blue Room (Sanctuary)", description: "Map to sanctuary furniture: Altar, Laver, Lampstand, Table, Incense, Ark, Veil, Gate" },
      { code: "PR", name: "Prophecy Room", description: "Connect to Daniel 2, 7, 8-9; Revelation 13, 14 timelines" },
      { code: "3A", name: "Three Angels' Room", description: "How does this relate to Revelation 14:6-12?" },
      { code: "Feasts", name: "Feasts Room", description: "Which feast(s) of Israel does this connect to?" },
    ],
  },
  6: {
    name: "Three Heavens Floor (Cycles & Cosmic Context)",
    rooms: [
      { code: "@Ad", name: "Adamic Cycle", description: "Connections to Eden, Fall, Promise (Gen 3:15)" },
      { code: "@No", name: "Noahic Cycle", description: "Connections to Flood, Ark, Rainbow covenant" },
      { code: "@Ab", name: "Abrahamic Cycle", description: "Connections to Call, Covenant, Moriah" },
      { code: "@Mo", name: "Mosaic Cycle", description: "Connections to Exodus, Sinai, Tabernacle" },
      { code: "@Cy", name: "Cyrusic Cycle", description: "Connections to Exile, Return, Rebuild" },
      { code: "@CyC", name: "Cyrus-Christ Cycle", description: "Type meets antitype, shadow meets substance" },
      { code: "@Sp", name: "Spirit Cycle", description: "Pentecost, Church Age, Revivals, Reformation" },
      { code: "@Re", name: "Remnant Cycle", description: "End-time witness, judgment, Second Coming" },
      { code: "1H", name: "First Heaven (DoL¹/NE¹)", description: "Babylon destruction → Cyrusic restoration" },
      { code: "2H", name: "Second Heaven (DoL²/NE²)", description: "70 AD → New Covenant heavenly order" },
      { code: "3H", name: "Third Heaven (DoL³/NE³)", description: "Final cosmic judgment → literal New Creation" },
    ],
  },
  7: {
    name: "Spiritual & Emotional Floor",
    rooms: [
      { code: "FRm", name: "Fire Room", description: "Where does this sermon burn? What emotions does it evoke?" },
      { code: "MR", name: "Meditation Room", description: "Slow down — which phrase deserves to be marinated in prayer?" },
      { code: "SRm", name: "Speed Room", description: "Rapid-fire 10 connections in 60 seconds" },
    ],
  },
  8: {
    name: "Master Floor (Reflexive Mastery)",
    rooms: [
      { code: "∞", name: "Reflexive Mastery", description: "Teach this sermon naturally without naming rooms — let the Palace flow through you" },
    ],
  },
};

function buildPromptForMode(mode: string, selectedRooms: string[], selectedFloor: number | null): string {
  const baseInstruction = `You are a Phototheology Palace Analyst. ALL Scripture MUST be KJV. Analyze the given sermon through the Phototheology Palace framework.`;

  if (mode === "full_sweep") {
    const allFloors = Object.entries(FLOOR_ROOMS).map(([num, floor]) => {
      const roomList = floor.rooms.map(r => `  - ${r.code} (${r.name}): ${r.description}`).join("\n");
      return `### Floor ${num}: ${floor.name}\n${roomList}`;
    }).join("\n\n");

    return `${baseInstruction}

FULL PALACE SWEEP: Analyze this sermon through ALL 8 Floors and every room. For each room, provide specific, substantive analysis tied to the sermon content.

${allFloors}

Respond with valid JSON:
{
  "mode": "full_sweep",
  "floors": [
    {
      "floor_number": 1,
      "floor_name": "Furnishing Floor",
      "rooms": [
        {
          "code": "SR",
          "name": "Story Room",
          "analysis": "detailed analysis for this room...",
          "key_scriptures": ["KJV references"],
          "actionable_application": "what to DO with this insight"
        }
      ]
    }
  ],
  "palace_summary": "1 paragraph synthesis of the full Palace sweep",
  "christ_thread": "the unified Christ-thread through all 8 floors"
}`;
  }

  if (mode === "room_specific") {
    const selectedRoomDetails = selectedRooms.map(code => {
      for (const floor of Object.values(FLOOR_ROOMS)) {
        const room = floor.rooms.find(r => r.code === code);
        if (room) return `- ${room.code} (${room.name}): ${room.description}`;
      }
      return `- ${code}`;
    }).join("\n");

    return `${baseInstruction}

ROOM-SPECIFIC ANALYSIS: Analyze this sermon through ONLY the following selected rooms. Go DEEP — each room should have substantial, detailed analysis.

Selected Rooms:
${selectedRoomDetails}

Respond with valid JSON:
{
  "mode": "room_specific",
  "rooms": [
    {
      "code": "room code",
      "name": "room name",
      "floor_number": 1,
      "deep_analysis": "extensive, detailed analysis (at least 3-5 paragraphs)...",
      "key_scriptures": ["KJV references with full verse text"],
      "connections": ["cross-references and links to other rooms"],
      "actionable_application": "specific, measurable action step",
      "teaching_angle": "how to teach this insight to others"
    }
  ],
  "synthesis": "how these rooms work together on this sermon"
}`;
  }

  if (mode === "floor_drill") {
    const floor = FLOOR_ROOMS[selectedFloor || 1];
    if (!floor) return baseInstruction;

    const roomList = floor.rooms.map(r => `- ${r.code} (${r.name}): ${r.description}`).join("\n");

    return `${baseInstruction}

FLOOR-BY-FLOOR DRILL: Analyze this sermon through EVERY room on Floor ${selectedFloor}: ${floor.name}. Go deep into each room.

Rooms on this floor:
${roomList}

Respond with valid JSON:
{
  "mode": "floor_drill",
  "floor_number": ${selectedFloor},
  "floor_name": "${floor.name}",
  "rooms": [
    {
      "code": "room code",
      "name": "room name",
      "deep_analysis": "detailed analysis (3-5 paragraphs)...",
      "key_scriptures": ["KJV references"],
      "actionable_application": "what to DO",
      "difficulty_rating": "beginner|intermediate|advanced"
    }
  ],
  "floor_summary": "what this floor reveals about the sermon",
  "next_floor_preview": "what the next floor would unlock"
}`;
  }

  if (mode === "cycle_heaven") {
    return `${baseInstruction}

CYCLE & HEAVEN PLACEMENT: Map this sermon into the 8 Cycles (@Ad → @Re) and Three Heavens (1H/2H/3H) framework. This is cosmic-level placement.

The 8 Cycles:
@Ad (Adamic): Eden → Promise
@No (Noahic): Flood → Covenant
@Ab (Abrahamic): Call → Covenant People
@Mo (Mosaic): Exodus → Sanctuary Nation
@Cy (Cyrusic): Exile → Return & Rebuild
@CyC (Cyrus-Christ): Type → Antitype Deliverer
@Sp (Spirit): Church Age → Pentecost → Revivals
@Re (Remnant): End-Time → Judgment → Second Coming

The Three Heavens:
1H (DoL¹/NE¹): Babylon destruction → Cyrusic restoration (586 BC)
2H (DoL²/NE²): 70 AD destruction → New Covenant heavenly order
3H (DoL³/NE³): Final cosmic judgment → literal New Creation

Respond with valid JSON:
{
  "mode": "cycle_heaven",
  "primary_cycle": {
    "code": "@Mo",
    "name": "Mosaic",
    "rationale": "why this is the primary cycle",
    "sermon_elements": ["specific sermon content mapped to this cycle"]
  },
  "secondary_cycles": [
    {
      "code": "@CyC",
      "name": "Cyrus-Christ",
      "connection": "how this cycle echoes in the sermon"
    }
  ],
  "heaven_placement": {
    "primary_heaven": "2H",
    "primary_rationale": "why this heaven horizon applies",
    "echoes_in_other_heavens": [
      { "heaven": "1H", "echo": "how the sermon echoes in this heaven" }
    ]
  },
  "five_part_rhythm": {
    "fall": "the human failure or crisis in this sermon",
    "covenant": "God's promise of restoration",
    "sanctuary": "God's presence and mediation",
    "enemy": "opposition against God's people",
    "restoration": "God intervenes and preserves"
  },
  "ascension_mapping": {
    "text_level": "word/phrase level insight",
    "chapter_level": "chapter context",
    "book_level": "book-wide theme",
    "cycle_level": "covenant cycle placement",
    "heaven_level": "cosmic horizon"
  },
  "cosmic_summary": "2-3 paragraph synthesis placing this sermon in the grand sweep of redemption history"
}`;
  }

  return baseInstruction;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packetId, userId, analysisMode, selectedRooms, selectedFloor, sermonText, sermonTitle } = await req.json();

    if (!packetId || !userId || !analysisMode) {
      return new Response(
        JSON.stringify({ error: "packetId, userId, and analysisMode are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert generating record
    const { data: analysis, error: insertError } = await supabase
      .from("sermon_palace_analyses")
      .insert({
        packet_id: packetId,
        user_id: userId,
        analysis_mode: analysisMode,
        selected_rooms: selectedRooms || [],
        selected_floor: selectedFloor || null,
        sermon_text: sermonText?.substring(0, 500) || null, // Store snippet only
        status: "generating",
      })
      .select("id")
      .single();

    if (insertError) throw new Error("Failed to create analysis record: " + insertError.message);

    const analysisId = analysis.id;

    // Return immediately
    const responsePayload = { success: true, analysisId };

    const generatePromise = (async () => {
      try {
        const systemPrompt = buildPromptForMode(analysisMode, selectedRooms || [], selectedFloor || null);

        const userPrompt = `Analyze this sermon through the Palace:

SERMON TITLE: ${sermonTitle || "Untitled"}

SERMON CONTENT:
${(sermonText || "").substring(0, 15000)}`;

        // Use gemini-2.5-flash for speed; full_sweep gets pro for depth
        const model = analysisMode === "full_sweep" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt + "\n\n" + getContentBehavioralEngine() },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.5,
            max_tokens: analysisMode === "full_sweep" ? 16000 : 8000,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("AI gateway error:", response.status, errorText);
          await supabase.from("sermon_palace_analyses").update({ status: "error" }).eq("id", analysisId);
          return;
        }

        const aiResponse = await response.json();
        const content = aiResponse.choices?.[0]?.message?.content;
        if (!content) throw new Error("No content in AI response");

        let result: any;
        try {
          let jsonStr = content.trim();
          const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
          const firstBrace = jsonStr.indexOf('{');
          const lastBrace = jsonStr.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
          }
          jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
          result = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          await supabase.from("sermon_palace_analyses").update({ status: "error" }).eq("id", analysisId);
          return;
        }

        await supabase
          .from("sermon_palace_analyses")
          .update({ status: "ready", analysis_result: result })
          .eq("id", analysisId);

        console.log("Palace analysis generated:", analysisId, analysisMode);
      } catch (err) {
        console.error("Background palace analysis error:", err);
        await supabase.from("sermon_palace_analyses").update({ status: "error" }).eq("id", analysisId);
      }
    })();

    // Fire-and-forget: the promise runs in the background
    generatePromise.catch(err => console.error("Background task failed:", err));

    return new Response(
      JSON.stringify(responsePayload),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
