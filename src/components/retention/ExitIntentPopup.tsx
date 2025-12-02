import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only show for anonymous users
    if (user) return;

    // Check if already dismissed
    const dismissed = localStorage.getItem("exit_intent_dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of page
      if (e.clientY <= 0 && !open) {
        setOpen(true);
        // Track the event
        supabase.from("user_events").insert({
          user_id: null,
          event_type: "exit_intent_triggered",
          page_path: window.location.pathname,
        });
      }
    };

    // Delay adding listener to avoid immediate trigger
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [user, open]);

  const handleDismiss = () => {
    localStorage.setItem("exit_intent_dismissed", "true");
    setOpen(false);
  };

  const handleTryDemo = () => {
    localStorage.setItem("exit_intent_dismissed", "true");
    setOpen(false);
    navigate("/interactive-demo");
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Store the email for follow-up
      await supabase.from("user_events").insert({
        user_id: null,
        event_type: "exit_intent_email_capture",
        event_data: { email },
        page_path: window.location.pathname,
      });

      toast.success("Thanks! We'll send you tips to get started.");
      localStorage.setItem("exit_intent_dismissed", "true");
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Wait! Try our free demo first
          </DialogTitle>
          <DialogDescription className="text-center">
            Experience the Memory Palace method in just 60 seconds — no signup required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            size="lg"
            className="w-full gradient-palace"
            onClick={handleTryDemo}
          >
            Try Interactive Demo
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or get tips by email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitEmail} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? "..." : "Send"}
            </Button>
          </form>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            No thanks, I'll leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
