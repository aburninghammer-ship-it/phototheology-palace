import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Send,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import {
  PROPHECY_COMPARISONS,
  type ProphecyComparison,
  type InterpretationView,
} from "@/data/prophecyInterpretationData";

export function ProphecyComparisonMode() {
  const [selectedProphecy, setSelectedProphecy] =
    useState<ProphecyComparison | null>(null);
  const [jeevesQuestion, setJeevesQuestion] = useState("");
  const [jeevesResponse, setJeevesResponse] = useState<string | null>(null);
  const [jeevesLoading, setJeevesLoading] = useState(false);

  const askJeeves = async () => {
    if (!selectedProphecy || !jeevesQuestion.trim()) return;
    setJeevesLoading(true);
    setJeevesResponse(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-prophecy-compare",
          prophecyRef: selectedProphecy.scriptureRef,
          prophecyTitle: selectedProphecy.title,
          question: jeevesQuestion.trim(),
        },
      });
      if (error) throw error;
      setJeevesResponse(data?.content || "Unable to analyze at this time.");
    } catch {
      setJeevesResponse("Failed to get response. Please try again.");
    } finally {
      setJeevesLoading(false);
    }
  };

  const danielProphecies = PROPHECY_COMPARISONS.filter(
    (p) => p.category === "daniel"
  );
  const revelationProphecies = PROPHECY_COMPARISONS.filter(
    (p) => p.category === "revelation"
  );

  const renderInterpretationColumn = (
    view: InterpretationView,
    type: "historicist" | "futurist" | "preterist"
  ) => {
    const isHistoricist = type === "historicist";
    const label =
      type === "historicist"
        ? "HISTORICIST (SDA Position)"
        : type === "futurist"
          ? "FUTURIST (Jesuit Counter-Reformation)"
          : "PRETERIST (Jesuit Counter-Reformation)";

    return (
      <Card
        className={
          isHistoricist
            ? "border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-green-950/20"
            : "border-muted-foreground/20 bg-muted/10 opacity-80"
        }
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            {isHistoricist ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wide ${
                isHistoricist
                  ? "text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Summary
              </p>
              <p className="text-sm text-foreground">{view.summary}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Identification
              </p>
              <p className="text-sm text-foreground">{view.identification}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Timeframe
              </p>
              <p className="text-sm text-foreground">{view.timeframe}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Key Arguments
              </p>
              <ul className="space-y-1">
                {view.keyArguments.map((arg, i) => (
                  <li
                    key={i}
                    className="text-sm text-foreground flex items-start gap-2"
                  >
                    <span className="text-muted-foreground mt-1 shrink-0">
                      &bull;
                    </span>
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!isHistoricist && view.weaknesses.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-400 mb-1">
                  Weaknesses
                </p>
                <ul className="space-y-1">
                  {view.weaknesses.map((w, i) => (
                    <li
                      key={i}
                      className="text-sm text-red-400/90 flex items-start gap-2"
                    >
                      <span className="mt-1 shrink-0">&bull;</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCategorySection = (
    prophecies: ProphecyComparison[],
    label: string
  ) => {
    if (prophecies.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prophecies.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer border-muted-foreground/20 hover:border-amber-500/40 transition-colors"
                onClick={() => {
                  setSelectedProphecy(p);
                  setJeevesQuestion("");
                  setJeevesResponse(null);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        {p.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {p.scriptureRef}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0 border-amber-500/30 text-amber-400"
                    >
                      {p.category === "daniel" ? "Daniel" : "Revelation"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Prophecy Interpretation Comparison
          </h2>
          <p className="text-xs text-muted-foreground">
            Compare historicist, futurist, and preterist views side by side
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedProphecy ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {renderCategorySection(danielProphecies, "Book of Daniel")}
            {renderCategorySection(
              revelationProphecies,
              "Book of Revelation"
            )}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-2">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground"
                  onClick={() => setSelectedProphecy(null)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to all prophecies
                </Button>

                {/* Title + scripture ref */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedProphecy.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-indigo-500/30 text-indigo-400 text-xs"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      {selectedProphecy.scriptureRef}
                    </Badge>
                    <QuickAudioButton
                      text={selectedProphecy.whyHistoricistWins}
                    />
                  </div>
                </div>

                {/* KJV Key Verses */}
                <Card className="border-amber-500/40 bg-background/50">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">
                      KJV Key Verses
                    </p>
                    <div className="space-y-2">
                      {selectedProphecy.kjvKeyVerses.map((verse, i) => (
                        <blockquote
                          key={i}
                          className="border-l-2 border-amber-500/60 pl-3 text-sm italic text-foreground/90"
                        >
                          {verse}
                        </blockquote>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 3-column comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {renderInterpretationColumn(
                    selectedProphecy.historicist,
                    "historicist"
                  )}
                  {renderInterpretationColumn(
                    selectedProphecy.futurist,
                    "futurist"
                  )}
                  {renderInterpretationColumn(
                    selectedProphecy.preterist,
                    "preterist"
                  )}
                </div>

                {/* Why Historicist Wins */}
                <Card className="border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-green-950/30">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                        Why Historicist Wins
                      </h4>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedProphecy.whyHistoricistWins}
                    </p>
                  </CardContent>
                </Card>

                {/* Ask Jeeves */}
                <Card className="border-muted-foreground/20 bg-background/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-semibold text-foreground">
                        Ask Jeeves About This Prophecy
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-muted/30 border border-muted-foreground/20 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                        placeholder="e.g. How do futurists respond to the year-day principle?"
                        value={jeevesQuestion}
                        onChange={(e) => setJeevesQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !jeevesLoading) {
                            askJeeves();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-1"
                        onClick={askJeeves}
                        disabled={
                          jeevesLoading || !jeevesQuestion.trim()
                        }
                      >
                        {jeevesLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {jeevesResponse && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Card className="border-indigo-500/30 bg-indigo-950/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-indigo-400">
                                  Jeeves Response
                                </p>
                                <QuickAudioButton text={jeevesResponse} />
                              </div>
                              <div className="prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>
                                  {jeevesResponse}
                                </ReactMarkdown>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
