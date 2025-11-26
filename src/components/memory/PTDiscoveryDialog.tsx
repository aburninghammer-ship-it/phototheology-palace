import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, BookOpen, Layers, MapPin, Church, Calendar, Compass } from "lucide-react";

interface PTInsights {
  christ_center?: string;
  dimensions?: string[];
  cycles?: string[];
  horizons?: string[];
  sanctuary_connections?: Array<{ article: string; explanation: string }>;
  feast_connections?: Array<{ feast: string; explanation: string }>;
  walls?: string[];
  cross_references?: Array<{ verse: string; reason: string; principles: string[] }>;
}

interface PTDiscoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseReference: string;
  verseText: string;
  ptInsights: PTInsights | null;
  onViewCrossReference?: (verse: string) => void;
}

export default function PTDiscoveryDialog({
  open,
  onOpenChange,
  verseReference,
  verseText,
  ptInsights,
  onViewCrossReference
}: PTDiscoveryDialogProps) {
  if (!ptInsights) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>PT Discovery Unlocked!</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {verseReference}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Christ Center */}
            {ptInsights.christ_center && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Christ-Centered Interpretation</h3>
                </div>
                <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
                  {ptInsights.christ_center}
                </p>
              </div>
            )}

            {/* Dimensions */}
            {ptInsights.dimensions && ptInsights.dimensions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold">Dimensions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ptInsights.dimensions.map((dim) => (
                    <Badge key={dim} variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      {dim}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Cycles */}
            {ptInsights.cycles && ptInsights.cycles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-purple-500" />
                  <h3 className="font-semibold">Cycles</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ptInsights.cycles.map((cycle) => (
                    <Badge key={cycle} variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      {cycle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Horizons */}
            {ptInsights.horizons && ptInsights.horizons.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <h3 className="font-semibold">Horizons (Day of the LORD)</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ptInsights.horizons.map((horizon) => (
                    <Badge key={horizon} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                      {horizon}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Sanctuary Connections */}
            {ptInsights.sanctuary_connections && ptInsights.sanctuary_connections.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Church className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold">Sanctuary Connections</h3>
                </div>
                <div className="space-y-2">
                  {ptInsights.sanctuary_connections.map((conn, idx) => (
                    <div key={idx} className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                      <div className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                        {conn.article}
                      </div>
                      <p className="text-sm text-muted-foreground">{conn.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feast Connections */}
            {ptInsights.feast_connections && ptInsights.feast_connections.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-500" />
                  <h3 className="font-semibold">Feast Connections</h3>
                </div>
                <div className="space-y-2">
                  {ptInsights.feast_connections.map((conn, idx) => (
                    <div key={idx} className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
                      <div className="font-medium text-rose-700 dark:text-rose-300 mb-1">
                        {conn.feast}
                      </div>
                      <p className="text-sm text-muted-foreground">{conn.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cross References */}
            {ptInsights.cross_references && ptInsights.cross_references.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Related Verses</h3>
                <div className="space-y-2">
                  {ptInsights.cross_references.map((ref, idx) => (
                    <div key={idx} className="bg-muted/50 p-3 rounded-lg border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-primary mb-1">{ref.verse}</div>
                          <p className="text-sm text-muted-foreground mb-2">{ref.reason}</p>
                          <div className="flex flex-wrap gap-1">
                            {ref.principles.map((p) => (
                              <Badge key={p} variant="outline" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {onViewCrossReference && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewCrossReference(ref.verse)}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
