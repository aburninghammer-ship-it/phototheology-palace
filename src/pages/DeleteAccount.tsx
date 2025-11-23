import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Trash2, AlertTriangle } from "lucide-react";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send deletion request via edge function
      const { error } = await supabase.functions.invoke('send-feedback-email', {
        body: {
          email,
          subject: 'Account Deletion Request',
          message: `User ${email} has requested account deletion.\n\nReason: ${reason || 'Not provided'}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: "We'll process your deletion request within 48 hours and send you a confirmation email.",
      });

      setEmail("");
      setReason("");
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      toast({
        title: "Submission failed",
        description: "Please email us directly at support@thephototheologyapp.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Delete Account</h1>
          <p className="text-muted-foreground">Request permanent deletion of your account and data</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Account Deletion Request
            </CardTitle>
            <CardDescription>
              Submit a request to permanently delete your Phototheology account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-2">
                  Reason for Deletion (Optional)
                </label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Help us improve by telling us why you're leaving..."
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Deletion Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>What will be deleted:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your user account and profile</li>
              <li>All your saved studies and notes</li>
              <li>Your progress data and achievements</li>
              <li>All personal information associated with your account</li>
            </ul>

            <p className="pt-3">
              <strong>Processing time:</strong> We will process all deletion requests within 48 hours.
            </p>

            <p>
              <strong>This action is permanent and cannot be undone.</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Alternative Contact Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You can also request account deletion by emailing us directly at:{" "}
              <a 
                href="mailto:support@thephototheologyapp.com?subject=Delete My Account" 
                className="text-primary hover:underline font-medium"
              >
                support@thephototheologyapp.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Subject line: "Delete My Account"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccount;
