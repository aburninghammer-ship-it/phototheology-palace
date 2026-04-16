import { Columns2, Columns3, Grid2x2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type LayoutMode = "half" | "thirds" | "quad";

interface WorkspaceToolbarProps {
  layout: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

const layoutOptions: { mode: LayoutMode; label: string; icon: typeof Columns2 }[] = [
  { mode: "half", label: "Half", icon: Columns2 },
  { mode: "thirds", label: "Thirds", icon: Columns3 },
  { mode: "quad", label: "Quad", icon: Grid2x2 },
];

export function WorkspaceToolbar({ layout, onLayoutChange }: WorkspaceToolbarProps) {
  return (
    <div className="flex items-center justify-between h-11 px-3 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">Workspace</span>
        <div className="flex items-center gap-1 ml-2">
          {layoutOptions.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => onLayoutChange(mode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                layout === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              title={`${label} layout`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button variant="ghost" size="sm" asChild>
        <Link to="/palace" className="flex items-center gap-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit Workspace
        </Link>
      </Button>
    </div>
  );
}
