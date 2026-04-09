import { useState } from "react";
import { GraduationCap, Lock, Play } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfessorAvatar } from "@/components/master-class/ProfessorAvatar";
import { MasterClassPlayer } from "@/components/master-class/MasterClassPlayer";
import { MASTER_CLASSES } from "@/data/masterClassData";
import type { MasterClassDef } from "@/data/masterClassData";

export default function MasterClass() {
  const [activeClass, setActiveClass] = useState<MasterClassDef | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Podcast-Style Audio Training
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Phototheology Master Class
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            38 professors. One system. The complete training.
            <br />
            <span className="text-sm">
              Listen, learn, and master every room in the Palace.
            </span>
          </p>
        </div>
      </section>

      {/* Active player */}
      {activeClass && (
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <MasterClassPlayer
            classDef={activeClass}
            onClose={() => setActiveClass(null)}
          />
        </div>
      )}

      {/* Class grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6">All Classes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MASTER_CLASSES.map((cls) => {
            const isAvailable = cls.status === "available";
            const isActive = activeClass?.id === cls.id;

            return (
              <div
                key={cls.id}
                className={`
                  relative rounded-xl border p-4 transition-all
                  ${isActive
                    ? "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20"
                    : isAvailable
                    ? "border-border hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer"
                    : "border-border/50 opacity-60"
                  }
                `}
                onClick={() => {
                  if (isAvailable) setActiveClass(cls);
                }}
              >
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
                  {cls.floorNumber && (
                    <Badge variant="secondary" className="text-xs">
                      Floor {cls.floorNumber}
                    </Badge>
                  )}
                </div>

                {/* Action */}
                <div className="mt-3">
                  {isAvailable ? (
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
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      <Lock className="h-4 w-4 mr-1" />
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
