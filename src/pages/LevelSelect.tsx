import { useNavigate } from "react-router-dom";
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import { motion } from "framer-motion";
import { BookOpen, Crown, Check, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useRef } from "react";
import { SavedItemsTab } from "@/components/level-select/SavedItemsTab";
import { FrontPagePodcastPreview } from "@/components/FrontPagePodcastPreview";

interface LevelOption {
  mode: ExperienceMode;
  level: number;
  identity: string;
  declaration: string;
  description: string;
  feelsLike: string[];
  become: string;
  icon: typeof BookOpen;
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
    identity: "Learn",
    declaration: "\"I want to learn the Bible.\"",
    description:
      "Discover Scripture through reading, devotionals, and guided insights — build your foundation with tools that make the Bible come alive.",
    feelsLike: ["Insight hits", "\"I never saw that before\"", "Scripture opens up"],
    become: "A Student of the Word",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, hsl(170 55% 42%), hsl(140 50% 45%))",
    accentHsl: "hsl(160 55% 50%)",
    glowColor: "hsl(160 55% 45% / 0.3)",
    bgCard: "linear-gradient(160deg, hsl(170 25% 12%), hsl(160 20% 8%))",
    bgCardActive: "linear-gradient(160deg, hsl(170 30% 14%), hsl(160 25% 10%))",
    btnGradient: "linear-gradient(135deg, hsl(170 55% 42%), hsl(140 50% 45%))",
  },
  {
    mode: "immersion",
    level: 2,
    identity: "Study",
    declaration: "\"I'm ready to study with PT principles.\"",
    description:
      "Master every room, every connection — create powerful Bible studies, sermons, and ministry tools using Phototheology's 38 interconnected principles.",
    feelsLike: ["Authority", "Creativity", "Deep mastery"],
    become: "An Architect of Truth",
    icon: Crown,
    gradient: "linear-gradient(135deg, hsl(270 55% 55%), hsl(290 50% 50%))",
    accentHsl: "hsl(270 55% 60%)",
    glowColor: "hsl(270 55% 50% / 0.3)",
    bgCard: "linear-gradient(160deg, hsl(270 20% 12%), hsl(260 15% 8%))",
    bgCardActive: "linear-gradient(160deg, hsl(270 25% 14%), hsl(260 20% 10%))",
    btnGradient: "linear-gradient(135deg, hsl(270 55% 55%), hsl(290 50% 50%))",
  },
];

const TRANSITIONS = [
  "But learning is only the beginning…",
];

