import { useState, useMemo } from "react";
import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BookOpen, RefreshCw, HelpCircle, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VerseHighlightMenu } from "./VerseHighlightMenu";
import { VerseNoteEditor } from "./VerseNoteEditor";
import { VerseSermonDialog } from "./VerseSermonDialog";
import { VerseNote } from "@/hooks/useVerseNotes";
import { cn } from "@/lib/utils";

interface HighlightColor {
  name: string;
  value: string;
  bg: string;
  border: string;
}

interface VerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  isAudioPlaying?: boolean;
  principles?: string[];
  book?: string;
  chapter?: number;
  highlightColor?: HighlightColor | null;
  highlightColors?: HighlightColor[];
  onHighlight?: (verse: number, color: string) => void;
  onRemoveHighlight?: (verse: number) => void;
  notes?: VerseNote[];
  onAddNote?: (verse: number, content: string) => Promise<VerseNote | null>;
  onUpdateNote?: (noteId: string, content: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onAskJeeves?: (verse: number, verseText: string) => void;
}

// All available principles from the palace
const ALL_PRINCIPLES = [
  // Dimensions
  "1D (Literal)", "2D (Christ)", "3D (Me)", "4D (Church)", "5D (Heaven)",
  // Rooms Floor 1-2
  "SR (Story)", "IR (Imagination)", "24FPS", "BR (Rendered)", "TR (Translation)", "GR (Gems)",
  "OR (Observation)", "DC (Def-Com)", "ST (Types)", "QR (Questions)", "QA (Q&A Chains)",
  // Rooms Floor 3-4
  "NF (Nature)", "PF (Personal)", "BF (Bible)", "HF (History)", "LR (Listening)",
  "CR (Concentration)", "DR (Dimensions)", "C6 (Connect-6)", "TRm (Theme)", 
  "TZ (Time Zone)", "PRm (Patterns)", "P‖ (Parallels)", "FRt (Fruit)",
  // Rooms Floor 5-7
  "BL (Sanctuary)", "PR (Prophecy)", "3A (Three Angels)", "FE (Feasts)", 
  "CEC (Christ/Chapter)", "R66 (Room 66)",
  // NOTE: Juice Room (JR) intentionally excluded here – it is reserved for whole-book analysis, never single verses
  "FRm (Fire)", "MR (Meditation)", "SRm (Speed)",
  // Cycles
  "@Ad (Adamic)", "@No (Noahic)", "@Ab (Abrahamic)", "@Mo (Mosaic)",
  "@Cy (Cyrusic)", "@CyC (Cyrus-Christ)", "@Sp (Spirit)", "@Re (Remnant)",
  // Heavens
  "1H (First)", "2H (Second)", "3H (Third)",
  // Sanctuary
  "ABO (Altar)", "LV (Laver)", "LS (Lampstand)", "SB (Showbread)", 
  "AI (Incense)", "ARK (Ark)", "MS (Mercy Seat)", "VL (Veil)", "GT (Gate)",
  // Feasts
  "PO (Passover)", "UB (Unleavened)", "FF (Firstfruits)", "PT (Pentecost)",
  "TR (Trumpets)", "DA (Atonement)", "TB (Tabernacles)",
];

// Generate dynamic random principles per verse - changes each time
const generateVersePrinciples = (verseNumber: number): string[] => {
  // Use verse number + random factor for varied principles each time
  const randomFactor = Math.floor(Math.random() * 10000);
  const seed = (verseNumber * 7919 + randomFactor); // Dynamic seed
  const shuffled = [...ALL_PRINCIPLES].sort((a, b) => {
    const hashA = (a.charCodeAt(0) * seed + a.length) % 1000;
    const hashB = (b.charCodeAt(0) * seed + b.length) % 1000;
    return hashA - hashB;
  });
  return shuffled.slice(0, 4);
};

