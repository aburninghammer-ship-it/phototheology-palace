import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Disc3, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StyledMarkdownSections } from "@/components/ui/styled-markdown";
import { StudyTransformActions } from "@/components/study-transform/StudyTransformActions";

export default function Remix() {
  const { user } = useAuth();
  const [studyText, setStudyText] = useState("");
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalInput, setOriginalInput] = useState("");

  const handleRemix = async () => {
    if (studyText.length < 100) {
      toast.error("Study must be at least a full paragraph (100+ characters)");
      return;
    }

    setIsGenerating(true);
    setReport("");
    setOriginalInput(studyText);

    try {
      const { data, error } = await supabase.functions.invoke("remix-study", {
        body: { studyText }
      });

      if (error) {
        console.error("Remix invoke error:", error);
        const msg = typeof error === "object" && error.message ? error.message : String(error);
        if (msg.includes("429")) {
          toast.error("Rate limited — please wait a moment and try again");
        } else if (msg.includes("402")) {
          toast.error("AI credits exhausted — please add funds in Settings");
        } else {
          toast.error("Failed to remix study. Please try again.");
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setReport(data?.report || "No remix generated.");
      toast.success("Study remixed through the Palace!");
    } catch (err: any) {
      console.error("Remix error:", err);
      toast.error("Failed to remix study. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLayerBack = (combinedText: string) => {
    setStudyText(combinedText);
    setReport("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <Disc3 className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Remix</h1>
            <p className="text-sm text-muted-foreground">
              Jeeves chooses the Palace rooms and shows you possibilities you never imagined
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Paste or type your study below
            </label>
            <Textarea
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              placeholder="Paste your Bible study, sermon notes, devotional, or any theological text here... (minimum one paragraph)"
              className="min-h-[160px] text-sm"
              maxLength={15000}
            />
            <div className="flex justify-between mt-1">
              <span className={cn(
                "text-xs",
                studyText.length < 100 ? "text-muted-foreground" : "text-emerald-500"
              )}>
                {studyText.length < 100
                  ? `${100 - studyText.length} more characters needed`
                  : "✓ Ready to remix"}
              </span>
              <span className="text-xs text-muted-foreground">{studyText.length}/15,000</span>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 inline mr-1 text-amber-500" />
              Jeeves will take your study's elements and <strong>rebuild them into 3 entirely new studies</strong> — each with a different theological architecture (Sanctuary progression, Pattern movement, Prophetic timeline, etc.). Same bricks, new cathedral. Hit Re-Remix for fresh remix types.
            </p>
          </div>
        </div>

        {/* Remix Button */}
        <Button
          onClick={handleRemix}
          disabled={isGenerating || studyText.length < 100}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-base"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Remixing through the Palace...
            </>
          ) : (
            <>
              <Disc3 className="h-5 w-5 mr-2" />
              Remix Study
            </>
          )}
        </Button>

        {/* Report Output */}
        {report && (
          <div className="mt-8 border border-amber-500/20 rounded-xl bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Remix Report
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemix}
                disabled={isGenerating}
                className="text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Re-Remix (new rooms)
              </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <StyledMarkdownSections content={report} />
            </div>

            <StudyTransformActions
              report={report}
              originalText={originalInput}
              toolName="Remix"
              accentColor="amber"
              onLayerBack={handleLayerBack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
