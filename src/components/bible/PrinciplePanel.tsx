import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVerseAnnotations } from "@/services/bibleApi";
import { VerseAnnotation } from "@/types/bible";
import { X, ExternalLink, Heart, BookOpen, Layers, Calendar, Building2, Save, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PrinciplePanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

const PRINCIPLES = [
  { value: "parables", label: "Parables of Jesus" },
  { value: "prophecy", label: "Prophecy Connections" },
  { value: "life-of-christ", label: "Life of Christ Wall" },
  { value: "70-weeks", label: "70 Week Connections" },
  { value: "2d", label: "2D Christ Dimension" },
  { value: "3d", label: "3D Kingdom Dimension" },
  { value: "sanctuary", label: "Sanctuary Principles" },
  { value: "feasts", label: "Feast Connections" },
  { value: "types", label: "Types & Shadows" },
  { value: "covenant", label: "Covenant Themes" },
];

interface ChainReference {
  verse: number;
  reference: string;
  principle: string;
  ptCodes: string[];
  connection: string;
  crossReferences: Array<{
    reference: string;
    relationship: string;
    confidence: number;
    note: string;
  }>;
  expounded: string;
}

export const PrinciplePanel = ({ book, chapter, verse, verseText, onClose }: PrinciplePanelProps) => {
  const [annotation, setAnnotation] = useState<VerseAnnotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [chainReferences, setChainReferences] = useState<ChainReference[]>([]);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("parables");
  const { toast } = useToast();

  useEffect(() => {
    loadAnnotation();
  }, [book, chapter, verse]);

  const loadAnnotation = async () => {
    setLoading(true);
    try {
      const data = await getVerseAnnotations(book, chapter, verse);
      setAnnotation(data);
    } catch (error) {
      console.error("Failed to load annotations:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze this verse. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateLinks = async () => {
    setLinksLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-reference",
          principle: selectedPrinciple,
          book,
          chapter,
          verses: [{ verse, text: verseText }],
        },
      });

      if (error) throw error;

      let parsedResults: ChainReference[] = [];
      try {
        const content = data.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        toast({
          title: "Error",
          description: "Failed to parse scripture links",
          variant: "destructive",
        });
        return;
      }

      setChainReferences(parsedResults);
      const principleLabel = PRINCIPLES.find(p => p.value === selectedPrinciple)?.label;
      toast({
        title: "Links Generated",
        description: `Found ${parsedResults.length} ${principleLabel} connections`,
      });
    } catch (error: any) {
      console.error("Chain reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate links",
        variant: "destructive",
      });
    } finally {
      setLinksLoading(false);
    }
  };

  const handleSaveAsGem = () => {
    if (!annotation) return;
    
    const gemText = `${book} ${chapter}:${verse}\n"${verseText}"\n\nPrinciples: ${
      [
        ...(annotation.principles.dimensions || []),
        ...(annotation.principles.cycles || []),
        ...(annotation.principles.horizons || []),
        ...(annotation.principles.timeZones || []),
        ...(annotation.principles.sanctuary || []),
        ...(annotation.principles.feasts || []),
        ...(annotation.principles.walls || [])
      ].join(", ")
    }\n\n${annotation.commentary}`;
    
    navigator.clipboard.writeText(gemText);
    
    toast({
      title: "Gem Saved!",
      description: "Analysis copied to clipboard. Paste it into your notes.",
    });
  };

  if (loading || !annotation) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-serif text-xl">
                {book} {chapter}:{verse}
              </CardTitle>
              <CardDescription>Analyzing with AI...</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Analyzing through the Palace framework...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24 shadow-elegant hover:shadow-hover transition-smooth animate-scale-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-serif text-xl">
              {book} {chapter}:{verse}
            </CardTitle>
            <CardDescription>Principle Analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadAnnotation}
              disabled={loading}
              className="hover:bg-primary/10"
            >
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-destructive/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="principles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="principles">
              <Layers className="h-4 w-4 mr-1" />
              Lenses
            </TabsTrigger>
            <TabsTrigger value="cross-refs">
              <ExternalLink className="h-4 w-4 mr-1" />
              Principle Links
            </TabsTrigger>
            <TabsTrigger value="christ">
              <Heart className="h-4 w-4 mr-1" />
              Christ
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="principles" className="space-y-4 mt-0">
              {/* Room Analysis Summary */}
              {annotation.roomsUsed && annotation.roomsUsed.length > 0 && (
                <div className="p-4 rounded-lg gradient-palace text-white shadow-purple">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Palace Rooms Analyzed: {annotation.roomsUsed.length}
                  </h4>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {annotation.roomsUsed.map((room) => (
                      <Link key={room} to={`/palace?room=${room}`}>
                        <Badge 
                          variant="secondary" 
                          className="bg-white/20 hover:bg-white/30 cursor-pointer transition-smooth hover-lift"
                        >
                          {room}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  {annotation.floorsCovered && (
                    <p className="text-xs opacity-90">
                      Floors covered: {annotation.floorsCovered.join(", ")}
                    </p>
                  )}
                </div>
              )}
              
              {/* Room-by-Room Analysis */}
              {annotation.roomAnalysis && Object.keys(annotation.roomAnalysis).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Room Insights</h4>
                  {Object.entries(annotation.roomAnalysis).map(([room, insight]) => (
                    <div key={room} className="p-3 rounded-lg border-2 border-border bg-card/50">
                      <div className="font-semibold text-primary mb-1">{room}</div>
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Dimensions */}
              {annotation.principles.dimensions && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full gradient-palace" />
                    Dimensions (1D=Literal, 2D=Christ, 3D=Me, 4D=Church, 5D=Heaven)
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.dimensions.map((dim) => (
                      <Badge key={dim} className="gradient-palace text-white shadow-purple">
                        {dim}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cycles */}
              {annotation.principles.cycles && annotation.principles.cycles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full gradient-ocean" />
                    Cycles
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.cycles.map((cycle) => (
                      <Badge key={cycle} className="gradient-ocean text-white shadow-blue">
                        {cycle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Horizons */}
              {annotation.principles.horizons && annotation.principles.horizons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full gradient-sunset" />
                    Horizons
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.horizons.map((horizon) => (
                      <Badge key={horizon} className="gradient-sunset text-white shadow-pink">
                        {horizon}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Time Zones */}
              {annotation.principles.timeZones && annotation.principles.timeZones.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full gradient-royal" />
                    Time Zones
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.timeZones.map((zone) => (
                      <Badge key={zone} className="gradient-royal text-white shadow-blue">
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sanctuary */}
              {annotation.principles.sanctuary && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-palace-blue" />
                    Sanctuary
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.sanctuary.map((article) => (
                      <Badge key={article} className="gradient-royal text-white shadow-blue">
                        {article}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Feasts */}
              {annotation.principles.feasts && annotation.principles.feasts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Feasts
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.feasts.map((feast) => (
                      <Badge key={feast} className="gradient-sunset text-white shadow-pink">
                        {feast}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Walls */}
              {annotation.principles.walls && annotation.principles.walls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-palace-blue" />
                    Walls
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {annotation.principles.walls.map((wall) => (
                      <Badge key={wall} className="gradient-palace text-white shadow-purple">
                        {wall}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Commentary */}
              {annotation.commentary && (
                <div className="pt-3 border-t">
                  <h4 className="font-semibold text-sm mb-2">Commentary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {annotation.commentary}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cross-refs" className="space-y-3 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Principle to Analyze</label>
                  <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a principle" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRINCIPLES.map((principle) => (
                        <SelectItem key={principle.value} value={principle.value}>
                          {principle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateLinks}
                  disabled={linksLoading}
                  className="w-full gradient-royal text-white"
                  size="sm"
                >
                  {linksLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Links...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Links
                    </>
                  )}
                </Button>

                {chainReferences.length > 0 ? (
                  <div className="space-y-3">
                    {chainReferences.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="gradient-palace text-white text-xs">
                              {result.reference}
                            </Badge>
                            {result.ptCodes && result.ptCodes.length > 0 && (
                              <div className="flex gap-1">
                                {result.ptCodes.map((code, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {code}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-foreground leading-relaxed mb-2">
                          {result.connection}
                        </p>

                        {result.crossReferences && result.crossReferences.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground">Cross References:</p>
                            {result.crossReferences.map((ref, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs bg-card/50 p-2 rounded">
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  {ref.reference}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium text-primary">{ref.relationship}</span>
                                  <span className="text-muted-foreground"> ({ref.confidence}%)</span>
                                  <p className="text-muted-foreground mt-0.5">{ref.note}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ExternalLink className="h-10 w-10 mx-auto mb-2 text-primary/50" />
                    <p className="text-xs">
                      Select a principle and generate links to discover related scriptures
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="christ" className="mt-0">
              {annotation.christCenter && (
                <div className="p-4 rounded-lg gradient-palace text-white shadow-purple">
                  <Heart className="h-8 w-8 mb-3 animate-float" />
                  <h4 className="font-semibold mb-2">Christ in This Verse</h4>
                  <p className="text-sm leading-relaxed">
                    {annotation.christCenter}
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSaveAsGem}
            className="gradient-palace text-white flex-1 shadow-purple"
          >
            <Save className="h-4 w-4 mr-1" />
            Save as Gem
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <BookOpen className="h-4 w-4 mr-1" />
            Export Study
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
