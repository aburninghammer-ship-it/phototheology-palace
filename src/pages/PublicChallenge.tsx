import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Trophy, Users, ArrowRight, Loader2, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChallengeData {
  id: string;
  verse: string;
  equation: string;
  symbols: string[];
  difficulty: string;
  explanation: string;
  solve_count: number;
  created_at: string;
  created_by: string;
}

interface ResponseData {
  id: string;
  response_text: string;
  grade_score: number | null;
  created_at: string;
  user_id: string | null;
  guest_name: string | null;
}

const PublicChallenge = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [creatorName, setCreatorName] = useState("A Student");
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (shareCode) loadChallenge();
  }, [shareCode]);

  const loadChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from("equation_challenges")
        .select("*")
        .eq("share_code", shareCode)
        .eq("is_public", true)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setChallenge(data);

      // Load creator name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", data.created_by)
        .single();
      if (profile) setCreatorName(profile.display_name || profile.username || "A Student");

      // Load responses
      const { data: resps } = await supabase
        .from("public_challenge_responses")
        .select("*")
        .eq("challenge_id", data.id)
        .order("grade_score", { ascending: false, nullsFirst: false });

      if (resps) {
        setResponses(resps);
        // Load profile names for responders
        const userIds = resps.filter(r => r.user_id).map(r => r.user_id!);
        if (userIds.length > 0) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("id, display_name, username")
            .in("id", userIds);
          if (profs) {
            const map: Record<string, string> = {};
            profs.forEach(p => { map[p.id] = p.display_name || p.username || "Student"; });
            setProfiles(map);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Sign in to submit your response!");
      return;
    }
    if (!solution.trim() || !challenge) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("public_challenge_responses").insert({
        challenge_id: challenge.id,
        user_id: user.id,
        response_text: solution.trim(),
      });
      if (error) throw error;

      // Increment solve count
      await supabase
        .from("equation_challenges")
        .update({ solve_count: (challenge.solve_count || 0) + 1 })
        .eq("id", challenge.id);

      setSubmitted(true);
      toast.success("Response submitted!");
      loadChallenge(); // refresh responses
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <Calculator className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold">Challenge Not Found</h2>
            <p className="text-muted-foreground">This challenge may have been removed or the link is incorrect.</p>
            <Link to="/">
              <Button className="mt-4">Explore Phototheology Palace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!challenge) return null;

  const leaderboard = responses.filter(r => r.grade_score != null).sort((a, b) => (b.grade_score || 0) - (a.grade_score || 0));

  const ogTitle = `🧮 Can You Decode This? — ${challenge.verse} | Phototheology`;
  const ogDescription = `Equation: ${challenge.equation} • Difficulty: ${challenge.difficulty} • ${challenge.solve_count || 0} attempts so far. Try this Phototheology Equation Challenge!`;
  const ogUrl = `https://phototheology-palace.lovable.app/challenge/${shareCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://phototheologybible.com/phototheology-hero-og.png" />
        <meta property="og:site_name" content="PhototheologyOS" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content="https://phototheologybible.com/phototheology-hero-og.png" />
      </Helmet>
      {/* Hero */}
      <div className="bg-primary/5 border-b py-6 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <Badge variant="secondary" className="mb-2">Phototheology Equation Challenge</Badge>
          <h1 className="text-2xl md:text-3xl font-bold">Can You Decode This?</h1>
          <p className="text-muted-foreground">
            Shared by <span className="font-semibold">{creatorName}</span> • {challenge.solve_count || 0} attempts
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6 pb-20">
        {/* Challenge Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                {challenge.verse}
              </CardTitle>
              <Badge>{challenge.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-lg font-mono font-bold block text-center">
                {challenge.equation}
              </code>
            </div>
            {challenge.symbols.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {challenge.symbols.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs: Respond / Leaderboard */}
        <Tabs defaultValue="respond">
          <TabsList className="w-full">
            <TabsTrigger value="respond" className="flex-1 gap-1">
              <Send className="h-4 w-4" /> Respond
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex-1 gap-1">
              <Trophy className="h-4 w-4" /> Leaderboard
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex-1 gap-1">
              <Users className="h-4 w-4" /> Feed ({responses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="respond">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {user ? (
                  submitted ? (
                    <div className="text-center py-6 space-y-3">
                      <Sparkles className="h-10 w-10 mx-auto text-primary" />
                      <h3 className="text-lg font-semibold">Response Submitted!</h3>
                      <p className="text-muted-foreground">Check the leaderboard to see how you ranked.</p>
                    </div>
                  ) : (
                    <>
                      <Textarea
                        placeholder="Decode the equation — explain what each symbol means and how they reveal Christ in this passage..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        rows={6}
                      />
                      <Button onClick={handleSubmit} disabled={submitting || !solution.trim()} className="w-full gap-2">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Submit Response
                      </Button>
                    </>
                  )
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <h3 className="text-lg font-semibold">Want to try this challenge?</h3>
                    <p className="text-muted-foreground">
                      Sign up for free to submit your response and see how you rank!
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Link to="/auth">
                        <Button className="gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Sign Up Free
                        </Button>
                      </Link>
                      <Link to="/">
                        <Button variant="outline">Explore PhototheologyOS</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Responses
                </CardTitle>
                <CardDescription>Ranked by Jeeves' grade</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No graded responses yet. Be the first!</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((r, i) => (
                      <div key={r.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <span className={`text-lg font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-muted-foreground"}`}>
                          #{i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {r.user_id ? (profiles[r.user_id] || "Student") : (r.guest_name || "Guest")}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{r.response_text.slice(0, 80)}...</p>
                        </div>
                        <Badge variant="secondary" className="text-lg font-bold">{r.grade_score}/100</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <div className="space-y-3">
              {responses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No responses yet. Be the first to decode this equation!
                  </CardContent>
                </Card>
              ) : (
                responses.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {r.user_id ? (profiles[r.user_id] || "Student") : (r.guest_name || "Guest")}
                        </p>
                        {r.grade_score != null && (
                          <Badge variant="secondary">{r.grade_score}/100</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.response_text}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Banner */}
        {!user && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-3">
              <h3 className="text-lg font-bold">Discover Phototheology Palace</h3>
              <p className="text-sm text-muted-foreground">
                Explore 43+ Bible study tools, daily challenges, AI-powered insights, and a thriving community.
              </p>
              <Link to="/">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Explore PhototheologyOS
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicChallenge;
