import React from 'react';
import { GiftBox } from './GiftBox';
import { Recuerdo } from '../types';
import { Sparkles, Film, Gift, Plus } from 'lucide-react';

interface GiftGridProps {
  recuerdos: Recuerdo[];
  onOpenGift: (recuerdo: Recuerdo) => void;
  onOpenMontage: () => void;
  onOpenMemoryEditor?: () => void;
  allOpened: boolean;
}

export const GiftGrid: React.FC<GiftGridProps> = ({
  recuerdos,
  onOpenGift,
  onOpenMontage,
  onOpenMemoryEditor,
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
          Cada caja guarda un instante único del año. Pasa el cursor y haz clic sobre ellas para destapar tus fotografías y dedicatorias especiales.
        </p>

        {/* Mensaje de desbloqueo del Gran Montaje Final */}
        {allOpened && recuerdos.length > 0 ? (
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
        ) : recuerdos.length > 0 ? (
          <div className="mt-3 text-xs text-sky-200/80 font-medium">
            💡 Abre los {recuerdos.length - openedCount} regalos restantes para descubrir el Gran Homenaje Final.
          </div>
        ) : null}
      </div>

      {/* Cuadrícula de Cajas o Estado Vacío */}
      {recuerdos.length > 0 ? (
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
      ) : (
        <div className="max-w-xl mx-auto p-8 rounded-3xl glass-panel border border-pink-400/40 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center mx-auto shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            Aún no hay cajas de regalo configuradas
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Puedes añadir fotografías reales, fechas y dedicatorias personalizadas para Wendy usando el botón de administración.
          </p>
          {onOpenMemoryEditor && (
            <button
              onClick={onOpenMemoryEditor}
              className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Fotos y Recuerdos de Wendy ✨</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
