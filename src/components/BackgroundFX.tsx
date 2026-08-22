import React, { useMemo } from 'react';

export const BackgroundFX: React.FC = () => {
  // Generar globos flotantes estáticos y pre-calculados
  const balloons = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const colors = [
        { bg: 'from-pink-400 to-rose-300', glow: 'rgba(244, 114, 182, 0.4)', ribbon: '#f472b6' },
        { bg: 'from-sky-400 to-cyan-300', glow: 'rgba(56, 189, 248, 0.4)', ribbon: '#38bdf8' },
        { bg: 'from-amber-300 to-yellow-200', glow: 'rgba(250, 204, 21, 0.4)', ribbon: '#eab308' },
        { bg: 'from-pink-300 via-purple-300 to-sky-300', glow: 'rgba(216, 180, 254, 0.4)', ribbon: '#c084fc' },
      ];
      const color = colors[i % colors.length];
      const size = 38 + (i % 5) * 8; // 38px a 70px
      const left = (i * 7.5 + (i % 3) * 2) % 95;
      const duration = 16 + (i % 6) * 4; // 16s a 36s
      const delay = (i * 2.3) % 15;

      return {
        id: i,
        color,
        size,
        left,
        duration,
        delay,
      };
    });
  }, []);

  // Generar estrellas titilantes
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Fondo degradado base nocturno mágico */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1222] via-[#1a1235] to-[#240b2b]" />

      {/* Orbes de luz resplandecientes en Rosa, Celeste y Amarillo */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-500/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-sky-400/20 blur-[140px] animate-float-slow" />
      <div className="absolute -bottom-20 left-1/4 h-[500px] w-[500px] rounded-full bg-yellow-400/15 blur-[150px] animate-float-medium" />
      <div className="absolute top-2/3 left-10 h-80 w-80 rounded-full bg-pink-400/20 blur-[130px] animate-float-fast" />

      {/* Estrellas titilantes */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9)`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Globos flotantes ascendentes */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-100px] flex flex-col items-center"
          style={{
            left: `${b.left}%`,
            animation: `floatUp ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {/* Cuerpo del globo */}
          <div
            className={`rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color.bg} shadow-lg relative`}
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
              boxShadow: `0 8px 24px ${b.color.glow}`,
            }}
          >
            {/* Brillo del globo */}
            <div className="absolute top-2 left-2.5 h-3 w-2 rounded-full bg-white/60 blur-[1px] rotate-[-25deg]" />
            {/* Nudo */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 rounded-sm"
              style={{ backgroundColor: b.color.ribbon }}
            />
          </div>
          {/* Cuerda del globo ondulante */}
          <div
            className="w-0.5 h-12 opacity-60"
            style={{
              backgroundColor: b.color.ribbon,
              transform: 'scaleY(1.2)',
            }}
          />
        </div>
      ))}

      {/* CSS para la animación continua de subida de globos */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-120vh) rotate(15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
