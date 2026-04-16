import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Skull, Trophy, Bot, Lightbulb, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
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
  "CR", "ST", "PR", "P‖", "PRm", "OR",
  // Specific sub-principles from multi-principle rooms
  "TZ-HP", "TZ-EN", "TZ-HF",
  "Literal", "Christ", "Heaven",
  "BL-Ark", "BL-Altar", "BL-Lamp",
  "3A-1", "3A-2", "3A-3",
  "TRm-GC", "TRm-TP", "TRm-Sa",
  "FRt-Love", "FRt-Peace", "FRt-Faith",
];

const CARD_EXPLANATIONS: Record<string, string> = {
  "CR": "Concentration Room — Every text must reveal Christ (John 5:39)",
  "ST": "Symbols/Types Room — God's symbolic language: lamb, rock, light, water",
  "PR": "Prophecy Room — Daniel & Revelation prophetic timelines and constellations",
  "P‖": "Parallels Room — Mirrored actions across time (Babel/Pentecost, Exodus/Return)",
  "PRm": "Patterns Room — God's recurring motifs: 40 days, 3 days, deliverer stories",
  "OR": "Observation Room — Log details without interpretation, like a detective",
  // Time Zone specifics
  "TZ-HP": "Time Zone: Heaven Past — What happened in heaven before creation or the fall?",
  "TZ-EN": "Time Zone: Earth Now — How does this text apply to present earthly reality?",
  "TZ-HF": "Time Zone: Heaven Future — What does this reveal about heaven's future fulfillment?",
  // Dimensions specifics
  "Literal": "Literal Dimension — What did this text mean at face value to its original audience?",
  "Christ": "Christ Dimension — How does this passage point to Jesus?",
  "Heaven": "Heaven Dimension — How does this text connect to heavenly or eternal realities?",
  // Blue Room specifics
  "BL-Ark": "Sanctuary: Ark of the Covenant — Law, mercy seat, God's throne",
  "BL-Altar": "Sanctuary: Altar of Burnt Offering — The cross and sacrifice",
  "BL-Lamp": "Sanctuary: Lampstand — The light of the Spirit",
  // Three Angels specifics
  "3A-1": "First Angel — Everlasting gospel, worship Creator, judgment hour (Rev 14:6-7)",
  "3A-2": "Second Angel — Babylon is fallen, false systems exposed (Rev 14:8)",
  "3A-3": "Third Angel — Warning against beast, image, mark (Rev 14:9-12)",
  // Theme Room walls
  "TRm-GC": "Great Controversy Wall — The cosmic conflict between Christ and Satan",
  "TRm-TP": "Time-Prophecy Wall — 2300 days, 70 weeks, 1260 years",
  "TRm-Sa": "Sanctuary Wall — Every text connected to the sanctuary system",
  // Fruit specifics
  "FRt-Love": "Fruit of Love — Does this interpretation produce selfless, Christlike love?",
  "FRt-Peace": "Fruit of Peace — Does this bring the peace of God that passes understanding?",
  "FRt-Faith": "Fruit of Faithfulness — Does this produce faithful endurance and trust in God?",
};

