import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Skull, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DRAGON_ATTACKS = [
  "False worship law enforced",
  "Doctrinal confusion spreads",
  "Moral compromise temptation",
  "Economic persecution begins",
  "Media propaganda campaign",
  "Sunday law pressure",
  "Identity mark requirement",
  "Social isolation threat",
];

const DEFENSE_CARDS = [
  "Ep", "Ef", "|GC", "|TP", "|S", "⚖", "ALTAR", "LAMP", "ARK"
];

const CARD_EXPLANATIONS: Record<string, string> = {
  "Ep": "Epistles Prophecy - Prophetic teachings in New Testament letters",
  "Ef": "Epistles Faith - Faith and doctrine from New Testament letters",
  "|GC": "Great Controversy - Cosmic conflict between Christ and Satan",
  "|TP": "Time Prophecy - Daniel/Revelation prophetic timelines",
  "|S": "Sanctuary - Hebrew sanctuary system pointing to Christ",
  "⚖": "Judgment - God's righteous judgment and justice",
  "ALTAR": "Altar - Sacrifice of Christ on the cross",
  "LAMP": "Lampstand - Light of truth, witness, Holy Spirit",
  "ARK": "Ark of Covenant - God's law, mercy seat, His presence"
};

export default function EscapeTheDragon() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [currentAttack, setCurrentAttack] = useState("");
  const [hand, setHand] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [defense, setDefense] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Save score when game ends
  useEffect(() => {
    const saveScore = async () => {
      if ((lives <= 0 || round > 10) && user && !scoreSaved) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "escape_dragon",
            score: round - 1,
            mode: "solo",
          });
          setScoreSaved(true);
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };
    saveScore();
  }, [lives, round, user, scoreSaved]);

  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    const attack = DRAGON_ATTACKS[Math.floor(Math.random() * DRAGON_ATTACKS.length)];
    const shuffled = [...DEFENSE_CARDS].sort(() => Math.random() - 0.5);
    setCurrentAttack(attack);
    setHand(shuffled.slice(0, 5));
    setSelectedCards([]);
    setDefense("");
  };

  const toggleCard = (card: string) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = async () => {
    if (selectedCards.length !== 2) {
      toast.error("Play exactly 2 cards for defense");
      return;
    }
    if (!defense.trim()) {
      toast.error("Explain your theological defense");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_dragon_defense",
          attack: currentAttack,
          cards: selectedCards,
          defense,
        }
      });

      if (error) throw error;

      const { survived, feedback } = data;

      if (survived) {
        toast.success(`Defense successful! ${feedback}`, {
          duration: 8000, // 8 seconds to read the feedback
        });
        setRound(prev => prev + 1);
        
        if (round >= 10) {
          toast.success("🏆 Victory! You survived 10 dragon attacks!", {
            duration: 6000,
          });
        } else {
          startRound();
        }
      } else {
        setLives(prev => prev - 1);
        toast.error(`Failed defense: ${feedback}`, {
          duration: 8000, // 8 seconds to read the feedback
        });
        
        if (lives - 1 <= 0) {
          toast.error("💀 The dragon wins. Game over.", {
            duration: 6000,
          });
        } else {
          startRound();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate defense");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (lives <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-orange-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-red-500/50 text-center">
              <CardHeader>
                <Skull className="h-16 w-16 mx-auto text-red-400 mb-4" />
                <CardTitle className="text-3xl text-red-400">
                  💀 DRAGON VICTORY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-red-400">{round - 1} Rounds</div>
                <p className="text-red-100/80">
                  You survived {round - 1} rounds before falling
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                  <Button onClick={() => {
                    setLives(3);
                    setRound(1);
                    setScoreSaved(false);
                    startRound();
                  }} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
            <GameLeaderboard gameType="escape_dragon" currentScore={round - 1} />
          </div>
        </div>
      </div>
    );
  }

  if (round > 10) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-emerald-500/50 text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl text-emerald-400">
                  🏆 REMNANT VICTORY!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-emerald-400">10 Rounds</div>
                <p className="text-emerald-100/80">
                  You survived all 10 dragon attacks!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                  <Button onClick={() => {
                    setLives(3);
                    setRound(1);
                    setScoreSaved(false);
                    startRound();
                  }} variant="outline">
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
            <GameLeaderboard gameType="escape_dragon" currentScore={10} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-orange-400" style={{ fontFamily: "'Cinzel', serif" }}>
            🐉 ESCAPE THE DRAGON
          </h1>
          <div className="text-right">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              ))}
            </div>
            <div className="text-orange-200/60 text-sm">Round {round}/10</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-black/40 border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Skull className="w-6 h-6" />
                Dragon Attack!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-100 font-bold text-center py-6 bg-red-500/20 rounded-lg">
                {currentAttack}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/50">
            <CardHeader>
              <CardTitle className="text-orange-300">Your Defense Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {hand.map(card => (
                    <Tooltip key={card}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={selectedCards.includes(card) ? "default" : "outline"}
                          onClick={() => toggleCard(card)}
                          className="h-16 text-lg font-bold"
                        >
                          {card}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{card}</p>
                        <p className="text-sm">{CARD_EXPLANATIONS[card]}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
              <p className="text-sm text-muted-foreground mt-2">
                Select 2 cards to defend (tap cards for explanations)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/50">
            <CardHeader>
              <CardTitle className="text-orange-300">Theological Defense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={defense}
                onChange={(e) => setDefense(e.target.value)}
                placeholder="Explain how your 2 cards answer this attack with Scripture..."
                className="bg-black/60 border-orange-500/30 text-white min-h-32"
              />
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Defending..." : "Defend Against Attack"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
