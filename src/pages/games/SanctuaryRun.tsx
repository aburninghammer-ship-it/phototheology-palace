import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Flame, Droplets, Utensils, Lamp, Wind, Crown, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const SANCTUARY_ITEMS = [
  { name: "ALTAR", icon: Flame, meaning: "Sacrifice / Cross", color: "text-red-500" },
  { name: "LAVER", icon: Droplets, meaning: "Cleansing / Baptism", color: "text-blue-500" },
  { name: "TABLE", icon: Utensils, meaning: "Word of God", color: "text-amber-500" },
  { name: "LAMP", icon: Lamp, meaning: "Witness / Light", color: "text-yellow-500" },
  { name: "INCENSE", icon: Wind, meaning: "Prayer / Intercession", color: "text-purple-500" },
  { name: "ARK", icon: Crown, meaning: "Law / Mercy / Presence", color: "text-cyan-500" },
];

export default function SanctuaryRun() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentItems, setCurrentItems] = useState<typeof SANCTUARY_ITEMS>([]);
  const [narrative, setNarrative] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const targetScore = 5;
  const [gameWon, setGameWon] = useState(false);

  // Save score when game is won
  useEffect(() => {
    const saveScore = async () => {
      if (gameWon && user) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "sanctuary_run",
            score: score,
            mode: "solo",
          });
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };
    saveScore();
  }, [gameWon, user, score]);

  const startRound = () => {
    const shuffled = [...SANCTUARY_ITEMS].sort(() => Math.random() - 0.5);
    setCurrentItems(shuffled.slice(0, 3));
    setNarrative("");
  };

  const handleSubmit = async () => {
    if (!narrative.trim()) {
      toast.error("Write your gospel narrative first");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_sanctuary_flow",
          items: currentItems.map(i => i.name),
          narrative,
        }
      });

      if (error) throw error;

      const { isCoherent, feedback, points } = data;

      if (isCoherent) {
        const newScore = score + points;
        setScore(newScore);
        toast.success(`Coherent gospel flow! +${points} points`);
        if (newScore >= targetScore) {
          setGameWon(true);
          toast.success("🏆 You've mastered the Sanctuary Run!");
        } else {
          startRound();
        }
      } else {
        toast.error(`Narrative needs work: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate narrative");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-purple-500/50 text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl text-purple-300">Sanctuary Run Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-purple-400">{score} Rounds Won</div>
                <p className="text-purple-200/80">You've mastered narrating the gospel through the sanctuary!</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
            <GameLeaderboard gameType="sanctuary_run" currentScore={score} />
          </div>
        </div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-black/40 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-purple-300">
              ⛪ SANCTUARY RUN
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-purple-100/80">
              Narrate the salvation journey using 3 random sanctuary items in order.
            </p>
            <Button onClick={startRound} className="w-full">
              Start Round
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-purple-400" style={{ fontFamily: "'Cinzel', serif" }}>
            ⛪ SANCTUARY RUN
          </h1>
          <div className="text-right">
            <div className="text-purple-400 text-3xl font-bold">{score}</div>
            <div className="text-purple-200/60 text-sm">ROUNDS WON</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-black/40 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-300">Your Sanctuary Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center gap-4">
                {currentItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center">
                      <div className="text-center">
                        <div className={`${item.color} text-5xl mb-2`}>
                          <Icon className="w-12 h-12 mx-auto" />
                        </div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-purple-200/60">{item.meaning}</div>
                      </div>
                      {idx < currentItems.length - 1 && (
                        <div className="text-purple-400 text-3xl mx-4">→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-300">Tell the Gospel Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Narrate the salvation journey using these 3 items IN ORDER. Include at least 1 Bible verse per item..."
                className="bg-black/60 border-purple-500/30 text-white min-h-48"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Validating..." : "Submit Narrative"}
                </Button>
                <Button onClick={startRound} variant="outline">
                  New Round
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
