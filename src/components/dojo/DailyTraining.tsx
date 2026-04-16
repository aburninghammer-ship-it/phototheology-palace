import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Sun, Moon, Sunrise, CheckCircle2, Star, Clock, BookOpen, Swords, Shield, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface TrainingExercise {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
}

const DAILY_EXERCISES: TrainingExercise[] = [
  {
    id: "morning-prayer",
    name: "Morning Watch",
    description: "Begin with 5+ minutes in prayer and Scripture",
    icon: "🌅",
    points: 15,
    timeOfDay: "morning"
  },
  {
    id: "armor-meditation",
    name: "Put On Armor",
    description: "Mentally equip each piece of spiritual armor",
    icon: "🛡️",
    points: 10,
    timeOfDay: "morning"
  },
  {
    id: "victory-verse",
    name: "Victory Verse",
    description: "Memorize or review a warfare Scripture",
    icon: "⚔️",
    points: 15,
    timeOfDay: "anytime"
  },
  {
    id: "self-examination",
    name: "Battle Check",
    description: "Identify where 'self' tried to win today",
    icon: "🔍",
    points: 10,
    timeOfDay: "anytime"
  },
  {
    id: "act-of-service",
    name: "Kingdom Strike",
    description: "Do one intentional act of selfless service",
    icon: "💪",
    points: 20,
    timeOfDay: "anytime"
  },
  {
    id: "temptation-victory",
    name: "Victory Report",
    description: "Consciously defeat one temptation using spiritual weapons",
    icon: "🏆",
    points: 25,
    timeOfDay: "anytime"
  },
  {
    id: "evening-reflection",
    name: "Evening Debrief",
    description: "Review battles won/lost, thank God for victories",
    icon: "🌙",
    points: 15,
    timeOfDay: "evening"
  },
  {
    id: "confession",
    name: "Clean Slate",
    description: "Confess any sin immediately - don't let it fester",
    icon: "🧹",
    points: 10,
    timeOfDay: "anytime"
  },
];

export const DailyTraining = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [reflection, setReflection] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadTodayProgress();
  }, []);

  const loadTodayProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    const today = new Date().toISOString().split('T')[0];

    // Load from localStorage (since dojo_daily_training table may not exist)
    const storageKey = `dojo_training_${user.id}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const allDays = JSON.parse(savedData);
        const todayData = allDays[today];
        
        if (todayData) {
          setCompletedExercises(todayData.completed_exercises || []);
          setTodayPoints(todayData.points || 0);
          setReflection(todayData.reflection || "");
        }

        // Calculate streak
        const dates = Object.keys(allDays).sort().reverse();
        let currentStreak = 0;
        
        for (let i = 0; i < dates.length; i++) {
          const expectedDate = new Date();
          expectedDate.setDate(expectedDate.getDate() - i);
          const expectedStr = expectedDate.toISOString().split('T')[0];
          
          if (dates.includes(expectedStr)) {
            currentStreak++;
          } else if (i === 0) {
            continue;
          } else {
            break;
          }
        }
        setStreak(currentStreak);
      } catch (e) {
        console.error('Error loading dojo progress:', e);
      }
    }

    setLoading(false);
  };

  const toggleExercise = async (exerciseId: string) => {
    if (!userId) {
      toast.error("Please log in to track progress");
      return;
    }

    const exercise = DAILY_EXERCISES.find(e => e.id === exerciseId);
    if (!exercise) return;

    const today = new Date().toISOString().split('T')[0];
    const isCompleting = !completedExercises.includes(exerciseId);

    const newCompleted = isCompleting
      ? [...completedExercises, exerciseId]
      : completedExercises.filter(id => id !== exerciseId);

    const newPoints = todayPoints + (isCompleting ? exercise.points : -exercise.points);

    setCompletedExercises(newCompleted);
    setTodayPoints(newPoints);

    // Save to localStorage
    const storageKey = `dojo_training_${userId}`;
    const savedData = localStorage.getItem(storageKey);
    const allDays = savedData ? JSON.parse(savedData) : {};
    allDays[today] = {
      completed_exercises: newCompleted,
      points: newPoints,
      reflection: reflection,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(allDays));

    if (isCompleting) {
      toast.success(`+${exercise.points} XP: ${exercise.name}`);

      // Check if all exercises completed
      if (newCompleted.length === DAILY_EXERCISES.length) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success("🏆 Perfect Day! All exercises completed!");
      }
    }
  };

  const saveReflection = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];

    // Save to localStorage
    const storageKey = `dojo_training_${userId}`;
    const savedData = localStorage.getItem(storageKey);
    const allDays = savedData ? JSON.parse(savedData) : {};
    allDays[today] = {
      completed_exercises: completedExercises,
      points: todayPoints,
      reflection: reflection,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(allDays));
    
    toast.success("Reflection saved!");
    setShowReflection(false);
  };

  const getTimeOfDayIcon = (time?: string) => {
    switch (time) {
      case "morning": return <Sunrise className="w-4 h-4 text-amber-500" />;
      case "evening": return <Moon className="w-4 h-4 text-indigo-500" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const completionPercentage = Math.round((completedExercises.length / DAILY_EXERCISES.length) * 100);
  const maxPoints = DAILY_EXERCISES.reduce((sum, e) => sum + e.points, 0);

  if (loading) {
    return (
      <Card variant="glass" className="animate-pulse">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading daily training...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Daily Training Regimen
            </CardTitle>
            <CardDescription>
              Complete these exercises to grow as a spiritual warrior
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg py-1 px-3">
              <Flame className={`w-4 h-4 mr-1 ${streak > 0 ? 'text-orange-500' : ''}`} />
              {streak} day{streak !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedExercises.length} of {DAILY_EXERCISES.length} exercises</span>
            <span className="font-bold text-primary">{todayPoints}/{maxPoints} XP</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          {completionPercentage === 100 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-green-500 font-semibold flex items-center justify-center gap-1"
            >
              <Star className="w-4 h-4" /> Perfect Day Achieved!
            </motion.p>
          )}
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          {DAILY_EXERCISES.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  completedExercises.includes(exercise.id)
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-muted/30 border-border/50 hover:border-primary/50'
                }`}
                onClick={() => toggleExercise(exercise.id)}
              >
                <div className="pt-0.5">
                  <Checkbox
                    checked={completedExercises.includes(exercise.id)}
                    onCheckedChange={() => toggleExercise(exercise.id)}
                    className="pointer-events-none"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{exercise.icon}</span>
                    <span className={`font-medium ${completedExercises.includes(exercise.id) ? 'line-through text-muted-foreground' : ''}`}>
                      {exercise.name}
                    </span>
                    {getTimeOfDayIcon(exercise.timeOfDay)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{exercise.description}</p>
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  +{exercise.points} XP
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Reflection */}
        <div className="space-y-2 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowReflection(!showReflection)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showReflection ? "Hide" : "Add"} Daily Battle Reflection
          </Button>

          <AnimatePresence>
            {showReflection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Textarea
                  placeholder="What battles did you face today? What did you learn? Where did you win or fall short?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={saveReflection} className="w-full">
                  Save Reflection
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Motivational Quote */}
        <div className="text-center text-sm text-muted-foreground italic border-t pt-4">
          "No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace." - Hebrews 12:11
        </div>
      </CardContent>
    </Card>
  );
};
