import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Trophy, TrendingUp, Target, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const GuildDetail = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();

  const { data: guild, isLoading } = useQuery({
    queryKey: ["guild", guildId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("id", guildId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: members } = useQuery({
    queryKey: ["guild-members", guildId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guild_members")
        .select("*, user_id")
        .eq("guild_id", guildId)
        .order("contribution_xp", { ascending: false });
      if (error) throw error;
      
      // Fetch profile data separately
      const userIds = data.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, points")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(member => ({
        ...member,
        profile: profileMap.get(member.user_id)
      }));
    },
  });

  const { data: challenges } = useQuery({
    queryKey: ["guild-challenges", guildId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guild_challenges")
        .select("*")
        .eq("guild_id", guildId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
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
                <div className="text-2xl font-bold">{members?.length || 0}/{guild.max_members}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Guild Members</CardTitle>
            <CardDescription>Community of {members?.length || 0} believers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {member.profile?.display_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.profile?.display_name || 'Unknown'}</div>
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{member.contribution_xp} XP</div>
                    <div className="text-xs text-muted-foreground">contributed</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card>
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
            <CardDescription>Guild missions in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges?.filter(c => !c.is_completed).map((challenge) => (
                <div key={challenge.id} className="p-3 rounded-lg border border-border">
                  <div className="font-medium mb-2">{challenge.challenge_title}</div>
                  <Progress 
                    value={(challenge.current_completions / challenge.target_completions) * 100} 
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{challenge.current_completions}/{challenge.target_completions} completed</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(challenge.ends_at), 'MMM d')}
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {challenge.room_id}
                  </Badge>
                </div>
              ))}
              
              {challenges?.filter(c => !c.is_completed).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active challenges
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuildDetail;