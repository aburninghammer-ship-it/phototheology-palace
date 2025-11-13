import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface PrincipleStudyChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const PrincipleStudyChallenge = ({ challenge, onSubmit, hasSubmitted }: PrincipleStudyChallengeProps) => {
  const [study, setStudy] = useState("");

  const handleSubmit = () => {
    if (!study.trim()) return;
    
    onSubmit({
      study: study.trim(),
      principles_used: challenge.ui_config?.principles || [],
      principle_applied: challenge.principle_used
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Core • 15-20 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Apply Palace principles to study this passage deeply
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Today's Passage:</p>
          <p className="text-lg italic mb-3">{challenge.passage_reference}</p>
          <p className="text-sm">{challenge.description}</p>
        </div>

        {challenge.ui_config?.principles && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="font-semibold text-sm mb-2">Principles to Apply:</p>
            <div className="flex flex-wrap gap-2">
              {challenge.ui_config.principles.map((principle: string, i: number) => (
                <Badge key={i} variant="secondary">{principle}</Badge>
              ))}
            </div>
          </div>
        )}

        {challenge.ui_config?.prompts && (
          <div className="space-y-2">
            <p className="font-semibold text-sm">Study Prompts:</p>
            <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
              {challenge.ui_config.prompts.map((prompt: string, i: number) => (
                <li key={i}>• {prompt}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Study Notes:</label>
              <Textarea
                placeholder="Apply the principles above to this passage. What do you discover? How does Christ appear? What connections emerge?"
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                rows={8}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!study.trim()}
            >
              Submit Study to Growth Journal
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Study Complete! Added to your Growth Journal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
