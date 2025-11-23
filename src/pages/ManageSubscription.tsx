import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToPortal = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to auth with return URL
          navigate('/auth?redirect=/manage-subscription');
          return;
        }

        // Call customer portal function
        const { data, error } = await supabase.functions.invoke('customer-portal');
        
        if (error) throw error;
        
        if (data?.url) {
          // Redirect to Stripe Customer Portal
          window.location.href = data.url;
        } else {
          throw new Error('No portal URL returned');
        }
      } catch (err) {
        console.error('Error opening customer portal:', err);
        setError(err instanceof Error ? err.message : 'Failed to open billing portal');
      }
    };

    redirectToPortal();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unable to Access Billing Portal</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please contact support if this issue persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to billing portal...</p>
      </div>
    </div>
  );
}
