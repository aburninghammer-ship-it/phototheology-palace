import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Spark } from './useSparks';

interface UseGuesthouseSparksOptions {
  eventId: string;
  guestId: string;
  guestName: string;
}

/**
 * Hook for managing sparks in Guesthouse context (unauthenticated guests)
 * Sparks are stored locally and can be saved to localStorage
 */
export function useGuesthouseSparks({ eventId, guestId, guestName }: UseGuesthouseSparksOptions) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastTriggerTime, setLastTriggerTime] = useState(0);
  
  const COOLDOWN_MS = 45000; // 45 seconds between sparks

  // Load saved sparks from localStorage on mount
  useEffect(() => {
    const savedSparks = localStorage.getItem(`guesthouse_sparks_${eventId}_${guestId}`);
    if (savedSparks) {
      try {
        setSparks(JSON.parse(savedSparks));
      } catch (e) {
        console.error('Failed to parse saved sparks:', e);
      }
    }
  }, [eventId, guestId]);

  // Save sparks to localStorage when they change
  useEffect(() => {
    if (sparks.length > 0) {
      localStorage.setItem(`guesthouse_sparks_${eventId}_${guestId}`, JSON.stringify(sparks));
    }
  }, [sparks, eventId, guestId]);

  const generateSpark = useCallback(async (context: {
    promptType?: string;
    promptData?: any;
    response?: any;
  }) => {
    // Check cooldown
    const now = Date.now();
    if (now - lastTriggerTime < COOLDOWN_MS) {
      return null;
    }

    // Limit to 5 sparks per session
    if (sparks.length >= 5) {
      return null;
    }

    setLoading(true);
    setLastTriggerTime(now);

    try {
      // Pass recent titles for deduplication
      const recentTitles = sparks.slice(0, 5).map(s => s.title);

      const { data, error } = await supabase.functions.invoke('generate-spark', {
        body: {
          mode: 'generate',
          surface: 'guesthouse',
          contextType: 'game',
          contextData: {
            eventId,
            guestName,
            promptType: context.promptType,
            promptData: context.promptData,
            response: context.response
          },
          triggerType: 'output',
          outputTitle: `Guesthouse: ${context.promptType || 'Game'}`,
          recentTitles
        }
      });

      if (error) throw error;

      if (data?.spark) {
        const newSpark: Spark = {
          id: `guest_${Date.now()}`,
          user_id: guestId,
          spark_type: data.spark.spark_type || 'connection',
          title: data.spark.title,
          recognition: data.spark.recognition || '',
          insight: data.spark.insight,
          confidence: data.spark.confidence || 0.7,
          explore_action: data.spark.explore_action,
          surface_type: 'guesthouse',
          context_type: 'game',
          created_at: new Date().toISOString()
        };

        setSparks(prev => [newSpark, ...prev].slice(0, 5));
        return newSpark;
      }
    } catch (err) {
      console.error('Failed to generate guesthouse spark:', err);
    } finally {
      setLoading(false);
    }

    return null;
  }, [eventId, guestId, guestName, lastTriggerTime, sparks.length]);

  const openSpark = useCallback((sparkId: string) => {
    setSparks(prev => prev.map(s => 
      s.id === sparkId ? { ...s, opened_at: new Date().toISOString() } : s
    ));
  }, []);

  const saveSpark = useCallback((sparkId: string) => {
    setSparks(prev => prev.map(s => 
      s.id === sparkId ? { ...s, saved_at: new Date().toISOString() } : s
    ));
  }, []);

  const dismissSpark = useCallback((sparkId: string) => {
    setSparks(prev => prev.filter(s => s.id !== sparkId));
  }, []);

  const exploreSpark = useCallback(async (sparkId: string) => {
    const spark = sparks.find(s => s.id === sparkId);
    if (spark) {
      setSparks(prev => prev.map(s => 
        s.id === sparkId ? { ...s, explored_at: new Date().toISOString() } : s
      ));
    }
    return spark;
  }, [sparks]);

  const activeSparks = sparks.filter(s => !s.dismissed_at);

  return {
    sparks: activeSparks,
    loading,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark
  };
}
