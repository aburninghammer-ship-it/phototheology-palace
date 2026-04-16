import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { format } from "date-fns";

const CATEGORY_COLORS: Record<string, string> = {
  insight: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  connection: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  question: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  application: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  prophecy: "bg-pink-500/10 text-pink-600 border-pink-500/30",
};

interface FeaturedGemProps {
  gems: any[];
}

export function FeaturedGem({ gems }: FeaturedGemProps) {
  if (!gems || gems.length === 0) return null;

  const gem = gems[0];
  const catColor = CATEGORY_COLORS[gem.category] || "bg-muted text-muted-foreground border-border";

  return (
    <Card className="p-4 border-primary/20 bg-card/80 backdrop-blur">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-sm">{gem.gem_name || "Gem"}</h4>
            {gem.category && (
              <Badge variant="outline" className={`text-[10px] ${catColor}`}>
                {gem.category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{gem.gem_content}</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
            {gem.floor_number && <span>Floor {gem.floor_number}</span>}
            {gem.created_at && (
              <span>{format(new Date(gem.created_at), "MMM d, yyyy")}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
