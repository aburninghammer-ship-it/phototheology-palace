import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StyledMarkdownSections } from "@/components/ui/styled-markdown";
import { StudyTransformActions } from "@/components/study-transform/StudyTransformActions";

export default function Amplify() {
  const { user } = useAuth();
  const [studyText, setStudyText] = useState("");
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalInput, setOriginalInput] = useState("");

  const handleAmplify = async () => {
    if (studyText.length < 100) {
      toast.error("Study must be at least a full paragraph (100+ characters)");
      return;
    }

    setIsGenerating(true);
    setReport("");
    setOriginalInput(studyText);

    try {
      const { data, error } = await supabase.functions.invoke("amplify-study", {
        body: { studyText }
      });

      if (error) {
        console.error("Amplify invoke error:", error);
        const msg = typeof error === "object" && error.message ? error.message : String(error);
        if (msg.includes("429")) {
          toast.error("Rate limited — please wait a moment and try again");
        } else if (msg.includes("402")) {
          toast.error("AI credits exhausted — please add funds in Settings");
        } else {
          toast.error("Failed to amplify study. Please try again.");
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setReport(data?.report || "No amplification generated.");
      toast.success("Study amplified through the Palace!");
    } catch (err: any) {
      console.error("Amplify error:", err);
      toast.error("Failed to amplify study. Please try again.");
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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
            <Zap className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Amplify</h1>
            <p className="text-sm text-muted-foreground">
              Jeeves fills out, enhances, and sharpens your study — making it substantially deeper and more complete
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
                  : "✓ Ready to amplify"}
              </span>
              <span className="text-xs text-muted-foreground">{studyText.length}/15,000</span>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 inline mr-1 text-blue-500" />
              Jeeves will take your study and <strong>substantially expand it</strong> — adding missing cross-references, deepening theological points, sharpening arguments, filling gaps, and enhancing every section with Palace-level insight. Same structure, far more substance. Hit Re-Amplify for a fresh pass.
            </p>
          </div>
        </div>

        {/* Amplify Button */}
        <Button
          onClick={handleAmplify}
          disabled={isGenerating || studyText.length < 100}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-base"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Amplifying through the Palace...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Amplify Study
            </>
          )}
        </Button>

        {/* Report Output */}
        {report && (
          <div className="mt-8 border border-blue-500/20 rounded-xl bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Amplified Study
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAmplify}
                disabled={isGenerating}
                className="text-xs border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Re-Amplify
              </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <StyledMarkdownSections content={report} />
            </div>

            <StudyTransformActions
              report={report}
              originalText={originalInput}
              toolName="Amplify"
              accentColor="blue"
              onLayerBack={handleLayerBack}
            />
          </div>
        )}
      </div>
    </div>
  );
}
