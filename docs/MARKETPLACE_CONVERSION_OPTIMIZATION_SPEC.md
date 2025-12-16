# Especificación Técnica: Herramientas de Optimización de Conversión

## 1. ESTRATEGIAS DE CONVERSIÓN POR SEGMENTO

### 1.1 Segmento: VERY READY (Score 81-100)

**Objetivo:** Acelerar cierre en 7-14 días

```typescript
// server/marketplace/conversionStrategies.ts

interface ConversionStrategy {
  segment: 'VERY_READY' | 'READY' | 'POTENTIAL' | 'NOT_READY';
  actions: ConversionAction[];
  expectedClosureRate: number; // %
  expectedTimeToClose: number; // days
}

interface ConversionAction {
  priority: number; // 1-5
  action: string;
  description: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
  timing: string; // "immediately", "after 2 hours", "next day"
  message: string;
  cta: string;
  expectedImpact: number; // %
}

export const VERY_READY_STRATEGY: ConversionStrategy = {
  segment: 'VERY_READY',
  expectedClosureRate: 75,
  expectedTimeToClose: 7,
  actions: [
    {
      priority: 1,
      action: 'IMMEDIATE_CONTACT',
      description: 'Contact buyer immediately via phone or WhatsApp',
      channel: 'whatsapp',
      timing: 'immediately',
      message: `¡Hola! Vi que te interesa nuestro ${productName}. Tengo una opción perfecta para ti. ¿Podemos hablar hoy?`,
      cta: 'Llamar ahora',
      expectedImpact: 40,
    },
    {
      priority: 2,
      action: 'FINANCING_OFFER',
      description: 'Send pre-approved financing options',
      channel: 'email',
      timing: 'immediately',
      message: `Opciones de financiamiento disponibles para ti:
        - Plan 1: S/ ${monthlyPayment1}/mes (12 meses)
        - Plan 2: S/ ${monthlyPayment2}/mes (24 meses)
        - Plan 3: S/ ${monthlyPayment3}/mes (36 meses)`,
      cta: 'Ver opciones',
      expectedImpact: 30,
    },
    {
      priority: 3,
      action: 'URGENCY_CREATION',
      description: 'Create urgency with limited availability',
      channel: 'sms',
      timing: 'after 2 hours',
      message: 'Solo quedan 2 unidades disponibles a este precio. ¿Quieres reservar la tuya?',
      cta: 'Reservar',
      expectedImpact: 20,
    },
    {
      priority: 4,
      action: 'SOCIAL_PROOF',
      description: 'Share testimonials from similar buyers',
      channel: 'in_app',
      timing: 'next day',
      message: 'Otros compradores como tú ya están disfrutando de este producto...',
      cta: 'Ver testimonios',
      expectedImpact: 15,
    },
    {
      priority: 5,
      action: 'FINAL_OFFER',
      description: 'Send final offer with small discount',
      channel: 'email',
      timing: 'after 3 days',
      message: 'Oferta especial solo para ti: S/ ${discountedPrice} (S/ ${savings} de descuento)',
      cta: 'Aceptar oferta',
      expectedImpact: 10,
    },
  ],
};

export const READY_STRATEGY: ConversionStrategy = {
  segment: 'READY',
  expectedClosureRate: 45,
  expectedTimeToClose: 21,
  actions: [
    {
      priority: 1,
      action: 'EDUCATION',
      description: 'Educate about financing options',
      channel: 'email',
      timing: 'immediately',
      message: `¿Sabías que puedes financiar este ${productName}?
        - Sin interés los primeros 3 meses
        - Cuotas ajustadas a tu presupuesto
        - Aprobación en 24 horas`,
      cta: 'Calcular cuota',
      expectedImpact: 25,
    },
    {
      priority: 2,
      action: 'CALCULATOR',
      description: 'Provide interactive payment calculator',
      channel: 'in_app',
      timing: 'immediately',
      message: 'Usa nuestra calculadora para ver cómo cabe en tu presupuesto',
      cta: 'Calcular',
      expectedImpact: 20,
    },
    {
      priority: 3,
      action: 'OBJECTION_HANDLING',
      description: 'Address common objections',
      channel: 'email',
      timing: 'after 3 days',
      message: `Respuestas a tus preguntas:
        - "¿Es confiable?" → Garantía de 2 años
        - "¿Puedo devolverlo?" → Sí, 30 días sin preguntas
        - "¿Hay otros modelos?" → Sí, aquí están las opciones`,
      cta: 'Ver respuestas',
      expectedImpact: 15,
    },
    {
      priority: 4,
      action: 'COMPARISON',
      description: 'Compare with competitors',
      channel: 'in_app',
      timing: 'after 5 days',
      message: 'Compara nuestro producto con otros en el mercado',
      cta: 'Comparar',
      expectedImpact: 12,
    },
    {
      priority: 5,
      action: 'NURTURE',
      description: 'Weekly follow-up with new content',
      channel: 'email',
      timing: 'weekly',
      message: 'Nuevas opciones disponibles que podrían interesarte...',
      cta: 'Ver opciones',
      expectedImpact: 10,
    },
  ],
};

export const POTENTIAL_STRATEGY: ConversionStrategy = {
  segment: 'POTENTIAL',
  expectedClosureRate: 20,
  expectedTimeToClose: 45,
  actions: [
    {
      priority: 1,
      action: 'FINANCING_FOCUS',
      description: 'Emphasize financing options',
      channel: 'email',
      timing: 'immediately',
      message: `No necesitas tener todo el dinero ahora.
        Opciones de financiamiento disponibles:
        - Hasta 60 meses
        - Sin codeudor
        - Aprobación rápida`,
      cta: 'Ver opciones',
      expectedImpact: 30,
    },
    {
      priority: 2,
      action: 'RISK_REDUCTION',
      description: 'Reduce perceived risk',
      channel: 'in_app',
      timing: 'immediately',
      message: `Compra sin riesgo:
        - Garantía extendida disponible
        - Período de prueba de 30 días
        - Devolución sin preguntas`,
      cta: 'Aprender más',
      expectedImpact: 20,
    },
    {
      priority: 3,
      action: 'EXTENDED_TERMS',
      description: 'Offer extended payment terms',
      channel: 'email',
      timing: 'after 5 days',
      message: `Opciones de pago extendidas:
        - 48 cuotas de S/ ${extendedPayment}
        - Sin interés adicional
        - Flexible si tu situación cambia`,
      cta: 'Solicitar',
      expectedImpact: 15,
    },
    {
      priority: 4,
      action: 'EDUCATION_CONTENT',
      description: 'Educational content about product',
      channel: 'in_app',
      timing: 'weekly',
      message: 'Videos, guías y testimonios sobre cómo otros compradores como tú...',
      cta: 'Ver contenido',
      expectedImpact: 10,
    },
    {
      priority: 5,
      action: 'RETARGETING',
      description: 'Retarget with ads and offers',
      channel: 'push',
      timing: 'bi-weekly',
      message: 'Aún te interesa? Nuevas opciones disponibles...',
      cta: 'Ver ahora',
      expectedImpact: 8,
    },
  ],
};

export const NOT_READY_STRATEGY: ConversionStrategy = {
  segment: 'NOT_READY',
  expectedClosureRate: 5,
  expectedTimeToClose: 90,
  actions: [
    {
      priority: 1,
      action: 'SAVE_PROFILE',
      description: 'Save profile for future retargeting',
      channel: 'in_app',
      timing: 'immediately',
      message: null,
      cta: null,
      expectedImpact: 0,
    },
    {
      priority: 2,
      action: 'MONITOR_FWI',
      description: 'Monitor FWI improvement',
      channel: null,
      timing: 'monthly',
      message: null,
      cta: null,
      expectedImpact: 0,
    },
    {
      priority: 3,
      action: 'FUTURE_RETARGET',
      description: 'Retarget when FWI improves',
      channel: 'email',
      timing: 'when FWI > 50',
      message: 'Vemos que tu situación ha mejorado. Aquí hay opciones que podrían interesarte...',
      cta: 'Ver opciones',
      expectedImpact: 25,
    },
  ],
};
```

