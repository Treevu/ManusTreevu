# Especificación Técnica: Sistema de Predicción de Churn de Talento

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Flujo General

```
┌──────────────────────────────────────────────────────────────┐
│              CHURN PREDICTION SYSTEM                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 1. DATA COLLECTION & INTEGRATION                  │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Datos de RH (ausencias, evaluaciones)           │     │
│  │ • Datos de Productividad (horas, tareas)          │     │
│  │ • Datos Financieros (FWI, deuda, EWA)            │     │
│  │ • Datos de Comunicación (email, Slack)            │     │
│  │ • Datos de Contexto (eventos, cambios)            │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │ 2. FEATURE ENGINEERING                           │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Agregaciones (últimos 30, 90, 180 días)        │     │
│  │ • Ratios (ausencias/mes, tareas/hora)            │     │
│  │ • Tendencias (bajando, subiendo, estable)        │     │
│  │ • Volatilidad (varianza de métricas)             │     │
│  │ • Correlaciones (FWI vs ausencias)               │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │ 3. CHURN RISK CALCULATION                        │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Financial Risk Score (40%)                      │     │
│  │ • Behavioral Risk Score (30%)                     │     │
│  │ • Laboral Risk Score (20%)                        │     │
│  │ • Contextual Risk Score (10%)                     │     │
│  │ • Overall Churn Risk (0-100)                      │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │ 4. PREDICTION & ALERTS                           │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Probabilidad de churn (0-1)                     │     │
│  │ • Fecha estimada de churn                         │     │
│  │ • Lead time (días antes de churn)                 │     │
│  │ • Alertas automáticas                             │     │
│  │ • Notificaciones a managers                       │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │ 5. RECOMMENDATIONS & ACTIONS                     │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Beneficio recomendado                           │     │
│  │ • Plan de acción                                  │     │
│  │ • Seguimiento de intervención                     │     │
│  │ • Medición de impacto                             │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │ 6. DASHBOARD & REPORTING                         │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ • Dashboard ejecutivo                             │     │
│  │ • Alertas para managers                           │     │
│  │ • Reportes de impacto                             │     │
│  │ • Análisis de cohortes                            │     │
│  └─────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. CÁLCULO DE CHURN RISK SCORE

### 2.1 Financial Risk Score (40% del peso)

```python
def calculate_financial_risk_score(employee_id: int) -> int:
    """
    Calcula riesgo financiero basado en salud financiera
    Peso: 40% del score total
    """
    
    # Obtener datos financieros
    fwi_score = get_fwi_score(employee_id)
    debt = get_debt_amount(employee_id)
    monthly_income = get_monthly_income(employee_id)
    ewa_usage = count_ewa_usage_last_month(employee_id)
    
    # Calcular sub-scores (0-100)
    
    # 1. FWI Score (25% del financial risk)
    fwi_risk = max(0, 100 - fwi_score)  # Si FWI es bajo, riesgo es alto
    
    # 2. Debt Ratio (25% del financial risk)
    annual_income = monthly_income * 12
    debt_ratio = debt / annual_income if annual_income > 0 else 0
    debt_risk = min(100, debt_ratio * 200)  # 50% = 100 risk
    
    # 3. EWA Usage (25% del financial risk)
    ewa_risk = min(100, (ewa_usage / 3) * 100)  # 3+ usos = 100 risk
    
    # 4. Savings Rate (25% del financial risk)
    monthly_savings = get_monthly_savings(employee_id)
    savings_rate = monthly_savings / monthly_income if monthly_income > 0 else 0
    savings_risk = max(0, 100 - (savings_rate * 100))  # Sin ahorros = riesgo
    
    # Combinar sub-scores
    financial_risk = (
        (fwi_risk * 0.25) +
        (debt_risk * 0.25) +
        (ewa_risk * 0.25) +
        (savings_risk * 0.25)
    )
    
    return int(financial_risk)
