import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SparkleCursor } from './components/SparkleCursor';
import { BackgroundFX } from './components/BackgroundFX';
import { GiftGrid } from './components/GiftGrid';
import { MemoryModal } from './components/MemoryModal';
import { GrandFinaleModal } from './components/GrandFinaleModal';
import { VideoMessageWall } from './components/VideoMessageWall';
import { VideoUploadModal } from './components/VideoUploadModal';
import { WishingWell } from './components/WishingWell';
import { CloudConfigModal } from './components/CloudConfigModal';
import { MemoryEditorModal } from './components/MemoryEditorModal';

import { Recuerdo, MensajeVideo, DeseoCumple } from './types';
import { RECUERDOS_INICIALES, VIDEOS_PREDETERMINADOS, DESEOS_PREDETERMINADOS } from './data/recuerdosIniciales';
import { getLocalMemories, saveLocalMemories } from './services/localDb';
import { fetchAllVideoGreetings, fetchAllWishes } from './services/cloudStorage';
import { soundFX } from './utils/soundFX';
import { Heart, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Estado de Recuerdos / Cajas de Regalo
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>(RECUERDOS_INICIALES);
  const [selectedRecuerdo, setSelectedRecuerdo] = useState<Recuerdo | null>(null);

  // Estado del Gran Montaje Final
  const [isMontageOpen, setIsMontageOpen] = useState(false);
  const [hasAutoTriggeredMontage, setHasAutoTriggeredMontage] = useState(false);

  // Videos y Deseos
  const [videos, setVideos] = useState<MensajeVideo[]>(VIDEOS_PREDETERMINADOS);
  const [deseos, setDeseos] = useState<DeseoCumple[]>(DESEOS_PREDETERMINADOS);

  // Modales
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);
  const [isCloudConfigOpen, setIsCloudConfigOpen] = useState(false);
  const [isMemoryEditorOpen, setIsMemoryEditorOpen] = useState(false);

  // Música
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Cargar datos locales y de la nube al iniciar
  useEffect(() => {
    const initData = async () => {
      // 1. Cargar recuerdos personalizados si existen
      const localRecuerdos = await getLocalMemories();
      if (localRecuerdos && localRecuerdos.length > 0) {
        setRecuerdos(localRecuerdos);
      } else {
        await saveLocalMemories(RECUERDOS_INICIALES);
      }

      // 2. Cargar videos de amigos (Supabase o IndexedDB)
      try {
        const cloudVideos = await fetchAllVideoGreetings();
        if (cloudVideos && cloudVideos.length > 0) {
          // Combinar con los predeterminados
          const map = new Map<string, MensajeVideo>();
          VIDEOS_PREDETERMINADOS.forEach((v) => map.set(v.id, v));
          cloudVideos.forEach((v) => map.set(v.id, v));
          setVideos(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Error cargando videos:', err);
      }

      // 3. Cargar deseos
      try {
        const cloudWishes = await fetchAllWishes();
        if (cloudWishes && cloudWishes.length > 0) {
          const map = new Map<string, DeseoCumple>();
          DESEOS_PREDETERMINADOS.forEach((w) => map.set(w.id, w));
          cloudWishes.forEach((w) => map.set(w.id, w));
          setDeseos(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Error cargando deseos:', err);
      }
    };

    initData();
  }, []);

  const openedCount = recuerdos.filter((r) => r.abierto).length;
  const allOpened = openedCount === recuerdos.length && recuerdos.length > 0;

  // Apertura de una caja individual
  const handleOpenGift = (recuerdo: Recuerdo) => {
    // Marcar como abierto
    const updated = recuerdos.map((r) =>
      r.id === recuerdo.id ? { ...r, abierto: true } : r
    );
    setRecuerdos(updated);
    saveLocalMemories(updated);
    setSelectedRecuerdo(recuerdo);

    // Verificar si con este regalo se abrieron todos
    const willBeAllOpened = updated.every((r) => r.abierto);
    if (willBeAllOpened && !hasAutoTriggeredMontage) {
      setHasAutoTriggeredMontage(true);
      // Tras ver el último modal unos segundos, o al cerrarlo, lanzar el Gran Montaje Automático
      setTimeout(() => {
        setSelectedRecuerdo(null);
        setIsMontageOpen(true);
      }, 3000);
    }
  };

  // Navegación en el visor de recuerdos
  const handleNextMemory = () => {
    if (!selectedRecuerdo) return;
    const currentIndex = recuerdos.findIndex((r) => r.id === selectedRecuerdo.id);
    if (currentIndex < recuerdos.length - 1) {
      setSelectedRecuerdo(recuerdos[currentIndex + 1]);
    }
  };

  const handlePrevMemory = () => {
    if (!selectedRecuerdo) return;
    const currentIndex = recuerdos.findIndex((r) => r.id === selectedRecuerdo.id);
    if (currentIndex > 0) {
      setSelectedRecuerdo(recuerdos[currentIndex - 1]);
    }
  };

  // Música
  const handleToggleMusic = () => {
    soundFX.toggleBirthdayMusic((playing) => setIsMusicPlaying(playing));
  };

  // Desplazamiento suave
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-pink-400 selection:text-white">
      {/* Rastro interactivo del cursor de chispas y estrellas */}
      <SparkleCursor />

      {/* Fondo animado con globos, orbes pastel y estrellas titilantes */}
      <BackgroundFX />

      {/* Contenido Principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Encabezado con el nombre iluminado de Wendy */}
        <Header
          openedCount={openedCount}
          totalCount={recuerdos.length}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onOpenMontage={() => setIsMontageOpen(true)}
          onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
          onOpenMemoryEditor={() => setIsMemoryEditorOpen(true)}
          onScrollToVideos={() => scrollTo('seccion-videos')}
          onScrollToWishes={() => scrollTo('seccion-deseos')}
          onScrollToGifts={() => scrollTo('seccion-regalos')}
          allOpened={allOpened}
        />

        {/* Sección de Cajas de Regalo Interactivas */}
        <main className="flex-1 space-y-12">
          <GiftGrid
            recuerdos={recuerdos}
            onOpenGift={handleOpenGift}
            onOpenMontage={() => setIsMontageOpen(true)}
            allOpened={allOpened}
          />

          {/* Muro de Videos de Amigos y Familiares */}
          <VideoMessageWall
            videos={videos}
            onOpenUpload={() => setIsVideoUploadOpen(true)}
          />

          {/* Pozo de los Deseos y Dedicatorias */}
          <WishingWell
            deseos={deseos}
            onAddWish={(nuevoDeseo) => setDeseos([nuevoDeseo, ...deseos])}
          />
        </main>

        {/* Pie de Página Afectuoso */}
        <footer className="relative z-10 py-10 px-4 text-center border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md mt-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-400 animate-pulse" />
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <p className="text-sm text-slate-300 font-light">
              Hecho con inmenso cariño para celebrar a una persona única e irrepetible.
            </p>
            <h4 className="glow-wendy-name text-2xl font-bold text-pink-200">
              Sussan Wendy Molina Guzman
            </h4>
            <p className="text-xs text-slate-400">
              ¡Que la felicidad, los éxitos y el amor te acompañen en cada instante de este nuevo año de vida! ✨🎂
            </p>
          </div>
        </footer>
      </div>

      {/* Modales de la Experiencia */}
      {/* 1. Modal del Recuerdo individual destapado */}
      <MemoryModal
        recuerdo={selectedRecuerdo}
        onClose={() => setSelectedRecuerdo(null)}
        onNext={handleNextMemory}
        onPrev={handlePrevMemory}
        hasNext={
          selectedRecuerdo
            ? recuerdos.findIndex((r) => r.id === selectedRecuerdo.id) < recuerdos.length - 1
            : false
        }
        hasPrev={
          selectedRecuerdo
            ? recuerdos.findIndex((r) => r.id === selectedRecuerdo.id) > 0
            : false
        }
      />

      {/* 2. Gran Montaje Final Cinematográfico */}
      <GrandFinaleModal
        isOpen={isMontageOpen}
        onClose={() => setIsMontageOpen(false)}
        recuerdos={recuerdos}
      />

      {/* 3. Modal para subir o grabar video */}
      <VideoUploadModal
        isOpen={isVideoUploadOpen}
        onClose={() => setIsVideoUploadOpen(false)}
        onVideoUploaded={(nuevoVideo) => setVideos([nuevoVideo, ...videos])}
      />

      {/* 4. Asistente de Nube (Supabase / Vercel) */}
      <CloudConfigModal
        isOpen={isCloudConfigOpen}
        onClose={() => setIsCloudConfigOpen(false)}
        onConfigUpdated={() => {
          fetchAllVideoGreetings().then((v) => v.length > 0 && setVideos(v));
          fetchAllWishes().then((w) => w.length > 0 && setDeseos(w));
        }}
      />

      {/* 5. Editor de Fotos y Recuerdos de Wendy */}
      <MemoryEditorModal
        isOpen={isMemoryEditorOpen}
        onClose={() => setIsMemoryEditorOpen(false)}
        recuerdos={recuerdos}
        onSave={(actualizados) => setRecuerdos(actualizados)}
      />
    </div>
  );
};
