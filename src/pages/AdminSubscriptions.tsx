import { useEffect, useState } from "react";
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
  total_mrr_cents: number;
  error: string | null;
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

interface UserNeedingSync {
  email: string;
  tier: string;
  status: string;
}

interface SubscriptionStats {
  summary: {
    total_paying_stripe: number;
    total_paying_patreon: number;
    total_trialing: number;
    total_lifetime: number;
    total_with_access: number;
    monthly_recurring_revenue: string;
  };
  stripe: StripeStats;
  patreon: PatreonStats;
  database: DatabaseStats;
  recent_signups_30d: number;
  users_needing_sync?: UserNeedingSync[];
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

export default function AdminSubscriptions() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sendingPatreonReminder, setSendingPatreonReminder] = useState(false);
  const [sendingSyncReminder, setSendingSyncReminder] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [churchStats, setChurchStats] = useState<ChurchStats | null>(null);
  const [teachableCount, setTeachableCount] = useState<number>(0);

  const handleSyncStripeSubscriptions = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-subscriptions');
      
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `Synced ${data?.synced || 0} subscriptions successfully`,
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

  const handleSendSyncReminder = async () => {
    setSendingSyncReminder(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sync-reminder');
      
      if (error) throw error;
      
      toast({
        title: "Reminder Emails Sent",
        description: data?.message || `Sent ${data?.sent || 0} reminder emails to unsynced subscribers`,
      });
      
      await loadStats();
    } catch (error: any) {
      console.error("Sync reminder error:", error);
      toast({
        title: "Failed to Send Reminders",
        description: error.message || "Failed to send sync reminders",
        variant: "destructive",
      });
    } finally {
      setSendingSyncReminder(false);
    }
  };

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
  }, [user, authLoading, navigate]);

  const checkAdminAndLoadStats = async () => {
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
  };

  const loadStats = async () => {
    try {
      // Use the new edge function that queries Stripe directly
      const { data: statsData, error: statsError } = await supabase.functions.invoke('get-subscriber-stats');
      
      if (statsError) {
        console.error("[AdminSubscriptions] Stats error:", statsError);
        throw statsError;
      }

      if (statsData?.stats) {
        console.log("[AdminSubscriptions] Got stats from edge function:", statsData.stats);
        setStats(statsData.stats);
      }

      // Get church subscriptions separately
      const { data: churches } = await supabase
        .from("churches")
        .select("tier, max_seats, subscription_status")
        .eq("subscription_status", "active");

      const churchSeats = {
        tier1: churches?.filter(c => c.tier === 'tier1').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier2: churches?.filter(c => c.tier === 'tier2').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier3: churches?.filter(c => c.tier === 'tier3').reduce((sum, c) => sum + c.max_seats, 0) || 0,
      };

      setChurchStats({
        totalChurches: churches?.length || 0,
        churchSeats,
      });

      // Get Teachable users count
      const { count: teachableUsers } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("payment_source", "teachable");
      
      setTeachableCount(teachableUsers || 0);

    } catch (error) {
      console.error("Error loading stats:", error);
      toast({
        title: "Error Loading Stats",
        description: "Failed to load subscription analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const dbVsStripeMatch = stats.database.by_payment_source.stripe === stats.stripe.active_subscriptions;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Analytics</h1>
          <p className="text-muted-foreground">
            Live data from Stripe • Last updated: {new Date(stats.generated_at).toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={handleSyncStripeSubscriptions} 
          disabled={syncing}
          variant="outline"
        >
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mismatches">Subscription Health</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Churn</TabsTrigger>
          <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="email">Quick Email</TabsTrigger>
          <TabsTrigger value="image-bible">Image Bible</TabsTrigger>
          <TabsTrigger value="patreon">Patreon</TabsTrigger>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
                  14-Day Trials
                </CardTitle>
                <CardDescription>Currently in trial period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{stats.database.active_trials || 0}</div>
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
          </div>

          {/* MRR Card - Full Width */}
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Recurring Revenue (MRR)</CardTitle>
              <CardDescription>From Stripe subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.summary.monthly_recurring_revenue}</div>
            </CardContent>
          </Card>

          {/* Data Sync Status */}
          <Card className={dbVsStripeMatch ? "border-green-500/30" : "border-yellow-500/50 bg-yellow-500/5"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {dbVsStripeMatch ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                Database Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-muted-foreground">Stripe shows:</span>{" "}
                  <Badge variant="outline" className="text-lg">{stats.stripe.active_subscriptions}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Database shows:</span>{" "}
                  <Badge variant="outline" className="text-lg">{stats.database.by_payment_source.stripe || 0}</Badge>
                </div>
                {!dbVsStripeMatch && (
                  <Badge variant="destructive">
                    {stats.stripe.active_subscriptions - (stats.database.by_payment_source.stripe || 0)} users need sync
                  </Badge>
                )}
              </div>
              
              {/* Show users needing sync */}
              {stats.users_needing_sync && stats.users_needing_sync.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="text-sm font-medium mb-2">Users with active Stripe subscriptions not synced to database:</div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {stats.users_needing_sync.map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-muted/50 px-3 py-2 rounded">
                        <span className="font-mono">{user.email}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="capitalize">{user.tier}</Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Button 
                      onClick={handleSendSyncReminder} 
                      disabled={sendingSyncReminder}
                      size="sm"
                    >
                      {sendingSyncReminder ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Email Reminder to Login
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Sends reminder to these {stats.users_needing_sync.length} users to sign up/login
                    </p>
                  </div>
                </div>
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

        <TabsContent value="mismatches">
          <SubscriptionMismatches />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueDashboard />
        </TabsContent>

        <TabsContent value="campaigns">
          <EmailCampaignManager />
        </TabsContent>

        <TabsContent value="email">
          <BulkEmailSender />
        </TabsContent>

        <TabsContent value="image-bible">
          <ImageBibleGenerator />
        </TabsContent>

        <TabsContent value="patreon">
          <PatreonOutreach />
        </TabsContent>
      </Tabs>
    </div>
  );
}
