# 🔧 Configurar Variables de Entorno en Vercel (Paso a Paso)

## ⚠️ Problema: Variables `undefined`

Si ves `undefined` al verificar las variables, significa que:
1. ❌ Las variables no están configuradas en Vercel, O
2. ❌ Las variables están configuradas pero no se hizo un nuevo deploy

## 📋 Paso a Paso: Configurar Variables en Vercel

### Paso 1: Obtener la URL de Railway

1. Ve a [Railway Dashboard](https://railway.app/dashboard)
2. Selecciona tu servicio del backend
3. Ve a la pestaña **Settings**
4. Busca la sección **Networking** o **Public Domain**
5. Copia la URL pública (ejemplo: `https://tu-proyecto.up.railway.app`)

**Ejemplo de URL de Railway:**
```
https://apptickets-production.up.railway.app
```

### Paso 2: Ir a Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicia sesión si no lo has hecho
3. Selecciona tu proyecto

### Paso 3: Abrir Configuración de Variables

1. En el menú lateral izquierdo, haz clic en **Settings**
2. En el submenú, haz clic en **Environment Variables**

**Ruta completa:** `Settings` → `Environment Variables`

### Paso 4: Agregar Variable 1: API Base URL

1. Haz clic en el botón **Add New** (o **Add Variable**)
2. En el campo **Key** (o **Name**), escribe exactamente:
   ```
   NEXT_PUBLIC_API_BASE_URL
   ```
   ⚠️ **IMPORTANTE:** Debe ser exactamente así, con mayúsculas y guiones bajos

3. En el campo **Value**, pega la URL de Railway que copiaste:
   ```
   https://tu-proyecto.up.railway.app
   ```
   ⚠️ **IMPORTANTE:** 
   - Debe empezar con `https://`
   - NO agregues una barra (`/`) al final
   - Ejemplo correcto: `https://apptickets-production.up.railway.app`
   - Ejemplo incorrecto: `https://apptickets-production.up.railway.app/`

4. En **Environment**, selecciona:
   - ✅ **Production** (obligatorio)
   - ✅ **Preview** (recomendado)
   - ✅ **Development** (opcional)

5. Haz clic en **Save**

### Paso 5: Agregar Variable 2: WebSocket URL

1. Haz clic en **Add New** nuevamente
2. En el campo **Key**, escribe:
   ```
   NEXT_PUBLIC_WS_URL
   ```

3. En el campo **Value**, pega la misma URL de Railway:
   ```
   https://tu-proyecto.up.railway.app
   ```
   (La misma URL que usaste en el paso anterior)

4. En **Environment**, selecciona:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opcional)

5. Haz clic en **Save**

### Paso 6: Verificar que las Variables Estén Agregadas

Deberías ver una tabla con tus variables:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://tu-proyecto.up.railway.app` | Production, Preview |
| `NEXT_PUBLIC_WS_URL` | `https://tu-proyecto.up.railway.app` | Production, Preview |

## 🚀 Paso 7: Hacer un Nuevo Deploy (CRÍTICO)

**⚠️ MUY IMPORTANTE:** Después de agregar las variables, DEBES hacer un nuevo deploy.

### Opción A: Redeploy desde Vercel (Rápido)

1. En Vercel, ve a la pestaña **Deployments**
2. Encuentra el último deployment (el más reciente)
3. Haz clic en los **3 puntos** (⋯) a la derecha del deployment
4. Selecciona **Redeploy**
5. Espera a que termine el build (puede tomar 2-5 minutos)

### Opción B: Push a Git (Recomendado)

1. Haz un pequeño cambio en tu código (o solo haz commit de los cambios actuales)
2. Haz push a tu repositorio:
   ```bash
   git add .
   git commit -m "Configurar variables de entorno"
   git push
   ```
3. Vercel detectará el push y hará un deploy automático

## ✅ Paso 8: Verificar que Funcione

Después del deploy:

1. Espera a que el deployment termine (verás "Ready" en verde)
2. Abre tu aplicación en Vercel
3. Abre las herramientas de desarrollador (F12)
4. Ve a la pestaña **Console**
5. Ejecuta:

```javascript
const config = window.__APP_CONFIG__
console.log('API URL:', config?.API_BASE_URL)
```

**Resultado esperado:**
- ✅ Deberías ver tu URL de Railway (ej: `https://tu-proyecto.up.railway.app`)
- ❌ Si aún ves `undefined`, espera unos minutos y recarga la página

## 🐛 Solución de Problemas

### ❌ Sigo viendo `undefined` después del deploy

**Posibles causas:**

1. **El deploy aún no terminó:**
   - Ve a **Deployments** en Vercel
   - Verifica que el último deployment esté en estado "Ready" (verde)
   - Espera 2-3 minutos más y recarga la página

2. **Las variables no están en Production:**
   - Ve a **Settings** → **Environment Variables**
   - Verifica que las variables tengan ✅ en **Production**
   - Si no, edítalas y selecciona Production

3. **Error de tipeo en el nombre:**
   - Verifica que sea exactamente: `NEXT_PUBLIC_API_BASE_URL`
   - No debe tener espacios
   - Debe tener el prefijo `NEXT_PUBLIC_`

4. **Cache del navegador:**
   - Haz un hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
   - O abre en modo incógnito

### ❌ No encuentro "Environment Variables" en Settings

**Ubicaciones alternativas:**

1. **En el menú Settings:**
   - Settings → Environment Variables
   - O Settings → Variables

2. **Durante el deploy:**
   - Si estás creando un proyecto nuevo, las variables aparecen en la pantalla de configuración antes del deploy

3. **En el proyecto:**
   - Ve a tu proyecto → Settings → Environment Variables

### ❌ La URL de Railway no funciona

**Verifica:**

1. **Que el servicio esté Running:**
   - Ve a Railway Dashboard
   - Verifica que el servicio esté activo (no pausado)

2. **Que la URL sea correcta:**
   - Prueba abrir la URL directamente en el navegador
   - Deberías ver una respuesta (aunque sea un error 404 o 401)

3. **Que no tenga barra final:**
   - Correcto: `https://tu-proyecto.up.railway.app`
   - Incorrecto: `https://tu-proyecto.up.railway.app/`

## 📸 Ejemplo Visual de la Configuración

```
Vercel Dashboard
├── Tu Proyecto
    ├── Settings
        ├── Environment Variables
            ├── Add New
                ├── Key: NEXT_PUBLIC_API_BASE_URL
                ├── Value: https://tu-proyecto.up.railway.app
                └── Environment: ✅ Production, ✅ Preview
```

## ✅ Checklist Final

Antes de considerar que está configurado:

- [ ] URL de Railway copiada correctamente
- [ ] Variable `NEXT_PUBLIC_API_BASE_URL` agregada en Vercel
- [ ] Variable `NEXT_PUBLIC_WS_URL` agregada en Vercel
- [ ] Ambas variables tienen ✅ en **Production**
- [ ] Nuevo deploy realizado (y terminado)
- [ ] Al verificar en consola, se muestra la URL de Railway (no `undefined`)

## 🆘 Si Nada Funciona

1. **Verifica los logs de build en Vercel:**
   - Ve a **Deployments** → Último deployment → **Build Logs**
   - Busca errores relacionados con variables de entorno

2. **Contacta soporte:**
   - Si después de seguir todos los pasos sigue sin funcionar
   - Puede ser un problema con la configuración del proyecto en Vercel

3. **Prueba crear un proyecto nuevo:**
   - A veces es más fácil empezar de cero
   - Importa tu repositorio nuevamente
   - Configura las variables durante la creación del proyecto

