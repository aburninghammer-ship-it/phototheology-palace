import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Users, Loader2, Crown, Droplets, Swords } from "lucide-react";
import { toast } from "sonner";
import type { GideonSettings, GideonTournament } from "@/types/gideon";
import type { GameRoom, GameRoomPlayer } from "@/hooks/useGameMultiplayer";
import { MIN_PLAYERS, MAX_PLAYERS_DEFAULT } from "@/types/gideon";

interface GideonLobbyProps {
  room: GameRoom | null;
  players: GameRoomPlayer[];
  tournament: GideonTournament | null;
  isHost: boolean;
  loading: boolean;
  accessTier: "full_suite" | "friday_pass";
  onCreateRoom: (settings: GideonSettings) => Promise<void>;
  onJoinRoom: (code: string) => Promise<any>;
  onStartTournament: () => Promise<void>;
  onLeaveRoom: () => void;
}

export function GideonLobby({
  room,
  players,
  tournament,
  isHost,
  loading,
  accessTier,
  onCreateRoom,
  onJoinRoom,
  onStartTournament,
  onLeaveRoom,
}: GideonLobbyProps) {
  const [joinCode, setJoinCode] = useState("");
  const [settings, setSettings] = useState<GideonSettings>({
    theme: "general",
    difficulty_tier: "standard",
    pt_room_focus: [],
    max_rounds: 8,
    timer_mode: "standard",
    false_prophet_round: false,
    max_players: MAX_PLAYERS_DEFAULT,
  });

  const isGenerating = tournament?.round_phase === "generating";
  const canStart = players.length >= MIN_PLAYERS && isHost && !isGenerating;

  const copyRoomCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      toast.success("Room code copied!");
    }
  };

  if (room) {
    return (
      <div className="space-y-4">
        {/* Room Code Display */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Room Code</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-mono font-bold tracking-widest">
                    {room.room_code}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyRoomCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{players.length} / {room.max_players}</span>
                </div>
                {accessTier === "friday_pass" && (
                  <Badge variant="outline" className="mt-1 text-amber-500 border-amber-500">
                    Friday Night Pass
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Swords className="w-5 h-5" /> Warriors Assembled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {player.player_index === 0 && <Crown className="w-4 h-4 text-amber-500" />}
                    <span className="font-medium">{player.display_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, MIN_PLAYERS - players.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="p-3 rounded-lg border border-dashed border-muted-foreground/20 text-muted-foreground text-center text-sm">
                  Waiting for warrior...
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              {isHost ? (
                <Button
                  className="flex-1"
                  onClick={onStartTournament}
                  disabled={!canStart || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Swords className="w-4 h-4 mr-2" />
                      Start Tournament ({players.length}/{MIN_PLAYERS} min)
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex-1 text-center p-3 rounded-lg bg-muted/50 text-muted-foreground">
                  {isGenerating ? "Host is generating questions..." : "Waiting for host to start..."}
                </div>
              )}
              <Button variant="outline" onClick={onLeaveRoom}>
                Leave
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create or Join Tabs
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Room</TabsTrigger>
        <TabsTrigger value="join">Join Room</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Tournament Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(v) => setSettings((s) => ({ ...s, theme: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Knowledge</SelectItem>
                  <SelectItem value="prophecy">Prophecy Focus</SelectItem>
                  <SelectItem value="sanctuary">Sanctuary Focus</SelectItem>
                  <SelectItem value="typology">Typology & Gems</SelectItem>
                  <SelectItem value="apologetics">Apologetics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <Select value={settings.difficulty_tier} onValueChange={(v: any) => setSettings((s) => ({ ...s, difficulty_tier: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (25s start)</SelectItem>
                  <SelectItem value="advanced">Advanced (20s start)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rounds</Label>
              <Select value={String(settings.max_rounds)} onValueChange={(v) => setSettings((s) => ({ ...s, max_rounds: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Rounds</SelectItem>
                  <SelectItem value="7">7 Rounds</SelectItem>
                  <SelectItem value="8">8 Rounds (Full)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Players</Label>
              <Select value={String(settings.max_players)} onValueChange={(v) => setSettings((s) => ({ ...s, max_players: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 Players</SelectItem>
                  <SelectItem value="12">12 Players</SelectItem>
                  <SelectItem value="16">16 Players</SelectItem>
                  <SelectItem value="20">20 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>False Prophet Round</Label>
              <Switch
                checked={settings.false_prophet_round}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, false_prophet_round: v }))}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => onCreateRoom(settings)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Swords className="w-4 h-4 mr-2" />
              )}
              Create Gideon Room
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="join">
        <Card>
          <CardHeader>
            <CardTitle>Join Tournament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Room Code</Label>
              <Input
                placeholder="Enter 6-character code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-xl font-mono tracking-widest"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => onJoinRoom(joinCode)}
              disabled={joinCode.length < 6 || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Join Room
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
