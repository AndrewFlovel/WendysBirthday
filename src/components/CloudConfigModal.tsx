import React, { useState } from 'react';
import { X, Cloud, Key, Check, Copy, ExternalLink, HelpCircle, ShieldCheck, Database } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, SUPABASE_SQL_SETUP } from '../services/cloudStorage';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && anonKey) {
      saveSupabaseConfig(url, anonKey);
      setSavedSuccess(true);
      onConfigUpdated();
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    onConfigUpdated();
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border-2 border-sky-400/40 rounded-3xl overflow-hidden shadow-2xl text-white my-6">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-600 to-indigo-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20">
              <Cloud className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display">
                Sincronización en la Nube (Vercel & Supabase)
              </h3>
              <p className="text-xs text-sky-100">
                Permite que amigos y familiares suban videos desde cualquier lugar
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Estado de Conexión */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${currentConfig.conectado ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <div>
                <span className="font-bold text-white block">
                  Estado: {currentConfig.conectado ? '🟢 Conectado a la Nube (Supabase)' : '🟡 Modo Local / Demostración (IndexedDB)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentConfig.conectado
                    ? 'Los videos subidos por amigos se guardan en la nube y se sincronizan en tiempo real en Vercel.'
                    : 'Los videos y recuerdos se guardan en este dispositivo. Para sincronizar con todos tus amigos en Vercel, conecta Supabase (gratis).'}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de Credenciales */}
          <form onSubmit={handleSave} className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-bold text-sky-200 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-sky-400" />
              <span>Conectar Proyecto Supabase (Gratuito)</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 focus:border-sky-400 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 focus:border-sky-400 text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Restablecer a modo local
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-lg transition-all"
              >
                {savedSuccess ? '¡Guardado con éxito! ✓' : 'Guardar y Conectar Nube ✨'}
              </button>
            </div>
          </form>

          {/* Guía Rápida de Configuración en 2 Pasos */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>Configuración en Supabase (1 Minuto)</span>
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
              <li>
                Crea un proyecto gratis en{' '}
                <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-300 underline inline-flex items-center gap-0.5">
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>
                Ve a la pestaña <strong>SQL Editor</strong> en Supabase, pega el siguiente script y haz clic en <strong>Run</strong>:
              </li>
            </ol>

            <button
              onClick={copySql}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-yellow-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? '¡Script SQL Copiado al portapapeles!' : 'Copiar Script SQL de Tablas y Storage'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
