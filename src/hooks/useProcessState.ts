import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProcessState {
  active_process: string;
  task_type?: string;
  process_step: number;
  process_total_steps: number;
  last_location?: string;
  notes?: string;
}

export const useProcessState = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const saveState = useCallback(async (state: ProcessState) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_process_state')
        .upsert({
          user_id: user.id,
          active_process: state.active_process,
          task_type: state.task_type,
          process_step: state.process_step,
          process_total_steps: state.process_total_steps,
          last_location: state.last_location,
          notes: state.notes,
          last_timestamp: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving process state:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  }, [toast]);

  const completeProcess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_process_state')
        .update({
          active_process: null,
          process_step: null,
          process_total_steps: null
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error completing process:', error);
    }
  }, []);

  const clearProcess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_process_state')
        .update({
          active_process: null,
          process_step: null,
          process_total_steps: null,
          last_location: null,
          notes: null
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing process:', error);
    }
  }, []);

  const getCurrentState = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_process_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching current state:', error);
      return null;
    }
  }, []);

  return {
    saveState,
    completeProcess,
    clearProcess,
    getCurrentState,
    saving
  };
};
