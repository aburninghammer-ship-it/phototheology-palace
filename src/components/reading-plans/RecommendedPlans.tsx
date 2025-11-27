import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Book, ArrowRight, TrendingUp } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  duration_days: number;
  plan_type: string;
  depth_mode: string;
  daily_schedule: any;
}

interface RecommendedPlansProps {
  plans: Plan[];
  userActivity?: {
    recentBooks?: string[];
    completedFloors?: number[];
    studyTopics?: string[];
  };
  onSelectPlan: (planId: string) => void;
}

export function RecommendedPlans({ plans, userActivity, onSelectPlan }: RecommendedPlansProps) {
  // Score plans based on user activity
  const getRecommendationScore = (plan: Plan): number => {
    let score = 0;
    
    // Prefer shorter plans for new users
    if (plan.duration_days <= 31) score += 2;
    
    // If user has studied certain books, recommend related plans
    if (userActivity?.recentBooks?.length) {
      const planBook = plan.daily_schedule?.book?.toLowerCase();
      if (planBook) {
        // Recommend plans for books they haven't studied
        if (!userActivity.recentBooks.includes(planBook)) {
          score += 3;
        }
      }
    }
    
    // Match depth mode to user's completed floors
    if (userActivity?.completedFloors?.length) {
      const maxFloor = Math.max(...userActivity.completedFloors);
      if (maxFloor >= 5 && plan.depth_mode === "deep") score += 2;
      else if (maxFloor >= 3 && plan.depth_mode === "focused") score += 2;
      else if (maxFloor < 3 && plan.depth_mode === "standard") score += 2;
    } else {
      // New users get standard plans
      if (plan.depth_mode === "standard") score += 2;
    }
    
    return score;
  };
  
  // Get top 3 recommended plans
  const recommendedPlans = [...plans]
    .map(plan => ({ ...plan, score: getRecommendationScore(plan) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  if (recommendedPlans.length === 0) return null;

  const getRecommendationReason = (plan: Plan & { score: number }): string => {
    if (plan.duration_days <= 31) return "Great for focused study";
    if (plan.depth_mode === "standard") return "Perfect for beginners";
    if (plan.depth_mode === "deep") return "For advanced Palace students";
    return "Popular choice";
  };

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Recommended for You</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {recommendedPlans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] ${
              index === 0 ? 'border-primary border-2' : 'border'
            }`}
            onClick={() => onSelectPlan(plan.id)}
          >
            {index === 0 && (
              <Badge className="mb-2 bg-primary text-primary-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                Top Pick
              </Badge>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <Book className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground text-sm">{plan.name}</h4>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {plan.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-medium">
                {getRecommendationReason(plan)}
              </span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
