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

interface GenericChallengeShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeType: "chef" | "daily" | "equation";
  title: string;
  description: string;
  difficulty?: string;
  content?: string;
}

export const GenericChallengeShareDialog = ({
  open,
  onOpenChange,
  challengeType,
  title,
  description,
  difficulty,
  content,
}: GenericChallengeShareDialogProps) => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);

  const sharePreviewBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/challenge-share-preview`;
  const targetPath = challengeType === "chef" ? "/games/chef-challenge" : "/daily-challenges";

  const emoji = challengeType === "chef" ? "🍳" : challengeType === "equation" ? "🧮" : "🔥";
  const typeLabel = challengeType === "chef" ? "Chef Challenge" : challengeType === "equation" ? "Equation Challenge" : "Daily Challenge";

  const challengeExplanation = challengeType === "chef"
    ? "The Chef Challenge gives you random Bible verses as 'ingredients' — your job is to weave them into a mini-sermon or devotional 'recipe.' It's a creative way to practice connecting Scripture!"
    : challengeType === "equation"
    ? "Equation Challenges encode Bible study principles into symbolic equations using the Phototheology Palace method — a visual system for deep, Christ-centered Bible study across 8 'floors' of learning."
    : "Daily Challenges test your Bible knowledge with fresh puzzles each day — from verse matching to thematic connections. Great for building a daily Scripture habit!";

  const shareUrl = `${sharePreviewBaseUrl}?${new URLSearchParams({
    title: `${emoji} ${title}`.slice(0, 120),
    description: [
      description,
      difficulty ? `Difficulty: ${difficulty}` : null,
      challengeExplanation,
    ]
      .filter(Boolean)
      .join(" • ")
      .slice(0, 240),
    path: targetPath,
    badge: typeLabel,
  }).toString()}`;

  const shareText = `${emoji} I just completed a Phototheology ${typeLabel}!\n\n📖 ${title}${difficulty ? `\n⚡ Difficulty: ${difficulty}` : ""}${content ? `\n\n${content.slice(0, 200)}` : ""}\n\n💡 ${challengeExplanation}\n\n✨ Try it yourself on Phototheology Palace — a free Bible learning suite!`;

  const postToCommunity = async () => {
    if (!user || shared) return;
    setSharing(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || "A student";

      await supabase.from("community_posts").insert({
        user_id: user.id,
        title: `${emoji} ${displayName} completed: ${title}`,
        content: `${description}${content ? `\n\n${content}` : ""}\n\n💬 Try it yourself on the Challenges tab!`,
        category: "challenge",
      });

      setShared(true);
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  };

  const copyLink = async () => {
    await postToCommunity();
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = async () => {
    await postToCommunity();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const shareToFacebook = async () => {
    await postToCommunity();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = async () => {
    await postToCommunity();
    const text = `${shareText}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToLinkedIn = async () => {
    await postToCommunity();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const shareViaEmail = async () => {
    await postToCommunity();
    const subject = `Can you beat my Phototheology ${typeLabel}?`;
    const body = `${shareText}\n\n${shareUrl}`;
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
            Challenge your friends and church group!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-semibold">{emoji} {title}</p>
            {difficulty && <p className="text-muted-foreground mt-1">{difficulty}</p>}
          </div>

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
              <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>

          {shared && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ Also posted to Community
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};