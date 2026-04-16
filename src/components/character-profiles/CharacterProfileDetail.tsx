import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Heart,
  Shield,
  Swords,
  Users,
  Lightbulb,
  Map,
  Eye,
  Flame,
  ChevronRight,
  AlertTriangle,
  Volume2,
  Square,
  Loader2,
} from "lucide-react";
import type {
  CharacterProfile,
  SituationAnalysis,
  CharacterDNA,
} from "@/data/biblicalCharacterProfiles";
import { cn } from "@/lib/utils";
import { CharacterDeepAnalysis } from "./CharacterDeepAnalysis";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface CharacterProfileDetailProps {
  character: CharacterProfile;
  imageUrl?: string;
  onBack: () => void;
  onNavigateToCharacter?: (id: string) => void;
  allCharacters?: CharacterProfile[];
}

const traitLabels: { key: keyof CharacterDNA; label: string; positive: boolean }[] = [
  { key: "faith", label: "Faith", positive: true },
  { key: "humility", label: "Humility", positive: true },
  { key: "courage", label: "Courage", positive: true },
  { key: "wisdom", label: "Wisdom", positive: true },
  { key: "compassion", label: "Compassion", positive: true },
  { key: "fear", label: "Fear", positive: false },
  { key: "pride", label: "Pride", positive: false },
  { key: "greed", label: "Greed", positive: false },
];

const traitBarColor = (positive: boolean, value: number) => {
  if (positive) {
    if (value >= 4) return "bg-emerald-500";
    if (value >= 3) return "bg-emerald-400";
    if (value >= 2) return "bg-amber-400";
    return "bg-red-400";
  }
  if (value >= 4) return "bg-red-500";
  if (value >= 3) return "bg-amber-400";
  return "bg-emerald-400";
};

const journeyPhaseIcons: Record<string, string> = {
  Calling: "📢",
  Resistance: "🛡️",
  Testing: "🔥",
  Failure: "💔",
  Refinement: "⚒️",
  Legacy: "🏛️",
};

const situationCategoryColors: Record<string, string> = {
  Temptation: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  Rejection: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  "Leadership Pressure": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Correction: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Fear: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  Betrayal: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Waiting: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  "Power and Success": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Loss: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  Conflict: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "Faith Testing": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Obedience: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  Sacrifice: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Restoration: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Calling: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  Persecution: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
};

/**
 * Build a narrative text from character data for TTS narration
 */
function buildCharacterNarrative(character: CharacterProfile): string {
  const parts: string[] = [];

  // Introduction
  parts.push(
    `${character.name}. ${character.meaning}. ${character.role}.`
  );
  parts.push(
    `Key verse: ${character.quickCard.keyVerse}.`
  );

  // Quick Card summary
  parts.push(
    `Archetype: ${character.quickCard.archetype}. ` +
    `Greatest strength: ${character.quickCard.strength}. ` +
    `Greatest weakness: ${character.quickCard.weakness}. ` +
    `Mindset: ${character.quickCard.mindset}. ` +
    `Key lesson: ${character.quickCard.keyLesson}.`
  );

  // Story Arc
  parts.push(`Story Arc. ${character.storyArc}`);

  // Therapy View
  const tv = character.therapyView;
  parts.push(
    `Therapy View. ` +
    `Driving fears: ${tv.drivingFears.join(", ")}. ` +
    `Core motivations: ${tv.coreMotivations.join(", ")}. ` +
    `Relational style: ${tv.relationalStyle}. ` +
    `Blind spots: ${tv.blindSpots.join(". ")}. ` +
    `Healing moments: ${tv.healingMoments.join(". ")}.`
  );

  // Strengths & Weaknesses
  parts.push(
    `Strengths: ${character.strengths.join(", ")}. ` +
    `Weaknesses: ${character.weaknesses.join(", ")}.`
  );

  // Journey
  parts.push(
    `Journey. ` +
    character.journey
      .map((p) => `${p.phase}: ${p.description}`)
      .join(". ") +
    "."
  );

  // Top situations (limit to 3 to keep audio reasonable)
  const topSituations = character.situations.slice(0, 3);
  if (topSituations.length > 0) {
    parts.push(`Key Situations.`);
    for (const sit of topSituations) {
      parts.push(
        `${sit.title}. ${sit.reference}. ` +
        `${sit.situation} ` +
        `The pressure: ${sit.pressure} ` +
        `The inner battle: ${sit.innerBattle} ` +
        `The response: ${sit.response} ` +
        `The outcome: ${sit.outcome} ` +
        `Spiritual principle: ${sit.spiritualPrinciple}.`
      );
    }
  }

  // Lessons
  if (character.lessonsAndReflection.length > 0) {
    parts.push(
      `Lessons and Reflection. ` +
      character.lessonsAndReflection.join(". ") +
      "."
    );
  }

  return parts.join("\n\n");
}

