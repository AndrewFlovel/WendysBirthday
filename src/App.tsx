import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SparkleCursor } from './components/SparkleCursor';
import { BackgroundFX } from './components/BackgroundFX';
import { HomePage } from './pages/HomePage';
import { FriendsPage } from './pages/FriendsPage';

import { Recuerdo, MensajeVideo, DeseoCumple } from './types';
import { RECUERDOS_INICIALES, VIDEOS_PREDETERMINADOS, DESEOS_PREDETERMINADOS } from './data/recuerdosIniciales';
import { getLocalMemories, saveLocalMemories } from './services/localDb';
import { fetchAllVideoGreetings, fetchAllWishes, saveWishMessage } from './services/cloudStorage';
import { soundFX } from './utils/soundFX';

export const App: React.FC = () => {
  const [recuerdos, setRecuerdos] = useState<Recuerdo[]>(RECUERDOS_INICIALES);
  const [videos, setVideos] = useState<MensajeVideo[]>(VIDEOS_PREDETERMINADOS);
  const [deseos, setDeseos] = useState<DeseoCumple[]>(DESEOS_PREDETERMINADOS);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const initData = async () => {
      // 1. Cargar recuerdos (limpiando cualquier dato mock anterior)
      const localRecuerdos = await getLocalMemories();
      const realRecuerdos = (localRecuerdos || []).filter(
        (r) => !r.id.startsWith('recuerdo-') || r.id.startsWith('user-recuerdo-')
      );
      setRecuerdos(realRecuerdos);
      if (localRecuerdos && localRecuerdos.length !== realRecuerdos.length) {
        await saveLocalMemories(realRecuerdos);
      }

      // 2. Cargar videos de amigos reales
      try {
        const cloudVideos = await fetchAllVideoGreetings();
        const realVideos = (cloudVideos || []).filter((v) => !v.id.startsWith('vid-demo-'));
        setVideos(realVideos);
      } catch (err) {
        console.warn('Error cargando videos:', err);
      }

      // 3. Cargar deseos reales
      try {
        const cloudWishes = await fetchAllWishes();
        const realWishes = (cloudWishes || []).filter((w) => !w.id.startsWith('deseo-'));
        setDeseos(realWishes);
      } catch (err) {
        console.warn('Error cargando deseos:', err);
      }
    };

    initData();
  }, []);

  const handleToggleMusic = () => {
    soundFX.toggleBirthdayMusic((playing) => setIsMusicPlaying(playing));
  };

  const handleVideoUploaded = (nuevoVideo: MensajeVideo) => {
    setVideos((prev) => [nuevoVideo, ...prev]);
  };

  const handleAddWish = async (nuevoDeseo: DeseoCumple) => {
    await saveWishMessage(nuevoDeseo);
    setDeseos((prev) => [nuevoDeseo, ...prev]);
  };

  const handleAddMemory = (nuevoRecuerdo: Recuerdo) => {
    setRecuerdos((prev) => [...prev, nuevoRecuerdo]);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen selection:bg-pink-400 selection:text-white">
        {/* Rastro interactivo del cursor de chispas y estrellas */}
        <SparkleCursor />

        {/* Fondo animado con globos pastel y estrellas */}
        <BackgroundFX />

        <Routes>
          {/* Ruta Principal: Celebración y Cajas Mágicas de Wendy */}
          <Route
            path="/"
            element={
              <HomePage
                recuerdos={recuerdos}
                setRecuerdos={setRecuerdos}
                videos={videos}
                setVideos={setVideos}
                deseos={deseos}
                setDeseos={setDeseos}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          {/* Rutas para la página exclusiva de amigos y familiares */}
          <Route
            path="/amigos&familia"
            element={
              <FriendsPage
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                onAddMemory={handleAddMemory}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos%26familia"
            element={
              <FriendsPage
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                onAddMemory={handleAddMemory}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos-y-familia"
            element={
              <FriendsPage
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                onAddMemory={handleAddMemory}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos"
            element={
              <FriendsPage
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                onAddMemory={handleAddMemory}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/familia"
            element={
              <FriendsPage
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                onAddMemory={handleAddMemory}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          {/* Redirección por defecto a la página principal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
