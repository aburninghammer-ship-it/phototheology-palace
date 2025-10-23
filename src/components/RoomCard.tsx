import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/data/palaceData";
import { Sparkles } from "lucide-react";

interface RoomCardProps {
  room: Room;
  floorNumber: number;
}

const roomGradients = [
  ["gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest"],
  ["gradient-royal", "gradient-ocean", "gradient-forest", "gradient-sunset", "gradient-warmth"],
  ["gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-forest", "gradient-dreamy"],
  ["gradient-sunset", "gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-forest", "gradient-dreamy", "gradient-sunset"],
  ["gradient-warmth", "gradient-palace", "gradient-royal", "gradient-ocean", "gradient-sunset", "gradient-forest"],
  ["gradient-forest", "gradient-ocean", "gradient-dreamy"],
  ["gradient-dreamy", "gradient-palace", "gradient-sunset"],
  ["gradient-palace"]
];

export const RoomCard = ({ room, floorNumber }: RoomCardProps) => {
  const gradients = roomGradients[floorNumber - 1] || ["gradient-palace"];
  const roomIndex = room.id.charCodeAt(0) % gradients.length;
  const gradient = gradients[roomIndex];
  
  return (
    <Card className="hover-lift group border-2 hover:border-primary overflow-hidden animate-scale-in">
      <div className={`h-1.5 ${gradient}`} />
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="font-serif text-xl group-hover:text-primary transition-smooth flex items-center gap-2">
            {room.name}
            <Sparkles className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse-glow" />
          </CardTitle>
          <Badge className={`${gradient} text-white font-mono text-xs shadow-lg`}>
            {room.tag}
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium text-primary/70">
          {room.coreQuestion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
          <h4 className="font-semibold text-sm mb-1.5 text-foreground flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${gradient}`} />
            Purpose
          </h4>
          <p className="text-sm text-muted-foreground">{room.purpose}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-1.5 text-foreground">Method</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{room.method}</p>
        </div>
        
        {room.examples.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground">Examples</h4>
            <ul className="space-y-2">
              {room.examples.map((example, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2 p-2 rounded hover:bg-muted/30 transition-smooth">
                  <span className={`text-primary font-bold mt-0.5`}>→</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-3 border-t-2 border-border/50">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Deliverable:</span> {room.deliverable}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
