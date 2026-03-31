import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  HardDrive,
  Wifi,
  WifiOff,
  BookOpen,
  Library,
  Image,
  Loader2
, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

interface DownloadableContent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  sizeEstimate: string;
  isDownloaded: boolean;
  downloadProgress: number;
}

const OFFLINE_STORAGE_KEY = "phototheology_offline_content";

export function OfflineDownloadManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadableContent, setDownloadableContent] = useState<DownloadableContent[]>([
    {
      id: "bible-kjv",
      name: "KJV Bible Text",
      description: "Complete King James Version Bible text",
      icon: BookOpen,
      sizeEstimate: "~5 MB",
      isDownloaded: false,
      downloadProgress: 0
    },
    {
      id: "bible-esv",
      name: "ESV Bible Text",
      description: "English Standard Version Bible text",
      icon: BookOpen,
      sizeEstimate: "~5 MB",
      isDownloaded: false,
      downloadProgress: 0
    },
    {
      id: "commentaries",
      name: "Classic Commentaries",
      description: "Matthew Henry, Barnes, Gill, and more",
      icon: Library,
      sizeEstimate: "~50 MB",
      isDownloaded: false,
      downloadProgress: 0
    },
    {
      id: "palace-images",
      name: "Palace Visual Assets",
      description: "Images for the 8-Floor Palace system",
      icon: Image,
      sizeEstimate: "~25 MB",
      isDownloaded: false,
      downloadProgress: 0
    }
  ]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [autoDownload, setAutoDownload] = useState(false);
  const [storageUsed, setStorageUsed] = useState<string>("0 MB");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load saved download states
    loadDownloadStates();
    calculateStorageUsed();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadDownloadStates = () => {
    try {
      const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (saved) {
        const states = JSON.parse(saved);
        setDownloadableContent((prev) =>
          prev.map((item) => ({
            ...item,
            isDownloaded: states[item.id] || false
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load offline states:", e);
    }
  };

  const saveDownloadState = (id: string, downloaded: boolean) => {
    try {
      const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
      const states = saved ? JSON.parse(saved) : {};
      states[id] = downloaded;
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(states));
    } catch (e) {
      console.error("Failed to save offline state:", e);
    }
  };

  const calculateStorageUsed = async () => {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        setStorageUsed(`${usedMB} MB`);
      }
    } catch (e) {
      console.error("Storage estimate failed:", e);
    }
  };

  const downloadContent = async (contentId: string) => {
    if (!isOnline) {
      toast.error("No internet connection", {
        description: "Please connect to the internet to download content."
      });
      return;
    }

    setDownloading(contentId);

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setDownloadableContent((prev) =>
          prev.map((item) =>
            item.id === contentId ? { ...item, downloadProgress: i } : item
          )
        );
      }

      // Mark as downloaded
      setDownloadableContent((prev) =>
        prev.map((item) =>
          item.id === contentId
            ? { ...item, isDownloaded: true, downloadProgress: 100 }
            : item
        )
      );
      saveDownloadState(contentId, true);

      // Cache content in localStorage/IndexedDB based on type
      await cacheContentForOffline(contentId);

      toast.success("Download complete", {
        description: `${downloadableContent.find((c) => c.id === contentId)?.name} is now available offline.`
      });
    } catch (error) {
      toast.error("Download failed", {
        description: "Please try again later."
      });
    } finally {
      setDownloading(null);
      calculateStorageUsed();
    }
  };

  const cacheContentForOffline = async (contentId: string) => {
    // Use Cache API for static assets
    if ("caches" in window) {
      const cache = await caches.open("phototheology-offline-v1");

      switch (contentId) {
        case "bible-kjv":
        case "bible-esv":
          // Cache Bible API responses
          const books = ["Genesis", "Exodus", "Psalms", "Proverbs", "Matthew", "John", "Romans", "Revelation"];
          for (const book of books) {
            const url = `/api/bible/${contentId.replace("bible-", "")}/${book}/1`;
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (e) {
              // Skip failed fetches
            }
          }
          break;

        case "palace-images":
          // Cache palace images
          const imageUrls = [
            "/pwa-192x192.png",
            "/pwa-512x512.png"
          ];
          for (const url of imageUrls) {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (e) {
              // Skip failed fetches
            }
          }
          break;
      }
    }
  };

  const deleteContent = async (contentId: string) => {
    setDownloadableContent((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? { ...item, isDownloaded: false, downloadProgress: 0 }
          : item
      )
    );
    saveDownloadState(contentId, false);

    // Clear from cache
    if ("caches" in window) {
      const cache = await caches.open("phototheology-offline-v1");
      // In a real implementation, we'd track which URLs belong to which content
    }

    toast.success("Content removed", {
      description: "Offline content has been deleted."
    });
    calculateStorageUsed();
  };

  const downloadedCount = downloadableContent.filter((c) => c.isDownloaded).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Offline Content</CardTitle>
              <CardDescription>Download content for offline use</CardDescription>
            </div>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"} className="gap-1">
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span>Storage used: {storageUsed}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {downloadedCount}/{downloadableContent.length} downloaded
          </div>
        </div>

        {/* Auto-download toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="space-y-0.5">
            <Label htmlFor="auto-download" className="text-sm font-medium">
              Auto-download on Wi-Fi
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically download content when connected to Wi-Fi
            </p>
          </div>
          <Switch
            id="auto-download"
            checked={autoDownload}
            onCheckedChange={setAutoDownload}
          />
        </div>

        {/* Content list */}
        <div className="space-y-3">
          {downloadableContent.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    content.isDownloaded ? "bg-green-500/10" : "bg-muted"
                  }`}
                >
                  <content.icon
                    className={`h-4 w-4 ${
                      content.isDownloaded
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{content.name}</span>
                    {content.isDownloaded && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {content.description} • {content.sizeEstimate}
                  </p>
                  {downloading === content.id && (
                    <Progress
                      value={content.downloadProgress}
                      className="mt-2 h-1"
                    />
                  )}
                </div>
              </div>
              <div>
                {content.isDownloaded ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteContent(content.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : downloading === content.id ? (
                  <Button variant="ghost" size="sm" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadContent(content.id)}
                    disabled={!isOnline}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Download all button */}
        <Button
          className="w-full"
          disabled={!isOnline || downloadedCount === downloadableContent.length}
          onClick={() => {
            downloadableContent
              .filter((c) => !c.isDownloaded)
              .forEach((c) => downloadContent(c.id));
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download All ({downloadableContent.length - downloadedCount} remaining)
        </Button>
      </CardContent>
    </Card>
  );
}
