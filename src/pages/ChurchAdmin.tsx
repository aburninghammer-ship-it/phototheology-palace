import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Users, Mail, TrendingUp, Target } from "lucide-react";
import { ChurchOverview } from "@/components/churches/ChurchOverview";
import { ChurchMembers } from "@/components/churches/ChurchMembers";
import { ChurchInvitations } from "@/components/churches/ChurchInvitations";
import { ChurchCampaigns } from "@/components/churches/ChurchCampaigns";
import { ChurchAnalytics } from "@/components/churches/ChurchAnalytics";

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
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedSeats, setUsedSeats] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user is church admin
    if (!subscription.church.hasChurchAccess || subscription.church.churchRole !== 'admin') {
      navigate("/dashboard");
      return;
    }

    loadChurchData();
  }, [user, subscription, navigate]);

  const loadChurchData = async () => {
    try {
      if (!subscription.church.churchId) return;

      // Load church details
      const { data: churchData, error: churchError } = await supabase
        .from('churches')
        .select('*')
        .eq('id', subscription.church.churchId)
        .single();

      if (churchError) throw churchError;
      setChurch(churchData);

      // Load member count
      const { count, error: countError } = await supabase
        .from('church_members')
        .select('*', { count: 'exact', head: true })
        .eq('church_id', subscription.church.churchId);

      if (countError) throw countError;
      setUsedSeats(count || 0);

    } catch (error) {
      console.error('Error loading church data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading church dashboard...</p>
        </div>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{church.name}</h1>
          </div>
          <p className="text-muted-foreground">Church Administration Dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {church.tier === 'tier1' && 'Church Access'}
                {church.tier === 'tier2' && 'Leadership Tools'}
                {church.tier === 'tier3' && 'Growth Suite'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usedSeats} / {church.max_seats}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {availableSeats} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {church.subscription_status}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Invitations</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Campaigns</span>
            </TabsTrigger>
            {hasTier2Access && (
              <TabsTrigger value="analytics" className="gap-2">
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

          {hasTier2Access && (
            <TabsContent value="analytics">
              <ChurchAnalytics 
                churchId={church.id}
                hasTier3Access={hasTier3Access}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
