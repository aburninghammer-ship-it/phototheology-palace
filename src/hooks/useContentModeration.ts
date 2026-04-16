import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModerationResult {
  safe: boolean;
  reason: string;
}

export function useContentModeration() {
  const [moderating, setModerating] = useState(false);

  const moderateContent = async (
    content: string,
    type: "text" | "image" = "text"
  ): Promise<boolean> => {
    if (!content.trim()) return true;

    setModerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("moderate-content", {
        body: { content, type },
      });

      if (error) {
        console.error("Moderation error:", error);
        // Allow on error to avoid blocking legitimate content
        return true;
      }

      const result = data as ModerationResult;

      if (!result.safe) {
        toast.error(
          result.reason || "This content doesn't appear to be related to Bible study or Phototheology. Please keep posts focused on Scripture, theology, and spiritual growth."
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error("Moderation check failed:", err);
      return true;
    } finally {
      setModerating(false);
    }
  };

  return { moderateContent, moderating };
}
