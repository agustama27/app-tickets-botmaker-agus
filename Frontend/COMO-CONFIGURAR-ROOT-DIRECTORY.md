# 📍 Cómo Configurar Root Directory en Vercel (Paso a Paso Visual)

## 🎯 Solución: Crear Proyecto Nuevo desde Cero

Si no encuentras "Root Directory" en Settings, la mejor opción es crear un proyecto nuevo y configurarlo durante la importación.

### Paso 1: Eliminar el Proyecto Actual (Opcional)

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **General**
3. Desplázate hasta el final
4. Haz clic en **"Delete Project"** (o déjalo y crea uno nuevo con otro nombre)

### Paso 2: Crear Proyecto Nuevo

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio Git (GitHub/GitLab/Bitbucket)
4. Vercel te mostrará una pantalla de configuración

### Paso 3: Configurar Root Directory (CRÍTICO)

En la pantalla de configuración, busca:

**Opción A: Si ves "Configure Project"**
1. Haz clic en **"Configure Project"** o **"Edit"**
2. Busca el campo **"Root Directory"**
3. Escribe: `Frontend` (sin `/`)
4. Haz clic en **"Continue"** o **"Save"**

**Opción B: Si ves "Framework Preset"**
1. Busca un botón que diga **"Show Advanced Options"** o **"More Options"**
2. Haz clic ahí
3. Busca **"Root Directory"**
4. Escribe: `Frontend`

**Opción C: Si no ves ninguna opción**
1. Busca un ícono de engranaje ⚙️ o tres puntos **...**
2. Haz clic ahí
3. Deberías ver opciones avanzadas incluyendo **"Root Directory"**

### Paso 4: Configurar Variables de Entorno

En la misma pantalla, busca **"Environment Variables"**:

1. Haz clic en **"Add"** o **"Add Variable"**
2. Agrega:
   - **Name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://tu-backend-url.com` (reemplaza con tu URL real)
3. Haz clic en **"Add"** nuevamente
4. Agrega (opcional):
   - **Name:** `NEXT_PUBLIC_WS_URL`
   - **Value:** `https://tu-backend-url.com` (misma URL)

### Paso 5: Deploy

1. Revisa que **Framework Preset** diga **"Next.js"**
2. Haz clic en **"Deploy"**
3. Espera a que termine el build
4. Tu app estará disponible en la URL que te dé Vercel

## 🔍 Dónde Aparece Root Directory

Durante la creación del proyecto, "Root Directory" puede aparecer en:

- ✅ Una sección colapsada que dice **"Show Advanced Options"**
- ✅ Un botón **"Configure"** o **"Edit"** junto a Framework Preset
- ✅ Directamente visible en la pantalla de configuración
- ✅ En un menú de tres puntos **...** o engranaje ⚙️

## ⚠️ Si Tampoco Lo Encuentras Durante la Creación

En ese caso, usa la **Solución Alternativa**:

### Solución Alternativa: Mover Frontend a la Raíz

1. En tu repositorio local, mueve todos los archivos de `Frontend/` a la raíz
2. Elimina la carpeta `Frontend/`
3. Haz commit y push
4. Conecta el repositorio a Vercel (no necesitarás Root Directory)

O crea un repositorio separado solo con el contenido de `Frontend/`.

---

**💡 Tip:** Si estás usando el plan gratuito de Vercel, la opción de Root Directory debería estar disponible. Si no la ves, puede ser un problema de la interfaz. Intenta refrescar la página o usar otro navegador.

