import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Sparkles, Trophy, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface MonthlyGameCardProps {
  game: {
    id: string;
    game_name: string;
    game_description: string;
    game_type: string;
    difficulty: string;
    categories: string[];
    game_rules: any;
    month_year: string;
    play_count: number;
    average_rating: number;
  };
  userRating?: number;
  onRatingUpdate: () => void;
}

export function MonthlyGameCard({ game, userRating, onRatingUpdate }: MonthlyGameCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(userRating || 0);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleRateGame = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("game_ratings")
      .upsert({
        game_id: game.id,
        user_id: user.id,
        rating,
        feedback: feedback || null,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save rating",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rating saved!",
      description: "Thank you for your feedback",
    });
    setShowRating(false);
    onRatingUpdate();
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                {game.game_name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {game.difficulty}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(game.month_year + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold">
                  {game.average_rating ? game.average_rating.toFixed(1) : 'New'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {game.play_count} plays
              </span>
            </div>
          </div>
          <CardDescription className="mt-3">
            {game.game_description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {game.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {game.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{game.categories.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setShowDetails(true)} 
                variant="outline" 
                className="flex-1"
                size="sm"
              >
                View Rules
              </Button>
              <Button 
                onClick={() => setShowRating(true)} 
                variant="default" 
                className="flex-1"
                size="sm"
              >
                <Star className={`mr-1 h-4 w-4 ${userRating ? 'fill-current' : ''}`} />
                {userRating ? 'Update Rating' : 'Rate Game'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              {game.game_name}
            </DialogTitle>
            <DialogDescription>{game.game_description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Objective</h4>
              <p className="text-sm text-muted-foreground">{game.game_rules.objective}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How to Play</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{game.game_rules.mechanics}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scoring</h4>
              <p className="text-sm text-muted-foreground">{game.game_rules.scoring}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Special Features</h4>
              <p className="text-sm text-muted-foreground">{game.game_rules.special_features}</p>
            </div>
            {game.game_rules.example_challenge && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Example Challenge
                </h4>
                <p className="text-sm text-muted-foreground italic">{game.game_rules.example_challenge}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {game.categories.map((cat) => (
                  <Badge key={cat} variant="secondary">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRating} onOpenChange={setShowRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {game.game_name}</DialogTitle>
            <DialogDescription>
              Help us improve by rating this game
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Feedback (optional)</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about this game..."
                rows={3}
              />
            </div>
            <Button onClick={handleRateGame} className="w-full">
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
