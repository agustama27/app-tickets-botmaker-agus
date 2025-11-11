# 🔍 Verificar Conexión Frontend (Vercel) ↔ Backend (Railway)

## 📋 Paso 1: Obtener la URL de Railway

1. Ve a tu proyecto en [Railway Dashboard](https://railway.app/dashboard)
2. Selecciona tu servicio del backend
3. Ve a la pestaña **Settings** o **Variables**
4. Busca la sección **Domains** o **Public Domain**
5. Copia la URL pública (debería verse como: `https://tu-proyecto.up.railway.app`)

**⚠️ IMPORTANTE:** 
- Asegúrate de copiar la URL completa con `https://`
- Si no tienes un dominio público, Railway te dará uno automáticamente
- La URL puede cambiar si eliminas y recreas el servicio

## 📋 Paso 2: Configurar Variables en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega o verifica estas variables:

### Variable 1: API Base URL
```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://tu-proyecto.up.railway.app
```

### Variable 2: WebSocket URL (si usas WebSockets)
```
Name: NEXT_PUBLIC_WS_URL
Value: https://tu-proyecto.up.railway.app
```

**⚠️ IMPORTANTE:**
- Reemplaza `https://tu-proyecto.up.railway.app` con tu URL real de Railway
- **NO** agregues una barra final (`/`) al final de la URL
- Las variables deben tener el prefijo `NEXT_PUBLIC_` para estar disponibles en el navegador
- Selecciona el ambiente **Production** (y Preview si quieres)

5. Haz clic en **Save**

## 📋 Paso 3: Hacer un Nuevo Deploy

**⚠️ CRÍTICO:** Después de agregar/modificar variables de entorno, debes hacer un nuevo deploy.

1. En Vercel, ve a **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy**
4. O mejor aún, haz un commit y push a tu repositorio para trigger un nuevo deploy

## 📋 Paso 4: Verificar la Conexión

### Método 1: Usar la Consola del Navegador

1. Abre tu aplicación desplegada en Vercel
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **Console**
4. Ejecuta este comando:

```javascript
// ⚠️ IMPORTANTE: process.env no funciona en la consola del navegador
// Usa window.__APP_CONFIG__ que expone las variables

// Verificar que la variable esté configurada
const config = window.__APP_CONFIG__
console.log('API URL:', config?.API_BASE_URL)
console.log('Variable de entorno:', config?.NEXT_PUBLIC_API_BASE_URL)

// Probar una conexión simple
const apiUrl = config?.API_BASE_URL
if (apiUrl) {
  fetch(apiUrl + '/auth/session')
    .then(res => {
      console.log('✅ Backend responde! Status:', res.status)
      return res.json()
    })
    .then(data => console.log('✅ Datos:', data))
    .catch(err => console.error('❌ Error:', err))
} else {
  console.error('❌ URL no configurada. Verifica las variables en Vercel.')
}
```

**Resultados esperados:**
- ✅ Si ves la URL de Railway → Variables configuradas correctamente
- ✅ Si ves `Status: 200` o `401` → Backend está conectado (401 es normal si no estás autenticado)
- ❌ Si ves `undefined` o `null` → Variables no configuradas o necesitas nuevo deploy
- ❌ Si ves `CORS error` → Problema de CORS en el backend
- ❌ Si ves `Network Error` → Backend no accesible o URL incorrecta

### Método 2: Revisar la Pestaña Network

1. En las **Herramientas de Desarrollador**, ve a **Network**
2. Recarga la página (F5)
3. Busca peticiones que fallen (aparecen en rojo)
4. Haz clic en una petición y revisa:
   - **Request URL**: ¿Apunta a tu URL de Railway?
   - **Status**: ¿Qué código de error muestra?
   - **Headers**: Verifica la URL base

### Método 3: Probar el Login

1. Intenta hacer login en tu aplicación
2. Si el login funciona → ✅ Backend conectado correctamente
3. Si falla, revisa la consola para ver el error específico

## 🐛 Problemas Comunes con Railway

### ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** Railway está bloqueando peticiones desde Vercel por CORS.

**Solución:**
1. En tu backend (Railway), configura CORS para permitir tu dominio de Vercel:
   ```javascript
   // Ejemplo para Express.js
   app.use(cors({
     origin: [
       'https://tu-proyecto.vercel.app',
       'https://tu-dominio.com'
     ],
     credentials: true
   }))
   ```

2. O permite todos los orígenes (solo para desarrollo):
   ```javascript
   app.use(cors({
     origin: true,
     credentials: true
   }))
   ```

3. Haz un nuevo deploy del backend en Railway

### ❌ Error: "Network Error" o "Failed to fetch"

**Causa:** La URL de Railway está incorrecta o el servicio no está corriendo.

**Solución:**
1. Verifica que tu servicio en Railway esté **Running** (no pausado)
2. Verifica la URL en Railway (puede haber cambiado)
3. Prueba acceder a la URL directamente en el navegador:
   ```
   https://tu-proyecto.up.railway.app/health
   ```
   (o cualquier endpoint que tengas)

4. Actualiza la variable en Vercel con la URL correcta
5. Haz un nuevo deploy

### ❌ La variable aparece como `undefined`

**Causa:** Variables no configuradas o deploy sin las variables.

**Solución:**
1. Verifica en Vercel que las variables existan y tengan el prefijo `NEXT_PUBLIC_`
2. Asegúrate de que estén configuradas para **Production**
3. Haz un **nuevo deploy** después de agregar las variables
4. Las variables se inyectan durante el build, no en runtime

### ❌ Error 404 en todas las peticiones

**Causa:** La URL base está mal o el backend no tiene esos endpoints.

**Solución:**
1. Verifica que la URL en Vercel sea exactamente la de Railway (sin `/` al final)
2. Prueba acceder directamente a un endpoint:
   ```
   https://tu-proyecto.up.railway.app/api/tickets
   ```
3. Verifica que tu backend tenga los endpoints que el frontend espera (ver `lib/api.ts`)

### ❌ Railway muestra "Service Unavailable"

**Causa:** El servicio en Railway está pausado o tiene problemas.

**Solución:**
1. Ve a Railway Dashboard
2. Verifica que el servicio esté **Running**
3. Revisa los logs del servicio para ver errores
4. Si está pausado, reactívalo

## ✅ Checklist Final

Antes de considerar que todo está conectado:

- [ ] URL de Railway copiada correctamente (con `https://`)
- [ ] Variables `NEXT_PUBLIC_API_BASE_URL` y `NEXT_PUBLIC_WS_URL` configuradas en Vercel
- [ ] Variables configuradas para el ambiente **Production**
- [ ] Nuevo deploy realizado después de configurar variables
- [ ] Servicio en Railway está **Running**
- [ ] Backend accesible directamente en el navegador
- [ ] No hay errores CORS en la consola
- [ ] Las peticiones en Network muestran la URL de Railway
- [ ] El login funciona correctamente
- [ ] Los datos se cargan desde el backend (no datos mock)

## 🔧 Verificación Rápida

**⚠️ IMPORTANTE:** `process.env` no está disponible en la consola del navegador. Usa estos métodos:

### Método 1: Usar el objeto global (Recomendado)

Ejecuta esto en la consola del navegador de tu app desplegada:

```javascript
// 1. Verificar variables (expuestas en window.__APP_CONFIG__)
const config = window.__APP_CONFIG__
console.log('API URL:', config?.API_BASE_URL)
console.log('WS URL:', config?.WS_URL)
console.log('Variable de entorno:', config?.NEXT_PUBLIC_API_BASE_URL)

// 2. Probar conexión
const apiUrl = config?.API_BASE_URL || config?.NEXT_PUBLIC_API_BASE_URL
if (apiUrl) {
  fetch(apiUrl + '/auth/session')
    .then(r => console.log('✅ Status:', r.status, r.statusText))
    .catch(e => console.error('❌ Error:', e.message))
} else {
  console.error('❌ URL no configurada')
}

// 3. Verificar que apunta a Railway
if (config?.API_BASE_URL?.includes('railway')) {
  console.log('✅ URL apunta a Railway')
} else {
  console.warn('⚠️ URL no parece ser de Railway:', config?.API_BASE_URL)
}
```

### Método 2: Revisar la pestaña Network

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Network**
3. Recarga la página o intenta hacer login
4. Busca peticiones que fallen (aparecen en rojo)
5. Haz clic en una petición y revisa:
   - **Request URL**: Debe mostrar la URL de Railway
   - **Status**: Código de respuesta

### Método 3: Usar la página de debug

Visita: `https://tu-proyecto.vercel.app/debug`

Esta página muestra automáticamente:
- Las URLs configuradas
- El estado de la conexión API
- El estado de la conexión WebSocket
- Errores específicos si hay problemas

## 📞 Si Aún Hay Problemas

1. **Revisa los logs de Railway:**
   - Ve a tu servicio en Railway
   - Pestaña **Deployments** → Selecciona el último → **View Logs**
   - Busca errores o peticiones que lleguen

2. **Revisa los logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - **Deployments** → Último deployment → **Function Logs**
   - Busca errores relacionados con el backend

3. **Compara con local:**
   - Si funciona en local pero no en producción
   - Compara las URLs y configuraciones
   - Verifica que el backend en Railway tenga la misma configuración que local

4. **Prueba con curl o Postman:**
   - Prueba hacer peticiones directamente a Railway desde tu máquina
   - Esto te dirá si el problema es del backend o de la conexión frontend-backend

