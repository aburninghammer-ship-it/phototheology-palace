import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  UserMinus,
  MapPin,
  Globe,
  Calendar,
  Trophy,
  Flame,
  MessageCircle,
  Users,
  Loader2,
  BookOpen,
  Gem,
  Swords,
  Share2,
  ExternalLink,
} from "lucide-react";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";
import { PersonalPageFeed } from "@/components/living-manna/profile/PersonalPageFeed";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFollow } from "@/hooks/useFollow";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface UserProfileData {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  social_links: any;
  points: number;
  level: number;
  daily_study_streak: number;
  longest_study_streak: number;
  total_gems_saved: number;
  total_studies_saved: number;
  created_at: string;
  current_floor: number;
  master_title: string | null;
  is_profile_public: boolean;
  ministry_tags: string[] | null;
}

interface MasteryData {
  total_xp: number;
  floors_completed: number;
  current_floor: number;
  global_streak_days: number;
  rooms_mastered: number;
}

interface ReadingData {
  total_chapters_read: number;
  total_verses_read: number;
  current_streak: number;
  longest_streak: number;
}

const BELT_COLORS: Record<string, string> = {
  white: "from-gray-100 to-gray-300 text-gray-800",
  blue: "from-blue-400 to-blue-600 text-white",
  red: "from-red-400 to-red-600 text-white",
  gold: "from-amber-400 to-amber-600 text-white",
  purple: "from-purple-400 to-purple-600 text-white",
  black: "from-gray-800 to-gray-950 text-white",
  black_candidate: "from-gray-700 to-gray-900 text-white",
};

