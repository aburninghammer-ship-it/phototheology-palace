import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, Lock, Share2, Grid3x3, List, Trophy, FileText } from "lucide-react";
import { ShareAchievementButton } from "@/components/ShareAchievementButton";
import { AchievementProgress } from "@/components/AchievementProgress";
import { AchievementCertificate } from "@/components/AchievementCertificate";
import { useToast } from "@/hooks/use-toast";

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
  const [userStats, setUserStats] = useState({
    roomsCompleted: 0,
    drillsCompleted: 0,
    perfectDrills: 0,
    studyStreak: 0,
    floorsCompleted: 0,
  });

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("category", { ascending: true })
      .order("points", { ascending: false });
    
    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    const { data } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user!.id);
    
    setUserAchievements(new Set(data?.map(a => a.achievement_id) || []));
    setUserAchievementData(data || []);

    // Fetch user stats
    const { data: roomProgress } = await supabase
      .from("room_progress")
      .select("floor_number")
      .eq("user_id", user!.id)
      .not("completed_at", "is", null);

    const { data: drillResults } = await supabase
      .from("drill_results")
      .select("score, max_score")
      .eq("user_id", user!.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_study_streak")
      .eq("id", user!.id)
      .single();

    const uniqueFloors = new Set(roomProgress?.map(r => r.floor_number) || []);
    const perfectCount = drillResults?.filter(d => d.score === d.max_score).length || 0;

    setUserStats({
      roomsCompleted: roomProgress?.length || 0,
      drillsCompleted: drillResults?.length || 0,
      perfectDrills: perfectCount,
      studyStreak: profile?.daily_study_streak || 0,
      floorsCompleted: uniqueFloors.size,
    });
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const isUnlocked = userAchievements.has(achievement.id);
    if (filterType === "unlocked") return isUnlocked;
    if (filterType === "locked") return !isUnlocked;
    if (categoryFilter !== "all" && achievement.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "points") return (b.points || 0) - (a.points || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = Array.from(new Set(achievements.map(a => a.category || 'general')));
  const categoryStats = categories.map(cat => ({
    category: cat,
    total: achievements.filter(a => a.category === cat).length,
    unlocked: achievements.filter(a => a.category === cat && userAchievements.has(a.id)).length,
  }));

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
          <div className="flex items-center gap-4 mb-4">
            <Award className="h-16 w-16" />
            <div>
              <h1 className="text-5xl font-bold">Achievements</h1>
              <p className="text-purple-200 text-lg">Unlock badges as you master Phototheology</p>
            </div>
          </div>

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
        {/* Category Stats & Progress */}
        <div className="mb-8 space-y-4">
          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Card 
              className={`cursor-pointer transition-all ${
                categoryFilter === "all" ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCategoryFilter('all')}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {userAchievements.size}/{achievements.length}
                </div>
                <div className="text-xs text-muted-foreground">All</div>
              </CardContent>
            </Card>
            {categoryStats.map(stat => (
              <Card 
                key={stat.category}
                className={`cursor-pointer transition-all ${
                  categoryFilter === stat.category ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCategoryFilter(stat.category === categoryFilter ? 'all' : stat.category)}
              >
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{stat.unlocked}/{stat.total}</div>
                  <div className="text-xs text-muted-foreground capitalize">{stat.category}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Progress */}
          <AchievementProgress 
            achievements={achievements}
            userAchievements={userAchievementData}
            userStats={userStats}
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

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all cursor-pointer ${
                    isUnlocked 
                      ? "border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20" 
                      : "opacity-60 grayscale hover:opacity-70"
                  } ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}`}
                  onClick={() => isUnlocked && toggleSelection(achievement.id)}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-5xl mb-2">{achievement.icon || '🏆'}</div>
                      {isUnlocked && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelection(achievement.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
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
                    </div>
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

              return (
                <Card
                  key={achievement.id}
                  className={`transition-all cursor-pointer ${
                    isUnlocked 
                      ? "border-l-4 border-l-yellow-500 hover:shadow-md" 
                      : "opacity-60 grayscale"
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
                      <div className="text-3xl">{achievement.icon || '🏆'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          {isUnlocked ? (
                            <Award className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-semibold">
                          +{achievement.points} pts
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
