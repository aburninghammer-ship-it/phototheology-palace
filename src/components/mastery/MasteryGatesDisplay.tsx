import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2, Circle, AlertCircle, Brain, GraduationCap } from "lucide-react";

interface MasteryGatesDisplayProps {
  currentLevel: number;
  roomStreak: number;
  completionPercentage: number;
  curriculumCompleted: boolean;
}

export const MasteryGatesDisplay: React.FC<MasteryGatesDisplayProps> = ({
  currentLevel,
  roomStreak,
  completionPercentage,
  curriculumCompleted,
}) => {

  // Level 5 Gate Requirements
  const level5Requirements = [
    {
      title: "Complete All Curriculum",
      description: "Finish 100% of drills and exercises in this room",
      current: completionPercentage,
      target: 100,
      met: curriculumCompleted,
      icon: <Circle className="h-5 w-5" />,
    },
    {
      title: "7-Day Room Streak",
      description: "Practice this specific room for 7 consecutive days",
      current: roomStreak,
      target: 7,
      met: roomStreak >= 7,
      icon: <Circle className="h-5 w-5" />,
    },
    {
      title: "Final Assessment",
      description: "Pass comprehensive test covering all room principles (80%+)",
      current: 0,
      target: 80,
      met: false,
      icon: <Brain className="h-5 w-5" />,
    },
    {
      title: "Teaching Demonstration",
      description: "Explain room principles clearly to Jeeves (graded by AI)",
      current: 0,
      target: 1,
      met: false,
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ];

  const trueMasterRequirements = [
    { title: "7-Day Retention Test", description: "Prove retention 1 week later", met: false },
    { title: "14-Day Retention Test", description: "Prove retention 2 weeks later", met: false },
    { title: "30-Day Retention Test", description: "Prove retention 1 month later", met: false },
  ];

  if (currentLevel < 4) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Mastery Gates System
          </CardTitle>
          <CardDescription>
            Reach Level 4 to begin the path to true mastery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold text-sm mb-2">What You're Building Toward:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Level 4:</strong> Expert status with consistent practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Level 5:</strong> Master status with comprehensive validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>True Master:</strong> Long-term retention & teaching ability</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center p-3 rounded border border-primary/20">
              <p className="text-sm font-medium">Current Level: {currentLevel}</p>
              <p className="text-xs text-muted-foreground mt-1">Keep practicing to unlock gates!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Path to Level 5 Mastery
        </CardTitle>
        <CardDescription>
          Complete all gates to unlock true mastery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Critical Warning */}
        <div className="p-4 rounded-lg bg-amber-500/10 border-2 border-amber-500/30">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Enhanced Mastery System Active
          </h4>
          <p className="text-xs text-muted-foreground">
            Level 5 requires rigorous validation. You must prove <strong>retention</strong>, 
            not just activity completion. Expect comprehensive testing and teaching demonstrations.
          </p>
        </div>

        {/* Level 5 Requirements */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">Required for Level 5 "Master"</h4>
          <div className="space-y-4">
            {level5Requirements.map((req) => (
              <div key={req.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{req.title}</span>
                  </div>
                  <Badge variant={req.met ? "default" : "outline"}>
                    {req.met ? "Complete" : `${req.current}/${req.target}`}
                  </Badge>
                </div>
                {req.target > 0 && (
                  <Progress value={(req.current / req.target) * 100} className="h-2" />
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {req.icon}
                  {req.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* True Master Requirements */}
        {currentLevel === 5 && (
          <div className="border-t pt-6">
            <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-sm">Beyond Level 5: True Master</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Level 5 proves you've learned. True Master proves you've <strong>retained</strong>.
              </p>
            </div>

            <div className="space-y-3">
              {trueMasterRequirements.map((req) => (
                <div key={req.title} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{req.title}</span>
                  </div>
                  <Badge variant={req.met ? "default" : "outline"} className="text-xs">
                    {req.met ? "Passed" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 p-3 rounded-lg bg-muted">
              <strong>💡 Spaced Repetition:</strong> Tests are auto-scheduled 7, 14, and 30 days 
              after reaching Level 5. You cannot take them early — this enforces genuine retention.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
