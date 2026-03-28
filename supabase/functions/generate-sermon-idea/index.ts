import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// The complete list of allowed Palace rooms
const ALLOWED_ROOMS = [
  // Floor 1 - Furnishing
  "Story Room (SR)", "Imagination Room (IR)", "24FPS Room (24)", "Bible Rendered (BR)", "Translation Room (TR)", "Gems Room (GR)",
  // Floor 2 - Investigation
  "Observation Room (OR)", "Def-Com Room (DC)", "Symbols/Types Room (ST)", "Questions Room (QR)", "Q&A Chains (QA)",
  // Floor 3 - Freestyle
  "Nature Freestyle (NF)", "Personal Freestyle (PF)", "Bible Freestyle (BF)", "History Freestyle (HF)", "Listening Room (LR)",
  // Floor 4 - Next Level
  "Concentration Room (CR)", "Dimensions Room (DR)", "Connect-6 (C6)", "Theme Room (TRm)", "Time Zone (TZ)", "Patterns Room (PRm)", "Parallels Room (P‖)", "Fruit Room (FRt)", "Christ in Every Chapter (CEC)", "Room 66 (R66)",
  // Floor 5 - Vision
  "Blue Room / Sanctuary (BL)", "Prophecy Room (PR)", "Three Angels Room (3A)", "Feasts Room (FE)", "Mathematics Room (MATH)",
  // Floor 6 - Three Heavens & Cycles
  "Three Heavens (1H/2H/3H)", "Cycles (@Ad-@Re)", "Juice Room (JR)",
  // Floor 7 - Spiritual
  "Fire Room (FRm)", "Meditation Room (MR)", "Speed Room (SRm)",
];

// Room data with principles
const ROOM_DATA: Record<string, { summary: string; principles: string[] }> = {
  "Story Room": {
    summary: "Visualize Bible narratives as living scenes",
    principles: ["Scene Setting", "Character Motivation", "Narrative Arc", "Emotional Truth", "Divine Presence"]
  },
  "Observation Room": {
    summary: "Examine text details - who, what, when, where, why",
    principles: ["5W Questions", "Repeated Words", "Contrasts", "Progressions", "Literary Structure"]
  },
  "Symbols/Types Room": {
    summary: "Decode Bible symbols and connect OT types to NT antitypes",
    principles: ["Scripture Interprets Scripture", "First Mention", "Symbol Consistency", "Type-Antitype", "Shadow to Substance"]
  },
  "Blue Room / Sanctuary": {
    summary: "Use the sanctuary blueprint to understand salvation",
    principles: ["Furniture Typology", "Priestly Ministry", "Two Apartments", "Day of Atonement", "Christ's Ministry"]
  },
  "Patterns Room": {
    summary: "Identify recurring biblical patterns",
    principles: ["Repeat & Enlarge", "Chiastic Structure", "Prophetic Pattern", "Historical Cycle"]
  },
  "Parallels Room": {
    summary: "Find parallel stories, themes, and structures",
    principles: ["Story Parallels", "Character Parallels", "Structural Parallels", "Covenant Parallels"]
  },
  "Concentration Room": {
    summary: "Find Christ in every passage",
    principles: ["Christ Anticipated", "Christ Present", "Christ Fulfilled", "Christ Central", "Luke 24:27 Lens"]
  },
  "Three Heavens (1H/2H/3H)": {
    summary: "Understand the three Day-of-the-LORD cycles: 1H (Babylon/Restoration), 2H (70AD/New Covenant), 3H (Final New Creation)",
    principles: ["DoL¹/NE¹ Horizon", "DoL²/NE² Horizon", "DoL³/NE³ Horizon", "Cycle Placement"]
  },
  "Prophecy Room": {
    summary: "Interpret prophecy through proper hermeneutics",
    principles: ["Year-Day", "Historical Flow", "Dual Application", "Conditional/Unconditional"]
  },
  "Three Angels Room": {
    summary: "The everlasting gospel message of Revelation 14",
    principles: ["Fear God", "Give Glory", "Judgment Hour", "Babylon Warning", "Mark Contrast"]
  },
  "Fire Room": {
    summary: "Personal application and spiritual response",
    principles: ["Heart Application", "Life Change", "Surrender Call", "Spirit Dependence"]
  },
  "24FPS Room": {
    summary: "Create mental images for memory retention",
    principles: ["Visual Anchoring", "Spatial Memory", "Emotional Connection", "Story Hook"]
  }
};

