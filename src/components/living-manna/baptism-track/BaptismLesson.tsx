import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2, ArrowLeft, ArrowRight, BookOpen, Brain, Send,
  Sparkles, CheckCircle2, AlertTriangle, ChevronRight,
  MessageSquare, Target, Lightbulb, History
} from "lucide-react";
import { toast } from "sonner";

// Helper to safely parse JSON fields that might be strings
const parseJsonField = (field: any): any[] => {
  console.log('parseJsonField input:', typeof field, field);

  if (!field) {
    console.log('parseJsonField: field is falsy');
    return [];
  }
  if (Array.isArray(field)) {
    console.log('parseJsonField: field is already an array with', field.length, 'items');
    return field;
  }
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      console.log('parseJsonField: parsed string to', typeof parsed, Array.isArray(parsed) ? parsed.length + ' items' : '');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('parseJsonField: failed to parse string', e);
      return [];
    }
  }
  // Handle case where it might be an object with numeric keys (rare)
  if (typeof field === 'object') {
    const values = Object.values(field);
    console.log('parseJsonField: converted object to array with', values.length, 'items');
    return values;
  }
  console.log('parseJsonField: returning empty array for unknown type');
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
  readinessCheck?: {
    knowledge: string;
    heart: string;
    practice: string;
  };
}

// Lesson sections for structured flow
type LessonSection = 'welcome' | 'scripture' | 'teaching' | 'reflection' | 'summary';

