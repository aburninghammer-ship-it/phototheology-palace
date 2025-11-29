import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GameLeaderboard } from "@/components/GameLeaderboard";

const passages = [
  {
    reference: "Exodus 12:13",
    text: "The blood will be a sign for you on the houses where you are, and when I see the blood, I will pass over you.",
    dimensions: {
      literal: "Israelites put blood on doorposts; the destroyer passes over those houses.",
      christ: "Christ is our Passover Lamb (1 Cor 5:7); His blood saves from death and judgment.",
      me: "I must apply Christ's blood through faith; salvation is personal, not automatic.",
      church: "The church is protected by Christ's sacrifice; we are marked by His blood.",
      heaven: "Passover foreshadows eternal deliverance; ultimate Passover in new creation."
    }
  },
  {
    reference: "John 15:5",
    text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
    dimensions: {
      literal: "Jesus uses vine/branch metaphor to teach about connection and dependence.",
      christ: "Christ is the source of all spiritual life and fruitfulness.",
      me: "I must abide in Christ daily; apart from Him I can do nothing spiritually.",
      church: "The church is one body connected to Christ; we bear fruit together.",
      heaven: "Eternal fruitfulness flows from union with Christ; perfected in heaven."
    }
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd, I shall not want.",
    dimensions: {
      literal: "David uses shepherd imagery from his own experience tending sheep.",
      christ: "Jesus is the Good Shepherd who lays down His life for the sheep (John 10:11).",
      me: "The LORD personally shepherds me; I lack nothing when He leads.",
      church: "Christ shepherds His flock corporately; the church follows one Shepherd.",
      heaven: "The Lamb will shepherd us eternally (Rev 7:17); perfect provision forever."
    }
  }
];

export default function DimensionsRoom() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentDimension, setCurrentDimension] = useState<keyof typeof passages[0]['dimensions']>("literal");
  const [userAnswer, setUserAnswer] = useState("");
  const [completedDimensions, setCompletedDimensions] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);

  const passage = passages[currentPassage];
  const dimensions: Array<keyof typeof passage.dimensions> = ["literal", "christ", "me", "church", "heaven"];
  const dimensionLabels = {
    literal: "📖 Literal",
    christ: "✝️ Christ",
    me: "👤 Personal (Me)",
    church: "⛪ Church",
    heaven: "🌟 Heaven"
  };

  const handleSubmit = () => {
    if (userAnswer.trim().length < 15) {
      toast({
        title: "Add More Detail",
        description: "Explain this dimension more fully!",
        variant: "destructive",
      });
      return;
    }

    const key = `${currentPassage}-${currentDimension}`;
    setCompletedDimensions(new Set(completedDimensions).add(key));
    setScore(score + 1);
    
    toast({
      title: "✓ Dimension Complete!",
      description: `${dimensionLabels[currentDimension]} unlocked!`,
    });

    // Move to next dimension or passage
    const currentDimIndex = dimensions.indexOf(currentDimension);
    if (currentDimIndex < dimensions.length - 1) {
      setCurrentDimension(dimensions[currentDimIndex + 1]);
      setUserAnswer("");
    } else if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1);
      setCurrentDimension("literal");
      setUserAnswer("");
    }
  };

  const isComplete = currentPassage === passages.length - 1 && 
                     completedDimensions.size === passages.length * dimensions.length;

  const progress = (completedDimensions.size / (passages.length * dimensions.length)) * 100;

  // Save score when game completes
  useEffect(() => {
    const saveScore = async () => {
      if (isComplete && user && !scoreSaved) {
        try {
          await supabase.from("game_scores").insert({
            user_id: user.id,
            game_type: "dimensions_room",
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
  }, [isComplete, user, score, scoreSaved]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">Dimensions Room Mastered!</CardTitle>
                <CardDescription>
                  You're seeing Scripture from every angle!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-primary">
                  5 Dimensions × {passages.length} Passages
                </div>
                <p className="text-muted-foreground">
                  Like viewing a diamond under five different lights!
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
            <GameLeaderboard gameType="dimensions_room" currentScore={score} />
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
              <Badge variant="secondary">Floor 4 • Dimensions Room (DR)</Badge>
              <Badge variant="outline">
                {completedDimensions.size} / {passages.length * dimensions.length}
              </Badge>
            </div>
            <CardTitle className="text-3xl">💎 Five Dimensions</CardTitle>
            <CardDescription>
              View Scripture like a diamond under five different lights. Each dimension reveals a unique sparkle!
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
              <p className="text-lg leading-relaxed italic">{passage.text}</p>
            </div>

            {/* Dimension Selector */}
            <div className="grid grid-cols-5 gap-2">
              {dimensions.map((dim) => {
                const key = `${currentPassage}-${dim}`;
                const isCompleted = completedDimensions.has(key);
                const isCurrent = dim === currentDimension;
                
                return (
                  <Button
                    key={dim}
                    variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                    onClick={() => setCurrentDimension(dim)}
                    className="h-auto py-3 text-xs flex flex-col gap-1"
                  >
                    {dimensionLabels[dim]}
                    {isCompleted && <span className="text-xs">✓</span>}
                  </Button>
                );
              })}
            </div>

            {/* Current Dimension */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {dimensionLabels[currentDimension]}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {currentDimension === "literal" && "What does the text literally mean in its context?"}
                {currentDimension === "christ" && "How does this text point to or reveal Jesus Christ?"}
                {currentDimension === "me" && "How does this apply to my personal life and walk with God?"}
                {currentDimension === "church" && "How does this apply to the church corporately?"}
                {currentDimension === "heaven" && "How does this relate to heaven and eternity?"}
              </p>

              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Explain the ${currentDimension} dimension of this verse...`}
                className="min-h-[120px] mb-4"
              />

              <Button
                onClick={handleSubmit}
                disabled={userAnswer.trim().length === 0}
                className="w-full"
                size="lg"
              >
                Submit {dimensionLabels[currentDimension]}
              </Button>
            </div>

            {/* Model Answer (after submission) */}
            {completedDimensions.has(`${currentPassage}-${currentDimension}`) && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800 dark:text-green-400">
                  ✓ Model Answer:
                </h4>
                <p className="text-sm">{passage.dimensions[currentDimension]}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">💡 Dimensions Room Tip:</h4>
            <p className="text-sm text-muted-foreground">
              Like looking at a diamond, every verse has five facets. Don't stop at one! The same stone reflects different light from different angles. This is how the Bible becomes multi-dimensional.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
