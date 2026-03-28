import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLockInMonthlyUsage } from "@/hooks/useLockInPass";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Flame, Copy, Check, Send, Sparkles, Star, BookOpen, Trophy, Headphones } from "lucide-react";
import { Link } from "react-router-dom";

export function LockInPassCard() {
  const { user } = useAuth();
  const { passesRemaining, loading: usageLoading } = useLockInMonthlyUsage();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");

  const handleCreate = async () => {
    if (!user) {
      toast.error("Please sign in to create a Lock-In Pass");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("create_lock_in_pass", {
        _personal_message: personalMessage || null,
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        const prodOrigin = window.location.hostname.includes('lovable') || window.location.hostname === 'localhost'
          ? 'https://phototheologybible.com'
          : window.location.origin;
        const link = `${prodOrigin}/lock-in/${result.pass_token}`;
        setShareLink(link);
        toast.success(`Lock-In Pass created! ${result.passes_remaining} remaining this month.`);
      } else {
        toast.error(result?.error || "Failed to create pass");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create Lock-In Pass");
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

  const shareNative = () => {
    if (shareLink && navigator.share) {
      navigator.share({
        title: "Phototheology Lock-In Pass",
        text: personalMessage || "Check out PhototheologyOS — 5 days free!",
        url: shareLink,
      });
    }
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-fit">
          <Flame className="h-8 w-8 text-amber-500" />
        </div>
        <CardTitle className="text-2xl">Lock-In Pass</CardTitle>
        <CardDescription>
          Share a free 5-Day Lock-In Pass. Recipients get full suite access with guided daily missions.
        </CardDescription>
        {!usageLoading && (
          <Badge variant="outline" className="mx-auto mt-2 text-amber-600 border-amber-500/30">
            {passesRemaining} of 5 passes remaining this month
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>5 days of full suite access</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span>Guided daily missions for transformation</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>All study tools, AI, and Bible features</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-purple-400" />
            <span>One Audio Commentary Suite chapter (replayable!)</span>
          </div>
        </div>

        {!shareLink ? (
          <>
            <div className="space-y-2">
              <Label>Personal Message (optional)</Label>
              <Textarea
                placeholder="Hey! Check out this Bible study tool — it changed how I study Scripture 🙏"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                rows={2}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={handleCreate}
              disabled={loading || passesRemaining <= 0}
            >
              {loading ? (
                "Creating..."
              ) : passesRemaining <= 0 ? (
                "No passes left this month"
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate Lock-In Pass
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input readOnly value={shareLink} className="text-xs" />
              <Button size="icon" variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button
                variant="outline"
                className="w-full border-amber-500/30 text-amber-600"
                onClick={shareNative}
              >
                <Send className="h-4 w-4 mr-2" />
                Share via...
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShareLink(null);
                setPersonalMessage("");
              }}
            >
              Create Another Pass
            </Button>
          </div>
        )}

        {!user && (
          <p className="text-xs text-muted-foreground text-center">
            <Link to="/auth" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to create a Lock-In Pass
          </p>
        )}
      </CardContent>
    </Card>
  );
}
