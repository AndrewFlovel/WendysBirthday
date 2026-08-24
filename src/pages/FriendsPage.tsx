import React, { useState, useRef } from 'react';
import {
  Video,
  Upload,
  Camera,
  StopCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  PartyPopper,
  Music,
  VolumeX,
  Image as ImageIcon,
  HeartHandshake,
  Gift,
  Heart,
  MessageCircleHeart
} from 'lucide-react';
import { MensajeVideo, DeseoCumple, Recuerdo } from '../types';
import {
  uploadVideoGreeting,
  saveWishMessage,
  uploadMemoryGreeting
} from '../services/cloudStorage';
import { triggerGrandFinaleCelebration } from '../utils/confettiFX';
import { soundFX } from '../utils/soundFX';

interface FriendsPageProps {
  onVideoUploaded: (video: MensajeVideo) => void;
  onAddWish: (deseo: DeseoCumple) => void;
  onAddMemory: (recuerdo: Recuerdo) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

type TipoContribucion = 'video' | 'momento' | 'dedicatoria';

const STICKERS = ['🎉', '🎂', '💖', '⭐', '🌸', '👑', '🥳', '🎁', '✨', '💐'];

const COLOR_TEMAS = [
  { name: 'Rosa Pastel', class: 'bg-pink-900/30 border-pink-400/50 text-pink-100' },
  { name: 'Celeste Cielo', class: 'bg-sky-900/30 border-sky-400/50 text-sky-100' },
  { name: 'Dorado Sol', class: 'bg-yellow-900/30 border-yellow-400/50 text-yellow-100' },
];

export const FriendsPage: React.FC<FriendsPageProps> = ({
  onVideoUploaded,
  onAddWish,
  onAddMemory,
  isMusicPlaying,
  onToggleMusic,
}) => {
  // Selector principal del tipo de regalo
  const [tipoContribucion, setTipoContribucion] = useState<TipoContribucion>('video');

  // Estados comunes
  const [autor, setAutor] = useState('');
  const [parentesco, setParentesco] = useState('Mejor Amigo/a');
  const [mensaje, setMensaje] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState<TipoContribucion>('video');
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados de Video
  const [activeVideoTab, setActiveVideoTab] = useState<'archivo' | 'grabar'>('archivo');
  const [videoFile, setVideoFile] = useState<File | Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Estados de Momento / Foto
  const [tituloMomento, setTituloMomento] = useState('');
  const [fechaMomento, setFechaMomento] = useState('2026');
  const [colorCaja, setColorCaja] = useState<'rosa' | 'celeste' | 'amarillo'>('rosa');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string>('');
  const [fotoUrlInput, setFotoUrlInput] = useState('');

  // Estados de Dedicatoria / Deseo
  const [selectedSticker, setSelectedSticker] = useState('💖');
  const [selectedTemaIndex, setSelectedTemaIndex] = useState(0);

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

  // --- Handlers de Video ---
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch {
      setErrorMsg('No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar los permisos necesarios.');
    }
  };

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

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  const handleVideoTabChange = (tab: 'archivo' | 'grabar') => {
    setActiveVideoTab(tab);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    stopCamera();
    if (tab === 'grabar') {
      setTimeout(() => startCamera(), 200);
    }
  };

