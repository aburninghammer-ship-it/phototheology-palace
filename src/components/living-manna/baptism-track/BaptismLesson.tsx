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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Loader2, ArrowLeft, ArrowRight, BookOpen, Brain, Send,
  Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ChevronDown,
  MessageSquare, Target, Lightbulb, History, Award,
  HelpCircle, BookMarked, Heart, Pencil, Shield, Quote,
  Save, StickyNote, AlertCircle
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

  // Parse scripture_pack
  const scriptures = useMemo(() => {
    const parsed = parseJsonField(lesson.scripture_pack);
    console.log('Parsed scriptures:', parsed);
    return parsed;
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

      // Fetch ALL verses, not just first 7
      for (const scripture of scriptures) {
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
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Please provide COMPREHENSIVE, IN-DEPTH teaching on "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}).

I need a thorough, seminary-level explanation that covers ALL of the following:

1. BIBLICAL FOUNDATION (with extensive Scripture references - cite at least 10 verses with full KJV text)
   - Key proof texts and their context
   - How Scripture progressively reveals this truth
   - Old Testament foundations and New Testament fulfillment

2. THEOLOGICAL SIGNIFICANCE
   - What this doctrine teaches us about God's character
   - How this truth relates to the plan of salvation
   - Connection to the Three Angels' Messages
   - How this doctrine fits in the Adventist prophetic framework

3. PRACTICAL APPLICATION
   - How this belief should affect daily Christian living
   - Specific ways to practice this truth
   - Impact on relationships, worship, and mission

4. DOCTRINAL CONNECTIONS
   - How this belief connects to other Adventist doctrines
   - The systematic theological framework
   - Why this doctrine matters for the Great Controversy narrative

5. COMMON MISUNDERSTANDINGS
   - What this doctrine does NOT mean
   - Clarifications on often-confused points
   - Balance and nuance in understanding

Please write in an engaging, accessible style while maintaining theological depth. Use clear headings and organized structure. Make this a substantive lesson worthy of serious Bible study.`,
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

  const loadObjectionsContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Please provide a thorough OBJECTIONS & ANSWERS section for "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}).

Cover the following COMPREHENSIVELY:

1. COMMON OBJECTIONS FROM OTHER CHRISTIANS
   - At least 5-7 common objections or criticisms
   - What other denominations teach differently
   - Popular counter-arguments from evangelicals, Catholics, etc.

2. BIBLICAL RESPONSES
   - Scripture-based answers to each objection
   - Context and proper hermeneutics
   - Historical evidence where relevant

3. HONEST ACKNOWLEDGMENTS
   - Where questions remain or faith is required
   - Difficult texts and how to handle them
   - The limits of human understanding

4. APOLOGETIC APPROACH
   - How to graciously discuss this with those who disagree
   - Finding common ground
   - Witnessing opportunities

5. DEALING WITH DOUBT
   - What to do when you personally struggle with this teaching
   - Resources for deeper study
   - Prayer and spiritual approach to understanding

Format each objection clearly with its response. Be intellectually honest while maintaining biblical faithfulness. Help the candidate be prepared to "give an answer" (1 Peter 3:15) with gentleness and respect.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'objections',
          mode: 'deep_dive',
        },
      });

      if (data?.guidance?.overallResponse) {
        setObjectionsContent(data.guidance.overallResponse);
      }
    } catch (error) {
      console.error('Error loading objections content:', error);
      setObjectionsContent(`Common objections to "${lesson.title}" and biblical responses will help prepare you to defend and share your faith. Click "Ask Jeeves" to explore these with your AI guide.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadHistoryContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Tell me the COMPLETE Adventist history and heritage behind "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}).

Make this VIVID, PERSONAL, and DETAILED like I'm reading a historical narrative:

1. THE DISCOVERY/DEVELOPMENT
   - WHO: Names, backgrounds, ages of key people involved
   - WHERE: Specific locations (towns, buildings, fields)
   - WHEN: Exact dates whenever possible
   - HOW: The circumstances and study process

2. KEY FIGURES
   - William Miller's role (if applicable)
   - James and Ellen White's involvement
   - Other pioneers: Joseph Bates, Hiram Edson, J.N. Andrews, Uriah Smith, etc.
   - What motivated each person
   - Their struggles and breakthroughs

3. DRAMATIC MOMENTS
   - The Great Disappointment (Oct 22, 1844) if relevant
   - Visions received by Ellen White
   - Debates and controversies
   - "Eureka" moments of discovery
   - Bible conferences and study sessions

4. SPREAD OF THE TRUTH
   - How this doctrine was published and shared
   - Resistance and acceptance
   - Growth of the movement
   - Key publications (Review & Herald, etc.)

5. PERSONAL CONNECTION
   - Help me feel like I was there
   - What would it have been like to discover this truth?
   - Why should this history matter to me today?
   - How this connects me to a family of faith

Tell it as a STORY, not just facts. Make the pioneers come alive!`,
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
      setHistoryContent(`The Adventist understanding of "${lesson.title}" developed through careful Bible study and the guidance of the Holy Spirit. Click "Ask Jeeves" to explore this history.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadEgwContent = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Please provide SPIRIT OF PROPHECY insights on "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}).

Include the following from Ellen G. White's writings:

1. KEY QUOTATIONS (at least 5-7 substantial quotes)
   - From major works: Steps to Christ, Desire of Ages, Great Controversy, Patriarchs and Prophets, etc.
   - Include the source reference (book and page/chapter)
   - Select quotes that illuminate and deepen understanding

2. THEMATIC INSIGHTS
   - What did Ellen White emphasize most about this topic?
   - Any warnings or cautions she gave?
   - Practical counsel for daily living
   - Connection to end-time events

3. DEVOTIONAL APPLICATION
   - How her writings can enhance personal devotions
   - Meditation points from her teachings
   - Prayer focus based on her insights

4. CONTEXT AND BACKGROUND
   - Why did Ellen White write about this topic?
   - What circumstances prompted specific counsels?
   - How her understanding developed over time

5. RECOMMENDED READING
   - Specific chapters or sections for deeper study
   - Key Ellen White books related to this doctrine
   - How to access these resources (EGW Writings app, etc.)

Remember: Ellen White's writings are not a replacement for Scripture but serve as the "lesser light" pointing to the "greater light" of the Bible. Present her insights in this context.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'egw',
          mode: 'deep_dive',
        },
      });

      if (data?.guidance?.overallResponse) {
        setEgwContent(data.guidance.overallResponse);
      }
    } catch (error) {
      console.error('Error loading EGW content:', error);
      setEgwContent(`Ellen G. White's writings provide valuable insights on "${lesson.title}" as the "lesser light" pointing to Scripture. Click "Ask Jeeves" to explore these with your guide.`);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadQuizQuestions = async () => {
    setLoadingContent(true);
    try {
      const { data, error } = await supabase.functions.invoke("baptism-track-guide", {
        body: {
          notes: `Generate 7 multiple-choice quiz questions specifically for "${lesson.title}" (Fundamental Belief #${lesson.fundamental_number}).

REQUIREMENTS:
- Questions must be DIRECTLY about this specific doctrine
- Include questions about: biblical basis, meaning, application, and Adventist understanding
- Each question should have exactly 4 options (A, B, C, D)
- One option must be clearly correct
- Include an explanation for the correct answer
- Questions should range from basic to challenging

FORMAT YOUR RESPONSE AS VALID JSON:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explanation of why this answer is correct..."
    }
  ]
}

Make questions that actually test understanding of "${lesson.title}", not generic Christianity questions.`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          lessonPhase: 'quiz',
          mode: 'normal',
        },
      });

      if (data?.guidance?.overallResponse) {
        try {
          // Try to parse JSON from response
          let jsonText = data.guidance.overallResponse;
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1];
          }
          const parsed = JSON.parse(jsonText.trim());
          if (parsed.questions && Array.isArray(parsed.questions)) {
            setAiQuizQuestions(parsed.questions);
          }
        } catch (parseError) {
          console.error('Failed to parse quiz questions:', parseError);
          // Fall back to default questions
          setAiQuizQuestions(null);
        }
      }
    } catch (error) {
      console.error('Error loading quiz questions:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  // Save study notes
  const saveStudyNotes = async () => {
    setSavingNotes(true);
    try {
      await supabase
        .from("baptism_candidate_progress")
        .upsert({
          candidate_id: candidateId,
          lesson_id: lesson.id,
          state: "in_progress",
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
        scriptures[0]?.ref || "Genesis 1:1",
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

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correct = quizQuestions.filter((q, i) => parseInt(quizAnswers[i]) === q.correct).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    if (score >= 70) {
      toast.success(`Excellent! You scored ${score}% (${correct}/${quizQuestions.length})`);
    } else {
      toast.info(`You scored ${score}% (${correct}/${quizQuestions.length}). Review the teaching section to strengthen your understanding.`);
    }
  };

  // Complete lesson
  const completeLesson = async () => {
    await updateProgress(100);
    toast.success("Lesson completed! Great work on this comprehensive study!");
    onBack();
  };

  // Get scripture reference safely
  const getRef = (s: any) => s?.ref || s?.reference || 'Scripture';
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
      <Card variant="glass">
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
                    onClick={() => idx <= currentSectionIndex && setCurrentSection(section)}
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
        <Card variant="glass" className="border-amber-500/30">
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
      <Card variant="glass" className="min-h-[600px]">
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

              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={goToNextSection}>
                  Begin Comprehensive Study
                  <ArrowRight className="h-4 w-4 ml-2" />
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
                <div className="max-w-2xl mx-auto p-4 rounded-lg bg-primary/10 border-2 border-primary/30 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                    <BookMarked className="h-4 w-4" />
                    Memory Verse - Commit this to heart
                  </div>
                  <p className="font-bold text-lg">{getRef(scriptures[0])}</p>
                  {verseTexts[getRef(scriptures[0])] && (
                    <blockquote className="mt-2 text-base italic border-l-4 border-primary pl-4 py-2">
                      "{verseTexts[getRef(scriptures[0])]}"
                    </blockquote>
                  )}
                  {getWhy(scriptures[0]) && (
                    <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      {getWhy(scriptures[0])}
                    </p>
                  )}
                </div>
              )}

              <ScrollArea className="h-[420px] pr-4">
                <div className="space-y-3">
                  {loadingVerses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading all {scriptures.length} Scripture passages...</span>
                    </div>
                  ) : scriptures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Scripture references are loading...</p>
                    </div>
                  ) : (
                    scriptures.map((scripture: any, idx: number) => (
                      <Collapsible key={idx} open={expandedVerses.has(idx)} onOpenChange={() => toggleVerse(idx)}>
                        <Card className={`border-l-4 ${idx === 0 ? 'border-l-primary' : 'border-l-muted-foreground/30'}`}>
                          <CollapsibleTrigger className="w-full">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Badge variant={idx === 0 ? "default" : "outline"} className="font-medium">
                                    {getRef(scripture)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">KJV</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {expandedVerses.has(idx) ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
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
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Preparing comprehensive teaching content...</p>
                  <p className="text-xs text-muted-foreground mt-2">This may take a moment for thorough content</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
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
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading objections and answers...</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {objectionsContent || "Click 'Ask Jeeves' below to explore common objections and biblical responses."}
                    </div>
                  </div>
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
              </div>

              {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading Adventist history...</p>
                </div>
              ) : (
                <ScrollArea className="h-[450px] pr-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {historyContent || "Click 'Ask Jeeves' to explore the Adventist history of this doctrine."}
                    </div>
                  </div>
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
                <ScrollArea className="h-[400px] pr-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {egwContent || "Click 'Ask Jeeves' to explore Ellen White's writings on this doctrine."}
                    </div>
                  </div>
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

          {/* QUIZ SECTION - Now with AI-generated questions */}
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
                <ScrollArea className="h-[420px] pr-4">
                  <div className="space-y-4">
                    {quizQuestions.map((q, idx) => (
                      <Card key={idx} className={quizSubmitted ? (parseInt(quizAnswers[idx]) === q.correct ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5') : ''}>
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
                                  className={`${quizSubmitted && optIdx === q.correct ? 'text-green-600 font-medium' : ''} ${quizSubmitted && parseInt(quizAnswers[idx]) === optIdx && optIdx !== q.correct ? 'text-red-600 line-through' : ''}`}
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {quizSubmitted && (
                            <div className={`mt-3 p-2 rounded text-sm ${parseInt(quizAnswers[idx]) === q.correct ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'}`}>
                              {parseInt(quizAnswers[idx]) === q.correct ? (
                                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Correct!</span>
                              ) : (
                                <span>Correct answer: {q.options[q.correct]}</span>
                              )}
                              {q.explanation && <p className="mt-1 text-xs">{q.explanation}</p>}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {!quizSubmitted ? (
                <Button
                  onClick={handleQuizSubmit}
                  className="w-full"
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit All Answers ({Object.keys(quizAnswers).length}/{quizQuestions.length} answered)
                </Button>
              ) : (
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={goToPrevSection}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Review Spirit of Prophecy
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
                  Personal Application
                </h2>
                <p className="text-muted-foreground">Apply this truth to your life</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Reflection Questions:</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>What did the Holy Spirit teach you through this study of "{lesson.title}"?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>How does this belief change your understanding of God?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>What specific actions will you take because of what you've learned?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Who can you share this truth with this week?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>How does this doctrine connect to your preparation for baptism?</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Write your personal reflection:
                  </label>
                  <Textarea
                    placeholder="What has God shown you through this lesson? How will you apply it? Be specific and personal..."
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
                <h2 className="text-2xl font-bold mb-2">Comprehensive Study Complete!</h2>
                <p className="text-muted-foreground">
                  You've completed an in-depth study of Fundamental Belief #{lesson.fundamental_number}
                </p>
              </div>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">What You Studied:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {sectionOrder.slice(1, -1).map((section) => {
                          const Icon = SECTION_ICONS[section];
                          return (
                            <div key={section} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                              <Icon className="h-3 w-3 text-green-500" />
                              <span>{SECTION_LABELS[section]}</span>
                              <CheckCircle2 className="h-3 w-3 text-green-500 ml-auto" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Scriptures Studied:</h4>
                      <div className="flex flex-wrap gap-2">
                        {scriptures.slice(0, 7).map((s: any, idx: number) => (
                          <Badge key={idx} variant="outline">{getRef(s)}</Badge>
                        ))}
                        {scriptures.length > 7 && (
                          <Badge variant="secondary">+{scriptures.length - 7} more</Badge>
                        )}
                      </div>
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
                  I have thoroughly studied and understand the biblical teaching on "{lesson.title}."
                  I commit to believing, living, and sharing this truth as I prepare for baptism
                  and grow as a Seventh-day Adventist Christian.
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
