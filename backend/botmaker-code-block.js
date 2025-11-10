// Bloque de código para Botmaker - Acción de código (Node 20)
// Este código debe ejecutarse después del flujo de registro
// Envía los datos del registro al webhook de la aplicación

// IMPORTANTE: En Botmaker, las variables pueden estar en el objeto "variables" o como variables globales
// Este código maneja ambos casos

// Obtener las variables del flujo de registro
// Intentar desde variables globales primero, luego desde el objeto variables
const contactFirstName = typeof contactFirstName !== 'undefined' ? contactFirstName : (variables?.contactFirstName || '');
const contactLastName = typeof contactLastName !== 'undefined' ? contactLastName : (variables?.contactLastName || '');
const contactEmails = typeof contactEmails !== 'undefined' ? contactEmails : (variables?.contactEmails || '');
const areaDeTrabajo = typeof areaDeTrabajo !== 'undefined' ? areaDeTrabajo : (variables?.areaDeTrabajo || '');
const puestoDeTrabajo = typeof puestoDeTrabajo !== 'undefined' ? puestoDeTrabajo : (variables?.puestoDeTrabajo || '');

// URL del webhook (reemplaza con tu URL de Railway)
const WEBHOOK_URL = 'https://app-tickets-botmaker-agus-production.up.railway.app/webhooks/botmaker';

// Preparar el payload con los datos del registro
// Nota: En Botmaker, estas variables están disponibles globalmente en el contexto de la acción de código
const payload = {
  type: 'message',
  sessionId: typeof sessionId !== 'undefined' ? sessionId : (customerId || ''),
  chatChannelId: typeof chatChannelId !== 'undefined' ? chatChannelId : '',
  whatsappNumber: typeof whatsappNumber !== 'undefined' ? whatsappNumber : (contactId || ''),
  contactId: typeof contactId !== 'undefined' ? contactId : '',
  firstName: contactFirstName,
  lastName: contactLastName,
  variables: {
    contactFirstName: contactFirstName,
    contactLastName: contactLastName,
    contactEmails: contactEmails,
    areaDeTrabajo: areaDeTrabajo,
    puestoDeTrabajo: puestoDeTrabajo,
  },
  messages: typeof messages !== 'undefined' ? messages : [],
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
    if (typeof variables !== 'undefined') {
      variables.registrationSent = 'true';
    }
  } else {
    console.error('❌ Error al enviar datos:', response.status, responseData);
    if (typeof variables !== 'undefined') {
      variables.registrationError = responseData.error || 'Error desconocido';
    }
  }
} catch (error) {
  console.error('❌ Error de conexión:', error);
  if (typeof variables !== 'undefined') {
    variables.registrationError = error.message || 'Error de conexión';
  }
}

// Retornar éxito para continuar el flujo
return {
  success: true,
  message: 'Datos de registro enviados correctamente'
};
