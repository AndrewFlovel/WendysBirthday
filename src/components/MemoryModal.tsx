import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Calendar, ChevronRight, ChevronLeft, Gift } from 'lucide-react';
import { Recuerdo } from '../types';
import { triggerGiftBurst } from '../utils/confettiFX';

interface MemoryModalProps {
  recuerdo: Recuerdo | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  recuerdo,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  if (!recuerdo) return null;

  const colorThemes = {
    rosa: {
      border: 'border-pink-300',
      headerBg: 'from-pink-500 to-rose-400',
      badge: 'bg-pink-100 text-pink-700 border-pink-200',
      accent: 'text-pink-500',
    },
    celeste: {
      border: 'border-sky-300',
      headerBg: 'from-sky-500 to-cyan-400',
      badge: 'bg-sky-100 text-sky-700 border-sky-200',
      accent: 'text-sky-500',
    },
    amarillo: {
      border: 'border-yellow-300',
      headerBg: 'from-amber-400 to-yellow-300',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accent: 'text-amber-600',
    },
  };

  const theme = colorThemes[recuerdo.colorCaja] || colorThemes.rosa;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Fondo oscuro con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Tarjeta del Recuerdo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 w-full max-w-2xl bg-slate-900/95 border-2 ${theme.border} rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(244, 114, 182, 0.4), 0 0 40px rgba(56, 189, 248, 0.3)',
          }}
        >
          {/* Barra de título superior con degradado */}
          <div className={`p-4 sm:p-5 bg-gradient-to-r ${theme.headerBg} flex items-center justify-between text-white relative`}>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                <Gift className="w-5 h-5 text-white" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80 block">
                  Regalo #{recuerdo.order} • {recuerdo.categoria || 'Recuerdo Inolvidable'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display drop-shadow">
                  {recuerdo.titulo}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Recuerdo */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Foto del Momento con Marco Decorativo */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 group">
              <img
                src={recuerdo.imagenUrl}
                alt={recuerdo.titulo}
                className="w-full h-64 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                <span>{recuerdo.fecha}</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-4 border-pink-400 pl-4 py-1">
              "{recuerdo.descripcion}"
            </div>

            {/* Dedicatoria Especial */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/15 via-sky-400/10 to-yellow-400/15 border border-pink-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                  Mensaje del Corazón para Wendy
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                {recuerdo.mensajeEmotivo}
              </p>
            </div>

            {/* Controles de Navegación y Celebración */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                {hasPrev && (
                  <button
                    onClick={onPrev}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl glass-panel text-xs text-slate-200 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                )}

                {hasNext && (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl glass-panel text-xs text-slate-200 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerGiftBurst()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-semibold text-xs shadow-lg hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>¡Celebrar! 🎉</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs shadow-lg transition-colors"
                >
                  Listo ✨
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
