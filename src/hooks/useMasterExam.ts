import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ExamQuestion {
  id: number;
  category: string;
  type: "mc" | "tf" | "sa";
  difficulty: "intermediate" | "advanced" | "master";
  question: string;
  options?: string[];
  scripture_ref?: string;
}

export interface ExamResult {
  id: number;
  category: string;
  type: string;
  question: string;
  correct_answer: string;
  user_answer: string;
  correct: boolean;
  earned: number;
  feedback: string;
  explanation: string;
}

export interface CategoryScore {
  earned: number;
  possible: number;
  percentage: number;
}

export interface ExamAttempt {
  id: string;
  score: number | null;
  total_correct: number | null;
  total_questions: number;
  category_scores: Record<string, CategoryScore> | null;
  status: string;
  attempt_number: number;
  time_used_seconds: number | null;
  created_at: string;
  started_at: string | null;
}

export interface GradingResults {
  score: number;
  total_correct: number;
  total_questions: number;
  category_scores: Record<string, CategoryScore>;
  per_question: ExamResult[];
}

type ExamPhase = "intro" | "generating" | "active" | "submitting" | "results";

export function useMasterExam() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [examId, setExamId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [results, setResults] = useState<GradingResults | null>(null);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Fetch history on mount
  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit on timer expiry
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Auto-save every 60 seconds
  useEffect(() => {
    if (phase !== "active" || !examId) {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      return;
    }

    autoSaveRef.current = setInterval(() => {
      saveProgress();
    }, 60000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [phase, examId, answers]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("master_exam_attempts")
        .select("id, score, total_correct, total_questions, category_scores, status, attempt_number, time_used_seconds, created_at, started_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory((data as any[]) || []);
    } catch (err) {
      console.error("Failed to fetch exam history:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateExam = async () => {
    if (!user) return;
    setPhase("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-master-exam");

      if (error) {
        console.error("Edge function error:", error);
        // Try to extract the real error message
        const msg = (error as any)?.message || (error as any)?.context?.body || String(error);
        throw new Error(msg);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.questions || !data?.exam_id) {
        throw new Error("Invalid response from server");
      }

      setExamId(data.exam_id);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentIndex(0);
      setFlagged(new Set());
      setTimeRemaining(data.time_limit_seconds || 5400);
      startTimeRef.current = Date.now();
      setPhase("active");
    } catch (err: any) {
      console.error("Failed to generate exam:", err);
      toast({
        title: "Generation Failed",
        description: err?.message || "Could not generate the exam. Please try again.",
        variant: "destructive",
      });
      setPhase("intro");
    }
  };

  const resumeExam = async (attemptId: string) => {
    if (!user) return;
    setPhase("generating");

    try {
      const { data: exam, error } = await (supabase
        .from("master_exam_attempts" as any)
        .select("*")
        .eq("id", attemptId)
        .eq("user_id", user.id)
        .single() as any);

      if (error || !exam) throw new Error("Exam not found");
      if (exam.status !== "in_progress") throw new Error("Exam is not resumable");

      // Strip answer data from questions for client
      const clientQuestions = (exam.questions_data as any[]).map((q: any) => ({
        id: q.id,
        category: q.category,
        type: q.type,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        scripture_ref: q.scripture_ref,
      }));

      setExamId(exam.id);
      setQuestions(clientQuestions);
      setAnswers(exam.user_answers || {});
      setCurrentIndex(0);
      setFlagged(new Set());

      // Calculate remaining time
      const elapsed = exam.time_used_seconds || 0;
      setTimeRemaining(Math.max(0, (exam.time_limit_seconds || 5400) - elapsed));
      startTimeRef.current = Date.now() - elapsed * 1000;
      setPhase("active");
    } catch (err) {
      console.error("Failed to resume exam:", err);
      toast({
        title: "Resume Failed",
        description: "Could not resume the exam.",
        variant: "destructive",
      });
      setPhase("intro");
    }
  };

  const saveProgress = useCallback(async () => {
    if (!examId || !user) return;

    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      await (supabase
        .from("master_exam_attempts" as any)
        .update({
          user_answers: answers,
          time_used_seconds: timeUsed,
        })
        .eq("id", examId) as any);
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }, [examId, user, answers]);

  const submitExam = useCallback(async () => {
    if (!examId || !user || phase === "submitting") return;
    setPhase("submitting");

    // Stop timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);

    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const { data, error } = await supabase.functions.invoke("grade-master-exam", {
        body: {
          exam_id: examId,
          answers,
          time_used_seconds: timeUsed,
        },
      });

      if (error) throw error;

      setResults(data);
      setPhase("results");
      fetchHistory(); // Refresh history
    } catch (err) {
      console.error("Failed to submit exam:", err);
      toast({
        title: "Submission Failed",
        description: "Could not grade the exam. Your answers have been saved — try again.",
        variant: "destructive",
      });
      setPhase("active");
    }
  }, [examId, user, answers, phase]);

  const setAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const toggleFlag = useCallback((questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, []);

  const abandonExam = useCallback(async () => {
    if (!examId || !user) return;

    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);

    try {
      await (supabase
        .from("master_exam_attempts" as any)
        .update({
          status: "abandoned",
          user_answers: answers,
          time_used_seconds: timeUsed,
        })
        .eq("id", examId) as any);
    } catch (err) {
      console.error("Failed to abandon exam:", err);
    }

    setPhase("intro");
    setExamId(null);
    setQuestions([]);
    setAnswers({});
    fetchHistory();
  }, [examId, user, answers]);

  const resetToIntro = useCallback(() => {
    setPhase("intro");
    setExamId(null);
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setCurrentIndex(0);
    setFlagged(new Set());
  }, []);

  const bestScore = history
    .filter((h) => h.status === "completed" && h.score !== null)
    .reduce((best, h) => Math.max(best, h.score!), 0);

  const inProgressExam = history.find((h) => h.status === "in_progress");

  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;

  return {
    phase,
    questions,
    answers,
    currentIndex,
    setCurrentIndex,
    flagged,
    examId,
    timeRemaining,
    history,
    results,
    loading,
    bestScore,
    inProgressExam,
    answeredCount,
    generateExam,
    resumeExam,
    submitExam,
    saveProgress,
    setAnswer,
    toggleFlag,
    abandonExam,
    resetToIntro,
  };
}
