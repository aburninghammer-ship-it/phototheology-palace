import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Users, Send, Clock, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function WinBackCampaign() {
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number } | null>(null);
  const [forceSend, setForceSend] = useState(false);

  // Get count of win-back eligible users
  // Target: Users who created account, explored briefly, but NEVER subscribed
  const { data: eligibleCount, isLoading } = useQuery({
    queryKey: ['winback-eligible-count'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Get users who never subscribed (from profiles, not user_subscriptions)
      // Must have: no active subscription, created 7+ days ago, some engagement
      // Paginate to get ALL users (Supabase default limit is 1000)
      let allNeverSubscribedUsers: any[] = [];
      let page = 0;
      const pageSize = 1000;
      
      while (true) {
        const { data: batch, error: batchError } = await supabase
          .from('profiles')
          .select('id, onboarding_completed, first_meaningful_action_at')
          .or('subscription_status.is.null,subscription_status.eq.none,subscription_status.eq.trial_expired,subscription_status.eq.expired,subscription_status.eq.cancelled')
          .eq('has_lifetime_access', false)
          .lt('created_at', sevenDaysAgo.toISOString())
          .range(page * pageSize, (page + 1) * pageSize - 1);
        
        if (batchError) throw batchError;
        if (!batch || batch.length === 0) break;
        
        allNeverSubscribedUsers = [...allNeverSubscribedUsers, ...batch];
        if (batch.length < pageSize) break;
        page++;
      }
      
      const neverSubscribedUsers = allNeverSubscribedUsers;

      // Filter to those with some engagement
      const engagedUsers = neverSubscribedUsers?.filter(u => 
        u.onboarding_completed || u.first_meaningful_action_at
      ) || [];

      // Filter out those who received winback email in last 30 days
      const { data: recentEmails } = await supabase
        .from('email_logs')
        .select('user_id')
        .eq('campaign_type', 'winback')
        .gte('sent_at', thirtyDaysAgo.toISOString());

      const recentUserIds = new Set(recentEmails?.map(e => e.user_id) || []);
      const eligibleUsers = engagedUsers.filter(u => !recentUserIds.has(u.id));

      return eligibleUsers.length;
    }
  });

  // Get recent campaign stats
  const { data: campaignStats } = useQuery({
    queryKey: ['winback-campaign-stats'],
    queryFn: async () => {
      const { data: campaign } = await supabase
        .from('email_campaigns')
        .select('id')
        .eq('type', 're-engagement')
        .single();

      if (!campaign) return null;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs, error } = await supabase
        .from('email_logs')
        .select('status, sent_at')
        .eq('campaign_id', campaign.id)
        .gte('sent_at', sevenDaysAgo.toISOString());

      if (error) return null;

      return {
        total: logs?.length || 0,
        sent: logs?.filter(l => l.status === 'sent').length || 0,
        failed: logs?.filter(l => l.status === 'failed').length || 0,
        opened: logs?.filter(l => l.status === 'opened').length || 0,
      };
    }
  });

  const handleSendCampaign = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-campaign-email', {
        body: { campaignType: 'winback', testMode: false, forceSend }
      });

      if (error) throw error;

      const sent = Number(data?.sent ?? 0);
      const failed = Number(data?.failed ?? 0);

      setLastResult({ sent, failed });

      if (sent === 0 && data?.message) {
        toast.message(data.message);
      } else {
        toast.success(`Win-back campaign sent: ${sent} emails delivered`);
      }
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Win-Back Campaign
        </CardTitle>
        <CardDescription>
          Re-engage users who signed up, explored briefly, but never subscribed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eligible Users */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Eligible Users</p>
              <p className="text-sm text-muted-foreground">
                Users who explored but never subscribed (not emailed in 30 days)
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {isLoading ? '...' : eligibleCount || 0}
          </Badge>
        </div>

        {/* Campaign Stats */}
        {campaignStats && campaignStats.total > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-500">{campaignStats.sent}</p>
              <p className="text-xs text-muted-foreground">Sent (7 days)</p>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <Mail className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-500">{campaignStats.opened}</p>
              <p className="text-xs text-muted-foreground">Opened</p>
            </div>
            <div className="text-center p-3 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-500">{campaignStats.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
        )}

        {/* Last Send Result */}
        {lastResult && (
          <div className="p-3 bg-primary/10 rounded-lg text-sm">
            <p className="font-medium">Last campaign result:</p>
            <p>{lastResult.sent} emails sent, {lastResult.failed} failed</p>
          </div>
        )}

        {/* Email Preview */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-medium">Email Preview</div>
          <div className="p-4 bg-slate-900 text-slate-100 text-sm">
            <p className="text-amber-400 font-bold mb-2">🏛️ Your 30-Day Quick-Start Path</p>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>Day 1: Complete the 24FPS Tour</li>
              <li>Day 2: Try the Genesis High Rise Challenge</li>
              <li>Day 3: Explore the Story Room</li>
              <li>Day 4: Complete a Daily Challenge</li>
              <li>Day 5: Ask Jeeves a question</li>
              <li>Day 6: Try an Escape Room</li>
              <li>Day 7: Share a Gem with the community</li>
            </ul>
          </div>
        </div>

        {/* Force Send Toggle */}
        <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <Label htmlFor="force-send" className="font-medium">Force Send (Ignore 30-day cooldown)</Label>
              <p className="text-sm text-muted-foreground">
                Send to all expired users, even those who received an email recently
              </p>
            </div>
          </div>
          <Switch
            id="force-send"
            checked={forceSend}
            onCheckedChange={setForceSend}
          />
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSendCampaign} 
          disabled={isSending || (eligibleCount || 0) === 0}
          className="w-full"
          size="lg"
        >
          {isSending ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Win-Back Campaign to {eligibleCount || 0} Users
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Users won't receive another win-back email for 30 days after this campaign
        </p>
      </CardContent>
    </Card>
  );
}
