import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trophy, Link as LinkIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { palaceFloors } from "@/data/palaceData";

const PT_SYMBOLS = [
  { code: "1D", name: "Literal Dimension" },
  { code: "2D", name: "Christ Dimension" },
  { code: "3D", name: "Me Dimension" },
  { code: "4D", name: "Church Dimension" },
  { code: "5D", name: "Heaven Dimension" },
  { code: "|S", name: "Sanctuary Wall" },
  { code: "|LC", name: "Life of Christ Wall" },
  { code: "|GC", name: "Great Controversy Wall" },
  { code: "|TP", name: "Time Prophecy Wall" },
  { code: "+", name: "Add Link" },
  { code: "∥", name: "Parallel" },
  { code: "≅", name: "Type/Antitype" },
  { code: "⊙", name: "Center in Christ" },
  { code: "⚖", name: "Integrity Sweep" },
];

interface PlayerHand {
  symbols: typeof PT_SYMBOLS;
  score: number;
}

export default function ChainWar() {
  const navigate = useNavigate();
  const [hand, setHand] = useState<typeof PT_SYMBOLS>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [verse, setVerse] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dealHand();
  }, []);

  const dealHand = () => {
    const shuffled = [...PT_SYMBOLS].sort(() => Math.random() - 0.5);
    setHand(shuffled.slice(0, 5));
    setSelectedCards([]);
    setVerse("");
    setExplanation("");
  };

  const toggleCard = (code: string) => {
    if (selectedCards.includes(code)) {
      setSelectedCards(selectedCards.filter(c => c !== code));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, code]);
    }
  };

  const handleSubmit = async () => {
    if (selectedCards.length < 2) {
      toast.error("Play at least 2 cards to build a chain");
      return;
    }
    if (!verse.trim() || !explanation.trim()) {
      toast.error("Enter both a verse and your explanation");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_chain",
          cards: selectedCards,
          verse,
          explanation,
        }
      });

      if (error) throw error;

      const { isValid, feedback, points } = data;

      if (isValid) {
        setScore(prev => prev + points);
        toast.success(`Valid chain! +${points} points. ${feedback}`);
        
        // Remove used cards from hand and draw new ones
        const remaining = hand.filter(s => !selectedCards.includes(s.code));
        const newCards = PT_SYMBOLS
          .filter(s => !remaining.find(r => r.code === s.code))
          .sort(() => Math.random() - 0.5)
          .slice(0, selectedCards.length);
        
        setHand([...remaining, ...newCards]);
        setSelectedCards([]);
        setVerse("");
        setExplanation("");
      } else {
        toast.error(`Stretch: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate chain");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-400 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              ⛓️ CHAIN WAR
            </h1>
            <p className="text-amber-200/80">Build the strongest biblical chain</p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 text-3xl font-bold">{score}</div>
            <div className="text-amber-200/60 text-sm">POINTS</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <LinkIcon className="w-5 h-5" />
                Your Hand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {hand.map(symbol => (
                  <Button
                    key={symbol.code}
                    variant={selectedCards.includes(symbol.code) ? "default" : "outline"}
                    onClick={() => toggleCard(symbol.code)}
                    className="h-20 flex-col gap-1"
                  >
                    <div className="text-2xl font-bold">{symbol.code}</div>
                    <div className="text-xs">{symbol.name}</div>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select 2-3 cards to build your chain
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-amber-500/50">
            <CardHeader>
              <CardTitle className="text-amber-300">Build Your Chain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-amber-200 mb-2 block">Bible Verse Reference</label>
                <input
                  type="text"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="e.g., Revelation 12:17"
                  className="w-full px-4 py-2 bg-black/60 border border-amber-500/30 rounded text-white"
                />
              </div>
              <div>
                <label className="text-sm text-amber-200 mb-2 block">
                  Explain Your Chain ({selectedCards.length} cards selected)
                </label>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain how each card connects to the verse..."
                  className="bg-black/60 border-amber-500/30 text-white min-h-32"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedCards.length < 2}
                className="w-full gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Validating..." : "Submit Chain"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-black/40 border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-amber-300">📋 How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-100/80 space-y-2">
            <p>1. Choose ANY Bible verse you know</p>
            <p>2. Play 2-3 cards from your hand</p>
            <p>3. Explain how EACH card connects to that verse</p>
            <p>4. Jeeves validates: Valid chain = keep cards as points. Stretch = no points.</p>
            <p>5. First to 15 points wins!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
