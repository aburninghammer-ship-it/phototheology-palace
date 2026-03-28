import { useState, useEffect } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { QUARTERLY_STUDY_TOUR } from "@/data/guidedTours";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Calendar, Sparkles, Bot, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentQuarterly, getQuarterlyLesson, type Quarterly, type QuarterlyLesson } from "@/services/quarterlyApi";
import { Navigation } from "@/components/Navigation";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { q4_2025_lessons } from "@/data/q4-2025-lesson-content";

const QuarterlyStudy = () => {
  const { t } = useTranslation();
  const [quarterly, setQuarterly] = useState<Quarterly | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<QuarterlyLesson | null>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [jeevesResponse, setJeevesResponse] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("");
  const [userLessonInput, setUserLessonInput] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const { toast } = useToast();
  const [tourOpen, setTourOpen] = useState(false);

  const rooms = [
    "Room 1: Story Room (SR)", "Room 2: Imagination Room (IR)", "Room 3: 24FPS Room (24)", 
    "Room 4: Bible Rendered (BR)", "Room 5: Translation Room (TR)", "Room 6: Gems Room (GR)",
    "Room 7: Observation Room (OR)", "Room 8: Def-Com Room (DC)", "Room 9: Symbols/Types (ST)", 
    "Room 10: Questions Room (QR)", "Room 11: Q&A Chains (QA)",
    "Room 12: Nature Freestyle (NF)", "Room 13: Personal Freestyle (PF)", "Room 14: Bible Freestyle (BF)", 
    "Room 15: History Freestyle (HF)", "Room 16: Listening Room (LR)",
    "Room 17: Concentration Room (CR)", "Room 18: Dimensions Room (DR)", "Room 19: Connect-6 (C6)", 
    "Room 20: Theme Room (TRm)", "Room 21: Time Zone (TZ)", "Room 22: Patterns Room (PRm)", 
    "Room 23: Parallels Room (P‖)", "Room 24: Fruit Room (FRt)",
    "Room 25: Blue Room - Sanctuary (BL)", "Room 26: Prophecy Room (PR)", "Room 27: Three Angels (3A)", 
    "Room 28: Feasts Room (FE)", "Room 29: Christ in Every Chapter (CEC)", "Room 30: Room 66 (R66)",
    "Room 31: Three Heavens (1H/2H/3H)", "Room 32: Eight Cycles (@)", "Room 33: Juice Room (JR)",
    "Room 34: Fire Room (FRm)", "Room 35: Meditation Room (MR)", "Room 36: Speed Room (SRm)",
    "Room 37: Reflexive Mastery (∞)"
  ];

  const principles = [
    // Five Dimensions (DR Room)
    "Literal Dimension", "Christ Dimension", "Me Dimension", "Church Dimension", "Heaven Dimension",
    // Core Principles
    "Repeat and Enlarge", "Chain References", "Christ in All Scripture",
    // Structural Principles
    "Sanctuary Pattern", "Types and Symbols", "Seven Feasts", "Time Zones",
    // Prophetic Principles
    "Day-Year Principle (DY)", "@2300 (1844 IJ)", "@1260 (Papal Supremacy)", "@538-1798 (Dark Ages)",
    "@508 (Clovis Conversion)", "@1844 (Judgment Begins)", "@70 Weeks (Messiah)",
    // Investigative Patterns
    "Observation Only", "Questions Room Method", "Scripture Answers Scripture",
    // Visualization Principles
    "Story Beats (3-7)", "Five Senses Imagination", "Chapter Icons",
    // Thematic Walls
    "Great Controversy Wall", "Life of Christ Wall", "Sanctuary Wall", 
    "Time-Prophecy Wall", "Gospel Floor", "Heaven Ceiling",
    // Genre Reading
    "Prophecy Genre", "Parable Genre", "Epistle Genre", "History Genre", "Gospel Genre", "Poetry Genre",
    // Application Principles
    "Nature Parallels", "Personal Testimony", "History Parallels",
    // Advanced Synthesis
    "Gems (2-4 Text Combo)", "Parallels Comparison", "Fruit Test", "Three Angels' Messages"
  ];

  useEffect(() => {
    loadQuarterly();
  }, []);

  useEffect(() => {
    if (quarterly && quarterly.lessons.length > 0) {
      // Find today's lesson
      const today = new Date();
      const currentLesson = quarterly.lessons.find(lesson => {
        const startDate = new Date(lesson.start_date);
        const endDate = new Date(lesson.end_date);
        return today >= startDate && today <= endDate;
      });
      
      if (currentLesson) {
        setSelectedLesson(currentLesson);
        loadLessonContent(quarterly.id, currentLesson.id);
        toast({
          title: t('quarterlyStudy.thisWeeksLesson'),
          description: t('quarterlyStudy.lessonWithTitle', { index: currentLesson.index, title: currentLesson.title }),
        });
      } else {
        setSelectedLesson(quarterly.lessons[0]);
        loadLessonContent(quarterly.id, quarterly.lessons[0].id);
      }
    }
  }, [quarterly]);

  const loadQuarterly = async () => {
    try {
      const data = await getCurrentQuarterly();
      if (data) {
        setQuarterly(data);
      } else {
        toast({
          title: t('quarterlyStudy.unableToLoad'),
          description: t('quarterlyStudy.couldNotFetch'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading quarterly:", error);
      toast({
        title: t('quarterlyStudy.error'),
        description: t('quarterlyStudy.failedToLoadQuarterly'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLessonContent = async (quarterlyId: string, lessonId: string) => {
    try {
      setLoading(true);
      const content = await getQuarterlyLesson(quarterlyId, lessonId);
      setLessonContent(content);
      
      // Set first day as selected
      if (content && content.days && content.days.length > 0) {
        setSelectedDay(content.days[0].id);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast({
        title: t('quarterlyStudy.error'),
        description: t('quarterlyStudy.failedToLoadLesson'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    const lesson = quarterly?.lessons.find(l => l.id === lessonId);
    if (lesson && quarterly) {
      setSelectedLesson(lesson);
      setLessonContent(null); // Clear previous content
      setSelectedDay(""); // Clear selected day
      loadLessonContent(quarterly.id, lesson.id);
      setJeevesResponse(null);
    }
  };

  const handleApplyRoomOrPrinciple = async () => {
    if (!selectedRoom && !selectedPrinciple) {
      toast({
        title: t('quarterlyStudy.selectionRequired'),
        description: t('quarterlyStudy.pleaseSelectRoomOrPrinciple'),
        variant: "destructive",
      });
      return;
    }

    if (!userLessonInput.trim()) {
      toast({
        title: t('quarterlyStudy.lessonContentRequired'),
        description: t('quarterlyStudy.pleasePasteLessonContent'),
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: selectedLesson?.title || "Quarterly Study",
          dayTitle: selectedDay || "Daily Study",
          lessonContent: userLessonInput,
          bibleVerses: selectedLesson?.bible_verses || [],
          selectedRoom,
          selectedPrinciple,
          userQuestion: userQuestion.trim() || undefined,
        },
      });

      if (error) throw error;

      setJeevesResponse(data);
      toast({
        title: t('quarterlyStudy.analysisComplete'),
        description: t('quarterlyStudy.jeevesAnalyzedLesson'),
      });
    } catch (error: any) {
      console.error("Error analyzing:", error);
      toast({
        title: t('quarterlyStudy.error'),
        description: error.message || t('quarterlyStudy.failedToAnalyze'),
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getCurrentDayContent = () => {
    if (!lessonContent || !selectedDay) return null;
    return lessonContent.days?.find((d: any) => d.id === selectedDay);
  };

  // Auto-populate the study textarea when a day is selected
  useEffect(() => {
    const dayContent = getCurrentDayContent();
    if (dayContent?.content) {
      // Strip HTML tags if present, keep plain text
      const plainText = dayContent.content.replace(/<[^>]*>/g, '').trim();
      setUserLessonInput(plainText);
    }
  }, [selectedDay, lessonContent]);

  if (loading && !quarterly) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={QUARTERLY_STUDY_TOUR} onClose={() => setTourOpen(false)} />}
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold gradient-text mb-2">
            {t('quarterlyStudy.pageTitle')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('quarterlyStudy.pageSubtitle')}
          </p>
        </div>

          {/* Quarterly Info */}
        {quarterly && (
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader className="gradient-palace text-white">
              <CardTitle className="font-serif text-2xl flex items-center justify-between flex-wrap gap-4">
                <span>{quarterly.title}</span>
                <a
                  href="https://www.sabbath.school/LessonBook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {t('quarterlyStudy.quarterlyPdf')}
                </a>
              </CardTitle>
              <CardDescription className="text-white/90">
                {quarterly.quarter} • {quarterly.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Lesson Selection & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('quarterlyStudy.selectLesson')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedLesson?.id}
                  onValueChange={handleLessonSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('quarterlyStudy.chooseALesson')} />
                  </SelectTrigger>
                  <SelectContent>
                    {quarterly?.lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {t('quarterlyStudy.lessonWithTitle', { index: lesson.index, title: lesson.title })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Read Online Link */}
                {selectedLesson && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-2">
                      {t('quarterlyStudy.accessLessonText')}
                    </p>
                    <ol className="text-xs text-muted-foreground space-y-1 mb-3">
                      <li>{t('quarterlyStudy.step1ClickLink')}</li>
                      <li>{t('quarterlyStudy.step2ScrollDown')}</li>
                      <li>{t('quarterlyStudy.step3CopyText')}</li>
                      <li>{t('quarterlyStudy.step4PasteBelow')}</li>
                    </ol>
                    <a
                      href={`https://www.sabbath.school/Lesson?year=2026&quarter=1&lesson=${selectedLesson.index}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline font-medium flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      {t('quarterlyStudy.openLesson', { index: selectedLesson.index, title: selectedLesson.title })}
                    </a>
                  </div>
                )}

                {/* Day Selection */}
                {lessonContent && lessonContent.days && (
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">
                      {t('quarterlyStudy.selectDay')}
                    </label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('quarterlyStudy.chooseADay')} />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonContent.days.map((day: any, idx: number) => (
                          <SelectItem key={day.id} value={day.id}>
                            {day.title || t('quarterlyStudy.dayNumber', { number: idx + 1 })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PDF Viewer */}
            {selectedLesson && (() => {
              const lessonKey = selectedLesson.id.padStart(2, '0');
              const lessonData = q4_2025_lessons[lessonKey];
              const pdfStartPage = lessonData?.pdfStartPage;
              if (!pdfStartPage) return null;
              return (
                <Card className="border border-primary/20">
                  <CardHeader className="pb-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-0 hover:bg-transparent"
                      onClick={() => setShowPdfViewer(!showPdfViewer)}
                    >
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-5 w-5 text-primary" />
                        View Quarterly PDF
                      </CardTitle>
                      {showPdfViewer ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    {!showPdfViewer && (
                      <CardDescription className="text-xs">
                        Pages {pdfStartPage}–{lessonData?.pdfEndPage || pdfStartPage} of the quarterly
                      </CardDescription>
                    )}
                  </CardHeader>
                  {showPdfViewer && (
                    <CardContent className="pt-0">
                      <iframe
                        src={`/quarterlies/Q4-2025-Christ-Object-Lessons.pdf#page=${pdfStartPage}`}
                        className="w-full h-[600px] rounded-lg border"
                        title={`Quarterly PDF — Lesson ${selectedLesson.index}`}
                      />
                    </CardContent>
                  )}
                </Card>
              );
            })()}

            {/* Lesson Content Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('quarterlyStudy.pasteLessonContent')}
                </CardTitle>
                <CardDescription>
                  {t('quarterlyStudy.pasteLessonDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <textarea
                    value={userLessonInput}
                    onChange={(e) => setUserLessonInput(e.target.value)}
                    className="w-full min-h-[480px] p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('quarterlyStudy.textareaPlaceholder')}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Jeeves Assistant */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-2 border-primary/20">
              <CardHeader className="gradient-palace text-white">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  <div>
                    <CardTitle className="font-serif">{t('quarterlyStudy.jeevesAnalysis')}</CardTitle>
                    <CardDescription className="text-white/90">
                      {t('quarterlyStudy.applyPalaceFramework')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('quarterlyStudy.selectAPalaceRoom')}
                  </label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('quarterlyStudy.chooseARoom')} />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room} value={room}>
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Principle Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('quarterlyStudy.selectAPrinciple')}
                  </label>
                  <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('quarterlyStudy.chooseAPrinciple')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {principles.map((principle) => (
                        <SelectItem key={principle} value={principle}>
                          {principle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('quarterlyStudy.askJeevesQuestion')}
                  </label>
                  <textarea
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder={t('quarterlyStudy.questionPlaceholder')}
                  />
                </div>

                <Button
                  onClick={handleApplyRoomOrPrinciple}
                  disabled={analyzing || (!selectedRoom && !selectedPrinciple)}
                  className="w-full gradient-royal text-white"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('quarterlyStudy.analyzing')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {t('quarterlyStudy.applyFramework')}
                    </>
                  )}
                </Button>

                {/* Jeeves Response */}
                {jeevesResponse && (
                  <ScrollArea className="h-[400px] mt-4">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{t('quarterlyStudy.jeevesSays')}</span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        {formatJeevesResponse(jeevesResponse.content || '')}
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyStudy;
