import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, CheckCircle, ArrowRight, Building2, Eye, Lightbulb, Sparkles, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText } from "lucide-react";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { Textarea } from "@/components/ui/textarea";

type ChapterRef = { book: string; chapter: number };

const getBooksForPlanType = (planType: string, planName: string): string[] => {
  switch (planType) {
    case "full_bible":
      return BIBLE_BOOK_METADATA.map((b) => b.name);
    case "new_testament":
      return BIBLE_BOOK_METADATA.filter((b) => b.position >= 40).map((b) => b.name);
    case "old_testament":
      return BIBLE_BOOK_METADATA.filter((b) => b.position <= 39).map((b) => b.name);
    case "wisdom_books":
      // Current wisdom plan is Psalms & Proverbs
      return ["Psalms", "Proverbs"];
    default:
      return [];
  }
};

const buildChapterList = (books: string[]): ChapterRef[] => {
  const chapters: ChapterRef[] = [];
  for (const bookName of books) {
    const meta = BIBLE_BOOK_METADATA.find((b) => b.name === bookName);
    if (!meta) continue;
    for (let c = 1; c <= meta.chapters; c++) {
      chapters.push({ book: bookName, chapter: c });
    }
  }
  return chapters;
};

const generateSequentialPassagesForPlan = (
  planType: string,
  planName: string,
  durationDays: number,
  dayNumber: number
) => {
  const books = getBooksForPlanType(planType, planName);
  if (!books.length || durationDays <= 0) return [] as any[];

  const allChapters = buildChapterList(books);
  if (!allChapters.length) return [] as any[];

  const chaptersPerDay = Math.ceil(allChapters.length / durationDays);
  const startIndex = (dayNumber - 1) * chaptersPerDay;
  if (startIndex >= allChapters.length) return [] as any[];

  const todaysChapters = allChapters.slice(startIndex, startIndex + chaptersPerDay);
  return todaysChapters.map((ref) => ({
    book: ref.book,
    chapter: ref.chapter,
    verses: "1-end",
  }));
};

