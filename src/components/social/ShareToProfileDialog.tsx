import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useShareToProfile } from "@/hooks/useShareToProfile";
import { SharedContentCard } from "./SharedContentCard";
import { toast } from "sonner";
import type { SharedContent } from "@/types/sharedContent";

interface ShareToProfileDialogProps {
  sharedContent: SharedContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareToProfileDialog({ sharedContent, open, onOpenChange }: ShareToProfileDialogProps) {
  const [caption, setCaption] = useState("");
  const { shareToProfile, sharing } = useShareToProfile();

  const handleShare = async () => {
    const success = await shareToProfile(sharedContent, caption);
    if (success) {
      toast.success("Shared to your profile!");
      setCaption("");
      onOpenChange(false);
    } else {
      toast.error("Failed to share. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <SharedContentCard sharedContent={sharedContent} />
          <Textarea
            placeholder="Add a caption (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button onClick={handleShare} disabled={sharing} className="w-full gap-2">
            {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Share to Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
