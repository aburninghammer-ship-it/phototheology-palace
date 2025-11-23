import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GuildLeaderboardProps {
  guildId: string;
}

export const GuildLeaderboard = ({ guildId }: GuildLeaderboardProps) => {
  const { data: memberLeaderboard } = useQuery({
    queryKey: ["guild-leaderboard", guildId],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from("guild_members")
        .select("user_id, contribution_xp")
        .eq("guild_id", guildId)
        .order("contribution_xp", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch profiles separately
      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return members?.map(m => ({
        contribution_xp: m.contribution_xp,
        profile: profileMap.get(m.user_id),
      })) || [];
    },
  });

  const { data: guildRankings } = useQuery({
    queryKey: ["guilds-rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guilds")
        .select("id, name, guild_type, total_xp, current_streak, guild_members(count)")
        .eq("is_active", true)
        .order("total_xp", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboards
        </CardTitle>
        <CardDescription>Top contributors and guild rankings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Guild Members</TabsTrigger>
            <TabsTrigger value="guilds">All Guilds</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-3 mt-4">
            {memberLeaderboard?.map((member, index) => (
              <div
                key={member.profile?.id || index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <span className="text-2xl w-8 text-center">{getRankIcon(index)}</span>
                <Avatar>
                  <AvatarImage src={member.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{member.profile?.display_name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.contribution_xp.toLocaleString()} XP
                  </div>
                </div>
                <Badge variant="outline">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {member.contribution_xp}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="guilds" className="space-y-3 mt-4">
            {guildRankings?.map((guild, index) => (
              <div
                key={guild.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  guild.id === guildId ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                }`}
              >
                <span className="text-2xl w-8 text-center">{getRankIcon(index)}</span>
                <div className="flex-1">
                  <div className="font-medium">{guild.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {guild.guild_members[0]?.count || 0} members · {guild.current_streak} day streak
                  </div>
                </div>
                <Badge variant="outline">
                  <Trophy className="w-3 h-3 mr-1" />
                  {guild.total_xp.toLocaleString()}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
