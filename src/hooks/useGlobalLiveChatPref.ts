import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Returns whether the current user has global live chat notifications enabled.
 * Defaults to true if no preference row exists.
 */
export function useGlobalLiveChatPref(): boolean {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('global_live_chat' as any)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setEnabled((data as any).global_live_chat ?? true);
      }
    })();
  }, [user]);

  return enabled;
}