export default function LevelSelect() {
  const navigate = useNavigate();
  const { mode, setMode } = useExperienceMode();
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selected: ExperienceMode) => {
    setMode(selected);
    navigate("/welcome");
  };

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Choose Your Level | PhototheologyOS"
        description="Step into your role in the system. Learn or Study."
      />
      <div
        className="min-h-[100dvh] overflow-y-auto"
        style={{
          background:
            "radial-gradient(ellipse at top, hsl(220 15% 10%), hsl(220 15% 4%))",
        }}
      >
        {/* === CINEMATIC OPENING === */}
        <div className="min-h-[85dvh] flex flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-sm tracking-[0.25em] uppercase font-medium mb-8"
            style={{ color: "hsl(220 10% 45%)" }}
          >
            PhototheologyOS
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="w-full max-w-2xl mb-8"
          >
            <FrontPagePodcastPreview />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed max-w-lg"
            style={{ color: "hsl(220 10% 75%)" }}
          >
            The Bible is not shallow.
            <br />
            <span className="italic" style={{ color: "hsl(220 10% 55%)" }}>
              It is layered… structured… alive with connections most never see.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-10 text-base sm:text-lg font-medium max-w-md leading-relaxed"
            style={{ color: "hsl(220 10% 85%)" }}
          >
            The question is not just{" "}
            <em style={{ color: "hsl(40 70% 60%)" }}>what do you want to learn</em>…
            <br />
            but{" "}
            <em style={{ color: "hsl(40 70% 60%)" }}>
              how deep are you ready to go?
            </em>
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.6 }}
            onClick={scrollToCards}
            className="mt-12 flex flex-col items-center gap-1 text-xs font-medium transition-all hover:brightness-125"
            style={{ color: "hsl(220 10% 50%)" }}
          >
            Choose your path
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.button>
        </div>

        {/* === LEVEL CARDS === */}
        <div ref={cardsRef} className="px-4 pb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {LEVELS.map((level, i) => {
              const Icon = level.icon;
              const isActive = mode === level.mode;
              return (
                <div key={level.mode}>
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    onClick={() => handleSelect(level.mode)}
                    className="relative w-full text-left rounded-2xl border transition-all duration-300 group overflow-hidden"
                    style={{
                      background: isActive ? level.bgCardActive : level.bgCard,
                      borderColor: isActive
                        ? level.accentHsl
                        : "hsl(220 10% 16%)",
                      boxShadow: isActive
                        ? `0 0 40px ${level.glowColor}`
                        : "none",
                    }}
                  >
                    <div
                      className="h-1 w-full"
                      style={{ background: level.gradient }}
                    />

                    <div className="p-5 sm:p-6">
                      {isActive && (
                        <span
                          className="absolute top-3 right-3 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: level.accentHsl + "22",
                            color: level.accentHsl,
                          }}
                        >
                          <Check className="h-2.5 w-2.5" /> Current
                        </span>
                      )}

                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="p-2.5 rounded-xl"
                          style={{ background: level.gradient }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color: level.accentHsl }}
                          >
                            Level {level.level}
                          </div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: "hsl(220 10% 93%)" }}
                          >
                            {level.identity}
                          </div>
                        </div>
                      </div>

                      <p
                        className="text-sm font-semibold italic mb-3"
                        style={{ color: level.accentHsl }}
                      >
                        {level.declaration}
                      </p>

                      <p
                        className="text-[13px] leading-relaxed mb-4"
                        style={{ color: "hsl(220 10% 65%)" }}
                      >
                        {level.description}
                      </p>

                      <div className="mb-4">
                        <p
                          className="text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                          style={{ color: "hsl(220 10% 45%)" }}
                        >
                          What this feels like
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {level.feelsLike.map((f, j) => (
                            <span
                              key={j}
                              className="text-[11px] px-2 py-0.5 rounded-full border"
                              style={{
                                borderColor: level.accentHsl + "33",
                                color: level.accentHsl,
                                background: level.accentHsl + "11",
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p
                        className="text-xs font-medium mb-5"
                        style={{ color: "hsl(220 10% 50%)" }}
                      >
                        You become →{" "}
                        <span
                          className="font-bold"
                          style={{ color: level.accentHsl }}
                        >
                          {level.become}
                        </span>
                      </p>

                      <div
                        className="w-full py-2.5 rounded-xl text-center text-sm font-bold transition-all"
                        style={{
                          background: isActive
                            ? level.gradient
                            : "hsl(220 10% 90% / 0.06)",
                          color: isActive ? "white" : "hsl(220 10% 65%)",
                          border: `1px solid ${
                            isActive ? "transparent" : "hsl(220 10% 18%)"
                          }`,
                        }}
                      >
                        {isActive ? "Continue →" : "Step In"}
                      </div>
                    </div>
                  </motion.button>

                  {i < TRANSITIONS.length && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center text-sm italic py-6 md:hidden"
                      style={{ color: "hsl(220 10% 45%)" }}
                    >
                      {TRANSITIONS[i]}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-sm mt-10 max-w-md mx-auto leading-relaxed"
            style={{ color: "hsl(220 10% 50%)" }}
          >
            Choose not based on where you are…
            <br />
            <span
              className="font-semibold"
              style={{ color: "hsl(220 10% 80%)" }}
            >
              but based on who you're ready to become.
            </span>
          </motion.p>

          
        </div>
      </div>
    </>
  );
}
