import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Loader2, Plus, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PT_PRINCIPLES = [
  "Types & Shadows",
  "Parallels",
  "Patterns",
  "Cycles",
  "Sanctuary Blueprint",
  "Christ-Centered Reading",
  "Prophetic Connections",
  "Story Comparison",
];

interface SubmissionFormProps {
  challengeId: string;
  onSuccess: () => void;
}

export function SubmissionForm({ challengeId, onSuccess }: SubmissionFormProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [mainInsight, setMainInsight] = useState("");
  const [scriptureInput, setScriptureInput] = useState("");
  const [scriptureConnections, setScriptureConnections] = useState<string[]>([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [practicalApplication, setPracticalApplication] = useState("");
  const [supportingEvidence, setSupportingEvidence] = useState("");

  const addScripture = () => {
    if (scriptureInput.trim() && !scriptureConnections.includes(scriptureInput.trim())) {
      setScriptureConnections([...scriptureConnections, scriptureInput.trim()]);
      setScriptureInput("");
    }
  };

  const removeScripture = (scripture: string) => {
    setScriptureConnections(scriptureConnections.filter((s) => s !== scripture));
  };

  const togglePrinciple = (principle: string) => {
    setSelectedPrinciples((prev) =>
      prev.includes(principle)
        ? prev.filter((p) => p !== principle)
        : [...prev, principle]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit");
      return;
    }

    if (!mainInsight.trim()) {
      toast.error("Please share your main insight");
      return;
    }

    if (mainInsight.trim().length < 50) {
      toast.error("Please provide a more detailed insight (at least 50 characters)");
      return;
    }

    setSubmitting(true);

    try {
      const wordCount = mainInsight.trim().split(/\s+/).length +
        (practicalApplication?.trim().split(/\s+/).length || 0) +
        (supportingEvidence?.trim().split(/\s+/).length || 0);

      // @ts-ignore - Table exists but types not synced
      const { error } = await supabase.from("weekly_study_submissions").insert({
        challenge_id: challengeId,
        user_id: user.id,
        main_insight: mainInsight.trim(),
        scripture_connections: scriptureConnections,
        principles_applied: selectedPrinciples,
        practical_application: practicalApplication.trim() || null,
        supporting_evidence: supportingEvidence.trim() || null,
        word_count: wordCount,
      });

      if (error) throw error;

      // Award participation XP
      try {
        // @ts-ignore - RPC exists but types not synced
        await supabase.rpc("award_xp", { p_user_id: user.id, p_amount: 50, p_reason: "weekly_challenge" });
      } catch {
        // XP function might not exist
      }

      onSuccess();
    } catch (err: any) {
      console.error("Submission error:", err);
      if (err.code === "23505") {
        toast.error("You've already submitted to this challenge");
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Submit Your Insights
        </CardTitle>
        <CardDescription>
          Share what you discovered in your study. Be thorough - Jeeves evaluates depth and biblical accuracy!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Insight */}
        <div className="space-y-2">
          <Label htmlFor="insight" className="text-base font-semibold">
            Main Insight *
          </Label>
          <p className="text-xs text-muted-foreground">
            What is the key discovery or understanding you gained from this passage?
          </p>
          <Textarea
            id="insight"
            placeholder="Share your primary insight from studying this passage..."
            value={mainInsight}
            onChange={(e) => setMainInsight(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {mainInsight.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Scripture Connections */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Scripture Connections</Label>
          <p className="text-xs text-muted-foreground">
            What other passages connect to or illuminate this study?
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., John 3:16, Hebrews 9:12"
              value={scriptureInput}
              onChange={(e) => setScriptureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addScripture())}
            />
            <Button type="button" variant="outline" size="icon" onClick={addScripture}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {scriptureConnections.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {scriptureConnections.map((scripture) => (
                <Badge key={scripture} variant="secondary" className="gap-1">
                  {scripture}
                  <button
                    type="button"
                    onClick={() => removeScripture(scripture)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* PT Principles */}
        <div className="space-y-2">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            PT Principles Applied
          </Label>
          <p className="text-xs text-muted-foreground">
            Which Phototheology principles did you apply in your study?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PT_PRINCIPLES.map((principle) => (
              <label
                key={principle}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedPrinciples.includes(principle)
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <Checkbox
                  checked={selectedPrinciples.includes(principle)}
                  onCheckedChange={() => togglePrinciple(principle)}
                />
                <span className="text-xs">{principle}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Practical Application */}
        <div className="space-y-2">
          <Label htmlFor="application" className="text-base font-semibold">
            Practical Application
          </Label>
          <p className="text-xs text-muted-foreground">
            How does this insight apply to your life or ministry?
          </p>
          <Textarea
            id="application"
            placeholder="Share how this truth impacts daily living..."
            value={practicalApplication}
            onChange={(e) => setPracticalApplication(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Supporting Evidence */}
        <div className="space-y-2">
          <Label htmlFor="evidence" className="text-base font-semibold">
            Supporting Evidence
          </Label>
          <p className="text-xs text-muted-foreground">
            What biblical evidence supports your insight?
          </p>
          <Textarea
            id="evidence"
            placeholder="Cite specific verses or contexts that support your interpretation..."
            value={supportingEvidence}
            onChange={(e) => setSupportingEvidence(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || !mainInsight.trim()}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit My Insights
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Submissions are final. You'll earn 50 XP for participating!
        </p>
      </CardContent>
    </Card>
  );
}
