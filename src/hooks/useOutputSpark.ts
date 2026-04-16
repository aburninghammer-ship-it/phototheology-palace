import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OutputSparkOptions {
  type: 'gem' | 'challenge' | 'devotional' | 'study';
  content: string;
  title?: string;
  verseReference?: string;
  contextId: string;
}

/**
 * Hook for triggering sparks after saved study outputs
 * (gems, challenge completions, devotional completions)
 */
export function useOutputSpark() {
  const { user } = useAuth();
  const lastTriggerTime = useRef<number>(0);
  const cooldownMs = 30000; // 30s cooldown between output sparks

  const triggerOutputSpark = useCallback(async (options: OutputSparkOptions) => {
    if (!user?.id) return null;

    // Rate limiting
    const now = Date.now();
    if (now - lastTriggerTime.current < cooldownMs) return null;
    lastTriggerTime.current = now;

    // Check user preferences
    const { data: prefs } = await supabase
      .from('spark_preferences')
      .select('intensity, mode')
      .eq('user_id', user.id)
      .single();

    if (prefs?.intensity === 'off') return null;

    try {
      // Fetch recent sparks for deduplication
      const { data: recentSparks } = await supabase
        .from('sparks')
        .select('content_hash, title')
        .eq('user_id', user.id)
        .is('dismissed_at', null)
        .order('created_at', { ascending: false })
        .limit(10);

      const recentHashes = (recentSparks || [])
        .filter(s => s.content_hash)
        .map(s => s.content_hash as string);

      const recentTitles = (recentSparks || []).map(s => s.title);

      const { data, error } = await supabase.functions.invoke('generate-spark', {
        body: {
          content: options.content,
          verseReference: options.verseReference,
          surface: 'study',
          contextType: options.type,
          contextId: options.contextId,
          mode: prefs?.mode || 'standard',
          triggerType: 'output',
          outputTitle: options.title,
          recentHashes,
          recentTitles
        }
      });

      if (error) throw error;

      if (data?.spark) {
        // Save to database
        const { data: savedSpark, error: saveError } = await supabase
          .from('sparks')
          .insert({
            user_id: user.id,
            surface: 'study',
            context_type: options.type,
            context_id: options.contextId,
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

        // Track events
        await supabase.from('spark_events').insert([
          { user_id: user.id, spark_id: savedSpark.id, event_type: 'generated' },
          { user_id: user.id, spark_id: savedSpark.id, event_type: 'shown' }
        ]);

        // Show toast with spark preview
        toast.success(`💡 ${data.spark.title}`, {
          description: data.spark.recognition.substring(0, 100) + '...',
          action: {
            label: 'Explore',
            onClick: () => {
              // Dispatch event for spark container to pick up
              window.dispatchEvent(new CustomEvent('spark-explore', { 
                detail: savedSpark 
              }));
            }
          },
          duration: 8000
        });

        return savedSpark;
      }
    } catch (err) {
      console.error('Error generating output spark:', err);
    }

    return null;
  }, [user?.id]);

  return { triggerOutputSpark };
}
