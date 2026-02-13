import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  isCurrentUser?: boolean;
}

export function FollowButton({ targetUserId, isCurrentUser }: FollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!user) {
      toast({ title: "Not authenticated", description: "Please log in to follow users", variant: "destructive" });
      return;
    }
    if (user.id === targetUserId) return;

    setLoading(true);
    try {
      if (isFollowing === null) {
        const { data } = await supabase
          .from("user_follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId)
          .maybeSingle();

        if (data) {
          await supabase.from("user_follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId);
          setIsFollowing(false);
          toast({ title: "Unfollowed" });
        } else {
          await supabase.from("user_follows").insert({ follower_id: user.id, following_id: targetUserId });
          setIsFollowing(true);
          toast({ title: "Following", description: "You are now following this user" });
        }
      } else if (isFollowing) {
        await supabase.from("user_follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId);
        setIsFollowing(false);
        toast({ title: "Unfollowed" });
      } else {
        await supabase.from("user_follows").insert({ follower_id: user.id, following_id: targetUserId });
        setIsFollowing(true);
        toast({ title: "Following", description: "You are now following this user" });
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast({ title: "Error", description: error.message || "Failed to update follow status", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, isFollowing, toast]);

  if (isCurrentUser) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : "ghost"}
      size="sm"
      className="text-xs"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-3 w-3 mr-1" />
      ) : (
        <UserPlus className="h-3 w-3 mr-1" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
