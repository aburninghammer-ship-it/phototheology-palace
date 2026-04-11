import { useState, useMemo, useCallback } from "react";
import { Headphones, Play, Lock, Share2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PodcastPlayer } from "@/components/podcast/PodcastPlayer";
import { PODCAST_EPISODES } from "@/data/podcastData";
import { usePodcastAccess } from "@/hooks/usePodcastAccess";
import { useNavigate } from "react-router-dom";
import type { PodcastEpisode } from "@/data/podcastData";

function groupByFloor(episodes: PodcastEpisode[]) {
  const groups: { label: string; episodes: PodcastEpisode[] }[] = [];
  const floorMap = new Map<number, PodcastEpisode[]>();
  const noFloor: PodcastEpisode[] = [];

  for (const ep of episodes) {
    if (ep.floor) {
      if (!floorMap.has(ep.floor)) floorMap.set(ep.floor, []);
      floorMap.get(ep.floor)!.push(ep);
    } else {
      noFloor.push(ep);
    }
  }

  if (noFloor.length > 0) groups.push({ label: "Introduction", episodes: noFloor });

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

  for (const [floor, eps] of [...floorMap.entries()].sort((a, b) => a[0] - b[0])) {
    groups.push({ label: floorNames[floor] || `Floor ${floor}`, episodes: eps });
  }

  return groups;
}

export default function Podcast() {
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const groups = useMemo(() => groupByFloor(PODCAST_EPISODES), []);
  const { isAccessible, isFreeOrTrial } = usePodcastAccess();
  const navigate = useNavigate();

  const handleEpisodeClick = (ep: PodcastEpisode) => {
    if (isAccessible(ep.episodeNumber)) {
      setActiveEpisode(ep);
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <Headphones className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              Pre-Recorded Audio Episodes
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent mb-4">
            The Phototheology OS Podcast
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Deep dives into every floor of the Phototheology Palace.
            <br />
            <span className="text-sm">
              {PODCAST_EPISODES.length} episodes — listen in any order, at your own pace.
            </span>
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-violet-500/30 text-violet-500 hover:bg-violet-500/10"
            onClick={async () => {
              const shareData = {
                title: "The Phototheology OS Podcast",
                text: "Deep dives into every floor of the Phototheology Palace. Listen free!",
                url: window.location.href,
              };
              if (navigator.share) {
                try { await navigator.share(shareData); } catch {}
              } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share this Podcast
          </Button>

          {isFreeOrTrial && (
            <p className="text-sm text-muted-foreground">
              🔓 Episode 1 is free for everyone.{" "}
              <button onClick={() => navigate("/pricing")} className="text-violet-500 hover:underline font-medium">
                Upgrade
              </button>{" "}
              to unlock all episodes.
            </p>
          )}
        </div>
      </section>

      {/* Active player */}
      {activeEpisode && (
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <PodcastPlayer
            key={activeEpisode.id}
            episode={activeEpisode}
            onClose={() => setActiveEpisode(null)}
          />
        </div>
      )}

      {/* Episode grid grouped by floor */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        {groups.map((group) => (
          <div key={group.label} className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>{group.label}</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({group.episodes.length} episode{group.episodes.length !== 1 ? "s" : ""})
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.episodes.map((ep) => {
                const isActive = activeEpisode?.id === ep.id;
                const locked = !isAccessible(ep.episodeNumber);
                return (
                  <div
                    key={ep.id}
                    className={`
                      relative rounded-xl border p-4 transition-all cursor-pointer
                      ${locked
                        ? "border-border opacity-60 hover:opacity-80"
                        : isActive
                          ? "border-violet-500/50 bg-violet-500/5 ring-1 ring-violet-500/20"
                          : "border-border hover:border-violet-500/30 hover:bg-violet-500/5"
                      }
                    `}
                    onClick={() => handleEpisodeClick(ep)}
                  >
                    {locked && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${locked ? "bg-muted/20" : "bg-violet-500/10"}`}>
                        {locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Headphones className="h-5 w-5 text-violet-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{ep.title}</p>
                        <p className="text-xs text-muted-foreground">Episode {ep.episodeNumber}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ep.description}</p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Ep {ep.episodeNumber}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{ep.duration}</span>
                        {ep.episodeNumber === 1 && (
                          <Badge className="text-xs bg-green-600/20 text-green-500 border-green-500/30">Free</Badge>
                        )}
                      </div>
                      {ep.episodeNumber === 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/podcast`;
                            const shareData = {
                              title: ep.title,
                              text: ep.description,
                              url,
                            };
                            if (navigator.share) {
                              try { await navigator.share(shareData); } catch {}
                            } else {
                              await navigator.clipboard.writeText(url);
                              alert("Link copied to clipboard!");
                            }
                          }}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    <div className="mt-3">
                      <Button
                        size="sm"
                        className={`w-full ${locked
                          ? "bg-muted hover:bg-muted/80 text-muted-foreground"
                          : isActive
                            ? "bg-violet-600 hover:bg-violet-500 text-white"
                            : "bg-violet-600 hover:bg-violet-500 text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEpisodeClick(ep);
                        }}
                      >
                        {locked ? (
                          <>
                            <Lock className="h-4 w-4 mr-1" />
                            Upgrade to Listen
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            {isActive ? "Now Playing" : "Listen"}
                          </>
                        )}
                      </Button>
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
