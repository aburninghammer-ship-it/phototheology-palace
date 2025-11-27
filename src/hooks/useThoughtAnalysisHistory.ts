import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SavedAnalysis {
  id: string;
  input_text: string;
  summary: string | null;
  overall_score: number | null;
  categories: Record<string, number> | null;
  strengths: string[] | null;
  growth_areas: string[] | null;
  palace_rooms: Array<{ code: string; name: string; relevance: string }> | null;
  scripture_connections: Array<{ reference: string; connection: string }> | null;
  typology_layers: Array<{ symbol: string; meaning: string; reference: string }> | null;
  potential_misinterpretations: string[] | null;
  alignment_check: { status: string; notes: string } | null;
  further_study: string[] | null;
  encouragement: string | null;
  created_at: string;
}

export const useThoughtAnalysisHistory = () => {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('thought_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type cast the data properly
      const typedData = (data || []).map(item => ({
        ...item,
        categories: item.categories as Record<string, number> | null,
        palace_rooms: item.palace_rooms as Array<{ code: string; name: string; relevance: string }> | null,
        scripture_connections: item.scripture_connections as Array<{ reference: string; connection: string }> | null,
        typology_layers: item.typology_layers as Array<{ symbol: string; meaning: string; reference: string }> | null,
        alignment_check: item.alignment_check as { status: string; notes: string } | null,
      }));
      
      setHistory(typedData);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAnalysis = async (inputText: string, analysis: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save analyses");
        return null;
      }

      const { data, error } = await supabase
        .from('thought_analyses')
        .insert({
          user_id: user.id,
          input_text: inputText,
          summary: analysis.summary,
          overall_score: analysis.overallScore,
          categories: analysis.categories,
          strengths: analysis.strengths,
          growth_areas: analysis.growthAreas,
          palace_rooms: analysis.palaceRooms,
          scripture_connections: analysis.scriptureConnections,
          typology_layers: analysis.typologyLayers,
          potential_misinterpretations: analysis.potentialMisinterpretations,
          alignment_check: analysis.alignmentCheck,
          further_study: analysis.furtherStudy,
          encouragement: analysis.encouragement,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Analysis saved to history!");
      fetchHistory();
      return data;
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast.error("Failed to save analysis");
      return null;
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('thought_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHistory(prev => prev.filter(a => a.id !== id));
      toast.success("Analysis deleted");
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error("Failed to delete analysis");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    isLoading,
    saveAnalysis,
    deleteAnalysis,
    refetch: fetchHistory,
  };
};
