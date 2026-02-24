import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Palace Floors & Rooms descriptions
const PALACE_ROOMS: Record<string, { name: string; method: string }> = {
  "SR": { name: "Story Room", method: "Recall the narrative sequence as a vivid mental movie" },
  "IR": { name: "Imagination Room", method: "Step inside the scene - feel, hear, smell, experience" },
  "24F": { name: "24FPS Room", method: "Create one symbolic image for this chapter" },
  "BR": { name: "Bible Rendered", method: "Map into the 24-chapter block pattern" },
  "TR": { name: "Translation Room", method: "Convert abstract words into concrete images" },
  "GR": { name: "Gems Room", method: "Extract striking insights that shine with clarity" },
  "OR": { name: "Observation Room", method: "Log 30-50 details without interpretation" },
  "DC": { name: "Def-Com Room", method: "Analyze Greek/Hebrew definitions and cultural context" },
  "ST": { name: "Symbols/Types Room", method: "Identify typological patterns pointing to Christ" },
  "QR": { name: "Questions Room", method: "Ask 75 intratextual, intertextual, and PT questions" },
  "QA": { name: "Q&A Room", method: "Cross-reference Scripture to answer Scripture" },
  "NF": { name: "Nature Freestyle", method: "Connect to creation illustrations" },
  "PF": { name: "Personal Freestyle", method: "Apply to personal life experiences" },
  "BF": { name: "Bible Freestyle", method: "Trace verse genetics - siblings, cousins, relatives" },
  "HF": { name: "History Freestyle", method: "Find historical parallels and lessons" },
  "LR": { name: "Listening Room", method: "Actively listen for connections" },
  "CR": { name: "Concentration Room", method: "Locate Christ in this text" },
  "DR": { name: "Dimensions Room", method: "Apply 5D: Literal, Christ, Me, Church, Heaven" },
  "C6": { name: "Connect 6 Room", method: "Classify by genre and apply its rules" },
  "TRm": { name: "Theme Room", method: "Place on Sanctuary/Great Controversy/Gospel walls" },
  "TZ": { name: "Time Zone Room", method: "Assign past/present/future + heaven/earth" },
  "PRm": { name: "Patterns Room", method: "Identify recurring motifs (40 days, 3 days, etc.)" },
  "P‖": { name: "Parallels Room", method: "Find mirrored actions across time" },
  "FRt": { name: "Fruit Room", method: "Test: Does it produce Gal 5:22-23 fruit?" },
  "BL": { name: "Blue Room", method: "Map to sanctuary furniture and services" },
  "PR": { name: "Prophecy Room", method: "Connect to prophetic timeline and symbols" },
  "3A": { name: "Three Angels Room", method: "Apply to the final gospel messages" },
  "FR": { name: "Feasts Room", method: "Connect to Israel's feast calendar" },
  "JR": { name: "Juice Room", method: "Extract every drop through all principles" },
  "CEC": { name: "Christ in Every Chapter", method: "Find Christ's title/role and what He does in this text" },
  "R66": { name: "Room 66", method: "Trace how this theme develops Genesis to Revelation" },
  "MATH": { name: "Mathematics Room", method: "Apply biblical numerics and mathematical patterns" },
  "FRm": { name: "Fire Room", method: "Feel the emotional weight - let it convict" },
  "MR": { name: "Meditation Room", method: "Slow marination - repeat until saturated" },
  "SRm": { name: "Speed Room", method: "Rapid-fire connections in 60 seconds" },
};

// Cycle descriptions
const CYCLES: Record<string, { name: string; pattern: string }> = {
  "@Ad": { name: "Adamic", pattern: "Eden rebellion → Gen 3:15 Seed Promise → Animal skins (sacrifice) → Serpent/Cain opposition → Seth's line preserved" },
  "@No": { name: "Noahic", pattern: "Violence fills earth → Ark covenant (Gen 6:18) → Ark as floating temple → Mockers judged → Rainbow covenant, new start" },
  "@Ab": { name: "Abrahamic", pattern: "Babel scattering → 'All nations blessed' (Gen 12:3) → Altars/Moriah → Pharaoh/famine → Isaac's miraculous birth" },
  "@Mo": { name: "Mosaic", pattern: "Egypt bondage → Sinai covenant (Ex 6:7) → Tabernacle nation → Pharaoh's army → Canaan conquest" },
  "@Cy": { name: "Cyrusic", pattern: "Babylon destroys temple → Cyrus decree (Isa 44:28) → Temple rebuilt → Local opposition → Ezra/Nehemiah reforms" },
  "@CyC": { name: "Cyrus-Christ", pattern: "Post-exilic weakness → True Anointed appears → Christ is the Temple → Herod/Caesar/Pharisees → Resurrection & Ascension" },
  "@Sp": { name: "Spirit", pattern: "Disciples doubt → Spirit promise (Mt 28:20) → Pentecost micro-sanctuaries → Persecution/heresies → Revivals & Reformation" },
  "@Re": { name: "Remnant", pattern: "Final apostasy → Rev 12:17 remnant → Heavenly judgment → Dragon/beast/false prophet → Second Coming & New Earth" },
};

