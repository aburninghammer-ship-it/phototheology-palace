import { useEffect, useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { LEADERBOARD_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Award, Target, Building2, Flame, Calendar, Crown, Star, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

const Leaderboard = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userStats, setUserStats] = useState({ points: 0, challenges: 0, achievements: 0, rooms: 0, streak: 0 });
  const [sortBy, setSortBy] = useState<'points' | 'challenges' | 'studies' | 'rooms'>('points');
  const [timePeriod, setTimePeriod] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [leaderAchievements, setLeaderAchievements] = useState<Record<string, any[]>>({});
  const [viewMode, setViewMode] = useState<'general' | 'categories'>('general');
  const [categoryLeaders, setCategoryLeaders] = useState<Record<string, any[]>>({});
  const [isInTop100, setIsInTop100] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (user) {
      if (viewMode === 'general') {
        fetchLeaders();
      } else {
        fetchCategoryLeaders();
      }
      fetchUserStats();
    }
  }, [user, sortBy, timePeriod, viewMode]);

  const fetchUserStats = async () => {
    // Get real XP from global_master_titles (actively updated by all activities)
    const { data: masterTitle } = await (supabase as any)
      .from("global_master_titles")
      .select("total_xp")
      .eq("user_id", user!.id)
      .maybeSingle();

    // Get real streak from mastery_streaks (actively updated)
    const { data: streak } = await (supabase as any)
      .from("mastery_streaks")
      .select("current_streak")
      .eq("user_id", user!.id)
      .maybeSingle();

    // Get challenges completed
    const { data: challenges } = await supabase
      .from("challenge_submissions")
      .select("id")
      .eq("user_id", user!.id);

    // Get achievements earned
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user!.id);

    // Get rooms completed
    const { data: rooms } = await supabase
      .from("room_progress")
      .select("id")
      .eq("user_id", user!.id)
      .not("completed_at", "is", null);

    const userXp = masterTitle?.total_xp || 0;

    setUserStats({
      points: userXp,
      challenges: challenges?.length || 0,
      achievements: achievements?.length || 0,
      rooms: rooms?.length || 0,
      streak: streak?.current_streak || 0,
    });

    // Calculate user rank from global_master_titles (real XP source)
    const { data: allXp } = await (supabase as any)
      .from("global_master_titles")
      .select("user_id, total_xp")
      .order("total_xp", { ascending: false });

    const rank = allXp?.findIndex((r: any) => r.user_id === user!.id) ?? -1;
    const userPosition = rank + 1;
    setUserRank(userPosition);

    // Check if user is in top 100 but not in top 50
    setIsInTop100(userPosition > 50 && userPosition <= 100);
  };

  const fetchLeaders = async () => {
    let leaderData: any[] = [];

    // Apply time period filter
    let dateFilter: Date | null = null;
    if (timePeriod === 'weekly') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timePeriod === 'monthly') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    if (sortBy === 'points') {
      // Use global_master_titles for real XP (actively updated by all activities)
      const { data: xpData } = await (supabase as any)
        .from("global_master_titles")
        .select("user_id, total_xp")
        .order("total_xp", { ascending: false })
        .limit(50);

      if (xpData && xpData.length > 0) {
        const userIds = xpData.map((r: any) => r.user_id);
        const xpMap: Record<string, number> = {};
        xpData.forEach((r: any) => { xpMap[r.user_id] = r.total_xp; });

        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, display_name, level")
          .in("id", userIds);

        // Get streaks for display
        const { data: streaks } = await (supabase as any)
          .from("mastery_streaks")
          .select("user_id, current_streak")
          .in("user_id", userIds);
        const streakMap: Record<string, number> = {};
        (streaks || []).forEach((s: any) => { streakMap[s.user_id] = s.current_streak; });

        leaderData = (profiles || []).map(p => ({
          ...p,
          points: xpMap[p.id] || 0,
          daily_study_streak: streakMap[p.id] || 0,
        })).sort((a, b) => b.points - a.points);
      }
    } else if (sortBy === 'challenges') {
      // Use aggregation approach: get challenge counts grouped by user
      let submissionsQuery = supabase
        .from("challenge_submissions")
        .select("user_id");
      
      if (dateFilter) {
        submissionsQuery = submissionsQuery.gte("created_at", dateFilter.toISOString());
      }
      
      const { data: submissions } = await submissionsQuery;
      
      if (submissions) {
        // Count submissions per user
        const userCounts: Record<string, number> = {};
        submissions.forEach(s => {
          userCounts[s.user_id] = (userCounts[s.user_id] || 0) + 1;
        });
        
        // Get top 50 user IDs by count
        const topUserIds = Object.entries(userCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 50)
          .map(([id]) => id);
        
        if (topUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, display_name, level")
            .in("id", topUserIds);

          // Get real XP and streaks
          const { data: xpData } = await (supabase as any)
            .from("global_master_titles")
            .select("user_id, total_xp")
            .in("user_id", topUserIds);
          const xpMap: Record<string, number> = {};
          (xpData || []).forEach((r: any) => { xpMap[r.user_id] = r.total_xp; });

          const { data: streaks } = await (supabase as any)
            .from("mastery_streaks")
            .select("user_id, current_streak")
            .in("user_id", topUserIds);
          const streakMap: Record<string, number> = {};
          (streaks || []).forEach((s: any) => { streakMap[s.user_id] = s.current_streak; });

          leaderData = (profiles || []).map(p => ({
            ...p,
            points: xpMap[p.id] || 0,
            daily_study_streak: streakMap[p.id] || 0,
            challengeCount: userCounts[p.id] || 0,
          })).sort((a, b) => b.challengeCount - a.challengeCount);
        }
      }
    } else if (sortBy === 'studies') {
      // Use mastery_streaks for real streak data (actively updated)
      const { data: streakData } = await (supabase as any)
        .from("mastery_streaks")
        .select("user_id, current_streak")
        .order("current_streak", { ascending: false })
        .limit(50);

      if (streakData && streakData.length > 0) {
        const userIds = streakData.map((s: any) => s.user_id);
        const streakMap: Record<string, number> = {};
        streakData.forEach((s: any) => { streakMap[s.user_id] = s.current_streak; });

        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, display_name, level")
          .in("id", userIds);

        // Get XP for display
        const { data: xpData } = await (supabase as any)
          .from("global_master_titles")
          .select("user_id, total_xp")
          .in("user_id", userIds);
        const xpMap: Record<string, number> = {};
        (xpData || []).forEach((r: any) => { xpMap[r.user_id] = r.total_xp; });

        leaderData = (profiles || []).map(p => ({
          ...p,
          points: xpMap[p.id] || 0,
          daily_study_streak: streakMap[p.id] || 0,
        })).sort((a, b) => (streakMap[b.id] || 0) - (streakMap[a.id] || 0));
      }
    } else if (sortBy === 'rooms') {
      // Use aggregation approach: get room completions grouped by user
      let roomsQuery = supabase
        .from("room_progress")
        .select("user_id")
        .not("completed_at", "is", null);
      
      if (dateFilter) {
        roomsQuery = roomsQuery.gte("completed_at", dateFilter.toISOString());
      }
      
      const { data: rooms } = await roomsQuery;
      
      if (rooms) {
        // Count rooms per user
        const userCounts: Record<string, number> = {};
        rooms.forEach(r => {
          userCounts[r.user_id] = (userCounts[r.user_id] || 0) + 1;
        });
        
        // Get top 50 user IDs by count
        const topUserIds = Object.entries(userCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 50)
          .map(([id]) => id);
        
        if (topUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, display_name, level")
            .in("id", topUserIds);

          // Get real XP and streaks
          const { data: xpData } = await (supabase as any)
            .from("global_master_titles")
            .select("user_id, total_xp")
            .in("user_id", topUserIds);
          const xpMap: Record<string, number> = {};
          (xpData || []).forEach((r: any) => { xpMap[r.user_id] = r.total_xp; });

          const { data: streaks } = await (supabase as any)
            .from("mastery_streaks")
            .select("user_id, current_streak")
            .in("user_id", topUserIds);
          const streakMap: Record<string, number> = {};
          (streaks || []).forEach((s: any) => { streakMap[s.user_id] = s.current_streak; });

          leaderData = (profiles || []).map(p => ({
            ...p,
            points: xpMap[p.id] || 0,
            daily_study_streak: streakMap[p.id] || 0,
            roomsCount: userCounts[p.id] || 0,
          })).sort((a, b) => b.roomsCount - a.roomsCount);
        }
      }
    }

    setLeaders(leaderData);

    // Fetch achievements for top 10 leaders
    const top10 = leaderData.slice(0, 10);
    const achievementsMap: Record<string, any[]> = {};
    
    await Promise.all(
      top10.map(async (leader) => {
        const { data } = await supabase
          .from("user_achievements")
          .select("achievement_id, achievements(name, icon, points)")
          .eq("user_id", leader.id)
          .order("unlocked_at", { ascending: false })
          .limit(3);
        
        achievementsMap[leader.id] = data?.map(ua => ua.achievements).filter(Boolean) || [];
      })
    );
    
    setLeaderAchievements(achievementsMap);
  };

  const fetchCategoryLeaders = async () => {
    const categories = ['explorer', 'scholar', 'perfectionist', 'dedicated', 'master'];
    const categoryData: Record<string, any[]> = {};

    for (const category of categories) {
      const { data: achievements } = await supabase
        .from('achievements')
        .select('id')
        .eq('category', category);

      if (achievements && achievements.length > 0) {
        const achievementIds = achievements.map(a => a.id);

        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select(`
            user_id,
            profiles!inner(id, username, display_name, points, level, daily_study_streak)
          `)
          .in('achievement_id', achievementIds);

        if (userAchievements) {
          const userCounts = userAchievements.reduce((acc: any, ua: any) => {
            const userId = ua.user_id;
            if (!acc[userId]) {
              acc[userId] = {
                ...ua.profiles,
                count: 0
              };
            }
            acc[userId].count += 1;
            return acc;
          }, {});

          const topUsers = Object.values(userCounts)
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 10);

          categoryData[category] = topUsers;
        }
      }
    }

    setCategoryLeaders(categoryData);
  };

  if (!user) return null;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={LEADERBOARD_TOUR} onClose={() => setTourOpen(false)} />}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="h-16 w-16" />
            <div>
              <h1 className="text-5xl font-bold">{t('leaderboard.title')}</h1>
              <p className="text-purple-200 text-lg">{t('leaderboard.subtitle')}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-1">
              <GraduationCap className="h-4 w-4" /> Tour
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  {t('leaderboard.yourStats.rank')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">#{userRank || '-'}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {t('leaderboard.yourStats.points')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.points}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t('leaderboard.yourStats.rooms')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.rooms}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  {t('leaderboard.yourStats.streak')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.streak}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {t('leaderboard.yourStats.badges')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{userStats.achievements}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Private Top 100 Encouragement Message */}
          {isInTop100 && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50">
                    <Star className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
                      {t('leaderboard.top100.title')}
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      {t('leaderboard.top100.description', { rank: userRank })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">{t('leaderboard.viewModes.general')}</TabsTrigger>
                <TabsTrigger value="categories">{t('leaderboard.viewModes.categories')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === 'general' && (
            <>
              {/* Time Period and Metric Filters */}
              <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('leaderboard.filters.timePeriod')}
                </CardTitle>
                <CardDescription>{t('leaderboard.filters.timePeriodDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">{t('leaderboard.filters.weekly')}</TabsTrigger>
                    <TabsTrigger value="monthly">{t('leaderboard.filters.monthly')}</TabsTrigger>
                    <TabsTrigger value="all">{t('leaderboard.filters.allTime')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('leaderboard.filters.sortByMetric')}
                </CardTitle>
                <CardDescription>{t('leaderboard.filters.chooseRanking')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={sortBy === 'points' ? 'default' : 'outline'}
                    onClick={() => setSortBy('points')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Award className="h-4 w-4" />
                    {t('leaderboard.metrics.points')}
                  </Button>
                  <Button
                    variant={sortBy === 'rooms' ? 'default' : 'outline'}
                    onClick={() => setSortBy('rooms')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Building2 className="h-4 w-4" />
                    {t('leaderboard.metrics.rooms')}
                  </Button>
                  <Button
                    variant={sortBy === 'studies' ? 'default' : 'outline'}
                    onClick={() => setSortBy('studies')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Flame className="h-4 w-4" />
                    {t('leaderboard.metrics.streak')}
                  </Button>
                  <Button
                    variant={sortBy === 'challenges' ? 'default' : 'outline'}
                    onClick={() => setSortBy('challenges')}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Target className="h-4 w-4" />
                    {t('leaderboard.metrics.challenges')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {t('leaderboard.topAchievers')}
              </CardTitle>
              <CardDescription>
                {timePeriod === 'weekly' ? t('leaderboard.filters.thisWeek') : timePeriod === 'monthly' ? t('leaderboard.filters.thisMonth') : t('leaderboard.filters.allTime')} {' \u2022 '}
                {t('leaderboard.sortedBy')} {sortBy === 'points' ? t('leaderboard.metrics.points') : sortBy === 'rooms' ? t('leaderboard.metrics.roomsCompleted') : sortBy === 'studies' ? t('leaderboard.metrics.studyStreak') : t('leaderboard.metrics.challenges')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaders.map((leader, index) => {
                  const isCurrentUser = leader.id === user?.id;
                  const achievements = leaderAchievements[leader.id] || [];
                  const isTop3 = index < 3;
                  
                  return (
                    <div
                      key={leader.id}
                      className={`group relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400 shadow-lg'
                          : isTop3
                          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800'
                          : 'bg-accent/50 hover:bg-accent border border-border'
                      }`}
                    >
                      {/* Rank badge */}
                      <div className="absolute top-2 right-2">
                        {isTop3 ? (
                          <div className="p-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                            {getRankIcon(index)}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-lg font-bold">
                            #{index + 1}
                          </Badge>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg truncate">
                                {leader.display_name || leader.username}
                              </p>
                              {isCurrentUser && (
                                <Badge className="bg-purple-600 hover:bg-purple-700">{t('leaderboard.you')}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5" />
                                {t('leaderboard.level', { level: leader.level })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5" />
                                {t('leaderboard.dayStreak', { count: leader.daily_study_streak || 0 })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right pr-14">
                            {sortBy === 'points' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                  {leader.points?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">{t('leaderboard.metrics.points')}</p>
                              </>
                            )}
                            {sortBy === 'challenges' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                  {(leader.challengeCount || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">{t('leaderboard.metrics.challenges')}</p>
                              </>
                            )}
                            {sortBy === 'studies' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                  {leader.daily_study_streak || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">{t('leaderboard.metrics.dayStreak')}</p>
                              </>
                            )}
                            {sortBy === 'rooms' && (
                              <>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                  {(leader.roomsCount || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">{t('leaderboard.metrics.rooms')}</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Achievements badges - only show for top 10 */}
                        {index < 10 && achievements.length > 0 && (
                          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div className="flex gap-2 flex-wrap">
                              {achievements.map((achievement: any, i: number) => (
                                <Badge 
                                  key={i}
                                  variant="secondary" 
                                  className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-400/30"
                                >
                                  {achievement.icon} {achievement.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
            </>
          )}

          {viewMode === 'categories' && (
            <div className="space-y-8">
              {Object.entries(categoryLeaders).map(([category, users]) => {
                const categoryConfig = {
                  explorer: { icon: Target, color: 'from-blue-500 to-cyan-500', title: t('leaderboard.categories.topExplorers') },
                  scholar: { icon: Award, color: 'from-purple-500 to-indigo-500', title: t('leaderboard.categories.topScholars') },
                  perfectionist: { icon: Star, color: 'from-green-500 to-emerald-500', title: t('leaderboard.categories.topPerfectionists') },
                  dedicated: { icon: Flame, color: 'from-orange-500 to-red-500', title: t('leaderboard.categories.mostDedicated') },
                  master: { icon: Crown, color: 'from-yellow-500 to-amber-500', title: t('leaderboard.categories.masters') }
                }[category];

                if (!categoryConfig) return null;
                const Icon = categoryConfig.icon;

                return (
                  <Card key={category}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${categoryConfig.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{categoryConfig.title}</CardTitle>
                          <CardDescription>{t('leaderboard.categories.topAchieversIn', { category })}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {users.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            {t('leaderboard.categories.noUsers')}
                          </p>
                        ) : (
                          users.map((leader: any, idx: number) => (
                            <div
                              key={leader.id}
                              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                leader.id === user?.id ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30 hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  {idx < 3 ? (
                                    <div className="flex items-center justify-center w-8 h-8">
                                      {idx === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                                      {idx === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                                      {idx === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                                    </div>
                                  ) : (
                                    <span className="w-8 text-center font-semibold text-muted-foreground">
                                      #{idx + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{leader.display_name || leader.username}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="secondary">{t('leaderboard.level', { level: leader.level || 1 })}</Badge>
                                    <span className="flex items-center gap-1">
                                      <Flame className="h-3 w-3" />
                                      {t('leaderboard.dayStreak', { count: leader.daily_study_streak || 0 })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">{leader.count}</p>
                                <p className="text-xs text-muted-foreground">{t('leaderboard.metrics.achievements')}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
