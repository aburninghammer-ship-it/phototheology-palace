import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, BookOpen, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("exitIntentShown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown) {
        setOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // Trigger the PDF download
    const link = document.createElement('a');
    link.href = '/guides/phototheology-starter-guide.pdf';
    link.download = 'Phototheology-Starter-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started!",
      description: "Your free Phototheology starter guide is downloading now.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Gift className="h-8 w-8 text-white" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Wait! Free Gift Inside</DialogTitle>
          </DialogHeader>
          
          <p className="text-muted-foreground">
            Get our <span className="font-semibold text-foreground">Free Phototheology Starter Guide</span> - 
            learn the basics of the Palace method in just 15 minutes.
          </p>

          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>10 Pages</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Instant PDF</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              Send Me the Free Guide
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
