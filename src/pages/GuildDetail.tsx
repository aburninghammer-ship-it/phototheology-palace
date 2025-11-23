import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Trophy, TrendingUp, Target, Crown, Shield } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useGuildChallenges } from "@/hooks/useGuildChallenges";
import { CreateChallengeDialog } from "@/components/guilds/CreateChallengeDialog";
import { GuildChallengeCard } from "@/components/guilds/GuildChallengeCard";
import { GuildLeaderboard } from "@/components/guilds/GuildLeaderboard";
import { GuildActivityFeed } from "@/components/guilds/GuildActivityFeed";

const GuildDetail = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();

  const { data: guild, isLoading: guildLoading } = useQuery({
    queryKey: ["guild", guildId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guilds")
        .select("*, guild_members(count)")
        .eq("id", guildId!)
        .single();

      if (error) throw error;
      return {
        ...data,
        member_count: data.guild_members[0]?.count || 0,
      };
    },
    enabled: !!guildId,
  });

  const { 
    challenges, 
    isLoading: challengesLoading,
    createChallenge, 
    completeChallenge,
    isCreating,
    isCompleting 
  } = useGuildChallenges(guildId);

  const { data: members } = useQuery({
    queryKey: ["guild-members", guildId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guild_members")
        .select("*")
        .eq("guild_id", guildId!)
        .order("contribution_xp", { ascending: false });

      if (error) throw error;

      // Fetch profile data separately
      const userIds = data.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map(member => ({
        ...member,
        profile: profileMap.get(member.user_id),
      }));
    },
    enabled: !!guildId,
  });

  // Get current user's role
  const { data: userMembership } = useQuery({
    queryKey: ["user-guild-membership", guildId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("guild_members")
        .select("role")
        .eq("guild_id", guildId!)
        .eq("user_id", user.id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!guildId,
  });

  const userRole = userMembership?.role;

  if (guildLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!guild) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return '🏰';
      case 'order': return '⚔️';
      case 'squad': return '🛡️';
      default: return '👥';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/guilds")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Guilds
      </Button>

      {/* Guild Header */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getTypeIcon(guild.guild_type)}</span>
              <div>
                <CardTitle className="text-3xl">{guild.name}</CardTitle>
                <Badge variant="outline" className="mt-2">
                  {guild.guild_type.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          {guild.description && (
            <CardDescription className="text-base mt-4">{guild.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{guild.member_count}/{guild.max_members}</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{guild.total_xp.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{guild.current_streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{challenges?.filter(c => c.is_completed).length || 0}</div>
                <div className="text-xs text-muted-foreground">Challenges Done</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Members Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guild Members ({guild.member_count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members?.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar>
                      <AvatarImage src={member.profile?.avatar_url || ""} />
                      <AvatarFallback>
                        {member.profile?.display_name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{member.profile?.display_name || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {member.role === "leader" && (
                          <>
                            <Crown className="w-3 h-3" />
                            Leader
                          </>
                        )}
                        {member.role === "officer" && (
                          <>
                            <Shield className="w-3 h-3" />
                            Officer
                          </>
                        )}
                        {member.role === "member" && "Member"}
                      </div>
                    </div>
                    <Badge variant="outline">
                      <Trophy className="w-3 h-3 mr-1" />
                      {member.contribution_xp}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Guild Challenges</h3>
              <p className="text-sm text-muted-foreground">Work together to complete challenges and earn XP</p>
            </div>
            {userRole === "leader" || userRole === "officer" ? (
              <CreateChallengeDialog
                guildId={guildId!}
                onCreate={createChallenge}
                isCreating={isCreating}
              />
            ) : null}
          </div>

          {challengesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : challenges && challenges.length > 0 ? (
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <GuildChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onComplete={completeChallenge}
                  isCompleting={isCompleting}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No challenges yet. Leaders can create one to get started!
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <GuildLeaderboard guildId={guildId!} />
        </TabsContent>

        <TabsContent value="activity">
          <GuildActivityFeed guildId={guildId!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuildDetail;
