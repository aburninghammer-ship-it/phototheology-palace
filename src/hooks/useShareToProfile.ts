import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { SharedContent } from "@/types/sharedContent";
import { SHARE_SOURCE_CONFIG } from "@/types/sharedContent";

export function useShareToProfile() {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);

  const shareToProfile = async (sharedContent: SharedContent, caption: string) => {
    if (!user) return false;
    setSharing(true);
    try {
      const config = SHARE_SOURCE_CONFIG[sharedContent.source_type];
      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        category: "profile_share",
        title: `${config.label}: ${sharedContent.source_title}`,
        content: caption || sharedContent.source_excerpt,
        tags: [sharedContent.source_type],
        shared_content: sharedContent as any,
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error sharing to profile:", err);
      return false;
    } finally {
      setSharing(false);
    }
  };

  return { shareToProfile, sharing };
}
