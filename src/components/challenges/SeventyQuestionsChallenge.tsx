import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

interface SeventyQuestionsChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const SeventyQuestionsChallenge = ({ challenge, onSubmit, hasSubmitted }: SeventyQuestionsChallengeProps) => {
  const [questions, setQuestions] = useState("");

  const handleSubmit = () => {
    if (!questions.trim()) return;
    
    const questionCount = questions.split('\n').filter(q => q.trim()).length;
    
    onSubmit({
      questions: questions.trim(),
      question_count: questionCount,
      principle_applied: "Questions Room (QR)"
    });
  };

  const targetQuestions = challenge.ui_config?.target_questions || 70;
  const currentCount = questions.split('\n').filter(q => q.trim()).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Deep • 20-30 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Ask {targetQuestions} questions on this text (Intratextual, Intertextual, Phototheological)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Today's Passage:</p>
          <p className="text-lg italic">{challenge.passage_reference}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm space-y-2">
          <p className="font-semibold">Three Question Types:</p>
          <ul className="ml-4 space-y-1">
            <li>• <strong>Intratextual:</strong> Questions within the text (Why this word? Why this order?)</li>
            <li>• <strong>Intertextual:</strong> Questions across Scripture (Where else? How does this connect?)</li>
            <li>• <strong>Phototheological:</strong> Questions within PT framework (Which rooms? Which cycle?)</li>
          </ul>
        </div>

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your Questions:</label>
                <span className="text-sm text-muted-foreground">
                  {currentCount} / {targetQuestions} questions
                </span>
              </div>
              <Textarea
                placeholder="1. Why does the text use this specific word?&#10;2. Where else does this phrase appear in Scripture?&#10;3. Which Palace room does this connect to?&#10;4. How does this point to Christ?&#10;..."
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                rows={12}
              />
              <p className="text-xs text-muted-foreground">
                One question per line. Mix intratextual, intertextual, and Phototheological questions.
              </p>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={currentCount < 10}
            >
              Submit Questions to Growth Journal
            </Button>
            {currentCount < 10 && (
              <p className="text-xs text-center text-muted-foreground">
                Write at least 10 questions to submit (aim for {targetQuestions})
              </p>
            )}
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Questions Submitted! You asked {currentCount} questions. Added to your Growth Journal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
