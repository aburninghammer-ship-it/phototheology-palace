import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, BookOpen, Sparkles, Heart, MessageSquare, Star, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDevotionalPlan, DevotionalDay } from "@/hooks/useDevotionals";
import { cn } from "@/lib/utils";

export default function DevotionalView() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plan, days, completedDayIds, completeDay, planLoading, isCompleting } = useDevotionalPlan(planId || "");

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [rating, setRating] = useState(0);

  if (planLoading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentDay = days?.[selectedDayIndex];
  const isCompleted = currentDay ? completedDayIds.has(currentDay.id) : false;

  const handleComplete = () => {
    if (!currentDay) return;
    completeDay.mutate({
      dayId: currentDay.id,
      journalEntry: journalEntry || undefined,
      rating: rating || undefined,
    });
    setJournalEntry("");
    setRating(0);
  };

  const goToPrevDay = () => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1));
  const goToNextDay = () => setSelectedDayIndex(Math.min((days?.length || 1) - 1, selectedDayIndex + 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/devotionals")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold truncate max-w-[200px] md:max-w-none">{plan.title}</h1>
              <p className="text-xs text-muted-foreground">Day {selectedDayIndex + 1} of {plan.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevDay} disabled={selectedDayIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextDay} disabled={selectedDayIndex === (days?.length || 1) - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day Progress */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <ScrollArea className="w-full">
            <div className="flex gap-1 pb-2">
              {days?.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium flex-shrink-0 transition-all",
                    idx === selectedDayIndex
                      ? "bg-primary text-primary-foreground"
                      : completedDayIds.has(day.id)
                      ? "bg-emerald-500 text-white"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {completedDayIds.has(day.id) ? <Check className="h-4 w-4 mx-auto" /> : idx + 1}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      {currentDay && (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Day Header */}
          <div className="text-center space-y-2">
            <Badge variant="outline" className="mb-2">
              {currentDay.room_assignment && `${currentDay.room_assignment} • `}Floor {currentDay.floor_number}
            </Badge>
            <h2 className="text-2xl font-bold">{currentDay.title}</h2>
            {currentDay.sanctuary_station && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                🕯️ {currentDay.sanctuary_station}
              </p>
            )}
          </div>

          {/* Scripture */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {currentDay.scripture_reference}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic leading-relaxed">{currentDay.scripture_text}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="devotion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devotion">Devotion</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>

            <TabsContent value="devotion" className="space-y-4 mt-4">
              {/* Visual Imagery */}
              {currentDay.visual_imagery && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <Sparkles className="h-4 w-4" />
                      Mental Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentDay.visual_imagery}</p>
                  </CardContent>
                </Card>
              )}

              {/* Memory Hook */}
              {currentDay.memory_hook && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="py-4">
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      🔗 Memory Hook: {currentDay.memory_hook}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Application */}
              {currentDay.application && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Today's Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentDay.application}</p>
                  </CardContent>
                </Card>
              )}

              {/* Christ Connection */}
              <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-rose-700 dark:text-rose-300">
                    <Heart className="h-4 w-4" />
                    Christ Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rose-900 dark:text-rose-100">{currentDay.christ_connection}</p>
                </CardContent>
              </Card>

              {/* Cross References */}
              {currentDay.cross_references && currentDay.cross_references.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Cross References</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentDay.cross_references.map((ref, idx) => (
                      <Badge key={idx} variant="secondary">{ref}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-4 mt-4">
              {/* Prayer */}
              {currentDay.prayer && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Prayer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic">{currentDay.prayer}</p>
                  </CardContent>
                </Card>
              )}

              {/* Challenge */}
              {currentDay.challenge && (
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
                      Today's Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentDay.challenge}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="journal" className="space-y-4 mt-4">
              {/* Journal Prompt */}
              {currentDay.journal_prompt && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Reflection Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{currentDay.journal_prompt}</p>
                    <Textarea
                      placeholder="Write your reflection..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-[120px]"
                      disabled={isCompleted}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Rating */}
              {!isCompleted && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Rate Today's Devotion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={cn(
                            "p-2 rounded transition-colors",
                            star <= rating ? "text-amber-500" : "text-muted-foreground hover:text-amber-400"
                          )}
                        >
                          <Star className={cn("h-6 w-6", star <= rating && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Complete Button */}
          {!isCompleted ? (
            <Button className="w-full" size="lg" onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Complete Day {selectedDayIndex + 1}
                </>
              )}
            </Button>
          ) : (
            <div className="text-center py-4">
              <Badge className="bg-emerald-500">
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
