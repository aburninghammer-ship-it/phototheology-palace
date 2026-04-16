import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Eye, Film, Layers, Languages, Gem,
  Search as SearchIcon, FileQuestion, Hash, MessageCircleQuestion, Link2,
  Leaf, User, Dna, Globe, Ear,
  Crosshair, Box, Plug, Columns3, Clock, Repeat, GitCompareArrows, Apple, BookMarked, Library,
  Landmark, Telescope, Bell, Calendar,
  Mountain, Flame as FlameIcon, Brain, Zap,
  ChevronDown, ChevronUp, Lock, ArrowLeft,
} from "lucide-react";

interface RoomIntelligenceSelectorProps {
  onSelect: (roomCode: string, roomName: string) => void;
  onBack: () => void;
}

interface RoomConfig {
  code: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  testFocus: string;
}

interface FloorConfig {
  floor: number;
  name: string;
  subtitle: string;
  gradient: string;
  rooms: RoomConfig[];
}

const FLOOR_DATA: FloorConfig[] = [
  {
    floor: 1,
    name: "Furnishing Floor",
    subtitle: "Memory & Visualization",
    gradient: "from-amber-500/20 to-orange-500/20",
    rooms: [
      { code: "sr", name: "Story Room", icon: <BookOpen className="h-4 w-4" />, description: "Narrative sequence & mental movies", testFocus: "Identify story arcs, turning points, character roles" },
      { code: "ir", name: "Imagination Room", icon: <Eye className="h-4 w-4" />, description: "Step inside the scene — feel, hear, experience", testFocus: "Sensory immersion, empathetic recall" },
      { code: "24fps", name: "24FPS Room", icon: <Film className="h-4 w-4" />, description: "One symbolic image per chapter", testFocus: "Visual anchoring, chapter-to-image mapping" },
      { code: "br", name: "Bible Rendered", icon: <Layers className="h-4 w-4" />, description: "24-chapter block panoramas", testFocus: "Structural memory, book-level scanning" },
      { code: "tr", name: "Translation Room", icon: <Languages className="h-4 w-4" />, description: "Words become pictures", testFocus: "Abstract-to-concrete conversion" },
      { code: "gr", name: "Gems Room", icon: <Gem className="h-4 w-4" />, description: "Striking insights that shine", testFocus: "Insight recognition, hidden connections" },
    ],
  },
  {
    floor: 2,
    name: "Investigation Floor",
    subtitle: "Detective Work",
    gradient: "from-blue-500/20 to-cyan-500/20",
    rooms: [
      { code: "or", name: "Observation Room", icon: <SearchIcon className="h-4 w-4" />, description: "Log details without interpretation", testFocus: "Detail spotting, forensic text analysis" },
      { code: "dc", name: "Def-Com Room", icon: <FileQuestion className="h-4 w-4" />, description: "Greek/Hebrew definitions & cultural context", testFocus: "Word study, linguistic nuance" },
      { code: "st", name: "Symbols/Types Room", icon: <Hash className="h-4 w-4" />, description: "Typological patterns pointing to Christ", testFocus: "Symbol identification, type-antitype matching" },
      { code: "qr", name: "Questions Room", icon: <MessageCircleQuestion className="h-4 w-4" />, description: "Intratextual, intertextual, PT questions", testFocus: "Question formulation, investigative depth" },
      { code: "qa", name: "Q&A Chains Room", icon: <Link2 className="h-4 w-4" />, description: "Scripture answers Scripture", testFocus: "Cross-referencing, witness corroboration" },
    ],
  },
  {
    floor: 3,
    name: "Freestyle Floor",
    subtitle: "Spontaneous Connections",
    gradient: "from-green-500/20 to-emerald-500/20",
    rooms: [
      { code: "nf", name: "Nature Freestyle", icon: <Leaf className="h-4 w-4" />, description: "Creation illustrations → gospel", testFocus: "Natural metaphor, Romans 1:20 thinking" },
      { code: "pf", name: "Personal Freestyle", icon: <User className="h-4 w-4" />, description: "Life experiences → object lessons", testFocus: "Autobiographical application" },
      { code: "bf", name: "Bible Freestyle", icon: <Dna className="h-4 w-4" />, description: "Verse genetics — siblings & cousins", testFocus: "Verse family trees, spontaneous linking" },
      { code: "hf", name: "History/Social Freestyle", icon: <Globe className="h-4 w-4" />, description: "History & culture → lessons", testFocus: "Historical parallels, cultural reading" },
      { code: "lr", name: "Listening Room", icon: <Ear className="h-4 w-4" />, description: "Hear connections in conversations", testFocus: "Active listening, responsive application" },
    ],
  },
  {
    floor: 4,
    name: "Next Level Floor",
    subtitle: "Christ-Centered Depth",
    gradient: "from-purple-500/20 to-violet-500/20",
    rooms: [
      { code: "cr", name: "Concentration Room", icon: <Crosshair className="h-4 w-4" />, description: "Every text must reveal Christ", testFocus: "Christ identification across genres" },
      { code: "dr", name: "Dimensions Room", icon: <Box className="h-4 w-4" />, description: "5D: Literal, Christ, Me, Church, Heaven", testFocus: "Multi-dimensional interpretation" },
      { code: "c6", name: "Connect-6", icon: <Plug className="h-4 w-4" />, description: "Classify by genre, apply its rules", testFocus: "Genre recognition, interpretive rules" },
      { code: "trm", name: "Theme Room", icon: <Columns3 className="h-4 w-4" />, description: "Sanctuary / GC / Gospel walls", testFocus: "Theological wall placement" },
      { code: "tz", name: "Time Zone", icon: <Clock className="h-4 w-4" />, description: "Past/present/future × heaven/earth", testFocus: "Temporal-spatial grid mapping" },
      { code: "prm", name: "Patterns Room", icon: <Repeat className="h-4 w-4" />, description: "Recurring motifs (40, 3, 7...)", testFocus: "Pattern recognition, motif tracking" },
      { code: "p||", name: "Parallels Room", icon: <GitCompareArrows className="h-4 w-4" />, description: "Mirrored actions across time", testFocus: "Action mirroring, era comparison" },
      { code: "frt", name: "Fruit Room", icon: <Apple className="h-4 w-4" />, description: "Gal 5:22-23 fruit test", testFocus: "Character assessment, interpretation safety" },
      { code: "cec", name: "Christ Every Chapter", icon: <BookMarked className="h-4 w-4" />, description: "Name Christ's role per chapter", testFocus: "Christological tracing" },
      { code: "r66", name: "Room 66", icon: <Library className="h-4 w-4" />, description: "One theme, all 66 books", testFocus: "Canon-wide theme tracing" },
    ],
  },
  {
    floor: 5,
    name: "Vision Floor",
    subtitle: "Prophecy & Sanctuary",
    gradient: "from-sky-500/20 to-indigo-500/20",
    rooms: [
      { code: "bl", name: "Blue Room (Sanctuary)", icon: <Landmark className="h-4 w-4" />, description: "Map to sanctuary furniture & services", testFocus: "Sanctuary blueprint, furniture identification" },
      { code: "pr", name: "Prophecy Room", icon: <Telescope className="h-4 w-4" />, description: "Prophetic timeline & symbols", testFocus: "Historicist prophecy, Daniel/Revelation" },
      { code: "3a", name: "Three Angels", icon: <Bell className="h-4 w-4" />, description: "Final gospel messages (Rev 14)", testFocus: "Three Angels integration, end-time doctrine" },
      { code: "fe", name: "Feasts Room", icon: <Calendar className="h-4 w-4" />, description: "Israel's feast calendar connections", testFocus: "Feast typology, prophetic fulfillment" },
    ],
  },
  {
    floor: 6,
    name: "Three Heavens Floor",
    subtitle: "Cycles & Cosmic Context",
    gradient: "from-rose-500/20 to-pink-500/20",
    rooms: [
      { code: "1h", name: "First Heaven (DoL¹/NE¹)", icon: <Mountain className="h-4 w-4" />, description: "Babylon → Cyrusic restoration", testFocus: "Exile-restoration pattern" },
      { code: "2h", name: "Second Heaven (DoL²/NE²)", icon: <Mountain className="h-4 w-4" />, description: "70 AD → New-Covenant order", testFocus: "Temple destruction, church age" },
      { code: "3h", name: "Third Heaven (DoL³/NE³)", icon: <Mountain className="h-4 w-4" />, description: "Final judgment → New Creation", testFocus: "Eschatological placement" },
    ],
  },
  {
    floor: 7,
    name: "Transformation Floor",
    subtitle: "Spiritual & Emotional",
    gradient: "from-red-500/20 to-orange-500/20",
    rooms: [
      { code: "frm", name: "Fire Room", icon: <FlameIcon className="h-4 w-4" />, description: "Emotional weight — conviction & devotion", testFocus: "Emotional engagement, conviction depth" },
      { code: "mr", name: "Meditation Room", icon: <Brain className="h-4 w-4" />, description: "Slow marination in truth", testFocus: "Contemplative depth, phrase analysis" },
      { code: "srm", name: "Speed Room", icon: <Zap className="h-4 w-4" />, description: "Rapid-fire connections in 60 seconds", testFocus: "Reflex speed, instant association" },
    ],
  },
];

