import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BookOpen,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Eye,
  Link2,
  Lightbulb,
  Church,
  Target,
  Sparkles,
  Sun,
  Layers,
  Compass,
  MapPin,
  Palette,
  Scale,
  Droplets,
  Wind,
  Mountain,
  ScrollText,
  PersonStanding,
  DoorOpen,
  Wheat,
  Divide,
  Crown,
  Zap,
  CalendarDays,
  RefreshCw,
  Hash,
  Moon,
  Cross,
  TreeDeciduous,
  Gift,
  Copy,
  Flame,
  Bird,
  ShieldCheck,
  Droplet,
} from "lucide-react";
import { SparkCard } from "@/data/studyIdeasLibrary";
import { cn } from "@/lib/utils";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Church,
  Target,
  Sparkles,
  Sun,
  Layers,
  Compass,
  MapPin,
  Palette,
  Scale,
  Droplets,
  Wind,
  Mountain,
  ScrollText,
  PersonStanding,
  DoorOpen,
  Wheat,
  Divide,
  Crown,
  Zap,
  CalendarDays,
  RefreshCw,
  Hash,
  Moon,
  Cross,
  TreeDeciduous,
  Gift,
  Copy,
  Flame,
  Bird,
  ShieldCheck,
  Droplet,
};

interface SparkCardComponentProps {
  card: SparkCard;
  isSaved?: boolean;
  onSave?: (cardId: string) => void;
  onRemove?: (cardId: string) => void;
  showSaveButton?: boolean;
  compact?: boolean;
  isNew?: boolean;
}

export const SparkCardComponent = ({
  card,
  isSaved = false,
  onSave,
  onRemove,
  showSaveButton = true,
  compact = false,
  isNew = false,
}: SparkCardComponentProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenInStudyBuddy = () => {
    // Navigate to Study Buddy with card data
    navigate(`/study-buddy?source=spark-card&cardId=${card.id}`);
  };

  const handleSaveToggle = () => {
    if (isSaved && onRemove) {
      onRemove(card.id);
    } else if (onSave) {
      onSave(card.id);
    }
  };

  const categoryColors: Record<string, string> = {
    sanctuary: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    types: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    cycles: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    patterns: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    prophecy: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    elements: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 dark:border-amber-800/30">
      <CardHeader className={cn("pb-2", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={cn(
              "text-amber-900 dark:text-amber-100 leading-tight",
              compact ? "text-base" : "text-lg"
            )}
          >
            {card.title}
          </CardTitle>
          {showSaveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={handleSaveToggle}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-amber-600" />
              ) : (
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>

        {/* Category Badge + New Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("w-fit text-xs", categoryColors[card.category])}
          >
            {card.category}
          </Badge>
          {isNew && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs animate-pulse">
              New Today
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-3", compact && "p-3 pt-0")}>
        {/* Verse Anchors */}
        <div className="flex flex-wrap gap-1.5">
          {card.verseAnchors.map((verse) => (
            <Badge
              key={verse}
              variant="secondary"
              className="bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 text-xs"
            >
              {verse}
            </Badge>
          ))}
        </div>

        {/* Palace Rooms */}
        <div className="flex flex-wrap gap-2">
          {card.palaceRooms.map((room) => {
            const IconComponent = iconMap[room.icon] || Sparkles;
            return (
              <div
                key={room.id}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{room.name}</span>
              </div>
            );
          })}
        </div>

        {/* Collapsible Prompts */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs">{t('studyIdeas.studyPrompts', 'Study Prompts')}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-start gap-2 text-sm">
              <Eye className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
              <div>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {t('studyIdeas.observe', 'Observe')}:
                </span>{" "}
                <span className="text-muted-foreground">
                  {card.prompts.observe}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Link2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
              <div>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {t('studyIdeas.connect', 'Connect')}:
                </span>{" "}
                <span className="text-muted-foreground">
                  {card.prompts.connect}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Lightbulb className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
              <div>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {t('studyIdeas.discover', 'Discover')}:
                </span>{" "}
                <span className="text-muted-foreground">
                  {card.prompts.discover}
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Open in Study Buddy Button */}
        <Button
          onClick={handleOpenInStudyBuddy}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          size={compact ? "sm" : "default"}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {t('studyIdeas.openInStudyBuddy', 'Open in Study Buddy')}
        </Button>
      </CardContent>
    </Card>
  );
};
