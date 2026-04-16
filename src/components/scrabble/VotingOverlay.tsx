// PT Scrabble Voting Overlay
// Shows when a move is being voted on

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleMove, ScrabblePlayer } from '@/types/scrabble';
import { getCardById } from '@/data/scrabbleCards';
import { SCRABBLE_SCORING } from '@/types/scrabble';
import { cn } from '@/lib/utils';

interface VotingOverlayProps {
  move: ScrabbleMove;
  players: ScrabblePlayer[];
  currentPlayerId?: string;
  onVote: (approve: boolean) => void;
  hasVoted: boolean;
}

export function VotingOverlay({
  move,
  players,
  currentPlayerId,
  onVote,
  hasVoted,
}: VotingOverlayProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Calculate time remaining
  useEffect(() => {
    if (!move.votingEndsAt) return;

    const updateTimer = () => {
      const endTime = new Date(move.votingEndsAt!).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [move.votingEndsAt]);

  const card = getCardById(move.cardId);
  const player = players.find(p => p.id === move.playerId);
  const isMyMove = move.playerId === currentPlayerId;

  const totalVoters = players.length - 1; // Exclude the player who placed
  const totalVotes = move.votesApprove + move.votesReject;
  const approvalPercentage = totalVotes > 0
    ? Math.round((move.votesApprove / totalVotes) * 100)
    : 0;
  const threshold = Math.round(SCRABBLE_SCORING.VOTE_THRESHOLD * 100);

  const timerColor = (timeLeft ?? 15) <= 5 ? 'text-red-500' : (timeLeft ?? 15) <= 10 ? 'text-yellow-500' : 'text-green-500';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold">Vote on Connection</h2>
          <p className="text-sm text-muted-foreground">
            {player?.displayName || 'Player'} placed a card
          </p>
        </div>

        {/* Timer */}
        <div className={cn('flex items-center justify-center gap-2', timerColor)}>
          <Clock className="h-5 w-5" />
          <span className="text-2xl font-mono font-bold">
            {timeLeft !== null ? `${timeLeft}s` : '--'}
          </span>
        </div>

        {/* Card being placed */}
        <div className="flex items-center gap-4 justify-center">
          {card && <ScrabbleTile card={card} size="lg" />}
        </div>

        {/* Connections explanation */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Connections Claimed ({move.connections.length})
          </h3>

          {move.connections.map((conn, i) => {
            const targetCard = getCardById(conn.targetCardId);
            return (
              <div key={i} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {targetCard && (
                    <span className="text-xs font-medium bg-primary/20 px-2 py-0.5 rounded">
                      {targetCard.code} - {targetCard.name}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground capitalize">
                    ({conn.direction})
                  </span>
                </div>
                <p className="text-sm">{conn.explanation || 'No explanation provided'}</p>
              </div>
            );
          })}

          {move.isChristConnection && (
            <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded text-purple-500 text-sm">
              <span>Christ Connection claimed (2x multiplier)</span>
            </div>
          )}
        </div>

        {/* Potential points */}
        <div className="flex items-center justify-center gap-2 text-lg">
          <span>Potential Points:</span>
          <span className="font-bold text-yellow-500">{move.pointsBase}</span>
        </div>

        {/* Vote progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {totalVotes}/{totalVoters} voted
            </span>
            <span>
              {approvalPercentage}% approval
              <span className="text-muted-foreground ml-1">
                (need {threshold}%)
              </span>
            </span>
          </div>
          <Progress value={approvalPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">
              <ThumbsUp className="h-3 w-3 inline mr-1" />
              {move.votesApprove}
            </span>
            <span className="text-red-500">
              <ThumbsDown className="h-3 w-3 inline mr-1" />
              {move.votesReject}
            </span>
          </div>
        </div>

        {/* Vote buttons */}
        {!isMyMove && !hasVoted && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-red-500/50 hover:bg-red-500/10 text-red-500"
              onClick={() => onVote(false)}
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              Reject
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onVote(true)}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Approve
            </Button>
          </div>
        )}

        {isMyMove && (
          <p className="text-center text-sm text-muted-foreground">
            Waiting for other players to vote...
          </p>
        )}

        {hasVoted && !isMyMove && (
          <p className="text-center text-sm text-green-500">
            Your vote has been recorded!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
