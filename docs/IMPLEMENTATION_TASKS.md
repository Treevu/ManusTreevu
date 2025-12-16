# Tareas de Implementación Detalladas

## FASE 1: FUNDAMENTOS (Semanas 1-4)

### Sprint 1.1: Base de Datos y Modelos (Semana 1)

#### Tarea 1.1.1: Crear Tabla user_insights
```sql
-- Archivo: drizzle/schema.ts

export const userInsights = sqliteTable('user_insights', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull().unique(),
  
  // Predicciones
  predictedWeeklyExpense: decimal('predicted_weekly_expense', { precision: 10, scale: 2 }),
  predictedWeeklyExpenseConfidence: real('predicted_weekly_expense_confidence'),
  budgetExceedanceRisk: integer('budget_exceedance_risk'),
  ewaUsageProbability: integer('ewa_usage_probability'),
  fwiScoreTrend: text('fwi_score_trend'),
  financialRiskScore: integer('financial_risk_score'),
  
  // Patrones
  detectedPatterns: text('detected_patterns'), // JSON
  activeAlerts: integer('active_alerts'),
  lastAlertAt: datetime('last_alert_at'),
  
  // Métricas
  engagementScore: real('engagement_score'),
  improvementRate: real('improvement_rate'),
  
  // Auditoría
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
  lastCalculatedAt: datetime('last_calculated_at'),
});
```

**Responsable:** Backend Engineer
**Estimación:** 2 horas
**Checklist:**
- [ ] Tabla creada en schema
- [ ] Migración generada
- [ ] Índices creados
- [ ] Tipos TypeScript generados

---

#### Tarea 1.1.2: Crear Tabla user_patterns
```sql
-- Archivo: drizzle/schema.ts

export const userPatterns = sqliteTable('user_patterns', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  
  // Identificación
  patternType: text('pattern_type').notNull(), // 'debt_spiral', 'ewa_dependency', etc.
  patternName: text('pattern_name').notNull(),
  description: text('description'),
  
  // Indicadores
  indicators: text('indicators'), // JSON
  severity: text('severity'), // CRITICAL, HIGH, MEDIUM, LOW
  riskScore: integer('risk_score'),
  
  // Contexto
  detectedAt: datetime('detected_at').default(sql`CURRENT_TIMESTAMP`),
  startDate: datetime('start_date'),
  endDate: datetime('end_date'),
  
  // Acciones
  suggestedActions: text('suggested_actions'), // JSON
  actionsTaken: text('actions_taken'), // JSON
  
  // Seguimiento
  isResolved: integer('is_resolved').default(0),
  resolvedAt: datetime('resolved_at'),
  resolutionNotes: text('resolution_notes'),
  
  // Auditoría
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
```

**Responsable:** Backend Engineer
**Estimación:** 2 horas
**Checklist:**
- [ ] Tabla creada
- [ ] Índices en userId, patternType, severity
- [ ] Tipos TypeScript generados

---

#### Tarea 1.1.3: Crear Tabla user_alerts
```sql
-- Archivo: drizzle/schema.ts

export const userAlerts = sqliteTable('user_alerts', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  
  // Identificación
  alertType: text('alert_type'), // 'critical', 'high', 'medium', 'low'
  alertCode: text('alert_code').notNull(), // 'DEBT_SPIRAL', 'EWA_OVERUSE', etc.
  title: text('title').notNull(),
  message: text('message'),
  
  // Contexto
  context: text('context'), // JSON
  metrics: text('metrics'), // JSON
  
  // Priorización
  severity: integer('severity'), // 1-5
  isActive: integer('is_active').default(1),
  
  // Notificación
  notificationChannels: text('notification_channels'), // JSON
  notificationSentAt: datetime('notification_sent_at'),
  
  // Seguimiento
  isAcknowledged: integer('is_acknowledged').default(0),
  acknowledgedAt: datetime('acknowledged_at'),
  userAction: text('user_action'),
  
  // Auditoría
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
  resolvedAt: datetime('resolved_at'),
});
```

