import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const passages = [
  {
    reference: "Luke 15:20",
    text: "But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.",
    keyObservations: [
      // What is happening (factual details)
      "1 father, 1 son - two people in this scene",
      "Son is traveling toward home (implied direction)",
      "Father is positioned at/near home (able to see distance)",
      "Distance: 'a long way off' - significant physical distance",
      "5 actions by father: saw, was filled, ran, threw arms, kissed",
      "0 actions by son in this verse - completely passive",
      // Detailed observations
      "Father 'saw him' - implies watching, waiting",
      "Father 'ran' - culturally undignified for elderly patriarch",
      "'Filled with compassion' - emotion precedes confession",
      "Physical embrace happens BEFORE any words spoken",
      "Sequence: seeing → emotion → running → embracing → kissing",
      "Father initiates every action - son hasn't spoken yet"
    ]
  },
  {
    reference: "Matthew 25:1-4",
    text: "Then the kingdom of heaven will be like ten virgins who took their lamps and went out to meet the bridegroom. Five of them were foolish and five were wise. The foolish ones took their lamps but did not take any oil with them. The wise, however, took oil in jars along with their lamps.",
    keyObservations: [
      // What is happening (factual details)
      "10 virgins total - specific number",
      "5 foolish + 5 wise = exact 50/50 split",
      "All 10 have lamps (no difference there)",
      "All 10 go out to meet bridegroom (same action)",
      "1 bridegroom they're all waiting for",
      "Foolish: lamps only, 0 extra oil",
      "Wise: lamps + oil in jars (2 things)",
      // Detailed observations
      "Difference is in PREPARATION, not appearance",
      "'Took their lamps' - both groups did this identically",
      "'Went out' - active movement, leaving somewhere",
      "'Jars' - separate containers beyond the lamp itself",
      "Setting: nighttime (need lamps)",
      "Event type: wedding procession (bridegroom mentioned)"
    ]
  },
  {
    reference: "Genesis 3:21",
    text: "The LORD God made garments of skin for Adam and his wife and clothed them.",
    keyObservations: [
      // What is happening (factual details)
      "2 people receiving garments: Adam and his wife",
      "1 actor: 'The LORD God' - He does the work",
      "2 actions by God: made + clothed",
      "Material: 'skin' (plural 'garments' from skin)",
      "0 actions by Adam and Eve - they receive passively",
      // Detailed observations
      "God MAKES the garments - not found, but crafted",
      "'Skins' implies an animal died - first blood shed",
      "God does the clothing - humans don't clothe themselves",
      "This replaces their fig leaf attempt (v.7)",
      "Full covering: 'garments' not patches",
      "Order: God acts, humans receive"
    ]
  },
  {
    reference: "Daniel 3:25",
    text: "He said, 'Look! I see four men walking around in the fire, unbound and unharmed, and the fourth looks like a son of the gods.'",
    keyObservations: [
      // What is happening (factual details)
      "4 men visible - but only 3 were thrown in",
      "1 extra person appeared (4 minus 3 = 1 mysterious figure)",
      "Position: IN the fire, not above or beside it",
      "Activity: 'walking around' - moving freely",
      "Physical state: 'unbound' - ropes gone",
      "Physical state: 'unharmed' - no damage",
      // Detailed observations
      "Speaker: 'He said' - the king is observing",
      "'Look!' - exclamation of surprise/astonishment",
      "Fourth figure distinguished: 'looks like a son of the gods'",
      "King (unbeliever) recognizes something divine",
      "Contrast: bound when thrown in → unbound inside",
      "Fire destroys ropes but not bodies or clothing"
    ]
  }
];

export default function ObservationGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPassage, setCurrentPassage] = useState(0);
  const [observations, setObservations] = useState("");
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [scoreSaved, setScoreSaved] = useState(false);

  const passage = passages[currentPassage];
  const progress = ((currentPassage + 1) / passages.length) * 100;

  const handleSubmit = () => {
    const userObs = observations.split('\n').filter(o => o.trim().length > 0);
    
    if (userObs.length < 3) {
      toast({
        title: "Need More Observations",
        description: "Try to find at least 3 detailed observations!",
        variant: "destructive",
      });
      return;
    }

    setScore(score + userObs.length);
    setCompleted([...completed, currentPassage]);
    setRevealed(true);
    
    toast({
      title: "Great Work!",
      description: `You found ${userObs.length} observations!`,
    });
  };

  const handleNext = () => {
    if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1);
      setObservations("");
      setRevealed(false);
    } else {
      toast({
        title: "🎉 Observation Room Complete!",
        description: `Total observations: ${score}`,
      });
    }
  };

  const isGameComplete = currentPassage === passages.length - 1 && revealed;

  // Save score when game completes
  useEffect(() => {
    const saveScore = async () => {
      if (isGameComplete && user && !scoreSaved) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "observation_room",
            score: score,
            mode: "solo",
          });
          setScoreSaved(true);
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };
    saveScore();
  }, [isGameComplete, user, score, scoreSaved]);

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">Observation Room Mastered!</CardTitle>
                <CardDescription>
                  You've trained your detective eye!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {score} Total Observations
                </div>
                <p className="text-muted-foreground">
                  You're seeing what others miss!
                </p>
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
            <GameLeaderboard gameType="observation_room" currentScore={score} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">Floor 2 • Observation Room (OR)</Badge>
              <Badge variant="outline">
                {currentPassage + 1} / {passages.length}
              </Badge>
            </div>
            <CardTitle className="text-3xl">🔍 Observation Detective</CardTitle>
            <CardDescription>
              Train your eye to notice details others miss. Write observations without interpretation!
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{passage.reference}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passage Text */}
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-lg leading-relaxed">{passage.text}</p>
            </div>

            {/* User Input */}
            {!revealed && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Your Observations (one per line):
                  </h3>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="WHAT IS HAPPENING (start here):&#10;- 1 father, 1 son = 2 people in this scene&#10;- 5 actions by father: saw, filled, ran, threw arms, kissed&#10;- 0 actions by son (completely passive)&#10;&#10;DETAILED OBSERVATIONS:&#10;- Father 'ran' - culturally undignified for patriarch&#10;- Physical embrace happens BEFORE any words spoken"
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Start with WHAT IS HAPPENING: count people, objects, actions (e.g., "10 virgins, 5 foolish, 5 wise"). Then add deeper observations.
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={observations.trim().length === 0}
                  className="w-full"
                  size="lg"
                >
                  Submit Observations
                </Button>
              </>
            )}

            {/* Revealed Observations */}
            {revealed && (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-800 dark:text-green-400">
                    ✓ Key Observations to Notice:
                  </h3>
                  <ul className="space-y-2">
                    {passage.keyObservations.map((obs, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">{i + 1}</Badge>
                        <span className="text-sm">{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={handleNext} className="w-full" size="lg">
                  {currentPassage < passages.length - 1 ? "Next Passage" : "Finish"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">💡 Observation Room Tip:</h4>
            <p className="text-sm text-muted-foreground">
              Like a detective at a crime scene, log details before theorizing. Start with WHAT IS HAPPENING: count people (10 virgins), objects (lamps, jars), actions (ran, kissed). Then notice: word choices, repetitions, sequences, who acts/speaks, and what's NOT said.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