```

### 2.2 Behavioral Risk Score (30% del peso)

```python
def calculate_behavioral_risk_score(employee_id: int) -> int:
    """
    Calcula riesgo basado en cambios de comportamiento
    Peso: 30% del score total
    """
    
    # Obtener datos de comportamiento (últimos 90 días)
    absences_30d = count_absences_last_30_days(employee_id)
    absences_90d = count_absences_last_90_days(employee_id)
    
    email_activity = get_email_activity_trend(employee_id)
    slack_activity = get_slack_activity_trend(employee_id)
    
    linkedin_activity = check_linkedin_activity(employee_id)
    cv_updates = check_cv_updates(employee_id)
    
    # Calcular sub-scores (0-100)
    
    # 1. Absence Risk (30% del behavioral risk)
    absence_increase = ((absences_30d - absences_90d/3) / (absences_90d/3)) * 100
    absence_risk = min(100, max(0, absence_increase))
    
    # 2. Communication Risk (30% del behavioral risk)
    email_decline = calculate_decline_rate(email_activity)
    slack_decline = calculate_decline_rate(slack_activity)
    communication_risk = ((email_decline + slack_decline) / 2) * 100
    
    # 3. Job Search Signals (20% del behavioral risk)
    job_search_risk = 0
    if linkedin_activity > threshold:
        job_search_risk += 50
    if cv_updates:
        job_search_risk += 50
    
    # 4. Engagement Risk (20% del behavioral risk)
    engagement_score = get_engagement_score(employee_id)
    engagement_risk = max(0, 100 - engagement_score)
    
    # Combinar sub-scores
    behavioral_risk = (
        (absence_risk * 0.30) +
        (communication_risk * 0.30) +
        (job_search_risk * 0.20) +
        (engagement_risk * 0.20)
    )
    
    return int(behavioral_risk)
```

### 2.3 Laboral Risk Score (20% del peso)

```python
def calculate_laboral_risk_score(employee_id: int) -> int:
    """
    Calcula riesgo basado en desempeño laboral
    Peso: 20% del score total
    """
    
    # Obtener datos de desempeño
    performance_scores = get_performance_scores_last_year(employee_id)
    task_completion = get_task_completion_rate(employee_id)
    project_participation = get_project_participation(employee_id)
    manager_feedback = get_manager_feedback_sentiment(employee_id)
    
    # Calcular sub-scores (0-100)
    
    # 1. Performance Trend (40% del laboral risk)
    performance_trend = calculate_trend(performance_scores)
    if performance_trend == "DOWN":
        performance_risk = 80
    elif performance_trend == "STABLE":
        performance_risk = 40
    else:
        performance_risk = 10
    
    # 2. Task Completion (30% del laboral risk)
    task_risk = max(0, 100 - (task_completion * 100))
    
    # 3. Project Participation (20% del laboral risk)
    participation_risk = max(0, 100 - (project_participation * 100))
    
    # 4. Manager Feedback (10% del laboral risk)
    feedback_risk = max(0, 100 - (manager_feedback * 100))
    
    # Combinar sub-scores
    laboral_risk = (
        (performance_risk * 0.40) +
        (task_risk * 0.30) +
        (participation_risk * 0.20) +
        (feedback_risk * 0.10)
    )
    
    return int(laboral_risk)
