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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Share2, Twitter, Facebook, Copy, Check, Mail, ExternalLink, Download, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getShareUrl } from "@/lib/utils";

interface WatchQuickShareProps {
  title: string;
  scripture: string;
  watchType: "morning" | "night";
  dayNumber: number;
  tractName: string;
  /** Called to generate audio on demand — returns audio URL or null */
  onGenerateAudio?: () => Promise<string | null>;
}

const SUITE_URL = "https://phototheologybible.com";
const INVITATION = `\n\n🏛️ Experience PhototheologyOS — the Art of Seeing Christ in All Things.\n🔗 ${SUITE_URL}`;

export function WatchQuickShare({
  title,
  scripture,
  watchType,
  dayNumber,
  tractName,
  onGenerateAudio,
}: WatchQuickShareProps) {
  const [copied, setCopied] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
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

  const generateAudioThenAct = async (action: "download" | "share") => {
    if (!onGenerateAudio) return;
    setAudioLoading(true);
    toast.info("Generating audio… this may take a moment");
    try {
      const audioUrl = await onGenerateAudio();
      if (!audioUrl) throw new Error("No audio generated");

      if (action === "download") {
        // Download as MP3
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Audio downloaded!");
      } else {
        // Native share with audio file
        if (navigator.share) {
          const response = await fetch(audioUrl);
          const blob = await response.blob();
          const file = new File([blob], `${title.replace(/[^a-z0-9]/gi, "_")}.mp3`, { type: "audio/mpeg" });
          const shareData = { title, text: shareText, files: [file] };
          if (navigator.canShare?.(shareData)) {
            await navigator.share(shareData);
            toast.success("Audio shared!");
            return;
          }
        }
        // Fallback: copy the audio link
        await navigator.clipboard.writeText(audioUrl);
        toast.success("Audio link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error("Audio share error:", err);
      toast.error("Could not generate audio. Try playing the session first.");
    } finally {
      setAudioLoading(false);
    }
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
      <DropdownMenuContent align="end" className="w-52" onClick={(e) => e.stopPropagation()}>
        {/* Audio sharing options */}
        {onGenerateAudio && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Audio</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => generateAudioThenAct("download")}
              disabled={audioLoading}
              className="gap-2"
            >
              {audioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download MP3
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => generateAudioThenAct("share")}
              disabled={audioLoading}
              className="gap-2"
            >
              {audioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              Send Audio File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Social sharing */}
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Share</DropdownMenuLabel>
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
