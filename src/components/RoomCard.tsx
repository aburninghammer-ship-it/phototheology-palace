import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/data/palaceData";
import { Sparkles, BookOpen, Target, Lightbulb } from "lucide-react";
import { JeevesAssistant } from "@/components/JeevesAssistant";

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
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Room Details */}
      <div className="lg:col-span-2">
        <Card className="hover-lift group border-2 hover:border-primary overflow-hidden animate-scale-in bg-gradient-to-br from-card to-muted/20">
          <div className={`h-2 ${gradient}`} />
          <CardHeader>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${gradient} shadow-lg`}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <Badge className={`${gradient} text-white font-mono text-xs shadow-lg`}>
                    {room.tag}
                  </Badge>
                </div>
                <CardTitle className="font-serif text-2xl group-hover:text-primary transition-smooth flex items-center gap-2">
                  {room.name}
                  <Sparkles className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse-glow" />
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base font-semibold text-primary/80 leading-relaxed">
              {room.coreQuestion}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Purpose Section */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-sm text-foreground">Purpose</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{room.purpose}</p>
            </div>
            
            {/* Method Section */}
            <div className="p-4 bg-gradient-to-r from-accent/5 to-palace-orange/5 rounded-xl border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                <h4 className="font-bold text-sm text-foreground">Method</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{room.method}</p>
            </div>
            
            {/* Examples Section */}
            {room.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Examples
                </h4>
                <div className="space-y-2">
                  {room.examples.slice(0, 2).map((example, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all"
                    >
                      <p className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-bold text-base">→</span>
                        <span className="flex-1">{example}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Deliverable Section */}
            <div className="pt-4 border-t-2 border-border/30">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs font-semibold">
                  Deliverable
                </Badge>
                <p className="text-xs text-muted-foreground flex-1">
                  {room.deliverable}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jeeves Assistant for this room */}
      <div className="lg:col-span-1">
        <JeevesAssistant
          roomTag={room.tag}
          roomName={room.name}
          principle={room.purpose.split('.')[0]}
          floorNumber={floorNumber}
          roomId={room.id}
        />
      </div>
    </div>
  );
};
