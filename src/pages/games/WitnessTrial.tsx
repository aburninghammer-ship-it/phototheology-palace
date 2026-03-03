import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Scale } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";

const STREET_OBJECTIONS = [
  "Why should I care about Jesus?",
  "Why do I need to change my lifestyle?",
  "Why does judgment matter?",
  "All religions lead to God anyway",
  "I'm a good person, that's enough",
  "The Bible contradicts itself",
  "Christianity is just about control",
];

export default function WitnessTrial() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [objection, setObjection] = useState("");
  const [defense, setDefense] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTrial = () => {
    const cards = ["Ep", "|S", "⚖"].sort(() => Math.random() - 0.5);
    setDrawnCards(cards.slice(0, 3));
    const obj = STREET_OBJECTIONS[Math.floor(Math.random() * STREET_OBJECTIONS.length)];
    setObjection(obj);
    setDefense("");
  };

  const handleSubmit = async () => {
    if (!defense.trim()) {
      toast.error(t('games.witnessTrial.errorPresentDefense'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: "validate_witness", cards: drawnCards, objection, defense }
      });
      if (error) throw error;
      
      if (data.convincing) {
        setScore(prev => prev + 3);
        toast.success(t('games.witnessTrial.convincing'));
      } else {
        toast.error(t('games.witnessTrial.weakDefense', { feedback: data.feedback }));
      }
      startTrial();
    } catch (error) {
      toast.error(t('games.common.errorValidation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!objection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-black/40 border-gray-500/50">
          <CardHeader>
            <CardTitle className="text-center text-3xl">{t('games.witnessTrial.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>{t('games.witnessTrial.description')}</p>
            <Button onClick={startTrial} className="w-full">{t('games.witnessTrial.startTrial')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")}>
            <ArrowLeft className="mr-2" />{t('common.back')}
          </Button>
          <h1 className="text-4xl font-bold">{t('games.witnessTrial.title')}</h1>
          <div className="text-3xl font-bold">{score}</div>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-black/40">
            <CardHeader><CardTitle>{t('games.witnessTrial.objection', { objection })}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {drawnCards.map((c, i) => <div key={i} className="px-4 py-2 bg-primary/20 rounded">{c}</div>)}
              </div>
              <Textarea value={defense} onChange={(e) => setDefense(e.target.value)} placeholder={t('games.witnessTrial.defensePlaceholder')} className="min-h-32" />
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4">{t('games.witnessTrial.submitDefense')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <FloatingGameChat gameType="witness-trial" />
    </div>
  );
}
