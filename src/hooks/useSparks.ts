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
      let query = supabase
        .from('sparks')
        .select('*')
        .eq('user_id', user.id)
        .eq('context_type', contextType)
        .is('dismissed_at', null)
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

  // Generate spark based on content
  const generateSpark = useCallback(async (content: string, verseReference?: string) => {
    console.log('[useSparks] generateSpark called', {
      hasUser: !!user?.id,
      intensity: preferences.intensity,
      sparksCount: sparks.length,
      maxSparks,
      contentLength: content?.length
    });

    if (!user?.id) {
      console.log('[useSparks] Skipped: no user');
      return null;
    }
    if (preferences.intensity === 'off') {
      console.log('[useSparks] Skipped: intensity is off');
      return null;
    }
    if (sparks.length >= maxSparks) {
      console.log('[useSparks] Skipped: at max sparks');
      return null;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastGen = now - lastGenerationTime.current;
    if (timeSinceLastGen < debounceMs) {
      console.log('[useSparks] Skipped: rate limited, wait', Math.round((debounceMs - timeSinceLastGen) / 1000), 'more seconds');
      return null;
    }
    
    // Suppress if user dismissed 5+ sparks this session (be less aggressive)
    if (dismissedCount.current >= 5) {
      console.log('[useSparks] Suppressed: dismissed too many sparks this session');
      return null;
    }
    
    // Content length check for notes
    if (surface === 'notes' && content.length < 280) return null;
    
    lastGenerationTime.current = now;
    setGenerating(true);

    try {
      console.log('[useSparks] Calling generate-spark edge function...');

      // Gather recent spark data for deduplication
      const recentHashes = sparks
        .filter(s => s.content_hash)
        .map(s => s.content_hash as string);

      const recentTitles = sparks
        .slice(0, 10)
        .map(s => s.title);

      const { data, error } = await supabase.functions.invoke('generate-spark', {
        body: {
          content,
          verseReference,
          surface,
          contextType,
          contextId,
          mode: preferences.mode,
          recentHashes,
          recentTitles
        }
      });

      console.log('[useSparks] Edge function response:', { data, error });

      if (error) throw error;

      if (data?.spark) {
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
            content_hash: data.spark.content_hash
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
  const saveSpark = async (sparkId: string) => {
    await supabase
      .from('sparks')
      .update({ saved_at: new Date().toISOString() })
      .eq('id', sparkId);
    
    await trackSparkEvent(sparkId, 'saved');
    toast.success('Spark saved to your library');
    
    // Remove from active sparks view (it's now in the library)
    setSparks(prev => prev.filter(s => s.id !== sparkId));
  };

  // Dismiss spark
  const dismissSpark = async (sparkId: string) => {
    await supabase
      .from('sparks')
      .update({ dismissed_at: new Date().toISOString() })
      .eq('id', sparkId);
    
    await trackSparkEvent(sparkId, 'dismissed');
    dismissedCount.current += 1;
    
    setSparks(prev => prev.filter(s => s.id !== sparkId));
  };

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
