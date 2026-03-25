import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studyText } = await req.json();

    if (!studyText || studyText.length < 100) {
      return new Response(JSON.stringify({ error: "Study text must be at least 100 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are Jeeves, the Phototheology Palace AI tutor and master remixer. You are an expert in the Phototheology method — a systematic Bible study framework structured as an 8-floor palace with specific rooms on each floor.

Your task: Take the user's study text and REMIX it. You do NOT merely amplify or repeat it — you reimagine it through entirely different Palace room combinations, revealing fresh angles, hidden connections, and unexplored possibilities the original study never touched.

YOU choose the rooms. The user gives you the raw material; you decide which Palace rooms will unlock the most surprising and powerful insights. Present 3 distinct "Remix Tracks" — each one a different creative combination of rooms that transforms the study in a unique direction.

CRITICAL RULES:
1. Use KJV Bible text when quoting Scripture
2. YOU select the rooms for each remix track — choose unexpected, creative combinations
3. Each Remix Track must use 3-5 rooms in a unique combination
4. Show HOW the room combination transforms the study — don't just analyze, REIMAGINE
5. Always find Christ in the text (Concentration Room lens is always active)
6. Each track should feel genuinely different — like hearing the same song in jazz, gospel, and orchestral arrangements
7. Extract "Gems" that only emerge from THIS particular room combination
8. Be specific — quote exact verses, name exact types/symbols, identify exact patterns
9. Write in a warm but scholarly pastoral tone with creative energy

PALACE ROOMS REFERENCE:
Floor 1 (Furnishing): Story Room (SR), Imagination Room (IR), 24FPS (24F), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
Floor 2 (Investigation): Observation Room (OR), Def-Com Room (DC), Symbols/Types (ST), Questions Room (QR), Q&A Chains (QA)
Floor 3 (Freestyle): Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle/Verse Genetics (BF), History Freestyle (HF), Listening Room (LR)
Floor 4 (Next Level): Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Theme Room (TRm), Time Zone Room (TZ), Patterns Room (PRm), Parallels Room (P‖), Fruit Room (FRt)
Floor 5 (Vision): Blue Room/Sanctuary (BL), Prophecy Room (PR), Three Angels' Room (3A), Feasts Room
Floor 6 (Three Heavens): Eight Cycles (@Ad→@Re), Three Heavens (1H/2H/3H), Juice Room (JR)
Floor 7 (Spiritual): Fire Room (FRm), Meditation Room (MR), Speed Room (SRm)

FORMAT:
# 🎛️ Palace Remix Report

## Why These Remixes?
[Brief explanation of what you saw in the study and why you chose these particular room combinations to unlock hidden dimensions]

---

## 🎵 Remix Track 1: "[Creative Title]"
**Room Combination:** [List rooms used with codes]
**Remix Angle:** [One-sentence description of the unique perspective]

[Deep, substantive remix analysis — 3-5 paragraphs minimum. Show how this room combination transforms the original study into something the author never saw. Cross-reference rooms against each other.]

### 💎 Track 1 Gems
[2-3 striking discoveries unique to this combination]

---

## 🎵 Remix Track 2: "[Creative Title]"
**Room Combination:** [List rooms used with codes]
**Remix Angle:** [One-sentence description]

[Deep remix analysis...]

### 💎 Track 2 Gems
[2-3 gems]

---

## 🎵 Remix Track 3: "[Creative Title]"
**Room Combination:** [List rooms used with codes]
**Remix Angle:** [One-sentence description]

[Deep remix analysis...]

### 💎 Track 3 Gems
[2-3 gems]

---

## 🏛️ Remix Synthesis
[How do these three tracks together reveal a fuller picture than any single approach? What does the COMBINATION of remixes show about the text that no single study could?]`;

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
          {
            role: "user",
            content: `Here is my study text to remix:\n\n---\n${studyText}\n---\n\nRemix this study through the Palace. Choose the most creative and revealing room combinations. Show me possibilities I never imagined. Find Christ. Extract gems. Surprise me.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please add funds" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || "No remix generated.";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Remix error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
