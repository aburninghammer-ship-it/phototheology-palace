import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageSquare, Shield, Sparkles, BookOpen, Users } from "lucide-react";

interface CommunityGuidelinesProps {
  userId: string;
}

export const CommunityGuidelines = ({ userId }: CommunityGuidelinesProps) => {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGuidelinesStatus();
  }, [userId]);

  const checkGuidelinesStatus = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("has_seen_community_guidelines")
      .eq("id", userId)
      .single();

    if (data && !data.has_seen_community_guidelines) {
      setOpen(true);
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    await supabase
      .from("profiles")
      .update({ has_seen_community_guidelines: true })
      .eq("id", userId);
    setOpen(false);
  };

  if (loading) return null;

  const guidelines = [
    {
      icon: Heart,
      title: "Be Kind & Respectful",
      description: "Treat fellow believers with love. Disagreements are fine, but always maintain respect and Christian charity."
    },
    {
      icon: BookOpen,
      title: "Stay Biblical",
      description: "Ground discussions in Scripture. Share insights from your Phototheology study—palace mappings, gems, typology discoveries."
    },
    {
      icon: Shield,
      title: "Protect Privacy",
      description: "Don't share personal information about others. Be mindful of sensitive prayer requests."
    },
    {
      icon: Sparkles,
      title: "Share Your Discoveries",
      description: "Post your palace room mappings, memory techniques, sermon outlines, and study gems. Help others grow!"
    },
    {
      icon: MessageSquare,
      title: "Engage Thoughtfully",
      description: "Reply to posts that need feedback. Ask questions, offer insights, and build each other up."
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Welcome newcomers, celebrate achievements, and pray for one another. We're all learning together."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to the Community!
          </DialogTitle>
          <DialogDescription>
            Before you start posting, please review our community guidelines.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {guidelines.map((guideline, index) => (
              <div 
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <guideline.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{guideline.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {guideline.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="agree" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)} 
            />
            <label htmlFor="agree" className="text-sm cursor-pointer">
              I agree to follow these guidelines
            </label>
          </div>
          <Button onClick={handleAccept} disabled={!agreed}>
            Enter Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
