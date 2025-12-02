import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useMessageReactions = () => {
  const { user } = useAuth();

  const addReaction = useCallback(async (messageId: string, reactionType: string) => {
    if (!user) {
      toast.error('Please sign in to react');
      return;
    }

    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          reaction_type: reactionType
        });

      if (error) {
        // If it's a duplicate, remove the reaction instead
        if (error.code === '23505') {
          await removeReaction(messageId, reactionType);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  }, [user]);

  const removeReaction = useCallback(async (messageId: string, reactionType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
  }, [user]);

  return {
    addReaction,
    removeReaction
  };
};
