import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

const STORAGE_KEY = "widget-stack-position-v5";

function getInitialPosition() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const pos = JSON.parse(saved) as { x: number; y: number };
      // Validate saved position is still on-screen
      if (pos.x >= 0 && pos.y >= 0 && pos.x < window.innerWidth && pos.y < window.innerHeight) {
        return pos;
      }
    }
  } catch {}
  const w = window.innerWidth || 800;
  const h = window.innerHeight || 600;
  return { x: Math.max(0, w - 160), y: Math.max(0, h - 350) };
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
      stackRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    }
  }, []);

  // Use native event listener on handle to avoid React re-render issues
  useEffect(() => {
    applyPos();

    const handle = handleRef.current;
    if (!handle) return;

    const onDown = (e: PointerEvent) => {
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

    handle.addEventListener("pointerdown", onDown);
    return () => handle.removeEventListener("pointerdown", onDown);
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
      className="fixed z-[1000] flex items-end gap-1 select-none"
      style={{ left: 0, top: 0, willChange: "transform", touchAction: "none" }}
    >
      {/* Drag handle */}
      <div
        ref={handleRef}
        className="flex items-center justify-center h-8 w-5 rounded-md bg-muted/60 backdrop-blur-sm border border-border/40 cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors self-center"
        style={{ touchAction: "none" }}
        title="Drag to move widgets"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-col items-end gap-2">
        {children}
      </div>
    </div>
  );
}
