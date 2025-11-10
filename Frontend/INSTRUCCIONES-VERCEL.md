# 🚀 Instrucciones para Deployar en Vercel (Sin Root Directory en Settings)

## ✅ Solución: Crear Proyecto Nuevo

Como no encuentras "Root Directory" en Settings, vamos a crear un proyecto nuevo desde cero. Durante la creación es más fácil encontrarlo.

### Paso 1: Ir a Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicia sesión si no lo has hecho

### Paso 2: Crear Proyecto Nuevo

1. Haz clic en el botón **"Add New..."** (arriba a la derecha)
2. Selecciona **"Project"**
3. Conecta tu repositorio (GitHub/GitLab/Bitbucket) si no está conectado
4. Selecciona tu repositorio `AppTickets` (o como se llame)

### Paso 3: Configurar el Proyecto (MUY IMPORTANTE)

Vercel te mostrará una pantalla de configuración. Aquí es donde debes configurar el Root Directory:

#### Busca una de estas opciones:

**A) Botón "Configure Project" o "Edit"**
- Si ves un botón que dice **"Configure Project"** o **"Edit"** junto a "Framework Preset"
- Haz clic ahí
- Busca **"Root Directory"**
- Escribe: `Frontend` (sin `/`)

**B) "Show Advanced Options" o "More Options"**
- Busca un botón que diga **"Show Advanced Options"**, **"More Options"**, o un ícono de engranaje ⚙️
- Haz clic ahí
- Busca **"Root Directory"**
- Escribe: `Frontend`

**C) Campo visible directamente**
- A veces "Root Directory" está visible directamente en la pantalla
- Si lo ves, escribe: `Frontend`

**D) Menú de tres puntos (...)**
- Busca tres puntos **...** o un menú desplegable
- Haz clic ahí
- Busca opciones avanzadas o **"Root Directory"**

### Paso 4: Configurar Variables de Entorno

En la misma pantalla, busca la sección **"Environment Variables"**:

1. Haz clic en **"Add"** o **"Add Variable"**
2. Agrega la primera variable:
   - **Name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://tu-backend-url.com` (reemplaza con tu URL real del backend)
3. Haz clic en **"Add"** nuevamente
4. Agrega la segunda variable (opcional):
   - **Name:** `NEXT_PUBLIC_WS_URL`
   - **Value:** `https://tu-backend-url.com` (misma URL)

### Paso 5: Verificar Framework

Asegúrate de que **"Framework Preset"** diga **"Next.js"** (debería detectarse automáticamente).

### Paso 6: Deploy

1. Haz clic en el botón **"Deploy"**
2. Espera a que termine el build (puede tardar unos minutos)
3. Una vez que diga **"Ready"**, haz clic en la URL que te dé Vercel
4. ¡Tu app debería estar funcionando! 🎉

## 🔍 ¿Dónde Está Root Directory?

Durante la creación del proyecto, "Root Directory" puede estar en:

- ✅ Una sección colapsada (busca "Show Advanced Options")
- ✅ Un botón "Configure" o "Edit"
- ✅ Un menú de tres puntos (...)
- ✅ Directamente visible en la pantalla
- ✅ Un ícono de engranaje ⚙️

## ⚠️ Si Tampoco Lo Encuentras Durante la Creación

Si después de buscar en todos esos lugares no encuentras "Root Directory", entonces:

### Solución Alternativa: Crear Repositorio Separado

1. Crea un nuevo repositorio Git (ej: `app-tickets-frontend`)
2. Copia TODO el contenido de la carpeta `Frontend/` al nuevo repositorio
3. Haz commit y push
4. Conecta ese nuevo repositorio a Vercel
5. Como el proyecto estará en la raíz, no necesitarás configurar Root Directory

## 📸 Captura de Pantalla de Referencia

La pantalla de configuración en Vercel debería verse así:

```
┌─────────────────────────────────────┐
│ Configure Project                   │
├─────────────────────────────────────┤
│ Framework Preset: Next.js           │
│ [Edit] o [Configure] ← AQUÍ         │
│                                     │
│ Root Directory: [Frontend] ← AQUÍ  │
│                                     │
│ Environment Variables:              │
│ [Add Variable]                      │
└─────────────────────────────────────┘
```

## 🆘 Si Nada Funciona

1. Toma una captura de pantalla de la pantalla de configuración de Vercel
2. Compártela y te ayudo a ubicar exactamente dónde está la opción

---

**💡 Tip:** Si estás en el plan gratuito de Vercel, la opción de Root Directory DEBE estar disponible. Si no la ves, puede ser que esté oculta. Intenta hacer scroll hacia abajo o buscar botones colapsables.

