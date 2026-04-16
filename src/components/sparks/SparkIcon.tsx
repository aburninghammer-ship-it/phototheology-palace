import { motion } from 'framer-motion';
import { Flame, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SparkIconProps {
  type: 'connection' | 'pattern' | 'application';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
  colorVariant?: number; // 0-2 for different color variations per type
}

// Multiple color variants per spark type for visual variety
const sparkColorVariants = {
  connection: [
    { color: 'text-orange-400', bgColor: 'bg-orange-500/20', hoverBg: 'hover:bg-orange-500/30', borderColor: 'border-orange-400/50', glow: 'rgba(249,115,22,0.4)' },
    { color: 'text-rose-400', bgColor: 'bg-rose-500/20', hoverBg: 'hover:bg-rose-500/30', borderColor: 'border-rose-400/50', glow: 'rgba(244,63,94,0.4)' },
    { color: 'text-amber-400', bgColor: 'bg-amber-500/20', hoverBg: 'hover:bg-amber-500/30', borderColor: 'border-amber-400/50', glow: 'rgba(245,158,11,0.4)' },
  ],
  pattern: [
    { color: 'text-purple-400', bgColor: 'bg-purple-500/20', hoverBg: 'hover:bg-purple-500/30', borderColor: 'border-purple-400/50', glow: 'rgba(168,85,247,0.4)' },
    { color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', hoverBg: 'hover:bg-indigo-500/30', borderColor: 'border-indigo-400/50', glow: 'rgba(99,102,241,0.4)' },
    { color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/20', hoverBg: 'hover:bg-fuchsia-500/30', borderColor: 'border-fuchsia-400/50', glow: 'rgba(217,70,239,0.4)' },
  ],
  application: [
    { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', hoverBg: 'hover:bg-yellow-500/30', borderColor: 'border-yellow-400/50', glow: 'rgba(234,179,8,0.4)' },
    { color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', hoverBg: 'hover:bg-emerald-500/30', borderColor: 'border-emerald-400/50', glow: 'rgba(52,211,153,0.4)' },
    { color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', hoverBg: 'hover:bg-cyan-500/30', borderColor: 'border-cyan-400/50', glow: 'rgba(34,211,238,0.4)' },
  ],
};

const sparkConfig = {
  connection: { icon: Flame, label: 'Connection Spark' },
  pattern: { icon: Sparkles, label: 'Pattern Spark' },
  application: { icon: Lightbulb, label: 'Application Spark' }
};

const sizeConfig = {
  sm: { icon: 14, wrapper: 'h-6 w-6' },
  md: { icon: 18, wrapper: 'h-8 w-8' },
  lg: { icon: 22, wrapper: 'h-10 w-10' }
};

export function SparkIcon({ 
  type, 
  size = 'sm', 
  pulse = true, 
  onClick, 
  className,
  colorVariant
}: SparkIconProps) {
  const config = sparkConfig[type];
  const sizeProps = sizeConfig[size];
  const Icon = config.icon;
  
  // Pick a color variant - use provided or random based on current time for variety
  const variants = sparkColorVariants[type];
  const variantIndex = colorVariant !== undefined 
    ? colorVariant % variants.length 
    : Math.floor(Math.random() * variants.length);
  const colors = variants[variantIndex];

  const glowStyle = pulse 
    ? { boxShadow: `0 0 14px 4px ${colors.glow}` }
    : { boxShadow: `0 0 10px 2px ${colors.glow}` };

  return (
    <motion.button
      initial={{ scale: 1 }}
      animate={pulse ? { 
        scale: [1, 1.12, 1, 1.08, 1],
        rotate: [0, 4, -4, 2, 0],
      } : { scale: 1 }}
      transition={pulse ? { 
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut"
      } : undefined}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={glowStyle}
      className={cn(
        'relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
        'backdrop-blur-sm border-2 border-white/30',
        sizeProps.wrapper,
        colors.bgColor,
        colors.hoverBg,
        className
      )}
      title={config.label}
    >
      {/* Subtle outer glow ring that pulses */}
      {pulse && (
        <motion.span
          className={cn(
            "absolute -inset-0.5 rounded-full",
            colors.bgColor,
            "blur-sm"
          )}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Subtle sparkle particle */}
      {pulse && (
        <motion.span
          className="absolute w-1 h-1 rounded-full bg-white/60"
          animate={{
            x: [0, 5, -3, 0],
            y: [0, -5, 3, 0],
            opacity: [0, 0.7, 0.2, 0],
            scale: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      )}
      
      {/* Inner glow ring */}
      <motion.span
        className={cn(
          "absolute inset-0 rounded-full border",
          colors.borderColor
        )}
        animate={pulse ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.06, 1],
        } : { opacity: 0.3 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Icon size={sizeProps.icon} className={cn(colors.color, "relative z-10 drop-shadow-lg")} />
    </motion.button>
  );
}
