import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronDown, ChevronRight, ExternalLink, Shield,
  BookMarked, Scale, Search, Tag, Quote, Info, CheckCircle2,
  AlertTriangle, Star, Users, FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DOCTRINE_TOPICS,
  type DoctrineTopic,
  type LibraryClaim,
  type LibraryWitness,
} from "@/data/interdenominationalLibrary";

const GRADE_CONFIG: Record<string, { label: string; color: string; icon: typeof Star }> = {
  A: { label: "Primary / Confessional", color: "bg-emerald-600 text-white", icon: Star },
  B: { label: "Strong Secondary", color: "bg-blue-600 text-white", icon: CheckCircle2 },
  C: { label: "Supporting", color: "bg-amber-600 text-white", icon: Info },
  D: { label: "Contextual", color: "bg-gray-500 text-white", icon: AlertTriangle },
};

const TOPIC_ICONS: Record<string, string> = {
  scripture: "📖",
  trinity: "🔺",
  second_coming: "🌅",
  law: "📜",
  sabbath: "🕯️",
  heavenly_sanctuary: "⛺",
  daniel_814: "📐",
  investigative_judgment: "⚖️",
  state_of_dead: "💤",
  annihilationism: "🔥",
  papacy: "🏛️",
  historicism: "📅",
  azazel: "🐐",
};

function CredibilityBadge({ grade }: { grade: string }) {
  const config = GRADE_CONFIG[grade] || GRADE_CONFIG.D;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
      {grade}
    </span>
  );
}

function BibleAnchor({ reference }: { reference: string }) {
  return (
    <Badge variant="outline" className="text-xs font-mono border-amber-500/40 text-amber-300 bg-amber-950/20">
      <BookMarked className="h-3 w-3 mr-1" />
      {reference}
    </Badge>
  );
}

