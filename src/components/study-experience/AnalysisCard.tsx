import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface StudyLayer {
  roomId: string;
  roomName: string;
  principleId: string;
  principleName: string;
  analysis: string;
  userAttempt?: string;
  jeevesEvaluation?: string;
}

interface AnalysisCardProps {
  layer: StudyLayer;
  index: number;
  onRemove?: (principleId: string) => void;
}

const ROOM_COLORS: Record<string, string> = {
  dr: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  c6: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  tz: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  cr: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  bl: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  cec: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export function AnalysisCard({ layer, index, onRemove }: AnalysisCardProps) {
  const colorClass = ROOM_COLORS[layer.roomId] || "bg-primary/20 text-primary border-primary/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <Badge variant="outline" className={colorClass}>
          {layer.roomName}
        </Badge>
        <span className="text-xs text-muted-foreground flex-1">{layer.principleName}</span>
        {onRemove && (
          <button
            onClick={() => onRemove(layer.principleId)}
            className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Remove this layer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {layer.userAttempt && (
          <div className="pl-3 border-l-2 border-muted-foreground/30">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Your Connection:</p>
            <p className="text-sm text-muted-foreground/80 italic">"{layer.userAttempt}"</p>
          </div>
        )}

        {layer.jeevesEvaluation && (
          <div className="pl-3 border-l-2 border-primary/40">
            <p className="text-xs text-primary mb-1 font-medium">Jeeves' Evaluation:</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{layer.jeevesEvaluation}</p>
          </div>
        )}

        <div className={layer.userAttempt ? "pl-3 border-l-2 border-blue-500/40" : ""}>
          {layer.userAttempt && (
            <p className="text-xs text-blue-400 mb-1 font-medium">Full Analysis:</p>
          )}
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{layer.analysis}</p>
        </div>
      </div>
    </motion.div>
  );
}
