import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gem, Sparkles } from "lucide-react";

interface MemberGemGalleryProps {
  gems: any[];
}

const CATEGORY_COLORS: Record<string, string> = {
  insight: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  connection: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  question: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  application: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  prophecy: "bg-pink-500/10 text-pink-600 border-pink-500/30",
};

export function MemberGemGallery({ gems }: MemberGemGalleryProps) {
  if (gems.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <Gem className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No gems discovered yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Gems are treasured insights uncovered through study.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {gems.map((gem) => (
          <Card key={gem.id} variant="glass" className="group hover:border-primary/30 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                  <h4 className="text-sm font-medium truncate">{gem.gem_name}</h4>
                </div>
                {gem.category && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] flex-shrink-0 ${CATEGORY_COLORS[gem.category] || ""}`}
                  >
                    {gem.category}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">{gem.gem_content}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                {gem.room_id && (
                  <span className="uppercase tracking-wider font-medium">{gem.room_id}</span>
                )}
                <span>{new Date(gem.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
