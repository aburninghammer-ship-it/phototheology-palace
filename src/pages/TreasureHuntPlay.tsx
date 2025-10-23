import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Lightbulb, CheckCircle2, ArrowRight, Clock } from "lucide-react";

const TreasureHuntPlay = () => {
  const { huntId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hunt, setHunt] = useState<any>(null);
  const [currentClue, setCurrentClue] = useState<any>(null);
  const [participation, setParticipation] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (user && huntId) {
      fetchHuntData();
    }
  }, [user, huntId]);

  const fetchHuntData = async () => {
    // Fetch hunt details
    const { data: huntData } = await supabase
      .from('treasure_hunts')
      .select('*')
      .eq('id', huntId)
      .single();

    if (huntData) {
      setHunt(huntData);
    }

    // Fetch participation
    const { data: partData } = await supabase
      .from('treasure_hunt_participants')
      .select('*')
      .eq('hunt_id', huntId)
      .eq('user_id', user?.id)
      .single();

    if (partData) {
      setParticipation(partData);
      fetchCurrentClue(partData.current_clue);
    }
  };

  const fetchCurrentClue = async (clueNumber: number) => {
    const { data } = await supabase
      .from('treasure_hunt_clues')
      .select('*')
      .eq('hunt_id', huntId)
      .eq('clue_number', clueNumber)
      .single();

    if (data) {
      setCurrentClue(data);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Enter an answer",
        description: "Please provide your answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Check if answer is correct (case-insensitive)
    const isCorrect = userAnswer.toLowerCase().trim() === currentClue.correct_answer.toLowerCase().trim();

    // Record answer
    await supabase.from('treasure_hunt_answers').insert({
      hunt_id: huntId,
      user_id: user?.id,
      clue_id: currentClue.id,
      user_answer: userAnswer,
      is_correct: isCorrect,
    });

    if (isCorrect) {
      const nextClue = participation.current_clue + 1;
      
      // Check if this was the last clue
      if (nextClue > hunt.total_clues) {
        const completionTime = Math.floor((Date.now() - startTime) / 1000);
        
        // Complete the hunt
        await supabase
          .from('treasure_hunt_participants')
          .update({
            completed_at: new Date().toISOString(),
            completion_time_seconds: completionTime,
          })
          .eq('id', participation.id);

        toast({
          title: "🎉 Hunt Complete!",
          description: `You solved it in ${Math.floor(completionTime / 60)} minutes!`,
        });

        // Show biblical conclusion
        setParticipation({ ...participation, completed_at: new Date() });
      } else {
        // Move to next clue
        await supabase
          .from('treasure_hunt_participants')
          .update({ current_clue: nextClue })
          .eq('id', participation.id);

        setParticipation({ ...participation, current_clue: nextClue });
        fetchCurrentClue(nextClue);
        setUserAnswer("");
        
        toast({
          title: "Correct!",
          description: "Moving to next clue...",
        });
      }
    } else {
      toast({
        title: "Not quite",
        description: "Try again! Read the hint carefully.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  if (!hunt || !currentClue || !participation) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p>Loading treasure hunt...</p>
        </div>
      </div>
    );
  }

  if (participation.completed_at) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border-yellow-500 border-2">
              <CardHeader className="text-center">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">Hunt Complete!</CardTitle>
                <CardDescription>
                  Completion Time: {Math.floor((participation.completion_time_seconds || 0) / 60)} minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Jeeves's Biblical Conclusion:</h3>
                  <p className="text-muted-foreground leading-relaxed">{hunt.biblical_conclusion}</p>
                </div>
                <Button onClick={() => navigate('/treasure-hunt')} className="w-full">
                  Back to Treasure Hunts
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{hunt.title}</span>
                <Badge>{hunt.difficulty}</Badge>
              </CardTitle>
              <CardDescription>
                Clue {participation.current_clue} of {hunt.total_clues}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(participation.current_clue / hunt.total_clues) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Clue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Clue #{participation.current_clue}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">Room: {currentClue.room_tag}</Badge>
                  <Badge variant="outline">Principle: {currentClue.principle}</Badge>
                </div>
                <p className="text-lg leading-relaxed">{currentClue.hint}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Answer:</label>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your conclusion..."
                  onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                  disabled={loading}
                />
              </div>

              <Button
                onClick={submitAnswer}
                disabled={loading || !userAnswer.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? "Checking..." : "Submit Answer"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TreasureHuntPlay;