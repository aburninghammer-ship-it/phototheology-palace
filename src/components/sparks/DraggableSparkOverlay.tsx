import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

interface DraggableSparkOverlayProps {
  children: ReactNode;
  onClose?: () => void;
}

export function DraggableSparkOverlay({ children }: DraggableSparkOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  // Position to center of viewport on mount
  useEffect(() => {
    if (!containerRef.current) return;
    // Small delay to let children render and get real dimensions
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round((window.innerWidth - rect.width) / 2);
      const y = Math.round(Math.max(20, (window.innerHeight - rect.height) / 2));
      posRef.current = { x, y };
      containerRef.current.style.left = `${x}px`;
      containerRef.current.style.top = `${y}px`;
      setReady(true);
    });
  }, []);

  // Drag logic
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = posRef.current.x;
      const origY = posRef.current.y;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const rect = containerRef.current?.getBoundingClientRect();
        const w = rect?.width ?? 400;
        const h = rect?.height ?? 400;

        posRef.current = {
          x: clamp(origX + dx, -w + 100, window.innerWidth - 100),
          y: clamp(origY + dy, 0, window.innerHeight - 60),
        };

        if (containerRef.current) {
          containerRef.current.style.left = `${posRef.current.x}px`;
          containerRef.current.style.top = `${posRef.current.y}px`;
        }
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    return () => handle.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] w-[calc(100%-2rem)] max-w-lg"
      style={{
        willChange: "left, top",
        touchAction: "none",
        opacity: ready ? 1 : 0,
        transition: ready ? "none" : "opacity 0.15s",
      }}
    >
      {/* Drag handle */}
      <div
        ref={handleRef}
        className="flex items-center justify-center gap-1 mx-auto mb-1 w-16 py-1 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50 cursor-grab active:cursor-grabbing hover:bg-muted transition-colors"
        style={{ touchAction: "none" }}
        title="Drag to move"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
