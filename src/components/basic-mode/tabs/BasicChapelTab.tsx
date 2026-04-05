/**
 * BasicChapelTab — Chapel resources for Level 1
 * Uses the same dark theme as Level 3 via Tailwind tokens
 */
import { useNavigate } from "react-router-dom";
import {
  Sunrise, Moon, BookOpenCheck, CalendarDays, Church, Heart,
  GraduationCap, Users, Baby, Gem, Shield, Globe, HeartHandshake,
} from "lucide-react";

const CHAPEL_ITEMS = [
  { icon: Sunrise, label: "Morning Watch", path: "/morning-watches", description: "Start your day with guided devotionals", color: "text-amber-400" },
  { icon: Moon, label: "Night Watch", path: "/night-watches", description: "Evening reflection & prayer", color: "text-indigo-400" },
  { icon: BookOpenCheck, label: "Daily Audio Devotional", path: "/daily-audio-devotional", description: "Listen to the day's devotional", color: "text-emerald-400" },
  { icon: CalendarDays, label: "Reading Plans", path: "/reading-plans", description: "Structured Bible reading programs", color: "text-sky-400" },
  { icon: Gem, label: "Daily Verse", path: "/daily-verse", description: "A gem from Scripture each day", color: "text-yellow-400" },
  { icon: Heart, label: "Devotionals", path: "/devotionals", description: "In-depth devotional content", color: "text-rose-400" },
  { icon: Church, label: "My Church", path: "/join-church", description: "Connect with your church community", color: "text-blue-400" },
  { icon: Globe, label: "Prophecy Watch", path: "/prophecy-watch", description: "Current events in the light of prophecy", color: "text-purple-400" },
  { icon: Shield, label: "Living Manna", path: "/living-manna", description: "Spiritual preparation resources", color: "text-teal-400" },
  { icon: GraduationCap, label: "Blueprint: Marriage", path: "/blueprint-marriage", description: "Biblical principles for marriage", color: "text-pink-400" },
  { icon: Baby, label: "Blueprint: Parenting", path: "/blueprint-parenting", description: "Raising children God's way", color: "text-orange-400" },
  { icon: Users, label: "Singles Devotional", path: "/singles-devotional", description: "Devotionals for singles", color: "text-cyan-400" },
  { icon: HeartHandshake, label: "Blueprint: Friendship", path: "/blueprint-friendship", description: "Godly friendship principles", color: "text-lime-400" },
];

export default function BasicChapelTab() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Phototheology Chapel
          </h2>
          <p className="text-sm text-muted-foreground">
            Devotionals, watches, reading plans, community, and life resources — all in one place.
          </p>
        </div>

        <div className="grid gap-3">
          {CHAPEL_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card text-left transition-all hover:bg-muted/50 hover:border-primary/30"
              >
                <div className={`shrink-0 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
