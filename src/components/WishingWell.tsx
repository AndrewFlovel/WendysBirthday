import React, { useState } from 'react';
import { MessageCircleHeart, Send, Sparkles, Heart, Star, PartyPopper } from 'lucide-react';
import { DeseoCumple } from '../types';
import { saveWishMessage } from '../services/cloudStorage';
import { triggerGiftBurst } from '../utils/confettiFX';
import { soundFX } from '../utils/soundFX';

interface WishingWellProps {
  deseos: DeseoCumple[];
  onAddWish: (deseo: DeseoCumple) => void;
}

const STICKERS = ['🎉', '🎂', '💖', '⭐', '🌸', '👑', '🥳', '🎁', '✨', '💐'];

const COLOR_TEMAS = [
  { name: 'Rosa Pastel', bg: 'bg-pink-900/30 border-pink-400/50 text-pink-100', badge: 'bg-pink-500' },
  { name: 'Celeste Cielo', bg: 'bg-sky-900/30 border-sky-400/50 text-sky-100', badge: 'bg-sky-500' },
  { name: 'Amarillo Sol', bg: 'bg-yellow-900/30 border-yellow-400/50 text-yellow-100', badge: 'bg-amber-500' },
];

export const WishingWell: React.FC<WishingWellProps> = ({ deseos, onAddWish }) => {
  const [nombre, setNombre] = useState('');
  const [parentesco, setParentesco] = useState('Amigo/a');
  const [mensaje, setMensaje] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('💖');
  const [selectedTemaIndex, setSelectedTemaIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim()) return;

    setIsSubmitting(true);
    const nuevoDeseo: DeseoCumple = {
      id: 'wish-' + Date.now(),
      nombre: nombre.trim(),
      parentesco: parentesco.trim(),
      mensaje: mensaje.trim(),
      sticker: selectedSticker,
      colorFondo: COLOR_TEMAS[selectedTemaIndex].bg,
      fecha: 'Justo ahora',
    };

    await saveWishMessage(nuevoDeseo);
    onAddWish(nuevoDeseo);
    soundFX.playSparkle();
    triggerGiftBurst();

    setNombre('');
    setMensaje('');
    setIsSubmitting(false);
  };

  return (
    <section id="seccion-deseos" className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
      {/* Cabecera */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 text-sm font-medium mb-3">
          <MessageCircleHeart className="w-4 h-4 text-yellow-300" />
          <span>Libro de Firmas y Deseos</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">
          El Pozo de los Deseos para Wendy
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Escribe tus bendiciones, anécdotas y palabras de cariño para que Wendy las guarde por siempre en su corazón.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario para dejar un deseo */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border-2 border-yellow-400/30 shadow-2xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Dedicar unas palabras ✨</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Tu Nombre <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Gabriel"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-yellow-400 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Parentesco / Amistad
                </label>
                <input
                  type="text"
                  value={parentesco}
                  onChange={(e) => setParentesco(e.target.value)}
                  placeholder="Ej. Primo / Hermana"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-yellow-400 focus:outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Tu Mensaje de Felicitación <span className="text-pink-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¡Querida Wendy, te deseo el mejor cumpleaños del mundo!..."
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-pink-400 focus:outline-none text-white resize-none"
              />
            </div>

            {/* Selector de Sticker */}
            <div>
              <label className="block text-xs font-semibold text-yellow-200 mb-1.5">
                Elige un Sticker Decorativo
              </label>
              <div className="flex flex-wrap gap-2">
                {STICKERS.map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setSelectedSticker(stk)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedSticker === stk
                        ? 'bg-yellow-400 scale-110 shadow-lg ring-2 ring-yellow-200'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Color de la Tarjeta
              </label>
              <div className="flex gap-2">
                {COLOR_TEMAS.map((tema, i) => (
                  <button
                    key={tema.name}
                    type="button"
                    onClick={() => setSelectedTemaIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedTemaIndex === i
                        ? 'border-white bg-white/20 text-white font-bold'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    {tema.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !nombre.trim() || !mensaje.trim()}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-400 via-pink-500 to-sky-400 hover:from-yellow-500 hover:via-pink-600 hover:to-sky-500 text-white shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-4 h-4" />
              <span>Publicar Deseo en el Pozo ✨</span>
            </button>
          </form>
        </div>

        {/* Lista de deseos publicados */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
          {deseos.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 ${
                item.colorFondo || 'bg-pink-900/30 border-pink-400/50 text-pink-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{item.sticker || '💖'}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                  {item.parentesco || 'Amigo/a'}
                </span>
              </div>

              <p className="text-sm font-medium text-white/90 leading-relaxed italic mb-3">
                "{item.mensaje}"
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <strong className="text-yellow-300 font-bold">{item.nombre}</strong>
                <span>{item.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
