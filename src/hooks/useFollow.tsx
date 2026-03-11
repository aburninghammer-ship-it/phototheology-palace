import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useFollow = (targetUserId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Always fetch public follow counts when we have a target user
  useEffect(() => {
    if (targetUserId) {
      fetchCounts();
    }
  }, [targetUserId]);

  // Only check follow status for authenticated users
  useEffect(() => {
    if (user && targetUserId) {
      checkFollowStatus();
    } else {
      setLoading(false);
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user || user.id === targetUserId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .maybeSingle();

      if (error) throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        supabase
          .from("user_follows")
          .select("id", { count: "exact", head: true })
          .eq("following_id", targetUserId),
        supabase
          .from("user_follows")
          .select("id", { count: "exact", head: true })
          .eq("follower_id", targetUserId),
      ]);

      setFollowersCount(followersRes.count || 0);
      setFollowingCount(followingRes.count || 0);
    } catch (error) {
      console.error("Error fetching follow counts:", error);
    }
  };

  const toggleFollow = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to follow users",
        variant: "destructive",
      });
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Can't follow yourself",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user",
        });
      } else {
        const { error } = await supabase
          .from("user_follows")
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });

        if (error) throw error;

        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  return {
    isFollowing,
    loading,
    followersCount,
    followingCount,
    toggleFollow,
  };
};
