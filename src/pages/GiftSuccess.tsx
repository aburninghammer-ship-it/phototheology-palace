import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function GiftSuccess() {
  const [searchParams] = useSearchParams();
  const giftToken = searchParams.get("token");
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const prodOrigin = window.location.hostname.includes('lovable') || window.location.hostname === 'localhost'
    ? 'https://phototheologybible.com'
    : window.location.origin;
  const redeemLink = `${prodOrigin}/gift/redeem/${giftToken}`;

  useEffect(() => {
    if (!giftToken) return;

    // Confirm payment
    supabase.functions.invoke("confirm-gift-payment", { body: { gift_token: giftToken } })
      .then(({ data }) => {
        if (data?.success || data?.confirmed || data?.already_confirmed) {
          setConfirmed(true);
          // Celebrate
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#f59e0b', '#ef4444', '#8b5cf6'] });
        }
      });
  }, [giftToken]);

  const copyLink = () => {
    navigator.clipboard.writeText(redeemLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Redemption link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO title="Gift Sent! | Phototheology" />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-lg text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 p-6 rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/20 w-fit animate-bounce">
            <Gift className="h-12 w-12 text-amber-500" />
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 px-4 py-2 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Gift Purchased!
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Your Gift is Ready! 🎁</h1>
          <p className="text-muted-foreground">
            {confirmed
              ? "Payment confirmed! Share the link below with the recipient so they can redeem their gift."
              : "Confirming your payment..."}
          </p>
        </div>

        {confirmed && (
          <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-rose-500/5">
            <CardContent className="p-6 space-y-4">
              <p className="text-sm font-medium">Send this link to your recipient:</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={redeemLink}
                  className="flex-1 text-xs bg-muted/50 border rounded-md px-3 py-2"
                />
                <Button size="icon" variant="outline" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The recipient has 90 days to redeem this gift. They'll need to create a free account first.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link to="/gift">
                  <Gift className="h-4 w-4 mr-2" />
                  Send Another Gift
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
