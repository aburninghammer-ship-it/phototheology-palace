import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sunrise, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MorningWatchEmbed() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sunrise className="h-6 w-6 text-amber-500" />
            Morning Watch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Begin each day grounded in Scripture with a guided morning devotional. Meditate on the Word, 
            journal your reflections, and set your spiritual compass before the day begins.
          </p>
          <Button onClick={() => navigate("/morning-watches")} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Morning Watch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}