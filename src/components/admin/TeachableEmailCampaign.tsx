import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Users, AlertTriangle, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type TeachableFilter = 'all' | 'active' | 'inactive' | 'linked' | 'unlinked' | 'premium_paying' | 'not_paying';

const FILTER_DESCRIPTIONS: Record<TeachableFilter, string> = {
  all: "All Teachable students",
  active: "Only active Teachable students",
  inactive: "Inactive Teachable students",
  linked: "Students already linked to app accounts",
  unlinked: "Students NOT yet linked to app accounts",
  premium_paying: "Students paying $15+ per month (premium access)",
  not_paying: "Students not currently paying anything",
};

export function TeachableEmailCampaign() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState<TeachableFilter>("all");
  const [testMode, setTestMode] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    sent: number;
    total: number;
    message: string;
  } | null>(null);

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
                <SelectItem value="all">All Teachable Students</SelectItem>
                <SelectItem value="active">Active Students Only</SelectItem>
                <SelectItem value="inactive">Inactive Students</SelectItem>
                <SelectItem value="linked">Linked to App</SelectItem>
                <SelectItem value="unlinked">Not Linked to App</SelectItem>
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
          {/* Payment-Based Campaign Templates */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-600 flex items-center gap-2">
              💰 Payment-Based Campaigns
            </h4>
            
            <Button
              variant="outline"
              className="w-full justify-start border-green-500/30 hover:bg-green-500/10"
              onClick={() => {
                setFilter("premium_paying");
                setSubject("🌟 Your Premium Access to the PhotoTheology Suite is Ready!");
                setContent(`<h1>Congratulations, Premium Member!</h1>
<p>Hi there,</p>
<p>As a valued subscriber paying $15+/month, you now have <strong>full premium access</strong> to the PhotoTheology Suite!</p>

<h2>🎁 What You Get:</h2>
<ul>
  <li>✅ Unlimited access to all 8 Floors of the Palace</li>
  <li>✅ Unlimited Jeeves AI conversations</li>
  <li>✅ All challenge types unlocked</li>
  <li>✅ Sermon prep tools & study generators</li>
  <li>✅ Premium community features</li>
  <li>✅ Priority support</li>
</ul>

<h2>🚀 Get Started:</h2>
<p><a href="https://phototheology.app" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Premium Account</a></p>

<p>Simply sign in with the email you use on Teachable, and your premium access will be automatically activated.</p>

<p>Thank you for your support!</p>
<p>Blessings,<br/><strong>The PhotoTheology Team</strong></p>`);
              }}
            >
              💎 Premium Access Announcement ($15+)
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
              onClick={() => {
                setFilter("not_paying");
                setSubject("🎁 Try PhotoTheology Premium FREE for 7 Days!");
                setContent(`<h1>Start Your Free 7-Day Premium Trial!</h1>
<p>Hi there,</p>
<p>We noticed you're part of our Teachable community but haven't experienced the full power of the PhotoTheology Suite yet.</p>

<h2>🆓 Get 7 Days FREE:</h2>
<p>We'd love to give you a chance to experience premium features with <strong>no commitment</strong>.</p>

<h2>What's Included in Your Trial:</h2>
<ul>
  <li>🏰 Full access to all 8 Floors of the Palace</li>
  <li>🤖 Unlimited AI conversations with Jeeves</li>
  <li>📖 Sermon prep & Bible study generators</li>
  <li>🏆 All challenge types</li>
  <li>👥 Premium community features</li>
</ul>

<h2>🚀 Start Your Free Trial:</h2>
<p><a href="https://phototheology.app/pricing" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Claim Your 7-Day Free Trial</a></p>

<p><em>No credit card required to start. Cancel anytime.</em></p>

<p>Experience the Bible like never before!</p>
<p>Blessings,<br/><strong>The PhotoTheology Team</strong></p>`);
              }}
            >
              🆓 7-Day Free Trial Offer (Not Paying)
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
                setSubject("🎓 Welcome to the PhotoTheology Suite!");
                setContent(`<h1>Welcome Teachable Student!</h1>
<p>Hi there,</p>
<p>Thank you for enrolling in our Teachable course! We're excited to let you know that you now have access to the full PhotoTheology Suite.</p>
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
<p>We noticed you haven't connected your Teachable account to the PhotoTheology app yet.</p>
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
<p>We noticed you haven't been active in the PhotoTheology app recently.</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
