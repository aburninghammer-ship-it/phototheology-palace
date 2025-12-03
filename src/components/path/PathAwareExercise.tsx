import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Heart, Swords, Sparkles } from "lucide-react";

interface PathAwareExerciseProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showPathHint?: boolean;
}

/**
 * Wrapper component that adds path-specific styling and hints to exercises
 */
export function PathAwareExercise({ 
  title, 
  description, 
  children, 
  showPathHint = true 
}: PathAwareExerciseProps) {
  const { activePath } = usePath();

  if (!activePath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];

  const getPathIcon = () => {
    switch (pathType) {
      case 'visual': return Eye;
      case 'analytical': return Search;
      case 'devotional': return Heart;
      case 'warrior': return Swords;
      default: return Sparkles;
    }
  };

  const getPathHint = () => {
    switch (pathType) {
      case 'visual':
        return "Focus on creating vivid mental images as you work through this exercise.";
      case 'analytical':
        return "Look for patterns and logical connections in this exercise.";
      case 'devotional':
        return "Take time to reflect and pray as you engage with this content.";
      case 'warrior':
        return "Challenge yourself to complete this quickly and accurately!";
      default:
        return "";
    }
  };

  const PathIcon = getPathIcon();

  return (
    <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${pathData.borderColor}`}>
            <PathIcon className="h-3 w-3 mr-1" />
            {pathData.name}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
        
        {showPathHint && (
          <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-background/50 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
            <span>{getPathHint()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * Hook to get path-specific exercise variations
 */
export function usePathExerciseVariant() {
  const { activePath } = usePath();
  const pathType = activePath?.path_type as PathType | undefined;

  const getExerciseVariant = (baseExercise: {
    visual?: React.ReactNode;
    analytical?: React.ReactNode;
    devotional?: React.ReactNode;
    warrior?: React.ReactNode;
    default: React.ReactNode;
  }) => {
    if (!pathType) return baseExercise.default;
    return baseExercise[pathType] || baseExercise.default;
  };

  const getInstructions = (baseInstructions: string) => {
    if (!pathType) return baseInstructions;

    const additions: Record<PathType, string> = {
      visual: "\n\n💡 Visual tip: Create a mental picture for each key point.",
      analytical: "\n\n💡 Analytical tip: Look for the logical structure and patterns.",
      devotional: "\n\n💡 Devotional tip: Pause to reflect and pray over what you discover.",
      warrior: "\n\n💡 Challenge: Try to complete this in under 5 minutes!",
    };

    return baseInstructions + (additions[pathType] || "");
  };

  const getTimerMultiplier = () => {
    if (pathType === 'warrior') return 0.75; // 25% less time for warriors
    if (pathType === 'devotional') return 1.5; // 50% more time for devotional
    return 1;
  };

  const shouldShowTimer = () => {
    return pathType === 'warrior';
  };

  const shouldShowReflectionPrompt = () => {
    return pathType === 'devotional';
  };

  const getScoreBonus = (baseScore: number) => {
    // Warriors get bonus for speed, others for thoroughness
    return baseScore;
  };

  return {
    pathType,
    getExerciseVariant,
    getInstructions,
    getTimerMultiplier,
    shouldShowTimer,
    shouldShowReflectionPrompt,
    getScoreBonus,
  };
}
