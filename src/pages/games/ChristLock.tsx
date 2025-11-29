import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Crown, Timer, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const CHRIST_CARDS = [
  { code: "2D", name: "Christ Dimension" },
  { code: "|LC", name: "Life of Christ Wall" },
  { code: "⊙", name: "Center in Christ" },
];

const RANDOM_VERSES = [
  "Genesis 22:8",
  "Exodus 12:13",
  "Leviticus 16:15",
  "Numbers 21:9",
  "Joshua 5:13-15",
  "Judges 6:11-12",
  "Ruth 3:9",
  "1 Samuel 16:13",
  "2 Samuel 7:12-13",
  "1 Kings 19:11-12",
  "Psalm 22:1",
  "Psalm 110:1",
  "Isaiah 9:6",
  "Isaiah 53:5",
  "Jeremiah 23:5-6",
  "Ezekiel 34:23",
  "Daniel 7:13",
  "Hosea 11:1",
  "Micah 5:2",
  "Zechariah 9:9",
];

export default function ChristLock() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentCard, setCurrentCard] = useState<typeof CHRIST_CARDS[0] | null>(null);
  const [currentVerse, setCurrentVerse] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [targetScore] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Save score when game is won
  useEffect(() => {
    const saveScore = async () => {
      if (gameWon && user) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "christ_lock",
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
    const randomCard = CHRIST_CARDS[Math.floor(Math.random() * CHRIST_CARDS.length)];
    const randomVerse = RANDOM_VERSES[Math.floor(Math.random() * RANDOM_VERSES.length)];
    setCurrentCard(randomCard);
    setCurrentVerse(randomVerse);
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Write your answer first");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_christ_focus",
          card: currentCard?.code,
          verse: currentVerse,
          answer,
        }
      });

      if (error) throw error;

      const { hitChrist, feedback } = data;

      if (hitChrist) {
        const newScore = score + 1;
        setScore(newScore);
        toast.success(`Christ revealed! ${feedback}`);
        
        if (newScore >= targetScore) {
          setGameWon(true);
          toast.success("🏆 You've collected all Christ-focus cards!");
        } else {
          startRound();
        }
      } else {
        toast.error(`Missed the mark: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-amber-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-amber-500/50 text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl text-amber-300">Christ Lock Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-amber-400">{score} / {targetScore}</div>
                <p className="text-amber-200/80">You've mastered seeing Christ in every text!</p>
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
            <GameLeaderboard gameType="christ_lock" currentScore={score} />
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-amber-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-black/40 border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-amber-300">
              ✝️ CHRIST LOCK
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-amber-100/80">
              See Christ in every text - His character, mission, authority, or role in salvation
            </p>
            <Button onClick={startRound} className="w-full">
              Draw Card
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-amber-900 to-slate-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-amber-400" style={{ fontFamily: "'Cinzel', serif" }}>
            ✝️ CHRIST LOCK
          </h1>
          <div className="text-right">
            <div className="text-amber-400 text-3xl font-bold">
              {score} / {targetScore}
            </div>
            <div className="text-amber-200/60 text-sm">COLLECTED</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <Crown className="w-6 h-6" />
                Your Christ Card: {currentCard.code}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-xl text-amber-100/80 mb-4">
                {currentCard.name}
              </div>
              <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/30">
                <div className="text-sm text-amber-200/60 mb-2">Your Verse:</div>
                <div className="text-lg font-serif text-amber-100">
                  {currentVerse}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="text-amber-300">How Does This Verse Reveal Jesus?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write one tight paragraph showing how this verse reveals Christ - His character, mission, authority, or role in salvation..."
                className="bg-black/60 border-amber-500/30 text-white min-h-40"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Validating..." : "Submit Answer"}
                </Button>
                <Button onClick={startRound} variant="outline">
                  New Card
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-amber-500/50">
            <CardContent className="pt-6">
              <p className="text-amber-100/60 text-sm">
                Goal: Collect all {targetScore} Christ-focus cards by finding Christ in random verses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
