import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Match {
  id: string;
  status: string;
  player1_id: string;
  player2_id: string | null;
  player1_score: number;
  player2_score: number;
  verse_references: string[];
  total_rounds: number;
  current_round: number;
  winner_id: string | null;
}

// Sample verses for battles
const BATTLE_VERSES = [
  { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { ref: "Proverbs 3:5", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { ref: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
  { ref: "Matthew 28:19", text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost." },
  { ref: "Romans 12:2", text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God." },
  { ref: "Galatians 5:22", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith." },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useMemoryBattle() {
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);

  // Create a new battle
  const createBattle = useCallback(async (rounds: number = 5) => {
    if (!user) { toast.error("Sign in to battle"); return; }
    setLoading(true);
    try {
      const selectedVerses = shuffleArray(BATTLE_VERSES).slice(0, rounds).map(v => v.ref);
      const { data, error } = await supabase
        .from("multiplayer_matches")
        .insert({
          player1_id: user.id,
          verse_references: selectedVerses,
          total_rounds: rounds,
          match_type: "memory_battle",
          status: "waiting",
        })
        .select()
        .single();
      if (error) throw error;
      setMatch(data as any);
      toast.success("Battle created! Share the code to invite an opponent.");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Join an existing battle
  const joinBattle = useCallback(async (matchId: string) => {
    if (!user) { toast.error("Sign in to battle"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("multiplayer_matches")
        .update({ player2_id: user.id, status: "active", started_at: new Date().toISOString() })
        .eq("id", matchId)
        .eq("status", "waiting")
        .select()
        .single();
      if (error) throw error;
      setMatch(data as any);
      toast.success("Joined the battle!");
    } catch (e: any) {
      toast.error("Could not join battle: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Submit a round score
  const submitScore = useCallback(async (points: number) => {
    if (!match || !user) return;
    const isPlayer1 = user.id === match.player1_id;
    const scoreField = isPlayer1 ? "player1_score" : "player2_score";
    const newScore = (isPlayer1 ? match.player1_score : match.player2_score) + points;
    const newRound = match.current_round + 1;
    const isComplete = newRound >= match.total_rounds;

    const updates: any = {
      [scoreField]: newScore,
      current_round: newRound,
    };

    if (isComplete) {
      const otherScore = isPlayer1 ? match.player2_score : match.player1_score;
      updates.status = "completed";
      updates.completed_at = new Date().toISOString();
      if (newScore > otherScore) updates.winner_id = user.id;
      else if (otherScore > newScore) updates.winner_id = isPlayer1 ? match.player2_id : match.player1_id;
    }

    const { data, error } = await supabase
      .from("multiplayer_matches")
      .update(updates)
      .eq("id", match.id)
      .select()
      .single();
    
    if (!error && data) setMatch(data as any);
  }, [match, user]);

  // Subscribe to match updates
  useEffect(() => {
    if (!match?.id) return;
    const channel = supabase
      .channel(`match-${match.id}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "multiplayer_matches",
        filter: `id=eq.${match.id}`,
      }, (payload) => {
        setMatch(payload.new as any);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [match?.id]);

  // Find waiting battles
  const findOpenBattles = useCallback(async () => {
    const { data } = await supabase
      .from("multiplayer_matches")
      .select("*")
      .eq("status", "waiting")
      .neq("player1_id", user?.id || "")
      .order("created_at", { ascending: false })
      .limit(10);
    return (data || []) as Match[];
  }, [user]);

  return {
    match,
    loading,
    createBattle,
    joinBattle,
    submitScore,
    findOpenBattles,
    currentVerse: match ? BATTLE_VERSES.find(v => v.ref === match.verse_references[match.current_round]) : null,
    isMyTurn: match && user ? true : false,
    isPlayer1: match && user ? user.id === match.player1_id : false,
  };
}