function WitnessCard({ witness }: { witness: LibraryWitness }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border/60 rounded-lg bg-black/10 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <CredibilityBadge grade={witness.credibilityGrade} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold truncate">{witness.author}</p>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {witness.tradition}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {witness.workTitle} ({witness.year})
            </p>
          </div>
          <div className="shrink-0">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3">
              {/* Quote */}
              <div className="pl-3 border-l-2 border-amber-500/60">
                <div className="flex items-start gap-2">
                  <Quote className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm italic text-amber-100/90 leading-relaxed">
                    {witness.quoteExcerpt}
                  </p>
                </div>
              </div>

              {/* Locator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span className="font-mono">{witness.locator}</span>
              </div>

              {/* Context Notes */}
              <div className="p-2.5 rounded-md bg-blue-950/30 border border-blue-500/20">
                <p className="text-xs text-blue-200/80 leading-relaxed">
                  <Info className="h-3 w-3 inline mr-1 -mt-0.5" />
                  {witness.contextNotes}
                </p>
              </div>

              {/* Agreement Scope */}
              <div className="p-2.5 rounded-md bg-purple-950/30 border border-purple-500/20">
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  <Scale className="h-3 w-3 inline mr-1 -mt-0.5" />
                  <span className="font-semibold">Scope:</span> {witness.agreementScope}
                </p>
              </div>

              {/* Source Link */}
              <a
                href={witness.primarySourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-3 w-3" />
                View Primary Source
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ClaimCard({ claim }: { claim: LibraryClaim }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
      >
        <div className="flex items-start gap-2">
          <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
            {claim.order}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold group-hover:text-primary transition-colors">
              {claim.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {claim.claimSummary}
            </p>
          </div>
          <div className="shrink-0 mt-1">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-8 space-y-3">
              {/* Bible Anchors */}
              <div className="flex flex-wrap gap-1.5">
                {claim.bibleAnchors.map((ref) => (
                  <BibleAnchor key={ref} reference={ref} />
                ))}
              </div>

              {/* Witnesses */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Witnesses ({claim.witnesses.length})
                  </p>
                </div>
                {claim.witnesses.map((witness) => (
                  <WitnessCard key={witness.id} witness={witness} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopicCard({ topic }: { topic: DoctrineTopic }) {
  const [expanded, setExpanded] = useState(false);
  const icon = TOPIC_ICONS[topic.id] || "📋";
  const totalWitnesses = topic.claims.reduce((sum, c) => sum + c.witnesses.length, 0);
  const gradeA = topic.claims.reduce(
    (sum, c) => sum + c.witnesses.filter((w) => w.credibilityGrade === "A").length,
    0
  );

  return (
    <Card variant="glass" className="overflow-hidden border-border/60">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold">{topic.name}</h3>
              <Badge variant="outline" className="text-[10px]">
                #{topic.order}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {topic.summary}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-muted-foreground">
                {topic.claims.length} claim{topic.claims.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {totalWitnesses} witness{totalWitnesses !== 1 ? "es" : ""}
              </span>
              {gradeA > 0 && (
                <span className="text-[10px] text-emerald-400 font-medium">
                  {gradeA} Grade-A
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2 ml-11">
          {topic.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              <Tag className="h-2.5 w-2.5 mr-0.5" />
              {tag}
            </Badge>
          ))}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-4">
              {topic.claims
                .sort((a, b) => a.order - b.order)
                .map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function InterdenominationalLibrary() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(
    new Set(DOCTRINE_TOPICS.flatMap((t) => t.tags))
  ).sort();

  // Filter topics
  const filteredTopics = DOCTRINE_TOPICS.filter((topic) => {
    const matchesSearch =
      !searchQuery ||
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.claims.some(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.witnesses.some((w) =>
            w.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.workTitle.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    const matchesTag = !selectedTag || topic.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  }).sort((a, b) => a.order - b.order);

  // Stats
  const totalTopics = DOCTRINE_TOPICS.length;
  const totalClaims = DOCTRINE_TOPICS.reduce((s, t) => s + t.claims.length, 0);
  const totalWitnesses = DOCTRINE_TOPICS.reduce(
    (s, t) => s + t.claims.reduce((cs, c) => cs + c.witnesses.length, 0),
    0
  );
  const gradeACounts = DOCTRINE_TOPICS.reduce(
    (s, t) =>
      s +
      t.claims.reduce(
        (cs, c) => cs + c.witnesses.filter((w) => w.credibilityGrade === "A").length,
        0
      ),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-7 w-7 text-amber-400" />
          <h2 className="text-2xl font-bold">3AM Inter-denominational Library</h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
          Non-Adventist confessional, creedal, and scholarly sources that affirm key biblical doctrines.
          Each witness includes primary links, credibility grades, and agreement-scope labels.
        </p>
      </div>

      {/* Stats Bar */}
      <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-3`}>
        {[
          { label: "Topics", value: totalTopics, icon: "📚" },
          { label: "Claims", value: totalClaims, icon: "📋" },
          { label: "Witnesses", value: totalWitnesses, icon: "👥" },
          { label: "Grade-A", value: gradeACounts, icon: "⭐" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-black/10"
          >
            <span className="text-lg">{stat.icon}</span>
            <div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Credibility Legend */}
      <div className="p-3 rounded-lg border border-border/50 bg-black/10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Credibility Grades
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(GRADE_CONFIG).map(([grade, config]) => (
            <div key={grade} className="flex items-center gap-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
                {grade}
              </span>
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, claims, witnesses, traditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Topic List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No topics match your search.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-950/10 text-center space-y-2">
        <p className="text-xs text-amber-300/80 font-medium">
          Library v1.0 — {totalTopics} Topics, {totalClaims} Claims, {totalWitnesses} Witnesses
        </p>
        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Every witness includes agreement-scope labels so critics can't say disagreements were hidden.
          Sources are verifiable via primary links. Structure supports rapid v1.1+ expansion.
        </p>
      </div>
    </div>
  );
}
