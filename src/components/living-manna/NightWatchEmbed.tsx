import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoonStar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NightWatchEmbed() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MoonStar className="h-6 w-6 text-indigo-400" />
            Night Watch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Close the day in reflection. The Night Watch guides you through evening meditation, 
            gratitude journaling, and prayerful review of the day's spiritual lessons.
          </p>
          <Button onClick={() => navigate("/night-watches")} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Night Watch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}