---

## 2. RECOMENDADOR DE PRECIO DINÁMICO

### 2.1 Algoritmo de Optimización de Precio

```typescript
// server/marketplace/priceOptimizer.ts

interface PriceRecommendation {
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  
  reasoning: {
    competitorAvgPrice: number;
    buyerCapacityAvg: number;
    demandLevel: string;
    inventoryLevel: string;
    timeOnMarket: number;
  };
  
  projections: {
    expectedSalesAtCurrentPrice: number;
    expectedSalesAtRecommendedPrice: number;
    expectedRevenueAtCurrentPrice: number;
    expectedRevenueAtRecommendedPrice: number;
    revenueIncrease: number;
    revenueIncreasePercent: number;
  };
  
  confidence: number; // 0-100
}

export async function getPriceRecommendation(
  merchantId: string,
  listingId: string
): Promise<PriceRecommendation> {
  const listing = await db.getListing(listingId);
  const merchant = await db.getMerchant(merchantId);
  
  // 1. Get competitor prices
  const competitorPrices = await getCompetitorPrices(
    listing.category,
    listing.title
  );
  const competitorAvgPrice = average(competitorPrices);
  
  // 2. Get buyer capacity
  const buyers = await db.getBuyersForListing(listingId);
  const buyerCapacities = buyers.map(b => b.availableSavings);
  const buyerCapacityAvg = average(buyerCapacities);
  
  // 3. Analyze demand
  const views = listing.views;
  const contacts = listing.contacts;
  const conversionRate = contacts / views;
  const demandLevel = getDemandLevel(views, conversionRate);
  
  // 4. Check inventory
  const similarListings = await db.getSimilarListings(
    merchantId,
    listing.category
  );
  const inventoryLevel = getInventoryLevel(similarListings.length);
  
  // 5. Time on market
  const timeOnMarket = Math.floor(
    (new Date().getTime() - listing.listedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // 6. Calculate optimal price
  let recommendedPrice = listing.price;
  
  // Factor 1: Competitor pricing
  if (listing.price > competitorAvgPrice * 1.15) {
    // Too expensive, reduce
    recommendedPrice = competitorAvgPrice * 1.05;
  } else if (listing.price < competitorAvgPrice * 0.95) {
    // Too cheap, increase
    recommendedPrice = competitorAvgPrice * 0.98;
  }
  
  // Factor 2: Buyer capacity
  if (listing.price > buyerCapacityAvg * 1.2) {
    // Above buyer capacity, reduce
    recommendedPrice = Math.min(recommendedPrice, buyerCapacityAvg * 1.1);
  }
  
  // Factor 3: Demand level
  if (demandLevel === 'HIGH') {
    // High demand, can increase price
    recommendedPrice = recommendedPrice * 1.05;
  } else if (demandLevel === 'LOW') {
    // Low demand, reduce price
    recommendedPrice = recommendedPrice * 0.95;
  }
  
  // Factor 4: Inventory level
  if (inventoryLevel === 'HIGH') {
    // High inventory, reduce price to move units
    recommendedPrice = recommendedPrice * 0.93;
  }
  
  // Factor 5: Time on market
  if (timeOnMarket > 60) {
    // On market too long, reduce price
    recommendedPrice = recommendedPrice * 0.90;
  }
  
  // Round to nearest 100
  recommendedPrice = Math.round(recommendedPrice / 100) * 100;
  
  // 7. Project outcomes
  const expectedSalesAtCurrentPrice = projectSales(
    listing.price,
    competitorAvgPrice,
    demandLevel,
    views
  );
  const expectedSalesAtRecommendedPrice = projectSales(
    recommendedPrice,
    competitorAvgPrice,
    demandLevel,
    views
  );
  
  const expectedRevenueAtCurrentPrice = listing.price * expectedSalesAtCurrentPrice;
  const expectedRevenueAtRecommendedPrice = recommendedPrice * expectedSalesAtRecommendedPrice;
  
  return {
    currentPrice: listing.price,
    recommendedPrice,
    priceChange: recommendedPrice - listing.price,
    priceChangePercent: ((recommendedPrice - listing.price) / listing.price) * 100,
    
    reasoning: {
      competitorAvgPrice,
      buyerCapacityAvg,
      demandLevel,
      inventoryLevel,
      timeOnMarket,
    },
    
    projections: {
      expectedSalesAtCurrentPrice,
      expectedSalesAtRecommendedPrice,
      expectedRevenueAtCurrentPrice,
      expectedRevenueAtRecommendedPrice,
      revenueIncrease: expectedRevenueAtRecommendedPrice - expectedRevenueAtCurrentPrice,
      revenueIncreasePercent: ((expectedRevenueAtRecommendedPrice - expectedRevenueAtCurrentPrice) / expectedRevenueAtCurrentPrice) * 100,
    },
    
    confidence: calculateConfidence(buyers.length, views, timeOnMarket),
  };
}

function projectSales(
  price: number,
  competitorPrice: number,
  demandLevel: string,
  views: number
): number {
  // Empirical model based on historical data
  let conversionRate = 0.15; // baseline 15%
  
  // Adjust for price difference
  const priceDiff = (price - competitorPrice) / competitorPrice;
  conversionRate *= Math.pow(0.95, priceDiff * 100); // 5% decrease per 1% price increase
  
  // Adjust for demand
  if (demandLevel === 'HIGH') {
    conversionRate *= 1.3;
  } else if (demandLevel === 'LOW') {
    conversionRate *= 0.7;
  }
  
  return Math.round(views * conversionRate);
}

function calculateConfidence(buyerCount: number, views: number, timeOnMarket: number): number {
  let confidence = 50;
  
  // More buyers = more confidence
  confidence += Math.min(25, buyerCount * 2);
  
  // More views = more confidence
  confidence += Math.min(15, (views / 100) * 5);
  
  // More time on market = more confidence
  confidence += Math.min(10, (timeOnMarket / 90) * 10);
  
  return Math.min(100, confidence);
}
```

