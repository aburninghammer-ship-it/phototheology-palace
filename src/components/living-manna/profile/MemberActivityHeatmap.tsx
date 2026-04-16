import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberActivityHeatmapProps {
  activityDates: Record<string, number>;
}

export function MemberActivityHeatmap({ activityDates }: MemberActivityHeatmapProps) {
  const { weeks, totalDays, monthLabels } = useMemo(() => {
    const today = new Date();
    const weeks: { date: string; count: number; day: number }[][] = [];
    const monthLabels: { label: string; col: number }[] = [];
    let totalDays = 0;

    // Build 26 weeks (6 months)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 26 * 7 + (7 - startDate.getDay()));

    let currentWeek: { date: string; count: number; day: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < 26 * 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      if (d > today) break;

      const dateStr = d.toISOString().split("T")[0];
      const dayOfWeek = d.getDay();
      const count = activityDates[dateStr] || 0;
      if (count > 0) totalDays++;

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      // Track month labels
      const month = d.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: d.toLocaleDateString("en-US", { month: "short" }),
          col: weeks.length,
        });
        lastMonth = month;
      }

      currentWeek.push({ date: dateStr, count, day: dayOfWeek });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { weeks, totalDays, monthLabels };
  }, [activityDates]);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-emerald-500/30";
    if (count <= 3) return "bg-emerald-500/50";
    if (count <= 5) return "bg-emerald-500/70";
    return "bg-emerald-500";
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Study Activity
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {totalDays} active days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Month labels */}
        <div className="flex gap-[3px] mb-1 ml-5">
          {monthLabels.map((m, i) => (
            <div
              key={i}
              className="text-[9px] text-muted-foreground"
              style={{
                position: "relative",
                left: `${m.col * 13}px`,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] flex-shrink-0 pr-1">
            {["", "M", "", "W", "", "F", ""].map((d, i) => (
              <div key={i} className="h-[10px] w-3 text-[8px] text-muted-foreground flex items-center justify-end">
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, dayIdx) => {
                const cell = week.find((c) => c.day === dayIdx);
                if (!cell) return <div key={dayIdx} className="h-[10px] w-[10px]" />;
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "h-[10px] w-[10px] rounded-[2px] transition-colors",
                      getIntensity(cell.count)
                    )}
                    title={`${cell.date}: ${cell.count} entries`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 justify-end">
          <span className="text-[9px] text-muted-foreground mr-1">Less</span>
          {[0, 1, 3, 5, 7].map((c) => (
            <div
              key={c}
              className={cn("h-[10px] w-[10px] rounded-[2px]", getIntensity(c))}
            />
          ))}
          <span className="text-[9px] text-muted-foreground ml-1">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
