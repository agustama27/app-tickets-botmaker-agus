// Bloque de código para Botmaker - Acción de código (Node 20)
// Este código debe ejecutarse después del flujo de registro
// Envía los datos del registro al webhook de la aplicación

// Función async para manejar el await
(async function() {
  // Obtener variables del flujo (ya están disponibles globalmente en Botmaker)
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
      console.log('✅ Datos enviados correctamente al webhook:', responseData);
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
})();

// Retornar éxito para continuar el flujo
return {
  success: true,
  message: 'Datos de registro enviados correctamente'
};
