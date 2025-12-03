import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { Lock, Unlock, CheckCircle, Target, BookOpen, Brain, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface MonthlyGateProps {
  onStartAssessment?: () => void;
}

export function MonthlyGateCard({ onStartAssessment }: MonthlyGateProps) {
  const { activePath, isLoading: pathLoading } = usePath();
  const [isStarting, setIsStarting] = useState(false);

  // Fetch current month's gate status
  const { data: gateStatus, isLoading: gateLoading } = useQuery({
    queryKey: ["monthly-gate", activePath?.id],
    queryFn: async () => {
      if (!activePath) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("monthly_gates")
        .select("*")
        .eq("user_id", user.id)
        .eq("path_type", activePath.path_type)
        .eq("year", activePath.current_year)
        .eq("month", activePath.current_month)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!activePath,
  });

  if (pathLoading || gateLoading || !activePath) {
    return null;
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];
  const isGatePassed = gateStatus?.passed === true;
  const attempts = gateStatus?.attempts || 0;

  // Monthly gate requirements based on path
  const getGateRequirements = () => {
    const baseRequirements = [
      { icon: BookOpen, label: "Complete 4 Palace rooms", done: true },
      { icon: Brain, label: "Score 70%+ on 3 drills", done: true },
      { icon: Target, label: "Pass monthly assessment", done: isGatePassed },
    ];

    // Add path-specific requirement
    switch (pathType) {
      case 'visual':
        baseRequirements.push({ icon: Sparkles, label: "Create 2 memory images", done: true });
        break;
      case 'analytical':
        baseRequirements.push({ icon: Sparkles, label: "Complete pattern analysis", done: true });
        break;
      case 'devotional':
        baseRequirements.push({ icon: Sparkles, label: "Journal 5 reflections", done: true });
        break;
      case 'warrior':
        baseRequirements.push({ icon: Sparkles, label: "Win 3 speed challenges", done: true });
        break;
    }

    return baseRequirements;
  };

  const requirements = getGateRequirements();
  const completedCount = requirements.filter(r => r.done).length;
  const progressPercentage = (completedCount / requirements.length) * 100;

  const handleStartAssessment = async () => {
    setIsStarting(true);
    // Create gate record if doesn't exist
    if (!gateStatus) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("monthly_gates").insert({
          user_id: user.id,
          path_type: activePath.path_type,
          year: activePath.current_year,
          month: activePath.current_month,
        });
      }
    }
    setIsStarting(false);
    onStartAssessment?.();
  };

  return (
    <Card className={`${pathData.bgColor} border ${pathData.borderColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isGatePassed ? (
              <Unlock className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-amber-500" />
            )}
            Month {activePath.current_month} Gate
          </CardTitle>
          <Badge variant={isGatePassed ? "default" : "secondary"}>
            {isGatePassed ? "Passed" : `${attempts} attempts`}
          </Badge>
        </div>
        <CardDescription>
          Complete requirements to advance to the next month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedCount} of {requirements.length} requirements</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Requirements List */}
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div 
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                req.done ? 'bg-green-500/10' : 'bg-muted/50'
              }`}
            >
              {req.done ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <req.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${req.done ? 'text-green-700 dark:text-green-300' : ''}`}>
                {req.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {!isGatePassed && (
          <Button 
            className="w-full" 
            onClick={handleStartAssessment}
            disabled={isStarting || progressPercentage < 75}
          >
            {progressPercentage < 75 ? (
              "Complete more requirements first"
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Take Assessment
              </>
            )}
          </Button>
        )}

        {isGatePassed && (
          <div className="text-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
            Gate passed! Ready for Month {activePath.current_month + 1}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
