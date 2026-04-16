import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Film } from "lucide-react";
import { toast } from "sonner";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { supabase } from "@/integrations/supabase/client";

const FRAMES = ["F01", "F07", "F12", "F24"];
const WALLS = ["|LC", "|S", "|GC", "|TP"];

export default function FrameSnapshot() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [storyboard, setStoryboard] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dealStoryboard = () => {
    const all = [...FRAMES, ...WALLS];
    const shuffled = all.sort(() => Math.random() - 0.5);
    setStoryboard(shuffled.slice(0, 4));
    setNarrative("");
  };

  const handleSubmit = async () => {
    if (!narrative.trim()) return toast.error(t('games.frameSnapshot.errorWriteNarrative'));
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: "validate_frame", storyboard, narrative }
      });
      if (error) throw error;
      if (data.coherent) {
        setScore(prev => prev + 1);
        toast.success(t('games.frameSnapshot.frameLocked'));
        dealStoryboard();
      } else {
        toast.error(t('games.frameSnapshot.needsWork', { feedback: data.feedback }));
      }
    } catch (error) {
      toast.error(t('games.common.errorValidation'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!storyboard.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader><CardTitle>{t('games.frameSnapshot.title')}</CardTitle></CardHeader>
          <CardContent><Button onClick={dealStoryboard} className="w-full">{t('games.frameSnapshot.dealStoryboard')}</Button></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/games")}><ArrowLeft className="mr-2" />{t('common.back')}</Button>
        <div className="max-w-3xl mx-auto mt-6 space-y-6">
          <Card><CardContent className="pt-6 flex gap-4 justify-center">{storyboard.map((f, i) => <div key={i} className="text-2xl font-bold px-6 py-4 bg-primary/20 rounded">{f}</div>)}</CardContent></Card>
          <Card><CardContent className="pt-6 space-y-4"><Textarea value={narrative} onChange={(e) => setNarrative(e.target.value)} placeholder={t('games.frameSnapshot.narrativePlaceholder')} className="min-h-48" /><Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">{t('games.frameSnapshot.lockFrame')}</Button></CardContent></Card>
        </div>
      </div>
      <FloatingGameChat gameType="frame-snapshot" />
    </div>
  );
}
