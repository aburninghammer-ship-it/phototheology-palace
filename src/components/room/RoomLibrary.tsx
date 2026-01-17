import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Search, Library, ChevronRight, Sparkles, BookMarked } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Library configurations for rooms
const ROOM_LIBRARIES: Record<string, {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}> = {
  sr: {
    title: "Bible Story Library",
    description: "Explore stories across all 66 books of the Bible",
    icon: "📚",
    gradient: "from-blue-500 to-indigo-600"
  },
  gr: {
    title: "Gems Library",
    description: "Discover powerful verse gems organized by theme",
    icon: "💎",
    gradient: "from-emerald-500 to-teal-600"
  },
  st: {
    title: "Bible Symbol Library",
    description: "100+ biblical symbols with spiritual meanings",
    icon: "🔗",
    gradient: "from-teal-500 to-cyan-600"
  },
  qa: {
    title: "Q&A Chain Library",
    description: "Bible questions with verse-chain answers",
    icon: "💬",
    gradient: "from-orange-500 to-amber-600"
  },
  hf: {
    title: "Historical Freestyle Library",
    description: "Historical events with spiritual parallels",
    icon: "📜",
    gradient: "from-stone-500 to-amber-600"
  },
  nf: {
    title: "Nature Freestyle Library",
    description: "Nature imagery with biblical connections",
    icon: "🌿",
    gradient: "from-green-500 to-emerald-600"
  },
  trm: {
    title: "Themes Library",
    description: "6 major PT themes: 4 walls, 1 floor, 1 ceiling",
    icon: "🏛️",
    gradient: "from-amber-500 to-yellow-600"
  },
  prm: {
    title: "Patterns Library",
    description: "Biblical patterns through all 66 books: courses, Christ in every book, structural patterns",
    icon: "🎵",
    gradient: "from-violet-500 to-purple-600"
  },
  "p||": {
    title: "Parallels Library",
    description: "Biblical parallels and typological patterns",
    icon: "🪞",
    gradient: "from-purple-500 to-violet-600"
  },
  cec: {
    title: "Christ Types Library",
    description: "Find Christ in every chapter of Scripture",
    icon: "👑",
    gradient: "from-yellow-500 to-amber-600"
  },
  bl: {
    title: "Sanctuary Library",
    description: "Sanctuary imagery and spiritual meanings",
    icon: "⛪",
    gradient: "from-blue-600 to-indigo-700"
  },
  pr: {
    title: "Prophecy Library",
    description: "Major prophecies with interpretive keys",
    icon: "🔮",
    gradient: "from-purple-600 to-fuchsia-700"
  },
  fe: {
    title: "Feasts Library",
    description: "Biblical feasts and their prophetic fulfillment",
    icon: "🎊",
    gradient: "from-orange-500 to-red-600"
  },
  "123h": {
    title: "Three Heavens Library",
    description: "Prophetic horizons: 1H, 2H, and 3H fulfillments",
    icon: "☁️",
    gradient: "from-slate-500 to-blue-600"
  },
  cycles: {
    title: "8 Cycles Library",
    description: "The 8 covenant cycles of redemption history",
    icon: "🔄",
    gradient: "from-indigo-500 to-purple-600"
  },
  r66: {
    title: "Room 66 Library",
    description: "Track themes through all 66 books of the Bible",
    icon: "📿",
    gradient: "from-red-500 to-rose-600"
  },
  math: {
    title: "Mathematics Library",
    description: "6 time prophecies with 6×6 Scripture Connection Grid",
    icon: "🔢",
    gradient: "from-blue-600 to-indigo-700"
  },
  "24fps": {
    title: "24FPS Bible Sets",
    description: "50 memorization sets covering every chapter",
    icon: "🎬",
    gradient: "from-violet-500 to-fuchsia-600"
  }
};

interface RoomLibraryProps {
  roomId: string;
  children: React.ReactNode;
}

export function RoomLibrary({ roomId, children }: RoomLibraryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = ROOM_LIBRARIES[roomId];

  if (!config) return null;

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 shadow-lg overflow-hidden">
      {/* Prominent header */}
      <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                <h2 className="text-xl font-bold">{config.title}</h2>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  NEW
                </Badge>
              </div>
              <p className="text-sm opacity-90">{config.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Library content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-4">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// A compact library banner for rooms without full library UI yet
interface LibraryBannerProps {
  roomId: string;
  onExplore?: () => void;
}

export function LibraryBanner({ roomId, onExplore }: LibraryBannerProps) {
  const config = ROOM_LIBRARIES[roomId];

  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-2 border-primary/30 overflow-hidden">
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{config.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Library className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">{config.title}</h2>
                  <Badge className="bg-white/20 text-white border-white/30 animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Newly Added
                  </Badge>
                </div>
                <p className="text-base opacity-90">{config.description}</p>
              </div>
            </div>
            {onExplore && (
              <Button
                onClick={onExplore}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Library
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Check if a room has a library
export function hasLibrary(roomId: string): boolean {
  return roomId in ROOM_LIBRARIES;
}

// Get library config for a room
export function getLibraryConfig(roomId: string) {
  return ROOM_LIBRARIES[roomId];
}
