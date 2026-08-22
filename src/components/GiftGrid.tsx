import React from 'react';
import { GiftBox } from './GiftBox';
import { Recuerdo } from '../types';
import { Sparkles, HeartHandshake, Film } from 'lucide-react';

interface GiftGridProps {
  recuerdos: Recuerdo[];
  onOpenGift: (recuerdo: Recuerdo) => void;
  onOpenMontage: () => void;
  allOpened: boolean;
}

export const GiftGrid: React.FC<GiftGridProps> = ({
  recuerdos,
  onOpenGift,
  onOpenMontage,
  allOpened,
}) => {
  const openedCount = recuerdos.filter((r) => r.abierto).length;

  return (
    <section id="seccion-regalos" className="relative z-10 py-10 px-4 max-w-6xl mx-auto">
      {/* Título de la Sección */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Cajas Mágicas de Recuerdos</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Revive los Momentos Más Brillantes
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Cada caja guarda un instante único del año que pasó. Pasa el cursor y haz clic sobre ellas para destapar tus fotografías y dedicatorias especiales.
        </p>

        {/* Mensaje de desbloqueo del Gran Montaje Final */}
        {allOpened ? (
          <div className="mt-4 inline-flex items-center gap-2 p-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500/30 via-yellow-400/20 to-sky-400/30 border border-yellow-300/50 shadow-xl animate-bounce">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-semibold text-yellow-200">
              ¡Has abierto todos los regalos! El Gran Montaje Final está listo.
            </span>
            <button
              onClick={onOpenMontage}
              className="ml-2 px-3 py-1 text-xs font-bold bg-yellow-400 text-slate-900 rounded-full hover:bg-yellow-300 transition-colors flex items-center gap-1"
            >
              <Film className="w-3 h-3" /> Ver Montaje
            </button>
          </div>
        ) : (
          <div className="mt-3 text-xs text-sky-200/80 font-medium">
            💡 Abre los {recuerdos.length - openedCount} regalos restantes para descubrir el Gran Homenaje Final.
          </div>
        )}
      </div>

      {/* Cuadrícula de Cajas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
        {recuerdos.map((recuerdo, index) => (
          <GiftBox
            key={recuerdo.id}
            recuerdo={recuerdo}
            index={index}
            onOpen={onOpenGift}
          />
        ))}
      </div>
    </section>
  );
};
