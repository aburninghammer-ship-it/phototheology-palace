import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Lightbulb, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface Clue {
  clue_number: number;
  hint: string;
  clue_type: 'theme' | 'room' | 'principle' | 'verse';
  correct_answers: string[];
  explanation: string;
}

interface TreasureHunt {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  time_limit_hours: number;
  final_verse: string;
  final_verse_text: string;
  biblical_conclusion: string;
  clues: Clue[];
}

interface Participation {
  id: string;
  current_clue_number: number;
  clues_completed: any[];
  started_at: string;
  completed_at: string | null;
  time_elapsed_seconds: number | null;
  is_completed: boolean;
  total_attempts: number;
}

const TreasureHuntPlay = () => {
  const { huntId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [hunt, setHunt] = useState<TreasureHunt | null>(null);
  const [participation, setParticipation] = useState<Participation | null>(null);
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (user && huntId) {
      fetchHuntData();
    }
  }, [user, huntId]);

  const fetchHuntData = async () => {
    try {
      const { data: huntData, error: huntError } = await supabase
        .from('treasure_hunts')
        .select('*')
        .eq('id', huntId)
        .single();

      if (huntError) throw huntError;
      const typedHuntData = huntData as unknown as TreasureHunt;
      setHunt(typedHuntData);

      const { data: participationData, error: participationError } = await supabase
        .from('treasure_hunt_participations')
        .select('*')
        .eq('hunt_id', huntId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (participationError) throw participationError;

      if (participationData) {
        const typedParticipationData = participationData as unknown as Participation;
        setParticipation(typedParticipationData);
        const clueIndex = typedParticipationData.current_clue_number - 1;
        setCurrentClue(typedHuntData.clues[clueIndex] || null);
      }
    } catch (error) {
      console.error('Error fetching hunt data:', error);
      toast({
        title: "Error",
        description: "Failed to load treasure hunt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeAnswer = (answer: string): string => {
    return answer
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  };

  const checkAnswer = (userAnswer: string, correctAnswers: string[]): boolean => {
    const normalized = normalizeAnswer(userAnswer);
    return correctAnswers.some(correct => 
      normalizeAnswer(correct) === normalized ||
      normalized.includes(normalizeAnswer(correct)) ||
      normalizeAnswer(correct).includes(normalized)
    );
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !participation || !hunt || !currentClue) return;

    setSubmitting(true);
    try {
      const isCorrect = checkAnswer(userAnswer, currentClue.correct_answers);

      if (isCorrect) {
        const updatedCompleted = [
          ...participation.clues_completed,
          {
            clue_number: currentClue.clue_number,
            answer: userAnswer,
            correct: true,
            timestamp: new Date().toISOString()
          }
        ];

        const isLastClue = currentClue.clue_number === hunt.clues.length;
        
        if (isLastClue) {
          const timeElapsed = Math.floor((new Date().getTime() - new Date(participation.started_at).getTime()) / 1000);
          
          await supabase
            .from('treasure_hunt_participations')
            .update({
              is_completed: true,
              completed_at: new Date().toISOString(),
              time_elapsed_seconds: timeElapsed,
              clues_completed: updatedCompleted
            })
            .eq('id', participation.id);

          toast({
            title: "🎉 Hunt Completed!",
            description: "You found the treasure verse!",
          });
          fetchHuntData();
        } else {
          await supabase
            .from('treasure_hunt_participations')
            .update({
              current_clue_number: currentClue.clue_number + 1,
              clues_completed: updatedCompleted,
              total_attempts: participation.total_attempts + 1
            })
            .eq('id', participation.id);

          toast({
            title: "✓ Correct!",
            description: currentClue.explanation,
          });
          setUserAnswer("");
          setShowHint(false);
          fetchHuntData();
        }
      } else {
        await supabase
          .from('treasure_hunt_participations')
          .update({
            total_attempts: participation.total_attempts + 1
          })
          .eq('id', participation.id);

        toast({
          title: "Not quite",
          description: "Try again or view the hint for guidance.",
          variant: "destructive",
        });
        setShowHint(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getClueTypeLabel = (type: string) => {
    const labels = {
      theme: 'Theme/Concept',
      room: 'Palace Room',
      principle: 'Biblical Principle',
      verse: 'Scripture Reference'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getClueTypeIcon = (type: string) => {
    switch (type) {
      case 'theme': return '🎯';
      case 'room': return '🏛️';
      case 'principle': return '💡';
      case 'verse': return '📖';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <Sparkles className="h-12 w-12 animate-pulse text-primary" />
        </div>
      </div>
    );
  }

  if (!hunt || !participation) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Hunt Not Found</CardTitle>
              <CardDescription>This treasure hunt doesn't exist or you haven't joined it yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/treasure-hunt')} className="w-full">
                Back to Treasure Hunts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (participation.is_completed) {
    const minutes = Math.floor((participation.time_elapsed_seconds || 0) / 60);
    const seconds = (participation.time_elapsed_seconds || 0) % 60;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-primary/50">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Treasure Found!</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    You've completed {hunt.title}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Completion Time</p>
                  <p className="text-2xl font-bold">{minutes}m {seconds}s</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getClueTypeIcon('verse')} Final Verse</Badge>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-primary">{hunt.final_verse}</p>
                    <p className="text-sm italic">{hunt.final_verse_text}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Biblical Insight
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {hunt.biblical_conclusion}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => navigate('/treasure-hunt')} className="flex-1">
                    More Hunts
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                    Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const progress = ((currentClue?.clue_number || 1) / hunt.clues.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{hunt.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <Badge>{hunt.difficulty}</Badge>
                    <span>{hunt.category}</span>
                  </CardDescription>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    Clue {currentClue?.clue_number} of {hunt.clues.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {currentClue && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getClueTypeIcon(currentClue.clue_type)}</span>
                  <div>
                    <CardTitle>Clue {currentClue.clue_number}</CardTitle>
                    <CardDescription>{getClueTypeLabel(currentClue.clue_type)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary/50 p-6 rounded-lg">
                  <p className="text-lg leading-relaxed">{currentClue.hint}</p>
                </div>

                {showHint && (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-semibold text-sm">Hint</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You're looking for: {currentClue.clue_type === 'verse' ? 'A specific Bible verse reference' : 
                      currentClue.clue_type === 'room' ? 'A Palace room name or tag (e.g., SR, TR, PR)' :
                      currentClue.clue_type === 'principle' ? 'A biblical principle or concept' :
                      'A theme or theological concept'}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Answer</label>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                      placeholder={
                        currentClue.clue_type === 'verse' ? 'e.g., John 3:16' :
                        currentClue.clue_type === 'room' ? 'e.g., Symbol Room or SR' :
                        'Type your answer...'
                      }
                      disabled={submitting}
                      className="text-lg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Checking...' : 'Submit Answer'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {!showHint && (
                      <Button
                        variant="outline"
                        onClick={() => setShowHint(true)}
                      >
                        <Lightbulb className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {participation.clues_completed.length > 0 && (
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Completed Clues
                    </h4>
                    <div className="space-y-2">
                      {participation.clues_completed.map((completed: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Clue {completed.clue_number}: {completed.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TreasureHuntPlay;
