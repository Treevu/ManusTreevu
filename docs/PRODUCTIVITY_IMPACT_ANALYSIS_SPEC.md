# Especificación Técnica: Análisis de Impacto en Eficiencia y Productividad

## 1. MARCO CONCEPTUAL

### 1.1 Hipótesis Central

```
ESTRÉS FINANCIERO → BAJA PRODUCTIVIDAD → CHURN → PÉRDIDA FINANCIERA

Colaborador con FWI bajo:
├─ Distracción (50% del tiempo en problemas financieros)
├─ Estrés mental (cortisol ↑, focus ↓)
├─ Absentismo (salud mental)
├─ Errores (falta de concentración)
├─ Conflictos interpersonales (irritabilidad)
└─ Baja productividad (-30%)

TREEVÜ MIDE Y CUANTIFICA ESTO
```

### 1.2 Métricas de Productividad

```
Métrica Primaria: Productivity Index (0-100)
├─ Horas trabajadas efectivamente
├─ Tareas completadas
├─ Calidad de trabajo
├─ Participación en proyectos
└─ Feedback de manager

Métrica Secundaria: Efficiency Score
├─ Tareas por hora
├─ Errores por tarea
├─ Tiempo de entrega
├─ Rework rate
└─ Customer satisfaction

Métrica Terciaria: Team Impact
├─ Impacto en equipo
├─ Conflictos generados
├─ Conocimiento compartido
├─ Mentoring de juniors
└─ Colaboración
```

---

## 2. CÁLCULO DE PRODUCTIVIDAD

### 2.1 Productivity Index

```python
def calculate_productivity_index(employee_id: int, period: str = "month") -> float:
    """
    Calcula índice de productividad (0-100)
    Basado en múltiples dimensiones
    """
    
    # Obtener datos del período
    hours_worked = get_hours_worked(employee_id, period)
    tasks_completed = get_tasks_completed(employee_id, period)
    quality_score = get_quality_score(employee_id, period)
    project_participation = get_project_participation(employee_id, period)
    manager_feedback = get_manager_feedback_score(employee_id, period)
    
    # Normalizar a 0-100
    hours_index = min(100, (hours_worked / 160) * 100)  # 160 horas/mes esperadas
    
    tasks_index = calculate_task_index(tasks_completed, employee_id)
    
    quality_index = quality_score * 10  # 0-10 → 0-100
    
    participation_index = project_participation * 100
    
    feedback_index = manager_feedback * 10  # 0-10 → 0-100
    
    # Combinar con pesos
    productivity_index = (
        (hours_index * 0.20) +
        (tasks_index * 0.30) +
        (quality_index * 0.25) +
        (participation_index * 0.15) +
        (feedback_index * 0.10)
    )
    
    return round(productivity_index, 1)

def calculate_task_index(tasks_completed: int, employee_id: int) -> float:
    """Calcula índice de tareas completadas"""
    
    # Obtener baseline de tareas esperadas
    expected_tasks = get_expected_tasks(employee_id)
    
    # Calcular porcentaje
    task_completion_rate = (tasks_completed / expected_tasks) * 100
    
    # Normalizar (100% = 100 index, 50% = 50 index)
    return min(100, task_completion_rate)
```

### 2.2 Efficiency Score

```python
def calculate_efficiency_score(employee_id: int, period: str = "month") -> float:
    """
    Calcula eficiencia (0-100)
    Basado en velocidad y calidad
    """
    
    # Obtener métricas
    tasks_per_hour = get_tasks_per_hour(employee_id, period)
    error_rate = get_error_rate(employee_id, period)
    rework_rate = get_rework_rate(employee_id, period)
    on_time_delivery = get_on_time_delivery_rate(employee_id, period)
    
    # Normalizar
    speed_index = min(100, (tasks_per_hour / baseline_tasks_per_hour) * 100)
    
    quality_index = max(0, 100 - (error_rate * 10))  # Cada 10% error = -10 puntos
    
    rework_index = max(0, 100 - (rework_rate * 20))  # Cada 5% rework = -10 puntos
    
    delivery_index = on_time_delivery * 100
    
    # Combinar
    efficiency_score = (
        (speed_index * 0.25) +
        (quality_index * 0.35) +
        (rework_index * 0.25) +
        (delivery_index * 0.15)
    )
    
    return round(efficiency_score, 1)
```

