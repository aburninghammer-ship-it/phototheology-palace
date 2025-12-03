import { PathType, PATH_INFO } from "@/hooks/usePath";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Heart, Swords, Sparkles, Clock, BookOpen, Lightbulb } from "lucide-react";

// Path-specific exercise configurations
export const PATH_EXERCISE_CONFIG: Record<PathType, {
  timerMultiplier: number;
  showTimer: boolean;
  showReflection: boolean;
  bonusPoints: number;
  exerciseStyle: string;
  encouragement: string;
}> = {
  visual: {
    timerMultiplier: 1.0,
    showTimer: false,
    showReflection: false,
    bonusPoints: 10,
    exerciseStyle: "imagery",
    encouragement: "Let the images sink deep into your memory palace!",
  },
  analytical: {
    timerMultiplier: 1.0,
    showTimer: false,
    showReflection: false,
    bonusPoints: 10,
    exerciseStyle: "pattern",
    encouragement: "Excellent pattern recognition! Keep connecting the dots.",
  },
  devotional: {
    timerMultiplier: 1.5,
    showTimer: false,
    showReflection: true,
    bonusPoints: 15,
    exerciseStyle: "meditation",
    encouragement: "Take your time. Let the Word dwell richly in your heart.",
  },
  warrior: {
    timerMultiplier: 0.75,
    showTimer: true,
    showReflection: false,
    bonusPoints: 20,
    exerciseStyle: "challenge",
    encouragement: "Speed and accuracy! You're building warrior reflexes.",
  },
};

// Path-specific drill variations
export interface PathDrillVariant {
  title: string;
  description: string;
  instructions: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const getPathDrillVariants = (baseDrill: string, pathType: PathType): PathDrillVariant => {
  const variants: Record<PathType, Record<string, PathDrillVariant>> = {
    visual: {
      default: {
        title: "Visual Memory Challenge",
        description: "Create mental images to lock in the content",
        instructions: "As you study, form vivid mental pictures. Imagine the scenes, colors, and movements described in Scripture.",
        icon: Eye,
      },
      observation: {
        title: "Scene Visualization",
        description: "Paint the biblical scene in your mind",
        instructions: "Close your eyes briefly after reading. Can you see the scene? The people, the setting, the atmosphere?",
        icon: Eye,
      },
      memory: {
        title: "Memory Palace Placement",
        description: "Place each point in your mental palace",
        instructions: "Assign each key point to a room or location in your memory palace. Make the images vivid and unusual.",
        icon: Eye,
      },
    },
    analytical: {
      default: {
        title: "Pattern Analysis",
        description: "Find the logical structure and connections",
        instructions: "Look for the underlying patterns. How does this connect to other passages? What's the logical flow?",
        icon: Search,
      },
      observation: {
        title: "Structural Analysis",
        description: "Map the logical flow of the text",
        instructions: "Identify cause-effect relationships, chiastic structures, and thematic progressions.",
        icon: Search,
      },
      memory: {
        title: "Connection Mapping",
        description: "Build a web of cross-references",
        instructions: "For each point, find at least one parallel or contrasting passage. Build your reference network.",
        icon: Search,
      },
    },
    devotional: {
      default: {
        title: "Reflective Study",
        description: "Let the Word speak to your heart",
        instructions: "Pause after each section. What is God saying to you personally? How does this apply to your life today?",
        icon: Heart,
      },
      observation: {
        title: "Lectio Divina",
        description: "Divine reading with prayerful meditation",
        instructions: "Read slowly. When a phrase captures your attention, stop and pray over it. Let God speak through the text.",
        icon: Heart,
      },
      memory: {
        title: "Heart Inscription",
        description: "Write the Word on your heart",
        instructions: "As you memorize, turn each verse into a prayer. Let it become part of your conversation with God.",
        icon: Heart,
      },
    },
    warrior: {
      default: {
        title: "Speed Drill",
        description: "Quick recall under pressure",
        instructions: "Beat the clock! Answer quickly and accurately. Build those rapid-fire Scripture reflexes.",
        icon: Swords,
      },
      observation: {
        title: "Rapid Recognition",
        description: "Identify key elements fast",
        instructions: "How quickly can you spot the main characters, settings, and themes? Time yourself!",
        icon: Swords,
      },
      memory: {
        title: "Combat Recall",
        description: "Instant verse retrieval",
        instructions: "Drill until you can recall verses instantly. In spiritual battle, speed matters!",
        icon: Swords,
      },
    },
  };

  return variants[pathType][baseDrill] || variants[pathType].default;
};

// Path-specific tips and guidance
export const getPathTips = (pathType: PathType): string[] => {
  const tips: Record<PathType, string[]> = {
    visual: [
      "Create a mental 'movie' of each Bible story",
      "Use color coding in your mind - assign colors to different themes",
      "Place key concepts in rooms of your memory palace",
      "Draw what you're learning, even simple sketches help",
      "Visualize yourself in the biblical scene",
    ],
    analytical: [
      "Always ask: What's the pattern here?",
      "Create comparison charts between related passages",
      "Look for chiastic structures (A-B-B-A patterns)",
      "Map cause-and-effect relationships",
      "Build cross-reference chains between verses",
    ],
    devotional: [
      "Start each session with prayer for understanding",
      "Pause when a verse touches your heart",
      "Journal your responses to Scripture",
      "Turn memorized verses into personal prayers",
      "Ask: How does this apply to me today?",
    ],
    warrior: [
      "Time yourself on every drill",
      "Compete against your previous best times",
      "Do rapid-fire review sessions daily",
      "Challenge friends to Scripture memory battles",
      "Aim for instant recall, not slow retrieval",
    ],
  };

  return tips[pathType];
};

// Component for displaying path-specific exercise intro
interface PathExerciseIntroProps {
  pathType: PathType;
  exerciseType: string;
}

export function PathExerciseIntro({ pathType, exerciseType }: PathExerciseIntroProps) {
  const pathData = PATH_INFO[pathType];
  const variant = getPathDrillVariants(exerciseType, pathType);
  const config = PATH_EXERCISE_CONFIG[pathType];
  const IconComponent = variant.icon;

  return (
    <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={pathData.borderColor}>
            <span className="mr-1">{pathData.icon}</span>
            {pathData.name}
          </Badge>
          {config.showTimer && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Timed
            </Badge>
          )}
        </div>
        <CardTitle className="flex items-center gap-2 mt-2">
          <IconComponent className="h-5 w-5" />
          {variant.title}
        </CardTitle>
        <CardDescription>{variant.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50">
          <Lightbulb className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <p className="text-sm">{variant.instructions}</p>
        </div>

        {config.showReflection && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Heart className="h-4 w-4 mt-0.5 text-purple-500 shrink-0" />
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Remember to pause for reflection and prayer throughout this exercise.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic text-center pt-2">
          {config.encouragement}
        </p>
      </CardContent>
    </Card>
  );
}

// Hook to get path-adjusted timing
export function usePathTiming(baseTimeSeconds: number, pathType: PathType | undefined): number {
  if (!pathType) return baseTimeSeconds;
  const config = PATH_EXERCISE_CONFIG[pathType];
  return Math.round(baseTimeSeconds * config.timerMultiplier);
}

// Hook to get path bonus points
export function usePathBonus(basePoints: number, pathType: PathType | undefined, isPerfect: boolean): number {
  if (!pathType) return basePoints;
  const config = PATH_EXERCISE_CONFIG[pathType];
  return isPerfect ? basePoints + config.bonusPoints : basePoints;
}
