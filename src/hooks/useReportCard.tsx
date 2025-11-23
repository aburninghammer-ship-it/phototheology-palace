import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface ReportCard {
  id: string;
  user_id: string;
  room_id: string;
  mastery_level: number;
  report_data: {
    strengths: string[];
    weaknesses: string[];
    mistakes: string[];
    skills_gained: string[];
    suggested_rooms: string[];
    training_plan: string[];
  };
  created_at: string;
  updated_at: string;
}

export const useReportCard = (roomId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all report cards for a room
  const { data: reportCards, isLoading } = useQuery({
    queryKey: ["report-cards", roomId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("room_report_cards")
        .select("*")
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ReportCard[];
    },
  });

  // Generate a new report card
  const generateReport = useMutation({
    mutationFn: async (masteryLevel: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("generate-report-card", {
        body: {
          userId: user.id,
          roomId,
          masteryLevel,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-cards", roomId] });
      toast({
        title: "🎓 Report Card Generated!",
        description: "Review your progress and personalized recommendations.",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Failed to generate report card:", error);
      toast({
        title: "Error",
        description: "Failed to generate report card. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    reportCards,
    isLoading,
    generateReport: generateReport.mutate,
    isGenerating: generateReport.isPending,
  };
};
