import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trophy, Link as LinkIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

import { useAuth } from "@/hooks/useAuth";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const PT_SYMBOLS = [
  { code: "1D", name: "Literal Dimension" },
  { code: "2D", name: "Christ Dimension" },
  { code: "3D", name: "Me Dimension" },
  { code: "4D", name: "Church Dimension" },
  { code: "5D", name: "Heaven Dimension" },
  { code: "|S", name: "Sanctuary Wall" },
  { code: "|LC", name: "Life of Christ Wall" },
  { code: "|GC", name: "Great Controversy Wall" },
  { code: "|TP", name: "Time Prophecy Wall" },
  { code: "+", name: "Add Link" },
  { code: "∥", name: "Parallel" },
  { code: "≅", name: "Type/Antitype" },
  { code: "⊙", name: "Center in Christ" },
  { code: "⚖", name: "Integrity Sweep" },
];

interface PlayerHand {
  symbols: typeof PT_SYMBOLS;
  score: number;
}

export default function ChainWar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hand, setHand] = useState<typeof PT_SYMBOLS>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [verse, setVerse] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const targetScore = 15;

  // Save score when game is won
  useEffect(() => {
    const saveScore = async () => {
      if (gameWon && user) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "chain_war",
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

  useEffect(() => {
    dealHand();
  }, []);

  const dealHand = () => {
    const shuffled = [...PT_SYMBOLS].sort(() => Math.random() - 0.5);
    setHand(shuffled.slice(0, 5));
    setSelectedCards([]);
    setVerse("");
    setExplanation("");
  };

  const toggleCard = (code: string) => {
    if (selectedCards.includes(code)) {
      setSelectedCards(selectedCards.filter(c => c !== code));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, code]);
    }
  };

  const handleSubmit = async () => {
    if (selectedCards.length < 2) {
      toast.error(t('games.chainWar.errorMinCards'));
      return;
    }
    if (!verse.trim() || !explanation.trim()) {
      toast.error(t('games.chainWar.errorVerseAndExplanation'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_chain",
          cards: selectedCards,
          verse,
          explanation,
        }
      });

      if (error) throw error;

      const { isValid, feedback, points } = data;

      if (isValid) {
        const newScore = score + points;
        setScore(newScore);
        toast.success(t('games.chainWar.validChain', { points, feedback }));
        
        if (newScore >= targetScore) {
          setGameWon(true);
          toast.success(t('games.chainWar.youWon'));
        }
        
        // Remove used cards from hand and draw new ones
        const remaining = hand.filter(s => !selectedCards.includes(s.code));
        const newCards = PT_SYMBOLS
          .filter(s => !remaining.find(r => r.code === s.code))
          .sort(() => Math.random() - 0.5)
          .slice(0, selectedCards.length);
        
        setHand([...remaining, ...newCards]);
        setSelectedCards([]);
        setVerse("");
        setExplanation("");
      } else {
        toast.error(t('games.chainWar.stretch', { feedback }));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('games.chainWar.errorValidation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-amber-500/50 text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl text-amber-300">{t('games.chainWar.victory')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-amber-400">{t('games.common.pointsValue', { points: score })}</div>
                <p className="text-amber-200/80">{t('games.chainWar.victoryMessage')}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    {t('games.common.playAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <GameLeaderboard gameType="chain_war" currentScore={score} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            {t('common.back')}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-400 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              {t('games.chainWar.title')}
            </h1>
            <p className="text-amber-200/80">{t('games.chainWar.subtitle')}</p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 text-3xl font-bold">{score} / {targetScore}</div>
            <div className="text-amber-200/60 text-sm">{t('games.common.points')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <LinkIcon className="w-5 h-5" />
                {t('games.common.yourHand')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {hand.map(symbol => (
                  <Button
                    key={symbol.code}
                    variant={selectedCards.includes(symbol.code) ? "default" : "outline"}
                    onClick={() => toggleCard(symbol.code)}
                    className="h-20 flex-col gap-1"
                  >
                    <div className="text-2xl font-bold">{symbol.code}</div>
                    <div className="text-xs">{symbol.name}</div>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('games.chainWar.selectCards')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="text-amber-300">{t('games.chainWar.buildYourChain')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-amber-200 mb-2 block">{t('games.chainWar.verseReference')}</label>
                <input
                  type="text"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder={t('games.chainWar.versePlaceholder')}
                  className="w-full px-4 py-2 bg-black/60 border border-amber-500/30 rounded text-white"
                />
              </div>
              <div>
                <label className="text-sm text-amber-200 mb-2 block">
                  {t('games.chainWar.explainChain', { count: selectedCards.length })}
                </label>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder={t('games.chainWar.explanationPlaceholder')}
                  className="bg-black/60 border-amber-500/30 text-white min-h-32"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedCards.length < 2}
                className="w-full gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? t('games.common.validating') : t('games.chainWar.submitChain')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-black/40 border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-amber-300">{t('games.common.howToPlay')}</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-100/80 space-y-2">
            <p>{t('games.chainWar.rule1')}</p>
            <p>{t('games.chainWar.rule2')}</p>
            <p>{t('games.chainWar.rule3')}</p>
            <p>{t('games.chainWar.rule4')}</p>
            <p>{t('games.chainWar.rule5')}</p>
          </CardContent>
        </Card>
      </div>
      <FloatingGameChat gameType="chain-war" />
    </div>
  );
}
