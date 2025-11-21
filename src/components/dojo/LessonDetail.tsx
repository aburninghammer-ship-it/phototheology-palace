import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Target, HelpCircle, CheckCircle2 } from "lucide-react";
import { DojoLesson } from "@/data/artOfWarLessons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonDetailProps {
  lesson: DojoLesson;
  onBack: () => void;
  onComplete: (lessonId: string, notes: string) => void;
  isCompleted: boolean;
  existingNotes?: string;
}

export const LessonDetail = ({ lesson, onBack, onComplete, isCompleted, existingNotes }: LessonDetailProps) => {
  const [notes, setNotes] = useState(existingNotes || "");
  const [activeTab, setActiveTab] = useState("overview");

  const handleComplete = async () => {
    onComplete(lesson.id, notes);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Lessons
      </Button>

      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="outline">Chapter {lesson.chapter}</Badge>
              <CardTitle className="text-3xl">{lesson.title}</CardTitle>
              {lesson.subtitle && (
                <p className="text-xl text-muted-foreground">{lesson.subtitle}</p>
              )}
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-primary text-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BookOpen className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="scripture">
                <BookOpen className="w-4 h-4 mr-2" />
                Scripture
              </TabsTrigger>
              <TabsTrigger value="practice">
                <Target className="w-4 h-4 mr-2" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="reflection">
                <HelpCircle className="w-4 h-4 mr-2" />
                Reflect
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Lesson Overview</h3>
                <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                <div className="space-y-3">
                  {lesson.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{idx + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {lesson.warriorCharacteristics && lesson.warriorCharacteristics.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Warrior Characteristics Developed</h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.warriorCharacteristics.map((char) => (
                      <Badge key={char} variant="secondary" className="capitalize">
                        {char.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scripture" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Scripture References</h3>
              <div className="grid gap-3">
                {lesson.scriptureReferences.map((ref) => (
                  <Card key={ref} className="border-2">
                    <CardContent className="pt-4">
                      <p className="font-semibold text-primary">{ref}</p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm mt-2"
                        onClick={() => {
                          const [book, chapterVerse] = ref.split(' ');
                          const chapter = chapterVerse?.split(':')[0];
                          if (book && chapter) {
                            window.open(`/bible?book=${book}&chapter=${chapter}`, '_blank');
                          }
                        }}
                      >
                        Read in Bible →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Practical Application</h3>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <p className="leading-relaxed">{lesson.practicalApplication}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reflection" className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Reflection Questions</h3>
                <div className="space-y-4">
                  {lesson.reflectionQuestions.map((question, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <p className="font-medium mb-2">{idx + 1}. {question}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Notes</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your reflections, insights, and applications..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleComplete} 
                  className="flex-1"
                  disabled={isCompleted && notes === existingNotes}
                >
                  {isCompleted ? "Update Notes" : "Complete Lesson"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};