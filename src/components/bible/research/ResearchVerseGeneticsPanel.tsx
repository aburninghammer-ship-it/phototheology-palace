import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, GitBranch, BookOpen, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResearchVerseGeneticsPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
}

interface VerseRelation {
  reference: string;
  text: string;
  relationship: "sibling" | "cousin" | "distant";
  theme: string;
  confidence: number;
}

const RELATIONSHIP_STYLES = {
  sibling: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cousin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  distant: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const ResearchVerseGeneticsPanel = ({
  book,
  chapter,
  verse,
  verseText
}: ResearchVerseGeneticsPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [relations, setRelations] = useState<VerseRelation[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const findRelations = async () => {
    if (!verse) {
      toast.error("Please select a verse first");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verse-genetics", {
        body: {
          book,
          chapter,
          verse,
          verseText
        }
      });

      if (error) throw error;
      setRelations(data.relations || []);
    } catch (error) {
      console.error("Verse genetics failed:", error);
      toast.error("Analysis failed - showing sample relations");
      
      // Fallback sample data
      setRelations([
        {
          reference: "Romans 5:8",
          text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
          relationship: "sibling",
          theme: "God's love & sacrifice",
          confidence: 95
        },
        {
          reference: "1 John 4:9",
          text: "In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him.",
          relationship: "sibling",
          theme: "God's love & salvation",
          confidence: 92
        },
        {
          reference: "Genesis 22:2",
          text: "Take now thy son, thine only son Isaac, whom thou lovest... and offer him there for a burnt offering",
          relationship: "cousin",
          theme: "Father offering son",
          confidence: 85
        },
        {
          reference: "Isaiah 53:5",
          text: "But he was wounded for our transgressions, he was bruised for our iniquities",
          relationship: "cousin",
          theme: "Substitutionary sacrifice",
          confidence: 88
        },
        {
          reference: "Revelation 5:9",
          text: "Thou wast slain, and hast redeemed us to God by thy blood",
          relationship: "distant",
          theme: "Redemption through blood",
          confidence: 78
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRelations = activeFilter
    ? relations.filter(r => r.relationship === activeFilter)
    : relations;

  if (!verse) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <GitBranch className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a verse to discover its relatives</p>
        <p className="text-xs mt-2 opacity-70">
          Verse Genetics finds siblings, cousins, and distant relatives
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Verse Reference */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs bg-primary/20 border-primary/30">
            {book} {chapter}:{verse}
          </Badge>
          <span className="text-xs text-muted-foreground">Source Verse</span>
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-2">
          "{verseText}"
        </p>
      </div>

      {/* Analyze Button */}
      {relations.length === 0 && (
        <Button onClick={findRelations} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <GitBranch className="h-4 w-4 mr-2" />
          )}
          Discover Verse Relatives
        </Button>
      )}

      {/* Filter Tabs */}
      {relations.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={activeFilter === null ? "default" : "outline"}
            onClick={() => setActiveFilter(null)}
            className="h-7 text-xs"
          >
            All ({relations.length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "sibling" ? "default" : "outline"}
            onClick={() => setActiveFilter("sibling")}
            className={cn("h-7 text-xs", activeFilter === "sibling" && "bg-emerald-600")}
          >
            Siblings ({relations.filter(r => r.relationship === "sibling").length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "cousin" ? "default" : "outline"}
            onClick={() => setActiveFilter("cousin")}
            className={cn("h-7 text-xs", activeFilter === "cousin" && "bg-blue-600")}
          >
            Cousins ({relations.filter(r => r.relationship === "cousin").length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "distant" ? "default" : "outline"}
            onClick={() => setActiveFilter("distant")}
            className={cn("h-7 text-xs", activeFilter === "distant" && "bg-purple-600")}
          >
            Distant ({relations.filter(r => r.relationship === "distant").length})
          </Button>
        </div>
      )}

      {/* Relations List */}
      {filteredRelations.length > 0 && (
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-2">
            {filteredRelations.map((rel, idx) => (
              <div 
                key={idx}
                className="bg-white/5 rounded-lg p-3 border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">{rel.reference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] capitalize", RELATIONSHIP_STYLES[rel.relationship])}
                    >
                      {rel.relationship}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {rel.confidence}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs italic text-muted-foreground line-clamp-2">
                  "{rel.text}"
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span>Theme: {rel.theme}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Legend */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-xs space-y-1">
        <p className="font-medium mb-2">Relationship Types:</p>
        <p><span className="text-emerald-400">Siblings</span> - Same theme, direct connection</p>
        <p><span className="text-blue-400">Cousins</span> - Related by typology or pattern</p>
        <p><span className="text-purple-400">Distant</span> - Thematic echo across Testament</p>
      </div>
    </div>
  );
};
