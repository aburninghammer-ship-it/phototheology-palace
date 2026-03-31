import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Sparkles, Gem, Zap, Brain, Flame, Swords, Crown, Eye, Target, Shield, Trophy, GraduationCap, Palette, Building2, Mic, Church, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface GlossaryEntry {
  term: string;
  category: "concept" | "tool" | "floor" | "room" | "feature";
  icon: LucideIcon;
  definition: string;
}

const GLOSSARY: GlossaryEntry[] = [
  { term: "Phototheology", category: "concept", icon: Eye, definition: "A Christ-centered Bible study system that trains you to see, store, and apply Scripture as images, patterns, and structures across 8 ascending floors of mastery." },
  { term: "The Palace", category: "concept", icon: Building2, definition: "The 8-floor metaphorical structure of the Phototheology method. Each floor represents a level of Bible study — from memory to mastery — with rooms teaching specific principles." },
  { term: "Biblical Intelligence (BI)", category: "concept", icon: Brain, definition: "The AI engine powering the PT OS. It uses Phototheology principles to generate insights, study prompts, and feedback grounded in Christ-centered interpretation." },
  { term: "Gems", category: "feature", icon: Gem, definition: "Striking insights discovered during Bible study — a surprising connection, hidden detail, or Christ-centered truth. Gems are collected and stored for sermons, teaching, and reflection." },
  { term: "Sparks", category: "feature", icon: Zap, definition: "Quick bursts of inspiration or connection — instant prompts that ignite deeper study. Sparks are shorter than Gems and designed to trigger curiosity and further exploration." },
  { term: "Freestyle", category: "concept", icon: Sparkles, definition: "The practice of making spontaneous Scripture connections in real-time — like a freestyle rapper riffing on a beat. Applied to nature, personal life, history, and conversations (Floor 3)." },
  { term: "Concentration Room", category: "room", icon: Target, definition: "A 4th-Floor room where every text must reveal Christ. If Christ is not visible, you haven't finished studying the passage. The lens that makes all study Christ-centered." },
  { term: "Fire Room", category: "room", icon: Flame, definition: "A 7th-Floor room where you engage the emotional weight of Scripture. You don't just analyze — you feel the text burn, convict, comfort, and transform your heart." },
  { term: "24FPS", category: "room", icon: Eye, definition: "A 1st-Floor method that turns Bible chapters into single symbolic images — like film frames. Memorize 1 image per chapter to 'scan' entire books from memory." },
  { term: "Bible Rendered", category: "room", icon: Palette, definition: "A 1st-Floor method creating 1 master image per 24-chapter block. This compresses the entire Bible into ~51 images for panoramic mental recall." },
  { term: "Verse Genetics", category: "concept", icon: Sparkles, definition: "The idea that every verse in the Bible is related to every other verse — siblings, cousins, or distant relatives. Tracing these connections builds a 'family tree' of Scripture." },
  { term: "Dimensions Room", category: "room", icon: Eye, definition: "A 4th-Floor room that stretches every passage across 5 dimensions: Literal, Christ, Me (personal), Church, and Heaven — revealing multiple layers of meaning in one text." },
  { term: "Cycles", category: "concept", icon: Crown, definition: "Eight great cycles of redemption history (Adam → Remnant), each following: Fall → Covenant → Sanctuary → Enemy → Restoration. History repeats in 'repeat-and-enlarge' patterns." },
  { term: "Three Heavens", category: "concept", icon: Crown, definition: "Three Day-of-the-LORD epochs: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation). Every prophecy belongs to one of these horizons." },
  { term: "COTA", category: "tool", icon: Swords, definition: "Christ in the Old Testament Archives — a curated library revealing how every OT book, story, and symbol points to Jesus Christ. A core Arena resource." },
  { term: "AATS War College", category: "tool", icon: Shield, definition: "Advanced Apologetics Training System — intensive, combat-level theological training with complex scenarios, case studies, and doctrinal defense exercises." },
  { term: "Defense Mode", category: "tool", icon: Shield, definition: "A training mode for practicing doctrinal defense using Scripture. Build airtight biblical arguments and answer common objections to key beliefs." },
  { term: "Juice Room", category: "room", icon: Zap, definition: "A 6th-Floor exercise where you 'squeeze' one entire book through every PT principle — story, observation, freestyle, concentration, prophecy, cycles, heavens — extracting every drop." },
  { term: "Ascensions", category: "concept", icon: GraduationCap, definition: "Five levels of zoom: Text → Chapter → Book → Cycle → Heaven. Static ascension anchors meaning; Dynamic ascension allows creative, Spirit-led exploration across levels." },
  { term: "Expansions", category: "concept", icon: GraduationCap, definition: "Four directions study stretches: Width (memory/content), Time (freestyle/daily), Depth (Christ-centered structure), Height (transformation/mastery)." },
  { term: "The Studio", category: "floor", icon: Palette, definition: "OS Space for Bible study, research, and reference tools — the Study Bible, lexicon, encyclopedia, timeline, and research assistants." },
  { term: "The Gallery", category: "floor", icon: Building2, definition: "OS Space for the Memory Palace, visual mapping, mind maps, image Bible, VR experience, and memory training exercises." },
  { term: "The Stage", category: "floor", icon: Mic, definition: "OS Space for sermon building, teaching output, amplifying studies with cross-references, remixing content, and video training resources." },
  { term: "The Arena", category: "floor", icon: Swords, definition: "OS Space for games, challenges, COTA, Defense Mode, AATS, apologetics, leaderboard, and competitive theological training." },
  { term: "The Chapel", category: "floor", icon: Church, definition: "OS Space for devotionals, reading plans, church community, prayer, grief support, marriage resources, and wellness guides." },
  { term: "The Workshop", category: "floor", icon: Wrench, definition: "OS Space for AI tools (PT GPT, Kid GPT, Daniel & Rev GPT), workspace settings, and study partner connections." },
  { term: "The Academy", category: "floor", icon: GraduationCap, definition: "OS Space for structured courses — PT Course, Blueprint, Daniel, Revelation — plus floor mastery tracking and earned certificates." },
  { term: "Study Deck", category: "tool", icon: Sparkles, definition: "Draw PT study cards with room-specific questions for any passage. Each card prompts you to apply a specific floor or room principle." },
  { term: "Amplify", category: "tool", icon: Zap, definition: "Enhance any sermon or study with cross-references, parallel passages, and deeper connections — strengthening your message with biblical reinforcement." },
  { term: "Remix", category: "tool", icon: Sparkles, definition: "Take existing content and reframe it through different PT lenses — apply new rooms, different cycles, or adapt for a new audience." },
];

