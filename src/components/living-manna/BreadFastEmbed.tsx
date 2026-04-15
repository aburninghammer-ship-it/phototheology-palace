import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wheat, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BreadFastEmbed() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-6 w-6 text-amber-600" />
            Bread Fast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Fast from physical bread and feast on the Bread of Life. Join your church community in 
            structured Scripture-immersion fasts with guided meals, gem collection, and buddy accountability.
          </p>
          <Button onClick={() => navigate("/bread-alone")} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Bread Fast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}