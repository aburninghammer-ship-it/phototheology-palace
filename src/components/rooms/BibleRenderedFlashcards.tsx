import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers, Shuffle, RotateCcw, Check, X, Trophy, Eye, EyeOff, BookOpen, Lightbulb, Link2, LayoutGrid
} from "lucide-react";
import { bibleRenderedSets, BibleRenderedSet } from "@/data/bibleRenderedSets";
import { getFrameDetail } from "@/data/bibleRenderedFrameDetails";
import { getBibleRenderedImage } from "@/assets/bible-rendered";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FlashcardSide = "image" | "info";

const BibleRenderedFlashcards = () => {
  const [deck, setDeck] = useState<BibleRenderedSet[]>([...bibleRenderedSets]);
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<FlashcardSide>("image");
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const current = deck[index];
  const total = deck.length;

  const shuffle = useCallback(() => {
    setDeck([...bibleRenderedSets].sort(() => Math.random() - 0.5));
    setIndex(0);
    setSide("image");
    setKnown(new Set());
    setUnknown(new Set());
    setIsComplete(false);
  }, []);

  const reset = useCallback(() => {
    setDeck([...bibleRenderedSets]);
    setIndex(0);
    setSide("image");
    setKnown(new Set());
    setUnknown(new Set());
    setIsComplete(false);
  }, []);

  const advance = useCallback((mark: "known" | "unknown") => {
    if (mark === "known") {
      setKnown(prev => new Set(prev).add(current.number));
    } else {
      setUnknown(prev => new Set(prev).add(current.number));
    }

    if (index < total - 1) {
      setIndex(i => i + 1);
      setSide("image");
    } else {
      setIsComplete(true);
    }
  }, [index, total, current]);

  const retryMissed = useCallback(() => {
    const missedSets = bibleRenderedSets.filter(s => unknown.has(s.number));
    if (missedSets.length === 0) return;
    setDeck(missedSets.sort(() => Math.random() - 0.5));
    setIndex(0);
    setSide("image");
    setUnknown(new Set());
    setIsComplete(false);
  }, [unknown]);

  if (isComplete) {
    const knownCount = known.size;
    const unknownCount = unknown.size;
    const accuracy = Math.round((knownCount / (knownCount + unknownCount)) * 100);

    return (
      <Card className="border-2 border-primary/30">
        <CardContent className="py-12 text-center space-y-6">
          <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
          <h2 className="text-3xl font-bold">Flashcards Complete!</h2>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{knownCount}</p>
              <p className="text-sm text-muted-foreground">Knew It</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">{unknownCount}</p>
              <p className="text-sm text-muted-foreground">Missed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {unknownCount > 0 && (
              <Button onClick={retryMissed} variant="default">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry {unknownCount} Missed
              </Button>
            )}
            <Button onClick={shuffle} variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle All
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const img = getBibleRenderedImage(current.number);
  const frameDetail = getFrameDetail(current.number);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Flashcard Drill
          </CardTitle>
          <CardDescription>
            Flip each card, then mark whether you knew it. Retry missed cards at the end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{index + 1} / {total}</Badge>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-green-600"><Check className="h-3.5 w-3.5" />{known.size}</span>
              <span className="flex items-center gap-1 text-destructive"><X className="h-3.5 w-3.5" />{unknown.size}</span>
            </div>
          </div>
          <Progress value={((index + 1) / total) * 100} className="h-2" />

          {/* Flashcard */}
          <div style={{ perspective: 1000 }}>
            <motion.div
              key={`${current.number}-${side}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 bg-card"
                onClick={() => setSide(s => s === "image" ? "info" : "image")}
              >
                <CardContent className="p-6">
                {side === "image" ? (
                  <div className="text-center space-y-4 min-h-[320px] flex flex-col items-center justify-center">
                    {img ? (
                      <img src={img} alt={current.name} className="w-44 h-44 mx-auto rounded-xl object-cover shadow-lg" />
                    ) : (
                      <div className="text-8xl">{current.symbol}</div>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                      <Eye className="h-4 w-4" /> Tap to reveal
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[480px]">
                    <div className="space-y-4 pr-2">
                      {/* Header */}
                      <div className="text-center space-y-2">
                        <Badge className="mb-1">Frame #{current.number}</Badge>
                        <h2 className="text-xl font-bold">{current.name}</h2>
                        <div className="flex items-center gap-2 justify-center flex-wrap">
                          <Badge variant="outline">{current.range}</Badge>
                          <Badge variant={current.testament === "new" ? "default" : "secondary"}>
                            {current.testament === "new" ? "NT" : "OT"}
                          </Badge>
                          <Badge variant="outline">{current.chapters} ch</Badge>
                        </div>
                      </div>

                      {/* Theme Description */}
                      {frameDetail && (
                        <>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {frameDetail.themeDescription}
                          </p>

                          {/* Anchor Verse */}
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
                              <BookOpen className="h-3.5 w-3.5" />
                              Anchor Verse
                            </div>
                            <p className="text-sm font-semibold">{frameDetail.anchorVerse}</p>
                            <p className="text-sm italic text-muted-foreground">"{frameDetail.anchorVerseText}"</p>
                          </div>

                          {/* Gem Triggers */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase tracking-wide">
                              <Lightbulb className="h-3.5 w-3.5" />
                              Gem Triggers
                            </div>
                            {frameDetail.gemTriggers.map((trigger, i) => (
                              <p key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-amber-500/30">
                                {trigger}
                              </p>
                            ))}
                          </div>

                          {/* Connections */}
                          {frameDetail.connections.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                <Link2 className="h-3.5 w-3.5" />
                                Connections
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {frameDetail.connections.map((conn, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {conn}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PT Room Activation */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wide">
                              <LayoutGrid className="h-3.5 w-3.5" />
                              PT Room Activation
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {frameDetail.primaryRooms.map((room, i) => (
                                <Badge key={`p-${i}`} className="text-xs bg-purple-600/10 text-purple-700 border-purple-500/30">
                                  {room}
                                </Badge>
                              ))}
                              {frameDetail.secondaryRooms.map((room, i) => (
                                <Badge key={`s-${i}`} variant="outline" className="text-xs text-muted-foreground">
                                  {room}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Symbol badges */}
                      {current.symbols.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center pt-1">
                          {current.symbols.slice(0, 6).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center pt-2">
                        <EyeOff className="h-4 w-4" /> Tap to flip back
                      </p>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10 flex-1 max-w-[160px]"
              onClick={() => advance("unknown")}
            >
              <X className="h-4 w-4 mr-2" />
              Didn't Know
            </Button>
            <Button
              variant="outline"
              className="border-green-500/50 text-green-600 hover:bg-green-500/10 flex-1 max-w-[160px]"
              onClick={() => advance("known")}
            >
              <Check className="h-4 w-4 mr-2" />
              Knew It
            </Button>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={shuffle}>
              <Shuffle className="h-4 w-4 mr-1" /> Shuffle
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleRenderedFlashcards;
