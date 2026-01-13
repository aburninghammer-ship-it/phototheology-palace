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
  all: "All 8,600+ Teachable students",
  active: "Only active Teachable students",
  inactive: "Inactive Teachable students",
  linked: "Students already using the app (have logged in)",
  unlinked: "Students who haven't connected to the app yet",
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
          {/* Student-Based Campaign Templates */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-600 flex items-center gap-2">
              🎓 Student-Based Campaigns
            </h4>
            
            <Button
              variant="outline"
              className="w-full justify-start border-green-500/30 hover:bg-green-500/10"
              onClick={() => {
                setFilter("linked");
                setSubject("Your Premium App Access is Ready! 🏰");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 28px; margin: 0;">Welcome to the Palace</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">Your Premium Access Awaits</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Dear Fellow Student of the Word,</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">As a current Phototheology student, you've already begun your journey through the Palace of Scripture. Now, we're excited to offer you something extraordinary—<strong style="color: #d4af37;">premium access to the Phototheology App</strong>.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">This isn't just another Bible app. It's the <em>living architecture</em> of Phototheology—the 8 Floors, the Rooms, the Cycles and Heavens—all at your fingertips, designed to help you:</p>
    
    <ul style="font-size: 16px; line-height: 2; color: #c0c0c0; padding-left: 20px;">
      <li>🏛️ Navigate the Palace system with guided exercises</li>
      <li>📖 Study Scripture with Jeeves, your AI companion trained in PT principles</li>
      <li>🔥 Build daily streaks and track your mastery journey</li>
      <li>💎 Store and organize your Gems from every study session</li>
      <li>👥 Connect with fellow Palace explorers in the community</li>
    </ul>
    
    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology.app" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Enter the Palace →</a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">Simply log in with the same email you use for your Teachable account, and your premium access will be automatically activated.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">The Palace awaits. Every chapter, every verse, every Christ-connection—stored, structured, and ready for discovery.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">In Christ,<br><strong style="color: #d4af37;">The Phototheology Team</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you're enrolled in Phototheology courses.</p>
  </div>
</div>`);
              }}
            >
              💎 Premium Access (Current Students)
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-blue-500/30 hover:bg-blue-500/10"
              onClick={() => {
                setFilter("unlinked");
                setSubject("Discover the Palace: 7 Days Free 🏰");
                setContent(`<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e8e8e8;">
  <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #d4af37;">
    <h1 style="color: #d4af37; font-size: 28px; margin: 0;">What If You Could See Christ in Every Chapter?</h1>
    <p style="color: #a0a0a0; font-style: italic; margin-top: 10px;">The Palace Method Awaits</p>
  </div>
  
  <div style="padding: 30px 20px;">
    <p style="font-size: 18px; line-height: 1.8; color: #e8e8e8;">Dear Friend,</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">You've heard about Phototheology. Maybe you've watched a video or seen a post. But you haven't yet stepped inside the Palace.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">The <strong style="color: #d4af37;">Phototheology App</strong> isn't just another devotional tool. It's a complete system for Bible study—8 Floors, dozens of Rooms, and a method that transforms how you read, remember, and live Scripture.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">For the next <strong style="color: #d4af37;">7 days</strong>, you can explore it all—completely free:</p>
    
    <ul style="font-size: 16px; line-height: 2; color: #c0c0c0; padding-left: 20px;">
      <li>🏛️ Walk through the Palace floors and discover each Room</li>
      <li>🤖 Meet Jeeves—your AI study companion trained in Phototheology</li>
      <li>📖 Experience the KJV Bible with built-in commentary and audio</li>
      <li>🔥 Start building your daily study streak</li>
      <li>💎 Begin collecting Gems—insights you'll never forget</li>
    </ul>
    
    <div style="text-align: center; padding: 30px 0;">
      <a href="https://phototheology.app" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #1a1a2e; padding: 16px 40px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 8px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">Start Your Free Trial →</a>
    </div>
    
    <p style="font-size: 16px; line-height: 1.8; color: #c0c0c0;">No credit card required. No commitment. Just 7 days to see if the Palace is where you belong.</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #a0a0a0; font-style: italic;">"The Bible is not only a book of words; it is a book of images, symbols, and living stories."</p>
    
    <p style="font-size: 16px; line-height: 1.8; color: #e8e8e8; margin-top: 30px;">Ready to begin?<br><strong style="color: #d4af37;">The Phototheology Team</strong></p>
  </div>
  
  <div style="text-align: center; padding: 20px; border-top: 1px solid #333; color: #666; font-size: 12px;">
    <p>You're receiving this because you signed up at Phototheology.</p>
  </div>
</div>`);
              }}
            >
              🆓 7-Day Free Trial (Non-Students)
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
