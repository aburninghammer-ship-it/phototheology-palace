import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { validateInviteCode, registerGuest, isGameNightNow, getNextGameNight } from "@/hooks/useGameNight";
import type { GameNightInvite } from "@/hooks/useGameNight";
import { Moon, Clock, Gamepad2, ArrowRight, PartyPopper, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const GameNightGuest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeFromUrl = searchParams.get("code") || "";

  const [inviteCode, setInviteCode] = useState(codeFromUrl);
  const [invite, setInvite] = useState<GameNightInvite | null>(null);
  const [step, setStep] = useState<"code" | "register" | "playing" | "closed">(
    isGameNightNow() ? "code" : "closed"
  );
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(
    localStorage.getItem("game_night_session")
  );

  // Auto-validate code from URL
  useEffect(() => {
    if (codeFromUrl && isGameNightNow()) {
      handleValidate(codeFromUrl);
    }
  }, [codeFromUrl]);

  // Check existing session
  useEffect(() => {
    if (sessionToken) {
      const savedGames = localStorage.getItem("game_night_games");
      if (savedGames) {
        setStep("playing");
      }
    }
  }, [sessionToken]);

  const handleValidate = async (code?: string) => {
    const checkCode = code || inviteCode;
    if (!checkCode.trim()) return;
    
    setLoading(true);
    setError("");
    const result = await validateInviteCode(checkCode);
    setLoading(false);

    if (result.valid && result.invite) {
      setInvite(result.invite);
      setStep("register");
    } else {
      setError(result.error || "Invalid code");
    }
  };

  const handleRegister = async () => {
    if (!guestEmail.trim() || !invite) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    const result = await registerGuest(invite.id, guestEmail, guestName);
    setLoading(false);

    if (result.success && result.sessionToken) {
      setSessionToken(result.sessionToken);
      localStorage.setItem("game_night_session", result.sessionToken);
      localStorage.setItem("game_night_games", JSON.stringify(invite.allowed_games));
      localStorage.setItem("game_night_guest_name", guestName || "Guest");
      setStep("playing");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const nextGameNight = getNextGameNight();

  if (step === "closed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="max-w-md w-full border-purple-800/50 bg-background/80 backdrop-blur">
            <CardContent className="text-center py-12 space-y-4">
              <div className="text-7xl">🌙</div>
              <h1 className="text-2xl font-bold">Friday Night Game Night</h1>
              <p className="text-muted-foreground">
                Game Night opens every Friday from <strong>6:00 PM to 1:00 AM</strong> Eastern Time
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
                <Clock className="h-4 w-4" />
                <span>
                  Next: {nextGameNight.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })} at 6:00 PM ET
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Come back during Game Night to play with your invite!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === "playing") {
    const allowedGames = JSON.parse(localStorage.getItem("game_night_games") || "[]");
    const guestDisplayName = localStorage.getItem("game_night_guest_name") || "Guest";

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🌙</div>
                <div>
                  <h1 className="text-xl font-bold text-white">Game Night</h1>
                  <p className="text-sm text-purple-300">Welcome, {guestDisplayName}!</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                LIVE
              </Badge>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-purple-400" />
              Your Games Tonight
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allowedGames.map((gameId: string, i: number) => {
                const gameMeta = GAME_META[gameId];
                return (
                  <motion.div
                    key={gameId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Card
                      className="border-purple-800/50 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => navigate(`/games/${gameId}`)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-4xl">{gameMeta?.icon || "🎮"}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{gameMeta?.name || gameId}</h3>
                          <p className="text-xs text-purple-300">{gameMeta?.desc || "Play now!"}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card className="mt-8 border-purple-800/50 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
              <CardContent className="p-6 text-center space-y-3">
                <PartyPopper className="h-8 w-8 mx-auto text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Want Full Access?</h3>
                <p className="text-sm text-purple-200">
                  Unlock all 25+ games, Bible study tools, Jeeves AI tutor, and more!
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Start Free Trial →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-purple-800/50 bg-background/80 backdrop-blur">
          <CardHeader className="text-center">
            <div className="text-5xl mb-2">🌙</div>
            <CardTitle className="text-xl">
              {step === "code" ? "Enter Your Invite Code" : "Almost There!"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === "code"
                ? "Paste the code your friend sent you"
                : "Enter your info to start playing"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {step === "code" && (
              <>
                <div>
                  <Label htmlFor="code">Invite Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g. FN3A8B2C"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-mono tracking-widest"
                    maxLength={10}
                  />
                </div>
                <Button onClick={() => handleValidate()} disabled={loading || !inviteCode.trim()} className="w-full">
                  {loading ? "Checking..." : "Join Game Night →"}
                </Button>
              </>
            )}

            {step === "register" && invite && (
              <>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">You're invited to play</p>
                  <p className="font-semibold">{invite.allowed_games.length} game{invite.allowed_games.length !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="What should we call you?" value={guestName} onChange={e => setGuestName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required />
                  <p className="text-xs text-muted-foreground mt-1">We'll send you game highlights and a special offer</p>
                </div>
                <Button onClick={handleRegister} disabled={loading || !guestEmail.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {loading ? "Setting up..." : "🎮 Let's Play!"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Game metadata for display
const GAME_META: Record<string, { name: string; icon: string; desc: string }> = {
  "tic-tac-toe": { name: "PT Tic-Tac-Toe", icon: "❌", desc: "Bible trivia grid game" },
  "connect-four": { name: "PT Connect Four", icon: "🔴", desc: "Connect four with Scripture challenges" },
  "checkers": { name: "PT Checkers", icon: "🏁", desc: "Capture pieces by answering Bible questions" },
  "chess": { name: "PT Chess", icon: "♟️", desc: "Strategic chess with Scripture themes" },
  "phototheology-uno": { name: "PT Uno", icon: "🃏", desc: "Biblical connections card game" },
  "pt-jeopardy": { name: "PT Jeopardy", icon: "🧠", desc: "Bible knowledge Jeopardy-style" },
  "pt-family-feud": { name: "PT Family Feud", icon: "👨‍👩‍👧‍👦", desc: "Team Bible trivia" },
  "story-room": { name: "Story Room", icon: "📚", desc: "Arrange stories in sequence" },
  "symbol-decoder": { name: "Symbol Decoder", icon: "🔣", desc: "Match biblical symbols" },
  "concentration": { name: "Biblical Parallels", icon: "🎴", desc: "Match OT/NT connections" },
  "palace-cards": { name: "Parallels Match", icon: "🔗", desc: "Match biblical pairs" },
  "chain-chess": { name: "Chain Chess", icon: "⛓️", desc: "Build commentary chains" },
  "escape-room": { name: "Escape Room", icon: "🚪", desc: "Solve biblical puzzles" },
  "principle-cards": { name: "Principle Cards", icon: "🎴", desc: "Multiplayer card game" },
};

export default GameNightGuest;
