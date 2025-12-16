import { ChartExplanation } from "@/components/ChartExplanationModal";

// ============================================
// EMPLOYEE DASHBOARD EXPLANATIONS
// ============================================

export const employeeDashboardExplanations = {
  fwiScore: {
    title: "Financial Wellness Index (FWI)",
    description: "Tu índice de salud financiera personalizado",
    whatIsIt:
      "El FWI es un score de 0-100 que mide tu bienestar financiero general. Considera tu capacidad de pago, deuda, ahorros, estabilidad laboral y comportamiento de gasto.",
    whyImportant:
      "Tu FWI determina tu elegibilidad para productos financieros como Early Wage Access, préstamos personales y ofertas especiales. Un FWI más alto significa mejor acceso a crédito y mejores términos.",
    howToInterpret:
      "0-20: Crítico (alto riesgo), 21-40: Bajo, 41-60: Medio, 61-80: Alto, 81-100: Excelente. Treevü te ayuda a mejorar tu score con recomendaciones personalizadas.",
    examples: [
      {
        scenario: "FWI Score de 75",
        explanation:
          "Excelente salud financiera. Tienes acceso a productos premium, tasas bajas y límites de crédito altos.",
      },
      {
        scenario: "FWI Score de 45",
        explanation:
          "Salud financiera media. Puedes acceder a productos básicos. Enfócate en reducir deuda y aumentar ahorros.",
      },
      {
        scenario: "FWI Score de 15",
        explanation:
          "Situación crítica. Prioriza pagar deudas y crear un fondo de emergencia. Treevü te guiará paso a paso.",
      },
    ],
    actionItems: [
      {
        action: "Reducir gastos hormiga",
        benefit:
          "Identificados automáticamente. Ahorrar S/ 300-500/mes mejora tu FWI en 5-10 puntos.",
      },
      {
        action: "Crear fondo de emergencia",
        benefit:
          "Tener 1-3 meses de gastos ahorrados mejora tu FWI en 15-20 puntos.",
      },
      {
        action: "Pagar deudas de alto interés",
        benefit:
          "Cada deuda pagada mejora tu FWI en 3-5 puntos y reduce estrés financiero.",
      },
    ],
    relatedMetrics: [
      "Deuda Total",
      "Ahorros",
      "Ingresos",
      "Historial de Pagos",
    ],
  } as ChartExplanation,

  expensePatternAnalysis: {
    title: "Análisis de Patrones de Gasto",
    description: "Cómo gastan tu dinero este mes vs el promedio",
    whatIsIt:
      "Compara tus gastos del mes actual con tu promedio histórico. Te muestra si estás gastando más o menos de lo normal.",
    whyImportant:
      "Identificar cambios en patrones de gasto te ayuda a detectar problemas temprano. Si gastas 30% más que lo normal, algo está pasando.",
    howToInterpret:
      "Verde: Dentro del presupuesto. Amarillo: Cerca del límite. Rojo: Excedido. La línea azul muestra tu promedio histórico.",
    examples: [
      {
        scenario: "Gasto actual S/ 3,200 vs Promedio S/ 2,500",
        explanation:
          "Estás gastando 28% más que lo normal. Revisa qué categorías aumentaron y ajusta tu presupuesto.",
      },
      {
        scenario: "Gasto actual S/ 2,100 vs Promedio S/ 2,500",
        explanation:
          "Excelente control. Estás 16% por debajo del promedio. Mantén estos hábitos.",
      },
    ],
    actionItems: [
      {
        action: "Revisar categorías de alto gasto",
        benefit:
          "Identifica dónde se va tu dinero. Busca oportunidades de ahorro.",
      },
      {
        action: "Establecer presupuesto mensual",
        benefit:
          "Tener un presupuesto claro reduce gastos impulsivos en 15-25%.",
      },
    ],
    relatedMetrics: ["Gastos por Categoría", "Presupuesto", "Ahorros"],
  } as ChartExplanation,

  antExpenseDetector: {
    title: "Detección de Gastos Hormiga",
    description: "Pequeños gastos que se acumulan rápidamente",
    whatIsIt:
      "Los gastos hormiga son pequeñas compras (< S/ 100) que se repiten frecuentemente. Café diario, delivery, suscripciones. Se acumulan a S/ 300-500/mes.",
    whyImportant:
      "Estos gastos pasan desapercibidos pero representan 15-25% del presupuesto total. Reducirlos es la forma más rápida de mejorar tu FWI.",
    howToInterpret:
      "Cada hormiga muestra el costo diario y el impacto mensual. Rojo = alto impacto. Naranja = medio. Azul = bajo.",
    examples: [
      {
        scenario: "Café diario S/ 8 = S/ 240/mes",
        explanation:
          "Parece poco, pero son S/ 240 al mes. Hacer café en casa cuesta S/ 1. Ahorras S/ 210/mes.",
      },
      {
        scenario: "Delivery 3x/semana S/ 25 = S/ 300/mes",
        explanation:
          "Cocinar en casa cuesta S/ 10. Ahorras S/ 45/semana o S/ 180/mes.",
      },
    ],
    actionItems: [
      {
        action: "Reducir café a 2x/semana",
        benefit: "Ahorras S/ 96/mes. Pequeño cambio, gran impacto.",
      },
      {
        action: "Cocinar 1 día más a la semana",
        benefit: "Ahorras S/ 100/mes. Mejora salud y FWI.",
      },
      {
        action: "Cancelar suscripciones no usadas",
        benefit:
          "Ahorras S/ 50-100/mes. Revisa qué realmente usas cada mes.",
      },
    ],
    relatedMetrics: ["Gastos Mensuales", "Categorías de Gasto", "Ahorros"],
  } as ChartExplanation,

  treePointsLeaderboard: {
    title: "TreePoints Leaderboard",
    description: "Comparte tu progreso con otros colaboradores",
    whatIsIt:
      "TreePoints son puntos que ganas por buenas decisiones financieras: reducir deuda, aumentar ahorros, mejorar FWI. Puedes canjearlos por beneficios.",
    whyImportant:
      "La gamificación hace que mejorar finanzas sea divertido. Competir amistosamente con colegas aumenta motivación.",
    howToInterpret:
      "Más puntos = mejor desempeño financiero. Ganas puntos por: pagar deudas, crear ahorros, reducir gastos hormiga, mejorar FWI.",
    examples: [
      {
        scenario: "Ganas 50 pts por reducir gastos 10%",
        explanation:
          "Pequeña acción, recompensa inmediata. Motiva a seguir mejorando.",
      },
      {
        scenario: "Ganas 200 pts por crear fondo de emergencia",
        explanation:
          "Acción importante, recompensa grande. Reconoce logros significativos.",
      },
    ],
    actionItems: [
      {
        action: "Completar desafíos semanales",
        benefit: "Gana 100-500 pts por semana. Acumula rápido.",
      },
      {
        action: "Canjear puntos por beneficios",
        benefit:
          "Descuentos en cursos, acceso premium, donaciones a caridad.",
      },
    ],
    relatedMetrics: ["Badges", "Logros", "FWI Score"],
  } as ChartExplanation,

  transactionHistory: {
    title: "Historial de Transacciones",
    description: "Todas tus transacciones registradas",
    whatIsIt:
      "Registro completo de todos tus gastos categorizados. Puedes filtrar por fecha, categoría o monto.",
    whyImportant:
      "Tener un historial claro te permite entender tus hábitos de gasto y detectar gastos no autorizados.",
    howToInterpret:
      "Cada fila es una transacción. El color indica la categoría. Puedes hacer clic para ver detalles o editar.",
    examples: [
      {
        scenario: "Ves gasto de S/ 500 que no recuerdas",
        explanation:
          "Haz clic para ver detalles. Si no es tuyo, reporta como fraude.",
      },
      {
        scenario: "Filtras por 'Comida' y ves S/ 1,200/mes",
        explanation:
          "Oportunidad de ahorro. Considera cocinar más en casa.",
      },
    ],
    actionItems: [
      {
        action: "Revisar historial mensualmente",
        benefit:
          "Detecta patrones y oportunidades de ahorro. Toma 10 minutos.",
      },
      {
        action: "Categorizar correctamente",
        benefit:
          "Datos precisos = recomendaciones mejores. Ayuda a Treevü a entenderte.",
      },
    ],
    relatedMetrics: ["Gastos por Categoría", "Presupuesto", "Patrones"],
  } as ChartExplanation,

  debtAnalysis: {
    title: "Análisis de Deuda",
    description: "Tu deuda total y plan de pago",
    whatIsIt:
      "Muestra toda tu deuda: tarjetas de crédito, préstamos, EWA. Incluye tasas de interés y plan de pago recomendado.",
    whyImportant:
      "La deuda es el mayor enemigo de tu FWI. Entender tu deuda es el primer paso para eliminarla.",
    howToInterpret:
      "Rojo = deuda de alto interés (urgente). Naranja = medio. Verde = bajo. El gráfico muestra progreso de pago.",
    examples: [
      {
        scenario: "Deuda de tarjeta S/ 5,000 a 48% anual",
        explanation:
          "Pagas S/ 200/mes en interés. Prioriza pagar esto primero. Treevü te sugiere cómo.",
      },
      {
        scenario: "Préstamo personal S/ 10,000 a 12% anual",
        explanation:
          "Mejor tasa. Pero aún caro. Paga extra cuando puedas para ahorrar interés.",
      },
    ],
    actionItems: [
      {
        action: "Pagar deuda de alto interés primero",
        benefit: "Ahorras miles en interés. Mejora FWI rápidamente.",
      },
      {
        action: "Consolidar deudas",
        benefit:
          "Tasa más baja = menos interés. Treevü te ayuda a encontrar opciones.",
      },
      {
        action: "Crear plan de pago agresivo",
        benefit:
          "Cada S/ 100 extra pagado = S/ 20-30 de interés ahorrado.",
      },
    ],
    relatedMetrics: ["FWI Score", "Ingresos", "Gastos", "Ahorros"],
  } as ChartExplanation,

  savingsGoals: {
    title: "Metas de Ahorro",
    description: "Tus objetivos financieros a corto y largo plazo",
    whatIsIt:
      "Define metas (casa, carro, vacaciones) y Treevü te ayuda a ahorrar para ellas. Muestra progreso y tiempo estimado.",
    whyImportant:
      "Tener metas claras aumenta motivación. Ver progreso visual mantiene el enfoque.",
    howToInterpret:
      "Cada barra muestra % completado. Verde = en camino. Amarillo = atrasado. Rojo = muy atrasado.",
    examples: [
      {
        scenario: "Meta: S/ 20,000 para carro en 24 meses",
        explanation:
          "Necesitas ahorrar S/ 833/mes. Treevü te sugiere cómo ajustar gastos.",
      },
      {
        scenario: "Meta: S/ 5,000 para vacaciones en 6 meses",
        explanation:
          "Necesitas S/ 833/mes. Reducir gastos hormiga es suficiente.",
      },
    ],
    actionItems: [
      {
        action: "Crear meta realista",
        benefit:
          "Metas alcanzables mantienen motivación. Empieza pequeño.",
      },
      {
        action: "Automatizar ahorros",
        benefit:
          "Transferencia automática cada quincena = menos tentación de gastar.",
      },
      {
        action: "Revisar progreso mensualmente",
        benefit:
          "Celebra pequeños logros. Ajusta si es necesario. Mantén enfoque.",
      },
    ],
    relatedMetrics: ["Ahorros", "Ingresos", "Gastos", "FWI Score"],
  } as ChartExplanation,

  marketOffers: {
    title: "Ofertas Personalizadas",
    description: "Productos financieros adaptados a tu perfil",
    whatIsIt:
      "Basado en tu FWI y comportamiento, Treevü te muestra productos que realmente necesitas: préstamos, tarjetas, seguros.",
    whyImportant:
      "Acceso a productos con tasas bajas. No todas las ofertas son iguales. Treevü filtra las mejores para ti.",
    howToInterpret:
      "Cada oferta muestra tasa, límite y beneficios. Verde = buena opción. Rojo = evitar. Amarillo = comparar.",
    examples: [
      {
        scenario: "Oferta de tarjeta a 18% vs 48%",
        explanation:
          "Diferencia de S/ 300/año en interés. Treevü te muestra la mejor opción.",
      },
      {
        scenario: "Préstamo personal a 12% con 24 meses",
        explanation:
          "Tasa competitiva. Treevü verifica si es mejor que consolidar deuda.",
      },
    ],
    actionItems: [
      {
        action: "Comparar ofertas antes de aceptar",
        benefit:
          "Ahorras dinero. Treevü hace la comparación automáticamente.",
      },
      {
        action: "Mejorar FWI para mejores ofertas",
        benefit:
          "FWI 80+ = tasas 10-20% más bajas. Vale la pena mejorar.",
      },
    ],
    relatedMetrics: ["FWI Score", "Deuda", "Historial de Crédito"],
  } as ChartExplanation,

  receiptOCR: {
    title: "Escaneo de Recibos con OCR",
    description: "Captura automática de gastos desde fotos",
    whatIsIt:
      "Toma una foto de un recibo y la IA extrae automáticamente: comercio, monto, categoría, artículos. Sin escribir manualmente.",
    whyImportant:
      "Captura rápida = más gastos registrados = datos más precisos = recomendaciones mejores. Ahorra 5 minutos/día.",
    howToInterpret:
      "La IA muestra confianza (%). Si es < 70%, revisa manualmente. Puedes editar cualquier dato.",
    examples: [
      {
        scenario: "Foto de recibo de Wong",
        explanation:
          "IA extrae: Wong, S/ 245.50, Groceries, 6 artículos. 94% confianza. Listo para guardar.",
      },
      {
        scenario: "Foto borrosa de Starbucks",
        explanation:
          "IA extrae: Starbucks, S/ 52, Food & Beverage. 68% confianza. Revisa manualmente.",
      },
    ],
    actionItems: [
      {
        action: "Usar OCR para gastos frecuentes",
        benefit:
          "Ahorra tiempo. Más datos precisos. Mejor análisis de patrones.",
      },
      {
        action: "Revisar datos extraídos",
        benefit:
          "Corrige errores. Ayuda a la IA a mejorar. Datos más precisos.",
      },
    ],
    relatedMetrics: ["Gastos", "Categorías", "Patrones"],
  } as ChartExplanation,
};

