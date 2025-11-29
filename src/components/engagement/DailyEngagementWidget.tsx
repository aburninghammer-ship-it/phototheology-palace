import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  BookOpen, 
  Brain, 
  Trophy, 
  Bell, 
  Zap,
  Calendar,
  Target,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DailyPattern {
  id: string;
  pattern: string;
  description: string;
  room: string;
  verse: string;
}

const DAILY_PATTERNS: DailyPattern[] = [
  { id: "1", pattern: "40 Days Pattern", description: "Moses on Sinai, Jesus in wilderness, Noah's rain", room: "PRm", verse: "Matthew 4:2" },
  { id: "2", pattern: "3 Days Resurrection", description: "Jonah in fish, Jesus in tomb, Abraham's journey to Moriah", room: "PRm", verse: "Hosea 6:2" },
  { id: "3", pattern: "7 Days Creation", description: "God's complete work cycle - rest on seventh", room: "BL", verse: "Genesis 2:2" },
  { id: "4", pattern: "12 Tribes/Apostles", description: "12 sons of Jacob → 12 apostles → 12 foundations", room: "P‖", verse: "Revelation 21:14" },
  { id: "5", pattern: "Lamb Typology", description: "Passover lamb → Isaac's substitute → Lamb of God", room: "ST", verse: "John 1:29" },
  { id: "6", pattern: "Water/Spirit", description: "Red Sea baptism → Jordan crossing → Living Water", room: "TR", verse: "1 Corinthians 10:2" },
  { id: "7", pattern: "Rock/Foundation", description: "Rock at Horeb → Christ the Rock → Build on Rock", room: "CR", verse: "1 Corinthians 10:4" },
];

const MEMORY_PROMPTS = [
  { verse: "John 3:16", prompt: "Can you recite God's love gift to the world?" },
  { verse: "Romans 8:28", prompt: "What works together for good?" },
  { verse: "Psalm 23:1", prompt: "Complete: The LORD is my..." },
  { verse: "Philippians 4:13", prompt: "Through whom can you do all things?" },
  { verse: "Jeremiah 29:11", prompt: "What plans does God have for you?" },
  { verse: "Proverbs 3:5-6", prompt: "Trust in the LORD with all your..." },
  { verse: "Isaiah 40:31", prompt: "What happens to those who wait upon the LORD?" },
];

export function DailyEngagementWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [todayComplete, setTodayComplete] = useState(false);
  const [dailyPattern, setDailyPattern] = useState<DailyPattern | null>(null);
  const [memoryPrompt, setMemoryPrompt] = useState({ verse: "", prompt: "" });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Get today's pattern and prompt based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyPattern(DAILY_PATTERNS[dayOfYear % DAILY_PATTERNS.length]);
    setMemoryPrompt(MEMORY_PROMPTS[dayOfYear % MEMORY_PROMPTS.length]);

    if (user) {
      fetchStreak();
      checkTodayCompletion();
    }
  }, [user]);

  const fetchStreak = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("daily_study_streak, longest_study_streak")
      .eq("id", user.id)
      .single();
    
    if (data) {
      setStreak({
        current: data.daily_study_streak || 0,
        longest: data.longest_study_streak || 0
      });
    }
  };

  const checkTodayCompletion = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("daily_reading_log")
      .select("id")
      .eq("user_id", user.id)
      .eq("read_date", today)
      .limit(1);
    
    setTodayComplete(data && data.length > 0);
  };

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Daily notifications enabled!");
      }
    }
  };

  const getStreakEmoji = () => {
    if (streak.current >= 30) return "🔥👑";
    if (streak.current >= 14) return "🔥⚡";
    if (streak.current >= 7) return "🔥";
    if (streak.current >= 3) return "✨";
    return "🌱";
  };

  const getStreakColor = () => {
    if (streak.current >= 30) return "text-amber-500";
    if (streak.current >= 14) return "text-orange-500";
    if (streak.current >= 7) return "text-red-500";
    return "text-primary";
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Daily Engagement
          </span>
          {!notificationsEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={enableNotifications}
              className="text-xs"
            >
              <Bell className="h-4 w-4 mr-1" />
              Enable
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${getStreakColor()}`}>
              {streak.current} {getStreakEmoji()}
            </div>
            <div>
              <div className="font-medium">Day Streak</div>
              <div className="text-xs text-muted-foreground">
                Best: {streak.longest} days
              </div>
            </div>
          </div>
          {todayComplete ? (
            <Badge className="bg-green-500">
              <Star className="h-3 w-3 mr-1" />
              Done Today
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500 text-amber-500">
              <Target className="h-3 w-3 mr-1" />
              Keep Going!
            </Badge>
          )}
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Next milestone</span>
            <span>{streak.current % 7}/7 days</span>
          </div>
          <Progress value={(streak.current % 7) * 14.3} className="h-2" />
        </div>

        {/* Pattern of the Day */}
        {dailyPattern && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Pattern of the Day</div>
                <div className="text-lg font-bold text-primary">{dailyPattern.pattern}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{dailyPattern.description}</p>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">{dailyPattern.room}</Badge>
              <span className="text-muted-foreground">{dailyPattern.verse}</span>
            </div>
          </div>
        )}

        {/* Memory Prompt */}
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start gap-2">
            <BookOpen className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Memory Challenge</div>
              <div className="text-sm mt-1">{memoryPrompt.prompt}</div>
              <div className="text-xs text-muted-foreground mt-1">{memoryPrompt.verse}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/daily-challenges")}
            className="justify-start"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Daily Challenge
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/flashcards")}
            className="justify-start"
          >
            <Brain className="h-4 w-4 mr-2" />
            Practice Memory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
