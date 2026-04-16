// Native audio storage service using Capacitor Filesystem for mobile apps
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const AUDIO_DIRECTORY = 'pt-audio-cache';

export interface SavedAudioInfo {
  path: string;
  book: string;
  chapter: number;
  verse?: number;
  type: 'verse' | 'commentary';
  voice: string;
  savedAt: number;
  sizeBytes?: number;
}

// Check if we're running on a native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Ensure the audio directory exists
const ensureDirectory = async (): Promise<void> => {
  try {
    await Filesystem.mkdir({
      path: AUDIO_DIRECTORY,
      directory: Directory.Data,
      recursive: true,
    });
  } catch (e: any) {
    // Directory might already exist, that's fine
    if (!e.message?.includes('exists')) {
      console.error('[NativeAudio] Error creating directory:', e);
    }
  }
};

// Generate a unique filename for audio
const getAudioFilename = (
  book: string,
  chapter: number,
  verse: number | undefined,
  type: 'verse' | 'commentary',
  voice: string
): string => {
  const verseStr = verse !== undefined ? `_v${verse}` : '';
  return `${book}_ch${chapter}${verseStr}_${type}_${voice}.mp3`;
};

// Save audio blob to native filesystem
export const saveAudioToDevice = async (
  audioBlob: Blob,
  book: string,
  chapter: number,
  verse: number | undefined,
  type: 'verse' | 'commentary',
  voice: string
): Promise<string | null> => {
  if (!isNativePlatform()) {
    console.log('[NativeAudio] Not on native platform, skipping native save');
    return null;
  }

  try {
    await ensureDirectory();

    const filename = getAudioFilename(book, chapter, verse, type, voice);
    const path = `${AUDIO_DIRECTORY}/${filename}`;

    // Convert blob to base64
    const base64 = await blobToBase64(audioBlob);

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Data,
    });

    console.log('[NativeAudio] Saved audio to device:', path, `(${(audioBlob.size / 1024).toFixed(1)}KB)`);

    // Save metadata
    await saveAudioMetadata({
      path,
      book,
      chapter,
      verse,
      type,
      voice,
      savedAt: Date.now(),
      sizeBytes: audioBlob.size,
    });

    return path;
  } catch (e) {
    console.error('[NativeAudio] Error saving audio:', e);
    return null;
  }
};

// Get audio from native filesystem
export const getAudioFromDevice = async (
  book: string,
  chapter: number,
  verse: number | undefined,
  type: 'verse' | 'commentary',
  voice: string
): Promise<string | null> => {
  if (!isNativePlatform()) {
    return null;
  }

  try {
    const filename = getAudioFilename(book, chapter, verse, type, voice);
    const path = `${AUDIO_DIRECTORY}/${filename}`;

    const result = await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });

    // Convert base64 back to blob URL
    const base64 = result.data as string;
    const blob = base64ToBlob(base64, 'audio/mpeg');
    const blobUrl = URL.createObjectURL(blob);

    console.log('[NativeAudio] Loaded audio from device:', path);
    return blobUrl;
  } catch (e: any) {
    // File not found is expected for uncached audio
    if (!e.message?.includes('not exist') && !e.message?.includes('not found')) {
      console.error('[NativeAudio] Error reading audio:', e);
    }
    return null;
  }
};

// Check if audio exists on device
export const isAudioSavedOnDevice = async (
  book: string,
  chapter: number,
  verse: number | undefined,
  type: 'verse' | 'commentary',
  voice: string
): Promise<boolean> => {
  if (!isNativePlatform()) {
    return false;
  }

  try {
    const filename = getAudioFilename(book, chapter, verse, type, voice);
    const path = `${AUDIO_DIRECTORY}/${filename}`;

    await Filesystem.stat({
      path,
      directory: Directory.Data,
    });

    return true;
  } catch {
    return false;
  }
};

