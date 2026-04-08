import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ShowMeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string; // tailwind color class e.g. "violet", "amber"
  remaining?: number | null; // null = boolean feature (1 use)
  canUse: boolean;
  onClick: () => void;
}

const accentMap: Record<string, { border: string; glow: string; bg: string; text: string }> = {
  violet: { border: "border-violet-500/30", glow: "shadow-violet-500/20", bg: "bg-violet-500", text: "text-violet-400" },
  amber: { border: "border-amber-500/30", glow: "shadow-amber-500/20", bg: "bg-amber-500", text: "text-amber-400" },
  indigo: { border: "border-indigo-500/30", glow: "shadow-indigo-500/20", bg: "bg-indigo-500", text: "text-indigo-400" },
  emerald: { border: "border-emerald-500/30", glow: "shadow-emerald-500/20", bg: "bg-emerald-500", text: "text-emerald-400" },
  rose: { border: "border-rose-500/30", glow: "shadow-rose-500/20", bg: "bg-rose-500", text: "text-rose-400" },
  sky: { border: "border-sky-500/30", glow: "shadow-sky-500/20", bg: "bg-sky-500", text: "text-sky-400" },
};

export function ShowMeCard({ icon: Icon, title, description, accent, remaining, canUse, onClick }: ShowMeCardProps) {
  const colors = accentMap[accent] || accentMap.violet;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative text-left rounded-2xl border ${colors.border} bg-card/60 backdrop-blur-md p-6 transition-shadow hover:shadow-lg hover:${colors.glow} cursor-pointer group`}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center rounded-xl ${colors.bg}/20 p-3 mb-4`}>
        <Icon className={`h-6 w-6 ${colors.text}`} />
      </div>

      {/* Title + description */}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {/* Usage badge */}
      <div className="mt-4 flex items-center gap-2">
        {!canUse ? (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground gap-1">
            <Lock className="h-3 w-3" /> Used
          </Badge>
        ) : remaining !== null && remaining !== undefined ? (
          <Badge variant="outline" className={`${colors.border} ${colors.text} gap-1`}>
            {remaining} remaining
          </Badge>
        ) : (
          <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
            Try it
          </Badge>
        )}
      </div>
    </motion.button>
  );
}
