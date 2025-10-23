import { useState } from "react";
import EmojiPickerReact, { EmojiClickData } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          type="button"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-0" align="end">
        <EmojiPickerReact
          onEmojiClick={handleEmojiClick}
          width={320}
          height={400}
          searchPlaceHolder="Search emojis..."
          previewConfig={{ showPreview: false }}
        />
      </PopoverContent>
    </Popover>
  );
}