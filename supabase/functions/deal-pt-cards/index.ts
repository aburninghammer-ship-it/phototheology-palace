import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PT Principle Cards - comprehensive list from Phototheology knowledge
const PT_PRINCIPLES = {
  cycles: ["@Ad", "@No", "@Ab", "@Mo", "@Cy", "@CyC", "@Sp", "@Re"],
  floor1: ["SR", "IR", "24F", "BR", "TR", "GR"],
  floor2: ["OR", "DC", "ST", "QR", "QA"],
  floor3: ["NF", "PF", "BF", "HF", "LR"],
  floor4: ["CR", "DR", "C6", "TRm", "TZ", "PRm", "P‖", "CEC", "R66"],
  // Fruit Room expanded to 9 individual fruits of the Spirit
  fruitRoom: ["FRt-Love", "FRt-Joy", "FRt-Peace", "FRt-Patience", "FRt-Kindness", "FRt-Goodness", "FRt-Faithfulness", "FRt-Gentleness", "FRt-SelfControl"],
  floor5: ["BL", "PR", "3A"],
  floor6: ["JR"],
  floor7: ["FRm", "MR", "SRm"],
  dimensions: ["Asc-1", "Asc-2", "Asc-3", "Asc-4", "Asc-5"],
  expansions: ["Exp-W", "Exp-T", "Exp-D", "Exp-H"],
  heavens: ["1H", "2H", "3H"],
};

// Flatten all principles into a single deck
const ALL_PRINCIPLES = [
  ...PT_PRINCIPLES.cycles,
  ...PT_PRINCIPLES.floor1,
  ...PT_PRINCIPLES.floor2,
  ...PT_PRINCIPLES.floor3,
  ...PT_PRINCIPLES.floor4,
  ...PT_PRINCIPLES.fruitRoom,
  ...PT_PRINCIPLES.floor5,
  ...PT_PRINCIPLES.floor6,
  ...PT_PRINCIPLES.floor7,
  ...PT_PRINCIPLES.dimensions,
  ...PT_PRINCIPLES.expansions,
  ...PT_PRINCIPLES.heavens,
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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

    console.log(`Dealing cards for game: ${gameId}`);

    // Get all players for this game
    const { data: players, error: playersError } = await supabase
      .from("pt_multiplayer_players")
      .select("id, display_name")
      .eq("game_id", gameId)
      .order("joined_at");

    if (playersError) throw playersError;
    if (!players || players.length === 0) {
      throw new Error("No players found for this game");
    }

    console.log(`Found ${players.length} players`);

    // Shuffle the deck
    const shuffledDeck = shuffleArray(ALL_PRINCIPLES);

    // Deal 7 cards to each player
    const cardsPerPlayer = 7;
    const cardsToDeal = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const startIndex = i * cardsPerPlayer;
      const playerCards = shuffledDeck.slice(startIndex, startIndex + cardsPerPlayer);

      console.log(`Dealing cards to ${player.display_name}: ${playerCards.join(", ")}`);

      for (const principle of playerCards) {
        cardsToDeal.push({
          game_id: gameId,
          card_type: "principle",
          card_data: { value: principle, name: principle },
          is_drawn: true,
          drawn_by: player.id,
          drawn_at: new Date().toISOString(),
        });
      }
    }

    // Insert all cards into the deck
    const { error: insertError } = await supabase
      .from("pt_multiplayer_deck")
      .insert(cardsToDeal);

    if (insertError) {
      console.error("Error inserting cards:", insertError);
      throw insertError;
    }

    console.log(`Successfully dealt ${cardsToDeal.length} cards`);

    return new Response(
      JSON.stringify({
        success: true,
        cardsDealt: cardsToDeal.length,
        playersCount: players.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in deal-pt-cards function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
