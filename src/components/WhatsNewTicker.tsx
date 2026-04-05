import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

interface TickerItem {
  text: string;
  path: string;
  emoji: string;
}

const LEVEL_3_ITEMS: TickerItem[] = [
  { text: "Night & Morning Watches now live in Chapel Space", path: "/night-watches", emoji: "🌙" },
  { text: "Genealogy Explorer — trace any biblical lineage", path: "/bible", emoji: "🌳" },
  { text: "Audio Suite Commentary with one-tap playback", path: "/bible", emoji: "🎧" },
  { text: "12 new Study Spark Cards generated daily", path: "/dashboard", emoji: "✨" },
  { text: "Phototheology University — flagship courses available", path: "/university", emoji: "🎓" },
  { text: "Research Mode — deep-dive sermon prep tools", path: "/research-mode", emoji: "🔬" },
  { text: "Memory Palace Audio Tour — walk the 8 floors", path: "/palace/tour", emoji: "🏛️" },
  { text: "Thematic Search — find verses by meaning", path: "/bible/thematic-search", emoji: "🔍" },
];

const LEVEL_2_ITEMS: TickerItem[] = [
  { text: "Explore all 8 floors of the Memory Palace", path: "/palace", emoji: "🏛️" },
  { text: "Master each room — learn the principles behind deep Bible study", path: "/palace", emoji: "📖" },
  { text: "Take the Audio Tour — walk the Palace with a guide", path: "/palace/tour", emoji: "🎙️" },
  { text: "Practice tools unlocked — Dimensions Drill, Detective Challenge & more", path: "/palace", emoji: "🔧" },
  { text: "Find Christ in every chapter — the Concentration Room awaits", path: "/palace", emoji: "✝️" },
  { text: "Sanctuary Blueprint — trace salvation through the furniture", path: "/palace", emoji: "🕊️" },
  { text: "Prophecy Timeline — align Daniel & Revelation like constellations", path: "/palace", emoji: "🔭" },
  { text: "Study Bible with verse-by-verse Phototheology commentary", path: "/bible", emoji: "📜" },
];

const DISMISSED_KEY = "pt_whats_new_dismissed";

export function WhatsNewTicker() {
  const { isExplorer } = useExperienceMode();
  const items = isExplorer ? LEVEL_2_ITEMS : LEVEL_3_ITEMS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DISMISSED_KEY);
    if (saved) {
      const dismissedAt = parseInt(saved, 10);
      if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) {
        setDismissed(true);
      } else {
        localStorage.removeItem(DISMISSED_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed, items.length]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setDismissed(true);
  };

  if (dismissed) return null;

  const item = items[currentIndex];

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={item.path} className="block">
            <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/8 border border-primary/20 hover:bg-primary/12 transition-colors group">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 border-primary/30 text-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                New
              </Badge>
              <span className="text-xs text-foreground/80 truncate">
                {item.emoji} {item.text}
              </span>
              <button
                onClick={handleDismiss}
                className="ml-auto shrink-0 p-0.5 rounded-full hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="hidden sm:flex items-center gap-0.5 ml-1 shrink-0">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full transition-colors ${
                      i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
