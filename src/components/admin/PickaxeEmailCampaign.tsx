import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Mail, Users, AlertTriangle, Pickaxe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type PickaxeFilter = 'all' | 'paid' | 'unpaid' | 'linked' | 'unlinked';

const FILTER_DESCRIPTIONS: Record<PickaxeFilter, string> = {
  all: "All Pickaxe members",
  paid: "Only paid Pickaxe members",
  unpaid: "Unpaid/free Pickaxe members",
  linked: "Members already linked to app accounts",
  unlinked: "Members NOT yet linked to app accounts",
};

export function PickaxeEmailCampaign() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState<PickaxeFilter>("all");
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

      const { data, error } = await supabase.functions.invoke("send-pickaxe-email", {
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
      <Card className="border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pickaxe className="h-5 w-5 text-purple-600" />
            Pickaxe Email Campaign
          </CardTitle>
          <CardDescription>
            Send targeted emails to Pickaxe members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipient Filter
            </Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as PickaxeFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pickaxe Members</SelectItem>
                <SelectItem value="paid">Paid Members Only</SelectItem>
                <SelectItem value="unpaid">Unpaid/Free Members</SelectItem>
                <SelectItem value="linked">Linked to App</SelectItem>
                <SelectItem value="unlinked">Not Linked to App</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {FILTER_DESCRIPTIONS[filter]}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="pickaxe-subject">Subject Line</Label>
            <Input
              id="pickaxe-subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="pickaxe-content">Email Content (HTML supported)</Label>
            <Textarea
              id="pickaxe-content"
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
                  <Label htmlFor="pickaxe-testEmail">Test Email Address</Label>
                  <Input
                    id="pickaxe-testEmail"
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
              className={!testMode ? "bg-purple-600 hover:bg-purple-700" : "border-purple-500"}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {testMode ? "Send Test Email" : "Send to Pickaxe Members"}
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

      {/* Pickaxe Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Pickaxe Templates</CardTitle>
          <CardDescription>Click to use a template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start border-green-500/30 hover:bg-green-500/10"
            onClick={() => {
              setFilter("paid");
              setSubject("🎉 You Have Full Access to the PhototheologyOS!");
              setContent(`<h1>Great News — Your Full Access is Confirmed!</h1>
<p>Hi there,</p>
<p>As a <strong>paying Pickaxe member</strong>, you already have <strong>full access</strong> to the entire PhototheologyOS!</p>
<h2>What's Included:</h2>
<ul>
  <li>✅ All 8 Floors of the Palace unlocked</li>
  <li>✅ Unlimited Jeeves AI conversations</li>
  <li>✅ Create & save unlimited Bible studies</li>
  <li>✅ Access to all challenges and community features</li>
  <li>✅ Devotional plan generator</li>
  <li>✅ Church features and more!</li>
</ul>
<h2>How to Access:</h2>
<ol>
  <li>Go to <a href="https://phototheology.app">phototheology.app</a></li>
  <li>Sign in or create an account with the same email</li>
  <li>Navigate to Settings → Pickaxe Verification</li>
  <li>Click "Verify Pickaxe Account" — your premium access activates instantly!</li>
</ol>
<p>Thank you for supporting PhotoTheology. Your investment helps us continue building Christ-centered Bible study tools.</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            ✅ Suite Access Confirmation (Paid Members)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-amber-500/30 hover:bg-amber-500/10"
            onClick={() => {
              setFilter("unpaid");
              setSubject("⛏️ Unlock the Full PhototheologyOS!");
              setContent(`<h1>Unlock Premium Access to PhotoTheology!</h1>
<p>Hi there,</p>
<p>Thank you for being part of our Pickaxe community! We wanted to let you know about the full PhototheologyOS that's available to our subscribers.</p>
<h2>What You're Missing:</h2>
<ul>
  <li>🔒 Access to all 8 Floors of the Palace (currently limited)</li>
  <li>🔒 Unlimited Jeeves AI conversations (currently 3/day)</li>
  <li>🔒 Create & save unlimited Bible studies</li>
  <li>🔒 Advanced challenges and community features</li>
  <li>🔒 Devotional plan generator</li>
  <li>🔒 Church features and discipleship tools</li>
</ul>
<h2>Upgrade Today:</h2>
<p>Subscribe to Pickaxe to unlock everything and support the continued development of Christ-centered Bible study tools.</p>
<p><a href="https://pickaxe.phototheology.app" style="background-color: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Subscribe Now</a></p>
<p>Thank you for being part of our community!</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            🔓 Subscription Encouragement (Unpaid Members)
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => {
              setFilter("unlinked");
              setSubject("⛏️ Connect Your Pickaxe Account to the App!");
              setContent(`<h1>Link Your Account for Full Access!</h1>
<p>Hi there,</p>
<p>We noticed you haven't connected your Pickaxe account to the PhotoTheology app yet.</p>
<p>Connecting your account gives you:</p>
<ul>
  <li>Automatic premium access</li>
  <li>Synced progress across devices</li>
  <li>Access to exclusive Pickaxe member features</li>
</ul>
<p><strong>How to connect:</strong></p>
<ol>
  <li>Sign in to the app at <a href="https://phototheology.app">phototheology.app</a></li>
  <li>Go to Settings → Pickaxe Verification</li>
  <li>Click "Verify Pickaxe Account"</li>
</ol>
<p>That's it! Your premium access will be activated automatically.</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            🔗 Account Linking Reminder (Unlinked)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
            onClick={() => {
              setFilter("all");
              setSubject("⛏️ New Features Just for Pickaxe Members!");
              setContent(`<h1>Exciting Updates for You!</h1>
<p>Hi Pickaxe Member,</p>
<p>We've been working hard to bring you new features:</p>
<ul>
  <li>🆕 Feature 1 - Description</li>
  <li>🆕 Feature 2 - Description</li>
  <li>🆕 Feature 3 - Description</li>
</ul>
<p>As a Pickaxe member, you get early access to all these features!</p>
<p><a href="https://phototheology.app">Check them out now</a></p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            ✨ New Features Announcement (All)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
