import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Partnership {
  id: string;
  user1_id: string;
  user2_id: string | null;
  status: 'pending' | 'active' | 'declined' | 'ended';
  invitation_message: string | null;
  partnership_streak: number;
  longest_streak: number;
  last_both_completed_date: string | null;
  total_sessions_together: number;
  bonus_xp_earned: number;
  created_at: string;
  accepted_at: string | null;
  ended_at: string | null;
  partner_profile?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface PartnerActivity {
  id: string;
  partnership_id: string;
  user_id: string;
  activity_date: string;
  completed_mastery: boolean;
  completed_reading: boolean;
  completed_challenge: boolean;
  xp_earned: number;
  bonus_applied: boolean;
}

export function usePartnership() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get active partnership
  const { data: partnership, isLoading: isLoadingPartnership } = useQuery({
    queryKey: ['partnership', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('study_partnerships')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Get partner's profile
      const partnerId = data.user1_id === user.id ? data.user2_id : data.user1_id;
      if (partnerId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', partnerId)
          .single();
        
        return { ...data, partner_profile: profile } as Partnership;
      }

      return data as Partnership;
    },
    enabled: !!user?.id,
  });

  // Get pending invitations received
  const { data: pendingInvitations } = useQuery({
    queryKey: ['partnership-invitations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('study_partnerships')
        .select('*')
        .eq('user2_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      // Get inviter profiles
      const withProfiles = await Promise.all(
        (data || []).map(async (inv) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .eq('id', inv.user1_id)
            .single();
          return { ...inv, partner_profile: profile };
        })
      );

      return withProfiles as Partnership[];
    },
    enabled: !!user?.id,
  });

  // Get today's activity for both partners
  const { data: todayActivity } = useQuery({
    queryKey: ['partnership-activity', partnership?.id],
    queryFn: async () => {
      if (!partnership?.id) return null;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('partnership_daily_activity')
        .select('*')
        .eq('partnership_id', partnership.id)
        .eq('activity_date', today);

      if (error) throw error;
      return data as PartnerActivity[];
    },
    enabled: !!partnership?.id && partnership.status === 'active',
  });

  // Send partner invitation
  const invitePartner = useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('study_partnerships')
        .insert({
          user1_id: user.id,
          user2_id: userId,
          invitation_message: message || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for the invited user
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'partnership_invite',
        title: '👥 Training Partner Invitation',
        message: `You've been invited to become study partners!`,
        metadata: { partnership_id: data.id },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership'] });
      toast({
        title: 'Invitation Sent!',
        description: 'Your partner will be notified of your invitation.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to send invitation',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Accept invitation
  const acceptInvitation = useMutation({
    mutationFn: async (partnershipId: string) => {
      const { data, error } = await supabase
        .from('study_partnerships')
        .update({
          status: 'active',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', partnershipId)
        .select()
        .single();

      if (error) throw error;

      // Notify the inviter
      await supabase.from('notifications').insert({
        user_id: data.user1_id,
        type: 'partnership_accepted',
        title: '🎉 Partnership Accepted!',
        message: 'Your training partner has joined! Start studying together.',
        metadata: { partnership_id: data.id },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership'] });
      queryClient.invalidateQueries({ queryKey: ['partnership-invitations'] });
      toast({
        title: 'Partnership Activated!',
        description: 'You and your partner can now study together.',
      });
    },
  });

  // Decline invitation
  const declineInvitation = useMutation({
    mutationFn: async (partnershipId: string) => {
      const { error } = await supabase
        .from('study_partnerships')
        .update({ status: 'declined' })
        .eq('id', partnershipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership-invitations'] });
      toast({ title: 'Invitation declined' });
    },
  });

  // Record daily activity
  const recordActivity = useMutation({
    mutationFn: async ({
      activityType,
      xpEarned = 0,
    }: {
      activityType: 'mastery' | 'reading' | 'challenge';
      xpEarned?: number;
    }) => {
      if (!user?.id || !partnership?.id || partnership.status !== 'active') {
        return null;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('partnership_daily_activity')
        .select('*')
        .eq('partnership_id', partnership.id)
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      const updates: Partial<PartnerActivity> = {
        [`completed_${activityType}`]: true,
        xp_earned: (existing?.xp_earned || 0) + xpEarned,
      };

      if (existing) {
        const { data, error } = await supabase
          .from('partnership_daily_activity')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('partnership_daily_activity')
          .insert({
            partnership_id: partnership.id,
            user_id: user.id,
            activity_date: today,
            [`completed_${activityType}`]: true,
            xp_earned: xpEarned,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership-activity'] });
      queryClient.invalidateQueries({ queryKey: ['partnership'] });
    },
  });

  // Send nudge to partner
  const sendNudge = useMutation({
    mutationFn: async ({ type, message }: { type: 'encouragement' | 'reminder' | 'celebration'; message?: string }) => {
      if (!user?.id || !partnership?.id) throw new Error('No active partnership');

      const partnerId = partnership.user1_id === user.id ? partnership.user2_id : partnership.user1_id;
      if (!partnerId) throw new Error('No partner found');

      const { error } = await supabase.from('partnership_nudges').insert({
        partnership_id: partnership.id,
        sender_id: user.id,
        recipient_id: partnerId,
        nudge_type: type,
        message,
      });

      if (error) throw error;

      // Create notification
      const nudgeMessages = {
        encouragement: '💪 Your partner sent you encouragement!',
        reminder: '⏰ Your partner is waiting for you to study!',
        celebration: '🎉 Your partner is celebrating your progress!',
      };

      await supabase.from('notifications').insert({
        user_id: partnerId,
        type: 'partnership_nudge',
        title: 'Partner Nudge',
        message: message || nudgeMessages[type],
        metadata: { partnership_id: partnership.id, nudge_type: type },
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.type === 'celebration' ? '🎉 Celebration sent!' : '📨 Nudge sent!',
        description: 'Your partner will be notified.',
      });
    },
  });

  // End partnership
  const endPartnership = useMutation({
    mutationFn: async () => {
      if (!partnership?.id) throw new Error('No active partnership');

      const { error } = await supabase
        .from('study_partnerships')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', partnership.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnership'] });
      toast({ title: 'Partnership ended' });
    },
  });

  // Calculate if both completed today
  const myActivity = todayActivity?.find(a => a.user_id === user?.id);
  const partnerActivity = todayActivity?.find(a => a.user_id !== user?.id);
  const bothCompletedToday = !!(
    myActivity && partnerActivity &&
    (myActivity.completed_mastery || myActivity.completed_reading || myActivity.completed_challenge) &&
    (partnerActivity.completed_mastery || partnerActivity.completed_reading || partnerActivity.completed_challenge)
  );

  return {
    partnership,
    pendingInvitations,
    todayActivity,
    myActivity,
    partnerActivity,
    bothCompletedToday,
    isLoadingPartnership,
    invitePartner,
    acceptInvitation,
    declineInvitation,
    recordActivity,
    sendNudge,
    endPartnership,
  };
}
