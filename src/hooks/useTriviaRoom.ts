import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

interface TriviaRoom {
  id: string;
  room_code: string;
  host_id: string;
  status: string;
  max_players: number;
  question_count: number;
  difficulty: string;
  current_question_index: number;
}

interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  score: number;
  is_ready: boolean;
}

// Palace method trivia questions
const TRIVIA_QUESTIONS = [
  { q: "Which floor of the Palace is the 'Furnishing Floor'?", options: ["1st", "2nd", "3rd", "4th"], answer: 0 },
  { q: "What room trains you to see Christ in every text?", options: ["Fire Room", "Concentration Room", "Blue Room", "Gems Room"], answer: 1 },
  { q: "The '@Mo' cycle code refers to which covenant cycle?", options: ["Adamic", "Noahic", "Mosaic", "Remnant"], answer: 2 },
  { q: "Which room is the 'forensic lab' of the Investigation Floor?", options: ["Observation", "Def-Com", "Questions", "Symbols/Types"], answer: 1 },
  { q: "How many total Ascensions are there in Phototheology?", options: ["3", "4", "5", "8"], answer: 2 },
  { q: "The 3rd Floor is known as the ___ Floor.", options: ["Freestyle", "Vision", "Investigation", "Master"], answer: 0 },
  { q: "What does the Blue Room (BL) focus on?", options: ["Poetry", "Prophecy", "Sanctuary", "Meditation"], answer: 2 },
  { q: "Which cycle is coded '@Re'?", options: ["Remnant", "Restoration", "Renaissance", "Revelation"], answer: 0 },
  { q: "The Fruit Room tests interpretations against what?", options: ["Prophecy accuracy", "Galatians 5:22-23", "Historical evidence", "Community consensus"], answer: 1 },
  { q: "How many 'Heavens' are there in the PT framework?", options: ["1", "2", "3", "7"], answer: 2 },
  { q: "What does the 8th Floor represent?", options: ["Final prophecy", "Reflexive mastery", "Community", "Prayer"], answer: 1 },
  { q: "The Juice Room belongs to which floor?", options: ["4th", "5th", "6th", "7th"], answer: 2 },
  { q: "Which room trains spontaneous Bible connections in daily life?", options: ["Story Room", "Nature Freestyle", "Observation", "Speed Room"], answer: 1 },
  { q: "'DoL²/NE²' refers to which Day of the Lord?", options: ["Babylon destruction", "70 AD destruction", "Final judgment", "Flood"], answer: 1 },
  { q: "The Parallels Room (P‖) focuses on what?", options: ["Types and shadows", "Mirrored actions across time", "Bible translations", "Verse genetics"], answer: 1 },
  { q: "What is the code for the Imagination Room?", options: ["IM", "IR", "MR", "SR"], answer: 1 },
  { q: "The Connect 6 Room classifies texts by what?", options: ["Century", "Genre", "Author", "Length"], answer: 1 },
  { q: "Which Expansion maps to Floors 1 + 2?", options: ["Time", "Width", "Depth", "Height"], answer: 1 },
  { q: "The Three Angels' Messages are found in which book?", options: ["Daniel", "Revelation", "Isaiah", "Ezekiel"], answer: 1 },
  { q: "24FPS Room gets its name from what?", options: ["A Bible verse", "Film frame rate", "A Hebrew word", "24 elders"], answer: 1 },
];

export function useTriviaRoom() {
  const { user } = useAuth();
  const [room, setRoom] = useState<TriviaRoom | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const createRoom = useCallback(async (questionCount: number = 10) => {
    if (!user) { toast.error("Sign in to create a room"); return; }
    setLoading(true);
    try {
      const code = generateRoomCode();
      const { data, error } = await supabase
        .from("trivia_rooms")
        .insert({
          room_code: code,
          host_id: user.id,
          question_count: Math.min(questionCount, TRIVIA_QUESTIONS.length),
        })
        .select()
        .single();
      if (error) throw error;
      setRoom(data as any);

      // Auto-join as player
      await supabase.from("trivia_room_players").insert({
        room_id: data.id,
        user_id: user.id,
        is_ready: true,
      });
      toast.success(`Room created! Code: ${code}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinRoom = useCallback(async (code: string) => {
    if (!user) { toast.error("Sign in to join"); return; }
    setLoading(true);
    try {
      const { data: roomData, error: roomError } = await supabase
        .from("trivia_rooms")
        .select("*")
        .eq("room_code", code.toUpperCase())
        .eq("status", "lobby")
        .single();
      if (roomError || !roomData) throw new Error("Room not found or already started");

      const { error: joinError } = await supabase
        .from("trivia_room_players")
        .insert({ room_id: roomData.id, user_id: user.id });
      if (joinError) throw joinError;

      setRoom(roomData as any);
      toast.success("Joined the room!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const startGame = useCallback(async () => {
    if (!room || !user || user.id !== room.host_id) return;
    await supabase
      .from("trivia_rooms")
      .update({ status: "playing", started_at: new Date().toISOString() })
      .eq("id", room.id);
  }, [room, user]);

  const answerQuestion = useCallback(async (answerIndex: number) => {
    if (!room || !user) return;
    const questionIdx = room.current_question_index;
    const question = TRIVIA_QUESTIONS[questionIdx % TRIVIA_QUESTIONS.length];
    const correct = answerIndex === question.answer;

    if (correct) {
      const player = players.find(p => p.user_id === user.id);
      if (player) {
        await supabase
          .from("trivia_room_players")
          .update({ score: player.score + 10 })
          .eq("id", player.id);
      }
    }
    return correct;
  }, [room, user, players]);

  const nextQuestion = useCallback(async () => {
    if (!room || !user || user.id !== room.host_id) return;
    const nextIdx = room.current_question_index + 1;
    if (nextIdx >= room.question_count) {
      await supabase.from("trivia_rooms").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        current_question_index: nextIdx,
      }).eq("id", room.id);
    } else {
      await supabase.from("trivia_rooms").update({
        current_question_index: nextIdx,
      }).eq("id", room.id);
    }
  }, [room, user]);

  // Realtime subscriptions
  useEffect(() => {
    if (!room?.id) return;
    const roomChannel = supabase
      .channel(`trivia-${room.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "trivia_rooms", filter: `id=eq.${room.id}` },
        (payload) => { if (payload.new) setRoom(payload.new as any); })
      .on("postgres_changes", { event: "*", schema: "public", table: "trivia_room_players", filter: `room_id=eq.${room.id}` },
        () => { fetchPlayers(); })
      .subscribe();

    fetchPlayers();
    return () => { supabase.removeChannel(roomChannel); };
  }, [room?.id]);

  const fetchPlayers = async () => {
    if (!room?.id) return;
    const { data } = await supabase
      .from("trivia_room_players")
      .select("*")
      .eq("room_id", room.id)
      .order("score", { ascending: false });
    setPlayers((data || []) as any);
  };

  const currentQuestion = room ? TRIVIA_QUESTIONS[room.current_question_index % TRIVIA_QUESTIONS.length] : null;

  return {
    room,
    players,
    loading,
    createRoom,
    joinRoom,
    startGame,
    answerQuestion,
    nextQuestion,
    currentQuestion,
    isHost: room && user ? user.id === room.host_id : false,
  };
}
