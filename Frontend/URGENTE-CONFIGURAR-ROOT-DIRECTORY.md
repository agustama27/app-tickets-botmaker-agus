# 🚨 URGENTE: El Root Directory DEBE estar configurado en Vercel

## El Problema

El error `./Frontend/components/ui/dropdown-menu.tsx:4:1` indica que **Vercel está construyendo desde la raíz del repositorio**, no desde `Frontend/`.

Esto significa que **el Root Directory NO está configurado correctamente** en el dashboard de Vercel.

## ✅ SOLUCIÓN OBLIGATORIA

### Opción 1: Configurar Root Directory en Vercel Dashboard (RECOMENDADO)

1. **Ve a:** https://vercel.com/dashboard
2. **Selecciona tu proyecto**
3. **Haz clic en "Settings"** (arriba a la derecha)
4. **En el menú lateral izquierdo, haz clic en "General"**
5. **Desplázate HASTA EL FINAL de la página**
6. **Busca la sección "Root Directory"**
   - Puede estar al final, después de todas las otras configuraciones
   - Puede estar en una sección colapsada
7. **Si está vacío o dice `/`**, cámbialo a: `Frontend` (sin `/`)
8. **Haz clic en "Save"**
9. **Ve a "Deployments"**
10. **Haz clic en los tres puntos (...) del último deployment**
11. **Selecciona "Redeploy"**

### Opción 2: Si NO encuentras Root Directory en Settings

**Crear proyecto NUEVO desde cero:**

1. **Elimina el proyecto actual** en Vercel (Settings > General > Delete Project)
2. **Crea un proyecto nuevo:**
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio
3. **ANTES de hacer "Deploy":**
   - Busca **"Configure Project"** o **"Edit"** (junto a Framework Preset)
   - O busca **"Show Advanced Options"**
   - Ahí deberías ver **"Root Directory"**
   - Configúralo como: `Frontend`
4. **Configura las variables de entorno**
5. **Haz clic en "Deploy"**

### Opción 3: Solución Alternativa - Mover Frontend a la Raíz

Si ninguna de las opciones anteriores funciona:

1. **Crea un nuevo repositorio Git** (ej: `app-tickets-frontend`)
2. **Copia TODO el contenido de `Frontend/`** al nuevo repositorio
3. **Conecta ese repositorio a Vercel**
4. **No necesitarás configurar Root Directory** porque el proyecto estará en la raíz

## 🔍 Dónde Buscar Root Directory

En Settings > General, el Root Directory puede estar:
- ✅ Al final de la página (desplázate hacia abajo)
- ✅ En una sección colapsada (busca botones para expandir)
- ✅ Junto a otras configuraciones de build
- ✅ Como un campo de texto o dropdown

## ⚠️ IMPORTANTE

**Sin configurar el Root Directory correctamente, el build SIEMPRE fallará** porque Vercel seguirá intentando construir desde la raíz del repositorio.

El `vercel.json` ayuda, pero **Vercel requiere que también esté configurado en el Dashboard**.

---

**¿Seguís sin encontrarlo?** Toma una captura de pantalla de Settings > General y te ayudo a ubicarlo.

