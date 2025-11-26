import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if this is a service role call (Jeeves auto-play)
    const authHeader = req.headers.get("Authorization") || "";
    const isServiceRoleCall = authHeader.includes(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Only require user auth if not coming from service role (Jeeves auto-play)
    if (!isServiceRoleCall) {
      // Validate user auth for human players
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      );
      
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        throw new Error("Unauthorized");
      }
    }

    const body = await req.json();
    let { 
      gameId,
      playerId,
      cardType,
      cardData,
      explanation,
      studyTopic,
      isCombo = false,
      comboCards = null,
      autoPlayForPlayer = false,
    } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get recent moves for context
    const { data: recentMoves } = await supabaseClient
      .from('pt_multiplayer_moves')
      .select('card_type, card_data, explanation, jeeves_verdict')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .limit(5);

    const studyContext = recentMoves?.map(m => 
      `${m.card_type}: ${m.explanation} [${m.jeeves_verdict}]`
    ).join('\n') || 'No previous moves yet.';

    // Helper to generate a Jeeves play (pick card + explanation)
    const generateJeevesMoveForPlayer = async (targetPlayerId: string) => {
      const { data: jeevesCards } = await supabaseClient
        .from('pt_multiplayer_deck')
        .select('*')
        .eq('game_id', gameId)
        .eq('drawn_by', targetPlayerId)
        .eq('is_drawn', true)
        .limit(1);

      if (!jeevesCards || jeevesCards.length === 0) {
        throw new Error("No cards available for Jeeves to play");
      }

      const jeevesCard = jeevesCards[0];

      const jeevesPrompt = `You are a Jeeves AI competitor in a Phototheology card game on the topic: "${studyTopic}"

Recent context:
${studyContext}

You drew the principle card: ${jeevesCard.card_data.value}

A third Jeeves, Jeeves Prime, will later judge your play. Provide a 2-3 sentence explanation of how this principle applies to the study topic. Make it insightful and theologically sound, connecting the principle to Scripture.`;

      const jeevesResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are Jeeves, an AI Bible study companion who plays Phototheology card games. Be insightful, Christ-centered, and concise." },
            { role: "user", content: jeevesPrompt }
          ],
          temperature: 0.8,
        }),
      });

      const jeevesData = await jeevesResponse.json();
      const jeevesExplanation = jeevesData.choices[0].message.content;

      return {
        cardData: jeevesCard.card_data,
        explanation: jeevesExplanation,
      };
    };

    // If requested, let Jeeves auto-play for this player
    if (autoPlayForPlayer) {
      const { data: playerRow } = await supabaseClient
        .from('pt_multiplayer_players')
        .select('display_name')
        .eq('id', playerId)
        .single();

      if (!playerRow || !playerRow.display_name.includes('Jeeves')) {
        throw new Error("autoPlayForPlayer is only supported for Jeeves players");
      }

      const jeevesMove = await generateJeevesMoveForPlayer(playerId);
      cardType = "principle";
      cardData = jeevesMove.cardData;
      explanation = jeevesMove.explanation;
    }

    const systemPrompt = `You are Jeeves Prime, the Black Master judge for Phototheology Multiplayer Card Study.

Your role is to evaluate whether a player's card play is:
1. Theologically sound
2. Correctly applied to the study topic
3. Meaningfully advancing the Bible study

In "Jeeves vs Jeeves" games, you are the third Jeeves who judges between Black Master Jeeves Alpha and Black Master Jeeves Beta. Always stay Christ-centered, fair, and clear about why one line of reasoning is stronger than another.

**CRITICAL PHOTOTHEOLOGY PRINCIPLES:**
- Every interpretation must be Christ-centered (Concentration Room rule)
- Types point forward to Christ (lamb, temple, Passover → Christ)
- Parallels are mirrored actions across time (Babel/Pentecost, Exodus/Return)
- Cycles follow: Fall → Covenant → Sanctuary → Enemy → Restoration
- Eight cycles: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re
- Three Heavens: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final)
- Sanctuary blueprint: every element points to Christ's redemption
- Fruit test: does it produce Christlike character?

**CARD TYPES:**
- Room Cards: Specific PT rooms (Story Room, Prophecy Room, Blue Room, 24FPS, etc.)
- Principle Cards: Dimensions, Time-Zones, Fruit, Sanctuary codes, Connect-6
- Theme Cards: Covenant, Faith, Judgment, Exile/Return, Kingdom, Sanctuary, Spiritual War
- Verse Cards: Supporting Scripture
- Sanctuary Code Cards: ALT, LAMP, TABLE, VEIL, ARK
- 24FPS Action Cards: Movement-based narrative frames
- Boost/Sabotage: Special actions (validate legitimacy)

**JUDGMENT CRITERIA:**
1. APPROVED ✔ - Card is correctly used, theologically sound, and advances study meaningfully
2. PARTIAL △ - Correct direction but needs clarification or depth
3. REJECTED ✘ - Incorrect usage, irrelevant, or theologically problematic

Return JSON with this structure:
{
  "verdict": "approved" | "partial" | "rejected",
  "feedback": "<2-4 sentences explaining your judgment>",
  "points": <number 0-10>,
  "bonuses": {
    "chain_combo": <boolean>,
    "deep_insight": <boolean>,
    "prophetic_connection": <boolean>,
    "christ_centered": <boolean>,
    "sanctuary_integration": <boolean>,
    "multi_dimensional": <boolean>
  }
}

Be firm but encouraging. Reject plays that miss the mark, but explain why.`;

    const userPrompt = `Study Topic: ${studyTopic}

Recent Study Context:
${studyContext}

Current Play:
Card Type: ${cardType}
${isCombo ? `Combo Play with cards: ${JSON.stringify(comboCards)}` : ''}
Card Data: ${JSON.stringify(cardData)}
Player's Explanation: ${explanation}

Judge this play. Is it theologically sound, correctly applied, and meaningfully advancing the study?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let judgment;
    try {
      judgment = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      judgment = {
        verdict: "partial",
        feedback: "I need more clarity on how this card advances our study.",
        points: 0,
        bonuses: {}
      };
    }

    // Calculate total points
    let totalPoints = judgment.points || 0;
    const bonuses = judgment.bonuses || {};
    
    if (bonuses.chain_combo) totalPoints += 4;
    if (bonuses.deep_insight) totalPoints += 2;
    if (bonuses.prophetic_connection) totalPoints += 2;
    if (bonuses.christ_centered) totalPoints += 3;
    if (bonuses.sanctuary_integration) totalPoints += 3;
    if (bonuses.multi_dimensional) totalPoints += 3;

    // Get move number
    const { count } = await supabaseClient
      .from('pt_multiplayer_moves')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId);

    const moveNumber = (count || 0) + 1;

    // Insert the move with judgment
    const { error: insertError } = await supabaseClient
      .from('pt_multiplayer_moves')
      .insert({
        game_id: gameId,
        player_id: playerId,
        move_number: moveNumber,
        card_type: cardType,
        card_data: cardData,
        explanation: explanation,
        jeeves_verdict: judgment.verdict,
        jeeves_feedback: judgment.feedback,
        points_awarded: totalPoints,
        is_combo: isCombo,
        combo_cards: comboCards
      });

    if (insertError) throw insertError;

    // Get game info to check mode
    const { data: gameData } = await supabaseClient
      .from('pt_multiplayer_games')
      .select('game_mode')
      .eq('id', gameId)
      .single();

    // Update player data based on verdict
    if (judgment.verdict === 'approved') {
      // Discard card, add points, reset rejections
      const { data: player } = await supabaseClient
        .from('pt_multiplayer_players')
        .select('cards_remaining, score, consecutive_rejections')
        .eq('id', playerId)
        .single();

      if (player) {
        await supabaseClient
          .from('pt_multiplayer_players')
          .update({
            cards_remaining: Math.max(0, player.cards_remaining - 1),
            score: player.score + totalPoints,
            consecutive_rejections: 0
          })
          .eq('id', playerId);
      }
    } else if (judgment.verdict === 'rejected') {
      // Draw card, increment rejections
      const { data: player } = await supabaseClient
        .from('pt_multiplayer_players')
        .select('cards_remaining, consecutive_rejections')
        .eq('id', playerId)
        .single();

      if (player) {
        const newRejections = player.consecutive_rejections + 1;
        const skipNextTurn = newRejections >= 3;
        
        await supabaseClient
          .from('pt_multiplayer_players')
          .update({
            cards_remaining: player.cards_remaining + 1,
            consecutive_rejections: skipNextTurn ? 0 : newRejections,
            skip_next_turn: skipNextTurn
          })
          .eq('id', playerId);
      }
    }

    // After judgment, advance the turn
    const { data: allPlayers } = await supabaseClient
      .from('pt_multiplayer_players')
      .select('*')
      .eq('game_id', gameId)
      .order('joined_at');

    if (allPlayers && allPlayers.length > 0) {
      const currentIndex = allPlayers.findIndex(p => p.id === playerId);
      const nextIndex = (currentIndex + 1) % allPlayers.length;
      const nextPlayer = allPlayers[nextIndex];

      // Update game to advance turn to next player
      await supabaseClient
        .from('pt_multiplayer_games')
        .update({ current_turn_player_id: nextPlayer.id })
        .eq('id', gameId);

      // Check if we need to trigger Jeeves' turn automatically
      const isVsJeevesMode =
        gameData?.game_mode === '1v1-jeeves' ||
        gameData?.game_mode === 'team-vs-jeeves' ||
        gameData?.game_mode === 'jeeves-vs-jeeves';
      
      if (isVsJeevesMode && nextPlayer.display_name.includes('Jeeves')) {
        // Add a 4-second delay in Jeeves vs Jeeves mode to allow observers to read
        const delayMs = gameData?.game_mode === 'jeeves-vs-jeeves' ? 4000 : 1500;
        
        // Use setTimeout-like delay for Deno
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        const jeevesJudgmentResponse = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/judge-pt-card-play`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              "Content-Type": "application/json",
              "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
            },
            body: JSON.stringify({
              gameId,
              playerId: nextPlayer.id,
              cardType: "principle",
              cardData: null,
              explanation: "",
              studyTopic,
              isCombo: false,
              comboCards: null,
              autoPlayForPlayer: true,
            }),
          }
        );

        if (!jeevesJudgmentResponse.ok) {
          const errorText = await jeevesJudgmentResponse.text();
          console.error("Failed to judge Jeeves' play:", errorText);
        } else {
          console.log("Jeeves played successfully after delay!");
        }
      }
    }

    return new Response(
      JSON.stringify({
        ...judgment,
        totalPoints,
        moveNumber
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in judge-pt-card-play:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
