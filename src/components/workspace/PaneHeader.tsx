import { DEFAULT_NAV_TABS, type NavTab } from "@/data/navTabs";
import { X, Minus, Maximize2 } from "lucide-react";

interface PaneHeaderProps {
  currentPath: string;
  onSelectTab: (path: string) => void;
  onClose?: () => void;
  showClose?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Filter to only navigable tabs (no dropdowns with "#" as path)
const selectableTabs = DEFAULT_NAV_TABS.filter(tab => tab.to !== "#");

function getTabForPath(path: string): NavTab | undefined {
  return selectableTabs.find(tab => tab.to === path);
}

export function PaneHeader({
  currentPath,
  onSelectTab,
  onClose,
  showClose = false,
  collapsed = false,
  onToggleCollapse,
}: PaneHeaderProps) {
  const activeTab = getTabForPath(currentPath);
  const gradientFrom = activeTab?.gradient.from.replace("/10", "/30") ?? "from-slate-500/30";
  const gradientTo = activeTab?.gradient.to.replace("/10", "/30") ?? "to-slate-500/30";

  return (
    <div className="flex items-center gap-2 h-9 px-2 bg-card border-b border-border shrink-0">
      {/* Color indicator */}
      <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${gradientFrom} ${gradientTo}`} />

      <select
        value={currentPath}
        onChange={(e) => onSelectTab(e.target.value)}
        className="flex-1 text-xs font-medium bg-transparent border-none outline-none cursor-pointer text-foreground truncate"
      >
        {selectableTabs.map(tab => (
          <option key={tab.id} value={tab.to}>
            {tab.shortLabel || tab.label}
          </option>
        ))}
      </select>

      {/* Collapse/expand toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title={collapsed ? "Expand pane" : "Collapse pane"}
        >
          {collapsed ? (
            <Maximize2 className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {/* Close button */}
      {showClose && onClose && (
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          title="Close pane"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
