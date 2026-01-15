import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";
import {
  Trophy,
  Clock,
  Users,
  BookOpen,
  Send,
  Share2,
  Sparkles,
  Crown,
  Medal,
  Award,
  Loader2,
  ChevronRight,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SubmissionForm } from "@/components/weekly-challenge/SubmissionForm";
import { SubmissionCard } from "@/components/weekly-challenge/SubmissionCard";
import { WinnerCard } from "@/components/weekly-challenge/WinnerCard";
import { ChallengeCountdown } from "@/components/weekly-challenge/ChallengeCountdown";
import { ShareChallengeDialog } from "@/components/weekly-challenge/ShareChallengeDialog";
import { GuestContributionForm } from "@/components/weekly-challenge/GuestContributionForm";

interface WeeklyChallenge {
  id: string;
  week_number: number;
  year: number;
  title: string;
  theme: string;
  anchor_passage: string;
  study_prompt?: string;
  pt_focus?: string[];
  difficulty: string;
  hints?: any;
  status: string;
  starts_at: string;
  ends_at: string;
}

interface Submission {
  id: string;
  user_id: string;
  main_insight: string;
  scripture_connections?: string[];
  principles_applied?: string[];
  pt_principles_applied?: string[];
  practical_application: string;
  supporting_evidence?: string;
  ai_score: number | null;
  depth_score?: number | null;
  biblical_score?: number | null;
  pt_score?: number | null;
  clarity_score?: number | null;
  ai_feedback: string | null;
  highlight_quotes?: string[];
  submitted_at?: string;
  rank?: number;
  word_count?: number;
  profiles?: any;
}

interface Winner {
  id: string;
  rank: number;
  jeeves_commentary?: string;
  standout_insight: string;
  xp_awarded: number;
  badge_awarded: string;
  user_id: string;
  profiles?: any;
}

interface GuestContribution {
  id: string;
  name?: string;
  guest_name?: string;
  contribution: string;
  created_at: string;
}

