import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS since Jeeves needs to insert moves for all players
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { battleId, playerId, cardCode, responseText, storyText } = await req.json();

    if (!battleId || !playerId || !cardCode || !responseText || !storyText) {
      throw new Error('Missing required fields');
    }

    // Get recent moves for context
    const { data: recentMoves } = await supabaseClient
      .from('pt_battle_moves')
      .select('*')
      .eq('battle_id', battleId)
      .order('move_number', { ascending: false })
      .limit(3);

    const contextMoves = recentMoves?.map(m => 
      `Move ${m.move_number}: Card ${m.card_used} - "${m.response_text.substring(0, 100)}..." (${m.judge_verdict})`
    ).join('\n') || 'No previous moves';

    // Call AI for judgment
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are Jeeves, an expert Phototheology judge for the PT Card Battle game.

Your role: Evaluate how well a player uses their PT principle card to amplify and illuminate a Bible story/text.

Card System:
- Principle cards (like 3D, @Ad, DR-2D, etc.) are lenses through which to view Scripture
- Players must demonstrate how the principle genuinely enriches understanding of the text
- Good answers show insight, connection, and biblical grounding
- Weak answers are superficial, forced, or miss the principle's depth

Story Context: ${storyText}

Recent moves for context:
${contextMoves}

Judging Criteria (weighted):
1. PRINCIPLE APPLICATION (40%): Does the answer correctly apply the PT principle?
2. BIBLICAL DEPTH (30%): Shows understanding of the text and its context?
3. INSIGHT QUALITY (20%): Reveals something meaningful, not just surface-level?
4. COHERENCE (10%): Is it clear, well-expressed, and logical?

Scoring:
- APPROVED: Award 1-3 points based on quality
  * 1 point: Basic but correct application
  * 2 points: Good application with insight
  * 3 points: Excellent application with deep insight
- REJECTED: 0 points if the principle is misapplied or answer is inadequate

Bonuses (add +1 point each, max 2 bonuses):
- "cross_reference": Includes relevant supporting verses
- "typology": Shows Christ-centered or typological depth
- "practical": Includes actionable spiritual application

CRITICAL FORMATTING RULES FOR FEEDBACK:
- DO NOT use asterisks (*) or double asterisks (**) for emphasis
- DO NOT use markdown formatting at all
- DO use emojis generously to add warmth and clarity (✨ 🎯 💡 📖 🔥 ⚡ 🌟 etc.)
- DO break feedback into clear paragraphs with blank lines between them for readability
- Keep feedback warm, encouraging, and detailed (3-5 sentences minimum)
- Make it conversational and personal, as if speaking directly to the player

Response format (JSON only):
{
  "verdict": "approved" | "rejected",
  "points": 0-3,
  "bonuses": ["cross_reference", "typology", "practical"],
  "feedback": "Warm, detailed feedback with emojis and clear paragraph breaks. No asterisks or markdown allowed."
}`;

    const userPrompt = `Card Played: ${cardCode}
Player's Response:
${responseText}

Judge this response.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse judgment
    let judgment;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        judgment = JSON.parse(jsonMatch[0]);
      } else {
        judgment = JSON.parse(content);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      judgment = {
        verdict: 'approved',
        points: 1,
        bonuses: [],
        feedback: 'Good effort! Keep studying the Word.'
      };
    }

    // Calculate total points
    const basePoints = judgment.points || 0;
    const bonusPoints = (judgment.bonuses || []).length;
    const totalPoints = basePoints + bonusPoints;

    // Get next move number
    const { data: maxMove } = await supabaseClient
      .from('pt_battle_moves')
      .select('move_number')
      .eq('battle_id', battleId)
      .order('move_number', { ascending: false })
      .limit(1)
      .single();

    const moveNumber = (maxMove?.move_number || 0) + 1;

    // Insert the move
    const { data: move, error: moveError } = await supabaseClient
      .from('pt_battle_moves')
      .insert({
        battle_id: battleId,
        player_id: playerId,
        move_number: moveNumber,
        card_used: cardCode,
        response_text: responseText,
        judge_verdict: judgment.verdict,
        judge_feedback: judgment.feedback,
        points_awarded: totalPoints,
        bonuses: judgment.bonuses || [],
      })
      .select()
      .single();

    if (moveError) throw moveError;

    // Update player based on verdict
    const { data: player } = await supabaseClient
      .from('pt_battle_players')
      .select('*')
      .eq('battle_id', battleId)
      .eq('player_id', playerId)
      .single();

    if (player) {
      let cardsInHand = player.cards_in_hand || [];
      let cardsPlayed = player.cards_played || [];
      let newScore = player.score;

      if (judgment.verdict === 'approved') {
        // Remove card from hand, add to played
        cardsInHand = cardsInHand.filter((c: string) => c !== cardCode);
        cardsPlayed = [...cardsPlayed, cardCode];
        newScore += totalPoints;
      }
      // If rejected, card stays in hand

      await supabaseClient
        .from('pt_battle_players')
        .update({
          cards_in_hand: cardsInHand,
          cards_played: cardsPlayed,
          score: newScore,
        })
        .eq('battle_id', battleId)
        .eq('player_id', playerId);

      // Check if player won (no cards left)
      if (cardsInHand.length === 0 && judgment.verdict === 'approved') {
        await supabaseClient
          .from('pt_card_battles')
          .update({
            status: 'completed',
            winner: playerId,
          })
          .eq('id', battleId);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        judgment: {
          ...judgment,
          totalPoints,
          moveNumber,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in judge-card-battle:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});