const CATEGORY_COLORS: Record<string, string> = {
  concept: "142 71% 45%",
  tool: "210 100% 56%",
  floor: "270 56% 65%",
  room: "32 95% 53%",
  feature: "45 90% 50%",
};

const CATEGORY_LABELS: Record<string, string> = {
  concept: "Concept",
  tool: "Tool",
  floor: "Space",
  room: "Room",
  feature: "Feature",
};

export const PtGlossaryTable = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = GLOSSARY.filter(e => {
    const matchSearch = !search || e.term.toLowerCase().includes(search.toLowerCase()) || e.definition.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filter || e.category === filter;
    return matchSearch && matchFilter;
  });

  const categories = [...new Set(GLOSSARY.map(e => e.category))];

  return (
    <div className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide" style={{ fontFamily: "'Cinzel', serif", color: "#d4a017" }}>
          PT OS Glossary
        </h2>
        <p className="text-sm text-muted-foreground">Understand the language of the Phototheology ecosystem</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card/80 border-border/40"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${!filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/80 text-muted-foreground border-border/40 hover:border-primary/40'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(filter === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === cat ? 'border-primary/60' : 'border-border/40 hover:border-primary/40'}`}
              style={filter === cat ? {
                background: `hsl(${CATEGORY_COLORS[cat]} / 0.2)`,
                color: `hsl(${CATEGORY_COLORS[cat]})`,
                borderColor: `hsl(${CATEGORY_COLORS[cat]} / 0.5)`,
              } : {}}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Cards */}
      <div className="space-y-2">
        {filtered.map((entry, idx) => {
          const Icon = entry.icon;
          const color = CATEGORY_COLORS[entry.category];
          return (
            <motion.div
              key={entry.term}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="flex items-start gap-3 p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, hsl(${color} / 0.08), hsl(${color} / 0.02))`,
                borderColor: `hsl(${color} / 0.15)`,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `linear-gradient(135deg, hsl(${color} / 0.4), hsl(${color} / 0.15))`,
                  boxShadow: `0 0 12px hsl(${color} / 0.2)`,
                }}
              >
                <Icon className="w-4 h-4 text-white/90" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm">{entry.term}</span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider"
                    style={{
                      background: `hsl(${color} / 0.15)`,
                      color: `hsl(${color})`,
                    }}
                  >
                    {CATEGORY_LABELS[entry.category]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{entry.definition}</p>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No matching terms found.</p>
        )}
      </div>
    </div>
  );
};