  // --- Handlers de Foto ---
  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFotoPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Envío del Formulario ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim()) {
      setErrorMsg('Por favor escribe tu nombre.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      if (tipoContribucion === 'video') {
        if (!videoFile) {
          setErrorMsg('Por favor selecciona o graba un video para Wendy.');
          setIsUploading(false);
          return;
        }

        const resultVideo = await uploadVideoGreeting(
          {
            autor: autor.trim(),
            parentesco: parentesco.trim(),
            mensaje: mensaje.trim() || '¡Muchas felicidades en tu cumpleaños Wendy hermosa!',
            videoFile,
            tipo: activeVideoTab === 'grabar' ? 'grabado' : 'archivo',
          },
          (progress) => setUploadProgress(progress)
        );

        if (mensaje.trim()) {
          const nuevoDeseo: DeseoCumple = {
            id: 'wish-' + Date.now(),
            nombre: autor.trim(),
            parentesco: parentesco.trim(),
            mensaje: mensaje.trim(),
            sticker: selectedSticker,
            colorFondo: COLOR_TEMAS[selectedTemaIndex].class,
            fecha: 'Recién publicado',
          };
          await saveWishMessage(nuevoDeseo);
          onAddWish(nuevoDeseo);
        }

        onVideoUploaded(resultVideo);
      } else if (tipoContribucion === 'momento') {
        const finalUrl = fotoPreviewUrl || fotoUrlInput.trim();
        if (!finalUrl && !fotoFile) {
          setErrorMsg('Por favor sube una fotografía del momento o escribe el enlace.');
          setIsUploading(false);
          return;
        }

        const nuevoRecuerdo = await uploadMemoryGreeting(
          {
            autor: autor.trim(),
            titulo: tituloMomento.trim() || `Recuerdo con ${autor.trim()}`,
            fecha: fechaMomento.trim() || '2026',
            descripcion: mensaje.trim() || `Un momento muy especial con ${autor.trim()}`,
            mensajeEmotivo: mensaje.trim() || '¡Que la vida nos siga regalando instantes mágicos juntos!',
            colorCaja,
            imageFile: fotoFile || undefined,
            imageUrl: finalUrl,
          },
          (progress) => setUploadProgress(progress)
        );

        onAddMemory(nuevoRecuerdo);
      } else if (tipoContribucion === 'dedicatoria') {
        if (!mensaje.trim()) {
          setErrorMsg('Por favor escribe tu dedicatoria para Wendy.');
          setIsUploading(false);
          return;
        }

        const nuevoDeseo: DeseoCumple = {
          id: 'wish-' + Date.now(),
          nombre: autor.trim(),
          parentesco: parentesco.trim(),
          mensaje: mensaje.trim(),
          sticker: selectedSticker,
          colorFondo: COLOR_TEMAS[selectedTemaIndex].class,
          fecha: 'Recién publicado',
        };
        await saveWishMessage(nuevoDeseo);
        onAddWish(nuevoDeseo);
      }

      soundFX.playSparkle();
      triggerGrandFinaleCelebration();
      setSubmittedType(tipoContribucion);
      setIsSubmitted(true);
      setIsUploading(false);
    } catch {
      setIsUploading(false);
      setErrorMsg('Hubo un problema al guardar tu felicitación. Inténtalo de nuevo.');
    }
  };

  const handleResetForAnother = () => {
    setIsSubmitted(false);
    setMensaje('');
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setFotoFile(null);
    setFotoPreviewUrl('');
    setFotoUrlInput('');
    setTituloMomento('');
    setActiveVideoTab('archivo');
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/amigos&familia`;
    const shareText = `¡Hola! Estamos reuniendo videos, fotos y dedicatorias sorpresa para el cumpleaños de Sussan Wendy Molina Guzman 🎂✨ Sube tu felicitación aquí: ${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      soundFX.playSparkle();
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-3 px-3 sm:py-6 sm:px-4 max-w-3xl mx-auto flex flex-col justify-between">
      {/* Barra superior limpia y compacta */}
      <header className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <PartyPopper className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-sky-200">
            Sorpresa de Cumpleaños
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Música */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isMusicPlaying
                ? 'bg-pink-500 text-white shadow-sm'
                : 'glass-panel text-slate-300 hover:text-white'
            }`}
            title={isMusicPlaying ? 'Silenciar música' : 'Activar música'}
          >
            {isMusicPlaying ? <Music className="w-3 h-3 animate-bounce" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden xs:inline">{isMusicPlaying ? 'Música' : 'Silencio'}</span>
          </button>

          {/* Botón Copiar Enlace */}
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white shadow-sm transition-all hover:scale-105"
            title="Compartir con otros amigos y familiares"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
            <span>{copiedLink ? '¡Copiado!' : 'Compartir 📲'}</span>
          </button>
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="my-3 sm:my-6">
        {!isSubmitted ? (
          <div className="space-y-3 sm:space-y-5">
            {/* Encabezado */}
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-[11px] sm:text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>🤫 ¡Misión Sorpresa Secreta!</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                Deja tu Regalo para{' '}
                <span className="glow-wendy-name block sm:inline">Sussan Wendy</span> 🎂✨
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Elige qué te gustaría regalarle: un saludo en video, una fotografía de un momento especial o una hermosa dedicatoria escrita.
              </p>
            </div>

            {/* SELECTOR PRINCIPAL DE CONTRIBUCIÓN (Tabs: Video / Momento / Dedicatoria) */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-xl mx-auto shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setTipoContribucion('video');
                  stopCamera();
                }}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[46px] ${
                  tipoContribucion === 'video'
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Video Saludo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoContribucion('momento');
                  stopCamera();
                }}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[46px] ${
                  tipoContribucion === 'momento'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Momento / Foto</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoContribucion('dedicatoria');
                  stopCamera();
                }}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all min-h-[46px] ${
                  tipoContribucion === 'dedicatoria'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <MessageCircleHeart className="w-4 h-4 shrink-0" />
                <span>Dedicatoria</span>
              </button>
            </div>

            {/* Tarjeta del Formulario Dinámico */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-sky-400/40 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400/15 rounded-full blur-2xl pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Campos Comunes: Nombre y Parentesco */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-sky-200 mb-1">
                      Tu Nombre Completo <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      placeholder="Ej. Sofía Mendoza"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white placeholder-slate-500 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sky-200 mb-1">
                      ¿Qué eres de Wendy?
                    </label>
                    <select
                      value={parentesco}
                      onChange={(e) => setParentesco(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white shadow-inner"
                    >
                      {parentescoOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ================= SECCIÓN 1: VIDEO SALUDO ================= */}
                {tipoContribucion === 'video' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-pink-200 mb-1">
                        Tu Dedicatoria Escrita (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="¡Wendy hermosa, te deseo el mejor cumpleaños del mundo!..."
                        className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-pink-400 focus:outline-none text-white placeholder-slate-500 resize-none shadow-inner"
                      />
                    </div>

                    {/* Selector de Método de Video */}
                    <div className="flex border border-slate-700 bg-slate-950/80 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleVideoTabChange('archivo')}
                        className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg min-h-[40px] flex items-center justify-center gap-1.5 transition-all ${
                          activeVideoTab === 'archivo'
                            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Archivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVideoTabChange('grabar')}
                        className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg min-h-[40px] flex items-center justify-center gap-1.5 transition-all ${
                          activeVideoTab === 'grabar'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Grabar en Vivo</span>
                      </button>
                    </div>

                    {/* Área de Grabación o Subida */}
                    <div className="rounded-xl border border-dashed border-slate-700 p-3 sm:p-4 bg-slate-950/60 text-center">
                      {activeVideoTab === 'archivo' && (
                        <div>
                          {!videoPreviewUrl ? (
                            <label className="flex flex-col items-center justify-center cursor-pointer py-4 group">
                              <Upload className="w-8 h-8 text-sky-400 group-hover:scale-110 transition-transform mb-1.5" />
                              <span className="text-xs sm:text-sm font-bold text-slate-200">
                                Toca aquí para seleccionar tu video
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5">
                                Formatos: MP4, WebM, MOV
                              </span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileChange}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="space-y-2">
                              <video
                                src={videoPreviewUrl}
                                controls
                                className="w-full max-h-48 sm:max-h-56 rounded-xl bg-black mx-auto shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setVideoFile(null);
                                  setVideoPreviewUrl(null);
                                }}
                                className="text-xs text-pink-400 hover:text-pink-300 underline"
                              >
                                Elegir otro video
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {activeVideoTab === 'grabar' && (
                        <div>
                          {!videoPreviewUrl ? (
                            <div className="space-y-3">
                              <div className="relative w-full max-h-48 sm:max-h-56 rounded-xl bg-black overflow-hidden mx-auto flex items-center justify-center shadow-lg">
                                <video
                                  ref={liveVideoRef}
                                  autoPlay
                                  muted
                                  playsInline
                                  className="w-full h-44 sm:h-52 object-cover"
                                />
                                {isRecording && (
                                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold animate-pulse shadow-md">
                                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                    <span>REC {recordingTime}s</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                {!isRecording ? (
                                  <button
                                    type="button"
                                    onClick={startRecording}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-lg transition-all min-h-[44px]"
                                  >
                                    <Camera className="w-4 h-4" />
                                    <span>Iniciar Grabación</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-white text-slate-900 text-xs sm:text-sm font-bold shadow-lg transition-all animate-pulse min-h-[44px]"
                                  >
                                    <StopCircle className="w-4 h-4 text-red-600" />
                                    <span>Detener ({recordingTime}s)</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <video
                                src={videoPreviewUrl}
                                controls
                                className="w-full max-h-48 sm:max-h-56 rounded-xl bg-black mx-auto shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setVideoFile(null);
                                  setVideoPreviewUrl(null);
                                  startCamera();
                                }}
                                className="text-xs text-pink-400 hover:text-pink-300 underline flex items-center justify-center gap-1 mx-auto"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Grabar otro video</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ================= SECCIÓN 2: MOMENTO / FOTO ================= */}
                {tipoContribucion === 'momento' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-pink-200 mb-1">
                          Título del Momento o Aventura <span className="text-pink-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={tituloMomento}
                          onChange={(e) => setTituloMomento(e.target.value)}
                          placeholder="Ej. Tarde de Café y Risas en el Centro"
                          className="w-full px-3 py-2 text-base sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-pink-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-pink-200 mb-1">
                          Fecha / Año
                        </label>
                        <input
                          type="text"
                          value={fechaMomento}
                          onChange={(e) => setFechaMomento(e.target.value)}
                          placeholder="Ej. Verano 2025"
                          className="w-full px-3 py-2 text-base sm:text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-pink-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-pink-200 mb-1">
                        Color de la Caja de Regalo Mágica
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setColorCaja('rosa')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            colorCaja === 'rosa'
                              ? 'bg-pink-600 border-pink-300 text-white shadow-md'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          🌸 Rosa Pastel
                        </button>
                        <button
                          type="button"
                          onClick={() => setColorCaja('celeste')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            colorCaja === 'celeste'
                              ? 'bg-sky-600 border-sky-300 text-white shadow-md'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          💎 Celeste Cielo
                        </button>
                        <button
                          type="button"
                          onClick={() => setColorCaja('amarillo')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            colorCaja === 'amarillo'
                              ? 'bg-amber-500 border-yellow-300 text-slate-950 shadow-md'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          ⭐ Amarillo Sol
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-pink-200 mb-1">
                        Historia o Dedicatoria para Wendy en este Recuerdo
                      </label>
                      <textarea
                        rows={2}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Cuenta la anécdota o lo mucho que significa esta foto para ti..."
                        className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-pink-400 text-white resize-none"
                      />
                    </div>

                    {/* Subida de Fotografía */}
                    <div className="rounded-xl border border-dashed border-slate-700 p-3.5 bg-slate-950/60 text-center space-y-2.5">
                      {fotoPreviewUrl ? (
                        <div className="space-y-2">
                          <img
                            src={fotoPreviewUrl}
                            alt="Vista previa"
                            className="max-h-48 rounded-xl object-contain mx-auto shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFotoFile(null);
                              setFotoPreviewUrl('');
                            }}
                            className="text-xs text-pink-400 hover:text-pink-300 underline"
                          >
                            Cambiar imagen
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer py-4 group">
                          <ImageIcon className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform mb-1" />
                          <span className="text-xs sm:text-sm font-bold text-slate-200">
                            Toca aquí para seleccionar una Fotografía
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Formatos: JPG, PNG, WEBP desde tu celular o computadora
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFotoFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= SECCIÓN 3: SOLO DEDICATORIA ================= */}
                {tipoContribucion === 'dedicatoria' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-yellow-200 mb-1">
                        Tu Dedicatoria o Deseo de Cumpleaños <span className="text-pink-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="¡Wendy hermosa, te deseo un año lleno de éxitos, felicidad y mucho amor!..."
                        className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-yellow-400 text-white resize-none shadow-inner"
                      />
                    </div>

                    {/* Selector de Sticker */}
                    <div>
                      <label className="block text-xs font-semibold text-yellow-200 mb-1">
                        Elige un Sticker Decorativo
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {STICKERS.map((stk) => (
                          <button
                            key={stk}
                            type="button"
                            onClick={() => setSelectedSticker(stk)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-base sm:text-lg flex items-center justify-center transition-all ${
                              selectedSticker === stk
                                ? 'bg-yellow-400 scale-110 shadow-md ring-2 ring-yellow-200'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                          >
                            {stk}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de Color de Tarjeta */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                  </div>
                )}

                {/* Barra de progreso durante la subida */}
                {isUploading && (
                  <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs text-sky-200 font-semibold">
                      <span>Guardando tu sorpresa para Wendy...</span>
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

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 sm:py-3.5 rounded-xl min-h-[48px] font-bold text-sm sm:text-base bg-gradient-to-r from-sky-500 via-pink-500 to-yellow-400 hover:from-sky-600 hover:via-pink-600 hover:to-yellow-500 text-white shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>
                    {isUploading
                      ? 'Guardando...'
                      : tipoContribucion === 'video'
                      ? '¡Enviar mi Video Saludo! 🎥✨'
                      : tipoContribucion === 'momento'
                      ? '¡Añadir Momento a las Cajas! 🎁✨'
                      : '¡Publicar Dedicatoria en el Pozo! 💌✨'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Pantalla de Agradecimiento y Confirmación Dinámica */
          <div className="max-w-md mx-auto glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-pink-400/50 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-sky-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-slate-950" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-yellow-300">
                ¡Sorpresa Guardada con Éxito!
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                ¡Muchas Gracias, {autor}! 💖✨
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                {submittedType === 'video' &&
                  'Tu video de felicitación y saludo se ha guardado con éxito. Se revelará en la celebración de Wendy.'}
                {submittedType === 'momento' &&
                  'Tu fotografía y momento especial han sido agregados a las cajas mágicas de recuerdos para Wendy.'}
                {submittedType === 'dedicatoria' &&
                  'Tu dedicatoria y bendiciones ya están publicadas en el Pozo de los Deseos.'}
              </p>
            </div>

            {/* Acciones tras enviar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleCopyShareLink}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-sky-500 text-white shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Invitar a más amigos 📲'}</span>
              </button>

              <button
                onClick={handleResetForAnother}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs glass-panel hover:bg-white/20 text-slate-200 transition-all min-h-[44px]"
              >
                Enviar otra sorpresa
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pie de página limpio y compacto */}
      <footer className="text-center text-[11px] text-slate-500 pt-3">
        Homenaje especial para <strong className="text-pink-300">Sussan Wendy Molina Guzman</strong> ✨
      </footer>
    </div>
  );
};
