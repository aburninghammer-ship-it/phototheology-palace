import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gamepad2, Users, Crown, Swords, Target, Zap, Loader2, ArrowLeft } from "lucide-react";
import { TextShareButton } from "@/components/TextShareButton";

const PTMultiplayerLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [studyTopic, setStudyTopic] = useState("");
  const [gameMode, setGameMode] = useState("free-for-all");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [creating, setCreating] = useState(false);

  const handleCreateGame = async () => {
    if (!studyTopic.trim()) {
      toast({ title: "Study topic required", variant: "destructive" });
      return;
    }

    setCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

      // Create game
      const { data: game, error: gameError } = await supabase
        .from('pt_multiplayer_games')
        .insert({
          host_id: user.id,
          game_mode: gameMode,
          study_topic: studyTopic,
          max_players: maxPlayers,
          status: 'waiting'
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Add host as first player
      const { error: playerError } = await supabase
        .from('pt_multiplayer_players')
        .insert({
          game_id: game.id,
          user_id: user.id,
          display_name: profile?.display_name || 'Player',
          cards_remaining: 7
        });

      if (playerError) throw playerError;

      toast({ title: "Game created!", description: "Waiting for players to join..." });
      navigate(`/pt-multiplayer/${game.id}`);

    } catch (error: any) {
      console.error("Error creating game:", error);
      toast({
        title: "Error creating game",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const gameModes = [
    { id: "free-for-all", label: "Free-For-All", icon: Users, desc: "Everyone competes individually", gradient: "from-blue-500 to-cyan-500" },
    { id: "1v1-jeeves", label: "1v1 vs Jeeves", icon: Target, desc: "You vs AI Jeeves opponent", gradient: "from-purple-500 to-pink-500" },
    { id: "team", label: "Team Mode", icon: Crown, desc: "Form teams and collaborate", gradient: "from-orange-500 to-amber-500" },
    { id: "team-vs-jeeves", label: "Team vs Jeeves", icon: Swords, desc: "Your team vs AI Jeeves", gradient: "from-rose-500 to-red-500" },
    { id: "council", label: "Council Mode", icon: Target, desc: "Debate before Jeeves judges", gradient: "from-violet-500 to-purple-500" },
    { id: "boss", label: "Boss Mode", icon: Swords, desc: "Unite against AI Boss", gradient: "from-red-600 to-orange-600" },
    { id: "battle-royale", label: "Battle Royale", icon: Zap, desc: "Chaos and random crises", gradient: "from-yellow-500 to-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/card-deck")}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deck
          </Button>
          
          <TextShareButton
            type="game"
            title="Phototheology Card Study Multiplayer"
            description="Play against Jeeves or team up! Master Bible symbolism through competitive card matching."
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/50">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">PT Multiplayer Card Study</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Competitive Bible study where Jeeves judges every move
          </p>
        </div>

        <Card className="p-8 bg-black/40 backdrop-blur-sm border-white/10">
          <h2 className="text-3xl font-bold mb-6 text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Create New Game
          </h2>
          
          <div className="space-y-6">
            {/* Study Topic */}
            <div>
              <Label htmlFor="topic" className="text-lg mb-2 block text-white font-semibold">
                📖 Study Topic
              </Label>
              <Input
                id="topic"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="e.g., John 3:16, Daniel 7, The Sanctuary, Revelation 12"
                className="text-lg py-6 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>

            {/* Game Mode */}
            <div>
              <Label className="text-lg mb-3 block text-white font-semibold">
                🎮 Game Mode
              </Label>
              <RadioGroup value={gameMode} onValueChange={setGameMode}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameModes.map((mode) => (
                    <div key={mode.id} className="relative group">
                      <RadioGroupItem 
                        value={mode.id} 
                        id={mode.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={mode.id}
                        className={`flex flex-col gap-2 p-4 rounded-xl border-2 border-white/20 cursor-pointer transition-all hover:scale-105 hover:border-white/40 hover:shadow-lg peer-data-[state=checked]:border-transparent peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:${mode.gradient} peer-data-[state=checked]:shadow-2xl relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity" style={{ 
                          backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` 
                        }} />
                        <div className="flex items-center gap-2 relative z-10">
                          <mode.icon className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white">{mode.label}</span>
                        </div>
                        <span className="text-xs text-white/80 relative z-10">{mode.desc}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Max Players */}
            <div>
              <Label htmlFor="maxPlayers" className="text-lg mb-2 block text-white font-semibold">
                👥 Max Players: <span className="text-cyan-400">{maxPlayers}</span>
              </Label>
              <input
                type="range"
                id="maxPlayers"
                min="2"
                max="8"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2</span>
                <span>8</span>
              </div>
            </div>

            <Button 
              onClick={handleCreateGame} 
              disabled={creating || !studyTopic}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-600/60 transition-all"
            >
              {creating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Game...
                </>
              ) : (
                <>
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Create Game
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Rules Summary */}
        <Card className="mt-6 p-6 bg-black/40 backdrop-blur-sm border-white/10">
          <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
            <span className="text-2xl">📘</span> Quick Rules
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Each player starts with 7 cards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>Play a card and explain how it advances the study</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">✓</span>
              <span>Jeeves judges: ✔ Approved, △ Partial, or ✘ Rejected</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span>Approved = discard card + points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">✓</span>
              <span>Rejected = draw 1 card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✓</span>
              <span>3 rejections in a row = skip next turn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">✓</span>
              <span>First to 0 cards wins (or highest score in Council Mode)</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PTMultiplayerLobby;
