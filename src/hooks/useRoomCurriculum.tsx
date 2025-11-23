import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { getRoomCurriculum, CurriculumActivity } from "@/data/roomCurricula";
import { useMastery } from "./useMastery";

export interface CurriculumProgress {
  id: string;
  user_id: string;
  room_id: string;
  floor_number: number;
  current_activity_index: number;
  completed_activities: string[];
  milestone_tests_passed: Record<string, boolean>;
  curriculum_completed: boolean;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useRoomCurriculum = (roomId: string, roomName: string, floorNumber: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mastery } = useMastery(roomId, floorNumber);

  // Get curriculum definition
  const curriculum = getRoomCurriculum(roomId, roomName);

  // Fetch user's progress through curriculum
  const { data: progress, isLoading } = useQuery({
    queryKey: ["room-curriculum", roomId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("room_curriculum_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .maybeSingle();

      if (error) throw error;
      return data as CurriculumProgress | null;
    },
  });

  // Get activities available at current mastery level
  const getAvailableActivities = (): CurriculumActivity[] => {
    const currentLevel = mastery?.mastery_level || 1;
    return curriculum.activities.filter((activity) => {
      // If activity has unlockAtLevel, check if user meets it
      if (activity.unlockAtLevel && activity.unlockAtLevel > currentLevel) {
        return false;
      }
      return true;
    });
  };

  // Get next recommended activity
  const getNextActivity = (): CurriculumActivity | null => {
    const available = getAvailableActivities();
    const completedIds = (progress?.completed_activities as string[]) || [];
    
    // Find first incomplete activity
    return available.find((activity) => !completedIds.includes(activity.id)) || null;
  };

  // Calculate curriculum completion percentage
  const getCompletionPercentage = (): number => {
    const available = getAvailableActivities();
    const completedIds = (progress?.completed_activities as string[]) || [];
    const completed = available.filter((a) => completedIds.includes(a.id)).length;
    return available.length > 0 ? Math.round((completed / available.length) * 100) : 0;
  };

  // Mark activity as complete
  const completeActivity = useMutation({
    mutationFn: async ({ activityId, xpEarned }: { activityId: string; xpEarned: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get current progress
      const { data: currentProgress } = await supabase
        .from("room_curriculum_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .maybeSingle();

      const completedActivities = (currentProgress?.completed_activities as string[]) || [];
      
      // Check if already completed
      if (completedActivities.includes(activityId)) {
        return { alreadyCompleted: true };
      }

      const updatedCompleted = [...completedActivities, activityId];
      const allActivities = curriculum.activities;
      const isFullyCompleted = updatedCompleted.length >= allActivities.length;

      // Upsert progress
      const { data, error } = await supabase
        .from("room_curriculum_progress")
        .upsert({
          user_id: user.id,
          room_id: roomId,
          floor_number: floorNumber,
          current_activity_index: updatedCompleted.length,
          completed_activities: updatedCompleted,
          curriculum_completed: isFullyCompleted,
          last_activity_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,room_id",
        })
        .select()
        .single();

      if (error) throw error;
      return { data, alreadyCompleted: false };
    },
    onSuccess: ({ alreadyCompleted }, variables) => {
      if (!alreadyCompleted) {
        queryClient.invalidateQueries({ queryKey: ["room-curriculum", roomId] });
        queryClient.invalidateQueries({ queryKey: ["room-mastery", roomId] });

        const activity = curriculum.activities.find((a) => a.id === variables.activityId);
        toast({
          title: "✅ Activity Complete!",
          description: `${activity?.title} - +${variables.xpEarned} XP`,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      console.error("Failed to complete activity:", error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Pass milestone test
  const passMilestoneTest = useMutation({
    mutationFn: async ({ testLevel, activityId }: { testLevel: number; activityId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: currentProgress } = await supabase
        .from("room_curriculum_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .maybeSingle();

      const testsPassed = (currentProgress?.milestone_tests_passed as Record<string, boolean>) || {};
      testsPassed[`level_${testLevel}`] = true;

      const { data, error } = await supabase
        .from("room_curriculum_progress")
        .upsert({
          user_id: user.id,
          room_id: roomId,
          floor_number: floorNumber,
          milestone_tests_passed: testsPassed,
          last_activity_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,room_id",
        })
        .select()
        .single();

      if (error) throw error;
      
      // Also mark activity as complete
      await completeActivity.mutateAsync({ activityId, xpEarned: 100 });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-curriculum", roomId] });
      toast({
        title: "🎉 Milestone Passed!",
        description: "You've advanced to the next level!",
        duration: 5000,
      });
    },
  });

  return {
    curriculum,
    progress,
    isLoading,
    availableActivities: getAvailableActivities(),
    nextActivity: getNextActivity(),
    completionPercentage: getCompletionPercentage(),
    completeActivity: completeActivity.mutate,
    isCompletingActivity: completeActivity.isPending,
    passMilestoneTest: passMilestoneTest.mutate,
    isPassingTest: passMilestoneTest.isPending,
  };
};