export default function DailyReading() {
  const { userProgress, loading, generateExercises } = useReadingPlans();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [todaysPassages, setTodaysPassages] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (userProgress) {
      loadPlanAndExercises();
    }
  }, [userProgress]);

  const loadPlanAndExercises = async () => {
    if (!userProgress) return;

    try {
      // Fetch the plan details
      const { data: planData, error: planError } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('id', userProgress.plan_id)
        .maybeSingle();

      if (planError || !planData) {
        console.error('Error loading plan:', planError);
        toast({
          title: "Error",
          description: "Failed to load reading plan",
          variant: "destructive",
        });
        return;
      }

      setPlan(planData);

      // Extract today's passages from the plan's daily_schedule
      const schedule = planData.daily_schedule as any;
      const dayIndex = userProgress.current_day - 1;
      
      console.log('Plan schedule structure:', schedule);
      console.log('Current day index:', dayIndex);
      
      // Parse passages based on schedule structure
      let passages: any[] = [];
      if (schedule?.chapters && Array.isArray(schedule.chapters)) {
        // For book-monthly plans that already have an explicit chapter list
        const chapterNumber = schedule.chapters[dayIndex];
        if (chapterNumber) {
          passages = [{
            book: schedule.book || planData.name.split(' ')[0],
            chapter: chapterNumber,
            verses: "1-end",
          }];
        }
      } else if (schedule?.daily_readings && Array.isArray(schedule.daily_readings)) {
        // For plans with structured daily readings
        passages = schedule.daily_readings[dayIndex] || [];
      } else if (schedule?.book) {
        // Fallback for simple book-monthly plans that only specify a book and chapters_per_day
        const bookMeta = BIBLE_BOOK_METADATA.find(
          (b) => b.name.toLowerCase() === String(schedule.book).toLowerCase()
        );

        if (bookMeta) {
          const chaptersPerDay = Number(schedule.chapters_per_day) || 1;
          const approxChapter = Math.ceil(userProgress.current_day * chaptersPerDay);
          const chapterNumber = Math.min(approxChapter, bookMeta.chapters);

          passages = [
            {
              book: bookMeta.name,
              chapter: chapterNumber,
              verses: "1-end",
            },
          ];
        }
      }

      // If we still don't have passages, derive them based on plan type
      if (passages.length === 0 && planData.plan_type) {
        passages = generateSequentialPassagesForPlan(
          planData.plan_type,
          planData.name,
          planData.duration_days,
          userProgress.current_day
        );
      }

      console.log('Loaded passages for day', userProgress.current_day, ':', passages);
      
      if (passages.length === 0) {
        console.warn('No passages found for current day. Schedule:', schedule);
        toast({
          title: "No Passages",
          description: "Unable to determine today's reading. Please check your plan.",
          variant: "destructive",
        });
        setTodaysPassages([]);
        setExercises([]);
        return;
      }

      setTodaysPassages(passages);

      // Only generate exercises if we have passages
      const result = await generateExercisesWithPassages(passages, planData.depth_mode, false);
      if (result) {
        setExercises(result);
      }

      // Load existing notes if this day was completed before
      const { data: completionData } = await supabase
        .from('daily_reading_completions')
        .select('notes')
        .eq('user_progress_id', userProgress.id)
        .eq('day_number', userProgress.current_day)
        .maybeSingle();
      
      if (completionData?.notes) {
        setNotes(completionData.notes);
      }
    } catch (error) {
      console.error('Error in loadPlanAndExercises:', error);
      toast({
        title: "Error",
        description: "Failed to load today's reading",
        variant: "destructive",
      });
    }
  };

  const generateExercisesWithPassages = async (passages: any[], depthMode: string, regenerate: boolean) => {
    if (!userProgress) return null;

    // Don't attempt to generate if no passages
    if (!passages || passages.length === 0) {
      console.error('Cannot generate exercises: no passages provided');
      return null;
    }

    try {
      console.log('Calling generate-reading-exercises with:', {
        passages,
        depthMode,
        regenerate
      });

      const { data, error } = await supabase.functions.invoke('generate-reading-exercises', {
        body: {
          userProgressId: userProgress.id,
          dayNumber: userProgress.current_day,
          passages: passages,
          depthMode: depthMode,
          regenerate
        }
      });

      if (error) throw error;
      return data?.exercises || null;
    } catch (error) {
      console.error('Error generating exercises:', error);
      toast({
        title: "Error",
        description: "Failed to generate exercises",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleRegenerateExercises = async () => {
    if (!plan || todaysPassages.length === 0) {
      toast({
        title: "Error",
        description: "Unable to regenerate without passages",
        variant: "destructive",
      });
      return;
    }
    
    setRegenerating(true);
    try {
      const result = await generateExercisesWithPassages(todaysPassages, plan.depth_mode, true);
      if (result) {
        setExercises(result);
        toast({
          title: "Exercises Refreshed!",
          description: "New room combinations generated for today's study",
        });
      }
    } finally {
      setRegenerating(false);
    }
  };


  const handleCompleteDay = async () => {
    if (!userProgress) return;
    
    setCompleting(true);
    try {
      // Record completion with notes
      await supabase
        .from("daily_reading_completions")
        .insert({
          user_progress_id: userProgress.id,
          day_number: userProgress.current_day,
          floors_completed: exercises.map(e => String(e.floorNumber)),
          notes: notes.trim() || null,
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
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
              {plan && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {plan.name}
                  </p>
                  {userProgress.preferred_translation && (
                    <Badge variant="outline" className="text-xs">
                      {BIBLE_TRANSLATIONS.find(t => t.value === userProgress.preferred_translation)?.label.split('(')[1]?.replace(')', '') || userProgress.preferred_translation.toUpperCase()}
                    </Badge>
                  )}
                </div>
              )}
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
          {todaysPassages.length > 0 ? (
            <div className="space-y-3">
              {todaysPassages.map((passage, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate(`/bible/${passage.book}/${passage.chapter}?t=${userProgress.preferred_translation || 'kjv'}`, {
                    state: { 
                      exercises,
                      fromReadingPlan: true,
                      planName: plan?.name,
                      dayNumber: userProgress.current_day
                    }
                  })}
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
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Loading today's passages...</p>
            </div>
          )}
        </Card>

        {/* Palace Floor Exercises */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Palace Floor Exercises</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateExercises}
              disabled={regenerating || !exercises.length}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Generating...' : 'Regenerate'}
            </Button>
          </div>
          
          {exercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Loading today's exercises...</p>
            </div>
          ) : (
            <Tabs defaultValue={`floor-${exercises[0]?.floorNumber}`} className="w-full">
              <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${exercises.length}, minmax(0, 1fr))` }}>
                {exercises.map((exercise) => (
                  <TabsTrigger 
                    key={exercise.floorNumber} 
                    value={`floor-${exercise.floorNumber}`} 
                    className="flex flex-col items-center gap-1 py-3"
                  >
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs">Floor {exercise.floorNumber}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {exercises.map((exercise) => (
                <TabsContent key={exercise.floorNumber} value={`floor-${exercise.floorNumber}`} className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <Building2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-foreground">{exercise.floorName}</h4>
                        <Badge variant="outline" className="text-xs">Floor {exercise.floorNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Rooms: {exercise.rooms && Array.isArray(exercise.rooms) ? exercise.rooms.join(" • ") : "Various rooms"}
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
                      <ul className="space-y-2">
                        {exercise.questions?.map((q: string, qIdx: number) => (
                          <li key={qIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </Card>

        {/* Notes Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Personal Notes & Reflections
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Record your insights, questions, and reflections from today's reading
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What stood out to you today? Any new insights or connections with Christ?"
            className="min-h-[150px] resize-y"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Your notes will be saved when you complete today's reading
          </p>
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
