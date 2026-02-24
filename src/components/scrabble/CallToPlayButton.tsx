// Call to Play Button
// Shows online user count and broadcasts game invitations

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Megaphone, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CallToPlayButtonProps {
  onlineCount: number;
  isOnline: boolean;
  onBroadcast: () => void;
  disabled?: boolean;
  className?: string;
}

export function CallToPlayButton({
  onlineCount,
  isOnline,
  onBroadcast,
  disabled = false,
  className,
}: CallToPlayButtonProps) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showSent, setShowSent] = useState(false);

  const handleClick = async () => {
    if (disabled || !isOnline || onlineCount === 0) return;

    setIsBroadcasting(true);

    // Simulate slight delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    onBroadcast();

    setIsBroadcasting(false);
    setShowSent(true);

    // Reset after 3 seconds
    setTimeout(() => setShowSent(false), 3000);
  };

  const isDisabled = disabled || !isOnline || onlineCount === 0;

  return (
    <div className={cn('relative', className)}>
      {/* Online indicator badge */}
      <div className={cn(
        'absolute -top-2 -right-2 z-10',
        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        isOnline && onlineCount > 0
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      )}>
        <motion.div
          className={cn(
            'w-2 h-2 rounded-full',
            isOnline && onlineCount > 0 ? 'bg-green-400' : 'bg-gray-400'
          )}
          animate={isOnline && onlineCount > 0 ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span>{onlineCount} online</span>
      </div>

      <Button
        onClick={handleClick}
        disabled={isDisabled}
        variant="outline"
        className={cn(
          'relative overflow-hidden h-14 px-6',
          'border-2 transition-all duration-300',
          !isDisabled && 'border-purple-400/50 hover:border-purple-400 hover:bg-purple-500/10',
          isDisabled && 'border-gray-500/30 opacity-50',
          showSent && 'border-green-400/50 bg-green-500/10'
        )}
      >
        <AnimatePresence mode="wait">
          {showSent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-green-400"
            >
              <Check className="h-5 w-5" />
              <span>Invitation Sent!</span>
            </motion.div>
          ) : isBroadcasting ? (
            <motion.div
              key="broadcasting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending...</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Megaphone className="h-5 w-5" />
              <span>Call to Play</span>
              <Users className="h-4 w-4 ml-1 opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple effect on broadcast */}
        {showSent && (
          <motion.div
            className="absolute inset-0 bg-green-400/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </Button>

      {/* Helper text */}
      {!isOnline && (
        <p className="text-xs text-muted-foreground text-center mt-1">
          Connecting...
        </p>
      )}
      {isOnline && onlineCount === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-1">
          No other users online
        </p>
      )}
    </div>
  );
}
