import { cn } from "@/lib/utils";
import { getTierFromPoints, tierColors, tierLabels, AchievementTier } from "@/utils/achievementHelpers";
import { Gem, Medal, Award, Crown, Star } from "lucide-react";

interface TierBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const tierIcons: Record<AchievementTier, React.ComponentType<{ className?: string }>> = {
  bronze: Medal,
  silver: Medal,
  gold: Award,
  platinum: Crown,
  diamond: Gem,
};

export function TierBadge({ points, size = 'sm', showLabel = false, className }: TierBadgeProps) {
  const tier = getTierFromPoints(points);
  const style = tierColors[tier];
  const Icon = tierIcons[tier];

  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-gradient-to-br",
          style.gradient,
          sizeClasses[size]
        )}
      >
        <Icon className={cn("text-white", iconSizes[size])} />
      </div>
      {showLabel && (
        <span className={cn("font-medium", style.text, size === 'sm' ? 'text-xs' : 'text-sm')}>
          {tierLabels[tier]}
        </span>
      )}
    </div>
  );
}
