import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, CheckCircle, ArrowRight, Building2, Eye, Lightbulb, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
    floors: [
      { number: 1, name: "Furnishing Floor", icon: Building2, rooms: ["Story Room (SR)", "Imagination Room (IR)", "Translation Room (TR)"] },
      { number: 2, name: "Investigation Floor", icon: Eye, rooms: ["Observation Room (OR)", "Def-Com Room (DC)", "Questions Room (QR)"] },
      { number: 3, name: "Freestyle Floor", icon: Sparkles, rooms: ["Nature Freestyle (NF)", "Personal Freestyle (PF)", "Bible Freestyle (BF)"] },
      { number: 4, name: "Next Level Floor", icon: Target, rooms: ["Concentration Room (CR)", "Dimensions Room (DR)", "Theme Room (TRm)"] },
    ],
    floorExercises: {
      1: {
        title: "Story Room (SR) + Imagination Room (IR)",
        prompt: "Visualize Genesis 1 as a movie. Picture light breaking darkness, waters parting, land appearing. Step inside the scene—what do you see, hear, smell?",
        questions: ["What images come to mind?", "How would you describe each day of creation visually?"]
      },
      2: {
        title: "Observation Room (OR)",
        prompt: "List 15 observations from Genesis 1. Notice details: repetition of phrases, order of creation, God's words vs. actions.",
        questions: ["What patterns emerge?", "What surprises you?", "What's repeated?"]
      },
      3: {
        title: "Nature Freestyle (NF) + Personal Freestyle (PF)",
        prompt: "Connect today's passages to something in nature you saw this week. How does creation around you testify to Genesis 1?",
        questions: ["What connections emerge?", "How does your life mirror creation themes?"]
      },
      4: {
        title: "Concentration Room (CR)",
        prompt: "Where is Christ in Genesis 1? (Hint: John 1:1-3, Col 1:16, Heb 1:2) Find Christ as Creator.",
        questions: ["How does this passage point to Jesus?", "What does it reveal about Him?"]
      }
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
          floors_completed: todaysReading.floors.map(f => String(f.number)),
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
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Palace Floor Exercises</h3>
          </div>
          
          <Tabs defaultValue="floor-1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {todaysReading.floors.map((floor) => {
                const FloorIcon = floor.icon;
                return (
                  <TabsTrigger key={floor.number} value={`floor-${floor.number}`} className="flex flex-col items-center gap-1 py-3">
                    <FloorIcon className="h-4 w-4" />
                    <span className="text-xs">Floor {floor.number}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {todaysReading.floors.map((floor) => {
              const FloorIcon = floor.icon;
              const exercise = todaysReading.floorExercises[floor.number];
              
              return (
                <TabsContent key={floor.number} value={`floor-${floor.number}`} className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <FloorIcon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">{floor.name}</h4>
                        <Badge variant="outline" className="text-xs">Floor {floor.number}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Rooms: {floor.rooms.join(" • ")}
                      </p>
                    </div>
                  </div>

                  <Card className="p-5 bg-background/50">
                    <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-accent" />
                      {exercise.title}
                    </h5>
                    <p className="text-muted-foreground mb-4">{exercise.prompt}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Guiding Questions:</p>
                      <ul className="space-y-1">
                        {exercise.questions.map((q, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
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
