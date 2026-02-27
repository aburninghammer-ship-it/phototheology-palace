import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Download, Share2, Loader2, CheckCircle2, AlertCircle,
  Copy, Check, MessageSquare, Clock
} from "lucide-react";

interface ExportBaptismAudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  lessonTitle: string;
  fundamentalNumber: number;
}

export function ExportBaptismAudioDialog({
  open,
  onOpenChange,
  lessonId,
  lessonTitle,
  fundamentalNumber,
}: ExportBaptismAudioDialogProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check for existing audio when dialog opens
  useEffect(() => {
    if (!open) return;
    checkExistingAudio();
  }, [open, lessonId]);

  const checkExistingAudio = async () => {
    const { data } = await supabase
      .from("baptism_study_audio")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("voice", "nova")
      .eq("status", "ready")
      .maybeSingle();

    if (data?.public_url) {
      setStatus("ready");
      setAudioUrl(data.public_url);
      setShareToken(data.share_token);
      setDuration(data.duration_seconds);
    } else {
      setStatus("idle");
    }
  };

  const generateAudio = async () => {
    setStatus("generating");
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-baptism-audio", {
        body: { lessonId },
      });

      if (error) throw error;

      if (data?.status === "ready") {
        setStatus("ready");
        setAudioUrl(data.audioUrl);
        setShareToken(data.shareToken);
        setDuration(data.durationSeconds);
        toast.success("Audio lesson generated successfully!");
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error("Generate error:", err);
      setStatus("error");
      setErrorMsg(err?.message || "Failed to generate audio");
      toast.error(err?.message || "Failed to generate audio lesson");
    }
  };

  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const filename = `Fundamental-${fundamentalNumber}-${lessonTitle.replace(/\s+/g, "-")}.mp3`;

      // Try native share for mobile
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], filename, { type: "audio/mpeg" })] })) {
        const file = new File([blob], filename, { type: "audio/mpeg" });
        await navigator.share({ files: [file], title: `Lesson ${fundamentalNumber}: ${lessonTitle}` });
        return;
      }

      // Desktop download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Audio downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed");
    }
  };

  const getShareUrl = () => {
    if (!shareToken) return "";
    return `${window.location.origin}/shared/baptism-audio/${shareToken}`;
  };

  const getShareMessage = () => {
    const url = getShareUrl();
    return `📖 Baptism Study #${fundamentalNumber}: ${lessonTitle}\n\n🎧 Listen to this fundamental belief lesson:\n${url}\n\n🏰 Phototheology — Turn your mind into a Bible palace!`;
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast.success("Share link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareViaText = () => {
    const msg = encodeURIComponent(getShareMessage());
    window.open(`sms:?body=${msg}`, "_blank");
  };

  const shareViaWhatsApp = () => {
    const msg = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lesson ${fundamentalNumber}: ${lessonTitle}`,
          text: getShareMessage(),
          url: getShareUrl(),
        });
      } catch {
        // User cancelled
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Share Audio
          </DialogTitle>
          <DialogDescription>
            Fundamental #{fundamentalNumber}: {lessonTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status: Idle - Generate */}
          {status === "idle" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a full 10-15 minute audio lesson with Scripture teaching, suitable for sharing with baptismal candidates.
              </p>
              <Button onClick={generateAudio} className="w-full" size="lg">
                <Loader2 className="h-4 w-4 mr-2 hidden" />
                Generate Audio Lesson
              </Button>
            </div>
          )}

          {/* Status: Generating */}
          {status === "generating" && (
            <div className="text-center space-y-4 py-6">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <div>
                <p className="font-medium">Generating Audio Lesson...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Writing script & converting to speech. This may take 1-2 minutes.
                </p>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {/* Status: Error */}
          {status === "error" && (
            <div className="text-center space-y-4 py-4">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
              <div>
                <p className="font-medium text-destructive">Generation Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{errorMsg}</p>
              </div>
              <Button onClick={generateAudio} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Status: Ready - Download & Share */}
          {status === "ready" && audioUrl && (
            <div className="space-y-4">
              {/* Preview player */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium text-sm">Audio Ready</p>
                    {duration && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{formatDuration(duration)}
                      </p>
                    )}
                  </div>
                </div>
                <audio controls className="w-full" src={audioUrl} preload="none" />
              </div>

              {/* Download */}
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download MP3
              </Button>

              {/* Share section */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share with Candidates
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={copyShareLink}>
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={shareViaText}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Text
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20" onClick={shareViaWhatsApp}>
                    WhatsApp
                  </Button>
                </div>

                {typeof navigator.share === "function" && (
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={shareNative}>
                    <Share2 className="h-4 w-4 mr-2" />
                    More sharing options...
                  </Button>
                )}
              </div>

              {/* Regenerate */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  setStatus("idle");
                  setAudioUrl(null);
                }}
              >
                Regenerate with fresh content
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