```

### 2.4 Contextual Risk Score (10% del peso)

```python
def calculate_contextual_risk_score(employee_id: int) -> int:
    """
    Calcula riesgo basado en contexto personal/profesional
    Peso: 10% del score total
    """
    
    # Obtener datos de contexto
    life_events = get_recent_life_events(employee_id)
    tenure = get_tenure_years(employee_id)
    salary_level = get_salary_level(employee_id)
    department = get_department(employee_id)
    
    # Calcular sub-scores (0-100)
    
    # 1. Life Events (40% del contextual risk)
    life_event_risk = 0
    for event in life_events:
        if event.type in ['marriage', 'child', 'relocation']:
            life_event_risk += 30
        elif event.type in ['health_issue', 'family_issue']:
            life_event_risk += 20
    life_event_risk = min(100, life_event_risk)
    
    # 2. Tenure Risk (30% del contextual risk)
    # Empleados nuevos (< 1 año) tienen mayor riesgo
    if tenure < 1:
        tenure_risk = 70
    elif tenure < 2:
        tenure_risk = 50
    elif tenure < 5:
        tenure_risk = 30
    else:
        tenure_risk = 10
    
    # 3. Salary Level (20% del contextual risk)
    # Salarios bajos = mayor riesgo
    if salary_level < 2000:
        salary_risk = 60
    elif salary_level < 4000:
        salary_risk = 40
    elif salary_level < 6000:
        salary_risk = 20
    else:
        salary_risk = 10
    
    # 4. Department Risk (10% del contextual risk)
    # Algunos departamentos tienen mayor churn
    department_risk = get_department_churn_risk(department)
    
    # Combinar sub-scores
    contextual_risk = (
        (life_event_risk * 0.40) +
        (tenure_risk * 0.30) +
        (salary_risk * 0.20) +
        (department_risk * 0.10)
    )
    
    return int(contextual_risk)
```

### 2.5 Overall Churn Risk Score

```python
def calculate_overall_churn_risk(employee_id: int) -> dict:
    """
    Calcula score total de riesgo de churn
    """
    
    financial_risk = calculate_financial_risk_score(employee_id)
    behavioral_risk = calculate_behavioral_risk_score(employee_id)
    laboral_risk = calculate_laboral_risk_score(employee_id)
    contextual_risk = calculate_contextual_risk_score(employee_id)
    
    # Combinar con pesos
    overall_risk = (
        (financial_risk * 0.40) +
        (behavioral_risk * 0.30) +
        (laboral_risk * 0.20) +
        (contextual_risk * 0.10)
    )
    
    # Determinar nivel de riesgo
    if overall_risk >= 81:
        risk_level = "CRITICAL"
        lead_time_days = 30
    elif overall_risk >= 61:
        risk_level = "HIGH"
        lead_time_days = 60
    elif overall_risk >= 41:
        risk_level = "MEDIUM"
        lead_time_days = 90
    else:
        risk_level = "LOW"
        lead_time_days = 180
    
    return {
        "overall_risk": int(overall_risk),
        "risk_level": risk_level,
        "lead_time_days": lead_time_days,
        "financial_risk": financial_risk,
        "behavioral_risk": behavioral_risk,
        "laboral_risk": laboral_risk,
        "contextual_risk": contextual_risk,
        "estimated_churn_date": calculate_estimated_date(lead_time_days),
        "key_indicators": get_top_risk_indicators(employee_id),
        "recommended_actions": get_recommended_actions(employee_id, risk_level),
    }
```

---

## 3. PREDICCIÓN DE CHURN CON ML

### 3.1 Modelo de Predicción

```python
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
import joblib

class ChurnPredictionModel:
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.scaler = StandardScaler()
    
    def train(self, X_train, y_train):
        """
        Entrena el modelo con datos históricos
        X_train: Features (100 features)
        y_train: Labels (0 = no churn, 1 = churn)
        """
        X_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_scaled, y_train)
        joblib.dump(self.model, 'churn_model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')
    
    def predict(self, features: dict) -> dict:
        """
        Predice probabilidad de churn para un empleado
        """
        # Convertir features a array
        feature_array = self._dict_to_array(features)
        feature_scaled = self.scaler.transform([feature_array])
        
        # Predecir
        probability = self.model.predict_proba(feature_scaled)[0][1]
        prediction = self.model.predict(feature_scaled)[0]
        
        return {
            "churn_probability": probability,
            "will_churn": bool(prediction),
            "confidence": max(
                self.model.predict_proba(feature_scaled)[0]
            ),
        }
    
    def _dict_to_array(self, features: dict) -> list:
        """Convierte diccionario de features a array ordenado"""
        feature_names = [
            'fwi_score', 'debt_ratio', 'ewa_usage',
            'absence_rate', 'email_activity', 'slack_activity',
            'performance_score', 'task_completion', 'engagement_score',
            'tenure', 'salary_level', 'department_churn_rate',
            # ... más features
        ]
        return [features.get(name, 0) for name in feature_names]
