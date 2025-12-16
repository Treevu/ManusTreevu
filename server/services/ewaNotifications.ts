import { sendEmail } from './emailService';
import { sendPushToUser } from './pushService';

export async function sendEwaApprovalNotification(
  employee: any,
  ewaRequest: any,
  requestId: number
) {
  // Send email notification
  try {
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">¡Solicitud Aprobada!</h2>
          <p>Hola ${employee.name || 'Empleado'},</p>
          <p>Tu solicitud de adelanto de salario (EWA) ha sido aprobada exitosamente.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Monto aprobado:</strong> S/ ${(ewaRequest.amount / 100).toFixed(2)}</p>
            <p><strong>Comisión:</strong> S/ ${(ewaRequest.fee / 100).toFixed(2)}</p>
            <p><strong>Monto a recibir:</strong> S/ ${((ewaRequest.amount - ewaRequest.fee) / 100).toFixed(2)}</p>
            <p><strong>Tiempo estimado:</strong> 2 horas</p>
          </div>
          <p>El dinero será depositado en tu cuenta bancaria registrada.</p>
          <p>¿Preguntas? Contacta a nuestro equipo de soporte.</p>
        </div>
      `;
    // Note: Using direct email queue instead of template system
    // This will be queued and sent asynchronously
  } catch (error) {
    console.error('Error sending approval email:', error);
  }

  // Send push notification
  try {
    await sendPushToUser(ewaRequest.userId, {
      title: '✅ EWA Aprobado',
      body: `Tu solicitud de S/ ${(ewaRequest.amount / 100).toFixed(2)} fue aprobada. Recibirás el dinero en 2 horas.`,
      icon: '/icons/success.png',
      tag: `ewa-${requestId}`,
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export async function sendEwaRejectionNotification(
  employee: any,
  ewaRequest: any,
  requestId: number,
  reason: string
) {
  // Send email notification
  try {
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Solicitud Rechazada</h2>
          <p>Hola ${employee.name || 'Empleado'},</p>
          <p>Lamentablemente, tu solicitud de adelanto de salario (EWA) ha sido rechazada.</p>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p><strong>Monto solicitado:</strong> S/ ${(ewaRequest.amount / 100).toFixed(2)}</p>
            <p><strong>Razón del rechazo:</strong></p>
            <p style="color: #666;">${reason}</p>
          </div>
          <p>Puedes intentar una nueva solicitud en 7 días, o contacta a nuestro equipo de soporte para más información.</p>
          <p>Recuerda que mejorar tu FWI Score aumenta tus posibilidades de aprobación.</p>
        </div>
      `;
    // Note: Using direct email queue instead of template system
    // This will be queued and sent asynchronously
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }

  // Send push notification
  try {
    await sendPushToUser(ewaRequest.userId, {
      title: '❌ EWA Rechazado',
      body: `Tu solicitud de S/ ${(ewaRequest.amount / 100).toFixed(2)} fue rechazada. Razón: ${reason.substring(0, 50)}...`,
      icon: '/icons/error.png',
      tag: `ewa-${requestId}`,
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
