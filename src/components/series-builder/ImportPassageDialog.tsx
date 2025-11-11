import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ImportPassageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passage: string;
  verseText: string;
}

export const ImportPassageDialog = ({ open, onOpenChange, passage, verseText }: ImportPassageDialogProps) => {
  const [series, setSeries] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (open) {
      loadSeries();
    }
  }, [open]);

  useEffect(() => {
    if (selectedSeries) {
      loadLessons(selectedSeries);
    }
  }, [selectedSeries]);

  const loadSeries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bible_study_series')
        .select('id, title')
        .eq('is_template', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSeries(data || []);
    } catch (error) {
      console.error('Error loading series:', error);
      toast.error('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (seriesId: string) => {
    try {
      const { data, error } = await supabase
        .from('bible_study_lessons')
        .select('id, lesson_number, title')
        .eq('series_id', seriesId)
        .order('lesson_number');

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast.error('Failed to load lessons');
    }
  };

  const handleImport = async () => {
    if (!selectedLesson) return;

    setImporting(true);
    try {
      const { data: lesson, error: fetchError } = await supabase
        .from('bible_study_lessons')
        .select('key_passages, discussion_questions')
        .eq('id', selectedLesson)
        .single();

      if (fetchError) throw fetchError;

      const currentPassages = lesson?.key_passages || '';
      const newPassages = currentPassages 
        ? `${currentPassages}\n${passage}`
        : passage;

      const currentQuestions = lesson?.discussion_questions || [];
      const newQuestion = `What does ${passage} teach us about Christ?`;
      const updatedQuestions = currentQuestions.includes(newQuestion) 
        ? currentQuestions 
        : [...currentQuestions, newQuestion];

      const { error: updateError } = await supabase
        .from('bible_study_lessons')
        .update({
          key_passages: newPassages,
          discussion_questions: updatedQuestions
        })
        .eq('id', selectedLesson);

      if (updateError) throw updateError;

      toast.success('Passage imported successfully!');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error importing passage:', error);
      toast.error('Failed to import passage');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Bible Passage to Lesson</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Passage to Import</label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium text-sm">{passage}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{verseText}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Series</label>
            <Select value={selectedSeries} onValueChange={setSelectedSeries} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : "Choose a series"} />
              </SelectTrigger>
              <SelectContent>
                {series.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSeries && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Lesson</label>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lesson" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      Lesson {lesson.lesson_number}: {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!selectedLesson || importing}
            className="w-full"
          >
            {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Import to Lesson
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
