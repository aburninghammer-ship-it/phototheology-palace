import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, RefreshCw, Loader2, Sparkles, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeShareDialog } from "./ChallengeShareDialog";
import { PostToPublicChallengeButton } from "./PostToPublicChallengeButton";
import { toast } from "sonner";

type Difficulty = "easy" | "intermediate" | "advanced" | "pro";

const difficultyInfo: Record<Difficulty, { symbols: number; description: string }> = {
  easy: { symbols: 3, description: "3 principles" },
  intermediate: { symbols: 6, description: "6 principles" },
  advanced: { symbols: 9, description: "9 principles" },
  pro: { symbols: 12, description: "12 principles" },
};

interface InlineEquationGeneratorProps {
  onSubmit: (data: any) => void;
}

export const InlineEquationGenerator = ({ onSubmit }: InlineEquationGeneratorProps) => {
  const [suggestedVerse, setSuggestedVerse] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [loading, setLoading] = useState(false);
  const [equation, setEquation] = useState<{
    verse: string;
    equation: string;
    symbols: string[];
    explanation: string;
  } | null>(null);
  const [solution, setSolution] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const generateEquation = async () => {
    setLoading(true);
    setEquation(null);
    setSolution("");
    setHasSubmitted(false);

    try {
      const expectedCount = difficultyInfo[difficulty].symbols;
      let validEquation = null;
      let attempts = 0;

      while (!validEquation && attempts < 5) {
        attempts++;
        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "equations-challenge",
            difficulty,
            symbolCount: expectedCount,
            randomSeed: Date.now() + Math.random() + attempts,
            suggestedVerse: suggestedVerse.trim() || undefined,
          },
        });

        if (error) throw error;

        if (data?.symbols?.length === expectedCount) {
          validEquation = data;
        }
      }

      if (!validEquation) {
        throw new Error("Failed to generate a valid equation. Please try again.");
      }

      setEquation(validEquation);
    } catch (error: any) {
      console.error("Error generating equation:", error);
      toast.error(error.message || "Failed to generate equation");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!solution.trim() || !equation) return;

    onSubmit({
      solution: solution.trim(),
      equation: equation.equation,
      principle_applied: "Multiple Palace Principles",
    });
    setHasSubmitted(true);
    toast.success("Solution submitted to Growth Journal!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Generate an Equation Challenge</CardTitle>
        </div>
        <CardDescription>
          Enter a verse or passage and Jeeves will create a Palace equation for you to decode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Verse Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium">Verse or Passage</label>
          </div>
          <Input
            placeholder="e.g. John 3:16, Genesis 22, Psalm 23:1-6"
            value={suggestedVerse}
            onChange={(e) => setSuggestedVerse(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank for a random verse, or enter a specific passage.
          </p>
        </div>

        {/* Difficulty */}
        <div className="flex gap-2">
          {(Object.keys(difficultyInfo) as Difficulty[]).map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficulty(diff)}
            >
              <span className="capitalize">{diff}</span>
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {difficultyInfo[diff].description}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Generate Button */}
        <Button onClick={generateEquation} disabled={loading} className="w-full gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : equation ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Generate New Equation
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Equation
            </>
          )}
        </Button>

        {/* Generated Equation Display */}
        {equation && (
          <div className="space-y-4 pt-2">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold mb-1">Verse:</p>
              <p className="text-lg italic mb-4">{equation.verse}</p>
              <p className="font-semibold mb-1">Equation:</p>
              <code className="text-lg font-mono bg-background px-3 py-2 rounded block">
                {equation.equation}
              </code>
            </div>

            {equation.symbols && equation.symbols.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {equation.symbols.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {s}
                  </Badge>
                ))}
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
                    rows={5}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={!solution.trim()}>
                  Submit Solution to Growth Journal
                </Button>
              </>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-3">
                <p className="text-green-800 dark:text-green-200">
                  ✓ Solution Submitted! Added to your Growth Journal.
                </p>
              </div>
            )}

            <Button variant="outline" onClick={() => setShowShareDialog(true)} className="w-full gap-2">
              <Share2 className="h-4 w-4" />
              Share to Social Media
            </Button>
            <PostToPublicChallengeButton
              challengeType="equation"
              title={`Equation: ${equation.verse}`}
              content={`🧮 **Equation:** \`${equation.equation}\`\n\n📖 **Verse:** ${equation.verse}\n\n${equation.symbols.length > 0 ? `🔑 **Symbols:** ${equation.symbols.join(", ")}\n\n` : ""}⚡ **Challenge:** Decode what each symbol means, explain how the parts connect, and show the Christ-centered insight the full equation reveals.`}
              difficulty={difficulty}
              className="w-full"
            />
          </div>
        )}
      </CardContent>

      {equation && (
        <ChallengeShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          equation={equation}
          difficulty={difficulty}
        />
      )}
    </Card>
  );
};
