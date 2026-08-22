import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Video, Camera, StopCircle, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadVideoGreeting } from '../services/cloudStorage';
import { MensajeVideo } from '../types';
import { triggerGiftBurst } from '../utils/confettiFX';
import { soundFX } from '../utils/soundFX';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded: (video: MensajeVideo) => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onVideoUploaded,
}) => {
  const [activeTab, setActiveTab] = useState<'archivo' | 'grabar'>('archivo');
  const [autor, setAutor] = useState('');
  const [parentesco, setParentesco] = useState('Amigo/a');
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

  // Opciones de parentesco comunes
  const parentescoOptions = [
    'Mejor Amigo/a',
    'Amigo/a',
    'Hermano/a',
    'Primo/a',
    'Mamá / Papá',
    'Tío/a',
    'Compañero/a de Trabajo / Uni',
    'Otro Ser Querido',
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
      setErrorMsg('No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar los permisos necesarios.');
    }
  };

  // Iniciar grabación en vivo
  const startRecording = () => {
    if (!videoStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingTime(0);

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
  };

  // Detener grabación en vivo
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
          mensaje: mensaje.trim() || '¡Muchas felicidades en tu cumpleaños Wendy!',
          videoFile,
          tipo: activeTab === 'grabar' ? 'grabado' : 'archivo',
        },
        (progress) => setUploadProgress(progress)
      );

      setSuccess(true);
      soundFX.playSparkle();
      triggerGiftBurst();
      onVideoUploaded(result);

      setTimeout(() => {
        setIsUploading(false);
        setSuccess(false);
        onClose();
        // Reset form
        setAutor('');
        setMensaje('');
        setVideoFile(null);
        setVideoPreviewUrl(null);
      }, 1500);
    } catch (err) {
      setIsUploading(false);
      setErrorMsg('Hubo un error al guardar tu video. Inténtalo nuevamente.');
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Fondo oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative z-10 w-full max-w-xl bg-slate-900 border-2 border-sky-400/40 rounded-3xl shadow-2xl overflow-hidden text-white my-6"
        >
          {/* Cabecera */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-600 via-pink-600 to-yellow-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Video className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display">
                  Graba o Sube tu Felicitación en Video
                </h3>
                <p className="text-xs text-white/80">
                  Un saludo inolvidable para Sussan Wendy Molina Guzman
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de Pestañas: Archivo vs Grabar con Cámara */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => handleTabChange('archivo')}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'archivo'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Subir Archivo de Video</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('grabar')}
              className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'grabar'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Grabar con Cámara en Vivo</span>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Datos del Autor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Tu Nombre <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  placeholder="Ej. Camila Torres"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Parentesco o Relación
                </label>
                <select
                  value={parentesco}
                  onChange={(e) => setParentesco(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-sky-400 focus:outline-none text-white"
                >
                  {parentescoOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dedicatoria Escrita */}
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1">
                Tu Mensaje o Dedicatoria para Wendy
              </label>
              <textarea
                rows={2}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¡Wendy hermosa, que este año esté lleno de dicha y metas cumplidas!..."
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-800/90 border border-slate-700 focus:border-pink-400 focus:outline-none text-white placeholder-slate-500 resize-none"
              />
            </div>

            {/* Zona de Carga o Grabación */}
            <div className="rounded-2xl border-2 border-dashed border-slate-700 p-4 bg-slate-950/40 text-center">
              {/* Pestaña: Subir Archivo */}
              {activeTab === 'archivo' && (
                <div>
                  {!videoPreviewUrl ? (
                    <label className="flex flex-col items-center justify-center cursor-pointer py-6 group">
                      <Upload className="w-10 h-10 text-sky-400 group-hover:scale-110 transition-transform mb-2" />
                      <span className="text-sm font-semibold text-slate-200">
                        Haz clic para seleccionar tu video
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Formatos: MP4, WebM, MOV (máx. 100MB)
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
                        className="w-full max-h-52 rounded-xl bg-black mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreviewUrl(null);
                        }}
                        className="text-xs text-pink-400 hover:text-pink-300 underline"
                      >
                        Cambiar o seleccionar otro video
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Pestaña: Grabar en Vivo */}
              {activeTab === 'grabar' && (
                <div>
                  {!videoPreviewUrl ? (
                    <div className="space-y-3">
                      <div className="relative w-full max-h-52 rounded-xl bg-black overflow-hidden mx-auto flex items-center justify-center">
                        <video
                          ref={liveVideoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-48 object-cover"
                        />
                        {isRecording && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>REC {recordingTime}s</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-all"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Comenzar a Grabar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-white text-slate-900 text-xs font-bold shadow-lg transition-all animate-pulse"
                          >
                            <StopCircle className="w-4 h-4 text-red-600" />
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
                        className="w-full max-h-52 rounded-xl bg-black mx-auto"
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
                        <span>Grabar de nuevo</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progreso de Subida */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-sky-200">
                  <span>Guardando tu mensaje especial...</span>
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
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>¡Tu felicitación fue enviada con éxito! 🎉</span>
              </div>
            )}

            {/* Botón de Envío */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isUploading || !videoFile}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 via-pink-500 to-yellow-400 text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUploading ? 'Enviando...' : 'Enviar Felicitación para Wendy ✨'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
