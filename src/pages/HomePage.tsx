import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { GiftGrid } from '../components/GiftGrid';
import { MemoryModal } from '../components/MemoryModal';
import { GrandFinaleModal } from '../components/GrandFinaleModal';
import { VideoMessageWall } from '../components/VideoMessageWall';
import { VideoUploadModal } from '../components/VideoUploadModal';
import { WishingWell } from '../components/WishingWell';
import { CloudConfigModal } from '../components/CloudConfigModal';
import { MemoryEditorModal } from '../components/MemoryEditorModal';

import { Recuerdo, MensajeVideo, DeseoCumple } from '../types';
import { saveLocalMemories } from '../services/localDb';
import { fetchAllVideoGreetings, fetchAllWishes } from '../services/cloudStorage';
import { soundFX } from '../utils/soundFX';
import { Heart, Sparkles, Video, Users, ArrowRight } from 'lucide-react';

interface HomePageProps {
  recuerdos: Recuerdo[];
  setRecuerdos: React.Dispatch<React.SetStateAction<Recuerdo[]>>;
  videos: MensajeVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MensajeVideo[]>>;
  deseos: DeseoCumple[];
  setDeseos: React.Dispatch<React.SetStateAction<DeseoCumple[]>>;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  recuerdos,
  setRecuerdos,
  videos,
  setVideos,
  deseos,
  setDeseos,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [selectedRecuerdo, setSelectedRecuerdo] = useState<Recuerdo | null>(null);
  const [isMontageOpen, setIsMontageOpen] = useState(false);
  const [hasAutoTriggeredMontage, setHasAutoTriggeredMontage] = useState(false);

  // Modales
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false);
  const [isCloudConfigOpen, setIsCloudConfigOpen] = useState(false);
  const [isMemoryEditorOpen, setIsMemoryEditorOpen] = useState(false);

  const openedCount = recuerdos.filter((r) => r.abierto).length;
  const allOpened = openedCount === recuerdos.length && recuerdos.length > 0;

  // Apertura de una caja individual
  const handleOpenGift = (recuerdo: Recuerdo) => {
    const updated = recuerdos.map((r) =>
      r.id === recuerdo.id ? { ...r, abierto: true } : r
    );
    setRecuerdos(updated);
    saveLocalMemories(updated);
    setSelectedRecuerdo(recuerdo);

    const willBeAllOpened = updated.every((r) => r.abierto);
    if (willBeAllOpened && !hasAutoTriggeredMontage) {
      setHasAutoTriggeredMontage(true);
      setTimeout(() => {
        setSelectedRecuerdo(null);
        setIsMontageOpen(true);
      }, 3000);
    }
  };

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Encabezado con el nombre iluminado de Wendy */}
      <Header
        openedCount={openedCount}
        totalCount={recuerdos.length}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
        onOpenMontage={() => setIsMontageOpen(true)}
        onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
        onOpenMemoryEditor={() => setIsMemoryEditorOpen(true)}
        onScrollToVideos={() => scrollTo('seccion-videos')}
        onScrollToWishes={() => scrollTo('seccion-deseos')}
        onScrollToGifts={() => scrollTo('seccion-regalos')}
        allOpened={allOpened}
      />

      {/* Banner Destacado hacia la Página de Amigos & Familia */}
      <div className="max-w-4xl mx-auto px-4 w-full mb-4">
        <Link
          to="/amigos&familia"
          className="group block p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500/20 via-pink-500/20 to-yellow-400/20 border-2 border-pink-400/50 hover:border-yellow-300 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <span className="p-3 rounded-2xl bg-gradient-to-tr from-pink-500 to-yellow-400 text-white shadow-lg group-hover:rotate-6 transition-transform">
                <Video className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-yellow-300 flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Página Exclusiva para Amigos y Familia
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-200 transition-colors">
                  ¿Quieres dejar tu felicitación o video para Wendy?
                </h3>
                <p className="text-xs text-slate-300">
                  Visita <strong className="text-sky-300 underline font-mono">/amigos&familia</strong> para grabar tu mensaje antes de la fiesta.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg group-hover:bg-yellow-300 transition-colors shrink-0">
              <span>Ir al Portal</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Sección de Cajas de Regalo Interactivas */}
      <main className="flex-1 space-y-12">
        <GiftGrid
          recuerdos={recuerdos}
          onOpenGift={handleOpenGift}
          onOpenMontage={() => setIsMontageOpen(true)}
          onOpenMemoryEditor={() => setIsMemoryEditorOpen(true)}
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

      {/* Pie de Página */}
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

      {/* Modales */}
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

      <GrandFinaleModal
        isOpen={isMontageOpen}
        onClose={() => setIsMontageOpen(false)}
        recuerdos={recuerdos}
      />

      <VideoUploadModal
        isOpen={isVideoUploadOpen}
        onClose={() => setIsVideoUploadOpen(false)}
        onVideoUploaded={(nuevoVideo) => setVideos([nuevoVideo, ...videos])}
      />

      <CloudConfigModal
        isOpen={isCloudConfigOpen}
        onClose={() => setIsCloudConfigOpen(false)}
        onConfigUpdated={() => {
          fetchAllVideoGreetings().then((v) => v.length > 0 && setVideos(v));
          fetchAllWishes().then((w) => w.length > 0 && setDeseos(w));
        }}
      />

      <MemoryEditorModal
        isOpen={isMemoryEditorOpen}
        onClose={() => setIsMemoryEditorOpen(false)}
        recuerdos={recuerdos}
        onSave={(actualizados) => setRecuerdos(actualizados)}
      />
    </div>
  );
};
