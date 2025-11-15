import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Facebook, Twitter, Linkedin, Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface EnhancedSocialShareProps {
  title: string;
  content: string;
  url: string;
  defaultMessage?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export const EnhancedSocialShare = ({
  title,
  content,
  url,
  defaultMessage,
  buttonText = "Share",
  buttonVariant = "outline"
}: EnhancedSocialShareProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(defaultMessage || `${title}\n\n${content}`);
  const [posting, setPosting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: connections } = useQuery({
    queryKey: ['social-connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && open,
  });

  const isConnected = (platform: string) => {
    return connections?.some(c => c.platform === platform);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${customMessage}\n\n${url}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handlePost = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!user) {
      toast.error("Please sign in to share");
      return;
    }

    if (!isConnected(platform)) {
      toast.error(`Please connect your ${platform} account first in Profile Settings`);
      return;
    }

    setPosting(platform);

    try {
      const { error } = await supabase.functions.invoke('post-to-social', {
        body: {
          platform,
          content: customMessage,
          url,
        }
      });

      if (error) throw error;

      toast.success(`Posted to ${platform} successfully!`);
      setOpen(false);
    } catch (error: any) {
      console.error(`Error posting to ${platform}:`, error);
      toast.error(error.message || `Failed to post to ${platform}`);
    } finally {
      setPosting(null);
    }
  };

  const handleNativeShare = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    // Try Web Share API first (most reliable)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: customMessage,
          url: url,
        });
        toast.success("Shared successfully!");
        return;
      } catch (error) {
        // User cancelled or share failed, continue to fallback
        if ((error as Error).name !== 'AbortError') {
          console.error('Web Share API error:', error);
        }
      }
    }

    // Fallback: Copy to clipboard and show platform-specific instructions
    try {
      await navigator.clipboard.writeText(`${customMessage}\n\n${url}`);
      const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
      toast.success(`Link copied! Open ${platformName} to paste and share.`);
    } catch (error) {
      toast.error("Unable to share. Please copy the link manually.");
    }
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
            Customize your message and share to your connected social accounts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Your Message</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Message
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              placeholder="Add your thoughts..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              💡 Tip: Click "Copy Message" then paste into your social post
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Share To</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleNativeShare('facebook')}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleNativeShare('twitter')}
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleNativeShare('linkedin')}
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
            </div>
            
            {!user && (
              <p className="text-xs text-muted-foreground mt-2">
                Sign in to connect social accounts for direct posting
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
