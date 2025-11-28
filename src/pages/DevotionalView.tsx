import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, BookOpen, Sparkles, Heart, MessageSquare, Star, Loader2, Share2, Wand2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDevotionalPlan, useDevotionals } from "@/hooks/useDevotionals";
import { ShareDevotionalDialog } from "@/components/devotionals/ShareDevotionalDialog";
import { cn } from "@/lib/utils";

const formatGradients: Record<string, string> = {
  standard: "from-blue-500 via-cyan-500 to-teal-500",
  "24fps": "from-purple-500 via-pink-500 to-rose-500",
  blueprint: "from-amber-500 via-orange-500 to-red-500",
  "room-driven": "from-emerald-500 via-teal-500 to-cyan-500",
  "verse-genetics": "from-rose-500 via-pink-500 to-purple-500",
};

export default function DevotionalView() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plan, days, completedDayIds, completeDay, planLoading, isCompleting } = useDevotionalPlan(planId || "");
  const { generateDevotional, isGenerating } = useDevotionals();

  const { toast } = useToast();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [rating, setRating] = useState(0);

  const handleCrossReferenceClick = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast({
      title: "Reference Copied",
      description: `"${ref}" copied to clipboard`,
    });
  };

  const handleGenerate = () => {
    if (!plan) return;
    generateDevotional.mutate({
      planId: plan.id,
      theme: plan.theme,
      format: plan.format,
      duration: plan.duration,
      studyStyle: plan.study_style || "balanced",
    });
  };

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your devotional...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Devotional Not Found</h2>
          <p className="text-muted-foreground mb-4">This devotional may have been deleted or doesn't exist.</p>
          <Button onClick={() => navigate("/devotionals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devotionals
          </Button>
        </div>
      </div>
    );
  }

  // Show generate UI for draft/generating plans
  if (plan.status === "draft" || plan.status === "generating" || !days || days.length === 0) {
    const gradient = formatGradients[plan.format] || formatGradients.standard;
    return (
      <div className="min-h-screen bg-background">
        <div className={`relative bg-gradient-to-r ${gradient} py-6 px-4`}>
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/devotionals")} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-white text-lg">{plan.title}</h1>
                <p className="text-white/80 text-sm">{plan.theme}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-2 border-dashed border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="py-12 text-center">
              {isGenerating || plan.status === "generating" ? (
                <>
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-xl animate-pulse">
                    <Sparkles className="h-10 w-10 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Generating Your Devotional...
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Jeeves is crafting {plan.duration} days of Christ-centered content. This may take a minute.
                  </p>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mb-6 shadow-xl">
                    <Wand2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Ready to Generate
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your devotional plan is set up. Click below to have Jeeves generate {plan.duration} days of personalized, Christ-centered content.
                  </p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-center gap-2 text-sm">
                      <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                        {plan.duration} Days
                      </Badge>
                      <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                        {plan.format} Format
                      </Badge>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Devotional
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentDay = days?.[selectedDayIndex];
  const isCompleted = currentDay ? completedDayIds.has(currentDay.id) : false;
  const gradient = formatGradients[plan.format] || formatGradients.standard;

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
      {/* Colorful Header */}
      <div className={`relative bg-gradient-to-r ${gradient} py-6 px-4`}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/devotionals")} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-white text-lg truncate max-w-[200px] md:max-w-none">{plan.title}</h1>
                <p className="text-white/80 text-sm">Day {selectedDayIndex + 1} of {plan.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {plan && currentDay && (
                <ShareDevotionalDialog 
                  plan={plan} 
                  day={currentDay}
                  trigger={
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  }
                />
              )}
              <Button variant="ghost" size="icon" onClick={goToPrevDay} disabled={selectedDayIndex === 0} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextDay} disabled={selectedDayIndex === (days?.length || 1) - 1} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Day Progress - Colorful Pills */}
      <div className="bg-background/95 backdrop-blur border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {days?.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={cn(
                    "w-10 h-10 rounded-full text-xs font-bold flex-shrink-0 transition-all shadow-md",
                    idx === selectedDayIndex
                      ? `bg-gradient-to-br ${gradient} text-white scale-110`
                      : completedDayIds.has(day.id)
                      ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white"
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
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-2 flex-wrap">
              {currentDay.room_assignment && (
                <Badge className={`bg-gradient-to-r ${gradient} text-white border-0`}>
                  {currentDay.room_assignment}
                </Badge>
              )}
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                Floor {currentDay.floor_number}
              </Badge>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              {currentDay.title}
            </h2>
          </div>

          {/* Scripture Card - Vibrant */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <BookOpen className="h-5 w-5" />
                {currentDay.scripture_reference}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pt-0">
              <p className="text-xl italic leading-relaxed text-indigo-900 dark:text-indigo-100 font-serif">
                "{currentDay.scripture_text}"
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="devotion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 relative z-10">
              <TabsTrigger value="devotion" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                💡 Devotion
              </TabsTrigger>
              <TabsTrigger value="practice" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                🎯 Practice
              </TabsTrigger>
              <TabsTrigger value="journal" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                📝 Journal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="devotion" className="space-y-4 mt-4">
              {/* Visual Imagery */}
              {currentDay.visual_imagery && (
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Mental Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-900 dark:text-purple-100 leading-relaxed">{currentDay.visual_imagery}</p>
                  </CardContent>
                </Card>
              )}

              {/* Memory Hook */}
              {currentDay.memory_hook && (
                <Card className="border-0 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white shadow-lg">
                  <CardContent className="py-4">
                    <p className="font-bold text-lg">
                      🔗 {currentDay.memory_hook}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Application */}
              {currentDay.application && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">📌 Today's Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-900 dark:text-emerald-100">{currentDay.application}</p>
                  </CardContent>
                </Card>
              )}

              {/* Christ Connection - Always Prominent */}
              <Card className="border-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 text-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-6 w-6 fill-white" />
                    Christ Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-lg leading-relaxed font-medium">{currentDay.christ_connection}</p>
                </CardContent>
              </Card>

              {/* Cross References */}
              {currentDay.cross_references && currentDay.cross_references.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">📖 Cross References</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentDay.cross_references.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCrossReferenceClick(ref)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800 dark:hover:to-cyan-800 transition-all cursor-pointer active:scale-95"
                      >
                        {ref}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-4 mt-4">
              {/* Prayer */}
              {currentDay.prayer && (
                <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-indigo-700 dark:text-indigo-300">🙏 Prayer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-indigo-900 dark:text-indigo-100">{currentDay.prayer}</p>
                  </CardContent>
                </Card>
              )}

              {/* Challenge */}
              {currentDay.challenge && (
                <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      ⚡ Today's Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{currentDay.challenge}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="journal" className="space-y-4 mt-4">
              {/* Journal Prompt */}
              {currentDay.journal_prompt && (
                <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-pink-700 dark:text-pink-300">
                      <MessageSquare className="h-4 w-4" />
                      Reflection Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-pink-900 dark:text-pink-100 font-medium">{currentDay.journal_prompt}</p>
                    <Textarea
                      placeholder="Write your reflection..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-[120px] border-pink-200 dark:border-pink-800 focus:ring-pink-500"
                      disabled={isCompleted}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Rating */}
              {!isCompleted && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-700 dark:text-amber-300">⭐ Rate Today's Devotion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            star <= rating 
                              ? "text-amber-500 bg-amber-100 dark:bg-amber-900 scale-110" 
                              : "text-gray-300 hover:text-amber-400"
                          )}
                        >
                          <Star className={cn("h-8 w-8", star <= rating && "fill-current")} />
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
            <Button 
              className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-xl`}
              size="lg" 
              onClick={handleComplete} 
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Complete Day {selectedDayIndex + 1}
                </>
              )}
            </Button>
          ) : (
            <div className="text-center py-4">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-lg py-2 px-4">
                <Check className="h-4 w-4 mr-2" />
                Day Completed! 🎉
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
