# 🔗 Cómo Conectar Cualquier Frontend con Backend (Railway)

Esta guía te ayudará a conectar **cualquier frontend** (desplegado en Vercel u otra plataforma) con el backend desplegado en Railway.

> **Nota**: Esta guía es genérica y funciona para cualquier frontend, independientemente del framework (Next.js, React, Vue, Angular, etc.) o del repositorio donde esté alojado.

## 📋 Pasos a Seguir

### 1. Obtener la URL del Backend en Railway

1. Ve a tu proyecto en [Railway](https://railway.app)
2. Selecciona tu servicio del backend
3. Ve a la pestaña **"Settings"** o **"Variables"**
4. Busca la sección **"Networking"** o **"Public Domain"**
5. Copia la URL pública de tu backend (ejemplo: `https://tu-proyecto.up.railway.app`)
   - ⚠️ **IMPORTANTE**: Asegúrate de que el backend esté desplegado y funcionando
   - Puedes verificar que funciona visitando: `https://tu-proyecto.up.railway.app/health`

### 2. Obtener la URL del Frontend

1. Ve a tu plataforma de deployment (Vercel, Netlify, etc.)
2. Selecciona tu proyecto del frontend
3. En la pestaña **"Deployments"** o **"Overview"**, encontrarás la URL de tu aplicación
4. Copia la URL (ejemplo: `https://tu-app.vercel.app` o `https://tu-app.netlify.app`)
   - Si tienes un dominio personalizado, también puedes usarlo
   - Si tienes múltiples URLs (producción, preview, staging), anótalas todas

### 3. Configurar Variables de Entorno en el Frontend

La configuración depende del framework que uses. Aquí tienes ejemplos para los más comunes:

#### Para Next.js (Vercel u otra plataforma):

1. Ve a tu proyecto en tu plataforma de deployment
2. Haz clic en **"Settings"** (arriba a la derecha)
3. En el menú lateral, selecciona **"Environment Variables"**
4. Agrega las siguientes variables:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://tu-proyecto.up.railway.app
   NEXT_PUBLIC_WS_URL=https://tu-proyecto.up.railway.app
   ```

   ⚠️ **IMPORTANTE**:
   - Reemplaza `https://tu-proyecto.up.railway.app` con la URL real de tu backend en Railway
   - **NO** incluyas la barra final (`/`) al final de la URL
   - Las variables que empiezan con `NEXT_PUBLIC_` son accesibles desde el navegador

5. Selecciona los ambientes donde aplicar estas variables:
   - ✅ **Production** (obligatorio)
   - ✅ **Preview** (recomendado)
   - ✅ **Development** (opcional, solo si quieres probar localmente)

6. Haz clic en **"Save"**

#### Para React/Vite (Vercel, Netlify, etc.):

1. Ve a tu proyecto en tu plataforma de deployment
2. Ve a **"Settings"** > **"Environment Variables"**
3. Agrega:

   ```
   VITE_API_BASE_URL=https://tu-proyecto.up.railway.app
   VITE_WS_URL=https://tu-proyecto.up.railway.app
   ```

   ⚠️ Las variables que empiezan con `VITE_` son accesibles desde el navegador

#### Para React Create React App:

1. Ve a tu proyecto en tu plataforma de deployment
2. Ve a **"Settings"** > **"Environment Variables"**
3. Agrega:

   ```
   REACT_APP_API_BASE_URL=https://tu-proyecto.up.railway.app
   REACT_APP_WS_URL=https://tu-proyecto.up.railway.app
   ```

   ⚠️ Las variables que empiezan con `REACT_APP_` son accesibles desde el navegador

#### Para otros frameworks:

- **Vue.js**: Usa `VUE_APP_` como prefijo
- **Angular**: Usa variables de entorno en `environment.ts`
- **Svelte**: Usa `VITE_` como prefijo (si usas Vite)
- **Otros**: Consulta la documentación de tu framework sobre variables de entorno públicas

#### Configuración en el código del frontend:

En tu código, usa estas variables para configurar tu cliente HTTP y WebSocket:

```javascript
// Ejemplo para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_BASE_URL

// Ejemplo para React/Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const WS_URL = import.meta.env.VITE_WS_URL || API_BASE_URL
```

### 4. Configurar CORS en Railway (Backend)

El backend necesita permitir requests desde tu frontend. Para esto, configura la variable `ALLOWED_ORIGINS` en Railway:

1. Ve a tu proyecto en Railway
2. Selecciona tu servicio del backend
3. Ve a la pestaña **"Variables"** o **"Settings"** > **"Variables"**
4. Busca o agrega la variable de entorno

#### 🎯 Solución para URLs que Cambian en Vercel

**Problema**: Cada vez que haces redeploy en Vercel, las URLs de preview cambian (ej: `tu-app-git-branch-username.vercel.app`).

**Solución**: Usa el patrón wildcard `*.vercel.app` para aceptar **cualquier** subdominio de Vercel:

   ```
   ALLOWED_ORIGINS=https://*.vercel.app,https://tu-dominio.com
   ```

   ✅ **Ventajas**:
   - Acepta automáticamente todas las URLs de Vercel (producción y preview)
   - No necesitas actualizar `ALLOWED_ORIGINS` cada vez que haces deploy
   - Funciona con cualquier branch o preview deployment

   ⚠️ **IMPORTANTE**:
   - El patrón `*.vercel.app` acepta **cualquier** subdominio de vercel.app
   - Si tienes un dominio personalizado, agrégalo también (ej: `https://tu-dominio.com`)
   - **NO** incluyas la barra final (`/`) al final de las URLs
   - Ejemplo completo:
     ```
     ALLOWED_ORIGINS=https://*.vercel.app,https://tu-dominio.com,https://staging.tu-dominio.com
     ```

#### Alternativa: Solo URL de Producción

Si solo quieres permitir la URL de producción (que es estable), usa:

   ```
   ALLOWED_ORIGINS=https://tu-app.vercel.app,https://tu-dominio.com
   ```

   ⚠️ **Nota**: Con esta opción, los preview deployments no funcionarán hasta que agregues sus URLs manualmente.

#### Configuración Recomendada

Para desarrollo y producción:

   ```
   ALLOWED_ORIGINS=https://*.vercel.app,https://tu-dominio.com
   ```

5. Si agregaste o modificaste la variable, Railway reiniciará automáticamente el servicio

### 5. Verificar la Conexión

#### Verificar Backend

1. Abre en tu navegador: `https://tu-proyecto.up.railway.app/health`
2. Deberías ver: `{"ok":true}`
3. Si ves esto, el backend está funcionando ✅

#### Verificar Frontend

1. Despliega nuevamente tu frontend (o espera a que se redespiegue automáticamente)
2. Abre tu aplicación en el navegador
3. Abre las **DevTools** del navegador (F12)
4. Ve a la pestaña **"Network"** (Red)
5. Intenta usar la aplicación (hacer login, cargar tickets, etc.)
6. Verifica que las peticiones se estén haciendo a la URL de Railway:
   - Deberías ver requests a `https://tu-proyecto.up.railway.app/api/...`
   - Si ves errores CORS, revisa el paso 4

### 6. Solución de Problemas

#### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa**: El backend no tiene configurado correctamente `ALLOWED_ORIGINS`

**Solución**:
1. Verifica que `ALLOWED_ORIGINS` en Railway incluya exactamente la URL de tu frontend
2. Asegúrate de que no haya espacios ni barras finales
3. Reinicia el servicio en Railway después de cambiar la variable

#### ❌ Error: "Network Error" o "Failed to fetch"

**Causa**: El frontend no puede alcanzar el backend

**Soluciones**:
1. Verifica que la URL del backend en Railway sea correcta
2. Verifica que la variable de entorno de la API en tu frontend sea correcta (ej: `NEXT_PUBLIC_API_BASE_URL`, `VITE_API_BASE_URL`, etc.)
3. Asegúrate de que el backend esté desplegado y funcionando
4. Verifica que no haya problemas de red o firewall

#### ❌ Error: "WebSocket connection failed"

**Causa**: El WebSocket no puede conectarse

**Soluciones**:
1. Verifica que la variable de entorno del WebSocket en tu frontend sea correcta (ej: `NEXT_PUBLIC_WS_URL`, `VITE_WS_URL`, etc.)
2. Verifica que `ALLOWED_ORIGINS` en Railway incluya la URL del frontend
3. Algunos servicios pueden requerir configuración adicional para WebSockets
4. Asegúrate de que el backend esté usando Socket.IO (este backend lo usa)

#### ❌ Las variables de entorno no se aplican

**Causa**: Las variables se agregaron pero no se aplicaron al deployment

**Solución**:
1. En tu plataforma de deployment, ve a **"Deployments"**
2. Haz clic en los tres puntos (...) del último deployment
3. Selecciona **"Redeploy"** o **"Rebuild"**
4. Esto forzará un nuevo build con las variables actualizadas

### 7. Endpoints Disponibles en el Backend

El backend expone los siguientes endpoints:

#### Health Check
- `GET /health` - Verifica que el backend esté funcionando

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/session` - Obtener sesión actual

#### Tickets
- `GET /api/tickets` - Listar tickets (con filtros opcionales: status, priority, areaId, teamId, etc.)
- `GET /api/tickets/:id` - Obtener un ticket específico
- `PATCH /api/tickets/:id` - Actualizar un ticket
- `GET /api/tickets/:id/messages` - Obtener mensajes de un ticket
- `POST /api/tickets/:id/reply` - Responder a un ticket

#### Estructura Organizacional
- `GET /api/areas` - Listar áreas
- `GET /api/teams` - Listar equipos (opcional: ?areaId=uuid)

#### Contactos
- `GET /api/contacts` - Listar contactos

#### WebSocket (Socket.IO)

El backend usa Socket.IO para eventos en tiempo real. Eventos disponibles:
- `TICKET_CREATED` - Se creó un nuevo ticket
- `TICKET_UPDATED` - Se actualizó un ticket
- `MESSAGE_NEW` - Se recibió un nuevo mensaje

**Ejemplo de conexión WebSocket (Socket.IO):**
```javascript
import { io } from 'socket.io-client'

const socket = io(WS_URL, {
  withCredentials: true,
  autoConnect: true
})

socket.on('TICKET_CREATED', (ticket) => {
  console.log('Nuevo ticket:', ticket)
})

socket.on('TICKET_UPDATED', (ticket) => {
  console.log('Ticket actualizado:', ticket)
})

socket.on('MESSAGE_NEW', (message) => {
  console.log('Nuevo mensaje:', message)
})
```

### 8. Ejemplo de Configuración Completa

#### En tu Frontend (Variables de Entorno):
```
# Para Next.js
NEXT_PUBLIC_API_BASE_URL=https://app-tickets-backend.up.railway.app
NEXT_PUBLIC_WS_URL=https://app-tickets-backend.up.railway.app

# Para React/Vite
VITE_API_BASE_URL=https://app-tickets-backend.up.railway.app
VITE_WS_URL=https://app-tickets-backend.up.railway.app
```

#### En Railway (Backend):
```
# Opción recomendada: acepta todas las URLs de Vercel (producción y preview)
ALLOWED_ORIGINS=https://*.vercel.app,https://tu-dominio.com

# Alternativa: solo URLs específicas (necesitas actualizar manualmente)
# ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-frontend-git-main.vercel.app,https://tu-dominio.com
```

### 9. Solución para URLs de Vercel que Cambian

#### El Problema

Cada vez que haces redeploy en Vercel, se generan nuevas URLs para preview deployments:
- Producción: `tu-app.vercel.app` (estable, no cambia)
- Preview: `tu-app-git-branch-username.vercel.app` (cambia en cada deploy)

#### La Solución

El backend ahora soporta **patrones wildcard** en `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://*.vercel.app
```

Esto acepta automáticamente:
- ✅ `https://tu-app.vercel.app` (producción)
- ✅ `https://tu-app-git-main.vercel.app` (preview)
- ✅ `https://tu-app-git-feature-username.vercel.app` (cualquier preview)
- ✅ Cualquier otro subdominio de `vercel.app`

**Ya no necesitas actualizar `ALLOWED_ORIGINS` cada vez que haces deploy** 🎉

#### Otras Opciones de Patrones

También puedes usar patrones para otros dominios:

```
# Acepta cualquier subdominio de tu dominio
ALLOWED_ORIGINS=https://*.tudominio.com

# Combinación de múltiples patrones
ALLOWED_ORIGINS=https://*.vercel.app,https://*.tudominio.com,https://staging.tudominio.com
```

### 10. Notas Importantes

- ⚠️ **Las variables de entorno en el frontend se aplican en tiempo de build**, por lo que necesitas hacer un nuevo deployment después de agregarlas
- ⚠️ **Las variables en Railway se aplican inmediatamente** y el servicio se reinicia automáticamente
- ✅ **Usa HTTPS**: Asegúrate de que ambas URLs usen `https://` (no `http://`)
- ✅ **Sin barras finales**: No incluyas `/` al final de las URLs en las variables de entorno
- ✅ **Verifica ambos servicios**: Asegúrate de que tanto el frontend como el backend estén desplegados y funcionando
- ✅ **Headers requeridos**: Algunos endpoints requieren el header `x-user-id` para identificar al usuario (ver implementación en tu frontend)
- ✅ **WebSockets**: El backend usa Socket.IO, asegúrate de usar el cliente correcto en tu frontend
- ✅ **Patrones Wildcard**: Usa `*.vercel.app` para aceptar todas las URLs de Vercel automáticamente

---

## ✅ Checklist Final

- [ ] Backend desplegado en Railway y funcionando
- [ ] URL del backend copiada (ej: `https://tu-proyecto.up.railway.app`)
- [ ] URL del frontend copiada (ej: `https://tu-app.vercel.app`)
- [ ] Variables de entorno del API configuradas en el frontend (ej: `NEXT_PUBLIC_API_BASE_URL`, `VITE_API_BASE_URL`, etc.)
- [ ] Variables de entorno del WebSocket configuradas en el frontend (ej: `NEXT_PUBLIC_WS_URL`, `VITE_WS_URL`, etc.)
- [ ] `ALLOWED_ORIGINS` configurada en Railway con la URL del frontend
- [ ] Frontend redesplegado (para aplicar las nuevas variables de entorno)
- [ ] Backend reiniciado en Railway (si fue necesario)
- [ ] Conexión verificada en el navegador

---

**¿Tienes problemas?** Revisa la sección "Solución de Problemas" o verifica los logs en Railway y Vercel para más detalles.

