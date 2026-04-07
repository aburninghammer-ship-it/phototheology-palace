import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Gem, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface SavedItem {
  id: string;
  type: "bookmark" | "gem" | "study";
  title: string;
  subtitle: string;
  createdAt: string;
}

export function SavedItemsTab() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "bookmark" | "gem" | "study">("all");

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);

      const [bookmarksRes, gemsRes, studiesRes] = await Promise.all([
        supabase
          .from("bookmarks")
          .select("id, book, chapter, verse, note, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("user_gems")
          .select("id, gem_name, gem_content, floor_number, room_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("user_studies")
          .select("id, title, content, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      const merged: SavedItem[] = [];

      (bookmarksRes.data ?? []).forEach((b) =>
        merged.push({
          id: b.id,
          type: "bookmark",
          title: `${b.book} ${b.chapter}${b.verse ? `:${b.verse}` : ""}`,
          subtitle: b.note || "Bookmarked verse",
          createdAt: b.created_at,
        })
      );

      (gemsRes.data ?? []).forEach((g) =>
        merged.push({
          id: g.id,
          type: "gem",
          title: g.gem_name || "Untitled Gem",
          subtitle: g.gem_content?.slice(0, 80) || `Floor ${g.floor_number} · ${g.room_id ?? ""}`,
          createdAt: g.created_at,
        })
      );

      (studiesRes.data ?? []).forEach((s) =>
        merged.push({
          id: s.id,
          type: "study",
          title: s.title || "Untitled Study",
          subtitle: s.content?.slice(0, 80) || "Saved study",
          createdAt: s.created_at,
        })
      );

      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(merged);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  const ICON_MAP = {
    bookmark: Bookmark,
    gem: Gem,
    study: BookOpen,
  };

  const COLOR_MAP = {
    bookmark: "hsl(200 70% 55%)",
    gem: "hsl(40 80% 55%)",
    study: "hsl(160 55% 50%)",
  };

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "bookmark", label: "Bookmarks" },
    { key: "gem", label: "Gems" },
    { key: "study", label: "Studies" },
  ];

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4">
      <div className="text-center mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "hsl(220 10% 85%)" }}
        >
          Your Saved Collection
        </h2>
        <p className="text-xs mt-1" style={{ color: "hsl(220 10% 50%)" }}>
          Bookmarks, gems, and studies you've gathered on your journey.
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex justify-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
            style={{
              background: filter === f.key ? "hsl(220 10% 90% / 0.1)" : "transparent",
              borderColor: filter === f.key ? "hsl(220 10% 50%)" : "hsl(220 10% 18%)",
              color: filter === f.key ? "hsl(220 10% 85%)" : "hsl(220 10% 45%)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: "hsl(220 10% 40%)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-10 text-sm" style={{ color: "hsl(220 10% 40%)" }}>
          {filter === "all"
            ? "Nothing saved yet. Start exploring Scripture to build your collection."
            : `No ${filter}s saved yet.`}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => {
            const Icon = ICON_MAP[item.type];
            const color = COLOR_MAP[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-xl border transition-colors"
                style={{
                  background: "hsl(220 15% 8%)",
                  borderColor: "hsl(220 10% 16%)",
                }}
              >
                <div
                  className="p-1.5 rounded-lg shrink-0 mt-0.5"
                  style={{ background: color + "18" }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "hsl(220 10% 85%)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: "hsl(220 10% 50%)" }}
                  >
                    {item.subtitle}
                  </p>
                </div>
                <span
                  className="text-[10px] shrink-0 mt-1"
                  style={{ color: "hsl(220 10% 40%)" }}
                >
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
