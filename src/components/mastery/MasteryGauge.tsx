import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMasteryTitle, calculateProgressPercentage } from "@/utils/masteryCalculations";

interface MasteryGaugeProps {
  level: number;
  currentXp: number;
  xpRequired: number;
  roomName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MasteryGauge: React.FC<MasteryGaugeProps> = ({
  level,
  currentXp,
  xpRequired,
  roomName,
  size = "md",
  className,
}) => {
  const percentage = calculateProgressPercentage(currentXp, xpRequired);
  const isMaxLevel = level === 5;
  const title = getMasteryTitle(level);

  const sizes = {
    sm: { container: "w-24 h-24", text: "text-lg", label: "text-[10px]", ring: 6 },
    md: { container: "w-32 h-32", text: "text-2xl", label: "text-xs", ring: 8 },
    lg: { container: "w-40 h-40", text: "text-3xl", label: "text-sm", ring: 10 },
  };

  const levelColors: Record<number, { ring: string; glow: string; bg: string }> = {
    1: { ring: "stroke-blue-400", glow: "shadow-blue-500/30", bg: "from-blue-500/20 to-blue-600/10" },
    2: { ring: "stroke-emerald-400", glow: "shadow-emerald-500/30", bg: "from-emerald-500/20 to-emerald-600/10" },
    3: { ring: "stroke-amber-400", glow: "shadow-amber-500/30", bg: "from-amber-500/20 to-amber-600/10" },
    4: { ring: "stroke-purple-400", glow: "shadow-purple-500/30", bg: "from-purple-500/20 to-purple-600/10" },
    5: { ring: "stroke-yellow-400", glow: "shadow-yellow-500/40", bg: "from-yellow-500/20 to-amber-600/10" },
  };

  const colors = levelColors[level] || levelColors[1];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Tick marks for the gauge
  const tickCount = 10;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * (270 / tickCount));

  return (
    <motion.div
      className={cn("relative flex flex-col items-center", className)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn("relative", sizes[size].container)}>
        {/* Outer glow effect */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50",
            `bg-gradient-to-br ${colors.bg}`
          )} 
        />
        
        {/* Background circle with tick marks */}
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 100 100">
          {/* Tick marks */}
          {ticks.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 42 * Math.cos(rad);
            const y1 = 50 + 42 * Math.sin(rad);
            const x2 = 50 + 38 * Math.cos(rad);
            const y2 = 50 + 38 * Math.sin(rad);
            const isActive = (i / tickCount) * 100 <= percentage;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={cn(
                  "transition-all duration-300",
                  isActive ? colors.ring.replace("stroke-", "stroke-") : "stroke-muted/30"
                )}
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Background arc */}
          <path
            d="M 15 85 A 45 45 0 1 1 85 85"
            fill="none"
            className="stroke-muted/20"
            strokeWidth={sizes[size].ring}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.path
            d="M 15 85 A 45 45 0 1 1 85 85"
            fill="none"
            className={colors.ring}
            strokeWidth={sizes[size].ring}
            strokeLinecap="round"
            strokeDasharray={circumference * 0.75}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold", sizes[size].text)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {level}
          </motion.span>
          <span className={cn("text-muted-foreground uppercase tracking-wider", sizes[size].label)}>
            {title}
          </span>
        </div>

        {/* Level indicators */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <motion.div
              key={lvl}
              className={cn(
                "rounded-full transition-all",
                size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-2.5 h-2.5",
                lvl <= level 
                  ? lvl === 5 ? "bg-yellow-400" : "bg-primary" 
                  : "bg-muted/30"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * lvl }}
            />
          ))}
        </div>
      </div>

      {/* Room name and XP info */}
      <div className="mt-3 text-center">
        {roomName && (
          <p className={cn("font-medium", sizes[size].label === "text-[10px]" ? "text-xs" : "text-sm")}>
            {roomName}
          </p>
        )}
        {!isMaxLevel && (
          <p className={cn("text-muted-foreground", sizes[size].label)}>
            {currentXp} / {xpRequired} XP
          </p>
        )}
        {isMaxLevel && (
          <p className={cn("text-yellow-500 font-medium", sizes[size].label)}>
            ✨ Mastered
          </p>
        )}
      </div>
    </motion.div>
  );
};
