import { useNavigate } from "react-router-dom";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { motion } from "framer-motion";
import { Zap, Compass, Flame, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";

interface LevelOption {
  mode: ExperienceMode;
  level: number;
  label: string;
  tagline: string;
  features: string[];
  icon: typeof Zap;
  gradient: string;
  glow: string;
  border: string;
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
    gradient: "from-emerald-500/20 to-emerald-600/5",
    glow: "hover:shadow-[0_0_40px_hsl(160_60%_40%/0.15)]",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
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
    gradient: "from-amber-500/20 to-amber-600/5",
    glow: "hover:shadow-[0_0_40px_hsl(40_70%_50%/0.15)]",
    border: "border-amber-500/20 hover:border-amber-400/40",
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
    gradient: "from-violet-500/20 to-violet-600/5",
    glow: "hover:shadow-[0_0_40px_hsl(270_60%_50%/0.15)]",
    border: "border-violet-500/20 hover:border-violet-400/40",
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "hsl(220 15% 6%)" }}>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(40 75% 55%), hsl(30 70% 45%))",
              boxShadow: "0 4px 20px hsl(40 75% 50% / 0.3)",
            }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg tracking-wider" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: "hsl(38 65% 65%)" }}>
              PHOTOTHEOLOGY <span className="text-xs px-1.5 py-0.5 rounded ml-1" style={{ background: "hsl(38 60% 55% / 0.12)", border: "1px solid hsl(38 60% 55% / 0.2)", color: "hsl(35 60% 60%)", letterSpacing: "0.08em" }}>OS</span>
            </span>
            <span className="text-[9px] mt-1 tracking-widest uppercase" style={{ color: "hsl(35 20% 65% / 0.5)" }}>
              Powered by AI. Built for Biblical Intelligence.
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center mb-10"
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
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                onClick={() => handleSelect(level.mode)}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 group bg-gradient-to-b ${level.gradient} ${level.glow} ${level.border} ${isActive ? "ring-2 ring-white/10" : ""}`}
                style={{ background: isActive ? "hsl(220 13% 11%)" : "hsl(220 13% 8%)" }}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "hsl(220 10% 90% / 0.1)", color: "hsl(220 10% 70%)" }}>
                    Current
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl" style={{ background: "hsl(220 10% 90% / 0.06)" }}>
                    <Icon className="h-6 w-6" style={{ color: "hsl(220 10% 75%)" }} />
                  </div>
                  <div>
                    <div className="text-base font-semibold" style={{ color: "hsl(220 10% 88%)" }}>
                      Level {level.level}
                    </div>
                    <div className="text-lg font-bold" style={{ color: "hsl(220 10% 95%)" }}>
                      {level.label}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium mb-4" style={{ color: "hsl(220 10% 55%)" }}>
                  {level.tagline}
                </p>

                <ul className="space-y-2">
                  {level.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "hsl(220 10% 60%)" }}>
                      <span className="mt-0.5 w-1 h-1 rounded-full shrink-0" style={{ background: "hsl(220 10% 40%)" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 w-full py-2 rounded-lg text-center text-sm font-semibold transition-colors"
                  style={{
                    background: "hsl(220 10% 90% / 0.06)",
                    color: "hsl(220 10% 70%)",
                  }}>
                  {isActive ? "Continue" : "Select"}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}
