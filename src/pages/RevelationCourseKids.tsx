import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Star, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { kidsRevelationLessons } from "@/data/revelationCourseData";

const RevelationCourseKids = () => {
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const lesson = kidsRevelationLessons.find(l => l.id === currentLesson);

  const toggleComplete = () => {
    if (completedLessons.includes(currentLesson)) {
      setCompletedLessons(completedLessons.filter(id => id !== currentLesson));
    } else {
      setCompletedLessons([...completedLessons, currentLesson]);
    }
  };

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <BookOpen className="h-10 w-10" />
              Revelation for Kids! 🌟
            </h1>
            <p className="text-xl text-muted-foreground">Jesus' Amazing Prophecy Adventure</p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(completedLessons.length)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
          </div>

          <Card className="border-4 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-primary">
                    Lesson {lesson.id}
                  </CardTitle>
                  <CardDescription className="text-xl mt-2 font-semibold">
                    {lesson.title}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {completedLessons.length} Stars!
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {/* Bible Verse */}
                  <div className="p-6 bg-primary/10 rounded-2xl border-4 border-primary/30">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <h3 className="font-bold text-xl text-primary">Bible Verse</h3>
                    </div>
                    <p className="text-lg font-semibold italic">{lesson.bibleVerse}</p>
                  </div>

                  {/* Story */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-2xl text-primary flex items-center gap-2">
                      📖 The Story
                    </h3>
                    <p className="text-lg leading-relaxed">{lesson.story}</p>
                  </div>

                  {/* Question */}
                  <div className="p-6 bg-accent/20 rounded-2xl border-2 border-accent">
                    <h3 className="font-bold text-xl text-primary mb-3 flex items-center gap-2">
                      🤔 Think About It
                    </h3>
                    <p className="text-lg">{lesson.question}</p>
                  </div>

                  {/* Activity */}
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-500">
                    <h3 className="font-bold text-xl text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                      🎨 Fun Activity
                    </h3>
                    <p className="text-lg">{lesson.activity}</p>
                  </div>

                  {/* Complete Button */}
                  <div className="flex justify-center pt-4">
                    <Button
                      size="lg"
                      onClick={toggleComplete}
                      className="text-lg px-8 py-6"
                      variant={completedLessons.includes(currentLesson) ? "default" : "outline"}
                    >
                      {completedLessons.includes(currentLesson) ? (
                        <>
                          <Star className="mr-2 h-5 w-5 fill-current" />
                          Got My Star! ⭐
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-5 w-5" />
                          I Finished This Lesson!
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
              disabled={currentLesson === 1}
              className="text-lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Lesson {currentLesson} of {kidsRevelationLessons.length}</p>
            </div>

            <Button
              size="lg"
              onClick={() => setCurrentLesson(Math.min(kidsRevelationLessons.length, currentLesson + 1))}
              disabled={currentLesson === kidsRevelationLessons.length}
              className="text-lg"
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevelationCourseKids;
