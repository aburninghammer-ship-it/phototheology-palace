import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, Star, TrendingUp } from "lucide-react";
import { isThisMonth, isThisWeek } from "date-fns";

interface Study {
  id: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

interface StudyStatsProps {
  studies: Study[];
}

export function StudyStats({ studies }: StudyStatsProps) {
  const totalStudies = studies.length;
  const favoriteCount = studies.filter(s => s.is_favorite).length;
  const thisMonthCount = studies.filter(s => isThisMonth(new Date(s.created_at))).length;
  const activeThisWeek = studies.filter(s => isThisWeek(new Date(s.updated_at))).length;

  const stats = [
    {
      label: "Total Studies",
      value: totalStudies,
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "This Month",
      value: thisMonthCount,
      icon: Calendar,
      color: "text-green-500 bg-green-500/10",
    },
    {
      label: "Active This Week",
      value: activeThisWeek,
      icon: TrendingUp,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Favorites",
      value: favoriteCount,
      icon: Star,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
