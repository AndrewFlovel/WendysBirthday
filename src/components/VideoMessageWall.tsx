import React, { useState } from 'react';
import { Video, Play, Plus, Heart, Sparkles, User, Calendar, Cloud, HardDrive } from 'lucide-react';
import { MensajeVideo } from '../types';
import { triggerGiftBurst } from '../utils/confettiFX';

interface VideoMessageWallProps {
  videos: MensajeVideo[];
  onOpenUpload: () => void;
}

export const VideoMessageWall: React.FC<VideoMessageWallProps> = ({
  videos,
  onOpenUpload,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<MensajeVideo | null>(null);
  const [filter, setFilter] = useState('todos');

  const categories = ['todos', 'Familia', 'Mejores Amigos', 'Amigo/a'];

  const filteredVideos = videos.filter((v) => {
    if (filter === 'todos') return true;
    return v.parentesco.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <section id="seccion-videos" className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
      {/* Cabecera de la Sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-sm font-medium mb-3">
            <Video className="w-4 h-4 text-sky-300" />
            <span>Muro de Saludos en Video</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Felicitaciones de Amigos y Familiares
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl">
            Cada video es un abrazo sincero grabado especialmente para Wendy. ¡Toca reproducir y siente todo el amor que te rodea!
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/?subir=video`;
              const text = `¡Hola! Estamos reuniendo videos y saludos sorpresa para el cumpleaños de Sussan Wendy Molina Guzman 🎂✨ Sube tu felicitación aquí: ${shareUrl}`;
              if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
                alert('¡Enlace copiado al portapapeles! Listo para enviar a amigos y familiares 📲');
              }
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-xs glass-panel hover:bg-white/20 text-sky-200 border border-sky-400/40 shadow-lg hover:scale-105 transition-all"
          >
            <span>📲 Copiar Enlace para Amigos</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-400 via-pink-500 to-yellow-400 hover:from-sky-500 hover:via-pink-600 hover:to-yellow-500 text-white shadow-xl shadow-pink-500/20 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>¡Subir o Grabar Video! 🎥</span>
          </button>
        </div>
      </div>

      {/* Galería de Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedVideo(item)}
            className="glass-panel group rounded-3xl overflow-hidden cursor-pointer hover:border-pink-400/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col"
          >
            {/* Contenedor del Video / Thumbnail */}
            <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
              {item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-sky-900/40 flex items-center justify-center">
                  <Video className="w-12 h-12 text-slate-400" />
                </div>
              )}

              {/* Overlay oscuro y botón de Play */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-pink-500 transition-all">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Badge de Parentesco */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/90 text-white shadow-md">
                  {item.parentesco || 'Amigo/a'}
                </span>
              </div>

              {/* Badge de Origen (Nube vs Local) */}
              <div className="absolute top-3 right-3">
                {item.origen === 'nube' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/80 text-white backdrop-blur-sm">
                    <Cloud className="w-3 h-3" /> Nube
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/80 text-slate-200 backdrop-blur-sm">
                    <HardDrive className="w-3 h-3" /> Local
                  </span>
                )}
              </div>
            </div>

            {/* Información del Autor y Mensaje */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-transparent to-black/30">
              <div>
                <div className="flex items-center gap-2 text-yellow-300 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mensaje de Felicitación</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                  {item.autor}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 italic">
                  "{item.mensaje}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <span>Toca para ver completo</span>
                <Heart className="w-3.5 h-3.5 text-pink-400 group-hover:fill-pink-400 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Reproducción de Video */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-3xl bg-slate-900 border-2 border-pink-400/50 rounded-3xl overflow-hidden shadow-2xl text-white">
            {/* Barra superior */}
            <div className="p-4 px-6 bg-gradient-to-r from-sky-600 via-pink-600 to-yellow-500 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-white/80">
                  {selectedVideo.parentesco}
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  {selectedVideo.autor}
                </h3>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Reproductor de Video */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Mensaje escrito completo */}
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                  <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                  <span>Dedicatoria:</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{selectedVideo.mensaje}"
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    triggerGiftBurst();
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>¡Enviar Amor a {selectedVideo.autor}! 💖</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
