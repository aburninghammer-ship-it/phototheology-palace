import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";
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
  const stackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(getInitialPosition());
  const [, forceRender] = useState(0);

  const applyPos = useCallback(() => {
    if (stackRef.current) {
      stackRef.current.style.left = `${posRef.current.x}px`;
      stackRef.current.style.top = `${posRef.current.y}px`;
    }
  }, []);

  // Apply initial position after mount
  useEffect(() => {
    applyPos();
  }, [applyPos]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
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
        x: clamp(origX + (ev.clientX - startX), 0, window.innerWidth - w),
        y: clamp(origY + (ev.clientY - startY), 0, window.innerHeight - h),
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
  }, [applyPos]);

  // Keep in viewport on resize
  useEffect(() => {
    const onResize = () => {
      const rect = stackRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 60;
      const h = rect?.height ?? 60;
      posRef.current = {
        x: clamp(posRef.current.x, 0, window.innerWidth - w),
        y: clamp(posRef.current.y, 0, window.innerHeight - h),
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
      className="fixed z-50 flex flex-col-reverse items-start gap-3"
      style={{ left: posRef.current.x, top: posRef.current.y }}
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
