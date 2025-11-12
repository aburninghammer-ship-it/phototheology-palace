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
import { Flame, Share2, BookOpen, ChefHat, Calculator } from "lucide-react";
import { DimensionDrillChallenge } from "@/components/challenges/DimensionDrillChallenge";
import { Connect6Challenge } from "@/components/challenges/Connect6Challenge";
import { SanctuaryMapChallenge } from "@/components/challenges/SanctuaryMapChallenge";
import { ChristChapterChallenge } from "@/components/challenges/ChristChapterChallenge";
import { FruitCheckChallenge } from "@/components/challenges/FruitCheckChallenge";
import { SubjectConnectionChallenge } from "@/components/challenges/SubjectConnectionChallenge";

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

  const handleShare = () => {
    const shareData = {
      title: 'Daily Phototheology Challenge',
      text: `Join me in today's Bible study challenge! Today: ${dailyChallenge?.challenge_tier} challenge training ${dailyChallenge?.principle_used}`,
      url: `${window.location.origin}/daily-challenges`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Invitation copied!",
        description: "Share link copied to clipboard!",
      });
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Challenges
            </h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/growth-journal")} variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Growth Journal
              </Button>
              <Button onClick={handleShare} variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

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
                  We rotate through 30 different challenge types on a schedule.
                </p>
              </div>

              {dailyChallenge ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={
                      dailyChallenge.challenge_tier === "Quick" ? "default" :
                      dailyChallenge.challenge_tier === "Core" ? "secondary" :
                      "outline"
                    }>
                      {dailyChallenge.challenge_tier}
                    </Badge>
                    <span>•</span>
                    <span>Day {dailyChallenge.day_in_rotation} of 30</span>
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

            <TabsContent value="chef">
              <Card>
                <CardContent className="py-8 text-center space-y-4">
                  <ChefHat className="w-16 h-16 mx-auto text-orange-600" />
                  <h3 className="text-2xl font-bold">Chef Challenge</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create "biblical recipes" – coherent mini-sermons using only Bible verse references
                  </p>
                  <Button onClick={() => navigate("/chef-challenge")} size="lg">
                    Start Chef Challenge
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equations">
              <Card>
                <CardContent className="py-8 text-center space-y-4">
                  <Calculator className="w-16 h-16 mx-auto text-primary" />
                  <h3 className="text-2xl font-bold">Equations Challenge</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Decode biblical equations using palace principles and symbols
                  </p>
                  <Button onClick={() => navigate("/equations-challenge")} size="lg">
                    Start Equations Challenge
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenges;
