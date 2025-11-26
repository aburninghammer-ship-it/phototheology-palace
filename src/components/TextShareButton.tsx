import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface TextShareButtonProps {
  type: "challenge" | "equation" | "chef" | "game" | "study" | "verse";
  title: string;
  description?: string;
  data?: Record<string, any>;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const generateShareMessage = (type: string, title: string, description?: string, data?: Record<string, any>): string => {
  const appUrl = window.location.origin;
  
  const messages = {
    challenge: `🎯 Join me in this Phototheology Challenge!\n\n${title}\n${description || ""}\n\n💡 Can you solve it? Let's study the Bible together in a whole new way!\n\n✨ Try it here: ${appUrl}\n\n🎓 Phototheology - Master the Bible through the Palace Method!`,
    
    equation: `🧮 Help me decode this Bible Equation!\n\n${title}\n${description || ""}\n\n🔍 Each symbol represents a deep Biblical truth. Can you figure it out?\n\n✨ Join the challenge: ${appUrl}\n\n📚 Learn Phototheology - The Palace Method for Bible Mastery!`,
    
    chef: `🧑‍🍳 Chef Challenge: Can you cook up a Bible study?\n\n${title}\n\n🎲 I've got ${data?.verseCount || "random"} completely unrelated verses!\n📖 The challenge: Tie them together into ONE meaningful study!\n\n💭 Think you can find the connections?\n\n✨ Try it: ${appUrl}\n\n🏰 Discover Phototheology - Turn your mind into a Bible palace!`,
    
    game: `🎮 Challenge me in this Bible Game!\n\n${title}\n${description || ""}\n\n🏆 Let's see who knows the Word better!\n\n✨ Play now: ${appUrl}\n\n🎯 Phototheology - Making Bible study fun and memorable!`,
    
    study: `📖 Check out this Bible Study I created!\n\n${title}\n${description || ""}\n\n💎 Deep insights using the Phototheology method!\n\n✨ Read it here: ${appUrl}\n\n🏰 Learn the Palace Method for Bible mastery!`,
    
    verse: `✝️ Daily Verse with Deep Analysis\n\n${title}\n\n📚 ${description || ""}\n\n🔍 Studied through 7 floors of the Phototheology Palace!\n\n✨ See the full breakdown: ${appUrl}\n\n💡 Discover how to study the Bible like never before!`
  };

  return messages[type as keyof typeof messages] || `Check out ${title} on Phototheology!\n\n${appUrl}`;
};

export const TextShareButton = ({
  type,
  title,
  description,
  data,
  variant = "outline",
  size = "default",
  className = ""
}: TextShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareMessage = generateShareMessage(type, title, description, data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      toast.success("Message copied! Ready to share with friends!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleSMS = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`sms:?body=${encodedMessage}`, '_blank');
    toast.success("Opening your messaging app...");
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    toast.success("Opening WhatsApp...");
  };

  const getButtonLabel = () => {
    switch (type) {
      case "challenge": return "Share Challenge";
      case "equation": return "Share Equation";
      case "chef": return "Share Recipe";
      case "game": return "Invite Friends";
      case "study": return "Share Study";
      case "verse": return "Share Verse";
      default: return "Share via Text";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <MessageSquare className="h-4 w-4 mr-2" />
          {getButtonLabel()}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-palace-teal" />
            Invite Friends to Phototheology
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2 text-muted-foreground">Preview Message:</p>
            <div className="bg-background p-3 rounded border text-sm whitespace-pre-wrap">
              {shareMessage}
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Copied! Paste anywhere</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Message</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleSMS}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send via SMS</span>
            </Button>

            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full justify-start gap-3"
              style={{ color: "#25D366" }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Send via WhatsApp</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            💡 Share with friends and family to introduce them to Phototheology!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
