import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Mail,
  Loader2,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

interface ShareChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: {
    id: string;
    title: string;
    theme: string;
    anchor_passage: string;
  };
}

export function ShareChallengeDialog({
  open,
  onOpenChange,
  challenge,
}: ShareChallengeDialogProps) {
  const { user } = useAuth();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    if (!user) {
      // For non-logged-in users, use direct link
      return `${window.location.origin}/weekly-challenge`;
    }

    setLoading(true);
    try {
      // @ts-ignore - RPC exists but types not synced
      const { data, error } = await supabase.rpc("create_challenge_share", {
        p_challenge_id: challenge.id,
      });

      if (error) throw error;

      const shareCode = typeof data === 'object' && data !== null ? (data as any).share_code : data;
      const url = `${window.location.origin}/weekly-challenge?ref=${shareCode}`;
      setShareUrl(url);
      return url;
    } catch (err) {
      console.error("Error creating share:", err);
      // Fallback to direct link
      return `${window.location.origin}/weekly-challenge`;
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const url = shareUrl || (await generateShareLink());
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = async () => {
    const url = shareUrl || (await generateShareLink());
    const text = `Join me in this week's Bible study challenge: "${challenge.title}" - ${challenge.anchor_passage}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToFacebook = async () => {
    const url = shareUrl || (await generateShareLink());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToWhatsApp = async () => {
    const url = shareUrl || (await generateShareLink());
    const text = `Join me in this week's Bible study challenge: "${challenge.title}" - ${challenge.anchor_passage}. Study together at: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareByEmail = async () => {
    const url = shareUrl || (await generateShareLink());
    const subject = `Bible Study Challenge: ${challenge.title}`;
    const body = `I'm participating in a weekly Bible study challenge and thought you might enjoy it!\n\nThis week's challenge: "${challenge.title}"\nPassage: ${challenge.anchor_passage}\nTheme: ${challenge.theme}\n\nYou can share your thoughts even without an account. Join here:\n${url}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
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
            Invite friends to study alongside you. They can contribute thoughts even without an account!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Challenge Preview */}
          <div className="p-3 rounded-lg bg-muted">
            <p className="font-medium text-sm">{challenge.title}</p>
            <p className="text-xs text-muted-foreground">{challenge.anchor_passage}</p>
          </div>

          {/* Referral Benefit */}
          {user && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <Gift className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-700 dark:text-green-400">
                Earn 25 XP for each friend who signs up through your link!
              </p>
            </div>
          )}

          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareUrl || `${window.location.origin}/weekly-challenge`}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <Label>Share on</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={shareToTwitter}
              >
                <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={shareToFacebook}
              >
                <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={shareToWhatsApp}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-[#25D366]" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={shareByEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* What They'll See */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            <p>Friends can:</p>
            <div className="flex justify-center gap-4 mt-1">
              <Badge variant="outline" className="text-xs">View challenge</Badge>
              <Badge variant="outline" className="text-xs">Share thoughts</Badge>
              <Badge variant="outline" className="text-xs">Join free</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
