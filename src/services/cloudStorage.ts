import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MensajeVideo, DeseoCumple, SupabaseConfig } from '../types';
import {
  saveLocalVideoMessage,
  getLocalVideoMessages,
  saveLocalWish,
  getLocalWishes
} from './localDb';

const SUPABASE_CONFIG_KEY = 'wendy_supabase_credentials';

// Obtener credenciales desde localStorage o variables de entorno
export const getSupabaseConfig = (): SupabaseConfig => {
  const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return { ...parsed, conectado: true };
      }
    } catch {
      // ignore
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    conectado: Boolean(envUrl && envKey),
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string): boolean => {
  if (!url || !anonKey) return false;
  localStorage.setItem(
    SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
  );
  supabaseClientInstance = null; // Reiniciar cliente
  return true;
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(SUPABASE_CONFIG_KEY);
  supabaseClientInstance = null;
};

let supabaseClientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClientInstance) return supabaseClientInstance;

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseClientInstance = createClient(config.url, config.anonKey);
      return supabaseClientInstance;
    } catch (e) {
      console.warn('Error inicializando Supabase Client:', e);
      return null;
    }
  }
  return null;
};

// --- Subida y Consulta de Videos de Amigos ---
export const uploadVideoGreeting = async (
  videoData: {
    autor: string;
    parentesco: string;
    mensaje: string;
    videoFile?: File | Blob;
    duracionSegundos?: number;
    tipo: 'archivo' | 'grabado';
  },
  onProgress?: (progress: number) => void
): Promise<MensajeVideo> => {
  const client = getSupabaseClient();
  const id = 'vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  let finalVideoUrl = '';

  // 1. Intentar subir a Supabase Storage si está disponible
  if (client && videoData.videoFile) {
    try {
      if (onProgress) onProgress(20);
      const fileExt = videoData.tipo === 'grabado' ? 'webm' : 'mp4';
      const fileName = `${id}-${videoData.autor.replace(/\s+/g, '_')}.${fileExt}`;
      const filePath = `saludos/${fileName}`;

      const { error: uploadError } = await client.storage
        .from('wendy_videos')
        .upload(filePath, videoData.videoFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Fallo subida a bucket Supabase, usando respaldo local:', uploadError.message);
      } else {
        if (onProgress) onProgress(70);
        const { data: urlData } = client.storage
          .from('wendy_videos')
          .getPublicUrl(filePath);

        finalVideoUrl = urlData.publicUrl;

        // Guardar registro en tabla Supabase
        const { error: dbError } = await client.from('mensajes_video').insert({
          id,
          autor: videoData.autor,
          parentesco: videoData.parentesco,
          mensaje: videoData.mensaje,
          video_url: finalVideoUrl,
          tipo: videoData.tipo,
          fecha: now,
        });

        if (dbError) {
          console.warn('Error guardando en tabla mensajes_video:', dbError.message);
        }
      }
    } catch (err) {
      console.warn('Error en conexión Supabase, guardando en local:', err);
    }
  }

  // Si no se obtuvo URL de la nube, generar Object URL y guardar en IndexedDB
  const nuevoMensaje: MensajeVideo = {
    id,
    autor: videoData.autor,
    parentesco: videoData.parentesco,
    mensaje: videoData.mensaje,
    videoUrl: finalVideoUrl || (videoData.videoFile ? URL.createObjectURL(videoData.videoFile) : ''),
    fecha: now,
    tipo: videoData.tipo,
    duracionSegundos: videoData.duracionSegundos || 15,
    origen: finalVideoUrl ? 'nube' : 'local',
  };

  // Guardar siempre una copia en IndexedDB local
  await saveLocalVideoMessage(nuevoMensaje, videoData.videoFile);

  if (onProgress) onProgress(100);
  return nuevoMensaje;
};

