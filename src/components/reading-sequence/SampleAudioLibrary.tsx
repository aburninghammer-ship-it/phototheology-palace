import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Music, MessageSquare, BookOpen } from "lucide-react";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { VoiceId } from "@/hooks/useTextToSpeech";

interface SampleAudioLibraryProps {
  onPlaySample: (sequences: ReadingSequenceBlock[]) => void;
}

const SAMPLE_CHAPTERS = [
  { book: "Genesis", chapter: 1, title: "Creation" },
  { book: "Psalms", chapter: 90, title: "The Eternal God" },
  { book: "Matthew", chapter: 24, title: "Signs of the End" },
];

export const SampleAudioLibrary = ({ onPlaySample }: SampleAudioLibraryProps) => {
  const createSampleSequence = (
    book: string,
    chapter: number,
    mode: "verse-by-verse" | "chapter" | "commentary-only",
    withMusic: boolean
  ): ReadingSequenceBlock[] => {
    const item: SequenceItem = {
      id: crypto.randomUUID(),
      book,
      chapter,
      order: 0,
    };

    return [{
      sequenceNumber: 1,
      enabled: true,
      items: [item],
      voice: "daniel" as VoiceId,
      playbackSpeed: 1,
      playOrder: "listed",
      includeJeevesCommentary: mode === "commentary-only",
      commentaryOnly: mode === "commentary-only",
      commentaryVoice: "daniel" as VoiceId,
      commentaryDepth: "surface" as const,
      commentaryMode: mode === "verse-by-verse" ? "verse" as const : "chapter" as const,
    }];
  };

  const handlePlaySample = (book: string, chapter: number, mode: "verse-by-verse" | "chapter" | "commentary-only", withMusic: boolean) => {
    const sequences = createSampleSequence(book, chapter, mode, withMusic);
    onPlaySample(sequences);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Free Audio Samples</h3>
            <p className="text-muted-foreground text-sm">
              Experience the audio reader with these sample chapters. Upgrade to Premium for unlimited access to all 1,189 chapters.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {SAMPLE_CHAPTERS.map((sample) => (
            <Card key={`${sample.book}-${sample.chapter}`} className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {sample.book} {sample.chapter}
                  <Badge variant="secondary" className="ml-auto">Free Sample</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{sample.title}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Verse by Verse */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Verse by Verse</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "verse-by-verse", false)}
                      >
                        <Headphones className="h-3 w-3" />
                        No Music
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "verse-by-verse", true)}
                      >
                        <Music className="h-3 w-3" />
                        With Music
                      </Button>
                    </div>
                  </div>

                  {/* Chapter Mode */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Chapter Mode</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "chapter", false)}
                      >
                        <Headphones className="h-3 w-3" />
                        No Music
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "chapter", true)}
                      >
                        <Music className="h-3 w-3" />
                        With Music
                      </Button>
                    </div>
                  </div>

                  {/* Commentary Only */}
                  <div className="space-y-2 md:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Commentary Only (Daniel Voice)</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "commentary-only", false)}
                      >
                        <MessageSquare className="h-3 w-3" />
                        No Music
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handlePlaySample(sample.book, sample.chapter, "commentary-only", true)}
                      >
                        <Music className="h-3 w-3" />
                        <MessageSquare className="h-3 w-3" />
                        With Music
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
