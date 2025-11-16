import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";

interface EquationDecodeChallengeProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const EquationDecodeChallenge = ({ challenge, onSubmit, hasSubmitted }: EquationDecodeChallengeProps) => {
  const [solution, setSolution] = useState("");

  const handleSubmit = () => {
    if (!solution.trim()) return;
    
    onSubmit({
      solution: solution.trim(),
      equation: challenge.ui_config?.equation,
      principle_applied: "Multiple Palace Principles"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Core • 10-15 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Decode this biblical equation using palace principles and symbols
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Verse:</p>
          <p className="text-sm text-muted-foreground mb-1">{challenge.passage_reference}</p>
          <p className="text-lg italic mb-4">{challenge.verses?.[0] || challenge.ui_config?.verse_text || "Verse text not available"}</p>
          <p className="font-semibold mb-2">Equation:</p>
          <code className="text-lg font-mono bg-background px-3 py-2 rounded block">
            {challenge.ui_config?.equation}
          </code>
        </div>

        {challenge.ui_config?.hints && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm space-y-1">
            <p className="font-semibold">💡 Hints:</p>
            <ul className="ml-4 space-y-1">
              {challenge.ui_config.hints.map((hint: string, i: number) => (
                <li key={i}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Decode the Equation:</label>
              <Textarea
                placeholder="Explain what each symbol means and how they combine to reveal Christ in this passage..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={6}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!solution.trim()}
            >
              Submit Solution to Growth Journal
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Solution Submitted! Added to your Growth Journal.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
