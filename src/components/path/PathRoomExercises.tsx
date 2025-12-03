/**
 * Path-specific exercises displayed in rooms
 * Shows color-coded, glowing exercises based on user's active path
 */

import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { getRoomExercisesForPath, PathRoomExercise } from "@/data/pathRoomExercises";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Clock, ChevronDown, ChevronUp, 
  CheckCircle2, Target, ArrowRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PathRoomExercisesProps {
  roomId: string;
  roomName: string;
  floorNumber: number;
}

export function PathRoomExercises({ roomId, roomName, floorNumber }: PathRoomExercisesProps) {
  const { activePath, isLoading } = usePath();
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load completed exercises from localStorage
  useEffect(() => {
    if (activePath) {
      const key = `path-room-exercises-${activePath.id}-${roomId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      }
    }
  }, [activePath, roomId]);

  // Save completed exercises
  const toggleExercise = (exerciseId: string) => {
    if (!activePath) return;
    
    const key = `path-room-exercises-${activePath.id}-${roomId}`;
    const newCompleted = completedExercises.includes(exerciseId)
      ? completedExercises.filter(id => id !== exerciseId)
      : [...completedExercises, exerciseId];
    
    setCompletedExercises(newCompleted);
    localStorage.setItem(key, JSON.stringify(newCompleted));
  };

  if (isLoading || !activePath) {
    return null;
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];
  const exercises = getRoomExercisesForPath(roomId, pathType, roomName);
  
  const completedCount = exercises.filter(e => completedExercises.includes(e.id)).length;
  const progressPercent = (completedCount / exercises.length) * 100;

  const typeColors: Record<string, string> = {
    drill: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
    reflection: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
    practice: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
    challenge: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Glowing border effect */}
      <div 
        className={`
          absolute -inset-1 rounded-2xl opacity-75 blur-sm
          bg-gradient-to-r ${pathData.color}
        `}
      />
      
      <Card className={`relative ${pathData.bgColor} border-2 ${pathData.borderColor} overflow-hidden`}>
        {/* Animated sparkle effect */}
        <div className="absolute top-2 right-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-background/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${pathData.color} text-white`}>
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {pathData.icon} Path Exercises
                      <Badge variant="secondary" className="ml-2">
                        {exercises.length} exercises
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Complete these {pathData.name} exercises in this room
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-medium">{completedCount}/{exercises.length}</span>
                    <Progress value={progressPercent} className="h-2 w-20 mt-1" />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              <AnimatePresence>
                {exercises.map((exercise, index) => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    isCompleted={completedExercises.includes(exercise.id)}
                    onToggle={() => toggleExercise(exercise.id)}
                    pathColor={pathData.color}
                    typeColors={typeColors}
                  />
                ))}
              </AnimatePresence>

              {completedCount === exercises.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center"
                >
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700 dark:text-green-300">
                    All exercises complete! 🎉
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Return to your path training to continue
                  </p>
                </motion.div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}

interface ExerciseItemProps {
  exercise: PathRoomExercise;
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
  pathColor: string;
  typeColors: Record<string, string>;
}

function ExerciseItem({ 
  exercise, 
  index, 
  isCompleted, 
  onToggle, 
  pathColor,
  typeColors 
}: ExerciseItemProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${isCompleted 
          ? "bg-green-500/5 border-green-500/30" 
          : "bg-card hover:bg-accent/30 border-border hover:border-primary/30"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggle}
            className={isCompleted ? "border-green-500 data-[state=checked]:bg-green-500" : ""}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xl">{exercise.icon}</span>
            <span className={`font-semibold ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {exercise.title}
            </span>
            <Badge variant="outline" className={typeColors[exercise.type]}>
              {exercise.type}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {exercise.description}
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {exercise.duration}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? "Hide" : "Show"} instructions
              <ArrowRight className={`ml-1 h-3 w-3 transition-transform ${showInstructions ? "rotate-90" : ""}`} />
            </Button>
          </div>

          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <p className="text-xs font-medium mb-2 text-muted-foreground">Instructions:</p>
                <ol className="text-sm space-y-1.5">
                  {exercise.instructions.map((instruction, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isCompleted && (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        )}
      </div>
    </motion.div>
  );
}
