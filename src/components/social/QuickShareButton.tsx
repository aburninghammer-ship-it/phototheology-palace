import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Facebook, Twitter, Linkedin, Copy, Check, ExternalLink, Mail } from "lucide-react";
import { toast } from "sonner";

interface QuickShareButtonProps {
  title: string;
  content: string;
  url?: string;
  type?: "gem" | "achievement" | "study" | "insight" | "challenge";
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
}

const openIntent = (intentUrl: string) => {
  window.open(intentUrl, "_blank", "noopener,noreferrer,width=600,height=500");
};

export const QuickShareButton = ({
  title,
  content,
  url,
  type = "insight",
  size = "sm",
  variant = "outline"
}: QuickShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const suiteUrl = "https://phototheologybible.com";
  const shareUrl = url || window.location.href;
  const shareText = `${content}\n\n#Phototheology #BibleStudy\n✨ Explore more: ${suiteUrl}`;

  const handleTwitter = () => {
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    openIntent(intentUrl);
  };

  const handleFacebook = () => {
    const intentUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    openIntent(intentUrl);
  };

  const handleLinkedIn = () => {
    const intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    openIntent(intentUrl);
  };

  const handleEmail = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.location.href = mailUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        toast.success("Shared successfully!");
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${content}\n\n— Shared from Phototheology Palace\n✨ Explore more: ${suiteUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = { gem: "Gem", achievement: "Achievement", study: "Study", challenge: "Challenge" };
    return labels[type] || "Insight";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          {size !== "icon" && <span className="hidden sm:inline">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Share this {getTypeLabel()}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleTwitter} className="gap-2">
          <Twitter className="h-4 w-4 text-sky-500" />
          Share on X / Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFacebook} className="gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLinkedIn} className="gap-2">
          <Linkedin className="h-4 w-4 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEmail} className="gap-2">
          <Mail className="h-4 w-4" />
          Share via Email
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Share via…
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
