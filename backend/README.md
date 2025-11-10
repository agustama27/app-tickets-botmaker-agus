# Backend - App Tickets

Backend Express con Supabase para gestión de tickets de soporte integrado con Botmaker.

## Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
NODE_ENV=development
PORT=8080
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
BM_SHARED_SECRET=<tu-secret-compartido>
BM_API_BASE=https://api.botmaker.com
BM_API_TOKEN=<tu-token-de-botmaker>
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=<tu-secret-jwt>
```

### Obtener Credenciales de Supabase

1. Ve a tu proyecto en Supabase
2. Settings > API
3. Copia la "Project URL" → `SUPABASE_URL`
4. Copia la "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (¡mantén esto secreto!)

## Instalación

```bash
pnpm install
```

## Configuración de Base de Datos (Supabase)

### Crear Tablas

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta el script `supabase-schema.sql` que está en la raíz del backend
4. Esto creará todas las tablas, tipos ENUM, índices y políticas RLS necesarias

## Desarrollo

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:8080`

## Build

```bash
pnpm build
```

## Producción

```bash
pnpm start
```

## Endpoints

### Health
- `GET /health` - Health check

### Auth
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/session` - Obtener sesión actual

### Tickets
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/:id` - Obtener ticket
- `PATCH /api/tickets/:id` - Actualizar ticket
- `GET /api/tickets/:id/messages` - Obtener mensajes
- `POST /api/tickets/:id/reply` - Responder ticket

### Estructura
- `GET /api/areas` - Listar áreas
- `GET /api/teams` - Listar equipos

### Contacts
- `GET /api/contacts` - Listar contactos
- `POST /api/contacts/upsert` - Crear/actualizar contacto (requiere `x-bm-shared-secret`)
- `POST /api/contacts/register` - Registrar contacto desde Botmaker (requiere `x-bm-shared-secret`)

### Webhooks
- `POST /webhooks/botmaker` - Webhook de Botmaker (requiere `x-bm-shared-secret`)

## WebSocket Events

El servidor emite los siguientes eventos Socket.IO:

- `TICKET_CREATED` - Nuevo ticket creado
- `TICKET_UPDATED` - Ticket actualizado
- `MESSAGE_NEW` - Nuevo mensaje

## Despliegue

### Opción 1: Railway (Recomendado)

1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto y conecta tu repositorio
3. Railway detectará automáticamente el `Dockerfile` en el directorio `backend`
4. Configura las variables de entorno en Railway:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BM_SHARED_SECRET`
   - `ALLOWED_ORIGINS` (ej: `https://tu-frontend.vercel.app,https://tu-dominio.com`)
   - `PORT` (Railway lo asigna automáticamente, pero puedes dejarlo en 8080)
5. Railway te dará una URL pública automáticamente
6. **URL del backend**: `https://tu-proyecto.up.railway.app`

### Opción 2: Render

1. Ve a [Render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio y selecciona el directorio `backend`
4. Configura:
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Environment**: Node
5. Configura las variables de entorno
6. **URL del backend**: `https://tu-proyecto.onrender.com`

### Opción 3: Fly.io

1. Instala Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. En el directorio `backend`: `fly launch`
3. Configura secrets: `fly secrets set KEY=value`
4. Deploy: `fly deploy`
5. **URL del backend**: `https://tu-proyecto.fly.dev`

### Opción 4: Vercel (con serverless functions)

Requiere configuración adicional. Ver [documentación de Vercel](https://vercel.com/docs).

### Desarrollo Local con ngrok

Para probar webhooks localmente:

1. Ejecuta el backend: `pnpm dev`
2. En otra terminal: `ngrok http 8080`
3. Usa la URL de ngrok para configurar el webhook en Botmaker

## Notas

- La aplicación usa Supabase directamente (sin Prisma)
- El webhook de Botmaker espera recibir eventos con la siguiente estructura:
  - `event`: tipo de evento (session_start, message, tag_assigned)
  - `chatId`: ID de la sesión de chat
  - `channelId`: ID del canal
  - `phone`: número de teléfono
  - `message`: datos del mensaje (opcional)
  - `tag`: etiqueta asignada en Botmaker (tipo de solicitud)
  - `contactData`: datos del contacto del flujo de registro (nombre, email, área, equipo)
- Cada nueva sesión de chat crea un nuevo ticket automáticamente

