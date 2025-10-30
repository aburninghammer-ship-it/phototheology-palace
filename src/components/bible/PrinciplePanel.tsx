import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getVerseAnnotations } from "@/services/bibleApi";
import { VerseAnnotation } from "@/types/bible";
import { X, ExternalLink, Heart, BookOpen, Layers, Calendar, Building2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PrinciplePanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const PrinciplePanel = ({ book, chapter, verse, verseText, onClose }: PrinciplePanelProps) => {
  const [annotation, setAnnotation] = useState<VerseAnnotation | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleSaveAsGem = () => {
    if (!annotation) return;
    
    // Create gem text
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
    
    // Copy to clipboard
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
              Links
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
              {annotation.principles.dimensions && annotation.principles.dimensions.length > 0 && (
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
              {annotation.principles.sanctuary && annotation.principles.sanctuary.length > 0 && (
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
              {annotation.crossReferences && annotation.crossReferences.length > 0 ? (
                annotation.crossReferences.map((ref, idx) => (
                <Link
                  key={idx}
                  to={`/bible/${ref.book}/${ref.chapter}`}
                  className="block"
                >
                  <div className="p-3 rounded-lg border-2 border-border hover:border-primary hover-lift bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-primary">
                        {ref.book} {ref.chapter}:{ref.verse}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {ref.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      <strong className="text-foreground">{ref.principleType}:</strong> {ref.reason}
                    </p>
                  </div>
                </Link>
              ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No cross-references found for this verse</p>
                </div>
              )}
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
