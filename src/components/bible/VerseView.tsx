import { useState, useMemo } from "react";
import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, X } from "lucide-react";
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

interface VerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  principles?: string[];
  book?: string;
  chapter?: number;
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
  "CEC (Christ/Chapter)", "R66 (Room 66)", "JR (Juice)",
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

// Generate stable random principles per verse using verse number as seed
const generateVersePrinciples = (verseNumber: number): string[] => {
  // Use verse number as seed for consistent randomization
  const seed = verseNumber * 7919; // Prime number multiplier for better distribution
  const shuffled = [...ALL_PRINCIPLES].sort((a, b) => {
    const hashA = (a.charCodeAt(0) * seed + a.length) % 1000;
    const hashB = (b.charCodeAt(0) * seed + b.length) % 1000;
    return hashA - hashB;
  });
  return shuffled.slice(0, 4);
};

export const VerseView = ({ verse, isSelected, onSelect, showPrinciples, isHighlighted, principles, book, chapter }: VerseViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate stable principles for this verse
  const displayPrinciples = useMemo(
    () => principles || generateVersePrinciples(verse.verse),
    [verse.verse, principles]
  );
  
  const colors = ["gradient-palace", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-royal"];

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

  return (
    <>
      <div
        className={`group cursor-pointer transition-all duration-300 p-3 rounded-lg ${
          isSelected
            ? "bg-primary/10 border-2 border-primary shadow-lg"
            : isHighlighted
            ? "bg-accent/20 border-2 border-accent shadow-md animate-pulse-glow"
            : "hover:bg-muted/50 border-2 border-transparent"
        }`}
        onClick={onSelect}
      >
        <div className="flex gap-3">
          <span
            className={`font-serif font-bold text-sm flex-shrink-0 ${
              isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            } transition-colors`}
          >
            {verse.verse}
          </span>
          
          <div className="flex-1">
            <p className="text-foreground leading-relaxed">
              {verse.text}
            </p>
            
            {showPrinciples && (
              <div className="flex gap-2 mt-2 flex-wrap">
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
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  );
};
