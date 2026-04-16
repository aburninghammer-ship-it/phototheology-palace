import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, MessageCircle, Trophy, Loader2 } from "lucide-react";
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
  const [rating, setRating] = useState(false);
  const [jeevesResult, setJeevesResult] = useState<{
    score: number;
    highlights: string[];
    feedback: string;
  } | null>(null);

  const sharePreviewBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/challenge-share-preview`;
  const targetPath = "/daily-challenges";
  const siteUrl = "https://phototheologybible.com";

  const emoji = challengeType === "chef" ? "🍳" : challengeType === "equation" ? "🧮" : "🔥";
  const typeLabel = challengeType === "chef" ? "Chef Challenge" : challengeType === "equation" ? "Equation Challenge" : "Daily Challenge";

  const challengeExplanation = challengeType === "chef"
    ? "The Chef Challenge gives you random Bible verses as 'ingredients' — your job is to weave them into a mini-sermon or devotional 'recipe.' It's a creative way to practice connecting Scripture!"
    : challengeType === "equation"
    ? "Equation Challenges encode Bible study principles into symbolic equations using the Phototheology Palace method — a visual system for deep, Christ-centered Bible study across 8 'floors' of learning."
    : "Daily Challenges test your Bible knowledge with fresh puzzles each day — from verse matching to thematic connections. Great for building a daily Scripture habit!";

  // Keep the preview URL short — only essential metadata, no full content
  const shortDescription = description.slice(0, 160);
  const shareUrl = `${sharePreviewBaseUrl}?${new URLSearchParams({
    title: `${emoji} ${title}`.slice(0, 120),
    description: shortDescription,
    path: targetPath,
    badge: typeLabel,
  }).toString()}`;

  const contentBlock = content ? `\n\n${content}` : "";
  const shareText = `${emoji} Try this Phototheology ${typeLabel}!\n\n💡 ${challengeExplanation}\n\n📖 ${title}${difficulty ? `\n⚡ Difficulty: ${difficulty}` : ""}${contentBlock}\n\n✨ Try it yourself on PhototheologyOS!\n\n${siteUrl}${targetPath}`;
  const fullSharePost = shareText;

  const copySharePostToClipboard = async (successMessage: string) => {
    try {
      await navigator.clipboard.writeText(fullSharePost);
      toast.success(successMessage);
    } catch (error) {
      console.error("Clipboard error:", error);
      toast.error("Couldn't copy the challenge text");
    }
  };

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
        title: `${emoji} ${displayName} shared: ${title}`,
        content: `${description}${content ? `\n\n${content}` : ""}\n\n💬 Try it yourself on the Challenges tab!`,
        category: "challenge",
      });

      // Rate with Jeeves and save to leaderboard
      if (!jeevesResult) {
        setRating(true);
        try {
          const { data: rateData, error: rateError } = await supabase.functions.invoke("rate-challenge", {
            body: { challengeType, title, description, content, difficulty },
          });
          if (!rateError && rateData) {
            setJeevesResult({
              score: rateData.score,
              highlights: rateData.highlights || [],
              feedback: rateData.feedback || "",
            });
            toast.success(`Jeeves rated your submission: ${rateData.score}/100!`);
          }
        } catch (e) {
          console.error("Rating error:", e);
        } finally {
          setRating(false);
        }
      }

      setShared(true);
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  };

  const copyLink = async () => {
    await postToCommunity();
    await copySharePostToClipboard("Challenge copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = async () => {
    await postToCommunity();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const shareToFacebook = async () => {
    await postToCommunity();
    await copySharePostToClipboard("Challenge copied — paste it into Facebook after the preview loads.");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = async () => {
    await postToCommunity();
    const text = `${shareText}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToLinkedIn = async () => {
    await postToCommunity();
    await copySharePostToClipboard("Challenge copied — paste it into LinkedIn after the preview loads.");
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
              <span className="text-xs">{copied ? "Copied!" : "Copy Post"}</span>
            </Button>
          </div>

          {rating && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Jeeves is rating your submission...
            </div>
          )}

          {jeevesResult && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">Jeeves Score: {jeevesResult.score}/100</span>
              </div>
              {jeevesResult.highlights.length > 0 && (
                <ul className="text-sm space-y-1">
                  {jeevesResult.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              {jeevesResult.feedback && (
                <p className="text-sm italic text-muted-foreground">"{jeevesResult.feedback}"</p>
              )}
              <p className="text-xs text-muted-foreground">Your score is now on the community leaderboard!</p>
            </div>
          )}

          {shared && !jeevesResult && !rating && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ Also posted to Community
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};