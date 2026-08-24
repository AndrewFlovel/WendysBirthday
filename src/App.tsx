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
      // 1. Cargar recuerdos locales
      const localRecuerdos = await getLocalMemories();
      if (localRecuerdos && localRecuerdos.length > 0) {
        setRecuerdos(localRecuerdos);
      } else {
        await saveLocalMemories(RECUERDOS_INICIALES);
      }

      // 2. Cargar videos de amigos
      try {
        const cloudVideos = await fetchAllVideoGreetings();
        if (cloudVideos && cloudVideos.length > 0) {
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
                videos={videos}
                deseos={deseos}
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos%26familia"
            element={
              <FriendsPage
                videos={videos}
                deseos={deseos}
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos-y-familia"
            element={
              <FriendsPage
                videos={videos}
                deseos={deseos}
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/amigos"
            element={
              <FriendsPage
                videos={videos}
                deseos={deseos}
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          <Route
            path="/familia"
            element={
              <FriendsPage
                videos={videos}
                deseos={deseos}
                onVideoUploaded={handleVideoUploaded}
                onAddWish={handleAddWish}
                isMusicPlaying={isMusicPlaying}
                onToggleMusic={handleToggleMusic}
              />
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
