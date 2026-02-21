import { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WorkspaceToolbar, type LayoutMode } from "@/components/workspace/WorkspaceToolbar";
import { PaneHeader } from "@/components/workspace/PaneHeader";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const STORAGE_KEY_LAYOUT = "workspace_layout";
const STORAGE_KEY_PANES = "workspace_panes";

const DEFAULT_PANES: Record<LayoutMode, string[]> = {
  half: ["/palace", "/bible"],
  thirds: ["/palace", "/bible", "/notes"],
  quad: ["/palace", "/bible", "/study-buddy", "/notes"],
};

// Pages that shouldn't be auto-injected (workspace itself, auth, etc.)
const NON_INJECTABLE_PATHS = ["/workspace", "/auth", "/", ""];

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [layout, setLayout] = useState<LayoutMode>(() => loadState().layout);
  const [panes, setPanes] = useState<string[]>(() => loadState().panes);
  const [collapsedPanes, setCollapsedPanes] = useState<Set<number>>(new Set());

  // Auto-include the page the user came from
  useEffect(() => {
    const fromPage = searchParams.get("from");
    if (fromPage && !NON_INJECTABLE_PATHS.includes(fromPage)) {
      setPanes(prev => {
        // If the page is already in a pane, no change needed
        if (prev.includes(fromPage)) return prev;
        // Replace the first pane with the page the user came from
        const next = [...prev];
        next[0] = fromPage;
        return next;
      });
    }
  }, []); // Only on mount

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LAYOUT, layout);
    localStorage.setItem(STORAGE_KEY_PANES, JSON.stringify(panes));
  }, [layout, panes]);

  // Keyboard shortcut: Escape to exit workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/palace");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleLayoutChange = useCallback((mode: LayoutMode) => {
    setLayout(mode);
    setCollapsedPanes(new Set()); // Reset collapsed state on layout change
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

  const handleToggleCollapse = useCallback((index: number) => {
    setCollapsedPanes(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleClosePane = useCallback((index: number) => {
    setPanes(prev => {
      if (prev.length <= 1) return prev; // Don't close the last pane
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    // Clean up collapsed state
    setCollapsedPanes(prev => {
      const next = new Set<number>();
      prev.forEach(i => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
        // Skip the closed index
      });
      return next;
    });
    // Adjust layout to match pane count
    setPanes(prev => {
      const count = prev.length;
      if (count <= 2) setLayout("half");
      else if (count === 3) setLayout("thirds");
      return prev;
    });
  }, []);

  const paneCount = getPaneCount(layout);
  const activePanes = panes.slice(0, paneCount);

  const renderPane = (panePath: string, index: number) => {
    const isCollapsed = collapsedPanes.has(index);
    return (
      <div className="flex flex-col bg-background overflow-hidden h-full">
        <PaneHeader
          currentPath={panePath}
          onSelectTab={(path) => handleSelectTab(index, path)}
          showClose={activePanes.length > 1}
          onClose={() => handleClosePane(index)}
          collapsed={isCollapsed}
          onToggleCollapse={() => handleToggleCollapse(index)}
        />
        {!isCollapsed && (
          <iframe
            src={buildIframeSrc(panePath)}
            className="flex-1 w-full border-none"
            title={`Workspace pane ${index + 1}`}
          />
        )}
      </div>
    );
  };

  const renderPanels = () => {
    if (layout === "quad") {
      // 2x2: two rows, each with two resizable columns
      return (
        <ResizablePanelGroup direction="vertical" className="flex-1">
          <ResizablePanel defaultSize={50} minSize={10}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={10}>
                {renderPane(activePanes[0], 0)}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={10}>
                {renderPane(activePanes[1], 1)}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={10}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={10}>
                {renderPane(activePanes[2], 2)}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={10}>
                {renderPane(activePanes[3], 3)}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }

    // half or thirds: horizontal panels
    return (
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {activePanes.map((panePath, index) => (
          <Fragment key={`${index}-${panePath}`}>
            {index > 0 && <ResizableHandle withHandle />}
            <ResizablePanel defaultSize={100 / activePanes.length} minSize={10}>
              {renderPane(panePath, index)}
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
    );
  };

  return (
    <div className="hidden lg:flex flex-col h-screen w-screen fixed inset-0 z-[100] bg-background">
      <WorkspaceToolbar layout={layout} onLayoutChange={handleLayoutChange} />
      {renderPanels()}

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