```

### 3.2 Features para el Modelo

```python
def extract_features(employee_id: int) -> dict:
    """
    Extrae 100+ features para el modelo de predicción
    """
    
    features = {}
    
    # FINANCIAL FEATURES (15)
    features['fwi_score'] = get_fwi_score(employee_id)
    features['fwi_trend'] = calculate_fwi_trend(employee_id)
    features['debt_amount'] = get_debt_amount(employee_id)
    features['debt_ratio'] = get_debt_ratio(employee_id)
    features['ewa_usage_30d'] = count_ewa_usage(employee_id, 30)
    features['ewa_usage_90d'] = count_ewa_usage(employee_id, 90)
    features['savings_rate'] = get_savings_rate(employee_id)
    features['savings_trend'] = calculate_savings_trend(employee_id)
    features['gastos_hormiga'] = count_ant_expenses(employee_id)
    features['budget_exceeded_ratio'] = get_budget_exceeded_ratio(employee_id)
    features['financial_stress_score'] = calculate_stress_score(employee_id)
    features['income_stability'] = calculate_income_stability(employee_id)
    features['expense_volatility'] = calculate_expense_volatility(employee_id)
    features['emergency_fund'] = has_emergency_fund(employee_id)
    features['financial_health_score'] = get_health_score(employee_id)
    
    # BEHAVIORAL FEATURES (20)
    features['absence_30d'] = count_absences(employee_id, 30)
    features['absence_90d'] = count_absences(employee_id, 90)
    features['absence_trend'] = calculate_absence_trend(employee_id)
    features['absence_rate'] = get_absence_rate(employee_id)
    features['email_activity_30d'] = get_email_activity(employee_id, 30)
    features['email_activity_trend'] = calculate_email_trend(employee_id)
    features['slack_activity_30d'] = get_slack_activity(employee_id, 30)
    features['slack_activity_trend'] = calculate_slack_trend(employee_id)
    features['meeting_participation'] = get_meeting_participation(employee_id)
    features['meeting_trend'] = calculate_meeting_trend(employee_id)
    features['linkedin_activity'] = check_linkedin_activity(employee_id)
    features['cv_updates'] = count_cv_updates(employee_id)
    features['job_search_signals'] = count_job_search_signals(employee_id)
    features['communication_decline'] = calculate_communication_decline(employee_id)
    features['engagement_score'] = get_engagement_score(employee_id)
    features['engagement_trend'] = calculate_engagement_trend(employee_id)
    features['survey_sentiment'] = get_survey_sentiment(employee_id)
    features['feedback_sentiment'] = get_feedback_sentiment(employee_id)
    features['internal_mobility_interest'] = check_internal_mobility(employee_id)
    features['external_opportunity_signals'] = count_external_signals(employee_id)
    
    # LABORAL FEATURES (15)
    features['performance_score_recent'] = get_recent_performance(employee_id)
    features['performance_trend'] = calculate_performance_trend(employee_id)
    features['performance_volatility'] = calculate_performance_volatility(employee_id)
    features['task_completion_rate'] = get_task_completion_rate(employee_id)
    features['task_quality_score'] = get_task_quality(employee_id)
    features['projects_assigned'] = count_active_projects(employee_id)
    features['project_participation'] = get_project_participation(employee_id)
    features['project_leadership'] = count_led_projects(employee_id)
    features['manager_feedback_score'] = get_manager_feedback_score(employee_id)
    features['manager_feedback_trend'] = calculate_manager_feedback_trend(employee_id)
    features['peer_feedback_score'] = get_peer_feedback_score(employee_id)
    features['training_participation'] = count_trainings(employee_id)
    features['skill_development'] = measure_skill_development(employee_id)
    features['promotion_readiness'] = calculate_promotion_readiness(employee_id)
    features['role_satisfaction'] = get_role_satisfaction(employee_id)
    
    # CONTEXTUAL FEATURES (10)
    features['tenure_years'] = get_tenure_years(employee_id)
    features['tenure_in_role'] = get_tenure_in_role(employee_id)
    features['salary_level'] = get_salary_level(employee_id)
    features['salary_growth'] = calculate_salary_growth(employee_id)
    features['salary_vs_market'] = compare_salary_to_market(employee_id)
    features['department'] = encode_department(get_department(employee_id))
    features['department_churn_rate'] = get_department_churn_rate(employee_id)
    features['team_size'] = get_team_size(employee_id)
    features['manager_tenure'] = get_manager_tenure(employee_id)
    features['recent_life_events'] = count_life_events(employee_id)
    
    # DERIVED FEATURES (10)
    features['financial_behavioral_correlation'] = correlate_financial_behavioral(employee_id)
    features['stress_indicators'] = count_stress_indicators(employee_id)
    features['risk_factor_count'] = count_risk_factors(employee_id)
    features['positive_factor_count'] = count_positive_factors(employee_id)
    features['risk_factor_diversity'] = measure_risk_diversity(employee_id)
    features['recent_changes'] = count_recent_changes(employee_id)
    features['stability_score'] = calculate_stability_score(employee_id)
    features['satisfaction_proxy'] = estimate_satisfaction(employee_id)
    features['loyalty_indicators'] = count_loyalty_indicators(employee_id)
    features['growth_potential'] = estimate_growth_potential(employee_id)
    
    return features
