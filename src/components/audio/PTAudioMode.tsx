import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, Play, Volume2, Settings, BookOpen, Film, Sparkles } from "lucide-react";
import { AudioNarrator } from "./AudioNarrator";
import { cn } from "@/lib/utils";

interface PTAudioModeProps {
  content: {
    title: string;
    text: string;
    type: "24fps" | "commentary" | "story" | "verse";
  };
  className?: string;
}

export const PTAudioMode = ({ content, className }: PTAudioModeProps) => {
  const [voice, setVoice] = useState<"nova" | "alloy" | "echo" | "onyx">("nova");
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
            <Select value={voice} onValueChange={(v) => setVoice(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nova">Nova (Female)</SelectItem>
                <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                <SelectItem value="echo">Echo (Male)</SelectItem>
                <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
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
