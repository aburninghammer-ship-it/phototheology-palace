/**
 * BasicChapelTab — Chapel resources for Level 1
 * Uses the same dark theme as Level 3 via Tailwind tokens
 */
import { useNavigate } from "react-router-dom";
import { DailyAudioDevotional } from "@/components/DailyAudioDevotional";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sunrise, Moon, BookOpenCheck, CalendarDays, Church, Heart,
  GraduationCap, Users, Baby, Gem, Shield, Globe, HeartHandshake,
  Sparkles, ArrowRight, Swords, Flame,
} from "lucide-react";

const CHAPEL_ITEMS = [
  { icon: Sunrise, label: "Morning Watch", path: "/morning-watches", description: "Start your day with guided devotionals", color: "text-amber-400" },
  { icon: Moon, label: "Night Watch", path: "/night-watches", description: "Evening reflection & prayer", color: "text-indigo-400" },
  { icon: CalendarDays, label: "Reading Plans", path: "/reading-plans", description: "Structured Bible reading programs", color: "text-sky-400" },
  { icon: Gem, label: "Daily Verse", path: "/daily-verse", description: "A gem from Scripture each day", color: "text-yellow-400" },
  { icon: Heart, label: "Devotionals", path: "/devotionals", description: "In-depth devotional content", color: "text-rose-400" },
  { icon: Swords, label: "Dojo", path: "/christian-art-of-war", description: "Strategic spiritual warfare training", color: "text-red-400" },
  { icon: Flame, label: "40 Days in the Tomb", path: "/forty-day-challenge", description: "An intense 40-day spiritual debate challenge", color: "text-orange-500" },
  { icon: Church, label: "My Church", path: "/join-church", description: "Connect with your church community", color: "text-blue-400" },
  { icon: Globe, label: "Prophecy Watch", path: "/prophecy-watch", description: "Current events in the light of prophecy", color: "text-purple-400" },
  { icon: Shield, label: "Living Manna", path: "/living-manna", description: "Spiritual preparation resources", color: "text-teal-400" },
  { icon: GraduationCap, label: "Blueprint: Marriage", path: "/blueprint-marriage", description: "Biblical principles for marriage", color: "text-pink-400" },
  { icon: Baby, label: "Blueprint: Parenting", path: "/blueprint-parenting", description: "Raising children God's way", color: "text-orange-400" },
  { icon: Users, label: "Singles Devotional", path: "/singles-devotional", description: "Devotionals for singles", color: "text-cyan-400" },
  { icon: HeartHandshake, label: "Blueprint: Friendship", path: "/blueprint-friendship", description: "Godly friendship principles", color: "text-lime-400" },
];

function DailyVersePreview() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const { data: verse } = useQuery({
    queryKey: ["chapel-daily-verse", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_verses")
        .select("verse_reference, verse_text")
        .eq("date", today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });

  if (!verse) return null;

  return (
    <button
      onClick={() => navigate("/daily-verse")}
      className="w-full text-left rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 p-4 transition-all hover:border-yellow-400/50 hover:shadow-[0_0_16px_2px_rgba(234,179,8,0.15)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-yellow-400">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Today's Verse
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {verse.verse_reference}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 italic">
            "{verse.verse_text}"
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-yellow-400 mt-1" />
      </div>
    </button>
  );
}

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

        {/* Daily Verse preview card — always visible */}
        <DailyVersePreview />

        {/* Daily Audio Devotional card */}
        <DailyAudioDevotional />

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