```

---

## 4. ALERTAS Y NOTIFICACIONES

### 4.1 Tipos de Alertas

```python
ALERT_TYPES = {
    "CRITICAL_CHURN_RISK": {
        "severity": 5,
        "title": "⚠️ RIESGO CRÍTICO DE CHURN",
        "description": "Colaborador con alto riesgo de abandonar en próximos 30 días",
        "channels": ["email", "push", "sms"],
        "recipients": ["manager", "hr_director", "ceo"],
        "cooldown_hours": 24,
        "action_required": True,
    },
    "HIGH_CHURN_RISK": {
        "severity": 4,
        "title": "⚠️ RIESGO ALTO DE CHURN",
        "description": "Colaborador con riesgo moderado en próximos 60 días",
        "channels": ["email", "push"],
        "recipients": ["manager", "hr"],
        "cooldown_hours": 48,
        "action_required": True,
    },
    "MEDIUM_CHURN_RISK": {
        "severity": 3,
        "title": "📊 RIESGO MEDIO DE CHURN",
        "description": "Monitorear colaborador en próximos 90 días",
        "channels": ["email"],
        "recipients": ["manager"],
        "cooldown_hours": 72,
        "action_required": False,
    },
    "FINANCIAL_STRESS": {
        "severity": 3,
        "title": "💰 ESTRÉS FINANCIERO DETECTADO",
        "description": "Colaborador con problemas financieros que pueden afectar retención",
        "channels": ["email"],
        "recipients": ["hr"],
        "cooldown_hours": 168,
        "action_required": True,
    },
    "BEHAVIORAL_CHANGE": {
        "severity": 2,
        "title": "📈 CAMBIO DE COMPORTAMIENTO",
        "description": "Cambios detectados que podrían indicar insatisfacción",
        "channels": ["email"],
        "recipients": ["manager"],
        "cooldown_hours": 168,
        "action_required": False,
    },
}

