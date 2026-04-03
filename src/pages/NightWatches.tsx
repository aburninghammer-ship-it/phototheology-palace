import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Play, Clock, BookOpen, ChevronRight, Lock, Star, ChevronDown } from "lucide-react";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import { useWatchPlayer } from "@/hooks/useWatchPlayer";
import {
  WATCH_TRACTS,
  MOOD_COLORS,
  STRUGGLE_ICONS,
  getTractsByType,
  type WatchTract,
  type WatchSession,
} from "@/data/watchSeries";
import { Heart } from "lucide-react";

type TractTab = "free" | "40-day" | "365-day";

export default function NightWatches() {
  const { startNightWatch, isGenerating, immersive } = useWatchPlayer();
  const [activeTab, setActiveTab] = useState<TractTab>("free");
  const [selectedTract, setSelectedTract] = useState<WatchTract | null>(null);
  const [expandedTract, setExpandedTract] = useState<string | null>(null);

  const freeTracts = WATCH_TRACTS.filter((t) => t.isFree);
  const fortyDayTracts = getTractsByType("40-day").filter((t) => !t.isFree);
  const yearTracts = getTractsByType("365-day");

  const handleBeginWatch = (session: WatchSession, tractName: string) => {
    startNightWatch(session, tractName);
  };

  const renderSessionCard = (session: WatchSession, tractName: string) => {
    const StruggleIcon = STRUGGLE_ICONS[session.struggle] || Heart;
    return (
      <Card
        key={session.dayNumber}
        className="cursor-pointer transition-all duration-300 border-border/50 hover:border-indigo-500/40 bg-card/80 hover:bg-indigo-500/5"
        onClick={() => handleBeginWatch(session, tractName)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
                {session.dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.scripture}</p>
              </div>
            </div>
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3 italic line-clamp-2">"{session.scene}"</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[10px] ${MOOD_COLORS[session.mood] || ""}`}>
              {session.mood}
            </Badge>
            <Badge variant="outline" className="text-[10px] flex items-center gap-1">
              <StruggleIcon className="w-3 h-3" />
              {session.struggle}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTractCard = (tract: WatchTract) => {
    const isExpanded = expandedTract === tract.id;
    const hasSessions = tract.sessions.length > 0;

    return (
      <Card key={tract.id} className="border-border/50 bg-card/80 overflow-hidden">
        <CardContent className="p-0">
          <button
            className="w-full p-4 flex items-start gap-3 text-left hover:bg-indigo-500/5 transition-colors"
            onClick={() => {
              if (hasSessions) {
                setSelectedTract(isExpanded ? null : tract);
                setExpandedTract(isExpanded ? null : tract.id);
              } else {
                setExpandedTract(isExpanded ? null : tract.id);
              }
            }}
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
              <p className="text-xs text-indigo-400">{tract.subtitle}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tract.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[10px]">
                {tract.totalSessions} days
              </Badge>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </div>
          </button>

          {isExpanded && hasSessions && (
            <div className="border-t border-border/30 p-4 space-y-2 max-h-96 overflow-y-auto">
              {tract.sessions.map((s) => renderSessionCard(s, tract.name))}
            </div>
          )}

          {isExpanded && !hasSessions && tract.weekOverviews && (
            <div className="border-t border-border/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Sessions generated on demand by the Master Mind AI.
              </p>
              {tract.weekOverviews.map((w) => (
                <div key={w.week} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
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

          {isExpanded && !hasSessions && tract.seriesBlocks && (
            <div className="border-t border-border/30 p-4 space-y-2 max-h-96 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-3">
                {tract.seriesBlocks.length} series blocks · Sessions generated on demand
              </p>
              {tract.seriesBlocks.map((b) => (
                <div key={b.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-indigo-400 font-mono">
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Moon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>
              Night Watches
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            The Master Mind — immersive audio meditation sessions. Biblical meditation that fills
            the mind with truth through Scripture. Close your eyes and behold how Christ thinks.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            "Let this mind be in you, which was also in Christ Jesus." — Philippians 2:5
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedTract(null);
                setSelectedTract(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
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
          <Card className="mb-4 bg-indigo-950/50 border-indigo-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-indigo-300">Preparing your Night Watch...</p>
                <p className="text-xs text-muted-foreground">Generating meditation and audio</p>
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
            <Moon className="w-12 h-12 text-indigo-400/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tracts in this category yet.</p>
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
