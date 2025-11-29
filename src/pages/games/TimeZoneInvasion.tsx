import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, Globe, Cloud } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TIME_ZONES = [
  { code: "Hpa", name: "Heaven Past", icon: Cloud },
  { code: "Hp", name: "Heaven Present", icon: Cloud },
  { code: "Hf", name: "Heaven Future", icon: Cloud },
  { code: "Epa", name: "Earth Past", icon: Globe },
  { code: "Ep", name: "Earth Present", icon: Globe },
  { code: "Ef", name: "Earth Future", icon: Globe },
];

const CHALLENGE_VERSES = [
  "Revelation 12:17",
  "Daniel 7:25",
  "Matthew 24:21",
  "Revelation 14:12",
  "2 Timothy 3:1",
  "Isaiah 14:12-14",
  "Ephesians 6:12",
];

export default function TimeZoneInvasion() {
  const navigate = useNavigate();
  const [verse, setVerse] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startRound = () => {
    const randomVerse = CHALLENGE_VERSES[Math.floor(Math.random() * CHALLENGE_VERSES.length)];
    setVerse(randomVerse);
    setSelectedZones([]);
    setExplanation("");
  };

  const toggleZone = (code: string) => {
    if (selectedZones.includes(code)) {
      setSelectedZones(selectedZones.filter(z => z !== code));
    } else if (selectedZones.length < 2) {
      setSelectedZones([...selectedZones, code]);
    }
  };

  const handleSubmit = async () => {
    if (selectedZones.length !== 2) {
      toast.error("Select exactly 2 time zones");
      return;
    }
    if (!explanation.trim()) {
      toast.error("Explain your zone choices");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_time_zones",
          verse,
          zones: selectedZones,
          explanation,
        }
      });

      if (error) throw error;

      const { quality, feedback, points } = data;

      if (quality === "excellent") {
        setScore(prev => prev + 2);
        toast.success(`Excellent framing! +2 points. ${feedback}`);
      } else if (quality === "good") {
        setScore(prev => prev + 1);
        toast.success(`Good explanation! +1 point. ${feedback}`);
      } else {
        toast.error(`Needs work: ${feedback}`);
      }

      startRound();
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!verse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-black/40 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-cyan-300">
              🌍 TIME ZONE INVASION
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-cyan-100/80">
              Frame Bible verses across Heaven/Earth and Past/Present/Future
            </p>
            <Button onClick={startRound} className="w-full">
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-cyan-400" style={{ fontFamily: "'Cinzel', serif" }}>
            🌍 TIME ZONE INVASION
          </h1>
          <div className="text-right">
            <div className="text-cyan-400 text-3xl font-bold">{score}</div>
            <div className="text-cyan-200/60 text-sm">POINTS</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-black/40 border-cyan-500/50">
            <CardHeader>
              <CardTitle className="text-cyan-300">Challenge Verse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-cyan-100 font-serif text-center py-4">
                {verse}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-cyan-500/50">
            <CardHeader>
              <CardTitle className="text-cyan-300">Select 2 Time Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TIME_ZONES.map(zone => {
                  const Icon = zone.icon;
                  return (
                    <Button
                      key={zone.code}
                      variant={selectedZones.includes(zone.code) ? "default" : "outline"}
                      onClick={() => toggleZone(zone.code)}
                      className="h-20 flex-col gap-1"
                    >
                      <Icon className="w-6 h-6" />
                      <div className="font-bold">{zone.code}</div>
                      <div className="text-xs">{zone.name}</div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-cyan-500/50">
            <CardHeader>
              <CardTitle className="text-cyan-300">Defend Your Zones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why your 2 zones apply to this verse..."
                className="bg-black/60 border-cyan-500/30 text-white min-h-32"
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Validating..." : "Submit Defense"}
                </Button>
                <Button onClick={startRound} variant="outline">
                  New Verse
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
