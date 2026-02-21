import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, Calendar, Sparkles, Bot, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import {
  Q1_2026_LESSONS,
  Q1_2026_TITLE,
  Q1_2026_SUBTITLE,
  Q1_2026_QUARTER,
  Q1_2026_DESCRIPTION,
  type QuarterlyLessonData,
  type QuarterlyDay,
} from "@/data/quarterlyQ1_2026";

const ROOMS = [
  "Room 1: Story Room (SR)", "Room 2: Imagination Room (IR)", "Room 3: 24FPS Room (24)",
  "Room 4: Bible Rendered (BR)", "Room 5: Translation Room (TR)", "Room 6: Gems Room (GR)",
  "Room 7: Observation Room (OR)", "Room 8: Def-Com Room (DC)", "Room 9: Symbols/Types (ST)",
  "Room 10: Questions Room (QR)", "Room 11: Q&A Chains (QA)",
  "Room 12: Nature Freestyle (NF)", "Room 13: Personal Freestyle (PF)", "Room 14: Bible Freestyle (BF)",
  "Room 15: History Freestyle (HF)", "Room 16: Listening Room (LR)",
  "Room 17: Concentration Room (CR)", "Room 18: Dimensions Room (DR)", "Room 19: Connect-6 (C6)",
  "Room 20: Theme Room (TRm)", "Room 21: Time Zone (TZ)", "Room 22: Patterns Room (PRm)",
  "Room 23: Parallels Room (P\u2016)", "Room 24: Fruit Room (FRt)",
  "Room 25: Blue Room - Sanctuary (BL)", "Room 26: Prophecy Room (PR)", "Room 27: Three Angels (3A)",
  "Room 28: Feasts Room (FE)", "Room 29: Christ in Every Chapter (CEC)", "Room 30: Room 66 (R66)",
  "Room 31: Three Heavens (1H/2H/3H)", "Room 32: Eight Cycles (@)", "Room 33: Juice Room (JR)",
  "Room 34: Fire Room (FRm)", "Room 35: Meditation Room (MR)", "Room 36: Speed Room (SRm)",
  "Room 37: Reflexive Mastery (\u221e)"
];

const PRINCIPLES = [
  "Literal Dimension", "Christ Dimension", "Me Dimension", "Church Dimension", "Heaven Dimension",
  "Repeat and Enlarge", "Chain References", "Christ in All Scripture",
  "Sanctuary Pattern", "Types and Symbols", "Seven Feasts", "Time Zones",
  "Day-Year Principle (DY)", "@2300 (1844 IJ)", "@1260 (Papal Supremacy)",
  "@1844 (Judgment Begins)", "@70 Weeks (Messiah)",
  "Observation Only", "Questions Room Method", "Scripture Answers Scripture",
  "Story Beats (3-7)", "Five Senses Imagination", "Chapter Icons",
  "Great Controversy Wall", "Life of Christ Wall", "Sanctuary Wall",
  "Time-Prophecy Wall", "Gospel Floor", "Heaven Ceiling",
  "Prophecy Genre", "Parable Genre", "Epistle Genre", "History Genre",
  "Nature Parallels", "Personal Testimony", "History Parallels",
  "Gems (2-4 Text Combo)", "Parallels Comparison", "Fruit Test", "Three Angels' Messages"
];

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

interface SabbathSchoolTabProps {
  churchId: string;
}

