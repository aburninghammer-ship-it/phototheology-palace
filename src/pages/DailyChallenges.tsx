import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOutputSpark } from "@/hooks/useOutputSpark";
import { Flame, BookOpen, ChefHat, Calculator, Brain, Target, Lightbulb, Zap, Archive, CheckCircle2, ChevronLeft, ChevronRight, Clock, Trophy, Globe } from "lucide-react";
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
  const { triggerOutputSpark } = useOutputSpark();
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [archiveSubmissions, setArchiveSubmissions] = useState<ChallengeSubmission[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveMonth, setArchiveMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchDailyChallenge();
    }
  }, [user]);

  const fetchDailyChallenge = async () => {
    const now = new Date();
    
    // Get today's challenge based on 30-day rotation
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const rotationDay = (dayOfYear % 30) + 1; // 30-day rotation

    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("day_in_rotation", rotationDay)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching challenges:", error);
      return;
    }

    const todayChallenge = challenges?.[0] || null;
    setDailyChallenge(todayChallenge);
    
    if (todayChallenge && user) {
      const { data: submission } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("challenge_id", todayChallenge.id)
        .eq("user_id", user.id)
        .gte("created_at", new Date(now.setHours(0, 0, 0, 0)).toISOString())
        .maybeSingle();

      setHasSubmitted(!!submission);
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
        title: "Challenge Complete! 🎉",
        description: "Added to your Growth Journal. +25 points! Check back tomorrow for the next challenge!",
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
      title: 'Daily Phototheology Challenge',
      content: 'Join me in today\'s Bible study challenge!',
      url: `${siteUrl}/daily-challenges`
    };

    const challengeTypeLabel = dailyChallenge.challenge_subtype?.replace(/-/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Challenge';

    const principle = dailyChallenge.principle_used || 'biblical principles';

    const explanation = "Daily Challenges test your Bible knowledge with fresh puzzles each day — from verse matching to thematic connections. Great for building a daily Scripture habit!";

    const details: string[] = [
      `🔥 Try this Phototheology Daily Challenge!`,
      `💡 ${explanation}`,
      `📖 ${challengeTypeLabel} — training ${principle}`,
    ];
    if (dailyChallenge.description) {
      details.push(dailyChallenge.description);
    }
    if (dailyChallenge.verses && Array.isArray(dailyChallenge.verses) && dailyChallenge.verses.length > 0) {
      details.push(dailyChallenge.verses.join('\n\n'));
    }
    details.push(`✨ Try it yourself on Phototheology Palace — a free Bible learning suite!\n\n${siteUrl}/daily-challenges`);

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
                Challenge type not yet implemented. Check back soon!
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!user) return null;

  const challengeSteps = [
    {
      title: "Complete Daily Challenges",
      description: "Each day brings a new Phototheology challenge designed to sharpen your Bible study skills and deepen your understanding of Scripture.",
      highlights: [
        "30-day rotating challenge system",
        "Dimension drills, chef recipes, and equation decoding",
        "Progress tracked in your Growth Journal"
      ],
      icon: Flame
    },
    {
      title: "Choose Your Challenge Type",
      description: "Switch between Daily Challenges, Chef Challenges, and Equations to train different aspects of Phototheology thinking.",
      highlights: [
        "Daily challenges for reflexive training",
        "Chef challenges to create biblical recipes",
        "Equations to decode symbolic meanings"
      ],
      icon: Target
    },
    {
      title: "Learn the Principles",
      description: "Each challenge focuses on specific Phototheology principles like the 5 Dimensions, Connect 6, or Sanctuary mapping.",
      highlights: [
        "70 Questions methodology",
        "Christ-chapter discoveries",
        "Fruit check evaluations"
      ],
      icon: Lightbulb
    },
    {
      title: "Track Your Growth",
      description: "Completed challenges are saved to your Growth Journal where you can review your insights and track your spiritual development.",
      highlights: [
        "View past submissions and AI feedback",
        "Share your insights with the community",
        "Build a record of your spiritual journey"
      ],
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-36 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Challenges
            </h1>
            <div className="flex gap-2">
              <HowItWorksDialog 
                title="How to Use Daily Challenges" 
                steps={challengeSteps}
                gradient="from-orange-500 via-amber-500 to-yellow-500"
              />
              <Button onClick={() => navigate("/growth-journal")} variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Growth Journal
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
                Daily
              </TabsTrigger>
              <TabsTrigger value="chef" className="gap-2">
                <ChefHat className="h-4 w-4" />
                Chef
              </TabsTrigger>
              <TabsTrigger value="equations" className="gap-2">
                <Calculator className="h-4 w-4" />
                Equations
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="archive" className="gap-2">
                <Archive className="h-4 w-4" />
                Archive
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <h2 className="font-semibold mb-2">About Daily Challenges</h2>
                <p className="text-sm text-muted-foreground">
                  Each day brings a new challenge designed to train you in Phototheology principles. 
                  Complete challenges to build your Growth Journal and develop reflexive biblical thinking.
                  We rotate through 30 different Bible study challenges: dimension drills, chef recipes, 
                  equation decoding, 70 questions, principle studies, and more!
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
                      buttonText="Share This Challenge"
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
                      No challenge available right now. Challenges are generated daily. Check back soon!
                    </p>
                  </CardContent>
                </Card>
              )}

              <ChallengeInlineSubmissions
                challengeType="daily"
                challengeTitle={dailyChallenge?.title || "Daily Challenge"}
                challengeDescription={dailyChallenge?.description || ""}
                difficulty={dailyChallenge?.challenge_tier}
              />
            </TabsContent>

            <TabsContent value="chef" className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 p-4 rounded-lg border border-orange-500/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  About Chef Challenges
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create "biblical recipes" – coherent mini-sermons using only Bible verse references.
                  Chain verses together to build theological meals that nourish the soul.
                </p>
              </div>
              <ChefRecipeChallenge 
                challenge={{
                  title: "Chef Challenge",
                  description: "Create a biblical recipe by connecting verses that build a complete theological thought.",
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
                  View Full Chef Challenge Mode
                </Button>
              </div>
              <ChallengeInlineSubmissions
                challengeType="chef"
                challengeTitle="Chef Challenge"
                challengeDescription="Create a biblical recipe by connecting verses that build a complete theological thought."
              />
            </TabsContent>

            <TabsContent value="equations" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-indigo-500/5 p-4 rounded-lg border border-primary/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  About Equation Challenges
                </h2>
                <p className="text-sm text-muted-foreground">
                  Decode biblical equations using Palace principles and symbols.
                  Each symbol maps to a PT room or principle — discover how Scripture speaks through the Palace framework.
                </p>
              </div>

              {/* Example equation with PT principle symbols */}
              <EquationDecodeChallenge 
                challenge={{
                  title: "Sample Equation — John 3:16",
                  passage_reference: "John 3:16",
                  description: "Decode this PT equation to discover how Palace principles reveal Christ in this verse.",
                  verses: ["For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."],
                  ui_config: {
                    equation: "CR(🌍) + ST(🐑→✝️) + @CyC + DR(5D) = FRt(∞)",
                    verse_text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
                    hints: [
                      "CR(🌍) = Concentration Room — Christ is the center of God's love for the world",
                      "ST(🐑→✝️) = Symbols/Types Room — The Lamb (type) points to the Cross (antitype)",
                      "@CyC = Cyrus–Christ Cycle — The ultimate Deliverer fulfills covenant promise",
                      "DR(5D) = Dimensions Room — Literal gift, Christ as sacrifice, personal faith, church salvation, heavenly life",
                      "FRt(∞) = Fruit Room — Everlasting life is the fruit of believing"
                    ]
                  }
                }}
                onSubmit={handleChallengeSubmit}
                hasSubmitted={false}
              />

              {/* Jeeves-powered equation generator */}
              <InlineEquationGenerator onSubmit={handleChallengeSubmit} />
              <ChallengeInlineSubmissions
                challengeType="equation"
                challengeTitle="Equation Challenge"
                challengeDescription="Decode this biblical equation to discover its deeper meaning."
              />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <CommunityChallengeFeed />
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate("/community-challenges")} className="gap-2">
                  <Trophy className="h-4 w-4" />
                  View Full Leaderboard
                </Button>
                <Button onClick={() => navigate("/challenge-board")} className="gap-2">
                  <Globe className="h-4 w-4" />
                  Public Challenge Board
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="archive" className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/5 p-4 rounded-lg border border-purple-500/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Archive className="h-5 w-5 text-purple-600" />
                  Challenge Archive
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review your past challenge submissions and track your progress over time.
                  See how you've grown in your Phototheology skills!
                </p>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={goToPreviousMonth}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <h3 className="text-lg font-semibold">
                  {archiveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Button
                  variant="outline"
                  onClick={goToNextMonth}
                  disabled={archiveMonth.getFullYear() === new Date().getFullYear() && archiveMonth.getMonth() === new Date().getMonth()}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {archiveLoading ? (
                <div className="text-center py-12">Loading archive...</div>
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
                                Completed
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-lg">
                              {submission.challenge?.title || 'Challenge'}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {submission.challenge?.description?.slice(0, 150) || 'No description'}
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
                            <p className="text-xs text-muted-foreground mb-1">Your Response:</p>
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
                    <p className="text-muted-foreground">No challenges completed this month.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete daily challenges to build your archive!
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
                      Start Today's Challenge
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