def should_send_alert(alert_type: str, employee_id: int) -> bool:
    """Determina si se debe enviar alerta"""
    
    # Verificar preferencias de RH
    hr_prefs = get_hr_notification_preferences()
    if not hr_prefs.get(alert_type, {}).get('enabled', True):
        return False
    
    # Verificar cooldown
    last_alert = get_last_alert(employee_id, alert_type)
    cooldown = ALERT_TYPES[alert_type]['cooldown_hours']
    
    if last_alert and (now() - last_alert.sent_at).hours < cooldown:
        return False
    
    # Verificar frecuencia máxima
    alerts_today = count_alerts_today(employee_id)
    if alerts_today >= 3:  # Máximo 3 alertas por día
        return False
    
    return True

def send_alert(alert_type: str, employee_id: int, context: dict):
    """Envía alerta por múltiples canales"""
    
    if not should_send_alert(alert_type, employee_id):
        return
    
    alert_def = ALERT_TYPES[alert_type]
    employee = get_employee(employee_id)
    
    # Construir mensaje
    message = {
        "title": alert_def['title'],
        "body": alert_def['description'],
        "employee_name": employee.name,
        "employee_id": employee_id,
        "context": context,
        "action_required": alert_def['action_required'],
        "recommended_actions": get_recommended_actions(employee_id, alert_type),
    }
    
    # Enviar por canales
    for channel in alert_def['channels']:
        if channel == 'email':
            send_email_alert(alert_def['recipients'], message)
        elif channel == 'push':
            send_push_alert(alert_def['recipients'], message)
        elif channel == 'sms':
            send_sms_alert(alert_def['recipients'], message)
    
    # Guardar en BD
    save_alert(employee_id, alert_type, message)
```

---

## 5. RECOMENDACIONES DE ACCIONES

### 5.1 Motor de Recomendaciones

```python
def generate_recommendations(employee_id: int, risk_level: str) -> list:
    """
    Genera recomendaciones personalizadas basadas en riesgo
    """
    
    employee = get_employee(employee_id)
    risk_factors = get_top_risk_factors(employee_id)
    
    recommendations = []
    
    # Recomendaciones por nivel de riesgo
    if risk_level == "CRITICAL":
        recommendations.extend(generate_critical_actions(employee, risk_factors))
    elif risk_level == "HIGH":
        recommendations.extend(generate_high_actions(employee, risk_factors))
    elif risk_level == "MEDIUM":
        recommendations.extend(generate_medium_actions(employee, risk_factors))
    
    # Ordenar por impacto
    recommendations.sort(key=lambda r: r['impact_score'], reverse=True)
    
    return recommendations[:5]  # Top 5

def generate_critical_actions(employee: Employee, risk_factors: list) -> list:
    """Acciones para riesgo crítico (próximos 30 días)"""
    
    actions = []
    
    # Si es estrés financiero
    if 'financial_stress' in risk_factors:
        actions.append({
            "action": "Ofrecer préstamo corporativo",
            "impact_score": 95,
            "cost": 500,
            "expected_retention": 0.70,
            "timeline": "Inmediato",
            "owner": "HR",
            "description": "Préstamo de bajo interés para consolidar deuda",
        })
        actions.append({
            "action": "Sesión de asesoría financiera 1:1",
            "impact_score": 80,
            "cost": 200,
            "expected_retention": 0.60,
            "timeline": "Esta semana",
            "owner": "HR",
            "description": "Sesión con asesor financiero externo",
        })
    
    # Si es bajo desempeño
    if 'low_performance' in risk_factors:
        actions.append({
            "action": "Reunión con manager y plan de mejora",
            "impact_score": 85,
            "cost": 0,
            "expected_retention": 0.65,
            "timeline": "Inmediato",
            "owner": "Manager",
            "description": "Conversación abierta sobre desafíos y apoyo",
        })
    
    # Si es falta de oportunidades
    if 'no_growth_opportunity' in risk_factors:
        actions.append({
            "action": "Discusión sobre desarrollo de carrera",
            "impact_score": 90,
            "cost": 0,
            "expected_retention": 0.75,
            "timeline": "Esta semana",
            "owner": "Manager",
            "description": "Explorar nuevas oportunidades dentro de empresa",
        })
    
    # Acción universal para crítico
    actions.append({
        "action": "Check-in frecuente (semanal)",
        "impact_score": 70,
        "cost": 0,
        "expected_retention": 0.50,
        "timeline": "Inmediato",
        "owner": "Manager",
        "description": "Reuniones semanales para entender necesidades",
    })
    
    return actions