function DNAChart({ dna }: { dna: CharacterDNA }) {
  return (
    <div className="space-y-2">
      {traitLabels.map(({ key, label, positive }) => {
        // Clamp all values to 0-5 range — Jesus is the standard at 5/5
        const rawValue = dna[key];
        const value = Math.max(0, Math.min(5, rawValue));
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm w-24 text-right font-medium">{label}</span>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", traitBarColor(positive, value))}
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm w-6 text-muted-foreground">{value}/5</span>
          </div>
        );
      })}
    </div>
  );
}

function SituationCard({
  situation,
  characterEmoji,
}: {
  situation: SituationAnalysis;
  characterEmoji: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{characterEmoji}</span>
              <CardTitle className="text-base">{situation.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={cn("text-xs", situationCategoryColors[situation.category] || "")}
              >
                {situation.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{situation.reference}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Quick view - always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground font-medium">Pressure: </span>
            <span>{situation.pressure.split(".")[0]}.</span>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">Response: </span>
            <span>{situation.response.split(".")[0]}.</span>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">Outcome: </span>
            <span>{situation.outcome.split(".")[0]}.</span>
          </div>
          <div>
            <span className="text-muted-foreground font-medium">Trait: </span>
            <span>{situation.traitRevealed}</span>
          </div>
        </div>

        <p className="text-sm italic border-l-2 border-primary/30 pl-3 text-muted-foreground">
          {situation.lesson}
        </p>

        {!expanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="text-primary"
          >
            Expand Full Analysis <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}

        {expanded && (
          <div className="space-y-4 pt-2 border-t">
            {situation.keyVerse && (
              <blockquote className="text-sm italic bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                {situation.keyVerse}
              </blockquote>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Eye className="h-4 w-4" /> Situation
                </h4>
                <p className="text-muted-foreground">{situation.situation}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-4 w-4" /> Pressure
                </h4>
                <p className="text-muted-foreground">{situation.pressure}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Brain className="h-4 w-4" /> Inner Battle
                </h4>
                <p className="text-muted-foreground">{situation.innerBattle}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Swords className="h-4 w-4" /> Response
                </h4>
                <p className="text-muted-foreground">{situation.response}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Map className="h-4 w-4" /> Outcome
                </h4>
                <p className="text-muted-foreground">{situation.outcome}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1 mb-1">
                  <Flame className="h-4 w-4" /> Spiritual Principle
                </h4>
                <p className="text-muted-foreground">{situation.spiritualPrinciple}</p>
              </div>
            </div>

            {situation.dnaSnapshot && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Trait Snapshot in This Moment</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(situation.dnaSnapshot).map(([key, value]) => {
                    const trait = traitLabels.find((t) => t.key === key);
                    if (!trait) return null;
                    return (
                      <Badge key={key} variant="outline" className="text-xs">
                        {trait.label}: {value}/5
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm flex items-center gap-1 mb-2">
                <Lightbulb className="h-4 w-4" /> Reflection Questions
              </h4>
              <ul className="space-y-2">
                {situation.reflectionQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
              className="text-muted-foreground"
            >
              Collapse
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CharacterProfileDetail({
  character,
  imageUrl,
  onBack,
  onNavigateToCharacter,
  allCharacters,
}: CharacterProfileDetailProps) {
  const narrativeText = useMemo(() => buildCharacterNarrative(character), [character]);

  const {
    speak,
    stop,
    unlockAudio,
    isLoading: ttsLoading,
    isPlaying: ttsPlaying,
  } = useTextToSpeech({
    defaultVoice: "onyx",
    defaultProvider: "openai",
  });

  const handleListenToggle = () => {
    if (ttsPlaying) {
      stop();
    } else {
      unlockAudio();
      speak(narrativeText, { provider: "openai", voice: "onyx" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Characters
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <div className="relative shrink-0">
            <img
              src={imageUrl}
              alt={character.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 text-lg">{character.emoji}</span>
          </div>
        ) : (
          <span className="text-6xl">{character.emoji}</span>
        )}
        <div>
          <h1 className="text-3xl font-bold">{character.name}</h1>
          <p className="text-muted-foreground">{character.meaning} — {character.role}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {character.archetypes.map((a) => (
              <Badge key={a} variant="secondary" className="text-sm">
                {a}
              </Badge>
            ))}
            <Badge variant="outline">{character.era}</Badge>
            <Badge variant="outline">{character.testament === "OT" ? "Old Testament" : "New Testament"}</Badge>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {character.keyScriptures.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Key Verse */}
      <blockquote className="text-lg italic bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
        "{character.quickCard.keyVerse}"
        <footer className="text-sm text-muted-foreground mt-1 not-italic">
          — {character.quickCard.keyVerseRef}
        </footer>
      </blockquote>

      {/* Listen to Analysis Button */}
      <Button
        onClick={handleListenToggle}
        disabled={ttsLoading}
        variant={ttsPlaying ? "destructive" : "default"}
        className="w-full sm:w-auto gap-2"
      >
        {ttsLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Audio...
          </>
        ) : ttsPlaying ? (
          <>
            <Square className="h-4 w-4" />
            Stop Listening
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Listen to Deep Analysis
          </>
        )}
      </Button>

      {/* Character DNA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" /> Character DNA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DNAChart dna={character.dna} />
        </CardContent>
      </Card>

      {/* Accordion Sections */}
      <Accordion type="multiple" defaultValue={["story", "situations"]} className="space-y-2">
        {/* Story Arc */}
        <AccordionItem value="story" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Story Arc
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground leading-relaxed">{character.storyArc}</p>
          </AccordionContent>
        </AccordionItem>

        {/* Therapy View */}
        <AccordionItem value="therapy" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <Heart className="h-5 w-5" /> Therapy View
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Driving Fears</h4>
              <div className="flex flex-wrap gap-1">
                {character.therapyView.drivingFears.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs bg-red-50 dark:bg-red-950">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Core Motivations</h4>
              <div className="flex flex-wrap gap-1">
                {character.therapyView.coreMotivations.map((m) => (
                  <Badge key={m} variant="outline" className="text-xs bg-green-50 dark:bg-green-950">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Relational Style</h4>
              <p className="text-sm text-muted-foreground">{character.therapyView.relationalStyle}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Blind Spots</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {character.therapyView.blindSpots.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Healing Moments</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {character.therapyView.healingMoments.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Deep Character Analysis (AI-generated) */}
        <div className="my-2">
          <CharacterDeepAnalysis character={character} />
        </div>
        <AccordionItem value="strengths" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Strengths & Weaknesses
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-emerald-600 dark:text-emerald-400">Strengths</h4>
                <ul className="space-y-1">
                  {character.strengths.map((s) => (
                    <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-emerald-500">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">Weaknesses</h4>
                <ul className="space-y-1">
                  {character.weaknesses.map((w) => (
                    <li key={w} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-red-500">-</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Journey Map */}
        <AccordionItem value="journey" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <Map className="h-5 w-5" /> Journey Map
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative space-y-4 pl-6 border-l-2 border-primary/30">
              {character.journey.map((phase, i) => (
                <div key={phase.phase} className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{journeyPhaseIcons[phase.phase] || "📍"}</span>
                      <span className="font-semibold text-sm">{phase.phase}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Situation Analysis */}
        {character.situations.length > 0 && (
          <AccordionItem value="situations" className="border rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold">
              <span className="flex items-center gap-2">
                <Flame className="h-5 w-5" /> Situation Analysis ({character.situations.length})
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                How {character.name} responds under pressure in key moments.
              </p>
              {character.situations.map((sit) => (
                <SituationCard
                  key={sit.id}
                  situation={sit}
                  characterEmoji={character.emoji}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Relationships */}
        <AccordionItem value="relationships" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Relationships
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {character.relationships.map((rel) => (
                <div key={rel.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <span className="font-medium text-sm">{rel.name}</span>
                  <span className="text-xs text-muted-foreground">— {rel.role}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lessons & Reflection */}
        <AccordionItem value="lessons" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" /> Lessons & Reflection
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3">
              {character.lessonsAndReflection.map((q, i) => (
                <li key={i} className="text-sm flex gap-3 items-start">
                  <span className="bg-primary/10 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{q}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Related Characters */}
        {character.relatedCharacters.length > 0 && allCharacters && (
          <AccordionItem value="related" className="border rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Related Characters
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {character.relatedCharacters.map((id) => {
                  const related = allCharacters.find((c) => c.id === id);
                  if (!related) return null;
                  return (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToCharacter?.(id)}
                      className="gap-2"
                    >
                      <span>{related.emoji}</span>
                      <span>{related.name}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
