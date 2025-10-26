import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const GENRES = [
  { code: "Pr", name: "Prophecy" },
  { code: "Go", name: "Gospels" },
  { code: "Ep", name: "Epistles" },
  { code: "Hi", name: "History" },
  { code: "Po", name: "Poetry" },
  { code: "Pa", name: "Parables" },
];

export default function Connect6Draft() {
  const navigate = useNavigate();
  const [hand, setHand] = useState<typeof GENRES>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [doctrine, setDoctrine] = useState("");
  const [verseExplanations, setVerseExplanations] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dealHand();
  }, []);

  const dealHand = () => {
    const shuffled = [...GENRES].sort(() => Math.random() - 0.5);
    setHand(shuffled.slice(0, 4));
    setSelectedGenres([]);
    setDoctrine("");
    setVerseExplanations({});
  };

  const toggleGenre = (code: string) => {
    if (selectedGenres.includes(code)) {
      setSelectedGenres(selectedGenres.filter(g => g !== code));
      const newExplanations = { ...verseExplanations };
      delete newExplanations[code];
      setVerseExplanations(newExplanations);
    } else if (selectedGenres.length < 2) {
      setSelectedGenres([...selectedGenres, code]);
    }
  };

  const handleSubmit = async () => {
    if (selectedGenres.length !== 2) {
      toast.error("Select exactly 2 genres");
      return;
    }
    if (!doctrine.trim()) {
      toast.error("Enter a doctrine or theme");
      return;
    }
    if (selectedGenres.some(g => !verseExplanations[g]?.trim())) {
      toast.error("Provide verse + explanation for both genres");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_connect6",
          doctrine,
          genres: selectedGenres,
          explanations: verseExplanations,
        }
      });

      if (error) throw error;

      const { isCoherent, feedback, points } = data;

      if (isCoherent) {
        setScore(prev => prev + points);
        toast.success(`Valid connection! +${points} points`);
        
        const remaining = hand.filter(g => !selectedGenres.includes(g.code));
        const newGenres = GENRES
          .filter(g => !remaining.find(r => r.code === g.code))
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        
        setHand([...remaining, ...newGenres]);
        setSelectedGenres([]);
        setDoctrine("");
        setVerseExplanations({});
      } else {
        toast.error(`Connection weak: ${feedback}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-emerald-400" style={{ fontFamily: "'Cinzel', serif" }}>
            📚 CONNECT-6 DRAFT
          </h1>
          <div className="text-right">
            <div className="text-emerald-400 text-3xl font-bold">{score}</div>
            <div className="text-emerald-200/60 text-sm">POINTS</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-black/40 border-emerald-500/50">
            <CardHeader>
              <CardTitle className="text-emerald-300">Your Hand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hand.map(genre => (
                  <Button
                    key={genre.code}
                    variant={selectedGenres.includes(genre.code) ? "default" : "outline"}
                    onClick={() => toggleGenre(genre.code)}
                    className="h-20 flex-col gap-1"
                  >
                    <BookOpen className="w-6 h-6" />
                    <div className="font-bold">{genre.code}</div>
                    <div className="text-xs">{genre.name}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-emerald-500/50">
            <CardHeader>
              <CardTitle className="text-emerald-300">Build Your Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-emerald-200 mb-2 block">Doctrine or Theme</label>
                <Input
                  value={doctrine}
                  onChange={(e) => setDoctrine(e.target.value)}
                  placeholder="e.g., Sabbath, State of the Dead, Justification..."
                  className="bg-black/60 border-emerald-500/30 text-white"
                />
              </div>

              {selectedGenres.map(genreCode => {
                const genre = GENRES.find(g => g.code === genreCode);
                return (
                  <div key={genreCode}>
                    <label className="text-sm text-emerald-200 mb-2 block">
                      {genre?.name} - Verse & Explanation
                    </label>
                    <Textarea
                      value={verseExplanations[genreCode] || ""}
                      onChange={(e) => setVerseExplanations({ ...verseExplanations, [genreCode]: e.target.value })}
                      placeholder={`Name a ${genre?.name} verse that supports this doctrine and explain how...`}
                      className="bg-black/60 border-emerald-500/30 text-white"
                    />
                  </div>
                );
              })}

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Validating..." : "Submit Connection"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
