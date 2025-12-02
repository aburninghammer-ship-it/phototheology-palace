import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Lock, Unlock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface NextStepCTAProps {
  currentFloor: number;
  roomsCompleted: number;
  roomsRequired: number;
  nextFloorUnlocked: boolean;
}

export function NextStepCTA({
  currentFloor,
  roomsCompleted,
  roomsRequired,
  nextFloorUnlocked,
}: NextStepCTAProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const progress = (roomsCompleted / roomsRequired) * 100;

  const handleNextFloor = async () => {
    if (user) {
      await supabase.from("user_events").insert({
        user_id: user.id,
        event_type: "next_floor_clicked",
        event_data: { from_floor: currentFloor, to_floor: currentFloor + 1 },
        page_path: window.location.pathname,
      });
    }
    navigate(`/palace/floor/${currentFloor + 1}`);
  };

  const handleContinue = () => {
    navigate(`/palace/floor/${currentFloor}`);
  };

  if (nextFloorUnlocked && currentFloor < 8) {
    return (
      <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Floor {currentFloor + 1} Unlocked!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Congratulations! You've completed Floor {currentFloor}. 
            Ready to explore new rooms and deeper techniques?
          </p>
          <Button onClick={handleNextFloor} className="w-full gradient-palace">
            Enter Floor {currentFloor + 1}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Your Progress
          </CardTitle>
          {currentFloor < 8 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Floor {currentFloor + 1}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Floor {currentFloor} Mastery</span>
            <span className="font-medium">{roomsCompleted}/{roomsRequired} rooms</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <p className="text-sm text-muted-foreground">
          {roomsRequired - roomsCompleted} more room{roomsRequired - roomsCompleted !== 1 ? 's' : ''} to unlock Floor {currentFloor + 1}
        </p>

        <Button onClick={handleContinue} variant="outline" className="w-full">
          Continue Floor {currentFloor}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
