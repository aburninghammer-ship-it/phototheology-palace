import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasteryBadge } from "@/components/mastery/MasteryBadge";
import { XpProgressBar } from "@/components/mastery/XpProgressBar";
import { MasteryMap } from "@/components/mastery/MasteryMap";
import { ReportCardDisplay } from "@/components/mastery/ReportCardDisplay";
import { useMastery, useAllRoomMasteries, useGlobalMasterTitle } from "@/hooks/useMastery";
import { useMasteryStreak } from "@/hooks/useMasteryStreak";
import { Flame, Trophy, Crown, Target, TrendingUp, Zap, Map as MapIcon, FileText } from "lucide-react";
import { getGlobalTitle, getNextGlobalTitleMilestone } from "@/utils/masteryCalculations";
import { cn } from "@/lib/utils";

export default function MasteryDashboard() {
  const { data: allMasteries, isLoading: masteriesLoading } = useAllRoomMasteries();
  const { data: globalTitle } = useGlobalMasterTitle();
  const { streak, isLoading: streakLoading } = useMasteryStreak();
  
  const roomsMastered = allMasteries?.filter(m => m.mastery_level === 5).length || 0;
  const totalXp = allMasteries?.reduce((sum, m) => sum + m.xp_current, 0) || 0;
  const currentGlobalTitle = getGlobalTitle(roomsMastered);
  const nextMilestone = getNextGlobalTitleMilestone(roomsMastered);
  
  // Demo room for testing XP system
  const demoRoom = useMastery("demo-room", 1);

  const handleAwardDemoXp = () => {
    demoRoom.awardXp({
      drillCompleted: true,
      exerciseCompleted: true,
      perfectScore: true,
    });
  };

  if (masteriesLoading || streakLoading) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-20">Loading mastery data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <SimplifiedNav />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Crown className="h-10 w-10 text-primary" />
              Mastery System
            </h1>
            <p className="text-muted-foreground">Track your progress and level up in every room</p>
          </div>

          {/* Always-visible quick overview so this works on mobile too */}
          <Card className="border-primary/20 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                How Mastery Works
              </CardTitle>
              <CardDescription>
                Each room has 5 mastery levels (Novice → Apprentice → Adept → Expert → Master). You earn XP
                by completing drills, exercises, and perfect scores until you reach Level 5 in that room.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">1. Pick a room</p>
                <p className="text-muted-foreground">Focus on one Palace room and practice it repeatedly.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">2. Earn XP</p>
                <p className="text-muted-foreground">Drills, exercises, and perfect runs add XP toward the next level.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">3. Reach Level 5</p>
                <p className="text-muted-foreground">Master multiple rooms to unlock global titles across the Palace.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Global Title</CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{currentGlobalTitle}</div>
              {nextMilestone && (
                <p className="text-xs text-muted-foreground">
                  {nextMilestone.roomsNeeded} more rooms to {nextMilestone.title}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rooms Mastered</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{roomsMastered}</div>
              <p className="text-xs text-muted-foreground mt-1">Level 5 achievements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mastery Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{streak?.current_streak || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Longest: {streak?.longest_streak || 0} days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Global Title Progression */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Global Master Titles
                </CardTitle>
                <CardDescription>
                  Master rooms to unlock prestigious titles across the Palace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { level: 1, title: "Novice Scholar", rooms: 0, color: "text-gray-400" },
                    { level: 2, title: "Diligent Student", rooms: 5, color: "text-blue-400" },
                    { level: 3, title: "Devoted Learner", rooms: 10, color: "text-green-400" },
                    { level: 4, title: "Palace Navigator", rooms: 20, color: "text-purple-400" },
                    { level: 5, title: "Wisdom Seeker", rooms: 30, color: "text-pink-400" },
                    { level: 6, title: "Palace Guardian", rooms: 45, color: "text-orange-400" },
                    { level: 7, title: "Master Theologian", rooms: 60, color: "text-red-400" },
                    { level: 8, title: "Grand Palace Master", rooms: 80, color: "text-amber-400" },
                  ].map((titleInfo) => {
                    const isUnlocked = roomsMastered >= titleInfo.rooms;
                    const isCurrent = currentGlobalTitle === titleInfo.title;
                    
                    return (
                      <div
                        key={titleInfo.level}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all",
                          isCurrent && "bg-primary/10 border-primary/30",
                          isUnlocked && !isCurrent && "bg-accent/5 border-accent/20",
                          !isUnlocked && "opacity-50 bg-muted/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                            isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          )}>
                            {titleInfo.level}
                          </div>
                          <div>
                            <div className={cn("font-semibold", titleInfo.color)}>
                              {titleInfo.title}
                              {isCurrent && <span className="ml-2 text-xs text-primary">(Current)</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {titleInfo.rooms === 0 ? "Starting title" : `${titleInfo.rooms} rooms mastered`}
                            </div>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <Crown className="h-5 w-5 text-amber-500" />
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {titleInfo.rooms - roomsMastered} more
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* How It Works - Explanatory Section */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  How to Master Rooms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Choose a Room</p>
                      <p className="text-muted-foreground">Start with any Palace room from Floors 1-8. Each room teaches a specific skill.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Complete Activities</p>
                      <p className="text-muted-foreground">
                        Earn XP by completing drills (+30 XP), exercises (+40 XP), and perfect scores (+20 bonus XP).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Level Up</p>
                      <p className="text-muted-foreground">
                        Progress through 5 mastery levels: Novice → Apprentice → Adept → Expert → Master.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Master All Rooms</p>
                      <p className="text-muted-foreground">
                        Achieve Level 5 in multiple rooms to unlock global titles and become a Palace Master.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <p className="text-xs font-semibold mb-2 text-primary">XP Requirements per Level:</p>
                  <div className="grid grid-cols-5 gap-2 text-xs text-center">
                    <div>
                      <div className="font-bold">L1→L2</div>
                      <div className="text-muted-foreground">100 XP</div>
                    </div>
                    <div>
                      <div className="font-bold">L2→L3</div>
                      <div className="text-muted-foreground">200 XP</div>
                    </div>
                    <div>
                      <div className="font-bold">L3→L4</div>
                      <div className="text-muted-foreground">400 XP</div>
                    </div>
                    <div>
                      <div className="font-bold">L4→L5</div>
                      <div className="text-muted-foreground">800 XP</div>
                    </div>
                    <div>
                      <div className="font-bold">Total</div>
                      <div className="text-muted-foreground">1500 XP</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Section */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Demo Room - Test the System
                </CardTitle>
                <CardDescription>
                  Try out the mastery system by earning XP in this demo room
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoRoom.mastery && (
                  <>
                    <div className="flex items-center gap-4">
                      <MasteryBadge level={demoRoom.mastery.mastery_level} size="lg" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">
                          Level {demoRoom.mastery.mastery_level} Progress
                        </div>
                        <XpProgressBar
                          currentXp={demoRoom.mastery.xp_current}
                          xpRequired={demoRoom.mastery.xp_required}
                          level={demoRoom.mastery.mastery_level}
                          showLabel={false}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAwardDemoXp}
                        disabled={demoRoom.isAwarding}
                        className="flex-1"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        Complete Perfect Drill (+90 XP)
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.total_drills_completed}
                        </div>
                        <div className="text-xs text-muted-foreground">Drills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.total_exercises_completed}
                        </div>
                        <div className="text-xs text-muted-foreground">Exercises</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.perfect_scores_count}
                        </div>
                        <div className="text-xs text-muted-foreground">Perfect Scores</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* All Rooms Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  All Rooms Progress
                </CardTitle>
                <CardDescription>
                  Your mastery levels across all Palace rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allMasteries && allMasteries.length > 0 ? (
                  <div className="space-y-4">
                    {allMasteries.map((mastery) => (
                      <div
                        key={mastery.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                      >
                        <MasteryBadge level={mastery.mastery_level} size="md" showTitle={false} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">
                            Floor {mastery.floor_number} - {mastery.room_id}
                          </div>
                          <XpProgressBar
                            currentXp={mastery.xp_current}
                            xpRequired={mastery.xp_required}
                            level={mastery.mastery_level}
                            className="mt-2"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {mastery.total_drills_completed + mastery.total_exercises_completed}
                          </div>
                          <div className="text-xs text-muted-foreground">activities</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Progress Yet</p>
                    <p className="text-sm">
                      Start practicing in Palace rooms to build your mastery!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <MasteryMap />
          </TabsContent>

          <TabsContent value="reports">
            <ReportCardDisplay
              roomId="demo-room"
              roomName="Demo Room"
              currentLevel={demoRoom.mastery?.mastery_level || 1}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
