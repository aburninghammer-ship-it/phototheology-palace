// PT Scrabble Voting Panel
// Non-blocking panel showing all pending votes
// Players can continue placing cards while voting happens

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleMove, ScrabblePlayer } from '@/types/scrabble';
import { getCardById } from '@/data/scrabbleCards';
import { SCRABBLE_SCORING } from '@/types/scrabble';
import { cn } from '@/lib/utils';

interface VotingPanelProps {
  pendingMoves: ScrabbleMove[];
  players: ScrabblePlayer[];
  currentPlayerId?: string;
  myVotes: Record<string, boolean>;
  onVote: (moveId: string, approve: boolean) => void;
}

function MoveVoteCard({
  move,
  players,
  currentPlayerId,
  hasVoted,
  onVote,
}: {
  move: ScrabbleMove;
  players: ScrabblePlayer[];
  currentPlayerId?: string;
  hasVoted: boolean;
  onVote: (moveId: string, approve: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

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

  const totalVoters = players.length - 1;
  const totalVotes = move.votesApprove + move.votesReject;
  const approvalPercentage = totalVotes > 0 ? Math.round((move.votesApprove / totalVotes) * 100) : 0;

  const timerColor = (timeLeft ?? 15) <= 5 ? 'text-red-500' : (timeLeft ?? 15) <= 10 ? 'text-yellow-500' : 'text-green-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-card border rounded-lg shadow-lg overflow-hidden"
    >
      {/* Compact header */}
      <div
        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {card && (
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                {card.code}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {player?.displayName || move.playerName || 'Player'}
              </p>
              <p className="text-xs text-muted-foreground">
                {move.connections.length} connection{move.connections.length !== 1 ? 's' : ''} · {move.pointsBase}pts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('font-mono text-sm font-bold', timerColor)}>
              {timeLeft !== null ? `${timeLeft}s` : '--'}
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {/* Progress bar always visible */}
        <div className="mt-2">
          <Progress value={approvalPercentage} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-green-500">{move.votesApprove}↑</span>
            <span>{totalVotes}/{totalVoters}</span>
            <span className="text-red-500">{move.votesReject}↓</span>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3 border-t">
              {/* Connections */}
              <div className="space-y-2">
                {move.connections.map((conn, i) => {
                  const targetCard = getCardById(conn.targetCardId);
                  return (
                    <div key={i} className="p-2 bg-muted rounded text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium">{targetCard?.code}</span>
                        <span className="text-muted-foreground">({conn.direction})</span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">
                        {conn.explanation || 'No explanation'}
                      </p>
                    </div>
                  );
                })}

                {move.isChristConnection && (
                  <div className="flex items-center gap-1 p-2 bg-purple-500/10 rounded text-purple-500 text-xs">
                    <Sparkles className="h-3 w-3" />
                    Christ Connection (2x)
                  </div>
                )}
              </div>

              {/* Vote buttons */}
              {!isMyMove && !hasVoted && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-500/50 hover:bg-red-500/10 text-red-500 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVote(move.id, false);
                    }}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVote(move.id, true);
                    }}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                </div>
              )}

              {isMyMove && (
                <p className="text-center text-xs text-muted-foreground">
                  Waiting for votes...
                </p>
              )}

              {hasVoted && !isMyMove && (
                <p className="text-center text-xs text-green-500">
                  Voted!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function VotingPanel({
  pendingMoves,
  players,
  currentPlayerId,
  myVotes,
  onVote,
}: VotingPanelProps) {
  if (pendingMoves.length === 0) return null;

  return (
    <div className="fixed right-2 md:right-4 top-20 bottom-44 w-56 md:w-72 z-30 flex flex-col gap-2 overflow-y-auto pointer-events-none">
      <div className="text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded pointer-events-auto">
        {pendingMoves.length} pending vote{pendingMoves.length !== 1 ? 's' : ''}
      </div>

      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {pendingMoves.map(move => (
            <MoveVoteCard
              key={move.id}
              move={move}
              players={players}
              currentPlayerId={currentPlayerId}
              hasVoted={move.id in myVotes}
              onVote={onVote}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
