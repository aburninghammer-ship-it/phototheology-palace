import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, BookOpen, Brain, Send, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface BaptismLessonProps {
  lesson: {
    id: string;
    fundamental_number: number;
    title: string;
    description: string | null;
    pt_map: any;
    scripture_pack: any[];
    estimated_minutes: number;
  };
  candidateId: string;
  progress?: {
    id: string;
    state: string;
    percent_complete: number;
    last_step: string | null;
  };
  onBack: () => void;
}

interface JeevesGuidance {
  overallResponse: string;
  currentSection?: {
    title: string;
    content: string;
    scriptures: Array<{ ref: string; text: string; why: string }>;
    questions: string[];
    options?: string[];
  };
  ptPath?: {
    floor: string;
    rooms: string[];
    principle?: string;
  };
  memoryAnchors?: string[];
  progressUpdate?: {
    lessonId: string;
    stepId: string;
    completedSections: string[];
    percentComplete: number;
    quiz?: { answered: number; correct: number; score: number };
    confidence: number;
    mode: string;
    keyTakeaways: string[];
    objections: string[];
    pastoralFlags: string[];
    nextStep: string;
  };
  readinessCheck?: {
    knowledge: string;
    heart: string;
    practice: string;
  };
}

export function BaptismLesson({ lesson, candidateId, progress, onBack }: BaptismLessonProps) {
  const queryClient = useQueryClient();
  const [userResponse, setUserResponse] = useState("");
  const [guidance, setGuidance] = useState<JeevesGuidance | null>(null);
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(progress?.last_step || "S1_Introduction");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const lastAnalyzedRef = useRef("");
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create or get attempt record
  useEffect(() => {
    const createAttempt = async () => {
      const { data, error } = await supabase
        .from("baptism_lesson_attempts")
        .insert({
          candidate_id: candidateId,
          lesson_id: lesson.id,
          mode: "normal",
        })
        .select()
        .single();

      if (!error && data) {
        setAttemptId(data.id);
      }
    };

    createAttempt();
  }, [candidateId, lesson.id]);

  // Initial welcome message
  useEffect(() => {
    if (!guidance) {
      setGuidance({
        overallResponse: `Welcome to Lesson ${lesson.fundamental_number}: **${lesson.title}**\n\n${lesson.description || ''}\n\nLet's begin by exploring what the Bible says about this fundamental truth. Type your thoughts, questions, or simply "ready" to start.`,
        currentSection: {
          title: "Introduction",
          content: `This lesson will guide you through the biblical foundation for "${lesson.title}" using the Phototheology Palace method.`,
          scriptures: lesson.scripture_pack?.slice(0, 3) || [],
          questions: ["What do you already know about this topic?", "Do you have any questions before we begin?"],
          options: ["I'm ready to learn", "I have a question", "Tell me more about this topic"],
        },
        ptPath: lesson.pt_map?.palace_path?.[0] || { floor: "Foundation Floor", rooms: ["Story Room"] },
      });
    }
  }, [lesson, guidance]);

  // Analyze response with Jeeves
  const analyzeWithJeeves = useCallback(async (response: string) => {
    if (response.trim().length < 5 || isAnalyzing) return;
    if (response === lastAnalyzedRef.current) return;

    setIsAnalyzing(true);
    lastAnalyzedRef.current = response;

    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: response,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          currentStep,
          sessionHistory: sessionHistory.slice(-5),
          scriptureContext: lesson.scripture_pack?.map((s: any) => `${s.ref}: ${s.why}`).join("\n"),
        },
      });

      if (error) throw error;

      if (data.guidance) {
        setGuidance(data.guidance);
        setSessionHistory(prev => [...prev, response]);

        // Update progress if provided
        if (data.guidance.progressUpdate) {
          const progressData = data.guidance.progressUpdate;
          setCurrentStep(progressData.nextStep || currentStep);

          // Update database
          await updateProgress(progressData);
        }
      }
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error(error.message || "Failed to get guidance");
    } finally {
      setIsAnalyzing(false);
    }
  }, [lesson, currentStep, sessionHistory, isAnalyzing]);

  // Update progress in database
  const updateProgress = async (progressData: any) => {
    const { error } = await supabase
      .from("baptism_candidate_progress")
      .upsert({
        candidate_id: candidateId,
        lesson_id: lesson.id,
        state: progressData.percentComplete >= 100 ? "completed" : "in_progress",
        percent_complete: progressData.percentComplete,
        last_step: progressData.nextStep,
        quiz_best_score: progressData.quiz?.score,
        confidence: progressData.confidence,
        pastoral_flags: progressData.pastoralFlags || [],
        completion_date: progressData.percentComplete >= 100 ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString(),
      }, {
        onConflict: "candidate_id,lesson_id",
      });

    if (error) {
      console.error("Progress update error:", error);
    }

    // Save response to attempt
    if (attemptId) {
      await supabase.from("baptism_lesson_responses").insert({
        attempt_id: attemptId,
        step_id: currentStep,
        user_response: userResponse,
        tags: progressData.objections || [],
      });
    }

    queryClient.invalidateQueries({ queryKey: ["baptism-progress"] });
  };

  // Handle submit
  const handleSubmit = () => {
    if (userResponse.trim().length < 3) {
      toast.error("Please write a longer response");
      return;
    }
    analyzeWithJeeves(userResponse);
    setUserResponse("");
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    setUserResponse(option);
    analyzeWithJeeves(option);
  };

  // Debounced analysis
  useEffect(() => {
    if (userResponse.trim().length >= 20) {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
      responseTimeoutRef.current = setTimeout(() => {
        // Only auto-analyze if it looks like a complete thought
        if (userResponse.endsWith(".") || userResponse.endsWith("?") || userResponse.endsWith("!")) {
          analyzeWithJeeves(userResponse);
        }
      }, 2000);
    }

    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, [userResponse, analyzeWithJeeves]);

  const scriptures = Array.isArray(lesson.scripture_pack) ? lesson.scripture_pack : [];
  const displayScriptures = guidance?.currentSection?.scriptures || scriptures.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Track
            </Button>
            <Badge variant="outline">
              Lesson {lesson.fundamental_number} of 28
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
              {lesson.fundamental_number}
            </div>
            <div>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.estimated_minutes} min • {currentStep}</CardDescription>
            </div>
          </div>
          <Progress value={guidance?.progressUpdate?.percentComplete || progress?.percent_complete || 0} className="h-2 mt-3" />
        </CardHeader>
      </Card>

      {/* Three Panel Layout */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
        {/* Scripture Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Scripture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-y-auto max-h-[calc(600px-60px)]">
              <div className="space-y-4">
                {displayScriptures.map((scripture: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium text-primary text-sm mb-1">
                      {scripture.ref}
                    </div>
                    {scripture.text && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{scripture.text}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {scripture.why}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Response Panel */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                Your Response
              </CardTitle>
              <CardDescription className="text-xs">
                Write your thoughts, answer questions, or ask Jeeves
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 flex flex-col h-[calc(100%-80px)]">
              <Textarea
                placeholder="Type your response here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                className="flex-1 min-h-[200px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    handleSubmit();
                  }
                }}
              />

              {/* Quick Options */}
              {guidance?.currentSection?.options && guidance.currentSection.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {guidance.currentSection.options.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleOptionClick(option)}
                      disabled={isAnalyzing}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isAnalyzing || userResponse.trim().length < 3}
                className="mt-3"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send to Jeeves
              </Button>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Jeeves Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-500" />
                Jeeves
              </CardTitle>
              <CardDescription className="text-xs">
                Your Phototheology guide
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 overflow-y-auto max-h-[calc(600px-80px)]">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-500 mb-3" />
                  <p className="text-sm text-muted-foreground">Jeeves is thinking...</p>
                </div>
              ) : guidance ? (
                <div className="space-y-4">
                  {/* Main Response */}
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{guidance.overallResponse}</p>
                  </div>

                  {/* PT Path */}
                  {guidance.ptPath && (
                    <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <div className="text-xs font-medium text-violet-600 mb-1">PT Path</div>
                      <div className="text-sm">
                        <span className="font-medium">{guidance.ptPath.floor}</span>
                        {guidance.ptPath.rooms && (
                          <span className="text-muted-foreground"> → {guidance.ptPath.rooms.join(", ")}</span>
                        )}
                      </div>
                      {guidance.ptPath.principle && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {guidance.ptPath.principle}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Questions */}
                  {guidance.currentSection?.questions && guidance.currentSection.questions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Questions to Consider:</div>
                      {guidance.currentSection.questions.map((q, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Memory Anchors */}
                  {guidance.memoryAnchors && guidance.memoryAnchors.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="text-xs font-medium text-amber-600 mb-2">Memory Anchors</div>
                      <ul className="text-sm space-y-1">
                        {guidance.memoryAnchors.map((anchor, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-amber-500" />
                            {anchor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pastoral Flags */}
                  {guidance.progressUpdate?.pastoralFlags && guidance.progressUpdate.pastoralFlags.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 text-xs font-medium text-red-600 mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        Important Note
                      </div>
                      <p className="text-sm">
                        If you're experiencing difficulties, please reach out to your pastor or mentor.
                      </p>
                    </div>
                  )}

                  {/* Readiness Check (shown at end of lesson) */}
                  {guidance.readinessCheck && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-xs font-medium text-green-600 mb-2">Readiness Check</div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Knowledge:</strong> {guidance.readinessCheck.knowledge}</div>
                        <div><strong>Heart:</strong> {guidance.readinessCheck.heart}</div>
                        <div><strong>Practice:</strong> {guidance.readinessCheck.practice}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Brain className="h-12 w-12 text-violet-500/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Jeeves is ready to guide you
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
