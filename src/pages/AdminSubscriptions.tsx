import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueDashboard } from "@/components/admin/RevenueDashboard";
import { EmailCampaignManager } from "@/components/admin/EmailCampaignManager";
import { SubscriptionMismatches } from "@/components/admin/SubscriptionMismatches";
import { BulkEmailSender } from "@/components/admin/BulkEmailSender";
import { ImageBibleGenerator } from "@/components/admin/ImageBibleGenerator";
import { PatreonOutreach } from "@/components/admin/PatreonOutreach";
import { PatreonManualLink } from "@/components/admin/PatreonManualLink";
import { PickaxeImport } from "@/components/admin/PickaxeImport";
import { PickaxeEmailCampaign } from "@/components/admin/PickaxeEmailCampaign";
import { TeachableEmailCampaign } from "@/components/admin/TeachableEmailCampaign";
import { AdminPasswordReset } from "@/components/admin/AdminPasswordReset";
import { SubscriptionAnalyticsChart } from "@/components/admin/SubscriptionAnalyticsChart";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { EmailCampaignHistory } from "@/components/admin/EmailCampaignHistory";
import { RecentSubscribers } from "@/components/admin/RecentSubscribers";
import { DonationStats } from "@/components/admin/DonationStats";
import { SubscriptionDatabase } from "@/components/admin/SubscriptionDatabase";
import { Badge } from "@/components/ui/badge";

interface StripeStats {
  active_subscriptions: number;
  trialing_subscriptions: number;
  canceled_subscriptions: number;
  by_tier: {
    essential: number;
    premium: number;
    student: number;
    unknown: number;
  };
  by_product?: Record<string, { active: number; trialing: number }>;
  total_mrr_cents: number;
  error: string | null;
  unlinked_count: number;
}

interface StripeSyncSummary {
  total_stripe_subscriptions: number;
  updated: number;
  already_synced: number;
  errors: number;
  unmatched_stripe_subscriptions: number;
}

interface StripeSyncRun {
  ran_at: string;
  summary: StripeSyncSummary;
}

interface PatreonStats {
  total_connected: number;
  active_patrons: number;
  at_20_or_above: number;
  below_20: number;
}

interface DatabaseStats {
  total_users: number;
  active_trials: number;
  by_tier: Record<string, number>;
  by_status: Record<string, number>;
  by_payment_source: Record<string, number>;
  lifetime_access: number;
  teachable_users?: number;
}

interface SubscriptionStats {
  summary: {
    total_paying_stripe: number;
    total_paying_patreon: number;
    total_trialing: number;
    total_lifetime: number;
    total_with_access: number;
    monthly_recurring_revenue: string;
    current_mrr?: string;
    current_mrr_cents?: number;
    projected_mrr?: string;
    projected_mrr_cents?: number;
    trialing_mrr?: string;
    trialing_mrr_cents?: number;
    stripe_unlinked_subscriptions?: number;
  };
  stripe: StripeStats;
  patreon: PatreonStats;
  database: DatabaseStats;
  recent_signups_30d: number;
  generated_at: string;
}

