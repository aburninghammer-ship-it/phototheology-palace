import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const REACTION_TYPES = [
  { type: "love", emoji: "\u2764\uFE0F", label: "Love" },
  { type: "deep", emoji: "\uD83D\uDD25", label: "Deep" },
  { type: "insight", emoji: "\uD83D\uDCA1", label: "Insight" },
  { type: "praying", emoji: "\uD83D\uDE4F", label: "Praying" },
  { type: "strong", emoji: "\u2694\uFE0F", label: "Strong" },
];

interface CommunityReactionsProps {
  postId: string;
  currentUserId?: string;
  initialCounts?: Record<string, number>;
}

export const CommunityReactions = ({
  postId,
  currentUserId,
  initialCounts = {},
}: CommunityReactionsProps) => {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUserReaction = async () => {
      const { data } = await supabase
        .from("community_post_likes")
        .select("reaction_type")
        .eq("post_id", postId)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (data) {
        setUserReaction(data.reaction_type || "love");
      }
    };
    fetchUserReaction();
  }, [postId, currentUserId]);

  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase
        .from("community_post_likes")
        .select("reaction_type")
        .eq("post_id", postId);

      if (data) {
        const grouped: Record<string, number> = {};
        data.forEach((row) => {
          const type = row.reaction_type || "love";
          grouped[type] = (grouped[type] || 0) + 1;
        });
        setCounts(grouped);
      }
    };
    fetchCounts();
  }, [postId]);

  const handleReaction = async (reactionType: string) => {
    if (!currentUserId || loading) return;
    setLoading(true);

    try {
      if (userReaction === reactionType) {
        // Remove reaction
        await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        setCounts((prev) => ({
          ...prev,
          [reactionType]: Math.max((prev[reactionType] || 1) - 1, 0),
        }));
        setUserReaction(null);
      } else if (userReaction) {
        // Change reaction type
        await supabase
          .from("community_post_likes")
          .update({ reaction_type: reactionType })
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        setCounts((prev) => ({
          ...prev,
          [userReaction]: Math.max((prev[userReaction] || 1) - 1, 0),
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
        setUserReaction(reactionType);
      } else {
        // New reaction
        await supabase.from("community_post_likes").insert({
          post_id: postId,
          user_id: currentUserId,
          reaction_type: reactionType,
        });

        setCounts((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {REACTION_TYPES.map(({ type, emoji }) => {
        const count = counts[type] || 0;
        const isActive = userReaction === type;

        if (count === 0 && !isActive) {
          // Show all reactions on hover via the parent, but only render ones with counts normally
          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={!currentUserId || loading}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs
                text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50
                transition-all duration-150 opacity-0 group-hover/reactions:opacity-100"
              title={type}
            >
              <span className="text-sm">{emoji}</span>
            </button>
          );
        }

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={!currentUserId || loading}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-all duration-150
              ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60 border border-transparent"
              }`}
            title={type}
          >
            <span className="text-sm">{emoji}</span>
            <span className="font-medium">{count}</span>
          </button>
        );
      })}
      {totalReactions === 0 && (
        <div className="flex items-center gap-1">
          {REACTION_TYPES.map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={!currentUserId || loading}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs
                text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50
                transition-all duration-150"
              title={type}
            >
              <span className="text-sm opacity-60 hover:opacity-100">{emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
