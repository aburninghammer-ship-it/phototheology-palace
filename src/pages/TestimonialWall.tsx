import { useEffect, useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Quote, Plus, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type Category = "general" | "bible-study" | "palace" | "dojo" | "games" | "prayer" | "growth";

interface Testimonial {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  content: string;
  category: Category;
  created_at: string;
  isStatic?: boolean;
}

interface ReactionRow {
  testimonial_id: string;
  reaction: string;
  user_id: string;
}

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "bible-study", label: "Bible Study" },
  { value: "palace", label: "Palace" },
  { value: "dojo", label: "Dojo" },
  { value: "games", label: "Games" },
  { value: "prayer", label: "Prayer" },
  { value: "growth", label: "Growth" },
];

const REACTION_EMOJIS: { key: string; emoji: string; label: string }[] = [
  { key: "amen", emoji: "\uD83D\uDE4C", label: "Amen" },
  { key: "fire", emoji: "\uD83D\uDD25", label: "Fire" },
  { key: "heart", emoji: "\u2764\uFE0F", label: "Heart" },
  { key: "pray", emoji: "\uD83D\uDE4F", label: "Pray" },
];

// ── Static (seed) testimonials ───────────────────────────────────────────────
const STATIC_TESTIMONIALS: Testimonial[] = [
  { id: "static-1", user_id: "", display_name: "Jessica", avatar_url: null, content: "This is the type of joy and excitement I\u2019ve always yearned for when studying the Word. These workshops are so fire! You\u2019ll be blessed by the way the Spirit shows up in each training.", category: "general", created_at: "2024-01-01T00:00:00Z", isStatic: true },
  { id: "static-2", user_id: "", display_name: "Rick", avatar_url: null, content: "Phototheology is a new systematic way for me to approach the Word. It helps me organize my thoughts, gives me the confidence to study with just the Holy Spirit, the Word, and me. No need for pre-made lessons.", category: "bible-study", created_at: "2024-01-02T00:00:00Z", isStatic: true },
  { id: "static-3", user_id: "", display_name: "Mitchell", avatar_url: null, content: "While in class the Holy Spirit showed me the image of Christ even before Pastor Ivor explained it! I thank The Lord for Phototheology.", category: "general", created_at: "2024-01-03T00:00:00Z", isStatic: true },
  { id: "static-4", user_id: "", display_name: "Teddy", avatar_url: null, content: "Photo-Theology has been a game changer in my personal Bible studies and sermon preparations. It constantly reminds me that the scriptures are divinely inspired.", category: "bible-study", created_at: "2024-01-04T00:00:00Z", isStatic: true },
  { id: "static-5", user_id: "", display_name: "Theo", avatar_url: null, content: "The system of Phototheology is literally mind blowing! It has helped me see and understand Jesus more clearly, specifically in terms of His character and His role in prophecy.", category: "general", created_at: "2024-01-05T00:00:00Z", isStatic: true },
  { id: "static-6", user_id: "", display_name: "Toccara", avatar_url: null, content: "I\u2019m in love with the Photo-Theology method\u2014it\u2019s the blueprint to life.", category: "general", created_at: "2024-01-06T00:00:00Z", isStatic: true },
  { id: "static-7", user_id: "", display_name: "Ziyanda", avatar_url: null, content: "This was transforming\u2014life changing. You can\u2019t help but fall in love with God all over again.", category: "growth", created_at: "2024-01-07T00:00:00Z", isStatic: true },
  { id: "static-8", user_id: "", display_name: "Alan", avatar_url: null, content: "There\u2019s so much depth in Phototheology that I find myself going back to the beginning just to take it in slowly.", category: "general", created_at: "2024-01-08T00:00:00Z", isStatic: true },
  { id: "static-9", user_id: "", display_name: "Akila", avatar_url: null, content: "This connected the whole Bible for me. It\u2019s all connected.", category: "bible-study", created_at: "2024-01-09T00:00:00Z", isStatic: true },
];

// ── Helper ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function categoryColor(cat: Category): string {
  const map: Record<Category, string> = {
    general: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "bible-study": "bg-amber-500/10 text-amber-400 border-amber-500/30",
    palace: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    dojo: "bg-red-500/10 text-red-400 border-red-500/30",
    games: "bg-green-500/10 text-green-400 border-green-500/30",
    prayer: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    growth: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  };
  return map[cat] ?? "";
}

