import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
    const { sermonText, sermonTitle, preacher, sermonDate, churchId, userId, amplifiedStudyId } = await req.json();

    if (!sermonText || !churchId || !userId) {
      return new Response(
        JSON.stringify({ error: "sermonText, churchId, and userId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert a "generating" record immediately so frontend can poll
    const { data: packet, error: insertError } = await supabase
      .from("sermon_discipleship_packets")
      .insert({
        church_id: churchId,
        sermon_title: sermonTitle || "Untitled Sermon",
        preacher: preacher || null,
        sermon_date: sermonDate || null,
        created_by: userId,
        sermon_amplified_study_id: amplifiedStudyId || null,
        status: "generating",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to create packet record");
    }

    const packetId = packet.id;

    // Return immediately — do generation in background
    const responsePayload = { success: true, packetId };

    // Use EdgeRuntime.waitUntil to keep the function alive
    const generatePromise = (async () => {
      try {
        // RAG corpus for theological grounding
        const ragResult = await getCorpusContext({
          query: `${sermonTitle || ''} ${sermonText.substring(0, 3000)}`.slice(0, 4000),
          matchCount: 3,
        });

        const systemPrompt = `You are a Phototheology discipleship engine. Given a sermon transcript, you produce a COMPLETE discipleship factory output. ALL Scripture MUST be KJV.

You operate within the Phototheology Palace framework:
- 8 Floors: Furnishing (memory), Investigation (detective), Freestyle (connections), Next Level (Christ-centered depth), Vision (prophecy/sanctuary), Three Heavens (cycles/cosmic), Spiritual/Emotional (heart), Master (reflexive)
- Room codes: SR (Story), IR (Imagination), CR (Concentration/Christ-centered), DR (Dimensions), BL (Blue/Sanctuary), PR (Prophecy), 3A (Three Angels), @Ad-@Re (Cycles), FRm (Fire), etc.

RESPOND ONLY with valid JSON matching this exact schema:
{
  "executive_summary": "3-5 sentence overview of the sermon's core message and significance",
  "key_verses": ["exactly 10 KJV verse references central to the sermon"],
  "theological_map": {
    "core_doctrines": ["list of doctrinal themes addressed"],
    "sanctuary_connections": ["how the sermon connects to sanctuary furniture/services"],
    "palace_rooms": ["which PT rooms this sermon activates, with codes"],
    "cycle_placement": "which cycle(s) this sermon touches (@Ad through @Re)",
    "heaven_horizon": "which Day of the Lord horizon applies (1H, 2H, or 3H)"
  },
  "prophetic_map": {
    "daniel_connections": ["connections to Daniel's prophecies"],
    "revelation_connections": ["connections to Revelation"],
    "three_angels_relevance": "how this relates to the Three Angels' Messages",
    "great_controversy_angle": "the cosmic conflict dimension"
  },
  "claim_ladder": [
    {
      "claim": "a core doctrinal claim from the sermon",
      "textual_basis": ["KJV verses supporting the claim"],
      "logical_move": "the reasoning step from text to claim",
      "possible_objections": ["2-3 likely objections from critics or other traditions"],
      "counterarguments": ["strong rebuttals using Scripture and logic"],
      "weak_spots": "any area where the argument could be strengthened",
      "strength_rating": 1-10
    }
  ],
  "debate_prep": {
    "thesis_statement": "the sermon's central thesis in one sentence",
    "strongest_arguments": ["top 3 strongest arguments"],
    "anticipated_attacks": ["likely critic attacks"],
    "defense_weapons": ["Scripture-based defense responses"],
    "checkmate_question": "one question that silences opposition"
  },
  "micro_study_plan": [
    {
      "day": 1,
      "title": "Textual Depth",
      "focus": "Exegete 2-3 key passages",
      "passages": ["KJV references"],
      "study_prompt": "detailed study instructions",
      "reflection_question": "personal reflection question",
      "palace_room": "which room to engage"
    },
    {
      "day": 2,
      "title": "Theological Depth",
      "focus": "Explore doctrinal implications",
      "passages": ["KJV references"],
      "study_prompt": "detailed study instructions",
      "reflection_question": "personal reflection question",
      "palace_room": "which room to engage"
    },
    {
      "day": 3,
      "title": "Symbol / Prophetic Depth",
      "focus": "Connect to Daniel, Revelation, sanctuary, covenant themes",
      "passages": ["KJV references"],
      "study_prompt": "detailed study instructions",
      "reflection_question": "personal reflection question",
      "palace_room": "which room to engage"
    },
    {
      "day": 4,
      "title": "Personal Application",
      "focus": "Heart examination, repentance prompts, obedience reflection",
      "passages": ["KJV references"],
      "study_prompt": "detailed study instructions",
      "reflection_question": "personal reflection question",
      "palace_room": "which room to engage"
    },
    {
      "day": 5,
      "title": "Evangelistic Outflow",
      "focus": "Who can you share this with?",
      "passages": ["KJV references"],
      "study_prompt": "detailed study instructions",
      "social_media_template": "ready-to-post social media text",
      "one_minute_explainer": "1-minute verbal explainer script",
      "palace_room": "which room to engage"
    }
  ],
  "discussion_questions": ["5 progressive discussion questions (observation → interpretation → application)"],
  "controversy_question": "1 provocative but edifying question that sparks debate",
  "evangelism_script": "a 1-minute verbal script for sharing this sermon's message with a non-believer",
  "shareable_quote": "one powerful, tweetable quote from or inspired by the sermon (under 280 chars)",
  "prayer_focus": "a structured prayer guide for the week based on the sermon",
  "obedience_challenge": "a specific, measurable action step for the week",
  "house_fire_guide": {
    "opening_icebreaker": "fun opening question to start discussion",
    "discussion_questions": ["5 structured questions for small group"],
    "controversy_question": "1 question that forces deeper thinking",
    "application_challenge": "practical group challenge",
    "prayer_focus": "closing prayer theme",
    "leader_notes": "tips for the small group leader"
  }
}`;

        let userPrompt = `Generate a COMPLETE discipleship factory packet from this sermon:

SERMON TITLE: ${sermonTitle || "Untitled Sermon"}
PREACHER: ${preacher || "Unknown"}
DATE: ${sermonDate || "N/A"}

SERMON CONTENT:
${sermonText.substring(0, 15000)}`;

        if (ragResult.chunkCount > 0) {
          userPrompt += ragResult.corpusContext;
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
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.5,
            max_tokens: 8000,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("AI gateway error:", response.status, errorText);
          
          if (response.status === 429) {
            await supabase.from("sermon_discipleship_packets").update({ status: "error" }).eq("id", packetId);
            return;
          }
          if (response.status === 402) {
            await supabase.from("sermon_discipleship_packets").update({ status: "error" }).eq("id", packetId);
            return;
          }
          throw new Error(`AI gateway error: ${response.status}`);
        }

        const aiResponse = await response.json();
        const content = aiResponse.choices?.[0]?.message?.content;

        if (!content) throw new Error("No content in AI response");

        let packetData: any;
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
          jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, (ch: string) => {
            if (ch === '\n' || ch === '\r' || ch === '\t') return ch;
            return ' ';
          });
          jsonStr = jsonStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
          
          try {
            packetData = JSON.parse(jsonStr);
          } catch {
            jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
            jsonStr = jsonStr.replace(/\"([^\"]*(?:\\.[^\"]*)*)\"/g, (match: string) => {
              return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
            });
            packetData = JSON.parse(jsonStr);
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw content preview:", content.substring(0, 500));
          await supabase.from("sermon_discipleship_packets").update({ status: "error" }).eq("id", packetId);
          return;
        }

        // Update the packet with all generated data
        const { error: updateError } = await supabase
          .from("sermon_discipleship_packets")
          .update({
            status: "ready",
            executive_summary: packetData.executive_summary || null,
            key_verses: packetData.key_verses || [],
            theological_map: packetData.theological_map || {},
            prophetic_map: packetData.prophetic_map || {},
            claim_ladder: packetData.claim_ladder || [],
            debate_prep: packetData.debate_prep || {},
            micro_study_plan: packetData.micro_study_plan || [],
            discussion_questions: packetData.discussion_questions || [],
            controversy_question: packetData.controversy_question || null,
            evangelism_script: packetData.evangelism_script || null,
            shareable_quote: packetData.shareable_quote || null,
            prayer_focus: packetData.prayer_focus || null,
            obedience_challenge: packetData.obedience_challenge || null,
            house_fire_guide: packetData.house_fire_guide || {},
          })
          .eq("id", packetId);

        if (updateError) {
          console.error("Update error:", updateError);
        } else {
          console.log("Discipleship packet generated successfully:", packetId);
        }
      } catch (err) {
        console.error("Background generation error:", err);
        await supabase.from("sermon_discipleship_packets").update({ status: "error" }).eq("id", packetId);
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
