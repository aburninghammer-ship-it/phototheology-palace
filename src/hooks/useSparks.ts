import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Spark {
  id: string;
  user_id: string;
  surface?: 'notes' | 'verse' | 'study' | 'session' | 'bible_reader' | 'guesthouse' | 'other';
  surface_type?: string;
  context_type?: 'verse' | 'note_block' | 'gem' | 'session' | 'study' | 'chapter' | 'game';
  context_id?: string;
  spark_type: 'connection' | 'pattern' | 'application';
  title: string;
  recognition: string;
  insight: string;
  explore_action: {
    label: string;
    targets: string[];
    mode: 'trace' | 'apply' | 'build' | 'save';
  } | null;
  confidence: number;
  novelty_score?: number;
  content_hash?: string | null;
  created_at: string;
  opened_at?: string | null;
  saved_at?: string | null;
  dismissed_at?: string | null;
  explored_at?: string | null;
}

export interface SparkPreferences {
  intensity: 'off' | 'subtle' | 'normal' | 'rich';
  mode: 'beginner' | 'standard' | 'master';
  auto_open: boolean;
  only_after_save: boolean;
}

interface UseSparkOptions {
  surface: 'notes' | 'verse' | 'study' | 'session' | 'bible_reader' | 'guesthouse' | 'other';
  contextType: 'verse' | 'note_block' | 'gem' | 'session' | 'study' | 'chapter' | 'game';
  contextId: string;
  maxSparks?: number;
  debounceMs?: number;
}

