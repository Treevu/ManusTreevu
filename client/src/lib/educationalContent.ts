import { 
  TrendingUp, 
  Shield, 
  Wallet, 
  Target, 
  Users, 
  BarChart3, 
  Gift, 
  Sparkles,
  AlertTriangle,
  Building2,
  Store,
  Zap,
  Brain,
  PiggyBank,
  CreditCard,
  LineChart,
  Bell,
  Settings,
  Award,
  Lightbulb
} from 'lucide-react';
import React from 'react';

export type UserRole = 'employee' | 'b2b_admin' | 'merchant' | 'admin';
export type ExperienceLevel = 'new' | 'intermediate' | 'advanced';

export interface TutorialStep {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export interface TutorialContent {
  type: string;
  name: string;
  description: string;
  points: number;
  steps: TutorialStep[];
}

// ============================================
// EMPLOYEE TUTORIALS
// ============================================

const employeeFWIBasic: TutorialContent = {
  type: 'fwi',
  name: 'FWI Score Básico',
  description: 'Aprende qué es tu FWI Score y cómo mejorarlo',
  points: 50,
  steps: [
    {
      title: '¿Qué es el FWI Score?',
      content: 'El FWI (Financial Wellness Index) es un indicador de 0 a 100 que mide tu salud financiera general. Considera tus ingresos, gastos, ahorros y hábitos financieros para darte una visión clara de tu situación.',
    },
    {
      title: 'Los 4 Factores Clave',
      content: 'Tu FWI se calcula con: 1) Ratio de ahorro (cuánto guardas de tu sueldo), 2) Control de gastos (gastos hormiga vs esenciales), 3) Progreso en metas (avance hacia tus objetivos), y 4) Estabilidad (consistencia en tus hábitos).',
    },
    {
      title: 'Rangos del FWI',
      content: '🔴 0-40: Zona de riesgo - Necesitas atención urgente. 🟡 41-60: En desarrollo - Vas por buen camino. 🟢 61-80: Saludable - Excelente gestión. 🌟 81-100: Óptimo - Eres un ejemplo a seguir.',
    },
    {
      title: 'Cómo Mejorar tu FWI',
      content: 'Registra todos tus gastos diariamente, establece metas de ahorro realistas, reduce gastos hormiga (cafés, snacks, suscripciones), y mantén un fondo de emergencia de al menos 3 meses de gastos.',
    },
  ],
};

const employeeFWIAdvanced: TutorialContent = {
  type: 'fwi',
  name: 'FWI Score Avanzado',
  description: 'Estrategias avanzadas para maximizar tu bienestar financiero',
  points: 75,
  steps: [
    {
      title: 'Análisis de Tendencias',
      content: 'Tu FWI no es solo un número estático. Analiza tu historial para identificar patrones: ¿baja a fin de mes? ¿Sube después de quincena? Estos insights te ayudan a planificar mejor.',
    },
    {
      title: 'Optimización del Ratio de Ahorro',
      content: 'La regla 50/30/20 es un buen inicio: 50% necesidades, 30% deseos, 20% ahorro. Pero para un FWI óptimo, intenta llegar a 25-30% de ahorro automatizando transferencias el día de pago.',
    },
    {
      title: 'Gestión de Deudas',
      content: 'Las deudas afectan negativamente tu FWI. Usa el método "bola de nieve" (paga primero las pequeñas) o "avalancha" (primero las de mayor interés). Evita deudas de consumo y prioriza las productivas.',
    },
    {
      title: 'Inversión y Crecimiento',
      content: 'Una vez que tengas tu fondo de emergencia, considera inversiones de bajo riesgo. Los fondos indexados y las AFP voluntarias son buenas opciones para comenzar a hacer crecer tu patrimonio.',
    },
    {
      title: 'Treevü Brain: Tu Aliado',
      content: 'Usa el asistente de IA Treevü Brain para obtener consejos personalizados basados en tu situación específica. Pregúntale sobre estrategias de ahorro, análisis de gastos o planificación financiera.',
    },
  ],
};

const employeeEWABasic: TutorialContent = {
  type: 'ewa',
  name: 'Adelanto de Sueldo',
  description: 'Cómo usar el adelanto de sueldo de forma responsable',
  points: 50,
  steps: [
    {
      title: '¿Qué es el EWA?',
      content: 'EWA (Earned Wage Access) te permite acceder a parte de tu sueldo ya ganado antes del día de pago. Es diferente a un préstamo porque es TU dinero que ya trabajaste.',
    },
    {
      title: 'Cuánto Puedes Solicitar',
      content: 'Puedes solicitar hasta el 50% de tu sueldo ya devengado. El monto disponible se calcula según los días trabajados del mes actual. A mayor FWI Score, mejores condiciones.',
    },
    {
      title: 'Costos Transparentes',
      content: 'Treevü cobra una comisión fija y transparente (sin intereses ocultos). Siempre verás el costo total antes de confirmar. Es significativamente más barato que préstamos informales o tarjetas de crédito.',
    },
  ],
};

const employeeEWAAdvanced: TutorialContent = {
  type: 'ewa',
  name: 'Uso Estratégico del EWA',
  description: 'Maximiza los beneficios y minimiza el impacto en tu FWI',
  points: 75,
  steps: [
    {
      title: 'Cuándo Usar EWA',
      content: 'Usa EWA para emergencias reales (salud, reparaciones urgentes) o para aprovechar oportunidades (descuentos importantes, evitar moras). Evita usarlo para gastos de consumo regular.',
    },
    {
      title: 'Impacto en tu FWI',
      content: 'Cada solicitud de EWA puede afectar temporalmente tu FWI. El uso frecuente indica dependencia del adelanto, lo cual reduce tu score. Úsalo máximo 1-2 veces al mes.',
    },
    {
      title: 'Estrategia de Recuperación',
      content: 'Después de usar EWA, ajusta tu presupuesto del mes siguiente para compensar. Reduce gastos discrecionales y evita solicitar otro adelanto hasta recuperar tu balance normal.',
    },
    {
      title: 'Alternativas al EWA',
      content: 'Antes de solicitar EWA, considera: ¿Puedo usar mi fondo de emergencia? ¿Puedo negociar el pago? ¿Es realmente urgente? Un buen fondo de emergencia reduce la necesidad de adelantos.',
    },
  ],
};

// ============================================
// B2B ADMIN TUTORIALS
// ============================================

const b2bTorreControlBasic: TutorialContent = {
  type: 'b2b',
  name: 'Torre de Control',
  description: 'Monitorea el bienestar financiero de tu equipo',
  points: 100,
  steps: [
    {
      title: 'Vista General del Dashboard',
      content: 'La Torre de Control te muestra el estado de bienestar financiero de toda tu organización en tiempo real. Visualiza métricas agregadas sin comprometer la privacidad individual de los empleados.',
    },
    {
      title: 'FWI Promedio Organizacional',
      content: 'El FWI promedio indica la salud financiera general de tu equipo. Un FWI organizacional bajo (<50) puede indicar estrés financiero generalizado, afectando productividad y retención.',
    },
    {
      title: 'Mapa de Calor por Departamento',
      content: 'Identifica qué departamentos necesitan más apoyo. Los colores van de verde (saludable) a rojo (en riesgo). Esto te ayuda a focalizar intervenciones y recursos.',
    },
    {
      title: 'Métricas de Impacto',
      content: 'Mide el ROI de tu inversión en bienestar: reducción de préstamos informales, menor rotación, aumento de productividad. Estos datos son clave para justificar el programa ante directivos.',
    },
  ],
};

const b2bTorreControlAdvanced: TutorialContent = {
  type: 'b2b',
  name: 'Analytics Avanzado B2B',
  description: 'Análisis profundo y estrategias de intervención',
  points: 150,
  steps: [
    {
      title: 'Análisis de Tendencias',
      content: 'Compara métricas mes a mes para identificar patrones. ¿El FWI baja en diciembre? ¿Aumentan los EWA antes de fiestas? Usa estos insights para planificar intervenciones preventivas.',
    },
    {
      title: 'Segmentación de Riesgo',
      content: 'Clasifica empleados en niveles de riesgo (bajo, medio, alto, crítico) basándote en su FWI y comportamiento. Prioriza recursos para los grupos de mayor riesgo.',
    },
    {
      title: 'Configuración de Alertas',
      content: 'Personaliza umbrales de alerta según tu organización. Define qué nivel de FWI dispara una alerta, cuántos EWA son preocupantes, y quién debe ser notificado.',
    },
    {
      title: 'Reportes Ejecutivos',
      content: 'Genera reportes PDF profesionales para presentar a la dirección. Incluye métricas clave, tendencias, ROI estimado y recomendaciones de acción.',
    },
    {
      title: 'Integración con RRHH',
      content: 'Correlaciona datos de bienestar financiero con métricas de RRHH: ausentismo, rotación, evaluaciones de desempeño. Esto demuestra el impacto tangible del programa.',
    },
  ],
};

const b2bAlertsConfig: TutorialContent = {
  type: 'b2b_alerts',
  name: 'Sistema de Alertas',
  description: 'Configura alertas proactivas para tu organización',
  points: 75,
  steps: [
    {
      title: 'Tipos de Alertas',
      content: 'Treevü ofrece 9 tipos de alertas: FWI bajo (individual/departamento), tendencias negativas, EWA excesivos, porcentaje de riesgo alto, y más. Cada una se puede personalizar.',
    },
    {
      title: 'Umbrales Personalizados',
      content: 'Define los límites que activan cada alerta. Por ejemplo: "Alertar cuando el FWI promedio de un departamento baje de 45" o "Notificar si más del 20% de empleados están en riesgo".',
    },
    {
      title: 'Canales de Notificación',
      content: 'Recibe alertas por email, notificaciones push, o Slack. Configura diferentes canales según la severidad: críticas a Slack inmediato, warnings por email diario.',
    },
    {
      title: 'Gestión de Alertas',
      content: 'Cada alerta puede ser reconocida, investigada y resuelta. Mantén un historial de acciones tomadas para demostrar la proactividad del programa de bienestar.',
    },
  ],
};

// ============================================
// MERCHANT TUTORIALS
// ============================================

const merchantMarketplaceBasic: TutorialContent = {
  type: 'merchant',
  name: 'Marketplace Treevü',
  description: 'Cómo crear ofertas atractivas y llegar a más clientes',
  points: 100,
  steps: [
    {
      title: 'El Ecosistema TreePoints',
      content: 'Los empleados de empresas Treevü ganan TreePoints por buenos hábitos financieros. Estos puntos se canjean en tu comercio, trayéndote clientes con poder adquisitivo comprobado.',
    },
    {
      title: 'Crear Ofertas Efectivas',
      content: 'Las mejores ofertas tienen: 1) Descuento atractivo (15-30%), 2) Título claro y llamativo, 3) Descripción de beneficios, 4) Fecha de vencimiento que genere urgencia.',
    },
    {
      title: 'Costo en TreePoints',
      content: 'Define cuántos TreePoints cuesta tu oferta. Ofertas de 100-500 puntos son accesibles para la mayoría. Ofertas premium (1000+) atraen a usuarios más comprometidos.',
    },
    {
      title: 'Validación de Cupones',
      content: 'Cuando un cliente canjea una oferta, recibe un código QR único. Usa el escáner de Treevü para validarlo al momento del pago. El proceso toma segundos.',
    },
  ],
};

const merchantMarketplaceAdvanced: TutorialContent = {
  type: 'merchant',
  name: 'Estrategias de Conversión',
  description: 'Maximiza el ROI de tus campañas en Treevü',
  points: 150,
  steps: [
    {
      title: 'Análisis de Métricas',
      content: 'Monitorea: impresiones (cuántos ven tu oferta), canjes (cuántos la redimen), conversiones (cuántos la usan). Una tasa de conversión saludable es >60% de los canjes.',
    },
    {
      title: 'Segmentación de Audiencia',
      content: 'Dirige ofertas a segmentos específicos: empleados de ciertas empresas, rangos de FWI, o niveles de TreePoints. Las ofertas segmentadas tienen 2-3x mejor conversión.',
    },
    {
      title: 'Ofertas Inteligentes con IA',
      content: 'Usa el generador de ofertas con IA de Treevü. Analiza tu historial de campañas y sugiere ofertas optimizadas para maximizar conversiones basándose en datos reales.',
    },
    {
      title: 'Calculadora de ROI',
      content: 'Calcula el retorno de tu inversión: (Ingresos por conversiones - Costo del descuento) / Costo del programa. Un ROI positivo indica que el programa está generando valor.',
    },
    {
      title: 'Fidelización',
      content: 'Los clientes de Treevü tienen 40% más probabilidad de volver. Crea ofertas de seguimiento para clientes que ya canjearon, construyendo lealtad a largo plazo.',
    },
  ],
};

const merchantQRValidation: TutorialContent = {
  type: 'merchant_qr',
  name: 'Validación QR',
  description: 'Cómo validar cupones de forma rápida y segura',
  points: 50,
  steps: [
    {
      title: 'Acceso al Escáner',
      content: 'El escáner QR está disponible en tu dashboard de comerciante. También puedes acceder desde la app móvil para mayor comodidad en punto de venta.',
    },
    {
      title: 'Proceso de Validación',
      content: 'Apunta la cámara al código QR del cliente. El sistema verifica automáticamente: autenticidad, vigencia, y que no haya sido usado antes. Todo en menos de 2 segundos.',
    },
    {
      title: 'Código Manual',
      content: 'Si el QR no escanea, el cliente tiene un código alfanumérico (ej: TV-ABC12345). Ingrésalo manualmente en la pestaña "Código Manual" para validar.',
    },
    {
      title: 'Historial de Validaciones',
      content: 'Consulta todas las validaciones realizadas en la pestaña "Historial". Útil para conciliación, reportes y resolver cualquier disputa con clientes.',
    },
  ],
};

// ============================================
// CONTENT SELECTOR
// ============================================

export function getEducationalContent(
  role: UserRole,
  experienceLevel: ExperienceLevel = 'new'
): TutorialContent[] {
  const content: TutorialContent[] = [];

  switch (role) {
    case 'employee':
      if (experienceLevel === 'new') {
        content.push(employeeFWIBasic, employeeEWABasic);
      } else if (experienceLevel === 'intermediate') {
        content.push(employeeFWIBasic, employeeFWIAdvanced, employeeEWABasic);
      } else {
        content.push(employeeFWIAdvanced, employeeEWAAdvanced);
      }
      break;

    case 'b2b_admin':
      if (experienceLevel === 'new') {
        content.push(b2bTorreControlBasic);
      } else if (experienceLevel === 'intermediate') {
        content.push(b2bTorreControlBasic, b2bAlertsConfig);
      } else {
        content.push(b2bTorreControlAdvanced, b2bAlertsConfig);
      }
      break;

    case 'merchant':
      if (experienceLevel === 'new') {
        content.push(merchantMarketplaceBasic, merchantQRValidation);
      } else if (experienceLevel === 'intermediate') {
        content.push(merchantMarketplaceBasic, merchantMarketplaceAdvanced, merchantQRValidation);
      } else {
        content.push(merchantMarketplaceAdvanced, merchantQRValidation);
      }
      break;

    case 'admin':
      // Admins get access to all content
      content.push(
        b2bTorreControlAdvanced,
        b2bAlertsConfig,
        merchantMarketplaceAdvanced
      );
      break;
  }

  return content;
}

export function getTutorialByType(tutorialType: string): TutorialContent | null {
  const allTutorials = [
    employeeFWIBasic,
    employeeFWIAdvanced,
    employeeEWABasic,
    employeeEWAAdvanced,
    b2bTorreControlBasic,
    b2bTorreControlAdvanced,
    b2bAlertsConfig,
    merchantMarketplaceBasic,
    merchantMarketplaceAdvanced,
    merchantQRValidation,
  ];

  return allTutorials.find(t => t.type === tutorialType) || null;
}

export function determineExperienceLevel(
  daysActive: number,
  tutorialsCompleted: number
): ExperienceLevel {
  if (daysActive < 7 && tutorialsCompleted < 2) {
    return 'new';
  } else if (daysActive < 30 || tutorialsCompleted < 4) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

// Export all tutorials for reference
export const allTutorials = {
  employee: {
    fwi: { basic: employeeFWIBasic, advanced: employeeFWIAdvanced },
    ewa: { basic: employeeEWABasic, advanced: employeeEWAAdvanced },
  },
  b2b: {
    torreControl: { basic: b2bTorreControlBasic, advanced: b2bTorreControlAdvanced },
    alerts: b2bAlertsConfig,
  },
  merchant: {
    marketplace: { basic: merchantMarketplaceBasic, advanced: merchantMarketplaceAdvanced },
    qr: merchantQRValidation,
  },
};
