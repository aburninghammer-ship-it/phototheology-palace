import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PRINCIPLE_OPTIONS = [
  { id: "dimensions", label: "5 Dimensions", color: "gradient-palace" },
  { id: "cycles", label: "8 Cycles", color: "gradient-ocean" },
  { id: "sanctuary", label: "Sanctuary Articles", color: "gradient-royal" },
  { id: "feasts", label: "7 Feasts", color: "gradient-sunset" },
  { id: "horizons", label: "3 Horizons", color: "gradient-warmth" },
];

interface CommentaryPanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const CommentaryPanel = ({ book, chapter, verse, verseText, onClose }: CommentaryPanelProps) => {
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState<string | null>(null);
  const { toast } = useToast();

  const togglePrinciple = (id: string) => {
    setSelectedPrinciples(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const generateCommentary = async () => {
    if (selectedPrinciples.length === 0) {
      toast({
        title: "Select Principles",
        description: "Please select at least one principle for commentary",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "commentary",
          book,
          chapter,
          verseText: { verse, text: verseText },
          selectedPrinciples: selectedPrinciples.map(
            id => PRINCIPLE_OPTIONS.find(p => p.id === id)?.label
          ),
        },
      });

      if (error) throw error;
      setCommentary(data.content);
    } catch (error: any) {
      console.error("Commentary error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate commentary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant animate-scale-in">
      <CardHeader className="gradient-ocean text-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Jeeves Commentary
            </CardTitle>
            <CardDescription className="text-white/90">
              {book} {chapter}:{verse}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-3">Select Analysis Lenses:</h4>
            <div className="space-y-2">
              {PRINCIPLE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover-lift"
                >
                  <Checkbox
                    checked={selectedPrinciples.includes(option.id)}
                    onCheckedChange={() => togglePrinciple(option.id)}
                  />
                  <Badge className={`${option.color} text-white shadow-sm`}>
                    {option.label}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={generateCommentary}
            disabled={loading || selectedPrinciples.length === 0}
            className="w-full gradient-royal text-white shadow-blue"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating commentary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Commentary
              </>
            )}
          </Button>
        </div>

        {commentary && (
          <ScrollArea className="h-[400px] mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">Jeeves says:</span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                {commentary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
