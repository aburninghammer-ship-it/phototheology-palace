import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { Brain, Check, X } from "lucide-react";

export const SpacedRepetitionReview = () => {
  const { dueItems, reviewItem } = useSpacedRepetition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (dueItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Daily Review
          </CardTitle>
          <CardDescription>All caught up! Check back tomorrow.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentItem = dueItems[currentIndex];
  const progress = ((currentIndex + 1) / dueItems.length) * 100;

  const handleReview = async (quality: number) => {
    await reviewItem(currentItem.id, quality);
    
    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Review complete
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Daily Review
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {dueItems.length}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 rounded-lg bg-muted/50">
          <p className="font-medium mb-2">Question:</p>
          <p className="text-lg">{currentItem.content.question}</p>
        </div>

        {showAnswer ? (
          <>
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium mb-2">Answer:</p>
              <p className="text-lg">{currentItem.content.answer}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center mb-3">
                How well did you remember?
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleReview(1)}
                  className="flex-col h-auto py-3"
                >
                  <X className="h-4 w-4 mb-1 text-destructive" />
                  <span className="text-xs">Forgot</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(3)}
                  className="flex-col h-auto py-3"
                >
                  <span className="text-lg mb-1">🤔</span>
                  <span className="text-xs">Hard</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(5)}
                  className="flex-col h-auto py-3"
                >
                  <Check className="h-4 w-4 mb-1 text-success" />
                  <span className="text-xs">Easy</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Button onClick={() => setShowAnswer(true)} className="w-full">
            Show Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
