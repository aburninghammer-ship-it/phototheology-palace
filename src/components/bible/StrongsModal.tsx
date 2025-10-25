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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
