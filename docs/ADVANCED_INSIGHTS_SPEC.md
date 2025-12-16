# Especificación Técnica: Insights Avanzados y Detección de Patrones

## 1. ARQUITECTURA DEL SISTEMA DE INSIGHTS

### 1.1 Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    INSIGHTS ENGINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ DATA INGESTION   │  │ PATTERN DETECTION│                │
│  ├──────────────────┤  ├──────────────────┤                │
│  │ • Transacciones  │  │ • Gastos Hormiga │                │
│  │ • FWI History    │  │ • Deuda Espiral  │                │
│  │ • Ingresos       │  │ • Gasto Impulsivo│                │
│  │ • EWA Usage      │  │ • Negligencia    │                │
│  │ • Eventos        │  │ • Sobre-deuda    │                │
│  └──────────────────┘  └──────────────────┘                │
│           │                     │                           │
│           └─────────┬───────────┘                           │
│                     │                                       │
│         ┌───────────▼──────────┐                           │
│         │ FEATURE ENGINEERING  │                           │
│         ├──────────────────────┤                           │
│         │ • Agregaciones       │                           │
│         │ • Ratios             │                           │
│         │ • Tendencias         │                           │
│         │ • Estacionalidad     │                           │
│         │ • Volatilidad        │                           │
│         └───────────┬──────────┘                           │
│                     │                                       │
│  ┌──────────────────▼──────────────────┐                   │
│  │     PREDICTION & SCORING ENGINE     │                   │
│  ├─────────────────────────────────────┤                   │
│  │ • Gasto esperado (7 días)           │                   │
│  │ • Riesgo de exceder presupuesto     │                   │
│  │ • Probabilidad de usar EWA          │                   │
│  │ • Tendencia de FWI Score            │                   │
│  │ • Riesgo financiero (0-100)         │                   │
│  └──────────────────┬──────────────────┘                   │
│                     │                                       │
│  ┌──────────────────▼──────────────────┐                   │
│  │  RECOMMENDATION ENGINE              │                   │
│  ├─────────────────────────────────────┤                   │
│  │ • Prevención                        │                   │
│  │ • Oportunidad                       │                   │
│  │ • Acción                            │                   │
│  │ • Celebración                       │                   │
│  └──────────────────┬──────────────────┘                   │
│                     │                                       │
│  ┌──────────────────▼──────────────────┐                   │
│  │  ALERT & NOTIFICATION ENGINE        │                   │
│  ├─────────────────────────────────────┤                   │
│  │ • Priorización                      │                   │
│  │ • Deduplicación                     │                   │
│  │ • Scheduling                        │                   │
│  │ • Multi-channel (push, email, SMS)  │                   │
│  └─────────────────────────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. MODELOS DE DATOS

### 2.1 Tabla: user_insights

```sql
CREATE TABLE user_insights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL UNIQUE,
  
  -- Predicciones
  predictedWeeklyExpense DECIMAL(10,2),
  predictedWeeklyExpenseConfidence FLOAT, -- 0-1
  budgetExceedanceRisk INT, -- 0-100
  ewaUsageProbability INT, -- 0-100
  fwiScoreTrend VARCHAR(20), -- UP, STABLE, DOWN
  financialRiskScore INT, -- 0-100
  
  -- Patrones Detectados
  detectedPatterns JSON, -- Array de patrones activos
  activeAlerts INT, -- Cantidad de alertas activas
  lastAlertAt TIMESTAMP,
  
  -- Métricas
  engagementScore FLOAT, -- 0-1
  improvementRate FLOAT, -- % cambio mensual
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastCalculatedAt TIMESTAMP
);
```

### 2.2 Tabla: user_patterns

```sql
CREATE TABLE user_patterns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Identificación del patrón
  patternType VARCHAR(50), -- 'ant_expense', 'debt_spiral', 'impulse_spending', etc.
  patternName VARCHAR(100),
  description TEXT,
  
  -- Indicadores
  indicators JSON, -- Array de indicadores que lo disparan
  severity VARCHAR(20), -- CRITICAL, HIGH, MEDIUM, LOW
  riskScore INT, -- 0-100
  
  -- Contexto
  detectedAt TIMESTAMP,
  startDate DATE,
  endDate DATE,
  
  -- Acciones
  suggestedActions JSON, -- Array de acciones recomendadas
  actionsTaken JSON, -- Array de acciones que el usuario hizo
  
  -- Seguimiento
  isResolved BOOLEAN DEFAULT FALSE,
  resolvedAt TIMESTAMP,
  resolutionNotes TEXT,
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId_patternType (userId, patternType),
  INDEX idx_severity (severity)
);
```