**Responsable:** Backend Engineer
**Estimación:** 2 horas

---

### Sprint 1.2: Detección de Patrones Críticos (Semana 2)

#### Tarea 1.2.1: Implementar detectDebtSpiral()
```typescript
// Archivo: server/services/patternDetection.ts

export async function detectDebtSpiral(userId: number): Promise<Pattern | null> {
  const transactions = await db.getTransactions(userId, { days: 90 });
  const income = await db.getMonthlyIncome(userId);
  const debt = await db.getUserDebt(userId);
  const fwiHistory = await db.getFwiHistory(userId, { days: 90 });
  
  // Análisis mensual
  let monthsWithDeficit = 0;
  for (let month = 0; month < 3; month++) {
    const monthExpenses = transactions
      .filter(tx => getMonth(tx.date) === month)
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    if (monthExpenses > income) {
      monthsWithDeficit++;
    }
  }
  
  // Verificar deuda
  const annualIncome = income * 12;
  const debtRatio = debt / annualIncome;
  
  // Verificar FWI trend
  const fwiTrend = calculateTrend(fwiHistory);
  
  // Determinar si hay espiral
  if (monthsWithDeficit >= 3 && debtRatio > 0.5 && fwiTrend === 'DOWN') {
    return {
      type: 'DEBT_SPIRAL',
      severity: 'CRITICAL',
      riskScore: 95,
      indicators: {
        monthsWithDeficit,
        debtRatio,
        fwiTrend,
      },
      suggestedActions: [
        'Habla con asesor financiero',
        'Crea plan de recuperación',
        'Considera consolidar deuda',
        'Reduce gastos discrecionales',
      ],
    };
  }
  
  return null;
}
```

**Responsable:** Backend Engineer
**Estimación:** 4 horas
**Checklist:**
- [ ] Función implementada
- [ ] Tests unitarios creados
- [ ] Validación de datos
- [ ] Integrado en cron job

---

#### Tarea 1.2.2: Implementar detectEwaOveruse()
```typescript
// Archivo: server/services/patternDetection.ts

export async function detectEwaOveruse(userId: number): Promise<Pattern | null> {
  const ewaUsage = await db.getEwaUsage(userId, { days: 90 });
  
  // Contar EWA por mes
  const ewaPerMonth = {};
  for (const ewa of ewaUsage) {
    const month = ewa.date.toISOString().slice(0, 7);
    ewaPerMonth[month] = (ewaPerMonth[month] || 0) + 1;
  }
  
  // Calcular intervalo promedio
  const intervals = [];
  for (let i = 0; i < ewaUsage.length - 1; i++) {
    const days = (ewaUsage[i + 1].date - ewaUsage[i].date) / (1000 * 60 * 60 * 24);
    intervals.push(days);
  }
  const avgInterval = intervals.length > 0 
    ? intervals.reduce((a, b) => a + b) / intervals.length 
    : 30;
  
  // Analizar propósito de EWA
  const purposes = await db.getEwaPurposes(userId, ewaUsage);
  const nonEssentialRatio = purposes.filter(p => 
    !['rent', 'utilities', 'food'].includes(p)
  ).length / purposes.length;
  
  // Determinar dependencia
  const maxEwaPerMonth = Math.max(...Object.values(ewaPerMonth));
  if (maxEwaPerMonth >= 3 && avgInterval < 10 && nonEssentialRatio > 0.5) {
    return {
      type: 'EWA_DEPENDENCY',
      severity: 'HIGH',
      riskScore: 80,
      indicators: {
        ewaPerMonth: maxEwaPerMonth,
        avgIntervalDays: avgInterval,
        nonEssentialRatio,
      },
      suggestedActions: [
        'Revisa tu presupuesto mensual',
        'Identifica gastos no esenciales',
        'Crea fondo de emergencia',
        'Habla con asesor',
      ],
    };
  }
  
  return null;
}
```

