import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useVoiceQuality, VOICE_QUALITY_TIERS, VoiceQualityTier } from '@/hooks/useVoiceQuality';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface VoiceQualitySelectorProps {
  className?: string;
  /** Compact mode shows just the tier badge */
  compact?: boolean;
  onTierChange?: (tier: VoiceQualityTier) => void;
}

export function VoiceQualitySelector({ className, compact = true, onTierChange }: VoiceQualitySelectorProps) {
  const { selectedTier, setTier, isLoggedIn } = useVoiceQuality();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const currentConfig = VOICE_QUALITY_TIERS.find(t => t.tier === selectedTier) || VOICE_QUALITY_TIERS[0];

  const handleSelect = (tier: VoiceQualityTier) => {
    if (tier !== 'standard' && !user) {
      toast.info('Sign in to access HD and Premium voices');
      return;
    }
    setTier(tier);
    onTierChange?.(tier);
    setOpen(false);
  };

  const tierColors: Record<VoiceQualityTier, string> = {
    standard: 'bg-muted text-muted-foreground border-border',
    hd: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    premium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors hover:brightness-125',
            tierColors[selectedTier],
            className
          )}
          title="Voice quality"
        >
          {compact ? currentConfig.tier === 'premium' ? 'PRO' : currentConfig.label.toUpperCase() : (
            <>
              <span>{currentConfig.icon}</span>
              <span>{currentConfig.label}</span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start" side="top">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-2 pb-1">Voice Quality</p>
          {VOICE_QUALITY_TIERS.map((config) => {
            const isLocked = config.tier !== 'standard' && !user;
            const isActive = config.tier === selectedTier;

            return (
              <button
                key={config.tier}
                onClick={() => handleSelect(config.tier)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all',
                  isActive
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-accent/50 border border-transparent',
                  isLocked && 'opacity-60'
                )}
              >
                <span className="text-base">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{config.label}</span>
                    {config.creditCost > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {config.creditCost} credit{config.creditCost > 1 ? 's' : ''}
                      </span>
                    )}
                    {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {config.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
