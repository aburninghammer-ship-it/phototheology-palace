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
  Loader2
} from "lucide-react";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFollow } from "@/hooks/useFollow";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  points: number;
  level: number;
  daily_study_streak: number;
  created_at: string;
  current_floor: number;
  master_title: string | null;
}

export default function UserProfile() {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharedChallenges, setSharedChallenges] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  
  const { 
    isFollowing, 
    followersCount, 
    followingCount, 
    toggleFollow, 
    loading: followLoading 
  } = useFollow(userId || "");

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchSharedChallenges();
      fetchPosts();
      fetchAchievements();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: t('common.error'),
        description: t('userProfile.toasts.loadFailed'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("equation_challenges")
        .select("*")
        .eq("created_by", userId)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setSharedChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          unlocked_at,
          achievements (
            id,
            name,
            description,
            icon,
            points
          )
        `)
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

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
          <h1 className="text-2xl font-bold">{t('userProfile.notFound')}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-4xl">
                {profile.display_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profile.display_name}</h1>
                    <UserMasterySword 
                      masterTitle={profile.master_title} 
                      currentFloor={profile.current_floor}
                      size="md"
                      isOwner={profile.id === 'a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b'}
                    />
                  </div>
                  {profile.bio && (
                    <p className="text-muted-foreground mb-3">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                    )}
                    {profile.website && (
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Globe className="w-4 h-4" />
                        {profile.website}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {t('userProfile.joined', { date: format(new Date(profile.created_at), "MMMM yyyy") })}
                    </span>
                  </div>
                </div>
                
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
                        {t('userProfile.unfollow')}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {t('userProfile.follow')}
                      </>
                    )}
                  </Button>
                )}
                
                {isOwnProfile && (
                  <Button asChild variant="outline">
                    <Link to="/profile">{t('userProfile.editProfile')}</Link>
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{followersCount}</div>
                  <div className="text-sm text-muted-foreground">{t('userProfile.stats.followers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{followingCount}</div>
                  <div className="text-sm text-muted-foreground">{t('userProfile.stats.following')}</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold">{profile.points}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{t('userProfile.stats.points')}</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold">{profile.daily_study_streak}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{t('userProfile.stats.dayStreak')}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">{t('userProfile.tabs.challenges')}</TabsTrigger>
            <TabsTrigger value="posts">{t('userProfile.tabs.posts')}</TabsTrigger>
            <TabsTrigger value="achievements">{t('userProfile.tabs.achievements')}</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            {sharedChallenges.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{t('userProfile.noChallenges')}</p>
              </Card>
            ) : (
              sharedChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.explanation}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{challenge.difficulty}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {t('userProfile.solves', { count: challenge.solve_count })}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/equations?code=${challenge.share_code}`}>
                        {t('userProfile.tryChallenge')}
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{t('userProfile.noPosts')}</p>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </span>
                    {post.category && <Badge variant="secondary">{post.category}</Badge>}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6 mb-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{t('userProfile.masteryProgress')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.master_title ? `${profile.master_title.charAt(0).toUpperCase() + profile.master_title.slice(1)} Master` : 'Apprentice'} - Floor {profile.current_floor}
                  </p>
                </div>
                <UserMasterySword 
                  masterTitle={profile.master_title} 
                  currentFloor={profile.current_floor}
                  size="lg"
                  isOwner={profile.id === 'a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b'}
                />
              </div>
            </Card>

            {achievements.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{t('userProfile.noAchievements')}</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement: any) => (
                  <Card key={achievement.achievements.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{achievement.achievements.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {achievement.achievements.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.achievements.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {achievement.achievements.points} pts
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(achievement.unlocked_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
