import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedScoreProps {
  score: number;
  maxScore?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  delay?: number;
}

export const AnimatedScore = ({ 
  score, 
  maxScore = 100, 
  className = "", 
  size = "md",
  showLabel = false,
  label = "",
  delay = 0
}: AnimatedScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const timer = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const currentScore = Math.round(score * easeOutExpo);
        
        setDisplayScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setHasAnimated(true);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, delay, hasAnimated]);

  const getColor = (s: number) => {
    if (s >= 80) return { ring: "stroke-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/20" };
    if (s >= 60) return { ring: "stroke-amber-400", text: "text-amber-400", bg: "bg-amber-500/20" };
    if (s >= 40) return { ring: "stroke-orange-400", text: "text-orange-400", bg: "bg-orange-500/20" };
    return { ring: "stroke-red-400", text: "text-red-400", bg: "bg-red-500/20" };
  };

  const colors = getColor(displayScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / maxScore) * circumference;

  const sizes = {
    sm: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
    md: { container: "w-24 h-24", text: "text-2xl", label: "text-sm" },
    lg: { container: "w-32 h-32", text: "text-4xl", label: "text-base" },
  };

  return (
    <motion.div 
      className={`relative ${sizes[size].container} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-muted/20"
          strokeWidth="8"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={colors.ring}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: delay / 1000, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${sizes[size].text} ${colors.text}`}>
          {displayScore}
        </span>
        {showLabel && label && (
          <span className={`${sizes[size].label} text-muted-foreground text-center px-1`}>
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
};
