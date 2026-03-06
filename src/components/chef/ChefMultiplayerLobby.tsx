import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, ChefHat, Loader2, Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useChefMultiplayer, TeamFormat } from "@/hooks/useChefMultiplayer";

interface Props {
  game: ReturnType<typeof useChefMultiplayer>;
}

export function ChefMultiplayerLobby({ game }: Props) {
  const [joinCode, setJoinCode] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<TeamFormat>("teams");
  const [joining, setJoining] = useState(false);

  const handleCreate = async () => {
    await game.createRoom(20, { format: selectedFormat });
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    await game.joinRoom(joinCode);
    setJoining(false);
  };

  const copyCode = () => {
    if (game.room?.room_code) {
      navigator.clipboard.writeText(game.room.room_code);
      toast.success("Room code copied!");
    }
  };

  // If in a room, show waiting room
  if (game.room) {
    return (
      <Card className="border-2 border-orange-300 dark:border-orange-700">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">🍳</div>
          <CardTitle className="text-2xl">Chef Challenge Kitchen</CardTitle>
          <CardDescription>
            Share the code below to invite players
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-2xl px-6 py-2 font-mono tracking-widest">
              {game.room.room_code}
            </Badge>
            <Button variant="ghost" size="icon" onClick={copyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Players list */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Players ({game.players.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {game.players.map(p => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border">
                  {p.user_id === game.room?.host_id && <Crown className="h-4 w-4 text-yellow-500" />}
                  <span className="text-sm truncate">{p.display_name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Format selection (host only) */}
          {game.isHost && (
            <div className="space-y-3">
              <h3 className="font-semibold">Game Format</h3>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "teams" as TeamFormat, label: "4 Teams", desc: "2-5 per team", icon: "👥" },
                  { value: "solo" as TeamFormat, label: "Free-for-all", desc: "Up to 8", icon: "🧑‍🍳" },
                  { value: "pairs" as TeamFormat, label: "Pairs", desc: "Up to 10 teams", icon: "👫" },
                ] as const).map(fmt => (
                  <Button
                    key={fmt.value}
                    variant={selectedFormat === fmt.value ? "default" : "outline"}
                    onClick={() => setSelectedFormat(fmt.value)}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="text-xl">{fmt.icon}</span>
                    <span className="text-xs font-bold">{fmt.label}</span>
                    <span className="text-[10px] opacity-70">{fmt.desc}</span>
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => game.startGame(selectedFormat)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                disabled={game.players.length < 2}
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Start Cooking! ({game.players.length} players)
              </Button>
              {game.players.length < 2 && (
                <p className="text-center text-xs text-muted-foreground">Need at least 2 players to start</p>
              )}
            </div>
          )}

          {!game.isHost && (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-muted-foreground">Waiting for host to start the game...</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // No room yet — create or join
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 transition-colors">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">👨‍🍳</div>
          <CardTitle>Create Kitchen</CardTitle>
          <CardDescription>Host a new multiplayer Chef Challenge</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCreate}
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={game.loading}
          >
            {game.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChefHat className="mr-2 h-4 w-4" />}
            Create Room
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 transition-colors">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <CardTitle>Join Kitchen</CardTitle>
          <CardDescription>Enter a room code to join</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter room code..."
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            className="text-center font-mono text-lg tracking-widest"
            maxLength={6}
          />
          <Button
            onClick={handleJoin}
            className="w-full"
            variant="outline"
            disabled={!joinCode.trim() || joining}
          >
            {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Join Room
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
