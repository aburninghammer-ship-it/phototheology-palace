import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasteryBadge } from "@/components/mastery/MasteryBadge";
import { XpProgressBar } from "@/components/mastery/XpProgressBar";
import { MasteryMap } from "@/components/mastery/MasteryMap";
import { ReportCardDisplay } from "@/components/mastery/ReportCardDisplay";
import { RoomMasteryGrid } from "@/components/mastery/RoomMasteryGrid";
import { MasteryPassport } from "@/components/mastery/MasteryPassport";
import { PartnerDashboard } from "@/components/partnership/PartnerDashboard";
import { useMastery, useAllRoomMasteries, useGlobalMasterTitle } from "@/hooks/useMastery";
import { useMasteryStreak } from "@/hooks/useMasteryStreak";
import { usePartnership } from "@/hooks/usePartnership";
import { Link } from "react-router-dom";
import { Sword, Award, Grid3X3, Users } from "lucide-react";
import { Flame, Trophy, Crown, Target, TrendingUp, Zap, Map as MapIcon, FileText, ChevronDown } from "lucide-react";
import { getGlobalTitle, getNextGlobalTitleMilestone } from "@/utils/masteryCalculations";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default function MasteryDashboard() {
  const { t } = useTranslation();
  const { data: allMasteries, isLoading: masteriesLoading } = useAllRoomMasteries();
  const { data: globalTitle } = useGlobalMasterTitle();
  const { streak, isLoading: streakLoading } = useMasteryStreak();
  const { partnership, bothCompletedToday } = usePartnership();
  const [openTitles, setOpenTitles] = useState<Record<number, boolean>>({});

  const roomsMastered = allMasteries?.filter(m => m.mastery_level === 5).length || 0;
  const totalXp = allMasteries?.reduce((sum, m) => sum + m.xp_current, 0) || 0;
  const currentGlobalTitle = getGlobalTitle(roomsMastered);
  const nextMilestone = getNextGlobalTitleMilestone(roomsMastered);

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
          <div className="text-center py-20">{t('mastery.loading')}</div>
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
              {t('mastery.title')}
            </h1>
            <p className="text-muted-foreground">{t('mastery.subtitle')}</p>
          </div>

          <Card className="border-primary/20 bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t('mastery.howItWorks')}
              </CardTitle>
              <CardDescription>
                {t('mastery.howItWorksDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-semibold mb-1">{t('mastery.pickRoom')}</p>
                <p className="text-muted-foreground">{t('mastery.pickRoomDesc')}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('mastery.earnXP')}</p>
                <p className="text-muted-foreground">{t('mastery.earnXPDesc')}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">{t('mastery.reachLevel5')}</p>
                <p className="text-muted-foreground">{t('mastery.reachLevel5Desc')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('mastery.globalTitle')}</CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{currentGlobalTitle}</div>
              {nextMilestone && (
                <p className="text-xs text-muted-foreground">
                  {t('mastery.moreRoomsTo', { count: nextMilestone.roomsNeeded, title: nextMilestone.title })}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('mastery.roomsMastered')}</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{roomsMastered}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('mastery.level5Achievements')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('mastery.masteryStreak')}</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{streak?.current_streak || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('mastery.longestDays', { count: streak?.longest_streak || 0 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t('mastery.overview')}</TabsTrigger>
            <TabsTrigger value="partner" className="relative">
              <Users className="h-4 w-4 mr-2" />
              {t('mastery.partner')}
              {partnership?.status === 'active' && bothCompletedToday && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <Grid3X3 className="h-4 w-4 mr-2" />
              {t('mastery.rooms')}
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="h-4 w-4 mr-2" />
              {t('mastery.badges')}
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon className="h-4 w-4 mr-2" />
              {t('mastery.map')}
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              {t('mastery.reports')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Floor-Based Mastery System */}
            <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  {t('mastery.floorBasedSystem')}
                </CardTitle>
                <CardDescription>
                  {t('mastery.floorBasedDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="mb-4 text-foreground/90">
                    {t('mastery.floorBasedEvolved')}
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li>
                      <Link to="/palace/floor/1" className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-blue-500" />
                        <span><strong className="text-blue-500">{t('mastery.floor1Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/2" className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-red-500" />
                        <span><strong className="text-red-500">{t('mastery.floor2Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/3" className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-yellow-600" />
                        <span><strong className="text-yellow-600 dark:text-yellow-500">{t('mastery.floor3Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/4" className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-purple-500" />
                        <span><strong className="text-purple-500">{t('mastery.floor4Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/5" className="flex items-center gap-3 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-gray-400" />
                        <span><strong className="text-gray-700 dark:text-gray-300">{t('mastery.floor56Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/7" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/10 border border-gray-700/20 hover:bg-gray-700/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-gray-600" />
                        <span><strong className="text-gray-800 dark:text-gray-200">{t('mastery.floor7Title')}</strong></span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/palace/floor/8" className="flex items-center gap-3 p-3 rounded-lg bg-black/10 dark:bg-white/10 border border-black/30 dark:border-white/30 hover:bg-black/20 dark:hover:bg-white/20 transition-colors cursor-pointer">
                        <Sword className="h-6 w-6 text-black dark:text-white" />
                        <span><strong className="text-black dark:text-white">{t('mastery.floor8Title')}</strong></span>
                      </Link>
                    </li>
                  </ul>
                  <p className="text-foreground/90">
                    {t('mastery.floorAssessmentNote')}
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = '/mastery'}
                  className="w-full"
                  size="lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {t('mastery.viewFloorProgression')}
                </Button>
              </CardContent>
            </Card>

            {/* How It Works - Explanatory Section */}
            <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {t('mastery.howToMasterRooms')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('mastery.chooseRoom')}</p>
                      <p className="text-muted-foreground">{t('mastery.chooseRoomDesc')}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('mastery.completeActivities')}</p>
                      <p className="text-muted-foreground">
                        {t('mastery.completeActivitiesDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('mastery.levelUp')}</p>
                      <p className="text-muted-foreground">
                        {t('mastery.levelUpDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{t('mastery.masterAllRooms')}</p>
                      <p className="text-muted-foreground">
                        {t('mastery.masterAllRoomsDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border">
                  <p className="text-xs font-semibold mb-2 text-primary">{t('mastery.xpRequirements')}</p>
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
                      <div className="font-bold">{t('mastery.total')}</div>
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
                  {t('mastery.demoRoom')}
                </CardTitle>
                <CardDescription>
                  {t('mastery.demoRoomDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoRoom.mastery && (
                  <>
                    <div className="flex items-center gap-4">
                      <MasteryBadge level={demoRoom.mastery.mastery_level} size="lg" />
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">
                          {t('mastery.levelProgress', { level: demoRoom.mastery.mastery_level })}
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
                        {t('mastery.completePerfectDrill')}
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.total_drills_completed}
                        </div>
                        <div className="text-xs text-muted-foreground">{t('mastery.drills')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.total_exercises_completed}
                        </div>
                        <div className="text-xs text-muted-foreground">{t('mastery.exercises')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {demoRoom.mastery.perfect_scores_count}
                        </div>
                        <div className="text-xs text-muted-foreground">{t('mastery.perfectScores')}</div>
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
                  {t('mastery.allRoomsProgress')}
                </CardTitle>
                <CardDescription>
                  {t('mastery.allRoomsProgressDesc')}
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
                            {t('mastery.floorRoom', { floor: mastery.floor_number, room: mastery.room_id })}
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
                          <div className="text-xs text-muted-foreground">{t('mastery.activities')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">{t('mastery.noProgressYet')}</p>
                    <p className="text-sm">
                      {t('mastery.startPracticing')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partner" className="space-y-6">
            <PartnerDashboard />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <RoomMasteryGrid showTrainButton={true} />
          </TabsContent>

          <TabsContent value="badges">
            <MasteryPassport />
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
