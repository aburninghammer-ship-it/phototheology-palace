import { useEffect, useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { DAILY_CHALLENGES_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOutputSpark } from "@/hooks/useOutputSpark";
import { Flame, BookOpen, ChefHat, Calculator, Brain, Target, Lightbulb, Zap, Archive, CheckCircle2, ChevronLeft, ChevronRight, Clock, Trophy, Globe, GraduationCap } from "lucide-react";
import { PostToPublicChallengeButton } from "@/components/challenges/PostToPublicChallengeButton";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { DimensionDrillChallenge } from "@/components/challenges/DimensionDrillChallenge";
import { Connect6Challenge } from "@/components/challenges/Connect6Challenge";
import { SanctuaryMapChallenge } from "@/components/challenges/SanctuaryMapChallenge";
import { ChristChapterChallenge } from "@/components/challenges/ChristChapterChallenge";
import { FruitCheckChallenge } from "@/components/challenges/FruitCheckChallenge";
import { SubjectConnectionChallenge } from "@/components/challenges/SubjectConnectionChallenge";
import { ChefRecipeChallenge } from "@/components/challenges/ChefRecipeChallenge";
import { EquationDecodeChallenge } from "@/components/challenges/EquationDecodeChallenge";
import { InlineEquationGenerator } from "@/components/challenges/InlineEquationGenerator";
import { SeventyQuestionsChallenge } from "@/components/challenges/SeventyQuestionsChallenge";
import { PrincipleStudyChallenge } from "@/components/challenges/PrincipleStudyChallenge";
import { CommunityChallengeFeed } from "@/components/challenges/CommunityChallengeFeed";
import { ChallengeInlineSubmissions } from "@/components/challenges/ChallengeInlineSubmissions";

interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  content: string;
  submission_data: any;
  principle_applied: string;
  time_spent: number;
  created_at: string;
  challenge?: {
    id: string;
    title: string;
    description: string;
    challenge_subtype: string;
    challenge_tier: string;
    principle_used: string;
    day_in_rotation: number;
  };
}

const DailyChallenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { triggerOutputSpark } = useOutputSpark();
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [archiveSubmissions, setArchiveSubmissions] = useState<ChallengeSubmission[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveMonth, setArchiveMonth] = useState(new Date());
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDailyChallenge();
    }
  }, [user]);

  const fetchDailyChallenge = async () => {
    try {
      const now = new Date();
      
      // Get today's challenge based on 30-day rotation
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
      const rotationDay = (dayOfYear % 30) + 1; // 30-day rotation
      console.log("[DailyChallenge] Fetching rotation day:", rotationDay, "dayOfYear:", dayOfYear);

      const { data: challenges, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("day_in_rotation", rotationDay)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("[DailyChallenge] Error fetching:", error);
        return;
      }

      console.log("[DailyChallenge] Found challenges:", challenges?.length, challenges?.[0]?.title);

      if (!challenges || challenges.length === 0) {
        // Fallback: try fetching any available challenge
        console.warn("[DailyChallenge] No challenge for rotation day", rotationDay, "— fetching fallback");
        const { data: fallback } = await supabase
          .from("challenges")
          .select("*")
          .eq("challenge_type", "daily")
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (fallback && fallback.length > 0) {
          setDailyChallenge(fallback[0]);
          return;
        }
      }

      const todayChallenge = challenges?.[0] || null;
      setDailyChallenge(todayChallenge);
      
      if (todayChallenge && user) {
        const { data: submission } = await supabase
          .from("challenge_submissions")
          .select("*")
          .eq("challenge_id", todayChallenge.id)
          .eq("user_id", user.id)
          .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
          .maybeSingle();

        setHasSubmitted(!!submission);
      }
    } catch (err) {
      console.error("[DailyChallenge] Unexpected error:", err);
    }
  };

  const fetchArchiveSubmissions = async () => {
    if (!user) return;

    setArchiveLoading(true);
    try {
      const startOfMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth(), 1);
      const endOfMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from("challenge_submissions")
        .select(`
          id,
          challenge_id,
          user_id,
          content,
          submission_data,
          principle_applied,
          time_spent,
          created_at,
          challenges:challenge_id (
            id,
            title,
            description,
            challenge_subtype,
            challenge_tier,
            principle_used,
            day_in_rotation
          )
        `)
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString())
        .lte("created_at", endOfMonth.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to flatten the challenges relation
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        challenge: item.challenges
      }));

      setArchiveSubmissions(transformedData);
    } catch (error) {
      console.error("Error fetching archive:", error);
    } finally {
      setArchiveLoading(false);
    }
  };

  useEffect(() => {
    fetchArchiveSubmissions();
  }, [archiveMonth, user]);

  const goToPreviousMonth = () => {
    setArchiveMonth(new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() + 1, 1);
    if (nextMonth <= new Date()) {
      setArchiveMonth(nextMonth);
    }
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const handleChallengeSubmit = async (submissionData: any) => {
    if (!dailyChallenge || !user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds

    try {
      // Use upsert to allow updating existing submissions
      const { error } = await supabase
        .from("challenge_submissions")
        .upsert({
          challenge_id: dailyChallenge.id,
          user_id: user.id,
          content: JSON.stringify(submissionData),
          submission_data: submissionData,
          principle_applied: submissionData.principle_applied,
          time_spent: timeSpent,
        }, {
          onConflict: 'challenge_id,user_id'
        });

      if (error) throw error;

      // Award 25 points for completing a challenge
      await supabase.rpc("increment_user_points", { 
        user_id: user.id, 
        points_to_add: 25 
      });

      toast({
        title: t('dailyChallengesPage.challengeComplete') + " 🎉",
        description: t('dailyChallengesPage.challengeCompleteDesc'),
      });

      setHasSubmitted(true);
      
      // Trigger output spark for challenge completion
      const submissionContent = typeof submissionData === 'string' 
        ? submissionData 
        : JSON.stringify(submissionData);
      
      triggerOutputSpark({
        type: 'challenge',
        content: `Challenge: ${dailyChallenge.title}\nPrinciple: ${dailyChallenge.principle_used || 'General'}\nSubmission: ${submissionContent}`,
        title: dailyChallenge.title,
        verseReference: dailyChallenge.verses?.[0],
        contextId: dailyChallenge.id
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getShareContent = () => {
    const siteUrl = 'https://phototheologybible.com';

    if (!dailyChallenge) return {
      title: t('dailyChallengesPage.dailyPhototheologyChallenge'),
      content: t('dailyChallengesPage.joinTodaysChallenge'),
      url: `${siteUrl}/daily-challenges`
    };

    const challengeTypeLabel = dailyChallenge.challenge_subtype?.replace(/-/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Challenge';

    const principle = dailyChallenge.principle_used || 'biblical principles';

    const explanation = t('dailyChallengesPage.dailyChallengesExplanation');

    const details: string[] = [
      `🔥 ${t('dailyChallengesPage.tryThisChallenge')}`,
      `💡 ${explanation}`,
      `📖 ${challengeTypeLabel} — training ${principle}`,
    ];
    if (dailyChallenge.description) {
      details.push(dailyChallenge.description);
    }
    if (dailyChallenge.verses && Array.isArray(dailyChallenge.verses) && dailyChallenge.verses.length > 0) {
      details.push(dailyChallenge.verses.join('\n\n'));
    }
    details.push(`✨ ${t('dailyChallengesPage.tryItYourself')}\n\n${siteUrl}/daily-challenges`);

    return {
      title: `🔥 Daily ${challengeTypeLabel} Challenge`,
      content: details.join('\n\n'),
      url: `${siteUrl}/daily-challenges`
    };
  };

  const renderChallenge = () => {
    if (!dailyChallenge) return null;

    const props = {
      challenge: dailyChallenge,
      onSubmit: handleChallengeSubmit,
      hasSubmitted
    };

    switch (dailyChallenge.challenge_subtype) {
      case "dimension-drill":
        return <DimensionDrillChallenge {...props} />;
      case "connect-6":
        return <Connect6Challenge {...props} />;
      case "sanctuary-map":
        return <SanctuaryMapChallenge {...props} />;
      case "christ-chapter":
        return <ChristChapterChallenge {...props} />;
      case "fruit-check":
        return <FruitCheckChallenge {...props} />;
      case "subject-connection":
        return <SubjectConnectionChallenge {...props} />;
      case "chef-recipe":
        return <ChefRecipeChallenge {...props} />;
      case "equation-decode":
        return <EquationDecodeChallenge {...props} />;
      case "70-questions":
        return <SeventyQuestionsChallenge {...props} />;
      case "principle-study":
        return <PrincipleStudyChallenge {...props} />;
      default:
        return (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                {t('dailyChallengesPage.challengeNotImplemented')}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!user) return null;

  const challengeSteps = [
    {
      title: t('dailyChallengesPage.stepCompleteChallenges'),
      description: t('dailyChallengesPage.stepCompleteChallengesDesc'),
      highlights: [
        t('dailyChallengesPage.stepCompleteChallengesH1'),
        t('dailyChallengesPage.stepCompleteChallengesH2'),
        t('dailyChallengesPage.stepCompleteChallengesH3'),
      ],
      icon: Flame
    },
    {
      title: t('dailyChallengesPage.stepChooseType'),
      description: t('dailyChallengesPage.stepChooseTypeDesc'),
      highlights: [
        t('dailyChallengesPage.stepChooseTypeH1'),
        t('dailyChallengesPage.stepChooseTypeH2'),
        t('dailyChallengesPage.stepChooseTypeH3'),
      ],
      icon: Target
    },
    {
      title: t('dailyChallengesPage.stepLearnPrinciples'),
      description: t('dailyChallengesPage.stepLearnPrinciplesDesc'),
      highlights: [
        t('dailyChallengesPage.stepLearnPrinciplesH1'),
        t('dailyChallengesPage.stepLearnPrinciplesH2'),
        t('dailyChallengesPage.stepLearnPrinciplesH3'),
      ],
      icon: Lightbulb
    },
    {
      title: t('dailyChallengesPage.stepTrackGrowth'),
      description: t('dailyChallengesPage.stepTrackGrowthDesc'),
      highlights: [
        t('dailyChallengesPage.stepTrackGrowthH1'),
        t('dailyChallengesPage.stepTrackGrowthH2'),
        t('dailyChallengesPage.stepTrackGrowthH3'),
      ],
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={DAILY_CHALLENGES_TOUR} onClose={() => setTourOpen(false)} />}
      <main className="container mx-auto px-4 pt-36 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              {t('dailyChallengesPage.challenges')}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
                <GraduationCap className="h-4 w-4" /> Tour
              </Button>
              <HowItWorksDialog
                title={t('dailyChallengesPage.howToUseTitle')}
                steps={challengeSteps}
                gradient="from-orange-500 via-amber-500 to-yellow-500"
              />
              <Button onClick={() => navigate("/growth-journal")} variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                {t('dailyChallengesPage.growthJournal')}
              </Button>
              <EnhancedSocialShare {...getShareContent()} />
            </div>
          </div>

          {user && (
            <VoiceChatWidget
              roomType="challenges"
              roomId="daily"
              className="mb-6"
            />
          )}

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="daily" className="gap-2">
                <Flame className="h-4 w-4" />
                {t('dailyChallengesPage.daily')}
              </TabsTrigger>
              <TabsTrigger value="chef" className="gap-2">
                <ChefHat className="h-4 w-4" />
                {t('dailyChallengesPage.chef')}
              </TabsTrigger>
              <TabsTrigger value="equations" className="gap-2">
                <Calculator className="h-4 w-4" />
                {t('dailyChallengesPage.equations')}
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                {t('dailyChallengesPage.leaderboard')}
              </TabsTrigger>
              <TabsTrigger value="archive" className="gap-2">
                <Archive className="h-4 w-4" />
                {t('dailyChallengesPage.archive')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <h2 className="font-semibold mb-2">{t('dailyChallengesPage.aboutDailyChallenges')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('dailyChallengesPage.aboutDailyChallengesDesc')}
                </p>
              </div>

              {dailyChallenge ? (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={
                        dailyChallenge.challenge_tier === "Quick" ? "default" :
                        dailyChallenge.challenge_tier === "Core" ? "secondary" :
                        "outline"
                      }>
                        {dailyChallenge.challenge_tier}
                      </Badge>
                    </div>
                    <EnhancedSocialShare
                      {...getShareContent()}
                      buttonText={t('dailyChallengesPage.shareThisChallenge')}
                      buttonVariant="default"
                    />
                  </div>

                  {renderChallenge()}
                  {dailyChallenge && (
                    <div className="flex justify-center mt-4">
                      <PostToPublicChallengeButton
                        challengeType="daily"
                        title={dailyChallenge.title}
                        content={dailyChallenge.description || dailyChallenge.title}
                        difficulty={dailyChallenge.challenge_tier}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {t('dailyChallengesPage.noChallengeAvailable')}
                    </p>
                  </CardContent>
                </Card>
              )}

              <ChallengeInlineSubmissions
                challengeType="daily"
                challengeTitle={dailyChallenge?.title || t('dailyChallengesPage.dailyChallenge')}
                challengeDescription={dailyChallenge?.description || ""}
                difficulty={dailyChallenge?.challenge_tier}
              />
            </TabsContent>

            <TabsContent value="chef" className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 p-4 rounded-lg border border-orange-500/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  {t('dailyChallengesPage.aboutChefChallenges')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('dailyChallengesPage.chefChallengesDesc')}
                </p>
              </div>
              <ChefRecipeChallenge
                challenge={{
                  title: t('dailyChallengesPage.chefChallenge'),
                  description: t('dailyChallengesPage.chefChallengeDesc'),
                  verses: [],
                  ui_config: {
                    theme: "Faith Journey",
                    ingredient_slots: 5,
                    suggested_topics: ["Grace", "Redemption", "Hope", "Love", "Salvation"]
                  }
                }}
                onSubmit={handleChallengeSubmit}
                hasSubmitted={false}
              />
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate("/games/chef-challenge")} className="gap-2">
                  <ChefHat className="h-4 w-4" />
                  {t('dailyChallengesPage.viewFullChefMode')}
                </Button>
              </div>
              <ChallengeInlineSubmissions
                challengeType="chef"
                challengeTitle={t('dailyChallengesPage.chefChallenge')}
                challengeDescription={t('dailyChallengesPage.chefChallengeDesc')}
              />
            </TabsContent>

            <TabsContent value="equations" className="space-y-6">
              <Card className="border-border bg-card">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">{t('dailyChallengesPage.buildEquationChallenge')}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('dailyChallengesPage.equationInstructions')}
                  </p>
                </CardContent>
              </Card>

              <InlineEquationGenerator onSubmit={handleChallengeSubmit} />

              <Card className="border-border bg-card">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('dailyChallengesPage.ptExample')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('dailyChallengesPage.ptExampleDesc')}
                  </p>
                </CardContent>
              </Card>

              <EquationDecodeChallenge 
                challenge={{
                  title: "Sample Equation — John 3:16",
                  passage_reference: "John 3:16",
                  description: "Decode this PT equation to discover how Palace principles reveal Christ in this verse.",
                  verses: ["For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."],
                  ui_config: {
                    equation: "CR + ST + @CyC + DR + BL = FRt",
                    verse_text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
                    hints: [
                      "CR = Concentration Room — Where is Christ? He is the gift given for the world",
                      "ST = Symbols/Types Room — 'Only begotten Son' is the antitype of the Passover lamb sacrificed for deliverance",
                      "@CyC = Cyrus–Christ Cycle — The ultimate Deliverer fulfills the covenant promise of Genesis 3:15",
                      "DR = Dimensions Room — Literal (God gave), Christ (the Son), Me (whosoever believeth), Church (the world), Heaven (everlasting life)",
                      "BL = Blue Room (Sanctuary) — The gift follows the sanctuary pattern: altar (sacrifice), mercy seat (grace), ark (covenant)",
                      "FRt = Fruit Room — The fruit of this truth is love, assurance, and everlasting life"
                    ]
                  }
                }}
                onSubmit={handleChallengeSubmit}
                hasSubmitted={false}
              />

              <ChallengeInlineSubmissions
                challengeType="equation"
                challengeTitle={t('dailyChallengesPage.equationChallenge')}
                challengeDescription={t('dailyChallengesPage.equationChallengeDesc')}
              />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <CommunityChallengeFeed />
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/community-challenges")} className="gap-2">
                  <Trophy className="h-4 w-4" />
                  {t('dailyChallengesPage.viewFullLeaderboard')}
                </Button>
                <Button onClick={() => navigate("/challenge-board")} className="gap-2">
                  <Globe className="h-4 w-4" />
                  {t('dailyChallengesPage.publicChallengeBoard')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="archive" className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/5 p-4 rounded-lg border border-purple-500/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Archive className="h-5 w-5 text-purple-600" />
                  {t('dailyChallengesPage.challengeArchive')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('dailyChallengesPage.challengeArchiveDesc')}
                </p>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={goToPreviousMonth}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('common.previous')}
                </Button>
                <h3 className="text-lg font-semibold">
                  {archiveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Button
                  variant="outline"
                  onClick={goToNextMonth}
                  disabled={archiveMonth.getFullYear() === new Date().getFullYear() && archiveMonth.getMonth() === new Date().getMonth()}
                >
                  {t('common.next')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {archiveLoading ? (
                <div className="text-center py-12">{t('dailyChallengesPage.loadingArchive')}</div>
              ) : archiveSubmissions.length > 0 ? (
                <div className="grid gap-4">
                  {archiveSubmissions.map((submission) => (
                    <Card key={submission.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                {new Date(submission.created_at).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Badge>
                              {submission.challenge?.challenge_tier && (
                                <Badge variant={
                                  submission.challenge.challenge_tier === "Quick" ? "default" :
                                  submission.challenge.challenge_tier === "Core" ? "secondary" :
                                  "outline"
                                }>
                                  {submission.challenge.challenge_tier}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                {t('dailyChallengesPage.completed')}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-lg">
                              {submission.challenge?.title || 'Challenge'}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {submission.challenge?.description?.slice(0, 150) || t('dailyChallengesPage.noDescription')}
                              {(submission.challenge?.description?.length || 0) > 150 ? '...' : ''}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              {submission.principle_applied && (
                                <span className="flex items-center gap-1">
                                  <Brain className="h-4 w-4" />
                                  {submission.principle_applied}
                                </span>
                              )}
                              {submission.time_spent > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTimeSpent(submission.time_spent)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Show submission preview */}
                        {submission.submission_data && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">{t('dailyChallengesPage.yourResponse')}</p>
                            <p className="text-sm line-clamp-3">
                              {typeof submission.submission_data === 'string'
                                ? submission.submission_data
                                : submission.submission_data.answer ||
                                  submission.submission_data.response ||
                                  submission.submission_data.insights?.join(', ') ||
                                  JSON.stringify(submission.submission_data).slice(0, 200)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t('dailyChallengesPage.noChallengesThisMonth')}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('dailyChallengesPage.completeChallengesPrompt')}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const tabs = document.querySelector('[data-state="active"][value="archive"]');
                        if (tabs) {
                          const dailyTab = document.querySelector('[value="daily"]') as HTMLElement;
                          dailyTab?.click();
                        }
                      }}
                      className="mt-4"
                    >
                      <Flame className="mr-2 h-4 w-4" />
                      {t('dailyChallengesPage.startTodaysChallenge')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenges;
