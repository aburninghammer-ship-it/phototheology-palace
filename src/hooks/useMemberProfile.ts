import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMemberProfile(userId: string, churchId: string) {
  const [profile, setProfile] = useState<any>(null);
  const [memberInfo, setMemberInfo] = useState<{ role: string; joined_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !churchId) { setLoading(false); return; }

    const load = async () => {
      try {
        const [profileRes, memberRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, username, display_name, avatar_url, cover_photo_url, bio, location, website, ministry_tags, interests, social_links, is_profile_public, points, level, daily_study_streak, master_title, current_floor, created_at")
            .eq("id", userId)
            .single(),
          supabase
            .from("church_members")
            .select("role, joined_at")
            .eq("user_id", userId)
            .eq("church_id", churchId)
            .single(),
        ]);

        setProfile(profileRes.data);
        setMemberInfo(memberRes.data as any);
      } catch (err) {
        console.error("Error loading member profile:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, churchId]);

  return { profile, memberInfo, loading };
}
