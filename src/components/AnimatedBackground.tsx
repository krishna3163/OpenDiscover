import React, { useEffect, useRef } from 'react';

/**
 * Ambient particle field behind the whole app.
 *
 * Performance & accessibility notes:
 * - Honours `prefers-reduced-motion` (renders the static gradient only).
 * - Pauses when the tab is hidden, so it never burns battery in the background.
 * - Compares squared distances and caps the particle count (the previous
 *   version ran an O(n²) `sqrt` loop for up to 100 particles per frame).
 * - Scales for `devicePixelRatio` so dots stay crisp on retina displays.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const LINK_DISTANCE = 140;
const MAX_PARTICLES = 60;

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(Math.floor(width / 22), MAX_PARTICLES);
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.8 + 0.8,
  }));
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (prefersReducedMotion()) return; // static gradient from CSS is enough

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height);
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];

        // Links (squared distance keeps this cheap).
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq < LINK_DISTANCE * LINK_DISTANCE) {
            const alpha = 0.14 * (1 - Math.sqrt(distanceSq) / LINK_DISTANCE);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Cursor repulsion.
        const mdx = mouse.x - a.x;
        const mdy = mouse.y - a.y;
        const mdist = mdx * mdx + mdy * mdy;
        if (mdist < 10_000 && mdist > 0.01) {
          const distance = Math.sqrt(mdist);
          a.vx -= (mdx / distance) * 0.06;
          a.vy -= (mdy / distance) * 0.06;
        }

        // Damping keeps speeds sane after a repulsion.
        a.vx *= 0.995;
        a.vy *= 0.995;
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0) a.x = width;
        if (a.x > width) a.x = 0;
        if (a.y < 0) a.y = height;
        if (a.y > height) a.y = 0;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.fill();
      }

      frame = requestAnimationFrame(step);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const onVisibility = () => {
      const shouldRun = !document.hidden;
      if (shouldRun && !running) {
        running = true;
        frame = requestAnimationFrame(step);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    };

    resize();
    frame = requestAnimationFrame(step);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-background" aria-hidden="true" />;
};

export default AnimatedBackground;
