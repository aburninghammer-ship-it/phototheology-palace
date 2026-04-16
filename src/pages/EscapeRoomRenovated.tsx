import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Clock,
  Trophy,
  Star,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  Users,
  Flame,
  Target,
  BookOpen,
  Zap,
  Crown,
  Medal,
  Box
} from "lucide-react";
import {
  escapeRooms,
  getAllThemes,
  getEscapeRoomsByDifficulty,
  getMaxPoints,
  type EscapeRoom,
  type Difficulty
} from "@/data/escapeRoomData";

interface LeaderboardEntry {
  user_id: string;
  room_id: string;
  score: number;
  time_elapsed_seconds: number;
  display_name?: string;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  hard: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  expert: "bg-red-500/10 text-red-600 border-red-500/30"
};

const difficultyIcons: Record<Difficulty, React.ReactNode> = {
  easy: <Star className="h-4 w-4" />,
  medium: <Flame className="h-4 w-4" />,
  hard: <Zap className="h-4 w-4" />,
  expert: <Crown className="h-4 w-4" />
};

export default function EscapeRoomRenovated() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<string | 'all'>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userCompletedRooms, setUserCompletedRooms] = useState<Set<string>>(new Set());
  const [userBestScores, setUserBestScores] = useState<Record<string, { score: number; time: number }>>({});

  const themes = getAllThemes();

  useEffect(() => {
    loadLeaderboard();
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('escape_room_attempts')
        .select('user_id, room_id, score, time_elapsed_seconds')
        .not('completed_at', 'is', null)
        .order('score', { ascending: false })
        .limit(50);

      if (!error && data) {
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('escape_room_attempts')
        .select('room_id, score, time_elapsed_seconds')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      if (!error && data) {
        const completed = new Set(data.map(d => d.room_id));
        setUserCompletedRooms(completed);

        const scores: Record<string, { score: number; time: number }> = {};
        data.forEach(d => {
          if (!scores[d.room_id] || scores[d.room_id].score < d.score) {
            scores[d.room_id] = { score: d.score, time: d.time_elapsed_seconds };
          }
        });
        setUserBestScores(scores);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const filteredRooms = escapeRooms.filter(room => {
    const difficultyMatch = selectedDifficulty === 'all' || room.difficulty === selectedDifficulty;
    const themeMatch = selectedTheme === 'all' || room.theme === selectedTheme;
    return difficultyMatch && themeMatch;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoomLeaderboard = (roomId: string) => {
    return leaderboard
      .filter(e => e.room_id === roomId)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Phototheology Escape Rooms
            </h1>
          </motion.div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            20 themed biblical escape rooms. Solve puzzles using Phototheology principles,
            discover hidden truths, and race the clock to escape!
          </p>

          {/* Stats Banner */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{escapeRooms.length}</div>
              <div className="text-sm text-muted-foreground">Escape Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{userCompletedRooms.size}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">{themes.length}</div>
              <div className="text-sm text-muted-foreground">Themes</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty:</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('all')}
                  >
                    All
                  </Button>
                  {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(diff => (
                    <Button
                      key={diff}
                      variant={selectedDifficulty === diff ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff)}
                      className="capitalize"
                    >
                      {difficultyIcons[diff]}
                      <span className="ml-1">{diff}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Theme Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme:</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTheme === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTheme('all')}
                  >
                    All Themes
                  </Button>
                  {themes.slice(0, 5).map(theme => (
                    <Button
                      key={theme}
                      variant={selectedTheme === theme ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTheme(theme)}
                    >
                      {theme}
                    </Button>
                  ))}
                  {themes.length > 5 && (
                    <Tabs value={selectedTheme} onValueChange={setSelectedTheme}>
                      <TabsList className="h-8">
                        {themes.slice(5).map(theme => (
                          <TabsTrigger key={theme} value={theme} className="text-xs px-2 py-1">
                            {theme}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredRooms.map((room, index) => {
            const isCompleted = userCompletedRooms.has(room.id);
            const bestScore = userBestScores[room.id];
            const maxPoints = getMaxPoints(room) + 50; // Plus escape bonus
            const roomLeaders = getRoomLeaderboard(room.id);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden ${
                    isCompleted ? 'border-green-500/50' : ''
                  }`}
                  onClick={() => navigate(`/escape-room/play/${room.id}`)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${room.backgroundGradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-green-500 text-white">
                        <Unlock className="h-3 w-3 mr-1" />
                        Escaped
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`text-4xl p-2 rounded-lg bg-gradient-to-br ${room.backgroundGradient} bg-opacity-20`}>
                        {room.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight mb-1 line-clamp-1">
                          {room.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={difficultyColors[room.difficulty]}>
                            {difficultyIcons[room.difficulty]}
                            <span className="ml-1 capitalize">{room.difficulty}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {room.theme}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{room.timeLimit} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>{room.puzzles.length} puzzles</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Trophy className="h-4 w-4" />
                        <span>{maxPoints} pts</span>
                      </div>
                    </div>

                    {/* Best Score */}
                    {bestScore && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 flex items-center justify-between">
                        <span className="text-xs text-green-600 dark:text-green-400">Your Best:</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-green-600">{bestScore.score} pts</span>
                          <span className="text-muted-foreground">{formatTime(bestScore.time)}</span>
                        </div>
                      </div>
                    )}

                    {/* Mini Leaderboard */}
                    {roomLeaders.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Medal className="h-3 w-3" /> Top Escapees:
                        </div>
                        {roomLeaders.map((leader, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1">
                              {i === 0 && <span className="text-yellow-500">🥇</span>}
                              {i === 1 && <span className="text-gray-400">🥈</span>}
                              {i === 2 && <span className="text-amber-600">🥉</span>}
                              <span className="truncate max-w-[80px]">
                                {leader.display_name || 'Anonymous'}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              {leader.score} pts | {formatTime(leader.time_elapsed_seconds)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 group-hover:bg-primary"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/escape-room/play/${room.id}`);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {isCompleted ? 'Play Again' : 'Enter Room'}
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Learn Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each puzzle teaches you a Phototheology principle from the Palace rooms.
                Learn how to apply typology, sanctuary patterns, prophecy, and more!
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Progressive Clues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Solve puzzles to reveal clues. Each clue points toward the final answer -
                a person, truth, text, or account that unlocks your escape!
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Race the Clock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Beat the timer for bonus points. Use hints wisely (-5 points each).
                Compete for the fastest escape times on the leaderboard!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Global Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Global Leaderboard - Top Escapees
            </CardTitle>
            <CardDescription>
              The fastest and highest-scoring escape artists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {leaderboard.slice(0, 20).map((entry, index) => {
                  const room = escapeRooms.find(r => r.id === entry.room_id);
                  return (
                    <div
                      key={`${entry.user_id}-${entry.room_id}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center font-bold">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && <span className="text-muted-foreground">{index + 1}</span>}
                        </div>
                        <div>
                          <div className="font-medium">
                            {entry.display_name || 'Anonymous Player'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{room?.icon}</span>
                            <span>{room?.title || entry.room_id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{entry.score} pts</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(entry.time_elapsed_seconds)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {leaderboard.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No escapes recorded yet. Be the first!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
