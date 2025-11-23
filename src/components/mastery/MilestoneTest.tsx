import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MilestoneTestProps {
  level: number;
  activityId: string;
  roomName: string;
  onPass: (activityId: string) => void;
  onCancel: () => void;
}

const MILESTONE_TITLES = {
  1: "Novice Assessment",
  2: "Apprentice Certification",
  3: "Practitioner Exam",
  4: "Expert Mastery Test",
} as const;

const MILESTONE_DESCRIPTIONS = {
  1: "Demonstrate you understand the core principles of this room",
  2: "Show you can apply these concepts in various contexts",
  3: "Prove you can teach and explain these principles to others",
  4: "Master all edge cases and advanced applications",
} as const;

export const MilestoneTest = ({ level, activityId, roomName, onPass, onCancel }: MilestoneTestProps) => {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const title = MILESTONE_TITLES[level as keyof typeof MILESTONE_TITLES] || "Level Assessment";
  const description = MILESTONE_DESCRIPTIONS[level as keyof typeof MILESTONE_DESCRIPTIONS] || "Complete this test to advance";

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleCompleteTest = () => {
    setTestCompleted(true);
    onPass(activityId);
  };

  if (!testStarted) {
    return (
      <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is a milestone test to advance to Level {level + 1}. Make sure you've completed all recommended activities before proceeding.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Trophy className="h-4 w-4 text-primary" />
              <div>
                <div className="font-semibold">XP Reward</div>
                <div className="text-xs text-muted-foreground">100-150 XP</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <Award className="h-4 w-4 text-accent" />
              <div>
                <div className="font-semibold">Level Up</div>
                <div className="text-xs text-muted-foreground">Advance to Lv{level + 1}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleStartTest} className="flex-1" size="lg">
              Begin Test
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (testCompleted) {
    return (
      <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
        <CardContent className="pt-6 text-center">
          <Trophy className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-2xl mb-2">Test Passed! 🎉</h3>
          <p className="text-muted-foreground mb-4">
            You've successfully advanced to the next level in {roomName}
          </p>
          <Button onClick={onCancel} size="lg">
            Return to Training
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Test in progress (simplified for now - can be expanded with actual questions)
  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Answer the questions to demonstrate your mastery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a placeholder test interface. In the full implementation, this will show actual test questions based on the room's principles.
          </AlertDescription>
        </Alert>

        <div className="p-6 border-2 border-dashed rounded-lg text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Test questions would appear here based on {roomName}'s specific curriculum.
          </p>
          <Button onClick={handleCompleteTest} size="lg">
            Complete Test (Demo)
          </Button>
        </div>

        <Button onClick={onCancel} variant="outline" className="w-full">
          Exit Test
        </Button>
      </CardContent>
    </Card>
  );
};
