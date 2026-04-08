import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check, RefreshCw, Save, Sparkles, BookOpen, CrosshairIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface StudyLayer {
  roomId: string;
  roomName: string;
  principleId: string;
  principleName: string;
  analysis: string;
  userAttempt?: string;
  jeevesEvaluation?: string;
  accepted?: boolean;
}

interface AnalysisCardProps {
  layer: StudyLayer;
  index: number;
  onRemove?: (principleId: string) => void;
  onRebuild?: (principleId: string) => void;
  onAccept?: (principleId: string) => void;
  onSaveLayer?: (layer: StudyLayer) => void;
}

const ROOM_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; accent: string }> = {
  dr:   { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300", glow: "shadow-[0_0_25px_-5px_rgba(139,92,246,0.35)]", accent: "from-violet-500/20 to-violet-900/10" },
  c6:   { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-300",   glow: "shadow-[0_0_25px_-5px_rgba(59,130,246,0.35)]",  accent: "from-blue-500/20 to-blue-900/10" },
  tz:   { bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   text: "text-cyan-300",   glow: "shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)]",  accent: "from-cyan-500/20 to-cyan-900/10" },
  cr:   { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-300",  glow: "shadow-[0_0_25px_-5px_rgba(251,191,36,0.35)]",  accent: "from-amber-500/20 to-amber-900/10" },
  bl:   { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-300", glow: "shadow-[0_0_25px_-5px_rgba(99,102,241,0.35)]",  accent: "from-indigo-500/20 to-indigo-900/10" },
  cec:  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", glow: "shadow-[0_0_25px_-5px_rgba(52,211,153,0.35)]", accent: "from-emerald-500/20 to-emerald-900/10" },
  ir:   { bg: "bg-rose-500/10",   border: "border-rose-500/30",   text: "text-rose-300",   glow: "shadow-[0_0_25px_-5px_rgba(251,113,133,0.35)]", accent: "from-rose-500/20 to-rose-900/10" },
  or:   { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300", glow: "shadow-[0_0_25px_-5px_rgba(251,146,60,0.35)]",  accent: "from-orange-500/20 to-orange-900/10" },
  trm:  { bg: "bg-pink-500/10",   border: "border-pink-500/30",   text: "text-pink-300",   glow: "shadow-[0_0_25px_-5px_rgba(236,72,153,0.35)]",  accent: "from-pink-500/20 to-pink-900/10" },
  frt:  { bg: "bg-lime-500/10",   border: "border-lime-500/30",   text: "text-lime-300",   glow: "shadow-[0_0_25px_-5px_rgba(163,230,53,0.35)]",  accent: "from-lime-500/20 to-lime-900/10" },
  '3a': { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-300",    glow: "shadow-[0_0_25px_-5px_rgba(248,113,113,0.35)]", accent: "from-red-500/20 to-red-900/10" },
  fe:   { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-300", glow: "shadow-[0_0_25px_-5px_rgba(250,204,21,0.35)]",  accent: "from-yellow-500/20 to-yellow-900/10" },
  pr:   { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", glow: "shadow-[0_0_25px_-5px_rgba(192,132,252,0.35)]", accent: "from-purple-500/20 to-purple-900/10" },
  frm:  { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300", glow: "shadow-[0_0_25px_-5px_rgba(249,115,22,0.35)]",  accent: "from-orange-500/20 to-orange-900/10" },
  mr:   { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", glow: "shadow-[0_0_25px_-5px_rgba(192,132,252,0.35)]", accent: "from-purple-500/20 to-purple-900/10" },
  sr:   { bg: "bg-sky-500/10",    border: "border-sky-500/30",    text: "text-sky-300",    glow: "shadow-[0_0_25px_-5px_rgba(56,189,248,0.35)]",  accent: "from-sky-500/20 to-sky-900/10" },
};

const DEFAULT_COLORS = { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", glow: "shadow-[0_0_25px_-5px_hsl(var(--primary)/0.3)]", accent: "from-primary/20 to-primary/5" };

/**
 * Parse Jeeves output into structured sections for beautiful rendering
 */
function parseAnalysis(text: string) {
  const sections: { type: "text" | "spark" | "scripture" | "gem" | "crossref"; content: string }[] = [];
  
  const lines = text.split("\n");
  let currentText = "";

  for (const line of lines) {
    const trimmed = line.trim();

    // Spark line
    if (trimmed.match(/^✨\s*Spark:/i)) {
      if (currentText.trim()) { sections.push({ type: "text", content: currentText.trim() }); currentText = ""; }
      sections.push({ type: "spark", content: trimmed.replace(/^✨\s*Spark:\s*/i, "") });
      continue;
    }

    // Gem line
    if (trimmed.match(/^💎\s*Gem:/i)) {
      if (currentText.trim()) { sections.push({ type: "text", content: currentText.trim() }); currentText = ""; }
      sections.push({ type: "gem", content: trimmed.replace(/^💎\s*Gem:\s*/i, "") });
      continue;
    }

    // Cross-reference line
    if (trimmed.match(/^📖|^🔗|^Cross-reference:/i)) {
      if (currentText.trim()) { sections.push({ type: "text", content: currentText.trim() }); currentText = ""; }
      sections.push({ type: "crossref", content: trimmed.replace(/^(📖|🔗)\s*/, "").replace(/^Cross-reference:\s*/i, "") });
      continue;
    }

    // Scripture quote (line in quotes or starting with ")
    if (trimmed.match(/^[""\u201C]/) && trimmed.match(/[""\u201D]$/) && trimmed.length > 30) {
      if (currentText.trim()) { sections.push({ type: "text", content: currentText.trim() }); currentText = ""; }
      sections.push({ type: "scripture", content: trimmed.replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, "") });
      continue;
    }

    currentText += line + "\n";
  }

  if (currentText.trim()) sections.push({ type: "text", content: currentText.trim() });
  
  // If nothing was parsed specially, return full text
  if (sections.length === 0) sections.push({ type: "text", content: text });
  
  return sections;
}

export function AnalysisCard({ layer, index, onRemove, onRebuild, onAccept, onSaveLayer }: AnalysisCardProps) {
  const colors = ROOM_COLORS[layer.roomId] || DEFAULT_COLORS;
  const sections = parseAnalysis(layer.analysis);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSaveLayer?.(layer);
    setIsSaved(true);
    toast.success("Layer saved to study!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "relative rounded-2xl border-2 backdrop-blur-xl overflow-hidden ring-1 ring-white/5",
        colors.border,
        colors.glow,
        layer.accepted ? "border-green-500/40" : "",
        "bg-card/30"
      )}
    >
      {/* Gradient accent overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60", colors.accent)} />
      
      {/* Header */}
      <div className="relative flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
        <Badge variant="outline" className={cn("font-semibold text-xs px-2.5 py-0.5", colors.bg, colors.text, colors.border)}>
          {layer.roomName}
        </Badge>
        <span className="text-xs text-muted-foreground/80 flex-1 font-medium">{layer.principleName}</span>
        {layer.accepted && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
            <Check className="w-3 h-3 mr-0.5" /> Built
          </Badge>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(layer.principleId)}
            className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Remove this layer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-4">
        {/* User attempt */}
        {layer.userAttempt && (
          <div className="rounded-xl border border-muted-foreground/20 bg-muted/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">Your Connection</p>
            <p className="text-sm text-muted-foreground/90 italic leading-relaxed">"{layer.userAttempt}"</p>
          </div>
        )}

        {/* Jeeves evaluation */}
        {layer.jeevesEvaluation && (
          <div className={cn("rounded-xl border p-3", colors.border, colors.bg)}>
            <p className={cn("text-[10px] uppercase tracking-wider mb-1.5 font-bold", colors.text)}>Jeeves' Evaluation</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{layer.jeevesEvaluation}</p>
          </div>
        )}

        {/* Parsed analysis sections */}
        <div className="space-y-3">
          {sections.map((section, i) => {
            if (section.type === "spark") {
              return (
                <div key={i} className="rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-orange-500/10 p-3 shadow-[0_0_15px_-3px_rgba(250,204,21,0.25)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">Spark</span>
                  </div>
                  <p className="text-sm font-medium text-yellow-200/90 leading-relaxed">{section.content}</p>
                </div>
              );
            }

            if (section.type === "gem") {
              return (
                <div key={i} className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-3 shadow-[0_0_15px_-3px_rgba(52,211,153,0.25)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">💎</span>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Gem</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-200/90 leading-relaxed">{section.content}</p>
                </div>
              );
            }

            if (section.type === "scripture") {
              return (
                <div key={i} className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 pl-4 border-l-4 border-l-sky-400/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold">Scripture</span>
                  </div>
                  <p className="text-sm italic text-sky-200/80 leading-relaxed">"{section.content}"</p>
                </div>
              );
            }

            if (section.type === "crossref") {
              return (
                <div key={i} className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-2.5 pl-3 border-l-3 border-l-purple-400/40">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CrosshairIcon className="w-3 h-3 text-purple-400" />
                    <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Cross-Reference</span>
                  </div>
                  <p className="text-sm text-purple-200/80 leading-relaxed">{section.content}</p>
                </div>
              );
            }

            // Normal text
            return (
              <p key={i} className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{section.content}</p>
            );
          })}
        </div>
      </div>

      {/* Action buttons: Build / Rebuild / Save */}
      {!layer.accepted && (onAccept || onRebuild || onSaveLayer) && (
        <div className="relative flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-black/20">
          {onAccept && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-400/50 transition-all"
              onClick={() => onAccept(layer.principleId)}
            >
              <Check className="w-3.5 h-3.5" />
              Build
            </Button>
          )}
          {onRebuild && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:border-orange-400/50 transition-all"
              onClick={() => onRebuild(layer.principleId)}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Rebuild
            </Button>
          )}
          {onSaveLayer && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 px-3 text-xs gap-1.5 ml-auto border transition-all",
                isSaved
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted/20 hover:bg-muted/40 text-muted-foreground border-muted-foreground/20 hover:border-muted-foreground/40"
              )}
              onClick={handleSave}
              disabled={isSaved}
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved" : "Save Study"}
            </Button>
          )}
        </div>
      )}

      {/* Already accepted — show save only */}
      {layer.accepted && onSaveLayer && (
        <div className="relative flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-black/20">
          <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-[10px]">
            <Check className="w-3 h-3 mr-0.5" /> Accepted
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 px-3 text-xs gap-1.5 ml-auto border transition-all",
              isSaved
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-muted/20 hover:bg-muted/40 text-muted-foreground border-muted-foreground/20"
            )}
            onClick={handleSave}
            disabled={isSaved}
          >
            <Save className="w-3.5 h-3.5" />
            {isSaved ? "Saved" : "Save Study"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
