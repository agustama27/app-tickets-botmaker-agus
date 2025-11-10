# 🚀 Guía Rápida de Deployment en Vercel

## Pasos Rápidos

### 1. Preparación
- ✅ Asegúrate de que tu backend esté deployado y accesible
- ✅ Obtén la URL pública de tu backend (ej: `https://tu-backend.railway.app`)

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"**
3. Conecta tu repositorio Git (GitHub/GitLab/Bitbucket)
4. Vercel detectará automáticamente Next.js

### 3. Configuración Importante ⚠️

**⚠️ CRÍTICO - Root Directory:**
Cuando Vercel te muestre la pantalla de configuración antes del deploy:

1. **Busca la sección "Configure Project"** o "Project Settings"
2. **Busca el campo "Root Directory"** (puede estar como opcional)
3. **Escribe:** `Frontend` (sin `/` al inicio, solo `Frontend`)
4. Si no ves este campo, haz clic en **"Show Advanced Options"** o **"Configure"**

**Build Settings (si los ves):**
- Framework Preset: `Next.js` (auto-detectado)
- Build Command: `pnpm build` (o `npm run build`)
- Output Directory: `.next` (por defecto)
- Install Command: `pnpm install` (o `npm install`)

**💡 Tip:** Si no configuras el Root Directory aquí, tendrás que hacerlo después en Settings (ver sección de Troubleshooting)

### 4. Variables de Entorno

En la sección **Environment Variables**, agrega:

```
NEXT_PUBLIC_API_BASE_URL=https://tu-backend-url.com
NEXT_PUBLIC_WS_URL=https://tu-backend-url.com
```

**⚠️ IMPORTANTE:**
- Reemplaza `https://tu-backend-url.com` con la URL real de tu backend
- Si tu backend está en Railway, Render, etc., usa esa URL
- Asegúrate de usar `https://` (no `http://`)

### 5. Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build
3. Tu app estará disponible en `tu-proyecto.vercel.app`

## Verificación Post-Deployment

1. Abre la URL de tu app en Vercel
2. Verifica que la app carga correctamente
3. Revisa la consola del navegador para errores
4. Prueba hacer login y verificar que se conecta al backend

## Troubleshooting Común

### ❌ Error 404: NOT_FOUND

Este error generalmente ocurre cuando Vercel no encuentra las rutas correctamente. Soluciones:

**OPCIÓN 1: Configurar Root Directory (Recomendado)**

**Durante la creación del proyecto:**
1. Cuando importas el repositorio en Vercel
2. Antes de hacer clic en "Deploy", busca la sección **"Configure Project"**
3. Busca el campo **"Root Directory"** o **"Root Directory (optional)"**
4. Escribe: `Frontend` (sin la barra `/`)
5. Luego haz clic en "Deploy"

**Si el proyecto ya está creado:**
1. Ve a tu proyecto en Vercel
2. Haz clic en **"Settings"** (Configuración) en la barra superior
3. En el menú lateral izquierdo, busca **"General"**
4. Desplázate hacia abajo hasta encontrar **"Root Directory"**
5. Si está vacío o dice "`/`", cámbialo a: `Frontend`
6. Haz clic en **"Save"**
7. Ve a **"Deployments"** y haz clic en los tres puntos del último deployment
8. Selecciona **"Redeploy"**

**Si no encuentras "Root Directory" en Settings:**
- Puede que tu plan de Vercel no lo muestre en Settings
- En ese caso, usa la OPCIÓN 2 o 3

**OPCIÓN 2: Eliminar vercel.json y usar configuración automática**
- Vercel detecta Next.js automáticamente
- Elimina el archivo `vercel.json` del proyecto
- Haz commit y push
- Vercel hará un nuevo deploy automáticamente

**OPCIÓN 3: Mover el proyecto a la raíz (Alternativa)**
Si ninguna opción funciona, puedes crear un repositorio separado solo con la carpeta Frontend

**3. Verificar estructura del proyecto:**
- Asegúrate de que la carpeta `Frontend` contenga:
  - `package.json`
  - `next.config.mjs`
  - Carpeta `app/` con `layout.tsx`

**4. Revisar logs de build:**
- Ve a **Deployments** en Vercel
- Abre el deployment que falló
- Revisa los logs de build para ver errores específicos

**5. Forzar nuevo build:**
- Ve a **Deployments**
- Click en los tres puntos del deployment
- Selecciona **Redeploy**

### Error: "Cannot connect to backend"
- Verifica que `NEXT_PUBLIC_API_BASE_URL` esté configurado
- Asegúrate de que el backend esté accesible públicamente
- Verifica CORS en el backend

### Error: "WebSocket connection failed"
- Verifica que `NEXT_PUBLIC_WS_URL` esté configurado
- Asegúrate de que el backend soporte WebSockets
- Revisa que la URL use `wss://` o `https://` (no `ws://` o `http://`)

### Error de Build
- Revisa los logs en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el Node.js version sea compatible

## Actualizaciones

Vercel despliega automáticamente cuando:
- Haces push a `main` o `master` → Production
- Creas un PR → Preview deployment
- Push a otras ramas → Preview deployment

## Dominio Personalizado

1. Ve a **Settings > Domains**
2. Agrega tu dominio
3. Configura los DNS según las instrucciones de Vercel

---

¿Necesitas ayuda? Revisa los logs de deployment en Vercel o consulta la documentación completa en `README.md`.

