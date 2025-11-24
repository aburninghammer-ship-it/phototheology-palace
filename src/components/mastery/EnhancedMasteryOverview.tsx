import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2, AlertTriangle, Flame, Brain, GraduationCap, Target } from "lucide-react";

interface EnhancedMasteryOverviewProps {
  currentLevel: number;
  xpCurrent: number;
  xpRequired: number;
  roomStreak?: number;
  curriculumComplete?: boolean;
}

export const EnhancedMasteryOverview: React.FC<EnhancedMasteryOverviewProps> = ({
  currentLevel,
  xpCurrent,
  xpRequired,
  roomStreak = 0,
  curriculumComplete = false,
}) => {
  const isMaxLevel = currentLevel === 5;

  // Define rigorous requirements for each level
  const levelRequirements = [
    {
      level: 1,
      title: "Novice",
      requirements: ["Complete first activities", "Earn 100 XP"],
      completed: currentLevel >= 1,
    },
    {
      level: 2,
      title: "Apprentice",
      requirements: ["Earn 250 XP", "Complete 5+ activities"],
      completed: currentLevel >= 2,
    },
    {
      level: 3,
      title: "Journeyman",
      requirements: ["Earn 500 XP", "Complete 10+ activities", "3-day room streak"],
      completed: currentLevel >= 3,
    },
    {
      level: 4,
      title: "Expert",
      requirements: ["Earn 1000 XP", "Complete 20+ activities", "7-day room streak", "50% curriculum complete"],
      completed: currentLevel >= 4,
    },
    {
      level: 5,
      title: "Master",
      requirements: [
        "Earn 2000 XP total",
        "100% curriculum completion",
        "7-day consecutive room streak",
        "Pass final comprehensive assessment",
        "Pass teaching demonstration (explain to Jeeves)",
      ],
      completed: currentLevel >= 5,
      critical: true,
    },
  ];

  // True Master beyond Level 5
  const trueMasterRequirements = [
    { label: "7-Day Retention Test", completed: false },
    { label: "14-Day Retention Test", completed: false },
    { label: "30-Day Retention Test", completed: false },
    { label: "Teach to Another User", completed: false },
  ];

  return (
    <div className="space-y-4">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mastery Progress
          </CardTitle>
          <CardDescription>
            Your journey through this room's mastery levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Level Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-muted-foreground">Current Level</span>
                <Badge variant="default" className="text-lg px-3 py-1">{currentLevel}</Badge>
              </div>
              <p className="text-lg font-bold">
                {levelRequirements[currentLevel - 1]?.title || "Master"}
              </p>
            </div>
            {!isMaxLevel && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Next Level</p>
                <Badge variant="outline">{currentLevel + 1}</Badge>
              </div>
            )}
          </div>

          {/* XP Progress (if not max level) */}
          {!isMaxLevel && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="font-semibold">{xpCurrent} / {xpRequired}</span>
              </div>
              <Progress value={(xpCurrent / xpRequired) * 100} className="h-3" />
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium">Room Streak</span>
              </div>
              <p className="text-2xl font-bold">{roomStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Curriculum</span>
              </div>
              <p className="text-2xl font-bold">{curriculumComplete ? "100" : "In Progress"}</p>
              <p className="text-xs text-muted-foreground">{curriculumComplete ? "Complete" : "%"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Requirements Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Level Requirements</CardTitle>
          <CardDescription>
            Each level has specific gates you must unlock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levelRequirements.map((level) => (
              <div
                key={level.level}
                className={`p-4 rounded-lg border ${
                  level.completed
                    ? "bg-green-500/5 border-green-500/20"
                    : level.level === currentLevel
                    ? "bg-primary/5 border-primary/20 ring-2 ring-primary/20"
                    : "bg-card border-border"
                } ${level.critical ? "border-2 border-amber-500/40" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {level.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : level.level === currentLevel ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 animate-pulse" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Level {level.level}: {level.title}</h4>
                        {level.critical && (
                          <Badge variant="default" className="text-xs gap-1">
                            <GraduationCap className="h-3 w-3" />
                            Critical Gate
                          </Badge>
                        )}
                      </div>
                      {level.level === currentLevel && !level.completed && (
                        <p className="text-xs text-muted-foreground mt-0.5">Current Focus</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={level.completed ? "default" : "outline"}>
                    {level.completed ? "Complete" : "Locked"}
                  </Badge>
                </div>
                <ul className="space-y-1 mt-2 ml-7">
                  {level.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* True Master Card (if Level 5 reached) */}
      {isMaxLevel && (
        <Card className="border-2 border-amber-500/40">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber-500" />
              True Master Status
            </CardTitle>
            <CardDescription>
              Ultimate mastery requires long-term retention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Level 5 proves you've learned. True Master proves you've <strong>retained</strong>. 
              Complete all retention tests to unlock teaching privileges.
            </p>
            {trueMasterRequirements.map((req, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded border">
                {req.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm flex-1 ml-3">{req.label}</span>
                <Badge variant={req.completed ? "default" : "outline"} className="text-xs">
                  {req.completed ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warning about 7-day requirement */}
      {!isMaxLevel && currentLevel >= 3 && roomStreak < 7 && (
        <Card className="border-yellow-500/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">7-Day Streak Required</h4>
                <p className="text-xs text-muted-foreground">
                  To advance to Level 5, you must maintain a 7-day consecutive practice 
                  streak in this specific room. Current streak: <strong>{roomStreak} days</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
