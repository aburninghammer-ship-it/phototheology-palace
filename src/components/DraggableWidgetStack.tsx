import { useRef, useCallback, useEffect, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

const STORAGE_KEY = "widget-stack-position-v3";

function getInitialPosition() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as { x: number; y: number };
  } catch {}
  return { x: window.innerWidth - 100, y: window.innerHeight - 350 };
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
      ref={(el) => {
        (stackRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (handleRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className="fixed z-50 flex flex-col items-end gap-2 cursor-grab active:cursor-grabbing select-none"
      style={{ left: 0, top: 0, willChange: "transform", touchAction: "none" }}
      title="Drag to move"
    >
      {children}
    </div>
  );
}
