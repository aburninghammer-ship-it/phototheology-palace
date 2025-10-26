import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Trophy, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DIFFICULTY_LEVELS = [
  { name: "Apprentice", time: 20, ingredients: 3, description: "3 Bible verses, 20 minutes" },
  { name: "Chef", time: 15, ingredients: 5, description: "5 verses, 15 minutes" },
  { name: "Master Chef", time: 10, ingredients: 7, description: "7 verses, 10 minutes, complex doctrine" },
];

const RECIPE_THEMES = [
  "The Gospel in 3-5 verses",
  "Sanctuary service from altar to ark",
  "Sabbath truth across Scripture",
  "State of the dead",
  "Second coming signs",
  "Remnant characteristics",
  "Christ in the Psalms",
  "Daniel's prophecies simplified",
];

export default function ChefChallenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTY_LEVELS[0] | null>(null);
  const [theme, setTheme] = useState("");
  const [recipe, setRecipe] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startChallenge = (level: typeof DIFFICULTY_LEVELS[0]) => {
    setDifficulty(level);
    const randomTheme = RECIPE_THEMES[Math.floor(Math.random() * RECIPE_THEMES.length)];
    setTheme(randomTheme);
    setTimeLeft(level.time * 60);
    setStarted(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Submit what you have.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!recipe.trim()) {
      toast.error("Write your biblical recipe first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_chef_recipe",
          theme,
          recipe,
          difficulty: difficulty?.name,
          requiredVerses: difficulty?.ingredients,
        }
      });

      if (error) throw error;

      const { quality, feedback, stars } = data;

      toast.success(`${stars}/5 Stars! ${feedback}`);

      if (user) {
        await supabase.from('challenge_submissions').insert({
          user_id: user.id,
          challenge_id: `chef_${difficulty?.name}`,
          content: JSON.stringify({ theme, recipe, stars }),
          submission_data: { theme, recipe, quality, stars },
        });
      }

      setStarted(false);
      setRecipe("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
            <ArrowLeft className="mr-2" />
            Back to Games
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <ChefHat className="w-20 h-20 mx-auto mb-4 text-orange-600" />
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                🍳 THE CHEF CHALLENGE
              </h1>
              <p className="text-xl text-muted-foreground">
                Create a "biblical recipe" – a coherent mini-sermon using only Bible verses
              </p>
            </div>

            <Card className="mb-8 border-orange-500/50 bg-gradient-to-br from-orange-100/50 to-amber-100/50 dark:from-orange-900/20 dark:to-amber-900/20">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>🎯 <strong>Your Mission:</strong> Build a complete theological point using ONLY Bible verse references</p>
                <p>📖 <strong>The Rules:</strong> No commentary, no transitions – just verses that flow together</p>
                <p>⭐ <strong>Scoring:</strong> Jeeves rates your recipe on clarity, flow, and doctrinal accuracy (1-5 stars)</p>
                <p>🏆 <strong>Example:</strong> "Gospel in 3 verses" → Romans 3:23, Romans 6:23, John 3:16</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {DIFFICULTY_LEVELS.map((level) => (
                <Card key={level.name} className="hover:shadow-xl transition-shadow cursor-pointer group border-2 hover:border-orange-500" onClick={() => startChallenge(level)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-orange-600" />
                      {level.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge className="bg-orange-600 text-white">{level.description}</Badge>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>⏱️ {level.time} minutes</p>
                        <p>📖 {level.ingredients} verses minimum</p>
                      </div>
                      <Button className="w-full group-hover:bg-orange-600">
                        Start Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                {difficulty?.name} Challenge
              </h2>
              <p className="text-muted-foreground">Theme: {theme}</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                <Clock className="w-8 h-8 inline mr-2" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground">Time remaining</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Biblical Recipe</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use at least {difficulty?.ingredients} Bible verses. No commentary – just verses!
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                placeholder="Example:&#10;Romans 3:23&#10;Romans 6:23&#10;John 3:16&#10;&#10;Write your verse references here..."
                className="min-h-80 font-mono text-base"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSubmit} disabled={isSubmitting || !recipe.trim()} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <Send className="mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Recipe"}
                </Button>
                <Button variant="outline" onClick={() => setStarted(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
