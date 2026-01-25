import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Loader2, ArrowLeft, ArrowRight, BookOpen, Brain, Send,
  Sparkles, CheckCircle2, AlertTriangle, ChevronRight,
  MessageSquare, Target, Lightbulb, History, Award,
  HelpCircle, BookMarked, Heart, Pencil
} from "lucide-react";
import { toast } from "sonner";

// Helper to safely parse JSON fields that might be strings
const parseJsonField = (field: any): any[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (typeof field === 'object') {
    return Object.values(field);
  }
  return [];
};

// Helper to safely parse JSON object fields
const parseJsonObject = (field: any): any => {
  if (!field) return {};
  if (typeof field === 'object' && !Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return {};
    }
  }
  return {};
};

interface BaptismLessonProps {
  lesson: {
    id: string;
    fundamental_number: number;
    title: string;
    description: string | null;
    pt_map: any;
    scripture_pack: any;
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
    scriptures?: Array<{ ref: string; text: string; why: string }>;
    questions?: string[];
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
}

// Lesson sections for structured flow
type LessonSection = 'welcome' | 'scripture' | 'teaching' | 'history' | 'quiz' | 'reflection' | 'summary';

const SECTION_LABELS: Record<LessonSection, string> = {
  welcome: 'Welcome',
  scripture: 'Scripture Foundation',
  teaching: 'Teaching & Discussion',
  history: 'Adventist Heritage',
  quiz: 'Knowledge Check',
  reflection: 'Personal Reflection',
  summary: 'Summary & Commitment',
};

export function BaptismLesson({ lesson, candidateId, progress, onBack }: BaptismLessonProps) {
  const queryClient = useQueryClient();
  const [currentSection, setCurrentSection] = useState<LessonSection>('welcome');
  const [userResponse, setUserResponse] = useState("");
  const [guidance, setGuidance] = useState<JeevesGuidance | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'jeeves', content: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [verseTexts, setVerseTexts] = useState<Record<string, string>>({});
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [teachingContent, setTeachingContent] = useState<string | null>(null);
  const [historyContent, setHistoryContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Parse scripture_pack
  const scriptures = useMemo(() => {
    const parsed = parseJsonField(lesson.scripture_pack);
    console.log('Parsed scriptures:', parsed);
    return parsed;
  }, [lesson.scripture_pack]);

  const ptPath = useMemo(() => parseJsonObject(lesson.pt_map), [lesson.pt_map]);

  const sectionOrder: LessonSection[] = ['welcome', 'scripture', 'teaching', 'history', 'quiz', 'reflection', 'summary'];
  const currentSectionIndex = sectionOrder.indexOf(currentSection);
  const progressPercent = Math.round(((currentSectionIndex + 1) / sectionOrder.length) * 100);

  // Create attempt record on mount
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

  // Fetch verse texts when scriptures change
  useEffect(() => {
    const fetchVerses = async () => {
      if (!scriptures || scriptures.length === 0) {
        setLoadingVerses(false);
        return;
      }

      setLoadingVerses(true);
      const texts: Record<string, string> = {};

      for (const scripture of scriptures.slice(0, 7)) {
        const ref = scripture?.ref || scripture?.reference || '';
        if (!ref) continue;

        try {
          const response = await fetch(
            `https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`
          );
          if (response.ok) {
            const data = await response.json();
            texts[ref] = data.text?.trim() || '';
          }
        } catch (e) {
          console.error('Error fetching verse:', ref, e);
        }
      }
      setVerseTexts(texts);
      setLoadingVerses(false);
    };
    fetchVerses();
  }, [scriptures]);

  // Load teaching content from Jeeves when entering teaching section
  useEffect(() => {
    if (currentSection === 'teaching' && !teachingContent && !loadingContent) {
      loadTeachingContent();
    }
    if (currentSection === 'history' && !historyContent && !loadingContent) {
      loadHistoryContent();
    }
  }, [currentSection]);

  const loadTeachingContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Please teach me about "${lesson.title}" in detail. Give me a comprehensive explanation of this doctrine including: 1) The biblical foundation with key Scripture references explained, 2) What this belief means in practical terms, 3) Why this doctrine matters for salvation and daily Christian living, 4) How this connects to other Adventist beliefs, 5) Common misconceptions and how to address them. Use Scripture extensively (KJV).`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'teaching',
          mode: 'deep_dive',
          scriptureContext: scriptures.map((s: any) => `${s.ref || s.reference}: ${s.why || s.meaning}`).join("\n"),
        },
      });

      if (data?.guidance?.overallResponse) {
        setTeachingContent(data.guidance.overallResponse);
        if (data.guidance.memoryAnchors) {
          setGuidance(prev => ({ ...prev, memoryAnchors: data.guidance.memoryAnchors }));
        }
      }
    } catch (error) {
      console.error('Error loading teaching content:', error);
      setTeachingContent(`# ${lesson.title}\n\n${lesson.description}\n\nClick "Ask Jeeves" below to explore this topic with your AI guide.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadHistoryContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Tell me the complete Adventist history behind the doctrine of "${lesson.title}". Include: 1) Who were the key people involved in discovering or developing this belief? 2) What were the specific circumstances, dates, and locations? 3) Any visions or significant events? 4) How did this truth spread through the early Adventist movement? 5) What challenges or controversies surrounded this belief? Make it vivid and personal - help me feel like I'm there with the pioneers.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'history',
          mode: 'deep_dive',
        },
      });

      if (data?.guidance?.overallResponse) {
        setHistoryContent(data.guidance.overallResponse);
      }
    } catch (error) {
      console.error('Error loading history content:', error);
      setHistoryContent(`The Adventist understanding of "${lesson.title}" developed through careful Bible study and the guidance of the Holy Spirit. Click "Learn More" to explore this history with Jeeves.`);
    } finally {
      setLoadingContent(false);
    }
  };

  // Talk to Jeeves
  const askJeeves = useCallback(async (message: string) => {
    if (message.trim().length < 3 || isAnalyzing) return;

    setIsAnalyzing(true);
    setConversationHistory(prev => [...prev, { role: 'user', content: message }]);

    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: message,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: currentSection,
          currentStep: `${currentSection}_${conversationHistory.length}`,
          mode: 'deep_dive',
          sessionHistory: conversationHistory.slice(-5).map(c => `${c.role}: ${c.content}`),
          scriptureContext: scriptures.map((s: any) => `${s.ref || s.reference}: ${s.why || s.meaning}`).join("\n"),
        },
      });

      if (error) throw error;

      if (data.guidance) {
        setGuidance(data.guidance);
        setConversationHistory(prev => [...prev, { role: 'jeeves', content: data.guidance.overallResponse }]);
      }
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error(error.message || "Failed to get guidance from Jeeves");
    } finally {
      setIsAnalyzing(false);
    }
  }, [lesson, currentSection, conversationHistory, isAnalyzing, scriptures]);

  // Update progress in database
  const updateProgress = async (percentComplete: number) => {
    const { error } = await supabase
      .from("baptism_candidate_progress")
      .upsert({
        candidate_id: candidateId,
        lesson_id: lesson.id,
        state: percentComplete >= 100 ? "completed" : "in_progress",
        percent_complete: percentComplete,
        last_step: currentSection,
        completion_date: percentComplete >= 100 ? new Date().toISOString() : null,
        last_active_at: new Date().toISOString(),
      }, {
        onConflict: "candidate_id,lesson_id",
      });

    if (error) console.error("Progress update error:", error);
    queryClient.invalidateQueries({ queryKey: ["baptism-progress"] });
  };

  // Navigate sections
  const goToNextSection = () => {
    const nextIndex = currentSectionIndex + 1;
    if (nextIndex < sectionOrder.length) {
      setCurrentSection(sectionOrder[nextIndex]);
      updateProgress(progressPercent);
    }
  };

  const goToPrevSection = () => {
    const prevIndex = currentSectionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sectionOrder[prevIndex]);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (userResponse.trim().length < 3) {
      toast.error("Please write a longer response");
      return;
    }
    askJeeves(userResponse);
    setUserResponse("");
  };

  // Quiz questions (generated based on lesson)
  const quizQuestions = useMemo(() => [
    {
      question: `What is the main biblical foundation for "${lesson.title}"?`,
      options: [
        scriptures[0]?.ref || "Genesis 1:1",
        "A tradition passed down by the church",
        "Human reasoning and philosophy",
        "Cultural customs"
      ],
      correct: 0
    },
    {
      question: "Why is this doctrine important for Christians today?",
      options: [
        "It's just historical information",
        "It helps us understand God's character and plan",
        "It's only for theologians",
        "It doesn't really matter"
      ],
      correct: 1
    },
    {
      question: "How did early Adventists come to understand this truth?",
      options: [
        "They copied from other churches",
        "Through careful Bible study and prayer",
        "It was revealed in dreams only",
        "They made it up"
      ],
      correct: 1
    }
  ], [lesson.title, scriptures]);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correct = quizQuestions.filter((q, i) => parseInt(quizAnswers[i]) === q.correct).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    if (score >= 70) {
      toast.success(`Great job! You scored ${score}%`);
    } else {
      toast.info(`You scored ${score}%. Review the teaching section to improve.`);
    }
  };

  // Complete lesson
  const completeLesson = async () => {
    await updateProgress(100);
    toast.success("Lesson completed! Great work!");
    onBack();
  };

  // Get scripture reference safely
  const getRef = (s: any) => s?.ref || s?.reference || 'Scripture';
  const getWhy = (s: any) => s?.why || s?.meaning || s?.explanation || '';

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
            <div className="flex-1">
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.estimated_minutes} min • {SECTION_LABELS[currentSection]}</CardDescription>
            </div>
          </div>
          {/* Section Progress */}
          <div className="flex items-center gap-1 mt-4">
            {sectionOrder.map((section, idx) => (
              <div
                key={section}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  idx < currentSectionIndex ? 'bg-green-500' :
                  idx === currentSectionIndex ? 'bg-primary' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{SECTION_LABELS[currentSection]}</span>
            <span>{currentSectionIndex + 1} of {sectionOrder.length}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card variant="glass" className="min-h-[550px]">
        <CardContent className="p-6">
          {/* WELCOME SECTION */}
          {currentSection === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Target className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3">{lesson.title}</h2>
                <p className="text-muted-foreground text-lg">{lesson.description}</p>
              </div>

              {/* PT Path Preview */}
              {ptPath?.palace_path?.[0] && (
                <div className="max-w-md mx-auto p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-violet-600 mb-2">
                    <Sparkles className="h-4 w-4" />
                    Phototheology Path
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{ptPath.palace_path[0].floor}</span>
                    <span className="text-muted-foreground"> → {ptPath.palace_path[0].rooms?.join(", ")}</span>
                  </div>
                </div>
              )}

              {/* What You'll Learn */}
              <div className="max-w-lg mx-auto space-y-3">
                <h3 className="font-medium text-center">In this comprehensive lesson, you will:</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm">Study 7+ key Scripture passages in depth</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Receive detailed teaching on this doctrine</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <History className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Learn how Adventist pioneers discovered this truth</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <HelpCircle className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">Test your knowledge with a quiz</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm">Apply this truth to your life</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={goToNextSection}>
                  Begin Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* SCRIPTURE SECTION */}
          {currentSection === 'scripture' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Scripture Foundation
                </h2>
                <p className="text-muted-foreground">Read and meditate on these key passages</p>
              </div>

              {/* Memory Verse */}
              {scriptures.length > 0 && (
                <div className="max-w-2xl mx-auto p-4 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <BookMarked className="h-4 w-4" />
                    Memory Verse
                  </div>
                  <p className="font-medium text-lg">{getRef(scriptures[0])}</p>
                  {verseTexts[getRef(scriptures[0])] && (
                    <blockquote className="mt-2 text-sm italic border-l-2 border-primary pl-3">
                      "{verseTexts[getRef(scriptures[0])]}"
                    </blockquote>
                  )}
                </div>
              )}

              <ScrollArea className="h-[380px] pr-4">
                <div className="space-y-4">
                  {loadingVerses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading Scripture...</span>
                    </div>
                  ) : scriptures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Scripture references are loading...</p>
                    </div>
                  ) : (
                    scriptures.slice(0, 7).map((scripture: any, idx: number) => (
                      <Card key={idx} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-primary font-medium">
                              {getRef(scripture)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">KJV</span>
                          </div>
                          {verseTexts[getRef(scripture)] ? (
                            <blockquote className="text-sm italic border-l-2 border-muted pl-3 my-2 text-foreground/90">
                              "{verseTexts[getRef(scripture)]}"
                            </blockquote>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Loading verse text...
                            </p>
                          )}
                          {getWhy(scripture) && (
                            <div className="flex items-start gap-2 mt-3 p-2 rounded bg-amber-500/10">
                              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-muted-foreground">{getWhy(scripture)}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Teaching
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* TEACHING SECTION */}
          {currentSection === 'teaching' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Understanding {lesson.title}
                </h2>
                <p className="text-muted-foreground">Deep dive into this fundamental belief</p>
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Preparing your lesson content...</p>
                </div>
              ) : (
                <ScrollArea className="h-[350px] pr-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {teachingContent || lesson.description}
                    </div>
                  </div>
                </ScrollArea>
              )}

              {/* Chat with Jeeves */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="font-medium">Ask Jeeves</h3>
                  <span className="text-xs text-muted-foreground">Have questions? Ask your AI guide.</span>
                </div>

                {conversationHistory.length > 0 && (
                  <ScrollArea className="h-[150px] border rounded-lg p-3 bg-muted/30 mb-3">
                    <div className="space-y-2">
                      {conversationHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-sm ${
                            msg.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-violet-500/10 mr-8'
                          }`}
                        >
                          <span className="text-xs text-muted-foreground">{msg.role === 'user' ? 'You' : 'Jeeves'}:</span>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a question about this doctrine..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="min-h-[50px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleSubmit} disabled={isAnalyzing || userResponse.trim().length < 3}>
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Scripture
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to History
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* HISTORY SECTION */}
          {currentSection === 'history' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Adventist Heritage
                </h2>
                <p className="text-muted-foreground">How our pioneers discovered this truth</p>
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {historyContent || "Click 'Learn More' to explore the Adventist history of this doctrine."}
                    </div>
                  </div>
                </ScrollArea>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teaching
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Quiz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* QUIZ SECTION */}
          {currentSection === 'quiz' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" />
                  Knowledge Check
                </h2>
                <p className="text-muted-foreground">Test your understanding of "{lesson.title}"</p>
              </div>

              <div className="space-y-6">
                {quizQuestions.map((q, idx) => (
                  <Card key={idx} className={quizSubmitted ? (parseInt(quizAnswers[idx]) === q.correct ? 'border-green-500' : 'border-red-500') : ''}>
                    <CardContent className="p-4">
                      <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                      <RadioGroup
                        value={quizAnswers[idx]}
                        onValueChange={(value) => setQuizAnswers(prev => ({ ...prev, [idx]: value }))}
                        disabled={quizSubmitted}
                      >
                        {q.options.map((option, optIdx) => (
                          <div key={optIdx} className="flex items-center space-x-2">
                            <RadioGroupItem value={String(optIdx)} id={`q${idx}-opt${optIdx}`} />
                            <Label
                              htmlFor={`q${idx}-opt${optIdx}`}
                              className={quizSubmitted && optIdx === q.correct ? 'text-green-600 font-medium' : ''}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {quizSubmitted && parseInt(quizAnswers[idx]) !== q.correct && (
                        <p className="text-xs text-green-600 mt-2">Correct answer: {q.options[q.correct]}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!quizSubmitted ? (
                <Button
                  onClick={handleQuizSubmit}
                  className="w-full"
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit Answers
                </Button>
              ) : (
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={goToPrevSection}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Review History
                  </Button>
                  <Button onClick={goToNextSection}>
                    Continue to Reflection
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* REFLECTION SECTION */}
          {currentSection === 'reflection' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Personal Reflection
                </h2>
                <p className="text-muted-foreground">Apply this truth to your life</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Reflection Questions:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>What did the Holy Spirit teach you through this study?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>How does this belief change how you see God?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>What will you do differently because of what you've learned?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Who can you share this truth with?</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Write your personal reflection:
                  </label>
                  <Textarea
                    placeholder="What has God shown you through this lesson? How will you apply it?"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="min-h-[150px]"
                  />
                  {userResponse.length > 10 && (
                    <Button
                      variant="outline"
                      onClick={handleSubmit}
                      disabled={isAnalyzing}
                      className="mt-3"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 mr-2" />
                      )}
                      Get Jeeves' Encouragement
                    </Button>
                  )}
                </div>

                {guidance && (
                  <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-violet-500" />
                      <span className="font-medium text-sm">Jeeves says:</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{guidance.overallResponse}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quiz
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Summary
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* SUMMARY SECTION */}
          {currentSection === 'summary' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-500/10">
                    <Award className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
                <p className="text-muted-foreground">
                  You've studied "{lesson.title}"
                </p>
              </div>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">What You Learned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Scriptures:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scriptures.slice(0, 5).map((s: any, idx: number) => (
                        <Badge key={idx} variant="outline">{getRef(s)}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  My Commitment
                </h4>
                <p className="text-sm text-muted-foreground">
                  I have studied and understand the biblical teaching on "{lesson.title}"
                  and commit to living this truth as I prepare for baptism and beyond.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Review Reflection
                </Button>
                <Button onClick={completeLesson} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Lesson Complete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
