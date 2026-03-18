import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift, Heart, Send, ArrowRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { LockInPassCard } from "@/components/LockInPassCard";

export default function GiftAndShare() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO title="Gift the Suite | Phototheology" description="Gift the Phototheology Bible Suite or share a free day pass with someone." />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 px-4 py-2">
            <Heart className="h-3 w-3 mr-1" />
            Pay It Forward
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent mb-4">
            Share the Word
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Gift someone the full Phototheology Bible Suite, or share a free Day Pass so they can experience it firsthand.
          </p>
        </div>

        {cancelled && (
          <Card className="mb-6 border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 text-center text-sm text-destructive">
              Gift checkout was cancelled. No charge was made.
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <GiftSuiteCard user={user} />
          <LockInPassCard />
        </div>
      </div>
    </div>
  );
}

function GiftSuiteCard({ user }: { user: any }) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [planType, setPlanType] = useState<"essential_monthly" | "essential_annual">("essential_monthly");
  const [loading, setLoading] = useState(false);

  const handleGift = async () => {
    if (!user) {
      toast.error("Please sign in to gift the Suite");
      return;
    }
    if (!recipientEmail) {
      toast.error("Please enter the recipient's email");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-gift-checkout", {
        body: { plan_type: planType, recipient_email: recipientEmail, personal_message: message },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start gift checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-rose-500/5 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 w-fit">
          <Gift className="h-8 w-8 text-amber-500" />
        </div>
        <CardTitle className="text-2xl">Gift the Suite</CardTitle>
        <CardDescription>
          Purchase the full Phototheology Bible Suite for someone you care about. They'll receive full premium access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={planType === "essential_monthly" ? "default" : "outline"}
            onClick={() => setPlanType("essential_monthly")}
            className="flex-1"
          >
            Monthly — $15
          </Button>
          <Button
            size="sm"
            variant={planType === "essential_annual" ? "default" : "outline"}
            onClick={() => setPlanType("essential_annual")}
            className="flex-1"
          >
            Annual — $150
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Recipient's Email</Label>
          <Input
            type="email"
            placeholder="friend@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Personal Message (optional)</Label>
          <Textarea
            placeholder="Enjoy studying the Word! 🙏"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
          onClick={handleGift}
          disabled={loading || !recipientEmail}
        >
          {loading ? "Preparing..." : (
            <>
              <Gift className="h-4 w-4 mr-2" />
              Send Gift — {planType === "essential_monthly" ? "$15" : "$150"}
            </>
          )}
        </Button>

        {!user && (
          <p className="text-xs text-muted-foreground text-center">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to send a gift
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DayPassCard({ user }: { user: any }) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateDayPass = async () => {
    if (!user) {
      toast.error("Please sign in to create a Day Pass");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("day_passes")
        .insert({ created_by: user.id })
        .select("pass_token")
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/day-pass/${data.pass_token}`;
      setShareLink(link);
      toast.success("Day Pass created! Share the link below.");
    } catch (err: any) {
      toast.error(err.message || "Failed to create Day Pass");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    }
  };

  return (
    <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-fit">
          <Share2 className="h-8 w-8 text-blue-500" />
        </div>
        <CardTitle className="text-2xl">Free Day Pass</CardTitle>
        <CardDescription>
          Share a free 24-hour pass. Recipients get full access with up to 3 audio commentaries. One per person.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>24-hour full access</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-blue-400" />
            <span>3 audio commentary plays included</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>All study tools & AI features</span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-blue-400" />
            <span>One day pass per recipient — ever</span>
          </div>
        </div>

        {!shareLink ? (
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            onClick={handleCreateDayPass}
            disabled={loading}
          >
            {loading ? "Creating..." : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Day Pass Link
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input readOnly value={shareLink} className="text-xs" />
              <Button size="icon" variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShareLink(null)}
            >
              <Send className="h-4 w-4 mr-2" />
              Create Another Pass
            </Button>
          </div>
        )}

        {!user && (
          <p className="text-xs text-muted-foreground text-center">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to create a Day Pass
          </p>
        )}
      </CardContent>
    </Card>
  );
}
