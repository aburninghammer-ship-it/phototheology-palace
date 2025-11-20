import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecentPages } from "@/hooks/useRecentPages";
import { formatDistanceToNow } from "date-fns";

export const ContinueWhereYouLeftOff = () => {
  const navigate = useNavigate();
  const { recentPages } = useRecentPages();

  // Don't show if no recent pages or if the most recent is the home page
  if (!recentPages || recentPages.length === 0 || recentPages[0].path === "/") {
    return null;
  }

  const mostRecent = recentPages[0];

  return (
    <div className="mb-12 max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Continue Where You Left Off
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-lg">{mostRecent.title}</p>
              <p className="text-sm text-muted-foreground">
                Last visited {formatDistanceToNow(new Date(mostRecent.timestamp), { addSuffix: true })}
              </p>
            </div>
            <Button onClick={() => navigate(mostRecent.path)} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
