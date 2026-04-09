import { useState, useCallback, useMemo } from "react";
import { GraduationCap, Lock, Play, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProfessorAvatar } from "@/components/master-class/ProfessorAvatar";
import { MasterClassPlayer } from "@/components/master-class/MasterClassPlayer";
import { MASTER_CLASSES } from "@/data/masterClassData";
import { useMasterClassProgress } from "@/hooks/useMasterClassProgress";
import type { MasterClassDef } from "@/data/masterClassData";

// Group classes by floor for display
function groupByFloor(classes: MasterClassDef[]) {
  const groups: { label: string; classes: MasterClassDef[] }[] = [];
  const introGroup = { label: "Introduction", classes: [] as MasterClassDef[] };
  const floorMap = new Map<number, MasterClassDef[]>();

  for (const cls of classes) {
    if (!cls.floorNumber) {
      introGroup.classes.push(cls);
    } else {
      if (!floorMap.has(cls.floorNumber)) floorMap.set(cls.floorNumber, []);
      floorMap.get(cls.floorNumber)!.push(cls);
    }
  }

  if (introGroup.classes.length > 0) groups.push(introGroup);

  const floorNames: Record<number, string> = {
    1: "Floor 1: Furnishing",
    2: "Floor 2: Investigation",
    3: "Floor 3: Freestyle",
    4: "Floor 4: Next Level",
    5: "Floor 5: Vision",
    6: "Floor 6: Three Heavens & Cycles",
    7: "Floor 7: Transformation",
    8: "Floor 8: Master",
  };

  for (const [floor, cls] of [...floorMap.entries()].sort((a, b) => a[0] - b[0])) {
    groups.push({ label: floorNames[floor] || `Floor ${floor}`, classes: cls });
  }

  return groups;
}

export default function MasterClass() {
  const [activeClass, setActiveClass] = useState<MasterClassDef | null>(null);
  const progress = useMasterClassProgress();

  const groups = useMemo(() => groupByFloor(MASTER_CLASSES), []);

  const handleComplete = useCallback(
    (classId: string) => {
      progress.markComplete(classId);
    },
    [progress]
  );

  const progressPercent = (progress.totalCompleted / progress.totalClasses) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Podcast-Style Audio Training
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Phototheology Master Class
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            39 professors. One system. The complete training.
            <br />
            <span className="text-sm">
              Progress through each class sequentially — up to 3 per day.
            </span>
          </p>

          {/* Progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{progress.totalCompleted} of {progress.totalClasses} classes completed</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Daily limit indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {progress.canStartNew
                ? `${progress.remainingToday} class${progress.remainingToday !== 1 ? "es" : ""} remaining today`
                : "Daily limit reached — come back tomorrow refreshed!"}
            </span>
          </div>

          {/* Next class CTA */}
          {progress.nextClass && progress.canStartNew && (
            <Button
              className="mt-4 bg-amber-600 hover:bg-amber-500 text-white"
              onClick={() => setActiveClass(progress.nextClass!)}
            >
              <Play className="h-4 w-4 mr-2" />
              Continue: Class {progress.nextClass.classNumber} — {progress.nextClass.title}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </section>

      {/* Active player */}
      {activeClass && (
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <MasterClassPlayer
            key={activeClass.id}
            classDef={activeClass}
            isCompleted={progress.isCompleted(activeClass.id)}
            onComplete={handleComplete}
            onClose={() => setActiveClass(null)}
          />
        </div>
      )}

      {/* Class grid grouped by floor */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        {groups.map((group) => (
          <div key={group.label} className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>{group.label}</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({group.classes.filter((c) => progress.isCompleted(c.id)).length}/{group.classes.length})
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.classes.map((cls) => {
                const completed = progress.isCompleted(cls.id);
                const unlocked = progress.isUnlocked(cls.id);
                const isActive = activeClass?.id === cls.id;
                const canPlay = unlocked && (completed || progress.canStartNew);

                return (
                  <div
                    key={cls.id}
                    className={`
                      relative rounded-xl border p-4 transition-all
                      ${isActive
                        ? "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20"
                        : completed
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : unlocked && canPlay
                        ? "border-border hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer"
                        : "border-border/50 opacity-50"
                      }
                    `}
                    onClick={() => {
                      if (canPlay) setActiveClass(cls);
                    }}
                  >
                    {/* Completed badge */}
                    {completed && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                    )}

                    {/* Professor info */}
                    <div className="flex items-center gap-3 mb-3">
                      <ProfessorAvatar name={cls.professor.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{cls.professor.name}</p>
                        <p className="text-xs text-muted-foreground">{cls.professor.title}</p>
                      </div>
                    </div>

                    {/* Class details */}
                    <h3 className="font-bold text-foreground mb-1">{cls.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{cls.subtitle}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        Class {cls.classNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{cls.duration}</span>
                    </div>

                    {/* Action */}
                    <div className="mt-3">
                      {completed ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveClass(cls);
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Replay
                        </Button>
                      ) : unlocked && canPlay ? (
                        <Button
                          size="sm"
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveClass(cls);
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {isActive ? "Now Playing" : "Listen"}
                        </Button>
                      ) : unlocked && !progress.canStartNew ? (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          Available Tomorrow
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-1" />
                          Complete Class {cls.classNumber - 1} First
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
