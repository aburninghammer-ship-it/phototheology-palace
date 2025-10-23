import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Check, Lock, Sparkles } from "lucide-react";
import { revelationLessons } from "@/data/revelationCourseData";

const RevelationCourse = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const lesson = revelationLessons.find(l => l.id === currentLesson);
  const sections = [...new Set(revelationLessons.map(l => l.section))];

  const toggleComplete = () => {
    if (completedLessons.includes(currentLesson)) {
      setCompletedLessons(completedLessons.filter(id => id !== currentLesson));
    } else {
      setCompletedLessons([...completedLessons, currentLesson]);
    }
  };

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
              <Book className="h-8 w-8 text-primary" />
              Unlocking Revelation
            </h1>
            <p className="text-muted-foreground">50-Lesson Historicist Study Guide</p>
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="mr-1 h-3 w-3" />
              {completedLessons.length} of 50 Completed
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lesson Navigator */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Course Lessons</CardTitle>
                <CardDescription>Select a lesson to study</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section} className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary">{section}</h3>
                        <div className="space-y-1">
                          {revelationLessons
                            .filter(l => l.section === section)
                            .map((l) => (
                              <Button
                                key={l.id}
                                variant={currentLesson === l.id ? "default" : "ghost"}
                                className="w-full justify-start text-left"
                                onClick={() => setCurrentLesson(l.id)}
                              >
                                <span className="flex items-center gap-2 w-full">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs">
                                    {completedLessons.includes(l.id) ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      l.id
                                    )}
                                  </span>
                                  <span className="truncate text-sm">{l.title}</span>
                                </span>
                              </Button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Lesson {lesson.id}: {lesson.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge>{lesson.section}</Badge>
                    </CardDescription>
                  </div>
                  <Button
                    variant={completedLessons.includes(currentLesson) ? "default" : "outline"}
                    onClick={toggleComplete}
                  >
                    {completedLessons.includes(currentLesson) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Lesson</TabsTrigger>
                      <TabsTrigger value="reflection">Reflection</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Focus</h3>
                        <p className="text-foreground">{lesson.focus}</p>
                      </div>

                      <div className="p-4 bg-accent/20 rounded-lg border-l-4 border-primary">
                        <h3 className="font-semibold text-primary mb-2">Scripture Anchor</h3>
                        <p className="font-semibold">{lesson.scriptureAnchor}</p>
                        <p className="italic mt-2">{lesson.scriptureText}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Unlocking Insight</h3>
                        <p className="text-foreground leading-relaxed">{lesson.unlockingInsight}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-primary">Repeat & Enlarge</h3>
                        <p className="text-foreground leading-relaxed">{lesson.repeatAndEnlarge}</p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Personal Endurance</h3>
                        <p className="text-foreground italic">{lesson.personalEndurance}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="reflection" className="space-y-6 mt-6">
                      <div className="p-6 bg-accent/20 rounded-lg">
                        <h3 className="font-semibold text-primary mb-4">Reflection Question</h3>
                        <p className="text-lg text-foreground leading-relaxed">{lesson.reflectionQuestion}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Journal Your Thoughts</h3>
                        <textarea
                          className="w-full h-64 p-4 rounded-lg border bg-background"
                          placeholder="Write your reflections here..."
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
                      disabled={currentLesson === 1}
                    >
                      Previous Lesson
                    </Button>
                    <Button
                      onClick={() => setCurrentLesson(Math.min(50, currentLesson + 1))}
                      disabled={currentLesson === 50}
                    >
                      Next Lesson
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevelationCourse;
