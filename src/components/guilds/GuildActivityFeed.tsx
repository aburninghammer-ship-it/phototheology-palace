import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, UserPlus, Target, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GuildActivityFeedProps {
  guildId: string;
}

export const GuildActivityFeed = ({ guildId }: GuildActivityFeedProps) => {
  const { data: activities } = useQuery({
    queryKey: ["guild-activities", guildId],
    queryFn: async () => {
      const { data: activitiesData, error } = await supabase
        .from("guild_activities")
        .select("*")
        .eq("guild_id", guildId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Fetch profiles separately
      const userIds = activitiesData?.map(a => a.user_id).filter(Boolean) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return activitiesData?.map(a => ({
        ...a,
        profile: a.user_id ? profileMap.get(a.user_id) : null,
      })) || [];
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member_joined":
        return <UserPlus className="w-4 h-4" />;
      case "challenge_completed":
        return <Target className="w-4 h-4" />;
      case "level_up":
        return <TrendingUp className="w-4 h-4" />;
      case "challenge_created":
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    const name = activity.profile?.display_name || "Someone";
    switch (activity.activity_type) {
      case "member_joined":
        return `${name} joined the guild`;
      case "challenge_completed":
        return `${name} completed "${activity.activity_data.challenge_title}" (+${activity.activity_data.xp_earned} XP)`;
      case "level_up":
        return `${name} reached level ${activity.activity_data.new_level}`;
      case "challenge_created":
        return `${name} created challenge "${activity.activity_data.challenge_title}"`;
      default:
        return `${name} performed an action`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>What's happening in your guild</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
              {activities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {activity.profile?.display_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.activity_type)}
                    <p className="text-sm">{getActivityText(activity)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {activities?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No activity yet. Be the first to make a move!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
