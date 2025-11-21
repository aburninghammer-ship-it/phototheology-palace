import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapItem {
  id: number;
  name: string;
  step: string;
}

interface BlueprintMapProps {
  items: MapItem[];
  completedItems: number[];
  onItemClick: (id: number) => void;
}

export const BlueprintMap = ({ items, completedItems, onItemClick }: BlueprintMapProps) => {
  // Map items by ID to their position in the sanctuary layout
  // Following the pattern: 1=bottom, 2=middle bottom, 3,4,5=middle row (left to right), 6=top
  const getItemPosition = (id: number) => {
    switch (id) {
      case 1: // Altar of Sacrifice - Bottom
        return { bottom: "8%", left: "50%", transform: "translateX(-50%)" };
      case 2: // Laver - Middle Bottom
        return { bottom: "28%", left: "50%", transform: "translateX(-50%)" };
      case 3: // Table of Shewbread - Middle Right
        return { top: "50%", right: "15%", transform: "translateY(-50%)" };
      case 4: // Altar of Incense - Middle Center
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      case 5: // Golden Candlestick - Middle Left
        return { top: "50%", left: "15%", transform: "translateY(-50%)" };
      case 6: // Ark of the Covenant - Top
        return { top: "10%", left: "50%", transform: "translateX(-50%)" };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-2xl border-2 border-primary/20 shadow-2xl overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
      
      {/* Outer Court border */}
      <div className="absolute inset-8 border-2 border-dashed border-primary/30 rounded-xl" />
      
      {/* Holy Place border */}
      <div className="absolute top-[35%] left-[20%] right-[20%] bottom-[45%] border-2 border-primary/40 rounded-lg bg-primary/5" />
      
      {/* Most Holy Place border */}
      <div className="absolute top-[8%] left-[35%] right-[35%] h-[20%] border-2 border-primary/50 rounded-lg bg-primary/10" />

      {/* Connection arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" opacity="0.5" />
          </marker>
        </defs>
        {/* Arrow from 1 to 2 */}
        <path d="M 50% 85% L 50% 70%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" fill="none" markerEnd="url(#arrowhead)" />
        {/* Arrow from 2 to middle section */}
        <path d="M 50% 60% L 50% 50%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" fill="none" markerEnd="url(#arrowhead)" />
        {/* Arrow from middle to top */}
        <path d="M 50% 40% L 50% 25%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.4" fill="none" markerEnd="url(#arrowhead)" />
      </svg>

      {/* Sanctuary items */}
      {items.map((item) => {
        const position = getItemPosition(item.id);
        const isCompleted = completedItems.includes(item.id);

        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "absolute group cursor-pointer transition-all duration-300",
              "hover:scale-110 hover:z-20 focus:scale-110 focus:z-20 focus:outline-none"
            )}
            style={position}
          >
            {/* Item circle */}
            <div className={cn(
              "relative flex items-center justify-center",
              "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28",
              "rounded-full border-4 transition-all",
              "shadow-lg group-hover:shadow-2xl",
              isCompleted 
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-card border-primary/50 text-foreground hover:bg-primary/10"
            )}>
              {/* Item number */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                {item.id}
              </div>
              
              {/* Completed checkmark */}
              {isCompleted && (
                <CheckCircle2 className="absolute -bottom-2 -right-2 w-6 h-6 text-green-500 bg-background rounded-full" />
              )}

              {/* Emoji or icon representation */}
              <span className="text-3xl sm:text-4xl">
                {item.id === 1 && "🔥"}
                {item.id === 2 && "💧"}
                {item.id === 3 && "🍞"}
                {item.id === 4 && "🌸"}
                {item.id === 5 && "🕯️"}
                {item.id === 6 && "⚡"}
              </span>
            </div>

            {/* Tooltip label */}
            <div className={cn(
              "absolute top-full mt-2 left-1/2 -translate-x-1/2",
              "px-3 py-1.5 rounded-lg whitespace-nowrap",
              "bg-card border border-border shadow-lg",
              "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
              "transition-opacity duration-200 pointer-events-none",
              "text-xs sm:text-sm font-medium text-center",
              "max-w-[150px] sm:max-w-none"
            )}>
              <div className="font-semibold">{item.step}</div>
              <div className="text-muted-foreground text-xs truncate">{item.name}</div>
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs">
        <div className="font-semibold mb-1">The Sanctuary Pattern</div>
        <div className="text-muted-foreground">Click each item to explore</div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-xs">
        <div className="font-semibold">Progress</div>
        <div className="text-muted-foreground">
          {completedItems.length} / {items.length} completed
        </div>
      </div>
    </div>
  );
};
