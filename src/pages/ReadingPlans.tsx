import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, Calendar, Clock, Play, LogIn, Building2, BookOpen, Layers, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReadingPlans() {
  const { plans, userProgress, loading, startPlan } = useReadingPlans();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDifficultyColor = (depthMode: string) => {
    switch (depthMode) {
      case "standard": return "bg-primary/10 text-primary border-primary/20";
      case "focused": return "bg-accent/10 text-accent border-accent/20";
      case "deep": return "bg-secondary/10 text-secondary border-secondary/20";
      default: return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getPTFloorIcon = (depthMode: string) => {
    switch (depthMode) {
      case "standard": return { icon: Layers, label: "Floors 1-3" };
      case "focused": return { icon: Building2, label: "Floors 1-5" };
      case "deep": return { icon: Target, label: "All 8 Floors" };
      default: return { icon: BookOpen, label: "Basic" };
    }
  };

  const handleStartPlan = async (planId: string) => {
    await startPlan(planId);
  };

  const bookPlans = plans.filter(p => p.plan_type === 'book-monthly');
  const yearPlans = plans.filter(p => p.plan_type !== 'book-monthly');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading reading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Phototheology Reading Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Journey through Scripture using the 8-Floor Palace method
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Interactive Floor Exercises</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Christ-Centered Study</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Room-by-Room Learning</span>
            </div>
          </div>
        </div>

        {/* Active Plan Banner */}
        {userProgress && (
          <Card className="mb-8 p-6 border-primary bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Your Current Plan
                </h3>
                <p className="text-muted-foreground">
                  Day {userProgress.current_day} of your reading journey
                </p>
              </div>
              <Button onClick={() => navigate("/daily-reading")}>
                Continue Reading
              </Button>
            </div>
          </Card>
        )}

        {/* Plans Tabs */}
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Monthly Book Plans
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Year-Long Plans
            </TabsTrigger>
          </TabsList>

          {/* Monthly Book Plans */}
          <TabsContent value="monthly">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Master One Book at a Time</h2>
              <p className="text-muted-foreground">
                Spend a month deeply exploring a single Bible book with daily Palace exercises
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookPlans.map((plan) => {
                const FloorIcon = getPTFloorIcon(plan.depth_mode);
                const bookName = plan.daily_schedule?.book || plan.name.split(' ')[0];
                
                return (
                  <Card key={plan.id} className="p-6 hover:shadow-lg transition-all hover:scale-105 border-2">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Book className="h-8 w-8 text-primary" />
                          <span className="text-2xl font-bold text-primary">{bookName}</span>
                        </div>
                        <Badge className={getDifficultyColor(plan.depth_mode)}>
                          {plan.depth_mode}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{plan.duration_days} days</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span>{plan.daily_schedule?.estimated_time_minutes || 20} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <FloorIcon.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{FloorIcon.label}</span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        ~{Math.round((plan.daily_schedule?.chapters_per_day || 1) * 10) / 10} chapters/day
                      </div>
                    </div>

                    {user ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartPlan(plan.id)}
                      >
                        {userProgress ? "Switch to This Plan" : "Start Plan"}
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate('/auth')}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in to Start
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Year-Long Plans */}
          <TabsContent value="yearly">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Complete Bible Journey</h2>
              <p className="text-muted-foreground">
                Read through the entire Bible with structured Palace study over a full year
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearPlans.map((plan) => {
                const FloorIcon = getPTFloorIcon(plan.depth_mode);
                
                return (
                  <Card key={plan.id} className="p-6 hover:shadow-lg transition-all hover:scale-105 border-2">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Book className="h-8 w-8 text-primary" />
                        <Badge className={getDifficultyColor(plan.depth_mode)}>
                          {plan.depth_mode}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{plan.duration_days} days</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>~{plan.daily_schedule?.estimated_time_minutes || 20} min/day</span>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <FloorIcon.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{FloorIcon.label}</span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Book className="h-4 w-4 mr-2 text-primary" />
                        <span>{plan.plan_type === "complete" ? "Complete Bible" : plan.plan_type}</span>
                      </div>
                    </div>

                    {user ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartPlan(plan.id)}
                      >
                        {userProgress ? "Switch to This Plan" : "Start Plan"}
                        <Play className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate('/auth')}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in to Start
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {plans.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No reading plans available yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
