import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface IncompleteProcess {
  id: string;
  active_process: string | null;
  task_type: string | null;
  process_step: number | null;
  process_total_steps: number | null;
  last_location: string | null;
  last_timestamp: string | null;
  notes: string | null;
}

export const useAllIncompleteProcesses = () => {
  const [processes, setProcesses] = useState<IncompleteProcess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setProcesses([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_process_state')
          .select('*')
          .eq('user_id', user.id)
          .not('active_process', 'is', null)
          .order('last_timestamp', { ascending: false });

        if (error) throw error;
        setProcesses(data || []);
      } catch (error) {
        console.error('Error fetching incomplete processes:', error);
        setProcesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();

    // Subscribe to changes
    const channel = supabase
      .channel('process_state_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_process_state'
        },
        () => {
          fetchProcesses();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { processes, loading };
};