### 2.3 Tabla: user_recommendations

```sql
CREATE TABLE user_recommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Identificación
  recommendationType VARCHAR(50), -- 'prevention', 'opportunity', 'action', 'celebration'
  title VARCHAR(200),
  description TEXT,
  
  -- Contexto
  context JSON, -- Datos que generaron la recomendación
  estimatedImpact DECIMAL(10,2), -- S/ de ahorro potencial
  impactConfidence FLOAT, -- 0-1
  
  -- Priorización
  priority INT, -- 1-10
  urgency VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
  
  -- Acciones
  suggestedActions JSON, -- Array de acciones
  callToAction VARCHAR(200),
  actionUrl VARCHAR(500),
  
  -- Seguimiento
  isViewed BOOLEAN DEFAULT FALSE,
  viewedAt TIMESTAMP,
  isActedUpon BOOLEAN DEFAULT FALSE,
  actedAt TIMESTAMP,
  actionResult VARCHAR(500),
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId_type (userId, recommendationType),
  INDEX idx_priority (priority)
);
```

### 2.4 Tabla: user_alerts

```sql
CREATE TABLE user_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Identificación
  alertType VARCHAR(50), -- 'critical', 'high', 'medium', 'low'
  alertCode VARCHAR(50), -- 'DEBT_SPIRAL', 'EWA_OVERUSE', etc.
  title VARCHAR(200),
  message TEXT,
  
  -- Contexto
  context JSON, -- Datos que generaron la alerta
  metrics JSON, -- Métricas relevantes
  
  -- Priorización
  severity INT, -- 1-5 (5 = crítico)
  isActive BOOLEAN DEFAULT TRUE,
  
  -- Notificación
  notificationChannels JSON, -- ['push', 'email', 'sms']
  notificationSentAt TIMESTAMP,
  
  -- Seguimiento
  isAcknowledged BOOLEAN DEFAULT FALSE,
  acknowledgedAt TIMESTAMP,
  userAction VARCHAR(500),
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId_active (userId, isActive),
  INDEX idx_severity (severity)
);
```

---

## 3. ALGORITMOS DE DETECCIÓN DE PATRONES

### 3.1 Patrón: Espiral de Deuda

```python
def detect_debt_spiral(user_id: int, days: int = 90) -> Pattern:
    """
    Detecta si el usuario está en una espiral de deuda
    Indicadores:
    - Gastos > ingresos por 3+ meses consecutivos
    - Deuda acumulada > 50% ingresos anuales
    - FWI Score bajando consistentemente
    """
    
    transactions = get_transactions(user_id, days)
    income = get_monthly_income(user_id)
    
    # Análisis mensual
    months_with_deficit = 0
    total_deficit = 0
    
    for month in range(3):
        month_expenses = sum(tx.amount for tx in transactions 
                           if tx.date.month == month)
        month_income = income
        
        if month_expenses > month_income:
            months_with_deficit += 1
            total_deficit += (month_expenses - month_income)
    
    # Verificar deuda
    total_debt = get_user_debt(user_id)
    annual_income = income * 12
    debt_ratio = total_debt / annual_income if annual_income > 0 else 0
    
    # Verificar FWI trend
    fwi_history = get_fwi_history(user_id, 90)
    fwi_trend = calculate_trend(fwi_history)
    
    # Determinar si hay espiral
    is_spiral = (
        months_with_deficit >= 3 and
        debt_ratio > 0.5 and
        fwi_trend == "DOWN"
    )
    
    if is_spiral:
        return Pattern(
            type="DEBT_SPIRAL",
            severity="CRITICAL",
            indicators={
                "months_with_deficit": months_with_deficit,
                "total_deficit": total_deficit,
                "debt_ratio": debt_ratio,
                "fwi_trend": fwi_trend
            },
            suggested_actions=[
                "Habla con asesor financiero",
                "Crea plan de recuperación",
                "Considera consolidar deuda",
                "Reduce gastos discrecionales"
            ]
        )
    
    return None
```

### 3.2 Patrón: Dependencia de EWA

