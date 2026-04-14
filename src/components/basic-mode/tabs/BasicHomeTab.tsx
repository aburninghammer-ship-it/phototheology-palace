import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BookOpen, Brain, Lightbulb, Search, ImageIcon,
  Moon, Flame, Headphones, Calendar, Mic,
  Church, BookOpenCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
  tooltip?: string;
}

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  items: ToolItem[];
}

const HERO_TOOLS: ToolItem[] = [
  { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read and learn with integrated commentaries", tooltip: "Open the full KJV Bible with chapter navigation, verse highlighting, and integrated commentary." },
  { label: "Ask Jeeves", path: "/jeeves", icon: Brain, description: "Your personal AI Bible study companion", tooltip: "Ask questions, get verse connections, and explore passages together in real time." },
  { label: "Study Experience", path: "/study-experience", icon: Lightbulb, description: "Deep dive into any passage with layered insights", tooltip: "Enter any verse or topic and receive layered theological insights that build on each other." },
];

const SECTIONS: Section[] = [
  {
    id: "study",
    label: "Study",
    icon: BookOpenCheck,
    color: "210 100% 56%",
    items: [
      { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion", tooltip: "Your personal AI study partner. Ask questions, get verse connections, and explore passages together." },
      { label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis", tooltip: "Paste any theological idea, quote, or sermon excerpt and let AI analyze it." },
      { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia", tooltip: "Browse a comprehensive encyclopedia of biblical people, places, objects, and concepts." },
      { label: "Image Bible", path: "/image-bible", icon: ImageIcon, description: "Visual Scripture", tooltip: "Experience Scripture rendered as AI-generated artwork for memorization and meditation." },
      { label: "Commentary Suite", path: "/audio-bible", icon: Headphones, description: "8-voice audio commentary", tooltip: "Listen to any passage narrated in 8 unique voices — Epic, Modern Preacher, Counselor, Ancient, Preacher, Scholar, Kids, and Mirror." },
    ],
  },
  {
    id: "chapel",
    label: "Devotional",
    icon: Church,
    color: "142 71% 45%",
    items: [
      { label: "Night Watches", path: "/night-watches", icon: Moon, description: "Evening meditation", tooltip: "A 15-minute evening meditation — cinematic, scriptural reflection before sleep." },
      { label: "Morning Watches", path: "/morning-watches", icon: Flame, description: "Morning activation", tooltip: "15-minute morning activation session to start your day grounded in Scripture." },
      { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily devotions", tooltip: "Start your day with a devotional. Includes Scripture, meditation prompts, and a Christ-connection." },
      { label: "Daily Audio", path: "/daily-audio-devotional", icon: Headphones, description: "Audio devotions", tooltip: "Listen to today's audio devotional — deep, Christ-centered reflections delivered daily." },
      { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Reading plan", tooltip: "Follow a structured daily Bible reading plan that covers the entire Bible." },
      { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured paths", tooltip: "Choose from multiple reading plans — chronological, thematic, or book-by-book." },
      { label: "PT Podcast", path: "/podcast", icon: Mic, description: "Audio episodes", tooltip: "Listen to the PhototheologyOS Podcast — exploring the Palace Method, biblical patterns, and Christ-centered study." },
    ],
  },
];

export default function BasicHomeTab() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
        {/* Hero tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-wide"
            style={{ fontFamily: "'Cinzel', serif", color: "#d4a017" }}
          >
            Explore the Bible
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Your complete Bible study toolkit — powered by <span className="font-semibold" style={{ color: "#d4a017" }}>Biblical Intelligence</span>
          </p>
        </motion.div>

        {/* Hero Cards — top 3 tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HERO_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.button
                key={tool.path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(tool.path)}
                className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-primary/20 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-primary/40 group text-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.04), rgba(0,0,0,0.4))",
                  boxShadow: "0 4px 24px hsl(var(--primary) / 0.12)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))",
                    boxShadow: "0 4px 16px hsl(var(--primary) / 0.35), inset 0 1px 1px rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 45%)' }} />
                  <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{tool.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Sections */}
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + si * 0.08 }}
            className="space-y-3"
          >
            {/* Section header */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, hsl(${section.color}), hsl(${section.color} / 0.7))` }}
              >
                <section.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-base" style={{ color: `hsl(${section.color})` }}>
                {section.label}
              </h3>
              <span className="text-xs text-muted-foreground">· {section.items.length} tools</span>
            </div>

            {/* Tool grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {section.items.map((item, idx) => {
                const ItemIcon = item.icon;
                const goldenAngle = 137.508;
                const itemHue = Math.round((idx * goldenAngle + section.id.charCodeAt(0) * 47) % 360);
                const itemColor = `${itemHue} 70% 55%`;

                const card = (
                  <button
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-md border border-white/10 hover:border-white/25 transition-all group/item hover:scale-[1.02] text-left w-full"
                    style={{
                      background: `linear-gradient(135deg, hsl(${itemColor} / 0.1), hsl(${itemColor} / 0.03))`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, hsl(${itemColor} / 0.85), hsl(${itemColor} / 0.5))`,
                        boxShadow: `0 3px 10px hsl(${itemColor} / 0.3), inset 0 1px 1px rgba(255,255,255,0.15)`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 45%)' }} />
                      <ItemIcon className="w-4 h-4 text-white/95 relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold block truncate">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground block truncate">{item.description}</span>
                    </div>
                  </button>
                );

                if (item.tooltip) {
                  return (
                    <TooltipProvider key={item.path} delayDuration={400}>
                      <Tooltip>
                        <TooltipTrigger asChild>{card}</TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={8}
                          collisionPadding={16}
                          className="max-w-[260px] text-xs leading-relaxed px-3 py-2 rounded-xl bg-popover/95 backdrop-blur-md z-[100]"
                        >
                          <p className="font-semibold text-primary mb-0.5">{item.label}</p>
                          <p className="text-muted-foreground">{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }

                return <div key={item.path}>{card}</div>;
              })}
            </div>
          </motion.div>
        ))}

        {/* BI badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pb-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/40">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#d4a017" }} />
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold" style={{ color: "#d4a017" }}>BI</span> · Biblical Intelligence Engine · {HERO_TOOLS.length + SECTIONS.reduce((a, s) => a + s.items.length, 0)} tools
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
