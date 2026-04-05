import { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { BIBLE_101_COURSE, BIBLE_101_WEEKS, type Bible101Day } from "@/data/bible101CourseData";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ImageIcon, BookOpen, CheckCircle2, ChevronLeft, Sparkles, Lock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Bible101 = () => {
  const { showPTLabels } = useExperienceMode();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<Bible101Day | null>(null);

  // Track completed days
  const { data: completedDays = [] } = useQuery({
    queryKey: ["bible101-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("user_course_progress")
        .select("module_id")
        .eq("user_id", user.id)
        .eq("course_id", "bible-101");
      return (data || []).map(d => parseInt(d.module_id));
    },
    enabled: !!user,
  });

  const markComplete = useMutation({
    mutationFn: async (day: number) => {
      if (!user) return;
      await supabase.from("user_course_progress").upsert({
        user_id: user.id,
        course_id: "bible-101",
        module_id: String(day),
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,course_id,module_id" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bible101-progress"] }),
  });

  const progress = (completedDays.length / 30) * 100;

  if (selectedDay) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <SEO title={`Day ${selectedDay.day}: ${selectedDay.title} — Bible 101`} />
        <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Overview
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Day header */}
          <div>
            <Badge variant="outline" className="mb-2">Day {selectedDay.day} of 30</Badge>
            <h1 className="text-3xl font-bold">{selectedDay.title}</h1>
            <p className="text-muted-foreground">{selectedDay.subtitle}</p>
            {showPTLabels && (
              <Badge className="mt-2 text-xs" variant="secondary">
                <MapPin className="w-3 h-3 mr-1" />
                Floor {selectedDay.floor} · {selectedDay.roomLabel}
              </Badge>
            )}
          </div>

          {/* VISUAL FIRST — the key differentiator */}
          <Card className="p-5 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-primary mb-1">👁️ See It First</p>
                <p className="text-sm leading-relaxed italic">{selectedDay.visualPrompt}</p>
              </div>
            </div>
          </Card>

          {/* Christ-Lens Question */}
          <Card className="p-5 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Eye className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-amber-500 mb-1">🔍 Christ-Lens</p>
                <p className="text-sm leading-relaxed font-medium">{selectedDay.christQuestion}</p>
              </div>
            </div>
          </Card>

          {/* Passage */}
          <div className="text-center py-3">
            <Badge variant="outline" className="text-base px-4 py-1.5">
              <BookOpen className="w-4 h-4 mr-2" />
              {selectedDay.passage}
            </Badge>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/90 leading-relaxed text-[15px]">{selectedDay.content}</p>
          </div>

          {/* Takeaway */}
          <Card className="p-4 bg-emerald-500/5 border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-400 mb-1">✨ Today's Takeaway</p>
            <p className="text-sm">{selectedDay.takeaway}</p>
          </Card>

          {/* Action Step */}
          <Card className="p-4 bg-card/80">
            <p className="text-sm font-semibold text-foreground mb-1">📝 Your Action Step</p>
            <p className="text-sm text-muted-foreground">{selectedDay.actionStep}</p>
          </Card>

          {/* Complete Button */}
          <Button
            onClick={() => markComplete.mutate(selectedDay.day)}
            disabled={completedDays.includes(selectedDay.day)}
            className="w-full gap-2"
            size="lg"
          >
            {completedDays.includes(selectedDay.day) ? (
              <><CheckCircle2 className="w-5 h-5" /> Completed</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Mark Day Complete</>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <SEO title="Bible 101 — Your 30-Day Visual Journey" description="Learn Bible basics the Phototheology way: visual-first, Christ-centered, unforgettable." />

      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
          <span style={{ color: "#d4a017" }}>Bible 101</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          30 days to see the Bible like never before
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Every day starts with an image. Every lesson asks one question: <span className="text-amber-400 font-semibold">"Where is Jesus here?"</span>
        </p>
      </motion.div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Your Progress</span>
          <span className="text-sm text-muted-foreground">{completedDays.length}/30 days</span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Weeks */}
      <div className="space-y-6">
        {BIBLE_101_WEEKS.map((week) => (
          <div key={week.week} className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Week {week.week}: {week.title}</h2>
              <span className="text-xs text-muted-foreground">— {week.theme}</span>
            </div>
            <div className="grid gap-2">
              {week.days.map((dayNum) => {
                const day = BIBLE_101_COURSE.find(d => d.day === dayNum)!;
                const isCompleted = completedDays.includes(dayNum);
                return (
                  <motion.div key={dayNum} whileTap={{ scale: 0.98 }}>
                    <Card
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "p-3 cursor-pointer transition-all hover:border-primary/30 flex items-center gap-3",
                        isCompleted && "border-emerald-500/30 bg-emerald-500/5"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : dayNum}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{day.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{day.subtitle}</p>
                      </div>
                      {showPTLabels && (
                        <Badge variant="outline" className="text-[10px] shrink-0 hidden sm:flex">
                          F{day.floor} · {day.roomCode}
                        </Badge>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bible101;