export function RoomIntelligenceSelector({ onSelect, onBack }: RoomIntelligenceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set([1]));

  const toggleFloor = (floor: number) => {
    setExpandedFloors((prev) => {
      const next = new Set(prev);
      if (next.has(floor)) next.delete(floor);
      else next.add(floor);
      return next;
    });
  };

  const filteredFloors = FLOOR_DATA.map((f) => ({
    ...f,
    rooms: f.rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((f) => f.rooms.length > 0);

  // Auto-expand all when searching
  const effectiveExpanded = searchQuery
    ? new Set(filteredFloors.map((f) => f.floor))
    : expandedFloors;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Room Intelligence Tests</h2>
          <p className="text-sm text-muted-foreground">
            Select a room to test your mastery — 50 AI-generated questions tailored to each discipline
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Room count */}
      <p className="text-xs text-muted-foreground">
        {FLOOR_DATA.reduce((sum, f) => sum + f.rooms.length, 0)} rooms across {FLOOR_DATA.length} floors
      </p>

      {/* Floor accordion */}
      <ScrollArea className="h-[calc(100vh-320px)] md:h-[calc(100vh-340px)]">
        <div className="space-y-3 pr-3">
          {filteredFloors.map((floor, fi) => {
            const isExpanded = effectiveExpanded.has(floor.floor);
            return (
              <motion.div
                key={floor.floor}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fi * 0.05, duration: 0.3 }}
              >
                <Card variant="glass" className="overflow-hidden">
                  {/* Floor header */}
                  <button
                    onClick={() => toggleFloor(floor.floor)}
                    className={`w-full flex items-center justify-between p-4 text-left bg-gradient-to-r ${floor.gradient} hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/80 text-sm font-bold">
                        {floor.floor}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{floor.name}</h3>
                        <p className="text-xs text-muted-foreground">{floor.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {floor.rooms.length} rooms
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Room cards */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CardContent className="p-3 grid gap-2 sm:grid-cols-2">
                          {floor.rooms.map((room, ri) => (
                            <motion.button
                              key={room.code}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ri * 0.04, duration: 0.2 }}
                              onClick={() => onSelect(room.code, room.name)}
                              className="text-left p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group active:scale-[0.97]"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                                  {room.icon}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-sm">{room.name}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase font-mono">
                                      {room.code}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {room.description}
                                  </p>
                                  <p className="text-[10px] text-primary/60 mt-1 line-clamp-1">
                                    Tests: {room.testFocus}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
