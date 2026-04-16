import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SpotlightUser {
  display_name: string | null;
  username: string;
  avatar_url: string | null;
  master_title: string | null;
  current_floor: number | null;
  like_count: number;
}

export const WeeklySpotlight = () => {
  const [spotlight, setSpotlight] = useState<SpotlightUser | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get likes from last 7 days grouped by post author
        const { data: likes, error } = await supabase
          .from("community_post_likes")
          .select(`
            post_id,
            community_posts!inner(user_id)
          `)
          .gte("created_at", sevenDaysAgo.toISOString());

        if (error || !likes || likes.length === 0) return;

        // Count likes per user
        const userLikes: Record<string, number> = {};
        likes.forEach((like: any) => {
          const userId = like.community_posts?.user_id;
          if (userId) {
            userLikes[userId] = (userLikes[userId] || 0) + 1;
          }
        });

        // Find top user
        const topUserId = Object.entries(userLikes).sort(
          ([, a], [, b]) => b - a
        )[0];

        if (!topUserId || topUserId[1] < 2) return; // Need at least 2 likes

        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, username, avatar_url, master_title, current_floor")
          .eq("id", topUserId[0])
          .single();

        if (profile) {
          setSpotlight({
            ...profile,
            like_count: topUserId[1],
          });
        }
      } catch {
        // Silently fail
      }
    };

    fetchSpotlight();
  }, []);

  if (!spotlight) return null;

  const name = spotlight.display_name || spotlight.username;

  return (
    <Card className="bg-gradient-to-r from-amber-500/10 via-card/60 to-primary/10 backdrop-blur-sm border-amber-500/30">
      <CardContent className="py-3 flex items-center gap-3">
        <Star className="h-5 w-5 text-amber-500 shrink-0 fill-amber-500" />
        <Avatar className="h-8 w-8 border-2 border-amber-500/40">
          <AvatarImage src={spotlight.avatar_url || undefined} />
          <AvatarFallback className="text-xs bg-amber-500/10">
            {name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-sm truncate">{name}</span>
          {spotlight.master_title && (
            <UserMasterySword
              masterTitle={spotlight.master_title}
              currentFloor={spotlight.current_floor || 1}
              size="sm"
            />
          )}
          <span className="text-xs text-muted-foreground">
            Top contributor this week
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
