import React from 'react';
import { Sparkles, Music, VolumeX, Heart, Video, MessageCircleHeart, Film, Cloud, Settings2 } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface HeaderProps {
  openedCount: number;
  totalCount: number;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenMontage: () => void;
  onOpenCloudConfig: () => void;
  onOpenMemoryEditor: () => void;
  onScrollToVideos: () => void;
  onScrollToWishes: () => void;
  onScrollToGifts: () => void;
  allOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  openedCount,
  totalCount,
  isMusicPlaying,
  onToggleMusic,
  onOpenMontage,
  onOpenCloudConfig,
  onOpenMemoryEditor,
  onScrollToVideos,
  onScrollToWishes,
  onScrollToGifts,
  allOpened,
}) => {
  return (
    <header className="relative z-10 w-full pt-8 pb-6 px-4 text-center">
      {/* Barra superior de controles */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Badge de Progreso de Regalos */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-pink-400/40 shadow-lg text-sm font-medium text-pink-200">
          <span className="text-lg">🎁</span>
          <span>
            Regalos descubiertos:{' '}
            <strong className="text-yellow-300 font-bold">{openedCount}</strong> / {totalCount}
          </span>
          {allOpened && (
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-500 text-white animate-pulse">
              ¡Completado! ✨
            </span>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Botón Música */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              isMusicPlaying
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-500/30 ring-2 ring-pink-300'
                : 'glass-panel text-slate-300 hover:text-white hover:bg-white/15'
            }`}
            title={isMusicPlaying ? 'Pausar música festiva' : 'Reproducir música festiva'}
          >
            {isMusicPlaying ? (
              <>
                <Music className="w-4 h-4 animate-bounce text-yellow-300" />
                <span>Música Activa 🎶</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Música Silenciada</span>
              </>
            )}
          </button>

          {/* Botón Montaje Final si está desbloqueado */}
          {allOpened && (
            <button
              onClick={onOpenMontage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 via-pink-500 to-sky-400 text-white shadow-lg shadow-pink-500/40 hover:scale-105 transition-transform animate-pulse"
            >
              <Film className="w-4 h-4" />
              <span>Ver Montaje Final 🎬</span>
            </button>
          )}

          {/* Botón Compartir Enlace con Amigos */}
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/amigos&familia`;
              const text = `¡Hola! Estamos reuniendo videos y mensajes sorpresa para el cumpleaños de Sussan Wendy Molina Guzman 🎂✨ Sube tu felicitación aquí: ${shareUrl}`;
              if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
                alert('¡Enlace copiado al portapapeles! Listo para enviar por WhatsApp: ' + shareUrl);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white shadow-md transition-all hover:scale-105"
            title="Copiar enlace de /amigos&familia para amigos"
          >
            <span>📲 Compartir con Amigos</span>
          </button>

          {/* Botón Configurar Recuerdos / Fotos */}
          <button
            onClick={onOpenMemoryEditor}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs glass-panel text-slate-300 hover:text-yellow-200 hover:bg-white/15 transition-all"
            title="Personalizar fotos y recuerdos"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editar Recuerdos</span>
          </button>

          {/* Botón Sincronización en la Nube */}
          <button
            onClick={onOpenCloudConfig}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs glass-panel text-sky-200 hover:text-sky-100 hover:bg-sky-500/20 border-sky-400/30 transition-all"
            title="Configuración de Nube (Vercel & Supabase)"
          >
            <Cloud className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Nube Vercel</span>
          </button>
        </div>
      </div>

      {/* Hero Principal con Tipografía Resplandeciente */}
      <div className="max-w-4xl mx-auto relative px-2">
        {/* Adorno superior */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-sky-300 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-400/30">
            Un Homenaje Muy Especial
          </span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-pink-200 mb-1">
          ¡Feliz Cumpleaños a Nuestra Estrella!
        </h2>

        {/* NOMBRE DESTACADO RESPLANDECIENTE */}
        <div className="py-2">
          <h1 className="glow-wendy-name text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide leading-tight drop-shadow-2xl">
            Sussan Wendy Molina Guzman
          </h1>
        </div>

        <p className="mt-3 text-base sm:text-lg text-slate-200/90 font-light max-w-2xl mx-auto leading-relaxed">
          Hoy celebramos tu vida, tus sonrisas y cada instante mágico que nos regalas.
          <span className="text-yellow-300 font-normal block mt-1">
            ✨ Pasa el cursor por las cajitas y descubre los tesoros preparados con todo el amor del mundo.
          </span>
        </p>

        {/* Botones de navegación rápida */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onScrollToGifts}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
          >
            <span>🎁 Abrir Regalos</span>
          </button>

          <button
            onClick={onScrollToVideos}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-lg shadow-sky-500/30 transition-all hover:scale-105"
          >
            <Video className="w-4 h-4" />
            <span>Muro de Videos de Amigos</span>
          </button>

          <button
            onClick={onScrollToWishes}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-semibold shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
          >
            <MessageCircleHeart className="w-4 h-4 text-slate-900" />
            <span>Pozo de Deseos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
