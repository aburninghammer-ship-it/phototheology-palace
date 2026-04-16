import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, PartyPopper, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Winner {
  id: string;
  rank: number;
  jeeves_commentary?: string;
  standout_insight?: string | null;
  xp_awarded: number;
  badge_awarded?: string | null;
  user_id: string;
  challenge_id: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  } | null;
  weekly_study_challenges?: {
    title: string;
    week_number: number;
  };
}

export function WinnerBanner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [winner, setWinner] = useState<Winner | null>(null);
  const [isUserWinner, setIsUserWinner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestWinner();
  }, [user]);

  useEffect(() => {
    // Fire confetti if user is the winner
    if (isUserWinner && !dismissed) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#f59e0b", "#d97706"],
        });
      }, 500);
    }
  }, [isUserWinner, dismissed]);

  const loadLatestWinner = async () => {
    try {
      // Get most recent judged challenge
      // @ts-ignore - Table exists but types not synced
      const { data: challengeData } = await supabase
        .from("weekly_study_challenges")
        .select("id, title, week_number")
        .eq("status", "judged")
        .order("ends_at", { ascending: false })
        .limit(1)
        .single();

      if (!challengeData) {
        setLoading(false);
        return;
      }

      // Check if banner was dismissed for this week
      const dismissKey = `winner_banner_dismissed_${challengeData.id}`;
      if (localStorage.getItem(dismissKey)) {
        setDismissed(true);
        setLoading(false);
        return;
      }

      // Get 1st place winner
      // @ts-ignore - Table exists but types not synced
      const { data: winnerData } = await supabase
        .from("weekly_study_winners")
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq("challenge_id", challengeData.id)
        .eq("rank", 1)
        .single();

      if (winnerData) {
        setWinner({
          ...winnerData,
          weekly_study_challenges: challengeData,
        } as unknown as Winner);
        setIsUserWinner(user?.id === winnerData.user_id);
      }
    } catch (err) {
      // No winner yet
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (winner?.challenge_id) {
      localStorage.setItem(`winner_banner_dismissed_${winner.challenge_id}`, "true");
    }
    setDismissed(true);
  };

  if (loading || dismissed || !winner) {
    return null;
  }

  // Special banner if user is the winner
  if (isUserWinner) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="relative overflow-hidden border-amber-500 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/20">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <PartyPopper className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-bounce" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    You Won This Week's Challenge!
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Congratulations on your insightful study of{" "}
                    <span className="font-medium">
                      {winner.weekly_study_challenges?.title}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                      +{winner.xp_awarded} XP
                    </Badge>
                    {winner.badge_awarded && (
                      <Badge variant="outline" className="border-amber-500/50">
                        {winner.badge_awarded}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/weekly-challenge")}
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                >
                  View Details
                </Button>
              </div>
              {winner.jeeves_commentary && (
                <div className="mt-4 p-3 rounded-lg bg-background/50">
                  <p className="text-xs font-medium flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Jeeves says:
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    "{winner.jeeves_commentary}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Regular winner announcement
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <Card className="relative border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {winner.profiles?.display_name || "A user"}
                  </span>{" "}
                  won this week's study challenge!
                </p>
                {winner.standout_insight && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                    "{winner.standout_insight}"
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/weekly-challenge")}
              >
                See Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