```python
def detect_ewa_dependency(user_id: int, days: int = 90) -> Pattern:
    """
    Detecta si el usuario depende demasiado de EWA
    Indicadores:
    - EWA 3+ veces por mes
    - Intervalo entre EWA < 10 días
    - EWA para gastos no esenciales
    """
    
    ewa_usage = get_ewa_usage(user_id, days)
    
    # Contar EWA por mes
    ewa_per_month = {}
    for ewa in ewa_usage:
        month = ewa.date.strftime("%Y-%m")
        ewa_per_month[month] = ewa_per_month.get(month, 0) + 1
    
    # Calcular intervalo promedio
    ewa_dates = [ewa.date for ewa in ewa_usage]
    intervals = [
        (ewa_dates[i+1] - ewa_dates[i]).days 
        for i in range(len(ewa_dates)-1)
    ]
    avg_interval = sum(intervals) / len(intervals) if intervals else 30
    
    # Analizar propósito de EWA
    ewa_purposes = get_ewa_purposes(user_id, ewa_usage)
    non_essential_ratio = sum(
        1 for p in ewa_purposes 
        if p not in ['rent', 'utilities', 'food']
    ) / len(ewa_purposes) if ewa_purposes else 0
    
    # Determinar dependencia
    is_dependent = (
        max(ewa_per_month.values()) >= 3 and
        avg_interval < 10 and
        non_essential_ratio > 0.5
    )
    
    if is_dependent:
        return Pattern(
            type="EWA_DEPENDENCY",
            severity="HIGH",
            indicators={
                "ewa_per_month": max(ewa_per_month.values()),
                "avg_interval_days": avg_interval,
                "non_essential_ratio": non_essential_ratio
            },
            suggested_actions=[
                "Revisa tu presupuesto mensual",
                "Identifica gastos no esenciales",
                "Crea fondo de emergencia",
                "Habla con asesor"
            ]
        )
    
    return None
```

### 3.3 Patrón: Gasto Impulsivo

```python
def detect_impulse_spending(user_id: int, days: int = 30) -> Pattern:
    """
    Detecta gastos impulsivos
    Indicadores:
    - Alta varianza en gastos semana a semana (>60%)
    - Picos de gasto sin patrón
    - Gastos en categorías discrecionales
    """
    
    transactions = get_transactions(user_id, days)
    
    # Agrupar por semana
    weekly_totals = []
    for week in range(4):
        week_total = sum(
            tx.amount for tx in transactions
            if get_week_number(tx.date) == week
        )
        weekly_totals.append(week_total)
    
    # Calcular varianza
    avg = sum(weekly_totals) / len(weekly_totals)
    variance = sum((x - avg) ** 2 for x in weekly_totals) / len(weekly_totals)
    std_dev = variance ** 0.5
    cv = (std_dev / avg) if avg > 0 else 0  # Coefficient of variation
    
    # Analizar categorías
    discretionary_ratio = sum(
        tx.amount for tx in transactions
        if tx.category in ['entertainment', 'shopping', 'food']
    ) / sum(tx.amount for tx in transactions) if transactions else 0
    
    # Detectar picos
    pikes = [w for w in weekly_totals if w > avg * 1.5]
    pike_ratio = len(pikes) / len(weekly_totals)
    
    # Determinar si hay gasto impulsivo
    is_impulsive = (
        cv > 0.6 and
        discretionary_ratio > 0.5 and
        pike_ratio > 0.25
    )
    
    if is_impulsive:
        return Pattern(
            type="IMPULSE_SPENDING",
            severity="MEDIUM",
            indicators={
                "coefficient_of_variation": cv,
                "discretionary_ratio": discretionary_ratio,
                "pike_ratio": pike_ratio
            },
            suggested_actions=[
                "Implementa regla de 24 horas antes de comprar",
                "Usa presupuesto por categoría",
                "Activa notificaciones de gasto",
                "Practica mindfulness financiero"
            ]
        )
    
    return None
```

---

## 4. MOTOR DE RECOMENDACIONES

### 4.1 Algoritmo de Priorización

