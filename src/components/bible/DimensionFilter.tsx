import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, User, Users, Church, Crown, BookText } from "lucide-react";

interface DimensionFilterProps {
  activeDimensions: string[];
  onToggle: (dimension: string) => void;
}

const DIMENSIONS = [
  { id: "1D", name: "Literal", icon: BookText, color: "bg-blue-500", description: "Plain text meaning" },
  { id: "2D", name: "Christ", icon: Crown, color: "bg-amber-500", description: "Reveals Christ" },
  { id: "3D", name: "Me", icon: User, color: "bg-green-500", description: "Personal application" },
  { id: "4D", name: "Church", icon: Church, color: "bg-purple-500", description: "Corporate body" },
  { id: "5D", name: "Heaven", icon: Crown, color: "bg-pink-500", description: "Celestial realm" },
];

export const DimensionFilter = ({ activeDimensions, onToggle }: DimensionFilterProps) => {
  return (
    <Card className="p-4 space-y-3 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-2 border-blue-500/20">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-blue-600" />
        <h4 className="font-semibold text-sm text-foreground">5-Dimension Filter</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Select dimensions to view specific layers of meaning
      </p>

      <div className="grid grid-cols-2 gap-2">
        {DIMENSIONS.map((dim) => {
          const Icon = dim.icon;
          const isActive = activeDimensions.includes(dim.id);
          
          return (
            <Button
              key={dim.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(dim.id)}
              className={`flex-col h-auto py-3 gap-1 ${
                isActive ? dim.color + " text-white hover:opacity-90" : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold">{dim.name}</span>
              <span className="text-xs opacity-80">{dim.id}</span>
            </Button>
          );
        })}
      </div>

      {activeDimensions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Active:</span>
          {activeDimensions.map((dim) => {
            const dimension = DIMENSIONS.find(d => d.id === dim);
            if (!dimension) return null;
            return (
              <Badge
                key={dim}
                variant="secondary"
                className={`${dimension.color} text-white text-xs`}
              >
                {dimension.name}
              </Badge>
            );
          })}
        </div>
      )}

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Combine dimensions for richer analysis. 2D (Christ) + 3D (Me) reveals personal relationship with Christ in this text.
        </p>
      </div>
    </Card>
  );
};
