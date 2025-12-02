import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, Settings, BookOpen, Film, Sparkles, Volume2 } from "lucide-react";
import { AudioNarrator } from "./AudioNarrator";
import { cn } from "@/lib/utils";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";

interface PTAudioModeProps {
  content: {
    title: string;
    text: string;
    type: "24fps" | "commentary" | "story" | "verse";
  };
  className?: string;
}

export const PTAudioMode = ({ content, className }: PTAudioModeProps) => {
  const [voice, setVoice] = useState<VoiceId>("onyx");
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const getIcon = () => {
    switch (content.type) {
      case "24fps": return <Film className="h-5 w-5" />;
      case "commentary": return <Sparkles className="h-5 w-5" />;
      case "story": return <BookOpen className="h-5 w-5" />;
      case "verse": return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case "24fps": return "24FPS Pattern";
      case "commentary": return "PT Commentary";
      case "story": return "Story Narration";
      case "verse": return "Verse Reading";
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <div>
              <CardTitle className="text-lg">{content.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Headphones className="h-3 w-3" />
                {getTypeLabel()} Audio
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showSettings && (
        <div className="px-6 pb-3 space-y-3 border-b border-border">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Voice</label>
            <Select value={voice} onValueChange={(v) => setVoice(v as VoiceId)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {OPENAI_VOICES.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <div className="flex flex-col">
                      <span>{v.name}</span>
                      <span className="text-xs text-muted-foreground">{v.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-advance to next</label>
            <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
          </div>
        </div>
      )}

      <CardContent className="pt-4">
        {/* Text Preview */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg max-h-32 overflow-y-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.text.substring(0, 300)}
            {content.text.length > 300 && "..."}
          </p>
        </div>

        {/* Audio Player */}
        <AudioNarrator 
          text={content.text}
          voice={voice}
          showVoiceSelector={false}
        />
      </CardContent>
    </Card>
  );
};

// Quick Audio Button for inline use
interface QuickAudioButtonProps {
  text: string;
  className?: string;
}

export const QuickAudioButton = ({ text, className }: QuickAudioButtonProps) => {
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <div className={className}>
        <AudioNarrator text={text} />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowPlayer(false)}
          className="mt-2"
        >
          Hide Player
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowPlayer(true)}
      className={cn("gap-2", className)}
    >
      <Volume2 className="h-4 w-4" />
      Listen
    </Button>
  );
};
