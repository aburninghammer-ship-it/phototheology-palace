import { useRef, useCallback, useEffect, type ReactNode } from "react";
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
  const initializedRef = useRef(false);

  const applyPos = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    }
  }, []);

  // Center on mount
  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;
    // Start centered (transform 0,0 with CSS centering)
    posRef.current = { x: 0, y: 0 };
    applyPos();
  }, [applyPos]);

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
        // Keep at least 100px visible on screen
        posRef.current = {
          x: clamp(origX + dx, -(window.innerWidth / 2 - 100), window.innerWidth / 2 - 100),
          y: clamp(origY + dy, -(window.innerHeight / 2 - 50), window.innerHeight / 2 - h * 0.2),
        };
        applyPos();
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
  }, [applyPos]);

  return (
    <div
      ref={containerRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[calc(100%-2rem)] max-w-lg"
      style={{ willChange: "transform", touchAction: "none" }}
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
