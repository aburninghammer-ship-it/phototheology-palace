import { useState } from "react";
import { AlertTriangle, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function FixBilling() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFixPayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Could not open billing portal. Please try again.");
      }
    } catch (err: any) {
      toast.error("Failed to open billing portal: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border-destructive/30 shadow-lg">
        <CardContent className="pt-8 pb-6 px-6 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Payment Issue</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your most recent payment failed. Your access has been paused until
              the issue is resolved. Please update your payment method to
              continue using all features.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-left space-y-1">
            <p className="text-xs font-medium text-foreground/70">Account</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.email || "—"}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleFixPayment}
              disabled={loading}
              className="w-full gap-2"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Update Payment Method
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => signOut?.()}
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Sign out
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground">
            After updating your payment, return here and refresh the page. Your
            access will be restored automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