**Responsable:** Backend Engineer
**Estimación:** 4 horas

---

#### Tarea 1.2.3: Implementar detectOverdebtedness()
```typescript
// Archivo: server/services/patternDetection.ts

export async function detectOverdebtedness(userId: number): Promise<Pattern | null> {
  const debt = await db.getUserDebt(userId);
  const income = await db.getMonthlyIncome(userId);
  
  const annualIncome = income * 12;
  const debtRatio = debt / annualIncome;
  
  if (debtRatio > 0.5) {
    return {
      type: 'OVER_INDEBTEDNESS',
      severity: 'CRITICAL',
      riskScore: 90,
      indicators: {
        debt,
        annualIncome,
        debtRatio,
      },
      suggestedActions: [
        'Crea plan de pago de deuda',
        'Negocia tasas de interés',
        'Considera consolidación',
        'Busca asesoría profesional',
      ],
    };
  }
  
  return null;
}
```

**Responsable:** Backend Engineer
**Estimación:** 2 horas

---

### Sprint 1.3: Sistema de Alertas (Semana 3)

#### Tarea 1.3.1: Crear Alert Engine
```typescript
// Archivo: server/services/alertEngine.ts

const ALERT_DEFINITIONS = {
  DEBT_SPIRAL: {
    severity: 5,
    title: '⚠️ Espiral de Deuda Detectada',
    channels: ['push', 'email', 'sms'],
    cooldown: 24,
  },
  EWA_OVERUSE: {
    severity: 4,
    title: '⚠️ Uso Excesivo de EWA',
    channels: ['push', 'email'],
    cooldown: 48,
  },
  // ... más alertas
};

export async function generateAlerts(userId: number): Promise<Alert[]> {
  const alerts: Alert[] = [];
  
  // Detectar patrones
  const debtSpiral = await detectDebtSpiral(userId);
  if (debtSpiral) {
    alerts.push({
      code: 'DEBT_SPIRAL',
      userId,
      title: ALERT_DEFINITIONS.DEBT_SPIRAL.title,
      message: `Tu deuda es ${debtSpiral.indicators.debtRatio * 100}% de tus ingresos anuales.`,
      context: debtSpiral.indicators,
      severity: ALERT_DEFINITIONS.DEBT_SPIRAL.severity,
    });
  }
  
  // ... más detecciones
  
  return alerts;
}

export async function sendAlert(alert: Alert, user: User): Promise<void> {
  const definition = ALERT_DEFINITIONS[alert.code];
  
  // Verificar cooldown
  const lastAlert = await db.getLastAlert(alert.userId, alert.code);
  if (lastAlert && (now() - lastAlert.createdAt).hours < definition.cooldown) {
    return;
  }
  
  // Enviar por canales
  if (definition.channels.includes('push')) {
    await sendPushNotification(user, alert);
  }
  if (definition.channels.includes('email')) {
    await sendEmailNotification(user, alert);
  }
  if (definition.channels.includes('sms')) {
    await sendSmsNotification(user, alert);
  }
  
  // Guardar en BD
  await db.saveAlert(alert);
}
```

**Responsable:** Backend Engineer
**Estimación:** 6 horas
**Checklist:**
- [ ] Alert engine implementado
- [ ] Canales de notificación integrados
- [ ] Cooldown implementado
- [ ] Tests unitarios

---

#### Tarea 1.3.2: Integrar Notificaciones Push
```typescript
// Archivo: server/services/pushNotification.ts

export async function sendPushNotification(user: User, alert: Alert): Promise<void> {
  const subscriptions = await db.getPushSubscriptions(user.id);
  
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, {
        title: alert.title,
        body: alert.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: alert.code,
        requireInteraction: alert.severity >= 4,
        data: {
          alertId: alert.id,
          url: `/dashboard?alert=${alert.id}`,
        },
      });
    } catch (error) {
      logger.error(`Push notification failed for user ${user.id}:`, error);
    }
  }
}
```