export default function UserProfile() {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [mastery, setMastery] = useState<MasteryData | null>(null);
  const [reading, setReading] = useState<ReadingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharedChallenges, setSharedChallenges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [gemsCount, setGemsCount] = useState(0);

  const {
    isFollowing,
    followersCount,
    followingCount,
    toggleFollow,
    loading: followLoading,
  } = useFollow(userId || "");

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchAll();
    }
  }, [userId]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchMastery(),
      fetchReading(),
      fetchSharedChallenges(),
      fetchAchievements(),
      fetchGemsCount(),
    ]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, cover_photo_url, bio, location, website, social_links, points, level, daily_study_streak, longest_study_streak, total_gems_saved, total_studies_saved, created_at, current_floor, master_title, is_profile_public, ministry_tags")
        .eq("id", userId!)
        .single();
      if (error) throw error;
      setProfile(data as any);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchMastery = async () => {
    try {
      const { data } = await supabase
        .from("global_master_titles")
        .select("total_xp, floors_completed, current_floor, global_streak_days, rooms_mastered")
        .eq("user_id", userId!)
        .maybeSingle();
      if (data) setMastery(data as any);
    } catch (error) {
      console.error("Error fetching mastery:", error);
    }
  };

  const fetchReading = async () => {
    try {
      const { data } = await supabase
        .from("reading_streaks")
        .select("total_chapters_read, total_verses_read, current_streak, longest_streak")
        .eq("user_id", userId!)
        .maybeSingle();
      if (data) setReading(data as any);
    } catch (error) {
      console.error("Error fetching reading:", error);
    }
  };

  const fetchGemsCount = async () => {
    try {
      const { count } = await supabase
        .from("user_gems")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId!);
      setGemsCount(count || 0);
    } catch (error) {
      console.error("Error fetching gems:", error);
    }
  };

  const fetchSharedChallenges = async () => {
    try {
      const { data } = await supabase
        .from("equation_challenges")
        .select("*")
        .eq("created_by", userId!)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(10);
      setSharedChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data } = await supabase
        .from("user_achievements")
        .select(`unlocked_at, achievements (id, name, description, icon, points)`)
        .eq("user_id", userId!)
        .order("unlocked_at", { ascending: false });
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/user/${userId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Profile link copied to clipboard." });
  };

  const beltTitle = profile?.master_title || "white";
  const beltGradient = BELT_COLORS[beltTitle] || BELT_COLORS.white;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">{t("userProfile.notFound")}</h1>
          <p className="text-muted-foreground mt-2">This user doesn't exist or their profile is private.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-5xl mx-auto pt-16">
        {/* Cover Photo Banner */}
        <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-b-2xl">
          {profile.cover_photo_url ? (
            <img
              src={profile.cover_photo_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${beltGradient} opacity-60`} />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>

        {/* Profile Header — overlaps banner */}
        <div className="relative px-4 md:px-8 -mt-20">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            {/* Avatar */}
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                {(profile.display_name || "?").charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Name + Actions */}
            <div className="flex-1 pt-2 md:pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold">{profile.display_name}</h1>
                    <UserMasterySword
                      masterTitle={profile.master_title}
                      currentFloor={profile.current_floor || 1}
                      size="md"
                      isOwner={profile.id === "a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b"}
                    />
                    {/* Belt Badge */}
                    <Badge className={`bg-gradient-to-r ${beltGradient} border-0 text-xs font-semibold`}>
                      {beltTitle === "black_candidate" ? "Black Candidate" : `${beltTitle.charAt(0).toUpperCase() + beltTitle.slice(1)} Belt`}
                    </Badge>
                  </div>
                  {profile.username && (
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {!isOwnProfile && currentUser && (
                    <Button
                      onClick={toggleFollow}
                      disabled={followLoading}
                      variant={isFollowing ? "outline" : "default"}
                      className="gap-2"
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button asChild variant="outline">
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{profile.bio}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {format(new Date(profile.created_at!), "MMMM yyyy")}
                </span>
              </div>

              {/* Ministry tags */}
              {profile.ministry_tags && profile.ministry_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.ministry_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
            <StatCard icon={<Users className="w-4 h-4 text-primary" />} value={followersCount} label="Followers" />
            <StatCard icon={<Users className="w-4 h-4 text-primary" />} value={followingCount} label="Following" />
            <StatCard icon={<Trophy className="w-4 h-4 text-amber-500" />} value={mastery?.total_xp || profile.points || 0} label="XP" />
            <StatCard icon={<Flame className="w-4 h-4 text-orange-500" />} value={profile.daily_study_streak || 0} label="Day Streak" />
            <StatCard icon={<Gem className="w-4 h-4 text-cyan-500" />} value={gemsCount || profile.total_gems_saved || 0} label="Gems" />
            <StatCard icon={<BookOpen className="w-4 h-4 text-emerald-500" />} value={reading?.total_chapters_read || 0} label="Chapters" />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 md:px-8 mt-8 pb-12">
          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">
                <MessageCircle className="w-4 h-4 mr-1.5 hidden sm:inline" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="challenges">
                <Swords className="w-4 h-4 mr-1.5 hidden sm:inline" />
                Challenges
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="w-4 h-4 mr-1.5 hidden sm:inline" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="about">
                <ExternalLink className="w-4 h-4 mr-1.5 hidden sm:inline" />
                About
              </TabsTrigger>
            </TabsList>

            {/* ─── Feed Tab ─── */}
            <TabsContent value="feed">
              <PersonalPageFeed userId={userId!} />
            </TabsContent>

            {/* ─── Challenges Tab ─── */}
            <TabsContent value="challenges" className="space-y-4">
              {sharedChallenges.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No shared challenges yet.</p>
                </Card>
              ) : (
                sharedChallenges.map((challenge) => (
                  <Card key={challenge.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{challenge.explanation}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{challenge.difficulty}</Badge>
                          <span className="text-sm text-muted-foreground">{challenge.solve_count} solves</span>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/equations?code=${challenge.share_code}`}>Try it</Link>
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* ─── Achievements Tab ─── */}
            <TabsContent value="achievements" className="space-y-4">
              {/* Mastery Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Palace Mastery</h3>
                    <p className="text-sm text-muted-foreground">
                      {beltTitle === "black_candidate"
                        ? "Black Belt Candidate"
                        : `${beltTitle.charAt(0).toUpperCase() + beltTitle.slice(1)} Belt`}{" "}
                      — Floor {mastery?.current_floor || profile.current_floor || 1}
                    </p>
                    {mastery && (
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{mastery.floors_completed} floors completed</span>
                        <span>{mastery.rooms_mastered || 0} rooms mastered</span>
                        <span>{mastery.total_xp.toLocaleString()} total XP</span>
                      </div>
                    )}
                  </div>
                  <UserMasterySword
                    masterTitle={profile.master_title}
                    currentFloor={profile.current_floor || 1}
                    size="lg"
                    isOwner={profile.id === "a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b"}
                  />
                </div>
              </Card>

              {achievements.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No achievements unlocked yet.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((a: any) => (
                    <Card key={a.achievements.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{a.achievements.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{a.achievements.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{a.achievements.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{a.achievements.points} pts</Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(a.unlocked_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ─── About Tab ─── */}
            <TabsContent value="about">
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Study Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <MiniStat label="Total XP" value={(mastery?.total_xp || 0).toLocaleString()} />
                    <MiniStat label="Longest Streak" value={`${profile.longest_study_streak || reading?.longest_streak || 0} days`} />
                    <MiniStat label="Chapters Read" value={(reading?.total_chapters_read || 0).toLocaleString()} />
                    <MiniStat label="Verses Read" value={(reading?.total_verses_read || 0).toLocaleString()} />
                    <MiniStat label="Gems Collected" value={(gemsCount || profile.total_gems_saved || 0).toLocaleString()} />
                    <MiniStat label="Studies Saved" value={(profile.total_studies_saved || 0).toLocaleString()} />
                    <MiniStat label="Floor" value={`${mastery?.current_floor || profile.current_floor || 1}`} />
                    <MiniStat label="Rooms Mastered" value={`${mastery?.rooms_mastered || 0}`} />
                  </div>
                </div>

                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Social Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.social_links as Record<string, string>).map(
                        ([platform, url]) =>
                          url && (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Badge variant="outline" className="hover:bg-primary/10 transition-colors cursor-pointer">
                                {platform}
                              </Badge>
                            </a>
                          )
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="p-3 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-lg font-bold">{value.toLocaleString()}</span>
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
