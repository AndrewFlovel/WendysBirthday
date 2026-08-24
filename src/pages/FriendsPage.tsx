import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Upload,
  Camera,
  StopCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Heart,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  PartyPopper,
  Users,
  Film
} from 'lucide-react';
import { VideoMessageWall } from '../components/VideoMessageWall';
import { WishingWell } from '../components/WishingWell';
import { MensajeVideo, DeseoCumple } from '../types';
import { uploadVideoGreeting } from '../services/cloudStorage';
import { triggerGiftBurst, triggerGrandFinaleCelebration } from '../utils/confettiFX';
import { soundFX } from '../utils/soundFX';

interface FriendsPageProps {
  videos: MensajeVideo[];
  deseos: DeseoCumple[];
  onVideoUploaded: (video: MensajeVideo) => void;
  onAddWish: (deseo: DeseoCumple) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
  videos,
  deseos,
  onVideoUploaded,
  onAddWish,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [activeTab, setActiveTab] = useState<'archivo' | 'grabar'>('archivo');
  const [autor, setAutor] = useState('');
  const [parentesco, setParentesco] = useState('Mejor Amigo/a');
  const [mensaje, setMensaje] = useState('');
  const [videoFile, setVideoFile] = useState<File | Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // Estados de grabación
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Estados de subida
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const parentescoOptions = [
    'Mejor Amigo/a',
    'Amigo/a de la Vida',
    'Hermano/a',
    'Primo/a',
    'Mamá / Papá',
    'Tío/a',
    'Compañero/a de Estudio / Trabajo',
    'Ser Querido Especial',
  ];

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        setErrorMsg('Por favor selecciona un archivo de video válido (MP4, WebM, MOV).');
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Iniciar cámara para grabar
  const startCamera = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });
      videoStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play();
      }
    } catch (err) {
      setErrorMsg('No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar los permisos en tu navegador.');
    }
  };

  // Iniciar grabación
  const startRecording = () => {
    if (!videoStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingTime(0);

    try {
      const mediaRecorder = new MediaRecorder(videoStreamRef.current, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setVideoFile(blob);
        setVideoPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      };

      mediaRecorder.start(200);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      setErrorMsg('Error al inicializar la grabadora de video.');
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  const handleTabChange = (tab: 'archivo' | 'grabar') => {
    setActiveTab(tab);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    stopCamera();
    if (tab === 'grabar') {
      setTimeout(() => startCamera(), 200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim()) {
      setErrorMsg('Por favor escribe tu nombre.');
      return;
    }
    if (!videoFile) {
      setErrorMsg('Por favor selecciona o graba un video para Wendy.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const result = await uploadVideoGreeting(
        {
          autor: autor.trim(),
          parentesco: parentesco.trim(),
          mensaje: mensaje.trim() || '¡Muchas felicidades en tu cumpleaños Wendy hermosa!',
          videoFile,
          tipo: activeTab === 'grabar' ? 'grabado' : 'archivo',
        },
        (progress) => setUploadProgress(progress)
      );

      setSuccess(true);
      soundFX.playSparkle();
      triggerGrandFinaleCelebration();
      onVideoUploaded(result);

      setTimeout(() => {
        setIsUploading(false);
        setSuccess(false);
        setAutor('');
        setMensaje('');
        setVideoFile(null);
        setVideoPreviewUrl(null);
      }, 2500);
    } catch (err) {
      setIsUploading(false);
      setErrorMsg('Hubo un error al guardar tu video. Inténtalo nuevamente.');
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/amigos&familia`;
    const message = `¡Hola! Estamos reuniendo videos y mensajes sorpresa para el cumpleaños de Sussan Wendy Molina Guzman 🎂✨ Sube tu felicitación aquí: ${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopiedLink(true);
      soundFX.playSparkle();
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-6xl mx-auto space-y-12">
      {/* Barra superior de navegación */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-slate-200 hover:text-white hover:bg-white/20 text-xs sm:text-sm font-semibold transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          <span>← Volver a la Celebración Principal</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white shadow-lg transition-all hover:scale-105"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace para Amigos 📲'}</span>
          </button>
        </div>
      </div>

      {/* Hero Principal de la Página de Amigos y Familiares */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Portal Exclusivo de Amigos & Familiares</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white leading-tight">
          ¡Sube tu Felicitación para{' '}
          <span className="glow-wendy-name block sm:inline">Sussan Wendy</span>! ✨💖
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          Queremos llenar su día de abrazos, sonrisas y momentos inolvidables. Graba un saludo con tu cámara o sube un video desde tu galería para que Wendy lo descubra en su fiesta de cumpleaños.
        </p>
      </div>

      {/* Formulario Principal de Carga y Grabación (Tarjeta Destacada) */}
      <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border-2 border-sky-400/50 shadow-2xl relative overflow-hidden">
        {/* Adorno resplandeciente */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-pink-500 shadow-md">
              <Video className="w-5 h-5 text-white" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Enviar Video Saludo
              </h2>
              <span className="text-xs text-sky-200">
                Paso 1: Graba o selecciona tu video • Paso 2: Envía tu dedicatoria
              </span>
            </div>
          </div>
        </div>

        {/* Selector de Método: Subir Archivo vs Grabar con Cámara */}
        <div className="flex border border-slate-700 bg-slate-950/80 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('archivo')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'archivo'
                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Subir Archivo de Video</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('grabar')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'grabar'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Grabar en Vivo con Cámara</span>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Datos del Amigo / Familiar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sky-200 mb-1.5">
                Tu Nombre Completo <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ej. Sofía Mendoza"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white placeholder-slate-500 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-200 mb-1.5">
                ¿Qué eres de Wendy?
              </label>
              <select
                value={parentesco}
                onChange={(e) => setParentesco(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white shadow-inner"
              >
                {parentescoOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mensaje de Texto */}
          <div>
            <label className="block text-xs font-bold text-pink-200 mb-1.5">
              Tu Dedicatoria Escrita para Wendy
            </label>
            <textarea
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¡Wendy hermosa, te deseo un año lleno de sonrisas, salud y bendiciones infinitas!..."
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-pink-400 focus:outline-none text-white placeholder-slate-500 resize-none shadow-inner"
            />
          </div>

          {/* Área de Archivo o Grabación */}
          <div className="rounded-2xl border-2 border-dashed border-slate-700 p-5 bg-slate-950/60 text-center">
            {activeTab === 'archivo' && (
              <div>
                {!videoPreviewUrl ? (
                  <label className="flex flex-col items-center justify-center cursor-pointer py-8 group">
                    <Upload className="w-12 h-12 text-sky-400 group-hover:scale-110 transition-transform mb-3" />
                    <span className="text-sm sm:text-base font-bold text-slate-200">
                      Toca aquí para seleccionar tu video
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Formatos soportados: MP4, WebM, MOV desde tu galería o archivos
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-3">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full max-h-60 rounded-xl bg-black mx-auto shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                      }}
                      className="text-xs text-pink-400 hover:text-pink-300 underline"
                    >
                      Elegir otro video diferente
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'grabar' && (
              <div>
                {!videoPreviewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-h-64 rounded-2xl bg-black overflow-hidden mx-auto flex items-center justify-center shadow-2xl">
                      <video
                        ref={liveVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-56 object-cover"
                      />
                      {isRecording && (
                        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse shadow-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                          <span>GRABANDO {recordingTime}s</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-xl transition-all hover:scale-105"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Iniciar Grabación</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-white text-slate-900 text-sm font-bold shadow-xl transition-all animate-pulse"
                        >
                          <StopCircle className="w-5 h-5 text-red-600" />
                          <span>Detener Grabación ({recordingTime}s)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full max-h-60 rounded-xl bg-black mx-auto shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                        startCamera();
                      }}
                      className="text-xs text-pink-400 hover:text-pink-300 underline flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Grabar otro video</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progreso de Subida */}
          {isUploading && (
            <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs text-sky-200">
                <span>Guardando tu felicitación para Wendy...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-pink-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm font-bold animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>¡Tu video de felicitación ha sido enviado con éxito! 🎉✨</span>
            </div>
          )}

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isUploading || !videoFile}
            className="w-full py-4 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-sky-500 via-pink-500 to-yellow-400 hover:from-sky-600 hover:via-pink-600 hover:to-yellow-500 text-white shadow-xl shadow-pink-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>{isUploading ? 'Enviando Felicitación...' : '¡Enviar Felicitación para Wendy! ✨🎂'}</span>
          </button>
        </form>
      </div>

      {/* Muro de Videos de Amigos ya enviados */}
      <VideoMessageWall
        videos={videos}
        onOpenUpload={() => {
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }}
      />

      {/* Pozo de Deseos (Libro de Visitas con Stickers) */}
      <WishingWell
        deseos={deseos}
        onAddWish={onAddWish}
      />
    </div>
  );
};