export default function WeeklyChallengePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shareCode = searchParams.get("ref");
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [guestContributions, setGuestContributions] = useState<GuestContribution[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("challenge");

  // Sparks integration
  const {
    sparks,
    preferences: sparkPreferences,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: challenge?.id || 'weekly-challenge',
    maxSparks: 3,
    debounceMs: 90000
  });

  useEffect(() => {
    loadChallenge();
    if (shareCode) {
      trackShareClick(shareCode);
    }
  }, [shareCode]);

  useEffect(() => {
    if (challenge && user) {
      loadUserSubmission();
      loadSubmissions();
    }
    if (challenge) {
      loadWinners();
      loadGuestContributions();
      loadSubmissionCount();
    }
  }, [challenge, user]);

  const trackShareClick = async (code: string) => {
    try {
      await supabase.rpc("track_share_click", { p_share_code: code });
    } catch (err) {
      console.error("Failed to track share click:", err);
    }
  };

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weekly_study_challenges")
        .select("*")
        .in("status", ["active", "judged"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setChallenge(data);
    } catch (err) {
      console.error("Error loading challenge:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubmission = async () => {
    if (!user || !challenge) return;
    try {
      const { data } = await supabase
        .from("weekly_study_submissions")
        .select("*")
        .eq("challenge_id", challenge.id)
        .eq("user_id", user.id)
        .single();

      setUserSubmission(data);
      if (data) setActiveTab("submissions");
    } catch (err) {
      // No submission yet
    }
  };

  const loadSubmissions = async () => {
    if (!challenge) return;
    try {
      const { data } = await supabase
        .from("weekly_study_submissions")
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq("challenge_id", challenge.id)
        .order("ai_score", { ascending: false, nullsFirst: false });

      setSubmissions(data || []);
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  };

  const loadSubmissionCount = async () => {
    if (!challenge) return;
    try {
      const { count } = await supabase
        .from("weekly_study_submissions")
        .select("*", { count: "exact", head: true })
        .eq("challenge_id", challenge.id);

      setSubmissionCount(count || 0);
    } catch (err) {
      console.error("Error loading count:", err);
    }
  };

  const loadWinners = async () => {
    if (!challenge) return;
    try {
      const { data } = await supabase
        .from("weekly_study_winners")
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq("challenge_id", challenge.id)
        .order("rank", { ascending: true });

      setWinners(data || []);
    } catch (err) {
      console.error("Error loading winners:", err);
    }
  };

  const loadGuestContributions = async () => {
    if (!challenge) return;
    try {
      const { data } = await supabase
        .from("weekly_challenge_guest_contributions")
        .select("*")
        .eq("challenge_id", challenge.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setGuestContributions(data || []);
    } catch (err) {
      console.error("Error loading guest contributions:", err);
    }
  };

  const handleSubmissionSuccess = () => {
    loadUserSubmission();
    loadSubmissions();
    loadSubmissionCount();
    setActiveTab("submissions");
    toast.success("Your insights have been submitted!");
  };

  const handleGuestContribution = () => {
    loadGuestContributions();
    toast.success("Thank you for sharing your thoughts!");
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Challenge</h2>
            <p className="text-muted-foreground mb-4">
              The next weekly study challenge will begin soon!
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isJudged = challenge.status === "judged";
  const hasSubmitted = !!userSubmission;

  return (
    <>
      {/* Sparks Container */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
            position="floating"
          />
        </div>
      )}

      {/* Spark Settings */}
      <div className="fixed bottom-24 md:bottom-4 right-4 z-40">
        <SparkSettings
          preferences={sparkPreferences}
          onUpdate={updateSparkPreferences}
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-amber-500" />
            <h1 className="text-3xl font-bold">Weekly Study Challenge</h1>
          </div>
          <p className="text-muted-foreground">
            Dive deep into Scripture with the community. Submit your insights and learn together.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
          {!user && (
            <Button onClick={() => navigate("/auth")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Join to Submit
            </Button>
          )}
        </div>
      </div>

      {/* Winners Banner (if judged) */}
      {isJudged && winners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                This Week's Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {winners.map((winner) => (
                  <WinnerCard key={winner.id} winner={winner} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="challenge" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Challenge
          </TabsTrigger>
          <TabsTrigger value="submissions" className="gap-2">
            <Users className="h-4 w-4" />
            Submissions ({submissionCount})
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Challenge Tab */}
        <TabsContent value="challenge" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Challenge Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Week {challenge.week_number}, {challenge.year}
                      </Badge>
                      <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {challenge.theme}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={challenge.difficulty === "advanced" ? "destructive" : "secondary"}
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Anchor Passage */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">Anchor Passage</span>
                    </div>
                    <p className="text-lg font-serif">{challenge.anchor_passage}</p>
                  </div>

                  {/* Study Prompt */}
                  <div>
                    <h3 className="font-semibold mb-2">This Week's Challenge:</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {challenge.study_prompt}
                    </p>
                  </div>

                  {/* PT Focus */}
                  {challenge.pt_focus && challenge.pt_focus.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">PT Principles to Consider:</h4>
                      <div className="flex flex-wrap gap-2">
                        {challenge.pt_focus.map((principle, i) => (
                          <Badge key={i} variant="secondary">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {principle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hints */}
                  {challenge.hints && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Need a hint?
                      </summary>
                      <p className="mt-2 p-3 bg-muted rounded-lg">
                        {typeof challenge.hints === "string"
                          ? challenge.hints
                          : JSON.stringify(challenge.hints)}
                      </p>
                    </details>
                  )}
                </CardContent>
              </Card>

              {/* Submission Form (if logged in and not submitted) */}
              {user && !hasSubmitted && !isJudged && (
                <SubmissionForm
                  challengeId={challenge.id}
                  onSuccess={handleSubmissionSuccess}
                />
              )}

              {/* Already Submitted Message */}
              {hasSubmitted && (
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardContent className="py-6 text-center">
                    <Badge className="bg-green-500 mb-2">Submitted</Badge>
                    <h3 className="font-semibold">You've submitted your insights!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isJudged
                        ? "Check the submissions tab to see how you did."
                        : "Jeeves will evaluate all submissions on Friday."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => setActiveTab("submissions")}
                    >
                      View All Submissions
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Not Logged In Message */}
              {!user && (
                <Card className="border-primary/30">
                  <CardContent className="py-6 text-center">
                    <h3 className="font-semibold mb-2">Want to participate?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a free account to submit your insights and compete for weekly honors!
                    </p>
                    <Button onClick={() => navigate("/auth")}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Phototheology
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Countdown */}
              {!isJudged && (
                <ChallengeCountdown endsAt={challenge.ends_at} />
              )}

              {/* Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Submissions</span>
                      <span className="font-semibold">{submissionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Guest Thoughts</span>
                      <span className="font-semibold">{guestContributions.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={isJudged ? "default" : "secondary"}>
                        {isJudged ? "Judged" : "Open"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="pt-6 text-center">
                  <Share2 className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h4 className="font-semibold mb-1">Share This Challenge</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Invite friends to study together. They can contribute even without an account!
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    Invite Friends
                  </Button>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Weekly Rewards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>1st: 200 XP + Weekly Scholar badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="h-4 w-4 text-gray-400" />
                    <span>2nd: 100 XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-700" />
                    <span>3rd: 75 XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Send className="h-4 w-4" />
                    <span>Participation: 50 XP</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          {!user ? (
            <Card className="text-center py-8">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Sign in to View Submissions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join the community to see how others approached this study.
                </p>
                <Button onClick={() => navigate("/auth")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </CardContent>
            </Card>
          ) : !hasSubmitted && !isJudged ? (
            <Card className="text-center py-8">
              <CardContent>
                <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Submit First to View Others</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your insights first, then see how others approached the study.
                </p>
                <Button onClick={() => setActiveTab("challenge")}>
                  Go to Challenge
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {/* Your Submission First */}
                {userSubmission && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Your Submission
                    </h3>
                    <SubmissionCard
                      submission={userSubmission}
                      isOwn
                      showScores={isJudged}
                    />
                  </div>
                )}

                {/* Other Submissions */}
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Community Submissions ({submissions.length})
                </h3>
                <AnimatePresence>
                  {submissions
                    .filter((s) => s.id !== userSubmission?.id)
                    .map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SubmissionCard
                          submission={submission}
                          showScores={isJudged}
                          rank={isJudged ? index + (userSubmission ? 2 : 1) : undefined}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Community Tab (Guest Contributions) */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Community Thoughts</CardTitle>
                  <CardDescription>
                    Insights from friends and visitors studying alongside us
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {guestContributions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No community contributions yet. Share the challenge to invite others!
                    </p>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4 pr-4">
                        {guestContributions.map((contribution) => (
                          <Card key={contribution.id} className="bg-muted/50">
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {contribution.guest_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {contribution.guest_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(contribution.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{contribution.contribution}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Guest Contribution Form */}
            <div>
              {!user && (
                <GuestContributionForm
                  challengeId={challenge.id}
                  shareCode={shareCode}
                  onSuccess={handleGuestContribution}
                />
              )}

              {user && (
                <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                  <CardContent className="pt-6 text-center">
                    <Badge className="bg-green-500 mb-2">Member</Badge>
                    <h4 className="font-semibold mb-1">You're a Member!</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Submit your full insights in the Challenge tab to compete for weekly honors.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab("challenge")}
                    >
                      Go to Challenge
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <ShareChallengeDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        challenge={challenge}
      />
      </div>
    </>
  );
}
