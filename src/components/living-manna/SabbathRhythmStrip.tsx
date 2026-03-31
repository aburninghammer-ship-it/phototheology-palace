import { useMemo } from "react";
import { Sun, Moon, Sunrise, Sparkles , type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SabbathPhase = 'preparation' | 'sabbath' | 'reflection' | 'carrying';

interface PhaseConfig {
  label: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  textColor: string;
}

const phaseConfigs: Record<SabbathPhase, PhaseConfig> = {
  preparation: {
    label: "Preparing for Sabbath",
    subtitle: "Set aside the week's burdens and ready your heart",
    icon: Sunrise,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  sabbath: {
    label: "Sabbath Rest",
    subtitle: "Enter into His rest — cease striving, be still",
    icon: Sun,
    gradient: "from-primary/20 via-primary/10 to-transparent",
    textColor: "text-primary"
  },
  reflection: {
    label: "Sabbath Reflection",
    subtitle: "What did the Lord speak to you today?",
    icon: Moon,
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    textColor: "text-indigo-600 dark:text-indigo-400"
  },
  carrying: {
    label: "Carrying the Sabbath Forward",
    subtitle: "Let Sabbath truth shape your week",
    icon: Sparkles,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    textColor: "text-emerald-600 dark:text-emerald-400"
  }
};

function getSabbathPhase(): SabbathPhase {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  
  // Approximate sunset times (would ideally use location-based sunset)
  const sunsetHour = 18; // 6 PM approximation
  
  // Friday after sunset through Saturday before sunset = Sabbath
  if (day === 5 && hour >= sunsetHour) {
    return 'sabbath';
  }
  if (day === 6 && hour < sunsetHour) {
    return 'sabbath';
  }
  
  // Saturday after sunset = Reflection
  if (day === 6 && hour >= sunsetHour) {
    return 'reflection';
  }
  
  // Sunday = Reflection continues
  if (day === 0) {
    return 'reflection';
  }
  
  // Monday, Tuesday = Carrying forward
  if (day === 1 || day === 2) {
    return 'carrying';
  }
  
  // Wednesday, Thursday, Friday before sunset = Preparation
  return 'preparation';
}

export function SabbathRhythmStrip() {
  const phase = useMemo(() => getSabbathPhase(), []);
  const config = phaseConfigs[phase];
  const Icon = config.icon;
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg border border-border/50 backdrop-blur-sm",
        "bg-gradient-to-r",
        config.gradient
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          "bg-background/50 backdrop-blur-sm border border-border/50"
        )}>
          <Icon className={cn("h-5 w-5", config.textColor)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold text-sm", config.textColor)}>
            {config.label}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {config.subtitle}
          </p>
        </div>
        
        {/* Decorative dots showing week rhythm */}
        <div className="hidden sm:flex items-center gap-1">
          {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((d, i) => {
            const isActive = 
              (phase === 'preparation' && i <= 2) ||
              (phase === 'sabbath' && i === 3) ||
              (phase === 'reflection' && i === 4) ||
              (phase === 'carrying' && i >= 5);
            
            return (
              <div 
                key={i}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all",
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