---

## 3. CORRELACIÓN: SALUD FINANCIERA ↔ PRODUCTIVIDAD

### 3.1 Análisis de Correlación

```python
def analyze_financial_productivity_correlation(employee_id: int) -> dict:
    """
    Analiza correlación entre salud financiera y productividad
    """
    
    # Obtener histórico (últimos 6 meses)
    financial_history = get_financial_history(employee_id, months=6)
    productivity_history = get_productivity_history(employee_id, months=6)
    
    # Calcular correlación de Pearson
    fwi_scores = [h['fwi_score'] for h in financial_history]
    productivity_scores = [h['productivity_index'] for h in productivity_history]
    
    correlation = calculate_pearson_correlation(fwi_scores, productivity_scores)
    
    # Análisis de causalidad
    # Si FWI baja → Productividad baja (con lag de 1-2 semanas)
    
    lag_correlations = {}
    for lag in [0, 1, 2, 3, 4]:  # 0-4 semanas de lag
        lagged_fwi = fwi_scores[lag:]
        lagged_productivity = productivity_scores[:-lag] if lag > 0 else productivity_scores
        
        lag_corr = calculate_pearson_correlation(lagged_fwi, lagged_productivity)
        lag_correlations[f"lag_{lag}w"] = lag_corr
    
    # Encontrar lag óptimo
    best_lag = max(lag_correlations, key=lag_correlations.get)
    best_correlation = lag_correlations[best_lag]
    
    return {
        "overall_correlation": correlation,
        "best_lag": best_lag,
        "best_correlation": best_correlation,
        "interpretation": interpret_correlation(best_correlation),
        "estimated_impact": estimate_productivity_impact(best_correlation),
    }

def interpret_correlation(correlation: float) -> str:
    """Interpreta el valor de correlación"""
    
    if correlation >= 0.7:
        return "Muy fuerte: Cambios en FWI predicen cambios en productividad"
    elif correlation >= 0.5:
        return "Fuerte: Correlación clara entre FWI y productividad"
    elif correlation >= 0.3:
        return "Moderada: Existe relación pero con otros factores"
    else:
        return "Débil: Otros factores más importantes que FWI"

def estimate_productivity_impact(correlation: float) -> dict:
    """Estima impacto en productividad por cambio en FWI"""
    
    # Basado en correlación
    # Si correlación = 0.75, cada punto de FWI = 0.75% productividad
    
    impact_per_fwi_point = correlation
    
    return {
        "impact_per_fwi_point": impact_per_fwi_point,
        "impact_for_10_point_improvement": impact_per_fwi_point * 10,
        "impact_for_20_point_improvement": impact_per_fwi_point * 20,
        "estimated_hours_recovered_per_month": (impact_per_fwi_point * 10 / 100) * 160,
    }
```

### 3.2 Segmentación por FWI Score

```python
def segment_employees_by_financial_health() -> dict:
    """
    Segmenta empleados por salud financiera
    y analiza productividad por segmento
    """
    
    all_employees = get_all_active_employees()
    
    segments = {
        "critical": [],      # FWI < 30
        "low": [],           # FWI 30-50
        "medium": [],        # FWI 50-70
        "high": [],          # FWI 70-90
        "excellent": [],     # FWI > 90
    }
    
    # Segmentar
    for employee in all_employees:
        fwi = get_fwi_score(employee.id)
        
        if fwi < 30:
            segments["critical"].append(employee)
        elif fwi < 50:
            segments["low"].append(employee)
        elif fwi < 70:
            segments["medium"].append(employee)
        elif fwi < 90:
            segments["high"].append(employee)
        else:
            segments["excellent"].append(employee)
    
    # Analizar productividad por segmento
    analysis = {}
    for segment_name, employees in segments.items():
        if not employees:
            continue
        
        productivity_scores = [
            calculate_productivity_index(e.id) for e in employees
        ]
        
        analysis[segment_name] = {
            "count": len(employees),
            "avg_productivity": sum(productivity_scores) / len(productivity_scores),
            "min_productivity": min(productivity_scores),
            "max_productivity": max(productivity_scores),
            "std_dev": calculate_std_dev(productivity_scores),
            "avg_absence_rate": calculate_avg_absence_rate(employees),
            "avg_error_rate": calculate_avg_error_rate(employees),
            "avg_churn_risk": calculate_avg_churn_risk(employees),
        }
    
    return analysis
```

