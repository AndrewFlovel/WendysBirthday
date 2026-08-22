# 🎂 Experiencia Mágica de Cumpleaños para Sussan Wendy Molina Guzman ✨💖

Una aplicación web interactiva, emotiva y festiva creada especialmente para celebrar el cumpleaños de **Sussan Wendy Molina Guzman**.

---

## 🌟 Características Principales

1. **Tipografía Brillante y Resplandeciente**: El nombre de **Sussan Wendy Molina Guzman** luce en tipografía cursiva elegante con resplandores de luz en rosa, amarillo y celeste.
2. **Cajas de Regalo Mágicas 3D**:
   - Al pasar el cursor, las cajas tiemblan de emoción, resplandecen y emiten chispas y sonidos de campanitas mágicas.
   - Al hacer clic, la tapa sale disparada hacia arriba con confeti y destellos, revelando recuerdos, fotos del año y dedicatorias especiales.
3. **Gran Montaje Final Automático**:
   - Cuando se abre el último regalo, se activa automáticamente un carrusel cinematográfico a pantalla completa con fuegos artificiales, música festiva, recuerdos del año y un homenaje final.
4. **Muro y Portal de Videos de Amigos y Familiares**:
   - Los amigos pueden subir videos (MP4, WebM, MOV) o grabarse en vivo con la cámara web.
   - Se guardan en la nube para que Wendy los vea desde cualquier lugar del mundo.
5. **Efectos Mágicos y Partículas**:
   - Rastro interactivo del cursor que desprende polvo de hadas, estrellas titilantes y chispas doradas/rosas.
   - Fondo animado con globos ascendentes en tonos pastel y orbes luminosos.
6. **Música y Efectos de Sonido Sintetizados**:
   - Generador Web Audio API procedural integrado (no requiere archivos externos pesados).
7. **Pozo de los Deseos (Libro de Visitas)**:
   - Amigos y familiares pueden dejar notas de felicitación con stickers y colores festivos.
8. **Personalizador de Recuerdos**:
   - Permite a los organizadores cambiar o subir sus propias fotografías y mensajes directamente desde el navegador.

---

## 🚀 Cómo Ejecutar Localmente

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. Abrir en tu navegador: `http://localhost:3000`

---

## ☁️ Despliegue en Vercel (Paso a Paso)

La aplicación ya incluye `vercel.json` y la configuración lista para desplegarse con un solo clic:

### Opción 1: Desde la Web de Vercel (Recomendado)
1. Sube este repositorio a **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..." -> "Project"** y selecciona tu repositorio.
4. Vercel detectará Vite automáticamente. Haz clic en **"Deploy"**.

### Opción 2: Usando Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📱 Sincronización de Videos en la Nube con Supabase (Gratuito)

Para que los amigos de Wendy puedan subir sus videos desde cualquier celular o país y aparezcan en la app en Vercel:

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto.
3. Ve a la pestaña **SQL Editor**, copia y pega el script disponible dentro de la app (en el botón *"Nube Vercel"*) y pulsa **Run**.
4. En Vercel (o en tu archivo `.env`), añade las siguientes variables de entorno:
   ```env
   VITE_SUPABASE_URL=tu_supabase_project_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
   *(También puedes configurarlas directamente desde la interfaz de usuario en el botón superior "Nube Vercel" sin necesidad de volver a compilar).*
