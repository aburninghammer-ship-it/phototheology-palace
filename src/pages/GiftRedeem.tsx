import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Sparkles, ArrowRight, LogIn } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function GiftRedeem() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [giftInfo, setGiftInfo] = useState<any>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    // Use secure function to fetch gift info by token (no blanket SELECT policy)
    supabase
      .rpc("get_gift_by_token", { _token: token })
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("This gift link is invalid or has expired.");
        } else if (data.status === "redeemed") {
          setError("This gift has already been redeemed.");
        } else if (data.status !== "paid") {
          setError("This gift is not yet available. The payment may still be processing.");
        } else {
          setGiftInfo(data);
        }
      });
  }, [token]);

  const handleRedeem = async () => {
    if (!user || !token) return;
    setRedeeming(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-gift", {
        body: { gift_token: token },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setRedeemed(true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'] });
      toast.success(data.message || "Gift redeemed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to redeem gift");
    } finally {
      setRedeeming(false);
    }
  };

  const planLabel = giftInfo?.plan_type === "essential_annual" ? "1 Year" : "1 Month";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO title="Redeem Your Gift | Phototheology" />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-lg text-center">
        <div className="mx-auto mb-4 p-6 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 w-fit">
          <Gift className="h-12 w-12 text-amber-500" />
        </div>

        {error ? (
          <Card className="border-destructive/30">
            <CardContent className="p-6">
              <p className="text-destructive mb-4">{error}</p>
              <Button asChild variant="outline">
                <Link to="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        ) : redeemed ? (
          <>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Gift Redeemed!
            </Badge>
            <h1 className="text-3xl font-bold mb-2">Welcome to the Palace! 🎉</h1>
            <p className="text-muted-foreground mb-6">
              You now have {planLabel} of premium access to PhototheologyOS.
            </p>
            {giftInfo?.personal_message && (
              <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4">
                  <p className="text-sm italic">"{giftInfo.personal_message}"</p>
                  <p className="text-xs text-muted-foreground mt-2">— From your gifter</p>
                </CardContent>
              </Card>
            )}
            <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-amber-500 to-rose-500 text-white">
              Enter the Palace <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        ) : giftInfo ? (
          <>
            <Badge className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 px-4 py-2 mb-4">
              <Gift className="h-3 w-3 mr-1" />
              You've Been Gifted!
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              Someone gifted you {planLabel} of Phototheology! 🎁
            </h1>
            {giftInfo.personal_message && (
              <Card className="my-6 border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4">
                  <p className="text-sm italic">"{giftInfo.personal_message}"</p>
                </CardContent>
              </Card>
            )}

            {authLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : user ? (
              <Button
                onClick={handleRedeem}
                disabled={redeeming}
                className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white px-8 py-6 text-lg"
              >
                {redeeming ? "Redeeming..." : (
                  <>
                    <Gift className="h-5 w-5 mr-2" />
                    Redeem Gift
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">Sign in or create a free account to redeem your gift.</p>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-6 text-lg">
                  <Link to={`/auth?redirect=/gift/redeem/${token}`}>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Redeem
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Loading gift details...</p>
        )}
      </div>
    </div>
  );
}
