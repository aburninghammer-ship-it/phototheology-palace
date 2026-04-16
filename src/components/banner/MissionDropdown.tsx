import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Swords, Brain, Flame, ChevronRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MissionDropdownProps {
  displayName: string;
  children: React.ReactNode;
}

const DAILY_MISSIONS = [
  {
    label: "Today's Mission",
    description: "Find Christ in any OT chapter",
    icon: <Target className="h-4 w-4 text-amber-400" />,
    link: "/bible",
    badge: "Daily",
    badgeColor: "bg-amber-500/20 text-amber-400",
  },
  {
    label: "Weekly Challenge",
    description: "Complete a palace room drill",
    icon: <Trophy className="h-4 w-4 text-blue-400" />,
    link: "/palace",
    badge: "Weekly",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "Freestyle Challenge",
    description: "Connect a verse to your day",
    icon: <Brain className="h-4 w-4 text-emerald-400" />,
    link: "/palace",
    badge: "Anytime",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    label: "Debate of the Week",
    description: "Test your defense skills",
    icon: <Swords className="h-4 w-4 text-red-400" />,
    link: "/debates",
    badge: "PvP",
    badgeColor: "bg-red-500/20 text-red-400",
  },
];

export function MissionDropdown({ displayName, children }: MissionDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer hover:opacity-80 transition-opacity text-left">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start" sideOffset={8}>
        <div className="p-3 border-b border-border/50">
          <p className="text-xs text-muted-foreground">Missions for</p>
          <p className="font-semibold text-sm">{displayName}</p>
        </div>
        <div className="p-2 space-y-1">
          {DAILY_MISSIONS.map((mission, i) => (
            <Link
              key={i}
              to={mission.link}
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-accent/50 transition-colors group"
            >
              {mission.icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">{mission.label}</span>
                  <Badge className={`text-[8px] border-0 px-1.5 py-0 ${mission.badgeColor}`}>
                    {mission.badge}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{mission.description}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
