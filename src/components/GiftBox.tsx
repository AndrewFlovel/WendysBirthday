import React, { useState } from 'react';
import { Sparkles, Heart, Star, Gift, Check, Eye } from 'lucide-react';
import { Recuerdo } from '../types';
import { soundFX } from '../utils/soundFX';
import { triggerGiftBurst, triggerMiniSparkle } from '../utils/confettiFX';

interface GiftBoxProps {
  recuerdo: Recuerdo;
  index: number;
  onOpen: (recuerdo: Recuerdo) => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ recuerdo, index, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Esquemas de colores según el tipo de caja
  const colorThemes = {
    rosa: {
      boxBg: 'from-pink-400 via-pink-500 to-rose-500',
      lidBg: 'from-pink-300 via-pink-400 to-pink-500',
      ribbon: 'bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.9)]',
      glow: 'rgba(244, 114, 182, 0.6)',
      border: 'border-pink-300/40',
      badge: 'bg-pink-500/80 text-pink-100',
      accentColor: '#F472B6',
    },
    celeste: {
      boxBg: 'from-sky-400 via-sky-500 to-cyan-600',
      lidBg: 'from-sky-300 via-sky-400 to-sky-500',
      ribbon: 'bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.9)]',
      glow: 'rgba(56, 189, 248, 0.6)',
      border: 'border-sky-300/40',
      badge: 'bg-sky-500/80 text-sky-100',
      accentColor: '#38BDF8',
    },
    amarillo: {
      boxBg: 'from-amber-300 via-yellow-400 to-yellow-500',
      lidBg: 'from-yellow-200 via-yellow-300 to-amber-400',
      ribbon: 'bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)]',
      glow: 'rgba(250, 204, 21, 0.6)',
      border: 'border-yellow-200/40',
      badge: 'bg-amber-500/80 text-yellow-950',
      accentColor: '#FACC15',
    },
  };

  const theme = colorThemes[recuerdo.colorCaja] || colorThemes.rosa;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    soundFX.playSparkle();
    triggerMiniSparkle(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setIsOpening(true);
    soundFX.playPopOpen();
    triggerGiftBurst(x, y);

    setTimeout(() => {
      setIsOpening(false);
      onOpen(recuerdo);
    }, 450);
  };

  return (
    <div
      className="gift-perspective flex flex-col items-center justify-center p-3 relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Halo de resplandor interactivo */}
      <div
        className={`absolute inset-0 rounded-3xl transition-all duration-500 blur-2xl pointer-events-none ${
          isHovered ? 'opacity-90 scale-110' : 'opacity-40 scale-95'
        }`}
        style={{ backgroundColor: theme.glow }}
      />

      {/* Contenedor principal de la caja */}
      <div
        onClick={handleClick}
        className={`gift-box-card relative w-64 sm:w-72 h-80 rounded-2xl cursor-pointer p-4 flex flex-col items-center justify-between border ${theme.border} backdrop-blur-md bg-white/10 shadow-2xl transition-all duration-300`}
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -10px ${theme.glow}, 0 0 25px rgba(255,255,255,0.4)`
            : '0 10px 25px -5px rgba(0,0,0,0.5)',
        }}
      >
        {/* Número de regalo y estado */}
        <div className="w-full flex items-center justify-between z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badge}`}>
            Regalo #{index + 1}
          </span>

          {recuerdo.abierto ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/80 text-white shadow-sm">
              <Check className="w-3 h-3" /> Abierto
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-400 text-slate-900 shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3" /> ¡Tócame!
            </span>
          )}
        </div>

        {/* Modelo 3D / Gráfico de la Caja de Regalo */}
        <div className="relative w-44 h-44 my-auto flex items-center justify-center">
          {/* Chispas flotantes alrededor */}
          {isHovered && (
            <>
              <Sparkles className="absolute -top-3 -left-2 w-6 h-6 text-yellow-300 animate-sparkle-spin pointer-events-none" />
              <Star className="absolute top-1/2 -right-4 w-5 h-5 text-pink-300 animate-bounce pointer-events-none" />
              <Sparkles className="absolute -bottom-2 right-2 w-5 h-5 text-sky-300 animate-sparkle-spin pointer-events-none" />
            </>
          )}

          {/* Si ya está abierto, muestra la miniatura de la foto saliendo de la caja */}
          {recuerdo.abierto && (
            <div className="absolute -top-3 inset-x-2 h-28 rounded-xl overflow-hidden shadow-lg border-2 border-white/80 z-20 transition-transform duration-300 group-hover:scale-105">
              <img
                src={recuerdo.imagenUrl}
                alt={recuerdo.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                <span className="text-[11px] font-semibold text-white truncate drop-shadow">
                  {recuerdo.titulo}
                </span>
              </div>
            </div>
          )}

          {/* Tapa de la caja (Lid) */}
          <div
            className={`absolute top-4 w-36 h-10 rounded-t-xl bg-gradient-to-r ${theme.lidBg} shadow-md border-b-2 border-black/15 z-30 transition-all duration-500 ${
              isOpening
                ? '-translate-y-16 -rotate-12 scale-110 opacity-70'
                : recuerdo.abierto
                ? '-translate-y-6 rotate-6'
                : isHovered
                ? '-translate-y-2'
                : ''
            }`}
          >
            {/* Lazo superior de la cinta */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Orejas del lazo */}
              <div className={`w-6 h-6 rounded-full border-4 border-yellow-300 transform -rotate-45 ${theme.ribbon}`} />
              <div className={`w-6 h-6 rounded-full border-4 border-yellow-300 transform rotate-45 -ml-2 ${theme.ribbon}`} />
              {/* Nudo central */}
              <div className={`absolute w-3.5 h-3.5 rounded-full ${theme.ribbon} shadow-md`} />
            </div>

            {/* Cinta vertical en la tapa */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 ${theme.ribbon}`} />
          </div>

          {/* Cuerpo de la caja (Box Base) */}
          <div
            className={`relative w-32 h-28 rounded-b-xl bg-gradient-to-b ${theme.boxBg} shadow-2xl border-t border-white/30 z-10 flex items-center justify-center transition-transform duration-300 ${
              isHovered && !recuerdo.abierto ? 'animate-wiggle' : ''
            }`}
          >
            {/* Cinta vertical */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 ${theme.ribbon}`} />
            {/* Cinta horizontal */}
            <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-6 ${theme.ribbon}`} />

            {/* Brillo de superficie */}
            <div className="absolute inset-0 rounded-b-xl overflow-hidden pointer-events-none">
              <div className="ribbon-shine absolute inset-0 opacity-40" />
            </div>

            {/* Icono central dentro de la caja */}
            <div className="relative z-20 p-2 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 shadow-inner">
              <Gift className="w-6 h-6 text-white drop-shadow" />
            </div>
          </div>
        </div>

        {/* Texto de instrucción / Título al pie */}
        <div className="w-full text-center z-10">
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-yellow-200 transition-colors">
            {recuerdo.abierto ? recuerdo.titulo : 'Sorpresa Especial'}
          </h3>
          <p className="text-xs text-slate-300/80 mt-0.5 flex items-center justify-center gap-1">
            {recuerdo.abierto ? (
              <>
                <Eye className="w-3.5 h-3.5 text-pink-300" />
                <span>Haz clic para volver a ver</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Haz clic para abrir ✨</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
