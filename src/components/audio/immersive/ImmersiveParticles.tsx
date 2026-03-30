/**
 * ImmersiveParticles - Animated floating particle/star field
 * Shifts mood colors based on content type
 */
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacityDir: number;
  hue: number;
}

interface ImmersiveParticlesProps {
  isPlaying: boolean;
  /** commentary | apologetics | tour | devotional | study */
  mood?: string;
  intensity?: number; // 0-1
}

const MOOD_HUES: Record<string, number[]> = {
  commentary: [35, 45],    // warm gold
  apologetics: [0, 15],    // fiery red-orange
  tour: [260, 280],        // regal purple
  devotional: [210, 230],  // serene blue
  study: [150, 170],       // scholarly teal
};

const PARTICLE_COUNT = 60;

export function ImmersiveParticles({ isPlaying, mood = "commentary", intensity = 0.6 }: ImmersiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();
  const hueRange = MOOD_HUES[mood] || MOOD_HUES.commentary;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas.width, canvas.height, hueRange));
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speedMul = isPlaying ? 1 : 0.15;
      const opacityMul = isPlaying ? intensity : intensity * 0.3;

      for (const p of particlesRef.current) {
        p.x += p.speedX * speedMul;
        p.y += p.speedY * speedMul;
        p.opacity += p.opacityDir * 0.003 * speedMul;

        if (p.opacity >= 0.9) p.opacityDir = -1;
        if (p.opacity <= 0.1) p.opacityDir = 1;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const alpha = p.opacity * opacityMul;

        // Star glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 75%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 60%, 65%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 50%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 90%, ${alpha * 0.8})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, mood, intensity, hueRange]);

  // Update hues when mood changes
  useEffect(() => {
    for (const p of particlesRef.current) {
      p.hue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
    }
  }, [mood, hueRange]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

function createParticle(w: number, h: number, hueRange: number[]): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.8 + Math.random() * 2.5,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.3 - 0.15, // slight upward drift
    opacity: Math.random() * 0.6 + 0.2,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    hue: hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]),
  };
}
