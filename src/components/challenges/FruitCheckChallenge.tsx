import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sprout } from "lucide-react";

interface FruitCheckProps {
  challenge: any;
  onSubmit: (data: any) => void;
  hasSubmitted: boolean;
}

export const FruitCheckChallenge = ({ challenge, onSubmit, hasSubmitted }: FruitCheckProps) => {
  const [actionStep, setActionStep] = useState("");
  const [growthArea, setGrowthArea] = useState("");

  const handleSubmit = () => {
    if (!actionStep.trim() || !growthArea.trim()) return;
    
    onSubmit({
      verse: challenge.verses?.[0],
      action_today: actionStep.trim(),
      growth_needed: growthArea.trim(),
      principle_applied: "Fruit Room (FRt) - Integrity Sweep"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <CardTitle>{challenge.title}</CardTitle>
          </div>
          <Badge>Quick • 3-5 min</Badge>
        </div>
        <CardDescription className="mt-2">
          Principle: Fruit Room (FRt) - Does my life match the truth?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <p className="font-semibold mb-2">Today's Truth Check:</p>
          {challenge.passage_reference && (
            <p className="text-sm text-muted-foreground mb-1">{challenge.passage_reference}</p>
          )}
          <p className="text-lg italic">{challenge.verses?.[0] || challenge.ui_config?.verse_text || "Verse text not available"}</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            This is an integrity sweep: be honest with yourself and God. This builds missional character.
          </p>
        </div>

        {!hasSubmitted ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Today I will... (one concrete action):</label>
              <Textarea
                placeholder="Name one action you will take today that lines up with this verse..."
                value={actionStep}
                onChange={(e) => setActionStep(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">God still needs to work on... (one area):</label>
              <Textarea
                placeholder="Name one area in your life that doesn't match this truth yet..."
                value={growthArea}
                onChange={(e) => setGrowthArea(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={!actionStep.trim() || !growthArea.trim()}
            >
              Submit Integrity Check
            </Button>
          </>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✓ Integrity check complete. You're building real discipleship, not just collecting knowledge.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
