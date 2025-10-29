import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Book, Languages, TrendingUp } from "lucide-react";
import { getStrongsEntry, StrongsEntry } from "@/services/strongsApi";

interface StrongsModalProps {
  strongsNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StrongsModal = ({ strongsNumber, isOpen, onClose }: StrongsModalProps) => {
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && strongsNumber) {
      loadStrongsEntry();
    }
  }, [isOpen, strongsNumber]);

  const loadStrongsEntry = async () => {
    setLoading(true);
    try {
      const data = await getStrongsEntry(strongsNumber);
      setEntry(data);
    } catch (error) {
      console.error("Error loading Strong's entry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entry ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <Badge variant="outline" className="gradient-palace text-white">
                  {entry.number}
                </Badge>
                <span className="font-serif text-3xl">{entry.word}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Transliteration & Pronunciation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm text-muted-foreground">
                    {entry.language}
                  </span>
                </div>
                <div className="flex gap-4 text-lg">
                  <div>
                    <span className="text-muted-foreground text-sm">Transliteration:</span>
                    <p className="font-medium italic">{entry.transliteration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Pronunciation:</span>
                    <p className="font-medium">{entry.pronunciation}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Definition */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Definition</h3>
                </div>
                <p className="text-foreground leading-relaxed">{entry.definition}</p>
              </div>

              <Separator />

              {/* Usage & Occurrences */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    KJV Translations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.usage.map((translation, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {translation}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Bible Occurrences</h3>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary">
                      {entry.occurrences}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      times in the KJV
                    </div>
                  </div>
                </div>
              </div>

              {/* Derivation */}
              {entry.derivation && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Derivation
                    </h3>
                    <p className="text-sm italic text-foreground/80">{entry.derivation}</p>
                  </div>
                </>
              )}

              {/* Phototheology Extensions */}
              {(entry.sanctuary_link || entry.time_zone_code || entry.dimension_code || 
                entry.cycle_association || entry.floor_rooms) && (
                <>
                  <Separator />
                  <div className="mt-6 space-y-4 pt-6 border-t-2 border-palace-teal/20">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="text-palace-teal text-2xl">🏰</span>
                      Phototheology Palace Connections
                    </h3>

                    {entry.sanctuary_link && (
                      <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                        <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                          📍 Sanctuary Link
                        </h4>
                        <p className="text-sm leading-relaxed">{entry.sanctuary_link}</p>
                      </div>
                    )}

                    {entry.time_zone_code && (
                      <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                        <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                          ⏰ Time-Zone Code
                        </h4>
                        <p className="text-sm font-mono">{entry.time_zone_code}</p>
                      </div>
                    )}

                    {entry.dimension_code && (
                      <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                        <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                          📐 Dimension Code
                        </h4>
                        <p className="text-sm font-mono">{entry.dimension_code}</p>
                      </div>
                    )}

                    {entry.cycle_association && (
                      <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                        <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                          🔄 Cycle Association
                        </h4>
                        <p className="text-sm font-mono">{entry.cycle_association}</p>
                      </div>
                    )}

                    {entry.floor_rooms && entry.floor_rooms.length > 0 && (
                      <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                        <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                          🏛️ Palace Rooms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.floor_rooms.map((room, idx) => (
                            <span key={idx} className="px-3 py-1 bg-palace-teal/20 text-palace-teal rounded-full text-sm font-medium border border-palace-teal/30">
                              {room}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Strong's entry not found for {strongsNumber}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
