import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronLeft,
  Loader2,
  Send,
  Sparkles,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";
import {
  biblicalCharacterProfiles,
  type CharacterProfile,
  type Era,
} from "@/data/biblicalCharacterProfiles";

const ERAS: Era[] = [
  "Creation",
  "Patriarchs",
  "Exodus",
  "Conquest",
  "Judges",
  "United Kingdom",
  "Divided Kingdom",
  "Exile",
  "Post-Exile",
  "Gospels",
  "Early Church",
];

const MiniDNA = ({ dna }: { dna: CharacterProfile["dna"] }) => (
  <div className="flex gap-1 mt-1">
    {[
      { key: "faith", color: "bg-amber-500", val: dna.faith },
      { key: "courage", color: "bg-red-500", val: dna.courage },
      { key: "wisdom", color: "bg-blue-500", val: dna.wisdom },
      { key: "compassion", color: "bg-green-500", val: dna.compassion },
    ].map((t) => (
      <div key={t.key} className="flex-1">
        <div className="h-1 rounded-full bg-muted-foreground/20">
          <div
            className={`h-1 rounded-full ${t.color}`}
            style={{ width: `${(t.val / 5) * 100}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

export function SpiritualCharacterSimulator() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterProfile | null>(null);
  const [phase, setPhase] = useState<
    "character-select" | "scenario" | "response" | "analysis"
  >("character-select");
  const [scenario, setScenario] = useState<{
    narrative: string;
    choices: string[];
  } | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [customResponse, setCustomResponse] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredCharacters = useMemo(() => {
    let chars = biblicalCharacterProfiles;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      chars = chars.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.era.toLowerCase().includes(q) ||
          c.archetypes.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (selectedEra) {
      chars = chars.filter((c) => c.era === selectedEra);
    }
    return chars;
  }, [searchQuery, selectedEra]);

  const visibleCharacters = showAll
    ? filteredCharacters
    : filteredCharacters.slice(0, 40);

  const generateScenario = async (character: CharacterProfile) => {
    setScenarioLoading(true);
    setScenario(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-character-simulate",
          characterId: character.id,
          characterName: character.name,
          characterEra: character.era,
          characterDNA: character.dna,
          characterSituations:
            character.situations?.slice(0, 3).map((s) => s.situation) || [],
          characterArchetypes: character.archetypes,
        },
      });
      if (error) throw error;
      const content = data?.content || "";
      const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        setScenario({
          narrative: parsed.narrative || parsed.scenario || "",
          choices: parsed.choices || [],
        });
      } else {
        setScenario({
          narrative: content,
          choices: [
            "Trust God completely",
            "Rely on own wisdom",
            "Seek counsel from others",
            "Take the cautious path",
          ],
        });
      }
    } catch {
      setScenario({
        narrative:
          "The scenario could not be generated. Please try again.",
        choices: [],
      });
    } finally {
      setScenarioLoading(false);
    }
  };

  const analyzeChoice = async () => {
    if (!selectedCharacter || !scenario) return;
    const choiceText = selectedChoice || customResponse;
    if (!choiceText?.trim()) return;
    setAnalysisLoading(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-character-apply",
          characterId: selectedCharacter.id,
          characterName: selectedCharacter.name,
          characterDNA: selectedCharacter.dna,
          scenario: scenario.narrative,
          userChoice: choiceText.trim(),
          characterSituations:
            selectedCharacter.situations?.slice(0, 3) || [],
        },
      });
      if (error) throw error;
      setAnalysis(data?.content || "Analysis unavailable.");
      setPhase("analysis");
    } catch {
      setAnalysis("Failed to analyze choice. Please try again.");
      setPhase("analysis");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const selectCharacter = (character: CharacterProfile) => {
    setSelectedCharacter(character);
    setPhase("scenario");
    setScenario(null);
    setSelectedChoice(null);
    setCustomResponse("");
    setAnalysis(null);
    generateScenario(character);
  };

  const resetToCharacterSelect = () => {
    setSelectedCharacter(null);
    setPhase("character-select");
    setScenario(null);
    setSelectedChoice(null);
    setCustomResponse("");
    setAnalysis(null);
  };

  const tryAnotherScenario = () => {
    if (!selectedCharacter) return;
    setPhase("scenario");
    setScenario(null);
    setSelectedChoice(null);
    setCustomResponse("");
    setAnalysis(null);
    generateScenario(selectedCharacter);
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {/* CHARACTER SELECT */}
        {phase === "character-select" && (
          <motion.div
            key="character-select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 rounded-t-lg">
              <div className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-bold">
                  Spiritual Character Simulator
                </h2>
              </div>
              <p className="text-white/80 text-sm mt-1">
                Step into the shoes of a biblical character and face their
                real dilemmas
              </p>
            </div>

            {/* Search and Era Filter */}
            <div className="p-3 space-y-2 border-b border-border">
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <ScrollArea className="w-full">
                <div className="flex gap-1.5 pb-1">
                  <Badge
                    variant={selectedEra === "" ? "default" : "outline"}
                    className="cursor-pointer shrink-0 text-xs"
                    onClick={() => setSelectedEra("")}
                  >
                    All Eras
                  </Badge>
                  {ERAS.map((era) => (
                    <Badge
                      key={era}
                      variant={selectedEra === era ? "default" : "outline"}
                      className="cursor-pointer shrink-0 text-xs"
                      onClick={() =>
                        setSelectedEra(selectedEra === era ? "" : era)
                      }
                    >
                      {era}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Character Grid */}
            <ScrollArea className="flex-1 p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {visibleCharacters.map((character) => (
                  <motion.div
                    key={character.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Card
                      className="cursor-pointer bg-card/60 backdrop-blur border-border/50 hover:border-teal-500/50 hover:bg-card/80 transition-all"
                      onClick={() => selectCharacter(character)}
                    >
                      <CardContent className="p-2.5">
                        <div className="flex items-start gap-2">
                          <span className="text-2xl leading-none">
                            {character.emoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm leading-tight truncate">
                              {character.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {character.era}
                            </p>
                          </div>
                        </div>
                        {character.archetypes?.[0] && (
                          <Badge
                            variant="secondary"
                            className="mt-1.5 text-[10px] h-4 px-1.5"
                          >
                            {character.archetypes[0]}
                          </Badge>
                        )}
                        <MiniDNA dna={character.dna} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredCharacters.length > 40 && !showAll && (
                <div className="flex justify-center mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAll(true)}
                  >
                    Show More ({filteredCharacters.length - 40} remaining)
                  </Button>
                </div>
              )}

              {filteredCharacters.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No characters match your search.
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}

        {/* SCENARIO PHASE */}
        {(phase === "scenario" || phase === "response") &&
          selectedCharacter && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full"
            >
              {/* Character Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={resetToCharacterSelect}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="text-2xl">{selectedCharacter.emoji}</span>
                  <div>
                    <h2 className="text-white font-bold">
                      {selectedCharacter.name}
                    </h2>
                    <p className="text-white/70 text-xs">
                      {selectedCharacter.era}
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                {/* Loading */}
                {scenarioLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                    <p className="text-sm text-muted-foreground">
                      Generating scenario for {selectedCharacter.name}...
                    </p>
                  </div>
                )}

                {/* Scenario Content */}
                {scenario && !scenarioLoading && (
                  <div className="space-y-4">
                    {/* Narrative */}
                    <Card className="bg-card/60 backdrop-blur border-teal-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                          <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">
                            The Scenario
                          </span>
                        </div>
                        <blockquote className="border-l-2 border-teal-500/50 pl-3 italic text-sm leading-relaxed text-foreground/90">
                          {scenario.narrative}
                        </blockquote>
                        <div className="flex justify-end mt-2">
                          <QuickAudioButton
                            text={scenario.narrative}
                            variant="ghost"
                            size="sm"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Choices */}
                    {scenario.choices.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                          What would you do?
                        </p>
                        {scenario.choices.map((choice, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Card
                              className={`cursor-pointer transition-all border ${
                                selectedChoice === choice
                                  ? "border-teal-500 bg-teal-500/10"
                                  : "border-border/50 hover:border-teal-500/40 hover:bg-card/80"
                              }`}
                              onClick={() => {
                                setSelectedChoice(choice);
                                setCustomResponse("");
                              }}
                            >
                              <CardContent className="p-3 flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                                    selectedChoice === choice
                                      ? "border-teal-500 bg-teal-500 text-white"
                                      : "border-muted-foreground/40 text-muted-foreground"
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <span className="text-sm">{choice}</span>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Custom Response */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                        Or write your own response
                      </p>
                      <Textarea
                        placeholder="What would you do in this situation?"
                        value={customResponse}
                        onChange={(e) => {
                          setCustomResponse(e.target.value);
                          if (e.target.value.trim()) setSelectedChoice(null);
                        }}
                        className="min-h-[80px] bg-muted/50 border-border/50 text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                      disabled={
                        (!selectedChoice && !customResponse.trim()) ||
                        analysisLoading
                      }
                      onClick={analyzeChoice}
                    >
                      {analysisLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing your choice...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          See How {selectedCharacter.name} Responded
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}

        {/* ANALYSIS PHASE */}
        {phase === "analysis" && selectedCharacter && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={() => setPhase("scenario")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Sparkles className="h-5 w-5 text-white" />
                <div>
                  <h2 className="text-white font-bold">
                    Analysis: {selectedCharacter.name}
                  </h2>
                  <p className="text-white/70 text-xs">
                    How your choice compares
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {analysis ? (
                <div className="space-y-4">
                  <Card className="bg-card/60 backdrop-blur border-border/50">
                    <CardContent className="p-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-teal-400 prose-strong:text-foreground prose-p:text-foreground/85 prose-li:text-foreground/85">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                      <div className="flex justify-end mt-3">
                        <QuickAudioButton
                          text={analysis}
                          variant="ghost"
                          size="sm"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={tryAnotherScenario}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Try Another Scenario
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetToCharacterSelect}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Change Character
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                  <p className="text-sm text-muted-foreground">
                    Building analysis...
                  </p>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
