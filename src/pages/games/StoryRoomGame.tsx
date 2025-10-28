import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const storyQuizzes = [
  {
    story: "Joseph's Journey",
    sequence: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    correct: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    book: "Genesis 37-50"
  },
  {
    story: "David and Goliath",
    sequence: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    correct: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    book: "1 Samuel 17"
  },
  {
    story: "Daniel's Trial",
    sequence: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    correct: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    book: "Daniel 1-7"
  },
  {
    story: "Exodus Journey",
    sequence: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    correct: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    book: "Exodus 3-40"
  },
  {
    story: "Christ's Passion",
    sequence: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    correct: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    book: "Matthew 26-28"
  }
];

export default function StoryRoomGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Shuffle the scenes for the current quiz
    const scenes = [...storyQuizzes[currentQuiz].sequence];
    setAvailableScenes(shuffleArray(scenes));
    setUserSequence([]);
    setFeedback("");
  }, [currentQuiz]);

  // Save score when game completes
  useEffect(() => {
    if (isComplete && user && score > 0) {
      saveScore();
    }
  }, [isComplete, user, score]);

  const saveScore = async () => {
    if (!user) return;
    
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "story_room",
        score: score,
        mode: "solo",
        metadata: {
          total_questions: storyQuizzes.length,
          completed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleSceneClick = (scene: string) => {
    setUserSequence([...userSequence, scene]);
    setAvailableScenes(availableScenes.filter(s => s !== scene));
  };

  const handleRemoveScene = (index: number) => {
    const scene = userSequence[index];
    setAvailableScenes([...availableScenes, scene]);
    setUserSequence(userSequence.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const quiz = storyQuizzes[currentQuiz];
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(quiz.correct);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("✓ Perfect! You've mastered this story sequence!");
      toast({
        title: "Correct!",
        description: "Story sequence completed perfectly!",
      });

      setTimeout(() => {
        if (currentQuiz < storyQuizzes.length - 1) {
          setCurrentQuiz(currentQuiz + 1);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    } else {
      setFeedback("✗ Not quite right. Try again!");
      toast({
        title: "Try Again",
        description: "The sequence isn't quite right. Review the story!",
        variant: "destructive",
      });
    }
  };

  const quiz = storyQuizzes[currentQuiz];
  const progress = ((currentQuiz + 1) / storyQuizzes.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-3xl">Story Room Mastered!</CardTitle>
              <CardDescription>
                You've completed all story sequences!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {score} / {storyQuizzes.length}
              </div>
              <p className="text-muted-foreground">
                Stories memorized as vivid mental movies
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
              <Badge variant="secondary">Floor 1 • Story Room (SR)</Badge>
              <Badge variant="outline">
                {currentQuiz + 1} / {storyQuizzes.length}
              </Badge>
            </div>
            <CardTitle className="text-3xl">📚 Story Room Challenge</CardTitle>
            <CardDescription>
              Arrange the story scenes in chronological order. Turn each story into a vivid mental movie!
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{quiz.story}</CardTitle>
            <CardDescription>{quiz.book}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User's Sequence */}
            <div>
              <h3 className="font-semibold mb-3">Your Story Sequence:</h3>
              <div className="min-h-[120px] p-4 border-2 border-dashed rounded-lg bg-muted/50">
                {userSequence.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Click scenes below to build your story sequence
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userSequence.map((scene, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border"
                      >
                        <span className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          {scene}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveScene(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available Scenes */}
            <div>
              <h3 className="font-semibold mb-3">Available Scenes:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableScenes.map((scene) => (
                  <Button
                    key={scene}
                    variant="outline"
                    className="h-auto py-4 justify-start text-left"
                    onClick={() => handleSceneClick(scene)}
                  >
                    {scene}
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                feedback.includes("✓") 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {feedback.includes("✓") ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">{feedback}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={checkAnswer}
              disabled={userSequence.length !== quiz.sequence.length}
              className="w-full"
              size="lg"
            >
              Check Sequence
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">💡 Story Room Tip:</h4>
            <p className="text-sm text-muted-foreground">
              The Story Room trains you to memorize Bible stories as vivid mental movies. Each scene becomes a frame you can recall in order. This is the foundation for all other Palace methods!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