const SECTION_LABELS: Record<LessonSection, string> = {
  welcome: 'Welcome',
  scripture: 'Scripture Foundation',
  teaching: 'Teaching & Discussion',
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

  // Parse scripture_pack - memoize to avoid re-parsing on every render
  const scriptures = useMemo(() => {
    const parsed = parseJsonField(lesson.scripture_pack);
    console.log('Parsed scriptures:', parsed, 'from:', lesson.scripture_pack);
    return parsed;
  }, [lesson.scripture_pack]);

  const ptPath = useMemo(() => parseJsonObject(lesson.pt_map), [lesson.pt_map]);

  const sectionOrder: LessonSection[] = ['welcome', 'scripture', 'teaching', 'reflection', 'summary'];
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
        console.log('No scriptures to fetch');
        setLoadingVerses(false);
        return;
      }

      console.log('Fetching verses for:', scriptures.slice(0, 5).map(s => s.ref));
      setLoadingVerses(true);

      const texts: Record<string, string> = {};
      for (const scripture of scriptures.slice(0, 5)) {
        if (!scripture.ref) continue;
        try {
          const response = await fetch(
            `https://bible-api.com/${encodeURIComponent(scripture.ref)}?translation=kjv`
          );
          if (response.ok) {
            const data = await response.json();
            texts[scripture.ref] = data.text?.trim() || '';
          }
        } catch (e) {
          console.error('Error fetching verse:', scripture.ref, e);
        }
      }
      setVerseTexts(texts);
      setLoadingVerses(false);
    };
    fetchVerses();
  }, [scriptures]);

  // Talk to Jeeves
  const askJeeves = useCallback(async (message: string, context?: string) => {
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
          sessionHistory: conversationHistory.slice(-5).map(c => `${c.role}: ${c.content}`),
          scriptureContext: context || scriptures.map((s: any) => `${s.ref}: ${s.why}`).join("\n"),
        },
      });

      if (error) throw error;

      if (data.guidance) {
        setGuidance(data.guidance);
        setConversationHistory(prev => [...prev, { role: 'jeeves', content: data.guidance.overallResponse }]);

        // Update progress
        if (data.guidance.progressUpdate) {
          await updateProgress(data.guidance.progressUpdate);
        }
      }
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast.error(error.message || "Failed to get guidance from Jeeves");
    } finally {
      setIsAnalyzing(false);
    }
  }, [lesson, currentSection, conversationHistory, isAnalyzing, scriptures]);

  // Update progress in database
  const updateProgress = async (progressData: any) => {
    const { error } = await supabase
      .from("baptism_candidate_progress")
      .upsert({
        candidate_id: candidateId,
        lesson_id: lesson.id,
        state: progressData.percentComplete >= 100 ? "completed" : "in_progress",
        percent_complete: progressData.percentComplete || progressPercent,
        last_step: currentSection,
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

    queryClient.invalidateQueries({ queryKey: ["baptism-progress"] });
  };

  // Navigate sections
  const goToNextSection = () => {
    const nextIndex = currentSectionIndex + 1;
    if (nextIndex < sectionOrder.length) {
      setCurrentSection(sectionOrder[nextIndex]);
      setGuidance(null);
      setConversationHistory([]);
    }
  };

  const goToPrevSection = () => {
    const prevIndex = currentSectionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sectionOrder[prevIndex]);
      setGuidance(null);
      setConversationHistory([]);
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

  // Complete lesson
  const completeLesson = async () => {
    await updateProgress({ percentComplete: 100 });
    toast.success("Lesson completed! Great work!");
    onBack();
  };

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
          <div className="flex items-center gap-2 mt-4">
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

      {/* Main Content - Changes based on section */}
      <Card variant="glass" className="min-h-[500px]">
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
                <h3 className="font-medium text-center">In this lesson, you will:</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm">Study key Scripture passages</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Understand the biblical teaching</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <History className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Learn the Adventist heritage</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Reflect and ask questions with Jeeves</span>
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
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Scripture Foundation
                </h2>
                <p className="text-muted-foreground">Read these key passages that form the biblical basis for this belief</p>
              </div>

              <ScrollArea className="h-[350px] pr-4">
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
                      <p className="text-xs mt-2">If this persists, the lesson data may need to be reloaded.</p>
                    </div>
                  ) : (
                    scriptures.slice(0, 5).map((scripture: any, idx: number) => (
                      <Card key={idx} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-primary font-medium">
                              {scripture.ref}
                            </Badge>
                            <span className="text-xs text-muted-foreground">KJV</span>
                          </div>
                          {verseTexts[scripture.ref] ? (
                            <blockquote className="text-sm italic border-l-2 border-muted pl-3 my-2 text-foreground/90">
                              "{verseTexts[scripture.ref]}"
                            </blockquote>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Loading verse text...</p>
                          )}
                          <div className="flex items-start gap-2 mt-3 p-2 rounded bg-amber-500/10">
                            <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">{scripture.why}</p>
                          </div>
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

          {/* TEACHING SECTION - Interactive with Jeeves */}
          {currentSection === 'teaching' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Chat with Jeeves */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="font-medium">Learn with Jeeves</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ask questions, explore the topic, or click a prompt below to dive deeper.
                </p>

                {/* Conversation History */}
                <ScrollArea className="h-[250px] border rounded-lg p-3 bg-muted/30">
                  {conversationHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Start a conversation with Jeeves about "{lesson.title}"
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversationHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary/10 ml-8'
                              : 'bg-violet-500/10 mr-8'
                          }`}
                        >
                          <div className="font-medium text-xs mb-1 text-muted-foreground">
                            {msg.role === 'user' ? 'You' : 'Jeeves'}
                          </div>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                      {isAnalyzing && (
                        <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Jeeves is thinking...
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => askJeeves("Teach me the main points of this doctrine")}
                    disabled={isAnalyzing}
                  >
                    Teach me
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => askJeeves("Tell me the Adventist history behind this belief")}
                    disabled={isAnalyzing}
                  >
                    <History className="h-3 w-3 mr-1" />
                    History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => askJeeves("What are common questions or objections about this?")}
                    disabled={isAnalyzing}
                  >
                    Questions
                  </Button>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your question or thought..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleSubmit} disabled={isAnalyzing || userResponse.trim().length < 3}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right: Key Points & Memory Anchors */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Key Points to Understand
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>What the Bible teaches about this topic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Why this belief matters for your walk with Christ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>How Adventists came to understand this truth</span>
                    </li>
                  </ul>
                </div>

                {guidance?.memoryAnchors && guidance.memoryAnchors.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-700">
                      <Sparkles className="h-4 w-4" />
                      Memory Anchors
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {guidance.memoryAnchors.map((anchor, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-amber-500">•</span>
                          {anchor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guidance?.ptPath && (
                  <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-violet-700">
                      <Sparkles className="h-4 w-4" />
                      PT Palace Path
                    </h4>
                    <div className="text-sm">
                      <span className="font-medium">{guidance.ptPath.floor}</span>
                      {guidance.ptPath.rooms && (
                        <span className="text-muted-foreground"> → {guidance.ptPath.rooms.join(", ")}</span>
                      )}
                    </div>
                    {guidance.ptPath.principle && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {guidance.ptPath.principle}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="md:col-span-2 flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Scripture
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Reflection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* REFLECTION SECTION */}
          {currentSection === 'reflection' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  Personal Reflection
                </h2>
                <p className="text-muted-foreground">Take a moment to reflect on what you've learned</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Consider these questions:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>What stood out to you most from the Scripture passages?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>How does this belief connect to your relationship with God?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Is there anything you're still unsure about or want to explore further?</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Write your thoughts (optional - share with Jeeves for feedback):
                  </label>
                  <Textarea
                    placeholder="What are your thoughts on this lesson? Any questions or insights?"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      onClick={handleSubmit}
                      disabled={isAnalyzing || userResponse.trim().length < 3}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 mr-2" />
                      )}
                      Get Jeeves' Feedback
                    </Button>
                  </div>
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
                  Back
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
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
                <p className="text-muted-foreground">
                  You've completed "{lesson.title}"
                </p>
              </div>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Scriptures:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scriptures.slice(0, 4).map((s: any, idx: number) => (
                        <Badge key={idx} variant="outline">{s.ref}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-2">My Commitment</h4>
                <p className="text-sm text-muted-foreground">
                  I have studied and understand the biblical teaching on "{lesson.title}"
                  and commit to growing in this truth as I prepare for baptism.
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
