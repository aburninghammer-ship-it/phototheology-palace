import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExpoundResult {
  deepConnection: string;
  seedRelevance: string;
  hiddenPattern: string;
  practicalDepth: string;
  scripturalChain: string[];
  palaceRooms: string[];
}

interface UseExpoundPrincipleReturn {
  expound: (principleContent: string, insight: string, seedText: string, roomTag?: string) => Promise<ExpoundResult | null>;
  isLoading: boolean;
  result: ExpoundResult | null;
  reset: () => void;
}

export function useExpoundPrinciple(): UseExpoundPrincipleReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExpoundResult | null>(null);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  const expound = useCallback(async (
    principleContent: string,
    insight: string,
    seedText: string,
    roomTag?: string
  ): Promise<ExpoundResult | null> => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('mind-map-analyze', {
        body: {
          action: "expound",
          principleContent,
          insight,
          seedText,
          roomTag,
        },
      });

      if (error) {
        console.error('Expound error:', error);
        toast.error('Failed to expound principle');
        return null;
      }

      const expoundResult = data as ExpoundResult;
      setResult(expoundResult);
      return expoundResult;
    } catch (err) {
      console.error('Expound error:', err);
      toast.error('An error occurred while expounding');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { expound, isLoading, result, reset };
}
