import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Shuffle, 
  Target, 
  Zap, 
  Trophy,
  Play,
  CheckCircle2,
  Brain,
  Sparkles,
  GraduationCap,
  Flame
, type LucideIcon } from "lucide-react";

interface DrillType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeEstimate: string;
  skills: string[];
}

const DRILLS: DrillType[] = [
  // Beginner
  {
    id: "first-letter",
    name: "First Letter Recall",
    description: "See the first letter of each word, recall the full verse",
    icon: Eye,
    difficulty: "beginner",
    timeEstimate: "2-3 min",
    skills: ["Pattern recognition", "Word association"],
  },
  {
    id: "fill-blanks",
    name: "Fill the Blanks",
    description: "Key words are hidden—fill them in from memory",
    icon: EyeOff,
    difficulty: "beginner",
    timeEstimate: "2-3 min",
    skills: ["Keyword recall", "Context clues"],
  },
  {
    id: "flashcard",
    name: "Classic Flashcards",
    description: "Reference on front, verse on back—flip and test",
    icon: Shuffle,
    difficulty: "beginner",
    timeEstimate: "5 min",
    skills: ["Active recall", "Spaced repetition"],
  },
  // Intermediate
  {
    id: "word-order",
    name: "Word Scramble",
    description: "Rearrange scrambled words into the correct verse order",
    icon: Shuffle,
    difficulty: "intermediate",
    timeEstimate: "3-4 min",
    skills: ["Sequence memory", "Word recognition"],
  },
  {
    id: "visual-hook",
    name: "Visual Hook Builder",
    description: "Create your own visual images for verse keywords",
    icon: Brain,
    difficulty: "intermediate",
    timeEstimate: "5-7 min",
    skills: ["Imagery creation", "Association building"],
  },
  {
    id: "timed-recall",
    name: "Speed Recall",
    description: "Type the verse as fast as you can against the clock",
    icon: Zap,
    difficulty: "intermediate",
    timeEstimate: "2 min",
    skills: ["Muscle memory", "Pressure performance"],
  },
  // Advanced
  {
    id: "palace-placement",
    name: "Palace Placement",
    description: "Place verse images in your mental palace locations",
    icon: Target,
    difficulty: "advanced",
    timeEstimate: "5-10 min",
    skills: ["Spatial memory", "Mental navigation"],
  },
  {
    id: "chain-recall",
    name: "Chain Linking",
    description: "Connect multiple verses through shared themes or symbols",
    icon: Sparkles,
    difficulty: "advanced",
    timeEstimate: "10 min",
    skills: ["Thematic connections", "Deep memory"],
  },
  {
    id: "blind-recall",
    name: "Blind Recall",
    description: "No hints, no help—write the verse from pure memory",
    icon: Trophy,
    difficulty: "advanced",
    timeEstimate: "3-5 min",
    skills: ["Complete mastery", "Long-term retention"],
  },
];

const DIFFICULTY_CONFIG = {
  beginner: {
    label: "Beginner",
    color: "bg-green-500/10 text-green-500 border-green-500/30",
    icon: GraduationCap,
    description: "Build your foundation with simple recall exercises",
  },
  intermediate: {
    label: "Intermediate",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    icon: Flame,
    description: "Challenge your memory with structured practice",
  },
  advanced: {
    label: "Advanced",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    icon: Trophy,
    description: "Master-level techniques for permanent retention",
  },
};

export function MemoryPracticeDrills() {
  const navigate = useNavigate();
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);

  const handleStartDrill = (drillId: string) => {
    // Navigate to the drill or open a modal
    // For now, navigate to memory games with the drill type
    navigate(`/memory/games?drill=${drillId}`);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Practice Drills
            </CardTitle>
            <CardDescription>
              Train your memory with targeted exercises at your skill level
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/memory/games")} variant="outline" size="sm">
            View All Games
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="beginner" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => {
              const config = DIFFICULTY_CONFIG[level];
              const LevelIcon = config.icon;
              return (
                <TabsTrigger key={level} value={level} className="gap-2">
                  <LevelIcon className="w-4 h-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(["beginner", "intermediate", "advanced"] as const).map((level) => {
            const config = DIFFICULTY_CONFIG[level];
            const drills = DRILLS.filter((d) => d.difficulty === level);
            
            return (
              <TabsContent key={level} value={level} className="space-y-4">
                <p className="text-sm text-muted-foreground">{config.description}</p>
                
                <div className="grid gap-3">
                  {drills.map((drill) => {
                    const DrillIcon = drill.icon;
                    return (
                      <div
                        key={drill.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                          selectedDrill === drill.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setSelectedDrill(drill.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${config.color}`}>
                              <DrillIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{drill.name}</h4>
                              <p className="text-sm text-muted-foreground">{drill.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {drill.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant="outline" className="mb-2">
                              {drill.timeEstimate}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartDrill(drill.id);
                              }}
                              className="w-full gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