```python
def calculate_recommendation_score(
    recommendation: Recommendation,
    user_profile: UserProfile
) -> int:
    """
    Calcula score de prioridad para una recomendación
    Score = (Impacto × 0.4) + (Probabilidad × 0.3) + (Urgencia × 0.2) + (Relevancia × 0.1)
    """
    
    # Factor 1: Impacto Financiero (0-100)
    financial_impact = min(
        (recommendation.estimated_impact / user_profile.monthly_income) * 100,
        100
    )
    
    # Factor 2: Probabilidad de Éxito (0-100)
    success_probability = calculate_success_probability(
        recommendation.type,
        user_profile.behavior_history
    )
    
    # Factor 3: Urgencia (0-100)
    urgency = {
        'CRITICAL': 100,
        'HIGH': 75,
        'MEDIUM': 50,
        'LOW': 25
    }.get(recommendation.urgency, 0)
    
    # Factor 4: Relevancia para el Usuario (0-100)
    relevance = calculate_relevance(
        recommendation.context,
        user_profile.preferences,
        user_profile.past_actions
    )
    
    # Calcular score ponderado
    score = (
        (financial_impact * 0.4) +
        (success_probability * 0.3) +
        (urgency * 0.2) +
        (relevance * 0.1)
    )
    
    return int(score)

def generate_recommendations(user_id: int) -> List[Recommendation]:
    """
    Genera recomendaciones personalizadas para un usuario
    """
    user = get_user(user_id)
    user_profile = build_user_profile(user)
    
    recommendations = []
    
    # Recomendaciones de Prevención
    if user_profile.financial_risk_score > 70:
        recommendations.extend(generate_prevention_recommendations(user_profile))
    
    # Recomendaciones de Oportunidad
    recommendations.extend(generate_opportunity_recommendations(user_profile))
    
    # Recomendaciones de Acción
    if user_profile.has_active_patterns:
        recommendations.extend(generate_action_recommendations(user_profile))
    
    # Recomendaciones de Celebración
    if user_profile.has_positive_progress:
        recommendations.extend(generate_celebration_recommendations(user_profile))
    
    # Priorizar y limitar a top 5
    recommendations.sort(
        key=lambda r: calculate_recommendation_score(r, user_profile),
        reverse=True
    )
    
    return recommendations[:5]
```

### 4.2 Generador de Recomendaciones de Prevención

```python
def generate_prevention_recommendations(user_profile: UserProfile) -> List[Recommendation]:
    """
    Genera recomendaciones preventivas basadas en patrones detectados
    """
    recommendations = []
    
    # Si hay gastos hormiga
    if user_profile.ant_expenses:
        total_ant = sum(e.monthly_impact for e in user_profile.ant_expenses)
        recommendations.append(Recommendation(
            type="PREVENTION",
            title="Gastos Hormiga Detectados",
            description=f"Detectamos {len(user_profile.ant_expenses)} gastos hormiga que suman S/ {total_ant:.2f}/mes",
            estimated_impact=total_ant,
            urgency="MEDIUM",
            suggested_actions=[
                f"Elimina '{e.name}' para ahorrar S/ {e.monthly_impact:.2f}",
                "Automatiza compras necesarias",
                "Redirige ahorro a metas"
            ]
        ))
    
    # Si FWI está bajando
    if user_profile.fwi_trend == "DOWN":
        recommendations.append(Recommendation(
            type="PREVENTION",
            title="Tu FWI Score está bajando",
            description=f"Bajó {abs(user_profile.fwi_change)} puntos en {user_profile.fwi_change_period}",
            estimated_impact=user_profile.fwi_change * 100,  # Proxy
            urgency="HIGH",
            suggested_actions=[
                "Revisa categorías sobre presupuesto",
                "Reduce gastos discrecionales",
                "Aumenta ahorros"
            ]
        ))
    
    # Si hay riesgo de deuda
    if user_profile.debt_ratio > 0.3:
        recommendations.append(Recommendation(
            type="PREVENTION",
            title="Riesgo de Sobre-endeudamiento",
            description=f"Tu deuda es {user_profile.debt_ratio*100:.0f}% de ingresos anuales",
            estimated_impact=user_profile.total_debt,
            urgency="CRITICAL",
            suggested_actions=[
                "Crea plan de pago de deuda",
                "Negocia tasas de interés",
                "Considera consolidación"
            ]
        ))
    
    return recommendations
```

---

## 5. MOTOR DE ALERTAS

### 5.1 Tipos de Alertas

