import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth } from 'date-fns';

interface RevenueMetrics {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  churnedThisMonth: number;
  churnRate: number;
  newSubscribersThisMonth: number;
  conversionRate: number;
  averageRevenuePerUser: number;
}

interface TrialMetrics {
  totalTrials: number;
  trialsExpiringSoon: number; // Next 3 days
  trialsExpiredUnconverted: number;
  avgTrialAge: number;
  trialsBySource: { source: string; count: number }[];
  trialConversionByDay: { day: number; converted: number; total: number }[];
}

interface CohortData {
  cohortDate: string;
  totalUsers: number;
  stillActive: number;
  retentionRate: number;
}

interface OnboardingFunnel {
  step: string;
  count: number;
  dropoff: number;
}

export interface PdfPurchase {
  id: string;
  product: string;
  amount: number;
  email: string | null;
  name: string | null;
  date: string;
  pdfSent: boolean;
  pdfSentAt: string | null;
}

export interface PdfMetrics {
  totalPurchases: number;
  totalRevenue: number;
  purchases: PdfPurchase[];
}

// Stripe MRR will be fetched from the edge function for accuracy

export function useRevenueAnalytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [trialMetrics, setTrialMetrics] = useState<TrialMetrics | null>(null);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [onboardingFunnel, setOnboardingFunnel] = useState<OnboardingFunnel[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<{ month: string; mrr: number; subscribers: number }[]>([]);
  const [stripeMrr, setStripeMrr] = useState<number | null>(null);
  const [pdfMetrics, setPdfMetrics] = useState<PdfMetrics | null>(null);

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRevenueMetrics(),
        fetchTrialMetrics(),
        fetchCohortData(),
        fetchOnboardingFunnel(),
        fetchMonthlyTrend(),
        fetchStripeMrr(),
        fetchPdfPurchases(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch PDF purchases from Stripe via edge function
  const fetchPdfPurchases = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-pdf-purchases');
      if (!error && data?.purchases) {
        setPdfMetrics({
          totalPurchases: data.purchases.length,
          totalRevenue: data.purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
          purchases: data.purchases,
        });
      }
    } catch (e) {
      console.debug('[useRevenueAnalytics] Could not fetch PDF purchases', e);
    }
  };

  // Fetch MRR from Stripe via edge function (authoritative source)
  const fetchStripeMrr = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-subscriber-stats');
      if (!error && data?.stats?.stripe?.total_mrr_cents) {
        setStripeMrr(data.stats.stripe.total_mrr_cents / 100);
      }
    } catch (e) {
      console.debug('[useRevenueAnalytics] Could not fetch Stripe MRR', e);
    }
  };

  const fetchTrialMetrics = async () => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Get all trial users with their trial end dates
    const { data: trialUsers } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, created_at')
      .eq('subscription_status', 'trial');

    // Get converted users (were trial, now active with stripe)
    const { data: convertedUsers } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at, created_at, stripe_subscription_id, updated_at')
      .eq('subscription_status', 'active')
      .not('stripe_subscription_id', 'is', null);

    // Get expired trials that never converted
    const { data: expiredTrials } = await supabase
      .from('user_subscriptions')
      .select('user_id, trial_ends_at')
      .eq('subscription_status', 'trial')
      .lt('trial_ends_at', now.toISOString());

    const totalTrials = trialUsers?.length || 0;
    
    // Trials expiring in next 3 days
    const trialsExpiringSoon = trialUsers?.filter(t => {
      if (!t.trial_ends_at) return false;
      const endDate = new Date(t.trial_ends_at);
      return endDate > now && endDate <= threeDaysFromNow;
    }).length || 0;

    // Calculate average trial age (using created_at as trial start)
    const trialAges = trialUsers?.map(t => {
      const start = new Date(t.created_at);
      return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }) || [];
    const avgTrialAge = trialAges.length > 0 
      ? Math.round(trialAges.reduce((a, b) => a + b, 0) / trialAges.length) 
      : 0;

    // Calculate conversion by trial day (using created_at as start, updated_at as conversion)
    const conversionByDay: { day: number; converted: number; total: number }[] = [];
    for (let day = 1; day <= 14; day++) {
      const convertedOnDay = convertedUsers?.filter(u => {
        const trialStart = new Date(u.created_at);
        const conversionDate = new Date(u.updated_at || u.created_at);
        const dayDiff = Math.floor((conversionDate.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        return dayDiff === day || (day === 14 && dayDiff >= 14);
      }).length || 0;

      conversionByDay.push({
        day,
        converted: convertedOnDay,
        total: totalTrials + (convertedUsers?.length || 0),
      });
    }

    setTrialMetrics({
      totalTrials,
      trialsExpiringSoon,
      trialsExpiredUnconverted: expiredTrials?.length || 0,
      avgTrialAge,
      trialsBySource: [], // Could track referral sources
      trialConversionByDay: conversionByDay,
    });
  };

  const fetchRevenueMetrics = async () => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    // Fetch real MRR from Stripe via edge function - this is the authoritative source
    let stripeMrr = 0;
    let stripeActiveCount = 0;

    try {
      const { data: stripeStats, error: stripeError } = await supabase.functions.invoke('get-subscriber-stats');

      if (!stripeError && stripeStats?.stats?.stripe) {
        // Convert cents to dollars
        stripeMrr = (stripeStats.stats.stripe.total_mrr_cents || 0) / 100;
        // Use Stripe active count as the authoritative source (matches Overview tab)
        stripeActiveCount = stripeStats.stats.stripe.active_subscriptions || 0;
      }
    } catch (err) {
      console.error('Failed to fetch Stripe stats:', err);
    }

    // Get database subscription data for other metrics
    const { data: subs } = await supabase
      .from('user_subscriptions')
      .select('subscription_status, subscription_tier, created_at, has_lifetime_access');

    const activeSubs = subs?.filter(s => s.subscription_status === 'active') || [];
    const trialSubs = subs?.filter(s => s.subscription_status === 'trial') || [];

    // Get cancelled subscriptions from profiles (subscription_cancelled_at)
    const { data: cancelledProfiles } = await supabase
      .from('profiles')
      .select('id, subscription_cancelled_at')
      .not('subscription_cancelled_at', 'is', null);

    const churnedThisMonth = cancelledProfiles?.filter(p =>
      p.subscription_cancelled_at &&
      new Date(p.subscription_cancelled_at) >= monthStart
    ).length || 0;

    // New subscribers this month
    const newThisMonth = activeSubs.filter(s =>
      s.created_at && new Date(s.created_at) >= monthStart
    ).length;

    // Trial conversion (trials that became active)
    const totalTrials = trialSubs.length + activeSubs.length;
    const conversionRate = totalTrials > 0 ? (activeSubs.length / totalTrials) * 100 : 0;

    // Churn rate - use Stripe count as authoritative
    const effectiveActiveCount = stripeActiveCount > 0 ? stripeActiveCount : activeSubs.length;
    const startOfMonthActive = effectiveActiveCount + churnedThisMonth;
    const churnRate = startOfMonthActive > 0 ? (churnedThisMonth / startOfMonthActive) * 100 : 0;

    // MRR from Stripe (authoritative)
    const finalMrr = Math.round(stripeMrr * 100) / 100;

    setMetrics({
      mrr: finalMrr,
      arr: Math.round(finalMrr * 12 * 100) / 100,
      // Use Stripe active count to match Overview tab (authoritative source)
      activeSubscribers: stripeActiveCount > 0 ? stripeActiveCount : activeSubs.length,
      churnedThisMonth,
      churnRate: Math.round(churnRate * 10) / 10,
      newSubscribersThisMonth: newThisMonth,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageRevenuePerUser: effectiveActiveCount > 0 ? Math.round((finalMrr / effectiveActiveCount) * 100) / 100 : 0,
    });
  };

  const fetchCohortData = async () => {
    // Get profiles grouped by cohort (signup month)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, created_at, cohort_date')
      .order('created_at', { ascending: true });

    // Get active subscriptions
    const { data: activeSubs } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('subscription_status', 'active');

    const activeUserIds = new Set(activeSubs?.map(s => s.user_id) || []);

    // Group by month
    const cohortMap = new Map<string, { total: number; active: number }>();

    profiles?.forEach(profile => {
      const cohortMonth = profile.cohort_date 
        ? format(new Date(profile.cohort_date), 'yyyy-MM')
        : format(new Date(profile.created_at), 'yyyy-MM');
      
      const existing = cohortMap.get(cohortMonth) || { total: 0, active: 0 };
      existing.total++;
      if (activeUserIds.has(profile.id)) {
        existing.active++;
      }
      cohortMap.set(cohortMonth, existing);
    });

    // Convert to array and sort
    const cohortArray: CohortData[] = Array.from(cohortMap.entries())
      .map(([date, data]) => ({
        cohortDate: date,
        totalUsers: data.total,
        stillActive: data.active,
        retentionRate: Math.round((data.active / data.total) * 100),
      }))
      .sort((a, b) => b.cohortDate.localeCompare(a.cohortDate))
      .slice(0, 6); // Last 6 months

    setCohorts(cohortArray);
  };

  const fetchOnboardingFunnel = async () => {
    // Get onboarding events
    const { data: events } = await supabase
      .from('user_events')
      .select('event_type, event_data')
      .in('event_type', [
        'onboarding_started',
        'onboarding_step',
        '24fps_tour_started',
        '24fps_tour_completed',
        '24fps_tour_skipped',
      ]);

    const counts: Record<string, number> = {
      'Started Onboarding': 0,
      'Selected Role': 0,
      'Started 24FPS Tour': 0,
      'Completed 24FPS Tour': 0,
      'Skipped Tour': 0,
    };

    events?.forEach(e => {
      if (e.event_type === 'onboarding_started') counts['Started Onboarding']++;
      if (e.event_type === 'onboarding_step' && (e.event_data as any)?.step_name === 'role') counts['Selected Role']++;
      if (e.event_type === '24fps_tour_started') counts['Started 24FPS Tour']++;
      if (e.event_type === '24fps_tour_completed') counts['Completed 24FPS Tour']++;
      if (e.event_type === '24fps_tour_skipped') counts['Skipped Tour']++;
    });

    const funnel: OnboardingFunnel[] = Object.entries(counts).map(([step, count], i, arr) => ({
      step,
      count,
      dropoff: i > 0 && arr[i-1][1] > 0 ? Math.round((1 - count / arr[i-1][1]) * 100) : 0,
    }));

    setOnboardingFunnel(funnel);
  };

  const fetchMonthlyTrend = async () => {
    // Last 6 months
    const months: { month: string; mrr: number; subscribers: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subDays(new Date(), i * 30);
      const monthKey = format(monthDate, 'MMM yyyy');
      
      // This is a simplified calculation - in production you'd want historical snapshots
      months.push({
        month: monthKey,
        mrr: 0, // Would need historical data
        subscribers: 0,
      });
    }

    // Get current month's data
    const { data: currentSubs } = await supabase
      .from('user_subscriptions')
      .select('subscription_status, subscription_tier, created_at')
      .eq('subscription_status', 'active');

    if (months.length > 0 && currentSubs) {
      months[months.length - 1].subscribers = currentSubs.length;
      months[months.length - 1].mrr = currentSubs.reduce((sum, s) => {
        return sum + (s.subscription_tier === 'premium' ? 14.97 : 9.97);
      }, 0);
    }

    setMonthlyTrend(months);
  };

  // Use Stripe MRR as authoritative source when available
  const finalMetrics = metrics && stripeMrr !== null ? {
    ...metrics,
    mrr: stripeMrr,
    arr: Math.round(stripeMrr * 12 * 100) / 100,
    averageRevenuePerUser: metrics.activeSubscribers > 0 
      ? Math.round((stripeMrr / metrics.activeSubscribers) * 100) / 100 
      : 0,
  } : metrics;

  return {
    loading,
    metrics: finalMetrics,
    trialMetrics,
    pdfMetrics,
    cohorts,
    onboardingFunnel,
    monthlyTrend,
    refetch: fetchAllMetrics,
  };
}