---

## 4. CÁLCULO DE PÉRDIDA FINANCIERA

### 4.1 Pérdida por Baja Productividad

```python
def calculate_productivity_loss(employee_id: int, period: str = "month") -> dict:
    """
    Calcula pérdida financiera por baja productividad
    """
    
    # Obtener datos
    employee = get_employee(employee_id)
    monthly_salary = employee.salary
    productivity_index = calculate_productivity_index(employee_id, period)
    expected_productivity = 85  # Baseline esperado
    
    # Calcular pérdida
    productivity_loss_percent = max(0, (expected_productivity - productivity_index) / 100)
    
    monthly_loss = monthly_salary * productivity_loss_percent
    
    # Proyectar anual
    annual_loss = monthly_loss * 12
    
    # Desglose por causa (si es conocida)
    fwi_score = get_fwi_score(employee_id)
    absence_rate = get_absence_rate(employee_id)
    engagement_score = get_engagement_score(employee_id)
    
    # Estimar contribución de cada factor
    fwi_contribution = estimate_fwi_contribution(fwi_score, productivity_loss_percent)
    absence_contribution = estimate_absence_contribution(absence_rate, productivity_loss_percent)
    engagement_contribution = estimate_engagement_contribution(engagement_score, productivity_loss_percent)
    
    return {
        "monthly_loss": round(monthly_loss, 2),
        "annual_loss": round(annual_loss, 2),
        "productivity_loss_percent": round(productivity_loss_percent * 100, 1),
        "loss_by_cause": {
            "financial_stress": round(monthly_loss * fwi_contribution, 2),
            "absenteeism": round(monthly_loss * absence_contribution, 2),
            "low_engagement": round(monthly_loss * engagement_contribution, 2),
        },
    }

def estimate_fwi_contribution(fwi_score: int, total_loss: float) -> float:
    """Estima qué porcentaje de pérdida es por estrés financiero"""
    
    # Basado en correlación y literatura
    # FWI bajo = 40% de impacto en productividad
    
    if fwi_score < 30:
        return 0.40
    elif fwi_score < 50:
        return 0.25
    elif fwi_score < 70:
        return 0.10
    else:
        return 0.05
```

### 4.2 Pérdida por Absentismo

```python
def calculate_absenteeism_loss(employee_id: int, period: str = "month") -> dict:
    """
    Calcula pérdida por ausencias
    """
    
    employee = get_employee(employee_id)
    monthly_salary = employee.salary
    
    # Obtener ausencias
    absence_days = get_absence_days(employee_id, period)
    expected_work_days = 20  # Promedio mensual
    
    # Calcular pérdida
    loss_percent = absence_days / expected_work_days
    monthly_loss = monthly_salary * loss_percent
    annual_loss = monthly_loss * 12
    
    # Obtener causa de ausencias (si es disponible)
    absence_reasons = get_absence_reasons(employee_id, period)
    
    return {
        "absence_days": absence_days,
        "monthly_loss": round(monthly_loss, 2),
        "annual_loss": round(annual_loss, 2),
        "loss_percent": round(loss_percent * 100, 1),
        "reasons": absence_reasons,
    }
```

### 4.3 Pérdida por Errores y Rework

