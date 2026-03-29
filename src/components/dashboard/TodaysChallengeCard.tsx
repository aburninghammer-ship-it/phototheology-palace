import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Church,
  Link2,
  Eye,
  Apple,
  Layers,
  BookOpen,
  BrainCircuit,
  FlaskConical,
} from "lucide-react";

const SUBTYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; verb: string }> = {
  "dimension-drill": {
    icon: <Layers className="h-5 w-5" />,
    color: "from-blue-600 to-indigo-600",
    verb: "Stretch this text across 5 dimensions",
  },
  "connect-6": {
    icon: <Link2 className="h-5 w-5" />,
    color: "from-emerald-600 to-teal-600",
    verb: "Connect this verse across 6 genres",
  },
  "sanctuary-map": {
    icon: <Church className="h-5 w-5" />,
    color: "from-amber-600 to-orange-600",
    verb: "Map this passage to the Sanctuary",
  },
  "christ-chapter": {
    icon: <Eye className="h-5 w-5" />,
    color: "from-rose-600 to-pink-600",
    verb: "Find Christ in this chapter",
  },
  "fruit-check": {
    icon: <Apple className="h-5 w-5" />,
    color: "from-green-600 to-lime-600",
    verb: "Test this teaching by its fruit",
  },
  "subject-connection": {
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "from-purple-600 to-violet-600",
    verb: "Connect this subject across Scripture",
  },
  "chef-recipe": {
    icon: <FlaskConical className="h-5 w-5" />,
    color: "from-cyan-600 to-blue-600",
    verb: "Cook a Bible study from this recipe",
  },
  "equation-decode": {
    icon: <BookOpen className="h-5 w-5" />,
    color: "from-orange-600 to-red-600",
    verb: "Decode this Phototheology equation",
  },
  "70-questions": {
    icon: <BrainCircuit className="h-5 w-5" />,
    color: "from-indigo-600 to-purple-600",
    verb: "Fire 70 questions at this passage",
  },
  "principle-study": {
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-amber-600 to-yellow-600",
    verb: "Apply this Palace principle deeply",
  },
};

const DEFAULT_CONFIG = {
  icon: <Flame className="h-5 w-5" />,
  color: "from-orange-600 to-red-600",
  verb: "Complete today's study challenge",
};

export function TodaysChallengeCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchToday();
  }, [user]);

  const fetchToday = async () => {
    try {
      const now = new Date();
      const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
      );
      const rotationDay = (dayOfYear % 30) + 1;

      let { data } = await supabase
        .from("challenges")
        .select("*")
        .eq("day_in_rotation", rotationDay)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!data || data.length === 0) {
        const { data: fallback } = await supabase
          .from("challenges")
          .select("*")
          .eq("challenge_type", "daily")
          .order("created_at", { ascending: false })
          .limit(1);
        data = fallback;
      }

      const todayChallenge = data?.[0] || null;
      setChallenge(todayChallenge);

      if (todayChallenge && user) {
        const { data: sub } = await supabase
          .from("challenge_submissions")
          .select("id")
          .eq("challenge_id", todayChallenge.id)
          .eq("user_id", user.id)
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
          .maybeSingle();
        setHasSubmitted(!!sub);
      }
    } catch (err) {
      console.error("[TodaysChallenge]", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-8">
          <div className="h-8 w-48 bg-muted rounded mb-3" />
          <div className="h-5 w-full bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!challenge) return null;

  const config = SUBTYPE_CONFIG[challenge.challenge_subtype] || DEFAULT_CONFIG;
  const verseText =
    challenge.verses?.[0] ||
    challenge.ui_config?.verse_text ||
    "";

  return (
    <Card className={`relative overflow-hidden border-2 ${hasSubmitted ? 'border-green-500/40' : 'border-orange-500/40'}`}>
      {/* Decorative gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.color}`} />

      <CardContent className="pt-6 pb-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
              {config.icon}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Today's Challenge
              </p>
              <h2 className="text-xl md:text-2xl font-bold leading-tight">
                {challenge.title}
              </h2>
            </div>
          </div>
          {hasSubmitted && (
            <Badge className="bg-green-500/15 text-green-600 border-green-500/30 gap-1 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Done
            </Badge>
          )}
        </div>

        {/* Challenge prompt — the key instruction */}
        <div className="bg-gradient-to-r from-muted/80 to-muted/40 rounded-xl p-4 border border-border/50">
          <p className="text-base md:text-lg font-semibold text-foreground leading-snug">
            {config.verb}
          </p>
          {verseText && (
            <p className="mt-2 text-sm italic text-muted-foreground line-clamp-3">
              "{verseText}"
            </p>
          )}
          {challenge.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {challenge.description}
            </p>
          )}
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          {challenge.challenge_tier && (
            <Badge variant="outline" className="text-xs">
              {challenge.challenge_tier}
            </Badge>
          )}
          {challenge.principle_used && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              {challenge.principle_used}
            </Badge>
          )}
          {challenge.room_codes?.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {challenge.room_codes.join(", ")}
            </Badge>
          )}
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/daily-challenges")}
          className={`w-full text-base font-semibold h-12 ${
            hasSubmitted
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : `bg-gradient-to-r ${config.color} hover:opacity-90 text-white`
          }`}
        >
          {hasSubmitted ? (
            <>
              View Your Submission
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              <Flame className="mr-2 h-5 w-5" />
              Accept Challenge
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
