/**
 * WatchSharePanel — Share/download panel shown after a watch session recording
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Facebook,
  Twitter,
  Copy,
  Check,
  Mail,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getShareUrl } from "@/lib/utils";
import { AddToPlaylistButton } from "./AddToPlaylistButton";

interface WatchSharePanelProps {
  videoBlob: Blob | null;
  videoUrl: string | null;
  title: string;
  subtitle?: string;
  watchType: "morning" | "night";
  onClose: () => void;
  onDownload: (filename?: string) => void;
}

const SUITE_URL = "https://phototheologybible.com";
const INVITATION = `\n\n🏛️ Experience PhototheologyOS — the Art of Seeing Christ in All Things.\n🔗 ${SUITE_URL}`;

export function WatchSharePanel({
  videoBlob,
  videoUrl,
  title,
  subtitle,
  watchType,
  onClose,
  onDownload,
}: WatchSharePanelProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(watchType === "morning" ? "/morning-watches" : "/night-watches");

  const shareText = `${watchType === "morning" ? "🌅" : "🌙"} ${title}\n\n${subtitle || ""}\n\n— Shared from Phototheology Palace\n#Phototheology #BibleStudy${INVITATION}`;

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyText();
      return;
    }

    const shareData: ShareData = {
      title,
      text: shareText,
      url: shareUrl,
    };

    if (videoBlob && navigator.canShare) {
      const file = new File([videoBlob], `${title.replace(/[^a-z0-9]/gi, "_")}.webm`, {
        type: videoBlob.type,
      });
      const dataWithFile = { ...shareData, files: [file] };
      if (navigator.canShare(dataWithFile)) {
        try {
          await navigator.share(dataWithFile);
          toast.success("Shared successfully!");
          return;
        } catch (e) {
          if ((e as Error).name === "AbortError") return;
        }
      }
    }

    try {
      await navigator.share(shareData);
      toast.success("Shared successfully!");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        handleCopyText();
      }
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const openIntent = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleTwitter = () => {
    openIntent(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
  };

  const handleFacebook = () => {
    openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  };

  const safeFilename = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl border border-border/50 bg-card p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Session Recorded</h3>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Video preview */}
        {videoUrl && (
          <div className="rounded-lg overflow-hidden border border-border/30 bg-black">
            <video
              src={videoUrl}
              controls
              className="w-full max-h-48 object-contain"
              playsInline
            />
          </div>
        )}

        {/* Download + Add to Playlist */}
        <div className="flex gap-2">
          <Button
            onClick={() => onDownload(`${safeFilename}.webm`)}
            className="flex-1 gap-2"
            variant="default"
            disabled={!videoBlob}
          >
            <Download className="h-4 w-4" />
            Download Video
          </Button>
          <AddToPlaylistButton
            title={title}
            description={subtitle}
            audioType={watchType === "morning" ? "morning-watch" : "night-watch"}
            audioMeta={{ watchType, subtitle }}
            variant="secondary"
            size="default"
            showLabel
          />
        </div>

        {/* Social share buttons */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Share to Social Media</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleTwitter}>
              <Twitter className="h-4 w-4 text-primary" />
              X / Twitter
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleFacebook}>
              <Facebook className="h-4 w-4 text-primary" />
              Facebook
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleEmail}>
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyText}>
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
          </div>
        </div>

        {/* Native share (mobile) */}
        {typeof navigator.share === "function" && (
          <Button
            onClick={handleNativeShare}
            className="w-full gap-2"
            variant="secondary"
          >
            <Share2 className="h-4 w-4" />
            Share via…
          </Button>
        )}
      </div>
    </div>
  );
}