```python
def calculate_error_loss(employee_id: int, period: str = "month") -> dict:
    """
    Calcula pérdida por errores y rework
    """
    
    employee = get_employee(employee_id)
    
    # Obtener métricas
    error_count = get_error_count(employee_id, period)
    rework_hours = get_rework_hours(employee_id, period)
    
    # Costo por error (estimado)
    cost_per_error = estimate_cost_per_error(employee.department)
    
    # Costo de rework
    hourly_rate = employee.salary / 160  # Horas mensuales
    rework_cost = rework_hours * hourly_rate
    
    # Total
    error_cost = error_count * cost_per_error
    total_loss = error_cost + rework_cost
    
    return {
        "error_count": error_count,
        "error_cost": round(error_cost, 2),
        "rework_hours": rework_hours,
        "rework_cost": round(rework_cost, 2),
        "total_loss": round(total_loss, 2),
    }
```

---

## 5. DASHBOARD DE IMPACTO

### 5.1 Vista Ejecutiva

```
TREEVÜ FOR EXECUTIVES - Productivity Impact Dashboard

┌─────────────────────────────────────────────────────────┐
│ PRODUCTIVITY IMPACT SUMMARY                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Total Headcount: 500                                    │
│ Average Productivity Index: 78%                          │
│ Target Productivity: 85%                                 │
│ Gap: -7%                                                │
│                                                         │
│ ESTIMATED ANNUAL LOSS: S/ 2,100,000                     │
│ ├─ Low Productivity: S/ 1,200,000 (57%)                │
│ ├─ Absenteeism: S/ 600,000 (29%)                       │
│ └─ Errors & Rework: S/ 300,000 (14%)                   │
│                                                         │
│ POTENTIAL RECOVERY (with intervention):                │
│ ├─ Improve FWI: S/ 500,000 (24%)                       │
│ ├─ Reduce absence: S/ 300,000 (14%)                    │
│ └─ Improve engagement: S/ 400,000 (19%)                │
│ └─ TOTAL POTENTIAL: S/ 1,200,000 (57%)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PRODUCTIVITY BY FINANCIAL HEALTH                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ FWI < 30 (Critical):                                    │
│ ├─ Count: 45 employees (9%)                             │
│ ├─ Avg Productivity: 65%                                │
│ ├─ Avg Loss/Employee: S/ 4,200/month                    │
│ └─ Total Loss: S/ 189,000/month                         │
│                                                         │
│ FWI 30-50 (Low):                                        │
│ ├─ Count: 120 employees (24%)                           │
│ ├─ Avg Productivity: 75%                                │
│ ├─ Avg Loss/Employee: S/ 2,500/month                    │
│ └─ Total Loss: S/ 300,000/month                         │
│                                                         │
│ FWI 50-70 (Medium):                                     │
│ ├─ Count: 200 employees (40%)                           │
│ ├─ Avg Productivity: 82%                                │
│ ├─ Avg Loss/Employee: S/ 1,200/month                    │
│ └─ Total Loss: S/ 240,000/month                         │
│                                                         │
│ FWI 70-90 (High):                                       │
│ ├─ Count: 100 employees (20%)                           │
│ ├─ Avg Productivity: 90%                                │
│ ├─ Avg Loss/Employee: S/ 400/month                      │
│ └─ Total Loss: S/ 40,000/month                          │
│                                                         │
│ FWI > 90 (Excellent):                                   │
│ ├─ Count: 35 employees (7%)                             │
│ ├─ Avg Productivity: 96%                                │
│ ├─ Avg Loss/Employee: S/ 100/month                      │
│ └─ Total Loss: S/ 3,500/month                           │
│                                                         │
│ TOTAL MONTHLY LOSS: S/ 772,500                          │
│ ANNUAL LOSS: S/ 9,270,000                               │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ IMPACT OF INTERVENTION SCENARIOS                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Scenario 1: Improve Critical (FWI < 30) to Medium      │
│ ├─ Cost: S/ 500,000 (beneficios + educación)           │
│ ├─ Productivity Gain: 65% → 82% (+17%)                 │
│ ├─ Annual Benefit: S/ 189,000 × 0.17 × 12 = S/ 385,000│
│ └─ ROI: 0.77x (Año 1), 2.3x (Año 2+)                   │
│                                                         │
│ Scenario 2: Improve Low (FWI 30-50) to Medium          │
│ ├─ Cost: S/ 300,000                                     │
│ ├─ Productivity Gain: 75% → 82% (+7%)                  │
│ ├─ Annual Benefit: S/ 300,000 × 0.07 × 12 = S/ 252,000│
│ └─ ROI: 0.84x (Año 1), 2.5x (Año 2+)                   │
│                                                         │
│ Scenario 3: Comprehensive Program (All segments)       │
│ ├─ Cost: S/ 1,200,000                                   │
│ ├─ Avg Productivity Gain: 78% → 84% (+6%)              │
│ ├─ Annual Benefit: S/ 2,100,000 × 0.06 × 12 = S/ 1,512,000
│ └─ ROI: 1.26x (Año 1), 3.8x (Año 2+)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Vista por Departamento

```
DEPARTMENTAL PRODUCTIVITY ANALYSIS

