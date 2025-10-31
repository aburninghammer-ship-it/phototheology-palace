import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Gift, Mail, Link as LinkIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAccessCodes() {
  const { toast } = useToast();
  const [maxUses, setMaxUses] = useState<string>("");
  const [accessDurationMonths, setAccessDurationMonths] = useState<string>("3");
  const [isLifetime, setIsLifetime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  
  // Email invitation fields
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState<string>("");
  const [inviteAccessDuration, setInviteAccessDuration] = useState<string>("3");
  const [inviteIsLifetime, setInviteIsLifetime] = useState(false);
  
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    link: string;
    expiresAt: string;
    isLifetime?: boolean;
    duration?: number;
    emailSent?: boolean;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('generate-access-code', {
        body: { 
          maxUses: maxUses ? parseInt(maxUses) : null,
          accessDurationMonths: isLifetime ? null : (accessDurationMonths ? parseInt(accessDurationMonths) : null),
          isLifetime: isLifetime
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      setGeneratedCode({
        code: response.data.code,
        link: `${window.location.origin}/access?code=${response.data.code}`,
        expiresAt: response.data.expiresAt,
        isLifetime: isLifetime,
        duration: !isLifetime && accessDurationMonths ? parseInt(accessDurationMonths) : undefined
      });

      toast({
        title: "Success!",
        description: "Access code generated successfully",
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!recipientEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter recipient email",
        variant: "destructive",
      });
      return;
    }

    setSendingInvite(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('send-invitation', {
        body: { 
          recipientEmail: recipientEmail.trim(),
          recipientName: recipientName.trim() || undefined,
          maxUses: inviteMaxUses ? parseInt(inviteMaxUses) : null,
          isLifetime: inviteIsLifetime,
          accessDurationMonths: inviteIsLifetime ? null : (inviteAccessDuration ? parseInt(inviteAccessDuration) : 3)
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      setGeneratedCode({
        code: response.data.code,
        link: `${window.location.origin}/access?code=${response.data.code}`,
        expiresAt: response.data.expiresAt,
        isLifetime: inviteIsLifetime,
        duration: !inviteIsLifetime && inviteAccessDuration ? parseInt(inviteAccessDuration) : undefined,
        emailSent: true
      });

      toast({
        title: "Success!",
        description: `Invitation sent to ${recipientEmail}`,
      });

      // Reset form
      setRecipientEmail("");
      setRecipientName("");
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Invite Users to Premium Access</CardTitle>
            <CardDescription>
              Generate codes or send personalized email invitations with lifetime or temporary access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invitation
                </TabsTrigger>
                <TabsTrigger value="link">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Generate Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="user@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    disabled={sendingInvite}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name (Optional)</Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    disabled={sendingInvite}
                  />
                  <p className="text-sm text-muted-foreground">
                    Personalizes the email greeting
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inviteLifetime"
                    checked={inviteIsLifetime}
                    onCheckedChange={(checked) => setInviteIsLifetime(checked as boolean)}
                    disabled={sendingInvite}
                  />
                  <Label
                    htmlFor="inviteLifetime"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Grant Lifetime Access
                  </Label>
                </div>

                {!inviteIsLifetime && (
                  <div className="space-y-2">
                    <Label htmlFor="inviteAccessDuration">Access Duration (Months)</Label>
                    <Input
                      id="inviteAccessDuration"
                      type="number"
                      placeholder="3"
                      value={inviteAccessDuration}
                      onChange={(e) => setInviteAccessDuration(e.target.value)}
                      disabled={sendingInvite}
                      min="1"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="inviteMaxUses">Maximum Uses (Optional)</Label>
                  <Input
                    id="inviteMaxUses"
                    type="number"
                    placeholder="Leave blank for single use"
                    value={inviteMaxUses}
                    onChange={(e) => setInviteMaxUses(e.target.value)}
                    disabled={sendingInvite}
                  />
                  <p className="text-sm text-muted-foreground">
                    How many people can use this code? Leave blank for one use.
                  </p>
                </div>

                <Button
                  onClick={handleSendInvitation}
                  disabled={sendingInvite || !recipientEmail.trim()}
                  className="w-full"
                >
                  {sendingInvite && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email Invitation
                </Button>
              </TabsContent>

              <TabsContent value="link" className="space-y-6 mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lifetime"
                    checked={isLifetime}
                    onCheckedChange={(checked) => setIsLifetime(checked as boolean)}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="lifetime"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Grant Lifetime Access
                  </Label>
                </div>

                {!isLifetime && (
                  <div className="space-y-2">
                    <Label htmlFor="accessDuration">Access Duration (Months)</Label>
                    <Input
                      id="accessDuration"
                      type="number"
                      placeholder="3"
                      value={accessDurationMonths}
                      onChange={(e) => setAccessDurationMonths(e.target.value)}
                      disabled={loading}
                      min="1"
                    />
                    <p className="text-sm text-muted-foreground">
                      Number of months of premium access
                    </p>
                  </div>
                )}

            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses (optional)</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Leave blank for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                How many people can use this code? Leave blank for unlimited uses.
              </p>
            </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Code
                </Button>
              </TabsContent>
            </Tabs>

            {generatedCode && (
              <div className="space-y-4 mt-6 p-4 bg-muted rounded-lg border-2 border-primary/20">
                <div className="space-y-2">
                  <Label>Access Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.code}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.link}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.link)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {generatedCode.emailSent && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      ✓ Email invitation sent successfully!
                    </p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p>Code expires in 24 hours: {new Date(generatedCode.expiresAt).toLocaleString()}</p>
                  <p className="mt-2 font-semibold">
                    {generatedCode.isLifetime
                      ? "🎉 This code grants LIFETIME premium access!"
                      : `This code grants ${generatedCode.duration} months of premium access.`
                    }
                  </p>
                  <p className="mt-1 text-xs">
                    The redemption link expires in 24 hours, but once redeemed, the access will be {generatedCode.isLifetime ? 'permanent' : `valid for ${generatedCode.duration} months`}.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
