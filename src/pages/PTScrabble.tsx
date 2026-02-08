// PT Scrabble Page
// Main game page for PT Scrabble

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useScrabbleGame } from '@/hooks/useScrabbleGame';
import {
  ScrabbleBoard,
  PlayerHandBar,
  GameLobby,
  ConnectionModal,
  VotingOverlay,
} from '@/components/scrabble';
import type { ScrabbleCard, BoardPosition, Connection, PlacedCard } from '@/types/scrabble';
import { positionKey } from '@/types/scrabble';

export default function PTScrabble() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const gameIdFromUrl = searchParams.get('game');
  const [gameId, setGameId] = useState<string | undefined>(gameIdFromUrl || undefined);

  const {
    game,
    players,
    myPlayer,
    myHand,
    currentMove,
    isLoading,
    error,
    createGame,
    joinGame,
    startGame,
    placeCard,
    vote,
    getValidPositions,
    getAdjacentCards,
  } = useScrabbleGame(gameId);

  // UI State
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<BoardPosition | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Handle game creation
  const handleCreateGame = async (mode: 'ffa' | 'team', maxPlayers: number) => {
    const newGameId = await createGame(mode, maxPlayers);
    if (newGameId) {
      setGameId(newGameId);
      navigate(`/pt-scrabble?game=${newGameId}`, { replace: true });
    }
    return newGameId;
  };

  // Handle joining
  const handleJoinGame = async (roomCode: string) => {
    const success = await joinGame(roomCode);
    if (success && game) {
      setGameId(game.id);
      navigate(`/pt-scrabble?game=${game.id}`, { replace: true });
    }
    return success;
  };

  // Handle card selection
  const handleCardSelect = (card: ScrabbleCard) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
    setSelectedPosition(null);
  };

  // Handle position click
  const handlePositionClick = (position: BoardPosition) => {
    if (!selectedCard) return;

    setSelectedPosition(position);
    setShowConnectionModal(true);
  };

  // Handle connection submission
  const handleConnectionSubmit = async (
    connections: Connection[],
    explanation: string,
    isChristConnection: boolean
  ) => {
    if (!selectedCard || !selectedPosition) return;

    const success = await placeCard(
      selectedCard,
      selectedPosition,
      connections,
      explanation,
      isChristConnection
    );

    if (success) {
      setSelectedCard(null);
      setSelectedPosition(null);
      setShowConnectionModal(false);
    }
  };

  // Handle voting
  const handleVote = async (approve: boolean) => {
    if (!currentMove) return;
    const success = await vote(currentMove.id, approve);
    if (success) {
      setHasVoted(true);
    }
  };

  // Reset vote state when current move changes
  useEffect(() => {
    setHasVoted(false);
  }, [currentMove?.id]);

  // Get adjacent cards for connection modal
  const adjacentCards: PlacedCard[] = selectedPosition && game
    ? getAdjacentCards(selectedPosition)
    : [];

  // Check if current user is host
  const isHost = user?.id === game?.hostUserId;

  // Show lobby if no game or game is waiting
  if (!game || game.status === 'waiting') {
    return (
      <GameLobby
        game={game}
        players={players}
        isHost={isHost}
        isLoading={isLoading}
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        onStartGame={startGame}
      />
    );
  }

  // Game completed
  if (game.status === 'completed') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
          <h1 className="text-3xl font-bold">Game Over!</h1>
          <div className="space-y-2">
            <p className="text-xl">
              Winner: <span className="font-bold text-yellow-500">{winner?.displayName}</span>
            </p>
            <p className="text-2xl font-bold">{winner?.score} points</p>
          </div>

          {/* Leaderboard */}
          <div className="bg-card border rounded-lg p-4 max-w-sm mx-auto">
            <h3 className="font-medium mb-3 flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Final Standings
            </h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 rounded bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    {player.displayName}
                  </span>
                  <span className="font-bold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate('/games')}>
              Back to Games
            </Button>
            <Button onClick={() => {
              setGameId(undefined);
              navigate('/pt-scrabble', { replace: true });
            }}>
              Play Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active game
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/games')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Room: <span className="font-mono font-bold">{game.roomCode}</span>
          </span>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{players.length}</span>
          </div>
        </div>

        {/* Mini scoreboard */}
        <div className="flex gap-2">
          {players.slice(0, 3).map((player, i) => (
            <div
              key={player.id}
              className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
            >
              <span className={player.userId === user?.id ? 'font-bold text-primary' : ''}>
                {player.displayName.slice(0, 8)}
              </span>
              <span className="text-yellow-500">{player.score}</span>
            </div>
          ))}
          {players.length > 3 && (
            <span className="text-xs text-muted-foreground">+{players.length - 3}</span>
          )}
        </div>
      </header>

      {/* Game board */}
      <div className="flex-1 min-h-0 pb-40">
        <ScrabbleBoard
          boardState={game.boardState}
          selectedCard={selectedCard}
          onPositionClick={handlePositionClick}
          validPositions={selectedCard ? getValidPositions() : []}
        />
      </div>

      {/* Player hand */}
      <PlayerHandBar
        cards={myHand}
        selectedCard={selectedCard}
        onCardSelect={handleCardSelect}
        disabled={!!currentMove && currentMove.validationStatus === 'voting'}
        score={myPlayer?.score || 0}
      />

      {/* Connection modal */}
      <AnimatePresence>
        {showConnectionModal && selectedCard && selectedPosition && (
          <ConnectionModal
            isOpen={showConnectionModal}
            onClose={() => {
              setShowConnectionModal(false);
              setSelectedPosition(null);
            }}
            onSubmit={handleConnectionSubmit}
            card={selectedCard}
            position={selectedPosition}
            adjacentCards={adjacentCards}
          />
        )}
      </AnimatePresence>

      {/* Voting overlay */}
      <AnimatePresence>
        {currentMove && currentMove.validationStatus === 'voting' && (
          <VotingOverlay
            move={currentMove}
            players={players}
            currentPlayerId={myPlayer?.id}
            onVote={handleVote}
            hasVoted={hasVoted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
