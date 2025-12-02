import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Dumbbell, Brain, Award, Calendar, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProcessState } from "@/hooks/useProcessState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const ContinueTiles = () => {
  const navigate = useNavigate();
  const { processState } = useProcessState();

  // Fetch last drill session
  const { data: lastDrill } = useQuery({
    queryKey: ["last-drill-session"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("drill_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("completed_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
  });

  // Fetch room mastery progress
  const { data: roomMastery } = useQuery({
    queryKey: ["active-room-mastery"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("room_progress")
        .select("*")
        .eq("user_id", user.id)
        .is("completed_at", null)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
  });

  // Fetch reading plan progress
  const { data: readingPlan } = useQuery({
    queryKey: ["active-reading-plan"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("user_reading_progress")
        .select("*")
        .eq("user_id", user.id)
        .is("completed_at", null)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
  });

  // Fetch course progress
  const { data: courseProgress } = useQuery({
    queryKey: ["active-course"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .is("completed_at", null)
        .order("last_accessed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
  });

  const tiles = [
    processState?.active_process && {
      icon: BookOpen,
      title: processState.active_process,
      subtitle: processState.process_step && processState.process_total_steps
        ? `Step ${processState.process_step}/${processState.process_total_steps}`
        : "In Progress",
      timestamp: processState.last_timestamp,
      onClick: () => navigate(processState.last_location || "/"),
    },
    lastDrill && {
      icon: Dumbbell,
      title: "Drill Session",
      subtitle: `${lastDrill.verse_reference} • ${lastDrill.current_step || 0}/${lastDrill.total_steps || 42} steps`,
      timestamp: lastDrill.updated_at,
      onClick: () => navigate(`/drill-drill?session=${lastDrill.id}`),
    },
    roomMastery && {
      icon: Award,
      title: `Room ${roomMastery.room_id} Progress`,
      subtitle: `${roomMastery.drill_attempts} drills completed`,
      timestamp: roomMastery.updated_at,
      onClick: () => navigate(`/palace/room/${roomMastery.room_id}`),
    },
    readingPlan && {
      icon: Calendar,
      title: "Reading Plan",
      subtitle: `Day ${readingPlan.current_day}`,
      timestamp: readingPlan.updated_at,
      onClick: () => navigate("/daily-reading-plan"),
    },
    courseProgress && {
      icon: GraduationCap,
      title: courseProgress.course_name,
      subtitle: `${courseProgress.progress_percentage}% complete`,
      timestamp: courseProgress.last_accessed_at,
      onClick: () => navigate("/phototheology-course"),
    },
  ].filter(Boolean);

  if (tiles.length === 0) return null;

  return (
    <div className="mb-12 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Continue Where You Left Off</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile, idx) => {
          if (!tile) return null;
          const Icon = tile.icon;
          return (
            <Card
              key={idx}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-background to-accent/5 border-primary/10"
              onClick={tile.onClick}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1 line-clamp-2">{tile.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{tile.subtitle}</p>
                {tile.timestamp && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tile.timestamp), { addSuffix: true })}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
