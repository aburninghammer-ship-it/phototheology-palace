import { ExamQuestion } from "@/hooks/useMasterExam";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";

interface QuestionCardProps {
  question: ExamQuestion;
  answer: string;
  onAnswer: (answer: string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  questionNumber: number;
}

const categoryLabels: Record<string, string> = {
  palace_rooms: "Palace Rooms",
  apologetics: "Apologetics",
  gems_typology: "Gems & Typology",
  prophecy: "Prophecy",
  sanctuary: "Sanctuary",
  christ_types: "Christ Types",
  patterns_themes: "Patterns & Themes",
  memorization_courses: "Memorization & Courses",
};

const difficultyColors: Record<string, string> = {
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  master: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function QuestionCard({
  question,
  answer,
  onAnswer,
  isFlagged,
  onToggleFlag,
  questionNumber,
}: QuestionCardProps) {
  return (
    <Card variant="glass" className="w-full">
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              Q{questionNumber}
            </Badge>
            <Badge variant="outline">
              {categoryLabels[question.category] || question.category}
            </Badge>
            <Badge className={difficultyColors[question.difficulty] || ""}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="uppercase text-[10px]">
              {question.type === "mc" ? "Multiple Choice" : question.type === "tf" ? "True/False" : "Written"}
            </Badge>
          </div>
          <Button
            variant={isFlagged ? "default" : "ghost"}
            size="icon"
            className={isFlagged ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            onClick={onToggleFlag}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Question text */}
        <p className="text-base md:text-lg font-medium leading-relaxed">
          {question.question}
        </p>

        {question.scripture_ref && (
          <p className="text-sm text-muted-foreground italic">
            Reference: {question.scripture_ref}
          </p>
        )}

        {/* Answer input */}
        {question.type === "mc" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C, D
              const isSelected = answer === option;
              return (
                <button
                  key={i}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => onAnswer(option)}
                >
                  <span className="font-mono font-bold mr-3 text-primary">{letter}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {question.type === "tf" && (
          <div className="flex gap-3">
            {["True", "False"].map((val) => (
              <Button
                key={val}
                variant={answer === val ? "default" : "outline"}
                className={`flex-1 h-12 text-base ${
                  answer === val ? "gradient-palace" : ""
                }`}
                onClick={() => onAnswer(val)}
              >
                {val}
              </Button>
            ))}
          </div>
        )}

        {question.type === "sa" && (
          <Textarea
            placeholder="Type your answer here (1-3 sentences)..."
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            rows={4}
            className="resize-none text-base"
          />
        )}
      </CardContent>
    </Card>
  );
}
