import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Calendar, Sparkles, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentQuarterly, getQuarterlyLesson, type Quarterly, type QuarterlyLesson } from "@/services/quarterlyApi";
import { Navigation } from "@/components/Navigation";

const QuarterlyStudy = () => {
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
  const { toast } = useToast();

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
          title: "This Week's Lesson",
          description: `Lesson ${currentLesson.index}: ${currentLesson.title}`,
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
          title: "Unable to load quarterly",
          description: "Could not fetch the current Sabbath School quarterly",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading quarterly:", error);
      toast({
        title: "Error",
        description: "Failed to load quarterly data",
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
        title: "Error",
        description: "Failed to load lesson content",
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
        title: "Selection Required",
        description: "Please select a room or principle to apply",
        variant: "destructive",
      });
      return;
    }

    if (!userLessonInput.trim()) {
      toast({
        title: "Lesson Content Required",
        description: "Please paste the lesson content you want to analyze",
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
        title: "Analysis Complete",
        description: "Jeeves has analyzed the lesson with your selected framework",
      });
    } catch (error: any) {
      console.error("Error analyzing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze lesson",
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
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold gradient-text mb-2">
            Amplified Quarterly Study
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Apply the 38 Palace Rooms and 5 Dimensions to your Sabbath School lessons
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
                  Quarterly PDF
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Lesson
                  </div>
                  {selectedLesson && selectedLesson.full_read && (
                    <a
                      href={selectedLesson.full_read}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      <BookOpen className="h-3 w-3" />
                      View Official PDF
                    </a>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedLesson?.id}
                  onValueChange={handleLessonSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {quarterly?.lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        Lesson {lesson.index}: {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Day Tabs */}
                {lessonContent && lessonContent.days && (
                  <div className="mt-4">
                    <ScrollArea className="w-full">
                      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                        <div className="overflow-x-auto pb-2">
                          <TabsList className="inline-flex w-auto">
                            {lessonContent.days.map((day: any, idx: number) => (
                              <TabsTrigger key={day.id} value={day.id} className="whitespace-nowrap">
                                {day.title || `Day ${idx + 1}`}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>
                      </Tabs>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lesson Content Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Paste Lesson Content to Amplify
                </CardTitle>
                <CardDescription>
                  Copy text from the official PDF and paste it here to analyze with Palace Rooms and Principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <textarea
                    value={userLessonInput}
                    onChange={(e) => setUserLessonInput(e.target.value)}
                    className="w-full min-h-[450px] p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Paste the lesson content here... Include:&#10;• Bible passages&#10;• Key quotes&#10;• Discussion points&#10;• Any text you want to analyze&#10;&#10;Then select a Room or Principle and click 'Apply Framework' to get Jeeves' insights!"
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
                    <CardTitle className="font-serif">Jeeves Analysis</CardTitle>
                    <CardDescription className="text-white/90">
                      Apply Palace Framework
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select a Palace Room
                  </label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room..." />
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
                    Select a Principle
                  </label>
                  <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a principle..." />
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
                    Ask Jeeves a Question (Optional)
                  </label>
                  <textarea
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="E.g., How does this passage reveal Christ? What pattern repeats throughout Scripture? How can I apply this today?"
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
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Apply Framework
                    </>
                  )}
                </Button>

                {/* Jeeves Response */}
                {jeevesResponse && (
                  <ScrollArea className="h-[400px] mt-4">
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Jeeves says:</span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        {jeevesResponse.content?.split('\n\n').map((paragraph: string, idx: number) => (
                          <p key={idx} className="mb-3 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
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
