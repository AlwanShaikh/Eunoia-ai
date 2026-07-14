"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  /** Show the aurora effect behind children */
  showAurora?: boolean;
  /** Intensity of the aurora glow (0-1) */
  intensity?: number;
}

/**
 * AuroraBackground - A premium futuristic animated background
 * with slow-moving gradient blobs in crimson, purple, and cyan.
 * Wraps children and renders the aurora effect behind them.
 */
export function AuroraBackground({
  className,
  children,
  showAurora = true,
  intensity = 1,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }[]
  >([]);

  // Initialize blobs once
  useEffect(() => {
    if (!showAurora) return;
    const colors = [
      `rgba(220, 38, 38, ${0.12 * intensity})`,   // Crimson #DC2626
      `rgba(147, 51, 234, ${0.10 * intensity})`,   // Purple
      `rgba(34, 211, 238, ${0.08 * intensity})`,   // Cyan
      `rgba(220, 38, 38, ${0.06 * intensity})`,    // Crimson lighter
      `rgba(168, 85, 247, ${0.09 * intensity})`,   // Violet
    ];

    blobsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 20 + Math.random() * 35,
      color: colors[i % colors.length],
      alpha: 0.3 + Math.random() * 0.4,
    }));
  }, [showAurora, intensity]);

  // Animate blobs on each frame
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showAurora) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const blobs = blobsRef.current;
    for (const b of blobs) {
      // Move
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off edges with padding
      if (b.x < -10 || b.x > 110) b.vx *= -1;
      if (b.y < -10 || b.y > 110) b.vy *= -1;

      // Clamp
      b.x = Math.max(-10, Math.min(110, b.x));
      b.y = Math.max(-10, Math.min(110, b.y));

      // Draw radial gradient blob
      const cx = (b.x / 100) * w;
      const cy = (b.y / 100) * h;
      const radius = (b.r / 100) * Math.max(w, h);

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, b.color);
      gradient.addColorStop(0.4, b.color.replace(/[\d.]+\)$/, `${b.alpha * 0.5})`));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
  });

  return (
    <div className={cn('relative', className)}>
      {/* Aurora canvas layer */}
      {showAurora && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-0 h-full w-full"
          style={{ filter: 'blur(80px)', willChange: 'transform' }}
          aria-hidden="true"
        />
      )}

      {/* Subtle radial overlay for depth */}
      {showAurora && (
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(220,38,38,0.06), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(147,51,234,0.05), transparent), radial-gradient(ellipse 50% 60% at 20% 70%, rgba(34,211,238,0.04), transparent)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Content layer */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

/**
 * AnimatedGradientBlob - A single floating gradient blob for decorative use
 */
export function AnimatedGradientBlob({
  className,
  color = 'rgba(220, 38, 38, 0.15)',
  size = 300,
  duration = 20,
}: {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn('pointer-events-none absolute rounded-full blur-3xl', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -25, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    />
  );
}