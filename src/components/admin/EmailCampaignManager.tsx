import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Users, Send, Clock, CheckCircle, AlertCircle, AlertTriangle, RefreshCw, UserMinus, UserCheck, Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type CampaignType = 'winback' | 'trial' | 'engagement' | 'conversion';

interface CampaignStats {
  total: number;
  sent: number;
  failed: number;
}

export function EmailCampaignManager() {
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState<CampaignType | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [selectedDay, setSelectedDay] = useState("0");
  const [forceSendWinback, setForceSendWinback] = useState(false);
  const [forceSendConversion, setForceSendConversion] = useState(false);
  const [lastResults, setLastResults] = useState<Record<CampaignType, { sent: number; failed: number } | null>>({
    winback: null,
    trial: null,
    engagement: null,
    conversion: null,
  });

  // Get win-back eligible users count
  const { data: winbackCount, isLoading: winbackLoading } = useQuery({
    queryKey: ['campaign-winback-count'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: expiredUsers } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .in('subscription_status', ['expired', 'cancelled', 'trial_expired'])
        .eq('has_lifetime_access', false) as any;

      if (!expiredUsers) return 0;

      const { data: recentEmails } = await supabase
        .from('email_logs')
        .select('user_id')
        .eq('campaign_type', 'winback')
        .gte('sent_at', thirtyDaysAgo.toISOString()) as any;

      const recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);
      return expiredUsers.filter(u => !recentUserIds.has(u.user_id)).length;
    }
  });

  // Get trial users count
  const { data: trialCount, isLoading: trialLoading } = useQuery({
    queryKey: ['campaign-trial-count'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('subscription_status', 'trial')
        .not('trial_ends_at', 'is', null);

      return data?.length || 0;
    }
  });

  // Get paid subscribers count
  const { data: paidCount, isLoading: paidLoading } = useQuery({
    queryKey: ['campaign-paid-count'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('subscription_status', 'active');

      return data?.length || 0;
    }
  });

  // Get non-paying users count for conversion campaign
  const { data: conversionCount, isLoading: conversionLoading } = useQuery({
    queryKey: ['campaign-conversion-count'],
    queryFn: async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .or('subscription_status.is.null,subscription_status.eq.none,subscription_status.eq.pending')
        .eq('has_lifetime_access', false)
        .lt('created_at', threeDaysAgo.toISOString());

      return data?.length || 0;
    }
  });

  // Get campaign stats
  const { data: campaignStats } = useQuery({
    queryKey: ['campaign-stats'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs } = await supabase
        .from('email_logs')
        .select('*')
        .gte('sent_at', sevenDaysAgo.toISOString()) as any;

      const stats: Record<CampaignType, CampaignStats> = {
        winback: { total: 0, sent: 0, failed: 0 },
        trial: { total: 0, sent: 0, failed: 0 },
        engagement: { total: 0, sent: 0, failed: 0 },
        conversion: { total: 0, sent: 0, failed: 0 },
      };

      (logs as any[] || []).forEach((log: any) => {
        const type = log.campaign_type as CampaignType;
        if (stats[type]) {
          stats[type].total++;
          if (log.status === 'sent') stats[type].sent++;
          if (log.status === 'failed') stats[type].failed++;
        }
      });

      return stats;
    }
  });

  const handleSendCampaign = async (campaignType: CampaignType) => {
    if (testMode && !testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    setIsSending(campaignType);
    try {
      const { data, error } = await supabase.functions.invoke('send-campaign-email', {
        body: {
          campaignType,
          testMode,
          testEmail: testMode ? testEmail : undefined,
          dayOverride: testMode ? parseInt(selectedDay) : undefined,
          forceSend: !testMode && (campaignType === 'winback' ? forceSendWinback : campaignType === 'conversion' ? forceSendConversion : undefined),
        }
      });

      if (error) throw error;

      const sent = Number((data as any)?.sent ?? 0);
      const failed = Number((data as any)?.failed ?? 0);
      const firstError = ((data as any)?.results as any[] | undefined)?.find((r: any) => !r.success)?.error;

      setLastResults(prev => ({
        ...prev,
        [campaignType]: { sent, failed }
      }));

      if (failed > 0) {
        toast.error(
          testMode
            ? `Test email failed (${failed} failed)${firstError ? `: ${firstError}` : ''}`
            : `${getCampaignName(campaignType)}: ${sent} sent, ${failed} failed${firstError ? `: ${firstError}` : ''}`
        );
      } else {
        toast.success(
          testMode
            ? `Test email sent to ${testEmail}`
            : `${getCampaignName(campaignType)} sent: ${sent} emails delivered`
        );
      }

      queryClient.invalidateQueries({ queryKey: ['campaign-stats'] });
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsSending(null);
    }
  };

  const getCampaignName = (type: CampaignType) => {
    switch (type) {
      case 'winback': return 'Win-Back Campaign';
      case 'trial': return 'Trial Guidance';
      case 'engagement': return 'Subscriber Engagement';
      case 'conversion': return 'Non-Payer Conversion';
    }
  };

  const getCampaignIcon = (type: CampaignType) => {
    switch (type) {
      case 'winback': return <UserMinus className="h-5 w-5" />;
      case 'trial': return <Clock className="h-5 w-5" />;
      case 'engagement': return <UserCheck className="h-5 w-5" />;
      case 'conversion': return <Star className="h-5 w-5" />;
    }
  };

  const renderEmailPreview = (campaignType: CampaignType) => {
    const previews: Record<CampaignType, { title: string; emails: { day: string; subject: string; preview: string }[] }> = {
      winback: {
        title: "Win-Back Sequence (7 Emails)",
        emails: [
          { day: "Email 1", subject: "See PhotoTheology in Action", preview: "Video intro + overview of improvements" },
          { day: "Email 2", subject: "The Guided Palace Tour", preview: "New step-by-step introduction to each floor" },
          { day: "Email 3", subject: "Meet Jeeves", preview: "AI study partner available 24/7" },
          { day: "Email 4", subject: "Daily Challenges & Reading Plans", preview: "Consistent practice keeps you engaged" },
          { day: "Email 5", subject: "The Gems Room", preview: "Save your best insights forever" },
          { day: "Email 6", subject: "Prophecy & Sanctuary", preview: "Vision Floor — prophecy & sanctuary united" },
          { day: "Email 7", subject: "Your Invitation to Return", preview: "Fresh start with everything improved" },
        ]
      },
      trial: {
        title: "14-Day Trial Guidance (6 Emails)",
        emails: [
          { day: "Day 0", subject: "Welcome to Your 14-Day Orientation", preview: "Orientation begins — learn how to study here" },
          { day: "Day 3", subject: "Your First Sessions Matter Most", preview: "Foundation is being laid — Story Room, 24FPS" },
          { day: "Day 7", subject: "Week 1 Complete — Halfway There!", preview: "Rooms start connecting — try Daily Challenge" },
          { day: "Day 10", subject: "The Palace is Taking Shape", preview: "Depth is forming — try Freestyle Floor" },
          { day: "Day 12", subject: "What Changes After You Subscribe", preview: "Continuity, not completion — full access details" },
          { day: "Day 14", subject: "Continue Your Training", preview: "Trial ends — invitation to extend" },
        ]
      },
      engagement: {
        title: "Monthly Engagement (4 Weekly Emails)",
        emails: [
          { day: "Week 1", subject: "What Changes as You Grow", preview: "Training as interpreter — clarity over speed" },
          { day: "Week 2", subject: "Why Foundational Rooms Still Matter", preview: "Return to basics — integration exercise" },
          { day: "Week 3", subject: "Recalibration Is Part of Maturity", preview: "Step back when needed — not regression" },
          { day: "Week 4", subject: "Prepare for Your Next Level", preview: "Monthly review — mastery is earned" },
        ]
      },
      conversion: {
        title: "Non-Payer Conversion (5 Emails)",
        emails: [
          { day: "Day 0", subject: "What PhotoTheology Users Are Discovering", preview: "Testimonials from real learners" },
          { day: "Day 2", subject: "Why 800+ Believers Chose the Palace", preview: "8-Floor system overview" },
          { day: "Day 4", subject: "Meet Jeeves — Your AI Study Partner", preview: "AI trained on PhotoTheology" },
          { day: "Day 6", subject: "Your Bible Study: Before vs. After", preview: "Side-by-side comparison + pricing" },
          { day: "Day 8", subject: "Final Invitation", preview: "Last call + special offer" },
        ]
      }
    };

    const preview = previews[campaignType];

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-2 text-sm font-medium flex items-center justify-between">
          <span>{preview.title}</span>
          <Badge variant="outline" className="text-xs">
            {preview.emails.length} emails
          </Badge>
        </div>
        <ScrollArea className="h-48">
          <div className="p-4 space-y-3">
            {preview.emails.map((email, idx) => (
              <div key={idx} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{email.day}</Badge>
                </div>
                <p className="text-sm font-medium text-foreground">{email.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">{email.preview}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderCampaignCard = (
    campaignType: CampaignType,
    count: number | undefined,
    isLoading: boolean,
    description: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getCampaignIcon(campaignType)}
          {getCampaignName(campaignType)}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eligible Users */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-sm">Eligible Recipients</p>
              <p className="text-xs text-muted-foreground">
                {campaignType === 'winback' && "Users who tried but didn't subscribe"}
                {campaignType === 'trial' && "Users currently in 14-day trial"}
                {campaignType === 'engagement' && "Active paid subscribers"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {isLoading ? '...' : count || 0}
          </Badge>
        </div>

        {/* Stats */}
        {campaignStats?.[campaignType] && campaignStats[campaignType].total > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-lg font-bold">{campaignStats[campaignType].total}</p>
              <p className="text-xs text-muted-foreground">Total (7d)</p>
            </div>
            <div className="text-center p-2 bg-green-500/10 rounded-lg">
              <p className="text-lg font-bold text-green-500">{campaignStats[campaignType].sent}</p>
              <p className="text-xs text-muted-foreground">Sent</p>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded-lg">
              <p className="text-lg font-bold text-red-500">{campaignStats[campaignType].failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        )}

        {/* Last Result */}
        {lastResults[campaignType] && (
          <div className="p-2 bg-primary/10 rounded-lg text-sm text-center">
            Last send: {lastResults[campaignType]!.sent} sent, {lastResults[campaignType]!.failed} failed
          </div>
        )}

        {/* Email Preview */}
        {renderEmailPreview(campaignType)}

        {/* Winback Force Send Toggle */}
        {campaignType === 'winback' && !testMode && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-destructive/10 border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Force send</p>
                <p className="text-xs text-muted-foreground">Ignore 30-day cooldown</p>
              </div>
            </div>
            <Switch
              checked={forceSendWinback}
              onCheckedChange={setForceSendWinback}
            />
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={() => handleSendCampaign(campaignType)} 
          disabled={
            isSending !== null ||
            (!testMode && (count || 0) === 0 && !(campaignType === 'winback' && forceSendWinback))
          }
          className="w-full"
        >
          {isSending === campaignType ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {testMode
                ? 'Send Test Email'
                : campaignType === 'winback' && forceSendWinback
                  ? 'Force send to expired users'
                  : `Send to ${count || 0} Users`}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Test Mode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Campaign Manager
          </CardTitle>
          <CardDescription>
            Manage all PhotoTheology email campaigns from one place. All campaigns are active as of today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="test-mode"
                checked={testMode}
                onCheckedChange={setTestMode}
              />
              <Label htmlFor="test-mode" className="font-medium">Test Mode</Label>
            </div>

            {testMode && (
              <>
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="test-email" className="text-xs text-muted-foreground">Test Email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>

                <div className="min-w-[150px]">
                  <Label className="text-xs text-muted-foreground">Email Day/Week</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Day 0 / Week 1</SelectItem>
                      <SelectItem value="1">Day 1 / Week 2</SelectItem>
                      <SelectItem value="2">Day 2 / Week 3</SelectItem>
                      <SelectItem value="3">Day 3 / Week 4</SelectItem>
                      <SelectItem value="4">Day 4</SelectItem>
                      <SelectItem value="5">Day 5</SelectItem>
                      <SelectItem value="6">Day 6</SelectItem>
                      <SelectItem value="7">Day 7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Badge variant={testMode ? "default" : "secondary"} className="h-9 px-4">
              {testMode ? "🧪 Test Mode Active" : "📧 Live Mode"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Cards */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {renderCampaignCard(
          'conversion',
          conversionCount,
          conversionLoading,
          "Convert registered users to paying subscribers"
        )}

        {renderCampaignCard(
          'winback',
          winbackCount,
          winbackLoading,
          "Re-engage users who explored but didn't subscribe"
        )}

        {renderCampaignCard(
          'trial',
          trialCount,
          trialLoading,
          "Guide trial users through their 30-day orientation"
        )}

        {renderCampaignCard(
          'engagement',
          paidCount,
          paidLoading,
          "Keep paid subscribers engaged and growing"
        )}
      </div>

      {/* Campaign Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">All campaigns are now active.</span>
            <span className="text-muted-foreground">
              Trial emails are sent based on user's trial day. Engagement emails rotate weekly.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
