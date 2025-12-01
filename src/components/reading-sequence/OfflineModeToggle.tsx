import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Download, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  isOnline, 
  cacheMusicTrack, 
  isMusicTrackCached,
  getAudioCacheSize 
} from "@/services/offlineAudioCache";
import { toast } from "sonner";

// Default music tracks to cache
const DEFAULT_MUSIC_TRACKS = [
  "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e5e3b4b5a.mp3",
  "https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb5c4e5fb9.mp3",
];

interface OfflineModeToggleProps {
  offlineMode: boolean;
  onOfflineModeChange: (enabled: boolean) => void;
  className?: string;
}

export const OfflineModeToggle = ({ 
  offlineMode, 
  onOfflineModeChange,
  className 
}: OfflineModeToggleProps) => {
  const [online, setOnline] = useState(isOnline());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedTracksCount, setCachedTracksCount] = useState(0);
  const [cacheSize, setCacheSize] = useState({ music: 0, tts: 0 });

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => {
      setOnline(false);
      // Auto-enable offline mode when connection is lost
      onOfflineModeChange(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check cached tracks on mount
    checkCachedTracks();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onOfflineModeChange]);

  const checkCachedTracks = async () => {
    let cached = 0;
    for (const url of DEFAULT_MUSIC_TRACKS) {
      if (await isMusicTrackCached(url)) {
        cached++;
      }
    }
    setCachedTracksCount(cached);
    
    const size = await getAudioCacheSize();
    setCacheSize(size);
  };

  const downloadMusicForOffline = async () => {
    if (!online) {
      toast.error("You need to be online to download music");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    let successCount = 0;
    const total = DEFAULT_MUSIC_TRACKS.length;

    for (let i = 0; i < DEFAULT_MUSIC_TRACKS.length; i++) {
      const url = DEFAULT_MUSIC_TRACKS[i];
      const success = await cacheMusicTrack(url);
      if (success) successCount++;
      setDownloadProgress(((i + 1) / total) * 100);
    }

    setIsDownloading(false);
    setCachedTracksCount(successCount);
    
    const size = await getAudioCacheSize();
    setCacheSize(size);

    if (successCount === total) {
      toast.success("Music downloaded for offline use!");
    } else {
      toast.warning(`Downloaded ${successCount}/${total} tracks`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          {online ? (
            <Wifi className="h-4 w-4 text-emerald-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-amber-500" />
          )}
          <Label htmlFor="offline-mode" className="text-sm font-medium">
            Offline Mode
          </Label>
          {!online && (
            <Badge variant="secondary" className="text-xs">
              No Internet
            </Badge>
          )}
        </div>
        <Switch
          id="offline-mode"
          checked={offlineMode || !online}
          onCheckedChange={onOfflineModeChange}
          disabled={!online}
        />
      </div>

      {offlineMode && (
        <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
          <p className="text-amber-700 dark:text-amber-300 mb-2">
            Using browser voice synthesis (works offline)
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Music cached: {cachedTracksCount}/{DEFAULT_MUSIC_TRACKS.length}</span>
            <span>{formatBytes(cacheSize.music)}</span>
          </div>

          {isDownloading ? (
            <div className="mt-2 space-y-1">
              <Progress value={downloadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Downloading... {Math.round(downloadProgress)}%
              </p>
            </div>
          ) : cachedTracksCount < DEFAULT_MUSIC_TRACKS.length && online ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={downloadMusicForOffline}
            >
              <Download className="h-3 w-3 mr-2" />
              Download Music for Offline
            </Button>
          ) : cachedTracksCount === DEFAULT_MUSIC_TRACKS.length ? (
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <CheckCircle className="h-3 w-3" />
              Music ready for offline use
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
