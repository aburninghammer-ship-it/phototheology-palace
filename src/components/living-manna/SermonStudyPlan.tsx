import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Calendar,
  Flame,
  Users,
  Sparkles,
  Clock,
  CheckCircle2,
  Loader2,
  Download,
  Share2,
} from "lucide-react";
import { SermonDeepDiveData, SermonSegment, SermonInsight } from "@/hooks/useSermonDeepDive";
import { toast } from "sonner";

interface SermonStudyPlanProps {
  data: SermonDeepDiveData;
}

interface StudyPlanType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  days: number;
  badge?: string;
}

const STUDY_PLAN_TYPES: StudyPlanType[] = [
  {
    id: "quick_3day",
    name: "3-Day Quick Study",
    description: "Perfect for busy weeks - hit the key points in 15 minutes per day",
    icon: <Clock className="h-5 w-5" />,
    days: 3,
    badge: "Quick",
  },
  {
    id: "weekly_7day",
    name: "7-Day Deep Study",
    description: "Comprehensive personal study covering all sermon themes",
    icon: <BookOpen className="h-5 w-5" />,
    days: 7,
    badge: "Recommended",
  },
  {
    id: "house_fire_single",
    name: "House Fire Session",
    description: "Ready-to-use small group study for your House Fire",
    icon: <Flame className="h-5 w-5" />,
    days: 1,
  },
  {
    id: "house_fire_series",
    name: "4-Week House Fire Series",
    description: "Multi-week curriculum diving deep into sermon themes",
    icon: <Users className="h-5 w-5" />,
    days: 28,
  },
];

