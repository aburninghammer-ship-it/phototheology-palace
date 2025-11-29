import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { usePalaceProgress } from "@/hooks/usePalaceProgress";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { 
  Building2, 
  Flame, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  Church
} from "lucide-react";

interface NextRoom {
  floorNumber: number;
  floorName: string;
  roomId: string;
  roomName: string;
  roomTag: string;
  reason: string;
}

const roleIcons = {
  teacher: GraduationCap,
  student: BookOpen,
  personal: Users,
  church_leader: Church,
};

const roleRecommendations: Record<string, (completedRooms: Set<string>) => NextRoom[]> = {
  teacher: (completed) => {
    const recs: NextRoom[] = [];
    
    if (!completed.has("1-sr")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "sr",
        roomName: "Story Room",
        roomTag: "SR",
        reason: "Master storytelling fundamentals—essential for teaching Scripture narratively"
      });
    }
    
    if (completed.has("1-sr") && !completed.has("4-cr")) {
      recs.push({
        floorNumber: 4,
        floorName: "Next Level Floor",
        roomId: "cr",
        roomName: "Concentration Room",
        roomTag: "CR",
        reason: "Learn to center every lesson on Christ—core of biblical teaching"
      });
    }
    
    if (completed.has("4-cr") && !completed.has("4-drm")) {
      recs.push({
        floorNumber: 4,
        floorName: "Next Level Floor",
        roomId: "drm",
        roomName: "Dimensions Room",
        roomTag: "DR",
        reason: "Unlock multi-dimensional interpretation for richer teaching"
      });
    }
    
    return recs;
  },
  
  student: (completed) => {
    const recs: NextRoom[] = [];
    
    if (!completed.has("1-sr")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "sr",
        roomName: "Story Room",
        roomTag: "SR",
        reason: "Build your foundation—memorize Bible stories in sequence"
      });
    }
    
    if (completed.has("1-sr") && !completed.has("1-24fps")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "24fps",
        roomName: "24FPS Room",
        roomTag: "24",
        reason: "Create visual memory anchors for every chapter"
      });
    }
    
    if (completed.has("1-24fps") && !completed.has("2-or")) {
      recs.push({
        floorNumber: 2,
        floorName: "Investigation Floor",
        roomId: "or",
        roomName: "Observation Room",
        roomTag: "OR",
        reason: "Sharpen your observation skills—see what others miss"
      });
    }
    
    return recs;
  },
  
  personal: (completed) => {
    const recs: NextRoom[] = [];
    
    if (!completed.has("1-sr")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "sr",
        roomName: "Story Room",
        roomTag: "SR",
        reason: "Start your personal journey—learn Scripture's storyline"
      });
    }
    
    if (completed.has("1-sr") && !completed.has("1-ir")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "ir",
        roomName: "Imagination Room",
        roomTag: "IR",
        reason: "Experience Scripture emotionally—step inside the stories"
      });
    }
    
    if (completed.has("1-ir") && !completed.has("3-pf")) {
      recs.push({
        floorNumber: 3,
        floorName: "Freestyle Floor",
        roomId: "pf",
        roomName: "Personal Freestyle",
        roomTag: "PF",
        reason: "Connect Scripture to your daily life and experiences"
      });
    }
    
    return recs;
  },
  
  church_leader: (completed) => {
    const recs: NextRoom[] = [];
    
    if (!completed.has("1-sr")) {
      recs.push({
        floorNumber: 1,
        floorName: "Furnishing Floor",
        roomId: "sr",
        roomName: "Story Room",
        roomTag: "SR",
        reason: "Build storytelling mastery for your congregation"
      });
    }
    
    if (completed.has("1-sr") && !completed.has("4-cr")) {
      recs.push({
        floorNumber: 4,
        floorName: "Next Level Floor",
        roomId: "cr",
        roomName: "Concentration Room",
        roomTag: "CR",
        reason: "Ensure every sermon centers on Christ"
      });
    }
    
    if (completed.has("4-cr") && !completed.has("5-bl")) {
      recs.push({
        floorNumber: 5,
        floorName: "Vision Floor",
        roomId: "bl",
        roomName: "Blue Room (Sanctuary)",
        roomTag: "BL",
        reason: "Master the sanctuary framework for teaching salvation"
      });
    }
    
    return recs;
  }
};

export function PalaceProgressDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { completedRooms, totalRooms, progressPercentage, loading: progressLoading } = usePalaceProgress();
  const [userRole, setUserRole] = useState<string>("personal");
  const [streak, setStreak] = useState(0);
  const [recommendations, setRecommendations] = useState<NextRoom[]>([]);
  const [completedRoomSet, setCompletedRoomSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      // Fetch profile for streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_study_streak, primary_role")
        .eq("id", user.id)
        .single();
      
      // Fetch completed rooms
      const { data: completed } = await supabase
        .from("room_progress")
        .select("floor_number, room_id")
        .eq("user_id", user.id)
        .not("completed_at", "is", null);
      
      const role = roleData?.role || profile?.primary_role || "personal";
      setUserRole(role);
      setStreak(profile?.daily_study_streak || 0);
      
      const completedSet = new Set(
        completed?.map(r => `${r.floor_number}-${r.room_id}`) || []
      );
      setCompletedRoomSet(completedSet);
      
      // Generate recommendations
      const getRecommendations = roleRecommendations[role] || roleRecommendations.personal;
      const recs = getRecommendations(completedSet);
      setRecommendations(recs.slice(0, 3));
      
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || Users;

  if (loading || progressLoading) {
    return <Card className="animate-pulse h-96" />;
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Palace Progress
              </CardTitle>
              <CardDescription>Track your journey through the Eight-Floor Palace</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <RoleIcon className="h-3.5 w-3.5" />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1).replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedRooms} / {totalRooms} rooms
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/palace")}
            >
              View Full Palace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Steps */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>
            Based on your {userRole.replace('_', ' ')} role and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={`${rec.floorNumber}-${rec.roomId}`}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/palace/floor/${rec.floorNumber}/room/${rec.roomId}`)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {rec.roomTag}
                      </Badge>
                      <h4 className="font-semibold text-sm">{rec.roomName}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {rec.floorName}
                    </p>
                    <p className="text-sm">{rec.reason}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">Amazing progress!</p>
              <p className="text-sm">Continue exploring the palace at your own pace.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floor Progress Breakdown */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Progress by Floor</CardTitle>
          <CardDescription>See how you're advancing through each level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {palaceFloors.map((floor) => {
              const floorCompletedCount = floor.rooms.filter((room) =>
                completedRoomSet.has(`${floor.number}-${room.id}`)
              ).length;
              const floorProgress = (floorCompletedCount / floor.rooms.length) * 100;

              return (
                <div key={floor.number} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Floor {floor.number}</span>
                      <span className="text-sm text-muted-foreground">— {floor.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {floorCompletedCount} / {floor.rooms.length}
                    </span>
                  </div>
                  <Progress value={floorProgress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