---

## 3. OPCIONES DE PAGO PERSONALIZADAS

### 3.1 Motor de Generación de Planes de Pago

```typescript
// server/marketplace/paymentPlans.ts

interface PaymentPlan {
  planId: string;
  name: string;
  description: string;
  downPayment: number;
  monthlyPayment: number;
  numberOfMonths: number;
  totalCost: number;
  interestRate: number;
  suitabilityScore: number; // 0-100
}

export async function generatePaymentPlans(
  buyerId: string,
  productPrice: number
): Promise<PaymentPlan[]> {
  const buyer = await db.getBuyerProfile(buyerId);
  
  const plans: PaymentPlan[] = [];
  
  // Plan 1: Aggressive (30% down, 12 months)
  plans.push({
    planId: 'plan_aggressive',
    name: 'Plan Rápido',
    description: '30% inicial + 12 cuotas',
    downPayment: productPrice * 0.30,
    monthlyPayment: (productPrice * 0.70) / 12,
    numberOfMonths: 12,
    totalCost: productPrice,
    interestRate: 0,
    suitabilityScore: calculateSuitability(buyer, productPrice * 0.30, (productPrice * 0.70) / 12),
  });
  
  // Plan 2: Balanced (20% down, 24 months)
  plans.push({
    planId: 'plan_balanced',
    name: 'Plan Estándar',
    description: '20% inicial + 24 cuotas',
    downPayment: productPrice * 0.20,
    monthlyPayment: (productPrice * 0.80) / 24,
    numberOfMonths: 24,
    totalCost: productPrice,
    interestRate: 0,
    suitabilityScore: calculateSuitability(buyer, productPrice * 0.20, (productPrice * 0.80) / 24),
  });
  
  // Plan 3: Extended (10% down, 36 months)
  plans.push({
    planId: 'plan_extended',
    name: 'Plan Flexible',
    description: '10% inicial + 36 cuotas',
    downPayment: productPrice * 0.10,
    monthlyPayment: (productPrice * 0.90) / 36,
    numberOfMonths: 36,
    totalCost: productPrice,
    interestRate: 0,
    suitabilityScore: calculateSuitability(buyer, productPrice * 0.10, (productPrice * 0.90) / 36),
  });
  
  // Plan 4: Maximum Flexibility (0% down, 48 months)
  plans.push({
    planId: 'plan_max_flex',
    name: 'Plan Máximo',
    description: 'Sin inicial + 48 cuotas',
    downPayment: 0,
    monthlyPayment: productPrice / 48,
    numberOfMonths: 48,
    totalCost: productPrice,
    interestRate: 3, // 3% interest
    suitabilityScore: calculateSuitability(buyer, 0, productPrice / 48),
  });
  
  // Sort by suitability score
  return plans.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

function calculateSuitability(
  buyer: BuyerProfile,
  downPayment: number,
  monthlyPayment: number
): number {
  let score = 50;
  
  // Check if down payment is affordable
  if (downPayment <= buyer.availableSavings * 0.5) {
    score += 20;
  } else if (downPayment <= buyer.availableSavings) {
    score += 10;
  } else {
    score -= 20;
  }
  
  // Check if monthly payment fits budget
  const monthlyBudget = buyer.monthlyIncome * 0.30; // 30% of income
  if (monthlyPayment <= monthlyBudget * 0.5) {
    score += 20;
  } else if (monthlyPayment <= monthlyBudget) {
    score += 10;
  } else {
    score -= 20;
  }
  
  // Check FWI score
  if (buyer.fwiScore > 70) {
    score += 10;
  } else if (buyer.fwiScore > 50) {
    score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
}
```

