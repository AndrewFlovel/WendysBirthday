import React, { useState } from 'react';
import { X, Image, Sparkles, Save, RotateCcw, Check } from 'lucide-react';
import { Recuerdo } from '../types';
import { saveLocalMemories } from '../services/localDb';
import { RECUERDOS_INICIALES } from '../data/recuerdosIniciales';

interface MemoryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recuerdos: Recuerdo[];
  onSave: (recuerdos: Recuerdo[]) => void;
}

export const MemoryEditorModal: React.FC<MemoryEditorModalProps> = ({
  isOpen,
  onClose,
  recuerdos,
  onSave,
}) => {
  const [editedList, setEditedList] = useState<Recuerdo[]>(recuerdos);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const current = editedList[selectedIndex];

  const handleChange = (field: keyof Recuerdo, value: string) => {
    const updated = [...editedList];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      [field]: value,
    };
    setEditedList(updated);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          handleChange('imagenUrl', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    await saveLocalMemories(editedList);
    onSave(editedList);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetDefaults = async () => {
    if (window.confirm('¿Deseas restablecer los recuerdos y fotos predeterminados de Wendy?')) {
      setEditedList(RECUERDOS_INICIALES);
      await saveLocalMemories(RECUERDOS_INICIALES);
      onSave(RECUERDOS_INICIALES);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-3xl bg-slate-900 border-2 border-pink-400/40 rounded-3xl overflow-hidden shadow-2xl text-white my-6">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-600 to-amber-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display">
                Personalizar Fotos y Recuerdos de Wendy
              </h3>
              <p className="text-xs text-white/80">
                Modifica las fotografías, fechas y dedicatorias de cada caja de regalo
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Selector de Caja / Regalo */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
            {editedList.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedIndex === idx
                    ? 'bg-gradient-to-r from-pink-500 to-amber-400 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Regalo #{idx + 1}
              </button>
            ))}
          </div>

          {current && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Formulario */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-sky-200 font-semibold mb-1">Título del Recuerdo</label>
                  <input
                    type="text"
                    value={current.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-400 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sky-200 font-semibold mb-1">Fecha</label>
                    <input
                      type="text"
                      value={current.fecha}
                      onChange={(e) => handleChange('fecha', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-400 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sky-200 font-semibold mb-1">Color de la Caja</label>
                    <select
                      value={current.colorCaja}
                      onChange={(e) => handleChange('colorCaja', e.target.value as 'rosa' | 'celeste' | 'amarillo')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-400 text-white"
                    >
                      <option value="rosa">Rosa Pastel</option>
                      <option value="celeste">Celeste Cielo</option>
                      <option value="amarillo">Amarillo Sol</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-pink-200 font-semibold mb-1">Descripción de la Foto</label>
                  <textarea
                    rows={2}
                    value={current.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-400 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-200 font-semibold mb-1">Dedicatoria Emotiva</label>
                  <textarea
                    rows={3}
                    value={current.mensajeEmotivo}
                    onChange={(e) => handleChange('mensajeEmotivo', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-400 text-white resize-none"
                  />
                </div>
              </div>

              {/* Vista Previa y Carga de Imagen */}
              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Fotografía del Momento
                  </label>
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border-2 border-white/20 shadow-lg">
                    <img
                      src={current.imagenUrl}
                      alt={current.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] text-slate-400">
                    O pega el enlace directo de una foto (URL):
                  </label>
                  <input
                    type="url"
                    value={current.imagenUrl}
                    onChange={(e) => handleChange('imagenUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />

                  <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer border border-slate-700 transition-all text-sky-200">
                    <Image className="w-4 h-4" />
                    <span>Subir Foto desde tu Computadora</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Guardar y Reset */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer fotos originales</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Cancelar
              </button>

              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white shadow-lg transition-all"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