**Responsable:** Backend Engineer
**Estimación:** 3 horas

---

### Sprint 1.4: Dashboard de Alertas (Semana 4)

#### Tarea 1.4.1: Crear Componente AlertsPanel
```typescript
// Archivo: client/src/components/dashboard/AlertsPanel.tsx

export function AlertsPanel() {
  const { data: alerts, isLoading } = trpc.alerts.getActive.useQuery();
  
  if (isLoading) return <AlertsSkeleton />;
  
  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const severityColor = {
    5: 'bg-red-500',
    4: 'bg-orange-500',
    3: 'bg-yellow-500',
    2: 'bg-blue-500',
    1: 'bg-green-500',
  }[alert.severity];
  
  return (
    <div className={`p-4 rounded-lg ${severityColor}/10 border border-${severityColor}/30`}>
      <h3 className="font-semibold text-white">{alert.title}</h3>
      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="default">
          Tomar Acción
        </Button>
        <Button size="sm" variant="outline">
          Descartar
        </Button>
      </div>
    </div>
  );
}
```

**Responsable:** Frontend Engineer
**Estimación:** 4 horas

---

#### Tarea 1.4.2: Crear tRPC Endpoints para Alertas
```typescript
// Archivo: server/routers/alerts.ts

export const alertsRouter = router({
  getActive: protectedProcedure
    .query(async ({ ctx }) => {
      const alerts = await db.getActiveAlerts(ctx.user.id);
      return alerts.map(a => ({
        id: a.id,
        code: a.alertCode,
        title: a.title,
        message: a.message,
        severity: a.severity,
        context: JSON.parse(a.context),
        createdAt: a.createdAt,
      }));
    }),

  acknowledge: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.updateAlert(input.alertId, {
        isAcknowledged: true,
        acknowledgedAt: new Date(),
      });
      return { success: true };
    }),

  dismiss: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.updateAlert(input.alertId, {
        isActive: false,
      });
      return { success: true };
    }),
});
```

**Responsable:** Backend Engineer
**Estimación:** 3 horas

---

## FASE 2: INSIGHTS Y RECOMENDACIONES (Semanas 5-8)

### Sprint 2.1: Predicciones (Semana 5)

#### Tarea 2.1.1: Implementar Predicción de Gastos
```typescript
// Archivo: server/services/predictions.ts

export async function predictWeeklyExpense(userId: number): Promise<Prediction> {
  const transactions = await db.getTransactions(userId, { days: 90 });
  
  // Feature engineering
  const features = {
    avgWeeklyExpense: calculateAvgWeekly(transactions),
    volatility: calculateVolatility(transactions),
    dayOfWeek: new Date().getDay(),
    isWeekend: isWeekend(),
    isMonthEnd: isMonthEnd(),
    isPayday: await isPayday(userId),
    recentTrend: calculateTrend(transactions.slice(-14)),
    seasonalFactor: getSeasonalFactor(new Date().getMonth()),
  };
  
  // Cargar modelo
  const model = await loadModel('expense_prediction');
  const prediction = model.predict(features);
  const confidence = model.getConfidence(features);
  
  // Ajustar por eventos
  const events = await db.getUserEvents(userId, { days: 7 });
  let adjustedPrediction = prediction;
  for (const event of events) {
    adjustedPrediction *= event.expenseMultiplier;
  }
  
  return {
    value: adjustedPrediction,
    confidence,
    lowerBound: adjustedPrediction * 0.85,
    upperBound: adjustedPrediction * 1.15,
    factors: features,
  };
}
```

**Responsable:** ML Engineer
**Estimación:** 8 horas

---

