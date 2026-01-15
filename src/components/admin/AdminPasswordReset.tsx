import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminPasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSendReset = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter the user's email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { email: email.trim() },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setLastSent(email.trim());
      setEmail("");
      toast({
        title: "Password Reset Sent",
        description: `Reset email sent to ${email.trim()}`,
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Failed to Send Reset",
        description: error.message || "Could not send password reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reset User Password</CardTitle>
        <CardDescription>
          Send a password reset email to any user
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendReset()}
            className="flex-1"
          />
          <Button onClick={handleSendReset} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Reset
              </>
            )}
          </Button>
        </div>
        
        {lastSent && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Last sent to: {lastSent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
