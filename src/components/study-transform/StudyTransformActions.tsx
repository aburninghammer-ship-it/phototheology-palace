import { useState } from "react";
import { Save, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface StudyTransformActionsProps {
  report: string;
  originalText: string;
  toolName: "Remix" | "Amplify";
  accentColor: string; // e.g. "amber" or "blue"
  onLayerBack: (combinedText: string) => void;
}

export function StudyTransformActions({
  report,
  originalText,
  toolName,
  accentColor,
  onLayerBack,
}: StudyTransformActionsProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!user) {
      toast.error("Sign in to save studies");
      return;
    }

    const title = `${toolName}: ${originalText.slice(0, 60).trim()}${originalText.length > 60 ? "…" : ""}`;
    const content = `## ${toolName} Output\n\n${report}\n\n---\n\n## Original Study\n\n${originalText}`;

    const { error } = await supabase.from("user_studies").insert({
      user_id: user.id,
      title,
      content,
      tags: [toolName.toLowerCase(), "palace"],
    });

    if (error) {
      console.error("Save error:", error);
      toast.error("Failed to save study");
      return;
    }

    setSaved(true);
    toast.success("Saved to My Studies!");
  };

  const handleLayerBack = () => {
    if (showNotes) {
      // Combine: original + AI output + user notes → send back
      const combined = [
        originalText,
        "\n\n---\n\n### Previous " + toolName + " Output:\n\n",
        report,
        notes.trim() ? `\n\n---\n\n### My Additional Notes:\n\n${notes}` : "",
      ].join("");
      onLayerBack(combined);
      setShowNotes(false);
      setNotes("");
      toast.info(`Text layered — hit ${toolName} again to go deeper`);
    } else {
      setShowNotes(true);
    }
  };

  const borderColor = accentColor === "amber" ? "border-amber-500/30" : "border-blue-500/30";
  const textColor = accentColor === "amber" ? "text-amber-600" : "text-blue-600";
  const hoverBg = accentColor === "amber" ? "hover:bg-amber-500/10" : "hover:bg-blue-500/10";
  const bgAccent = accentColor === "amber" ? "bg-amber-500/5" : "bg-blue-500/5";

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className={`text-xs ${borderColor} ${textColor} ${hoverBg}`}
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1" />
              Save to Studies
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLayerBack}
          className={`text-xs ${borderColor} ${textColor} ${hoverBg}`}
        >
          <Layers className="h-3.5 w-3.5 mr-1" />
          {showNotes ? "Confirm & Layer" : `Add to & Re-${toolName}`}
        </Button>
      </div>

      {showNotes && (
        <div className={`rounded-lg border ${borderColor} ${bgAccent} p-3 space-y-2`}>
          <p className="text-xs text-muted-foreground">
            Add your own notes, corrections, or new insights. They'll be combined with the original and output, then you can re-{toolName.toLowerCase()} the whole thing.
          </p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your thoughts, additional scriptures, corrections..."
            className="min-h-[80px] text-sm"
          />
        </div>
      )}
    </div>
  );
}
