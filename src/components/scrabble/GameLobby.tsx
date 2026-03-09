// PT Scrabble Game Lobby
// Create or join a game

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Play,
  Copy,
  QrCode,
  Crown,
  Loader2,
  Gamepad2,
  Megaphone,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import type { ScrabbleGame, ScrabblePlayer } from '@/types/scrabble';
import { getTotalCardCount } from '@/data/scrabbleCards';
import { cn } from '@/lib/utils';
import { CallToPlayButton } from './CallToPlayButton';
import { QuickShareCode } from './QuickShareCode';
import { useSubscription } from '@/hooks/useSubscription';
import { QRCodeDisplay } from '@/components/ui/qr-code-display';

interface GameLobbyProps {
  game?: ScrabbleGame | null;
  players: ScrabblePlayer[];
  isHost: boolean;
  isLoading: boolean;
  onCreateGame: (mode: 'ffa' | 'team', maxPlayers: number) => Promise<string | null>;
  onJoinGame: (roomCode: string) => Promise<boolean>;
  onStartGame: () => Promise<boolean>;
  // Presence features for "Call to Play"
  onlineCount?: number;
  isOnline?: boolean;
  onBroadcastInvitation?: () => void;
}

export function GameLobby({
  game,
  players,
  isHost,
  isLoading,
  onCreateGame,
  onJoinGame,
  onStartGame,
  onlineCount = 0,
  isOnline = false,
  onBroadcastInvitation,
}: GameLobbyProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [gameMode, setGameMode] = useState<'ffa' | 'team'>('ffa');
  const [maxPlayers, setMaxPlayers] = useState(60);
  const [joinCode, setJoinCode] = useState('');
  const { subscription } = useSubscription();
  const isSubscriber = subscription.hasAccess;

  const handleCreate = async () => {
    await onCreateGame(gameMode, maxPlayers);
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast.error('Enter a room code');
      return;
    }
    await onJoinGame(joinCode.trim().toUpperCase());
  };

  const copyRoomCode = () => {
    if (game?.roomCode) {
      navigator.clipboard.writeText(game.roomCode);
      toast.success('Room code copied!');
    }
  };

  // If we're in a game waiting room
  if (game && game.status === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">PT Scrabble</CardTitle>
            <CardDescription>
              Waiting for players to join...
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Room Code */}
            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <span className="text-3xl font-mono font-bold tracking-wider">
                {game.roomCode}
              </span>
              <Button size="icon" variant="ghost" onClick={copyRoomCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">
                Share this code with other players to join
              </p>
            </div>

            {/* QR Code for instant join */}
            <div className="flex justify-center">
              <QRCodeDisplay
                value={`${window.location.origin}/scrabble?join=${game.roomCode}`}
                variant="compact"
                label="Scan to join PT Scrabble"
              />
            </div>

            {/* Quick share via DM */}
            <div className="flex justify-center">
              <QuickShareCode roomCode={game.roomCode} />
            </div>

            {/* Call to Play button - broadcast to online users */}
            {isHost && onBroadcastInvitation && (
              <div className="flex justify-center">
                <CallToPlayButton
                  onlineCount={onlineCount}
                  isOnline={isOnline}
                  onBroadcast={onBroadcastInvitation}
                />
              </div>
            )}

            {/* Players list */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Players ({players.length}/{game.maxPlayers})
              </Label>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg',
                      player.userId === game.hostUserId
                        ? 'bg-yellow-500/10 border border-yellow-500/30'
                        : 'bg-muted'
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatarUrl} />
                      <AvatarFallback>
                        {player.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.displayName}</span>
                    {player.userId === game.hostUserId && (
                      <Crown className="h-4 w-4 text-yellow-500 ml-auto" />
                    )}
                  </motion.div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.min(3, game.maxPlayers - players.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/50"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">Waiting...</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Game info */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Mode: {game.gameMode === 'ffa' ? 'Free for All' : 'Teams'}</span>
              <span>{getTotalCardCount()} cards in deck</span>
            </div>

            {/* Start button (host only) */}
            {isHost && (
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                size="lg"
                onClick={onStartGame}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start Game {players.length === 1 ? '(Solo)' : `(${players.length} players)`}
              </Button>
            )}

            {!isHost && (
              <p className="text-center text-sm text-muted-foreground">
                Waiting for the host to start the game...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create or join form
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">PT Scrabble</CardTitle>
          <CardDescription>
            Build biblical connections in a multiplayer Scrabble-style game
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              className={cn(
                'flex-1 py-3 text-center transition-colors',
                mode === 'create'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
              onClick={() => setMode('create')}
            >
              Create Game
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-center transition-colors',
                mode === 'join'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
              onClick={() => setMode('join')}
            >
              Join Game
            </button>
          </div>

          {mode === 'create' ? (
            <div className="space-y-4">
              {/* Game mode */}
              <div className="space-y-2">
                <Label>Game Mode</Label>
                <RadioGroup
                  value={gameMode}
                  onValueChange={(v) => setGameMode(v as 'ffa' | 'team')}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="ffa"
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      gameMode === 'ffa'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <RadioGroupItem value="ffa" id="ffa" className="sr-only" />
                    <Users className="h-6 w-6" />
                    <span className="font-medium">Free for All</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Everyone plays individually
                    </span>
                  </Label>
                  <Label
                    htmlFor="team"
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      gameMode === 'team'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <RadioGroupItem value="team" id="team" className="sr-only" />
                    <Users className="h-6 w-6" />
                    <span className="font-medium">Teams</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Play in teams of 3-5
                    </span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Max players */}
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min={2}
                  max={60}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Math.min(60, parseInt(e.target.value) || 60))}
                />
              </div>

              {!isSubscriber && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  <span>Only subscribers can create games. You can still join games!</span>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCreate}
                disabled={isLoading || !isSubscriber}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isSubscriber ? 'Create Game' : 'Subscribe to Create'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinCode">Room Code</Label>
                <Input
                  id="joinCode"
                  placeholder="Enter 6-character code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleJoin}
                disabled={isLoading || joinCode.length !== 6}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Join Game
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>{getTotalCardCount()} Phototheology principle cards</p>
            <p>Supports 2-20 players</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
