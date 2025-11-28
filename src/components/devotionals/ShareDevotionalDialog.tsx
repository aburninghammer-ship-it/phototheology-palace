import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Download, Check, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DevotionalDay, DevotionalPlan } from "@/hooks/useDevotionals";

interface ShareDevotionalDialogProps {
  plan: DevotionalPlan;
  day?: DevotionalDay;
  trigger?: React.ReactNode;
}

export const ShareDevotionalDialog = ({ plan, day, trigger }: ShareDevotionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/devotionals/${plan.id}`;

  const getShareContent = () => {
    if (day) {
      return `📖 ${day.title}\n\n${day.scripture_reference}\n"${day.scripture_text}"\n\n✨ ${day.christ_connection}\n\nFrom: ${plan.title}`;
    }
    return `📘 ${plan.title}\n\nA ${plan.duration}-day devotional journey on: ${plan.theme}\n\nFormat: ${plan.format}\n\nJoin me on this spiritual journey!`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(getShareContent());
    toast({
      title: "Content Copied",
      description: "Devotional content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const content = day
      ? `${day.title}\n\n${day.scripture_reference}\n${day.scripture_text}\n\nVisual Imagery:\n${day.visual_imagery}\n\nApplication:\n${day.application}\n\nChrist Connection:\n${day.christ_connection}\n\nPrayer:\n${day.prayer}\n\nChallenge:\n${day.challenge}`
      : `${plan.title}\n\nTheme: ${plan.theme}\nDuration: ${plan.duration} days\nFormat: ${plan.format}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(day?.title || plan.title).replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Devotional saved as text file",
    });
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(day ? day.title : plan.title);
    const body = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareViaSMS = () => {
    const text = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`sms:?body=${text}`);
  };

  const handleOpen = () => setOpen(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={handleOpen} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-gradient-to-br from-background via-background to-purple-50/50 dark:to-purple-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            Share {day ? "Today's Devotion" : "Devotional"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 line-clamp-3">
              {day ? day.title : plan.title}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              {day ? day.scripture_reference : `${plan.duration}-day journey on ${plan.theme}`}
            </p>
          </div>

          {/* Share Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-muted/50" />
              <Button onClick={handleCopyLink} size="icon" variant="secondary">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleShareViaEmail} variant="outline" className="gap-2 border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-950">
              <Mail className="w-4 h-4 text-amber-600" />
              Email
            </Button>
            <Button onClick={handleShareViaSMS} variant="outline" className="gap-2 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Text
            </Button>
          </div>

          {/* Other Options */}
          <div className="space-y-2 pt-2 border-t">
            <Button onClick={handleCopyContent} variant="ghost" className="w-full justify-start gap-2">
              <Copy className="w-4 h-4" />
              Copy Content
            </Button>
            <Button onClick={handleDownload} variant="ghost" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Download as Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

