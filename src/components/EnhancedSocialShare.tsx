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
    const shareUrl = platform === 'facebook' 
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(customMessage)}`
      : platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(url)}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
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
            <label className="text-sm font-medium mb-2 block">Your Message</label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
              placeholder="Add your thoughts..."
              className="w-full"
            />
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Share To</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => isConnected('facebook') ? handlePost('facebook') : handleNativeShare('facebook')}
                disabled={posting === 'facebook'}
              >
                {posting === 'facebook' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Facebook className="h-4 w-4 text-blue-600" />
                )}
                Facebook
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => isConnected('twitter') ? handlePost('twitter') : handleNativeShare('twitter')}
                disabled={posting === 'twitter'}
              >
                {posting === 'twitter' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Twitter className="h-4 w-4 text-sky-500" />
                )}
                Twitter
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => isConnected('linkedin') ? handlePost('linkedin') : handleNativeShare('linkedin')}
                disabled={posting === 'linkedin'}
              >
                {posting === 'linkedin' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Linkedin className="h-4 w-4 text-blue-700" />
                )}
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
