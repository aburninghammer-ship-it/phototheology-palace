import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioNarratorEnhanced } from '@/components/audio/AudioNarratorEnhanced';
import { ReadAlongHighlight } from './ReadAlongHighlight';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Volume2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type ReadingMode = 'audio' | 'read-along';

interface ReadingModeToggleProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  defaultMode?: ReadingMode;
  book?: string;
  chapter?: number;
  verse?: number;
  // Audio options
  showVoiceSelector?: boolean;
  compact?: boolean;
  // Read-along options
  defaultSpeed?: number;
  autoStart?: boolean;
}

/**
 * Component that allows users to toggle between audio narration and read-along modes
 * Provides flexibility for different learning preferences and situations
 * Respects user preferences for default mode and read-along speed
 */
export function ReadingModeToggle({
  text,
  className,
  onComplete,
  defaultMode,
  book,
  chapter,
  verse,
  showVoiceSelector = true,
  compact = false,
  defaultSpeed,
  autoStart = false,
}: ReadingModeToggleProps) {
  const { preferences } = useUserPreferences();

  // Determine initial mode based on user preferences or prop
  const getInitialMode = (): ReadingMode => {
    if (defaultMode) return defaultMode;

    if (preferences.preferred_reading_experience === 'auto') {
      // Auto mode: use audio by default, but component will handle fallback
      return 'audio';
    }

    return preferences.preferred_reading_experience === 'read-along' ? 'read-along' : 'audio';
  };

  const [mode, setMode] = useState<ReadingMode>(getInitialMode);

  // Update mode when preferences change
  useEffect(() => {
    if (!defaultMode) {
      setMode(getInitialMode());
    }
  }, [preferences.preferred_reading_experience, defaultMode]);

  // Use user preference for speed if not overridden
  const readAlongSpeed = defaultSpeed ?? preferences.read_along_speed;

  return (
    <div className={cn('w-full', className)}>
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as ReadingMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Audio Narration</span>
            <span className="sm:hidden">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="read-along" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Read-Along</span>
            <span className="sm:hidden">Read</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="mt-0">
          <AudioNarratorEnhanced
            text={text}
            title={`${book} ${chapter}:${verse}`}
            showVoiceSelector={showVoiceSelector}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="read-along" className="mt-0">
          <ReadAlongHighlight
            text={text}
            onComplete={onComplete}
            autoStart={autoStart}
            defaultSpeed={readAlongSpeed}
            className="w-full"
          />
        </TabsContent>
      </Tabs>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        {mode === 'audio' ? (
          <p>
            🎧 Listen to the text narrated with high-quality AI voices.
            Works offline with browser voices when internet is unavailable.
          </p>
        ) : (
          <p>
            📖 Follow along as words are highlighted at a comfortable reading pace.
            Adjust the speed to match your preference. Click any word to jump to that position.
          </p>
        )}
      </div>
    </div>
  );
}