def generate_high_actions(employee: Employee, risk_factors: list) -> list:
    """Acciones para riesgo alto (próximos 60 días)"""
    
    actions = []
    
    # Educación financiera
    if 'financial_stress' in risk_factors:
        actions.append({
            "action": "Programa de educación financiera",
            "impact_score": 75,
            "cost": 300,
            "expected_retention": 0.65,
            "timeline": "Próximas 2 semanas",
            "owner": "HR",
            "description": "Workshops de presupuesto, ahorro, inversión",
        })
    
    # Beneficios personalizados
    actions.append({
        "action": "Revisión de paquete de beneficios",
        "impact_score": 70,
        "cost": 200,
        "expected_retention": 0.60,
        "timeline": "Próximas 2 semanas",
        "owner": "HR",
        "description": "Ajustar beneficios según perfil del empleado",
    })
    
    # Check-in regular
    actions.append({
        "action": "Check-in bi-semanal",
        "impact_score": 60,
        "cost": 0,
        "expected_retention": 0.45,
        "timeline": "Inmediato",
        "owner": "Manager",
        "description": "Reuniones cada dos semanas para monitoreo",
    })
    
    return actions

def generate_medium_actions(employee: Employee, risk_factors: list) -> list:
    """Acciones para riesgo medio (próximos 90 días)"""
    
    actions = []
    
    # Monitoreo
    actions.append({
        "action": "Monitoreo mensual",
        "impact_score": 50,
        "cost": 0,
        "expected_retention": 0.40,
        "timeline": "Mensual",
        "owner": "Manager",
        "description": "Check-in mensual para detectar cambios",
    })
    
    # Desarrollo
    actions.append({
        "action": "Plan de desarrollo profesional",
        "impact_score": 65,
        "cost": 500,
        "expected_retention": 0.55,
        "timeline": "Próximas 4 semanas",
        "owner": "Manager",
        "description": "Identificar habilidades a desarrollar",
    })
    
    return actions
```

---

## 6. DASHBOARD PARA MANAGERS

### 6.1 Vista de Equipo

```
TREEVÜ FOR MANAGERS - Team Churn Dashboard

┌─────────────────────────────────────────────────────────┐
│ TEAM CHURN OVERVIEW                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Total Headcount: 15                                     │
│ At-Risk Employees: 3 (20%)                              │
│ Estimated Churn (90 days): 1-2 personas                │
│ Estimated Cost: S/ 50,000 - 100,000                     │
│                                                         │
│ Risk Distribution:                                      │
│ ├─ Critical: 1 person (7%)                              │
│ ├─ High: 2 persons (13%)                                │
│ ├─ Medium: 4 persons (27%)                              │
│ └─ Low: 8 persons (53%)                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ AT-RISK TEAM MEMBERS (Acción Requerida)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. CRITICAL - Juan García (Ing. Senior)                │
│    ├─ Churn Risk: 82                                    │
│    ├─ Main Issue: Financial stress (FWI 32)            │
│    ├─ Recommended Action: Préstamo corporativo         │
│    ├─ Timeline: Inmediato                               │
│    └─ [Take Action] [More Info] [Dismiss]              │
│                                                         │
│ 2. HIGH - María López (Especialista)                   │
│    ├─ Churn Risk: 68                                    │
│    ├─ Main Issue: Low engagement + absences ↑          │
│    ├─ Recommended Action: Conversación 1:1             │
│    ├─ Timeline: Esta semana                             │
│    └─ [Take Action] [More Info] [Dismiss]              │
│                                                         │
│ 3. HIGH - Carlos Rodríguez (Técnico)                   │
│    ├─ Churn Risk: 65                                    │
│    ├─ Main Issue: No growth opportunity                │
│    ├─ Recommended Action: Discusión de carrera         │
│    ├─ Timeline: Esta semana                             │
│    └─ [Take Action] [More Info] [Dismiss]              │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TEAM HEALTH METRICS                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Average FWI Score: 52 (MEDIUM)                          │
│ Average Engagement: 58 (MEDIUM)                         │
│ Average Performance: 7.2/10 (GOOD)                      │
│ Absence Rate: 1.2 days/month (NORMAL)                   │
│ Financial Stress: 4 persons (27%)                       │
│                                                         │
│ Trend: ↓ (Declining over last 3 months)                │
│ Recommendation: Proactive intervention needed           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. CRON JOBS

