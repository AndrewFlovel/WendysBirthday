import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Recuerdo, MensajeVideo, DeseoCumple } from '../types';

interface WendyBirthdayDB extends DBSchema {
  recuerdos: {
    key: string;
    value: Recuerdo;
  };
  mensajesVideo: {
    key: string;
    value: MensajeVideo;
  };
  deseos: {
    key: string;
    value: DeseoCumple;
  };
  archivosMedia: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      tipo: string;
      nombre: string;
      creadoEn: string;
    };
  };
}

const DB_NAME = 'wendy-birthday-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WendyBirthdayDB>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<WendyBirthdayDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('recuerdos')) {
          db.createObjectStore('recuerdos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mensajesVideo')) {
          db.createObjectStore('mensajesVideo', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('deseos')) {
          db.createObjectStore('deseos', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('archivosMedia')) {
          db.createObjectStore('archivosMedia', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// --- Gestión de Videos Locales ---
export const saveLocalVideoMessage = async (video: MensajeVideo, mediaBlob?: Blob): Promise<void> => {
  const db = await getDB();
  await db.put('mensajesVideo', video);
  if (mediaBlob) {
    await db.put('archivosMedia', {
      id: video.id,
      blob: mediaBlob,
      tipo: mediaBlob.type,
      nombre: `video-${video.autor}.mp4`,
      creadoEn: new Date().toISOString(),
    });
  }
};

export const getLocalVideoMessages = async (): Promise<MensajeVideo[]> => {
  const db = await getDB();
  const list = await db.getAll('mensajesVideo');
  // Recrear Object URLs para los blobs si es necesario
  for (const item of list) {
    if (item.videoUrl.startsWith('blob:') || item.videoUrl.startsWith('local:')) {
      const media = await db.get('archivosMedia', item.id);
      if (media && media.blob) {
        item.videoUrl = URL.createObjectURL(media.blob);
      }
    }
  }
  return list;
};

export const deleteLocalVideoMessage = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('mensajesVideo', id);
  await db.delete('archivosMedia', id);
};

// --- Gestión de Deseos / Libro de firmas ---
export const saveLocalWish = async (deseo: DeseoCumple): Promise<void> => {
  const db = await getDB();
  await db.put('deseos', deseo);
};

export const getLocalWishes = async (): Promise<DeseoCumple[]> => {
  const db = await getDB();
  return await db.getAll('deseos');
};

// --- Gestión de Recuerdos Modificados / Personalizados ---
export const saveLocalMemories = async (recuerdos: Recuerdo[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('recuerdos', 'readwrite');
  for (const r of recuerdos) {
    await tx.store.put(r);
  }
  await tx.done;
};

export const getLocalMemories = async (): Promise<Recuerdo[]> => {
  const db = await getDB();
  return await db.getAll('recuerdos');
};
