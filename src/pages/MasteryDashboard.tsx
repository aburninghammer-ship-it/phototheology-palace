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
import { Flame, Trophy, Crown, Target, TrendingUp, Zap, Map as MapIcon, FileText, ChevronDown } from "lucide-react";
import { getGlobalTitle, getNextGlobalTitleMilestone } from "@/utils/masteryCalculations";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function MasteryDashboard() {
  const { data: allMasteries, isLoading: masteriesLoading } = useAllRoomMasteries();
  const { data: globalTitle } = useGlobalMasterTitle();
  const { streak, isLoading: streakLoading } = useMasteryStreak();
  const [openTitles, setOpenTitles] = useState<Record<number, boolean>>({});
  
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

  const toggleTitle = (index: number) => {
    setOpenTitles(prev => ({ ...prev, [index]: !prev[index] }));
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
                    { 
                      emoji: "🟦", 
                      title: "Blue Master", 
                      rooms: "1–3", 
                      roomsMin: 1,
                      color: "text-blue-500",
                      bgColor: "bg-blue-500/10",
                      borderColor: "border-blue-500/30",
                      requirements: "None beyond room mastery",
                      rewards: "Blue Master title",
                      details: {
                        intro: "The foundational title. Start your mastery journey by focusing on 1-3 rooms.",
                        path: [
                          "Pick 1-3 Palace rooms you want to master first (Story Room, Observation Room, and Gems Room are great starters)",
                          "Complete drills in each room to earn +30 XP per drill",
                          "Finish exercises to gain +40 XP per exercise",
                          "Achieve perfect scores for bonus +20 XP",
                          "Keep practicing until you reach Level 5 (Master) in all chosen rooms"
                        ],
                        tips: "Start with Floor 1 rooms—they build your foundation. Focus on consistency over speed."
                      }
                    },
                    { 
                      emoji: "🔴", 
                      title: "Red Master", 
                      rooms: "4–9", 
                      roomsMin: 4,
                      color: "text-red-500",
                      bgColor: "bg-red-500/10",
                      borderColor: "border-red-500/30",
                      requirements: "7-day global streak",
                      rewards: "Red Master title + Red Challenges",
                      details: {
                        intro: "Step up your commitment. Master 4-9 rooms and maintain a 7-day streak.",
                        path: [
                          "Master 4-9 rooms by reaching Level 5 in each",
                          "Build a 7-day streak by completing at least one mastery activity daily",
                          "Balance multiple rooms—spread your practice across different floors",
                          "Unlock Red Challenges for advanced training once achieved"
                        ],
                        tips: "Set daily reminders. Even 10 minutes a day counts toward your streak. Focus on Floor 2 (Investigation) rooms next."
                      }
                    },
                    { 
                      emoji: "🟡", 
                      title: "Gold Master", 
                      rooms: "10–18", 
                      roomsMin: 10,
                      color: "text-yellow-500",
                      bgColor: "bg-yellow-500/10",
                      borderColor: "border-yellow-500/30",
                      requirements: "14-day global streak",
                      rewards: "Gold Master title + advanced chain tools",
                      details: {
                        intro: "Become a serious student. Master 10-18 rooms and sustain a 14-day streak.",
                        path: [
                          "Master 10-18 rooms across multiple floors",
                          "Maintain a 14-day streak—practice daily without missing a day",
                          "Begin working through Floor 3 (Freestyle) and Floor 4 (Next Level)",
                          "Unlock advanced chain tools to connect verses across books"
                        ],
                        tips: "Diversify your practice. Work on different room types to keep it fresh. The chain tools help you see connections faster."
                      }
                    },
                    { 
                      emoji: "🟣", 
                      title: "Purple Master", 
                      rooms: "19–27", 
                      roomsMin: 19,
                      color: "text-purple-500",
                      bgColor: "bg-purple-500/10",
                      borderColor: "border-purple-500/30",
                      requirements: "21-day global streak",
                      rewards: "Purple Master title + create-your-own drills",
                      details: {
                        intro: "Reach elite status. Master 19-27 rooms and hold a 21-day streak.",
                        path: [
                          "Master 19-27 rooms—this covers Floors 1-5",
                          "Sustain a 21-day streak, proving long-term discipline",
                          "Dive into Floor 5 (Vision) and Floor 6 (Three Heavens)",
                          "Gain the ability to create custom drills for yourself and others"
                        ],
                        tips: "By now, you're thinking Phototheologically. Use the custom drill creator to reinforce your unique study style."
                      }
                    },
                    { 
                      emoji: "⚪", 
                      title: "White Master", 
                      rooms: "28–37", 
                      roomsMin: 28,
                      color: "text-gray-400",
                      bgColor: "bg-gray-500/10",
                      borderColor: "border-gray-500/30",
                      requirements: "30-day global streak",
                      rewards: "White Master title + Temple Mode + prophecy maps",
                      details: {
                        intro: "Approach mastery of the entire Palace. Master 28-37 rooms and maintain a 30-day streak.",
                        path: [
                          "Master 28-37 rooms—nearly the entire Palace",
                          "Hold a 30-day streak, demonstrating unwavering commitment",
                          "Complete Floor 7 (Spiritual & Emotional) to integrate heart and mind",
                          "Unlock Temple Mode for immersive sanctuary study",
                          "Access prophecy maps to visualize timelines and cycles"
                        ],
                        tips: "You're on the verge of total mastery. Prophecy maps will help you see God's plan across all 8 cycles."
                      }
                    },
                    { 
                      emoji: "⚫", 
                      title: "Black Master", 
                      rooms: "38", 
                      roomsMin: 38,
                      color: "text-gray-900 dark:text-white",
                      bgColor: "bg-gray-900/10 dark:bg-white/10",
                      borderColor: "border-gray-900/30 dark:border-white/30",
                      requirements: "60-day streak + Final Master Exam + 12-verse chain + Teach-the-Palace test + 3 prophetic exercises",
                      rewards: "Black Master title + Black Palace Mode + Shadow Chains + Prophetic Lattice Engine + Mentor privileges + 8th-floor Revelation Chamber",
                      isFinal: true,
                      details: {
                        intro: "The ultimate achievement. Only the most disciplined scholars reach this level.",
                        path: [
                          "Master all 38 rooms—complete Floor 8 (Master Floor) reflexively",
                          "Maintain a 60-day streak, proving you've made Phototheology a lifestyle",
                          "Pass the Final Master Exam testing all floors, rooms, and principles",
                          "Build a 12-verse chain connecting themes across multiple books",
                          "Complete the Teach-the-Palace test by explaining principles to others",
                          "Finish 3 prophetic exercises linking sanctuary, cycles, and heavens"
                        ],
                        tips: "Black Master is reserved for those who've internalized the Palace. You'll think, speak, and teach Scripture with reflexive mastery. This is the 8th Floor—the palace is now inside you.",
                        finalNote: "Only the most dedicated will reach this rank. Expect rigorous testing and real-world application."
                      }
                    },
                  ].map((titleInfo, index) => {
                    const isUnlocked = roomsMastered >= titleInfo.roomsMin;
                    const isCurrent = currentGlobalTitle === titleInfo.title;
                    const isOpen = openTitles[index];
                    
                    return (
                      <Collapsible
                        key={index}
                        open={isOpen}
                        onOpenChange={() => toggleTitle(index)}
                      >
                        <div
                          className={cn(
                            "rounded-lg border transition-all",
                            isCurrent && titleInfo.bgColor + " " + titleInfo.borderColor,
                            isUnlocked && !isCurrent && "bg-accent/5 border-accent/20",
                            !isUnlocked && "bg-muted/5"
                          )}
                        >
                          <CollapsibleTrigger className="w-full p-4 text-left">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{titleInfo.emoji}</div>
                              <div className="flex-1">
                                <div className={cn("font-bold text-lg", titleInfo.color)}>
                                  {titleInfo.title.toUpperCase()} — {titleInfo.rooms} Rooms Mastered
                                  {isCurrent && <span className="ml-2 text-xs text-primary">(Current)</span>}
                                </div>
                                <div className="mt-2 space-y-1 text-sm">
                                  <div>
                                    <span className="font-semibold">Requirements:</span>{" "}
                                    <span className={cn(isUnlocked ? "text-foreground" : "text-muted-foreground")}>{titleInfo.requirements}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold">Reward:</span>{" "}
                                    <span className={cn(isUnlocked ? "text-foreground" : "text-muted-foreground")}>{titleInfo.rewards}</span>
                                  </div>
                                  {!isUnlocked && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      {titleInfo.roomsMin - roomsMastered} more rooms to unlock
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isUnlocked && (
                                  <Crown className="h-5 w-5 text-amber-500" />
                                )}
                                <ChevronDown 
                                  className={cn(
                                    "h-5 w-5 transition-transform",
                                    isOpen && "transform rotate-180"
                                  )} 
                                />
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="px-4 pb-4 pt-2 space-y-3 border-t mt-2">
                              <p className="text-sm text-muted-foreground italic">
                                {titleInfo.details.intro}
                              </p>

                              <div>
                                <p className="text-sm font-semibold mb-2">Path to {titleInfo.title}:</p>
                                <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
                                  {titleInfo.details.path.map((step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                  ))}
                                </ol>
                              </div>

                              <div className="p-3 bg-background/50 rounded text-sm">
                                <p className="font-semibold mb-1">💡 Pro Tip:</p>
                                <p className="text-muted-foreground">{titleInfo.details.tips}</p>
                              </div>

                              {titleInfo.details.finalNote && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm">
                                  <p className="font-semibold mb-1 text-amber-600 dark:text-amber-400">⚠️ Final Challenge:</p>
                                  <p className="text-muted-foreground">{titleInfo.details.finalNote}</p>
                                </div>
                              )}

                              {titleInfo.isFinal && (
                                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded text-sm">
                                  <strong>The Final Rank</strong> — Only the most disciplined, consistent, and skilled users will ever reach this tier. The palace is no longer a method; it's who you are.
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
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
