import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, BookOpen, GraduationCap, Headphones, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  compass: Compass,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
};

export default function TrainingCourses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["training-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_courses")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEO title="Audio Training Courses — Phototheology University" description="Free audio training courses for all subscribers. Master the Palace method through guided lessons." />
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            Audio Training Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Listen and learn. Each course includes audio narration with read-along transcripts and a downloadable PDF companion.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => {
              const Icon = iconMap[course.icon || "book-open"] || BookOpen;
              return (
                <Link key={course.id} to={`/university/training/${course.slug}`}>
                  <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground leading-tight">{course.title}</h3>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {course.lesson_count} lessons
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Headphones className="h-3.5 w-3.5" />
                        Free for subscribers
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
