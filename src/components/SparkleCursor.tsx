import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
}

const COLORS = [
  '#FDE047', // Amarillo brillante
  '#FACC15', // Oro
  '#F472B6', // Rosa pastel
  '#EC4899', // Fucsia
  '#7DD3FC', // Celeste cielo
  '#38BDF8', // Azul brillante
  '#FFFFFF', // Destello blanco
];

export const SparkleCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const addParticles = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        particles.push({
          x,
          y,
          size: Math.random() * 5 + 2,
          color,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // leve flotación ascendente
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      addParticles(e.clientX, e.clientY, 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addParticles(touch.clientX, touch.clientY, 4);
      }
    };

    const handleClick = (e: MouseEvent) => {
      addParticles(e.clientX, e.clientY, 15);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;

        // Dibujar estrella mágica de 4 puntas
        drawStar(ctx, 0, 0, 4, p.size, p.size / 2.5);
        ctx.fill();

        ctx.restore();
      }

      // Limitar a máximo 200 partículas activas para rendimiento óptimo
      if (particles.length > 200) {
        particles = particles.slice(particles.length - 200);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};
