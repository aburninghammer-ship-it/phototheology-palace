/**
 * WatchQuickShare — Small share button for watch session cards (before playing)
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Twitter, Facebook, Copy, Check, Mail, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getShareUrl } from "@/lib/utils";

interface WatchQuickShareProps {
  title: string;
  scripture: string;
  watchType: "morning" | "night";
  dayNumber: number;
  tractName: string;
}

const SUITE_URL = "https://phototheologybible.com";
const INVITATION = `\n\n🏛️ Experience PhototheologyOS — the Art of Seeing Christ in All Things.\n🔗 ${SUITE_URL}`;

export function WatchQuickShare({
  title,
  scripture,
  watchType,
  dayNumber,
  tractName,
}: WatchQuickShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(watchType === "morning" ? "/morning-watches" : "/night-watches");
  const emoji = watchType === "morning" ? "🌅" : "🌙";

  const shareText = `${emoji} ${title}\n📖 ${scripture}\n📅 ${tractName} — Day ${dayNumber}\n\n— Shared from Phototheology Palace\n#Phototheology #BibleStudy${INVITATION}`;

  const openIntent = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    handleCopy();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => e.stopPropagation()}
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => openIntent(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)} className="gap-2">
          <Twitter className="h-4 w-4" /> X / Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`)} className="gap-2">
          <Facebook className="h-4 w-4" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`; }} className="gap-2">
          <Mail className="h-4 w-4" /> Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
          <ExternalLink className="h-4 w-4" /> Share via…
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Text"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