// Cargar todos los videos (nube + local sincronizados)
export const fetchAllVideoGreetings = async (): Promise<MensajeVideo[]> => {
  const client = getSupabaseClient();
  const localVideos = await getLocalVideoMessages();

  if (client) {
    try {
      const { data, error } = await client
        .from('mensajes_video')
        .select('*')
        .order('fecha', { ascending: false });

      if (!error && data && data.length > 0) {
        const cloudVideos: MensajeVideo[] = data.map((item) => ({
          id: item.id,
          autor: item.autor,
          parentesco: item.parentesco,
          mensaje: item.mensaje,
          videoUrl: item.video_url,
          fecha: item.fecha,
          tipo: item.tipo as 'archivo' | 'grabado',
          origen: 'nube',
        }));

        // Combinar evitando duplicados por ID
        const allMap = new Map<string, MensajeVideo>();
        cloudVideos.forEach((v) => allMap.set(v.id, v));
        localVideos.forEach((v) => {
          if (!allMap.has(v.id)) {
            allMap.set(v.id, v);
          }
        });

        return Array.from(allMap.values());
      }
    } catch (err) {
      console.warn('Error consultando Supabase, usando local:', err);
    }
  }

  return localVideos;
};

// --- Pozo de los Deseos (Wishes) ---
export const saveWishMessage = async (deseo: DeseoCumple): Promise<void> => {
  const client = getSupabaseClient();
  await saveLocalWish(deseo);

  if (client) {
    try {
      await client.from('deseos_cumple').insert({
        id: deseo.id,
        nombre: deseo.nombre,
        parentesco: deseo.parentesco,
        mensaje: deseo.mensaje,
        sticker: deseo.sticker,
        color_fondo: deseo.colorFondo,
        fecha: deseo.fecha,
      });
    } catch (err) {
      console.warn('Error guardando deseo en Supabase:', err);
    }
  }
};

export const fetchAllWishes = async (): Promise<DeseoCumple[]> => {
  const client = getSupabaseClient();
  const localWishes = await getLocalWishes();

  if (client) {
    try {
      const { data, error } = await client
        .from('deseos_cumple')
        .select('*')
        .order('fecha', { ascending: false });

      if (!error && data && data.length > 0) {
        const cloudWishes: DeseoCumple[] = data.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          parentesco: item.parentesco,
          mensaje: item.mensaje,
          sticker: item.sticker,
          colorFondo: item.color_fondo,
          fecha: item.fecha,
        }));

        const map = new Map<string, DeseoCumple>();
        cloudWishes.forEach((w) => map.set(w.id, w));
        localWishes.forEach((w) => {
          if (!map.has(w.id)) {
            map.set(w.id, w);
          }
        });

        return Array.from(map.values());
      }
    } catch (err) {
      console.warn('Error obteniendo deseos de Supabase:', err);
    }
  }

  return localWishes;
};

export const SUPABASE_SQL_SETUP = `
-- Script de configuración rápida para Supabase
-- Copia y pega esto en el SQL Editor de tu proyecto Supabase:

-- 1. Tabla de Mensajes de Video
CREATE TABLE IF NOT EXISTS public.mensajes_video (
  id TEXT PRIMARY KEY,
  autor TEXT NOT NULL,
  parentesco TEXT,
  mensaje TEXT,
  video_url TEXT NOT NULL,
  tipo TEXT DEFAULT 'archivo',
  fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla de Deseos y Dedicatorias
CREATE TABLE IF NOT EXISTS public.deseos_cumple (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  parentesco TEXT,
  mensaje TEXT NOT NULL,
  sticker TEXT,
  color_fondo TEXT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Habilitar lectura y escritura pública (Row Level Security)
ALTER TABLE public.mensajes_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deseos_cumple ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de videos" ON public.mensajes_video FOR SELECT USING (true);
CREATE POLICY "Inserción pública de videos" ON public.mensajes_video FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública de deseos" ON public.deseos_cumple FOR SELECT USING (true);
CREATE POLICY "Inserción pública de deseos" ON public.deseos_cumple FOR INSERT WITH CHECK (true);

-- 4. Crear Bucket para almacenar los videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wendy_videos', 'wendy_videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Acceso público de subida a videos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'wendy_videos');

CREATE POLICY "Acceso público de visualización de videos" ON storage.objects 
FOR SELECT USING (bucket_id = 'wendy_videos');
`;