// ── Component ────────────────────────────────────────────────────────────────
const TestimonialWall = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([]);
  const [reactions, setReactions] = useState<ReactionRow[]>([]);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Form state
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("general");

  // ── Fetch testimonials + reactions ─────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [tRes, rRes] = await Promise.all([
        (supabase as any).from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false }),
        (supabase as any).from("testimonial_reactions").select("testimonial_id, reaction, user_id"),
      ]);
      if (tRes.data) setDbTestimonials(tRes.data as Testimonial[]);
      if (rRes.data) setReactions(rRes.data as ReactionRow[]);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Realtime subscription ──────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("testimonials-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, () => {
        fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // ── Merged + filtered list ─────────────────────────────────────────────────
  const allTestimonials = [...dbTestimonials, ...STATIC_TESTIMONIALS];
  const filtered = filter === "all" ? allTestimonials : allTestimonials.filter((t) => t.category === filter);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) return;
    if (!newContent.trim() || newContent.trim().length < 10) {
      toast({ title: "Please write at least 10 characters", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const profile = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      const { error } = await (supabase as any).from("testimonials").insert({
        user_id: user.id,
        display_name: profile.data?.display_name || user.email?.split("@")[0] || "Anonymous",
        avatar_url: profile.data?.avatar_url || null,
        content: newContent.trim(),
        category: newCategory,
      });
      if (error) throw error;
      toast({ title: "Testimony shared! Thank you!" });
      setNewContent("");
      setNewCategory("general");
      await fetchData();
    } catch (err: any) {
      toast({ title: "Failed to submit", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reactions ──────────────────────────────────────────────────────────────
  const toggleReaction = async (testimonialId: string, reactionKey: string) => {
    if (!user) return;
    const existing = reactions.find(
      (r) => r.testimonial_id === testimonialId && r.user_id === user.id && r.reaction === reactionKey,
    );
    if (existing) {
      await (supabase as any)
        .from("testimonial_reactions")
        .delete()
        .eq("testimonial_id", testimonialId)
        .eq("user_id", user.id)
        .eq("reaction", reactionKey);
    } else {
      await (supabase as any).from("testimonial_reactions").insert({
        testimonial_id: testimonialId,
        user_id: user.id,
        reaction: reactionKey,
      });
    }
    // Optimistic refresh
    const { data } = await (supabase as any).from("testimonial_reactions").select("testimonial_id, reaction, user_id");
    if (data) setReactions(data as ReactionRow[]);
  };

  const getReactionCount = (testimonialId: string, reactionKey: string) =>
    reactions.filter((r) => r.testimonial_id === testimonialId && r.reaction === reactionKey).length;

  const hasReacted = (testimonialId: string, reactionKey: string) =>
    !!user && reactions.some((r) => r.testimonial_id === testimonialId && r.user_id === user.id && r.reaction === reactionKey);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Testimonial Wall</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hear from the Phototheology community. Share how God has used this ministry in your life.
          </p>
        </div>

        {/* Actions row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {CATEGORIES.map((c) => (
              <Button
                key={c.value}
                variant={filter === c.value ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => setFilter(c.value)}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {/* Submit dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> Share Your Testimony
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Testimony</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <Textarea
                  placeholder="How has Phototheology impacted your life or walk with God?"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between">
                  <Select value={newCategory} onValueChange={(v) => setNewCategory(v as Category)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">{newContent.length}/1000</span>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button size="sm" onClick={handleSubmit} disabled={submitting || newContent.trim().length < 10}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid */}
        {loadingData ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No testimonials in this category yet. Be the first!</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((t) => (
              <Card key={t.id} className="break-inside-avoid border-border/50">
                <CardContent className="p-4 space-y-3">
                  {/* Author row */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={t.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{t.display_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{t.display_name}</p>
                      <p className="text-[10px] text-muted-foreground">{timeAgo(t.created_at)}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${categoryColor(t.category)}`}>
                      {t.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <Quote className="h-4 w-4 text-primary/30 absolute -top-1 -left-1" />
                    <p className="text-sm italic pl-4">&ldquo;{t.content}&rdquo;</p>
                  </div>

                  {/* Reactions (only for DB testimonials) */}
                  {!t.isStatic && (
                    <div className="flex gap-1.5 pt-1">
                      {REACTION_EMOJIS.map((r) => {
                        const count = getReactionCount(t.id, r.key);
                        const active = hasReacted(t.id, r.key);
                        return (
                          <button
                            key={r.key}
                            onClick={() => toggleReaction(t.id, r.key)}
                            className={`
                              flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition-all
                              ${active
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/20"
                              }
                            `}
                          >
                            <span>{r.emoji}</span>
                            {count > 0 && <span>{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialWall;
