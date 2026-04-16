import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Type, Minus, Plus, RotateCcw } from "lucide-react";
import { useGlobalFontSize } from "@/hooks/useGlobalFontSize";

export function FontSizeSettings() {
  const { fontSize, setFontSize, increase, decrease, reset, MIN_SIZE, MAX_SIZE } = useGlobalFontSize();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Type className="h-4 w-4" />
          Font Size
          <Badge variant="secondary" className="ml-auto text-xs">
            {fontSize}%
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Adjust text size throughout the entire app. Great for accessibility.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={decrease}
            disabled={fontSize <= MIN_SIZE}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[fontSize]}
              onValueChange={([val]) => setFontSize(val)}
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={10}
              className="w-full"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={increase}
            disabled={fontSize >= MAX_SIZE}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 text-xs text-muted-foreground">
            <span className="text-[10px]">A</span>
            <span>—</span>
            <span className="text-lg font-bold">A</span>
          </div>
          {fontSize !== 100 && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs">
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to default
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground border rounded-md p-2 bg-muted/30" style={{ fontSize: `${fontSize / 100}rem` }}>
          Preview: This is how text will look at {fontSize}% size.
        </p>
      </CardContent>
    </Card>
  );
}
