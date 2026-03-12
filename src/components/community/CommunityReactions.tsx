import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const REACTION_TYPES = [
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "deep", emoji: "🔥", label: "Deep" },
  { type: "insight", emoji: "💡", label: "Insight" },
  { type: "praying", emoji: "🙏", label: "Praying" },
  { type: "strong", emoji: "⚔️", label: "Strong" },
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
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (data) {
        setUserReaction("love");
      }
    };
    fetchUserReaction();
  }, [postId, currentUserId]);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count } = await supabase
        .from("community_post_likes")
        .select("id", { count: "exact", head: true })
        .eq("post_id", postId);

      if (count !== null) {
        setCounts({ love: count });
      }
    };
    fetchCounts();
  }, [postId]);

  const handleReaction = async (reactionType: string) => {
    if (!currentUserId || loading) return;
    setLoading(true);

    try {
      if (userReaction) {
        // Remove reaction
        await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        setCounts((prev) => ({
          ...prev,
          love: Math.max((prev.love || 1) - 1, 0),
        }));
        setUserReaction(null);
      } else {
        // New reaction
        await supabase.from("community_post_likes").insert({
          post_id: postId,
          user_id: currentUserId,
        });

        setCounts((prev) => ({
          ...prev,
          love: (prev.love || 0) + 1,
        }));
        setUserReaction(reactionType);
      }
    } catch (error) {
      console.error("Reaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {totalReactions > 0 && (
        <button
          onClick={() => handleReaction("love")}
          disabled={loading}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all ${
            userReaction
              ? "bg-primary/20 border border-primary/40 scale-105"
              : "bg-muted/50 border border-transparent hover:bg-muted"
          }`}
        >
          <span>❤️</span>
          <span className="font-medium">{totalReactions}</span>
        </button>
      )}

      {totalReactions === 0 && (
        <div className="flex items-center gap-1">
          {REACTION_TYPES.map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={loading}
              className="px-1.5 py-0.5 rounded-full text-xs bg-muted/30 hover:bg-muted/60 transition-all opacity-60 hover:opacity-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
