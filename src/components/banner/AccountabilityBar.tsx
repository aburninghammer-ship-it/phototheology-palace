import { Badge } from "@/components/ui/badge";
import { Flame, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountabilityBarProps {
  currentStreak: number;
  chaptersRead: number;
  roomsExplored: number;
}

export function AccountabilityBar({ currentStreak, chaptersRead, roomsExplored }: AccountabilityBarProps) {
  const items = [
    {
      icon: <Flame className="h-3 w-3" />,
      label: `${currentStreak}-Day Streak`,
      done: currentStreak > 0,
      color: "text-orange-400",
      doneBg: "bg-orange-500/15",
    },
    {
      icon: <BookOpen className="h-3 w-3" />,
      label: "Daily Reading",
      done: chaptersRead > 0,
      color: "text-emerald-400",
      doneBg: "bg-emerald-500/15",
    },
    {
      icon: <Target className="h-3 w-3" />,
      label: "Room Explored",
      done: roomsExplored > 0,
      color: "text-blue-400",
      doneBg: "bg-blue-500/15",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map((item, i) => (
        <Badge
          key={i}
          className={cn(
            "text-[9px] border-0 font-normal gap-1 px-1.5 py-0.5",
            item.done
              ? `${item.doneBg} ${item.color}`
              : "bg-muted/30 text-muted-foreground/50"
          )}
        >
          {item.icon}
          <span className="hidden sm:inline">{item.label}</span>
        </Badge>
      ))}
    </div>
  );
}
