import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  Users,
  ChevronRight,
  BookOpen,
  Send,
  Check,
  Sparkles,
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  theme: string;
  anchor_passage: string;
  difficulty: string;
  status: string;
  ends_at: string;
}

export function WeeklyChallengeWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    loadChallenge();
  }, []);

  useEffect(() => {
    if (challenge && user) {
      checkUserSubmission();
    }
  }, [challenge, user]);

  useEffect(() => {
    if (challenge?.ends_at) {
      const calculateTime = () => {
        const end = new Date(challenge.ends_at);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          });
        }
      };
      calculateTime();
      const timer = setInterval(calculateTime, 60000);
      return () => clearInterval(timer);
    }
  }, [challenge?.ends_at]);

  const loadChallenge = async () => {
    try {
      // @ts-ignore - Table exists but types not synced
      const { data } = await supabase
        .from("weekly_study_challenges")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setChallenge(data as Challenge);
        // Get submission count
        // @ts-ignore - Table exists but types not synced
        const { count } = await supabase
          .from("weekly_study_submissions")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", data.id);
        setSubmissionCount(count || 0);
      }
    } catch (err) {
      // No active challenge
    } finally {
      setLoading(false);
    }
  };

  const checkUserSubmission = async () => {
    if (!challenge || !user) return;
    try {
      // @ts-ignore - Table exists but types not synced
      const { data } = await supabase
        .from("weekly_study_submissions")
        .select("id")
        .eq("challenge_id", challenge.id)
        .eq("user_id", user.id)
        .single();
      setHasSubmitted(!!data);
    } catch (err) {
      setHasSubmitted(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 w-40 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <Trophy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Next weekly challenge coming soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Weekly Challenge</CardTitle>
              <CardDescription className="text-xs">
                Study together, compete for honors
              </CardDescription>
            </div>
          </div>
          {hasSubmitted && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              <Check className="h-3 w-3 mr-1" />
              Submitted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Challenge Info */}
        <div>
          <h3 className="font-semibold text-sm">{challenge.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <BookOpen className="h-3 w-3" />
            {challenge.anchor_passage}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{submissionCount} submissions</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {timeLeft.days}d {timeLeft.hours}h left
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Week progress</span>
            <span>{Math.min(100, Math.round((1 - (timeLeft.days * 24 + timeLeft.hours) / (5 * 24)) * 100))}%</span>
          </div>
          <Progress
            value={Math.min(100, Math.round((1 - (timeLeft.days * 24 + timeLeft.hours) / (5 * 24)) * 100))}
            className="h-1"
          />
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/weekly-challenge")}
          className={`w-full ${
            hasSubmitted
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          }`}
          size="sm"
        >
          {hasSubmitted ? (
            <>
              View Submissions
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Your Insights
            </>
          )}
        </Button>

        {/* Rewards teaser */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Win 200 XP + Weekly Scholar badge</span>
        </div>
      </CardContent>
    </Card>
  );
}