Department: Sales (50 employees)
├─ Avg Productivity: 72%
├─ Avg FWI Score: 38
├─ Avg Churn Risk: 68
├─ Monthly Loss: S/ 150,000
├─ Potential Recovery: S/ 90,000 (60%)
└─ Recommendation: HIGH PRIORITY

Department: Engineering (80 employees)
├─ Avg Productivity: 85%
├─ Avg FWI Score: 62
├─ Avg Churn Risk: 35
├─ Monthly Loss: S/ 80,000
├─ Potential Recovery: S/ 32,000 (40%)
└─ Recommendation: MEDIUM PRIORITY

Department: Operations (100 employees)
├─ Avg Productivity: 78%
├─ Avg FWI Score: 48
├─ Avg Churn Risk: 52
├─ Monthly Loss: S/ 220,000
├─ Potential Recovery: S/ 110,000 (50%)
└─ Recommendation: HIGH PRIORITY

Department: HR (30 employees)
├─ Avg Productivity: 82%
├─ Avg FWI Score: 58
├─ Avg Churn Risk: 40
├─ Monthly Loss: S/ 60,000
├─ Potential Recovery: S/ 24,000 (40%)
└─ Recommendation: MEDIUM PRIORITY

Department: Finance (40 employees)
├─ Avg Productivity: 88%
├─ Avg FWI Score: 68
├─ Avg Churn Risk: 28
├─ Monthly Loss: S/ 40,000
├─ Potential Recovery: S/ 12,000 (30%)
└─ Recommendation: LOW PRIORITY
```

---

## 6. MODELOS DE DATOS

### 6.1 Tabla: employee_productivity_metrics

```sql
CREATE TABLE employee_productivity_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL,
  
  -- Período
  metricDate DATE,
  metricMonth VARCHAR(7), -- YYYY-MM
  
  -- Métricas de Productividad
  hoursWorked FLOAT,
  tasksCompleted INT,
  tasksExpected INT,
  taskCompletionRate FLOAT,
  qualityScore FLOAT, -- 0-10
  
  -- Eficiencia
  tasksPerHour FLOAT,
  errorCount INT,
  errorRate FLOAT,
  reworkHours FLOAT,
  reworkRate FLOAT,
  onTimeDeliveryRate FLOAT,
  
  -- Índices
  productivityIndex FLOAT, -- 0-100
  efficiencyScore FLOAT, -- 0-100
  
  -- Correlaciones
  fwiScore INT,
  absenceRate FLOAT,
  engagementScore FLOAT,
  
  -- Pérdidas Estimadas
  estimatedProductivityLoss DECIMAL(10,2),
  estimatedAbsenteeismLoss DECIMAL(10,2),
  estimatedErrorLoss DECIMAL(10,2),
  totalMonthlyLoss DECIMAL(10,2),
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employeeId) REFERENCES employees(id),
  INDEX idx_employeeId_date (employeeId, metricDate),
  INDEX idx_productivityIndex (productivityIndex)
);
```

### 6.2 Tabla: productivity_impact_analysis

```sql
CREATE TABLE productivity_impact_analysis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Período de análisis
  analysisMonth VARCHAR(7), -- YYYY-MM
  
  -- Agregados
  totalEmployees INT,
  avgProductivityIndex FLOAT,
  avgEfficiencyScore FLOAT,
  
  -- Pérdidas Totales
  totalMonthlyLoss DECIMAL(12,2),
  totalAnnualLoss DECIMAL(12,2),
  
  -- Desglose por Causa
  lossFromProductivity DECIMAL(12,2),
  lossFromAbsenteeism DECIMAL(12,2),
  lossFromErrors DECIMAL(12,2),
  
  -- Análisis por Segmento
  segmentAnalysis JSON, -- {critical: {...}, low: {...}, ...}
  
  -- Análisis por Departamento
  departmentAnalysis JSON,
  
  -- Correlaciones
  fwiProductivityCorrelation FLOAT,
  absenceProductivityCorrelation FLOAT,
  engagementProductivityCorrelation FLOAT,
  
  -- Escenarios de Intervención
  interventionScenarios JSON,
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_analysisMonth (analysisMonth)
);
```

---

## 7. CRON JOBS

```python
# server/cronJobs/productivityAnalysis.ts

