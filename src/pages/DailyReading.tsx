import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DailyReading() {
  const { userProgress, loading } = useReadingPlans();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);

  // Mock daily reading content (this would come from the plan's schedule)
  const todaysReading = {
    passages: [
      { book: "Genesis", chapter: 1, verses: "1-31" },
      { book: "Psalm", chapter: 1, verses: "1-6" },
      { book: "Matthew", chapter: 1, verses: "1-25" },
    ],
    floors: [1, 2, 3], // Story Room, Observation Room, Freestyle
    floorExercises: {
      1: "Visualize creation as a movie scene. What images come to mind?",
      2: "List 10 observations from Genesis 1. What patterns emerge?",
      3: "Connect today's passages to something in nature you saw this week.",
    }
  };

  const handleCompleteDay = async () => {
    if (!userProgress) return;
    
    setCompleting(true);
    try {
      // Record completion
      await supabase
        .from("daily_reading_completions")
        .insert({
          user_progress_id: userProgress.id,
          day_number: userProgress.current_day,
          floors_completed: todaysReading.floors.map(String),
        });

      // Update progress to next day
      const nextDay = userProgress.current_day + 1;
      await supabase
        .from("user_reading_progress")
        .update({ current_day: nextDay })
        .eq("id", userProgress.id);

      toast({
        title: "Day Complete!",
        description: `Moving to day ${nextDay}`,
      });

      // Reload the page to show next day
      window.location.reload();
    } catch (error) {
      console.error("Error completing day:", error);
      toast({
        title: "Error",
        description: "Failed to complete today's reading",
        variant: "destructive",
      });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              No Active Reading Plan
            </h2>
            <p className="text-muted-foreground mb-6">
              Start a reading plan to begin your guided Bible journey
            </p>
            <Button onClick={() => navigate("/reading-plans")}>
              <Book className="h-4 w-4 mr-2" />
              Browse Reading Plans
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercent = (userProgress.current_day / 365) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Day {userProgress.current_day}
              </h2>
              <p className="text-muted-foreground">
                Your daily reading assignment
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-lg font-bold text-primary">
                {Math.round(progressPercent)}%
              </p>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </Card>

        {/* Today's Passages */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
            <Book className="h-5 w-5 mr-2 text-primary" />
            Today's Passages
          </h3>
          <div className="space-y-3">
            {todaysReading.passages.map((passage, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/bible/${passage.book}/${passage.chapter}`)}
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {passage.book} {passage.chapter}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verses {passage.verses}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            ))}
          </div>
        </Card>

        {/* Palace Floor Exercises */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-foreground">
            Palace Floor Exercises
          </h3>
          <div className="space-y-4">
            {Object.entries(todaysReading.floorExercises).map(([floor, exercise]) => (
              <div key={floor} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-semibold text-primary mb-2">
                  Floor {floor} Exercise
                </p>
                <p className="text-sm text-muted-foreground">{exercise}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Complete Button */}
        <Button 
          onClick={handleCompleteDay}
          disabled={completing}
          size="lg"
          className="w-full"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          {completing ? "Completing..." : "Complete Today's Reading"}
        </Button>
      </div>
    </div>
  );
}
