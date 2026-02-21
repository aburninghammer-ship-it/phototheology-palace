import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

const STORAGE_KEY = "widget-stack-position";

function getInitialPosition() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as { x: number; y: number };
  } catch {}
  return { x: 16, y: window.innerHeight - 120 };
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function DraggableWidgetStack({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState(getInitialPosition);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const stackRef = useRef<HTMLDivElement>(null);

  const persist = useCallback((p: { x: number; y: number }) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const rect = stackRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 60;
      const h = rect?.height ?? 60;
      const nx = clamp(ev.clientX - offset.current.x, 0, window.innerWidth - w);
      const ny = clamp(ev.clientY - offset.current.y, 0, window.innerHeight - h);
      setPos({ x: nx, y: ny });
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setPos(p => { persist(p); return p; });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [pos, persist]);

  // Keep in viewport on resize
  useEffect(() => {
    const onResize = () => {
      setPos(prev => {
        const rect = stackRef.current?.getBoundingClientRect();
        const w = rect?.width ?? 60;
        const h = rect?.height ?? 60;
        const clamped = {
          x: clamp(prev.x, 0, window.innerWidth - w),
          y: clamp(prev.y, 0, window.innerHeight - h),
        };
        persist(clamped);
        return clamped;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [persist]);

  return (
    <div
      ref={stackRef}
      className="fixed z-50 flex flex-col-reverse items-start gap-3"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={handlePointerDown}
        className="cursor-grab active:cursor-grabbing p-1 rounded-md bg-muted/80 backdrop-blur-sm border border-border/50 hover:bg-muted touch-none select-none"
        title="Drag to move"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
