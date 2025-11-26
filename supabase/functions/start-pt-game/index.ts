import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { gameId } = await req.json();

    if (!gameId) {
      throw new Error("gameId is required");
    }

    console.log(`Starting PT multiplayer game: ${gameId}`);

    // Get players for this game (ordered by join time)
    const { data: players, error: playersError } = await supabase
      .from("pt_multiplayer_players")
      .select("id")
      .eq("game_id", gameId)
      .order("joined_at");

    if (playersError) throw playersError;
    if (!players || players.length === 0) {
      throw new Error("No players found for this game");
    }

    const firstPlayerId = players[0].id;

    // Check if cards already exist for this game
    const { data: existingCards, error: existingCardsError } = await supabase
      .from("pt_multiplayer_deck")
      .select("id")
      .eq("game_id", gameId)
      .limit(1);

    if (existingCardsError) throw existingCardsError;

    if (!existingCards || existingCards.length === 0) {
      console.log(`No cards yet for game ${gameId}, invoking deal-pt-cards`);
      const { error: dealError } = await supabase.functions.invoke("deal-pt-cards", {
        body: { gameId },
      });

      if (dealError) {
        console.error("Error from deal-pt-cards:", dealError);
        throw new Error(dealError.message ?? "Failed to deal cards for this game");
      }
    } else {
      console.log(`Cards already exist for game ${gameId}, skipping dealing`);
    }

    // Activate the game and set the first player's turn
    const { data: updatedGame, error: updateError } = await supabase
      .from("pt_multiplayer_games")
      .update({
        status: "active",
        current_turn_player_id: firstPlayerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameId)
      .select("id, status, current_turn_player_id")
      .single();

    if (updateError) throw updateError;

    console.log(
      `Game ${gameId} started. Status: ${updatedGame.status}, first turn: ${updatedGame.current_turn_player_id}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        game: updatedGame,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in start-pt-game function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
