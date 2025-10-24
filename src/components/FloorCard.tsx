import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Floor } from "@/data/palaceData";
import { Link } from "react-router-dom";

interface FloorCardProps {
  floor: Floor;
}

const floorGradients = [
  "gradient-palace",
  "gradient-royal", 
  "gradient-ocean",
  "gradient-forest",
  "gradient-sunset",
  "gradient-warmth",
  "gradient-dreamy",
  "gradient-palace"
];

const floorShadows = [
  "shadow-purple",
  "shadow-blue",
  "shadow-blue",
  "shadow-blue",
  "shadow-pink",
  "shadow-pink",
  "shadow-purple",
  "shadow-purple"
];

export const FloorCard = ({ floor }: FloorCardProps) => {
  const gradient = floorGradients[floor.number - 1];
  const shadow = floorShadows[floor.number - 1];
  
  return (
    <Link to={`/palace/floor/${floor.number}`}>
      <Card className={`group hover-lift border-2 overflow-hidden transition-all duration-300 animate-fade-in cursor-pointer`}>
        <div className={`h-2 ${gradient}`} />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="font-mono text-xs border-primary/50 text-primary">
                  Floor {floor.number}
                </Badge>
                <Badge className={`${gradient} text-white ${shadow}`}>
                  {floor.rooms.length} Rooms
                </Badge>
              </div>
              <CardTitle className="font-serif text-2xl mb-2">
                {floor.name}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                {floor.subtitle}
              </CardDescription>
            </div>
            <div className={`p-2 rounded-full ${gradient}`}>
              <ChevronRight className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {floor.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
