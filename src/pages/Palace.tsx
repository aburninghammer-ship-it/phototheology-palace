import { Navigation } from "@/components/Navigation";
import { VisualPalace } from "@/components/VisualPalace";
import { ProgressivePalace } from "@/components/palace/ProgressivePalace";
import { Palace3DViewer } from "@/components/palace/Palace3DViewer";
import { PalaceBreadcrumbs } from "@/components/palace/PalaceBreadcrumbs";
import { PalaceTour } from "@/components/onboarding/PalaceTour";
import { palaceFloors } from "@/data/palaceData";
import { Building2, Award, TrendingUp, BookOpen, Target, LayoutGrid, List, Box } from "lucide-react";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { palaceSteps } from "@/config/howItWorksSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { usePalaceTour } from "@/hooks/usePalaceTour";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const Palace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { completedRooms, completedRoomIds, totalRooms, progressPercentage, loading } = usePalaceProgress();
  const { showTour, loading: tourLoading, completeTour, skipTour } = usePalaceTour();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"explore" | "progress">("explore");
  const [viewMode, setViewMode] = useState<"visual" | "list" | "3d">("list"); // Default to progressive list for new users

  const handleTourComplete = () => {
    completeTour();
    toast.success("🏛️ Palace Explorer badge earned!", {
      description: "Now explore the Story Room to begin your journey.",
    });
    navigate("/palace/floor/1/room/sr");
  };

  const handleTourSkip = () => {
    skipTour();
  };

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

  // Handle subscription success celebration
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');

    if (subscriptionStatus === 'success') {
      // Trigger celebration confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#9b87f5', '#7E69AB', '#FFD700', '#FFA500', '#FF6B6B'],
        });
      }, 250);

      toast.success("Welcome to PhotoTheology!", {
        description: "Your subscription is active. Enjoy full access to the Palace!",
      });

      // Clear the URL parameter
      navigate('/palace', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Palace Tour for first-time visitors */}
      {showTour && !tourLoading && (
        <PalaceTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}
      
      <div className="pt-20 md:pt-24 pb-24 md:pb-16 px-3 md:px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <PalaceBreadcrumbs />

          {/* Hero Header - Mobile Optimized */}
          <div className="text-center mb-6 md:mb-8">
            <img
              src="/pwa-192x192.png"
              alt="Phototheology"
              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-lg shadow-primary/20 mx-auto mb-3 md:mb-4"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full gradient-palace border border-white/20 mb-3 md:mb-4 shadow-lg">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <span className="text-xs md:text-sm font-semibold text-white">The Master System</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-palace bg-clip-text text-transparent leading-tight">
              The Eight-Floor Palace
            </h1>

            <p className="text-base md:text-xl text-foreground max-w-2xl mx-auto mb-4 px-2">
              Master Bible typology through our revolutionary <strong>8-floor, 38-room memory system</strong>. See Christ everywhere in Scripture.
            </p>

            <div className="flex justify-center mb-4 md:mb-6">
              <HowItWorksDialog title="How to Use the Palace" steps={palaceSteps} />
            </div>

            {user && !loading && (
              <Card variant="glass" className="max-w-md mx-auto mb-4 md:mb-6">
                <CardContent className="p-4 md:pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm md:text-base">Your Progress</span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {completedRooms} / {totalRooms} rooms
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="mb-2 h-2 md:h-2.5" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {progressPercentage}% complete
                  </p>
                </CardContent>
              </Card>
            )}

            {user && (
              <VoiceChatWidget
                roomType="palace"
                roomId="main"
                className="max-w-md mx-auto mb-4 md:mb-6"
              />
            )}

            {/* Mobile-friendly button layout */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
              <Button asChild size="lg" className="gradient-palace text-white h-12 md:h-11 text-base">
                <Link to={user ? "/games/palace_quiz" : "/auth"}>
                  <Building2 className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                  {user ? "Continue Learning" : "Start Your Journey"}
                </Link>
              </Button>
              {completedRooms === totalRooms && (
                <Button asChild size="lg" variant="outline" className="h-12 md:h-11 text-base">
                  <Link to="/certificates">
                    <Award className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                    View Certificate
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Palace Metaphor - Mobile Optimized */}
          <Card variant="glassSubtle" className="mb-6 md:mb-8 p-4 md:p-6">
            <h2 className="font-serif text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">
              The Palace Metaphor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-muted-foreground">
              <div className="space-y-1 md:space-y-2">
                <Link to="/palace/floor/1" id="floor-1" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">1st Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Stories and images (width)</span>
                </Link>
                <Link to="/palace/floor/2" id="floor-2" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">2nd Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Detective with magnifying glass</span>
                </Link>
                <Link to="/palace/floor/3" id="floor-3" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">3rd Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Freestyle, spontaneous connections</span>
                </Link>
                <Link to="/palace/floor/4" id="floor-4" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">4th Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Christ-centered, dimensional study</span>
                </Link>
              </div>
              <div className="space-y-1 md:space-y-2">
                <Link to="/palace/floor/5" id="floor-5" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">5th Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">The prophetic telescope</span>
                </Link>
                <Link to="/palace/floor/6" id="floor-6" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">6th Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Cycles of history and heavens</span>
                </Link>
                <Link to="/palace/floor/7" id="floor-7" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">7th Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Heart and soul into fire of experience</span>
                </Link>
                <Link to="/palace/floor/8" id="floor-8" className="block scroll-mt-24 hover:bg-accent/50 active:bg-accent/70 p-3 md:p-2 rounded-lg md:rounded-md transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <strong className="text-foreground">8th Floor</strong> <span className="hidden sm:inline">-</span> <span className="block sm:inline mt-0.5 sm:mt-0">Reflexive thought mastery</span>
                </Link>
              </div>
            </div>
          </Card>

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
              {/* View Mode Toggle */}
              <div className="flex justify-end gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  Guided
                </Button>
                <Button
                  variant={viewMode === "visual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("visual")}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Full
                </Button>
                <Button
                  variant={viewMode === "3d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("3d")}
                  className={viewMode === "3d" ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <Box className="h-4 w-4 mr-2" />
                  3D
                </Button>
              </div>
              
              {/* Palace Display */}
              <div className="mb-12">
                {viewMode === "list" ? (
                  <ProgressivePalace showStartHere={progressPercentage < 20} />
                ) : viewMode === "visual" ? (
                  <VisualPalace />
                ) : (
                  <div className="h-[700px]">
                    <Palace3DViewer
                      unlockedRooms={new Set(completedRoomIds)}
                      onClose={() => setViewMode("list")}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Progress Overview */}
              <Card variant="glass">
                <CardContent className="pt-6 space-y-6 relative z-10">
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

                      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                        <Button asChild size="lg" variant="secondary">
                          <Link to="/mastery?tab=map">
                            <Target className="mr-2 h-4 w-4" />
                            Choose Room to Master
                          </Link>
                        </Button>
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
