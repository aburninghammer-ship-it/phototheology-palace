import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface VisualPalaceProgressProps {
  floorProgress: Record<number, number>; // floor number -> percentage
}

const FLOOR_NAMES = [
  "Furnishing Floor (Memory & Visualization)",
  "Investigation Floor (Detective Work)",
  "Freestyle Floor (Connections)",
  "Next Level Floor (Christ-Centered Depth)",
  "Vision Floor (Prophecy & Sanctuary)",
  "Three Heavens Floor (Cycles & Context)",
  "Spiritual & Emotional Floor",
  "Master Floor (Reflexive Mastery)"
];

const FLOOR_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-amber-500 to-yellow-500",
  "from-red-500 to-rose-500",
  "from-indigo-500 to-violet-500",
  "from-orange-500 to-amber-500",
  "from-gray-700 to-gray-900"
];

export default function VisualPalaceProgress({ floorProgress }: VisualPalaceProgressProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Visual Palace Progress</CardTitle>
        </div>
        <CardDescription>
          Your journey through the 8-floor palace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {FLOOR_NAMES.map((name, index) => {
            const floorNum = index + 1;
            const progress = floorProgress[floorNum] || 0;
            const isUnlocked = progress > 0;

            return (
              <div key={floorNum} className="relative">
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked 
                    ? `bg-gradient-to-r ${FLOOR_COLORS[index]} border-white/20` 
                    : 'bg-muted/50 border-muted'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isUnlocked ? 'bg-white/20 text-white' : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}>
                        {floorNum}
                      </div>
                      <span className={`font-medium text-sm ${
                        isUnlocked ? 'text-white' : 'text-muted-foreground'
                      }`}>
                        {name}
                      </span>
                    </div>
                    <Badge variant={isUnlocked ? "default" : "secondary"} className={
                      isUnlocked ? 'bg-white/20 text-white border-white/30' : ''
                    }>
                      {progress}%
                    </Badge>
                  </div>
                  {isUnlocked && (
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/60 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