// Three Heavens descriptions
const HEAVENS: Record<string, { name: string; dol: string; ne: string; description: string }> = {
  "1H": { 
    name: "First Heaven", 
    dol: "DoL¹ - Babylon destroys Jerusalem (586 BC)", 
    ne: "NE¹ - Post-exilic restoration under Cyrus",
    description: "Prophetic restoration language: renewed civic-worship order, reconstituted people, rebuilt sanctuary/walls. Real yet typological—a forward-looking miniature of ultimate renewal."
  },
  "2H": { 
    name: "Second Heaven", 
    dol: "DoL² - Rome destroys Jerusalem (70 AD)", 
    ne: "NE² - New-Covenant/heavenly sanctuary order",
    description: "Covenantal and ecclesial renewal: the old order shaken, the unshakable kingdom received (Heb 12:26-28). Christ ministering in the heavenly sanctuary, church as living temple."
  },
  "3H": { 
    name: "Third Heaven", 
    dol: "DoL³ - Final cosmic judgment (Rev 20)", 
    ne: "NE³ - Literal New Creation (Rev 21-22)",
    description: "Ultimate, ontological re-creation: no temple because 'the Lord God Almighty and the Lamb are its temple'; no night, curse, death, or sea of separation."
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, verse, verseText, rooms, cycle, heaven, analysisType } = await req.json();

    console.log("PT Analysis request:", { book, chapter, verse, analysisType, rooms, cycle, heaven });

    let analysisPrompt = "";
    let systemContext = `You are a Phototheology expert analyzing ${book} ${chapter}:${verse}.\n\nVerse text: "${verseText}"\n\n`;

    if (analysisType === "palace" && rooms?.length > 0) {
      const roomMethods = rooms.map((code: string) => {
        const room = PALACE_ROOMS[code];
        return room ? `- ${code} (${room.name}): ${room.method}` : null;
      }).filter(Boolean).join("\n");

      analysisPrompt = `Apply these Palace Rooms to the verse:\n${roomMethods}\n\nProvide a focused analysis using each room's method. Be specific and practical.`;
    } else if (analysisType === "cycles" && cycle) {
      const cycleInfo = CYCLES[cycle];
      analysisPrompt = `Place this passage in the ${cycle} (${cycleInfo?.name}) Cycle.\n\nCycle Pattern: ${cycleInfo?.pattern}\n\nExplain how this verse fits within this cycle's narrative arc. Which phase (Fall/Covenant/Sanctuary/Enemy/Restoration) does it represent?`;
    } else if (analysisType === "heavens" && heaven) {
      const heavenInfo = HEAVENS[heaven];
      analysisPrompt = `Analyze this passage within the ${heaven} (${heavenInfo?.name}) horizon.\n\n${heavenInfo?.dol}\n${heavenInfo?.ne}\n\n${heavenInfo?.description}\n\nExplain how this text relates to this Day-of-the-LORD/New Heavens & Earth framework.`;
    } else if (analysisType === "sanctuary") {
      analysisPrompt = `Map this verse to the Sanctuary Blueprint.\n\nConsider:\n- Outer Court: Gate (entrance through Christ), Altar of Burnt Offering (Cross/sacrifice), Laver (baptism/cleansing)\n- Holy Place: Table of Showbread (Word of God), Lampstand (Spirit's light), Altar of Incense (prayer/intercession)\n- Most Holy Place: Veil (Christ's flesh), Ark (God's throne/law), Mercy Seat (atonement/grace)\n\nWhich sanctuary element(s) does this text connect to? How does the sanctuary pattern illuminate its meaning?`;
    } else if (analysisType === "ascensions") {
      analysisPrompt = `Apply the Five Ascensions framework to this verse:\n\n1. TEXT (Asc-1): Word-level study - definitions, grammar, lexical nuance\n2. CHAPTER (Asc-2): Place in chapter storyline context\n3. BOOK (Asc-3): Fit into ${book}'s overarching theme\n4. CYCLE (Asc-4): Which covenant cycle (@Ad → @Re) does this belong to?\n5. HEAVEN (Asc-5): Which Day-of-the-LORD horizon (1H/2H/3H)?\n\nProvide a brief analysis at each level, ascending from text to heaven.`;
    } else {
      analysisPrompt = `Provide a brief Phototheology analysis focusing on Christ-centered interpretation.`;
    }

    // Use Lovable AI gateway (no API key required)
    const response = await fetch("https://ai.gateway.lovable.dev/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemContext + "Keep responses focused and practical. Use Phototheology terminology appropriately." },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error response:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysis = aiData.choices?.[0]?.message?.content || "Analysis unavailable.";

    return new Response(
      JSON.stringify({ 
        analysis,
        book,
        chapter,
        verse,
        analysisType,
        rooms,
        cycle,
        heaven
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("PT Analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        analysis: "Analysis temporarily unavailable. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
