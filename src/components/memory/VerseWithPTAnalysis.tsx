import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCw, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PTInsight {
  christ_center: string;
  dimensions: string[];
  cycles: string[];
  horizons: string[];
  sanctuary_connections: Array<{ article: string; explanation: string }>;
  feast_connections: Array<{ feast: string; explanation: string }>;
  walls: string[];
  cross_references: Array<{ verse: string; reason: string; principles: string[] }>;
}

interface HebrewGreek {
  strong_numbers?: string[];
  key_words?: Array<{ word: string; transliteration: string; meaning: string }>;
}

interface VerseWithPTAnalysisProps {
  verseId: string;
  reference: string;
  text: string;
  orderIndex: number;
  ptInsights?: PTInsight | null;
  hebrewGreek?: HebrewGreek | null;
  onDelete: () => void;
  onReorder: (direction: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function VerseWithPTAnalysis({
  verseId,
  reference,
  text,
  orderIndex,
  ptInsights,
  hebrewGreek,
  onDelete,
  onReorder,
  canMoveUp,
  canMoveDown,
}: VerseWithPTAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<PTInsight | null>(ptInsights || null);
  const [hgData, setHgData] = useState<HebrewGreek | null>(hebrewGreek || null);

  const refreshPTAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-verse-pt", {
        body: {
          verse_reference: reference,
          verse_text: text,
        },
      });

      if (error) throw error;

      const ptData = data.pt_insights;
      
      // Update in database
      const { error: updateError } = await supabase
        .from("memory_verse_list_items")
        .update({
          pt_insights: ptData,
          hebrew_greek: data.hebrew_greek || null,
        })
        .eq("id", verseId);

      if (updateError) throw updateError;

      setInsights(ptData);
      setHgData(data.hebrew_greek || null);
      toast.success("PT analysis refreshed!");
    } catch (error) {
      console.error("Error refreshing PT analysis:", error);
      toast.error("Failed to refresh PT analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Reference and Text */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link 
              to={`/study/${reference.replace(/\s/g, "-")}`}
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {reference}
              <ExternalLink className="h-3 w-3" />
            </Link>
            <p className="text-sm mt-1">{text}</p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onReorder("up")}
              disabled={!canMoveUp}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onReorder("down")}
              disabled={!canMoveDown}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={refreshPTAnalysis}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PT Principles Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {insights ? "PT Principles Applied" : "Load PT Analysis"}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-4">
            {!insights && !loading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  No PT analysis yet
                </p>
                <Button size="sm" onClick={refreshPTAnalysis}>
                  Generate PT Analysis
                </Button>
              </div>
            )}

            {insights && (
              <>
                {/* Hebrew/Greek */}
                {hgData?.key_words && hgData.key_words.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Hebrew/Greek Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {hgData.key_words.map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <span className="font-semibold">{kw.word}</span>
                          <span className="mx-1">({kw.transliteration})</span>
                          <span className="text-muted-foreground">= {kw.meaning}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Christ Center */}
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm flex items-center gap-1">
                    <Link to="/palace?floor=4&room=CR" className="hover:underline flex items-center gap-1">
                      Christ Center
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">{insights.christ_center}</p>
                </div>

                {/* Dimensions */}
                {insights.dimensions && insights.dimensions.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Dimensions</h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.dimensions.map((dim) => (
                        <Link key={dim} to={`/palace?floor=4&room=DR&dimension=${dim}`}>
                          <Badge variant="secondary" className="text-xs hover:bg-secondary/80">
                            {dim}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cycles */}
                {insights.cycles && insights.cycles.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Cycles</h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.cycles.map((cycle) => (
                        <Link key={cycle} to={`/palace?floor=6&cycle=${cycle}`}>
                          <Badge className="text-xs hover:opacity-80">{cycle}</Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Horizons */}
                {insights.horizons && insights.horizons.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">Three Heavens</h4>
                    <div className="flex flex-wrap gap-1">
                      {insights.horizons.map((horizon) => (
                        <Link key={horizon} to={`/palace?floor=6&horizon=${horizon}`}>
                          <Badge variant="outline" className="text-xs hover:bg-accent">
                            {horizon}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sanctuary */}
                {insights.sanctuary_connections && insights.sanctuary_connections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Sanctuary Connections</h4>
                    {insights.sanctuary_connections.map((conn, idx) => (
                      <div key={idx} className="text-xs bg-muted/50 p-2 rounded">
                        <Link 
                          to={`/palace?floor=5&room=BL&article=${conn.article}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {conn.article}
                        </Link>
                        <p className="text-muted-foreground mt-1">{conn.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Feasts */}
                {insights.feast_connections && insights.feast_connections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Feast Connections</h4>
                    {insights.feast_connections.map((feast, idx) => (
                      <div key={idx} className="text-xs bg-muted/50 p-2 rounded">
                        <Link 
                          to={`/palace?floor=5&feast=${feast.feast}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {feast.feast}
                        </Link>
                        <p className="text-muted-foreground mt-1">{feast.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cross References */}
                {insights.cross_references && insights.cross_references.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Cross References</h4>
                    {insights.cross_references.slice(0, 3).map((ref, idx) => (
                      <div key={idx} className="text-xs bg-muted/50 p-2 rounded">
                        <Link 
                          to={`/study/${ref.verse.replace(/\s/g, "-")}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {ref.verse}
                        </Link>
                        <p className="text-muted-foreground mt-1">{ref.reason}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ref.principles.map((p) => (
                            <Badge key={p} variant="outline" className="text-[10px]">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}