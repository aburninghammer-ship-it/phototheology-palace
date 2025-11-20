import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SubscriptionStats {
  totalPaid: number;
  byTier: {
    essential: number;
    premium: number;
    student: number;
  };
  totalLifetime: number;
  totalTrial: number;
  totalChurches: number;
  churchSeats: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);

  useEffect(() => {
    checkAdminAndLoadStats();
  }, [user]);

  const checkAdminAndLoadStats = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      navigate("/dashboard");
      return;
    }

    await loadStats();
  };

  const loadStats = async () => {
    try {
      // Get user subscriptions
      const { data: profiles } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_tier, has_lifetime_access, trial_ends_at, student_expires_at, promotional_access_expires_at");

      // Get church subscriptions
      const { data: churches } = await supabase
        .from("churches")
        .select("tier, max_seats, subscription_status")
        .eq("subscription_status", "active");

      const now = new Date();
      
      let totalPaid = 0;
      let totalLifetime = 0;
      let totalTrial = 0;
      const tierCounts = { essential: 0, premium: 0, student: 0 };

      profiles?.forEach(profile => {
        const trialValid = profile.trial_ends_at && new Date(profile.trial_ends_at) > now;
        const studentValid = profile.student_expires_at && new Date(profile.student_expires_at) > now;
        const promotionalValid = profile.promotional_access_expires_at && new Date(profile.promotional_access_expires_at) > now;

        if (profile.has_lifetime_access) {
          totalLifetime++;
          totalPaid++;
          if (profile.subscription_tier === 'essential') tierCounts.essential++;
          else if (profile.subscription_tier === 'premium') tierCounts.premium++;
        } else if (profile.subscription_status === 'active' && !trialValid) {
          totalPaid++;
          if (profile.subscription_tier === 'essential') tierCounts.essential++;
          else if (profile.subscription_tier === 'premium') tierCounts.premium++;
        } else if (studentValid) {
          totalPaid++;
          tierCounts.student++;
        } else if (promotionalValid && profile.subscription_status === 'active') {
          totalPaid++;
          if (profile.subscription_tier === 'essential') tierCounts.essential++;
          else if (profile.subscription_tier === 'premium') tierCounts.premium++;
        } else if (trialValid) {
          totalTrial++;
        }
      });

      const churchSeats = {
        tier1: churches?.filter(c => c.tier === 'tier1').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier2: churches?.filter(c => c.tier === 'tier2').reduce((sum, c) => sum + c.max_seats, 0) || 0,
        tier3: churches?.filter(c => c.tier === 'tier3').reduce((sum, c) => sum + c.max_seats, 0) || 0,
      };

      setStats({
        totalPaid,
        byTier: tierCounts,
        totalLifetime,
        totalTrial,
        totalChurches: churches?.length || 0,
        churchSeats,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Subscription Analytics</h1>
        <p className="text-muted-foreground">Overview of paid users and church subscriptions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Paid Users</CardTitle>
            <CardDescription>Active paying subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalPaid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trial Users</CardTitle>
            <CardDescription>Currently in trial period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalTrial}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifetime Access</CardTitle>
            <CardDescription>Users with lifetime premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalLifetime}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Individual Subscriptions by Tier</CardTitle>
            <CardDescription>Breakdown of subscription tiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Essential</span>
              <span className="text-2xl font-bold">{stats.byTier.essential}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Premium</span>
              <span className="text-2xl font-bold">{stats.byTier.premium}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Student</span>
              <span className="text-2xl font-bold">{stats.byTier.student}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Church Subscriptions</CardTitle>
            <CardDescription>Active church accounts and seats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Churches</span>
              <span className="text-2xl font-bold">{stats.totalChurches}</span>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 1 Seats (30)</span>
                <span className="font-medium">{stats.churchSeats.tier1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 2 Seats (100)</span>
                <span className="font-medium">{stats.churchSeats.tier2}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 3 Seats (Unlimited)</span>
                <span className="font-medium">{stats.churchSeats.tier3}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