interface ChurchStats {
  totalChurches: number;
  churchSeats: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

interface PdfStats {
  byProduct: Record<string, { count: number; revenue: number }>;
  totalRevenue: number;
  totalCount: number;
}

export default function AdminSubscriptions() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingPatreonReminder, setSendingPatreonReminder] = useState(false);
  const [importingTeachable, setImportingTeachable] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [churchStats, setChurchStats] = useState<ChurchStats | null>(null);
  const [pdfStats, setPdfStats] = useState<PdfStats | null>(null);
  const [lastStripeSync, setLastStripeSync] = useState<StripeSyncRun | null>(null);
  const [teachableCount, setTeachableCount] = useState<number>(0);
  const [teachableStudents, setTeachableStudents] = useState<any[]>([]);
  const [pickaxeCount, setPickaxeCount] = useState<number>(0);
  const [pickaxeLinkedCount, setPickaxeLinkedCount] = useState<number>(0);
  const [pickaxePaidCount, setPickaxePaidCount] = useState<number>(0);
  const [pickaxeMembers, setPickaxeMembers] = useState<any[]>([]);

  // Make refresh activity visible and avoid overlapping refresh requests.
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState<number | null>(null);
  const refreshInFlightRef = useRef(false);

  const handleSyncStripeSubscriptions = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-subscriptions');

      if (error) throw error;

      const summary: StripeSyncSummary | undefined = data?.summary;
      if (summary) {
        setLastStripeSync({
          ran_at: new Date().toISOString(),
          summary,
        });
      }

      toast({
        title: "Sync Complete",
        description: summary
          ? `Updated ${summary.updated} • Already synced ${summary.already_synced} • Unmatched ${summary.unmatched_stripe_subscriptions}${summary.errors ? ` • Errors ${summary.errors}` : ''}`
          : "Sync completed",
      });

      // Reload stats after sync
      await loadStats();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync subscriptions",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSendPatreonReminder = async () => {
    setSendingPatreonReminder(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-patreon-reminder');
      
      if (error) throw error;
      
      toast({
        title: "Patreon Reminder Sent",
        description: data?.message || `Sent ${data?.emailsSent || 0} reminder emails`,
      });
    } catch (error: any) {
      console.error("Patreon reminder error:", error);
      toast({
        title: "Failed to Send Reminders",
        description: error.message || "Failed to send Patreon reminders",
        variant: "destructive",
      });
    } finally {
      setSendingPatreonReminder(false);
    }
  };

  const handleImportTeachableStudents = async () => {
    setImportingTeachable(true);
    let totalImported = 0;
    let currentPage = 1;
    let hasMore = true;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Loop to handle batched imports
      while (hasMore) {
        toast({
          title: "Importing Teachable Students",
          description: `Fetching pages starting from ${currentPage}... (${totalImported} imported so far)`,
        });

        const { data, error } = await supabase.functions.invoke('import-teachable-students', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: { startPage: currentPage },
        });
        
        if (error) throw error;
        
        totalImported += data?.imported || 0;
        
        if (data?.needsContinuation && data?.nextPage) {
          currentPage = data.nextPage;
          console.log(`Continuing import from page ${currentPage}...`);
        } else {
          hasMore = false;
        }
      }
      
      toast({
        title: "Teachable Import Complete",
        description: `Successfully imported ${totalImported} students`,
      });
      
      // Reload stats after import
      await loadStats();
    } catch (error: any) {
      console.error("Teachable import error:", error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import Teachable students",
        variant: "destructive",
      });
    } finally {
      setImportingTeachable(false);
    }
  };

  

  // loadStats defined BEFORE the effects that use it
  const loadStats = useCallback(
    async (opts?: { reason?: "interval" | "manual" | "focus" | "init"; silent?: boolean }) => {
      if (refreshInFlightRef.current) return;

      refreshInFlightRef.current = true;
      setRefreshing(true);

      try {
        // Use the edge function that queries Stripe directly
        const { data: statsData, error: statsError } = await supabase.functions.invoke(
          "get-subscriber-stats"
        );

        if (statsError) {
          console.error("[AdminSubscriptions] Stats error:", statsError);
          throw statsError;
        }

        if (statsData?.stats) {
          console.log("[AdminSubscriptions] Got stats from edge function:", statsData.stats);
          setStats(statsData.stats);
          setLastRefreshedAt(new Date());
        }

        // Get church subscriptions separately
        const { data: churches } = await supabase
          .from("churches")
          .select("tier, max_seats, subscription_status")
          .eq("subscription_status", "active");

        const churchSeats = {
          tier1:
            churches?.filter((c) => c.tier === "tier1").reduce((sum, c) => sum + c.max_seats, 0) ||
            0,
          tier2:
            churches?.filter((c) => c.tier === "tier2").reduce((sum, c) => sum + c.max_seats, 0) ||
            0,
          tier3:
            churches?.filter((c) => c.tier === "tier3").reduce((sum, c) => sum + c.max_seats, 0) ||
            0,
        };

        setChurchStats({
          totalChurches: churches?.length || 0,
          churchSeats,
        });

        // Get Teachable users count and details
        const { count: teachableUsers, data: teachableData } = await supabase
          .from("teachable_students")
          .select("*", { count: "exact" });

        setTeachableCount(teachableUsers || 0);
        setTeachableStudents(teachableData || []);

        // Get Pickaxe total members count and details
        const { count: totalPickaxe, data: pickaxeData } = await supabase
          .from("pickaxe_connections" as any)
          .select("*", { count: "exact" });

        setPickaxeCount(totalPickaxe || 0);
        setPickaxeMembers(pickaxeData || []);

        // Get Pickaxe members linked to app
        const { count: linkedPickaxe } = await supabase
          .from("pickaxe_connections" as any)
          .select("*", { count: "exact", head: true })
          .not("user_id", "is", null);

        setPickaxeLinkedCount(linkedPickaxe || 0);

        // Get Pickaxe paid members count
        const { count: paidPickaxe } = await supabase
          .from("pickaxe_connections" as any)
          .select("*", { count: "exact", head: true })
          .eq("is_paid_user", true);

        setPickaxePaidCount(paidPickaxe || 0);

        // Get PDF purchases stats
        try {
          const { data: pdfData, error: pdfError } = await supabase.functions.invoke("get-pdf-purchases");
          if (!pdfError && pdfData) {
            setPdfStats({
              byProduct: pdfData.byProduct || {},
              totalRevenue: pdfData.totalRevenue || 0,
              totalCount: pdfData.totalCount || 0,
            });
          }
        } catch (pdfErr) {
          console.log("[AdminSubscriptions] PDF stats fetch failed (optional):", pdfErr);
        }
      } catch (error: any) {
        console.error("Error loading stats:", error);

        if (!opts?.silent) {
          toast({
            title: "Error Loading Stats",
            description: error?.message || "Failed to load subscription analytics",
            variant: "destructive",
          });
        }
      } finally {
        refreshInFlightRef.current = false;
        setRefreshing(false);
        setLoading(false);
      }
    },
    [toast]
  );

  // checkAdminAndLoadStats defined after loadStats so it can use it
  const checkAdminAndLoadStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("[AdminSubscriptions] Checking admin for user:", user.id);

    try {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      console.log("[AdminSubscriptions] Role check result:", { roleData, roleError });

      if (roleError) {
        console.error("[AdminSubscriptions] Error checking role:", roleError);
        setLoading(false);
        return;
      }

      if (!roleData) {
        console.log("[AdminSubscriptions] No admin role found, redirecting to dashboard");
        setIsAdmin(false);
        setLoading(false);
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await loadStats();
    } catch (error) {
      console.error("[AdminSubscriptions] Error in checkAdminAndLoadStats:", error);
      setLoading(false);
    }
  }, [user, navigate, loadStats]);

  // Initial load when auth is ready
  useEffect(() => {
    if (authLoading) {
      console.log("[AdminSubscriptions] Auth still loading...");
      return;
    }
    
    if (!user) {
      console.log("[AdminSubscriptions] No user, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    checkAdminAndLoadStats();
  }, [user, authLoading, navigate, checkAdminAndLoadStats]);

  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      console.log("[AdminSubscriptions] Auto-refreshing stats...");
      loadStats({ reason: "interval" });
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [isAdmin, loadStats]);

  // Refresh when the tab regains focus / becomes visible (intervals can be throttled)
  useEffect(() => {
    if (!isAdmin) return;

    const handleVisible = () => {
      if (document.visibilityState === "visible") {
        console.log("[AdminSubscriptions] Tab focused/visible, refreshing stats...");
        loadStats({ reason: "focus" });
      }
    };

    window.addEventListener("focus", handleVisible);
    document.addEventListener("visibilitychange", handleVisible);

    return () => {
      window.removeEventListener("focus", handleVisible);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [isAdmin, loadStats]);

  // Lightweight UI timer so the page doesn't feel static
  useEffect(() => {
    if (!lastRefreshedAt) {
      setSecondsSinceRefresh(null);
      return;
    }

    const update = () => {
      setSecondsSinceRefresh(Math.floor((Date.now() - lastRefreshedAt.getTime()) / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastRefreshedAt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const stripeCurrent = stats.stripe.active_subscriptions + stats.stripe.trialing_subscriptions;
  const dbLinked = stats.database.by_payment_source.stripe || 0;
  const unlinked = stats.stripe.unlinked_count || Math.max(0, stripeCurrent - dbLinked);
  const dbVsStripeMatch = unlinked === 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-muted-foreground">
            Live data • Last updated: {new Date(stats.generated_at).toLocaleTimeString()}
            <span className="text-xs ml-2">(auto-refreshes every 60s)</span>
            {secondsSinceRefresh !== null && (
              <span className="text-xs ml-2">• Refreshed {secondsSinceRefresh}s ago</span>
            )}
          </p>
          {/* Debug info for Stripe issues */}
          {stats.stripe?.error && (
            <p className="text-sm text-red-500 mt-1 font-mono bg-red-500/10 px-2 py-1 rounded">
              Stripe Error: {stats.stripe.error}
            </p>
          )}
          {(stats as any).debug && (
            <p className="text-xs text-amber-500 mt-1 font-mono">
              Debug: hasStripeKey={String((stats as any).debug?.hasStripeKey)} | keyPrefix={(stats as any).debug?.stripeKeyPrefix}
            </p>
          )}
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Note: New Stripe subscriptions sync when users log in or when you click "Sync Stripe Subscriptions"
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadStats({ reason: "manual" })}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Stats
              </>
            )}
          </Button>

          <Button onClick={handleSyncStripeSubscriptions} disabled={syncing} variant="outline">
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Stripe Subscriptions
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
          <TabsTrigger value="mismatches">Subscription Health</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Churn</TabsTrigger>
          <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="email">Quick Email</TabsTrigger>
          <TabsTrigger value="image-bible">Image Bible</TabsTrigger>
          <TabsTrigger value="patreon">Patreon</TabsTrigger>
          <TabsTrigger value="teachable">Teachable</TabsTrigger>
          <TabsTrigger value="pickaxe">Pickaxe</TabsTrigger>
          <TabsTrigger value="users">User Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Total Users Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total All-Time Users</CardTitle>
                <CardDescription>All registered accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.database.total_users}</div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Paying Users</CardTitle>
                <CardDescription>Stripe + Patreon + Lifetime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stats.summary.total_with_access}</div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards - REAL STRIPE DATA */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Stripe Active
                </CardTitle>
                <CardDescription>Paying subscribers (live)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{stats.stripe.active_subscriptions}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-blue-500">⏳</span>
                  7-Day Trials
                </CardTitle>
                <CardDescription>Currently in trial period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{stats.stripe.trialing_subscriptions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patreon Active</CardTitle>
                <CardDescription>Connected patrons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.patreon.active_patrons}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lifetime</CardTitle>
                <CardDescription>Permanent access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.database.lifetime_access}</div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Teachable</CardTitle>
                <CardDescription>Course students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{teachableCount}</div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/50 bg-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pickaxe</CardTitle>
                <CardDescription>Total members / Linked to app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">
                  {pickaxeLinkedCount} <span className="text-lg text-muted-foreground">/ {pickaxeCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MRR Cards - Current vs Projected */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current MRR</CardTitle>
                <CardDescription>From {stats.stripe.active_subscriptions} active paying subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {stats.summary.current_mrr || stats.summary.monthly_recurring_revenue}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Revenue you're collecting right now
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Projected MRR</CardTitle>
                <CardDescription>Includes {stats.stripe.trialing_subscriptions} trialing users with cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {stats.summary.projected_mrr || stats.summary.monthly_recurring_revenue}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{stats.summary.trialing_mrr || '$0.00'} from trials (cards on file, converts in 7 days)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donations Section */}
          <DonationStats />

          {/* Recent Subscribers */}
          <RecentSubscribers />

          {/* Data Sync Status */}
          <Card className={dbVsStripeMatch ? "border-green-500/30" : "border-yellow-500/50 bg-yellow-500/5"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {dbVsStripeMatch ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                Stripe ↔ Database Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-muted-foreground">Stripe current (active+trial):</span>{" "}
                  <Badge variant="outline" className="text-lg">{stripeCurrent}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">DB linked:</span>{" "}
                  <Badge variant="outline" className="text-lg">{dbLinked}</Badge>
                </div>
                {unlinked > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {unlinked} not linked to an account
                  </Badge>
                )}
              </div>

              {unlinked > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  The sync can only link subscriptions to existing app accounts (email match). Subscriptions without an account will remain unlinked.
                </p>
              )}

              {lastStripeSync && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last sync ({new Date(lastStripeSync.ran_at).toLocaleString()}): Updated {lastStripeSync.summary.updated} • Already synced {lastStripeSync.summary.already_synced} • Unmatched {lastStripeSync.summary.unmatched_stripe_subscriptions}
                  {lastStripeSync.summary.errors ? ` • Errors ${lastStripeSync.summary.errors}` : ""}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Stripe Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Stripe Subscriptions by Tier</CardTitle>
                <CardDescription>Live data from Stripe API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Essential</span>
                  <span className="text-2xl font-bold">{stats.stripe.by_tier.essential}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Premium</span>
                  <span className="text-2xl font-bold">{stats.stripe.by_tier.premium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Student</span>
                  <span className="text-2xl font-bold">{stats.stripe.by_tier.student}</span>
                </div>
                {stats.stripe.by_tier.unknown > 0 && (
                  <div className="flex justify-between items-center text-yellow-600">
                    <span>Unknown/Legacy</span>
                    <span className="text-2xl font-bold">{stats.stripe.by_tier.unknown}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-red-600">
                    <span>Canceled (all time)</span>
                    <span className="text-xl font-medium">{stats.stripe.canceled_subscriptions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stripe Breakdown by Product */}
            <Card>
              <CardHeader>
                <CardTitle>Breakdown by Product</CardTitle>
                <CardDescription>Active + Trialing subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {stats.stripe.by_product && Object.entries(stats.stripe.by_product)
                  .sort(([, a], [, b]) => (b.active + b.trialing) - (a.active + a.trialing))
                  .map(([name, counts]) => (
                    <div key={name} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground truncate max-w-[200px]" title={name}>
                        {name}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant="default" className="bg-green-600">{counts.active}</Badge>
                        {counts.trialing > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">{counts.trialing} trial</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                {(!stats.stripe.by_product || Object.keys(stats.stripe.by_product).length === 0) && (
                  <p className="text-sm text-muted-foreground">No product breakdown available</p>
                )}

                {/* PDF Sales Section */}
                {pdfStats && Object.keys(pdfStats.byProduct).length > 0 && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <div className="text-xs text-muted-foreground mb-2 font-medium">PDF Sales (One-time)</div>
                      {Object.entries(pdfStats.byProduct).map(([name, data]) => (
                        <div key={name} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground truncate max-w-[200px]" title={name}>
                            {name}
                          </span>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="border-purple-500 text-purple-600">{data.count} sold</Badge>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">${data.revenue}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Church Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Church Subscriptions</CardTitle>
                <CardDescription>Active church accounts and seats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Churches</span>
                  <span className="text-2xl font-bold">{churchStats?.totalChurches || 0}</span>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tier 1 Seats (30)</span>
                    <span className="font-medium">{churchStats?.churchSeats.tier1 || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tier 2 Seats (100)</span>
                    <span className="font-medium">{churchStats?.churchSeats.tier2 || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tier 3 Seats (Unlimited)</span>
                    <span className="font-medium">{churchStats?.churchSeats.tier3 || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Stats (for reference) */}
          <Card className="opacity-75">
            <CardHeader>
              <CardTitle className="text-lg">Database Reference (profiles table)</CardTitle>
              <CardDescription>This shows what's stored in your database - may differ from Stripe reality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Users</div>
                  <div className="font-medium">{stats.database.total_users}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Active in DB</div>
                  <div className="font-medium">{stats.database.by_status.active || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Trial in DB</div>
                  <div className="font-medium">{stats.database.by_status.trial || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">30-Day Signups</div>
                  <div className="font-medium">{stats.recent_signups_30d}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SubscriptionAnalyticsChart />
          <SubscriptionDatabase />
        </TabsContent>

        <TabsContent value="mismatches">
          <SubscriptionMismatches />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueDashboard />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <EmailCampaignHistory />
          <EmailCampaignManager />
        </TabsContent>

        <TabsContent value="email">
          <BulkEmailSender />
        </TabsContent>

        <TabsContent value="image-bible">
          <ImageBibleGenerator />
        </TabsContent>

        <TabsContent value="patreon" className="space-y-6">
          <PatreonManualLink />
          <PatreonOutreach />
        </TabsContent>

        <TabsContent value="teachable" className="space-y-6">
          {/* Teachable Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Teachable Students</CardTitle>
                <CardDescription>Enrolled in courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{teachableCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Students</CardTitle>
                <CardDescription>Currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{teachableStudents.filter(s => s.is_active).length}</div>
              </CardContent>
            </Card>

            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Linked to App</CardTitle>
                <CardDescription>With user_id</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{teachableStudents.filter(s => s.user_id).length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unlinked</CardTitle>
                <CardDescription>Not connected to app accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-muted-foreground">{teachableStudents.filter(s => !s.user_id).length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Import Button */}
          <Card>
            <CardHeader>
              <CardTitle>Import from Teachable API</CardTitle>
              <CardDescription>Fetch all students directly from your Teachable account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleImportTeachableStudents} 
                disabled={importingTeachable}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {importingTeachable ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing from Teachable...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Import All Students from Teachable
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Teachable Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Teachable Students</CardTitle>
              <CardDescription>All enrolled students with emails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {teachableStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{student.teachable_email}</div>
                      <div className="text-sm text-muted-foreground">{student.course_name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.user_id ? (
                        <Badge variant="default" className="bg-green-500">Linked</Badge>
                      ) : (
                        <Badge variant="outline">Not Linked</Badge>
                      )}
                      {student.is_active && <Badge variant="secondary">Active</Badge>}
                    </div>
                  </div>
                ))}
                {teachableStudents.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No Teachable students found. Click "Import All Students" to fetch from Teachable API.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Campaign */}
          <TeachableEmailCampaign />
        </TabsContent>

        <TabsContent value="pickaxe" className="space-y-6">
          {/* Pickaxe Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-purple-500/50 bg-purple-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Pickaxe Members</CardTitle>
                <CardDescription>All members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">{pickaxeCount}</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Paying</CardTitle>
                <CardDescription>Paid status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{pickaxePaidCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Linked to App</CardTitle>
                <CardDescription>Suite subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{pickaxeLinkedCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Unlinked</CardTitle>
                <CardDescription>Not connected to app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-muted-foreground">{pickaxeCount - pickaxeLinkedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pickaxe Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Pickaxe Members</CardTitle>
              <CardDescription>All members with emails and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {pickaxeMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{member.pickaxe_email || member.pickaxe_name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.pickaxe_name && `Name: ${member.pickaxe_name}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.is_paid_user ? (
                        <Badge variant="default" className="bg-green-500">Paid</Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                      {member.user_id ? (
                        <Badge variant="secondary">Suite Sub</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Not Linked</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {pickaxeMembers.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No Pickaxe members found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Import Component */}
          <PickaxeImport />

          {/* Email Campaign */}
          <PickaxeEmailCampaign />
        </TabsContent>

        {/* User Tools Tab */}
        <TabsContent value="users" className="space-y-6">
          <AdminUserManagement />
          <AdminPasswordReset />
        </TabsContent>
      </Tabs>
    </div>
  );
}
