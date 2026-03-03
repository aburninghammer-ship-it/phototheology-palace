import { CategoryScore } from "@/hooks/useMasterExam";

interface CategoryBreakdownProps {
  categoryScores: Record<string, CategoryScore>;
}

const categoryLabels: Record<string, string> = {
  palace_rooms: "Palace Rooms",
  apologetics: "Apologetics",
  gems_typology: "Gems & Typology",
  prophecy: "Prophecy",
  sanctuary: "Sanctuary",
  christ_types: "Christ Types",
  patterns_themes: "Patterns & Themes",
  memorization_courses: "Memorization",
};

function getBarColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 60) return "bg-yellow-500";
  if (pct >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  const entries = Object.entries(categoryScores).sort(
    ([, a], [, b]) => b.percentage - a.percentage
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Category Breakdown
      </h3>
      {entries.map(([cat, score]) => (
        <div key={cat} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {categoryLabels[cat] || cat}
            </span>
            <span className="text-muted-foreground">
              {score.earned}/{score.possible} ({score.percentage}%)
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(score.percentage)}`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
