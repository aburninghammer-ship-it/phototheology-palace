import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Download, Loader2, Headphones, BookOpen, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

export default function TrainingCourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { subscription } = useSubscription();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["training-course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_courses")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["training-lessons", course?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_lessons")
        .select("*")
        .eq("course_id", course!.id)
        .order("lesson_number");
      if (error) throw error;
      return data;
    },
    enabled: !!course?.id,
  });

  const hasAccess = subscription.hasAccess || subscription.status === 'active' || subscription.status === 'trial';

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async (lesson: any) => {
    if (!hasAccess) {
      toast.error("Subscribe to access audio training courses");
      return;
    }

    // If same lesson, toggle
    if (activeLesson === lesson.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setActiveLesson(lesson.id);

    // If audio exists, play it
    if (lesson.audio_storage_path) {
      const { data: urlData } = supabase.storage
        .from("training-audio")
        .getPublicUrl(lesson.audio_storage_path);
      
      const audio = new Audio(urlData.publicUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
      return;
    }

    // Generate audio on the fly
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-training-audio", {
        body: { lessonId: lesson.id },
      });
      if (error) throw error;
      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio generation error:", err);
      toast.error("Could not generate audio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!course?.pdf_storage_path) return;
    const { data } = supabase.storage
      .from("training-pdfs")
      .getPublicUrl(course.pdf_storage_path);
    window.open(data.publicUrl, "_blank");
  };

  const isLoading = courseLoading || lessonsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return <div className="px-4 py-12 text-center text-muted-foreground">Course not found.</div>;
  }

  return (
    <>
      <SEO title={`${course.title} — Audio Training`} description={course.description || ""} />
      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        <Link to="/university/training" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-1">{course.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="secondary">{lessons?.length || 0} lessons</Badge>
            <Badge variant="outline" className="gap-1">
              <Headphones className="h-3 w-3" /> Voice: {course.voice}
            </Badge>
            {course.pdf_storage_path && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadPdf}>
                <Download className="h-3.5 w-3.5" /> PDF Companion
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {lessons?.map((lesson) => {
            const isActive = activeLesson === lesson.id;
            return (
              <Card key={lesson.id} className={isActive ? "border-primary/40 shadow-sm" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Button
                      variant={isActive && isPlaying ? "default" : "outline"}
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-full"
                      onClick={() => handlePlay(lesson)}
                      disabled={isGenerating && isActive}
                    >
                      {isGenerating && isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isActive && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Lesson {lesson.lesson_number}
                        </span>
                        {lesson.audio_storage_path && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">ready</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mt-0.5">{lesson.title}</h3>
                      
                      {/* Read-along transcript */}
                      {isActive && lesson.transcript && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 max-h-60 overflow-y-auto">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <FileText className="h-3 w-3" /> Read Along
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {lesson.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!hasAccess && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-semibold">Subscribe to unlock audio</p>
              <p className="text-sm text-muted-foreground mt-1">All training courses are free with any subscription.</p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
