import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Play, Zap, ChevronDown, Lock } from "lucide-react";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { useWatchPlayer } from "@/hooks/useWatchPlayer";
import {
  WATCH_TRACTS,
  ENERGY_COLORS,
  getTractsByType,
  type WatchTract,
  type MorningWatchSession,
} from "@/data/watchSeries";

export default function MorningWatches() {
  const { startMorningWatch, isGenerating, immersive } = useWatchPlayer();
  const [expandedTract, setExpandedTract] = useState<string | null>(null);

  // Only show tracts that have morning sessions
  const tractsWithMornings = WATCH_TRACTS.filter((t) => t.mornings && t.mornings.length > 0);

  const handleBeginWatch = (session: MorningWatchSession, tractName: string) => {
    startMorningWatch(session, tractName);
  };

  const renderSessionCard = (session: MorningWatchSession, tractName: string) => {
    return (
      <Card
        key={session.dayNumber}
        className="cursor-pointer transition-all duration-300 border-border/50 hover:border-amber-500/40 bg-card/80 hover:bg-amber-500/5"
        onClick={() => handleBeginWatch(session, tractName)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400">
                {session.dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.morningScripture}</p>
              </div>
            </div>
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-amber-400" />
            )}
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
    const mornings = tract.mornings || [];

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
              <p className="text-xs text-muted-foreground mt-1">
                Walk in the Master Mind pattern received during the Night Watch.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[10px]">
                {mornings.length} sessions
              </Badge>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </div>
          </button>

          {isExpanded && (
            <div className="border-t border-border/30 p-4 space-y-2 max-h-96 overflow-y-auto">
              {mornings.map((s) => renderSessionCard(s, tract.name))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sun className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>
              Morning Watches
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Walk in the Master Mind — 5-8 minute audio activation sessions that translate last night's
            formation into today's action. Think like Christ before the first challenge arrives.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Night Watch: Receive. Morning Watch: Walk.
          </p>
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
                { label: "Morning Watch", time: "Waking", duration: "5-8 min", icon: "🌅", active: true },
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
          {tractsWithMornings.map(renderTractCard)}
        </div>

        {tractsWithMornings.length === 0 && (
          <div className="text-center py-12">
            <Sun className="w-12 h-12 text-amber-400/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Morning activations coming soon.</p>
          </div>
        )}
      </div>

      {/* Immersive Audio Player */}
      <ImmersiveAudioPlayer
        isOpen={immersive.isOpen}
        onClose={immersive.closeImmersive}
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
