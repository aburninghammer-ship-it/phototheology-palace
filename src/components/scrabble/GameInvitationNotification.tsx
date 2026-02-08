// Game Invitation Notification
// Shows a popup when another user broadcasts a game invitation

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, X, Book, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GameInvitation } from '@/hooks/useGamePresence';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface GameInvitationNotificationProps {
  invitation: GameInvitation | null;
  onAccept: (invitation: GameInvitation) => void;
  onDismiss: () => void;
}

export function GameInvitationNotification({
  invitation,
  onAccept,
  onDismiss,
}: GameInvitationNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (!invitation) {
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [invitation?.id]);

  if (!invitation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-[100]',
          'w-[95vw] max-w-md',
          'bg-gradient-to-br from-purple-900/95 to-blue-900/95',
          'backdrop-blur-xl border border-purple-400/50',
          'rounded-2xl shadow-2xl shadow-purple-500/30',
          'overflow-hidden'
        )}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Users className="h-5 w-5 text-purple-300" />
              </motion.div>
              <span className="font-bold text-white">Game Invitation!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-sm',
                timeLeft <= 10 ? 'bg-red-500/30 text-red-300' : 'bg-purple-500/30 text-purple-300'
              )}>
                <Clock className="h-3 w-3" />
                <span>{timeLeft}s</span>
              </div>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Host info */}
          <p className="text-purple-200 mb-3">
            <span className="font-semibold text-white">{invitation.hostName}</span> wants to play Scrabble PT!
          </p>

          {/* Verse preview */}
          <div className="bg-black/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Book className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-300">
                {invitation.verse.reference}
              </span>
            </div>
            <p className="text-sm text-white/80 italic line-clamp-2">
              "{invitation.verse.text}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onDismiss}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Not now
            </Button>
            <Button
              onClick={() => onAccept(invitation)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Play className="h-4 w-4 mr-2" />
              Join Game
            </Button>
          </div>

          {/* Room code hint */}
          <p className="text-xs text-center text-white/50 mt-2">
            Room: {invitation.roomCode}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 30, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
