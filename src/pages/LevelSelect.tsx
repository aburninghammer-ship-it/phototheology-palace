import { useNavigate } from "react-router-dom";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { motion } from "framer-motion";
import { Zap, Compass, Flame, Check } from "lucide-react";
import { SEO } from "@/components/SEO";

interface LevelOption {
  mode: ExperienceMode;
  level: number;
  label: string;
  tagline: string;
  features: string[];
  icon: typeof Zap;
  gradient: string;
  accentHsl: string;
  glowColor: string;
  bgCard: string;
  bgCardActive: string;
  btnGradient: string;
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
    gradient: "linear-gradient(135deg, hsl(170 55% 42%), hsl(140 50% 45%))",
    accentHsl: "hsl(160 55% 50%)",
    glowColor: "hsl(160 55% 45% / 0.3)",
    bgCard: "linear-gradient(160deg, hsl(170 25% 12%), hsl(160 20% 8%))",
    bgCardActive: "linear-gradient(160deg, hsl(170 30% 14%), hsl(160 25% 10%))",
    btnGradient: "linear-gradient(135deg, hsl(170 55% 42%), hsl(140 50% 45%))",
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
    gradient: "linear-gradient(135deg, hsl(28 80% 55%), hsl(45 75% 55%))",
    accentHsl: "hsl(35 80% 58%)",
    glowColor: "hsl(35 80% 50% / 0.3)",
    bgCard: "linear-gradient(160deg, hsl(30 25% 12%), hsl(25 20% 8%))",
    bgCardActive: "linear-gradient(160deg, hsl(30 30% 14%), hsl(25 25% 10%))",
    btnGradient: "linear-gradient(135deg, hsl(28 80% 55%), hsl(45 75% 55%))",
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
    gradient: "linear-gradient(135deg, hsl(270 55% 55%), hsl(290 50% 50%))",
    accentHsl: "hsl(270 55% 60%)",
    glowColor: "hsl(270 55% 50% / 0.3)",
    bgCard: "linear-gradient(160deg, hsl(270 20% 12%), hsl(260 15% 8%))",
    bgCardActive: "linear-gradient(160deg, hsl(270 25% 14%), hsl(260 20% 10%))",
    btnGradient: "linear-gradient(135deg, hsl(270 55% 55%), hsl(290 50% 50%))",
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
      <div className="min-h-[100dvh] flex flex-col items-center justify-start sm:justify-center px-4 py-6 sm:py-12"
        style={{ background: "radial-gradient(ellipse at top, hsl(220 15% 10%), hsl(220 15% 4%))" }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: "hsl(220 10% 93%)" }}>
            How do you want to explore?
          </h1>
          <p className="text-xs sm:text-sm mt-2 sm:mt-3" style={{ color: "hsl(220 10% 50%)" }}>
            Each level is a unique experience. Switch anytime from the top bar.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-5xl w-full">
          {LEVELS.map((level, i) => {
            const Icon = level.icon;
            const isActive = mode === level.mode;
            return (
              <motion.button
                key={level.mode}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.12 }}
                onClick={() => handleSelect(level.mode)}
                className="relative text-left rounded-2xl border transition-all duration-300 group overflow-hidden"
                style={{
                  background: isActive ? level.bgCardActive : level.bgCard,
                  borderColor: isActive ? level.accentHsl : "hsl(220 10% 16%)",
                  boxShadow: isActive ? `0 0 40px ${level.glowColor}` : "none",
                }}
              >
                {/* Top accent bar */}
                <div className="h-1 w-full" style={{ background: level.gradient }} />

                <div className="p-4 sm:p-6">
                  {isActive && (
                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: level.accentHsl + "22", color: level.accentHsl }}>
                      <Check className="h-2.5 w-2.5" /> Current
                    </span>
                  )}

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3 sm:mb-5">
                    <div className="p-2.5 sm:p-3 rounded-xl" style={{ background: level.gradient }}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider" style={{ color: level.accentHsl }}>
                        Level {level.level}
                      </div>
                      <div className="text-lg sm:text-xl font-bold" style={{ color: "hsl(220 10% 93%)" }}>
                        {level.label}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-5 italic" style={{ color: "hsl(220 10% 55%)" }}>
                    "{level.tagline}"
                  </p>

                  <ul className="space-y-1.5 sm:space-y-2.5 mb-4 sm:mb-6">
                    {level.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px] sm:text-[13px]" style={{ color: "hsl(220 10% 65%)" }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: level.accentHsl }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="w-full py-2.5 sm:py-3 rounded-xl text-center text-sm font-bold transition-all"
                    style={{
                      background: isActive ? level.gradient : "hsl(220 10% 90% / 0.06)",
                      color: isActive ? "white" : "hsl(220 10% 65%)",
                      border: `1px solid ${isActive ? "transparent" : "hsl(220 10% 18%)"}`,
                    }}>
                    {isActive ? "Continue →" : "Select"}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
