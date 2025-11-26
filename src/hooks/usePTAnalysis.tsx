import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PTInsights {
  christ_center?: string;
  dimensions?: string[];
  cycles?: string[];
  horizons?: string[];
  sanctuary_connections?: Array<{ article: string; explanation: string }>;
  feast_connections?: Array<{ feast: string; explanation: string }>;
  walls?: string[];
  cross_references?: Array<{ verse: string; reason: string; principles: string[] }>;
}

export function usePTAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeVerse = async (verseReference: string, verseText: string): Promise<PTInsights | null> => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-verse-pt', {
        body: { verse_reference: verseReference, verse_text: verseText }
      });

      if (error) {
        console.error('Error analyzing verse:', error);
        toast.error('Failed to analyze verse with PT principles');
        return null;
      }

      return data.pt_insights;
    } catch (error) {
      console.error('Error in PT analysis:', error);
      toast.error('Failed to analyze verse');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const updateVersePTInsights = async (itemId: string, ptInsights: PTInsights) => {
    try {
      const { error } = await supabase
        .from('memory_verse_list_items')
        .update({
          pt_insights: ptInsights as any,
          pt_discovered: true,
          discovery_unlocked_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Update PT mastery tracking
      await updatePTMastery(ptInsights);
    } catch (error) {
      console.error('Error updating PT insights:', error);
    }
  };

  const updatePTMastery = async (ptInsights: PTInsights) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = [];

      // Track cycles
      if (ptInsights.cycles) {
        for (const cycle of ptInsights.cycles) {
          updates.push({
            user_id: user.id,
            principle_type: 'cycle',
            principle_code: cycle,
            last_practiced_at: new Date().toISOString()
          });
        }
      }

      // Track dimensions
      if (ptInsights.dimensions) {
        for (const dim of ptInsights.dimensions) {
          updates.push({
            user_id: user.id,
            principle_type: 'dimension',
            principle_code: dim,
            last_practiced_at: new Date().toISOString()
          });
        }
      }

      // Track horizons
      if (ptInsights.horizons) {
        for (const horizon of ptInsights.horizons) {
          updates.push({
            user_id: user.id,
            principle_type: 'horizon',
            principle_code: horizon,
            last_practiced_at: new Date().toISOString()
          });
        }
      }

      // Track sanctuary
      if (ptInsights.sanctuary_connections) {
        for (const conn of ptInsights.sanctuary_connections) {
          updates.push({
            user_id: user.id,
            principle_type: 'sanctuary',
            principle_code: conn.article,
            last_practiced_at: new Date().toISOString()
          });
        }
      }

      // Track feasts
      if (ptInsights.feast_connections) {
        for (const conn of ptInsights.feast_connections) {
          updates.push({
            user_id: user.id,
            principle_type: 'feast',
            principle_code: conn.feast,
            last_practiced_at: new Date().toISOString()
          });
        }
      }

      // Upsert all updates
      for (const update of updates) {
        await supabase
          .from('pt_mastery')
          .upsert(update, {
            onConflict: 'user_id,principle_type,principle_code'
          });
      }
    } catch (error) {
      console.error('Error updating PT mastery:', error);
    }
  };

  const saveCrossReferences = async (ptInsights: PTInsights, sourceVerse: string) => {
    if (!ptInsights.cross_references) return;

    try {
      const crossRefs = ptInsights.cross_references.map(ref => ({
        source_verse: sourceVerse,
        target_verse: ref.verse,
        connection_type: 'pt_principle',
        principle_codes: ref.principles,
        strength: 75, // Default strength
        explanation: ref.reason
      }));

      const { error } = await supabase
        .from('pt_cross_references')
        .upsert(crossRefs, {
          onConflict: 'source_verse,target_verse'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving cross-references:', error);
    }
  };

  return {
    analyzeVerse,
    updateVersePTInsights,
    saveCrossReferences,
    analyzing
  };
}
