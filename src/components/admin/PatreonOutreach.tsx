import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw, Send, Users, UserCheck, UserX, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatreonStats {
  total_members: number;
  active_patrons: number;
  with_email: number;
  free_members: number;
  not_signed_up_count: number;
}

export function PatreonOutreach() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<PatreonStats | null>(null);
  
  // Campaign form
  const [subject, setSubject] = useState("You're missing out on PhotoTheology!");
  const [htmlContent, setHtmlContent] = useState(`
<h2>Hey there, Patron!</h2>
<p>We noticed you haven't signed up for the PhotoTheology app yet. As a supporter, you get <strong>free premium access</strong> to all our features!</p>

<h3>What you're missing:</h3>
<ul>
  <li>📖 Advanced Bible study tools with AI assistance</li>
  <li>🏛️ The Palace Method for Scripture memorization</li>
  <li>✨ Daily challenges and community features</li>
  <li>🎓 Certificate programs and achievements</li>
</ul>

<p><a href="https://phototheologybible.com/auth" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Sign Up Now (It's Free for Patrons!)</a></p>

<p>Just use the same email you have on Patreon, and your premium access will be automatically activated.</p>

<p>Blessings,<br/>The PhotoTheology Team</p>
  `.trim());
  const [filter, setFilter] = useState<'not_signed_up' | 'all_patrons' | 'active_patrons' | 'free_members'>('not_signed_up');
  const [testMode, setTestMode] = useState(true);
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get patreon members
      const { data: members, error } = await supabase
        .from("patreon_members")
        .select("email, patron_status, pledge_cents");

      if (error) throw error;

      // Get app users
      const { data: authData } = await supabase.functions.invoke('get-subscriber-stats');
      const appUserCount = authData?.stats?.database?.total_users || 0;

      // Get list of app user emails via a simpler check
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id");

      const profileIds = new Set(profiles?.map(p => p.id) || []);

      // Calculate stats
      const activePatrons = members?.filter(m => m.patron_status === 'active_patron') || [];
      const withEmail = members?.filter(m => m.email) || [];
      const freeMembers = members?.filter(m => m.patron_status === 'free_member') || [];
      
      // For not_signed_up, we need to compare emails - this is approximate
      // The actual check happens in the edge function
      const notSignedUpEstimate = activePatrons.length; // Will be refined when synced

      setStats({
        total_members: members?.length || 0,
        active_patrons: activePatrons.length,
        with_email: withEmail.length,
        free_members: freeMembers.length,
        not_signed_up_count: notSignedUpEstimate,
      });
    } catch (error: any) {
      console.error("Failed to load stats:", error);
      toast({
        title: "Error",
        description: "Failed to load Patreon stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-patreon-members');
      
      if (error) throw error;

      toast({
        title: "Sync Complete",
        description: `Synced ${data?.synced || 0} members from Patreon`,
      });

      if (data?.stats) {
        setStats(prev => ({
          ...prev,
          ...data.stats,
          not_signed_up_count: prev?.not_signed_up_count || 0,
        }));
      }

      await loadStats();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync Patreon members",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSendCampaign = async () => {
    if (!subject || !htmlContent) {
      toast({
        title: "Missing Fields",
        description: "Please enter a subject and content",
        variant: "destructive",
      });
      return;
    }

    if (testMode && !testEmail) {
      toast({
        title: "Test Email Required",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-patreon-campaign', {
        body: {
          subject,
          htmlContent,
          filter,
          testMode,
          testEmail: testMode ? testEmail : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: testMode ? "Test Email Sent" : "Campaign Sent",
        description: data?.message || `Sent to ${data?.sent || 0} recipients`,
      });
    } catch (error: any) {
      console.error("Send error:", error);
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send campaign",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getFilterDescription = () => {
    switch (filter) {
      case 'not_signed_up':
        return "Patrons who haven't created an account in the app";
      case 'all_patrons':
        return "All paying patrons (active + past)";
      case 'active_patrons':
        return "Currently active paying patrons only";
      case 'free_members':
        return "Free followers who haven't signed up";
      default:
        return "";
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_members || 0}</div>
            <p className="text-xs text-muted-foreground">Synced from Patreon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patrons</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_patrons || 0}</div>
            <p className="text-xs text-muted-foreground">Currently paying</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Email</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.with_email || 0}</div>
            <p className="text-xs text-muted-foreground">Can receive emails</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Followers</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.free_members || 0}</div>
            <p className="text-xs text-muted-foreground">Not paying yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Sync Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sync Patreon Members
            {stats?.total_members === 0 && (
              <Badge variant="destructive">Not synced</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Fetch your complete member list from Patreon. This includes all patrons and free followers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Email Campaign */}
      <Card>
        <CardHeader>
          <CardTitle>Patreon Email Campaign</CardTitle>
          <CardDescription>
            Send targeted emails to your Patreon supporters who haven't signed up for the app yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_signed_up">Patrons Not Signed Up</SelectItem>
                <SelectItem value="active_patrons">All Active Patrons</SelectItem>
                <SelectItem value="all_patrons">All Patrons (Active + Past)</SelectItem>
                <SelectItem value="free_members">Free Followers</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{getFilterDescription()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content (HTML)</Label>
            <Textarea
              id="content"
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="HTML email content..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <Switch
              id="test-mode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
            <div className="space-y-1">
              <Label htmlFor="test-mode" className="font-medium">Test Mode</Label>
              <p className="text-sm text-muted-foreground">
                {testMode ? "Send to test email only" : "Send to all selected recipients"}
              </p>
            </div>
          </div>

          {testMode && (
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          )}

          <Button 
            onClick={handleSendCampaign} 
            disabled={sending || stats?.total_members === 0}
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {testMode ? "Send Test Email" : "Send Campaign"}
              </>
            )}
          </Button>

          {stats?.total_members === 0 && (
            <p className="text-sm text-amber-600 text-center">
              Please sync your Patreon members first before sending a campaign.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
