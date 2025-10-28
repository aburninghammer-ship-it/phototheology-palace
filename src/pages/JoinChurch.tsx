import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function JoinChurch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitationCode, setInvitationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationCode.trim()) {
      toast.error("Please enter an invitation code");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to join a church");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('accept_church_invitation', {
        _invitation_code: invitationCode.trim().toUpperCase()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string; church_id?: string };

      if (!result.success) {
        toast.error(result.error || "Failed to accept invitation");
        return;
      }

      setSuccess(true);
      toast.success(result.message || "Successfully joined church!");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(error.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Church!</h2>
              <p className="text-muted-foreground mb-6">
                You've successfully joined your church organization. You now have full access to Phototheology.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join Your Church</CardTitle>
          <CardDescription>
            Enter the invitation code you received from your church administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="invitation-code">Invitation Code</Label>
              <Input
                id="invitation-code"
                placeholder="CHURCH-XXXXXXXX"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                className="font-mono"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the code exactly as it appears in your invitation
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Once you join, you'll have access to all Phototheology features through your church's subscription.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Joining Church...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Join Church
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an invitation code?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/")}>
                Contact your church administrator
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
