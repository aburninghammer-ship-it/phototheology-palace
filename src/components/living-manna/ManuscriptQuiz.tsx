// ─── Manuscript Quiz ────────────────────────────────────────────────────────
// Interactive comprehension quiz generated from War College manuscript content.

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2, Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  question: string;
  type: "factual" | "scenario";
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
}

interface ManuscriptQuizProps {
  manuscript: string;
  dayNumber: number;
  title: string;
  track: string;
  avatarName: string;
}

export function ManuscriptQuiz({ manuscript, dayNumber, title, track, avatarName }: ManuscriptQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setStarted(true);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setScore(0);
    setFinished(false);

    try {
      const systemPrompt = `You are a quiz generator for the Phototheology War College. Generate exactly 8 comprehension questions based on the manuscript provided.

REQUIREMENTS:
- 5 multiple-choice factual comprehension questions (type: "factual")
- 3 scenario-based questions like "If someone says X, the best response would be..." (type: "scenario")
- Each question has exactly 4 options
- Exactly one correct answer per question
- Include an explanation for the correct answer (2-3 sentences)
- Include a concept name that the question tests

Return ONLY valid JSON — no markdown, no code blocks. Use this exact structure:
{
  "questions": [
    {
      "question": "...",
      "type": "factual",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "...",
      "concept": "..."
    }
  ]
}`;

      const userPrompt = `Generate a comprehension quiz for this War College manuscript:

Track: ${track}
Day ${dayNumber}: ${title}
Opponent: ${avatarName}

MANUSCRIPT:
${manuscript.substring(0, 8000)}${manuscript.length > 8000 ? "\n\n[...manuscript continues...]" : ""}`;

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        },
      });

      if (error) throw error;

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("No content returned");

      let parsed;
      try {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        parsed = JSON.parse(content);
      }

      const qs = parsed.questions as QuizQuestion[];
      if (!Array.isArray(qs) || qs.length === 0) throw new Error("Invalid quiz data");
      setQuestions(qs);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setChecked(true);
    if (selectedOption === questions[currentIndex].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setChecked(false);
    }
  };

  // ─── Not started ───
  if (!started) {
    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardContent className="p-5 text-center space-y-3">
          <Brain className="h-8 w-8 mx-auto text-emerald-400" />
          <h3 className="font-bold text-emerald-400">Test Your Understanding</h3>
          <p className="text-sm text-muted-foreground">
            8 questions generated from today's manuscript — factual recall and scenario-based reasoning.
          </p>
          <Button onClick={generateQuiz} className="gap-2">
            <Brain className="h-4 w-4" /> Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── Loading ───
  if (loading) {
    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardContent className="p-6 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-sm font-medium">Generating quiz questions...</p>
          <p className="text-xs text-muted-foreground">Analyzing manuscript content</p>
        </CardContent>
      </Card>
    );
  }

  // ─── No questions (error fallback) ───
  if (questions.length === 0) {
    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardContent className="p-5 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Could not generate quiz. Please try again.</p>
          <Button variant="outline" onClick={generateQuiz} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── Finished — Score card ───
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const message =
      pct === 100 ? "Perfect score! You've mastered this manuscript."
        : pct >= 75 ? "Strong performance. You have a solid grasp of the material."
        : pct >= 50 ? "Decent effort. Review the manuscript for areas you missed."
        : "Keep studying. Re-read the manuscript and try again.";

    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardContent className="p-6 text-center space-y-4">
          <Trophy className={`h-10 w-10 mx-auto ${pct >= 75 ? "text-yellow-400" : "text-muted-foreground"}`} />
          <div>
            <h3 className="text-2xl font-bold">{score}/{questions.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
          <Progress value={pct} className="h-2" />
          <Button variant="outline" onClick={generateQuiz} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── Active question ───
  const q = questions[currentIndex];
  const isCorrect = checked && selectedOption === q.correctIndex;
  const isWrong = checked && selectedOption !== q.correctIndex;

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
      <CardContent className="p-5 space-y-4">
        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">Question {currentIndex + 1} of {questions.length}</span>
          <span className="capitalize">{q.type}</span>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5" />

        {/* Question */}
        <p className="text-sm font-medium leading-relaxed">{q.question}</p>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let optionClass = "border-border/50 hover:border-primary/30";
            if (checked) {
              if (i === q.correctIndex) optionClass = "border-green-500/50 bg-green-500/10";
              else if (i === selectedOption) optionClass = "border-red-500/50 bg-red-500/10";
            } else if (i === selectedOption) {
              optionClass = "border-primary/50 bg-primary/10";
            }

            return (
              <button
                key={i}
                disabled={checked}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${optionClass}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {checked && i === q.correctIndex && (
                  <CheckCircle2 className="h-4 w-4 inline ml-2 text-green-500" />
                )}
                {checked && i === selectedOption && i !== q.correctIndex && (
                  <XCircle className="h-4 w-4 inline ml-2 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {checked && (
          <div className={`p-3 rounded-lg text-sm ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
            <p className="font-medium mb-1">
              {isCorrect ? "Correct!" : "Incorrect"}
              {q.concept && <span className="text-muted-foreground font-normal"> — {q.concept}</span>}
            </p>
            <p className="text-muted-foreground">{q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {!checked ? (
            <Button onClick={handleCheck} disabled={selectedOption === null} size="sm" className="gap-1.5">
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNext} size="sm" className="gap-1.5">
              {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