---

## 4. A/B TESTING FRAMEWORK

```typescript
// server/marketplace/abTesting.ts

interface ABTest {
  testId: string;
  name: string;
  description: string;
  
  variantA: {
    name: string;
    message: string;
    cta: string;
  };
  
  variantB: {
    name: string;
    message: string;
    cta: string;
  };
  
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  
  winner: 'A' | 'B' | 'UNDECIDED';
  confidence: number; // 0-100
}

export async function runABTest(
  merchantId: string,
  testConfig: {
    variantA: { message: string; cta: string };
    variantB: { message: string; cta: string };
    sampleSize: number;
  }
): Promise<ABTest> {
  const testId = generateId();
  
  // Randomly assign buyers to variants
  const buyers = await db.getBuyersForMerchant(merchantId);
  const sampleA = buyers.slice(0, Math.floor(buyers.length / 2));
  const sampleB = buyers.slice(Math.floor(buyers.length / 2));
  
  // Track metrics
  const metricsA = await trackVariantMetrics(testId, 'A', sampleA);
  const metricsB = await trackVariantMetrics(testId, 'B', sampleB);
  
  // Determine winner using statistical significance
  const winner = determineWinner(metricsA, metricsB);
  const confidence = calculateConfidence(metricsA, metricsB);
  
  return {
    testId,
    name: 'Conversion Test',
    description: 'Testing message and CTA variations',
    variantA: { name: 'A', ...testConfig.variantA },
    variantB: { name: 'B', ...testConfig.variantB },
    metrics: {
      impressions: sampleA.length + sampleB.length,
      clicks: metricsA.clicks + metricsB.clicks,
      conversions: metricsA.conversions + metricsB.conversions,
      revenue: metricsA.revenue + metricsB.revenue,
    },
    winner,
    confidence,
  };
}
```

---

## 5. TASA DE CONVERSIÓN ESPERADA

```
CON ESTRATEGIAS PERSONALIZADAS:

VERY_READY (Score 81-100):
├─ Sin estrategia: 60%
├─ Con estrategia: 75% (+25%)
└─ Impacto: +15 puntos porcentuales

READY (Score 61-80):
├─ Sin estrategia: 30%
├─ Con estrategia: 45% (+50%)
└─ Impacto: +15 puntos porcentuales

POTENTIAL (Score 31-60):
├─ Sin estrategia: 10%
├─ Con estrategia: 20% (+100%)
└─ Impacto: +10 puntos porcentuales

NOT_READY (Score 0-30):
├─ Sin estrategia: 5%
├─ Con estrategia: 5% (no contactar)
└─ Impacto: +0 (ahorrar tiempo)

TASA DE CONVERSIÓN GLOBAL:
├─ Baseline: 20%
├─ Con estrategias: 35% (+75%)
└─ Impacto: +15 puntos porcentuales
```

---

Este documento proporciona la especificación técnica completa para optimización de conversión.
