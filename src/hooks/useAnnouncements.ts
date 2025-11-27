import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "update";
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export function useAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAnnouncements([]);
      setDismissedIds(new Set());
      setLoading(false);
      return;
    }

    fetchAnnouncements();
    fetchDismissals();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('announcements-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDismissals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('announcement_dismissals')
        .select('announcement_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setDismissedIds(new Set(data?.map(d => d.announcement_id) || []));
    } catch (error) {
      console.error('Error fetching dismissals:', error);
    }
  };

  const dismissAnnouncement = async (announcementId: string) => {
    if (!user) return;

    // Optimistic update
    setDismissedIds(prev => new Set([...prev, announcementId]));

    try {
      const { error } = await supabase
        .from('announcement_dismissals')
        .insert({
          announcement_id: announcementId,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error dismissing announcement:', error);
      // Revert on error
      setDismissedIds(prev => {
        const next = new Set(prev);
        next.delete(announcementId);
        return next;
      });
    }
  };

  const activeAnnouncements = announcements.filter(a => !dismissedIds.has(a.id));

  return {
    announcements: activeAnnouncements,
    allAnnouncements: announcements,
    loading,
    dismissAnnouncement,
    refetch: fetchAnnouncements
  };
}
