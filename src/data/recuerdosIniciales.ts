import { Recuerdo, MensajeVideo, DeseoCumple } from '../types';

export const RECUERDOS_INICIALES: Recuerdo[] = [
  {
    id: 'recuerdo-1',
    order: 1,
    titulo: '🌟 Tu Sonrisa que Ilumina el Mundo',
    fecha: 'Enero 2026',
    descripcion: 'Un instante mágico que refleja la alegría pura, la luz y la calidez que siempre transmites a todos los que te rodean.',
    mensajeEmotivo: 'Wendy, tu risa tiene el superpoder de transformar cualquier día ordinario en una fiesta llena de esperanza y felicidad. ¡Nunca dejes de brillar con esa fuerza tan hermosa!',
    imagenUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'rosa',
    icono: 'Sparkles',
    abierto: false,
    categoria: 'Alegría y Luz'
  },
  {
    id: 'recuerdo-2',
    order: 2,
    titulo: '✈️ Aventuras y Nuevos Horizontes',
    fecha: 'Marzo 2026',
    descripcion: 'Aquel viaje inolvidable donde los caminos nuevos se llenaron de anécdotas, risas infinitas y paisajes de ensueño.',
    mensajeEmotivo: 'Cada viaje y cada meta que te propones demuestra tu valentía y tu pasión por devorarte el mundo. Que este nuevo año de vida te lleve a destinos aún más maravillosos.',
    imagenUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'celeste',
    icono: 'Compass',
    abierto: false,
    categoria: 'Aventuras'
  },
  {
    id: 'recuerdo-3',
    order: 3,
    titulo: '🌸 Abrazos de Amistad Verdadera',
    fecha: 'Mayo 2026',
    descripcion: 'Tardes de café, confesiones que curan el alma y complicidad que desafía cualquier distancia.',
    mensajeEmotivo: 'Tenerte en nuestras vidas es un regalo invaluable. Eres esa amiga y persona incondicional que siempre escucha, aconseja con sabiduría y abraza con el corazón.',
    imagenUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'amarillo',
    icono: 'Heart',
    abierto: false,
    categoria: 'Amistad'
  },
  {
    id: 'recuerdo-4',
    order: 4,
    titulo: '🏆 Logros y Grandes Metas Conquistadas',
    fecha: 'Julio 2026',
    descripcion: 'Celebrando el fruto de tu esfuerzo, tu dedicación incansable y tu brillo profesional.',
    mensajeEmotivo: 'Verte triunfar no es casualidad: es el resultado de tu constancia y tu talento infinito. ¡Estamos sumamente orgullosos de cada paso que das!',
    imagenUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'rosa',
    icono: 'Trophy',
    abierto: false,
    categoria: 'Éxitos'
  },
  {
    id: 'recuerdo-5',
    order: 5,
    titulo: '🍰 Momentos Dulces en Familia',
    fecha: 'Septiembre 2026',
    descripcion: 'Reuniones llenas de anécdotas, comida deliciosa y el calor del hogar que todo lo reconforta.',
    mensajeEmotivo: 'La familia es ese puerto seguro donde tu presencia siempre es el mejor ingrediente. Gracias por llenar nuestra mesa y nuestros días de tanto amor sincero.',
    imagenUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'celeste',
    icono: 'Users',
    abierto: false,
    categoria: 'Familia'
  },
  {
    id: 'recuerdo-6',
    order: 6,
    titulo: '🎂 La Gran Celebración: ¡Hoy Festejamos Tu Vida!',
    fecha: 'Hoy y Siempre',
    descripcion: 'El broche de oro para conmemorar que el mundo es un lugar infinitamente más hermoso gracias a ti.',
    mensajeEmotivo: 'Sussan Wendy Molina Guzman: hoy el cielo se viste de fiesta, las estrellas bailan para ti y nuestros corazones cantan al unísono. ¡Que este nuevo año te colme de salud, bendiciones, sueños cumplidos y un amor inagotable!',
    imagenUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    colorCaja: 'amarillo',
    icono: 'Gift',
    abierto: false,
    categoria: 'Gran Celebración'
  }
];

export const VIDEOS_PREDETERMINADOS: MensajeVideo[] = [
  {
    id: 'vid-demo-1',
    autor: 'Sofía & Carlos',
    parentesco: 'Mejores Amigos',
    mensaje: '¡Feliz cumpleaños Wendy hermosa! Te mandamos el abrazo más gigante del planeta. ¡Que cumplas mil años más!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    fecha: '2026-08-20T14:30:00Z',
    duracionSegundos: 15,
    tipo: 'archivo',
    origen: 'predeterminado'
  },
  {
    id: 'vid-demo-2',
    autor: 'Familia Molina Guzman',
    parentesco: 'Familia',
    mensaje: 'Hija querida, eres nuestro mayor tesoro y orgullo. Que Dios bendiga cada uno de tus pasos hoy y siempre.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
    fecha: '2026-08-21T18:00:00Z',
    duracionSegundos: 15,
    tipo: 'archivo',
    origen: 'predeterminado'
  }
];

export const DESEOS_PREDETERMINADOS: DeseoCumple[] = [
  {
    id: 'deseo-1',
    nombre: 'Camila Torres',
    parentesco: 'Amiga de la Universidad',
    mensaje: '¡Wendy, que este nuevo año esté lleno de proyectos increíbles, risas y muchos viajes! Te quiero un montón 💖✨',
    sticker: '🎉',
    colorFondo: 'bg-pink-100 border-pink-300 text-pink-900',
    fecha: 'Hace 2 horas'
  },
  {
    id: 'deseo-2',
    nombre: 'Tía Gloria',
    parentesco: 'Familia',
    mensaje: 'Muchísimas felicidades mi niña hermosa. Que la vida te siga premiando con todo lo bueno que mereces 🎂🌸',
    sticker: '🍰',
    colorFondo: 'bg-sky-100 border-sky-300 text-sky-900',
    fecha: 'Hace 4 horas'
  },
  {
    id: 'deseo-3',
    nombre: 'Diego R.',
    parentesco: 'Compañero y Amigo',
    mensaje: '¡A celebrar como se debe! Gracias por ser siempre tan genial, divertida y buena onda. ¡Feliz día! 🌟🥳',
    sticker: '⭐',
    colorFondo: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    fecha: 'Ayer'
  }
];
