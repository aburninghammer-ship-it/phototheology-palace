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
import { Flame, BookOpen, ChefHat, Calculator, Brain, Target, Lightbulb, Zap } from "lucide-react";
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
import { SeventyQuestionsChallenge } from "@/components/challenges/SeventyQuestionsChallenge";
import { PrincipleStudyChallenge } from "@/components/challenges/PrincipleStudyChallenge";

const DailyChallenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

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

  const handleChallengeSubmit = async (submissionData: any) => {
    if (!dailyChallenge || !user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds

    try {
      const { error } = await supabase
        .from("challenge_submissions")
        .insert({
          challenge_id: dailyChallenge.id,
          user_id: user.id,
          content: JSON.stringify(submissionData),
          submission_data: submissionData,
          principle_applied: submissionData.principle_applied,
          time_spent: timeSpent,
        });

      if (error) throw error;

      toast({
        title: "Challenge Complete! 🎉",
        description: "Added to your Growth Journal. Check back tomorrow for the next challenge!",
      });

      setHasSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getShareContent = () => {
    if (!dailyChallenge) return {
      title: 'Daily Phototheology Challenge',
      content: 'Join me in today\'s Bible study challenge!',
      url: `${window.location.origin}/daily-challenges`
    };

    const challengeTypeLabel = dailyChallenge.challenge_subtype?.replace(/-/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Challenge';

    return {
      title: `${challengeTypeLabel} - Daily Phototheology Challenge`,
      content: dailyChallenge.description || `Today's challenge: ${challengeTypeLabel}. Training ${dailyChallenge.principle_used || 'biblical principles'}. Join me in deepening our understanding of Scripture!`,
      url: `${window.location.origin}/daily-challenges`
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily" className="gap-2">
                <Flame className="h-4 w-4" />
                Daily Challenge
              </TabsTrigger>
              <TabsTrigger value="chef" className="gap-2">
                <ChefHat className="h-4 w-4" />
                Chef Challenge
              </TabsTrigger>
              <TabsTrigger value="equations" className="gap-2">
                <Calculator className="h-4 w-4" />
                Equations
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
            </TabsContent>

            <TabsContent value="equations" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-indigo-500/5 p-4 rounded-lg border border-primary/20">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  About Equation Challenges
                </h2>
                <p className="text-sm text-muted-foreground">
                  Decode biblical equations using palace principles and symbols.
                  Discover how Scripture speaks in symbolic language that points to Christ.
                </p>
              </div>
              <EquationDecodeChallenge 
                challenge={{
                  title: "Equation Challenge",
                  description: "Decode this biblical equation to discover its deeper meaning.",
                  verses: ["John 3:16"],
                  ui_config: {
                    equation: "🌍 + ❤️ + 🎁 = ∞",
                    verse_context: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
                  }
                }}
                onSubmit={handleChallengeSubmit}
                hasSubmitted={false}
              />
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate("/equations-challenge")} className="gap-2">
                  <Calculator className="h-4 w-4" />
                  View Full Equations Challenge Mode
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenges;
