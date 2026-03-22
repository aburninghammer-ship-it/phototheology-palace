import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Facebook, Twitter, Linkedin, Copy, Check, Mail } from "lucide-react";
import { toast } from "sonner";

interface EnhancedSocialShareProps {
  title: string;
  content: string;
  url: string;
  defaultMessage?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

const openIntent = (intentUrl: string) => {
  window.open(intentUrl, "_blank", "noopener,noreferrer,width=600,height=500");
};

export const EnhancedSocialShare = ({
  title,
  content,
  url,
  defaultMessage,
  buttonText = "Share",
  buttonVariant = "outline"
}: EnhancedSocialShareProps) => {
  const [open, setOpen] = useState(false);
  const suiteUrl = "https://phototheologybible.com";
  // Ensure we always share the production URL, not dev/supabase URLs
  const shareUrl = url.includes('phototheologybible.com') ? url : url.replace(/https?:\/\/[^/]+/, suiteUrl);
  const [customMessage, setCustomMessage] = useState(defaultMessage || `${title}\n\n${content}\n\n— Shared from Phototheology Palace\n✨ Explore more: ${suiteUrl}`);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${customMessage}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleTwitter = () => {
    openIntent(`https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(shareUrl)}`);
  };

  const handleFacebook = () => {
    openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(customMessage)}`);
  };

  const handleLinkedIn = () => {
    openIntent(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${customMessage}\n\n${shareUrl}`)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="gap-2">
          <Share2 className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share {title}</DialogTitle>
          <DialogDescription>
            Customize your message, then share to any platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Your Message</label>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-2">
                {copied ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
              </Button>
            </div>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              placeholder="Add your thoughts..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <input type="text" value={shareUrl} readOnly className="w-full px-3 py-2 text-sm border rounded-md bg-muted" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Share To</label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2" onClick={handleTwitter}>
                <Twitter className="h-4 w-4 text-sky-500" /> X / Twitter
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleFacebook}>
                <Facebook className="h-4 w-4 text-blue-600" /> Facebook
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleLinkedIn}>
                <Linkedin className="h-4 w-4 text-blue-700" /> LinkedIn
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleEmail}>
                <Mail className="h-4 w-4" /> Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
