/**
 * Textos de tooltips para métricas clave en ambos dashboards
 * Explicaciones rápidas de 1-2 líneas para aparecer al pasar el mouse
 */

export const employeeTooltips = {
  fwiScore: "Índice de bienestar financiero de 0-100. Mide tu salud financiera.",
  monthlyExpenses: "Total de gastos registrados en el mes actual.",
  budgetRemaining: "Presupuesto disponible antes de alcanzar tu límite mensual.",
  averageDailySpend: "Promedio de gasto diario del mes.",
  antExpenses: "Pequeños gastos recurrentes que se acumulan (<S/ 100).",
  antExpenseImpact: "Impacto acumulado mensual de gastos hormiga.",
  ewaEligible: "Cumples requisitos para adelanto de sueldo.",
  ewaMaxAmount: "Máximo que puedes adelantar: 50% de tu sueldo.",
  treePoints: "Puntos ganados por acciones financieras positivas.",
  receiptConfidence: "Precisión del OCR al extraer datos del recibo.",
};

export const merchantTooltips = {
  buyerReadinessScore: "Probabilidad de que un comprador complete la compra (0-100).",
  readyBuyers: "Compradores con score 80+. Alta probabilidad de compra.",
  potentialBuyers: "Compradores con score 40-79. Necesitan seguimiento.",
  projectedClosures: "Cierres estimados en los próximos 30 días.",
  recommendedPrice: "Precio óptimo calculado por IA para maximizar ingresos.",
  priceConfidence: "Confianza del modelo en la recomendación (0-100%).",
  revenueImpact: "Cambio estimado en ingresos con el nuevo precio.",
  volumeImpact: "Cambio estimado en volumen de ventas.",
  marginImpact: "Cambio estimado en margen por unidad.",
  competitorPrice: "Precio del competidor en el mercado.",
  competitorRating: "Rating/calificación del competidor.",
  demandForecast: "Predicción de demanda para los próximos 30 días.",
  conversionFunnel: "Etapas del funnel: Vistas → Interesados → Listos → Cerrados.",
  roiProjected: "Retorno de inversión esperado de tus esfuerzos.",
};
