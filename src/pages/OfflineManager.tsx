import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Trash2, Database, BookOpen, Building2 } from "lucide-react";
import { useOfflineBible } from "@/hooks/useOfflineBible";
import { useOfflinePalace } from "@/hooks/useOfflinePalace";
import { offlineStorage } from "@/services/offlineStorage";
import { useToast } from "@/hooks/use-toast";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";

export default function OfflineManager() {
  const { cachedBooks, isOnline } = useOfflineBible();
  const { cachedContent } = useOfflinePalace();
  const [storageSize, setStorageSize] = useState({ verses: 0, palace: 0, userData: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadStorageSize();
  }, [cachedBooks, cachedContent]);

  const loadStorageSize = async () => {
    try {
      const size = await offlineStorage.getStorageSize();
      setStorageSize(size);
    } catch (error) {
      console.error('Error loading storage size:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all offline data? This cannot be undone.')) return;

    try {
      await offlineStorage.clearAll();
      setStorageSize({ verses: 0, palace: 0, userData: 0 });
      toast({
        title: "Data Cleared",
        description: "All offline data has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear offline data.",
        variant: "destructive",
      });
    }
  };

  const handleClearOld = async () => {
    try {
      await offlineStorage.clearOldData(30);
      await loadStorageSize();
      toast({
        title: "Old Data Cleared",
        description: "Data older than 30 days has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear old data.",
        variant: "destructive",
      });
    }
  };

  const totalItems = storageSize.verses + storageSize.palace + storageSize.userData;
  const maxEstimate = 10000; // Estimated max items for progress bar

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Offline Content Manager</h1>
          <p className="text-muted-foreground">
            Manage cached content for offline access
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {totalItems.toLocaleString()} items cached
          </span>
        </div>

        {/* Storage Overview */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Storage Usage</h2>
            </div>
            <Button onClick={loadStorageSize} variant="ghost" size="sm">
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Total Storage</span>
                <span className="text-muted-foreground">
                  {totalItems} / ~{maxEstimate} items
                </span>
              </div>
              <Progress value={(totalItems / maxEstimate) * 100} />
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Bible Verses</span>
                </div>
                <span className="text-sm font-medium">{storageSize.verses.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Palace Content</span>
                </div>
                <span className="text-sm font-medium">{storageSize.palace.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">User Data</span>
                </div>
                <span className="text-sm font-medium">{storageSize.userData.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cached Bible Books */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Cached Bible Books</h2>
          </div>

          {cachedBooks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cachedBooks.map(bookCode => {
                const book = BIBLE_BOOK_METADATA.find(b => b.code === bookCode);
                return (
                  <Badge key={bookCode} variant="secondary">
                    {book?.name || bookCode}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No Bible books cached yet. Chapters will be cached automatically as you read them.
            </p>
          )}
        </Card>

        {/* Cached Palace Content */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Cached Palace Content</h2>
          </div>

          <div className="grid gap-3">
            {['floor', 'room', 'course'].map(type => {
              const count = cachedContent.filter(c => c.type === type).length;
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{type}s</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              );
            })}
          </div>

          {cachedContent.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No palace content cached yet. Content will be cached as you explore the palace.
            </p>
          )}
        </Card>

        {/* Actions */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Manage Storage</h2>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleClearOld}
              variant="outline"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data Older Than 30 Days
            </Button>

            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Offline Data
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Clearing data will not affect your online progress or bookmarks. You can re-cache content anytime.
          </p>
        </Card>
      </div>
    </div>
  );
}
