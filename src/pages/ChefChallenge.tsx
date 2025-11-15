import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ArrowLeft, Loader2, Eye, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface Verse {
  reference: string;
  text: string;
}

const difficultyConfig = {
  easy: { min: 3, max: 4, label: "Easy (3-4 verses)", icon: "🌱" },
  intermediate: { min: 5, max: 6, label: "Intermediate (5-6 verses)", icon: "🔥" },
  pro: { min: 7, max: 8, label: "Pro (7-8 verses)", icon: "💎" },
  master: { min: 9, max: 10, label: "Master (9-10 verses)", icon: "👑" }
};


export default function ChefChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<keyof typeof difficultyConfig>("intermediate");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [modelAnswer, setModelAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleShare = () => {
    const verseRefs = verses.map(v => v.reference).join(', ');
    const text = `🧑‍🍳 Help me make this Chef Challenge dish!\n\nI need to tie these ${verses.length} random verses together:\n${verseRefs}\n\nCan you help me create a creative Bible study?`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Chef Challenge - Help Me!',
        text: text,
        url: url
      }).catch(() => {
        // Fallback to copying
        navigator.clipboard.writeText(`${text}\n\n${url}`);
        toast.success("Challenge copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      toast.success("Challenge copied to clipboard!");
    }
  };

  const generateVerses = async () => {
    setIsLoading(true);
    setVerses([]);
    setRecipe("");
    setFeedback(null);
    setShowModelAnswer(false);
    setModelAnswer("");
    setHasSubmitted(false);
    
    try {
      const config = difficultyConfig[difficulty];
      console.log("=== CALLING JEEVES TO GENERATE VERSES ===");
      console.log("Config:", { min: config.min, max: config.max, difficulty });
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate_chef_verses",
          minVerses: config.min,
          maxVerses: config.max,
          difficulty,
        },
      });

      console.log("=== JEEVES RESPONSE ===");
      console.log("Error:", error);
      console.log("Data:", data);

      if (error) {
        console.error("Jeeves error details:", error);
        throw new Error(error.message || "Failed to call Jeeves");
      }
      
      if (!data) {
        throw new Error("No data returned from Jeeves");
      }
      
      if (!data.verses || !Array.isArray(data.verses)) {
        console.error("Invalid data structure:", data);
        throw new Error("Invalid response format - missing verses array");
      }
      
      if (data.verses.length === 0) {
        throw new Error("Jeeves returned empty verses array");
      }
      
      console.log("Successfully received verses:", data.verses);
      setVerses(data.verses as Verse[]);
      toast.success(`Ingredients Ready! 🎲`, {
        description: `${data.verses.length} random verses generated.`
      });
    } catch (error: any) {
      console.error("=== ERROR GENERATING VERSES ===");
      console.error("Error message:", error.message);
      toast.error("Failed to Generate Ingredients", {
        description: error.message || "Unable to generate verses. Please try again."
      });
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!recipe.trim()) {
      toast.error("No Recipe", {
        description: "Write your recipe first!"
      });
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "check_chef_recipe",
          recipe: recipe.trim(),
          verses,
          difficulty,
        },
      });

      if (error) throw error;
      setFeedback(data);
      
      toast.success("Recipe Checked! ⭐", {
        description: data.feedback || "Great work!"
      });
    } catch (error) {
      console.error("Error checking recipe:", error);
      toast.error("Error", {
        description: "Failed to check recipe. Please try again."
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleShowModelAnswer = async () => {
    if (modelAnswer) {
      setShowModelAnswer(!showModelAnswer);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "get_chef_model_answer",
          verses,
          difficulty,
        },
      });

      if (error) throw error;
      setModelAnswer(data.modelAnswer || "");
      setShowModelAnswer(true);
    } catch (error) {
      console.error("Error getting model answer:", error);
      toast.error("Error", {
        description: "Failed to get model answer. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!recipe.trim() || !user) return;
    
    setIsLoading(true);
    try {
      const submissionData = {
        user_id: user.id,
        content: recipe.trim(),
        submission_data: {
          recipe: recipe.trim(),
          verses,
          feedback,
          difficulty
        } as any,
        principle_applied: "Bible Freestyle (BF) + Concentration Room (CR)"
      };
      
      const { error: submitError } = await supabase
        .from('challenge_submissions')
        .insert(submissionData);
        
      if (submitError) {
        console.error("Submission error:", submitError);
        throw submitError;
      }
      
      setHasSubmitted(true);
      toast.success("Recipe Submitted!", {
        description: "Added to your Growth Journal."
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit recipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
          <ArrowLeft className="mr-2" />
          Back to Games
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <CardTitle>Chef Challenge</CardTitle>
              </div>
              <Badge>Quick • 5-10 min</Badge>
            </div>
            <CardDescription className="mt-2">
              📖 <strong>The Rules:</strong> Jeeves will provide completely random verses that appear unrelated. Your goal is to creatively tie them together into a cohesive Bible study that makes sense.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Step 1: Select Your Challenge Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["easy", "intermediate", "pro", "master"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level)}
                      className="w-full"
                      disabled={isLoading || hasSubmitted || verses.length > 0}
                    >
                      {difficultyConfig[level].icon} {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {difficultyConfig[difficulty].label}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Step 2: Get Your Ingredients</label>
                <Button 
                  onClick={generateVerses} 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  disabled={isLoading || hasSubmitted || verses.length > 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Jeeves is selecting verses...
                    </>
                  ) : verses.length > 0 ? (
                    <>
                      ✓ Ingredients Generated
                    </>
                  ) : (
                    <>
                      🎲 Generate Challenge Ingredients
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isLoading && verses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                <span className="text-sm">Jeeves is gathering random ingredients...</span>
              </div>
            ) : verses.length === 0 ? (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg text-center">
                <ChefHat className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                <p className="font-medium mb-2">Ready to cook up a biblical recipe?</p>
                <p className="text-sm text-muted-foreground">
                  Select a difficulty level and click "Generate Challenge Ingredients"!
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg space-y-3 border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg">🥘 Your Ingredients ({verses.length} verses):</p>
                    <Badge variant="outline" className="bg-white dark:bg-gray-800">
                      {difficulty}
                    </Badge>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-orange-300 dark:border-orange-700 space-y-3">
                    {verses.map((verse, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-orange-600 font-bold text-sm">{verse.reference}</p>
                        <p className="text-sm italic pl-4 border-l-2 border-orange-200 dark:border-orange-800">"{verse.text}"</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    ⚡ Challenge: These verses are intentionally random and unrelated! Your goal is to creatively weave them into a coherent Bible study.
                  </p>
                  
                  <Button 
                    onClick={handleShare} 
                    variant="outline"
                    className="w-full border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    🆘 Help Me Make This Dish
                  </Button>
                </div>

                {!hasSubmitted ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Step 3: Create Your Biblical Recipe</label>
                      <Textarea
                        placeholder="Use the verses above to build a creative Bible study.&#10;&#10;Example:&#10;Start with Genesis 1:1 to establish creation...&#10;Then connect Psalm 23:1 to show God as provider...&#10;Finally, John 3:16 reveals the ultimate provision...&#10;&#10;Be creative and make unexpected connections!"
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                        rows={10}
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        Explain how these seemingly unrelated verses connect to make a complete theological point.
                      </p>
                    </div>

                    {feedback && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                        <p className="font-semibold">✨ Jeeves's Feedback:</p>
                        <div className="text-sm">{formatJeevesResponse(feedback.feedback || "")}</div>
                        {feedback.rating && (
                          <div className="flex items-center gap-1">
                            {"⭐".repeat(feedback.rating)}
                            <span className="text-xs ml-2">({feedback.rating}/5)</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCheck} 
                        variant="outline"
                        className="flex-1"
                        disabled={!recipe.trim() || isChecking}
                      >
                        {isChecking ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check My Recipe"
                        )}
                      </Button>
                      <Button 
                        onClick={handleShowModelAnswer} 
                        variant="secondary"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {showModelAnswer ? "Hide" : "Show"} Model Answer
                      </Button>
                    </div>

                    {showModelAnswer && modelAnswer && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2">
                        <p className="font-semibold">🤖 Jeeves's Model Answer:</p>
                        <div className="text-sm">{formatJeevesResponse(modelAnswer)}</div>
                      </div>
                    )}

                    <Button 
                      onClick={handleSubmit} 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={!recipe.trim() || isLoading}
                    >
                      Submit Recipe to Growth Journal
                    </Button>
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center space-y-4">
                    <p className="text-green-800 dark:text-green-200">
                      ✓ Recipe Complete! Added to your Growth Journal.
                    </p>
                    <Button 
                      onClick={() => {
                        setVerses([]);
                        setRecipe("");
                        setFeedback(null);
                        setShowModelAnswer(false);
                        setModelAnswer("");
                        setHasSubmitted(false);
                      }}
                      variant="outline"
                    >
                      Start New Challenge
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