```python
ALERT_DEFINITIONS = {
    "DEBT_SPIRAL": {
        "severity": 5,
        "title": "⚠️ Espiral de Deuda Detectada",
        "channels": ["push", "email", "sms"],
        "cooldown_hours": 24,
    },
    "EWA_OVERUSE": {
        "severity": 4,
        "title": "⚠️ Uso Excesivo de EWA",
        "channels": ["push", "email"],
        "cooldown_hours": 48,
    },
    "BUDGET_EXCEEDED": {
        "severity": 3,
        "title": "📊 Presupuesto Excedido",
        "channels": ["push"],
        "cooldown_hours": 12,
    },
    "ANT_EXPENSE_DETECTED": {
        "severity": 2,
        "title": "🐜 Nuevo Gasto Hormiga",
        "channels": ["push"],
        "cooldown_hours": 24,
    },
    "FWI_IMPROVEMENT": {
        "severity": 1,
        "title": "✨ ¡Tu FWI Mejoró!",
        "channels": ["push"],
        "cooldown_hours": 0,  # Sin cooldown, celebrar siempre
    }
}

def should_send_alert(alert_type: str, user_id: int) -> bool:
    """
    Determina si se debe enviar una alerta
    Considera: cooldown, preferencias usuario, frecuencia
    """
    
    # Verificar preferencias del usuario
    user_prefs = get_user_notification_preferences(user_id)
    if not user_prefs.get(alert_type, {}).get('enabled', True):
        return False
    
    # Verificar cooldown
    last_alert = get_last_alert(user_id, alert_type)
    cooldown = ALERT_DEFINITIONS[alert_type]['cooldown_hours']
    
    if last_alert and (now() - last_alert).hours < cooldown:
        return False
    
    # Verificar frecuencia (máximo 5 alertas por día)
    today_alerts = count_alerts_today(user_id)
    if today_alerts >= 5:
        return False
    
    return True

def send_alert(alert: Alert, user_id: int):
    """
    Envía alerta por múltiples canales
    """
    alert_def = ALERT_DEFINITIONS[alert.alert_code]
    
    if should_send_alert(alert.alert_code, user_id):
        # Push notification
        if 'push' in alert_def['channels']:
            send_push_notification(user_id, alert)
        
        # Email
        if 'email' in alert_def['channels']:
            send_email_notification(user_id, alert)
        
        # SMS
        if 'sms' in alert_def['channels']:
            send_sms_notification(user_id, alert)
        
        # Guardar en base de datos
        save_alert(alert)
```

---

## 6. CÁLCULO DE PREDICCIONES

### 6.1 Predicción de Gasto Esperado

```python
def predict_weekly_expense(user_id: int) -> Prediction:
    """
    Predice gasto esperado para los próximos 7 días
    Usa: histórico, patrones estacionales, eventos
    """
    
    user = get_user(user_id)
    transactions = get_transactions(user_id, days=90)
    
    # Feature Engineering
    features = {
        'avg_weekly_expense': calculate_avg_weekly(transactions),
        'volatility': calculate_volatility(transactions),
        'day_of_week': get_current_day_of_week(),
        'is_weekend': is_weekend(),
        'is_month_end': is_month_end(),
        'is_payday': is_payday(user),
        'recent_trend': calculate_trend(transactions[-14:]),
        'seasonal_factor': get_seasonal_factor(current_month()),
    }
    
    # Usar modelo pre-entrenado (XGBoost)
    model = load_model('expense_prediction_model')
    prediction = model.predict([features])[0]
    confidence = model.predict_proba([features])[0].max()
    
    # Ajustar por eventos conocidos
    upcoming_events = get_user_events(user_id, days=7)
    for event in upcoming_events:
        prediction *= event.expense_multiplier
    
    return Prediction(
        value=prediction,
        confidence=confidence,
        lower_bound=prediction * 0.85,
        upper_bound=prediction * 1.15,
        factors=features
    )
```

### 6.2 Predicción de Riesgo de EWA

```python
def predict_ewa_risk(user_id: int) -> Prediction:
    """
    Predice probabilidad de que el usuario use EWA en los próximos 7 días
    """
    
    user = get_user(user_id)
    ewa_history = get_ewa_usage(user_id, days=90)
    
    # Features
    features = {
        'ewa_frequency_per_month': len(ewa_history) / 3,
        'days_since_last_ewa': (now() - ewa_history[-1].date).days if ewa_history else 30,
        'avg_interval_between_ewa': calculate_avg_interval(ewa_history),
        'financial_stress_score': calculate_stress_score(user),
        'fwi_score': user.fwi_score,
        'debt_ratio': user.debt / (user.annual_income or 1),
        'budget_exceeded_ratio': calculate_budget_exceeded_ratio(user_id, 30),
    }
    
    # Modelo de predicción
    model = load_model('ewa_risk_model')
    probability = model.predict_proba([features])[0][1]  # Probabilidad de clase positiva
    
    return Prediction(
        value=probability * 100,  # Convertir a 0-100
        confidence=0.85,
        interpretation="Alta probabilidad de usar EWA" if probability > 0.6 else "Baja probabilidad"
    )
```

---

## 7. IMPLEMENTACIÓN EN BACKEND (tRPC)

