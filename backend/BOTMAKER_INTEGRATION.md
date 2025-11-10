# Integración con Botmaker

Esta guía explica cómo configurar Botmaker para que se integre correctamente con la aplicación de tickets.

## Configuración del Webhook en Botmaker

### Paso 1: Deployar el Backend

Tienes varias opciones para deployar tu backend:

#### Opción 1: Railway (Recomendado)

1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto y conecta tu repositorio
3. Railway detectará automáticamente el `Dockerfile`
4. Configura las variables de entorno en Railway:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BM_SHARED_SECRET`
   - `ALLOWED_ORIGINS` (con la URL de tu frontend)
   - `PORT` (Railway lo asigna automáticamente)
5. Una vez deployado, Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
6. **Tu URL del webhook será**: `https://tu-proyecto.up.railway.app/webhooks/botmaker`

#### Opción 2: Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Crea un nuevo "Web Service" y conecta tu repositorio
3. Selecciona el directorio `backend`
4. Configura:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Environment: Node
5. Configura las variables de entorno
6. Render te dará una URL como: `https://tu-proyecto.onrender.com`
7. **Tu URL del webhook será**: `https://tu-proyecto.onrender.com/webhooks/botmaker`

#### Opción 3: Fly.io

1. Instala Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. En el directorio `backend`, ejecuta: `fly launch`
3. Configura las variables de entorno: `fly secrets set KEY=value`
4. Deploy: `fly deploy`
5. **Tu URL del webhook será**: `https://tu-proyecto.fly.dev/webhooks/botmaker`

#### Opción 4: Desarrollo Local con ngrok (Solo para pruebas)

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta tu backend localmente: `pnpm dev`
3. En otra terminal, ejecuta: `ngrok http 8080`
4. ngrok te dará una URL temporal como: `https://abc123.ngrok.io`
5. **Tu URL del webhook será**: `https://abc123.ngrok.io/webhooks/botmaker`
6. ⚠️ **Nota**: Esta URL cambia cada vez que reinicias ngrok (a menos que tengas cuenta de pago)

### Paso 2: Configurar el Webhook en Botmaker

1. Ve a la configuración de tu bot en Botmaker
2. Busca la sección de "Webhooks" o "Integraciones"
3. Configura el webhook URL con la URL que obtuviste arriba:
   - Ejemplo Railway: `https://tu-proyecto.up.railway.app/webhooks/botmaker`
   - Ejemplo Render: `https://tu-proyecto.onrender.com/webhooks/botmaker`
4. Configura el header `x-bm-shared-secret` con el valor de `BM_SHARED_SECRET` de tu `.env`
5. Guarda la configuración

### Verificar que Funciona

1. Envía un mensaje de prueba desde WhatsApp a tu bot
2. Revisa los logs de tu backend (en Railway, Render, etc.) para ver si recibes el webhook
3. Verifica en tu base de datos de Supabase que se creó el contacto y el ticket

## Estructura de Datos Esperada

El webhook espera recibir eventos con la siguiente estructura JSON:

### Evento: Nueva Sesión (session_start)

```json
{
  "event": "session_start",
  "chatId": "chat_123456",
  "channelId": "whatsapp",
  "phone": "+5491123456789",
  "contactData": {
    "name": "Juan Pérez",
    "email": "juan.perez@gruponods.com",
    "area_id": "uuid-del-area",
    "team_id": "uuid-del-equipo"
  }
}
```

### Evento: Nuevo Mensaje (message)

```json
{
  "event": "message",
  "chatId": "chat_123456",
  "channelId": "whatsapp",
  "phone": "+5491123456789",
  "message": {
    "id": "msg_123",
    "direction": "inbound",
    "text": "Hola, tengo un problema",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Evento: Etiqueta Asignada (tag_assigned)

```json
{
  "event": "tag_assigned",
  "chatId": "chat_123456",
  "channelId": "whatsapp",
  "phone": "+5491123456789",
  "tag": "Solicitud de Hardware"
}
```

## Flujo de Registro

Cuando un usuario inicia su primera sesión, Botmaker debe:

1. Ejecutar el flujo de registro que solicita:
   - Nombre completo
   - Correo electrónico (debe terminar en @gruponods.com)
   - Área de trabajo
   - Equipo al cual pertenece

2. Enviar los datos de registro al endpoint `/api/contacts/register`:

```json
POST /api/contacts/register
Headers:
  x-bm-shared-secret: <tu-secret>

Body:
{
  "phone": "+5491123456789",
  "name": "Juan Pérez",
  "email": "juan.perez@gruponods.com",
  "area_id": "uuid-del-area",
  "team_id": "uuid-del-equipo",
  "channel_id": "whatsapp",
  "chat_id": "chat_123456"
}
```

3. Asignar una etiqueta en Botmaker según el tipo de solicitud elegido en el menú

4. Enviar el evento `tag_assigned` al webhook con el valor de la etiqueta

## Creación Automática de Tickets

- Cada nueva sesión de chat (`session_start`) crea automáticamente un nuevo ticket
- Si ya existe un ticket para ese `chatId`, se actualiza en lugar de crear uno nuevo
- El ticket se asocia automáticamente con el contacto usando el número de teléfono como clave
- Si el contacto tiene `area_id` y `team_id`, estos se asignan automáticamente al ticket

## Tipos de Solicitud (Etiquetas)

Las etiquetas que asignes en Botmaker se guardan como el `type` y `tag` del ticket. Ejemplos:

- "Solicitud de Hardware"
- "Problema de Software"
- "Acceso a Sistemas"
- "Consulta General"
- etc.

## Seguridad

- Todos los endpoints relacionados con Botmaker requieren el header `x-bm-shared-secret`
- Asegúrate de usar un secreto fuerte y no compartirlo públicamente
- El secreto debe coincidir con la variable de entorno `BM_SHARED_SECRET`
- **Nunca** subas tu archivo `.env` al repositorio
- Usa variables de entorno en tu plataforma de deployment (Railway, Render, etc.)

## Troubleshooting

### El webhook no recibe eventos

1. Verifica que la URL del webhook sea correcta y accesible públicamente
2. Verifica que el header `x-bm-shared-secret` coincida exactamente con `BM_SHARED_SECRET`
3. Revisa los logs de tu backend para ver errores
4. Prueba hacer un `curl` manual:
   ```bash
   curl -X POST https://tu-backend.com/webhooks/botmaker \
     -H "Content-Type: application/json" \
     -H "x-bm-shared-secret: tu-secret" \
     -d '{"event":"session_start","chatId":"test","phone":"+1234567890","channelId":"whatsapp"}'
   ```

### Error 401 Unauthorized

- Verifica que el header `x-bm-shared-secret` esté configurado correctamente en Botmaker
- Verifica que la variable `BM_SHARED_SECRET` en tu backend sea la misma

### Los tickets no se crean

1. Verifica que el script SQL se haya ejecutado en Supabase
2. Verifica las credenciales de Supabase (`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`)
3. Revisa los logs del backend para ver errores específicos

