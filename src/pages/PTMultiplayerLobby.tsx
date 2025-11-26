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
    { id: "free-for-all", label: "Free-For-All", icon: Users, desc: "Everyone competes individually" },
    { id: "1v1-jeeves", label: "1v1 vs Jeeves", icon: Target, desc: "You vs AI Jeeves opponent" },
    { id: "team", label: "Team Mode", icon: Crown, desc: "Form teams and collaborate" },
    { id: "team-vs-jeeves", label: "Team vs Jeeves", icon: Swords, desc: "Your team vs AI Jeeves" },
    { id: "council", label: "Council Mode", icon: Target, desc: "Debate before Jeeves judges" },
    { id: "boss", label: "Boss Mode", icon: Swords, desc: "Unite against AI Boss" },
    { id: "battle-royale", label: "Battle Royale", icon: Zap, desc: "Chaos and random crises" }
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/card-deck")}
          variant="ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deck
        </Button>
        
        <TextShareButton
          type="game"
          title="Phototheology Card Study Multiplayer"
          description="Play against Jeeves or team up! Master Bible symbolism through competitive card matching."
          variant="outline"
        />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-3">
          <Gamepad2 className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">PT Multiplayer Card Study</h1>
        </div>
        <p className="text-muted-foreground">
          Competitive Bible study where Jeeves judges every move
        </p>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Create New Game</h2>
        
        <div className="space-y-6">
          {/* Study Topic */}
          <div>
            <Label htmlFor="topic" className="text-lg mb-2 block">Study Topic</Label>
            <Input
              id="topic"
              value={studyTopic}
              onChange={(e) => setStudyTopic(e.target.value)}
              placeholder="e.g., John 3:16, Daniel 7, The Sanctuary, Revelation 12"
              className="text-lg py-6"
            />
          </div>

          {/* Game Mode */}
          <div>
            <Label className="text-lg mb-3 block">Game Mode</Label>
            <RadioGroup value={gameMode} onValueChange={setGameMode}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gameModes.map((mode) => (
                  <div key={mode.id} className="relative">
                    <RadioGroupItem 
                      value={mode.id} 
                      id={mode.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={mode.id}
                      className="flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <div className="flex items-center gap-2">
                        <mode.icon className="w-5 h-5" />
                        <span className="font-semibold">{mode.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{mode.desc}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Max Players */}
          <div>
            <Label htmlFor="maxPlayers" className="text-lg mb-2 block">
              Max Players: {maxPlayers}
            </Label>
            <input
              type="range"
              id="maxPlayers"
              min="2"
              max="8"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleCreateGame} 
            disabled={creating || !studyTopic}
            size="lg"
            className="w-full"
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
      <Card className="mt-6 p-6">
        <h3 className="font-bold text-lg mb-3">📘 Quick Rules</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Each player starts with 7 cards</li>
          <li>• Play a card and explain how it advances the study</li>
          <li>• Jeeves judges: ✔ Approved, △ Partial, or ✘ Rejected</li>
          <li>• Approved = discard card + points</li>
          <li>• Rejected = draw 1 card</li>
          <li>• 3 rejections in a row = skip next turn</li>
          <li>• First to 0 cards wins (or highest score in Council Mode)</li>
        </ul>
      </Card>
    </div>
  );
};

export default PTMultiplayerLobby;
