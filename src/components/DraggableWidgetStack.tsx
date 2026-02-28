import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

const STORAGE_KEY = "widget-stack-position-v6";

function getInitialPosition() {
  const w = window.innerWidth || 800;
  const h = window.innerHeight || 600;
  const fallback = { x: Math.max(0, w - 180), y: Math.max(0, h - 300) };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const pos = JSON.parse(saved) as { x: number; y: number };
      if (pos.x >= 0 && pos.y >= 0 && pos.x < w - 20 && pos.y < h - 20) {
        return pos;
      }
    }
  } catch {}
  return fallback;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function DraggableWidgetStack({ children }: { children: ReactNode }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(getInitialPosition());

  const applyPos = useCallback(() => {
    if (stackRef.current) {
      stackRef.current.style.left = `${posRef.current.x}px`;
      stackRef.current.style.top = `${posRef.current.y}px`;
    }
  }, []);

  // Drag from handle OR any non-interactive part of the stack
  useEffect(() => {
    applyPos();

    const handle = handleRef.current;
    const stack = stackRef.current;
    if (!stack) return;

    const startDrag = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = posRef.current.x;
      const origY = posRef.current.y;

      const onMove = (ev: PointerEvent) => {
        const rect = stackRef.current?.getBoundingClientRect();
        const w = rect?.width ?? 60;
        const h = rect?.height ?? 60;
        posRef.current = {
          x: clamp(origX + (ev.clientX - startX), 0, window.innerWidth - w - 16),
          y: clamp(origY + (ev.clientY - startY), 0, window.innerHeight - h - 16),
        };
        applyPos();
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(posRef.current));
        } catch {}
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    const onHandleDown = (e: PointerEvent) => {
      startDrag(e);
    };

    const onStackDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select, [role='button'], [data-no-widget-drag='true']")) {
        return;
      }
      startDrag(e);
    };

    handle?.addEventListener("pointerdown", onHandleDown);
    stack.addEventListener("pointerdown", onStackDown);

    return () => {
      handle?.removeEventListener("pointerdown", onHandleDown);
      stack.removeEventListener("pointerdown", onStackDown);
    };
  }, [applyPos]);

  // Keep in viewport on resize
  useEffect(() => {
    const onResize = () => {
      const rect = stackRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 60;
      const h = rect?.height ?? 60;
      posRef.current = {
        x: clamp(posRef.current.x, 0, window.innerWidth - w - 16),
        y: clamp(posRef.current.y, 0, window.innerHeight - h - 16),
      };
      applyPos();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posRef.current));
      } catch {}
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyPos]);

  return (
    <div
      ref={stackRef}
      className="fixed z-[9999] flex items-end gap-1 select-none pointer-events-auto"
      style={{ left: 0, top: 0, willChange: "left, top", touchAction: "none" }}
    >
      {/* Drag handle */}
      <div
        ref={handleRef}
        className="flex items-center justify-center h-10 w-7 rounded-lg bg-muted/70 backdrop-blur-sm border border-border/50 cursor-grab active:cursor-grabbing hover:bg-muted/90 transition-colors self-center"
        style={{ touchAction: "none" }}
        title="Drag to move widgets"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-end gap-2">
        {children}
      </div>
    </div>
  );
}
