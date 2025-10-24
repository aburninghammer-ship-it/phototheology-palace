import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Calendar, Sparkles, ChevronRight } from "lucide-react";
import { getCurrentQuarterly, getQuarterlyLesson, analyzeQuarterlyWithPhototheology, type Quarterly, type QuarterlyLesson } from "@/services/quarterlyApi";
import { useToast } from "@/hooks/use-toast";

const QuarterlyStudy = () => {
  const [quarterly, setQuarterly] = useState<Quarterly | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<QuarterlyLesson | null>(null);
  const [lessonDetails, setLessonDetails] = useState<any>(null);
  const [phototheologyAnalysis, setPhototheologyAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingLesson, setAnalyzingLesson] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentQuarterly();
  }, []);

  const loadCurrentQuarterly = async () => {
    setLoading(true);
    try {
      const data = await getCurrentQuarterly();
      if (data) {
        setQuarterly(data);
        // Auto-select current week's lesson
        const today = new Date();
        const currentLesson = data.lessons.find(lesson => {
          const startDate = new Date(lesson.start_date);
          const endDate = new Date(lesson.end_date);
          return today >= startDate && today <= endDate;
        });
        if (currentLesson) {
          loadLesson(currentLesson);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load quarterly. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading quarterly:', error);
      toast({
        title: "Error",
        description: "An error occurred while loading the quarterly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lesson: QuarterlyLesson) => {
    if (!quarterly) return;
    
    setSelectedLesson(lesson);
    setLessonDetails(null);
    setPhototheologyAnalysis(null);
    
    try {
      const details = await getQuarterlyLesson(quarterly.id, lesson.id);
      setLessonDetails(details);
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson details.",
        variant: "destructive",
      });
    }
  };

  const analyzeWithPhototheology = async () => {
    if (!selectedLesson || !lessonDetails) return;
    
    setAnalyzingLesson(true);
    try {
      const analysis = await analyzeQuarterlyWithPhototheology(
        selectedLesson.title,
        lessonDetails.lesson?.content || selectedLesson.full_read,
        selectedLesson.bible_verses
      );
      setPhototheologyAnalysis(analysis);
      toast({
        title: "Analysis Complete",
        description: "Phototheology principles have been applied to this lesson.",
      });
    } catch (error) {
      console.error('Error analyzing lesson:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze lesson with phototheology principles.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading current quarterly...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!quarterly) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Not Available</CardTitle>
              <CardDescription>
                Unable to load the current Sabbath School quarterly. Please try again later.
              </CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-8 w-8 text-primary" />
              <Badge variant="secondary">{quarterly.quarter}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {quarterly.title}
            </h1>
            {quarterly.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {quarterly.description}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lessons List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {quarterly.lessons.map((lesson) => {
                      const isCurrentWeek = selectedLesson?.id === lesson.id;
                      const today = new Date();
                      const startDate = new Date(lesson.start_date);
                      const endDate = new Date(lesson.end_date);
                      const isThisWeek = today >= startDate && today <= endDate;
                      
                      return (
                        <Button
                          key={lesson.id}
                          variant={isCurrentWeek ? "default" : "outline"}
                          className="w-full justify-between text-left h-auto py-3"
                          onClick={() => loadLesson(lesson)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold">
                                Lesson {lesson.index}
                              </span>
                              {isThisWeek && (
                                <Badge variant="secondary" className="text-xs">
                                  This Week
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm truncate">{lesson.title}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      {selectedLesson ? selectedLesson.title : "Select a Lesson"}
                    </CardTitle>
                    {selectedLesson && (
                      <CardDescription>
                        {new Date(selectedLesson.start_date).toLocaleDateString()} - {new Date(selectedLesson.end_date).toLocaleDateString()}
                      </CardDescription>
                    )}
                  </div>
                  {selectedLesson && lessonDetails && (
                    <Button
                      onClick={analyzeWithPhototheology}
                      disabled={analyzingLesson}
                      className="gap-2"
                    >
                      {analyzingLesson ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Apply Phototheology
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedLesson ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a lesson to begin your study</p>
                  </div>
                ) : (
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="verses">Bible Verses</TabsTrigger>
                      <TabsTrigger value="phototheology">Amplified Quarterly Lesson</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {lessonDetails ? (
                            <div dangerouslySetInnerHTML={{ __html: lessonDetails.lesson?.content || selectedLesson.full_read }} />
                          ) : (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="verses" className="space-y-4">
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-3">
                          {selectedLesson.bible_verses.map((verse, idx) => (
                            <Card key={idx} className="p-4">
                              <p className="font-medium text-primary">{verse}</p>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="phototheology" className="space-y-4">
                      <ScrollArea className="h-[500px] pr-4">
                        {!phototheologyAnalysis ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Click "Apply Phototheology" to analyze this lesson</p>
                            <p className="text-sm mt-2">
                              Discover connections to the 37-Room Palace principles
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
                            {phototheologyAnalysis.rooms && (
                              <div>
                                <h3>Palace Rooms Highlighted</h3>
                                <div className="flex flex-wrap gap-2">
                                  {phototheologyAnalysis.rooms.map((room: string, idx: number) => (
                                    <Badge key={idx} variant="secondary">{room}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {phototheologyAnalysis.analysis && (
                              <div dangerouslySetInnerHTML={{ __html: phototheologyAnalysis.analysis }} />
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuarterlyStudy;
