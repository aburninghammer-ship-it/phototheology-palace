import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat } from "lucide-react";

interface ChefRecipeChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const ChefRecipeChallenge = ({ challenge, onSubmit, hasSubmitted }: ChefRecipeChallengeProps) => {
  const [recipe, setRecipe] = useState("");

  const handleSubmit = () => {
    if (!recipe.trim()) return;
    
    onSubmit({
      recipe: recipe.trim(),
      theme: challenge.ui_config?.theme || challenge.title,
      principle_applied: "Bible Freestyle (BF) + Concentration Room (CR)"
    });
  };

  const minVerses = challenge.ui_config?.min_verses || 5;

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

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-sm space-y-1">
          <p>📖 <strong>Requirements:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• Use at least {minVerses} Bible verses</li>
            <li>• No commentary – just verse references</li>
            <li>• Verses should flow together and make a theological point</li>
          </ul>
        </div>

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Biblical Recipe:</label>
              <Textarea
                placeholder="Example:&#10;Romans 3:23&#10;Romans 6:23&#10;John 3:16&#10;Ephesians 2:8-9&#10;1 John 1:9&#10;&#10;Write your verse references here..."
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                rows={8}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Each verse reference on its own line. Build a complete theological narrative.
              </p>
            </div>

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
      </CardContent>
    </Card>
  );
};
