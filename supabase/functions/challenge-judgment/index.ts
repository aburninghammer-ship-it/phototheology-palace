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
    const { battleId, playerId, originalJudgment, cardCode, responseText, storyText } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing challenge for battle:', battleId, 'player:', playerId);

    // Have a second AI review the original judgment
    const reviewPrompt = `You are Jeeves, the Phototheology AI assistant. A player has challenged your previous judgment.

ORIGINAL JUDGMENT THAT IS BEING CHALLENGED:
Verdict: ${originalJudgment.verdict}
Feedback: ${originalJudgment.feedback}

THE STORY:
${storyText}

PLAYER'S CARD: ${cardCode}

PLAYER'S RESPONSE:
${responseText}

TASK: Review your original judgment carefully. Was it too harsh? Did the player make a valid point that you initially missed? 

Consider:
1. Does their response show genuine biblical insight, even if imperfect?
2. Did they correctly apply the principle in a meaningful way?
3. Were you perhaps too strict in your initial evaluation?

If upon reflection you believe the player's response deserves approval, respond with: "CHALLENGE_UPHELD" followed by a brief explanation of why you're changing your judgment.

If you still believe the original rejection was correct, respond with: "CHALLENGE_DENIED" followed by a detailed explanation of why the response still doesn't meet the standard.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are Jeeves, a fair and thoughtful Phototheology judge who reconsidera judgments when players challenge them.' },
          { role: 'user', content: reviewPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI request failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const reviewText = aiData.choices[0].message.content.trim();
    
    console.log('AI review result:', reviewText);

    const isUpheld = reviewText.toUpperCase().includes('CHALLENGE_UPHELD');
    const finalVerdict = isUpheld ? 'challenge_upheld' : 'challenge_denied';

    // Decrement challenges_remaining regardless of outcome
    const { data: player } = await supabase
      .from('pt_battle_players')
      .select('score, cards_in_hand, challenges_remaining')
      .eq('battle_id', battleId)
      .eq('player_id', playerId)
      .single();

    if (!player) {
      throw new Error('Player not found');
    }

    // Check if player has challenges remaining
    if (player.challenges_remaining <= 0) {
      return new Response(
        JSON.stringify({ error: 'No challenges remaining' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If challenge is upheld, update the move to approved and award points
    if (isUpheld) {
      // Find the most recent rejected move for this player
      const { data: recentMove } = await supabase
        .from('pt_battle_moves')
        .select('*')
        .eq('battle_id', battleId)
        .eq('player_id', playerId)
        .eq('judge_verdict', 'rejected')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (recentMove) {
        // Update the move to approved
        await supabase
          .from('pt_battle_moves')
          .update({
            judge_verdict: 'approved',
            judge_feedback: `[Challenge Upheld] ${reviewText.replace(/CHALLENGE_UPHELD/i, '').trim()}`,
            points_awarded: 10,
          })
          .eq('id', recentMove.id);

        // Award points and decrement challenges
        await supabase
          .from('pt_battle_players')
          .update({
            score: player.score + 10,
            cards_in_hand: player.cards_in_hand.filter((c: string) => c !== cardCode),
            challenges_remaining: player.challenges_remaining - 1,
          })
          .eq('battle_id', battleId)
          .eq('player_id', playerId);
      }
    } else {
      // Challenge denied - just decrement challenges
      await supabase
        .from('pt_battle_players')
        .update({
          challenges_remaining: player.challenges_remaining - 1,
        })
        .eq('battle_id', battleId)
        .eq('player_id', playerId);
    }

    return new Response(
      JSON.stringify({
        finalVerdict,
        explanation: reviewText.replace(/CHALLENGE_(UPHELD|DENIED)/i, '').trim(),
        challengesRemaining: player.challenges_remaining - 1,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in challenge-judgment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
