import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface ChefRecipeChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const ChefRecipeChallenge = ({ challenge, onSubmit, hasSubmitted }: ChefRecipeChallengeProps) => {
  const [recipe, setRecipe] = useState("");
  const [verses, setVerses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [modelAnswer, setModelAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const { toast } = useToast();

  const minVerses = challenge.ui_config?.min_verses || 7;
  const maxVerses = challenge.ui_config?.max_verses || 10;
  const difficulty = challenge.difficulty || "master";

  useEffect(() => {
    generateVerses();
  }, []);

  const generateVerses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate_chef_verses",
          minVerses,
          maxVerses,
          difficulty,
          theme: challenge.ui_config?.theme || challenge.title,
        },
      });

      if (error) throw error;
      setVerses(data.verses || []);
    } catch (error) {
      console.error("Error generating verses:", error);
      toast({
        title: "Error",
        description: "Failed to generate verses. Please try again.",
        variant: "destructive",
      });
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

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!recipe.trim()) return;
    
    onSubmit({
      recipe: recipe.trim(),
      verses,
      feedback,
      theme: challenge.ui_config?.theme || challenge.title,
      principle_applied: "Bible Freestyle (BF) + Concentration Room (CR)"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-600" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Quick • 5-10 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Create a "biblical recipe" – a coherent mini-sermon using ONLY Bible verse references
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Theme:</p>
          <p className="text-lg">{challenge.ui_config?.theme || challenge.description}</p>
        </div>

        {isLoading && verses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            <span className="ml-2">Jeeves is selecting random verses...</span>
          </div>
        ) : (
          <>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg space-y-3">
              <p className="font-semibold">🎲 Your Random Verses ({verses.length}):</p>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                {verses.map((verse, idx) => (
                  <div key={idx} className="text-sm font-mono mb-1">
                    {verse}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                These verses are intentionally unrelated. Your challenge: weave them into a coherent theological narrative!
              </p>
            </div>

            {!hasSubmitted ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Biblical Recipe:</label>
                  <Textarea
                    placeholder="Use the verses above to build a theological narrative.&#10;&#10;Example:&#10;Start with Romans 3:23 to establish the problem...&#10;Then Romans 6:23 shows the consequence...&#10;John 3:16 reveals God's solution...&#10;&#10;Be creative and make connections!"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Explain how these verses connect to make a complete theological point on the theme.
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
                  disabled={!recipe.trim()}
                >
                  Submit Recipe to Growth Journal
                </Button>
              </>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  ✓ Recipe Complete! Added to your Growth Journal.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
