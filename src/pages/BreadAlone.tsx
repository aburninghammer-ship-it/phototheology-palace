import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wheat, Clock, Flame, BookOpen, Gem, Sparkles, Play, Check, ChevronRight, Users, Church, Plus, ListPlus } from "lucide-react";
import { AddToPlaylistButton } from "@/components/audio/AddToPlaylistButton";
import { toast } from "sonner";

/* ─── Duration tiers ─── */
const DURATION_TIERS = [
  { id: "8h",  label: "The Watch",        hours: 8,    meals: 3,  description: "A focused 8-hour burst" },
  { id: "16h", label: "The Vigil",         hours: 16,   meals: 5,  description: "Sunrise to midnight" },
  { id: "24h", label: "The Day of Bread",  hours: 24,   meals: 8,  description: "3 full meals + snacks" },
  { id: "36h", label: "The Wilderness",    hours: 36,   meals: 12, description: "Extended with overnight meditation" },
  { id: "3d",  label: "The Tomb",          hours: 72,   meals: 24, description: "Death-to-resurrection arc" },
  { id: "7d",  label: "The Creation Fast", hours: 168,  meals: 56, description: "One room per day, complete journey" },
] as const;

/* ─── Meal types ─── */
const MEAL_TYPES = [
  { id: "gem_hunt",        label: "Gem Hunt",        icon: Gem,       room: "GR",  floor: 1, description: "Find hidden connections between verses" },
  { id: "deep_dive",       label: "Deep Dive",       icon: BookOpen,  room: "DR",  floor: 4, description: "Apply the 5 Dimensions to one passage" },
  { id: "prophecy_thread", label: "Prophecy Thread",  icon: Sparkles,  room: "PR",  floor: 5, description: "Map symbols to Sanctuary/Gospel frameworks" },
  { id: "theme_wall",      label: "Theme Wall",      icon: Flame,     room: "TRm", floor: 4, description: "Trace one theme across Scripture" },
  { id: "fire_bread",      label: "Fire Bread",      icon: Flame,     room: "FRm", floor: 7, description: "Slow meditation in the Fire Room" },
  { id: "freestyle",       label: "Freestyle Loaf",  icon: Wheat,     room: "BF",  floor: 3, description: "Free-form study, follow the Spirit" },
];

const CURATED_THEMES = [
  "The Blood (Exodus 12 → Hebrews 9)",
  "The Lamb (Genesis 22 → Revelation 5)",
  "The Vine (John 15 + OT vineyards)",
  "The Door (John 10 + Tabernacle entrance)",
  "Living Water (John 4 → Revelation 22)",
  "The Bread of Life (John 6 + Manna)",
];

const INTERVALS = [
  { value: 1, label: "Every hour" },
  { value: 2, label: "Every 2 hours" },
  { value: 3, label: "Every 3 hours" },
];

/* ─── Types ─── */
type FastStatus = "active" | "completed" | "abandoned";

interface FastRow {
  id: string;
  user_id: string;
  duration_tier: string;
  duration_label: string;
  passage_or_theme: string;
  assignment_mode: string;
  meal_interval_hours: number;
  started_at: string;
  ends_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  status: FastStatus;
  meals_consumed: number;
  gems_collected: number;
  breaking_bread_summary: string | null;
  buddy_code: string | null;
  church_fast_id: string | null;
  created_at: string;
  updated_at: string;
}

