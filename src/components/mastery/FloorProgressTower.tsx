import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Crown } from "lucide-react";
import { GLOBAL_TITLES } from "@/utils/masteryCalculations";
import { useState } from "react";

interface FloorProgressTowerProps {
  globalTitle: any;
  totalRoomsMastered: number;
}

const MASTER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
  red: { bg: "bg-red-500", text: "text-red-500", border: "border-red-500" },
  yellow: { bg: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500" },
  purple: { bg: "bg-purple-500", text: "text-purple-500", border: "border-purple-500" },
  gray: { bg: "bg-white", text: "text-white", border: "border-white" },
  black: { bg: "bg-black", text: "text-white", border: "border-white" },
};

export const FloorProgressTower: React.FC<FloorProgressTowerProps> = ({
  totalRoomsMastered,
}) => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (level: number) => {
    setOpenSections(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          Global Master Titles
        </CardTitle>
        <CardDescription>
          Master rooms to unlock prestigious titles across the Palace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {GLOBAL_TITLES.map((title) => {
            const colors = MASTER_COLORS[title.color];
            const roomsToUnlock = Math.max(0, title.roomsRequired - totalRoomsMastered);
            const isUnlocked = totalRoomsMastered >= title.roomsRequired;
            const isActive = totalRoomsMastered >= title.roomsRequired && totalRoomsMastered <= title.roomsMax;

            return (
              <Collapsible
                key={title.level}
                open={openSections.includes(title.level)}
                onOpenChange={() => toggleSection(title.level)}
              >
                <div className={`rounded-lg border-2 ${isActive ? 'border-primary/50' : 'border-border'} bg-card`}>
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${colors.bg} ${title.color === 'gray' || title.color === 'black' ? 'border border-border' : ''}`} />
                      <h3 className={`font-bold text-lg uppercase ${colors.text}`}>
                        {title.title.toUpperCase()} — {title.roomsRequired}-{title.roomsMax} Rooms Mastered
                      </h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections.includes(title.level) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-2">
                      <div>
                        <span className="font-bold">Requirements: </span>
                        <span className="text-muted-foreground">
                          {title.streakRequired === 0 ? 'None beyond room mastery' : `${title.streakRequired}-day global streak`}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">Reward: </span>
                        <span className="text-muted-foreground">
                          {title.rewards.join(' + ')}
                        </span>
                      </div>
                      {!isUnlocked && (
                        <p className="text-sm text-primary">
                          {roomsToUnlock} more rooms to unlock
                        </p>
                      )}
                      {isActive && (
                        <Badge variant="default" className="mt-2">
                          Current Title
                        </Badge>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
