import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Sparkles, Heart, Star, ChevronLeft, ChevronRight, Music, PartyPopper } from 'lucide-react';
import { Recuerdo } from '../types';
import { triggerGrandFinaleCelebration, triggerGiftBurst } from '../utils/confettiFX';
import { soundFX } from '../utils/soundFX';

interface GrandFinaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  recuerdos: Recuerdo[];
}

export const GrandFinaleModal: React.FC<GrandFinaleModalProps> = ({
  isOpen,
  onClose,
  recuerdos,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Cantidad total de diapositivas: recuerdos individuales + diapositiva final especial
  const totalSlides = recuerdos.length + 1;
  const isFinalSlide = currentSlide === recuerdos.length;

  // Iniciar fuegos artificiales y fanfarria al abrirse
  useEffect(() => {
    if (isOpen) {
      soundFX.playFanfare();
      triggerGrandFinaleCelebration();
      setCurrentSlide(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Transición automática de diapositivas
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleRestart = () => {
    setCurrentSlide(0);
    setIsPlaying(true);
    triggerGrandFinaleCelebration();
    soundFX.playSparkle();
  };

  if (!isOpen) return null;

  const currentRecuerdo = recuerdos[currentSlide];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Fondo oscuro cinematográfico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl"
        />

        {/* Contenedor del Montaje */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative z-10 w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#181133] to-[#250d2c] border-2 border-pink-400/50 shadow-[0_0_80px_rgba(244,114,182,0.4)] flex flex-col overflow-hidden text-white"
        >
          {/* Barra Superior de Controles */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-pink-500/30 bg-black/30 backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-yellow-300 animate-bounce" />
              <div>
                <span className="text-xs uppercase tracking-widest text-pink-300 font-semibold">
                  Gran Montaje Conmemorativo
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Un Año Mágico Para Sussan Wendy Molina Guzman
                </h2>
              </div>
            </div>

            {/* Controles de diapositiva */}
            <div className="flex items-center gap-2">
              {/* Progreso en bolitas */}
              <div className="hidden sm:flex items-center gap-1.5 mr-3">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === i
                        ? 'w-6 bg-gradient-to-r from-pink-400 to-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.8)]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    title={`Ir a momento ${i + 1}`}
                  />
                ))}
              </div>

              {/* Botón Reproducir / Pausa */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors"
                title={isPlaying ? 'Pausar presentación' : 'Reanudar presentación'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Botón Reiniciar */}
              <button
                onClick={handleRestart}
                className="p-2 rounded-full glass-panel hover:bg-white/20 text-yellow-300 transition-colors"
                title="Reiniciar presentación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Botón Cerrar */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-pink-500/40 hover:bg-pink-500 text-white transition-colors ml-2"
                title="Cerrar montaje"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Área Principal de la Diapositiva */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Si es una diapositiva de recuerdo individual */}
            {!isFinalSlide && currentRecuerdo && (
              <motion.div
                key={currentRecuerdo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.7 }}
                className="w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-center"
              >
                {/* Imagen del Recuerdo */}
                <div className="relative w-full md:w-1/2 h-60 sm:h-72 md:h-full max-h-[480px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 group">
                  <img
                    src={currentRecuerdo.imagenUrl}
                    alt={currentRecuerdo.titulo}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-pink-500 text-white font-semibold shadow">
                      {currentRecuerdo.fecha}
                    </span>
                  </div>
                </div>

                {/* Texto del Recuerdo */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 max-w-lg">
                  <div className="flex items-center gap-2 text-yellow-300 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '5s' }} />
                    <span>Momento #{currentSlide + 1} de {recuerdos.length}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-yellow-200 to-sky-200 leading-tight">
                    {currentRecuerdo.titulo}
                  </h3>

                  <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed border-l-4 border-pink-400 pl-4">
                    "{currentRecuerdo.descripcion}"
                  </p>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-sky-400/10 to-yellow-400/20 border border-pink-400/40">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                      <span className="text-xs uppercase font-bold text-pink-300 tracking-wider">
                        Para Nuestra Querida Wendy
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium">
                      {currentRecuerdo.mensajeEmotivo}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Diapositiva Gran Final: Homenaje a Sussan Wendy Molina Guzman */}
            {isFinalSlide && (
              <motion.div
                key="final-tribute"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full flex flex-col items-center justify-center text-center p-4 max-w-3xl space-y-6"
              >
                {/* Corona y Destellos */}
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-4xl animate-bounce">👑</span>
                  <Sparkles className="w-8 h-8 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
                </div>

                {/* Subtítulo */}
                <h3 className="text-lg sm:text-2xl font-display font-medium text-pink-200">
                  ¡El Mundo Es Mejor Porque Estás En Él!
                </h3>

                {/* NOMBRE DESTACADO EN LA DIAPOSITIVA FINAL */}
                <h1 className="glow-wendy-name text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide leading-tight">
                  Sussan Wendy Molina Guzman
                </h1>

                {/* Carta y Dedicatoria Final */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-pink-400/40 shadow-2xl space-y-3 max-w-2xl">
                  <p className="text-base sm:text-lg text-yellow-100 font-serif leading-relaxed">
                    "Que este nuevo año de vida venga cargado de bendiciones sin límite, salud inquebrantable, aventuras inolvidables y todo el amor que mereces."
                  </p>
                  <p className="text-sm sm:text-base text-slate-200 font-light">
                    Gracias por tu generosidad, tu nobleza y por ser luz en el camino de todos los que tenemos el inmenso privilegio de quererte.
                  </p>
                  <div className="pt-2 text-pink-300 font-script text-2xl">
                    ¡Feliz Cumpleaños Hoy, Mañana y Siempre! 💖✨
                  </div>
                </div>

                {/* Botones de acción final */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-amber-400 via-pink-500 to-sky-400 text-white shadow-xl hover:scale-105 transition-transform"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Volver a Ver el Montaje Mágico 🎬</span>
                  </button>

                  <button
                    onClick={() => triggerGrandFinaleCelebration()}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-xl hover:scale-105 transition-transform"
                  >
                    <PartyPopper className="w-4 h-4 text-slate-950" />
                    <span>¡Más Fuegos Artificiales! 🎆</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Flechas de navegación manual */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel hover:bg-white/20 text-white transition-colors"
              title="Recuerdo anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-panel hover:bg-white/20 text-white transition-colors"
              title="Siguiente recuerdo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
