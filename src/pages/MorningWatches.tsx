import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Play, ChevronDown, Lock } from "lucide-react";
import morningWatchImage from "@/assets/morning-watch-sunrise.jpg";
import { WatchQuickShare } from "@/components/audio/WatchQuickShare";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { useWatchPlayer } from "@/hooks/useWatchPlayer";
import { useWatchProgress } from "@/hooks/useWatchProgress";
import {
  WATCH_TRACTS,
  ENERGY_COLORS,
  getTractsByType,
  type WatchTract,
  type MorningWatchSession,
} from "@/data/watchSeries";

type TractTab = "free" | "40-day" | "365-day";

export default function MorningWatches() {
  const { startTract, markDayComplete, isDayUnlocked, getProgress } = useWatchProgress();
  const { startMorningWatch, isGenerating, immersive, handleClose } = useWatchPlayer({
    onComplete: (tractId, day) => markDayComplete(tractId, day),
  });
  const [activeTab, setActiveTab] = useState<TractTab>("free");
  const [expandedTract, setExpandedTract] = useState<string | null>(null);

  const freeTracts = WATCH_TRACTS.filter((t) => t.isFree);
  const fortyDayTracts = getTractsByType("40-day").filter((t) => !t.isFree);
  const yearTracts = getTractsByType("365-day");

  const handleBeginWatch = (session: MorningWatchSession, tract: WatchTract) => {
    startTract(tract.id);
    startMorningWatch(session, tract.name, tract.id);
  };

  const renderSessionCard = (session: MorningWatchSession, tract: WatchTract) => {
    const unlocked = isDayUnlocked(tract.id, session.dayNumber);
    const progress = getProgress(tract.id);
    const isCompleted = progress.completedDays.includes(session.dayNumber);
    const isCurrent = progress.currentDay === session.dayNumber && !isCompleted;

    return (
      <Card
        key={session.dayNumber}
        className={`transition-all duration-300 border-border/50 bg-card/80 ${
          unlocked
            ? isCurrent
              ? "cursor-pointer border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/30"
              : "cursor-pointer hover:border-amber-500/40 hover:bg-amber-500/5"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={() => unlocked && handleBeginWatch(session, tract)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-300"
                  : isCurrent
                    ? "bg-amber-500/30 text-amber-200"
                    : "bg-amber-500/20 text-amber-400"
              }`}>
                {isCompleted ? "✓" : session.dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.morningScripture}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unlocked && (
                <WatchQuickShare
                  title={session.title}
                  scripture={session.morningScripture}
                  watchType="morning"
                  dayNumber={session.dayNumber}
                  tractName={tract.name}
                />
              )}
              {!unlocked ? (
                <Lock className="w-4 h-4 text-muted-foreground/50" />
              ) : isGenerating ? (
                <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              ) : isCurrent ? (
                <span className="text-xs font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                  Begin Watch
                </span>
              ) : (
                <Play className="w-4 h-4 text-amber-400" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            <span className="text-amber-400/70">Paired:</span> {session.pairedNightTitle}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[10px] ${ENERGY_COLORS[session.energy] || ""}`}>
              {session.energy}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {session.commitmentStyle}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTractCard = (tract: WatchTract) => {
    const isExpanded = expandedTract === tract.id;
    const hasMornings = tract.mornings && tract.mornings.length > 0;
    const progress = getProgress(tract.id);

    return (
      <Card key={tract.id} className="border-border/50 bg-card/80 overflow-hidden">
        <CardContent className="p-0">
          <button
            className="w-full p-4 flex items-start gap-3 text-left hover:bg-amber-500/5 transition-colors"
            onClick={() => setExpandedTract(isExpanded ? null : tract.id)}
          >
            <span className="text-2xl">{tract.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">{tract.name}</h3>
                {tract.isFree && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    FREE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-amber-400">{tract.subtitle} — Morning Activations</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tract.description}</p>
              {hasMornings && progress.completedDays.length > 0 && (
                <p className="text-[10px] text-amber-400/70 mt-1">
                  Day {progress.currentDay} of {tract.mornings!.length} · {progress.completedDays.length} completed
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[10px]">
                {tract.totalSessions} days
              </Badge>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </div>
          </button>

          {isExpanded && hasMornings && (
            <div className="border-t border-border/30 p-4 space-y-2 max-h-96 overflow-y-auto">
              {tract.mornings!.map((s) => renderSessionCard(s, tract))}
            </div>
          )}

          {isExpanded && !hasMornings && tract.weekOverviews && (
            <div className="border-t border-border/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Morning activations generated on demand by the Master Mind AI, paired with each Night Watch.
              </p>
              {tract.weekOverviews.map((w) => (
                <div key={w.week} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                    {w.week}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{w.title}</p>
                    <p className="text-xs text-muted-foreground">{w.theme}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{w.scriptureRange}</p>
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          {isExpanded && !hasMornings && tract.seriesBlocks && (
            <div className="border-t border-border/30 p-4 space-y-2 max-h-96 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-3">
                {tract.seriesBlocks.length} series blocks · Morning activations generated on demand
              </p>
              {tract.seriesBlocks.map((b) => (
                <div key={b.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-amber-400 font-mono">
                      Day {b.dayRange[0]}-{b.dayRange[1]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.scriptureScope}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{b.sessions}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const tabs: { id: TractTab; label: string; count: number }[] = [
    { id: "free", label: "Free", count: freeTracts.length },
    { id: "40-day", label: "40-Day Tracts", count: fortyDayTracts.length },
    { id: "365-day", label: "365-Day Journeys", count: yearTracts.length },
  ];

  const currentTracts =
    activeTab === "free"
      ? freeTracts
      : activeTab === "40-day"
        ? fortyDayTracts
        : yearTracts;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img src={morningWatchImage} alt="Beautiful sunrise over calm waters" className="w-full h-48 md:h-64 object-cover" loading="lazy" width={1024} height={576} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sun className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>
                Morning Watches
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Walk in the Master Mind — 15-minute audio activation sessions that download last night's
              formation into today's mind. Think like Christ before the first challenge arrives.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Night Watch: Receive. Morning Watch: Walk.
            </p>
          </div>
        </div>

        {/* 4-Touch Daily Cycle */}
        <Card className="mb-6 bg-card/50 border-border/30">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              The 4-Touch Daily Cycle
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Evening Reflection", time: "Before bed", duration: "2 min", icon: "🌆" },
                { label: "Night Watch", time: "Bedtime", duration: "15 min", icon: "🌙" },
                { label: "Morning Watch", time: "Waking", duration: "15 min", icon: "🌅", active: true },
                { label: "Midday Reset", time: "Noon", duration: "2 min", icon: "☀️" },
              ].map((touch) => (
                <div
                  key={touch.label}
                  className={`text-center p-2 rounded-lg ${
                    touch.active ? "bg-amber-500/10 ring-1 ring-amber-500/30" : "bg-muted/30"
                  }`}
                >
                  <span className="text-lg">{touch.icon}</span>
                  <p className="text-[10px] font-semibold text-foreground mt-1">{touch.label}</p>
                  <p className="text-[9px] text-muted-foreground">{touch.time} · {touch.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedTract(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Generating overlay */}
        {isGenerating && (
          <Card className="mb-4 bg-amber-950/50 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-amber-300">Preparing your Morning Watch...</p>
                <p className="text-xs text-muted-foreground">Generating activation and audio</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tract List */}
        <div className="space-y-3">
          {currentTracts.map(renderTractCard)}
        </div>

        {currentTracts.length === 0 && (
          <div className="text-center py-12">
            <Sun className="w-12 h-12 text-amber-400/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tracts in this category yet.</p>
          </div>
        )}
      </div>

      {/* Immersive Audio Player */}
      <ImmersiveAudioPlayer
        isOpen={immersive.isOpen}
        onClose={handleClose}
        tracks={immersive.queue.tracks}
        currentIndex={immersive.queue.currentIndex}
        onNextTrack={immersive.nextTrack}
        onPrevTrack={immersive.prevTrack}
        hasNext={immersive.hasNext}
        hasPrev={immersive.hasPrev}
        ambientMusicEnabled={immersive.ambientMusicEnabled}
        ambientVolume={immersive.ambientVolume}
        continuousPlay={immersive.continuousPlay}
        onSetAmbientMusic={immersive.setAmbientMusic}
        onSetAmbientVolume={immersive.setAmbientVolume}
        onSetContinuousPlay={immersive.setContinuousPlay}
      />
    </div>
  );
}
