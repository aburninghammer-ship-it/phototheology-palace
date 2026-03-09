import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SHARE_SOURCE_CONFIG } from "@/types/sharedContent";
import type { SharedContent } from "@/types/sharedContent";

interface ShareToSocialDialogProps {
  sharedContent: SharedContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SOCIAL_PLATFORMS = [
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: "𝕏",
    buildUrl: (text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "f",
    buildUrl: (text: string) =>
      `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    buildUrl: (text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈️",
    buildUrl: (text: string) =>
      `https://t.me/share/url?text=${encodeURIComponent(text)}`,
  },
] as const;

const SUITE_URL = "https://phototheologybible.com";

function buildShareText(content: SharedContent, caption: string): string {
  const config = SHARE_SOURCE_CONFIG[content.source_type];
  const parts: string[] = [];

  if (caption) parts.push(caption);
  parts.push(`📖 ${config.label}: ${content.source_title}`);
  if (content.source_excerpt) parts.push(content.source_excerpt.slice(0, 200));
  if (content.verse_reference) parts.push(`🔖 ${content.verse_reference}`);
  parts.push(`\n— Shared from Phototheology Palace\n✨ Explore more: ${SUITE_URL}`);

  return parts.join("\n\n");
}

export function ShareToSocialDialog({ sharedContent, open, onOpenChange }: ShareToSocialDialogProps) {
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);

  const config = SHARE_SOURCE_CONFIG[sharedContent.source_type];
  const shareText = buildShareText(sharedContent, caption);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sharedContent.source_title,
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const handlePlatformShare = (buildUrl: (text: string) => string) => {
    window.open(buildUrl(shareText), "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Preview */}
          <div className="border border-border/50 bg-muted/30 rounded-lg p-3 space-y-2">
            <Badge variant="outline" className={`text-[10px] ${config.badgeClass}`}>
              {config.label}
            </Badge>
            <h5 className="font-medium text-sm">{sharedContent.source_title}</h5>
            <p className="text-xs text-muted-foreground line-clamp-2">{sharedContent.source_excerpt}</p>
          </div>

          {/* Caption */}
          <Textarea
            placeholder="Add a personal message (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            className="resize-none"
          />

          {/* Social Platform Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <Button
                key={platform.id}
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
                onClick={() => handlePlatformShare(platform.buildUrl)}
              >
                <span className="w-5 text-center text-sm">{platform.icon}</span>
                {platform.label}
              </Button>
            ))}
          </div>

          {/* Utility Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            {typeof navigator.share === "function" && (
              <Button variant="default" className="flex-1 gap-2" onClick={handleNativeShare}>
                <ExternalLink className="h-4 w-4" />
                More...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
