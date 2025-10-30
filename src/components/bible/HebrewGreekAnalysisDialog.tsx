import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface HebrewGreekAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  wordData: {
    strongsNumber: string;
    lemma: string;
    transliteration: string;
    part_of_speech: string;
    verseText: string;
    book: string;
    chapter: number;
    verse: number;
  };
}

export const HebrewGreekAnalysisDialog: React.FC<HebrewGreekAnalysisDialogProps> = ({
  isOpen,
  onClose,
  wordData
}) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && wordData) {
      fetchAnalysis();
    }
  }, [isOpen, wordData]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'hebrew-greek-analysis',
          book: wordData.book,
          chapter: wordData.chapter,
          verse: wordData.verse,
          verseText: wordData.verseText,
          strongsNumber: wordData.strongsNumber,
          originalWord: wordData.lemma,
          transliteration: wordData.transliteration,
          partOfSpeech: wordData.part_of_speech
        }
      });

      if (error) throw error;

      setAnalysis(data.response || "No analysis available.");
    } catch (error) {
      console.error('Error fetching Hebrew/Greek analysis:', error);
      setAnalysis("Failed to load analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Hebrew/Greek Word Analysis
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {wordData.strongsNumber}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold">Original:</span> {wordData.lemma}
            </div>
            <div>
              <span className="font-semibold">Transliteration:</span> {wordData.transliteration}
            </div>
            <div>
              <span className="font-semibold">Strong's:</span> {wordData.strongsNumber}
            </div>
            <div>
              <span className="font-semibold">Part of Speech:</span> {wordData.part_of_speech}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <span className="font-semibold">Context:</span> {wordData.book} {wordData.chapter}:{wordData.verse}
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Analyzing word...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {formatJeevesResponse(analysis)}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