#### Tarea 2.1.2: Implementar Predicción de Riesgo EWA
```typescript
// Archivo: server/services/predictions.ts

export async function predictEwaRisk(userId: number): Promise<Prediction> {
  const ewaHistory = await db.getEwaUsage(userId, { days: 90 });
  const user = await db.getUser(userId);
  
  const features = {
    ewaFrequencyPerMonth: ewaHistory.length / 3,
    daysSinceLastEwa: ewaHistory.length > 0 
      ? (now() - ewaHistory[0].date) / (1000 * 60 * 60 * 24)
      : 30,
    avgIntervalBetweenEwa: calculateAvgInterval(ewaHistory),
    financialStressScore: calculateStressScore(user),
    fwiScore: user.fwiScore,
    debtRatio: user.debt / (user.annualIncome || 1),
    budgetExceededRatio: calculateBudgetExceededRatio(userId, 30),
  };
  
  const model = await loadModel('ewa_risk_model');
  const probability = model.predictProba(features)[1];
  
  return {
    value: probability * 100,
    confidence: 0.85,
    interpretation: probability > 0.6 
      ? 'Alta probabilidad de usar EWA'
      : 'Baja probabilidad',
  };
}
```

**Responsable:** ML Engineer
**Estimación:** 6 horas

---

### Sprint 2.2: Motor de Recomendaciones (Semana 6)

#### Tarea 2.2.1: Implementar Algoritmo de Priorización
```typescript
// Archivo: server/services/recommendations.ts

export function calculateRecommendationScore(
  recommendation: Recommendation,
  userProfile: UserProfile
): number {
  // Factor 1: Impacto Financiero (0-100)
  const financialImpact = Math.min(
    (recommendation.estimatedImpact / userProfile.monthlyIncome) * 100,
    100
  );
  
  // Factor 2: Probabilidad de Éxito (0-100)
  const successProbability = calculateSuccessProbability(
    recommendation.type,
    userProfile.behaviorHistory
  );
  
  // Factor 3: Urgencia (0-100)
  const urgency = {
    'CRITICAL': 100,
    'HIGH': 75,
    'MEDIUM': 50,
    'LOW': 25,
  }[recommendation.urgency] || 0;
  
  // Factor 4: Relevancia (0-100)
  const relevance = calculateRelevance(
    recommendation.context,
    userProfile.preferences,
    userProfile.pastActions
  );
  
  // Score ponderado
  const score = (
    (financialImpact * 0.4) +
    (successProbability * 0.3) +
    (urgency * 0.2) +
    (relevance * 0.1)
  );
  
  return Math.round(score);
}
```

**Responsable:** Backend Engineer
**Estimación:** 4 horas

---

#### Tarea 2.2.2: Implementar Generador de Recomendaciones
```typescript
// Archivo: server/services/recommendations.ts

export async function generateRecommendations(userId: number): Promise<Recommendation[]> {
  const user = await db.getUser(userId);
  const userProfile = await buildUserProfile(user);
  
  const recommendations: Recommendation[] = [];
  
  // Recomendaciones de Prevención
  if (userProfile.financialRiskScore > 70) {
    recommendations.push(...await generatePreventionRecs(userProfile));
  }
  
  // Recomendaciones de Oportunidad
  recommendations.push(...await generateOpportunityRecs(userProfile));
  
  // Recomendaciones de Acción
  if (userProfile.hasActivePatterns) {
    recommendations.push(...await generateActionRecs(userProfile));
  }
  
  // Recomendaciones de Celebración
  if (userProfile.hasPositiveProgress) {
    recommendations.push(...await generateCelebrationRecs(userProfile));
  }
  
  // Priorizar y limitar a top 5
  recommendations.sort(
    (a, b) => calculateRecommendationScore(b, userProfile) - 
              calculateRecommendationScore(a, userProfile)
  );
  
  return recommendations.slice(0, 5);
}
```

**Responsable:** Backend Engineer
**Estimación:** 6 horas

---

### Sprint 2.3: Dashboard de Insights (Semana 7)