export default function EscapeTheDragon() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [currentAttack, setCurrentAttack] = useState("");
  const [hand, setHand] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [defense, setDefense] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [jeevesAssistEnabled, setJeevesAssistEnabled] = useState(true);
  const [jeevesHint, setJeevesHint] = useState("");
  const [isRequestingHint, setIsRequestingHint] = useState(false);

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
    setJeevesHint("");
  };

  const toggleCard = (card: string) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card));
    } else if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const requestJeevesHint = async () => {
    setIsRequestingHint(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "dragon_defense_hint",
          attack: currentAttack,
          cards: hand,
        }
      });
      if (error) throw error;
      setJeevesHint(data.hint || data.content || "Consider which cards relate to the biblical principles that counter this specific attack.");
    } catch (error) {
      console.error(error);
      toast.error("Could not get Jeeves hint. Try again.");
    } finally {
      setIsRequestingHint(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedCards.length !== 2) {
      toast.error(t('games.escapeTheDragon.errorPlayTwo'));
      return;
    }
    if (!defense.trim()) {
      toast.error(t('games.escapeTheDragon.errorExplainDefense'));
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
        toast.success(
          jeevesAssistEnabled
            ? t('games.escapeTheDragon.defenseSuccessful', { feedback })
            : t('games.escapeTheDragon.defenseSuccessful', { feedback: "Well defended!" }),
          { duration: 8000 }
        );
        setRound(prev => prev + 1);
        
        if (round >= 10) {
          toast.success(t('games.escapeTheDragon.victory'), {
            duration: 6000,
          });
        } else {
          startRound();
        }
      } else {
        setLives(prev => prev - 1);
        toast.error(
          jeevesAssistEnabled
            ? t('games.escapeTheDragon.failedDefense', { feedback })
            : t('games.escapeTheDragon.failedDefense', { feedback: "Defense breached!" }),
          { duration: 8000 }
        );
        
        if (lives - 1 <= 0) {
          toast.error(t('games.escapeTheDragon.dragonWins'), {
            duration: 6000,
          });
        } else {
          startRound();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(t('games.escapeTheDragon.errorValidation'));
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
                  {t('games.escapeTheDragon.dragonVictory')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-red-400">{t('games.common.roundsValue', { rounds: round - 1 })}</div>
                <p className="text-red-100/80">
                  {t('games.escapeTheDragon.survivedRounds', { rounds: round - 1 })}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={() => {
                    setLives(3);
                    setRound(1);
                    setScoreSaved(false);
                    startRound();
                  }} variant="outline">
                    {t('games.common.tryAgain')}
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
                  {t('games.escapeTheDragon.remnantVictory')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-emerald-400">{t('games.common.roundsValue', { rounds: 10 })}</div>
                <p className="text-emerald-100/80">
                  {t('games.escapeTheDragon.survivedAll')}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={() => {
                    setLives(3);
                    setRound(1);
                    setScoreSaved(false);
                    startRound();
                  }} variant="outline">
                    {t('games.common.playAgain')}
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
            {t('common.back')}
          </Button>
          <h1 className="text-4xl font-bold text-orange-400" style={{ fontFamily: "'Cinzel', serif" }}>
            {t('games.escapeTheDragon.title')}
          </h1>
          <div className="text-right">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              ))}
            </div>
            <div className="text-orange-200/60 text-sm">{t('games.common.roundOf', { current: round, total: 10 })}</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-black/40 border-red-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Skull className="w-6 h-6" />
                {t('games.escapeTheDragon.dragonAttack')}
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
              <CardTitle className="text-orange-300">{t('games.escapeTheDragon.defenseCards')}</CardTitle>
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
                {t('games.escapeTheDragon.selectTwoCards')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-300">{t('games.escapeTheDragon.theologicalDefense')}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setJeevesAssistEnabled(!jeevesAssistEnabled)}
                  className="text-xs text-orange-200/60 hover:text-orange-200"
                >
                  {jeevesAssistEnabled ? (
                    <><Eye className="h-4 w-4 mr-1" /> Jeeves Assist On</>
                  ) : (
                    <><EyeOff className="h-4 w-4 mr-1" /> Jeeves Assist Off</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={defense}
                onChange={(e) => setDefense(e.target.value)}
                placeholder={t('games.escapeTheDragon.defensePlaceholder')}
                className="bg-black/60 border-orange-500/30 text-white min-h-32"
              />

              {/* Jeeves Hint - always available */}
              {jeevesHint && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Jeeves Hint</span>
                  </div>
                  <p className="text-sm text-blue-100/80">{jeevesHint}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? t('games.escapeTheDragon.defending') : t('games.escapeTheDragon.defendAgainstAttack')}
                </Button>
                <Button
                  variant="outline"
                  onClick={requestJeevesHint}
                  disabled={isRequestingHint}
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                >
                  {isRequestingHint ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <><Lightbulb className="h-4 w-4 mr-1" /> Hint</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <FloatingGameChat gameType="escape-the-dragon" />
    </div>
  );
}
