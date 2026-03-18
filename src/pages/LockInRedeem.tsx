import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles, ArrowRight, AlertTriangle, BookOpen, Star, Trophy, Headphones } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const DAILY_MISSIONS = [
  { icon: <Sparkles className="h-4 w-4 text-amber-400" />, label: "Day 1: Discover a Hidden Gem" },
  { icon: <BookOpen className="h-4 w-4 text-amber-400" />, label: "Day 2: Build Your First Study" },
  { icon: <Headphones className="h-4 w-4 text-purple-400" />, label: "Day 3: Listen to the Commentary Suite" },
  { icon: <Star className="h-4 w-4 text-amber-400" />, label: "Day 4: Freestyle Connection" },
  { icon: <Trophy className="h-4 w-4 text-amber-400" />, label: "Day 5: Create & Share" },
];

export default function LockInRedeem() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "redeemed" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [personalMessage, setPersonalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    supabase
      .from("lock_in_passes")
      .select("status, expires_at, personal_message")
      .eq("pass_token", token)
      .single()
      .then(({ data, error }: any) => {
        if (error || !data) {
          setStatus("error");
          setErrorMsg("This Lock-In Pass link is invalid.");
        } else if (data.status === "active") {
          setStatus("ready");
          setPersonalMessage(data.personal_message);
        } else if (data.status === "redeemed" && data.expires_at && new Date(data.expires_at) > new Date()) {
          setStatus("redeemed");
          setExpiresAt(data.expires_at);
          setPersonalMessage(data.personal_message);
        } else {
          setStatus("error");
          setErrorMsg("This Lock-In Pass has expired or already been used.");
        }
      });
  }, [token]);

  const handleActivate = async () => {
    if (!token) return;

    const fingerprint = `browser_${navigator.userAgent.length}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}`;

    try {
      const { data, error } = await supabase.rpc("redeem_lock_in_pass", {
        _token: token,
        _user_id_or_fingerprint: fingerprint,
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        setStatus("redeemed");
        setExpiresAt(result.expires_at);
        sessionStorage.setItem("lock_in_pass_token", token);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
        });
        toast.success("Lock-In Pass activated! 🔥");
      } else {
        if (result?.already_active) {
          setStatus("redeemed");
          setExpiresAt(result.expires_at);
          sessionStorage.setItem("lock_in_pass_token", token);
        } else {
          setStatus("error");
          setErrorMsg(result?.error || "Failed to activate Lock-In Pass");
        }
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to activate");
    }
  };

  const daysLeft = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-amber-500/5">
      <SEO
        title="Lock-In Pass | Phototheology"
        description="Activate your free 5-Day Lock-In Pass to the Phototheology Bible Suite."
      />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-lg text-center">
        <div className="mx-auto mb-4 p-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-fit">
          <Flame className="h-12 w-12 text-amber-500" />
        </div>

        {status === "loading" && (
          <p className="text-muted-foreground">Loading Lock-In Pass...</p>
        )}

        {status === "ready" && (
          <>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-2 mb-4">
              <Flame className="h-3 w-3 mr-1" />
              5-Day Lock-In Pass
            </Badge>
            <h1 className="text-3xl font-bold mb-2">You're Invited! 🔥</h1>

            {personalMessage && (
              <Card className="mb-4 border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-4 text-sm italic text-muted-foreground">
                  "{personalMessage}"
                </CardContent>
              </Card>
            )}

            <p className="text-muted-foreground mb-6">
              Someone shared a free 5-Day Lock-In Pass to the full Phototheology Bible Suite with you.
            </p>

            <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 space-y-2 text-sm text-left">
                <p className="font-semibold text-amber-600 mb-3">Your 5-Day Mission:</p>
                {DAILY_MISSIONS.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {m.icon}
                    <span>{m.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button
              onClick={handleActivate}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg"
            >
              <Flame className="h-5 w-5 mr-2" />
              Activate My Lock-In Pass
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              No credit card needed. Timer starts when you activate. One pass per person.
            </p>
          </>
        )}

        {status === "redeemed" && (
          <>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Lock-In Pass Active!
            </Badge>
            <h1 className="text-3xl font-bold mb-2">You're Locked In! 🔥</h1>
            <p className="text-muted-foreground mb-2">
              You have <strong>{daysLeft} days</strong> of full access remaining.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Complete each daily mission to get the full Phototheology experience!
            </p>
            <Button
              onClick={() => {
                sessionStorage.setItem("lock_in_pass_token", token || "");
                navigate("/dashboard");
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              Start Day 1 Mission <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Lock-In Pass Unavailable</h1>
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
