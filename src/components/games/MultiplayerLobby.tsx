import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Copy, Check, Loader2, Crown, Wifi, ArrowLeft, Lock } from "lucide-react";
import { QRCodeDisplay } from "@/components/ui/qr-code-display";
import { toast } from "sonner";
import { GameRoom, GameRoomPlayer } from "@/hooks/useGameMultiplayer";
import { motion } from "framer-motion";
import { QuickShareCode } from "@/components/scrabble/QuickShareCode";
import { CallToPlayButton } from "@/components/scrabble/CallToPlayButton";
import { useSubscription } from "@/hooks/useSubscription";

interface MultiplayerLobbyProps {
  room: GameRoom | null;
  players: GameRoomPlayer[];
  loading: boolean;
  isHost: boolean;
  minPlayers?: number;
  maxPlayers?: number;
  gameName: string;
  onCreateRoom: (maxPlayers?: number) => Promise<GameRoom | null>;
  onJoinRoom: (code: string) => Promise<GameRoom | null>;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onBack: () => void;
  onBroadcastInvitation?: () => void;
  onlineCount?: number;
  isOnline?: boolean;
}

export function MultiplayerLobby({
  room,
  players,
  loading,
  isHost,
  minPlayers = 2,
  maxPlayers = 2,
  gameName,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onLeaveRoom,
  onBack,
  onBroadcastInvitation,
  onlineCount = 0,
  isOnline = false,
}: MultiplayerLobbyProps) {
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { subscription } = useSubscription();
  const isSubscriber = subscription.hasAccess;

  const copyRoomCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.room_code);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Not yet in a room — show create/join
  if (!room) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="bg-black/40 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-purple-400 text-center flex items-center justify-center gap-2">
              <Wifi className="h-5 w-5" />
              Online Multiplayer
            </CardTitle>
            <CardDescription className="text-center text-purple-200/80">
              Play {gameName} with friends online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-900/50">
                <TabsTrigger value="create">Create Room</TabsTrigger>
                <TabsTrigger value="join">Join Room</TabsTrigger>
              </TabsList>
              <TabsContent value="create" className="space-y-4 pt-4">
                <p className="text-sm text-purple-200/70 text-center">
                  Create a room and invite friends with a code
                </p>
                {!isSubscriber && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm">
                    <Lock className="h-4 w-4 flex-shrink-0" />
                    <span>Only subscribers can create games. You can still join games!</span>
                  </div>
                )}
                <Button
                  onClick={() => onCreateRoom(maxPlayers)}
                  disabled={loading || !isSubscriber}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Users className="h-4 w-4 mr-2" />}
                  {isSubscriber ? 'Create Room' : 'Subscribe to Create'}
                </Button>
              </TabsContent>
              <TabsContent value="join" className="space-y-4 pt-4">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code"
                  maxLength={6}
                  className="text-center text-xl tracking-widest bg-purple-900/30 border-purple-500/50 text-white"
                />
                <Button
                  onClick={() => onJoinRoom(joinCode)}
                  disabled={loading || joinCode.length < 4}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Join Room
                </Button>
              </TabsContent>
            </Tabs>
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full mt-4 text-purple-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to mode select
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // In a room — show lobby
  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-black/40 border-purple-500/50">
        <CardHeader>
          <CardTitle className="text-purple-400 text-center">
            {gameName} — Lobby
          </CardTitle>
          <CardDescription className="text-center text-purple-200/80">
            Share the room code with friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Room Code */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold tracking-[0.3em] text-white bg-purple-900/50 px-6 py-3 rounded-lg">
              {room.room_code}
            </span>
            <Button variant="outline" size="icon" onClick={copyRoomCode} className="border-purple-500/50">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* QR Code for instant join */}
          <div className="flex justify-center">
            <QRCodeDisplay
              value={`${window.location.origin}/games?join=${room.room_code}`}
              variant="compact"
              label="Scan to join this game instantly"
            />
          </div>

          {/* Share buttons */}
          {isHost && (
            <div className="flex items-center justify-center gap-2">
              <QuickShareCode roomCode={room.room_code} gameName={gameName} />
              {onBroadcastInvitation && (
                <CallToPlayButton
                  onlineCount={onlineCount}
                  isOnline={isOnline}
                  onBroadcast={onBroadcastInvitation}
                />
              )}
            </div>
          )}

          {/* Players */}
          <div className="space-y-2">
            <p className="text-sm text-purple-300 font-medium">
              Players ({players.length}/{room.max_players})
            </p>
            {players.map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/30"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx === 0 ? 'bg-purple-600' : 'bg-indigo-600'
                }`}>
                  {player.display_name[0]?.toUpperCase()}
                </div>
                <span className="text-white flex-1">{player.display_name}</span>
                {player.user_id === room.host_id && (
                  <Badge className="bg-yellow-600/50 text-yellow-200 text-xs">
                    <Crown className="h-3 w-3 mr-1" /> Host
                  </Badge>
                )}
              </motion.div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: room.max_players - players.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/20 border border-dashed border-purple-500/30">
                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-400/50" />
                </div>
                <span className="text-purple-400/50 italic">Waiting for player...</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {isHost && (
              <Button
                onClick={onStartGame}
                disabled={players.length < minPlayers}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {players.length < minPlayers
                  ? `Need ${minPlayers - players.length} more player${minPlayers - players.length > 1 ? 's' : ''}`
                  : "Start Game"}
              </Button>
            )}
            {!isHost && (
              <p className="text-center text-purple-300/70 text-sm animate-pulse">
                Waiting for host to start...
              </p>
            )}
            <Button
              variant="ghost"
              onClick={onLeaveRoom}
              className="w-full text-red-400 hover:text-red-300"
            >
              Leave Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