#### Tarea 2.3.1: Crear Componente InsightsPanel
```typescript
// Archivo: client/src/components/dashboard/InsightsPanel.tsx

export function InsightsPanel() {
  const { data: insights, isLoading } = trpc.insights.getInsights.useQuery();
  
  if (isLoading) return <InsightsSkeleton />;
  
  return (
    <div className="space-y-6">
      {/* Predicciones */}
      <PredictionsCard predictions={insights.predictions} />
      
      {/* Patrones */}
      {insights.insights.detectedPatterns.length > 0 && (
        <PatternsCard patterns={insights.insights.detectedPatterns} />
      )}
      
      {/* Alertas */}
      {insights.alerts.length > 0 && (
        <AlertsCard alerts={insights.alerts} />
      )}
      
      {/* Recomendaciones */}
      <RecommendationsCard recommendations={insights.recommendations} />
    </div>
  );
}
```

**Responsable:** Frontend Engineer
**Estimación:** 6 horas

---

#### Tarea 2.3.2: Crear tRPC Endpoints para Insights
```typescript
// Archivo: server/routers/insights.ts

export const insightsRouter = router({
  getInsights: protectedProcedure
    .query(async ({ ctx }) => {
      const insights = await db.getUserInsights(ctx.user.id);
      const predictions = await db.getPredictions(ctx.user.id);
      const recommendations = await db.getRecommendations(ctx.user.id);
      const alerts = await db.getActiveAlerts(ctx.user.id);
      
      return {
        insights,
        predictions,
        recommendations,
        alerts,
        lastUpdated: new Date(),
      };
    }),
});
```

**Responsable:** Backend Engineer
**Estimación:** 3 horas

---

### Sprint 2.4: Cron Jobs (Semana 8)

#### Tarea 2.4.1: Crear Cron Job para Cálculo de Insights
```typescript
// Archivo: server/cronJobs/insightsCalculation.ts

export async function calculateInsightsForAllUsers() {
  const users = await db.getAllActiveUsers();
  
  for (const user of users) {
    try {
      // Calcular insights
      const insights = await calculateUserInsights(user.id);
      await db.saveUserInsights(user.id, insights);
      
      // Detectar patrones
      const patterns = await detectUserPatterns(user.id);
      for (const pattern of patterns) {
        await db.saveUserPattern(user.id, pattern);
      }
      
      // Generar recomendaciones
      const recommendations = await generateRecommendations(user.id);
      for (const rec of recommendations) {
        await db.saveRecommendation(user.id, rec);
      }
      
      // Generar alertas
      const alerts = await generateAlerts(user.id);
      for (const alert of alerts) {
        if (shouldSendAlert(alert, user.id)) {
          await sendAlert(alert, user);
        }
      }
      
    } catch (error) {
      logger.error(`Error calculating insights for user ${user.id}:`, error);
    }
  }
}

// Ejecutar diariamente a las 2 AM
schedule.scheduleJob('0 2 * * *', calculateInsightsForAllUsers);

// Ejecutar cada hora para alertas críticas
schedule.scheduleJob('0 * * * *', async () => {
  const criticalAlerts = await db.getCriticalAlerts();
  for (const alert of criticalAlerts) {
    if (!alert.notificationSentAt) {
      await sendAlert(alert, alert.user);
    }
  }
});
```

**Responsable:** Backend Engineer
**Estimación:** 4 horas

---

## FASE 3: OCR (Semanas 9-12)

### Sprint 3.1: Integración Google Vision (Semana 9)

#### Tarea 3.1.1: Configurar Google Vision API
```typescript
// Archivo: server/services/ocr.ts

import vision from '@google-cloud/vision';

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_FILE,
});

export async function processReceiptImage(imageBuffer: Buffer): Promise<OcrResult> {
  const request = {
    image: { content: imageBuffer },
    features: [
      { type: 'TEXT_DETECTION' },
      { type: 'DOCUMENT_TEXT_DETECTION' },
    ],
  };
  
  const [result] = await visionClient.annotateImage(request);
  const textAnnotations = result.textAnnotations || [];
  
  return {
    fullText: textAnnotations[0]?.description || '',
    confidence: calculateConfidence(textAnnotations),
    annotations: textAnnotations,
  };
}
```

