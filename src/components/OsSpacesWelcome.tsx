import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Palette, Landmark, Mic, Swords, Church, Wrench,
  BookOpen, Brain, Zap, Gem, BookMarked, Lightbulb, Target,
  Search, PersonStanding, GraduationCap, Network, Headphones,
  Building2, Image, Sparkles, Film, Eye,
  Gamepad2, CalendarDays, Trophy, Dumbbell, Shield,
  Flame, Calendar, StickyNote, Scale, Heart, HeartHandshake,
  MessageSquare, Megaphone, Video, Crown, Users, User,
  Library, Clock, Map, Languages, BookText, Glasses,
  CreditCard, LayoutGrid, ImageIcon, Scroll,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
  tooltip?: string;
  hue?: number;
}

interface OsSpace {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  items: SpaceItem[];
}

const OS_SPACES: OsSpace[] = [
  {
    id: "studio",
    label: "Phototheology Studio",
    subtitle: "Study, Write & Research",
    icon: Palette,
    color: "210 100% 56%",
    items: [
      { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read & study Scripture", tooltip: "Open the full KJV Bible with chapter navigation, verse highlighting, and integrated commentary. Your primary workspace for reading and marking up Scripture." },
      { label: "My Studies", path: "/my-studies", icon: BookMarked, description: "Your saved studies", tooltip: "Access all your saved Phototheology studies, notes, and insights in one organized library. Pick up right where you left off." },
      { label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, description: "AI-generated prompts", tooltip: "Get AI-generated study prompts based on PT principles. Each idea comes with a suggested passage, room sequence, and guiding questions to jumpstart your study." },
      { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion", tooltip: "Your personal AI study partner trained in Phototheology. Ask questions, get verse connections, and explore passages together in real time." },
      { label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, description: "Advanced research", tooltip: "Deep-dive research tool for cross-referencing themes, tracing word origins, and building comprehensive studies. Ideal for sermon prep and academic work." },
      { label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, description: "Quick insights", tooltip: "Tap for an instant biblical insight — a surprising connection, hidden detail, or Christ-centered gem you may have never noticed. Perfect for daily inspiration." },
      { label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis", tooltip: "Paste any theological idea, quote, or sermon excerpt and let AI analyze it through the Phototheology framework. Get feedback on which rooms and floors apply." },
      { label: "Gather Fragments", path: "/drill-drill", icon: Target, description: "Collect fragments", tooltip: "Collect scattered observations, verses, and insights into organized fragment clusters. Like gathering puzzle pieces before assembling the full picture." },
      { label: "Study Series", path: "/bible-study-series", icon: BookOpen, description: "Multi-lesson series", tooltip: "Create or follow multi-lesson Bible study series with structured progression. Great for small groups, classes, or personal deep dives over several weeks." },
      { label: "Notes", path: "/notes", icon: StickyNote, description: "Personal notes", tooltip: "Your personal notepad for capturing thoughts, reflections, and discoveries during study. Supports rich text, tagging, and organization by topic." },
      { label: "Interlinear Bible", path: "/bible/John/1?strongs=true", icon: BookText, description: "Greek/Hebrew", tooltip: "View Scripture with original Greek and Hebrew words displayed alongside English. Tap any word to see its Strong's number, definition, and usage across the Bible." },
      { label: "Lexicon", path: "/bible-lexicon", icon: Languages, description: "Word study", tooltip: "Search Greek and Hebrew words by Strong's number or English meaning. Trace how a single word is used across all of Scripture to unlock deeper patterns." },
      { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia", tooltip: "Browse a comprehensive encyclopedia of biblical people, places, objects, and concepts. Each entry is enriched with Phototheology connections and cross-references." },
      { label: "Characters", path: "/character-profiles", icon: PersonStanding, description: "Bible characters", tooltip: "Explore detailed profiles of biblical characters — their stories, roles, types, and Christ-connections. See how each life fits into the grand redemption narrative." },
      { label: "Genealogy", path: "/research-assistant?tab=genealogy", icon: Network, description: "Trace lineages", tooltip: "Trace family trees from Adam to Christ and beyond. Visualize genealogical connections and discover how God's covenant line threads through Scripture." },
      { label: "Timeline", path: "/bible-timeline", icon: Clock, description: "Chronological map", tooltip: "View biblical history on an interactive chronological timeline. See how events, prophets, kings, and empires align across centuries of redemption history." },
      { label: "Bible Atlas", path: "/bible-atlas", icon: Map, description: "Geographic explorer", tooltip: "Explore the lands of Scripture on interactive maps. Trace journeys of Abraham, the Exodus route, Paul's missions, and more with geographic context." },
      { label: "Source Library", path: "/libraries", icon: Library, description: "Reference materials", tooltip: "Access a curated library of Spirit of Prophecy writings, historical commentaries, and reference documents to deepen your Phototheology research." },
    ],
  },
  {
    id: "gallery",
    label: "Phototheology Gallery",
    subtitle: "Palace, Visuals & Memory",
    icon: Landmark,
    color: "32 95% 53%",
    items: [
      { label: "Memory Palace", path: "/palace", icon: Building2, description: "8 Floors of PT", tooltip: "Enter the Phototheology Palace — all 8 floors with their rooms, principles, and exercises. The heart of the entire PT system, organized for exploration and mastery." },
      { label: "Tour the Palace", path: "/palace/tour", icon: Headphones, description: "Audio walkthrough", tooltip: "Take a guided audio tour through the Palace floors. Listen as each room is explained with examples, making it perfect for learning on the go." },
      { label: "Freestyle Arena", path: "/palace/freestyle", icon: Zap, description: "Spontaneous connections", tooltip: "Practice spontaneous Scripture connections like a freestyle artist. Get random prompts and weave verses, nature, life experiences, and history into real-time Bible application." },
      { label: "Mind Map", path: "/mind-map", icon: Network, description: "Visual mapping", tooltip: "Build visual mind maps of biblical themes, connecting verses, stories, and doctrines in a branching web. See how ideas relate and discover new patterns visually." },
      { label: "Memory Training", path: "/memory", icon: Brain, description: "Drills & exercises", tooltip: "Sharpen your Scripture recall with targeted memory drills. Practice story sequences, verse locations, chapter frames, and rapid-fire identification exercises." },
      { label: "Image Bible", path: "/image-bible", icon: Image, description: "Visual Scripture", tooltip: "Experience Scripture through AI-generated imagery. Each passage is rendered as a vivid visual scene, activating the Imagination Room principles for deeper retention." },
      { label: "Study Deck", path: "/card-deck", icon: Sparkles, description: "Flashcards", tooltip: "Draw PT study cards with room-specific questions for any passage. Each card prompts you to apply a specific floor or room principle, building skill through practice." },
      { label: "Infographics", path: "/image-bible", icon: ImageIcon, description: "Visual summaries", tooltip: "Browse beautifully designed infographics that summarize key PT concepts, sanctuary furniture, prophetic timelines, and doctrinal themes at a glance." },
      { label: "VR Experience", path: "/vr", icon: Glasses, description: "Immersive 3D palace", tooltip: "Step into a 3D virtual reality version of the Phototheology Palace. Walk through rooms, interact with furniture, and experience the sanctuary in immersive detail." },
    ],
  },
  {
    id: "stage",
    label: "Phototheology Stage",
    subtitle: "Sermons, Teaching & Output",
    icon: Mic,
    color: "270 56% 65%",
    items: [
      { label: "Sermon Builder", path: "/sermon-builder", icon: MessageSquare, description: "Craft sermons", tooltip: "Build complete sermons using the Phototheology framework. Structure your message with Christ-centered depth, sanctuary connections, and practical application points." },
      { label: "Sermon Ideas", path: "/sermon-ideas", icon: Lightbulb, description: "Saved concepts", tooltip: "Browse and save sermon concepts organized by theme, passage, and PT floor. Build a growing library of preaching ideas ready for development." },
      { label: "Amplify", path: "/amplify", icon: Megaphone, description: "Enhance with cross-refs", tooltip: "Take any sermon or study and amplify it with cross-references, parallel passages, and deeper connections. Strengthen your message with biblical reinforcement." },
      { label: "Remix", path: "/remix", icon: Zap, description: "Remix frameworks", tooltip: "Remix existing content through different PT lenses. Take a study through new rooms, apply different cycles, or reframe it for a new audience or context." },
      { label: "Polish", path: "/polish", icon: Film, description: "Sermon manuscripts", tooltip: "Generate polished sermon manuscripts from your outlines and notes. AI refines your language, structure, and flow while preserving your voice and theological intent." },
      { label: "Video Training", path: "/video-training", icon: Video, description: "Teaching videos", tooltip: "Access a library of teaching videos covering PT principles, room walkthroughs, and live study demonstrations. Learn by watching masters apply the method." },
    ],
  },
  {
    id: "arena",
    label: "Phototheology Arena",
    subtitle: "Games, Challenges & Combat",
    icon: Swords,
    color: "0 84% 60%",
    items: [
      { label: "COTA Series", path: "/cota-series", icon: Crown, description: "Christ in OT", tooltip: "Explore the Christ in the Old Testament Archives — a curated library of studies revealing how every OT book, story, and symbol points to Jesus Christ." },
      { label: "Defense Mode", path: "/cota-series?tab=defense", icon: Shield, description: "Doctrinal defense", tooltip: "Train in doctrinal defense using Scripture. Practice answering objections, defending key beliefs, and building airtight biblical arguments for your faith." },
      { label: "AATS War College", path: "/cota-series?tab=aats", icon: Swords, description: "Advanced training", tooltip: "Advanced Apologetics Training System — intensive combat-level theological training. Face complex scenarios, build case studies, and sharpen your doctrinal edge." },
      { label: "Games", path: "/games", icon: Gamepad2, description: "Multiplayer games", tooltip: "Play Bible-based games — from trivia to room challenges to multiplayer competitions. Learn Scripture while competing with friends and the community." },
      { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Game nights", tooltip: "Join scheduled game nights and live competitions with other Phototheologists. See upcoming events, sign up, and compete for leaderboard rankings." },
      { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge", tooltip: "A fresh challenge every day — apply a specific PT room or principle to a new passage. Complete it to earn XP, streaks, and badges." },
      { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public board", tooltip: "View all available challenges across difficulty levels. Pick your battle — from beginner observation drills to master-level cycle mapping exercises." },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists", tooltip: "See who's leading the pack. Rankings are based on study completion, challenge scores, game wins, and overall engagement with the PT system." },
      { label: "Achievements", path: "/achievements", icon: Trophy, description: "Earned badges", tooltip: "View your earned badges, certificates, and milestones. Track your journey from novice to master across all 8 floors of the Palace." },
      { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Assessments", tooltip: "Take assessments to test your PT knowledge. Answer room-specific questions, identify principles in passages, and get scored with AI feedback." },
      { label: "Training Drills", path: "/test-me", icon: Target, description: "Speed drills", tooltip: "Rapid-fire drills designed to build reflexive PT thinking. Timed exercises force quick identification of rooms, cycles, and Christ-connections." },
      { label: "Dojo", path: "/spiritual-training", icon: Swords, description: "Combat training", tooltip: "Structured spiritual combat training — systematic exercises that combine multiple floors and rooms into intensive study sessions for advanced practitioners." },
      { label: "Apologetics GPT", path: "/apologetics-gpt", icon: Shield, description: "Defend the faith", tooltip: "An AI trained specifically for apologetics. Present any objection, theological question, or debate topic and receive Scripture-grounded defensive arguments." },
      { label: "Christ & Culture", path: "/culture-controversy", icon: Scale, description: "Cultural topics", tooltip: "Explore how Scripture speaks to modern cultural issues. Get balanced, Christ-centered perspectives on trending controversies and social topics." },
    ],
  },
  {
    id: "chapel",
    label: "Phototheology Chapel",
    subtitle: "Devotional, Church & Community",
    icon: Church,
    color: "142 71% 45%",
    items: [
      { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily devotions", tooltip: "Start your day with a devotional built on PT principles. Each entry includes Scripture, meditation prompts, a Christ-connection, and a closing prayer." },
      { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Reading plan", tooltip: "Follow a structured daily Bible reading plan that covers the entire Bible. Track your progress and build a consistent reading habit over time." },
      { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured paths", tooltip: "Choose from multiple reading plans — chronological, thematic, prophetic, or book-by-book. Each plan is designed to build PT understanding progressively." },
      { label: "Audio Library", path: "/audio-library", icon: Headphones, description: "Audio studies", tooltip: "Listen to narrated Bible studies, devotionals, and PT teachings. Perfect for commutes, workouts, or anytime you want to study hands-free." },
      { label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, description: "Events & prophecy", tooltip: "Track current events through the lens of biblical prophecy. See how world news connects to Daniel, Revelation, and the Three Angels' Messages." },
      { label: "My Church", path: "/living-manna", icon: Church, description: "Church community", tooltip: "Your church's digital hub — access Sabbath School lessons, church announcements, prayer requests, and connect with your local congregation." },
      { label: "Community", path: "/community", icon: Users, description: "Study partners", tooltip: "Find and connect with other Phototheologists. Join study groups, share insights, discuss passages, and grow together in biblical understanding." },
      { label: "My Profile", path: "/my-profile", icon: User, description: "Your profile", tooltip: "View and customize your Phototheologist profile. Track your stats, study streaks, floor progress, and share your achievements with the community." },
      { label: "Marriage", path: "/blueprint-marriage", icon: Heart, description: "Dating & marriage", tooltip: "A biblical guide to dating and marriage built on Scripture. Explore God's design for relationships with practical applications and devotional content." },
      { label: "Grief Support", path: "/blueprint-grief", icon: HeartHandshake, description: "Grief guide", tooltip: "Walk through grief with biblical comfort and hope. This guide pairs Scripture with practical steps for healing, anchored in the promise of resurrection." },
      { label: "Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking free", tooltip: "Identify and break spiritual strongholds using Scripture. A guided journey through biblical strategies for overcoming habitual sin and spiritual bondage." },
      { label: "Weight & Health", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Wellness", tooltip: "A faith-based approach to physical wellness rooted in biblical health principles. Combine spiritual discipline with practical nutrition and fitness guidance." },
      { label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Mental wellness", tooltip: "Biblical resources for mental wellness — addressing anxiety, depression, and emotional health through Scripture, prayer, and practical strategies for wholeness." },
    ],
  },
  {
    id: "workshop",
    label: "Phototheology Workshop",
    subtitle: "AI Tools, GPTs & Settings",
    icon: Wrench,
    color: "215 14% 53%",
    items: [
      { label: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, description: "Master AI assistant", tooltip: "The flagship AI assistant trained on the full Phototheology system. Ask any biblical question and receive answers using all 8 floors, cycles, and heavens." },
      { label: "BranchStudy", path: "/branch-study", icon: Network, description: "Branching paths", tooltip: "Explore branching study paths where each answer leads to deeper questions. Like a choose-your-own-adventure through Scripture, guided by PT principles." },
      { label: "Kid GPT", path: "/kidgpt", icon: Users, description: "Kid-friendly AI", tooltip: "A child-friendly AI Bible teacher that explains Scripture using simple language, fun analogies, and age-appropriate illustrations. Safe and engaging for young learners." },
      { label: "Daniel & Rev GPT", path: "/daniel-revelation-gpt", icon: Eye, description: "Prophecy AI", tooltip: "An AI specialized in the books of Daniel and Revelation. Ask about beasts, timelines, seals, trumpets, and the sanctuary — get historicist-grounded answers." },
      { label: "Study Partners", path: "/community", icon: Users, description: "Find buddies", tooltip: "Browse available study partners and connect for collaborative Bible study. Match with others based on interests, skill level, and study preferences." },
      { label: "Workspace", path: "/workspace", icon: LayoutGrid, description: "Your workspace", tooltip: "Your personal workspace dashboard — organize your active studies, recent tools, bookmarks, and favorite resources in one customizable command center." },
      { label: "Pricing", path: "/pricing", icon: CreditCard, description: "Plans", tooltip: "View available subscription plans and features. Compare tiers to find the right level of access for your Phototheology journey." },
    ],
  },
  {
    id: "academy",
    label: "The Academy",
    subtitle: "Courses & Progression",
    icon: GraduationCap,
    color: "45 90% 50%",
    items: [
      { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "90-day flagship course", tooltip: "The 90-day flagship Phototheology course covering all 8 floors, 40+ rooms, and the full system. Includes video lessons, quizzes, and hands-on exercises." },
      { label: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, description: "Prophecy foundations", tooltip: "A foundational course on prophecy, sanctuary symbolism, and end-time events. Kid-friendly versions available. Build your prophetic literacy from the ground up." },
      { label: "Daniel Course", path: "/daniel-course", icon: Scroll, description: "Book of Daniel deep dive", tooltip: "A comprehensive deep dive into the book of Daniel — its prophecies, types, sanctuary connections, and Christ-centered themes across all 12 chapters." },
      { label: "Revelation Course", path: "/revelation-course", icon: Crown, description: "Unveiling Revelation", tooltip: "Unlock the book of Revelation chapter by chapter. Trace the sanctuary, the three angels, the beasts, and the final victory of Christ through the PT lens." },
      { label: "Floor Mastery", path: "/mastery", icon: GraduationCap, description: "Track progression", tooltip: "Track your mastery across all 8 Palace floors. See which rooms you've completed, which need practice, and chart your path to reflexive Phototheology." },
      { label: "Certificates", path: "/achievements", icon: Trophy, description: "Earned certificates", tooltip: "View and share your earned certificates of completion. Each certificate represents a milestone in your Phototheology journey — display them with pride." },
    ],
  },
];

export const OsSpacesWelcome = () => {
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const active = OS_SPACES.find(s => s.id === activeSpace);

  return (
    <div className="px-4 py-6 space-y-6">
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
          {user ? "Welcome back, Phototheologist" : "The Art of Phototheology"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          The Art of Seeing Christ in All Things — powered by <span className="font-semibold" style={{ color: "#d4a017" }}>Biblical Intelligence (BI)</span>
        </p>
      </motion.div>

      {/* 6 OS Space Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 max-w-4xl mx-auto">
        {OS_SPACES.map((space, i) => {
          const Icon = space.icon;
          const isActive = activeSpace === space.id;
          return (
            <motion.button
              key={space.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSpace(isActive ? null : space.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                isActive
                  ? "border-primary/60 bg-primary/10 scale-105 shadow-lg"
                  : "border-border/40 bg-card/80 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: `linear-gradient(135deg, hsl(${space.color}), hsl(${space.color} / 0.7))`,
                  boxShadow: isActive
                    ? `0 0 20px hsl(${space.color} / 0.5)`
                    : `0 3px 8px hsl(${space.color} / 0.25)`,
                }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center">{space.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Space — Desktop-style app grid */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl border p-5 space-y-4 backdrop-blur-xl"
              style={{
                background: `linear-gradient(135deg, hsl(${active.color} / 0.12), hsl(${active.color} / 0.04), hsl(${active.color} / 0.08))`,
                borderColor: `hsl(${active.color} / 0.25)`,
                boxShadow: `0 8px 32px hsl(${active.color} / 0.15), inset 0 1px 0 hsl(${active.color} / 0.1)`,
              }}
            >
              {/* Space header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, hsl(${active.color}), hsl(${active.color} / 0.7))` }}
                >
                  <active.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{active.label}</h3>
                  <p className="text-xs text-muted-foreground">{active.subtitle} · {active.items.length} tools</p>
                </div>
              </div>

              {/* App icon grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {active.items.map((item, idx) => {
                  const ItemIcon = item.icon;
                  // Deterministic "random" hue per item using golden angle for max spread
                  const goldenAngle = 137.508;
                  const itemHue = Math.round((idx * goldenAngle + active.id.charCodeAt(0) * 47) % 360);
                  const sat = 65 + (idx % 3) * 10; // 65-85%
                  const light = 50 + (idx % 4) * 5; // 50-65%
                  const itemColor = `${itemHue} ${sat}% ${light}%`;
                  return (
                    <TooltipProvider key={item.path + item.label} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl backdrop-blur-md border border-white/10 hover:border-white/30 transition-all group hover:scale-[1.04]"
                            style={{
                              background: `linear-gradient(135deg, hsl(${itemColor} / 0.14), hsl(${itemColor} / 0.05))`,
                              boxShadow: `0 0 12px hsl(${itemColor} / 0.1)`,
                            }}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                              style={{
                                background: `linear-gradient(135deg, hsl(${itemColor} / 0.5), hsl(${itemColor} / 0.2))`,
                                boxShadow: `0 0 16px hsl(${itemColor} / 0.35), 0 2px 8px hsl(${itemColor} / 0.2)`,
                              }}
                            >
                              <ItemIcon className="w-4 h-4 text-white/90 group-hover:text-white transition-colors drop-shadow-sm" />
                            </div>
                            <span className="text-[10px] font-medium leading-tight text-center line-clamp-2">{item.label}</span>
                          </button>
                        </TooltipTrigger>
                        {item.tooltip && (
                          <TooltipContent 
                            side="top" 
                            sideOffset={8}
                            className="max-w-[280px] text-xs leading-relaxed px-4 py-3 rounded-xl border-primary/20 bg-popover/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                          >
                            <p className="font-semibold text-primary mb-1 text-[11px]">{item.label}</p>
                            <p className="text-muted-foreground">{item.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BI badge */}
      {!activeSpace && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/40">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#d4a017" }} />
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold" style={{ color: "#d4a017" }}>BI</span> · Biblical Intelligence Engine · 70+ tools across 7 spaces
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
