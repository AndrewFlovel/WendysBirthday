export interface Recuerdo {
  id: string;
  order: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  mensajeEmotivo: string;
  imagenUrl: string;
  colorCaja: 'rosa' | 'celeste' | 'amarillo';
  icono: string;
  abierto: boolean;
  categoria?: string;
}

export interface MensajeVideo {
  id: string;
  autor: string;
  parentesco: string;
  mensaje: string;
  videoUrl: string;
  thumbnailUrl?: string;
  fecha: string;
  duracionSegundos?: number;
  tipo: 'archivo' | 'grabado';
  origen: 'nube' | 'local' | 'predeterminado';
}

export interface DeseoCumple {
  id: string;
  nombre: string;
  parentesco: string;
  mensaje: string;
  sticker: string;
  colorFondo: string;
  fecha: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  conectado: boolean;
}
