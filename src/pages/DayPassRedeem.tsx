import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Music, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function DayPassRedeem() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "redeemed" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    // Check pass status
    supabase
      .from("day_passes")
      .select("status, expires_at")
      .eq("pass_token", token)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setStatus("error");
          setErrorMsg("This Day Pass link is invalid.");
        } else if (data.status === "active") {
          setStatus("ready");
        } else if (data.status === "redeemed" && data.expires_at && new Date(data.expires_at) > new Date()) {
          setStatus("redeemed");
          setExpiresAt(data.expires_at);
        } else {
          setStatus("error");
          setErrorMsg("This Day Pass has expired or already been used.");
        }
      });
  }, [token]);

  const handleActivate = async () => {
    if (!token) return;

    // Use a fingerprint-like identifier (IP-based via simple hash)
    const fingerprint = `browser_${navigator.userAgent.length}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}`;

    try {
      const { data, error } = await supabase.rpc("redeem_day_pass", {
        _token: token,
        _recipient_id: fingerprint,
      });

      if (error) throw error;
      
      const result = data as any;
      if (result?.success) {
        setStatus("redeemed");
        setExpiresAt(result.expires_at);
        // Store the token in sessionStorage for audio gating
        sessionStorage.setItem("day_pass_token", token);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#3b82f6', '#06b6d4', '#8b5cf6'] });
        toast.success("Day Pass activated!");
      } else {
        setStatus("error");
        setErrorMsg(result?.error || "Failed to activate Day Pass");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to activate");
    }
  };

  const hoursLeft = expiresAt ? Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 3600000)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
      <SEO title="Day Pass | Phototheology" description="Activate your free 24-hour Day Pass to PhototheologyOS." />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-lg text-center">
        <div className="mx-auto mb-4 p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-fit">
          <Clock className="h-12 w-12 text-blue-500" />
        </div>

        {status === "loading" && (
          <p className="text-muted-foreground">Loading Day Pass...</p>
        )}

        {status === "ready" && (
          <>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-2 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Free Day Pass
            </Badge>
            <h1 className="text-3xl font-bold mb-2">You're Invited! ✨</h1>
            <p className="text-muted-foreground mb-6">
              Someone shared a free 24-hour pass to PhototheologyOS with you.
            </p>

            <Card className="mb-6 border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-4 space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>24 hours of full access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-blue-400" />
                  <span>3 audio commentary plays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>All study tools, AI, and Bible features</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleActivate}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
            >
              <Clock className="h-5 w-5 mr-2" />
              Activate My Day Pass
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Each person can only use one Day Pass. Timer starts when you activate.
            </p>
          </>
        )}

        {status === "redeemed" && (
          <>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Day Pass Active!
            </Badge>
            <h1 className="text-3xl font-bold mb-2">You're In! 🎉</h1>
            <p className="text-muted-foreground mb-2">
              You have <strong>{hoursLeft} hours</strong> of access remaining.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              3 audio commentary plays included. Explore everything else freely!
            </p>
            <Button
              onClick={() => {
                sessionStorage.setItem("day_pass_token", token || "");
                navigate("/dashboard");
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            >
              Start Exploring <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Day Pass Unavailable</h1>
            <p className="text-muted-foreground mb-6">{errorMsg}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/pricing">
                  View Plans <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
