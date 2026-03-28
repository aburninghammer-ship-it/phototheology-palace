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
  const [subject, setSubject] = useState("Unlock Phototheology – Your Patron Access Awaits!");
  const [htmlContent, setHtmlContent] = useState(`
<h2>Hey there, Patron!</h2>
<p>Thank you for supporting Phototheology! As a patron pledging <strong>$15/month or more</strong>, you qualify for <strong>premium access</strong> to the full PhototheologyOS.</p>

<h3>Here's how to claim your access:</h3>
<ol>
  <li>Go to <a href="https://phototheologybible.com/auth">phototheologybible.com</a></li>
  <li>Sign up using the <strong>same email</strong> you use on Patreon</li>
  <li>Connect your Patreon account when prompted</li>
  <li>Your premium access will be activated automatically!</li>
</ol>

<h3>What you'll unlock:</h3>
<ul>
  <li>📖 Advanced Bible study tools with AI assistance (Jeeves)</li>
  <li>🏛️ The Palace Method for Scripture memorization</li>
  <li>✨ Daily challenges and community features</li>
  <li>🎓 Certificate programs and achievements</li>
</ul>

<p><a href="https://phototheologybible.com/auth" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Sign Up Now & Connect Patreon</a></p>

<p>If you have any questions, just reply to this email!</p>

<p>Blessings,<br/>The Phototheology Team</p>
  `.trim());
  const [filter, setFilter] = useState<'not_signed_up' | 'all_patrons' | 'active_patrons' | 'free_members' | 'former_patrons' | 'trial_conversion'>('not_signed_up');
  const [testMode, setTestMode] = useState(true);
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get aggregated counts directly to avoid the 1000 row limit
      const { count: totalCount } = await supabase
        .from("patreon_members")
        .select("*", { count: "exact", head: true });

      const { count: activeCount } = await supabase
        .from("patreon_members")
        .select("*", { count: "exact", head: true })
        .eq("patron_status", "active_patron");

      const { count: withEmailCount } = await supabase
        .from("patreon_members")
        .select("*", { count: "exact", head: true })
        .not("email", "is", null);

      const { count: freeCount } = await supabase
        .from("patreon_members")
        .select("*", { count: "exact", head: true })
        .eq("patron_status", "free_member");

      // Get app users
      const { data: authData } = await supabase.functions.invoke('get-subscriber-stats');
      const appUserCount = authData?.stats?.database?.total_users || 0;

      setStats({
        total_members: totalCount || 0,
        active_patrons: activeCount || 0,
        with_email: withEmailCount || 0,
        free_members: freeCount || 0,
        not_signed_up_count: activeCount || 0,
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

      // Check if there were errors in the response
      if (data?.errors && data.errors > 0 && data.sent === 0) {
        // All failed - likely domain verification issue
        toast({
          title: "⚠️ Emails Failed to Send",
          description: "Resend requires domain verification to send to external recipients. Please verify your domain at resend.com/domains",
          variant: "destructive",
          duration: 10000,
        });
      } else if (data?.sent > 0) {
        // Success!
        toast({
          title: testMode ? "✅ Test Email Sent!" : "🎉 Campaign Sent Successfully!",
          description: `${data.sent} email${data.sent > 1 ? 's' : ''} sent successfully${data.errors > 0 ? ` (${data.errors} failed)` : ''}`,
          duration: 8000,
        });
      } else {
        toast({
          title: testMode ? "Test Email Sent" : "Campaign Sent",
          description: data?.message || `Sent to ${data?.sent || 0} recipients`,
        });
      }
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
      case 'former_patrons':
        return "🔄 Winback campaign: People who cancelled their patronage";
      case 'trial_conversion':
        return "💰 Convert free followers to paying patrons";
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
                <SelectItem value="free_members">Free Followers (Not Signed Up)</SelectItem>
                <SelectItem value="former_patrons">🔄 Winback: Former Patrons</SelectItem>
                <SelectItem value="trial_conversion">💰 Trial Conversion: Free → Paid</SelectItem>
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

      {/* Patreon Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Patreon Templates</CardTitle>
          <CardDescription>Click to use a pre-built template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start border-red-500/30 hover:bg-red-500/10"
            onClick={() => {
              setSubject("🎉 You Have Full Access to the PhototheologyOS!");
              setHtmlContent(`<h1>Thank You, Patron!</h1>
<p>Hi there,</p>
<p>Thank you so much for your generous support on Patreon! As a patron pledging <strong>$15/month or more</strong>, you have <strong>full access</strong> to the complete PhototheologyOS.</p>

<h2>What's Included:</h2>
<ul>
  <li>📖 <strong>Jeeves AI</strong> – Your personal Bible study companion</li>
  <li>🏛️ <strong>All 8 Floors</strong> of the PhotoTheology Palace</li>
  <li>✨ <strong>Daily Challenges</strong> to sharpen your study skills</li>
  <li>🎓 <strong>Certificate Programs</strong> and achievements</li>
  <li>👥 <strong>Community Features</strong> – Share insights and connect</li>
  <li>📚 <strong>Personal Study Journeys</strong> and Bible study generators</li>
</ul>

<h2>Getting Started:</h2>
<ol>
  <li>Go to <a href="https://phototheologybible.com/auth">phototheologybible.com</a></li>
  <li>Sign up using the <strong>same email</strong> you use on Patreon</li>
  <li>Connect your Patreon account when prompted</li>
  <li>Enjoy your full premium access!</li>
</ol>

<p style="text-align: center; margin: 24px 0;">
  <a href="https://phototheologybible.com/auth" style="display: inline-block; background: #8B5CF6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Your Suite Now</a>
</p>

<p>If you have any questions, just reply to this email!</p>

<p>Blessings,<br/>The PhotoTheology Team</p>`);
              setFilter('active_patrons');
            }}
          >
            🎉 Suite Access Confirmation (for paying patrons)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-red-500/30 hover:bg-red-500/10"
            onClick={() => {
              setSubject("Unlock Phototheology – Your Patron Access Awaits!");
              setHtmlContent(`<h2>Hey there, Patron!</h2>
<p>Thank you for supporting Phototheology! As a patron pledging <strong>$15/month or more</strong>, you qualify for <strong>premium access</strong> to the full PhototheologyOS.</p>

<h3>Here's how to claim your access:</h3>
<ol>
  <li>Go to <a href="https://phototheologybible.com/auth">phototheologybible.com</a></li>
  <li>Sign up using the <strong>same email</strong> you use on Patreon</li>
  <li>Connect your Patreon account when prompted</li>
  <li>Your premium access will be activated automatically!</li>
</ol>

<h3>What you'll unlock:</h3>
<ul>
  <li>📖 Advanced Bible study tools with AI assistance (Jeeves)</li>
  <li>🏛️ The Palace Method for Scripture memorization</li>
  <li>✨ Daily challenges and community features</li>
  <li>🎓 Certificate programs and achievements</li>
</ul>

<p><a href="https://phototheologybible.com/auth" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Sign Up Now & Connect Patreon</a></p>

<p>If you have any questions, just reply to this email!</p>

<p>Blessings,<br/>The Phototheology Team</p>`);
              setFilter('not_signed_up');
            }}
          >
            🔗 Patron Not Signed Up (remind to connect)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-red-500/30 hover:bg-red-500/10"
            onClick={() => {
              setSubject("💎 Upgrade to Premium – Unlock the Full Suite!");
              setHtmlContent(`<h1>Unlock the Full PhotoTheology Experience!</h1>
<p>Hi there,</p>
<p>Thank you for following us on Patreon! We've noticed you're not yet a paying patron, and we wanted to share what you're missing.</p>

<h2>With a $15/month pledge, you unlock:</h2>
<ul>
  <li>📖 <strong>Jeeves AI</strong> – An AI Bible study companion trained in PhotoTheology</li>
  <li>🏛️ <strong>The Palace Method</strong> – All 8 floors of systematic Bible study</li>
  <li>✨ <strong>Daily Challenges</strong> – Grow your study skills every day</li>
  <li>🎓 <strong>Certificate Programs</strong> – Earn recognition for your learning</li>
  <li>👥 <strong>Community</strong> – Connect with other serious students of the Word</li>
</ul>

<p>Your support directly funds the development of these tools that are helping believers around the world study Scripture more deeply.</p>

<p style="text-align: center; margin: 24px 0;">
  <a href="https://www.patreon.com/phototheology" style="display: inline-block; background: #F96854; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Become a Patron Today</a>
</p>

<p>God bless your study of His Word!</p>

<p>The PhotoTheology Team</p>`);
              setFilter('free_members');
            }}
          >
            💰 Free to Paid Conversion (upgrade encouragement)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-red-500/30 hover:bg-red-500/10"
            onClick={() => {
              setSubject("🔄 We Miss You! Come Back to PhotoTheology");
              setHtmlContent(`<h1>We Miss You!</h1>
<p>Hi there,</p>
<p>We noticed your Patreon pledge is no longer active, and we wanted to reach out.</p>

<h2>A lot has changed since you left!</h2>
<ul>
  <li>🆕 <strong>Jeeves AI</strong> – A completely new AI Bible study companion</li>
  <li>📱 <strong>Improved Mobile Experience</strong> – Study anywhere</li>
  <li>✨ <strong>New Challenges</strong> – Fresh daily content</li>
  <li>🎓 <strong>Certificate Programs</strong> – Earn credentials for your learning</li>
</ul>

<p>We'd love to have you back in the PhotoTheology community. Your support helps us continue building these tools for believers everywhere.</p>

<p style="text-align: center; margin: 24px 0;">
  <a href="https://www.patreon.com/phototheology" style="display: inline-block; background: #F96854; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Rejoin as a Patron</a>
</p>

<p>Even if now isn't the right time, we're grateful for your past support.</p>

<p>Blessings,<br/>The PhotoTheology Team</p>`);
              setFilter('former_patrons');
            }}
          >
            🔄 Winback Campaign (former patrons)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
