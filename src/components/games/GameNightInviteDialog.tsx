import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameNight, isGameNightNow, getNextGameNight } from "@/hooks/useGameNight";
import { useToast } from "@/hooks/use-toast";
import { Moon, Copy, Users, Mail, Clock, Sparkles, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Game catalog for host selection
const AVAILABLE_GAMES = [
  { id: "tic-tac-toe", name: "Tic-Tac-Toe", icon: "❌", easy: true },
  { id: "connect-four", name: "Connect Four", icon: "🔴", easy: true },
  { id: "checkers", name: "Checkers", icon: "🏁", easy: true },
  { id: "chess", name: "Chess", icon: "♟️", easy: false },
  { id: "phototheology-uno", name: "PT Uno", icon: "🃏", easy: true },
  { id: "pt-jeopardy", name: "PT Jeopardy", icon: "🧠", easy: true },
  { id: "pt-family-feud", name: "PT Family Feud", icon: "👨‍👩‍👧‍👦", easy: true },
  { id: "story-room", name: "Story Room", icon: "📚", easy: true },
  { id: "symbol-decoder", name: "Symbol Decoder", icon: "🔣", easy: false },
  { id: "concentration", name: "Biblical Parallels", icon: "🎴", easy: true },
  { id: "palace-cards", name: "Parallels Match", icon: "🔗", easy: false },
  { id: "chain-chess", name: "Chain Chess", icon: "⛓️", easy: false },
  { id: "escape-room", name: "Escape Room", icon: "🚪", easy: false },
  { id: "principle-cards", name: "Principle Cards", icon: "🎴", easy: false },
];

export function GameNightInviteDialog() {
  const { createInvite, myInvites, myGuests, stats } = useGameNight();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select" | "details" | "done">("select");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [creating, setCreating] = useState(false);

  const active = isGameNightNow();

  const toggleGame = (id: string) => {
    setSelectedGames(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const selectEasyGames = () => {
    setSelectedGames(AVAILABLE_GAMES.filter(g => g.easy).map(g => g.id));
  };

  const handleCreate = async () => {
    if (selectedGames.length === 0) {
      toast({ title: "Select at least one game", variant: "destructive" });
      return;
    }
    setCreating(true);
    const invite = await createInvite(selectedGames, guestName, guestEmail);
    setCreating(false);

    if (invite) {
      setCreatedCode(invite.invite_code);
      setStep("done");
      toast({ title: "🌙 Invite Created!", description: `Code: ${invite.invite_code}` });
    } else {
      toast({ title: "Failed to create invite", variant: "destructive" });
    }
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}/game-night?code=${createdCode}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Share it with your guest" });
  };

  const shareInvite = async () => {
    const url = `${window.location.origin}/game-night?code=${createdCode}`;
    const text = `🌙 You're invited to Friday Night Game Night! Join me for some biblical games.\n\n${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Friday Night Game Night", text, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Invite text copied!" });
    }
  };

  const resetDialog = () => {
    setStep("select");
    setSelectedGames([]);
    setGuestName("");
    setGuestEmail("");
    setCreatedCode("");
  };

  const nextGameNight = getNextGameNight();

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetDialog(); }}>
      <DialogTrigger asChild>
        <Button
          className={`gap-2 ${active 
            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 animate-pulse" 
            : "variant-outline"}`}
          variant={active ? "default" : "outline"}
        >
          <Moon className="h-4 w-4" />
          {active ? "🌙 Game Night LIVE!" : "Friday Game Night"}
          {active && <Sparkles className="h-3 w-3" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Moon className="h-5 w-5 text-purple-500" />
            Friday Night Game Night
            {active && <Badge className="bg-green-500 text-white animate-pulse">LIVE</Badge>}
          </DialogTitle>
        </DialogHeader>

        {!active ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl">🌙</div>
            <h3 className="text-lg font-semibold">Game Night Opens Every Friday</h3>
            <p className="text-muted-foreground">6:00 PM – 1:00 AM Eastern Time</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next: {nextGameNight.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            </div>
            {stats.totalGuests > 0 && (
              <Card className="mt-4">
                <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.totalGuests}</div>
                    <div className="text-xs text-muted-foreground">Total Guests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-500">{stats.uniqueEmails}</div>
                    <div className="text-xs text-muted-foreground">Unique Emails</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{stats.converted}</div>
                    <div className="text-xs text-muted-foreground">Converted</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {step === "select" && (
              <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Choose which games your guest can play:</p>
                  <Button variant="ghost" size="sm" onClick={selectEasyGames} className="text-xs">
                    Select Easy Games
                  </Button>
                </div>
                <ScrollArea className="h-[300px] pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_GAMES.map(game => (
                      <div
                        key={game.id}
                        onClick={() => toggleGame(game.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          selectedGames.includes(game.id)
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox checked={selectedGames.includes(game.id)} className="pointer-events-none" />
                        <span className="text-lg">{game.icon}</span>
                        <span className="text-sm font-medium truncate">{game.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{selectedGames.length} game{selectedGames.length !== 1 ? "s" : ""} selected</span>
                  <Button onClick={() => setStep("details")} disabled={selectedGames.length === 0}>
                    Next →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-sm text-muted-foreground">Who are you inviting? (optional — you can share the link with anyone)</p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="guestName">Guest Name</Label>
                    <Input id="guestName" placeholder="e.g. John" value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Guest Email</Label>
                    <Input id="guestEmail" type="email" placeholder="e.g. john@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep("select")}>← Back</Button>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? "Creating..." : "🌙 Create Invite"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-xl font-bold">Invite Ready!</h3>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Invite Code</p>
                  <p className="text-3xl font-mono font-bold tracking-wider text-primary">{createdCode}</p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={copyInviteLink} variant="outline" className="gap-2">
                    <Copy className="h-4 w-4" /> Copy Link
                  </Button>
                  <Button onClick={shareInvite} className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires at 1:00 AM ET tonight
                </p>
                <Button variant="ghost" onClick={resetDialog} className="text-sm">
                  Create Another Invite
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Active invites summary */}
        {active && myInvites.filter(i => i.is_active).length > 0 && step !== "done" && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span>{stats.activeInvites} active invite{stats.activeInvites !== 1 ? "s" : ""} tonight</span>
              <span className="ml-auto">{stats.totalGuests} guest{stats.totalGuests !== 1 ? "s" : ""} joined</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
