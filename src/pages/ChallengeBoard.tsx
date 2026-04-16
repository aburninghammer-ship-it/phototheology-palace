import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, ChefHat, Calculator, Flame, Trophy, Send, Loader2,
  Star, ChevronDown, ChevronUp, User, Clock, Trash2
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SharedChallenge {
  id: string;
  title: string;
  content: string;
  category: string | null;
  user_id: string;
  created_at: string | null;
  likes: number | null;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface ChallengeAnswer {
  id: string;
  user_id: string;
  challenge_type: string;
  title: string;
  content: string | null;
  jeeves_score: number | null;
  jeeves_feedback: string | null;
  jeeves_highlights: string[] | null;
  created_at: string;
  displayName?: string;
}

const ChallengeBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<SharedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, ChallengeAnswer[]>>({});
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [loadingAnswers, setLoadingAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchChallenges();
  }, [activeFilter]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      let query: any = supabase
        .from("community_posts")
        .select("id, title, content, category, user_id, created_at, likes, tags")
        .eq("category", "challenge")
        .contains("tags", ["public_board"])
        .order("created_at", { ascending: false })
        .limit(50);

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set((data || []).map((c: any) => c.user_id))] as string[];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", userIds)
        : { data: [] };

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

      let filtered = (data || []).map((c: any) => ({
        ...c,
        profiles: profileMap.get(c.user_id) || undefined,
      }));

      // Client-side filter by challenge type keyword
      if (activeFilter !== "all") {
        const keyword = activeFilter === "chef" ? "Chef" : activeFilter === "equation" ? "Equation" : "Daily";
        filtered = filtered.filter((c: SharedChallenge) =>
          c.title.includes(keyword) || c.content.includes(keyword)
        );
      }

      setChallenges(filtered);
    } catch (err) {
      console.error("Error fetching challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswersForChallenge = async (challengeId: string, challengeTitle: string) => {
    if (answers[challengeId]) return;
    setLoadingAnswers(prev => ({ ...prev, [challengeId]: true }));
    try {
      const { data, error } = await supabase
        .from("challenge_leaderboard")
        .select("*")
        .eq("title", challengeTitle)
        .order("jeeves_score", { ascending: false })
        .limit(20);

      if (error) throw error;

      const userIds = [...new Set((data || []).map((e: any) => e.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from("profiles").select("id, display_name, username").in("id", userIds)
        : { data: [] };

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

      setAnswers(prev => ({
        ...prev,
        [challengeId]: (data || []).map((e: any) => ({
          ...e,
          displayName: profileMap.get(e.user_id)?.display_name || profileMap.get(e.user_id)?.username || "Anonymous",
        })),
      }));
    } catch (err) {
      console.error("Error fetching answers:", err);
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [challengeId]: false }));
    }
  };

  const handleSubmitAnswer = async (challenge: SharedChallenge) => {
    const text = answerTexts[challenge.id]?.trim();
    if (!user) { toast.error("Sign in to submit"); return; }
    if (!text) { toast.error("Write your answer first"); return; }

    setSubmitting(challenge.id);
    try {
      // Detect type from title
      const type = challenge.title.includes("Chef") ? "chef"
        : challenge.title.includes("Equation") ? "equation" : "daily";

      const { data, error } = await supabase.functions.invoke("rate-challenge", {
        body: {
          challengeType: type,
          title: challenge.title,
          description: challenge.content.slice(0, 500),
          content: text,
        },
      });

      if (error) throw error;

      toast.success(`Jeeves rated your answer: ${data.score}/100! 🏆`);
      setAnswerTexts(prev => ({ ...prev, [challenge.id]: "" }));
      // Refresh answers
      setAnswers(prev => ({ ...prev, [challenge.id]: undefined as any }));
      fetchAnswersForChallenge(challenge.id, challenge.title);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit — try again");
    } finally {
      setSubmitting(null);
    }
  };

  const toggleExpand = (challenge: SharedChallenge) => {
    const newId = expandedId === challenge.id ? null : challenge.id;
    setExpandedId(newId);
    if (newId) {
      fetchAnswersForChallenge(challenge.id, challenge.title);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", challengeId)
        .eq("user_id", user?.id);
      if (error) throw error;
      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      if (expandedId === challengeId) setExpandedId(null);
      toast.success("Challenge removed from the board");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete challenge");
    }
  };

  const getChallengeIcon = (title: string) => {
    if (title.includes("Chef")) return <ChefHat className="h-4 w-4" />;
    if (title.includes("Equation")) return <Calculator className="h-4 w-4" />;
    return <Flame className="h-4 w-4" />;
  };

  const getChallengeColor = (title: string) => {
    if (title.includes("Chef")) return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    if (title.includes("Equation")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-yellow-500";
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-blue-500";
    return "text-muted-foreground";
  };

  const getMedalEmoji = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Public Challenge Board | Phototheology Palace"
        description="Try community-shared Bible challenges — Chef, Equation, and Daily — and get rated by Jeeves."
      />
      <Navigation />
      <main className="container mx-auto px-4 pt-36 pb-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="h-7 w-7 text-yellow-500" />
                Public Challenge Board
              </h1>
              <p className="text-muted-foreground text-sm">
                Try challenges shared by the community — submit your answer and get rated by Jeeves
              </p>
            </div>
          </div>

          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
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

            <TabsContent value={activeFilter} className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : challenges.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">No challenges shared yet!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate a challenge and share it here for others to try.
                    </p>
                    <Button onClick={() => navigate("/daily-challenges")} className="mt-4 gap-2">
                      <Flame className="h-4 w-4" /> Go to Challenges
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge) => {
                    const isExpanded = expandedId === challenge.id;
                    const name = challenge.profiles?.display_name || challenge.profiles?.username || "Anonymous";
                    const challengeAnswers = answers[challenge.id] || [];
                    const isLoadingAnswers = loadingAnswers[challenge.id];

                    return (
                      <Card key={challenge.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          {/* Challenge Header */}
                          <div
                            className="flex items-start gap-3 cursor-pointer"
                            onClick={() => toggleExpand(challenge)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge variant="outline" className={`text-xs ${getChallengeColor(challenge.title)}`}>
                                  {getChallengeIcon(challenge.title)}
                                  <span className="ml-1">
                                    {challenge.title.includes("Chef") ? "Chef" : challenge.title.includes("Equation") ? "Equation" : "Daily"}
                                  </span>
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" /> {name}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {challenge.created_at ? new Date(challenge.created_at).toLocaleDateString() : ""}
                                </span>
                              </div>
                              <p className="text-sm font-medium line-clamp-2">{challenge.title}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                              {user?.id === challenge.user_id && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete this challenge?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove the challenge from the public board. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteChallenge(challenge.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4">
                              {/* Challenge Content */}
                              <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm whitespace-pre-wrap">{challenge.content}</p>
                              </div>

                              {/* Submit Answer */}
                              <Card className="border-primary/20">
                                <CardContent className="p-4 space-y-3">
                                  <p className="text-sm font-medium">✍️ Submit your answer and get rated by Jeeves:</p>
                                  <Textarea
                                    value={answerTexts[challenge.id] || ""}
                                    onChange={(e) => setAnswerTexts(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                                    placeholder="Write your response to this challenge..."
                                    rows={4}
                                    disabled={submitting === challenge.id}
                                  />
                                  <Button
                                    onClick={() => handleSubmitAnswer(challenge)}
                                    disabled={submitting === challenge.id || !(answerTexts[challenge.id]?.trim())}
                                    className="w-full gap-2"
                                  >
                                    {submitting === challenge.id ? (
                                      <><Loader2 className="h-4 w-4 animate-spin" /> Jeeves is rating...</>
                                    ) : (
                                      <><Send className="h-4 w-4" /> Submit & Get Rated</>
                                    )}
                                  </Button>
                                </CardContent>
                              </Card>

                              {/* Ranked Answers */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-semibold">Community Answers</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {challengeAnswers.length}
                                  </Badge>
                                </div>

                                {isLoadingAnswers ? (
                                  <div className="flex justify-center py-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                  </div>
                                ) : challengeAnswers.length === 0 ? (
                                  <p className="text-xs text-muted-foreground text-center py-4">
                                    No submissions yet — be the first!
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {challengeAnswers.map((ans, i) => (
                                      <div key={ans.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                        <span className="text-lg font-bold min-w-[32px] text-center">
                                          {getMedalEmoji(i)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                          <span className="text-sm font-semibold">{ans.displayName}</span>
                                          {ans.content && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">{ans.content.slice(0, 120)}</p>
                                          )}
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className={`text-xl font-bold ${getScoreColor(ans.jeeves_score || 0)}`}>
                                            {ans.jeeves_score}
                                          </span>
                                          <span className="text-xs text-muted-foreground">/100</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ChallengeBoard;
