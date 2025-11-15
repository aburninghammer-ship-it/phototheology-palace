import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, Instagram } from "lucide-react";
import { toast } from "sonner";

interface SocialShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "button" | "dropdown" | "dialog";
  size?: "sm" | "default" | "lg" | "icon";
  buttonText?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  title,
  description,
  url,
  className,
  variant = "dropdown",
  size = "default",
  buttonText = "Share",
}) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareText = description 
    ? `${title}\n\n${description}\n\n${shareUrl}`
    : `${title}\n\n${shareUrl}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };
  
  const shareToFacebook = async () => {
    // Try native share first (works best on mobile and avoids Facebook blocking)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall through to copy if user cancels
      }
    }
    
    // Fallback: Copy link and notify user to paste in Facebook
    await copyToClipboard();
    toast.info("Link copied! Paste it into Facebook to share.");
  };
  
  const shareToLinkedIn = async () => {
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall through to copy if user cancels
      }
    }
    
    // Fallback: Copy link and notify user
    await copyToClipboard();
    toast.info("Link copied! Paste it into LinkedIn to share.");
  };

  const shareToInstagram = async () => {
    // Instagram only works with native share on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall through to copy if user cancels
      }
    }
    
    // Fallback: Copy link and notify user
    await copyToClipboard();
    toast.info("Link copied! Instagram only supports sharing on mobile - paste the link in your Instagram story or bio.");
  };

  const shareViaEmail = () => {
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      copyToClipboard();
    }
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={shareToTwitter}>
            <Twitter className="h-4 w-4 mr-2" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook}>
            <Facebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToLinkedIn}>
            <Linkedin className="h-4 w-4 mr-2" />
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToInstagram}>
            <Instagram className="h-4 w-4 mr-2" />
            Share on Instagram
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={shareViaEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "dialog") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size={size} className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={shareToTwitter}
                className="w-full"
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={shareToFacebook}
                className="w-full"
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={shareToLinkedIn}
                className="w-full"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={shareToInstagram}
                className="w-full"
                title="Share on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="w-full"
                title="Share via Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Simple button variant (uses native share if available, otherwise copies link)
  return (
    <Button 
      variant="outline" 
      size={size} 
      className={className}
      onClick={handleNativeShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
};
