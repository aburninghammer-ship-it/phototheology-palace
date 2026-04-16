import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Shield, GraduationCap, Crown } from "lucide-react";

interface StudyModeSelectorProps {
  activeMode: "beginner" | "advanced" | "apologetics" | "preacher-mentor";
  onModeChange: (mode: "beginner" | "advanced" | "apologetics" | "preacher-mentor") => void;
}

const modes = [
  {
    id: "beginner" as const,
    name: "Beginner",
    icon: BookOpen,
    description: "Memorization focus",
  },
  {
    id: "advanced" as const,
    name: "Advanced",
    icon: GraduationCap,
    description: "Full PT depth",
  },
  {
    id: "apologetics" as const,
    name: "Apologetics",
    icon: Shield,
    description: "Defense mode",
  },
  {
    id: "preacher-mentor" as const,
    name: "Preacher Mentor",
    icon: Crown,
    description: "Mentor commentary",
  },
];

export const StudyModeSelector = ({ activeMode, onModeChange }: StudyModeSelectorProps) => {
  const activeConfig = modes.find(m => m.id === activeMode);
  const ActiveIcon = activeConfig?.icon || BookOpen;

  return (
    <Select value={activeMode} onValueChange={(value) => onModeChange(value as typeof activeMode)}>
      <SelectTrigger className="w-[180px] h-9">
        <div className="flex items-center gap-2">
          <ActiveIcon className="h-4 w-4" />
          <SelectValue placeholder="Study Mode" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <SelectItem key={mode.id} value={mode.id}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{mode.name}</span>
                <span className="text-muted-foreground text-xs">- {mode.description}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
