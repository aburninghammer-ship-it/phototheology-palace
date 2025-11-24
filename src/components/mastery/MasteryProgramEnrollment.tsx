import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Award, CheckCircle, Lock, Sparkles, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MasteryProgramEnrollmentProps {
  roomName: string;
  roomTag: string;
  floorNumber: number;
  totalActivities: number;
  completedActivities: number;
  masteryLevel: number;
  onBeginMastery: () => void;
  isEnrolled?: boolean;
}

const MASTERY_LEVELS = [
  { level: 1, name: "Novice", icon: "🎯", color: "text-slate-600" },
  { level: 2, name: "Apprentice", icon: "📚", color: "text-blue-600" },
  { level: 3, name: "Adept", icon: "⚡", color: "text-purple-600" },
  { level: 4, name: "Expert", icon: "🔥", color: "text-orange-600" },
  { level: 5, name: "Master", icon: "👑", color: "text-amber-500" },
];

export const MasteryProgramEnrollment = ({
  roomName,
  roomTag,
  floorNumber,
  totalActivities,
  completedActivities,
  masteryLevel,
  onBeginMastery,
  isEnrolled = false,
}: MasteryProgramEnrollmentProps) => {
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  const currentLevel = MASTERY_LEVELS[masteryLevel - 1] || MASTERY_LEVELS[0];
  const nextLevel = MASTERY_LEVELS[masteryLevel] || null;

  if (!isEnrolled) {
    return (
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {roomName} Mastery Program
          </CardTitle>
          <CardDescription className="text-base">
            A structured training path to achieve complete mastery of this Phototheology principle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Structured Curriculum</p>
                  <p className="text-sm text-muted-foreground">{totalActivities} training activities</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">5 Mastery Levels</p>
                  <p className="text-sm text-muted-foreground">Progress from Novice to Master</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">AI-Powered Mentor</p>
                  <p className="text-sm text-muted-foreground">Personalized guidance & feedback</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={onBeginMastery}
            className="w-full h-12 text-lg gradient-palace"
            size="lg"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Begin Mastery Program
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Commit to this training path and master the {roomTag} principle
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-sm">
            Floor {floorNumber} • {roomTag}
          </Badge>
          <Badge variant="outline" className={`text-sm ${currentLevel.color}`}>
            {currentLevel.icon} {currentLevel.name}
          </Badge>
        </div>
        <CardTitle className="text-xl">
          {roomName} Mastery Program
        </CardTitle>
        <CardDescription>
          {completedActivities} of {totalActivities} activities completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Program Progress</span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {MASTERY_LEVELS.map((level) => (
            <div
              key={level.level}
              className={`text-center p-3 rounded-lg border-2 transition-all ${
                masteryLevel >= level.level
                  ? "border-primary bg-primary/10"
                  : masteryLevel === level.level - 1
                  ? "border-primary/50 bg-accent"
                  : "border-border bg-card opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{level.icon}</div>
              <p className="text-xs font-medium">{level.name}</p>
              {masteryLevel >= level.level && (
                <CheckCircle className="h-4 w-4 mx-auto mt-1 text-primary" />
              )}
              {masteryLevel === level.level - 1 && (
                <Target className="h-4 w-4 mx-auto mt-1 text-primary" />
              )}
              {masteryLevel < level.level - 1 && (
                <Lock className="h-4 w-4 mx-auto mt-1 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {nextLevel && (
          <div className="p-4 rounded-lg bg-accent/50 border">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Next Level: {nextLevel.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete all curriculum activities and pass milestone tests to advance
                </p>
              </div>
            </div>
          </div>
        )}

        {masteryLevel === 5 && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-600 dark:text-amber-400">
                  🎉 Master Level Achieved!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You have achieved complete mastery of this principle
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
