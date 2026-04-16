import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Loader2, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GuestContributionFormProps {
  challengeId: string;
  shareCode?: string | null;
  onSuccess: () => void;
}

export function GuestContributionForm({
  challengeId,
  shareCode,
  onSuccess,
}: GuestContributionFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contribution, setContribution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!contribution.trim()) {
      toast.error("Please share your thoughts");
      return;
    }

    if (contribution.trim().length < 20) {
      toast.error("Please share a bit more (at least 20 characters)");
      return;
    }

    setSubmitting(true);

    try {
      // Get share_id if shareCode provided
      let shareId = null;
      if (shareCode) {
        // @ts-ignore - Table exists but types not synced
        const { data: shareData } = await supabase
          .from("weekly_challenge_shares")
          .select("id")
          .eq("share_code", shareCode)
          .single();
        shareId = shareData?.id;
      }

      // @ts-ignore - Table exists but types not synced
      const { error } = await supabase.from("weekly_challenge_guest_contributions").insert({
        challenge_id: challengeId,
        share_id: shareId,
        name: name.trim(),
        email: email.trim() || null,
        contribution: contribution.trim(),
      });

      if (error) throw error;

      // Clear form
      setName("");
      setEmail("");
      setContribution("");
      onSuccess();
    } catch (err) {
      console.error("Contribution error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-500" />
          Share Your Thoughts
        </CardTitle>
        <CardDescription className="text-xs">
          Even as a guest, you can contribute to this week's study!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guest-name" className="text-sm">
            Your Name *
          </Label>
          <Input
            id="guest-name"
            placeholder="John"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-email" className="text-sm">
            Email (optional)
          </Label>
          <Input
            id="guest-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            We'll notify you when the winner is announced
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-thought" className="text-sm">
            Your Insight *
          </Label>
          <Textarea
            id="guest-thought"
            placeholder="What stood out to you from this passage? Share any insights or questions..."
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting || !name.trim() || !contribution.trim()}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Share Thought
            </>
          )}
        </Button>

        {/* CTA to Join */}
        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Want to fully participate and compete?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Free Account
          </Button>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Earn XP & compete for weekly honors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
