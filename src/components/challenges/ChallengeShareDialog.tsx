import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChallengeShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equation: {
    verse: string;
    equation: string;
    symbols: string[];
    explanation: string;
  };
  difficulty: string;
}

export const ChallengeShareDialog = ({
  open,
  onOpenChange,
  equation,
  difficulty,
}: ChallengeShareDialogProps) => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const sharePreviewBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/challenge-share-preview`;
  const challengeInstructions = "Decode what each symbol means, explain how the parts connect, and show the Christ-centered insight the full equation reveals.";
  const challengeBody = [
    "🧮 Equation Challenge",
    `Verse: ${equation.verse}`,
    `Difficulty: ${difficulty}`,
    `Equation: ${equation.equation}`,
    equation.symbols.length > 0 ? `Symbols: ${equation.symbols.join(", ")}` : null,
    equation.explanation ? `What it is teaching: ${equation.explanation}` : null,
    `What to do: ${challengeInstructions}`,
  ].filter(Boolean).join("\n\n");

  const copySharePostToClipboard = async (url: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${buildSocialShareUrl(url)}`);
      toast.success(successMessage);
    } catch (error) {
      console.error("Clipboard error:", error);
      toast.error("Couldn't copy the challenge text");
    }
  };

  const buildSocialShareUrl = (url: string) => {
    const sharePath = new URL(url).pathname;

    return `${sharePreviewBaseUrl}?${new URLSearchParams({
      title: `🧮 ${equation.verse}`.slice(0, 120),
      description: [
        `Equation: ${equation.equation}`,
        `Difficulty: ${difficulty}`,
        equation.symbols.length > 0 ? `Symbols: ${equation.symbols.join(", ")}` : null,
      ].filter(Boolean).join(" • ").slice(0, 240),
      content: challengeBody.slice(0, 2200),
      instructions: challengeInstructions,
      path: sharePath,
      badge: "Equation Challenge",
    }).toString()}`;
  };

  const saveAndGetShareUrl = async (): Promise<string> => {
    if (!user) {
      toast.error("Please sign in to share challenges");
      return "";
    }

    setSharing(true);
    try {
      const { data: codeData } = await supabase.rpc("generate_challenge_share_code");
      const shareCode = codeData || `EQ${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.from("equation_challenges").insert({
        created_by: user.id,
        verse: equation.verse,
        equation: equation.equation,
        symbols: equation.symbols,
        explanation: equation.explanation,
        difficulty,
        title: `Equation Challenge: ${equation.verse}`,
        share_code: shareCode,
        is_public: true,
      });

      if (error) throw error;

      const url = `https://phototheology-palace.lovable.app/challenge/${shareCode}`;
      setShareUrl(url);

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || "A student";

      await supabase.from("community_posts").insert({
        user_id: user.id,
        title: `🧮 ${displayName} shared: Equation Challenge on ${equation.verse}`,
        content: `${challengeBody}\n\n💡 Equation Challenges teach people to decode Bible study principles in symbolic form.\n\nOpen it in the suite: ${url}`,
        category: "challenge",
      });

      toast.success("Challenge saved & shared to community!");
      return url;
    } catch (err) {
      console.error("Error sharing:", err);
      toast.error("Failed to share challenge");
      return "";
    } finally {
      setSharing(false);
    }
  };

  const ensureShareUrl = async () => {
    if (shareUrl) return shareUrl;
    return await saveAndGetShareUrl();
  };

  const shareText = `${challengeBody}\n\n💡 Equation Challenges encode Bible study principles into symbolic equations using the Phototheology Palace method — a visual system for deep, Christ-centered Bible study across 8 "floors" of learning.\n\n✨ Try it free on Phototheology Palace!`;

  const copyLink = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    await copySharePostToClipboard(url, "Challenge copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(buildSocialShareUrl(url))}`, "_blank", "width=600,height=400");
  };

  const shareToFacebook = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    await copySharePostToClipboard(url, "Challenge copied — paste it into Facebook after the preview loads.");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildSocialShareUrl(url))}`, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    await copySharePostToClipboard(url, "Challenge copied — paste it into LinkedIn after the preview loads.");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildSocialShareUrl(url))}`, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    const text = `${shareText}\n\n${buildSocialShareUrl(url)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaEmail = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    const subject = `Can you decode this Phototheology Equation? - ${equation.verse}`;
    const body = `${shareText}\n\n${buildSocialShareUrl(url)}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share This Challenge
          </DialogTitle>
          <DialogDescription>
            Challenge your friends and church group to decode this equation!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-mono font-semibold">{equation.equation}</p>
            <p className="text-muted-foreground mt-1">{equation.verse} • {difficulty}</p>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={shareToTwitter} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              <Twitter className="h-5 w-5" />
              <span className="text-xs">X / Twitter</span>
            </Button>
            <Button variant="outline" onClick={shareToFacebook} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              <Facebook className="h-5 w-5" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button variant="outline" onClick={shareToWhatsApp} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button variant="outline" onClick={shareToLinkedIn} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              <Linkedin className="h-5 w-5" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button variant="outline" onClick={shareViaEmail} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              <Mail className="h-5 w-5" />
              <span className="text-xs">Email</span>
            </Button>
            <Button variant="outline" onClick={copyLink} disabled={sharing} className="flex flex-col items-center gap-1 h-auto py-3">
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              <span className="text-xs">{copied ? "Copied!" : "Copy Post"}</span>
            </Button>
          </div>

          {shareUrl && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ Challenge saved & posted to community
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
