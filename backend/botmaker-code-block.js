// Bloque de código para Botmaker - Acción de código (Node 20)
// Este código debe ejecutarse después del flujo de registro
// Envía los datos del registro al webhook de la aplicación

// Obtener las variables del flujo de registro
const contactFirstName = variables.contactFirstName || '';
const contactLastName = variables.contactLastName || '';
const contactEmails = variables.contactEmails || '';
const areaDeTrabajo = variables.areaDeTrabajo || '';
const puestoDeTrabajo = variables.puestoDeTrabajo || '';

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

