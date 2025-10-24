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
  const { toast } = useToast();

  const rooms = [
    "Room 1: Story Context", "Room 2: Verse Genetics", "Room 3: Bible Freestyle",
    "Room 4: Midrash Machine", "Room 5: Sabbath Studies", "Room 6: Law Lab",
    "Room 7: Image Lab", "Room 8: Connect-6", "Room 9: Theme Room",
    "Room 10: Apocalyptic Equations", "Room 11: Poetry Pentameter", "Room 12: Type & Antitype",
    "Room 13: Cycles Within", "Room 14: Controversy Map", "Room 15: Numbers Speak",
    "Room 16: Prophetic Chiasm", "Room 17: Last Things", "Room 18: Throne Room",
    "Room 19: Judgment Hour", "Room 20: Covenant Code", "Room 21: Sacred Space",
    "Room 22: Feast Framework", "Room 23: Sanctuary Articles", "Room 24: Musical Torah",
    "Room 25: Wisdom Literature", "Room 26: Lament & Praise", "Room 27: Prophetic Oracle",
    "Room 28: Gospel Harmony", "Room 29: Epistle Logic", "Room 30: Kingdom Parables",
    "Room 31: Miracle Signs", "Room 32: Sermon Analysis", "Room 33: Church History",
    "Room 34: Cultural Context", "Room 35: Spiritual Warfare", "Room 36: End Times",
    "Room 37: New Jerusalem"
  ];

  const principles = [
    "Literal Lens",
    "Christ Lens",
    "Me Lens",
    "Church Lens",
    "Heaven Lens",
    "Future Lens"
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

    const currentDay = lessonContent?.days?.find((d: any) => d.id === selectedDay);
    if (!currentDay) return;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "quarterly_analysis",
          lessonTitle: selectedLesson?.title,
          dayTitle: currentDay.title,
          lessonContent: currentDay.read || currentDay.content,
          bibleVerses: selectedLesson?.bible_verses || [],
          selectedRoom,
          selectedPrinciple,
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
            Apply the 37 Palace Rooms and 6 Principle Lenses to your Sabbath School lessons
          </p>
        </div>

        {/* Quarterly Info */}
        {quarterly && (
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader className="gradient-palace text-white">
              <CardTitle className="font-serif text-2xl flex items-center justify-between">
                <span>{quarterly.title}</span>
                <a
                  href="https://www.sabbath.school/LessonBook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  View PDF
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
                  Select Lesson
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

            {/* Lesson Content */}
            {getCurrentDayContent() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {getCurrentDayContent()?.title}
                  </CardTitle>
                  {selectedLesson?.bible_verses && selectedLesson.bible_verses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedLesson.bible_verses.slice(0, 5).map((verse, idx) => (
                        <Badge key={idx} variant="secondary">
                          {verse}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: getCurrentDayContent()?.read || getCurrentDayContent()?.content || "No content available" 
                      }} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
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
                    Select a Principle Lens
                  </label>
                  <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a lens..." />
                    </SelectTrigger>
                    <SelectContent>
                      {principles.map((principle) => (
                        <SelectItem key={principle} value={principle}>
                          {principle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
