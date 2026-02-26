import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreditPurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const packId = searchParams.get("pack");
  const credits = searchParams.get("credits");

  useEffect(() => {
    if (!user) return;

    const verifyPurchase = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-credit-purchase", {
          body: { packId, credits: Number(credits) },
        });

        if (error) throw error;
        if (data?.success) {
          setStatus("success");
          setMessage(
            Number(credits) === -1
              ? "Unlimited AI credits activated for 30 days!"
              : `${credits} AI credits added to your account!`
          );
        } else {
          throw new Error(data?.error || "Verification failed");
        }
      } catch (err: any) {
        console.error("Credit purchase verification failed:", err);
        setStatus("error");
        setMessage(err.message || "Something went wrong verifying your purchase.");
      }
    };

    verifyPurchase();
  }, [user, packId, credits]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Verifying your purchase…</h1>
            <p className="text-muted-foreground">This will only take a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Purchase Complete!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Verification Issue</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">
              Your payment was processed. Credits will appear shortly. Contact support if they don't.
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditPurchaseSuccess;
