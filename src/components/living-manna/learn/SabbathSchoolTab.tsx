import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
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

interface FetchedDay {
  id: string;
  title: string;
  date: string;
  content: string;
  read: string;
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
    return DAY_LABELS.includes(todayName) ? todayName : "Sunday";
  });
  const [fetchedDays, setFetchedDays] = useState<FetchedDay[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // Fetch full lesson content from edge function proxy (avoids CORS)
  useEffect(() => {
    const fetchFullContent = async () => {
      setLoadingContent(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const quarter = Math.ceil((now.getMonth() + 1) / 3);
        const quarterId = `${year}-${String(quarter).padStart(2, "0")}`;

        const { data, error } = await supabase.functions.invoke("fetch-sabbath-school-lesson", {
          body: { language: "en", quarterId, lessonId: selectedLesson.id },
        });

        if (error) {
          console.warn("Edge function error:", error);
          setFetchedDays([]);
        } else if (data?.success && data.days?.length > 0) {
          setFetchedDays(data.days);
        } else {
          console.warn("No lesson content returned:", data?.error);
          setFetchedDays([]);
        }
      } catch (err) {
        console.warn("Could not fetch full quarterly content:", err);
        setFetchedDays([]);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchFullContent();
  }, [selectedLesson.id]);

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

  // Get the full content for the active day — prefer fetched API content, fallback to local
  // API returns 7 days: 01=Sabbath, 02=Sunday, 03=Monday...07=Friday
  // UI shows 6 days: Sunday(0) through Friday(5)
  // So UI dayIndex 0 (Sunday) = API index 1 (day "02"), etc.
  const getFullDayContent = (dayIndex: number): string => {
    const apiIndex = dayIndex + 1; // shift by 1 since API day 01 is Sabbath intro
    const fetched = fetchedDays[apiIndex];
    if (fetched) {
      const apiContent = fetched.read || fetched.content || "";
      if (apiContent.length > 0) return apiContent;
    }
    // Fallback to local data
    return selectedLesson.days[dayIndex]?.content || "";
  };

  const handleGenerateDailyStudy = async () => {
    const selectedDay = getSelectedDay();
    if (!selectedDay) return;

    const dayIndex = selectedLesson.days.findIndex((d) => d.day === activeDay);
    const fullContent = getFullDayContent(dayIndex);

    setGeneratingStudy(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: `${selectedLesson.title} - ${selectedDay.day}: ${selectedDay.title}`,
          dayTitle: selectedDay.title,
          lessonContent: `QUARTERLY: ${Q1_2026_TITLE} - ${Q1_2026_SUBTITLE}\nQUARTER: ${Q1_2026_QUARTER}\n\nLESSON ${selectedLesson.num}: ${selectedLesson.title}\nDates: ${selectedLesson.startDate} to ${selectedLesson.endDate}\n\nMemory Text: "${selectedLesson.memoryText}" (${selectedLesson.memoryRef})\n\nSabbath Introduction:\n${selectedLesson.sabbathIntro}\n\nDAY: ${selectedDay.day} - ${selectedDay.title} (${selectedDay.date})\nScriptures: ${selectedDay.scriptures.join(", ")}\n\nFull Lesson Content:\n${fullContent}`,
          bibleVerses: selectedDay.scriptures,
          selectedRoom: "",
          selectedPrinciple: "",
          question: `Generate a complete daily study for this day of the Sabbath School lesson. You MUST reproduce the quarterly's actual content faithfully — quote it, present it, and preserve its exact teaching points. Then enhance with Phototheology Palace principles. Structure:

1. DAY HEADER — Day name, date, title, and scripture references exactly as the quarterly shows.

2. QUARTERLY CONTENT (VERBATIM) — Present the quarterly's actual lesson text for this day faithfully. Do NOT paraphrase or skip any part. This is the foundation.

3. PHOTOTHEOLOGY ENHANCEMENT — After presenting the quarterly content, add a clearly labeled PT section:
   • 2-3 relevant Palace Rooms that illuminate the text
   • 5 Dimensions view (Literal, Christ, Me, Church, Heaven)
   • Any Sanctuary, Type/Symbol, or Cycle connections

4. CHRIST-CENTERED SYNTHESIS (Concentration Room) — Trace the Christ-thread through today's passage.

5. DISCUSSION QUESTIONS — 3-4 questions from observation to application.

6. PERSONAL APPLICATION — A practical challenge for the day.

CRITICAL: The quarterly's content must appear first and complete. PT principles enhance, never replace.`,
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

    const dayIndex = selectedLesson.days.findIndex((d) => d.day === activeDay);
    const fullContent = getFullDayContent(dayIndex);

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: `${selectedLesson.title} - ${selectedDay.day}: ${selectedDay.title}`,
          dayTitle: selectedDay.title,
          lessonContent: `Memory Text: "${selectedLesson.memoryText}" (${selectedLesson.memoryRef})\n\nScriptures: ${selectedDay.scriptures.join(", ")}\n\n${fullContent}\n\nQuarter Theme: ${Q1_2026_TITLE} - ${Q1_2026_SUBTITLE}`,
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

  // Enhance HTML content with dynamic styling
  const enhanceContent = (html: string): string => {
    let enhanced = html
      // Remove hidden donation/EGW divs and trailing HRs
      .replace(/<div style="display: none"[^>]*class="ss-donation-appeal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, "")
      .replace(/<hr\s*\/?>\s*$/i, "")
      // Style scripture references inline — wrap parenthetical refs in a styled span
      .replace(
        /\(([^)]*(?:Gen|Exod|Lev|Num|Deut|Josh|Judg|Ruth|1 Sam|2 Sam|1 Kings|2 Kings|1 Chron|2 Chron|Ezra|Neh|Esth|Job|Ps|Psa|Prov|Eccles|Song|Isa|Jer|Lam|Ezek|Dan|Hos|Joel|Amos|Obad|Jonah|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt|Mark|Luke|John|Acts|Rom|1 Cor|2 Cor|Gal|Eph|Phil|Col|1 Thess|2 Thess|1 Tim|2 Tim|Titus|Philem|Heb|James|1 Pet|2 Pet|1 John|2 John|3 John|Jude|Rev|NKJV|NIV|KJV|ESV|NLT|NASB)[^)]*)\)/gi,
        '<span class="ss-scripture-ref">($1)</span>'
      )
      // Add a decorative first-letter to the first paragraph
      .replace(
        /^(<p[^>]*>)/i,
        '$1<span class="ss-first-paragraph">'
      );
    
    // Close the first-paragraph span at the end of first <p>
    if (enhanced.includes('ss-first-paragraph')) {
      enhanced = enhanced.replace(
        /(<span class="ss-first-paragraph">)([\s\S]*?)(<\/p>)/i,
        '$1$2</span>$3'
      );
    }

    return enhanced;
  };

  // Render HTML content safely with dynamic styling
  const renderContent = (html: string) => {
    if (html.includes("<") && html.includes(">")) {
      const cleaned = enhanceContent(html);
      return (
        <>
          <style>{`
            .ss-lesson-content .ss-scripture-ref {
              color: hsl(var(--primary));
              font-weight: 500;
              font-size: 0.85em;
              letter-spacing: 0.01em;
            }
            .ss-lesson-content .ss-first-paragraph {
              display: contents;
            }
            .ss-lesson-content > p:first-of-type::first-letter {
              font-size: 2.8em;
              font-weight: 700;
              float: left;
              line-height: 0.85;
              margin-right: 0.08em;
              margin-top: 0.05em;
              color: hsl(var(--primary));
              font-family: Georgia, 'Times New Roman', serif;
            }
            .ss-lesson-content > p {
              text-indent: 0;
              margin-bottom: 1.1em;
            }
            .ss-lesson-content > p + p {
              text-indent: 1.5em;
            }
            .ss-lesson-content > p:first-of-type {
              text-indent: 0 !important;
            }
            .ss-lesson-content blockquote {
              position: relative;
            }
            .ss-lesson-content blockquote::before {
              content: '"';
              position: absolute;
              top: -0.15em;
              left: 0.15em;
              font-size: 3em;
              color: hsl(var(--primary) / 0.15);
              font-family: Georgia, serif;
              line-height: 1;
            }
          `}</style>
          <div
            className="ss-lesson-content prose prose-base max-w-none dark:prose-invert leading-[1.9]
              prose-headings:text-foreground prose-headings:font-serif prose-headings:tracking-tight
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-primary/20 prose-h2:pb-2
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-foreground prose-p:text-[0.95rem]
              prose-strong:text-primary prose-strong:font-semibold
              prose-em:text-foreground/80
              prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-primary/5
              prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-blockquote:text-foreground/90 prose-blockquote:my-6 prose-blockquote:shadow-sm
              prose-a:text-primary prose-a:underline-offset-2 prose-a:decoration-primary/40 hover:prose-a:decoration-primary
              prose-li:text-foreground prose-li:marker:text-primary/60
              prose-ul:my-3 prose-ol:my-3
              prose-code:font-sans prose-code:text-[0.95rem] prose-code:font-normal prose-code:bg-transparent prose-code:p-0 prose-code:before:content-none prose-code:after:content-none
              prose-pre:font-sans prose-pre:text-[0.95rem] prose-pre:bg-transparent prose-pre:p-0 prose-pre:whitespace-pre-wrap
              [&_code]:font-sans [&_code]:text-[0.95rem] [&_code]:font-normal [&_code]:bg-transparent
              [&_pre]:font-sans [&_pre]:bg-transparent [&_pre]:whitespace-pre-wrap
              [&_table]:w-full [&_table]:border-collapse [&_td]:p-2 [&_td]:border [&_td]:border-border/40
              [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:my-4"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','em','b','i','ul','ol','li','blockquote','a','table','thead','tbody','tr','td','th','img','span','div','code','pre'], ALLOWED_ATTR: ['class','href','src','alt','target','rel'] }) }}
          />
        </>
      );
    }
    return <p className="text-[0.95rem] leading-[1.9] whitespace-pre-wrap text-foreground">{html}</p>;
  };

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

      {/* Memory Text */}
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs font-medium text-primary mb-1">Memory Text</p>
        <p className="text-sm italic">"{selectedLesson.memoryText}"</p>
        <p className="text-xs text-muted-foreground mt-1">&mdash; {selectedLesson.memoryRef}</p>
      </div>

      {/* Daily Study Tabs */}
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

            {selectedLesson.days.map((day, dayIndex) => (
              <TabsContent key={day.day} value={day.day} className="mt-4 space-y-4">
                {/* Day header — styled like the quarterly */}
                <div className="flex items-start gap-3">
                  <div className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded font-bold text-sm uppercase tracking-wide shrink-0">
                    {day.day}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground italic">{day.date}</p>
                    <h3 className="font-semibold text-lg mt-0.5">{day.title}</h3>
                  </div>
                </div>

                {/* Scripture badges */}
                <div className="flex flex-wrap gap-1">
                  {day.scriptures.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>

                {/* Full quarterly lesson content */}
                <div className="relative px-6 py-8 bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl border border-border/50 shadow-md overflow-hidden">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />
                  
                  {loadingContent ? (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm font-medium">Loading quarterly content…</span>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[600px]">
                      {renderContent(getFullDayContent(dayIndex))}
                    </ScrollArea>
                  )}
                </div>

                {/* PT Enhancement Button */}
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
                      Enhance with Palace Principles
                    </>
                  )}
                </Button>

                {/* Generated PT-Enhanced Study */}
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