**Responsable:** Backend Engineer
**Estimación:** 3 horas

---

#### Tarea 3.1.2: Crear Endpoint /api/ocr/process-receipt
```typescript
// Archivo: server/routes/ocr.ts

router.post('/ocr/process-receipt', protectedRoute, async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Validar imagen
    const validation = await validateReceiptImage(image);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.reason });
    }
    
    // Convertir base64 a buffer
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    
    // Procesar con OCR
    const ocrResult = await processReceiptImage(imageBuffer);
    
    // Parsear datos
    const extractedData = parseReceiptText(ocrResult.fullText);
    
    // Enriquecer
    const enrichedData = await enrichReceiptData(extractedData);
    
    // Guardar
    await db.saveReceiptExtraction(req.user.id, {
      imageUrl: image,
      extractedData,
      enrichedData,
      ocrConfidence: ocrResult.confidence,
    });
    
    res.json(enrichedData);
  } catch (error) {
    logger.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
});
```

**Responsable:** Backend Engineer
**Estimación:** 5 horas

---

### Sprint 3.2: Componentes Frontend (Semana 10)

#### Tarea 3.2.1: Crear ReceiptCapture.tsx
**Responsable:** Frontend Engineer
**Estimación:** 6 horas
**Checklist:**
- [ ] Captura de cámara
- [ ] Upload de archivo
- [ ] Validación de imagen
- [ ] Indicador de progreso

---

#### Tarea 3.2.2: Crear ReceiptPreview.tsx
**Responsable:** Frontend Engineer
**Estimación:** 4 horas
**Checklist:**
- [ ] Mostrar imagen
- [ ] Edición de campos
- [ ] Validación
- [ ] Confirmación

---

### Sprint 3.3: Enriquecimiento y Análisis (Semana 11)

#### Tarea 3.3.1: Implementar Clasificación de Categoría
**Responsable:** ML Engineer
**Estimación:** 6 horas

---

#### Tarea 3.3.2: Implementar Detección de Duplicados
**Responsable:** Backend Engineer
**Estimación:** 4 horas

---

### Sprint 3.4: Integración (Semana 12)

#### Tarea 3.4.1: Integrar OCR con Insights
**Responsable:** Backend Engineer
**Estimación:** 4 horas

---

#### Tarea 3.4.2: Testing y QA
**Responsable:** QA Engineer
**Estimación:** 8 horas

---

## FASE 4: OPTIMIZACIÓN (Semanas 13-24)

### Tareas Principales
- [ ] A/B testing de mensajes
- [ ] Mejora de modelos ML
- [ ] Integración con APIs externas
- [ ] Soporte móvil nativo
- [ ] Análisis en tiempo real
- [ ] Reportes avanzados

---

## RESUMEN DE ESFUERZO

| Fase | Sprint | Semanas | Backend | Frontend | ML | Total |
|------|--------|---------|---------|----------|----|----|
| 1 | 1.1-1.4 | 4 | 20h | 4h | - | 24h |
| 2 | 2.1-2.4 | 4 | 20h | 10h | 14h | 44h |
| 3 | 3.1-3.4 | 4 | 18h | 10h | 6h | 34h |
| 4 | 4.1+ | 12 | 60h | 40h | 30h | 130h |
| **TOTAL** | | **24** | **118h** | **64h** | **50h** | **232h** |

**Equipo Recomendado:**
- 2 Backend Engineers (full-time)
- 2 Frontend Engineers (full-time)
- 1 ML Engineer (full-time)
- 1 QA Engineer (full-time)

**Duración Total:** 6 meses (24 semanas)

---

Este documento proporciona las tareas detalladas para implementar cada componente del plan de enriquecimiento de valor.
