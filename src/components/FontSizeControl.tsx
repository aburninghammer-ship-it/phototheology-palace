import { useState, useEffect } from "react";
import { Type, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const FONT_SIZE_KEY = "app-font-size";
const FONT_SIZES = ["small", "medium", "large", "x-large"] as const;
type FontSize = typeof FONT_SIZES[number];

const FONT_SIZE_SCALES: Record<FontSize, number> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  "x-large": 1.25,
};

export const FontSizeControl = () => {
  const { preferences, updatePreference } = useUserPreferences();
  
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    // Prefer synced preference, fall back to localStorage
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return (saved as FontSize) || "medium";
  });

  // Sync from DB preferences when they load
  useEffect(() => {
    if (preferences.app_font_size && preferences.app_font_size !== fontSize) {
      const localSaved = localStorage.getItem(FONT_SIZE_KEY);
      // If no local override, use DB value
      if (!localSaved || localSaved === 'medium') {
        setFontSize(preferences.app_font_size);
      }
    }
  }, [preferences.app_font_size]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
    document.documentElement.style.setProperty(
      "--app-font-scale",
      String(FONT_SIZE_SCALES[fontSize])
    );
    document.documentElement.setAttribute("data-font-size", fontSize);
  }, [fontSize]);

  const changeFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
    updatePreference("app_font_size", newSize);
  };

  const currentIndex = FONT_SIZES.indexOf(fontSize);

  const decrease = () => {
    if (currentIndex > 0) changeFontSize(FONT_SIZES[currentIndex - 1]);
  };

  const increase = () => {
    if (currentIndex < FONT_SIZES.length - 1) changeFontSize(FONT_SIZES[currentIndex + 1]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-20 md:bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background zen-hideable"
          aria-label="Adjust font size"
        >
          <Type className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48">
        <div className="space-y-3">
          <p className="text-sm font-medium">Font Size</p>
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrease}
              disabled={currentIndex === 0}
              aria-label="Decrease font size"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium capitalize min-w-[60px] text-center">
              {fontSize.replace("-", " ")}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={increase}
              disabled={currentIndex === FONT_SIZES.length - 1}
              aria-label="Increase font size"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Adjust text size for better readability
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
