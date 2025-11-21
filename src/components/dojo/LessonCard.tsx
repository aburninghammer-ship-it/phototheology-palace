import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { DojoLesson } from "@/data/artOfWarLessons";

interface LessonCardProps {
  lesson: DojoLesson;
  isCompleted: boolean;
  onStart: (lessonId: string) => void;
}

export const LessonCard = ({ lesson, isCompleted, onStart }: LessonCardProps) => {
  return (
    <Card className={`border-2 transition-all hover:shadow-lg ${isCompleted ? 'border-primary bg-primary/5' : 'border-border'}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Chapter {lesson.chapter}</Badge>
              {isCompleted && (
                <Badge variant="default" className="bg-primary">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            {lesson.subtitle && (
              <CardDescription className="text-base font-medium">
                {lesson.subtitle}
              </CardDescription>
            )}
          </div>
          <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
        </div>
        <CardDescription className="line-clamp-3 mt-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold mb-2">Key Points:</p>
            <ul className="text-sm space-y-1">
              {lesson.keyPoints.slice(0, 3).map((point, idx) => (
                <li key={idx} className="text-muted-foreground">• {point}</li>
              ))}
            </ul>
          </div>
          <Button 
            onClick={() => onStart(lesson.id)} 
            className="w-full"
            variant={isCompleted ? "outline" : "default"}
          >
            {isCompleted ? "Review Lesson" : "Begin Training"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};