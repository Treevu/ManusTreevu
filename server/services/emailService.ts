import { Resend } from 'resend';
import { getDb } from '../db';
import { emailQueue, users } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

// Initialize Resend client (lazy initialization to avoid errors when key is missing)
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Email templates
const EMAIL_TEMPLATES: Record<string, (data: any) => { subject: string; html: string }> = {
  ewa_approved: (data) => ({
    subject: `¡Tu adelanto de $${(data.amount / 100).toFixed(2)} ha sido aprobado!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .amount { font-size: 48px; font-weight: bold; color: #10B981; text-align: center; margin: 20px 0; }
          .info-box { background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dcfce7; }
          .info-row:last-child { border-bottom: none; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Adelanto Aprobado!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Tu solicitud de adelanto de salario ha sido aprobada.</p>
            <div class="amount">$${(data.amount / 100).toFixed(2)}</div>
            <div class="info-box">
              <div class="info-row">
                <span>Monto solicitado:</span>
                <strong>$${(data.amount / 100).toFixed(2)}</strong>
              </div>
              <div class="info-row">
                <span>Fee de servicio:</span>
                <strong>$${(data.fee / 100).toFixed(2)}</strong>
              </div>
              <div class="info-row">
                <span>Monto a recibir:</span>
                <strong>$${((data.amount - data.fee) / 100).toFixed(2)}</strong>
              </div>
            </div>
            <p>El dinero será transferido a tu cuenta en las próximas 24 horas.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/ewa'}" class="btn">Ver Detalles</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
            <p>Si no solicitaste este adelanto, contacta a soporte inmediatamente.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  ewa_rejected: (data) => ({
    subject: 'Tu solicitud de adelanto no fue aprobada',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .reason-box { background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Solicitud No Aprobada</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Lamentamos informarte que tu solicitud de adelanto no pudo ser aprobada en este momento.</p>
            <div class="reason-box">
              <strong>Motivo:</strong>
              <p>${data.reason || 'No cumple con los requisitos mínimos para un adelanto en este momento.'}</p>
            </div>
            <p><strong>¿Qué puedes hacer?</strong></p>
            <ul>
              <li>Mejora tu FWI Score completando metas financieras</li>
              <li>Espera unos días y vuelve a intentarlo</li>
              <li>Contacta a soporte si tienes dudas</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/dashboard/employee'}" class="btn">Mejorar mi FWI</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  treepoints_received: (data) => ({
    subject: `¡Ganaste ${data.points} TreePoints! 🌳`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .points { font-size: 64px; font-weight: bold; color: #8B5CF6; margin: 20px 0; }
          .balance { background: #f5f3ff; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .btn { display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌳 ¡TreePoints Recibidos!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>¡Felicitaciones! Has ganado TreePoints por ${data.reason || 'tu actividad en la plataforma'}.</p>
            <div class="points">+${data.points}</div>
            <div class="balance">
              <p style="margin: 0; color: #6b7280;">Tu balance actual:</p>
              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #8B5CF6;">${data.balance} TreePoints</p>
            </div>
            <p style="margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/offers'}" class="btn">Canjear Puntos</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  goal_completed: (data) => ({
    subject: `🎯 ¡Meta "${data.goalName}" completada!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .trophy { font-size: 80px; margin: 20px 0; }
          .goal-name { font-size: 28px; font-weight: bold; color: #1f2937; margin: 10px 0; }
          .amount { background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 24px; color: #92400e; }
          .btn { display: inline-block; background: #F59E0B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 ¡Meta Completada!</h1>
          </div>
          <div class="content">
            <div class="trophy">🏆</div>
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>¡Felicitaciones! Has alcanzado tu meta financiera:</p>
            <div class="goal-name">${data.goalName}</div>
            <div class="amount">$${(data.targetAmount / 100).toFixed(2)}</div>
            <p>Tu disciplina y constancia han dado frutos. ¡Sigue así!</p>
            <p style="margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/dashboard/employee'}" class="btn">Crear Nueva Meta</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  fwi_improved: (data) => ({
    subject: `📈 ¡Tu FWI Score subió a ${data.newScore}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .score-change { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 30px 0; }
          .old-score { font-size: 36px; color: #9ca3af; }
          .arrow { font-size: 36px; color: #10B981; }
          .new-score { font-size: 48px; font-weight: bold; color: #10B981; }
          .improvement { background: #d1fae5; border-radius: 20px; padding: 8px 16px; color: #065f46; font-weight: 600; display: inline-block; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📈 ¡Tu FWI Score Mejoró!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>¡Excelentes noticias! Tu índice de bienestar financiero ha mejorado.</p>
            <div class="score-change">
              <span class="old-score">${data.oldScore}</span>
              <span class="arrow">→</span>
              <span class="new-score">${data.newScore}</span>
            </div>
            <div class="improvement">+${data.newScore - data.oldScore} puntos</div>
            <p style="margin-top: 30px;">Sigue con tus buenos hábitos financieros para seguir mejorando.</p>
            <p style="margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/dashboard/employee'}" class="btn">Ver mi Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  security_alert: (data) => ({
    subject: '⚠️ Alerta de Seguridad - Actividad Detectada',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .alert-box { background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444; }
          .info-row { padding: 8px 0; border-bottom: 1px solid #fee2e2; }
          .btn { display: inline-block; background: #EF4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .btn-secondary { display: inline-block; background: #6b7280; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-left: 10px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Alerta de Seguridad</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Hemos detectado actividad inusual en tu cuenta:</p>
            <div class="alert-box">
              <div class="info-row"><strong>Tipo:</strong> ${data.alertType || 'Actividad sospechosa'}</div>
              <div class="info-row"><strong>Fecha:</strong> ${data.timestamp || new Date().toLocaleString()}</div>
              <div class="info-row"><strong>Ubicación:</strong> ${data.location || 'Desconocida'}</div>
              <div class="info-row"><strong>Dispositivo:</strong> ${data.device || 'Desconocido'}</div>
            </div>
            <p><strong>Si fuiste tú:</strong> Puedes ignorar este mensaje.</p>
            <p><strong>Si no fuiste tú:</strong> Cambia tu contraseña inmediatamente y contacta a soporte.</p>
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/settings/security'}" class="btn">Revisar Seguridad</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
            <p>Este es un mensaje automático de seguridad.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcome: (data) => ({
    subject: '¡Bienvenido a Treevü! 🌳',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .feature { display: flex; align-items: flex-start; gap: 15px; margin: 20px 0; }
          .feature-icon { font-size: 24px; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌳 ¡Bienvenido a Treevü!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>¡Nos alegra tenerte en Treevü! Estás a punto de transformar tu bienestar financiero.</p>
            
            <h3>¿Qué puedes hacer con Treevü?</h3>
            
            <div class="feature">
              <span class="feature-icon">💰</span>
              <div>
                <strong>Adelantos de Salario (EWA)</strong>
                <p style="margin: 5px 0 0; color: #6b7280;">Accede a tu salario ganado cuando lo necesites.</p>
              </div>
            </div>
            
            <div class="feature">
              <span class="feature-icon">📊</span>
              <div>
                <strong>FWI Score</strong>
                <p style="margin: 5px 0 0; color: #6b7280;">Mide y mejora tu bienestar financiero.</p>
              </div>
            </div>
            
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <div>
                <strong>Metas Financieras</strong>
                <p style="margin: 5px 0 0; color: #6b7280;">Establece y alcanza tus objetivos de ahorro.</p>
              </div>
            </div>
            
            <div class="feature">
              <span class="feature-icon">🌳</span>
              <div>
                <strong>TreePoints</strong>
                <p style="margin: 5px 0 0; color: #6b7280;">Gana puntos y canjéalos por beneficios.</p>
              </div>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/app'}" class="btn">Comenzar Ahora</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  weekly_summary: (data) => ({
    subject: `📊 Tu resumen semanal de Treevü`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-box { background: #f3f4f6; border-radius: 8px; padding: 15px; text-align: center; }
          .stat-value { font-size: 28px; font-weight: bold; color: #1f2937; }
          .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          .btn { display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Tu Resumen Semanal</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Aquí está tu resumen de la semana:</p>
            
            <div class="stat-grid">
              <div class="stat-box">
                <div class="stat-value">${data.fwiScore || 0}</div>
                <div class="stat-label">FWI Score</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${data.treePoints || 0}</div>
                <div class="stat-label">TreePoints</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${data.streakDays || 0}</div>
                <div class="stat-label">Días de Racha</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${data.goalsCompleted || 0}</div>
                <div class="stat-label">Metas Completadas</div>
              </div>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/dashboard/employee'}" class="btn">Ver Dashboard Completo</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  ewa_disbursed: (data) => ({
    subject: `💸 Tu adelanto de $${(data.amount / 100).toFixed(2)} ha sido transferido`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .amount { font-size: 48px; font-weight: bold; color: #10B981; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💸 ¡Dinero en Camino!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Tu adelanto ha sido transferido exitosamente.</p>
            <div class="amount">$${((data.amount - data.fee) / 100).toFixed(2)}</div>
            <p>El dinero debería estar disponible en tu cuenta en las próximas horas.</p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  referral_success: (data) => ({
    subject: `🎉 ¡Felicidades! ${data.referredName} se unió a Treevü con tu código`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .points { font-size: 64px; font-weight: bold; color: #10B981; margin: 20px 0; }
          .points-label { font-size: 18px; color: #6b7280; }
          .referred-box { background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .referred-name { font-size: 24px; font-weight: bold; color: #065f46; }
          .stats { display: flex; justify-content: center; gap: 30px; margin: 30px 0; }
          .stat { text-align: center; }
          .stat-value { font-size: 28px; font-weight: bold; color: #1f2937; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Referido Exitoso!</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>¡Excelentes noticias! Alguien se unió a Treevü usando tu código de referido.</p>
            
            <div class="referred-box">
              <p style="margin: 0; color: #6b7280;">Nuevo usuario referido:</p>
              <p class="referred-name">${data.referredName}</p>
            </div>
            
            <p class="points-label">Has ganado</p>
            <div class="points">+${data.pointsEarned}</div>
            <p class="points-label">TreePoints</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${data.totalReferrals}</div>
                <div class="stat-label">Referidos totales</div>
              </div>
              <div class="stat">
                <div class="stat-value">${data.totalPointsEarned}</div>
                <div class="stat-label">Puntos ganados</div>
              </div>
            </div>
            
            <p>Sigue invitando amigos y compañeros para ganar más TreePoints.</p>
            <p style="margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/referrals'}" class="btn">Ver mis Referidos</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  fwi_alert: (data) => ({
    subject: '⚠️ Tu FWI Score necesita atención',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .score { font-size: 64px; font-weight: bold; color: #F59E0B; margin: 20px 0; }
          .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Alerta de FWI Score</h1>
          </div>
          <div class="content">
            <p>Hola ${data.userName || 'Usuario'},</p>
            <p>Tu índice de bienestar financiero ha bajado y necesita atención.</p>
            <div class="score">${data.score}</div>
            <p>Te recomendamos revisar tus gastos y establecer metas de ahorro.</p>
            <p style="margin-top: 30px;">
              <a href="${data.actionUrl || 'https://treevu.app/dashboard/employee'}" class="btn">Mejorar mi FWI</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Bienestar Financiero para tu Equipo</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  lead_confirmation: (data) => ({
    subject: '¡Gracias por tu interés en Treevü!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1C1C1E; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #2C2C2E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px; }
          .content { padding: 30px; color: #E5E5E5; }
          .content p { line-height: 1.6; margin-bottom: 15px; }
          .info-box { background: #3C3C3E; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #10B981; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #4C4C4E; }
          .info-row:last-child { border-bottom: none; }
          .info-label { color: #9CA3AF; }
          .info-value { color: #E5E5E5; font-weight: 600; }
          .next-steps { background: #1C1C1E; border-radius: 12px; padding: 20px; margin: 25px 0; }
          .next-steps h3 { color: #10B981; margin-top: 0; font-size: 18px; }
          .next-steps ul { padding-left: 20px; margin: 0; }
          .next-steps li { color: #E5E5E5; padding: 8px 0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
          .footer { background: #1C1C1E; padding: 25px; text-align: center; color: #6B7280; font-size: 12px; }
          .footer a { color: #10B981; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌳 ¡Bienvenido a Treevü!</h1>
            <p>Hemos recibido tu solicitud</p>
          </div>
          <div class="content">
            <p>Hola <strong>${data.contactName}</strong>,</p>
            <p>Gracias por tu interés en Treevü. Hemos recibido tu solicitud y nuestro equipo la está revisando.</p>
            
            <div class="info-box">
              <h3 style="color: #10B981; margin-top: 0;">📋 Resumen de tu solicitud</h3>
              <div class="info-row">
                <span class="info-label">Empresa:</span>
                <span class="info-value">${data.companyName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contacto:</span>
                <span class="info-value">${data.contactName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.email}</span>
              </div>
              ${data.employeeCount ? `
              <div class="info-row">
                <span class="info-label">Tamaño de nómina:</span>
                <span class="info-value">${data.employeeCount}</span>
              </div>
              ` : ''}
            </div>

            <div class="next-steps">
              <h3>📅 Próximos pasos</h3>
              <ul>
                <li>Nuestro equipo revisará tu perfil en las próximas 24 horas</li>
                <li>Te contactaremos para agendar una demo personalizada</li>
                <li>Prepararemos una propuesta adaptada a las necesidades de ${data.companyName}</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="https://treevu.app" class="btn">Visitar Treevü</a>
            </p>
          </div>
          <div class="footer">
            <p>Treevü - Inteligencia Artificial para el Bienestar Financiero</p>
            <p>¿Tienes preguntas? <a href="mailto:hola@treevu.app">hola@treevu.app</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  weekly_report: (data: any) => ({
    subject: data.subject || '📊 Reporte Semanal Treevü',
    html: data.html || '<p>Reporte semanal</p>'
  }),
};

/**
 * Send email directly using Resend
 */
export async function sendEmail(
  toEmail: string,
  templateType: keyof typeof EMAIL_TEMPLATES,
  templateData: any
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EmailService] RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const template = EMAIL_TEMPLATES[templateType];
  if (!template) {
    return { success: false, error: `Unknown template: ${templateType}` };
  }

  const { subject, html } = template(templateData);

  const client = getResendClient();
  if (!client) {
    console.warn('[EmailService] Resend client not available');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await client.emails.send({
      from: 'Treevü <notifications@treevu.app>',
      to: toEmail,
      subject,
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error('[EmailService] Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Queue email for async sending
 */
export async function queueEmail(
  userId: number,
  toEmail: string,
  templateType: string,
  templateData: any
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const template = EMAIL_TEMPLATES[templateType as keyof typeof EMAIL_TEMPLATES];
  if (!template) return false;

  const { subject } = template(templateData);

  try {
    await db.insert(emailQueue).values({
      userId,
      toEmail,
      subject,
      templateType: templateType as any,
      templateData: JSON.stringify(templateData),
    });
    return true;
  } catch (error) {
    console.error('[EmailService] Error queuing email:', error);
    return false;
  }
}

/**
 * Process email queue (call this from a cron job or background worker)
 */
export async function processEmailQueue(limit: number = 10): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };

  try {
    const pending = await db
      .select()
      .from(emailQueue)
      .where(eq(emailQueue.status, 'pending'))
      .limit(limit);

    let sent = 0;
    let failed = 0;

    for (const item of pending) {
      const templateData = item.templateData ? JSON.parse(item.templateData) : {};
      const result = await sendEmail(item.toEmail, item.templateType as keyof typeof EMAIL_TEMPLATES, templateData);

      if (result.success) {
        await db
          .update(emailQueue)
          .set({ status: 'sent', sentAt: new Date() })
          .where(eq(emailQueue.id, item.id));
        sent++;
      } else {
        const attempts = (item.attempts || 0) + 1;
        await db
          .update(emailQueue)
          .set({
            status: attempts >= 3 ? 'failed' : 'pending',
            attempts,
            lastError: result.error,
          })
          .where(eq(emailQueue.id, item.id));
        failed++;
      }
    }

    return { sent, failed };
  } catch (error) {
    console.error('[EmailService] Error processing queue:', error);
    return { sent: 0, failed: 0 };
  }
}