// ============================================
// MERCHANT DASHBOARD EXPLANATIONS
// ============================================

export const merchantDashboardExplanations = {
  buyerReadinessScore: {
    title: "Buyer Readiness Score",
    description: "Identifica compradores listos para comprar",
    whatIsIt:
      "Score de 0-100 que predice quién está listo para comprar. Basado en salud financiera, intención, urgencia y compatibilidad con tu producto.",
    whyImportant:
      "Enfocarse en compradores listos aumenta conversión 40-50%. Ahorras tiempo contactando gente que no puede comprar.",
    howToInterpret:
      "81-100: Muy listo (compra probable). 61-80: Listo (buena oportunidad). 31-60: Potencial (necesita nurturing). 0-30: No listo (no contactar).",
    examples: [
      {
        scenario: "Comprador con score 92",
        explanation:
          "Excelente salud financiera, buscando activamente, urgencia alta. Contacta hoy. Probabilidad de cierre: 70%.",
      },
      {
        scenario: "Comprador con score 45",
        explanation:
          "Interesado pero sin urgencia. Envía contenido educativo. Contacta en 2 semanas. Probabilidad de cierre: 20%.",
      },
      {
        scenario: "Comprador con score 15",
        explanation:
          "No está listo. Problemas financieros. No contactar ahora. Revisar en 3 meses.",
      },
    ],
    actionItems: [
      {
        action: "Priorizar contactos score 80+",
        benefit:
          "Cierre 3-5x más rápido. Mejor ROI en tiempo de ventas.",
      },
      {
        action: "Crear estrategia para score 40-60",
        benefit:
          "Email nurturing, contenido educativo. Convierte 10-15% a listos.",
      },
      {
        action: "Ignorar score < 30",
        benefit:
          "Ahorra tiempo. Enfócate en oportunidades reales. Mejor eficiencia.",
      },
    ],
    relatedMetrics: [
      "Conversión",
      "Tiempo de Cierre",
      "Valor Promedio",
      "Demanda",
    ],
  } as ChartExplanation,

  priceRecommendationEngine: {
    title: "Price Recommendation Engine",
    description: "Precio óptimo basado en mercado y demanda",
    whatIsIt:
      "IA analiza competencia, demanda, elasticidad de precio y tu costo. Recomienda precio que maximiza ingresos.",
    whyImportant:
      "Precio incorrecto cuesta dinero. Muy alto = menos ventas. Muy bajo = menos margen. Precio óptimo = máximo ingreso.",
    howToInterpret:
      "Línea azul = precio actual. Línea verde = recomendado. Gráfico muestra impacto en ingresos. Rojo = precio muy alto.",
    examples: [
      {
        scenario: "Precio actual S/ 48,000, recomendado S/ 44,500",
        explanation:
          "Bajar 7% aumenta volumen 35%. Ingresos suben 25%. Prueba 2 semanas.",
      },
      {
        scenario: "Precio actual S/ 15,000, recomendado S/ 16,500",
        explanation:
          "Subir 10% reduce volumen 5%. Ingresos suben 4%. Margen mejora más.",
      },
    ],
    actionItems: [
      {
        action: "Implementar precio recomendado",
        benefit:
          "Aumenta ingresos 15-30%. Prueba 2-4 semanas antes de decidir.",
      },
      {
        action: "Monitorear impacto en ventas",
        benefit:
          "Si volumen cae > 20%, revierte. Si sube, mantén. Ajusta según datos.",
      },
      {
        action: "Usar precios dinámicos",
        benefit:
          "Ajusta precio según demanda. Temporada alta = precio alto. Baja = descuento.",
      },
    ],
    relatedMetrics: [
      "Conversión",
      "Volumen",
      "Margen",
      "Competencia",
      "Demanda",
    ],
  } as ChartExplanation,

  competitiveAnalysis: {
    title: "Análisis Competitivo",
    description: "Cómo te compares con competencia",
    whatIsIt:
      "Compara tu precio, rating, features con competencia directa. Muestra dónde tienes ventaja y dónde estás atrás.",
    whyImportant:
      "Conocer competencia es clave. Si estás 20% más caro pero con rating 4.2 vs 3.8, tienes valor. Si estás caro y rating bajo, problema.",
    howToInterpret:
      "Cada punto es un competidor. Arriba-derecha = mejor (alto rating, bajo precio). Abajo-izquierda = peor.",
    examples: [
      {
        scenario: "Tú: S/ 44,500, rating 4.7 vs Competidor: S/ 48,000, rating 3.9",
        explanation:
          "Ventaja clara. Mejor precio y rating. Destaca esto en marketing.",
      },
      {
        scenario: "Tú: S/ 50,000, rating 3.5 vs Competidor: S/ 45,000, rating 4.5",
        explanation:
          "Desventaja. Más caro y peor rating. Mejora servicio o baja precio.",
      },
    ],
    actionItems: [
      {
        action: "Destacar ventajas competitivas",
        benefit:
          "Si tienes mejor rating, úsalo en marketing. Justifica precio.",
      },
      {
        action: "Mejorar áreas débiles",
        benefit:
          "Si rating bajo, mejora servicio. Si precio alto, justifica con features.",
      },
      {
        action: "Monitorear cambios competitivos",
        benefit:
          "Revisa mensualmente. Si competidor baja precio 10%, reacciona rápido.",
      },
    ],
    relatedMetrics: [
      "Precio",
      "Rating",
      "Features",
      "Conversión",
      "Volumen",
    ],
  } as ChartExplanation,

  demandForecast: {
    title: "Demand Forecast",
    description: "Predicción de demanda futura",
    whatIsIt:
      "IA predice demanda en próximos 30-90 días basada en tendencias históricas, estacionalidad y eventos.",
    whyImportant:
      "Saber demanda futura permite prepararse: stock, marketing, pricing. Evita sorpresas.",
    howToInterpret:
      "Línea azul = demanda histórica. Línea punteada = predicción. Área gris = rango de incertidumbre.",
    examples: [
      {
        scenario: "Predicción: demanda sube 40% en diciembre",
        explanation:
          "Prepara stock, aumenta marketing, sube precio. Máximiza ingresos.",
      },
      {
        scenario: "Predicción: demanda baja 20% en febrero",
        explanation:
          "Reduce marketing, ofrece descuentos, prepara promociones.",
      },
    ],
    actionItems: [
      {
        action: "Preparar stock según predicción",
        benefit:
          "Evita stockout (pierde ventas) o overstock (pierde dinero).",
      },
      {
        action: "Ajustar marketing según demanda",
        benefit:
          "Alta demanda = marketing agresivo. Baja = marketing selectivo.",
      },
      {
        action: "Usar pricing dinámico",
        benefit:
          "Alta demanda = precio alto. Baja = descuentos. Maximiza ingresos.",
      },
    ],
    relatedMetrics: [
      "Volumen",
      "Estacionalidad",
      "Tendencias",
      "Conversión",
    ],
  } as ChartExplanation,

  conversionFunnel: {
    title: "Conversion Funnel",
    description: "Dónde pierdes compradores en el proceso",
    whatIsIt:
      "Muestra cuántos compradores en cada etapa: vieron anuncio, visitaron página, contactaron, compraron. Identifica dónde se caen.",
    whyImportant:
      "Si 1000 ven pero 10 compran (1% conversión), problema es visible. Mejora conversión 1% = +10 ventas.",
    howToInterpret:
      "Cada nivel es más pequeño. Caída > 50% entre niveles = problema. Investiga por qué.",
    examples: [
      {
        scenario: "1000 vistas → 500 visitas → 100 contactos → 10 compras",
        explanation:
          "Conversión 1%. Problema: página no convence (50% caída). Mejora descripción/fotos.",
      },
      {
        scenario: "1000 vistas → 800 visitas → 200 contactos → 50 compras",
        explanation:
          "Conversión 5%. Excelente. Mantén estrategia. Escala marketing.",
      },
    ],
    actionItems: [
      {
        action: "Mejorar descripción del producto",
        benefit:
          "Aumenta conversión vista → contacto en 20-30%. Cuesta poco.",
      },
      {
        action: "Agregar fotos de mejor calidad",
        benefit:
          "Aumenta conversión contacto → compra en 15-25%. Crítico.",
      },
      {
        action: "Responder contactos rápido",
        benefit:
          "Respuesta en < 1 hora = 2x más conversión. Respuesta en > 24h = 50% menos.",
      },
    ],
    relatedMetrics: ["Vistas", "Contactos", "Ventas", "Rating"],
  } as ChartExplanation,

  roiCalculator: {
    title: "ROI Calculator",
    description: "Retorno de inversión en marketing",
    whatIsIt:
      "Calcula ROI de cada canal de marketing: cuánto gastas vs cuánto ganas. Identifica canales rentables.",
    whyImportant:
      "No todo marketing es igual. Algunos canales ganan S/ 5 por cada S/ 1 gastado. Otros pierden dinero.",
    howToInterpret:
      "Verde = rentable (ROI > 200%). Amarillo = marginal (100-200%). Rojo = pérdida (< 100%).",
    examples: [
      {
        scenario: "OLX: Gastas S/ 500/mes, ganas S/ 2,500 = ROI 400%",
        explanation:
          "Excelente. Aumenta inversión aquí. Cada S/ 1 gana S/ 5.",
      },
      {
        scenario: "Facebook: Gastas S/ 500/mes, ganas S/ 600 = ROI 20%",
        explanation:
          "Marginal. Mejora targeting o pausa. No es eficiente.",
      },
    ],
    actionItems: [
      {
        action: "Aumentar inversión en canales ROI > 300%",
        benefit:
          "Dinero seguro. Cada S/ 1 gana S/ 3+. Escala agresivamente.",
      },
      {
        action: "Pausar canales ROI < 100%",
        benefit:
          "Ahorra dinero. Redirecciona a canales rentables. Mejora eficiencia.",
      },
      {
        action: "Optimizar canales 100-200% ROI",
        benefit:
          "Pequeñas mejoras = gran impacto. Mejora targeting, creatividad, timing.",
      },
    ],
    relatedMetrics: ["Gastos", "Ingresos", "Conversión", "Canales"],
  } as ChartExplanation,

  customerSegmentation: {
    title: "Customer Segmentation",
    description: "Agrupa compradores por características",
    whatIsIt:
      "Divide compradores en grupos: por edad, ingresos, ubicación, comportamiento. Cada grupo tiene estrategia diferente.",
    whyImportant:
      "No todos los compradores son iguales. Jóvenes vs adultos, ricos vs pobres, ciudad vs provincia. Mensajes diferentes.",
    howToInterpret:
      "Cada barra es un segmento. Tamaño = cantidad de compradores. Color = potencial de compra.",
    examples: [
      {
        scenario: "Segmento: Profesionales 25-35, ingresos S/ 5K+",
        explanation:
          "Mejor FWI, mayor poder de compra. Ofrece premium, servicio VIP.",
      },
      {
        scenario: "Segmento: Jóvenes 18-25, ingresos S/ 2K-3K",
        explanation:
          "Bajo poder de compra. Ofrece planes de pago, descuentos, opciones baratas.",
      },
    ],
    actionItems: [
      {
        action: "Crear mensajes específicos por segmento",
        benefit:
          "Mensaje personalizado = 2-3x más conversión. Cuesta poco hacer.",
      },
      {
        action: "Ofrecer opciones de pago por segmento",
        benefit:
          "Segmento rico: pago completo. Segmento pobre: cuotas. Aumenta acceso.",
      },
      {
        action: "Ajustar precio por segmento",
        benefit:
          "Segmento rico paga más. Segmento pobre paga menos. Maximiza ingresos.",
      },
    ],
    relatedMetrics: ["FWI", "Ingresos", "Conversión", "Demanda"],
  } as ChartExplanation,
};
