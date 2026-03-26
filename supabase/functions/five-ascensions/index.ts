import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CYCLES = [
  { code: "@Ad", name: "Adamic", description: "Eden → Promise. Fall, seed promise, skins, two seeds, Seth's line." },
  { code: "@No", name: "Noahic", description: "Violence → Flood → Rainbow. Ark as floating temple, one door, reset." },
  { code: "@Ab", name: "Abrahamic", description: "Babel scatter → Call of Abram → Isaac. God narrows to one family." },
  { code: "@Mo", name: "Mosaic", description: "Egypt bondage → Exodus → Sinai → Tabernacle → Canaan. Covenant nation." },
  { code: "@Cy", name: "Cyrusic", description: "Babylon destroys temple → Cyrus decree → Altar/Temple rebuilt → Ezra/Nehemiah." },
  { code: "@CyC", name: "Cyrus-Christ", description: "Post-exile weakness → True Anointed appears → Cross = true altar → Resurrection." },
  { code: "@Sp", name: "Holy Spirit", description: "Pentecost → Spirit-lit lampstands → Revivals → Reformation → Global mission." },
  { code: "@Re", name: "Remnant", description: "Final apostasy → Beast/Image/Mark → Remnant fidelity → Second Coming → New Earth." },
];

const HEAVENS = [
  { code: "1H", name: "First Heaven (DoL¹/NE¹)", description: "Babylonian destruction of Jerusalem (586 BC) → Post-exilic restoration under Cyrus. 'New heavens and earth' = renewed civic-worship order (Isa 65-66 typological)." },
  { code: "2H", name: "Second Heaven (DoL²/NE²)", description: "Roman destruction of Jerusalem (70 AD) → New Covenant/Heavenly Sanctuary order. Church as living temple, Christ ministering in heavenly sanctuary (Heb 8-10)." },
  { code: "3H", name: "Third Heaven (DoL³/NE³)", description: "Final cosmic judgment → Literal New Heavens and New Earth (Rev 21-22). No temple needed — the Lamb is its light." },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { verseReference, verseText, mode, step, dynamicTarget, userName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const greeting = userName ? `The student's name is ${userName}. Address them warmly by first name occasionally.` : "";

    const cycleList = CYCLES.map(c => `${c.code} (${c.name}): ${c.description}`).join("\n");
    const heavenList = HEAVENS.map(h => `${h.code} (${h.name}): ${h.description}`).join("\n");

    let stepInstruction = "";
    const isDynamic = mode === "dynamic";

    if (step === 1) {
      stepInstruction = `ASCENSION 1 — TEXT LEVEL
Analyze "${verseReference}" at the word/phrase level.
- Break down key Greek/Hebrew terms and their weight.
- Note grammatical structure, tense, voice.
- Identify every theological gem embedded in the individual words.
- Quote the full KJV text and dissect it forensically.
This is the microscope view — every syllable matters.`;
    } else if (step === 2) {
      if (isDynamic && dynamicTarget?.chapter) {
        stepInstruction = `ASCENSION 2 — DYNAMIC CHAPTER CONTEXT
Now place "${verseReference}" into the context of ${dynamicTarget.chapter} (a DIFFERENT chapter than its home).
- What new resonances emerge when this verse is read alongside ${dynamicTarget.chapter}?
- How does the narrative arc of ${dynamicTarget.chapter} illuminate this verse differently?
- What unexpected connections or contrasts appear?
This is creative, Spirit-led exploration — find the surprising links.`;
      } else {
        stepInstruction = `ASCENSION 2 — CHAPTER CONTEXT (Static)
Now place "${verseReference}" into its HOME chapter context.
- What is the chapter's overall narrative arc?
- How does this verse function within the chapter's movement?
- What comes before and after, and how does that shape meaning?
- What would be lost if this verse were read in isolation?`;
      }
    } else if (step === 3) {
      if (isDynamic && dynamicTarget?.book) {
        stepInstruction = `ASCENSION 3 — DYNAMIC BOOK CONTEXT
Now place "${verseReference}" into the framework of the book of ${dynamicTarget.book} (a DIFFERENT book than its home).
- How does ${dynamicTarget.book}'s overarching theme reframe this verse?
- What new theological dimensions emerge?
- How would a reader of ${dynamicTarget.book} hear this verse differently?
This is jazz improvisation — take the familiar and place it in a new key.`;
      } else {
        stepInstruction = `ASCENSION 3 — BOOK CONTEXT (Static)
Now place "${verseReference}" into its HOME book's overarching theme.
- What is the book's central argument or narrative?
- How does this verse serve the book's purpose?
- Where does this verse sit in the book's structural outline?
- How does the author's intent shape interpretation?`;
      }
    } else if (step === 4) {
      if (isDynamic && dynamicTarget?.cycle) {
        const targetCycle = CYCLES.find(c => c.code === dynamicTarget.cycle);
        stepInstruction = `ASCENSION 4 — DYNAMIC CYCLE CONTEXT
Now place "${verseReference}" into the ${targetCycle?.name || dynamicTarget.cycle} cycle (${dynamicTarget.cycle}) — which may NOT be its home cycle.
Cycle description: ${targetCycle?.description || ""}
- How does reading this verse through the ${targetCycle?.name} lens change its weight?
- Where in the Fall → Covenant → Sanctuary → Enemy → Restoration rhythm does it land?
- What echoes or contrasts emerge?
This is like hearing the same melody in a different movement of the symphony.`;
      } else {
        stepInstruction = `ASCENSION 4 — CYCLE CONTEXT (Static)
Identify which of the 8 Cycles "${verseReference}" belongs to and explain WHY.

The 8 Cycles:
${cycleList}

Each cycle follows: Fall → Covenant → Sanctuary → Enemy → Restoration.
- Which cycle is this verse's HOME cycle?
- Where does it sit in the Fall→Covenant→Sanctuary→Enemy→Restoration rhythm?
- How does the cycle's arc illuminate the verse's meaning?
- What does this verse contribute to its cycle's story?`;
      }
    } else if (step === 5) {
      if (isDynamic && dynamicTarget?.heaven) {
        const targetHeaven = HEAVENS.find(h => h.code === dynamicTarget.heaven);
        stepInstruction = `ASCENSION 5 — DYNAMIC HEAVEN CONTEXT
Now place "${verseReference}" into ${targetHeaven?.name || dynamicTarget.heaven} — which may NOT be its home heaven.
Heaven description: ${targetHeaven?.description || ""}
- How does viewing this verse through the ${dynamicTarget.heaven} Day-of-the-Lord horizon change its prophetic weight?
- What would this verse mean if it were read as addressing ${targetHeaven?.name}?
- What new eschatological or covenantal dimensions emerge?
CRITICAL: The Three Heavens are NOT atmospheric layers. They are three Day-of-the-Lord judgment cycles.`;
      } else {
        stepInstruction = `ASCENSION 5 — HEAVEN CONTEXT (Static)
Identify which of the Three Heavens (Day-of-the-Lord horizons) "${verseReference}" belongs to.

The Three Heavens:
${heavenList}

CRITICAL GUARDRAIL: These are NOT atmospheric/cosmological layers (sky/stars/God's abode). They are three epochal Day-of-the-Lord judgment-and-renewal cycles.

- Which Heaven is this verse's HOME horizon?
- Does it address Babylon-era judgment/restoration (1H), apostolic-era temple judgment/New Covenant (2H), or final cosmic renewal (3H)?
- How does placing it in its correct heaven prevent misinterpretation?
- What forward echoes does it cast to the later heavens?`;
      }
    }

    const systemPrompt = `You are Jeeves, the Phototheology scholar-guide. You are conducting a Five Ascensions study — the staircase of Phototheology that lifts a text from its smallest parts to its cosmic stage.

${greeting}

CURRENT STEP: Ascension ${step} of 5.
MODE: ${isDynamic ? "DYNAMIC (creative exploration — placing the verse in unexpected contexts)" : "STATIC (anchored, structured — finding the verse's true home)"}
VERSE: ${verseReference}
${verseText ? `VERSE TEXT (KJV): "${verseText}"` : ""}

${stepInstruction}

FORMATTING RULES:
- Use markdown with clear headers
- Quote KJV Scripture in full — don't just reference it
- Be substantive — this is deep study, not surface summary
- Use Palace room codes naturally where relevant (CR, DR, BL, PR, etc.) but don't force them
- Be warm and scholarly — Jeeves is a trusted mentor
- End with a "🔑 Key Insight" that captures the ascension's main discovery
- Keep Christ central at every level

THEOLOGICAL GUARDRAILS:
- Three Heavens = Day-of-the-Lord cycles, NOT atmospheric layers
- Day of Atonement points to 1844, NOT fulfilled at the Cross
- Christ's death fulfills Passover
- Historicist prophetic method only
- No invented Palace rooms or principles`;

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
          { role: "user", content: `Perform Ascension ${step} analysis for ${verseReference}. ${isDynamic && dynamicTarget ? `Dynamic target: ${JSON.stringify(dynamicTarget)}` : "Static mode — find its true home."}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response generated.";

    return new Response(JSON.stringify({ response: content, step, mode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("five-ascensions error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
