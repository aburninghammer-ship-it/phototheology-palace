import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { ExamType } from "@/components/master-exam/ExamTypeSelector";
import type { DiagnosticData } from "@/components/master-exam/DiagnosticReport";

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
  exam_type: string;
}

export interface GradingResults {
  score: number;
  total_correct: number;
  total_questions: number;
  category_scores: Record<string, CategoryScore>;
  per_question: ExamResult[];
  diagnostic?: DiagnosticData;
  exam_type?: string;
}

export interface QuestionGradeResult {
  correct: boolean;
  earned: number;
  feedback: string;
  challengeAccepted?: boolean;
  challengeFeedback?: string;
  challengeDenied?: boolean;
}

type ExamPhase = "intro" | "select_type" | "select_room" | "generating" | "active" | "submitting" | "results";

export function useMasterExam() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [selectedExamType, setSelectedExamType] = useState<ExamType>("master");
  const [selectedRoomCode, setSelectedRoomCode] = useState<string | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [examId, setExamId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(5400);
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [results, setResults] = useState<GradingResults | null>(null);
  const [loading, setLoading] = useState(true);

  // Per-question grading state
  const [questionGrades, setQuestionGrades] = useState<Record<number, QuestionGradeResult>>({});
  const [gradingQuestionId, setGradingQuestionId] = useState<number | null>(null);
  const [challengingQuestionId, setChallengingQuestionId] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  useEffect(() => {
    if (phase !== "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { submitExam(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "active" || !examId) {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      return;
    }
    autoSaveRef.current = setInterval(() => saveProgress(), 60000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [phase, examId, answers]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("master_exam_attempts")
        .select("id, score, total_correct, total_questions, category_scores, status, attempt_number, time_used_seconds, created_at, started_at, exam_type")
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

  const showTypeSelector = useCallback(() => {
    setPhase("select_type");
  }, []);

  const showRoomSelector = useCallback(() => {
    setPhase("select_room");
  }, []);

  const generateRoomExam = useCallback(async (roomCode: string, roomName: string) => {
    if (!user) return;
    setSelectedRoomCode(roomCode);
    setSelectedRoomName(roomName);
    setSelectedExamType("room_test" as ExamType);
    setPhase("generating");

    try {
      const { data, error } = await supabase.functions.invoke("generate-diagnostic-exam", {
        body: { exam_type: "room_test", room_code: roomCode, room_name: roomName },
      });

      if (error) {
        const msg = (error as any)?.message || String(error);
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);
      if (!data?.questions || !data?.exam_id) throw new Error("Invalid response from server");

      setExamId(data.exam_id);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentIndex(0);
      setFlagged(new Set());
      setQuestionGrades({});
      setTimeRemaining(data.time_limit_seconds || 2700);
      startTimeRef.current = Date.now();
      setPhase("active");
    } catch (err: any) {
      console.error("Failed to generate room exam:", err);
      toast({
        title: "Generation Failed",
        description: err?.message || "Could not generate the room test. Please try again.",
        variant: "destructive",
      });
      setPhase("select_room");
    }
  }, [user, toast]);

  const generateExam = useCallback(async (examType: ExamType = "master") => {
    if (!user) return;
    setSelectedExamType(examType);
    setPhase("generating");

    try {
      const functionName = examType === "master" ? "generate-master-exam" : "generate-diagnostic-exam";
      const body = examType === "master" ? undefined : { exam_type: examType };

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: body || undefined,
      });

      if (error) {
        const msg = (error as any)?.message || String(error);
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);
      if (!data?.questions || !data?.exam_id) throw new Error("Invalid response from server");

      setExamId(data.exam_id);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentIndex(0);
      setFlagged(new Set());
      setQuestionGrades({});
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
  }, [user, toast]);

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

      const clientQuestions = (exam.questions_data as any[]).map((q: any) => ({
        id: q.id, category: q.category, type: q.type, difficulty: q.difficulty,
        question: q.question, options: q.options, scripture_ref: q.scripture_ref,
      }));

      setSelectedExamType(exam.exam_type || "master");
      setExamId(exam.id);
      setQuestions(clientQuestions);
      setAnswers(exam.user_answers || {});
      setCurrentIndex(0);
      setFlagged(new Set());

      // Load per_question_grades from DB
      const savedGrades = (exam.per_question_grades as Record<string, any>) || {};
      const savedChallenges = (exam.challenge_data as Record<string, any>) || {};
      const loadedGrades: Record<number, QuestionGradeResult> = {};

      for (const [qId, grade] of Object.entries(savedGrades)) {
        const challenge = savedChallenges[qId];
        loadedGrades[Number(qId)] = {
          correct: grade.correct,
          earned: grade.earned,
          feedback: grade.feedback,
          challengeAccepted: challenge?.accepted === true ? true : undefined,
          challengeFeedback: challenge?.feedback,
          challengeDenied: challenge?.accepted === false ? true : undefined,
        };
      }
      setQuestionGrades(loadedGrades);

      const elapsed = exam.time_used_seconds || 0;
      setTimeRemaining(Math.max(0, (exam.time_limit_seconds || 5400) - elapsed));
      startTimeRef.current = Date.now() - elapsed * 1000;
      setPhase("active");
    } catch (err) {
      console.error("Failed to resume exam:", err);
      toast({ title: "Resume Failed", description: "Could not resume the exam.", variant: "destructive" });
      setPhase("intro");
    }
  };

  const saveProgress = useCallback(async () => {
    if (!examId || !user) return;
    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    try {
      await (supabase
        .from("master_exam_attempts" as any)
        .update({ user_answers: answers, time_used_seconds: timeUsed })
        .eq("id", examId) as any);
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }, [examId, user, answers]);

  const gradeQuestion = useCallback(async (questionId: number, answer: string) => {
    if (!examId || !user || gradingQuestionId) return;
    setGradingQuestionId(questionId);

    try {
      const { data, error } = await supabase.functions.invoke("grade-single-question", {
        body: { exam_id: examId, question_id: questionId, user_answer: answer },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setQuestionGrades((prev) => ({
        ...prev,
        [questionId]: {
          correct: data.correct,
          earned: data.earned,
          feedback: data.feedback,
        },
      }));
    } catch (err: any) {
      console.error("Failed to grade question:", err);
      toast({
        title: "Grading Failed",
        description: err?.message || "Could not grade the question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGradingQuestionId(null);
    }
  }, [examId, user, gradingQuestionId]);

  const challengeQuestion = useCallback(async (questionId: number, reasoning: string) => {
    if (!examId || !user || challengingQuestionId) return;
    setChallengingQuestionId(questionId);

    try {
      const { data, error } = await supabase.functions.invoke("challenge-exam-question", {
        body: { exam_id: examId, question_id: questionId, user_reasoning: reasoning },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setQuestionGrades((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          correct: data.accepted ? true : prev[questionId].correct,
          earned: data.accepted ? 1 : prev[questionId].earned,
          challengeAccepted: data.accepted ? true : undefined,
          challengeDenied: !data.accepted ? true : undefined,
          challengeFeedback: data.feedback,
        },
      }));
    } catch (err: any) {
      console.error("Failed to challenge question:", err);
      toast({
        title: "Challenge Failed",
        description: err?.message || "Could not submit the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChallengingQuestionId(null);
    }
  }, [examId, user, challengingQuestionId]);

  const submitExam = useCallback(async () => {
    if (!examId || !user || phase === "submitting") return;
    setPhase("submitting");
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const { data, error } = await supabase.functions.invoke("grade-master-exam", {
        body: {
          exam_id: examId,
          answers,
          time_used_seconds: timeUsed,
          mode: "finalize",
        },
      });
      if (error) throw error;
      setResults(data);
      setPhase("results");
      fetchHistory();
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
    // Clear grade if user changes answer on already-graded question
    setQuestionGrades((prev) => {
      if (prev[questionId]) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return prev;
    });
  }, []);

  const toggleFlag = useCallback((questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
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
        .update({ status: "abandoned", user_answers: answers, time_used_seconds: timeUsed })
        .eq("id", examId) as any);
    } catch (err) {
      console.error("Failed to abandon exam:", err);
    }
    setPhase("intro");
    setExamId(null);
    setQuestions([]);
    setAnswers({});
    setQuestionGrades({});
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
    setQuestionGrades({});
  }, []);

  const bestScore = history
    .filter((h) => h.status === "completed" && h.score !== null)
    .reduce((best, h) => Math.max(best, h.score!), 0);

  const inProgressExam = history.find((h) => h.status === "in_progress");
  const answeredCount = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;
  const gradedCount = Object.keys(questionGrades).length;

  return {
    phase,
    selectedExamType,
    selectedRoomCode,
    selectedRoomName,
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
    showTypeSelector,
    showRoomSelector,
    gradedCount,
    questionGrades,
    gradingQuestionId,
    challengingQuestionId,
    generateExam,
    generateRoomExam,
    resumeExam,
    submitExam,
    saveProgress,
    setAnswer,
    toggleFlag,
    abandonExam,
    resetToIntro,
    gradeQuestion,
    challengeQuestion,
  };
}
