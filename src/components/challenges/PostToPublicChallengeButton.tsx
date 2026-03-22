import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PostToPublicChallengeButtonProps {
  challengeType: "chef" | "equation" | "daily";
  title: string;
  content: string;
  difficulty?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const PostToPublicChallengeButton = ({
  challengeType,
  title,
  content,
  difficulty,
  variant = "outline",
  size = "default",
  className = "",
}: PostToPublicChallengeButtonProps) => {
  const { user } = useAuth();
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const emoji = challengeType === "chef" ? "🍳" : challengeType === "equation" ? "🧮" : "🔥";
  const typeLabel = challengeType === "chef" ? "Chef Challenge" : challengeType === "equation" ? "Equation Challenge" : "Daily Challenge";

  const handlePost = async () => {
    if (!user) {
      toast.error("Sign in to post challenges");
      return;
    }
    if (posted) return;

    setPosting(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || "A student";

      const postContent = [
        `${emoji} **${typeLabel}**${difficulty ? ` • ${difficulty}` : ""}`,
        "",
        content,
        "",
        `💬 Can you solve this? Post your answer below and get rated by Jeeves!`,
      ].join("\n");

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        title: `${emoji} ${displayName} shared a ${typeLabel}: ${title}`,
        content: postContent,
        category: "challenge",
        tags: ["public_board"],
      });

      if (error) throw error;

      // Notify all users about the new public challenge
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id")
        .neq("id", user.id);

      if (allProfiles && allProfiles.length > 0) {
        const notifications = allProfiles.map((p) => ({
          user_id: p.id,
          type: "challenge_posted",
          title: "New Public Challenge!",
          message: `${displayName} posted a ${typeLabel}: "${title}" — Can you solve it?`,
          link: "/challenge-board",
          metadata: { challenge_type: challengeType, poster_id: user.id },
        }));

        await supabase.from("notifications").insert(notifications);
      }

      setPosted(true);
      toast.success("Challenge posted to the public challenge page! Others can now attempt it.");
    } catch (err) {
      console.error("Error posting challenge:", err);
      toast.error("Failed to post challenge");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Button
      onClick={handlePost}
      disabled={posting || posted}
      variant={posted ? "default" : variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      {posting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Posting...
        </>
      ) : posted ? (
        <>
          <Check className="h-4 w-4" />
          Posted to Challenge Page!
        </>
      ) : (
        <>
          <Globe className="h-4 w-4" />
          Post to Public Challenge Page
        </>
      )}
    </Button>
  );
};
