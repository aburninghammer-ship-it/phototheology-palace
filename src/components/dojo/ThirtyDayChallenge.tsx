import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, CheckCircle2, Circle, Trophy, ArrowLeft } from "lucide-react";
import { THIRTY_DAY_CHALLENGES, DayChallenge, CHALLENGE_TYPES } from "@/data/dojoCharacterChallenges";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChallengeProgress {
  day_number: number;
  completed_at: string;
  reflection: string;
}

export const ThirtyDayChallenge = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [reflection, setReflection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedChallenge && userId) {
      fetchProgress();
    }
  }, [selectedChallenge, userId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const fetchProgress = async () => {
    if (!userId || !selectedChallenge) return;

    const { data, error } = await supabase
      .from('dojo_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', selectedChallenge)
      .order('day_number');

    if (!error && data) {
      setProgress(data);
      
      // Find next incomplete day
      const completedDays = data.map(p => p.day_number);
      const nextDay = Array.from({ length: 30 }, (_, i) => i + 1)
        .find(day => !completedDays.includes(day)) || 30;
      setCurrentDay(nextDay);
    }
  };

  const handleCompleteDay = async () => {
    if (!userId || !selectedChallenge) {
      toast.error("Please log in to track your progress");
      return;
    }

    if (!reflection.trim()) {
      toast.error("Please add a reflection before completing");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('dojo_challenges')
        .insert({
          user_id: userId,
          challenge_type: selectedChallenge,
          day_number: currentDay,
          completed_at: new Date().toISOString(),
          reflection: reflection
        });

      if (error) throw error;

      toast.success(`Day ${currentDay} completed! 🎉`);
      setReflection("");
      
      // Update progress and move to next day
      await fetchProgress();
      
      if (currentDay === 30) {
        toast.success("🏆 Challenge Complete! You are a mighty warrior!", { duration: 5000 });
      }
    } catch (error) {
      console.error("Error completing day:", error);
      toast.error("Failed to save progress");
    } finally {
      setIsLoading(false);
    }
  };

  const completedDays = progress.length;
  const progressPercent = (completedDays / 30) * 100;
  const currentDayData = THIRTY_DAY_CHALLENGES[currentDay - 1];

  if (!selectedChallenge) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">30-Day Character Challenges</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a 30-day journey to develop Christ-like character through daily acts of kindness, grace, forgiveness, and self-control.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CHALLENGE_TYPES.map((challenge) => (
            <Card 
              key={challenge.id}
              className="border-2 hover:border-primary cursor-pointer transition-all hover:shadow-lg"
              onClick={() => setSelectedChallenge(challenge.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${challenge.color} flex items-center justify-center mb-2`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{challenge.name}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Challenge</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentDayData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Challenge data not found</p>
          <Button onClick={() => setSelectedChallenge(null)}>Back to Challenges</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Day {currentDay} of 30
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed: {completedDays} / 30 days</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
          
          {/* Calendar View */}
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCompleted = progress.some(p => p.day_number === day);
              const isCurrent = day === currentDay;
              
              return (
                <div
                  key={day}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                    ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : day}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Challenge */}
      <Card className="border-primary">
        <CardHeader>
          <div className="space-y-2">
            <Badge className="w-fit">{currentDayData.fruitFocus}</Badge>
            <CardTitle className="text-2xl">{currentDayData.title}</CardTitle>
            <CardDescription className="text-base">{currentDayData.challenge}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Today's Scripture</p>
              <p className="italic">{currentDayData.scripture}</p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Practical Actions (Choose at least one):</p>
              <div className="space-y-2">
                {currentDayData.practicalActions.map((action, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <Circle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Reflection Prompt:</p>
              <p className="text-sm italic text-muted-foreground">{currentDayData.reflectionPrompt}</p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Your Reflection:</p>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How did you practice this today? What did you learn? How did it challenge you?"
                className="min-h-[150px]"
              />
            </div>

            <Button 
              onClick={handleCompleteDay}
              disabled={isLoading || !reflection.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Saving..." : "Complete Day " + currentDay}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completed Days List */}
      {progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Journey So Far</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {progress.map((p) => {
                  const dayData = THIRTY_DAY_CHALLENGES[p.day_number - 1];
                  return (
                    <Card key={p.day_number} className="border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline">Day {p.day_number}</Badge>
                            <p className="font-semibold mt-1">{dayData.title}</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">{p.reflection}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Completed: {new Date(p.completed_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {completedDays === 30 && (
        <Card className="border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="w-12 h-12 text-amber-500" />
              <div>
                <CardTitle className="text-2xl">Challenge Complete!</CardTitle>
                <CardDescription>You've completed the 30-day journey. You are a mighty warrior!</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};