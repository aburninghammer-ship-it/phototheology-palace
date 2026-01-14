import { useState } from "react";
import { SimmerArtifact, Lane } from "@/hooks/useSimmerEngine";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Copy, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const LANE_COLORS: Record<Lane, { bg: string; text: string }> = {
  BUILD: { bg: "bg-blue-500/20", text: "text-blue-400" },
  SHARPEN: { bg: "bg-amber-500/20", text: "text-amber-400" },
  STRESS: { bg: "bg-red-500/20", text: "text-red-400" },
  DISTILL: { bg: "bg-green-500/20", text: "text-green-400" },
};

interface ArtifactExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifacts: SimmerArtifact[];
  onExportToSermon: (content: string) => void;
}

export function ArtifactExportDialog({
  open,
  onOpenChange,
  artifacts,
  onExportToSermon,
}: ArtifactExportDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportMode, setExportMode] = useState<"full" | "distill">("distill");

  const toggleArtifact = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === artifacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(artifacts.map(a => a.id)));
    }
  };

  const selectByLane = (lane: Lane) => {
    const laneArtifacts = artifacts.filter(a => a.lane === lane);
    const allSelected = laneArtifacts.every(a => selectedIds.has(a.id));
    
    const newSet = new Set(selectedIds);
    laneArtifacts.forEach(a => {
      if (allSelected) {
        newSet.delete(a.id);
      } else {
        newSet.add(a.id);
      }
    });
    setSelectedIds(newSet);
  };

  const formatExport = (): string => {
    const selected = artifacts.filter(a => selectedIds.has(a.id));
    
    if (exportMode === "distill") {
      // Clean distilled format - just the essentials
      const distillArtifacts = selected.filter(a => a.lane === "DISTILL");
      const otherArtifacts = selected.filter(a => a.lane !== "DISTILL");
      
      let output = "";
      
      if (distillArtifacts.length > 0) {
        output += "## Distilled Elements\n\n";
        distillArtifacts.forEach(a => {
          if (a.type === "Quote" || a.type === "Bullet") {
            output += `• ${a.content}\n`;
          } else if (a.type === "Question") {
            output += `? ${a.content}\n`;
          } else {
            output += `**${a.summary}**\n${a.content}\n\n`;
          }
        });
      }
      
      if (otherArtifacts.length > 0) {
        output += "\n## Key Content\n\n";
        otherArtifacts.forEach(a => {
          output += `### ${a.summary}\n${a.content}\n`;
          if (a.verse) output += `\n*${a.verse}*\n`;
          output += "\n";
        });
      }
      
      return output;
    }
    
    // Full format with metadata
    let output = "# Simmer Engine Export\n\n";
    
    const byLane: Record<Lane, SimmerArtifact[]> = {
      BUILD: [],
      SHARPEN: [],
      STRESS: [],
      DISTILL: [],
    };
    
    selected.forEach(a => byLane[a.lane].push(a));
    
    Object.entries(byLane).forEach(([lane, items]) => {
      if (items.length === 0) return;
      
      output += `## ${lane} Lane\n\n`;
      items.forEach(a => {
        output += `### ${a.type}: ${a.summary}\n`;
        output += `${a.content}\n`;
        if (a.verse) output += `\n> Scripture: ${a.verse}\n`;
        if (a.ptCodes?.length) output += `\n*PT Codes: ${a.ptCodes.join(", ")}*\n`;
        if (a.linked_sections?.length) output += `\n*Sections: ${a.linked_sections.join(", ")}*\n`;
        output += "\n---\n\n";
      });
    });
    
    return output;
  };

  const handleCopyToClipboard = () => {
    const content = formatExport();
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleExportToSermon = () => {
    const content = formatExport();
    onExportToSermon(content);
    onOpenChange(false);
    toast.success("Exported to Sermon Builder!");
  };

  const distillArtifacts = artifacts.filter(a => a.lane === "DISTILL");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Artifacts to Sermon Builder
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select artifacts to export. Distilled content is presentation-ready.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap mb-4">
          <Button
            size="sm"
            variant={exportMode === "distill" ? "default" : "outline"}
            onClick={() => setExportMode("distill")}
            className={exportMode === "distill" ? "bg-green-600" : "border-green-500/30 text-green-300"}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Distilled Format
          </Button>
          <Button
            size="sm"
            variant={exportMode === "full" ? "default" : "outline"}
            onClick={() => setExportMode("full")}
            className={exportMode === "full" ? "bg-cyan-600" : "border-cyan-500/30 text-cyan-300"}
          >
            <FileText className="w-3 h-3 mr-1" />
            Full Format
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          <Button size="sm" variant="outline" onClick={selectAll} className="text-xs">
            {selectedIds.size === artifacts.length ? "Deselect All" : "Select All"}
          </Button>
          {(["BUILD", "SHARPEN", "STRESS", "DISTILL"] as Lane[]).map(lane => (
            <Button
              key={lane}
              size="sm"
              variant="outline"
              onClick={() => selectByLane(lane)}
              className={`text-xs ${LANE_COLORS[lane].bg} ${LANE_COLORS[lane].text} border-transparent`}
            >
              {lane} ({artifacts.filter(a => a.lane === lane).length})
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-2">
            {artifacts.map(artifact => (
              <div
                key={artifact.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedIds.has(artifact.id) 
                    ? "bg-cyan-500/20 border-cyan-500/50" 
                    : "bg-slate-800 border-slate-700 hover:border-slate-600"
                }`}
                onClick={() => toggleArtifact(artifact.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.has(artifact.id)}
                    onCheckedChange={() => toggleArtifact(artifact.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${LANE_COLORS[artifact.lane].bg} ${LANE_COLORS[artifact.lane].text} text-xs`}>
                        {artifact.lane}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{artifact.type}</Badge>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{artifact.summary}</p>
                    <p className="text-slate-400 text-xs line-clamp-1">{artifact.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2 mt-4">
          <div className="flex-1 text-sm text-slate-400">
            {selectedIds.size} artifact{selectedIds.size !== 1 ? "s" : ""} selected
          </div>
          <Button variant="outline" onClick={handleCopyToClipboard} disabled={selectedIds.size === 0}>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button onClick={handleExportToSermon} disabled={selectedIds.size === 0} className="bg-cyan-600 hover:bg-cyan-700">
            <ArrowRight className="w-4 h-4 mr-1" />
            Send to Sermon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
