import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Shield, Swords, Trophy, XCircle, Star, Flame, MessageSquare, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DEFENSE_OPPONENTS } from "@/data/defenseModeOpponents";

interface ChatMessage {
  role: "opponent" | "defender";
  content: string;
}

export default function SharedDebate() {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    loadDebate();
  }, [token]);

  const loadDebate = async () => {
    const { data, error: err } = await supabase
      .from("debate_challenge_sessions")
      .select("*")
      .eq("share_token", token)
      .eq("is_public", true)
      .maybeSingle();

    if (err || !data) {
      setError("Debate not found or is no longer public.");
    } else {
      setSession(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Swords className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{error || "Debate not found."}</p>
            <Button className="mt-4" onClick={() => window.location.href = "/"}>
              Go to Phototheology
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const messages = (session.messages as ChatMessage[]) || [];
  const opponent = DEFENSE_OPPONENTS.find(o => o.id === session.opponent_id);
  const outcomeConfig: Record<string, { color: string; icon: typeof Trophy; label: string }> = {
    win: { color: "text-green-400", icon: Trophy, label: "VICTORY" },
    loss: { color: "text-red-400", icon: XCircle, label: "DEFEAT" },
    draw: { color: "text-amber-400", icon: Star, label: "DRAW" },
  };
  const oc = outcomeConfig[session.outcome || "draw"] || outcomeConfig.draw;
  const Icon = oc.icon;

  return (
    <>
      <Helmet>
        <title>{`Day ${session.day_number}: ${session.topic_name} — 40 Days of Smoke`}</title>
        <meta name="description" content={`Watch this 40 Days of Smoke debate: ${session.topic_name} vs ${session.opponent_name}. Phototheology Palace.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/10 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <Card className="border-red-500/30 bg-gradient-to-br from-red-950/20 to-background">
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-6 w-6 text-red-500" />
                <CardTitle className="text-lg bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  40 Days of Smoke
                </CardTitle>
                <Flame className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex items-center justify-center gap-3">
                {opponent?.avatar && (
                  <img src={opponent.avatar} alt={opponent.name} className="h-10 w-10 rounded-full object-cover border-2 border-red-500/40" />
                )}
                <div className="text-left">
                  <p className="text-sm font-bold">
                    Day {session.day_number} — vs {opponent?.name || session.opponent_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.topic_name}</p>
                </div>
                <Badge variant={session.outcome === "win" ? "default" : session.outcome === "loss" ? "destructive" : "secondary"}>
                  {oc.label}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Verdict */}
          {session.ai_verdict && (
            <Card className="border-blue-500/20">
              <CardContent className="p-4">
                <p className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Jeeves's Verdict
                </p>
                <p className="text-sm text-muted-foreground">{session.ai_verdict}</p>
              </CardContent>
            </Card>
          )}

          {/* Debate Transcript */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3">
                DEBATE TRANSCRIPT — {session.rounds_completed} rounds
              </p>
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "defender" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      msg.role === "defender"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {msg.role === "opponent" ? (
                          <>
                            {opponent?.avatar ? (
                              <img src={opponent.avatar} alt="" className="h-5 w-5 rounded-full object-cover border border-red-500/40" />
                            ) : (
                              <span className="text-xs">{opponent?.emoji || "👤"}</span>
                            )}
                            <span className="text-[10px] font-bold text-red-300">{opponent?.name || "Opponent"}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary">Defender</span>
                          </>
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-muted-foreground mb-2">Powered by</p>
            <a href="/" className="text-primary font-bold hover:underline">
              🏰 Phototheology Palace
            </a>
            {typeof navigator.share === "function" && (
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={() => {
                  navigator.share({
                    title: `40 Days of Smoke — Day ${session.day_number}`,
                    text: `🔥 Watch this theological debate: "${session.topic_name}"`,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
