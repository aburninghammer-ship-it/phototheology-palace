import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Flame, Trophy, Clock, Share2 } from "lucide-react";

const DailyChallenges = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [submission, setSubmission] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDailyChallenge();
    }
  }, [user]);

  const fetchDailyChallenge = async () => {
    // Get current date in user's timezone, but set to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_type", "daily")
      .gte("starts_at", today.toISOString())
      .lt("starts_at", tomorrow.toISOString())
      .maybeSingle();

    if (error) {
      console.error("Error fetching challenge:", error);
    }

    setDailyChallenge(data);
    
    // Check submission after we have the challenge data
    if (data) {
      const { data: submission } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("challenge_id", data.id)
        .eq("user_id", user!.id)
        .maybeSingle();

      setHasSubmitted(!!submission);
    }
  };

  const handleSubmit = async () => {
    if (!dailyChallenge || !submission.trim()) return;

    try {
      const { error } = await supabase
        .from("challenge_submissions")
        .insert({
          challenge_id: dailyChallenge.id,
          user_id: user!.id,
          content: submission,
        });

      if (error) throw error;

      toast({
        title: "Submission received!",
        description: "Jeeves will review your study shortly.",
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
    const inviteUrl = `${window.location.origin}/daily-challenges`;
    const shareData = {
      title: dailyChallenge?.title || 'Daily Bible Challenge',
      text: `Join me in today's Bible study challenge on Phototheology! ${dailyChallenge?.description || 'Study Scripture together and grow in faith.'}`,
      url: inviteUrl
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: "Invitation copied!",
        description: "Share link copied to clipboard. Send it to your friends!",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Daily Challenges
            </h1>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Invite Friends
            </Button>
          </div>

          {dailyChallenge ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {dailyChallenge.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      Today's Challenge
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{dailyChallenge.description}</p>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Verses to Study:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {dailyChallenge.verses.map((verse: string, idx: number) => (
                      <li key={idx}>{verse}</li>
                    ))}
                  </ul>
                </div>

                {!hasSubmitted ? (
                  <>
                    <Textarea
                      placeholder="Share your study insights here..."
                      value={submission}
                      onChange={(e) => setSubmission(e.target.value)}
                      rows={8}
                    />
                    <Button onClick={handleSubmit} className="w-full">
                      Submit Your Study
                    </Button>
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-green-800 dark:text-green-200">
                      ✓ You've submitted today's challenge! Check back tomorrow for a new challenge.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No active challenge right now. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DailyChallenges;
