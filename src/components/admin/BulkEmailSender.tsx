import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Mail, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type EmailFilter = 'all' | 'active' | 'not_paid' | 'paid_only' | 'teachable_not_signed_up';

const FILTER_DESCRIPTIONS: Record<EmailFilter, string> = {
  all: "All registered users in the system",
  active: "Users who have been active recently",
  not_paid: "Users who have NOT subscribed or paid yet",
  paid_only: "Only paid subscribers (Stripe, Patreon, or Lifetime)",
  teachable_not_signed_up: "Teachable members (Power of the Lamb buyers) who have NOT yet created a Suite account — ~8,670 people",
};

export function BulkEmailSender() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState<EmailFilter>("all");
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
      const { data, error } = await supabase.functions.invoke("send-bulk-email", {
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
        // Clear form after successful non-test send
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Bulk Email
          </CardTitle>
          <CardDescription>
            Send emails to filtered groups of users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipient Filter
            </Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as EmailFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="not_paid">Not Yet Paid</SelectItem>
                <SelectItem value="paid_only">Paid Subscribers Only</SelectItem>
                <SelectItem value="teachable_not_signed_up">📚 Teachable Members (Not Yet in Suite)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {FILTER_DESCRIPTIONS[filter]}
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Email Content (HTML supported)</Label>
            <Textarea
              id="content"
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
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <Input
                    id="testEmail"
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
              className={!testMode ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {testMode ? "Send Test Email" : "Send to All Recipients"}
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

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Click to use a template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setSubject("🎉 New Features in PhotoTheology!");
              setContent(`<h1>Exciting Updates!</h1>
<p>Hi there,</p>
<p>We've added some amazing new features to PhotoTheology:</p>
<ul>
  <li>Feature 1</li>
  <li>Feature 2</li>
  <li>Feature 3</li>
</ul>
<p>Log in now to check them out!</p>
<p>Best,<br/>The PhotoTheology Team</p>`);
            }}
          >
            📢 New Features Announcement
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setSubject("We miss you! Come back to PhotoTheology");
              setContent(`<h1>We Miss You!</h1>
<p>Hi there,</p>
<p>It's been a while since we've seen you. We've made lots of improvements and would love to have you back.</p>
<p>As a welcome back gift, here's what's new:</p>
<ul>
  <li>Improved study tools</li>
  <li>New content library</li>
  <li>Better mobile experience</li>
</ul>
<p>Come back and continue your journey!</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            💝 Win-Back Campaign
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              setSubject("🔓 Unlock Premium Features - Special Offer!");
              setContent(`<h1>Special Offer Just for You!</h1>
<p>Hi there,</p>
<p>We noticed you haven't upgraded to Premium yet. Here's what you're missing:</p>
<ul>
  <li>Unlimited Jeeves AI conversations</li>
  <li>All 8 Palace Floors</li>
  <li>Advanced study tools</li>
  <li>Priority support</li>
</ul>
<p><strong>Use code UPGRADE20 for 20% off your first month!</strong></p>
<p>Start your premium journey today.</p>
<p>Blessings,<br/>The PhotoTheology Team</p>`);
            }}
          >
            💎 Upgrade Promotion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
