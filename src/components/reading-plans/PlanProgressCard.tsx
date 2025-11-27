import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Book, Calendar, Clock, Play, LogIn, Building2, Layers, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanProgressCardProps {
  plan: {
    id: string;
    name: string;
    description: string | null;
    duration_days: number;
    plan_type: string;
    depth_mode: string;
    daily_schedule: any;
  };
  userProgress?: {
    current_day: number;
    last_completed_day: number;
  } | null;
  isAuthenticated: boolean;
  hasActivePlan: boolean;
  onStartPlan: (planId: string) => void;
}

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

export function PlanProgressCard({ 
  plan, 
  userProgress, 
  isAuthenticated, 
  hasActivePlan,
  onStartPlan 
}: PlanProgressCardProps) {
  const navigate = useNavigate();
  const FloorIcon = getPTFloorIcon(plan.depth_mode);
  const bookName = plan.daily_schedule?.book || plan.name.split(' ')[0];
  
  const progressPercent = userProgress 
    ? Math.round((userProgress.current_day / plan.duration_days) * 100)
    : 0;
  
  const hasStarted = userProgress && userProgress.current_day > 1;
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.02] border-2 relative">
      {/* Progress indicator badge */}
      {hasStarted && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-primary text-primary-foreground">
            {progressPercent}% complete
          </Badge>
        </div>
      )}
      
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

      {/* Progress bar for plans user has started */}
      {hasStarted && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Day {userProgress.current_day} of {plan.duration_days}</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

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

      {isAuthenticated ? (
        <Button 
          className="w-full" 
          onClick={() => onStartPlan(plan.id)}
        >
          {hasStarted ? "Continue" : hasActivePlan ? "Switch to This Plan" : "Start Plan"}
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
}
