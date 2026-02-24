import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsSnapshot {
  id: string;
  snapshot_date: string;
  stripe_active: number;
  stripe_trialing: number;
  stripe_cancelled: number;
  tier_essential: number;
  tier_premium: number;
  tier_student: number;
  tier_church: number;
  mrr_cents: number;
  patreon_active: number;
  pickaxe_count: number;
  lifetime_access: number;
  total_users: number;
  new_signups_today: number;
  active_churches: number;
  created_at: string;
}

export type TimeRange = "7d" | "30d" | "90d" | "all";

export function useAnalyticsSnapshots(initialRange: TimeRange = "30d") {
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);

  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = (supabase as any)
        .from("analytics_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: true });

      // Apply time range filter
      if (timeRange !== "all") {
        const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte("snapshot_date", startDate.toISOString().split("T")[0]);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setSnapshots((data as AnalyticsSnapshot[]) || []);
    } catch (err: any) {
      console.error("Error fetching analytics snapshots:", err);
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Record a new snapshot (triggers the DB function)
  const recordSnapshot = useCallback(async () => {
    try {
      const { error: rpcError } = await (supabase as any).rpc("record_analytics_snapshot");
      if (rpcError) throw rpcError;
      await fetchSnapshots();
      return { success: true };
    } catch (err: any) {
      console.error("Error recording snapshot:", err);
      return { success: false, error: err.message };
    }
  }, [fetchSnapshots]);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  // Calculate summary stats
  const summary = snapshots.length > 0 ? {
    dataPoints: snapshots.length,
    latestSnapshot: snapshots[snapshots.length - 1],
    firstSnapshot: snapshots[0],
    // Growth calculations
    subscriberGrowth: snapshots.length >= 2
      ? snapshots[snapshots.length - 1].stripe_active - snapshots[0].stripe_active
      : 0,
    mrrGrowth: snapshots.length >= 2
      ? snapshots[snapshots.length - 1].mrr_cents - snapshots[0].mrr_cents
      : 0,
    userGrowth: snapshots.length >= 2
      ? snapshots[snapshots.length - 1].total_users - snapshots[0].total_users
      : 0,
  } : null;

  return {
    snapshots,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch: fetchSnapshots,
    recordSnapshot,
    summary,
  };
}
