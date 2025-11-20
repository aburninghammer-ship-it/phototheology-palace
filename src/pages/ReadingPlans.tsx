import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, Calendar, Clock, Play, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function ReadingPlans() {
  const { plans, userProgress, loading, startPlan } = useReadingPlans();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDifficultyColor = (depthMode: string) => {
    switch (depthMode) {
      case "standard": return "bg-primary/10 text-primary";
      case "focused": return "bg-accent/10 text-accent";
      case "deep": return "bg-secondary/10 text-secondary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleStartPlan = async (planId: string) => {
    await startPlan(planId);
  };

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
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Phototheology Bible Reading Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Journey through Scripture with structured Palace exercises
          </p>
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

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <Book className="h-4 w-4 mr-2 text-primary" />
                  <span>{plan.daily_schedule?.readings_per_day || 2} readings/day</span>
                </div>
              </div>

              <Button
                onClick={() => user ? handleStartPlan(plan.id) : navigate("/auth")}
                disabled={userProgress !== null}
                className="w-full"
              >
                {!user ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Start
                  </>
                ) : userProgress ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Plan Active
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Plan
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {plans.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No reading plans available yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
