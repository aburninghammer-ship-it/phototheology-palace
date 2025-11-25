import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Shield, GraduationCap } from "lucide-react";

interface StudyModeSelectorProps {
  activeMode: "beginner" | "advanced" | "apologetics";
  onModeChange: (mode: "beginner" | "advanced" | "apologetics") => void;
}

export const StudyModeSelector = ({ activeMode, onModeChange }: StudyModeSelectorProps) => {
  const modes = [
    {
      id: "beginner" as const,
      name: "Beginner",
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Story Room, Imagination, 24FPS - Focus on memorization",
      features: ["Visual anchors", "Story sequences", "Basic symbolism"]
    },
    {
      id: "advanced" as const,
      name: "Advanced",
      icon: GraduationCap,
      color: "bg-purple-500",
      description: "All 8 Floors - Full PT analysis and depth",
      features: ["Christ-centered", "Cycles & Heavens", "Typology", "Prophecy"]
    },
    {
      id: "apologetics" as const,
      name: "Apologetics",
      icon: Shield,
      color: "bg-amber-500",
      description: "Defense mode - Q&A, objections, chains",
      features: ["Common objections", "Biblical defense", "Cross-references"]
    }
  ];

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-amber-500/5 border-2 border-primary/20">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-sm text-foreground">Study Mode</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Choose your learning approach to customize which tools and panels are shown
      </p>

      <div className="grid gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <Button
              key={mode.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onModeChange(mode.id)}
              className={`h-auto flex-col items-start p-4 text-left gap-2 ${
                isActive ? mode.color + " text-white hover:opacity-90" : ""
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="h-5 w-5" />
                <span className="font-semibold">{mode.name}</span>
                {isActive && (
                  <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-90">{mode.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {mode.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className={`text-xs ${isActive ? "bg-white/20 text-white" : ""}`}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </Button>
          );
        })}
      </div>

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Adaptive Learning:</strong> Switch modes based on your study goals. Beginner focuses on memorization, Advanced on depth, Apologetics on defense.
        </p>
      </div>
    </Card>
  );
};