// Delete audio from device
export const deleteAudioFromDevice = async (
  book: string,
  chapter: number,
  verse: number | undefined,
  type: 'verse' | 'commentary',
  voice: string
): Promise<boolean> => {
  if (!isNativePlatform()) {
    return false;
  }

  try {
    const filename = getAudioFilename(book, chapter, verse, type, voice);
    const path = `${AUDIO_DIRECTORY}/${filename}`;

    await Filesystem.deleteFile({
      path,
      directory: Directory.Data,
    });

    console.log('[NativeAudio] Deleted audio from device:', path);
    return true;
  } catch (e) {
    console.error('[NativeAudio] Error deleting audio:', e);
    return false;
  }
};

// Get all saved audio info
export const getAllSavedAudio = async (): Promise<SavedAudioInfo[]> => {
  if (!isNativePlatform()) {
    return [];
  }

  try {
    const metadataStr = await Filesystem.readFile({
      path: `${AUDIO_DIRECTORY}/metadata.json`,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    return JSON.parse(metadataStr.data as string) as SavedAudioInfo[];
  } catch {
    return [];
  }
};

// Get total size of saved audio
export const getSavedAudioSize = async (): Promise<number> => {
  const audioList = await getAllSavedAudio();
  return audioList.reduce((total, audio) => total + (audio.sizeBytes || 0), 0);
};

// Clear all saved audio
export const clearAllSavedAudio = async (): Promise<void> => {
  if (!isNativePlatform()) {
    return;
  }

  try {
    await Filesystem.rmdir({
      path: AUDIO_DIRECTORY,
      directory: Directory.Data,
      recursive: true,
    });

    console.log('[NativeAudio] Cleared all saved audio');
  } catch (e) {
    console.error('[NativeAudio] Error clearing audio:', e);
  }
};

// Save chapter audio (all verses + commentaries)
export const saveChapterAudioToDevice = async (
  book: string,
  chapter: number,
  audioItems: Array<{
    blob: Blob;
    verse?: number;
    type: 'verse' | 'commentary';
    voice: string;
  }>,
  onProgress?: (current: number, total: number) => void
): Promise<number> => {
  if (!isNativePlatform()) {
    return 0;
  }

  let savedCount = 0;

  for (let i = 0; i < audioItems.length; i++) {
    const item = audioItems[i];
    const result = await saveAudioToDevice(
      item.blob,
      book,
      chapter,
      item.verse,
      item.type,
      item.voice
    );

    if (result) {
      savedCount++;
    }

    onProgress?.(i + 1, audioItems.length);
  }

  return savedCount;
};

// Helper: Save metadata to track saved files
const saveAudioMetadata = async (info: SavedAudioInfo): Promise<void> => {
  try {
    const existing = await getAllSavedAudio();
    
    // Remove existing entry for same file
    const filtered = existing.filter(
      (a) => !(a.book === info.book && a.chapter === info.chapter && 
               a.verse === info.verse && a.type === info.type && a.voice === info.voice)
    );

    filtered.push(info);

    await Filesystem.writeFile({
      path: `${AUDIO_DIRECTORY}/metadata.json`,
      data: JSON.stringify(filtered),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  } catch (e) {
    console.error('[NativeAudio] Error saving metadata:', e);
  }
};

// Helper: Convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mpeg;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper: Convert base64 to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Check if chapter is fully saved
export const isChapterSaved = async (
  book: string,
  chapter: number,
  verseCount: number,
  voice: string,
  includeCommentary: boolean = false
): Promise<boolean> => {
  const saved = await getAllSavedAudio();
  
  // Check all verses are saved
  for (let v = 1; v <= verseCount; v++) {
    const hasVerse = saved.some(
      (a) => a.book === book && a.chapter === chapter && a.verse === v && 
             a.type === 'verse' && a.voice === voice
    );
    if (!hasVerse) return false;

    if (includeCommentary) {
      const hasCommentary = saved.some(
        (a) => a.book === book && a.chapter === chapter && a.verse === v && 
               a.type === 'commentary'
      );
      if (!hasCommentary) return false;
    }
  }

  return true;
};
