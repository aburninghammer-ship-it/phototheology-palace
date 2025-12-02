import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassBubbles } from "@/components/ui/glass-bubbles";
import { useReadingPlans } from "@/hooks/useReadingPlans";
import { useNavigate } from "react-router-dom";
import { Book, Building2, BookOpen, Plus, Play } from "lucide-react";
import { useProcessTracking } from "@/contexts/ProcessTrackingContext";
import { JeevesContinuityPrompt } from "@/components/continuity/JeevesContinuityPrompt";
import { toast } from "sonner";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { readingPlansSteps } from "@/config/howItWorksSteps";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { PlanProgressCard } from "@/components/reading-plans/PlanProgressCard";
import { RecommendedPlans } from "@/components/reading-plans/RecommendedPlans";
import { CustomPlanBuilder } from "@/components/reading-plans/CustomPlanBuilder";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Layers } from "lucide-react";

export default function ReadingPlans() {
  const { plans, userProgress, allProgress, loading, startPlan, refetch, refetchProgress } = useReadingPlans();
  const { user } = useAuth();
  const { trackProcess, clearProcess } = useProcessTracking();
  const navigate = useNavigate();
  const activePlan = userProgress ? plans.find((p) => p.id === userProgress.plan_id) : null;
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  const [showTranslationDialog, setShowTranslationDialog] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const handleOpenTranslationDialog = (planId: string) => {
    setSelectedPlanId(planId);
    setShowTranslationDialog(true);
  };

  const handleStartPlan = async () => {
    if (!selectedPlanId) return;
    const plan = plans.find(p => p.id === selectedPlanId);
    await startPlan(selectedPlanId, selectedTranslation);
    await refetchProgress();
    
    // Track process
    if (plan) {
      trackProcess({
        process: plan.name,
        totalSteps: plan.duration_days,
        step: 1,
        taskType: "reading_plan",
        notes: `${plan.name} - ${selectedTranslation}`,
      });
    }
    
    setShowTranslationDialog(false);
    navigate("/daily-reading");
  };

  const handlePlanCreated = () => {
    refetch();
  };

  const bookPlans = plans.filter(p => p.plan_type === 'book-monthly');
  const yearPlans = plans.filter(p => p.plan_type !== 'book-monthly' && p.plan_type !== 'custom');
  const customPlans = plans.filter(p => p.plan_type === 'custom');

  // Calculate active plan progress
  const activeProgressPercent = userProgress && activePlan 
    ? Math.round((userProgress.current_day / activePlan.duration_days) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-lg" />
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Continuity Prompt */}
        {user && (
          <JeevesContinuityPrompt
            feature="reading plan"
            onResume={() => navigate("/daily-reading")}
            onRestart={() => {
              clearProcess();
              toast.info("Choose a new plan to restart");
            }}
            onStartNew={() => {
              clearProcess();
              toast.info("Select a new reading plan below");
            }}
            onSkip={() => clearProcess()}
          />
        )}
        
        {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Phototheology Reading Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Journey through Scripture using the 8-Floor Palace method
          </p>
          <div className="flex justify-center mb-4">
            <HowItWorksDialog title="How to Use Reading Plans" steps={readingPlansSteps} />
          </div>
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

        {/* Active Plan Banner with Progress */}
        {userProgress && activePlan && (
          <Card variant="glass" className="mb-8 p-6">
            <GlassBubbles />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Current Plan: {activePlan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Day {userProgress.current_day} of {activePlan.duration_days} days
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={activeProgressPercent} className="h-3 flex-1 max-w-xs" />
                  <span className="text-sm font-medium text-primary">{activeProgressPercent}%</span>
                </div>
              </div>
              <Button onClick={() => navigate("/daily-reading")} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Continue Reading
              </Button>
            </div>
          </Card>
        )}

        {/* Recommended Plans Section */}
        {user && plans.length > 0 && (
          <RecommendedPlans 
            plans={plans}
            userActivity={{
              recentBooks: Object.keys(allProgress).length > 0 
                ? plans
                    .filter(p => allProgress[p.id])
                    .map(p => p.daily_schedule?.book)
                    .filter(Boolean)
                : []
            }}
            onSelectPlan={handleOpenTranslationDialog}
          />
        )}

        {/* Create Custom Plan Button */}
        {user && (
          <div className="flex justify-end mb-6">
            <Button onClick={() => setShowCustomBuilder(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Plan
            </Button>
          </div>
        )}

        {/* Plans Tabs */}
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Year-Long
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              My Plans {customPlans.length > 0 && `(${customPlans.length})`}
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
              {bookPlans.map((plan) => (
                <PlanProgressCard
                  key={plan.id}
                  plan={plan}
                  userProgress={allProgress[plan.id]}
                  isAuthenticated={!!user}
                  hasActivePlan={!!userProgress}
                  onStartPlan={handleOpenTranslationDialog}
                />
              ))}
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
              {yearPlans.map((plan) => (
                <PlanProgressCard
                  key={plan.id}
                  plan={plan}
                  userProgress={allProgress[plan.id]}
                  isAuthenticated={!!user}
                  hasActivePlan={!!userProgress}
                  onStartPlan={handleOpenTranslationDialog}
                />
              ))}
            </div>
          </TabsContent>

          {/* Custom Plans */}
          <TabsContent value="custom">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-foreground">My Custom Plans</h2>
              <p className="text-muted-foreground">
                Your personalized reading plans tailored to your study goals
              </p>
            </div>
            {customPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customPlans.map((plan) => (
                  <PlanProgressCard
                    key={plan.id}
                    plan={plan}
                    userProgress={allProgress[plan.id]}
                    isAuthenticated={!!user}
                    hasActivePlan={!!userProgress}
                    onStartPlan={handleOpenTranslationDialog}
                  />
                ))}
              </div>
            ) : (
              <Card variant="glass" className="p-12 text-center">
                <GlassBubbles />
                <div className="relative z-10">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Custom Plans Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your own reading plan with your choice of books and pace
                  </p>
                  <Button onClick={() => setShowCustomBuilder(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {plans.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <GlassBubbles />
            <p className="text-muted-foreground relative z-10">No reading plans available yet</p>
          </Card>
        )}
      </div>

      {/* Translation Selection Dialog */}
      <Dialog open={showTranslationDialog} onOpenChange={setShowTranslationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Bible Translation</DialogTitle>
            <DialogDescription>
              Select the translation you'd like to use for this reading plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                <SelectTrigger id="translation">
                  <SelectValue placeholder="Select a translation" />
                </SelectTrigger>
                <SelectContent>
                  {BIBLE_TRANSLATIONS.map((translation) => (
                    <SelectItem key={translation.value} value={translation.value}>
                      {translation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTranslationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartPlan}>
              Start Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Plan Builder Dialog */}
      <CustomPlanBuilder
        open={showCustomBuilder}
        onOpenChange={setShowCustomBuilder}
        onPlanCreated={handlePlanCreated}
      />
    </div>
  );
}
