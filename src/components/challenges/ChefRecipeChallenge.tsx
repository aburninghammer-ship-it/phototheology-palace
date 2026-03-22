import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Loader2, Eye, RefreshCw, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { GenericChallengeShareDialog } from "./GenericChallengeShareDialog";
import { PostToPublicChallengeButton } from "./PostToPublicChallengeButton";

interface ChefRecipeChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const ChefRecipeChallenge = ({ challenge, onSubmit, hasSubmitted }: ChefRecipeChallengeProps) => {
  const [recipe, setRecipe] = useState("");
  const [verses, setVerses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [modelAnswer, setModelAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "intermediate" | "pro" | "master">("intermediate");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();

  const theme = challenge.ui_config?.theme || challenge.title || "Biblical Recipe";
  const shareContent = verses.length > 0
    ? verses.map((verse: any) => `${verse.reference}: "${verse.text}"`).join("\n\n")
    : "";

  const difficultyConfig = {
    easy: { min: 3, max: 4, label: "Easy", icon: "🌱", description: "3-4 verses" },
    intermediate: { min: 5, max: 6, label: "Intermediate", icon: "🔥", description: "5-6 verses" },
    pro: { min: 10, max: 10, label: "Pro", icon: "💎", description: "10 verses" },
    master: { min: 10, max: 10, label: "Master", icon: "👑", description: "10 verses" }
  };

  // Remove auto-generation - user must click the button

  const generateVerses = async () => {
    setIsLoading(true);
    setVerses([]);
    setRecipe("");
    setFeedback(null);
    setShowModelAnswer(false);
    setModelAnswer("");
    
    try {
      const config = difficultyConfig[difficulty];
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate_chef_verses",
          minVerses: config.min,
          maxVerses: config.max,
          difficulty,
          theme: challenge.ui_config?.theme || challenge.title,
        },
      });

      if (error) throw new Error(error.message || "Failed to generate verses");
      if (!data?.verses || !Array.isArray(data.verses) || data.verses.length === 0) {
        throw new Error("Invalid response format");
      }
      
      setVerses(data.verses);
      toast({
        title: "Ingredients Ready! 🎲",
        description: `${data.verses.length} random verses generated for your recipe.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Generate Ingredients",
        description: error.message || "Unable to generate verses. Please try again.",
        variant: "destructive",
      });
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!recipe.trim()) {
      toast({
        title: "No Recipe",
        description: "Write your recipe first!",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "check_chef_recipe",
          theme: challenge.ui_config?.theme || challenge.title,
          recipe: recipe.trim(),
          verses,
          difficulty,
        },
      });

      if (error) throw error;
      setFeedback(data);
      
      toast({
        title: "Recipe Checked! ⭐",
        description: data.feedback || "Great work!",
      });
    } catch (error) {
      console.error("Error checking recipe:", error);
      toast({
        title: "Error",
        description: "Failed to check recipe. Please try again.",
        variant: "destructive",
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

    setIsLoadingModel(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "get_chef_model_answer",
          theme: challenge.ui_config?.theme || challenge.title,
          verses,
          difficulty,
        },
      });

      if (error) throw error;
      setModelAnswer(data.modelAnswer || "");
      setShowModelAnswer(true);
    } catch (error) {
      console.error("Error getting model answer:", error);
      toast({
        title: "Error",
        description: "Failed to get model answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingModel(false);
    }
  };

  const handleSubmit = () => {
    if (!recipe.trim()) {
      toast({
        title: "Recipe Required",
        description: "Please write your recipe before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      recipe: recipe.trim(),
      verses,
      feedback,
      difficulty,
    });
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-600" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge>Quick • 5-10 min</Badge>
            <Button
              onClick={() => setShowShareDialog(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        <CardDescription className="mt-2">
          Use the verses (ingredients) Jeeves has provided and create a recipe from it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Select Your Challenge Level</label>
            <div className="grid grid-cols-2 gap-2">
              {(["easy", "intermediate", "pro", "master"] as const).map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  onClick={() => setDifficulty(level)}
                  className="w-full"
                  disabled={isLoading || hasSubmitted}
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
            <label className="text-sm font-medium block mb-2">Get Your Ingredients</label>
            <Button
              onClick={generateVerses} 
              className="w-full bg-orange-600 hover:bg-orange-700" 
              disabled={isLoading || hasSubmitted}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Jeeves is selecting verses...
                </>
              ) : (
                <>
                  🎲 Generate Challenge Ingredients
                </>
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            <span className="text-sm">Jeeves is gathering random ingredients...</span>
          </div>
        ) : verses.length === 0 ? (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg text-center">
            <ChefHat className="h-12 w-12 mx-auto mb-3 text-orange-600" />
            <p className="font-medium mb-2">Ready to cook up a biblical recipe?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Click the difficulty level above to get your random verse ingredients!
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
              <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-orange-300 dark:border-orange-700">
                {verses.map((verse: any, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <p className="font-semibold text-orange-600 mb-1">{verse.reference}</p>
                    <p className="text-sm italic pl-4 border-l-2 border-orange-300">"{verse.text}"</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                ⚡ Challenge: These verses are intentionally random and unrelated! Your goal is to creatively weave them into a coherent Bible study.
              </p>
            </div>

            {!hasSubmitted && verses.length > 0 && (
              <Button 
                onClick={generateVerses} 
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Challenge
                  </>
                )}
              </Button>
            )}

            {!hasSubmitted ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Write Your Recipe (Use ONLY the Ingredient Verses Above!)</label>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-300 dark:border-yellow-700 mb-2">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                      ⚠️ IMPORTANT: Use ONLY the {verses.length} ingredient verses shown above. Do NOT add any other verses!
                    </p>
                  </div>
                  <Textarea
                    placeholder="Use ONLY the ingredient verses shown above to weave them into one cohesive theological study.&#10;&#10;Example approach:&#10;Start with [first verse] to establish the foundation...&#10;Connect it to [second verse] by showing how...&#10;Weave in [third verse] to reveal...&#10;Conclude with [final verse] bringing it all together...&#10;&#10;Make creative connections between these random verses!"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground font-semibold">
                    ✅ Use ONLY the {verses.length} ingredient verses above • ❌ Do NOT add extra verses
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
                    disabled={isLoadingModel}
                  >
                    {isLoadingModel ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        {showModelAnswer ? "Hide" : "Show"} Model Answer
                      </>
                    )}
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
                  disabled={!recipe.trim()}
                >
                  Submit Recipe to Growth Journal
                </Button>
              </>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-3">
                <p className="text-green-800 dark:text-green-200">
                  ✓ Recipe Complete! Added to your Growth Journal.
                </p>
              </div>
            )}

            {verses.length > 0 && (
              <PostToPublicChallengeButton
                challengeType="chef"
                title={`Chef Challenge: ${theme}`}
                content={verses.map((v: any) => `📖 **${v.reference}**\n> "${v.text}"`).join("\n\n") + `\n\n⚡ Challenge: Weave these random verses into a coherent Bible study recipe!`}
                difficulty={difficulty}
                className="w-full"
              />
            )}
          </>
        )}
      </CardContent>
    </Card>

    <GenericChallengeShareDialog
      open={showShareDialog}
      onOpenChange={setShowShareDialog}
      challengeType="chef"
      title={`Chef Challenge: ${theme}`}
      description={`Theme: ${theme} • ${verses.length} ingredient verses`}
      difficulty={difficulty}
      content={shareContent || undefined}
    />
    </>
  );
};
