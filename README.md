# App Tickets - Sistema de Gestión de Tickets IT para Grupo Nods

Sistema completo de gestión de tickets de soporte IT integrado con Botmaker y Supabase.

## 🚀 Características

- **Tablero Kanban**: Gestión visual de tickets con drag & drop
- **Integración con Botmaker**: Cada sesión de chat crea automáticamente un ticket
- **Sistema de Roles**: Administrador, Gerente y Líder con permisos diferenciados
- **Tiempo Real**: Actualizaciones en vivo con WebSocket (Socket.IO)
- **Base de Datos**: Supabase como backend
- **Frontend Moderno**: Next.js 14 con TypeScript y Tailwind CSS

## 📁 Estructura del Proyecto

```
.
├── backend/          # Backend Express con Supabase
│   ├── src/         # Código fuente del backend
│   ├── Dockerfile    # Configuración para deployment
│   └── README.md     # Documentación del backend
├── Frontend/         # Frontend Next.js
│   ├── app/         # Páginas y rutas
│   ├── components/  # Componentes React
│   └── README.md    # Documentación del frontend
└── README.md        # Este archivo
```

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- Socket.IO (WebSocket)
- TypeScript

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Socket.IO Client

## 📋 Prerequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de Supabase
- Cuenta de Botmaker
- Cuenta en Railway/Render/Fly.io (para deployment)

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/agustama27/app-tickets-botmaker-agus.git
cd app-tickets-botmaker-agus
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve al SQL Editor y ejecuta el script `backend/supabase-schema.sql`
3. Obtén tus credenciales:
   - `SUPABASE_URL` (Settings > API > Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings > API > service_role key)

### 3. Configurar Backend

```bash
cd backend
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
BM_SHARED_SECRET=tu-secret-compartido
ALLOWED_ORIGINS=http://localhost:3000
```

Instala dependencias y ejecuta:
```bash
pnpm install
pnpm dev
```

El backend estará en `http://localhost:8080`

### 4. Configurar Frontend

```bash
cd Frontend
cp .env.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

Instala dependencias y ejecuta:
```bash
pnpm install
pnpm dev
```

El frontend estará en `http://localhost:3000`

## 📚 Documentación

- [Backend README](backend/README.md) - Documentación completa del backend
- [Frontend README](Frontend/README.md) - Documentación del frontend
- [Integración Botmaker](backend/BOTMAKER_INTEGRATION.md) - Guía de integración con Botmaker

## 🔐 Sistema de Roles

- **ADMIN**: Ve todos los tickets, puede gestionar usuarios y estructura
- **MANAGER**: Ve tickets de su área, puede asignar tickets
- **LEAD**: Ve tickets de su equipo

## 🔗 Integración con Botmaker

El sistema está diseñado para recibir webhooks de Botmaker. Cada nueva sesión de chat crea automáticamente un ticket.

Ver [BOTMAKER_INTEGRATION.md](backend/BOTMAKER_INTEGRATION.md) para detalles completos.

## 🚢 Deployment

### Backend

El backend puede deployarse en:
- **Railway** (recomendado) - Ver [README del backend](backend/README.md#despliegue)
- **Render**
- **Fly.io**

### Frontend

El frontend puede deployarse en:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Railway**

## 📝 Licencia

Este proyecto es privado y propiedad de Grupo Nods.

## 👥 Contribuidores

- Desarrollo inicial: Agustín

---

Para más información, consulta la documentación en cada directorio.

