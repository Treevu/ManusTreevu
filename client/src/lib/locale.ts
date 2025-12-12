/**
 * Localización para Perú
 * Moneda: Soles (S/)
 * Locale: es-PE
 */

// Formato de moneda en Soles peruanos
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Formato corto de moneda (sin decimales para montos grandes)
export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `S/ ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `S/ ${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// Formato de fecha completa
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

// Formato de fecha corta
export function formatDateShort(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Formato de fecha y hora
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Formato relativo (hace X tiempo)
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'hace un momento';
  if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  if (diffDays < 7) return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'semana' : 'semanas'}`;
  return formatDateShort(d);
}

// Formato de número con separadores
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-PE').format(num);
}

// Formato de porcentaje
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Nombres de meses en español
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Días de la semana en español
export const DAYS_ES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

// Datos demo para Perú
export const PERU_DEMO_DATA = {
  companies: [
    'Banco de Crédito del Perú',
    'Interbank',
    'BBVA Perú',
    'Scotiabank Perú',
    'Alicorp',
    'Gloria',
    'Backus',
    'Telefónica del Perú',
    'Entel Perú',
    'Claro Perú',
  ],
  cities: [
    'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura',
    'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Pucallpa'
  ],
  departments: [
    'Recursos Humanos', 'Finanzas', 'Operaciones', 'Tecnología',
    'Ventas', 'Marketing', 'Legal', 'Administración'
  ],
  firstNames: [
    'Carlos', 'María', 'José', 'Ana', 'Luis', 'Rosa', 'Juan', 'Carmen',
    'Miguel', 'Patricia', 'Jorge', 'Lucía', 'Fernando', 'Claudia', 'Ricardo'
  ],
  lastNames: [
    'García', 'Rodríguez', 'Martínez', 'López', 'Gonzales', 'Hernández',
    'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Díaz'
  ],
  // Salarios promedio en Soles
  salaryRanges: {
    junior: { min: 1500, max: 3000 },
    mid: { min: 3000, max: 6000 },
    senior: { min: 6000, max: 12000 },
    manager: { min: 10000, max: 20000 },
    director: { min: 18000, max: 35000 },
  },
  // Gastos típicos en Soles
  expenseCategories: {
    alimentación: { icon: '🍽️', avgMonthly: 800 },
    transporte: { icon: '🚗', avgMonthly: 400 },
    servicios: { icon: '💡', avgMonthly: 300 },
    entretenimiento: { icon: '🎬', avgMonthly: 250 },
    salud: { icon: '🏥', avgMonthly: 200 },
    educación: { icon: '📚', avgMonthly: 350 },
    vestimenta: { icon: '👔', avgMonthly: 200 },
    otros: { icon: '📦', avgMonthly: 300 },
  },
};

// Generar nombre peruano aleatorio
export function generatePeruName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = PERU_DEMO_DATA.firstNames[Math.floor(Math.random() * PERU_DEMO_DATA.firstNames.length)];
  const lastName1 = PERU_DEMO_DATA.lastNames[Math.floor(Math.random() * PERU_DEMO_DATA.lastNames.length)];
  const lastName2 = PERU_DEMO_DATA.lastNames[Math.floor(Math.random() * PERU_DEMO_DATA.lastNames.length)];
  return {
    firstName,
    lastName: `${lastName1} ${lastName2}`,
    fullName: `${firstName} ${lastName1} ${lastName2}`,
  };
}

// Generar salario aleatorio según nivel
export function generateSalary(level: keyof typeof PERU_DEMO_DATA.salaryRanges = 'mid'): number {
  const range = PERU_DEMO_DATA.salaryRanges[level];
  return Math.round((Math.random() * (range.max - range.min) + range.min) / 100) * 100;
}
