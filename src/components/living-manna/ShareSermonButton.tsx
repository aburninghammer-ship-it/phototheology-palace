import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Check,
  Copy,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ShareSermonButtonProps {
  title: string;
  speaker?: string;
  summary?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ShareSermonButton({
  title,
  speaker,
  summary,
  youtubeUrl,
  thumbnailUrl,
  variant = "outline",
  size = "sm",
}: ShareSermonButtonProps) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: `Check out this sermon: ${title}`,
    message: "",
  });

  // Generate the share URL (could be the YouTube URL or app URL)
  const shareUrl = youtubeUrl || window.location.href;
  const phototheologyUrl = "https://phototheologybible.com";
  const promoNote = "Want to dig deeper? Check out PhototheologyOS at phototheologybible.com";

  // Generate share text
  const shareText = speaker
    ? `"${title}" by ${speaker} - An incredible sermon!`
    : `"${title}" - An incredible sermon!`;

  const shareTextWithPromo = `${shareText}\n\n${promoNote}`;

  const shareTextWithSummary = summary
    ? `${shareText}\n\n${summary.substring(0, 100)}${summary.length > 100 ? "..." : ""}\n\n${promoNote}`
    : shareTextWithPromo;

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Share to Facebook
  const handleShareFacebook = () => {
    const fbText = `${shareText} Check it out: ${shareUrl}\n\n${promoNote}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fbText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Share to Twitter/X
  const handleShareTwitter = () => {
    // Twitter has character limits, so keep it concise
    const tweetText = `${shareText} Watch: ${shareUrl}\n\nDig deeper at ${phototheologyUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Share to LinkedIn
  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const waText = `${shareText}\n\nWatch here: ${shareUrl}\n\n${promoNote}`;
    const url = `https://wa.me/?text=${encodeURIComponent(waText)}`;
    window.open(url, "_blank");
  };

  // Share via Email
  const handleShareEmail = () => {
    setEmailForm({
      to: "",
      subject: `Check out this sermon: ${title}`,
      message: `Hi!\n\nI wanted to share this amazing sermon with you:\n\n"${title}"${speaker ? ` by ${speaker}` : ""}\n\n${summary ? summary + "\n\n" : ""}Watch it here: ${shareUrl}\n\n---\n${promoNote}\n${phototheologyUrl}\n\nBlessings!`,
    });
    setShowEmailDialog(true);
  };

  // Send email (opens default email client)
  const handleSendEmail = () => {
    const mailtoUrl = `mailto:${emailForm.to}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.message)}`;
    window.location.href = mailtoUrl;
    setShowEmailDialog(false);
    toast.success("Opening email client...");
  };

  // Native share API (for mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${shareText}\n\n${promoNote}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Native share on mobile */}
          {typeof navigator !== "undefined" && navigator.share && (
            <>
              <DropdownMenuItem onClick={handleNativeShare}>
                <Share2 className="h-4 w-4 mr-3" />
                Share...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Social Media */}
          <DropdownMenuItem onClick={handleShareFacebook}>
            <Facebook className="h-4 w-4 mr-3 text-blue-600" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareTwitter}>
            <Twitter className="h-4 w-4 mr-3 text-sky-500" />
            Share on X (Twitter)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareLinkedIn}>
            <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareWhatsApp}>
            <MessageCircle className="h-4 w-4 mr-3 text-green-500" />
            Share on WhatsApp
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Email */}
          <DropdownMenuItem onClick={handleShareEmail}>
            <Mail className="h-4 w-4 mr-3 text-orange-500" />
            Share via Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Copy Link */}
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <Check className="h-4 w-4 mr-3 text-green-500" />
            ) : (
              <Link2 className="h-4 w-4 mr-3" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share via Email</DialogTitle>
            <DialogDescription>
              Customize your message before sharing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Input
                type="email"
                placeholder="recipient@email.com"
                value={emailForm.to}
                onChange={(e) =>
                  setEmailForm((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailForm.subject}
                onChange={(e) =>
                  setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                rows={8}
                value={emailForm.message}
                onChange={(e) =>
                  setEmailForm((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Open Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
