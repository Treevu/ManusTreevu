# Next Implementation Steps - TODO

## Fase 1: Gamificación de Dispersión

- [ ] Crear componente DispersionGamification.tsx
  - [ ] Badge "Debt-Free Champion" (30+ días sin deuda)
  - [ ] Badge "Dispersión Master" (5+ dispersiones exitosas)
  - [ ] Badge "Savings Hero" ($1000+ ahorrados)
  - [ ] Leaderboard de empleados por ahorros
  - [ ] Points bonus para cada dispersión (10 TreePoints)
  - [ ] Tier system: Bronze → Silver → Gold → Platinum

- [ ] Integrar en EmployeeDashboard
  - [ ] Mostrar badges ganados
  - [ ] Mostrar posición en leaderboard
  - [ ] Mostrar puntos ganados por dispersión

## Fase 2: Alertas de Riesgo de Deuda

- [ ] Crear componente DebtRiskAlerts.tsx
  - [ ] Monitoreo de FWI Score tendencia
  - [ ] Alerta cuando FWI Score baja 10+ puntos
  - [ ] Sugerencias de dispersión automáticas
  - [ ] Recomendaciones personalizadas

- [ ] Crear servicio de alertas (DebtRiskAlertService.ts)
  - [ ] Lógica de detección de riesgo
  - [ ] Notificaciones push
  - [ ] Email alerts

- [ ] Integrar en EmployeeDashboard
  - [ ] Widget de alerta prominente
  - [ ] Acciones rápidas para dispersión

## Fase 3: Análisis de ROI de Programas

- [ ] Crear componente ProgramROIAnalysis.tsx
  - [ ] Impacto en retención (%)
  - [ ] Impacto en productividad (%)
  - [ ] Ahorros totales generados ($)
  - [ ] ROI del programa (%)
  - [ ] Payback period (meses)
  - [ ] Proyección a 12 meses

- [ ] Crear servicio de análisis (ProgramROIService.ts)
  - [ ] Cálculo de ROI
  - [ ] Análisis de impacto
  - [ ] Proyecciones

- [ ] Integrar en ExecutiveDashboard
  - [ ] Dashboard ejecutivo con ROI
  - [ ] Comparativa vs otros programas
  - [ ] Recomendaciones de presupuesto

## Status Summary

- **Total Tareas:** 20+
- **Completadas:** 0
- **En Progreso:** 0
- **Pendientes:** 20+
