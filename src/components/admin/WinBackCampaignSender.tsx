import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SendResult {
  email: string;
  success: boolean;
  error?: string;
}

export function WinBackCampaignSender() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; details: SendResult[] } | null>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!confirm("This will send the win-back email to ALL unredeemed pre-approved contacts. Continue?")) return;

    setSending(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-winback-campaign", {
        body: {},
      });

      if (response.error) throw new Error(response.error.message);

      const data = response.data;
      setResult({ sent: data.sent, failed: data.failed, details: data.details || [] });

      toast({
        title: `Campaign sent!`,
        description: `${data.sent} emails sent, ${data.failed} failed out of ${data.total} recipients.`,
      });
    } catch (error: any) {
      toast({
        title: "Campaign failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Win-Back Email Campaign
        </CardTitle>
        <CardDescription>
          Send personalized win-back emails to all pre-approved contacts who haven't redeemed yet.
          Includes abandoned signups, expired trials, and promotional offers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleSend} disabled={sending} size="lg">
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Campaign...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Win-Back Emails
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-3 mt-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{result.sent} sent</span>
              </div>
              {result.failed > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>{result.failed} failed</span>
                </div>
              )}
            </div>

            {result.details.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded border p-3 text-xs font-mono space-y-1">
                {result.details.map((d, i) => (
                  <div key={i} className={d.success ? "text-green-600" : "text-red-600"}>
                    {d.success ? "✓" : "✗"} {d.email} {d.error ? `— ${d.error}` : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