### 7.1 Procedimientos tRPC

```typescript
// server/routers/insights.ts

export const insightsRouter = router({
  // Obtener insights del usuario
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

  // Obtener patrones detectados
  getPatterns: protectedProcedure
    .query(async ({ ctx }) => {
      const patterns = await db.getUserPatterns(ctx.user.id);
      
      return patterns.map(p => ({
        id: p.id,
        type: p.patternType,
        name: p.patternName,
        severity: p.severity,
        indicators: JSON.parse(p.indicators),
        suggestedActions: JSON.parse(p.suggestedActions),
        detectedAt: p.detectedAt,
      }));
    }),

  // Obtener recomendaciones
  getRecommendations: protectedProcedure
    .query(async ({ ctx }) => {
      const recommendations = await db.getRecommendations(ctx.user.id);
      
      return recommendations.map(r => ({
        id: r.id,
        type: r.recommendationType,
        title: r.title,
        description: r.description,
        estimatedImpact: r.estimatedImpact,
        priority: r.priority,
        callToAction: r.callToAction,
        isViewed: r.isViewed,
        isActedUpon: r.isActedUpon,
      }));
    }),

  // Marcar recomendación como vista
  markRecommendationViewed: protectedProcedure
    .input(z.object({ recommendationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.updateRecommendation(input.recommendationId, {
        isViewed: true,
        viewedAt: new Date(),
      });
      
      return { success: true };
    }),

  // Reportar acción en recomendación
  reportRecommendationAction: protectedProcedure
    .input(z.object({
      recommendationId: z.number(),
      action: z.string(),
      result: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.updateRecommendation(input.recommendationId, {
        isActedUpon: true,
        actedAt: new Date(),
        actionResult: input.result,
      });
      
      // Registrar en auditoría
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'recommendation.action',
        details: JSON.stringify(input),
      });
      
      return { success: true };
    }),

  // Obtener alertas activas
  getActiveAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      const alerts = await db.getActiveAlerts(ctx.user.id);
      
      return alerts.map(a => ({
        id: a.id,
        type: a.alertType,
        code: a.alertCode,
        title: a.title,
        message: a.message,
        severity: a.severity,
        context: JSON.parse(a.context),
        createdAt: a.createdAt,
      }));
    }),

  // Reconocer alerta
  acknowledgeAlert: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.updateAlert(input.alertId, {
        isAcknowledged: true,
        acknowledgedAt: new Date(),
      });
      
      return { success: true };
    }),
});
```

---

## 8. CRON JOBS PARA CÁLCULO AUTOMÁTICO

```typescript
// server/cronJobs/insightsCalculation.ts

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

---

## 9. COMPONENTES FRONTEND

### 9.1 InsightsPanel.tsx

```typescript
// client/src/components/dashboard/InsightsPanel.tsx

export function InsightsPanel() {
  const { data: insights, isLoading } = trpc.insights.getInsights.useQuery();
  
  if (isLoading) return <InsightsSkeleton />;
  
  return (
    <div className="space-y-6">
      {/* Predicciones */}
      <PredictionsCard predictions={insights.predictions} />
      
      {/* Patrones Detectados */}
      {insights.insights.detectedPatterns.length > 0 && (
        <PatternsCard patterns={insights.insights.detectedPatterns} />
      )}
      
      {/* Alertas Activas */}
      {insights.alerts.length > 0 && (
        <AlertsCard alerts={insights.alerts} />
      )}
      
      {/* Recomendaciones */}
      <RecommendationsCard recommendations={insights.recommendations} />
    </div>
  );
}
```

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### Fase 1 (Semanas 1-2): Fundamentos
- [ ] Crear tablas de base de datos
- [ ] Implementar detección de patrones críticos (espiral de deuda, EWA overuse)
- [ ] Crear alertas básicas

### Fase 2 (Semanas 3-4): Predicciones
- [ ] Implementar predicción de gastos
- [ ] Implementar predicción de riesgo EWA
- [ ] Crear dashboard de predicciones

### Fase 3 (Semanas 5-6): Recomendaciones
- [ ] Implementar motor de recomendaciones
- [ ] Crear algoritmo de priorización
- [ ] Integrar en UI

### Fase 4 (Semanas 7-8): Optimización
- [ ] A/B testing de mensajes
- [ ] Mejora de precisión de modelos
- [ ] Optimización de performance

---

Esta especificación proporciona la base técnica para implementar un sistema robusto de insights avanzados y detección de patrones nocivos.
