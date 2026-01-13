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
            className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => {
              setSubject("⛏️ Welcome to the PhotoTheology Suite!");
              setContent(`<h1>Welcome Pickaxe Member!</h1>
<p>Hi there,</p>
<p>Thank you for being part of our Pickaxe community! We're excited to let you know that you now have access to the full PhotoTheology Suite.</p>
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
            className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => {
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
            🔗 Account Linking Reminder
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => {
              setSubject("⛏️ New Features Just for Pickaxe Members!");
              setContent(`<h1>Exclusive Updates for You!</h1>
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
            ✨ New Features Announcement
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-purple-500/30 hover:bg-purple-500/10"
            onClick={() => {
              setSubject("⛏️ Support PhotoTheology - Upgrade Your Membership!");
              setContent(`<h1>Support Our Mission!</h1>
<p>Hi there,</p>
<p>Thank you for being part of our Pickaxe community! Your support means everything to us.</p>
<p>If you've been enjoying PhotoTheology, consider upgrading to a paid tier:</p>
<ul>
  <li><strong>Paid Membership</strong> - Help us continue developing new features</li>
  <li><strong>Premium Support</strong> - Get priority help and exclusive content</li>
</ul>
<p>Every contribution helps us build better Bible study tools for everyone.</p>
<p><a href="https://pickaxe.phototheology.app">Upgrade your membership</a></p>
<p>God bless,<br/>The PhotoTheology Team</p>`);
            }}
          >
            💎 Upgrade Encouragement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
