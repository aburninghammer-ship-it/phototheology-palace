import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Highlighter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightColor {
  name: string;
  value: string;
  bg: string;
  border: string;
}

interface VerseHighlightMenuProps {
  verse: number;
  currentColor?: HighlightColor | null;
  colors: HighlightColor[];
  onHighlight: (verse: number, color: string) => void;
  onRemove: (verse: number) => void;
}

export const VerseHighlightMenu = ({
  verse,
  currentColor,
  colors,
  onHighlight,
  onRemove,
}: VerseHighlightMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
            currentColor && "opacity-100"
          )}
        >
          <Highlighter className={cn(
            "h-3 w-3",
            currentColor ? `text-${currentColor.value}-500` : "text-muted-foreground"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-1 items-center">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onHighlight(verse, color.value)}
              className={cn(
                "w-6 h-6 rounded-full transition-all hover:scale-110",
                color.bg,
                "border-2",
                currentColor?.value === color.value ? color.border : "border-transparent"
              )}
              title={color.name}
            />
          ))}
          {currentColor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(verse)}
              className="h-6 w-6 p-0 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
