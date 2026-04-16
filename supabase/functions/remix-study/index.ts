import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REMIX_TYPES = [
  "Sanctuary Remix — Reorganize all elements along the sanctuary furniture progression (Altar → Laver → Candlestick → Table → Incense → Ark → Most Holy Place). Show how the study's content maps onto the blueprint of redemption.",
  "Character Focus Remix — Select 2-3 dominant typological characters from the study and build an entire study around THEIR arcs alone, showing how each character's full biblical story deepens the original point.",
  "Pattern Remix — Identify the dominant pattern (death→glory, exile→return, testing→victory, rejection→exaltation) and restructure the entire study as movements within that single pattern.",
  "Great Controversy Remix — Reorganize the study through the cosmic conflict lens. Every element becomes a battle scene: Christ vs Satan, truth vs counterfeit, faith vs presumption.",
  "Prophetic Timeline Remix — Place every element on a prophetic timeline (Daniel/Revelation framework). Show how the study's themes track across the sweep of prophecy from Babylon to New Jerusalem.",
  "Bride Remix — Restructure the study through the marriage/covenant metaphor. Christ preparing a people, the wedding feast imagery, covenant loyalty and betrayal.",
  "Three Heavens Remix — Map the study's elements across the three Day-of-the-LORD horizons (1H: Babylon/Restoration, 2H: 70 AD/New Covenant, 3H: Final New Creation). Show how themes echo across all three.",
  "Cycle Remix — Take the study and show how its themes repeat-and-enlarge across 2-3 of the Eight Cycles (@Ad→@Re). Same pattern, escalating revelation.",
  "Dimensions Remix — Run the study's core thesis through all 5 Dimensions (Literal, Christ, Personal, Church, Heavenly) to produce a layered, multi-perspective study.",
  "Apologetics Remix — Restructure the study as a defense of Christ's deity, messiahship, or a specific doctrine. Turn devotional content into evidential reasoning.",
];

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

    // Randomly select 3 distinct remix types for this run
    const shuffled = [...REMIX_TYPES].sort(() => Math.random() - 0.5);
    const selectedTypes = shuffled.slice(0, 3);

    const systemPrompt = `You are Jeeves, the Phototheology Palace AI — a master of biblical reorganization and theological architecture. You are NOT a summarizer or paraphraser. You are a REMIXER.

YOUR MISSION: Take the user's study and produce an ENTIRELY NEW STUDY from the SAME raw elements. You do not reword — you RESTRUCTURE. You impose a new theological architecture on the same data, revealing connections and progressions the original never showed.

Think of it this way:
- The user's original study = raw bricks scattered on the ground
- Your remix = those SAME bricks built into a cathedral with a completely different blueprint

WHAT A REMIX IS:
✅ Same scriptural elements, types, and parallels — reorganized into a NEW flow
✅ A new theological STRUCTURE imposed on the data (sanctuary progression, prophetic timeline, pattern movement, etc.)
✅ New INSIGHTS that only emerge from the new arrangement
✅ A study that could be preached as a standalone sermon or series
✅ Corrections of weak typological links (e.g., if the original says "Eliezer" when it means "Elisha," fix it)

WHAT A REMIX IS NOT:
❌ Rewording the same list with different adjectives
❌ Adding commentary around the original structure
❌ Simply analyzing what the study already says
❌ Generic spiritual encouragement

CRITICAL RULES:
1. Use KJV Bible text when quoting Scripture
2. PRESERVE every typological element from the original — nothing is lost, only reorganized
3. If the original has weak or incorrect parallels, note the correction and strengthen them
4. Always find Christ — He is the center of every remix
5. Each remix must have clear MOVEMENT (beginning → development → climax → resolution)
6. Be specific: quote exact verses, name exact types/symbols, identify exact patterns
7. Write in a warm but scholarly pastoral tone — this should feel like sitting with a master teacher
8. Each section of the remix should have a clear theological heading that shows the NEW structure

PALACE ROOMS REFERENCE:
Floor 1 (Furnishing): Story Room (SR), Imagination Room (IR), 24FPS (24F), Bible Rendered (BR), Translation Room (TR), Gems Room (GR)
Floor 2 (Investigation): Observation Room (OR), Def-Com Room (DC), Symbols/Types (ST), Questions Room (QR), Q&A Chains (QA)
Floor 3 (Freestyle): Nature Freestyle (NF), Personal Freestyle (PF), Bible Freestyle/Verse Genetics (BF), History Freestyle (HF), Listening Room (LR)
Floor 4 (Next Level): Concentration Room (CR), Dimensions Room (DR), Connect 6 (C6), Theme Room (TRm), Time Zone Room (TZ), Patterns Room (PRm), Parallels Room (P‖), Fruit Room (FRt), Christ in Every Chapter (CEC), Room 66 (R66)
Floor 5 (Vision): Blue Room/Sanctuary (BL), Prophecy Room (PR), Three Angels' Room (3A), Feasts Room
Floor 6 (Three Heavens): Eight Cycles (@Ad→@Re), Three Heavens (1H/2H/3H), Juice Room (JR)
Floor 7 (Spiritual): Fire Room (FRm), Meditation Room (MR), Speed Room (SRm)
Floor 8 (Master): Reflexive Mastery (∞)

FOR THIS REMIX SESSION, you will produce 3 Remix Tracks using these specific Remix Types:

**Track 1: ${selectedTypes[0]}**

**Track 2: ${selectedTypes[1]}**

**Track 3: ${selectedTypes[2]}**

FORMAT YOUR OUTPUT EXACTLY LIKE THIS:

# 🎛️ Palace Remix Report

## Original Study Analysis
[2-3 sentences identifying the study's core elements, dominant typological chain, and structural pattern. Note any corrections needed.]

---

## 🎵 Remix Track 1: "[Creative Title Based on the Remix Type]"
**Remix Type:** [Name of the remix type]
**Palace Rooms:** [List rooms with codes]
**The New Architecture:** [One sentence describing the new structural principle]

[THE FULL REMIXED STUDY — This should be a complete, preachable study with clear sections/movements. Not commentary on the original. A NEW STUDY built from the same elements. Minimum 5-8 substantial sections with scripture references. Each section should have a bold heading showing the new structure.]

### 💎 Track 1 Gems
[2-3 insights that ONLY emerge from this particular reorganization — things invisible in the original arrangement]

---

## 🎵 Remix Track 2: "[Creative Title]"
[Same format as Track 1]

---

## 🎵 Remix Track 3: "[Creative Title]"
[Same format as Track 1]

---

## 🏛️ Remix Synthesis
[How do these three tracks together reveal dimensions of the original study that no single arrangement could show? What is the meta-lesson about how STRUCTURE shapes theological understanding?]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Here is my study to remix:\n\n---\n${studyText}\n---\n\nRemix this study. Take every element I used and rebuild it into 3 completely new studies — each with a different theological architecture. Preserve all my typological parallels but reorganize them into new movements and progressions. Correct any weak links. Show me what I couldn't see because of how I originally arranged it.`
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
