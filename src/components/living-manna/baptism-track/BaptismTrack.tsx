import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, Lock, CheckCircle2, PlayCircle, ChevronRight, Droplets, Award } from "lucide-react";
import { toast } from "sonner";
import { BaptismLesson } from "./BaptismLesson";

interface BaptismTrackProps {
  churchId: string;
}

interface BaptismLessonData {
  id: string;
  fundamental_number: number;
  title: string;
  description: string | null;
  pt_map: any;
  scripture_pack: any;
  estimated_minutes: number;
  prerequisites: string[];
}

interface CandidateProgress {
  id: string;
  lesson_id: string;
  state: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  percent_complete: number;
  last_step: string | null;
  quiz_best_score: number | null;
  confidence: number | null;
  completion_date: string | null;
}

interface BaptismCandidate {
  id: string;
  user_id: string;
  name: string;
  church_id: string;
}

export function BaptismTrack({ churchId }: BaptismTrackProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<BaptismLessonData | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);

  // Fetch candidate record for current user
  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ["baptism-candidate", user?.id, churchId],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("baptism_candidates")
        .select("*")
        .eq("user_id", user.id)
        .eq("church_id", churchId)
        .maybeSingle();
      if (error) throw error;
      return data as BaptismCandidate | null;
    },
    enabled: !!user?.id && !!churchId,
  });

  useEffect(() => {
    if (candidate) {
      setCandidateId(candidate.id);
    }
  }, [candidate]);

  // Fetch all lessons
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["baptism-lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("baptism_lessons")
        .select("*")
        .order("fundamental_number", { ascending: true });
      if (error) throw error;
      console.log('Fetched lessons from Supabase:', data);
      if (data && data.length > 0) {
        console.log('First lesson scripture_pack:', data[0].scripture_pack);
      }
      return data as BaptismLessonData[];
    },
  });

  // Fetch candidate's progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["baptism-progress", candidateId],
    queryFn: async () => {
      if (!candidateId) return [];
      const { data, error } = await supabase
        .from("baptism_candidate_progress")
        .select("*")
        .eq("candidate_id", candidateId);
      if (error) throw error;
      return data as CandidateProgress[];
    },
    enabled: !!candidateId,
  });

  // Create candidate record if needed
  const createCandidateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data: profile } = await (supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single() as any);

      const { data, error } = await supabase
        .from("baptism_candidates")
        .insert({
          user_id: user.id,
          church_id: churchId,
          name: profile?.display_name || profile?.username || "Candidate",
          stage: "interested",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setCandidateId(data.id);
      queryClient.invalidateQueries({ queryKey: ["baptism-candidate"] });
      toast.success("Welcome to the Baptism Track!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start baptism track");
    },
  });

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lesson: BaptismLessonData): boolean => {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
    if (!progress) return false;

    return lesson.prerequisites.every((prereqId: string) => {
      const prereqProgress = progress.find(p => p.lesson_id === prereqId);
      return prereqProgress?.state === 'completed';
    });
  };

  // Get progress for a lesson
  const getLessonProgress = (lessonId: string): CandidateProgress | undefined => {
    return progress?.find(p => p.lesson_id === lessonId);
  };

  // Calculate overall progress
  const completedLessons = progress?.filter(p => p.state === 'completed').length || 0;
  const totalLessons = lessons?.length || 28;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  // Get status badge for a lesson
  const getStatusBadge = (lesson: BaptismLessonData) => {
    const lessonProgress = getLessonProgress(lesson.id);
    const unlocked = isLessonUnlocked(lesson);

    if (!unlocked) {
      return <Badge variant="outline" className="text-muted-foreground"><Lock className="h-3 w-3 mr-1" />Locked</Badge>;
    }
    if (lessonProgress?.state === 'completed') {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Complete</Badge>;
    }
    if (lessonProgress?.state === 'in_progress') {
      return <Badge className="bg-blue-500"><PlayCircle className="h-3 w-3 mr-1" />{lessonProgress.percent_complete}%</Badge>;
    }
    if (lessonProgress?.state === 'needs_review') {
      return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">Review</Badge>;
    }
    return <Badge variant="outline">Start</Badge>;
  };

  // Loading state
  if (candidateLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If viewing a specific lesson
  if (selectedLesson && candidateId) {
    console.log('Selected lesson data:', selectedLesson);
    console.log('Scripture pack:', selectedLesson.scripture_pack);
    console.log('Scripture pack type:', typeof selectedLesson.scripture_pack);
    return (
      <BaptismLesson
        lesson={selectedLesson}
        candidateId={candidateId}
        progress={getLessonProgress(selectedLesson.id)}
        onBack={() => {
          setSelectedLesson(null);
          queryClient.invalidateQueries({ queryKey: ["baptism-progress"] });
        }}
      />
    );
  }

  // Not enrolled yet
  if (!candidate) {
    return (
      <div className="space-y-6">
        <Card variant="glass">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Droplets className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Begin Your Baptism Journey</CardTitle>
            <CardDescription className="text-base max-w-lg mx-auto">
              Walk through the 28 Fundamental Beliefs with Jeeves as your personal guide.
              Each lesson uses the Phototheology Palace method to deepen your understanding
              and prepare you for this sacred step.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
              <div className="p-3 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">28</div>
                <div className="text-xs text-muted-foreground">Lessons</div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">PT</div>
                <div className="text-xs text-muted-foreground">Method</div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">AI</div>
                <div className="text-xs text-muted-foreground">Guided</div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">KJV</div>
                <div className="text-xs text-muted-foreground">Scripture</div>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => createCandidateMutation.mutate()}
              disabled={createCandidateMutation.isPending}
            >
              {createCandidateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Droplets className="h-4 w-4 mr-2" />
              )}
              Start Baptism Track
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main track view
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>28 Fundamental Beliefs</CardTitle>
                <CardDescription>Your journey to baptism</CardDescription>
              </div>
            </div>
            {completedLessons === totalLessons && (
              <Badge className="bg-amber-500 text-white">
                <Award className="h-4 w-4 mr-1" />
                Ready for Interview
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={overallProgress} className="flex-1 h-3" />
            <span className="text-sm font-medium text-muted-foreground min-w-[80px] text-right">
              {completedLessons} / {totalLessons} complete
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {lessons?.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson);
          const lessonProgress = getLessonProgress(lesson.id);

          return (
            <Card
              key={lesson.id}
              variant="glass"
              className={`transition-all cursor-pointer ${
                unlocked
                  ? "hover:border-primary/50 hover:shadow-md"
                  : "opacity-60 cursor-not-allowed"
              } ${lessonProgress?.state === 'completed' ? 'border-green-500/30 bg-green-500/5' : ''}`}
              onClick={() => unlocked && setSelectedLesson(lesson)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      lessonProgress?.state === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {lesson.fundamental_number}
                    </div>
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  {getStatusBadge(lesson)}
                  {unlocked && (
                    <Button variant="ghost" size="sm" className="h-8">
                      {lessonProgress?.state === 'completed' ? 'Review' : 'Continue'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
                {lessonProgress?.state === 'in_progress' && (
                  <Progress value={lessonProgress.percent_complete} className="h-1 mt-2" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
