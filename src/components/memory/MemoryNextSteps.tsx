import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Gamepad2, 
  Users, 
  Trophy,
  Sparkles,
  CheckCircle2,
  Circle
} from "lucide-react";

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
  path: string;
  completed?: boolean;
  highlight?: boolean;
}

const NEXT_STEPS: NextStep[] = [
  {
    id: "pick-verse",
    title: "Pick Your First Verse",
    description: "Choose a verse from our curated templates or search for your own",
    icon: BookOpen,
    action: "Browse Verses",
    path: "/memory",
    highlight: true,
  },
  {
    id: "practice-drill",
    title: "Try a Practice Drill",
    description: "Test your memory with beginner-friendly exercises",
    icon: Gamepad2,
    action: "Start Drill",
    path: "/memory/games",
  },
  {
    id: "join-challenge",
    title: "Join a Memory Challenge",
    description: "Compete with others and track your progress",
    icon: Trophy,
    action: "View Challenges",
    path: "/daily-challenges",
  },
  {
    id: "study-partner",
    title: "Find a Study Partner",
    description: "Collaborate with others to memorize together",
    icon: Users,
    action: "Find Partners",
    path: "/study-partners",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "My pictures are too vague",
    solution: "Make images bizarre, colorful, and action-packed. The stranger, the more memorable.",
  },
  {
    mistake: "I forget my visual hooks",
    solution: "Review hooks within 24 hours, then at 3 days, 7 days, and 30 days.",
  },
  {
    mistake: "I made too many images",
    solution: "Group related words into single scenes. Quality over quantity.",
  },
  {
    mistake: "I can't recall without hints",
    solution: "Practice active recall daily. Start with first-letter hints, then remove them.",
  },
];

export function MemoryNextSteps() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* What's Next Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {NEXT_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.highlight 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <div className={`p-2 rounded-lg ${step.highlight ? "bg-primary/20" : "bg-muted"}`}>
                        <StepIcon className={`w-4 h-4 ${step.highlight ? "text-primary" : ""}`} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {step.title}
                        {step.highlight && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(step.path)}
                    variant={step.highlight ? "default" : "outline"}
                    size="sm"
                    className="shrink-0 gap-1"
                  >
                    {step.action}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Common Mistakes & Solutions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Common Mistakes & How to Fix Them</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {COMMON_MISTAKES.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive">!</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">"{item.mistake}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-green-500 font-medium">Fix: </span>
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
