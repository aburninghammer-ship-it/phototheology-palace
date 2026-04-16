import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Sparkles, Crown, Infinity, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreditPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits?: number;
  pendingFeature?: string | null;
}

const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: "$5",
    priceCents: 500,
    icon: Zap,
    description: "Quick top-up for light use",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    credits: 200,
    price: "$15",
    priceCents: 1500,
    icon: Sparkles,
    description: "Best value — covers 1-2 weeks of heavy use",
    popular: true,
  },
  {
    id: "power",
    name: "Power",
    credits: 400,
    price: "$25",
    priceCents: 2500,
    icon: Crown,
    description: "For power users running Defense Mode & Study Series",
    popular: false,
  },
  {
    id: "unlimited",
    name: "Unlimited Month",
    credits: -1,
    price: "$50",
    priceCents: 5000,
    icon: Infinity,
    description: "Uncapped AI for 30 days. No limits.",
    popular: false,
  },
];

export function CreditPurchaseModal({
  open,
  onOpenChange,
  currentCredits = 0,
  pendingFeature,
}: CreditPurchaseModalProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (packId: string) => {
    setPurchasing(packId);
    try {
      const { data, error } = await supabase.functions.invoke("purchase-credit-pack", {
        body: { packId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error("Failed to start purchase: " + (err.message || "Unknown error"));
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Get More AI Credits
          </DialogTitle>
          <DialogDescription>
            {pendingFeature
              ? `You need more credits to use ${pendingFeature}. Choose a pack below.`
              : "Top up your AI credits to keep using Jeeves, Gem Mining, Commentary, and more."}
          </DialogDescription>
        </DialogHeader>

        {currentCredits > 0 && (
          <div className="text-xs text-muted-foreground text-center">
            Current balance: <span className="font-bold text-primary">{currentCredits} credits</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {CREDIT_PACKS.map((pack) => {
            const Icon = pack.icon;
            const isLoading = purchasing === pack.id;
            return (
              <Card
                key={pack.id}
                className={`relative cursor-pointer transition-all hover:border-primary/50 ${
                  pack.popular ? "border-primary/40 ring-1 ring-primary/20" : ""
                }`}
                onClick={() => !purchasing && handlePurchase(pack.id)}
              >
                {pack.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-primary">
                    Best Value
                  </Badge>
                )}
                <CardContent className="p-4 text-center space-y-2">
                  <Icon className="h-6 w-6 mx-auto text-primary" />
                  <div>
                    <p className="font-bold text-sm">{pack.name}</p>
                    <p className="text-xs text-muted-foreground">{pack.description}</p>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-primary">{pack.price}</span>
                    {pack.credits > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        / {pack.credits} credits
                      </span>
                    )}
                  </div>
                  {pack.credits > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      {((pack.priceCents / pack.credits) / 100).toFixed(2)}/credit
                    </p>
                  )}
                  <Button
                    size="sm"
                    className="w-full gap-1"
                    disabled={!!purchasing}
                    variant={pack.popular ? "default" : "outline"}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>Buy {pack.name}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2">
          One-time purchase • Credits never expire • Secure checkout via Stripe
        </p>
      </DialogContent>
    </Dialog>
  );
}
