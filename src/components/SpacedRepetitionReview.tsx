import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { Brain, Check, X, AlertCircle } from "lucide-react";

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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{currentItem.item_type}</Badge>
            <span className="text-xs text-muted-foreground">
              Review #{currentItem.repetitions + 1}
            </span>
          </div>
          
          <div className="p-6 rounded-lg bg-muted/50 border">
            <p className="text-lg leading-relaxed">
              {currentItem.content.question || currentItem.content.text}
            </p>
            {currentItem.content.reference && (
              <p className="text-sm text-muted-foreground mt-2">
                {currentItem.content.reference}
              </p>
            )}
          </div>
        </div>

        {showAnswer ? (
          <>
            <div className="p-6 rounded-lg bg-primary/5 border border-primary">
              <p className="font-medium text-primary mb-2">Answer:</p>
              <p className="text-lg leading-relaxed">{currentItem.content.answer}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                How well did you remember this?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleReview(0)}
                  className="gap-2 h-auto py-3"
                >
                  <X className="h-4 w-4" />
                  <span>Forgot</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(3)}
                  className="gap-2 h-auto py-3"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Hard</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(4)}
                  className="gap-2 h-auto py-3"
                >
                  <span>Good</span>
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleReview(5)}
                  className="gap-2 h-auto py-3"
                >
                  <Check className="h-4 w-4" />
                  <span>Easy</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Button onClick={() => setShowAnswer(true)} className="w-full" size="lg">
            Show Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