export const VerseView = ({
  verse,
  isSelected,
  onSelect,
  showPrinciples,
  isHighlighted,
  isAudioPlaying,
  principles,
  book,
  chapter,
  highlightColor,
  highlightColors = [],
  onHighlight,
  onRemoveHighlight,
  notes = [],
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAskJeeves,
}: VerseViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [wordAnalysis, setWordAnalysis] = useState<string>("");
  const [wordLoading, setWordLoading] = useState(false);
  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const [sermonDialogOpen, setSermonDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSermonStarter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSermonDialogOpen(true);
  };

  // Generate dynamic principles for this verse (regenerates when regenerateTrigger changes)
  const displayPrinciples = useMemo(
    () => principles || generateVersePrinciples(verse.verse),
    [verse.verse, principles, regenerateTrigger]
  );
  
  const colors = ["bg-blue-600", "bg-green-600", "bg-orange-600", "bg-red-600"];

  const handleWordClick = async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWord(word);
    setWordDialogOpen(true);
    setWordLoading(true);
    setWordAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke("analyze-hebrew-greek", {
        body: {
          word,
          verse: verse.text,
          context: verse.text,
          book: book || "Unknown"
        }
      });

      if (error) throw error;
      setWordAnalysis(data.analysis);
    } catch (error: any) {
      console.error("Word analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze word",
        variant: "destructive",
      });
      setWordAnalysis("Unable to analyze word at this time.");
    } finally {
      setWordLoading(false);
    }
  };

  const handlePrincipleClick = async (principle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPrinciple(principle);
    setDialogOpen(true);
    setLoading(true);
    setExplanation("");

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "principle-amplification",
          book,
          chapter,
          verse: verse.verse,
          verseText: verse.text,
          principle,
        },
      });

      if (error) throw error;
      setExplanation(data.content);
    } catch (error: any) {
      console.error("Principle explanation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate explanation",
        variant: "destructive",
      });
      setExplanation("Unable to generate explanation at this time.");
    } finally {
      setLoading(false);
    }
  };

  const renderVerseText = (text: string) => {
    const words = text.split(/(\s+|[.,;:!?])/);
    return words.map((word, index) => {
      if (word.trim() && word.length > 2 && /^[a-zA-Z]+$/.test(word)) {
        return (
          <span
            key={index}
            className="cursor-pointer hover:bg-primary/10 hover:underline rounded px-0.5 transition-colors"
            onClick={(e) => handleWordClick(word, e)}
            title="Click for Hebrew/Greek analysis"
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  // Get highlight background class
  const getHighlightBgClass = () => {
    if (!highlightColor) return "";
    const colorMap: Record<string, string> = {
      yellow: "bg-yellow-200/50 dark:bg-yellow-900/30",
      green: "bg-green-200/50 dark:bg-green-900/30",
      blue: "bg-blue-200/50 dark:bg-blue-900/30",
      pink: "bg-pink-200/50 dark:bg-pink-900/30",
      purple: "bg-purple-200/50 dark:bg-purple-900/30",
      orange: "bg-orange-200/50 dark:bg-orange-900/30",
    };
    return colorMap[highlightColor.value] || "";
  };

  return (
    <>
      <div
        className={cn(
          "group cursor-pointer transition-all duration-300 p-3 rounded-lg",
          isAudioPlaying
            ? "bg-emerald-500/20 border-2 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30 backdrop-blur-md"
            : isSelected
            ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
            : isHighlighted
            ? "bg-accent/20 border-2 border-accent shadow-md animate-pulse-glow"
            : highlightColor
            ? `${getHighlightBgClass()} border-2 border-transparent hover:border-muted`
            : "hover:bg-white/5 border-2 border-transparent"
        )}
        onClick={onSelect}
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "font-serif font-bold text-sm flex-shrink-0 transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )}
            >
              {verse.verse}
            </span>
            
            {/* Highlight, Note & Ask Jeeves buttons */}
            <div className="flex gap-0.5">
              {onHighlight && onRemoveHighlight && (
                <VerseHighlightMenu
                  verse={verse.verse}
                  currentColor={highlightColor}
                  colors={highlightColors}
                  onHighlight={onHighlight}
                  onRemove={onRemoveHighlight}
                />
              )}
              {onAddNote && onUpdateNote && onDeleteNote && (
                <VerseNoteEditor
                  verse={verse.verse}
                  notes={notes}
                  onAdd={onAddNote}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                />
              )}
              {onAskJeeves && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskJeeves(verse.verse, verse.text);
                  }}
                  title="Ask Jeeves about this verse"
                >
                  <HelpCircle className="h-3 w-3 text-purple-500" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleSermonStarter}
                title="Generate sermon starter from this verse"
              >
                <Mic className="h-3 w-3 text-amber-500" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-foreground leading-relaxed">
              {renderVerseText(verse.text)}
            </p>
            
            {showPrinciples && (
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                {displayPrinciples.map((principle, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`text-xs ${colors[idx % colors.length]} text-white cursor-pointer hover:opacity-80 transition-opacity hover-lift`}
                    onClick={(e) => handlePrincipleClick(principle, e)}
                  >
                    {idx === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                    {principle}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRegenerateTrigger(prev => prev + 1);
                  }}
                  title="Regenerate principles"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={wordDialogOpen} onOpenChange={setWordDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Hebrew/Greek Analysis: {selectedWord}</span>
            </DialogTitle>
            <DialogDescription>
              {book} {chapter}:{verse.verse}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {wordLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none p-4">
                {formatJeevesResponse(wordAnalysis)}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="bg-gradient-palace bg-clip-text text-transparent">
                {selectedPrinciple} Amplification
              </span>
            </DialogTitle>
            <DialogDescription>
              {book} {chapter}:{verse.verse} - "{verse.text}"
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none p-4">
                {formatJeevesResponse(explanation)}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <VerseSermonDialog
        open={sermonDialogOpen}
        onOpenChange={setSermonDialogOpen}
        verseRef={`${book} ${chapter}:${verse.verse}`}
        verseText={verse.text}
      />
    </>
  );
};