export async function calculateProductivityMetrics() {
  const employees = await db.getAllActiveEmployees();
  
  for (const employee of employees) {
    try {
      // Calcular índices
      const productivityIndex = await calculateProductivityIndex(employee.id);
      const efficiencyScore = await calculateEfficiencyScore(employee.id);
      
      // Calcular pérdidas
      const productivityLoss = await calculateProductivityLoss(employee.id);
      const absenteeismLoss = await calculateAbsenteeismLoss(employee.id);
      const errorLoss = await calculateErrorLoss(employee.id);
      
      // Guardar
      await db.saveProductivityMetrics(employee.id, {
        productivityIndex,
        efficiencyScore,
        productivityLoss: productivityLoss.monthly_loss,
        absenteeismLoss: absenteeismLoss.monthly_loss,
        errorLoss: errorLoss.total_loss,
        totalLoss: productivityLoss.monthly_loss + absenteeismLoss.monthly_loss + errorLoss.total_loss,
      });
      
    } catch (error) {
      logger.error(`Error calculating productivity for employee ${employee.id}:`, error);
    }
  }
}

// Ejecutar mensualmente el 1 a las 6 AM
schedule.scheduleJob('0 6 1 * *', calculateProductivityMetrics);

// Ejecutar análisis agregado mensualmente
export async function generateProductivityImpactAnalysis() {
  const month = getCurrentMonth();
  
  // Obtener datos
  const metrics = await db.getProductivityMetrics(month);
  const employees = await db.getAllActiveEmployees();
  
  // Análisis por segmento
  const segmentAnalysis = await analyzeByFinancialHealth(metrics);
  
  // Análisis por departamento
  const departmentAnalysis = await analyzeByDepartment(metrics);
  
  // Correlaciones
  const fwiCorrelation = await calculateCorrelation('fwi', 'productivity');
  const absenceCorrelation = await calculateCorrelation('absence', 'productivity');
  const engagementCorrelation = await calculateCorrelation('engagement', 'productivity');
  
  // Escenarios
  const scenarios = await generateInterventionScenarios(metrics);
  
  // Guardar análisis
  await db.saveProductivityImpactAnalysis({
    analysisMonth: month,
    totalEmployees: employees.length,
    avgProductivityIndex: calculateAverage(metrics.map(m => m.productivityIndex)),
    avgEfficiencyScore: calculateAverage(metrics.map(m => m.efficiencyScore)),
    totalMonthlyLoss: sum(metrics.map(m => m.totalLoss)),
    segmentAnalysis,
    departmentAnalysis,
    fwiProductivityCorrelation: fwiCorrelation,
    absenceProductivityCorrelation: absenceCorrelation,
    engagementProductivityCorrelation: engagementCorrelation,
    interventionScenarios: scenarios,
  });
}

// Ejecutar análisis el 5 de cada mes
schedule.scheduleJob('0 7 5 * *', generateProductivityImpactAnalysis);
```

---

Esta especificación proporciona la base técnica para medir y analizar el impacto de la salud financiera en la productividad y eficiencia organizacional.