const SYSTEM_PROMPT = `You are Jeeves, the assistant inside the PhotoTheology (PT) app.
Your job is to generate "Sermon Idea Starters" (short sermon seeds), not full Bible studies.

HARD CONSTRAINTS (NON-NEGOTIABLE)
1) NO HALLUCINATED ROOMS:
   - You may ONLY use rooms included in ALLOWED_ROOMS (provided below).
   - Never invent, rename, merge, or imply additional rooms.

2) ONE PRINCIPLE PER ROOM:
   - For each selected room, silently choose EXACTLY ONE principle from that room's PRINCIPLES list.
   - You must NOT combine multiple principles from a single room.
   - You must NOT use any principle from any room not selected.

3) DO NOT NAME PRINCIPLES:
   - You must NEVER print principle names, codes, "Floor X," "Room X," or internal PT jargon.
   - You may apply the logic of the principle, but you must keep the output natural-language only.

4) 24FPS RULE:
   - Do NOT use 24FPS logic unless the user explicitly selects the 24FPS Room.
   - If selected, only suggest ONE memory image to remember the idea. Do not expand.

5) SERMON IDEA STARTER SCOPE:
   - Output must be a "seed," not a full outline:
     • 1 Hook line (1 sentence)
     • 1 Big Idea (1 sentence)
     • 3 Seed Moves (3 bullets, 8–14 words each)
     • 3 KJV anchor verses (references only; no full verse text)
     • 1 Christ Resolution line (1 sentence) — must connect to Jesus clearly
     • 1 Application line (1 sentence)

6) CHRIST RESOLUTION REQUIRED:
   - Every idea must resolve toward Christ clearly (Luke 24:27 principle), without quoting it unless asked.

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN (NOT Christ) in Leviticus 16
- LITTLE HORN = ROME/PAPACY (NOT Antiochus) in Daniel 7 & 8
- DANIEL 11:14-22 = PAGAN ROME (NOT Antiochus/Greece). v.20=Augustus, v.21=Tiberius, v.22=Christ crucified. DANIEL 11:23-29 = PAPAL ROME military phase (v.25-26 KOS=Islam). DANIEL 11:30-39 = Papal religious phase. DANIEL 11:40 KOS=Atheism/French Rev, KON=SATAN impersonating Christ heading triple union (Papacy+Apostate Protestantism+Spiritualism).
- TWO-PHASE SANCTUARY: Holy Place at ascension, Most Holy in 1844
- DAY OF ATONEMENT = 1844 judgment (NOT Christ's death)
- All Scripture must be KJV

7) SCHOLAR CITATION RULE (NON-NEGOTIABLE):
   - When referencing ANY scholar, commentator, or theologian, include a footnote:
     • Full name + life dates (birth-death)
     • Primary work being referenced
     • Denominational tradition
   - Example: "Adam Clarke (1760-1832, Methodist, *Clarke's Commentary*)"
   - Example: "Ellen G. White (1827-1915, SDA, *Desire of Ages*, p. 123)"
   - NEVER mention a scholar without proper citation

ALLOWED_ROOMS:
${ALLOWED_ROOMS.join(", ")}

ROOM_DATA:
${JSON.stringify(ROOM_DATA, null, 2)}

OUTPUT FORMAT (EXACT - respond only with valid JSON):
{
  "title": "7–12 words",
  "hook": "1 captivating sentence",
  "bigIdea": "1 sentence thesis",
  "seedMoves": ["bullet 1 (8-14 words)", "bullet 2 (8-14 words)", "bullet 3 (8-14 words)"],
  "anchorTexts": ["KJV ref 1", "KJV ref 2", "KJV ref 3"],
  "christResolution": "1 sentence connecting to Jesus",
  "application": "1 sentence practical takeaway",
  "memoryImage": "only if 24FPS Room selected, else null"
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passage, selectedRooms, customPrompt } = await req.json();

    if (!passage) {
      return new Response(
        JSON.stringify({ error: "Passage is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate selected rooms against allowed rooms
    const rooms = selectedRooms || ["Observation Room", "Concentration Room", "Fire Room"];
    const invalidRooms = rooms.filter((r: string) => !ALLOWED_ROOMS.includes(r));

    if (invalidRooms.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Invalid rooms: ${invalidRooms.join(", ")}. Please choose from the available rooms.`,
          allowedRooms: ALLOWED_ROOMS
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit to 3 rooms max
    const finalRooms = rooms.slice(0, 3);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build room-specific data for the prompt
    const roomDataForPrompt = finalRooms.reduce((acc: Record<string, any>, room: string) => {
      if (ROOM_DATA[room]) {
        acc[room] = ROOM_DATA[room];
      }
      return acc;
    }, {});

    const userPrompt = `PASSAGE: ${passage}

USER_SELECTED_ROOMS: ${JSON.stringify(finalRooms)}

ROOM_DATA FOR SELECTED ROOMS:
${JSON.stringify(roomDataForPrompt, null, 2)}

${customPrompt ? `ADDITIONAL GUIDANCE: ${customPrompt}` : ""}

Generate ONE sermon idea starter following the exact JSON format. Be creative, biblical, and Christ-centered.`;

    console.log(`[generate-sermon-idea] Generating idea for passage: ${passage}, rooms: ${finalRooms.join(", ")}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8, // Higher for creativity
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[generate-sermon-idea] AI API error: ${errorText}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let ideaData;
    try {
      ideaData = JSON.parse(content);
    } catch (parseError) {
      console.error("[generate-sermon-idea] Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log(`[generate-sermon-idea] Successfully generated: ${ideaData.title}`);

    return new Response(
      JSON.stringify({
        success: true,
        idea: ideaData,
        roomsUsed: finalRooms,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[generate-sermon-idea] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
