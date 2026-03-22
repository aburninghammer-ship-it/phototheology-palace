import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { CommunityChallengeFeed } from "@/components/challenges/CommunityChallengeFeed";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityChallengeFeedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Challenge Leaderboard | Phototheology Palace"
        description="See how the community ranks on Chef, Equation, and Daily challenges — scored by Jeeves."
      />
      <Navigation />
      <main className="container mx-auto px-4 pt-36 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Challenge Leaderboard</h1>
              <p className="text-muted-foreground text-sm">
                Community submissions ranked by Jeeves — top scores first
              </p>
            </div>
            <Button onClick={() => navigate("/daily-challenges")} className="ml-auto gap-2">
              <Flame className="h-4 w-4" />
              Take a Challenge
            </Button>
          </div>

          <CommunityChallengeFeed />
        </div>
      </main>
    </div>
  );
};

export default CommunityChallengeFeedPage;
