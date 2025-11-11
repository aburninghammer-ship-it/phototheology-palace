import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, Loader2 } from "lucide-react";
import { useOfflineBible } from "@/hooks/useOfflineBible";

interface OfflineChapterButtonProps {
  book: string;
  chapter: number;
  verses: Array<{ verse: number; text: string }>;
  translation?: string;
}

export const OfflineChapterButton = ({
  book,
  chapter,
  verses,
  translation = 'KJV'
}: OfflineChapterButtonProps) => {
  const { cacheChapter, isChapterCached, isCaching } = useOfflineBible();
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkIfCached();
  }, [book, chapter, translation]);

  const checkIfCached = async () => {
    const cached = await isChapterCached(book, chapter, translation);
    setIsCached(cached);
  };

  const handleCache = async () => {
    setIsLoading(true);
    await cacheChapter(book, chapter, verses, translation);
    await checkIfCached();
    setIsLoading(false);
  };

  if (isCached) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Check className="w-4 h-4 mr-2 text-green-500" />
        Cached
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCache}
      disabled={isLoading || isCaching}
    >
      {isLoading || isCaching ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Cache Offline
    </Button>
  );
};
