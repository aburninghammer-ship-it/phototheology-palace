import { useNavigate } from "react-router-dom";
import {
  Moon, Flame, Headphones, Calendar, BookOpen, Church,
  Heart, HeartHandshake, Shield, Dumbbell, Brain, Eye
} from "lucide-react";

interface ChapelItem {
  label: string;
  path: string;
  icon: typeof Moon;
  description: string;
  iconColor: string;
  iconBg: string;
}

const CHAPEL_ITEMS: ChapelItem[] = [
  { label: "Night Watches", path: "/night-watches", icon: Moon, description: "Evening cinematic meditations", iconColor: "hsl(250 60% 70%)", iconBg: "hsl(250 60% 70% / 0.15)" },
  { label: "Morning Watches", path: "/morning-watches", icon: Flame, description: "5–8 min morning activation", iconColor: "hsl(25 80% 55%)", iconBg: "hsl(25 80% 55% / 0.15)" },
  { label: "Daily Audio Devotional", path: "/daily-audio-devotional", icon: Headphones, description: "Today's Phototheology devotional", iconColor: "hsl(170 55% 50%)", iconBg: "hsl(170 55% 50% / 0.15)" },
  { label: "Devotionals", path: "/devotionals", icon: Flame, description: "Browse all devotional series", iconColor: "hsl(38 65% 55%)", iconBg: "hsl(38 65% 55% / 0.15)" },
  { label: "Daily Reading", path: "/daily-reading", icon: BookOpen, description: "Today's Bible reading", iconColor: "hsl(200 60% 55%)", iconBg: "hsl(200 60% 55% / 0.15)" },
  { label: "Reading Plans", path: "/reading-plans", icon: Calendar, description: "Structured reading paths", iconColor: "hsl(280 50% 55%)", iconBg: "hsl(280 50% 55% / 0.15)" },
  { label: "Prophecy Watch", path: "/prophecy-watch", icon: Eye, description: "Events through prophecy", iconColor: "hsl(45 80% 55%)", iconBg: "hsl(45 80% 55% / 0.15)" },
  { label: "My Church", path: "/living-manna", icon: Church, description: "Your church community hub", iconColor: "hsl(142 50% 50%)", iconBg: "hsl(142 50% 50% / 0.15)" },
  { label: "Marriage", path: "/blueprint-marriage", icon: Heart, description: "Biblical dating & marriage", iconColor: "hsl(340 65% 55%)", iconBg: "hsl(340 65% 55% / 0.15)" },
  { label: "Grief Support", path: "/blueprint-grief", icon: HeartHandshake, description: "Walk through grief with hope", iconColor: "hsl(210 40% 55%)", iconBg: "hsl(210 40% 55% / 0.15)" },
  { label: "Strongholds", path: "/blueprint-stronghold", icon: Shield, description: "Breaking spiritual strongholds", iconColor: "hsl(15 70% 55%)", iconBg: "hsl(15 70% 55% / 0.15)" },
  { label: "Weight & Health", path: "/blueprint-weight-loss", icon: Dumbbell, description: "Faith-based wellness", iconColor: "hsl(160 50% 50%)", iconBg: "hsl(160 50% 50% / 0.15)" },
  { label: "Mental Health", path: "/blueprint-mental-health", icon: Brain, description: "Biblical mental wellness", iconColor: "hsl(270 45% 60%)", iconBg: "hsl(270 45% 60% / 0.15)" },
];

export default function BasicChapelTab() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
            style={{ background: "hsl(170 25% 12%)" }}>
            <Church className="h-7 w-7" style={{ color: "hsl(142 55% 50%)" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "hsl(170 10% 93%)" }}>
            Phototheology Chapel
          </h2>
          <p className="text-sm" style={{ color: "hsl(170 15% 48%)" }}>
            Devotionals, watches, reading plans, community, and life resources — all in one place.
          </p>
        </div>

        {/* Items Grid */}
        <div className="space-y-2">
          {CHAPEL_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:brightness-110"
                style={{
                  background: "hsl(170 22% 9%)",
                  borderColor: "hsl(170 20% 18%)",
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: item.iconBg }}>
                  <Icon className="h-5 w-5" style={{ color: item.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "hsl(170 10% 88%)" }}>
                    {item.label}
                  </div>
                  <div className="text-xs" style={{ color: "hsl(170 15% 48%)" }}>
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
