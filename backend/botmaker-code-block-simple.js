// Bloque de código para Botmaker - Versión Simplificada
// Acción de código (Node 20)
// Este código debe ejecutarse después del flujo de registro

// Obtener las variables del flujo (ya están disponibles globalmente en Botmaker)
const firstName = contactFirstName || variables?.contactFirstName || '';
const lastName = contactLastName || variables?.contactLastName || '';
const email = contactEmails || variables?.contactEmails || '';
const area = areaDeTrabajo || variables?.areaDeTrabajo || '';
const puesto = puestoDeTrabajo || variables?.puestoDeTrabajo || '';

// URL del webhook
const WEBHOOK_URL = 'https://app-tickets-botmaker-agus-production.up.railway.app/webhooks/botmaker';

// Preparar el payload
const payload = {
  type: 'message',
  sessionId: sessionId || customerId || '',
  chatChannelId: chatChannelId || '',
  whatsappNumber: whatsappNumber || contactId || '',
  contactId: contactId || '',
  firstName: firstName,
  lastName: lastName,
  variables: {
    contactFirstName: firstName,
    contactLastName: lastName,
    contactEmails: email,
    areaDeTrabajo: area,
    puestoDeTrabajo: puesto,
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
    console.log('✅ Datos enviados correctamente');
    if (variables) {
      variables.registrationSent = 'true';
    }
  } else {
    console.error('❌ Error:', response.status, responseData);
    if (variables) {
      variables.registrationError = responseData.error || 'Error desconocido';
    }
  }
} catch (error) {
  console.error('❌ Error de conexión:', error);
  if (variables) {
    variables.registrationError = error.message || 'Error de conexión';
  }
}

// Retornar éxito
return { success: true, message: 'Datos enviados correctamente' };

