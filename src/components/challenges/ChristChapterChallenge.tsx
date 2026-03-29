import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ChristChapterProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const ChristChapterChallenge = ({ challenge, onSubmit, hasSubmitted }: ChristChapterProps) => {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    onSubmit({
      chapter: challenge.ui_config?.chapter,
      christ_reflection: answer.trim(),
      principle_applied: "Christ in Every Chapter Room (CEC)"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Quick • 3-5 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Principle: Christ in Every Chapter (CEC) - See Jesus everywhere in Scripture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Today's Challenge:</p>
          <p className="text-2xl font-bold text-primary">{challenge.ui_config?.chapter}</p>
          <p className="text-sm text-muted-foreground mt-2">{challenge.description}</p>
        </div>

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Where is Jesus in this chapter? (1-2 sentences):</label>
              <Textarea
                placeholder="Example: 'Isaac carrying the wood up the hill is a picture of Christ carrying the cross. The ram caught in the thicket is the substitute Lamb.'"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
              />
            </div>

            {!showHint && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHint(true)}
                className="w-full"
              >
                Need a hint? Click here
              </Button>
            )}

            {showHint && challenge.ui_config?.hints && (
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold mb-2">Hints to consider:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {challenge.ui_config.hints.map((hint: string, idx: number) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!answer.trim()}
            >
              Submit Christ Reflection
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Perfect! You're training to see Christ everywhere, which kills legalism and centers everything on grace.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
