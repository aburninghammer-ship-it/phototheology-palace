import { useState, useEffect, useCallback } from "react";
import { WorkspaceToolbar, type LayoutMode } from "@/components/workspace/WorkspaceToolbar";
import { PaneHeader } from "@/components/workspace/PaneHeader";

const STORAGE_KEY_LAYOUT = "workspace_layout";
const STORAGE_KEY_PANES = "workspace_panes";

const DEFAULT_PANES: Record<LayoutMode, string[]> = {
  half: ["/palace", "/bible"],
  thirds: ["/palace", "/bible", "/notes"],
  quad: ["/palace", "/bible", "/study-buddy", "/notes"],
};

function getPaneCount(layout: LayoutMode): number {
  return layout === "half" ? 2 : layout === "thirds" ? 3 : 4;
}

function loadState(): { layout: LayoutMode; panes: string[] } {
  try {
    const layout = (localStorage.getItem(STORAGE_KEY_LAYOUT) as LayoutMode) || "half";
    const panes = JSON.parse(localStorage.getItem(STORAGE_KEY_PANES) || "null");
    if (Array.isArray(panes) && panes.length > 0) {
      return { layout, panes };
    }
    return { layout, panes: DEFAULT_PANES[layout] };
  } catch {
    return { layout: "half", panes: DEFAULT_PANES.half };
  }
}

function buildIframeSrc(path: string): string {
  return `${path}?workspace=true`;
}

export default function Workspace() {
  const [layout, setLayout] = useState<LayoutMode>(() => loadState().layout);
  const [panes, setPanes] = useState<string[]>(() => loadState().panes);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LAYOUT, layout);
    localStorage.setItem(STORAGE_KEY_PANES, JSON.stringify(panes));
  }, [layout, panes]);

  const handleLayoutChange = useCallback((mode: LayoutMode) => {
    setLayout(mode);
    setPanes(prev => {
      const count = getPaneCount(mode);
      if (prev.length >= count) {
        return prev.slice(0, count);
      }
      // Fill missing panes from defaults
      const defaults = DEFAULT_PANES[mode];
      const extended = [...prev];
      for (let i = prev.length; i < count; i++) {
        extended.push(defaults[i] || "/palace");
      }
      return extended;
    });
  }, []);

  const handleSelectTab = useCallback((index: number, path: string) => {
    setPanes(prev => {
      const next = [...prev];
      next[index] = path;
      return next;
    });
  }, []);

  const paneCount = getPaneCount(layout);
  const activePanes = panes.slice(0, paneCount);

  const gridClass =
    layout === "half"
      ? "grid-cols-2 grid-rows-1"
      : layout === "thirds"
      ? "grid-cols-3 grid-rows-1"
      : "grid-cols-2 grid-rows-2";

  return (
    <div className="hidden lg:flex flex-col h-screen w-screen fixed inset-0 z-[100] bg-background">
      <WorkspaceToolbar layout={layout} onLayoutChange={handleLayoutChange} />

      <div className={`grid flex-1 gap-px bg-border overflow-hidden ${gridClass}`}>
        {activePanes.map((panePath, index) => (
          <div key={index} className="flex flex-col min-h-0 bg-background">
            <PaneHeader
              currentPath={panePath}
              onSelectTab={(path) => handleSelectTab(index, path)}
              showClose={false}
            />
            <iframe
              src={buildIframeSrc(panePath)}
              className="flex-1 w-full border-none"
              title={`Workspace pane ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Mobile fallback */}
      <div className="lg:hidden fixed inset-0 z-[100] bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-3">Desktop Only</h2>
          <p className="text-muted-foreground mb-4">
            Split-screen Workspace requires a screen width of at least 1024px.
            Please use the regular navigation tabs on smaller screens.
          </p>
          <a
            href="/palace"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to Palace
          </a>
        </div>
      </div>
    </div>
  );
}