export function SabbathSchoolTab({ churchId }: SabbathSchoolTabProps) {
  const { toast } = useToast();

  const getCurrentLesson = (): QuarterlyLessonData => {
    const today = new Date();
    const found = Q1_2026_LESSONS.find((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      end.setHours(23, 59, 59);
      return today >= start && today <= end;
    });
    return found || Q1_2026_LESSONS[0];
  };

  const getTodayDayName = (): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const [selectedLesson, setSelectedLesson] = useState<QuarterlyLessonData>(getCurrentLesson);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedPrinciple, setSelectedPrinciple] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [jeevesResponse, setJeevesResponse] = useState<string | null>(null);
  const [generatingStudy, setGeneratingStudy] = useState(false);
  const [dailyStudy, setDailyStudy] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string>(() => {
    const todayName = getTodayDayName();
    // Default to today's day if it's a study day, otherwise Sunday
    return DAY_LABELS.includes(todayName) ? todayName : "Sunday";
  });

  const handleLessonChange = (lessonId: string) => {
    const lesson = Q1_2026_LESSONS.find((l) => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
      setJeevesResponse(null);
      setDailyStudy(null);
    }
  };

  const getSelectedDay = (): QuarterlyDay | undefined => {
    return selectedLesson.days.find((d) => d.day === activeDay);
  };

  const handleGenerateDailyStudy = async () => {
    const selectedDay = getSelectedDay();
    if (!selectedDay) return;

    setGeneratingStudy(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: `${selectedLesson.title} - ${selectedDay.day}: ${selectedDay.title}`,
          dayTitle: selectedDay.title,
          lessonContent: `QUARTERLY: ${Q1_2026_TITLE} - ${Q1_2026_SUBTITLE}\nQUARTER: ${Q1_2026_QUARTER}\n\nLESSON ${selectedLesson.num}: ${selectedLesson.title}\nDates: ${selectedLesson.startDate} to ${selectedLesson.endDate}\n\nMemory Text: "${selectedLesson.memoryText}" (${selectedLesson.memoryRef})\n\nSabbath Introduction:\n${selectedLesson.sabbathIntro}\n\nDAY: ${selectedDay.day} - ${selectedDay.title} (${selectedDay.date})\nScriptures: ${selectedDay.scriptures.join(", ")}\n\nLesson Content:\n${selectedDay.content}`,
          bibleVerses: selectedDay.scriptures,
          selectedRoom: "",
          selectedPrinciple: "",
          question: `Generate a complete daily study for this day of the Sabbath School lesson. Follow the quarterly's exact information and content closely, then enhance it with Phototheology Palace principles. Structure it as follows:

1. OPENING SCRIPTURE & CONTEXT — Quote the key passage(s) for today (KJV) and set the historical/literary context from the quarterly lesson.

2. LESSON CONTENT — Present the quarterly's teaching points for this day faithfully. Do not skip or replace the quarterly's content. Expand on it with deeper explanation.

3. PHOTOTHEOLOGY ENHANCEMENT — Apply 2-3 relevant Palace Rooms to illuminate the text:
   • Which rooms naturally connect to today's passage?
   • What do the 5 Dimensions (Literal, Christ, Me, Church, Heaven) reveal?
   • Any Sanctuary connections, Types/Symbols, or Cycle placements?

4. CHRIST-CENTERED SYNTHESIS (Concentration Room) — How does today's study point to Christ? Trace the Christ-thread explicitly.

5. DISCUSSION QUESTIONS — 3-4 questions progressing from observation to interpretation to application.

6. PERSONAL APPLICATION & PRAYER — A practical challenge and prayer focus for the day.

Keep the quarterly's actual teaching as the foundation. The PT framework should enhance, not replace, the lesson content.`,
        },
      });

      if (error) throw error;
      setDailyStudy(data?.content || JSON.stringify(data));
      toast({ title: "Daily study generated!" });
    } catch (err: any) {
      console.error("Daily study generation error:", err);
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingStudy(false);
    }
  };

  const handleAnalyze = async () => {
    const selectedDay = getSelectedDay();
    if (!selectedDay) {
      toast({ title: "Select a day first", variant: "destructive" });
      return;
    }
    if (!selectedRoom && !selectedPrinciple) {
      toast({ title: "Select a Palace Room or Principle", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: `${selectedLesson.title} - ${selectedDay.day}: ${selectedDay.title}`,
          dayTitle: selectedDay.title,
          lessonContent: `Memory Text: "${selectedLesson.memoryText}" (${selectedLesson.memoryRef})\n\nScriptures: ${selectedDay.scriptures.join(", ")}\n\n${selectedDay.content}\n\nQuarter Theme: ${Q1_2026_TITLE} - ${Q1_2026_SUBTITLE}`,
          bibleVerses: selectedDay.scriptures,
          selectedRoom,
          selectedPrinciple,
        },
      });

      if (error) throw error;
      setJeevesResponse(data?.content || JSON.stringify(data));
      toast({ title: "Analysis complete" });
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const start = new Date(selectedLesson.startDate);
    const end = new Date(selectedLesson.endDate);
    end.setHours(23, 59, 59);
    return today >= start && today <= end;
  };

  const selectedDay = getSelectedDay();

  return (
    <div className="space-y-4">
      {/* Quarterly Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="gradient-palace text-white pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="font-serif text-xl">{Q1_2026_TITLE}</CardTitle>
              <CardDescription className="text-white/90">
                {Q1_2026_QUARTER} &middot; {Q1_2026_SUBTITLE}
              </CardDescription>
            </div>
            <a
              href="https://www.sabbath.school/LessonBook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Official PDF
            </a>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">Select Lesson</span>
            {isCurrentWeek() && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                This Week
              </Badge>
            )}
          </div>
          <Select value={selectedLesson.id} onValueChange={handleLessonChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Q1_2026_LESSONS.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  Lesson {lesson.num}: {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Memory Text (compact) */}
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs font-medium text-primary mb-1">Memory Text</p>
        <p className="text-sm italic">"{selectedLesson.memoryText}"</p>
        <p className="text-xs text-muted-foreground mt-1">&mdash; {selectedLesson.memoryRef}</p>
      </div>

      {/* Daily Study Tabs — the main content */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Daily Study — Lesson {selectedLesson.num}: {selectedLesson.title}
          </CardTitle>
          <CardDescription>{selectedLesson.startDate} – {selectedLesson.endDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDay} onValueChange={(v) => { setActiveDay(v); setDailyStudy(null); setJeevesResponse(null); }}>
            <TabsList className="w-full flex-wrap h-auto gap-1 p-1 bg-muted/50">
              {selectedLesson.days.map((day, i) => (
                <TabsTrigger
                  key={day.day}
                  value={day.day}
                  className="flex-1 min-w-[48px] text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span className="hidden sm:inline">{day.day}</span>
                  <span className="sm:hidden">{DAY_SHORT[i] || day.day.slice(0, 3)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedLesson.days.map((day) => (
              <TabsContent key={day.day} value={day.day} className="mt-4 space-y-4">
                {/* Day header */}
                <div>
                  <h3 className="font-semibold text-lg">{day.title}</h3>
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {day.scriptures.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Quarterly lesson content for this day */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">📖 Quarterly Lesson Content</p>
                  <p className="text-sm leading-relaxed">{day.content}</p>
                </div>

                {/* Generate PT-Enhanced Study */}
                <Button
                  onClick={handleGenerateDailyStudy}
                  disabled={generatingStudy}
                  className="w-full gradient-palace text-white"
                  size="lg"
                >
                  {generatingStudy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PT-Enhanced Study...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate PT-Enhanced Daily Study
                    </>
                  )}
                </Button>

                {/* Generated Daily Study */}
                {dailyStudy && (
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Wand2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">PT-Enhanced Daily Study</span>
                        <Badge variant="secondary" className="text-xs">{day.day}</Badge>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        {formatJeevesResponse(dailyStudy)}
                      </div>
                    </div>
                  </ScrollArea>
                )}

                {/* Deep Dive section */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Deep Dive: Amplify with a Specific Room or Lens</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Palace Room</label>
                      <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Choose a room..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOMS.map((room) => (
                            <SelectItem key={room} value={room}>{room}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">Principle Lens</label>
                      <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Choose a lens..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {PRINCIPLES.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing || (!selectedRoom && !selectedPrinciple)}
                    className="w-full gradient-royal text-white"
                    size="sm"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Apply Specific Framework
                      </>
                    )}
                  </Button>

                  {jeevesResponse && (
                    <ScrollArea className="h-[400px]">
                      <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">Palace Analysis</span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {formatJeevesResponse(jeevesResponse)}
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
