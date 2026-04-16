import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, subDays, format } from 'date-fns';

interface PageViewStat {
  page_path: string;
  count: number;
}

interface JeevesInteraction {
  id: string;
  question: string;
  feature_used: string;
  response_preview: string | null;
  page_context: string | null;
  created_at: string;
  user_id: string | null;
}

interface DailyActivity {
  date: string;
  page_views: number;
  jeeves_queries: number;
}

export const useAdminAnalytics = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageViewStats, setPageViewStats] = useState<PageViewStat[]>([]);
  const [recentJeevesQueries, setRecentJeevesQueries] = useState<JeevesInteraction[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [totalJeevesQueries, setTotalJeevesQueries] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [liveUsersCount, setLiveUsersCount] = useState(0);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!adminCheck) {
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      await fetchAnalytics();
    } catch (error) {
      console.error('Admin check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveUsers = async () => {
    // Users are considered "live" if last_seen within the last 60 seconds
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', oneMinuteAgo);

    if (!error && count !== null) {
      setLiveUsersCount(count);
    }
  };

  const fetchAnalytics = async () => {
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

    // Also fetch live users
    await fetchLiveUsers();

    // Fetch page views grouped by path
    const { data: pageViews } = await supabase
      .from('page_views')
      .select('page_path')
      .gte('created_at', thirtyDaysAgo);

    if (pageViews) {
      const pathCounts: Record<string, number> = {};
      pageViews.forEach(pv => {
        pathCounts[pv.page_path] = (pathCounts[pv.page_path] || 0) + 1;
      });
      
      const stats = Object.entries(pathCounts)
        .map(([page_path, count]) => ({ page_path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
      
      setPageViewStats(stats);
      setTotalPageViews(pageViews.length);

      // Count unique users
      const uniqueUserIds = new Set(pageViews.map(pv => pv.page_path).filter(Boolean));
      setUniqueUsers(uniqueUserIds.size);
    }

    // Fetch recent Jeeves queries
    const { data: jeevesData } = await supabase
      .from('jeeves_interactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (jeevesData) {
      setRecentJeevesQueries(jeevesData as JeevesInteraction[]);
      setTotalJeevesQueries(jeevesData.length);
    }

    // Calculate daily activity for last 14 days
    const dailyStats: DailyActivity[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayStart = startOfDay(date).toISOString();
      const dayEnd = startOfDay(subDays(date, -1)).toISOString();

      const pvCount = pageViews?.filter(pv => {
        const pvDate = format(new Date(pv.page_path), 'yyyy-MM-dd');
        return pvDate === dateStr;
      }).length || 0;

      const jqCount = jeevesData?.filter(jq => {
        const jqDate = format(new Date(jq.created_at), 'yyyy-MM-dd');
        return jqDate === dateStr;
      }).length || 0;

      dailyStats.push({
        date: format(date, 'MMM dd'),
        page_views: pvCount,
        jeeves_queries: jqCount,
      });
    }
    setDailyActivity(dailyStats);
  };

  // Auto-refresh live users every 10 seconds when admin
  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(fetchLiveUsers, 10000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  return {
    isAdmin,
    loading,
    pageViewStats,
    recentJeevesQueries,
    dailyActivity,
    totalPageViews,
    totalJeevesQueries,
    uniqueUsers,
    liveUsersCount,
    refetch: fetchAnalytics,
    refetchLiveUsers: fetchLiveUsers,
  };
};
