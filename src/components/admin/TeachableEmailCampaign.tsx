import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Users, AlertTriangle, GraduationCap, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type TeachableFilter = 'all' | 'master_class_active' | 'master_class_inactive' | 'free_signup' | 'linked' | 'unlinked' | 'premium_paying' | 'not_paying' | 'not_suite_subscribers';

const FILTER_DESCRIPTIONS: Record<TeachableFilter, string> = {
  all: "All Teachable users (free signups + Master Class)",
  master_class_active: "Paying Master Class students ($20/month, active enrollment)",
  master_class_inactive: "Former Master Class students (cancelled/expired)",
  free_signup: "Free signups who never enrolled in Master Class",
  linked: "Users already using the app (have logged in)",
  unlinked: "Users who haven't connected to the app yet",
  premium_paying: "Students paying $15+ per month (premium access)",
  not_paying: "Users not currently paying anything",
  not_suite_subscribers: "Teachable members (all) who are NOT active Suite subscribers — perfect for conversion campaigns",
};

interface CampaignStats {
  sent: number;
  failed: number;
  lastSent: string | null;
}

export function TeachableEmailCampaign() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState<TeachableFilter>("all");
  const [testMode, setTestMode] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    sent: number;
    total: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const { data: sent } = await supabase
        .from("email_campaign_logs")
        .select("sent_at")
        .eq("email_type", "teachable")
        .eq("status", "sent")
        .order("sent_at", { ascending: false })
        .limit(1);

      const { count: sentCount } = await supabase
        .from("email_campaign_logs")
        .select("*", { count: "exact", head: true })
        .eq("email_type", "teachable")
        .eq("status", "sent");

      const { count: failedCount } = await supabase
        .from("email_campaign_logs")
        .select("*", { count: "exact", head: true })
        .eq("email_type", "teachable")
        .eq("status", "failed");

      setCampaignStats({
        sent: sentCount || 0,
        failed: failedCount || 0,
        lastSent: sent?.[0]?.sent_at || null,
      });
    };
    loadStats();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please enter both subject and content",
        variant: "destructive",
      });
      return;
    }

    if (testMode && !testEmail.trim()) {
      toast({
        title: "Test Email Required",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    setLastResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("send-teachable-email", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          subject: subject.trim(),
          htmlContent: content.trim(),
          filter,
          testMode,
          testEmail: testMode ? testEmail.trim() : undefined,
        },
      });

      if (error) throw error;

      setLastResult({
        success: data.success,
        sent: data.sent,
        total: data.total,
        message: data.message,
      });

      toast({
        title: data.success ? "Emails Sent" : "Send Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });

      if (data.success && !testMode) {
        setSubject("");
        setContent("");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send emails";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Status Banner */}
      {campaignStats && (
        <Card className="border-border bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Teachable Campaign History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-2xl font-bold">{campaignStats.sent.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Successfully Sent</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{campaignStats.failed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Failed (rate limit — now fixed)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {campaignStats.lastSent
                      ? new Date(campaignStats.lastSent).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Never"}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Sent</p>
                </div>
              </div>
            </div>
            {campaignStats.failed > 100 && (
              <div className="mt-3 flex items-start gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Previous campaign hit Resend's rate limit (2 req/sec). The system now uses batch sending (100 emails/request) — re-sending will reach all {campaignStats.failed.toLocaleString()} missed students.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-orange-600" />
            Teachable Email Campaign
          </CardTitle>
          <CardDescription>
            Send targeted emails to Teachable students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipient Filter
            </Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as TeachableFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachable Users</SelectItem>
                <SelectItem value="not_suite_subscribers">🎯 NOT Suite Subscribers (Teachable + Patreon — not paying on Suite)</SelectItem>
                <SelectItem value="master_class_active">🎓 Master Class Students (Active, $20/mo)</SelectItem>
                <SelectItem value="master_class_inactive">📚 Former Master Class (Cancelled/Expired)</SelectItem>
                <SelectItem value="free_signup">🆓 Free Signups (Never Enrolled in Master Class)</SelectItem>
                <SelectItem value="linked">🔗 Linked to App</SelectItem>
                <SelectItem value="unlinked">❌ Not Linked to App</SelectItem>
                <SelectItem value="premium_paying">💰 Paying $15+/month (Premium)</SelectItem>
                <SelectItem value="not_paying">🆓 Not Currently Paying</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {FILTER_DESCRIPTIONS[filter]}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="teachable-subject">Subject Line</Label>
            <Input
              id="teachable-subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="teachable-content">Email Content (HTML supported)</Label>
            <Textarea
              id="teachable-content"
              placeholder="Enter email content... HTML tags are supported."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Test Mode Toggle */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Test Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send only to a test email before sending to everyone
                  </p>
                </div>
                <Switch
                  checked={testMode}
                  onCheckedChange={setTestMode}
                />
              </div>

              {testMode && (
                <div className="mt-4">
                  <Label htmlFor="teachable-testEmail">Test Email Address</Label>
                  <Input
                    id="teachable-testEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !content.trim()}
              size="lg"
              variant={testMode ? "outline" : "default"}
              className={!testMode ? "bg-orange-600 hover:bg-orange-700" : "border-orange-500"}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {testMode ? "Send Test Email" : "Send to Teachable Students"}
                </>
              )}
            </Button>

            {!testMode && (
              <Badge variant="destructive" className="text-sm">
                ⚠️ This will send real emails!
              </Badge>
            )}
          </div>

          {/* Last Result */}
          {lastResult && (
            <Card className={lastResult.success ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
              <CardContent className="pt-4">
                <p className="font-medium">
                  {lastResult.success ? "✅" : "❌"} {lastResult.message}
                </p>
                {lastResult.total > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Sent {lastResult.sent} of {lastResult.total} emails
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Teachable Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Teachable Templates</CardTitle>
          <CardDescription>Click to use a template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Campaign Template */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-600 flex items-center gap-2">
              🎓 Main Campaign
            </h4>
            
            <Button
              variant="outline"
              className="w-full justify-start border-amber-500/30 hover:bg-amber-500/10"
              onClick={() => {
                setFilter("all");
                setSubject("The Phototheology App is Here — Try It Free for 30 Days 🏰");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 28px; margin: 0;">The Palace is Now Open</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">See Christ in Every Chapter</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Dear Friend,</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">I'm excited to announce the <strong style="color: #d4af37;">Phototheology App</strong> is now available—and I want you to experience it.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">This isn't just another Bible app. It's the living architecture of the Palace method—8 Floors, dozens of Rooms, and a complete system that transforms how you read, remember, and live Scripture.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">For the next <strong style="color: #d4af37;">30 days</strong>, you can explore it all—completely free:</p>
    
    <ul style="font-size: 16px; line-height: 2; color: #c0c0c0; padding-left: 20px;">
      <li>🏛️ Walk through the Palace floors and discover each Room</li>
      <li>🤖 Meet Jeeves—your AI study companion trained in Phototheology</li>
      <li>📖 Experience the KJV Bible with built-in commentary and audio</li>
      <li>🔥 Start building your daily study streak</li>
      <li>💎 Begin collecting Gems—insights you'll never forget</li>
    </ul>
    
    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology.app" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Start Your 30-Day Free Trial →</a>
    </div>
    
    <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="font-size: 16px; line-height: 1.8; color: #d4af37; margin: 0 0 10px 0;"><strong>🎓 Phototheology Master Class Members:</strong></p>
      <p style="font-size: 15px; line-height: 1.8; color: #c0c0c0; margin: 0;">If you're currently enrolled in my weekly Phototheology Master Class, you get <strong style="color: #d4af37;">FREE access</strong> to the app! Contact me directly, and I'll send you a special access link.</p>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">The Palace awaits. Every chapter, every verse, every Christ-connection—stored, structured, and ready for discovery.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">Blessings,<br><strong style="color: #d4af37;">Pastor Ivor Myers</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you're part of the Phototheology community.</p>
  </div>
</div>`);
              }}
            >
              📧 30-Day Trial + Master Class Free Access
            </Button>
          </div>

          <hr className="border-muted" />
          
          {/* General Templates */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">General Templates</h4>
            
            <Button
              variant="outline"
              className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10"
              onClick={() => {
                setSubject("🎓 Welcome to the PhototheologyOS!");
                setContent(`<h1>Welcome Teachable Student!</h1>
<p>Hi there,</p>
<p>Thank you for enrolling in our Teachable course! We're excited to let you know that you now have access to the full PhototheologyOS.</p>
<h2>Here's what you can do:</h2>
<ul>
  <li>Access all 8 Floors of the Palace</li>
  <li>Chat with Jeeves, your AI Bible study companion</li>
  <li>Create and save your own Bible studies</li>
  <li>Join our community discussions</li>
</ul>
<p><a href="https://phototheology.app">Click here to get started!</a></p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
              }}
            >
              🎉 Welcome / Onboarding
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10"
              onClick={() => {
                setSubject("🎓 Connect Your Teachable Account to the App!");
                setContent(`<h1>Link Your Account for Full Access!</h1>
<p>Hi there,</p>
<p>We noticed you haven't connected your Teachable account to PhototheologyOS yet.</p>
<p>Connecting your account gives you:</p>
<ul>
  <li>Automatic premium access</li>
  <li>Synced progress across devices</li>
  <li>Access to exclusive student features</li>
</ul>
<p><strong>How to connect:</strong></p>
<ol>
  <li>Sign in to the app at <a href="https://phototheology.app">phototheology.app</a></li>
  <li>Go to Settings → Teachable Verification</li>
  <li>Click "Verify Teachable Account"</li>
</ol>
<p>That's it! Your premium access will be activated automatically.</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
              }}
            >
              🔗 Account Linking Reminder
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10"
              onClick={() => {
                setSubject("🎓 New Course Content Available!");
                setContent(`<h1>New Content Just for Students!</h1>
<p>Hi Teachable Student,</p>
<p>We've added new lessons and features to your course:</p>
<ul>
  <li>🆕 New lesson - Description</li>
  <li>🆕 New feature - Description</li>
  <li>🆕 New resource - Description</li>
</ul>
<p>As a Teachable student, you get access to all new content!</p>
<p><a href="https://phototheology.app">Check them out now</a></p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
              }}
            >
              ✨ New Content Announcement
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-orange-500/30 hover:bg-orange-500/10"
              onClick={() => {
                setSubject("🎓 Continue Your PhotoTheology Journey!");
                setContent(`<h1>We Miss You!</h1>
<p>Hi there,</p>
<p>We noticed you haven't been active in PhototheologyOS recently.</p>
<p>Don't miss out on your learning journey! Here's what's waiting for you:</p>
<ul>
  <li>Continue where you left off in the Palace</li>
  <li>New challenges and community discussions</li>
  <li>AI-powered Bible study with Jeeves</li>
</ul>
<p>Remember, as a Teachable student, you have full premium access!</p>
<p><a href="https://phototheology.app">Come back and explore!</a></p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
              }}
            >
              📚 Re-engagement
            </Button>
          </div>

          <hr className="border-muted" />

          {/* Conversion Campaign: Teachable non-Suite-subscribers */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-500 flex items-center gap-2">
              🎯 Conversion Campaign — Teachable Non-Subscribers
            </h4>
            <p className="text-xs text-muted-foreground">
              Targets all Teachable (and Patreon) members who are NOT currently paying subscribers on PhototheologyOS. Excludes active/lifetime users.
            </p>

            <Button
              variant="outline"
              className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
              onClick={() => {
                setFilter("not_suite_subscribers");
                setSubject("You're Already in the Family — Now Step Into the Palace 🏰");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 28px; margin: 0;">The Palace Is Open for You</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">See Christ in Every Chapter — Now in an App</p>
  </div>

  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Dear Friend,</p>

    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">You've already shown you care about going deeper into Scripture. Whether through the Teachable courses or the Phototheology community, you're part of this family.</p>

    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">Now I want to introduce you to something I've poured everything into: <strong style="color: #d4af37;">The Phototheology PhototheologyOS</strong> — the full Palace method, living inside an app.</p>

    <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #d4af37; margin: 0 0 15px 0;">🏰 What's Inside PhototheologyOS</h3>
      <ul style="font-size: 15px; line-height: 2; color: #c0c0c0; padding-left: 20px; margin: 0;">
        <li>🤖 <strong>Jeeves</strong> — Your AI study companion trained entirely in the Palace method</li>
        <li>🏛️ <strong>8 Floors of the Palace</strong> — Interactive study rooms for every level</li>
        <li>📖 <strong>Full KJV Bible</strong> — Commentary, audio, and verse mapping</li>
        <li>🔥 <strong>Daily Challenges &amp; Streaks</strong> — Build a real study habit</li>
        <li>💎 <strong>Gem Collection</strong> — Store your best insights forever</li>
        <li>👥 <strong>Community</strong> — Study alongside fellow Palace explorers worldwide</li>
        <li>📊 <strong>Progress Tracking</strong> — Know exactly where you are on every Floor</li>
      </ul>
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">This isn't another Bible app. This is the <strong style="color: #d4af37;">system</strong> — the Palace Method made interactive, searchable, and daily.</p>

    <div style="background: rgba(100, 160, 255, 0.08); border: 1px solid rgba(100, 160, 255, 0.3); border-radius: 8px; padding: 18px; margin: 25px 0;">
      <p style="font-size: 15px; line-height: 1.8; color: #c0c0c0; margin: 0;"><strong style="color: #a0c4ff;">Plans start at just $9/month</strong> — and your first 30 days are completely free. No commitment, cancel anytime.</p>
    </div>

    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology-palace.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Start My 30-Day Free Trial →</a>
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">You've already started the journey. The Palace is just the next room.</p>

    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">Blessings,<br><strong style="color: #d4af37;">Pastor Ivor Myers</strong></p>
  </div>

  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you're part of the Phototheology community on Teachable or Patreon.</p>
    <p>To unsubscribe, reply "unsubscribe" to this email.</p>
  </div>
</div>`);
              }}
            >
              🎯 "Step Into the Palace" — Teachable Non-Subscribers Conversion
            </Button>
          </div>

          <hr className="border-muted" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-600">💰 Upsell Templates (Free → Master Class)</h4>
            
            <Button
              variant="outline"
              className="w-full justify-start border-green-500/30 hover:bg-green-500/10"
              onClick={() => {
                setFilter("free_signup");
                setSubject("📖 Unlock the PhototheologyOS — Master Class Now Includes Full App Access!");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 28px; margin: 0;">The Full Palace Awaits</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">Master Class Students Get Full App Access</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Hi there,</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">You signed up for our free Teachable content — and we're so glad you did!</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">But did you know there's a <strong style="color: #d4af37;">whole world</strong> you haven't seen yet?</p>
    
    <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #d4af37; margin: 0 0 15px 0;">🏰 The PhototheologyOS</h3>
      <p style="color: #c0c0c0; margin: 0 0 15px 0;">Our premium app brings Phototheology to life with:</p>
      <ul style="font-size: 15px; line-height: 2; color: #c0c0c0; padding-left: 20px; margin: 0;">
        <li>🤖 <strong>Jeeves</strong> — Your AI study companion trained in the Palace method</li>
        <li>🏛️ <strong>8 Floors of the Palace</strong> — Interactive study rooms</li>
        <li>📖 <strong>Full KJV Bible</strong> — With commentary and audio</li>
        <li>🔥 <strong>Daily Challenges</strong> — Build your study streak</li>
        <li>💎 <strong>Gem Collection</strong> — Never lose an insight again</li>
        <li>👥 <strong>Community</strong> — Study alongside fellow Palace explorers</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">Here's the best part: <strong style="color: #d4af37;">Phototheology Master Class students get full app access included!</strong></p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">For just <strong style="color: #d4af37;">$20/month</strong>, you get:</p>
    <ul style="font-size: 15px; line-height: 2; color: #c0c0c0; padding-left: 20px;">
      <li>✅ Weekly live Master Class sessions with Pastor Ivor</li>
      <li>✅ Full access to the PhototheologyOS app</li>
      <li>✅ All course materials and replays</li>
      <li>✅ Direct Q&A opportunities</li>
    </ul>
    
    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology.teachable.com/p/phototheology-master-class" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Join the Master Class →</a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">The Palace has so much more to offer. Will you step inside?</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">Blessings,<br><strong style="color: #d4af37;">Pastor Ivor Myers</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you signed up for Phototheology on Teachable.</p>
  </div>
</div>`);
              }}
            >
              🚀 Master Class Upsell (Free Users → $20/mo)
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-green-500/30 hover:bg-green-500/10"
              onClick={() => {
                setFilter("not_paying");
                setSubject("🆕 Big Update: PhototheologyOS Now Included with Master Class!");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 26px; margin: 0;">🆕 New Benefit Announcement</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">Master Class Just Got Better</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Hi there,</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">I'm excited to share some news...</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">We've built something special: <strong style="color: #d4af37;">The PhototheologyOS</strong> — a full app dedicated to studying Scripture through the Phototheology method.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">And starting now, <strong style="color: #d4af37;">all Phototheology Master Class members get full access — included with their subscription!</strong></p>
    
    <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h3 style="color: #d4af37; margin: 0 0 15px 0;">What's in the PhototheologyOS?</h3>
      <ul style="font-size: 15px; line-height: 2; color: #c0c0c0; padding-left: 20px; margin: 0;">
        <li>🤖 Jeeves — AI trained in the Palace method</li>
        <li>🏛️ All 8 Palace Floors — interactive study</li>
        <li>📖 Full KJV Bible with commentary</li>
        <li>🔊 Audio narration</li>
        <li>💎 Save insights as "Gems"</li>
        <li>📊 Track your study streaks</li>
        <li>👥 Community discussions</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">This is the study tool I wish I'd had years ago. And now you can have it too.</p>
    
    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology.teachable.com/p/phototheology-master-class" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Join Master Class — $20/month →</a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.8; color: #888; text-align: center;">Weekly live classes + Full app access + All course materials</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">Ready to go deeper?<br><strong style="color: #d4af37;">Pastor Ivor Myers</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you signed up for Phototheology on Teachable.</p>
  </div>
</div>`);
              }}
            >
              📢 New Benefit Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
