import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Circle,
  Clock,
  Play,
  Sparkles,
  Droplets,
  Flame,
  Gem,
  Hash,
  User,
  Crown,
  Sword,
  Shield,
  Star,
  Sun,
  Box,
  Landmark,
  Scroll,
  Brain,
  Layers,
  Target,
  Compass,
  Route,
  Map,
  BookOpen,
  Lightbulb,
  Grid3X3,
  Calculator,
  Binary,
} from "lucide-react";
import { GeneratedStudyPath, GeneratedPathStep } from "@/hooks/useGeneratedStudyPaths";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets, Flame, Sparkles, Gem, Hash, User, Crown, Sword, Shield, Star, Sun,
  Box, Landmark, Scroll, Brain, Layers, Target, Compass, Route, Map, BookOpen,
  Lightbulb, Grid3X3, Calculator, Binary,
};

const typeLabels: Record<string, string> = {
  symbol: "Symbol",
  number: "Number",
  person: "Person",
  title: "Title",
  object: "Object",
  concept: "Concept",
  theme: "Theme",
};

const typeBadgeColors: Record<string, string> = {
  symbol: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  number: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  person: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  title: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  object: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  concept: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  theme: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

interface GeneratedPathCardProps {
  path: GeneratedStudyPath;
  onStart?: (path: GeneratedStudyPath) => void;
}

export const GeneratedPathCard = ({ path, onStart }: GeneratedPathCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = iconMap[path.icon] || Route;

  const categoryColors: Record<string, string> = {
    sanctuary: "from-blue-500/20 to-indigo-500/10 border-blue-300/30",
    patterns: "from-emerald-500/20 to-teal-500/10 border-emerald-300/30",
    elements: "from-cyan-500/20 to-blue-500/10 border-cyan-300/30",
    types: "from-purple-500/20 to-violet-500/10 border-purple-300/30",
    cycles: "from-orange-500/20 to-red-500/10 border-orange-300/30",
    prophecy: "from-rose-500/20 to-pink-500/10 border-rose-300/30",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg",
        "bg-gradient-to-br dark:from-slate-900/50 dark:to-slate-800/30",
        categoryColors[path.category] || "from-amber-500/20 to-orange-500/10"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <IconComponent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{path.title}</CardTitle>
              <Badge className={cn("text-[10px]", typeBadgeColors[path.theme_type] || "")}>
                {typeLabels[path.theme_type] || path.theme_type}: {path.theme_keyword}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {path.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{path.estimated_sessions} steps</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Generated</span>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs">View Study Steps</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-1">
            {path.steps.map((step: GeneratedPathStep, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-md text-sm text-muted-foreground"
              >
                <Circle className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {index + 1}. {step.title}
                </span>
                <span className="text-xs text-muted-foreground/60 ml-auto shrink-0">
                  {step.verse_anchor}
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Button
          onClick={() => onStart?.(path)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Path
        </Button>
      </CardContent>
    </Card>
  );
};
