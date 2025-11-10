# Bloque de Código para Botmaker - Envío de Datos de Registro

## Instrucciones para Configurar en Botmaker

### Paso 1: Crear Acción de Código

1. En Botmaker, ve a tu flujo de registro
2. Después del paso donde se guardan las variables, agrega un bloque **"Acción de código"**
3. Selecciona **Node 20** como runtime

### Paso 2: Copiar el Código

Copia y pega el siguiente código en el bloque de acción de código:

```javascript
// Bloque de código para Botmaker - Acción de código (Node 20)
// Este código debe ejecutarse después del flujo de registro
// Envía los datos del registro al webhook de la aplicación

// Obtener las variables del flujo de registro
// En Botmaker, las variables están disponibles directamente
const contactFirstName = contactFirstName || variables?.contactFirstName || '';
const contactLastName = contactLastName || variables?.contactLastName || '';
const contactEmails = contactEmails || variables?.contactEmails || '';
const areaDeTrabajo = areaDeTrabajo || variables?.areaDeTrabajo || '';
const puestoDeTrabajo = puestoDeTrabajo || variables?.puestoDeTrabajo || '';

// URL del webhook (reemplaza con tu URL de Railway)
const WEBHOOK_URL = 'https://app-tickets-botmaker-agus-production.up.railway.app/webhooks/botmaker';

// Preparar el payload con los datos del registro
const payload = {
  type: 'message',
  sessionId: sessionId || customerId || '',
  chatChannelId: chatChannelId || '',
  whatsappNumber: whatsappNumber || contactId || '',
  contactId: contactId || '',
  firstName: contactFirstName,
  lastName: contactLastName,
  variables: {
    contactFirstName: contactFirstName,
    contactLastName: contactLastName,
    contactEmails: contactEmails,
    areaDeTrabajo: areaDeTrabajo,
    puestoDeTrabajo: puestoDeTrabajo,
  },
  messages: messages || [],
};

// Enviar al webhook
try {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (response.ok) {
    console.log('✅ Datos enviados correctamente al webhook:', responseData);
    // Opcional: guardar confirmación en variables
    variables.registrationSent = 'true';
  } else {
    console.error('❌ Error al enviar datos:', response.status, responseData);
    variables.registrationError = responseData.error || 'Error desconocido';
  }
} catch (error) {
  console.error('❌ Error de conexión:', error);
  variables.registrationError = error.message || 'Error de conexión';
}

// Retornar éxito para continuar el flujo
return {
  success: true,
  message: 'Datos de registro enviados correctamente'
};
```

### Paso 3: Configurar Variables en Botmaker

Asegúrate de que las variables del flujo de registro se llamen exactamente:
- `${contactFirstName}`
- `${contactLastName}`
- `${contactEmails}`
- `${areaDeTrabajo}`
- `${puestoDeTrabajo}`

### Paso 4: Verificar la URL del Webhook

Reemplaza la URL en el código con tu URL real de Railway:
```javascript
const WEBHOOK_URL = 'https://tu-url-railway.up.railway.app/webhooks/botmaker';
```

### Paso 5: Probar

1. Ejecuta el flujo de registro desde WhatsApp
2. Verifica en los logs de Railway que se recibió el webhook
3. Verifica en Supabase que se creó/actualizó el contacto con los datos correctos

## Notas Importantes

- El código busca automáticamente el área y equipo por nombre en la base de datos
- Si el área o equipo no existe, se guardará el contacto sin área/equipo (aparecerá un warning en los logs)
- Asegúrate de que los nombres de áreas y equipos en Supabase coincidan exactamente con los que vienen de Botmaker
- El email debe terminar en `@gruponods.com` (esto se valida en el endpoint `/api/contacts/register`)

## Troubleshooting

### El código no encuentra el área/equipo

1. Verifica en Supabase que existan las áreas y equipos con esos nombres exactos
2. Los nombres son case-insensitive (no importan mayúsculas/minúsculas)
3. Revisa los logs de Railway para ver qué nombre se está buscando

### El webhook no recibe los datos

1. Verifica que la URL del webhook sea correcta
2. Revisa los logs de Railway para ver si hay errores
3. Verifica que las variables estén guardadas correctamente en Botmaker antes de ejecutar el código

