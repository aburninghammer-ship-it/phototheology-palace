import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  Download, 
  HardDrive, 
  Trash2, 
  WifiOff, 
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Gamepad2,
  Image as ImageIcon,
  FileText,
  Wifi,
  Music,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { getAudioCacheSize, clearAudioCache, getCachedMusicTracks } from "@/services/offlineAudioCache";
import { getCommentaryCacheStats, clearCommentaryCache } from "@/services/offlineCommentaryCache";
import { OfflineDownloadManager } from "@/components/offline/OfflineDownloadManager";

interface CacheStats {
  totalSize: number;
  itemCount: number;
  bibleChapters: Array<{ book: string; chapter: number }>;
  courses: string[];
  images: number;
  offlineFeatures: string[];
  audioCacheSize: { music: number; tts: number };
  cachedMusicTracks: number;
  commentaryCache: { chapters: number; verses: number };
}

export default function OfflineContent() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: 0,
    itemCount: 0,
    bibleChapters: [],
    courses: [],
    images: 0,
    offlineFeatures: [],
    audioCacheSize: { music: 0, tts: 0 },
    cachedMusicTracks: 0,
    commentaryCache: { chapters: 0, verses: 0 }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    analyzeCacheContent();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const analyzeCacheContent = async () => {
    setLoading(true);
    
    try {
      // Calculate localStorage size
      let localStorageSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length;
        }
      }

      // Get cached Bible chapters from localStorage
      const cachedChapters: Array<{ book: string; chapter: number }> = [];
      const bibleKeys = Object.keys(localStorage).filter(key => key.startsWith('bible_'));
      bibleKeys.forEach(key => {
        const match = key.match(/bible_(.+)_(\d+)/);
        if (match) {
          cachedChapters.push({ book: match[1], chapter: parseInt(match[2]) });
        }
      });

      // Get cached courses
      const courseKeys = Object.keys(localStorage).filter(
        key => key.includes('course_progress') || key.includes('lesson_')
      );

      // Count cached images (estimate from service worker cache)
      let imageCount = 0;
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          imageCount += requests.filter(req => 
            req.url.includes('.jpg') || 
            req.url.includes('.png') || 
            req.url.includes('.webp')
          ).length;
        }
      }

      // List offline-capable features
      const offlineFeatures = [
        t('offline.features.bibleReader'),
        t('offline.features.readMeBible'),
        t('offline.features.commentary'),
        t('offline.features.backgroundMusic'),
        t('offline.features.palaceStructure'),
        t('offline.features.flashcards'),
        t('offline.features.growthJournal'),
        t('offline.features.achievements'),
        t('offline.features.userProfile'),
        t('offline.features.trainingDrills'),
        t('offline.features.offlineGames')
      ];

      // Get audio cache stats
      const audioCacheSize = await getAudioCacheSize();
      const cachedMusicTracks = (await getCachedMusicTracks()).length;
      
      // Get commentary cache stats
      const commentaryCache = getCommentaryCacheStats();

      setCacheStats({
        totalSize: localStorageSize + audioCacheSize.music + audioCacheSize.tts,
        itemCount: bibleKeys.length + courseKeys.length,
        bibleChapters: cachedChapters,
        courses: courseKeys.map(key => key.replace('course_progress_', '').replace(/_/g, ' ')),
        images: imageCount,
        offlineFeatures,
        audioCacheSize,
        cachedMusicTracks,
        commentaryCache
      });
    } catch (error) {
      console.error('Error analyzing cache:', error);
      toast({
        title: t('offline.cacheAnalysisFailed'),
        description: t('offline.couldNotAnalyze'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      // Clear localStorage (except auth)
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      );
      const authData: Record<string, string> = {};
      authKeys.forEach(key => {
        authData[key] = localStorage.getItem(key) || '';
      });
      
      localStorage.clear();
      
      // Restore auth
      Object.entries(authData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear audio caches
      await clearAudioCache();
      
      // Clear commentary cache
      clearCommentaryCache();

      toast({
        title: t('offline.cacheCleared'),
        description: t('offline.allContentRemoved'),
      });

      analyzeCacheContent();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: t('offline.clearFailed'),
        description: t('offline.couldNotClear'),
        variant: "destructive"
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercent = Math.min((cacheStats.totalSize / (5 * 1024 * 1024)) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('offline.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('offline.description')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant={isOnline ? "default" : "secondary"}
                className="px-4 py-2"
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    {t('offline.online')}
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    {t('offline.offline')}
                  </>
                )}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Storage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                {t('offline.storageUsage')}
              </CardTitle>
              <CardDescription>
                {t('offline.totalCachedContent', { size: formatBytes(cacheStats.totalSize) })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={storagePercent} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('offline.used', { size: formatBytes(cacheStats.totalSize) })}</span>
                <span>{t('offline.available')}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Book className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{cacheStats.bibleChapters.length}</div>
                  <div className="text-xs text-muted-foreground">{t('offline.bibleChapters')}</div>
                </div>

                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
                  <GraduationCap className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{cacheStats.courses.length}</div>
                  <div className="text-xs text-muted-foreground">{t('offline.courses')}</div>
                </div>

                <div className="text-center p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Music className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-bold">{cacheStats.cachedMusicTracks}</div>
                  <div className="text-xs text-muted-foreground">{t('offline.musicTracks')}</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                  <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-foreground" />
                  <div className="text-2xl font-bold">{cacheStats.offlineFeatures.length}</div>
                  <div className="text-xs text-muted-foreground">{t('offline.featuresLabel')}</div>
                </div>
              </div>
              
              {/* Audio Cache Info */}
              {(cacheStats.audioCacheSize.music > 0 || cacheStats.audioCacheSize.tts > 0) && (
                <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium">{t('offline.offlineAudio')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>{t('offline.musicLabel')}: {formatBytes(cacheStats.audioCacheSize.music)}</div>
                    <div>{t('offline.ttsLabel')}: {formatBytes(cacheStats.audioCacheSize.tts)}</div>
                  </div>
                </div>
              )}

              <Button
                variant="destructive"
                size="sm"
                onClick={clearCache}
                className="mt-6 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('offline.clearAllCache')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <OfflineDownloadManager />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Cached Bible Chapters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {t('offline.cachedBibleChapters')}
                </CardTitle>
                <CardDescription>
                  {t('offline.chaptersAvailableOffline', { count: cacheStats.bibleChapters.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {loading ? (
                    <div className="text-center text-muted-foreground py-8">
                      {t('offline.loadingCacheData')}
                    </div>
                  ) : cacheStats.bibleChapters.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('offline.noCachedChapters')}</p>
                      <p className="text-sm mt-2">
                        {t('offline.visitChaptersToCache')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cacheStats.bibleChapters.map((chapter, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium">
                              {chapter.book} {chapter.chapter}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Offline Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  {t('offline.offlineFeatures')}
                </CardTitle>
                <CardDescription>
                  {t('offline.featuresAvailableWithout')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {cacheStats.offlineFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Separator className="my-4" />
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex gap-2 mb-2">
                    <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                        {t('offline.limitedWhileOffline')}
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                        {t('offline.limitedDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">{t('offline.usageTipsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>{t('offline.tips.autoCachingTitle')}:</strong> {t('offline.tips.autoCachingDescription')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>{t('offline.tips.progressSyncTitle')}:</strong> {t('offline.tips.progressSyncDescription')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>{t('offline.tips.clearCacheTitle')}:</strong> {t('offline.tips.clearCacheDescription')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
