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
import { Share2, Copy, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareStudyDialogProps {
  title: string;
  content: string;
}

export const ShareStudyDialog = ({ title, content }: ShareStudyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/my-studies`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleCopyStudy = () => {
    const fullText = `${title}\n\n${content}`;
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Study Copied",
      description: "Study content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([`${title}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Study Downloaded",
      description: "Study saved as text file",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Study</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly />
              <Button onClick={handleCopyLink} size="icon">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Share this link to your My Studies page
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleCopyStudy} variant="outline" className="w-full gap-2">
              <Copy className="w-4 h-4" />
              Copy Study Content
            </Button>
            <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Download as Text File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
