import { useState, useEffect, useCallback, useMemo } from "react";
import DOMPurify from "dompurify";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Loader2, ArrowLeft, ArrowRight, BookOpen, Brain, Send,
  Sparkles, CheckCircle2, ChevronRight, ChevronDown,
  Target, Lightbulb, History, Award,
  HelpCircle, BookMarked, Heart, Shield, Quote,
  Save, StickyNote, AlertCircle, Volume2, Download, Share2
} from "lucide-react";
import { QuickAudioButton } from "@/components/audio";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { PalacePathVisualizer } from "./PalacePathVisualizer";
import { BaptismQuiz } from "./BaptismQuiz";
import { ExportBaptismAudioDialog } from "./ExportBaptismAudioDialog";

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

/**
 * Sanitize AI response content:
 * - Strip JSON wrappers like ```json { "overallResponse": "..." }
 * - Convert literal \n sequences to proper line breaks / <br> tags
 * - Clean up escaped quotes
 */
const sanitizeAIContent = (raw: string): string => {
  if (!raw) return '';
  let content = raw.trim();

  // Strip markdown code fences (with or without closing fence)
  content = content.replace(/^```(?:json|html|markdown)?\s*/i, '');
  content = content.replace(/\s*```\s*$/i, '');
  content = content.trim();

  // Aggressively strip JSON wrapper: find "overallResponse" key and extract its value
  if (content.includes('"overallResponse"')) {
    // Find the start of the value after "overallResponse": "
    const keyIdx = content.indexOf('"overallResponse"');
    const colonIdx = content.indexOf(':', keyIdx);
    if (colonIdx !== -1) {
      let valueStart = content.indexOf('"', colonIdx + 1);
      if (valueStart !== -1) {
        valueStart += 1; // skip opening quote
        // Find the matching closing quote (not escaped)
        let valueEnd = -1;
        for (let i = valueStart; i < content.length; i++) {
          if (content[i] === '\\') { i++; continue; } // skip escaped chars
          if (content[i] === '"') { valueEnd = i; break; }
        }
        if (valueEnd === -1) {
          // No closing quote found — take everything after the opening quote
          content = content.substring(valueStart);
          // Strip trailing } if present
          content = content.replace(/\s*\}\s*$/, '');
        } else {
          content = content.substring(valueStart, valueEnd);
        }
      }
    }
  } else if (content.startsWith('{')) {
    try {
      const parsed = JSON.parse(content);
      content = parsed.overallResponse || parsed.content || parsed.response || content;
    } catch {
      // Not valid JSON, use as-is
    }
  }

  // Unescape JSON string escapes
  content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\t/g, '\t');

  // If content has no HTML tags, convert to HTML
  const hasHtmlTags = /<(?:h[1-6]|p|div|blockquote|ul|ol|li|strong|em|br|hr)\b/i.test(content);
  if (!hasHtmlTags) {
    // Convert markdown-style headers
    content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Convert > blockquotes
    content = content.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    // Convert paragraphs
    content = content
      .split(/\n{2,}/)
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';
        if (/^<(?:h[1-6]|blockquote|ul|ol|hr)/.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  }

  return content;
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
    principle: string;
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

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

// Lesson sections for structured flow - now with 9 comprehensive sections
type LessonSection = 'welcome' | 'scripture' | 'teaching' | 'objections' | 'history' | 'egw' | 'quiz' | 'reflection' | 'summary';

const SECTION_LABELS: Record<LessonSection, string> = {
  welcome: 'Welcome',
  scripture: 'Scripture Foundation',
  teaching: 'Comprehensive Teaching',
  objections: 'Objections & Answers',
  history: 'Adventist Heritage',
  egw: 'Spirit of Prophecy',
  quiz: 'Knowledge Assessment',
  reflection: 'Personal Application',
  summary: 'Commitment & Summary',
};

const SECTION_ICONS: Record<LessonSection, any> = {
  welcome: Target,
  scripture: BookOpen,
  teaching: Lightbulb,
  objections: Shield,
  history: History,
  egw: Quote,
  quiz: HelpCircle,
  reflection: Heart,
  summary: Award,
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

  // Content states for each AI-generated section
  const [teachingContent, setTeachingContent] = useState<string | null>(null);
  const [objectionsContent, setObjectionsContent] = useState<string | null>(null);
  const [historyContent, setHistoryContent] = useState<string | null>(null);
  const [egwContent, setEgwContent] = useState<string | null>(null);
  const [aiQuizQuestions, setAiQuizQuestions] = useState<QuizQuestion[] | null>(null);

  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedVerses, setExpandedVerses] = useState<Set<number>>(new Set([0])); // First verse expanded by default

  // Study notes state
  const [studyNotes, setStudyNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);

  // Export audio dialog
  const [showExportAudio, setShowExportAudio] = useState(false);

  // Parse scripture_pack
  const scriptures = useMemo(() => {
    const parsed = parseJsonField(lesson.scripture_pack);
    console.log('Parsed scriptures:', parsed);
    // Ensure we handle both old format (simple strings) and new format (objects)
    return parsed.map((item: any) => {
      if (typeof item === 'string') {
        return { reference: item, why: '' };
      }
      return {
        reference: item.reference || item.ref,
        why: item.why || item.meaning || ''
      };
    });
  }, [lesson.scripture_pack]);

  const ptPath = useMemo(() => parseJsonObject(lesson.pt_map), [lesson.pt_map]);

  const sectionOrder: LessonSection[] = ['welcome', 'scripture', 'teaching', 'objections', 'history', 'egw', 'quiz', 'reflection', 'summary'];
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
          mode: "deep_dive",
        })
        .select()
        .single();

      if (!error && data) {
        setAttemptId(data.id);
      }
    };
    createAttempt();
  }, [candidateId, lesson.id]);

  // Set initial guidance on mount
  useEffect(() => {
    if (!guidance) {
      setGuidance({
        overallResponse: `Welcome to Lesson ${lesson.fundamental_number}: **${lesson.title}**\n\n${lesson.description || ''}\n\nLet's begin by exploring what the Bible says about this fundamental truth. Type your thoughts, questions, or simply "ready" to start.`,
        currentSection: {
          title: "Introduction",
          content: `This lesson will guide you through the biblical foundation for "${lesson.title}" using the Phototheology Palace method.`,
          scriptures: Array.isArray(lesson.scripture_pack) ? lesson.scripture_pack.slice(0, 3) : [],
          questions: ["What do you already know about this topic?", "Do you have any questions before we begin?"],
          options: ["I'm ready to learn", "I have a question", "Tell me more about this topic"],
        },
        ptPath: lesson.pt_map?.palace_path?.[0] || { floor: "Foundation Floor", rooms: ["Story Room"] },
      });
    }
  }, [lesson, guidance]);

  // Load existing study notes
  useEffect(() => {
    const loadNotes = async () => {
      const { data, error } = await supabase
        .from("baptism_candidate_progress")
        .select("last_step")
        .eq("candidate_id", candidateId)
        .eq("lesson_id", lesson.id)
        .single();

      // Using last_step to store notes temporarily - in production would have dedicated field
      if (data?.last_step?.startsWith('NOTES:')) {
        setStudyNotes(data.last_step.replace('NOTES:', ''));
      }
      setNotesLoaded(true);
    };
    loadNotes();
  }, [candidateId, lesson.id]);

  // Fetch verse texts when scriptures change - now fetches ALL verses
  useEffect(() => {
    const fetchVerses = async () => {
      if (!scriptures || scriptures.length === 0) {
        setLoadingVerses(false);
        return;
      }

      setLoadingVerses(true);
      const texts: Record<string, string> = {};

      // Fetch ALL verses
      for (const scripture of scriptures) {
        const ref = scripture.reference;
        if (!ref) continue;

        // Skip if already loaded
        if (verseTexts[ref]) {
          texts[ref] = verseTexts[ref];
          continue;
        }

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
      setVerseTexts(prev => ({ ...prev, ...texts }));
      setLoadingVerses(false);
    };
    fetchVerses();
  }, [scriptures]);

  // Load content based on current section
  useEffect(() => {
    if (currentSection === 'teaching' && !teachingContent && !loadingContent) {
      loadTeachingContent();
    }
    if (currentSection === 'objections' && !objectionsContent && !loadingContent) {
      loadObjectionsContent();
    }
    if (currentSection === 'history' && !historyContent && !loadingContent) {
      loadHistoryContent();
    }
    if (currentSection === 'egw' && !egwContent && !loadingContent) {
      loadEgwContent();
    }
    if (currentSection === 'quiz' && !aiQuizQuestions && !loadingContent) {
      loadQuizQuestions();
    }
  }, [currentSection]);

  const loadTeachingContent = async () => {
    setLoadingContent(true);
    try {
      // Build a rich scripture context including fetched verse text
      const scriptureList = scriptures.map((s: any) => {
        const ref = s.reference || s.ref;
        const text = verseTexts[ref] || '';
        const why = s.why || s.meaning || '';
        return `- ${ref}: "${text}" — ${why}`;
      }).join("\n");

      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Write a comprehensive, deeply rooted doctrinal study on "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}). You MUST use ALL ${scriptures.length} scripture references provided below. For each one, quote the full KJV text in a blockquote tag, then write 4-8 sentences of verse-by-verse exegetical commentary explaining what it means phrase by phrase. Include Christ connections, sanctuary connections, Three Angels' connections, Phototheology Dimensions analysis, and practical application. This must be AT LEAST 2500 words of rich HTML content.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'teaching',
          mode: 'deep_dive',
          scriptureContext: scriptureList,
        },
      });

      if (data?.guidance?.overallResponse) {
        setTeachingContent(sanitizeAIContent(data.guidance.overallResponse));
      } else {
        setTeachingContent(`<h2>${lesson.title}</h2><p>${lesson.description}</p><p>Content is being prepared. Ask Jeeves below to explore this topic.</p>`);
      }
    } catch (error) {
      console.error("Teaching content error:", error);
      setTeachingContent(`<h2>${lesson.title}</h2><p>${lesson.description}</p><p>Content could not be loaded. Ask Jeeves below to explore this topic.</p>`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadObjectionsContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Write a thorough objections & answers section for "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}). Present 5-7 common objections, steelman each one, then refute with multiple KJV scriptures and logical reasoning. Include what other denominations believe and how to share this truth.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'objections',
          mode: 'deep_dive',
          scriptureContext: scriptures.map((s: any) => `${s.reference}: ${s.why}`).join("\n"),
        },
      });

      if (data?.guidance?.overallResponse) {
        setObjectionsContent(sanitizeAIContent(data.guidance.overallResponse));
      }
    } catch (error) {
      setObjectionsContent(`## Objections & Answers\n\nContent could not be loaded. Ask Jeeves below to explore common objections.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadHistoryContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Write the complete Adventist heritage and history of how pioneers discovered the truth of "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}). Include specific people, dates, places, quotes, and a timeline. Use vivid storytelling language.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'history',
          mode: 'deep_dive',
        },
      });

      if (data?.guidance?.overallResponse) {
        setHistoryContent(sanitizeAIContent(data.guidance.overallResponse));
      }
    } catch (error) {
      setHistoryContent(`## Adventist Heritage\n\nContent could not be loaded. Ask Jeeves below to explore the history.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadEgwContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Write a Spirit of Prophecy insights section for "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}). Include 5-8 Ellen G. White quotations with full book/page citations, organized by theme, with explanation paragraphs after each quote and practical application.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'egw',
          mode: 'deep_dive',
        },
      });

      if (data?.guidance?.overallResponse) {
        setEgwContent(sanitizeAIContent(data.guidance.overallResponse));
      }
    } catch (error) {
      setEgwContent(`## Spirit of Prophecy Insights\n\nContent could not be loaded. Ask Jeeves below to explore Ellen White's writings.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadQuizQuestions = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Generate 10 quiz questions about "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}). Mix of 6 multiple-choice and 4 fill-in-the-blank. Every explanation must quote the relevant KJV verse. Test understanding, not just memory.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'quiz',
          mode: 'normal',
          scriptureContext: scriptures.map((s: any) => `${s.reference}: ${s.why}`).join("\n"),
        },
      });

      if (data?.guidance?.overallResponse) {
        try {
          let jsonText = data.guidance.overallResponse;
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) jsonText = jsonMatch[1];
          const parsed = JSON.parse(jsonText.trim());
          if (parsed.questions && Array.isArray(parsed.questions)) {
            setAiQuizQuestions(parsed.questions);
          }
        } catch (parseError) {
          console.error('Failed to parse quiz questions:', parseError);
          setAiQuizQuestions(null);
        }
      }
      // Also try to parse from guidance.questions directly
      if (!aiQuizQuestions && data?.guidance?.questions) {
        setAiQuizQuestions(data.guidance.questions);
      }
    } catch (error) {
      console.error('Error loading quiz questions:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  // Save study notes (preserve existing state - don't overwrite completed)
  const saveStudyNotes = async () => {
    setSavingNotes(true);
    try {
      // First check if there's existing progress to preserve state
      const { data: existing } = await supabase
        .from("baptism_candidate_progress")
        .select("state")
        .eq("candidate_id", candidateId)
        .eq("lesson_id", lesson.id)
        .maybeSingle();

      const currentState = existing?.state || "in_progress";
      
      await supabase
        .from("baptism_candidate_progress")
        .upsert({
          candidate_id: candidateId,
          lesson_id: lesson.id,
          state: currentState === "completed" ? "completed" : "in_progress",
          last_step: `NOTES:${studyNotes}`,
          last_active_at: new Date().toISOString(),
        }, {
          onConflict: "candidate_id,lesson_id",
        });
      toast.success("Notes saved!");
    } catch (error) {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
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
          scriptureContext: scriptures.map((s: any) => `${s.reference}: ${s.why}`).join("\n"),
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
        last_step: studyNotes ? `NOTES:${studyNotes}` : currentSection,
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

  // Default quiz questions (fallback if AI doesn't return questions)
  const defaultQuizQuestions: QuizQuestion[] = useMemo(() => [
    {
      question: `What is the primary biblical foundation for "${lesson.title}"?`,
      options: [
        scriptures[0]?.reference || "Genesis 1:1",
        "Church tradition only",
        "Human philosophy",
        "Cultural customs"
      ],
      correct: 0,
      explanation: "Scripture is always the foundation for Adventist beliefs."
    },
    {
      question: "Why is this doctrine important for Seventh-day Adventists?",
      options: [
        "It's merely historical information",
        "It reveals God's character and His plan for humanity",
        "It's only relevant for theologians",
        "It has no practical application"
      ],
      correct: 1,
      explanation: "Every doctrine reveals something about God and His purposes."
    },
    {
      question: "How did early Adventists come to understand this truth?",
      options: [
        "They adopted it from other denominations without study",
        "Through careful, prayerful Bible study",
        "It was entirely new revelation with no biblical basis",
        "They invented it for church identity"
      ],
      correct: 1,
      explanation: "Adventist pioneers were committed to Scripture-based faith."
    },
    {
      question: "What role does this belief play in the Three Angels' Messages?",
      options: [
        "It has no connection to the Three Angels' Messages",
        "It helps us understand God's final call to the world",
        "It contradicts Revelation 14",
        "It's only for Jewish believers"
      ],
      correct: 1,
      explanation: "Adventist doctrines are interconnected with our prophetic message."
    },
    {
      question: "How should this doctrine affect your daily life?",
      options: [
        "It shouldn't - it's just theoretical knowledge",
        "It should transform how we live, worship, and relate to others",
        "It only matters on Sabbath",
        "It's only relevant when defending our faith"
      ],
      correct: 1,
      explanation: "True biblical understanding leads to transformed living."
    }
  ], [lesson.title, scriptures]);

  // Use AI questions if available, otherwise use defaults
  const quizQuestions = aiQuizQuestions || defaultQuizQuestions;

  // Get scripture reference safely
  const getRef = (s: any) => s?.reference || s?.ref || 'Scripture';
  const getWhy = (s: any) => s?.why || s?.meaning || s?.explanation || '';

  // Toggle verse expansion
  const toggleVerse = (idx: number) => {
    setExpandedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  // Render section icon
  const SectionIcon = SECTION_ICONS[currentSection];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Track
            </Button>
            <Badge variant="outline">
              Belief {lesson.fundamental_number} of 28
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

          {/* Section Progress with labels */}
          <div className="mt-4">
            <div className="flex items-center gap-0.5">
              {sectionOrder.map((section, idx) => {
                const Icon = SECTION_ICONS[section];
                return (
                  <div
                    key={section}
                    className={`flex-1 h-2 first:rounded-l-full last:rounded-r-full transition-colors cursor-pointer ${
                      idx < currentSectionIndex ? 'bg-green-500' :
                      idx === currentSectionIndex ? 'bg-primary' :
                      'bg-muted'
                    }`}
                    onClick={() => setCurrentSection(section)}
                    title={SECTION_LABELS[section]}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <SectionIcon className="h-3 w-3" />
                <span>{SECTION_LABELS[currentSection]}</span>
              </div>
              <span>Section {currentSectionIndex + 1} of {sectionOrder.length}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Study Notes (always visible) */}
      <Collapsible>
        <Card className="border-amber-500/30">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">My Study Notes</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Textarea
                placeholder="Take notes as you study this lesson..."
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                className="min-h-[100px] text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={saveStudyNotes}
                disabled={savingNotes}
                className="mt-2"
              >
                {savingNotes ? (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <Save className="h-3 w-3 mr-2" />
                )}
                Save Notes
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Main Content */}
      <Card className="min-h-[600px]">
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
                <h2 className="text-2xl font-bold mb-3">Fundamental Belief #{lesson.fundamental_number}</h2>
                <h3 className="text-xl text-primary mb-4">{lesson.title}</h3>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>

              {/* PT Path Preview */}
              {ptPath?.palace_path?.[0] && (
                <div className="max-w-2xl mx-auto mb-8">
                  <PalacePathVisualizer path={ptPath.palace_path[0]} />
                </div>
              )}

              {/* What You'll Learn - now showing 9 sections */}
              <div className="max-w-lg mx-auto space-y-3">
                <h3 className="font-medium text-center mb-4">In this comprehensive study, you will:</h3>
                <div className="grid gap-2">
                  {sectionOrder.slice(1).map((section) => {
                    const Icon = SECTION_ICONS[section];
                    const descriptions: Record<LessonSection, string> = {
                      welcome: '',
                      scripture: 'Study all key Scripture passages in depth (KJV)',
                      teaching: 'Receive comprehensive doctrinal teaching',
                      objections: 'Learn answers to common objections',
                      history: 'Discover how Adventist pioneers found this truth',
                      egw: 'Read Spirit of Prophecy insights',
                      quiz: 'Test your knowledge with a thorough quiz',
                      reflection: 'Apply this truth personally',
                      summary: 'Make a commitment to live this belief',
                    };
                    return (
                      <div key={section} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm">{descriptions[section]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button size="lg" onClick={goToNextSection}>
                  Begin Comprehensive Study
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowExportAudio(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Audio
                </Button>
              </div>
            </div>
          )}

          {/* SCRIPTURE SECTION - Now shows ALL verses with collapsible feature */}
          {currentSection === 'scripture' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Scripture Foundation
                </h2>
                <p className="text-muted-foreground">Study all {scriptures.length} key passages for this doctrine</p>
              </div>

              {/* Memory Verse (highlighted) */}
              {scriptures.length > 0 && (
                <div className="max-w-2xl mx-auto p-4 rounded-lg bg-primary/10 border-2 border-primary/30 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <BookMarked className="h-4 w-4" />
                    Memory Verse - Commit this to heart
                  </div>
                  <p className="font-bold text-lg">{getRef(scriptures[0])}</p>
                  {verseTexts[getRef(scriptures[0])] ? (
                    <blockquote className="mt-2 text-base italic border-l-4 border-primary pl-4 py-2 bg-background/50 rounded-r-lg">
                      "{verseTexts[getRef(scriptures[0])]}"
                    </blockquote>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading text...
                    </div>
                  )}
                  {getWhy(scriptures[0]) && (
                    <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2 bg-background/30 p-2 rounded">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="font-medium text-primary/80">Key Insight:</span> {getWhy(scriptures[0])}
                    </p>
                  )}
                </div>
              )}

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3 pb-4">
                  {loadingVerses && Object.keys(verseTexts).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-muted-foreground">Loading {scriptures.length} Scripture passages...</span>
                    </div>
                  ) : scriptures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Scripture references are loading...</p>
                    </div>
                  ) : (
                    scriptures.map((scripture: any, idx: number) => (
                      <Collapsible key={idx} open={expandedVerses.has(idx)} onOpenChange={() => toggleVerse(idx)}>
                        <Card className={`border-l-4 transition-all duration-200 ${
                          expandedVerses.has(idx) 
                            ? 'border-l-primary shadow-md bg-accent/5' 
                            : 'border-l-muted-foreground/30 hover:border-l-primary/50'
                        }`}>
                          <CollapsibleTrigger className="w-full">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-left">
                                  <Badge variant={idx === 0 ? "default" : "outline"} className="font-medium text-sm px-2 py-1 min-w-[80px] justify-center">
                                    {getRef(scripture)}
                                  </Badge>
                                  {expandedVerses.has(idx) ? (
                                    <span className="text-xs font-medium text-primary hidden sm:inline-block">Reading...</span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground line-clamp-1 text-left hidden sm:inline-block">
                                      {getWhy(scripture) || "Click to read"}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {expandedVerses.has(idx) ? (
                                    <ChevronDown className="h-4 w-4 text-primary" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="pt-0 pb-4 px-4">
                              {verseTexts[getRef(scripture)] ? (
                                <blockquote className="text-sm italic border-l-2 border-primary/20 pl-3 my-2 text-foreground/90 leading-relaxed font-serif">
                                  "{verseTexts[getRef(scripture)]}"
                                </blockquote>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground italic py-2">
                                  <Loader2 className="h-3 w-3 animate-spin" /> Loading verse text...
                                </div>
                              )}
                              {getWhy(scripture) && (
                                <div className="flex items-start gap-2 mt-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                  <div>
                                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-0.5">Palace Insight</span>
                                    <p className="text-sm text-foreground/80">{getWhy(scripture)}</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground bg-muted/20 rounded-full w-fit mx-auto px-4">
                <AlertCircle className="h-4 w-4" />
                Click each reference to expand and read the full text
              </div>

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
                  Comprehensive Teaching: {lesson.title}
                </h2>
                <p className="text-muted-foreground">In-depth doctrinal study with Scripture foundation</p>
                {teachingContent && (
                  <div className="mt-3">
                    <QuickAudioButton
                      text={teachingContent.replace(/<[^>]*>/g, ' ').substring(0, 4000)}
                      variant="outline"
                      size="sm"
                      showLabel
                    />
                  </div>
                )}
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Preparing comprehensive teaching content...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a moment for thorough content</p>
                </div>
              ) : (
                <ScrollArea className="h-[700px] pr-4">
                  <div 
                    className="baptism-study-content rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 p-6 backdrop-blur-sm shadow-lg shadow-primary/5"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(teachingContent || lesson.description || '', { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','em','b','i','ul','ol','li','blockquote','a','span','div'], ALLOWED_ATTR: ['class','href','target','rel'] }) }}
                  />
                </ScrollArea>
              )}

              {/* Chat with Jeeves */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="font-medium">Ask Jeeves for Deeper Understanding</h3>
                </div>

                {conversationHistory.length > 0 && (
                  <ScrollArea className="h-[120px] border rounded-lg p-3 bg-muted/30 mb-3">
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
                  Continue to Objections
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* OBJECTIONS & ANSWERS SECTION */}
          {currentSection === 'objections' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Objections & Biblical Answers
                </h2>
                <p className="text-muted-foreground">Prepare to defend and explain this belief</p>
                {objectionsContent && (
                  <div className="mt-3">
                    <QuickAudioButton
                      text={objectionsContent.replace(/<[^>]*>/g, ' ').substring(0, 4000)}
                      variant="outline"
                      size="sm"
                      showLabel
                    />
                  </div>
                )}
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading objections and answers...</p>
                </div>
              ) : (
                <ScrollArea className="h-[700px] pr-4">
                  <div 
                    className="baptism-study-content rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5 p-6 backdrop-blur-sm shadow-lg shadow-blue-500/5"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(objectionsContent || "<p>Content is loading...</p>", { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','em','b','i','ul','ol','li','blockquote','a','span','div'], ALLOWED_ATTR: ['class','href','target','rel'] }) }}
                  />
                </ScrollArea>
              )}

              {/* Chat with Jeeves */}
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="font-medium">Ask Jeeves About Specific Objections</h3>
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about a specific objection or how to respond to a criticism..."
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
                  Back to Teaching
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
                {historyContent && (
                  <div className="mt-3">
                    <QuickAudioButton
                      text={historyContent.replace(/<[^>]*>/g, ' ').substring(0, 4000)}
                      variant="outline"
                      size="sm"
                      showLabel
                    />
                  </div>
                )}
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading Adventist history...</p>
                </div>
              ) : (
                <ScrollArea className="h-[700px] pr-4">
                  <div 
                    className="baptism-study-content rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/5 via-background to-emerald-500/5 p-6 backdrop-blur-sm shadow-lg shadow-green-500/5"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(historyContent || "<p>Content is loading...</p>", { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','em','b','i','ul','ol','li','blockquote','a','span','div'], ALLOWED_ATTR: ['class','href','target','rel'] }) }}
                  />
                </ScrollArea>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Objections
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Spirit of Prophecy
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* SPIRIT OF PROPHECY (EGW) SECTION */}
          {currentSection === 'egw' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Quote className="h-5 w-5 text-purple-500" />
                  Spirit of Prophecy Insights
                </h2>
                <p className="text-muted-foreground">Ellen G. White's inspired counsel on this topic</p>
                {egwContent && (
                  <div className="mt-3">
                    <QuickAudioButton
                      text={egwContent.replace(/<[^>]*>/g, ' ').substring(0, 4000)}
                      variant="outline"
                      size="sm"
                      showLabel
                    />
                  </div>
                )}
              </div>

              <div className="max-w-2xl mx-auto p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm">
                <p className="text-muted-foreground">
                  <strong>Note:</strong> Ellen White's writings serve as the "lesser light" leading to the "greater light" of Scripture.
                  They illuminate and apply biblical truth but never replace the Bible as our only creed.
                </p>
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading Spirit of Prophecy insights...</p>
                </div>
              ) : (
                <ScrollArea className="h-[700px] pr-4">
                  <div 
                    className="baptism-study-content rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-violet-500/5 p-6 backdrop-blur-sm shadow-lg shadow-purple-500/5"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(egwContent || "<p>Content is loading...</p>", { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','em','b','i','ul','ol','li','blockquote','a','span','div'], ALLOWED_ATTR: ['class','href','target','rel'] }) }}
                  />
                </ScrollArea>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={goToPrevSection}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to History
                </Button>
                <Button onClick={goToNextSection}>
                  Continue to Quiz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* QUIZ SECTION - Now with AI-generated questions and interactive component */}
          {currentSection === 'quiz' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" />
                  Knowledge Assessment
                </h2>
                <p className="text-muted-foreground">
                  Test your understanding of "{lesson.title}" ({quizQuestions.length} questions)
                </p>
              </div>

              {loadingContent && !aiQuizQuestions ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Generating quiz questions...</p>
                </div>
              ) : (
                <>
                  <BaptismQuiz 
                    questions={quizQuestions.map((q, idx) => ({
                      id: `q-${idx}`,
                      type: 'multiple_choice',
                      question: q.question,
                      options: q.options,
                      correctAnswer: q.correct,
                      explanation: q.explanation || "Correct answer based on the lesson content."
                    }))}
                    onComplete={async (score) => {
                      const percentage = Math.round((score / quizQuestions.length) * 100);
                      if (percentage >= 70) {
                        toast.success(`Excellent! You scored ${percentage}%`);
                        await updateProgress(90);
                        goToNextSection();
                      } else {
                        toast.info(`You scored ${percentage}%. You can review and retry, or continue anyway.`);
                        await updateProgress(Math.max(progressPercent, 78));
                      }
                    }}
                  />
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={goToPrevSection}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to EGW
                    </Button>
                    <Button variant="outline" onClick={goToNextSection}>
                      Continue to Reflection
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* REFLECTION SECTION */}
          {currentSection === 'reflection' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Personal Application
                </h2>
                <p className="text-muted-foreground">Make this truth personal to your life</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <Label className="mb-2 block">How does this doctrine change how you see God?</Label>
                    <Textarea 
                      className="min-h-[100px]" 
                      placeholder="Reflect on God's character..."
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Label className="mb-2 block">What is one practical way you can live this out this week?</Label>
                    <Textarea 
                      className="min-h-[100px]" 
                      placeholder="Specific action step..."
                    />
                  </CardContent>
                </Card>
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
            <div className="space-y-6 text-center max-w-2xl mx-auto">
              <div className="p-6 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
                <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold">Lesson Completed!</h2>
              <p className="text-muted-foreground">
                You have completed the comprehensive study of "{lesson.title}"
              </p>

              <Card className="mt-6 bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Your Commitment</h3>
                  <p className="italic text-muted-foreground mb-4">
                    "I accept this biblical truth and choose to walk in its light."
                  </p>
                  <Button size="lg" className="w-full" onClick={() => {
                    updateProgress(100);
                    toast.success("Lesson marked as complete!");
                    onBack();
                  }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Lesson & Return to Track
                  </Button>
                </CardContent>
              </Card>

              <Button variant="ghost" onClick={goToPrevSection}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reflection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ExportBaptismAudioDialog
        open={showExportAudio}
        onOpenChange={setShowExportAudio}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        fundamentalNumber={lesson.fundamental_number}
      />
    </div>
  );
}
