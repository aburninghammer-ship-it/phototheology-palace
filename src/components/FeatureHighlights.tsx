import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Languages,
  Library,
  Sparkles,
  Building2,
  Search,
  Microscope,
  X,
  ChevronRight,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FEATURES = [
  {
    id: "greek-hebrew",
    title: "Original Language Tools",
    description: "Tap any word to see Greek/Hebrew with Strong's numbers",
    icon: Languages,
    path: "/bible",
    gradient: "from-blue-500 to-cyan-500",
    tip: "Try tapping a word in the Bible reader"
  },
  {
    id: "commentaries",
    title: "12 Classic Commentaries",
    description: "Matthew Henry, Barnes, Gill, Wesley & more included",
    icon: Library,
    path: "/bible/John/3?commentary=true",
    gradient: "from-purple-500 to-pink-500",
    tip: "Look for the Commentary button"
  },
  {
    id: "ai-assistant",
    title: "Jeeves AI Bible Assistant",
    description: "Ask any Bible question and get instant, accurate answers",
    icon: Sparkles,
    path: "/jeeves",
    gradient: "from-green-500 to-emerald-500",
    tip: "Available throughout the app"
  },
  {
    id: "memory-palace",
    title: "8-Floor Memory Palace",
    description: "Revolutionary visual system to master Bible typology",
    icon: Building2,
    path: "/palace",
    gradient: "from-amber-500 to-orange-500",
    tip: "Walk through the visual journey"
  },
  {
    id: "research-mode",
    title: "Research Mode",
    description: "Advanced tools for sermon prep & deep study",
    icon: Microscope,
    path: "/research-mode",
    gradient: "from-rose-500 to-red-500",
    tip: "Cross-references, chains & more"
  },
  {
    id: "thematic-search",
    title: "Thematic Search",
    description: "Find verses by topic, theme, or concept",
    icon: Search,
    path: "/bible/thematic-search",
    gradient: "from-indigo-500 to-violet-500",
    tip: "Search by meaning, not keywords"
  }
];

const STORAGE_KEY = "phototheology_feature_highlights_seen";

export function FeatureHighlights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [seenFeatures, setSeenFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const seen = JSON.parse(saved);
        setSeenFeatures(new Set(seen));
        if (seen.length >= FEATURES.length) {
          setDismissed(true);
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  const markSeen = (featureId: string) => {
    const updated = new Set(seenFeatures);
    updated.add(featureId);
    setSeenFeatures(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
  };

  const handleNext = () => {
    markSeen(FEATURES[currentIndex].id);
    if (currentIndex < FEATURES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    // Mark all as seen
    const allIds = FEATURES.map(f => f.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  const feature = FEATURES[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative"
      >
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          {/* Progress dots */}
          <div className="absolute top-3 right-3 flex gap-1">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex
                    ? "bg-primary"
                    : i < currentIndex
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shrink-0`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    <Star className="h-3 w-3 mr-1" />
                    Pro Feature
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {feature.description}
                </p>
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {feature.tip}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Link to={feature.path} className="flex-1">
                <Button className="w-full" onClick={() => markSeen(feature.id)}>
                  Try It Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                {currentIndex < FEATURES.length - 1 ? "Next" : "Done"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact version for inline use
export function FeatureHighlightBadge({
  featureId,
  children
}: {
  featureId: string;
  children: React.ReactNode;
}) {
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const seenFeatures = JSON.parse(saved);
        setSeen(seenFeatures.includes(featureId));
      } catch (e) {
        setSeen(false);
      }
    } else {
      setSeen(false);
    }
  }, [featureId]);

  if (seen) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <Badge
        variant="default"
        className="absolute -top-2 -right-2 text-[10px] px-1.5 animate-pulse"
      >
        New
      </Badge>
    </div>
  );
}
