import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Church,
  Mountain,
  Waves,
  Play,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { StudyPath, getCardsForPath } from "@/data/studyIdeasLibrary";
import { PathProgress } from "@/hooks/usePathProgress";
import { cn } from "@/lib/utils";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Church,
  Mountain,
  Waves,
};

interface StudyPathCardProps {
  path: StudyPath;
  progress?: PathProgress;
  onStart?: (pathId: string) => void;
  onContinue?: (pathId: string, cardIndex: number) => void;
  onReset?: (pathId: string) => void;
}

export const StudyPathCard = ({
  path,
  progress,
  onStart,
  onContinue,
  onReset,
}: StudyPathCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const cards = getCardsForPath(path.id);

  const IconComponent = iconMap[path.icon] || Church;

  const isStarted = !!progress;
  const isCompleted = !!progress?.completed_at;
  const completedCount = progress?.completed_cards.length || 0;
  const totalCards = path.cardSequence.length;
  const progressPercent = Math.round((completedCount / totalCards) * 100);

  const handleAction = () => {
    if (!isStarted) {
      onStart?.(path.id);
    } else if (!isCompleted) {
      onContinue?.(path.id, progress?.current_card_index || 0);
    }
  };

  const categoryColors: Record<string, string> = {
    sanctuary: "from-blue-500/20 to-indigo-500/10 border-blue-300/30",
    patterns: "from-emerald-500/20 to-teal-500/10 border-emerald-300/30",
    elements: "from-cyan-500/20 to-blue-500/10 border-cyan-300/30",
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
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg truncate">{path.title}</CardTitle>
              {isCompleted && (
                <Badge className="bg-emerald-500 text-white shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {path.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{path.estimatedSessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-4 w-4" />
            <span>{totalCards} cards</span>
          </div>
        </div>

        {/* Progress Bar (if started) */}
        {isStarted && !isCompleted && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {completedCount}/{totalCards} cards ({progressPercent}%)
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Card List (Collapsible) */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs">View Path Cards</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-1">
            {cards.map((card, index) => {
              const isCardCompleted = progress?.completed_cards.includes(card.id);
              const isCurrent = progress?.current_card_index === index;
              return (
                <div
                  key={card.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-sm",
                    isCardCompleted && "text-emerald-600 dark:text-emerald-400",
                    isCurrent &&
                      !isCardCompleted &&
                      "bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
                    !isCardCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {isCardCompleted ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">
                    {index + 1}. {card.title}
                  </span>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAction}
            className={cn(
              "flex-1",
              isCompleted
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            )}
            disabled={isCompleted}
          >
            <Play className="h-4 w-4 mr-2" />
            {!isStarted
              ? "Start Path"
              : isCompleted
              ? "Completed"
              : "Continue"}
          </Button>
          {isStarted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onReset?.(path.id)}
              title="Reset progress"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
