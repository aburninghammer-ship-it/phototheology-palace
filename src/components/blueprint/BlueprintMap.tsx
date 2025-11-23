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
  // Following traditional sanctuary order: Outer Court (1,2) → Holy Place (3,4,5) → Most Holy (6)
  const getItemPosition = (id: number) => {
    switch (id) {
      case 1: // Altar of Sacrifice - Outer Court entrance
        return { bottom: "5%", left: "50%", transform: "translateX(-50%)" };
      case 2: // Laver - Outer Court before Holy Place
        return { bottom: "22%", left: "50%", transform: "translateX(-50%)" };
      case 3: // Table of Shewbread - Holy Place RIGHT (North side)
        return { top: "48%", right: "18%", transform: "translateY(-50%)" };
      case 4: // Golden Candlestick - Holy Place LEFT (South side)
        return { top: "48%", left: "18%", transform: "translateY(-50%)" };
      case 5: // Altar of Incense - Holy Place CENTER (before veil)
        return { top: "35%", left: "50%", transform: "translateX(-50%)" };
      case 6: // Ark of the Covenant - Most Holy Place
        return { top: "10%", left: "50%", transform: "translateX(-50%)" };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] bg-gradient-to-t from-amber-950/20 via-amber-900/10 to-sky-950/30 rounded-2xl border-2 border-primary/20 shadow-2xl overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
      
      {/* Outer Court - Large rectangle at bottom */}
      <div className="absolute left-[10%] right-[10%] bottom-[3%] h-[40%] border-2 border-amber-700/40 bg-gradient-to-t from-amber-900/20 to-transparent rounded-lg">
        <div className="absolute -top-3 left-4 bg-background px-2 py-0.5 text-xs font-semibold text-amber-700">Outer Court</div>
      </div>
      
      {/* Holy Place - Medium rectangle in middle */}
      <div className="absolute left-[15%] right-[15%] top-[32%] h-[30%] border-2 border-amber-600/50 bg-gradient-to-t from-amber-800/30 to-amber-700/20 rounded-lg shadow-inner">
        <div className="absolute -top-3 left-4 bg-background px-2 py-0.5 text-xs font-semibold text-amber-600">Holy Place</div>
      </div>
      
      {/* Most Holy Place - Small rectangle at top */}
      <div className="absolute left-[30%] right-[30%] top-[6%] h-[18%] border-2 border-yellow-500/60 bg-gradient-to-t from-yellow-600/40 to-yellow-500/30 rounded-lg shadow-lg">
        <div className="absolute -top-3 left-4 bg-background px-2 py-0.5 text-xs font-semibold text-yellow-600">Most Holy Place</div>
      </div>

      {/* Connection arrows - Following sanctuary path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" opacity="0.6" />
          </marker>
        </defs>
        {/* Path: Altar → Laver */}
        <path d="M 50% 92% L 50% 75%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" fill="none" markerEnd="url(#arrowhead)" />
        {/* Path: Laver → Holy Place entrance */}
        <path d="M 50% 65% L 50% 50%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" fill="none" markerEnd="url(#arrowhead)" />
        {/* Path: Through Holy Place to Incense Altar */}
        <path d="M 50% 50% L 50% 38%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" fill="none" markerEnd="url(#arrowhead)" />
        {/* Path: Incense → Most Holy Place */}
        <path d="M 50% 32% L 50% 26%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5" fill="none" markerEnd="url(#arrowhead)" />
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
                {item.id === 4 && "🕯️"}
                {item.id === 5 && "🌸"}
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