export function useSparks({ 
  surface, 
  contextType, 
  contextId, 
  maxSparks = 5,
  debounceMs = 90000 
}: UseSparkOptions) {
  const { user } = useAuth();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [preferences, setPreferences] = useState<SparkPreferences>({
    intensity: 'normal',
    mode: 'standard',
    auto_open: false,
    only_after_save: false
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const lastGenerationTime = useRef<number>(0);
  const dismissedCount = useRef(0);
  const sessionClearedRef = useRef(false);

  // On new session mount: dismiss all previous unsaved sparks for this context
  useEffect(() => {
    if (!user?.id || sessionClearedRef.current) return;
    sessionClearedRef.current = true;

    const clearOldSparks = async () => {
      try {
        let query = supabase
          .from('sparks')
          .update({ dismissed_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('context_type', contextType)
          .is('dismissed_at', null)
          .is('saved_at', null);

        if (contextId && contextId !== '*') {
          query = query.eq('context_id', contextId);
        }

        await query;
      } catch (err) {
        console.error('[Sparks] Session clear error:', err);
      }
    };

    clearOldSparks();
  }, [user?.id, contextType, contextId]);

  // Fetch user preferences
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchPreferences = async () => {
      const { data } = await supabase
        .from('spark_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setPreferences({
          intensity: data.intensity as SparkPreferences['intensity'],
          mode: data.mode as SparkPreferences['mode'],
          auto_open: data.auto_open,
          only_after_save: data.only_after_save
        });
      }
    };
    
    fetchPreferences();
  }, [user?.id]);

  // Fetch existing sparks for context
  const fetchSparks = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Only show sparks from the last 24 hours that haven't been dismissed or saved
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      let query = supabase
        .from('sparks')
        .select('*')
        .eq('user_id', user.id)
        .eq('context_type', contextType)
        .is('dismissed_at', null)
        .is('saved_at', null)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(maxSparks);
      
      // Only filter by contextId if it's not a wildcard
      if (contextId && contextId !== '*') {
        query = query.eq('context_id', contextId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setSparks((data as unknown as Spark[]) || []);
    } catch (err) {
      console.error('Error fetching sparks:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, contextType, contextId, maxSparks]);

  useEffect(() => {
    fetchSparks();
  }, [fetchSparks]);

  // Simple hash function for content deduplication
  const simpleHash = (str: string): string => {
    let hash = 0;
    const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 200);
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  };

  // Check if title is too similar to existing sparks
  const isTitleTooSimilar = (newTitle: string, existingTitles: string[]): boolean => {
    const normalizedNew = newTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    return existingTitles.some(existing => {
      const normalizedExisting = existing.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      // Check for exact match
      if (normalizedNew === normalizedExisting) return true;
      // Check if one contains the other (80%+ overlap)
      if (normalizedNew.includes(normalizedExisting) || normalizedExisting.includes(normalizedNew)) return true;
      // Check word overlap
      const newWords = new Set(normalizedNew.split(/\s+/).filter(w => w.length > 3));
      const existingWords = new Set(normalizedExisting.split(/\s+/).filter(w => w.length > 3));
      const overlap = [...newWords].filter(w => existingWords.has(w)).length;
      const overlapRatio = overlap / Math.max(newWords.size, existingWords.size);
      return overlapRatio > 0.7;
    });
  };

  // Generate spark based on content
  const generateSpark = useCallback(async (content: string, verseReference?: string) => {
    // Debug logging
    console.log('[Sparks] Attempting generation...', {
      hasUser: !!user?.id,
      intensity: preferences.intensity,
      sparkCount: sparks.length,
      maxSparks,
      contentLength: content.length
    });

    if (!user?.id) {
      console.log('[Sparks] Skipped: No user');
      return null;
    }
    if (preferences.intensity === 'off') {
      console.log('[Sparks] Skipped: Intensity is off');
      return null;
    }
    if (sparks.length >= maxSparks) {
      console.log('[Sparks] Skipped: Max sparks reached');
      return null;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastGenerationTime.current < debounceMs) {
      console.log('[Sparks] Skipped: Rate limited');
      return null;
    }

    // Suppress if user dismissed 2+ sparks this session
    if (dismissedCount.current >= 2) {
      console.log('[Sparks] Skipped: Too many dismissals');
      return null;
    }

    // Content length check for notes
    if (surface === 'notes' && content.length < 280) {
      console.log('[Sparks] Skipped: Notes content too short');
      return null;
    }

    // Content length check for study surface
    if (surface === 'study' && content.length < 100) {
      console.log('[Sparks] Skipped: Study content too short');
      return null;
    }

    console.log('[Sparks] Passed all checks, generating...');
    lastGenerationTime.current = now;
    setGenerating(true);

    try {
      // Gather recent spark data for deduplication - include all sparks for better deduplication
      const { data: allRecentSparks } = await supabase
        .from('sparks')
        .select('content_hash, title, recognition, insight')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      const recentHashes = (allRecentSparks || [])
        .filter(s => s.content_hash)
        .map(s => s.content_hash as string);

      const recentTitles = (allRecentSparks || [])
        .map(s => s.title);

      // Also include insights and recognitions for deeper deduplication
      const recentInsights = (allRecentSparks || [])
        .map(s => s.insight)
        .filter(Boolean);

      // Generate a content hash to check locally
      const contentHash = simpleHash(content);
      if (recentHashes.includes(contentHash)) {
        console.log('[Sparks] Content hash already exists, skipping generation');
        setGenerating(false);
        return null;
      }

      const { data, error } = await supabase.functions.invoke('generate-spark', {
        body: {
          content,
          verseReference,
          surface,
          contextType,
          contextId,
          mode: preferences.mode,
          recentHashes,
          recentTitles,
          recentInsights
        }
      });

      if (error) {
        console.error('[Sparks] Edge function error:', error);
        // Only show toast for non-rate-limit errors
        if (!error.message?.includes('rate') && !error.message?.includes('limit')) {
          toast.error('Spark generation unavailable', {
            description: 'The AI service may be temporarily down. Try again later.',
            duration: 5000
          });
        }
        throw error;
      }

      if (data?.spark) {
        // Client-side deduplication check before saving
        if (isTitleTooSimilar(data.spark.title, recentTitles)) {
          console.log('[Sparks] Title too similar to existing spark, skipping:', data.spark.title);
          return null;
        }

        // Check if insight is too similar
        if (recentInsights.some((ins: string) => {
          const similarity = ins.toLowerCase().replace(/[^a-z0-9]/g, '');
          const newInsight = data.spark.insight.toLowerCase().replace(/[^a-z0-9]/g, '');
          return similarity === newInsight || similarity.includes(newInsight.slice(0, 50));
        })) {
          console.log('[Sparks] Insight too similar to existing spark, skipping');
          return null;
        }

        // Save to database
        const { data: savedSpark, error: saveError } = await supabase
          .from('sparks')
          .insert({
            user_id: user.id,
            surface,
            context_type: contextType,
            context_id: contextId,
            spark_type: data.spark.spark_type,
            title: data.spark.title,
            recognition: data.spark.recognition,
            insight: data.spark.insight,
            explore_action: data.spark.explore,
            confidence: data.spark.confidence || 0.7,
            novelty_score: data.spark.novelty_score || 0.7,
            content_hash: data.spark.content_hash || contentHash
          })
          .select()
          .single();

        if (saveError) throw saveError;

        // Track generation event
        await trackSparkEvent(savedSpark.id, 'generated');
        await trackSparkEvent(savedSpark.id, 'shown');

        setSparks(prev => [savedSpark as unknown as Spark, ...prev.slice(0, maxSparks - 1)]);
        return savedSpark as unknown as Spark;
      }
    } catch (err) {
      console.error('Error generating spark:', err);
    } finally {
      setGenerating(false);
    }
    
    return null;
  }, [user?.id, preferences, surface, contextType, contextId, sparks.length, maxSparks, debounceMs]);

  // Track spark events
  const trackSparkEvent = async (sparkId: string, eventType: 'generated' | 'shown' | 'opened' | 'explored' | 'saved' | 'dismissed', metadata?: Record<string, unknown>) => {
    if (!user?.id) return;
    
    try {
      await supabase.from('spark_events').insert([{
        user_id: user.id,
        spark_id: sparkId,
        event_type: eventType,
        metadata: metadata as unknown as null
      }]);
    } catch (err) {
      console.error('Error tracking spark event:', err);
    }
  };

  // Open spark
  const openSpark = async (sparkId: string) => {
    await supabase
      .from('sparks')
      .update({ opened_at: new Date().toISOString() })
      .eq('id', sparkId);
    
    await trackSparkEvent(sparkId, 'opened');
    
    setSparks(prev => prev.map(s => 
      s.id === sparkId ? { ...s, opened_at: new Date().toISOString() } : s
    ));
  };

  // Save spark - removes from active view (goes to library)
  const saveSpark = useCallback(async (sparkId: string) => {
    // Immediately update local state for instant UI feedback
    setSparks(prev => prev.filter(s => s.id !== sparkId));
    toast.success('Spark saved to your library');
    
    // Then update database in background
    try {
      await supabase
        .from('sparks')
        .update({ saved_at: new Date().toISOString() })
        .eq('id', sparkId);
      
      await trackSparkEvent(sparkId, 'saved');
    } catch (err) {
      console.error('Error saving spark:', err);
    }
  }, [user?.id]);

  // Dismiss spark
  const dismissSpark = useCallback(async (sparkId: string) => {
    // Immediately update local state for instant UI feedback
    setSparks(prev => prev.filter(s => s.id !== sparkId));
    dismissedCount.current += 1;
    
    // Then update database in background
    try {
      await supabase
        .from('sparks')
        .update({ dismissed_at: new Date().toISOString() })
        .eq('id', sparkId);
      
      await trackSparkEvent(sparkId, 'dismissed');
    } catch (err) {
      console.error('Error dismissing spark:', err);
    }
  }, [user?.id]);

  // Explore spark
  const exploreSpark = async (sparkId: string) => {
    await trackSparkEvent(sparkId, 'explored');
    // Return the spark for the explore flow
    return sparks.find(s => s.id === sparkId);
  };

  // Update preferences
  const updatePreferences = async (newPrefs: Partial<SparkPreferences>) => {
    if (!user?.id) return;
    
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    await supabase
      .from('spark_preferences')
      .upsert({
        user_id: user.id,
        ...updated,
        updated_at: new Date().toISOString()
      });
  };

  return {
    sparks,
    preferences,
    loading,
    generating,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences,
    fetchSparks
  };
}
