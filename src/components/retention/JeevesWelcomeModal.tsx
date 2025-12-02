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
import { BookOpen, MessageSquare, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function JeevesWelcomeModal() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("friend");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkFirstVisit = async () => {
      if (!user) return;

      // Check if user has dismissed the welcome modal
      const dismissed = localStorage.getItem(`jeeves_welcome_${user.id}`);
      if (dismissed) return;

      // Check if this is a new user (no first_meaningful_action)
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, first_meaningful_action_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.display_name || "friend");
        // Only show if they haven't taken a meaningful action
        if (!profile.first_meaningful_action_at) {
          setOpen(true);
        }
      }
    };

    // Delay slightly to not overwhelm on page load
    const timer = setTimeout(checkFirstVisit, 1500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleAction = async (path: string, action: string) => {
    // Mark first meaningful action
    if (user) {
      await supabase
        .from("profiles")
        .update({ first_meaningful_action_at: new Date().toISOString() })
        .eq("id", user.id);

      // Track the event
      await supabase.from("user_events").insert({
        user_id: user.id,
        event_type: "jeeves_welcome_action",
        event_data: { action },
        page_path: "/dashboard",
      });
    }

    localStorage.setItem(`jeeves_welcome_${user?.id}`, "true");
    setOpen(false);
    navigate(path);
  };

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`jeeves_welcome_${user.id}`, "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🎩</span>
            </div>
            <div>
              <DialogTitle className="text-xl">
                Welcome, {userName}!
              </DialogTitle>
              <DialogDescription>
                I'm Jeeves, your AI guide
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            I'll help you master the Bible using visual memory techniques. 
            Where would you like to start?
          </p>

          <div className="grid gap-3">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleAction("/read-me-the-bible", "read_bible")}
            >
              <BookOpen className="h-5 w-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Read Me The Bible</div>
                <div className="text-xs text-muted-foreground">
                  Start with immersive Bible reading
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleAction("/palace", "explore_palace")}
            >
              <Building2 className="h-5 w-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-medium">Explore Memory Palace</div>
                <div className="text-xs text-muted-foreground">
                  Discover the 8-floor system
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleAction("/jeeves", "ask_jeeves")}
            >
              <MessageSquare className="h-5 w-5 mr-3 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Ask Me Anything</div>
                <div className="text-xs text-muted-foreground">
                  Chat about any Bible question
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            I'll explore on my own
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
