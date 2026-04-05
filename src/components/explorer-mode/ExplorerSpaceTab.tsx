/**
 * ExplorerSpaceTab — Renders a space's tool grid for Level 2 (Explorer)
 * Reuses the same tool items from OsSpacesWelcome data
 */
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, BookMarked, Lightbulb, Brain, GraduationCap, Gem, Target,
  StickyNote, BookText, Languages, Search, PersonStanding, Network,
  Clock, Map, Library, Headphones,
  Gamepad2, Zap, Trophy, CalendarDays,
  Eye, BookOpenCheck, Scroll, Crown,
  Moon, Flame, Calendar, Heart, HeartHandshake, Shield, Dumbbell,
  Globe,
} from "lucide-react";

interface SpaceItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

const STUDY_ITEMS: SpaceItem[] = [
  { label: "Study Bible", path: "/bible", icon: BookOpen, description: "Read & study Scripture" },
  { label: "My Studies", path: "/my-studies", icon: BookMarked, description: "Your saved studies" },
  { label: "Study Ideas", path: "/study-ideas", icon: Lightbulb, description: "AI-generated prompts" },
  { label: "Study Buddy", path: "/study-buddy", icon: Brain, description: "AI companion" },
  { label: "Research Assistant", path: "/research-assistant", icon: GraduationCap, description: "Advanced research" },
  { label: "Give Me A Gem", path: "/give-me-a-gem", icon: Gem, description: "Quick insights" },
  { label: "Analyze Thoughts", path: "/analyze-thoughts", icon: Lightbulb, description: "AI thought analysis" },
  { label: "Notes", path: "/notes", icon: StickyNote, description: "Personal notes" },
  { label: "Timeline", path: "/bible-timeline", icon: Clock, description: "Chronological map" },
  { label: "Characters", path: "/character-profiles", icon: PersonStanding, description: "Bible characters" },
  { label: "Encyclopedia", path: "/encyclopedia", icon: Search, description: "Biblical encyclopedia" },
  { label: "Lexicon", path: "/bible-lexicon", icon: Languages, description: "Word study" },
  { label: "Bible Atlas", path: "/bible-atlas", icon: Map, description: "Geographic explorer" },
  { label: "Source Library", path: "/libraries", icon: Library, description: "Reference materials" },
  { label: "Audio Library", path: "/audio-library", icon: Headphones, description: "Audio studies" },
];

const GAMES_ITEMS: SpaceItem[] = [
  { label: "Games Hub", path: "/games", icon: Gamepad2, description: "All games" },
  { label: "Daily Challenges", path: "/daily-challenges", icon: Zap, description: "Today's challenge" },
  { label: "Challenge Board", path: "/challenge-board", icon: Trophy, description: "Public board" },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "Top Phototheologists" },
  { label: "Achievements", path: "/achievements", icon: Trophy, description: "Earned badges" },
  { label: "Test Me", path: "/test-me", icon: GraduationCap, description: "Assessments" },
  { label: "Scheduled Games", path: "/schedule", icon: CalendarDays, description: "Game nights" },
];

const UNIVERSITY_ITEMS: SpaceItem[] = [
  { label: "Bible 101", path: "/bible-101", icon: Eye, description: "30-day visual journey" },
  { label: "PT Course", path: "/phototheology-course", icon: BookText, description: "90-day flagship course" },
  { label: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, description: "Prophecy foundations" },
  { label: "Daniel Course", path: "/daniel-course", icon: Scroll, description: "Book of Daniel deep dive" },
  { label: "Revelation Course", path: "/revelation-course", icon: Crown, description: "Unveiling Revelation" },
  { label: "Certificates", path: "/achievements", icon: Trophy, description: "Earned certificates" },
];

const CHAPEL_ITEMS: SpaceItem[] = [
  { label: "Night Watches", path: "/night-watches", icon: Moon, description: "Evening meditation" },
  { label: "Morning Watches", path: "/morning-watches", icon: Flame, description: "Morning activation" },
  { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Daily devotions" },
  { label: "Daily Audio", path: "/daily-audio-devotional", icon: Headphones, description: "Audio devotions" },
  { label: "Daily Reading", path: "/daily-reading", icon: Calendar, description: "Reading plan" },
  { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured paths" },
  { label: "Prophecy Watch", path: "/prophecy-watch", icon: Globe, description: "Events & prophecy" },
  { label: "Marriage", path: "/blueprint-marriage", icon: Heart, description: "Dating & marriage" },
  { label: "Grief Support", path: "/blueprint-grief", icon: HeartHandshake, description: "Grief guide" },
  { label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Mental wellness" },
  { label: "Wellness", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Health & wellness" },
  { label: "Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking free" },
];

const SPACE_DATA: Record<string, { title: string; subtitle: string; items: SpaceItem[] }> = {
  "study-space": { title: "📖 Study Space", subtitle: "Read, Research & Explore Scripture", items: STUDY_ITEMS },
  "games-space": { title: "🎮 Games Space", subtitle: "Games, Challenges & Competition", items: GAMES_ITEMS },
  "university-space": { title: "🎓 University", subtitle: "Courses & Certificates", items: UNIVERSITY_ITEMS },
  "chapel-space": { title: "⛪ Chapel Space", subtitle: "Devotional, Wellness & Community", items: CHAPEL_ITEMS },
};

interface ExplorerSpaceTabProps {
  spaceId: string;
}

export default function ExplorerSpaceTab({ spaceId }: ExplorerSpaceTabProps) {
  const navigate = useNavigate();
  const space = SPACE_DATA[spaceId];

  if (!space) return null;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{space.title}</h2>
          <p className="text-sm text-muted-foreground">{space.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {space.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                  "bg-card/60 backdrop-blur-sm border border-border/50",
                  "hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:scale-[1.02]",
                  "text-center group"
                )}
              >
                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground leading-tight">{item.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{item.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
