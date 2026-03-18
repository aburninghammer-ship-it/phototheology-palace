import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Palette, Sparkles, Check } from "lucide-react";
import { useDisplaySettings } from "@/hooks/useDisplaySettings";

const COLOR_THEMES = [
  { id: "default", label: "Default", description: "Standard blue & amber palette", preview: "bg-primary" },
  { id: "sepia", label: "Sepia", description: "Warm, book-like tones for reading", preview: "bg-[hsl(30,40%,50%)]" },
  { id: "calm", label: "Calm", description: "Soft muted blues, gentle on the eyes", preview: "bg-[hsl(210,30%,55%)]" },
  { id: "sage", label: "Sage", description: "Natural greens, earthy & restful", preview: "bg-[hsl(150,25%,45%)]" },
] as const;

export function DisplaySettings() {
  const { colorTheme, setColorTheme, focusMode, setFocusMode, reducedMotion, setReducedMotion } = useDisplaySettings();

  return (
    <div className="space-y-4">
      {/* Zen / Focus Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Focus Mode
          </CardTitle>
          <CardDescription className="text-xs">
            Hide floating buttons, banners, and popups for a distraction-free experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="zen-mode" className="cursor-pointer">Enable Focus Mode</Label>
            <Switch id="zen-mode" checked={focusMode} onCheckedChange={setFocusMode} />
          </div>
        </CardContent>
      </Card>

      {/* Color Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color Theme
          </CardTitle>
          <CardDescription className="text-xs">
            Choose a color scheme that's comfortable for your eyes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_THEMES.map((theme) => (
              <Button
                key={theme.id}
                variant={colorTheme === theme.id ? "default" : "outline"}
                className="h-auto flex-col items-start p-3 gap-1 relative"
                onClick={() => setColorTheme(theme.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-4 h-4 rounded-full ${theme.preview} shrink-0`} />
                  <span className="text-sm font-medium">{theme.label}</span>
                  {colorTheme === theme.id && <Check className="h-3 w-3 ml-auto" />}
                </div>
                <span className="text-[10px] opacity-70 text-left leading-tight">{theme.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reduced Motion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Reduced Motion
          </CardTitle>
          <CardDescription className="text-xs">
            Disable animations and moving elements for a calmer experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="cursor-pointer">Minimize animations</Label>
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
