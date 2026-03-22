import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ChefHat, Calculator, Flame, Star, User, Loader2 } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  challenge_type: string;
  title: string;
  description: string | null;
  content: string | null;
  difficulty: string | null;
  jeeves_score: number;
  jeeves_feedback: string | null;
  jeeves_highlights: string[] | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface CommunityChallengeFeedProps {
  compact?: boolean;
}

export const CommunityChallengeFeed = ({ compact = false }: CommunityChallengeFeedProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    fetchEntries();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("challenge-leaderboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "challenge_leaderboard" }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeType]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("challenge_leaderboard")
        .select("*")
        .order("jeeves_score", { ascending: false })
        .limit(compact ? 10 : 50);

      if (activeType !== "all") {
        query = query.eq("challenge_type", activeType);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles for the user IDs
      const userIds = [...new Set((data || []).map(e => e.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", userIds)
        : { data: [] };

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      setEntries((data || []).map(e => ({
        ...e,
        profiles: profileMap.get(e.user_id) || undefined,
      })) as LeaderboardEntry[]);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "chef": return <ChefHat className="h-4 w-4" />;
      case "equation": return <Calculator className="h-4 w-4" />;
      default: return <Flame className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chef": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "equation": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-blue-500";
    return "text-muted-foreground";
  };

  const renderEntry = (entry: LeaderboardEntry, index: number) => {
    const name = entry.profiles?.display_name || entry.profiles?.username || "Anonymous";
    
    return (
      <Card key={entry.id} className={`transition-all hover:shadow-md ${index < 3 ? "border-primary/30" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Rank */}
            <div className="text-2xl font-bold min-w-[40px] text-center">
              {getMedalEmoji(index)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-sm truncate">{name}</span>
                <Badge variant="outline" className={`text-xs ${getTypeColor(entry.challenge_type)}`}>
                  {getTypeIcon(entry.challenge_type)}
                  <span className="ml-1 capitalize">{entry.challenge_type}</span>
                </Badge>
              </div>
              
              <p className="text-sm font-medium mb-1">{entry.title}</p>
              
              {!compact && entry.content && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{entry.content.slice(0, 200)}</p>
              )}

              {!compact && entry.jeeves_highlights && entry.jeeves_highlights.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {entry.jeeves_highlights.slice(0, 3).map((h, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      ✓ {h.length > 40 ? h.slice(0, 40) + "…" : h}
                    </Badge>
                  ))}
                </div>
              )}

              {!compact && entry.jeeves_feedback && (
                <p className="text-xs italic text-muted-foreground">"{entry.jeeves_feedback}"</p>
              )}
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className={`text-2xl font-bold ${getScoreColor(entry.jeeves_score)}`}>
                {entry.jeeves_score}
              </div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-bold">Community Leaderboard</h3>
      </div>

      <Tabs value={activeType} onValueChange={setActiveType}>
        <TabsList className={compact ? "grid grid-cols-4 w-full" : "grid grid-cols-4 w-full max-w-md"}>
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="chef" className="text-xs gap-1">
            <ChefHat className="h-3 w-3" /> Chef
          </TabsTrigger>
          <TabsTrigger value="equation" className="text-xs gap-1">
            <Calculator className="h-3 w-3" /> Equation
          </TabsTrigger>
          <TabsTrigger value="daily" className="text-xs gap-1">
            <Flame className="h-3 w-3" /> Daily
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeType} className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground font-medium">No submissions yet!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete a challenge and share it to be the first on the leaderboard.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => renderEntry(entry, index))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
