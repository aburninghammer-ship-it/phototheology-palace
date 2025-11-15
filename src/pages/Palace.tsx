import { Navigation } from "@/components/Navigation";
import { VisualPalace } from "@/components/VisualPalace";
import { palaceFloors } from "@/data/palaceData";
import { Building2, Award, TrendingUp, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";

const Palace = () => {
  const { user } = useAuth();
  const { completedRooms, totalRooms, progressPercentage, loading } = usePalaceProgress();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"explore" | "progress">("explore");

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam) {
      // Find which floor this room belongs to
      const floorNumber = palaceFloors.findIndex(floor => 
        floor.rooms.some(room => room.tag === roomParam)
      ) + 1;
      
      if (floorNumber > 0) {
        // Scroll to that floor
        setTimeout(() => {
          const floorElement = document.getElementById(`floor-${floorNumber}`);
          if (floorElement) {
            floorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-palace border border-white/20 mb-4 shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">The Master System</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 bg-gradient-palace bg-clip-text text-transparent">
              The Eight-Floor Palace
            </h1>
            
            <p className="text-xl text-foreground max-w-2xl mx-auto mb-6">
              Master Bible typology through our revolutionary <strong>8-floor, 38-room memory system</strong>. See Christ everywhere in Scripture.
            </p>

            {user && !loading && (
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
              {completedRooms === totalRooms && (
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
          <div className="mb-8 p-6 rounded-lg bg-card border border-border shadow-elegant">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-center">
              The Palace Metaphor
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p id="floor-1" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 1st Floor</strong> fills your shelves with stories and images (width).
                </p>
                <p id="floor-2" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 2nd Floor</strong> trains you as a detective with magnifying glass in hand.
                </p>
                <p id="floor-3" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 3rd Floor</strong> teaches freestyle, spontaneous connections in daily life.
                </p>
                <p id="floor-4" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 4th Floor</strong> expands depth through Christ-centered, dimensional study.
                </p>
              </div>
              <div>
                <p id="floor-5" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 5th Floor</strong> opens the prophetic telescope.
                </p>
                <p id="floor-6" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 6th Floor</strong> situates everything in the cycles of history and the heavens.
                </p>
                <p id="floor-7" className="mb-2 scroll-mt-24">
                  <strong className="text-foreground">The 7th Floor</strong> brings heart and soul into the fire of experience.
                </p>
                <p id="floor-8" className="scroll-mt-24">
                  <strong className="text-foreground">The 8th Floor</strong> removes the scaffolding altogether: Phototheology becomes reflexive thought.
                </p>
              </div>
            </div>
          </div>

          {/* Mode Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "explore" | "progress")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explore">
                <Building2 className="h-4 w-4 mr-2" />
                Explore Palace
              </TabsTrigger>
              <TabsTrigger value="progress">
                <Target className="h-4 w-4 mr-2" />
                Your Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              {/* Visual Palace */}
              <div className="mb-12">
                <VisualPalace />
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Your Journey Through the Palace</h3>
                    <p className="text-muted-foreground">Track your progress as you master each room</p>
                  </div>

                  {user ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-medium text-lg">Overall Progress</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {completedRooms} / {totalRooms} rooms
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3 mb-2" />
                      <p className="text-center text-2xl font-bold text-primary">
                        {progressPercentage}% Complete
                      </p>

                      {/* Floor-by-Floor Breakdown */}
                      <div className="mt-8 space-y-4">
                        <h4 className="font-semibold text-lg mb-4">Progress by Floor</h4>
                        {palaceFloors.map((floor, index) => {
                          const floorRoomsTotal = floor.rooms.length;
                          const floorRoomsCompleted = floor.rooms.filter(room => 
                            // This would need actual completion data - simplified for now
                            false
                          ).length;
                          const floorProgress = floorRoomsTotal > 0 ? (floorRoomsCompleted / floorRoomsTotal) * 100 : 0;
                          
                          return (
                            <div key={floor.number} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{floor.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {floorRoomsCompleted} / {floorRoomsTotal} rooms
                                </span>
                              </div>
                              <Progress value={floorProgress} className="h-2" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 justify-center mt-8">
                        <Button asChild size="lg" className="gradient-palace text-white">
                          <Link to="/games/palace_quiz">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Continue Training
                          </Link>
                        </Button>
                        {completedRooms === totalRooms && (
                          <Button asChild size="lg" variant="outline">
                            <Link to="/certificates">
                              <Award className="mr-2 h-4 w-4" />
                              View Certificate
                            </Link>
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg mb-4">Sign in to track your progress through the Palace</p>
                      <Button asChild size="lg" className="gradient-palace text-white">
                        <Link to="/auth">
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Palace;
