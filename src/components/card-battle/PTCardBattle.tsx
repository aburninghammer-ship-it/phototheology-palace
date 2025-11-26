import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sword, Sparkles, Trophy, Users, Bot, Loader2 } from "lucide-react";
import { BattleLobby } from "./BattleLobby";
import { BattleArena } from "./BattleArena";
import { GameModeSelector } from "./GameModeSelector";

export type GameMode = 'user_vs_jeeves' | 'user_vs_user' | 'team_vs_team' | 'jeeves_vs_jeeves';

interface Battle {
  id: string;
  game_mode: GameMode;
  status: string;
  story_text: string;
  story_reference: string | null;
  current_turn_player: string;
  winner: string | null;
}

interface Player {
  id: string;
  player_id: string;
  player_type: string;
  display_name: string;
  cards_in_hand: string[];
  cards_played: string[];
  score: number;
  team_name: string | null;
}

export function PTCardBattle() {
  const { toast } = useToast();
  const [view, setView] = useState<'mode-select' | 'lobby' | 'battle'>('mode-select');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setView('lobby');
  };

  const handleBattleStart = (battle: Battle) => {
    setCurrentBattle(battle);
    setView('battle');
  };

  const handleBackToModes = () => {
    setView('mode-select');
    setSelectedMode(null);
    setCurrentBattle(null);
  };

  const handleBackToLobby = () => {
    setView('lobby');
    setCurrentBattle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <Sword className="h-20 w-20 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
              <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            PT Card <span className="text-amber-400">Battle</span>
          </h1>
          <p className="text-purple-200 text-lg">
            Amplify Scripture with Phototheology principles
          </p>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {view === 'mode-select' && (
            <GameModeSelector onSelectMode={handleModeSelect} />
          )}
          
          {view === 'lobby' && selectedMode && (
            <BattleLobby
              mode={selectedMode}
              onBattleStart={handleBattleStart}
              onBack={handleBackToModes}
            />
          )}
          
          {view === 'battle' && currentBattle && (
            <BattleArena
              battle={currentBattle}
              currentUserId={currentUserId}
              onBack={handleBackToLobby}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}