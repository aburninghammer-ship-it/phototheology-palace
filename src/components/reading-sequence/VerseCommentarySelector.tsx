import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VerseCommentarySelectorProps {
  verseReference: string;
  verseText: string;
}

export const VerseCommentarySelector = ({
  verseReference,
  verseText
}: VerseCommentarySelectorProps) => {
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState<string | null>(null);
  const { toast } = useToast();
  const { speak, isPlaying, stop } = useTextToSpeech();

  const generateCommentary = async (): Promise<string | null> => {
    setLoading(true);
    try {
      // Try to fetch from cache using RPC or simplified query
      const cachedResult = await supabase
        .rpc('get_verse_commentary', { 
          p_verse_reference: verseReference,
          p_depth: 'intermediate'
        })
        .single();

      if (cachedResult.data && !cachedResult.error) {
        const commentaryText = (cachedResult.data as any).commentary_text;
        setCommentary(commentaryText);
        return commentaryText;
      }

      // Generate new commentary
      const { data, error } = await supabase.functions.invoke('generate-verse-commentary', {
        body: {
          verseReference,
          verseText,
          depth: 'intermediate'
        }
      });

      if (error) throw error;

      const commentaryText = data.commentary;
      setCommentary(commentaryText);
      return commentaryText;
    } catch (error) {
      console.error('Error generating commentary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate commentary',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePlayCommentary = async () => {
    if (isPlaying) {
      stop();
      return;
    }

    let commentaryText = commentary;
    if (!commentaryText) {
      commentaryText = await generateCommentary();
      if (!commentaryText) return;
    }

    speak(commentaryText, 'nova');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm">Verse Commentary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">{verseReference}</p>
        <p className="text-sm text-muted-foreground italic">{verseText}</p>
        
        <Button
          onClick={handlePlayCommentary}
          disabled={loading}
          variant="outline"
          size="sm"
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : isPlaying ? (
            <>
              <Volume2 className="h-4 w-4 animate-pulse" />
              Stop Commentary
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Play Commentary
            </>
          )}
        </Button>

        {commentary && !isPlaying && (
          <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
            {commentary}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
