import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_BASE_URL = "https://tdjtumtdkjicnhlpqqzd.supabase.co/storage/v1/object/public/image-bible/chapters";

interface ImageCacheItem {
  book: string;
  chapter: number;
  url: string;
}

export function useImageBibleImages() {
  return useQuery({
    queryKey: ['image-bible-storage-images'],
    queryFn: async (): Promise<Map<string, string>> => {
      const imageMap = new Map<string, string>();
      
      try {
        // List all folders (books) in the chapters directory
        const { data: folders, error: foldersError } = await supabase.storage
          .from('image-bible')
          .list('chapters', { limit: 100 });
        
        if (foldersError) {
          console.error('Error listing image-bible folders:', foldersError);
          return imageMap;
        }

        // For each book folder, list the chapter images
        for (const folder of folders || []) {
          if (!folder.name) continue;
          
          const bookName = folder.name;
          const { data: files, error: filesError } = await supabase.storage
            .from('image-bible')
            .list(`chapters/${bookName}`, { limit: 200 });
          
          if (filesError) {
            console.error(`Error listing chapters for ${bookName}:`, filesError);
            continue;
          }

          for (const file of files || []) {
            if (!file.name || !file.name.endsWith('.png')) continue;
            
            const chapterNum = parseInt(file.name.replace('.png', ''), 10);
            if (isNaN(chapterNum)) continue;
            
            // Create a key like "genesis-1" and store the URL
            const key = `${bookName.toLowerCase()}-${chapterNum}`;
            const url = `${STORAGE_BASE_URL}/${bookName}/${file.name}`;
            imageMap.set(key, url);
          }
        }
        
        return imageMap;
      } catch (error) {
        console.error('Error fetching image-bible images:', error);
        return imageMap;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Normalize book name to match storage folder format (lowercase, spaces to hyphens)
function normalizeBookName(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '-');
}

// Helper to get image URL for a specific chapter
export function getChapterImageUrl(
  imageMap: Map<string, string> | undefined,
  bookName: string,
  chapter: number
): string | undefined {
  if (!imageMap) return undefined;
  const normalizedBook = normalizeBookName(bookName);
  const key = `${normalizedBook}-${chapter}`;
  return imageMap.get(key);
}
