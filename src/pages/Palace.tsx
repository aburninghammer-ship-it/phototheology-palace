import { Navigation } from "@/components/Navigation";
import { VisualPalace } from "@/components/VisualPalace";
import { palaceFloors } from "@/data/palaceData";
import { Building2, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { Link } from "react-router-dom";

const Palace = () => {
  const { user } = useAuth();
  const { progress } = useCourseProgress("Memory Palace");
  
  const totalRooms = 38;
  const completedRooms = progress?.completed_lessons?.length || 0;
  const progressPercentage = progress?.progress_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-palace border border-white/10 mb-4 shadow-lg">
              <Building2 className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">The Master System</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 bg-gradient-palace bg-clip-text text-transparent">
              The Eight-Floor Palace
            </h1>
            
            <p className="text-xl text-foreground max-w-2xl mx-auto mb-6">
              Master Bible typology through our revolutionary <strong>8-floor, 38-room memory system</strong>. See Christ everywhere in Scripture.
            </p>

            {user && (
              <Card className="max-w-md mx-auto mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium">Your Progress</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {completedRooms} / {totalRooms} rooms
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {progressPercentage}% complete
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button asChild size="lg" className="gradient-palace text-white">
                <Link to={user ? "/games/palace_quiz" : "/auth"}>
                  <Building2 className="mr-2 h-4 w-4" />
                  {user ? "Continue Learning" : "Start Your Journey"}
                </Link>
              </Button>
              {progress?.completed_at && (
                <Button asChild size="lg" variant="outline">
                  <Link to="/certificates">
                    <Award className="mr-2 h-4 w-4" />
                    View Certificate
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Palace Metaphor */}
          <div className="mb-12 p-6 rounded-lg bg-card border border-border shadow-elegant">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-center">
              The Palace Metaphor
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="mb-2">
                  <strong className="text-foreground">The 1st Floor</strong> fills your shelves with stories and images (width).
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 2nd Floor</strong> trains you as a detective with magnifying glass in hand.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 3rd Floor</strong> teaches freestyle, spontaneous connections in daily life.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 4th Floor</strong> expands depth through Christ-centered, dimensional study.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-foreground">The 5th Floor</strong> opens the prophetic telescope.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 6th Floor</strong> situates everything in the cycles of history and the heavens.
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">The 7th Floor</strong> brings heart and soul into the fire of experience.
                </p>
                <p>
                  <strong className="text-foreground">The 8th Floor</strong> removes the scaffolding altogether: Phototheology becomes reflexive thought.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Palace */}
          <div className="mb-12">
            <VisualPalace />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palace;
