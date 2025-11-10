# 🔧 Solución Rápida para Error 404 en Vercel

## 🎯 Solución Más Simple (Recomendada)

### Opción A: Eliminar vercel.json y usar detección automática

1. **Elimina el archivo `vercel.json`** (Vercel detecta Next.js automáticamente)
2. **En Vercel, ve a tu proyecto**
3. **Settings** → **General** → Busca **"Root Directory"**
4. Si no lo encuentras, ve a la pestaña **"Deployments"**
5. Haz clic en los **tres puntos** del último deployment
6. Selecciona **"Redeploy"**

### Opción B: Configurar durante el import (Si creas un proyecto nuevo)

Cuando importas el repositorio:

1. Vercel te mostrará una pantalla de configuración
2. **ANTES de hacer clic en "Deploy"**, busca:
   - Un botón que diga **"Show Advanced Options"** o **"Configure"**
   - O busca directamente el campo **"Root Directory"**
3. Escribe: `Frontend` (sin `/`)
4. Luego haz clic en **"Deploy"**

## 📍 Dónde Buscar Root Directory en Vercel

### Si el proyecto YA está creado:

**Método 1: Settings**
1. Ve a tu proyecto en Vercel
2. Click en **"Settings"** (arriba a la derecha)
3. En el menú lateral izquierdo, click en **"General"**
4. Desplázate hacia abajo
5. Busca **"Root Directory"** (puede estar al final de la página)

**Método 2: Durante el Deploy**
1. Ve a **"Deployments"**
2. Haz clic en **"..."** (tres puntos) del deployment
3. Selecciona **"Redeploy"**
4. En la pantalla de redeploy, busca opciones avanzadas
5. Ahí deberías ver **"Root Directory"**

**Método 3: Si no encuentras la opción**
- Puede que tu plan de Vercel (Hobby/Free) no muestre esta opción en Settings
- En ese caso, **elimina el vercel.json** y deja que Vercel detecte automáticamente
- O crea un nuevo proyecto y configúralo desde el inicio

## 🚀 Solución Alternativa: Crear proyecto desde cero

Si nada funciona, crea un proyecto nuevo:

1. En Vercel, click en **"Add New Project"**
2. Importa tu repositorio
3. **ANTES de hacer Deploy**, busca y configura:
   - **Root Directory:** `Frontend`
4. Configura las variables de entorno
5. Haz clic en **"Deploy"**

## ✅ Verificación

Después de configurar:
1. Ve a **Deployments**
2. Espera a que termine el build
3. Haz clic en la URL del deployment
4. Deberías ver tu aplicación (no el error 404)

## 🆘 Si Nada Funciona

**Última opción:** Crear un repositorio separado solo con el Frontend:

1. Crea una nueva carpeta
2. Copia todo el contenido de `Frontend/` a la nueva carpeta
3. Crea un nuevo repositorio Git
4. Sube el código
5. Conecta ese repositorio a Vercel (sin necesidad de Root Directory)

---

¿Seguís sin encontrarlo? Comparte una captura de pantalla de tu Settings en Vercel y te ayudo a ubicarlo.

