import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Book, Languages, TrendingUp, Church, Clock, Box, Repeat, Scroll, BookOpen, FileText } from "lucide-react";
import { getStrongsEntry, StrongsEntry, getStrongsConcordance, ConcordanceEntry } from "@/services/strongsApi";

interface StrongsModalProps {
  strongsNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const StrongsModal = ({ strongsNumber, isOpen, onClose }: StrongsModalProps) => {
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [concordance, setConcordance] = useState<ConcordanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConcordance, setLoadingConcordance] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("definition");

  useEffect(() => {
    if (isOpen && strongsNumber) {
      loadStrongsEntry();
      loadConcordance();
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

  const loadConcordance = async () => {
    setLoadingConcordance(true);
    try {
      const data = await getStrongsConcordance(strongsNumber);
      setConcordance(data);
    } catch (error) {
      console.error("Error loading concordance:", error);
    } finally {
      setLoadingConcordance(false);
    }
  };

  // Group concordance entries by translation word
  const groupedByTranslation = concordance.reduce((acc, entry) => {
    const word = entry.translation.toLowerCase();
    if (!acc[word]) {
      acc[word] = [];
    }
    acc[word].push(entry);
    return acc;
  }, {} as Record<string, ConcordanceEntry[]>);

  // Sort translations by frequency
  const sortedTranslations = Object.entries(groupedByTranslation)
    .sort((a, b) => b[1].length - a[1].length);

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

            {/* Main Tabs for Definition and Concordance */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="definition" className="gap-2">
                  <Book className="h-4 w-4" />
                  Definition
                </TabsTrigger>
                <TabsTrigger value="concordance" className="gap-2">
                  <FileText className="h-4 w-4" />
                  KJV Concordance
                  {concordance.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {concordance.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Definition Tab */}
              <TabsContent value="definition" className="space-y-6 mt-0">
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

                {/* Phototheology Section */}
                {(entry.sanctuary_link || entry.time_zone_code || entry.dimension_code ||
                  entry.cycle_code || entry.prophecy_link || entry.pt_notes) && (
                  <>
                    <Separator />
                    <Tabs defaultValue="lexicon" className="mt-4">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="lexicon">
                          <Book className="h-4 w-4 mr-1" />
                          Lexicon
                        </TabsTrigger>
                        <TabsTrigger value="sanctuary" disabled={!entry.sanctuary_link}>
                          <Church className="h-4 w-4 mr-1" />
                          Sanctuary
                        </TabsTrigger>
                        <TabsTrigger value="timezones" disabled={!entry.time_zone_code}>
                          <Clock className="h-4 w-4 mr-1" />
                          Time-Zones
                        </TabsTrigger>
                        <TabsTrigger value="dimensions" disabled={!entry.dimension_code}>
                          <Box className="h-4 w-4 mr-1" />
                          Dimensions
                        </TabsTrigger>
                        <TabsTrigger value="prophecy" disabled={!entry.cycle_code && !entry.prophecy_link}>
                          <Repeat className="h-4 w-4 mr-1" />
                          Prophecy
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="lexicon" className="space-y-4 mt-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed">{entry.definition}</p>
                        </div>
                        {entry.pt_notes && (
                          <div className="bg-palace-sand/20 p-4 rounded-lg border border-palace-teal/20">
                            <h4 className="font-medium mb-2 text-palace-teal flex items-center gap-2">
                              <Scroll className="h-4 w-4" />
                              Phototheology Notes
                            </h4>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{entry.pt_notes}</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="sanctuary" className="mt-4">
                        <div className="bg-palace-sand/20 p-6 rounded-lg border border-palace-teal/20">
                          <h4 className="font-semibold mb-3 text-palace-teal flex items-center gap-2 text-lg">
                            <Church className="h-5 w-5" />
                            Sanctuary Connection
                          </h4>
                          <p className="text-sm leading-relaxed">{entry.sanctuary_link}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="timezones" className="mt-4">
                        <div className="bg-palace-sand/20 p-6 rounded-lg border border-palace-teal/20">
                          <h4 className="font-semibold mb-3 text-palace-teal flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5" />
                            Time-Zone Placement
                          </h4>
                          <p className="text-lg font-mono bg-muted/50 p-3 rounded">{entry.time_zone_code}</p>
                          <p className="text-xs text-muted-foreground mt-3">
                            Format: H/E (Heaven/Earth) + pa/pr/f (past/present/future)
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="dimensions" className="mt-4">
                        <div className="bg-palace-sand/20 p-6 rounded-lg border border-palace-teal/20">
                          <h4 className="font-semibold mb-3 text-palace-teal flex items-center gap-2 text-lg">
                            <Box className="h-5 w-5" />
                            Dimension Room
                          </h4>
                          <p className="text-lg font-mono bg-muted/50 p-3 rounded">{entry.dimension_code}</p>
                          <div className="mt-3 text-sm space-y-1">
                            <p className="text-muted-foreground">Dimensions:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>1D = Literal meaning</li>
                              <li>2D = Symbolic/Typological</li>
                              <li>3D = Christ-centered fulfillment</li>
                              <li>4D = Church application</li>
                              <li>5D = Heavenly/Eternal perspective</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="prophecy" className="mt-4 space-y-4">
                        {entry.cycle_code && (
                          <div className="bg-palace-sand/20 p-6 rounded-lg border border-palace-teal/20">
                            <h4 className="font-semibold mb-3 text-palace-teal flex items-center gap-2 text-lg">
                              <Repeat className="h-5 w-5" />
                              Cycle Code
                            </h4>
                            <p className="text-lg font-mono bg-muted/50 p-3 rounded">{entry.cycle_code}</p>
                          </div>
                        )}
                        {entry.prophecy_link && (
                          <div className="bg-palace-sand/20 p-6 rounded-lg border border-palace-teal/20">
                            <h4 className="font-semibold mb-3 text-palace-teal flex items-center gap-2 text-lg">
                              <Scroll className="h-5 w-5" />
                              Prophetic Timeline
                            </h4>
                            <p className="text-sm leading-relaxed">{entry.prophecy_link}</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </TabsContent>

              {/* KJV Concordance Tab */}
              <TabsContent value="concordance" className="mt-0">
                {loadingConcordance ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : concordance.length > 0 ? (
                  <div className="space-y-6">
                    {/* Translation Summary */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        How This Word Is Translated
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {sortedTranslations.map(([word, entries]) => (
                          <Badge
                            key={word}
                            variant="outline"
                            className="text-sm cursor-pointer hover:bg-primary/10"
                          >
                            {word} ({entries.length}x)
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Verse List */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Verses Where This Word Appears
                      </h4>
                      <ScrollArea className="h-[350px] pr-4">
                        <div className="space-y-3">
                          {concordance.map((verse, idx) => (
                            <div
                              key={`${verse.book}-${verse.chapter}-${verse.verse}-${idx}`}
                              className="bg-muted/20 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs font-medium">
                                  {verse.book} {verse.chapter}:{verse.verse}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  → {verse.translation}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed">
                                {verse.text.split(new RegExp(`(${verse.highlightWord})`, 'gi')).map((part, i) =>
                                  part.toLowerCase() === verse.highlightWord.toLowerCase() ? (
                                    <span key={i} className="bg-primary/20 text-primary font-medium px-0.5 rounded">
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">
                      No concordance data available
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Concordance data for this word hasn't been loaded yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center p-8 space-y-3">
            <Book className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">
              Strong's entry not found for {strongsNumber}
            </p>
            <p className="text-sm text-muted-foreground/80">
              This entry may not be in the lexicon yet. The full Strong's concordance 
              contains thousands of entries.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
