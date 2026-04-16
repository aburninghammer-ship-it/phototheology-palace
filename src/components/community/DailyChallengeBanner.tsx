import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Challenge {
  id: string;
  theme: string;
  anchor_passage: string;
}

export const DailyChallengeBanner = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from("weekly_study_challenges")
          .select("id, theme, anchor_passage")
          .lte("start_date", now)
          .gte("end_date", now)
          .order("start_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) return;
        setChallenge(data);

        const { count } = await supabase
          .from("weekly_study_submissions")
          .select("id", { count: "exact", head: true })
          .eq("challenge_id", data.id);

        setResponseCount(count || 0);
      } catch {
        // Silently fail — banner just won't show
      }
    };

    fetchChallenge();
  }, []);

  if (!challenge) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-amber-500/10 via-primary/10 to-purple-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-foreground">
              This Week's Fire
            </p>
            <p className="text-sm text-foreground/80 mt-0.5">
              {challenge.theme}
              {challenge.anchor_passage && (
                <span className="text-muted-foreground"> — {challenge.anchor_passage}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {responseCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {responseCount} {responseCount === 1 ? "response" : "responses"} so far
            </Badge>
          )}
          <Button
            size="sm"
            onClick={() => navigate("/weekly-challenge")}
            className="bg-gradient-to-r from-amber-500 to-primary text-white shadow-md hover:shadow-lg transition-shadow"
          >
            Respond Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