interface MealRow {
  id: string;
  fast_id: string;
  user_id: string;
  meal_number: number;
  meal_type: string;
  meal_label: string;
  palace_room_code: string | null;
  palace_floor: number | null;
  passage: string | null;
  journal_entry: string | null;
  gems_found: string[] | null;
  questions_raised: string[] | null;
  suggested_by: string;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

/* ─── Component ─── */
export default function BreadAlone() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active fast
  const { data: activeFast, isLoading } = useQuery({
    queryKey: ["bread-alone-active", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("bread_alone_fasts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as FastRow | null;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Wheat className="h-8 w-8 animate-pulse text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Wheat className="h-5 w-5 text-amber-400" />
        <h1 className="text-lg font-bold text-foreground">Bread Alone Fast</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 pb-24">
        {activeFast ? (
          <ActiveFastDashboard fast={activeFast} />
        ) : (
          <StartFastScreen />
        )}
      </div>
    </div>
  );
}

/* ─── START FAST SCREEN ─── */
function StartFastScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [passage, setPassage] = useState("");
  const [interval, setInterval] = useState(3);
  const [step, setStep] = useState<"tier" | "details">("tier");

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedTier || !passage.trim()) throw new Error("Missing fields");
      const tier = DURATION_TIERS.find(t => t.id === selectedTier)!;
      const endsAt = new Date(Date.now() + tier.hours * 60 * 60 * 1000).toISOString();
      const buddyCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error } = await supabase.from("bread_alone_fasts").insert({
        user_id: user.id,
        duration_tier: tier.id,
        duration_label: tier.label,
        passage_or_theme: passage.trim(),
        meal_interval_hours: interval,
        ends_at: endsAt,
        buddy_code: buddyCode,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bread-alone-active"] });
      toast.success("Your fast has begun. May the Word sustain you.");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (step === "tier") {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Wheat className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">"Man shall not live by bread alone..."</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Replace physical food with spiritual meals. Choose a passage or theme and excavate it through escalating Palace rooms.
          </p>
        </div>

        {/* Duration selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Choose Your Fast</h3>
          <div className="grid gap-2">
            {DURATION_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedTier === tier.id
                    ? "border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    : "border-border bg-card hover:border-amber-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{tier.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({tier.id})</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                    ~{tier.meals} meals
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedTier && (
          <Button onClick={() => setStep("details")} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => setStep("tier")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h3 className="text-lg font-bold text-foreground">What will you feast on?</h3>

      {/* Curated themes */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Curated Fast Menus</p>
        <div className="flex flex-wrap gap-2">
          {CURATED_THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => setPassage(theme)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                passage === theme ? "border-amber-400 bg-amber-500/10 text-amber-300" : "border-border text-muted-foreground hover:border-amber-500/30"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Custom input */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Or enter a passage, chapter, or theme</p>
        <Input
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          placeholder="e.g. John 15, The Sanctuary, Romans 8..."
          className="bg-card border-border"
        />
      </div>

      {/* Interval */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Meal interval</p>
        <div className="flex gap-2">
          {INTERVALS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value)}
              className={`flex-1 text-xs py-2 rounded-lg border transition-all ${
                interval === opt.value ? "border-amber-400 bg-amber-500/10 text-amber-300" : "border-border text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => startMutation.mutate()}
        disabled={!passage.trim() || startMutation.isPending}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      >
        {startMutation.isPending ? "Starting..." : "Begin Fast"}
      </Button>
    </div>
  );
}

/* ─── ACTIVE FAST DASHBOARD ─── */
function ActiveFastDashboard({ fast }: { fast: FastRow }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showMealForm, setShowMealForm] = useState(false);

  const endsAt = new Date(fast.ends_at).getTime();
  const startedAt = new Date(fast.started_at).getTime();
  const total = endsAt - startedAt;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.max(0, now - startedAt);
  const remaining = Math.max(0, endsAt - now);
  const progress = Math.min(100, (elapsed / total) * 100);
  const hoursLeft = Math.floor(remaining / 3_600_000);
  const minsLeft = Math.floor((remaining % 3_600_000) / 60_000);

  // Fetch meals
  const { data: meals = [] } = useQuery({
    queryKey: ["bread-alone-meals", fast.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bread_alone_meals")
        .select("*")
        .eq("fast_id", fast.id)
        .order("meal_number", { ascending: true });
      if (error) throw error;
      return data as MealRow[];
    },
  });

  // Complete fast
  const completeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bread_alone_fasts").update({
        status: "completed" as FastStatus,
        completed_at: new Date().toISOString(),
      }).eq("id", fast.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bread-alone-active"] });
      toast.success("Fast completed! Breaking bread ceremony ready.");
    },
  });

  // Abandon fast
  const abandonMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bread_alone_fasts").update({
        status: "abandoned" as FastStatus,
        abandoned_at: new Date().toISOString(),
      }).eq("id", fast.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bread-alone-active"] });
      toast("Fast ended early. Grace abounds.");
    },
  });

  // Check if fast should auto-complete
  useEffect(() => {
    if (remaining <= 0 && fast.status === "active") {
      completeMutation.mutate();
    }
  }, [remaining]);

  return (
    <div className="space-y-6">
      {/* Timer card */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide">{fast.duration_label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{fast.passage_or_theme}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {hoursLeft}h {minsLeft}m
              </p>
              <p className="text-xs text-muted-foreground">remaining</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Wheat className="h-3 w-3 text-amber-400" /> {fast.meals_consumed} meals consumed</span>
            <span className="flex items-center gap-1"><Gem className="h-3 w-3 text-yellow-400" /> {fast.gems_collected} gems</span>
          </div>
        </CardContent>
      </Card>

      {/* Buddy code */}
      {fast.buddy_code && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Buddy code:</span>
          <code className="text-xs font-mono text-amber-400">{fast.buddy_code}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(fast.buddy_code!); toast.success("Code copied!"); }}
            className="ml-auto text-xs text-primary hover:underline"
          >
            Copy
          </button>
        </div>
      )}

      {/* New meal button */}
      {!showMealForm ? (
        <Button onClick={() => setShowMealForm(true)} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Eat a Meal
        </Button>
      ) : (
        <MealForm
          fastId={fast.id}
          mealNumber={(meals?.length ?? 0) + 1}
          passageOrTheme={fast.passage_or_theme}
          onDone={() => {
            setShowMealForm(false);
            queryClient.invalidateQueries({ queryKey: ["bread-alone-meals", fast.id] });
            queryClient.invalidateQueries({ queryKey: ["bread-alone-active"] });
          }}
        />
      )}

      {/* Meals timeline */}
      {meals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Meal Timeline</h3>
          {meals.map((meal) => {
            const mealMeta = MEAL_TYPES.find(m => m.id === meal.meal_type);
            const Icon = mealMeta?.icon ?? Wheat;
            return (
              <div key={meal.id} className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">Meal {meal.meal_number}</span>
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">{meal.meal_label}</Badge>
                    {meal.palace_room_code && (
                      <Badge variant="outline" className="text-[10px] border-muted-foreground/30">{meal.palace_room_code}</Badge>
                    )}
                  </div>
                  {meal.journal_entry && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{meal.journal_entry}</p>
                  )}
                  {meal.gems_found && meal.gems_found.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {meal.gems_found.map((gem, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          💎 {gem}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* End fast actions */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => abandonMutation.mutate()}
          className="text-xs text-muted-foreground"
        >
          End Early
        </Button>
        {remaining <= 0 && (
          <Button
            size="sm"
            onClick={() => completeMutation.mutate()}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
          >
            <Check className="h-3 w-3 mr-1" /> Complete & Break Bread
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─── MEAL FORM ─── */
function MealForm({ fastId, mealNumber, passageOrTheme, onDone }: { fastId: string; mealNumber: number; passageOrTheme: string; onDone: () => void }) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  const [gems, setGems] = useState("");
  const [passage, setPassage] = useState("");
  const [jeevesInstruction, setJeevesInstruction] = useState<string | null>(null);
  const [loadingInstruction, setLoadingInstruction] = useState(false);

  // Suggest a meal type based on meal number (hybrid mode)
  const suggestedIndex = (mealNumber - 1) % MEAL_TYPES.length;
  const suggested = MEAL_TYPES[suggestedIndex];

  // Fetch Jeeves instruction when meal type is selected
  const fetchInstruction = async (mealType: string) => {
    setSelectedType(mealType);
    setJeevesInstruction(null);
    setLoadingInstruction(true);
    try {
      const { data, error } = await supabase.functions.invoke("bread-alone-instructions", {
        body: { passage_or_theme: passageOrTheme, meal_type: mealType },
      });
      if (error) throw error;
      setJeevesInstruction(data?.instruction || null);
    } catch (e) {
      console.error("Failed to fetch instruction:", e);
      setJeevesInstruction(null);
    } finally {
      setLoadingInstruction(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedType) throw new Error("Select a meal type");
      const meta = MEAL_TYPES.find(m => m.id === selectedType)!;
      const gemsArr = gems.split("\n").map(g => g.trim()).filter(Boolean);

      const { error } = await supabase.from("bread_alone_meals").insert({
        fast_id: fastId,
        user_id: user.id,
        meal_number: mealNumber,
        meal_type: selectedType,
        meal_label: meta.label,
        palace_room_code: meta.room,
        palace_floor: meta.floor,
        passage: passage.trim() || null,
        journal_entry: journal.trim() || null,
        gems_found: gemsArr.length > 0 ? gemsArr : null,
        suggested_by: selectedType === suggested.id ? "system" : "user",
      });
      if (error) throw error;

      // Update fast counters
      await supabase.from("bread_alone_fasts").update({
        meals_consumed: mealNumber,
        gems_collected: gemsArr.length,
      }).eq("id", fastId);
    },
    onSuccess: () => {
      toast.success(`Meal ${mealNumber} logged. Keep feasting on the Word.`);
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Card className="border-amber-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wheat className="h-4 w-4 text-amber-400" />
          Meal {mealNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested */}
        <div className="text-xs text-muted-foreground">
          Suggested: <span className="text-amber-400 font-medium">{suggested.label}</span> — {suggested.description}
        </div>

        {/* Type selection */}
        <div className="grid grid-cols-2 gap-2">
          {MEAL_TYPES.map((mt) => {
            const Icon = mt.icon;
            return (
              <button
                key={mt.id}
                onClick={() => fetchInstruction(mt.id)}
                className={`text-left p-3 rounded-lg border text-xs transition-all ${
                  selectedType === mt.id
                    ? "border-amber-400 bg-amber-500/10"
                    : mt.id === suggested.id
                    ? "border-amber-500/20 bg-amber-500/5"
                    : "border-border bg-card hover:border-amber-500/20"
                }`}
              >
                <Icon className="h-4 w-4 text-amber-400 mb-1" />
                <p className="font-semibold text-foreground">{mt.label}</p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">{mt.description}</p>
              </button>
            );
          })}
        </div>

        {/* Jeeves instruction */}
        {selectedType && (
          <>
            {loadingInstruction ? (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 animate-pulse">
                <p className="text-xs text-amber-400 italic">Jeeves is preparing your assignment...</p>
              </div>
            ) : jeevesInstruction ? (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wide mb-1">Jeeves' Assignment</p>
                    <p className="text-xs text-foreground leading-relaxed">{jeevesInstruction}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <Input
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="Passage studied (optional)"
              className="bg-card text-sm"
            />
            <Textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="What did you discover? Journal your meal..."
              className="bg-card text-sm min-h-[80px]"
            />
            <Textarea
              value={gems}
              onChange={(e) => setGems(e.target.value)}
              placeholder="Gems found (one per line)"
              className="bg-card text-sm min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onDone} className="text-xs">Cancel</Button>
              <Button
                size="sm"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex-1"
              >
                {saveMutation.isPending ? "Saving..." : "Log Meal"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}