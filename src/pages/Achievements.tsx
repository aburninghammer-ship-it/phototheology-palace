import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { ACHIEVEMENTS_TOUR } from "@/data/guidedTours";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, Lock, Share2, Grid3x3, List, Trophy, FileText, Map, ChevronRight } from "lucide-react";
import { ShareAchievementButton } from "@/components/ShareAchievementButton";
import { AchievementProgress } from "@/components/AchievementProgress";
import { AchievementCertificate } from "@/components/AchievementCertificate";
import { AchievementRoadmap } from "@/components/achievements/AchievementRoadmap";
import { TierBadge } from "@/components/achievements/TierBadge";
import { useToast } from "@/hooks/use-toast";
import { categoryIcons, categoryDescriptions, categoryColors } from "@/utils/categoryIcons";
import { requirementRoutes, getRequirementLabel } from "@/utils/achievementHelpers";

const Achievements = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());
  const [userAchievementData, setUserAchievementData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<"all" | "unlocked" | "locked">("all");
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery");
  const [sortBy, setSortBy] = useState<"points" | "name">("points");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
const [certificateAchievement, setCertificateAchievement] = useState<any>(null);
  const [mainTab, setMainTab] = useState<"gallery" | "roadmap">("gallery");
  const [tourOpen, setTourOpen] = useState(false);
  const [userStats, setUserStats] = useState<Record<string, number>>({
    rooms_completed: 0,
    drills_completed: 0,
    perfect_drills: 0,
    study_streak: 0,
    floors_completed: 0,
    chapters_read: 0,
    verses_memorized: 0,
    challenges_completed: 0,
    devotional_days: 0,
    escape_rooms_completed: 0,
    games_completed: 0,
    posts_created: 0,
    comments_created: 0,
  });

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data } = await (supabase
      .from("achievements")
      .select("*")
      .order("category", { ascending: true })
      .order("points", { ascending: false }) as any);
    
    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    const { data } = await (supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user!.id) as any);

    setUserAchievements(new Set(data?.map(a => a.achievement_id) || []));
    setUserAchievementData(data || []);

    // Fetch all user stats for achievement progress tracking (as any to avoid deep type instantiation)
    const roomProgressRes: any = await supabase.from("room_progress").select("floor_number").eq("user_id", user!.id).not("completed_at", "is", null);
    const drillResultsRes: any = await supabase.from("drill_results").select("score, max_score").eq("user_id", user!.id);
    const profileRes: any = await supabase.from("profiles").select("daily_study_streak, longest_study_streak").eq("id", user!.id).single();
    const readingLogsRes: any = await supabase.from("daily_reading_log").select("id").eq("user_id", user!.id);
    const memorizationRes: any = await supabase.from("memorization_verses").select("id, mastery_level").eq("user_id", user!.id);
    const challengesRes: any = await supabase.from("challenge_submissions").select("id").eq("user_id", user!.id);
    const devotionalsRes: any = await supabase.from("devotional_progress").select("id").eq("user_id", user!.id);
    const escapeRoomsQuery = supabase.from("escape_room_attempts" as any).select("id").eq("user_id", user!.id).eq("completed", true);
    const escapeRoomsRes: any = await escapeRoomsQuery;
    const gameSessionsQuery = supabase.from("game_sessions" as any).select("id").eq("user_id", user!.id).not("completed_at", "is", null);
    const gameSessionsRes: any = await gameSessionsQuery;
    const postsRes: any = await supabase.from("community_posts").select("id").eq("user_id", user!.id);
    const commentsRes: any = await supabase.from("community_comments").select("id").eq("user_id", user!.id);

    const roomProgress = roomProgressRes.data || [];
    const drillResults = drillResultsRes.data || [];
    const profile = profileRes.data;
    const readingLogs = readingLogsRes.data || [];
    const memorization = memorizationRes.data || [];
    const challenges = challengesRes.data || [];
    const devotionals = devotionalsRes.data || [];
    const escapeRooms = escapeRoomsRes.data || [];
    const gameSessions = gameSessionsRes.data || [];
    const posts = postsRes.data || [];
    const comments = commentsRes.data || [];

    const uniqueFloors = new Set(roomProgress.map(r => r.floor_number));
    const perfectCount = drillResults.filter(d => d.score === d.max_score).length;
    const memorizedVerses = memorization.filter(v => (v.mastery_level || 0) >= 3).length;

    setUserStats({
      rooms_completed: roomProgress.length,
      drills_completed: drillResults.length,
      perfect_drills: perfectCount,
      study_streak: profile?.daily_study_streak || 0,
      floors_completed: uniqueFloors.size,
      chapters_read: readingLogs.length,
      verses_memorized: memorizedVerses,
      challenges_completed: challenges.length,
      devotional_days: devotionals.length,
      escape_rooms_completed: escapeRooms.length,
      games_completed: gameSessions.length,
      posts_created: posts.length,
      comments_created: comments.length,
    });
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const isUnlocked = userAchievements.has(achievement.id);
    // Apply category filter first (applies to all tabs)
    if (categoryFilter !== "all" && achievement.category !== categoryFilter) return false;
    // Then apply unlock status filter
    if (filterType === "unlocked") return isUnlocked;
    if (filterType === "locked") return !isUnlocked;
    return true;
  }).sort((a, b) => {
    if (sortBy === "points") return (b.points || 0) - (a.points || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = Array.from(new Set(achievements.map(a => a.category || 'general')));
  const categoryStats = categories.map(cat => {
    const CategoryIcon = categoryIcons[cat as keyof typeof categoryIcons] || Trophy;
    const description = categoryDescriptions[cat as keyof typeof categoryDescriptions] || '';
    const colorGradient = categoryColors[cat as keyof typeof categoryColors] || categoryColors.general;
    
    return {
      category: cat,
      total: achievements.filter(a => a.category === cat).length,
      unlocked: achievements.filter(a => a.category === cat && userAchievements.has(a.id)).length,
      icon: CategoryIcon,
      description,
      colorGradient,
    };
  });

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (userAchievements.has(id)) {
        newSelection.add(id);
      }
    }
    setSelectedIds(newSelection);
  };

  const selectAllUnlocked = () => {
    setSelectedIds(new Set(Array.from(userAchievements)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const bulkShare = () => {
    const selectedAchievements = achievements.filter(a => selectedIds.has(a.id));
    const achievementNames = selectedAchievements.map(a => a.name).join(", ");
    const totalPoints = selectedAchievements.reduce((sum, a) => sum + (a.points || 0), 0);
    
    const text = `Just unlocked ${selectedIds.size} achievements on Phototheology Palace! 🎉\n\n${achievementNames}\n\n+${totalPoints} points earned!\n\n${window.location.origin}/achievements`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `Share text for ${selectedIds.size} achievements ready to paste.`,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Award className="h-16 w-16" />
              <div>
                <h1 className="text-5xl font-bold">Achievements</h1>
                <p className="text-purple-200 text-lg">Unlock badges as you master Phototheology</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="text-white/80 hover:text-white hover:bg-white/10 gap-1">
              <Award className="h-4 w-4" /> Tour
            </Button>
          </div>
          {tourOpen && <GuidedTourOverlay steps={ACHIEVEMENTS_TOUR} onClose={() => setTourOpen(false)} />}

          {/* Progress Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Unlocked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {userAchievements.size} / {achievements.length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Total Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {achievements
                    .filter(a => userAchievements.has(a.id))
                    .reduce((sum, a) => sum + (a.points || 0), 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white/90 text-sm font-normal">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {achievements.length > 0 ? Math.round((userAchievements.size / achievements.length) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Tab Switch: Gallery vs Roadmap */}
        <div className="mb-6">
          <Tabs value={mainTab} onValueChange={(v: any) => setMainTab(v)}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="gallery" className="gap-2">
                <Grid3x3 className="h-4 w-4" />
                Gallery View
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="gap-2">
                <Map className="h-4 w-4" />
                Journey Roadmap
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {mainTab === "roadmap" ? (
          <AchievementRoadmap
            achievements={achievements}
            userAchievements={userAchievements}
            userStats={{
              roomsCompleted: userStats.rooms_completed || 0,
              drillsCompleted: userStats.drills_completed || 0,
              perfectDrills: userStats.perfect_drills || 0,
              studyStreak: userStats.study_streak || 0,
              floorsCompleted: userStats.floors_completed || 0,
            }}
          />
        ) : (
          <>
            {/* Category Stats & Progress */}
            <div className="mb-8 space-y-4">
              {/* Category Cards */}
              <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Card 
                className={`cursor-pointer transition-all ${
                  categoryFilter === "all" ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCategoryFilter('all')}
              >
                <CardContent className="p-3 text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-primary">
                    {userAchievements.size}/{achievements.length}
                  </div>
                  <div className="text-xs text-muted-foreground">All</div>
                </CardContent>
              </Card>
              {categoryStats.map(stat => {
                const CategoryIcon = stat.icon;
                return (
                  <Tooltip key={stat.category}>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          categoryFilter === stat.category ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setCategoryFilter(stat.category === categoryFilter ? 'all' : stat.category)}
                      >
                        <CardContent className="p-3 text-center">
                          <div className={`w-8 h-8 mx-auto mb-1 rounded-lg bg-gradient-to-br ${stat.colorGradient} flex items-center justify-center`}>
                            <CategoryIcon className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-primary">{stat.unlocked}/{stat.total}</div>
                          <div className="text-xs text-muted-foreground capitalize">{stat.category}</div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{stat.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Achievement Progress */}
          <AchievementProgress 
            achievements={achievements}
            userAchievements={userAchievementData}
            userStats={{
              roomsCompleted: userStats.rooms_completed || 0,
              drillsCompleted: userStats.drills_completed || 0,
              perfectDrills: userStats.perfect_drills || 0,
              studyStreak: userStats.study_streak || 0,
              floorsCompleted: userStats.floors_completed || 0,
            }}
          />
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  <Award className="h-4 w-4" />
                  All ({achievements.length})
                </TabsTrigger>
                <TabsTrigger value="unlocked" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Unlocked ({userAchievements.size})
                </TabsTrigger>
                <TabsTrigger value="locked" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Locked ({achievements.length - userAchievements.size})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "gallery" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("gallery")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>

              <div className="h-6 w-px bg-border mx-2" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="points">Points</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {selectedIds.size} selected
                </Badge>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllUnlocked}>
                  Select All Unlocked
                </Button>
              </div>
              <Button onClick={bulkShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Selected
              </Button>
            </div>
          )}
        </div>

        {/* Achievement Grid/List */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No achievements found matching your filters.
          </div>
        ) : viewMode === "gallery" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = userAchievements.has(achievement.id);
              const isSelected = selectedIds.has(achievement.id);
              const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
              const colorGradient = categoryColors[achievement.category as keyof typeof categoryColors] || categoryColors.general;
              const route = requirementRoutes[achievement.requirement_type];
              
              // Calculate progress for locked achievements
              const target = achievement.requirement_count || 1;
              const current = !isUnlocked ? (userStats[achievement.requirement_type] || 0) : target;
              const percentage = Math.min((current / target) * 100, 100);

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all ${
                    isUnlocked 
                      ? "border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 cursor-pointer" 
                      : "hover:shadow-md"
                  } ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}`}
                  onClick={() => isUnlocked && toggleSelection(achievement.id)}
                >
                  <CardHeader className="space-y-3 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <div className="text-5xl mb-2">{achievement.icon || '🏆'}</div>
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-br ${colorGradient}`}>
                          <CategoryIcon className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TierBadge points={achievement.points || 0} size="md" />
                        {isUnlocked && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(achievement.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {achievement.name}
                        {isUnlocked ? (
                          <Award className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {achievement.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-semibold">
                        +{achievement.points} pts
                      </Badge>
                      <Badge variant="outline" className="capitalize gap-1">
                        <CategoryIcon className="h-3 w-3" />
                        {achievement.category || 'general'}
                      </Badge>
                    </div>
                    
                    {/* Progress bar and requirements for locked achievements */}
                    {!isUnlocked && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {getRequirementLabel(achievement.requirement_type, target)}
                          </span>
                          <span className="font-medium">{current}/{target}</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                        {route && (
                          <Button
                            size="sm"
                            variant={percentage >= 50 ? "default" : "outline"}
                            className="w-full mt-2 gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(route.path);
                            }}
                          >
                            {route.label}
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <ShareAchievementButton
                        achievement={achievement}
                        variant="outline"
                        size="sm"
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = userAchievements.has(achievement.id);
              const isSelected = selectedIds.has(achievement.id);
              const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
              const colorGradient = categoryColors[achievement.category as keyof typeof categoryColors] || categoryColors.general;
              const route = requirementRoutes[achievement.requirement_type];
              
              // Calculate progress for locked achievements
              const target = achievement.requirement_count || 1;
              const current = !isUnlocked ? (userStats[achievement.requirement_type] || 0) : target;
              const percentage = Math.min((current / target) * 100, 100);

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all ${
                    isUnlocked 
                      ? "border-l-4 border-l-yellow-500 hover:shadow-md cursor-pointer" 
                      : "hover:shadow-sm"
                  } ${isSelected ? "ring-2 ring-primary" : ""}`}
                  onClick={() => isUnlocked && toggleSelection(achievement.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {isUnlocked && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelection(achievement.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div className="relative">
                        <div className="text-3xl">{achievement.icon || '🏆'}</div>
                        <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-full bg-gradient-to-br ${colorGradient}`}>
                          <CategoryIcon className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <TierBadge points={achievement.points || 0} size="sm" />
                          {isUnlocked ? (
                            <Award className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {/* Progress for locked achievements */}
                        {!isUnlocked && (
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1 max-w-xs">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">
                                  {getRequirementLabel(achievement.requirement_type, target)}
                                </span>
                                <span className="font-medium">{current}/{target}</span>
                              </div>
                              <Progress value={percentage} className="h-1.5" />
                            </div>
                            {route && (
                              <Button
                                size="sm"
                                variant={percentage >= 50 ? "default" : "outline"}
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(route.path);
                                }}
                              >
                                {route.label}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant="secondary" className="font-semibold">
                          +{achievement.points} pts
                        </Badge>
                        <Badge variant="outline" className="capitalize gap-1 hidden sm:flex">
                          <CategoryIcon className="h-3 w-3" />
                          {achievement.category || 'general'}
                        </Badge>
                        {isUnlocked && (
                          <>
                            <ShareAchievementButton
                              achievement={achievement}
                              variant="ghost"
                              size="icon"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCertificateAchievement(achievement);
                              }}
                              title="Print Certificate"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
          </>
        )}
      </main>

      {/* Certificate Dialog */}
      {certificateAchievement && (
        <AchievementCertificate
          open={!!certificateAchievement}
          onClose={() => setCertificateAchievement(null)}
          achievement={certificateAchievement}
        />
      )}
    </div>
  );
};

export default Achievements;
