import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface GeneratedStudyIdea {
  title: string;
  verses: string[];
  rooms: Array<{ id: string; name: string; icon: string }>;
  observePrompt: string;
  connectPrompt: string;
  discoverPrompt: string;
}

export const useIdeaGenerator = () => {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<GeneratedStudyIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = async (input: string) => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a word, verse, or theme",
        variant: "destructive",
      });
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-study-ideas",
        {
          body: { input: input.trim() },
        }
      );

      if (fnError) throw fnError;

      if (data?.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
        toast({
          title: "Ideas generated",
          description: `Found ${data.ideas.length} study ideas for "${input}"`,
        });
        return data.ideas as GeneratedStudyIdea[];
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error generating ideas:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate ideas";
      setError(errorMessage);
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearIdeas = () => {
    setIdeas([]);
    setError(null);
  };

  return {
    ideas,
    loading,
    error,
    generateIdeas,
    clearIdeas,
  };
};
