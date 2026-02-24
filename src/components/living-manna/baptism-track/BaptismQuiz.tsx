import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_in_blank';
  question: string;
  options?: string[];
  correctAnswer: string | number; // Index for MC, string for text
  explanation: string;
}

interface BaptismQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function BaptismQuiz({ questions, onComplete }: BaptismQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const checkAnswer = () => {
    const userAnswer = answers[currentQuestion.id];
    let isCorrect = false;

    if (currentQuestion.type === 'multiple_choice') {
      isCorrect = Number(userAnswer) === Number(currentQuestion.correctAnswer);
    } else {
      // Fuzzy match for text
      const normalizedUser = String(userAnswer).toLowerCase().trim();
      const normalizedCorrect = String(currentQuestion.correctAnswer).toLowerCase().trim();
      isCorrect = normalizedUser === normalizedCorrect;
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      setIsCompleted(true);
      onComplete(score); // Pass raw score, parent calculates percentage if needed
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold">Assessment Complete!</h3>
        <p className="text-muted-foreground">
          You scored {score} out of {questions.length}
        </p>
        <Button onClick={() => onComplete(score)} className="mt-4">
          Complete Lesson
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
              {currentQuestion.type === 'multiple_choice' ? 'Multiple Choice' : 'Fill in the Blank'}
            </span>
            <h3 className="text-xl font-medium">{currentQuestion.question}</h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
              <RadioGroup
                value={String(answers[currentQuestion.id] ?? "")}
                onValueChange={(val) => !showExplanation && handleAnswer(Number(val))}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className={cn(
                    "flex items-center space-x-2 border rounded-lg p-4 transition-colors",
                    showExplanation && idx === Number(currentQuestion.correctAnswer) ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "",
                    showExplanation && idx === Number(answers[currentQuestion.id]) && idx !== Number(currentQuestion.correctAnswer) ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : "",
                    !showExplanation && "hover:bg-muted/50 cursor-pointer"
                  )}>
                    <RadioGroupItem value={String(idx)} id={`opt-${idx}`} disabled={showExplanation} />
                    <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Type your answer here..."
                  value={String(answers[currentQuestion.id] ?? "")}
                  onChange={(e) => !showExplanation && handleAnswer(e.target.value)}
                  disabled={showExplanation}
                  className={cn(
                    showExplanation && String(answers[currentQuestion.id]).toLowerCase().trim() === String(currentQuestion.correctAnswer).toLowerCase().trim() 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/10" 
                      : showExplanation ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""
                  )}
                />
                {showExplanation && (
                  <p className="text-sm text-muted-foreground">
                    Correct answer: <span className="font-semibold text-foreground">{currentQuestion.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Explanation</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            {!showExplanation ? (
              <Button 
                onClick={checkAnswer}
                disabled={answers[currentQuestion.id] === undefined || String(answers[currentQuestion.id]).trim() === ""}
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="gap-2">
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
