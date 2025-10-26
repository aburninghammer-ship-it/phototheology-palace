import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Swords, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const WARFARE_CARDS = [
  { code: "|GC", name: "Great Controversy Wall" },
  { code: "⚖", name: "Integrity Sweep" },
  { code: "≅", name: "Type/Antitype" },
  { code: "∥", name: "Parallel" },
];

const TARGET_ISSUES = [
  "Compromise in the church",
  "End-time persecution",
  "Deception in doctrine",
  "Health and lifestyle crisis",
  "False worship pressure",
  "Media manipulation",
  "Spiritual apathy",
  "False unity movements",
];

export default function ControversyRaid() {
  const navigate = useNavigate();
  const [hand, setHand] = useState<typeof WARFARE_CARDS>([]);
  const [currentIssue, setCurrentIssue] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    const shuffled = [...WARFARE_CARDS].sort(() => Math.random() - 0.5);
    setHand(shuffled.slice(0, 3));
    const randomIssue = TARGET_ISSUES[Math.floor(Math.random() * TARGET_ISSUES.length)];
    setCurrentIssue(randomIssue);
    setSelectedCard("");
    setDiagnosis("");
  };

  const handleSubmit = async () => {
    if (!selectedCard) {
      toast.error("Select a card to use");
      return;
    }
    if (!diagnosis.trim()) {
      toast.error("Write your biblical diagnosis");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_controversy_diagnosis",
          issue: currentIssue,
          card: selectedCard,
          diagnosis,
        }
      });

      if (error) throw error;

      const { isTight, feedback, points } = data;

      if (isTight) {
        setScore(prev => prev + points);
        toast.success(`Stronghold captured! +${points} points`);
        startRound();
      } else {
        toast.error(`Diagnosis weak: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-rose-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-rose-400" style={{ fontFamily: "'Cinzel', serif" }}>
            ⚔️ CONTROVERSY RAID
          </h1>
          <div className="text-right">
            <div className="text-rose-400 text-3xl font-bold">{score}</div>
            <div className="text-rose-200/60 text-sm">STRONGHOLDS</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-black/40 border-rose-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-300">
                <Swords className="w-6 h-6" />
                Target Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-rose-100 font-bold text-center py-6 bg-rose-500/20 rounded-lg">
                {currentIssue}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-rose-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-300">
                <Shield className="w-6 h-6" />
                Your Warfare Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {hand.map(card => (
                  <Button
                    key={card.code}
                    variant={selectedCard === card.code ? "default" : "outline"}
                    onClick={() => setSelectedCard(card.code)}
                    className="h-24 flex-col gap-2"
                  >
                    <div className="text-2xl font-bold">{card.code}</div>
                    <div className="text-xs">{card.name}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-rose-500/50">
            <CardHeader>
              <CardTitle className="text-rose-300">Biblical Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Use your selected card to diagnose this issue biblically. Include at least one verse..."
                className="bg-black/60 border-rose-500/30 text-white min-h-40"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Validating..." : "Capture Stronghold"}
                </Button>
                <Button onClick={startRound} variant="outline">
                  New Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
