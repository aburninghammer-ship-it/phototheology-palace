import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Clock, Trophy, Lock, Play, Copy, Check, Crown, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface TeamMember {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
}

interface GroupEscapeRoomProps {
  roomId?: string;
  roomTitle?: string;
  difficulty?: "easy" | "medium" | "hard";
  maxPlayers?: number;
}

export const GroupEscapeRoom = ({ 
  roomId = "weekly",
  roomTitle = "Daniel's Prophecy Chamber",
  difficulty = "medium",
  maxPlayers = 4
}: GroupEscapeRoomProps) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [lobbyCode, setLobbyCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const createLobby = () => {
    // Generate a random lobby code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLobbyCode(code);
    setTeamMembers([{
      id: user?.id || "host",
      name: user?.email?.split("@")[0] || "Host",
      isHost: true,
      isReady: true
    }]);
    setIsCreating(true);
    toast.success("Lobby created! Share the code with your team.");
  };

  const joinLobby = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a lobby code");
      return;
    }
    // In production, this would connect to the actual lobby
    toast.success(`Joining lobby ${joinCode}...`);
    setLobbyCode(joinCode);
    setTeamMembers([
      { id: "host", name: "Host", isHost: true, isReady: true },
      { id: user?.id || "player", name: user?.email?.split("@")[0] || "You", isHost: false, isReady: false }
    ]);
    setIsCreating(true);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const startGame = () => {
    if (teamMembers.filter(m => m.isReady).length < 2) {
      toast.error("Need at least 2 ready players to start");
      return;
    }
    toast.success("Starting group escape room...");
    // Navigate to the escape room with team mode
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-600 border-green-500/30";
      case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
      case "hard": return "bg-red-500/10 text-red-600 border-red-500/30";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Group Escape Room
            </CardTitle>
            <CardDescription>Team up to solve biblical puzzles</CardDescription>
          </div>
          <Badge variant="outline" className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCreating ? (
          <>
            {/* Room Preview */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{roomTitle}</h4>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  45 min
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Work together to decode prophecies and escape before time runs out!
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>2-{maxPlayers} players</span>
                <span className="text-muted-foreground">•</span>
                <Trophy className="h-4 w-4" />
                <span>500 XP reward</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={createLobby} className="gap-2">
                <Crown className="h-4 w-4" />
                Create Lobby
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Join Lobby
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a Lobby</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Enter lobby code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="text-center text-2xl font-mono tracking-widest"
                      maxLength={6}
                    />
                    <Button onClick={joinLobby} className="w-full">
                      Join Game
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Solo Option */}
            <Button variant="ghost" className="w-full" asChild>
              <Link to={`/games/escape-room/${roomId}`}>
                <Play className="h-4 w-4 mr-2" />
                Play Solo Instead
              </Link>
            </Button>
          </>
        ) : (
          <>
            {/* Lobby View */}
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-sm text-muted-foreground mb-2">Lobby Code</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-mono font-bold tracking-widest">{lobbyCode}</span>
                <Button variant="ghost" size="icon" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Team Members</span>
                <span className="text-muted-foreground">{teamMembers.length}/{maxPlayers}</span>
              </div>
              
              {teamMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    member.isReady ? "bg-green-500/10 border border-green-500/30" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {member.isHost && <Crown className="h-4 w-4 text-yellow-500" />}
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <Badge variant={member.isReady ? "default" : "secondary"}>
                    {member.isReady ? "Ready" : "Waiting"}
                  </Badge>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: maxPlayers - teamMembers.length }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-muted-foreground/20"
                >
                  <span className="text-muted-foreground text-sm">Waiting for player...</span>
                </div>
              ))}
            </div>

            {/* Start Button */}
            {teamMembers[0]?.id === user?.id && (
              <Button 
                onClick={startGame} 
                className="w-full gradient-palace"
                disabled={teamMembers.filter(m => m.isReady).length < 2}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game ({teamMembers.filter(m => m.isReady).length}/{teamMembers.length} ready)
              </Button>
            )}

            <Button variant="outline" onClick={() => setIsCreating(false)} className="w-full">
              Leave Lobby
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