### 7.1 Cálculo Diario de Churn Risk

```python
# server/cronJobs/churnCalculation.ts

export async function calculateChurnRiskForAllEmployees() {
  const employees = await db.getAllActiveEmployees();
  
  for (const employee of employees) {
    try {
      // Calcular churn risk
      const churnRisk = await calculateOverallChurnRisk(employee.id);
      
      // Guardar en BD
      await db.saveEmployeeChurnRisk(employee.id, churnRisk);
      
      // Generar alertas si es necesario
      if (churnRisk.risk_level === "CRITICAL") {
        await generateAlert("CRITICAL_CHURN_RISK", employee.id, churnRisk);
      } else if (churnRisk.risk_level === "HIGH") {
        await generateAlert("HIGH_CHURN_RISK", employee.id, churnRisk);
      }
      
      // Generar recomendaciones
      const recommendations = await generateRecommendations(
        employee.id,
        churnRisk.risk_level
      );
      await db.saveRecommendations(employee.id, recommendations);
      
    } catch (error) {
      logger.error(`Error calculating churn risk for employee ${employee.id}:`, error);
    }
  }
}

// Ejecutar diariamente a las 6 AM
schedule.scheduleJob('0 6 * * *', calculateChurnRiskForAllEmployees);

// Ejecutar cada hora para alertas críticas
schedule.scheduleJob('0 * * * *', async () => {
  const criticalRisks = await db.getCriticalChurnRisks();
  for (const risk of criticalRisks) {
    if (!risk.alertSentAt) {
      await sendAlert("CRITICAL_CHURN_RISK", risk.employeeId, risk);
    }
  }
});
```

---

## 8. MÉTRICAS Y MONITOREO

### 8.1 Métricas de Precisión del Modelo

```python
def evaluate_model_performance():
    """Evalúa precisión del modelo de predicción"""
    
    # Obtener predicciones vs realidad
    predictions = db.get_churn_predictions(last_90_days=True)
    actuals = db.get_actual_churn(last_90_days=True)
    
    # Calcular métricas
    true_positives = sum(1 for p in predictions if p.predicted and p.actual)
    false_positives = sum(1 for p in predictions if p.predicted and not p.actual)
    true_negatives = sum(1 for p in predictions if not p.predicted and not p.actual)
    false_negatives = sum(1 for p in predictions if not p.predicted and p.actual)
    
    precision = true_positives / (true_positives + false_positives)
    recall = true_positives / (true_positives + false_negatives)
    f1_score = 2 * (precision * recall) / (precision + recall)
    
    return {
        "precision": precision,  # De los que predijimos churn, cuántos realmente se fueron
        "recall": recall,        # De los que se fueron, cuántos predijimos
        "f1_score": f1_score,
        "true_positives": true_positives,
        "false_positives": false_positives,
        "false_negatives": false_negatives,
    }
```

---

Esta especificación proporciona la base técnica completa para implementar un sistema robusto de predicción de churn de talento.
