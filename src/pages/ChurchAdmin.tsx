import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Users, Mail, TrendingUp, Target, Sprout, Sun, Moon, Settings, Radio, Droplets } from "lucide-react";
import { useTheme } from "next-themes";
import { ChurchOverview } from "@/components/churches/ChurchOverview";
import { ChurchMembers } from "@/components/churches/ChurchMembers";
import { ChurchInvitations } from "@/components/churches/ChurchInvitations";
import { ChurchCampaigns } from "@/components/churches/ChurchCampaigns";
import { ChurchAnalytics } from "@/components/churches/ChurchAnalytics";
import { ChurchSettings } from "@/components/living-manna/admin/ChurchSettings";
import { LeaderDashboard } from "@/components/living-manna";
import { LiveSermonDashboard } from "@/components/church/live-sermon";
import { BaptismCandidateManager } from "@/components/living-manna/admin/BaptismCandidateManager";

interface Church {
  id: string;
  name: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  max_seats: number;
  subscription_status: string;
  billing_email: string;
  contact_person: string | null;
  contact_phone: string | null;
  branded_name: string | null;
  logo_url: string | null;
}

export default function ChurchAdmin() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { churchId: memberChurchId, role: memberRole, isLoading: membershipLoading } = useChurchMembership();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedSeats, setUsedSeats] = useState(0);

  // Combine both sources for church access
  const hasChurchAccess = subscription.church.hasChurchAccess || !!memberChurchId;
  const churchRole = subscription.church.churchRole || memberRole;
  const effectiveChurchId = subscription.church.churchId || memberChurchId;
  const isAdmin = hasChurchAccess && churchRole === 'admin';

  useEffect(() => {
    // Wait for both subscriptions to load before making any decisions
    if (subscriptionLoading || membershipLoading) return;

    // ProtectedRoute will handle auth redirects; here we just gate church-admin capability
    if (!user) return;

    if (!isAdmin) {
      // Stop the spinner and show an access message instead of bouncing routes
      setLoading(false);
      return;
    }

    setLoading(true);
    loadChurchData();
  }, [user, subscription, subscriptionLoading, memberChurchId, memberRole, membershipLoading, isAdmin]);

  const loadChurchData = async () => {
    try {
      if (!effectiveChurchId) return;

      // Load church details
      const { data: churchData, error: churchError } = await supabase
        .from('churches')
        .select('*')
        .eq('id', effectiveChurchId)
        .single();

      if (churchError) throw churchError;
      setChurch(churchData);

      // Load member count
      const { count, error: countError } = await supabase
        .from('church_members')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', effectiveChurchId);

      if (countError) throw countError;
      setUsedSeats(count || 0);

    } catch (error) {
      console.error('Error loading church data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (subscriptionLoading || membershipLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/80">Loading church dashboard...</p>
        </div>
      </div>
    );
  }

  // If user isn't a church admin, show a clear message instead of redirecting away
  if (!hasChurchAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Church Admin Access Required
            </CardTitle>
            <CardDescription>
              This account isn't connected to an active church organization yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <span className="font-medium">What you can do next:</span>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Register your church and choose a plan</li>
                  <li>• Join a church using an invitation</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={() => navigate('/church-signup')}>
                Register a Church
              </Button>
              <Button variant="outline" onClick={() => navigate('/join-church')}>
                Join a Church
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Debug: hasChurchAccess={String(hasChurchAccess)}, role={String(churchRole)}, churchId={String(effectiveChurchId)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (churchRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Admin Role Required
            </CardTitle>
            <CardDescription>
              You're connected to a church, but your role isn't admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Ask your church admin to promote your role to <span className="font-medium">admin</span>.
              </AlertDescription>
            </Alert>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => navigate('/join-church')}>
                Use a Different Invitation
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Debug: hasChurchAccess={String(hasChurchAccess)}, role={String(churchRole)}, churchId={String(effectiveChurchId)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Unable to load church data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const availableSeats = church.max_seats - usedSeats;
  const hasTier2Access = church.tier === 'tier2' || church.tier === 'tier3';
  const hasTier3Access = church.tier === 'tier3';

  return (
    <div className="min-h-screen gradient-dreamy p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <Card variant="glass" className="mb-8 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Living Manna Online Church</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-muted-foreground font-medium">Church Administration Dashboard</p>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {church.tier === 'tier1' && 'Church Access'}
                {church.tier === 'tier2' && 'Leadership Tools'}
                {church.tier === 'tier3' && 'Growth Suite'}
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {usedSeats} / {church.max_seats}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableSeats} available
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize text-foreground">
                {church.subscription_status}
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary">Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate text-foreground">
                {church.billing_email}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seat Warning */}
        {availableSeats <= 5 && availableSeats > 0 && (
          <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <AlertDescription>
              <strong>Low Seats:</strong> Only {availableSeats} seats remaining. Consider upgrading your plan.
            </AlertDescription>
          </Alert>
        )}

        {availableSeats <= 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>No Seats Available:</strong> You've reached your member limit. Upgrade your plan to invite more members.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Card variant="glass" className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/50 backdrop-blur border border-border/50 rounded-lg flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="invitations" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Invitations</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Campaigns</span>
              </TabsTrigger>
              <TabsTrigger value="living-manna" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sprout className="h-4 w-4" />
                <span className="hidden sm:inline">Living Manna</span>
              </TabsTrigger>
              <TabsTrigger value="live-sermon" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Radio className="h-4 w-4" />
                <span className="hidden sm:inline">Live Sermon</span>
              </TabsTrigger>
              <TabsTrigger value="baptism-candidates" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Droplets className="h-4 w-4" />
                <span className="hidden sm:inline">Baptism</span>
              </TabsTrigger>
              {hasTier2Access && (
                <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              )}
            </TabsList>

          <TabsContent value="overview">
            <ChurchOverview 
              church={church} 
              usedSeats={usedSeats}
              onUpdate={loadChurchData}
            />
          </TabsContent>

          <TabsContent value="settings">
            <ChurchSettings churchId={church.id} />
          </TabsContent>

          <TabsContent value="members">
            <ChurchMembers 
              churchId={church.id}
              onMemberChange={loadChurchData}
            />
          </TabsContent>

          <TabsContent value="invitations">
            <ChurchInvitations 
              churchId={church.id}
              availableSeats={availableSeats}
            />
          </TabsContent>

          <TabsContent value="campaigns">
            <ChurchCampaigns 
              churchId={church.id}
              hasTier2Access={hasTier2Access}
            />
          </TabsContent>

          <TabsContent value="living-manna">
            <LeaderDashboard churchId={church.id} />
          </TabsContent>

          <TabsContent value="live-sermon">
            <LiveSermonDashboard churchId={church.id} />
          </TabsContent>

          <TabsContent value="baptism-candidates">
            <BaptismCandidateManager churchId={church.id} />
          </TabsContent>

            {hasTier2Access && (
              <TabsContent value="analytics">
                <ChurchAnalytics 
                  churchId={church.id}
                  hasTier3Access={hasTier3Access}
                />
              </TabsContent>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
