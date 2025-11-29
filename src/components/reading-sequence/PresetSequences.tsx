import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2 } from "lucide-react";
import { PRESET_SEQUENCES, ROOM_TAG_OPTIONS, ReadingSequenceBlock } from "@/types/readingSequence";
import { VoiceId } from "@/hooks/useTextToSpeech";

interface PresetSequencesProps {
  onSelect: (sequences: ReadingSequenceBlock[]) => void;
}

export const PresetSequences = ({ onSelect }: PresetSequencesProps) => {
  const handleSelect = (preset: typeof PRESET_SEQUENCES[0]) => {
    const block: ReadingSequenceBlock = {
      sequenceNumber: 1,
      enabled: true,
      items: preset.items.map((item, idx) => ({
        id: crypto.randomUUID(),
        book: item.book,
        chapter: item.chapter,
        order: idx,
      })),
      voice: "daniel" as VoiceId,
      playbackSpeed: 1,
      playOrder: "listed",
      includeJeevesCommentary: false,
    };
    onSelect([block]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Quick Start Presets
          <Badge variant="secondary" className="ml-auto">
            <Wand2 className="h-3 w-3 mr-1" />
            AI Suggested
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_SEQUENCES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(preset)}
              className="text-left p-4 rounded-lg border bg-card hover:bg-accent/10 hover:border-primary/30 transition-all group"
            >
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {preset.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {preset.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {preset.roomTags.map((tag) => {
                  const tagInfo = ROOM_TAG_OPTIONS.find((t) => t.value === tag);
                  return (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tagInfo?.label || tag}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {preset.items.length} chapters
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
