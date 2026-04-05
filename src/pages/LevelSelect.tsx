import { useNavigate } from "react-router-dom";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { motion } from "framer-motion";
import { Zap, Compass, Flame } from "lucide-react";
import { SEO } from "@/components/SEO";

interface LevelOption {
  mode: ExperienceMode;
  level: number;
  label: string;
  tagline: string;
  features: string[];
  icon: typeof Zap;
  borderColor: string;
  iconColor: string;
}

const LEVELS: LevelOption[] = [
  {
    mode: "basic",
    level: 1,
    label: "Basic",
    tagline: "Just give me answers",
    features: [
      "Conversational AI Bible assistant",
      "Study Bible & Audio Commentary",
      "Reading Plans & Devotionals",
      "Morning & Night Watch",
    ],
    icon: Zap,
    borderColor: "hsl(160 60% 40%)",
    iconColor: "hsl(160 60% 50%)",
  },
  {
    mode: "explorer",
    level: 2,
    label: "Explorer",
    tagline: "Teach me as I go",
    features: [
      "Everything in Basic",
      "Guided Palace room access",
      "Study tools with coaching",
      "Learn the method by using it",
    ],
    icon: Compass,
    borderColor: "hsl(38 65% 55%)",
    iconColor: "hsl(38 65% 60%)",
  },
  {
    mode: "immersion",
    level: 3,
    label: "Immersion",
    tagline: "Show me everything",
    features: [
      "Full 8-Floor Palace OS",
      "38+ Rooms, Cycles & Heavens",
      "VR Palace & advanced research",
      "Built for scholars & teachers",
    ],
    icon: Flame,
    borderColor: "hsl(270 55% 55%)",
    iconColor: "hsl(270 55% 60%)",
  },
];

export default function LevelSelect() {
  const navigate = useNavigate();
  const { mode, setMode } = useExperienceMode();

  const handleSelect = (selected: ExperienceMode) => {
    setMode(selected);
    navigate("/welcome");
  };

  return (
    <>
      <SEO title="Choose Your Level | PhototheologyOS" description="Select your experience level to begin." />
      <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "hsl(220 15% 6%)" }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "hsl(220 10% 90%)" }}>
            How do you want to explore?
          </h1>
          <p className="text-sm mt-2" style={{ color: "hsl(220 10% 50%)" }}>
            You can switch levels anytime from the top bar.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full">
          {LEVELS.map((level, i) => {
            const Icon = level.icon;
            const isActive = mode === level.mode;
            return (
              <motion.button
                key={level.mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                onClick={() => handleSelect(level.mode)}
                className="relative text-left p-6 rounded-2xl border transition-all duration-300 group"
                style={{
                  background: isActive ? "hsl(220 13% 11%)" : "hsl(220 13% 8%)",
                  borderColor: isActive ? level.borderColor : "hsl(220 10% 16%)",
                  boxShadow: isActive ? `0 0 30px ${level.borderColor}22` : "none",
                }}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "hsl(220 10% 90% / 0.1)", color: "hsl(220 10% 70%)" }}>
                    Current
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl" style={{ background: "hsl(220 10% 90% / 0.06)" }}>
                    <Icon className="h-6 w-6" style={{ color: level.iconColor }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: "hsl(220 10% 55%)" }}>
                      Level {level.level}
                    </div>
                    <div className="text-lg font-bold" style={{ color: "hsl(220 10% 92%)" }}>
                      {level.label}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium mb-4 italic" style={{ color: "hsl(220 10% 50%)" }}>
                  "{level.tagline}"
                </p>

                <ul className="space-y-2.5 mb-5">
                  {level.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs" style={{ color: "hsl(220 10% 62%)" }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: level.iconColor }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="w-full py-2.5 rounded-xl text-center text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? `${level.borderColor}22` : "hsl(220 10% 90% / 0.05)",
                    color: isActive ? level.iconColor : "hsl(220 10% 65%)",
                    border: `1px solid ${isActive ? level.borderColor + "44" : "hsl(220 10% 18%)"}`,
                  }}>
                  {isActive ? "Continue →" : "Select"}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