export function SermonStudyPlan({ data }: SermonStudyPlanProps) {
  const [selectedType, setSelectedType] = useState<string>("weekly_7day");
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { sermon, segments, scriptures, insights } = data;

  // Get the selected plan type
  const selectedPlanType = STUDY_PLAN_TYPES.find(t => t.id === selectedType);

  // Generate a simple study plan based on available data
  const generateStudyPlan = async () => {
    setGenerating(true);

    try {
      // Simulate generating a study plan from the sermon data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Group insights by type
      const beatInsights = insights.filter(i => i.insight_type === "sermon_beat");
      const themeInsights = insights.filter(i => i.insight_type?.includes("theme"));
      const questionInsights = insights.filter(i => i.insight_type?.includes("question"));

      // Create study plan structure based on type
      let plan: any = {
        title: `Study Plan: ${sermon.title}`,
        type: selectedType,
        speaker: sermon.speaker,
        totalDays: selectedPlanType?.days || 7,
        days: [],
      };

      if (selectedType === "quick_3day") {
        // 3-Day Quick Study
        plan.days = [
          {
            day: 1,
            title: "Understanding the Message",
            focus: beatInsights.slice(0, 3).map(b => b.content?.substring(0, 50) || b.content),
            scriptures: scriptures.slice(0, 5).map(s => s.reference),
            questions: questionInsights.slice(0, 2).map(q => q.content),
          },
          {
            day: 2,
            title: "Going Deeper",
            focus: beatInsights.slice(3, 6).map(b => b.content?.substring(0, 50) || b.content),
            scriptures: scriptures.slice(5, 10).map(s => s.reference),
            questions: questionInsights.slice(2, 4).map(q => q.content),
          },
          {
            day: 3,
            title: "Personal Application",
            focus: themeInsights.map(t => t.content),
            scriptures: scriptures.slice(10, 15).map(s => s.reference),
            questions: questionInsights.filter(q => q.insight_type === "question_decision").map(q => q.content),
          },
        ];
      } else if (selectedType === "weekly_7day") {
        // 7-Day Deep Study
        const daysCount = 7;
        const beatsPerDay = Math.ceil(beatInsights.length / daysCount);
        const scripturesPerDay = Math.ceil(scriptures.length / daysCount);
        const questionsPerDay = Math.ceil(questionInsights.length / daysCount);

        for (let i = 0; i < daysCount; i++) {
          const dayBeats = beatInsights.slice(i * beatsPerDay, (i + 1) * beatsPerDay);
          const dayScriptures = scriptures.slice(i * scripturesPerDay, (i + 1) * scripturesPerDay);
          const dayQuestions = questionInsights.slice(i * questionsPerDay, (i + 1) * questionsPerDay);

          plan.days.push({
            day: i + 1,
            title: i === 0 ? "Introduction & Context" :
                   i === daysCount - 1 ? "Application & Commitment" :
                   `Day ${i + 1}: ${dayBeats[0]?.content?.substring(0, 30) || "Continued Study"}`,
            focus: dayBeats.map(b => b.content?.substring(0, 50) || b.content),
            scriptures: dayScriptures.map(s => s.reference),
            questions: dayQuestions.map(q => q.content),
          });
        }
      } else if (selectedType === "house_fire_single") {
        // Single House Fire session
        plan.days = [{
          session: 1,
          title: sermon.title,
          icebreaker: "What is one thing that stood out to you from Sabbath's sermon?",
          mainPoints: beatInsights.slice(0, 4).map(b => ({
            point: b.content?.substring(0, 50) || b.content,
            scripture: scriptures[0]?.reference,
          })),
          discussionQuestions: questionInsights
            .filter(q => q.insight_type === "question_discussion")
            .slice(0, 5)
            .map(q => q.content),
          application: questionInsights
            .filter(q => q.insight_type === "question_decision")
            .slice(0, 2)
            .map(q => q.content),
          prayerFocus: themeInsights[0]?.content || "Personal growth and application of this message",
        }];
      } else {
        // 4-Week House Fire Series
        const weeks = 4;
        const beatsPerWeek = Math.ceil(beatInsights.length / weeks);
        const themesPerWeek = Math.ceil(themeInsights.length / weeks);

        for (let i = 0; i < weeks; i++) {
          const weekBeats = beatInsights.slice(i * beatsPerWeek, (i + 1) * beatsPerWeek);
          const weekThemes = themeInsights.slice(i * themesPerWeek, (i + 1) * themesPerWeek);
          const weekScriptures = scriptures.slice(i * 4, (i + 1) * 4);
          const weekQuestions = questionInsights.slice(i * 4, (i + 1) * 4);

          plan.days.push({
            week: i + 1,
            title: weekThemes[0]?.content?.substring(0, 40) || `Week ${i + 1}`,
            theme: weekThemes[0]?.content,
            mainPoints: weekBeats.map(b => b.content?.substring(0, 50) || b.content),
            scriptures: weekScriptures.map(s => s.reference),
            discussionQuestions: weekQuestions.map(q => q.content),
          });
        }
      }

      setGeneratedPlan(plan);
      toast.success("Study plan generated!");
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast.error("Failed to generate study plan");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Create Study Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create Study Plan</DialogTitle>
          <DialogDescription>
            Generate a structured study plan from "{sermon.title}"
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {!generatedPlan ? (
            <div className="space-y-6">
              {/* Plan Type Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Study Format</Label>
                <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                  <div className="grid gap-3">
                    {STUDY_PLAN_TYPES.map((type) => (
                      <div key={type.id} className="relative">
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.id}
                          className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{type.name}</span>
                              {type.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {type.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {type.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Calendar className="h-3 w-3" />
                              {type.days === 1 ? "Single session" : `${type.days} days`}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateStudyPlan}
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {selectedPlanType?.name}
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Generated Plan Preview
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{generatedPlan.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlanType?.name} • {generatedPlan.totalDays} {generatedPlan.totalDays === 1 ? "session" : "days"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGeneratedPlan(null)}
                >
                  Change Format
                </Button>
              </div>

              {/* Plan Days/Sessions */}
              <div className="space-y-4">
                {generatedPlan.days.map((day: any, idx: number) => (
                  <Card key={idx}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {day.week ? `Week ${day.week}` : day.session ? `Session ${day.session}` : `Day ${day.day}`}: {day.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 space-y-3">
                      {day.focus?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Focus</p>
                          <ul className="text-sm space-y-1">
                            {day.focus.slice(0, 3).map((f: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {day.scriptures?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Scriptures</p>
                          <div className="flex flex-wrap gap-1">
                            {day.scriptures.slice(0, 5).map((s: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {day.questions?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Questions</p>
                          <ul className="text-sm space-y-1">
                            {day.questions.slice(0, 2).map((q: string, i: number) => (
                              <li key={i} className="text-muted-foreground">{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with House Fire
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
