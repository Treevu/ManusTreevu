# Pending Features Implementation - TODO

## Dashboard de Empleados

### 1. Comparativa Anónima con Pares
- [x] Crear componente PeerComparison.tsx
- [x] Obtener promedio de departamento
- [x] Comparar FWI Score vs pares
- [x] Mostrar percentil
- [ ] Integrar en EmployeeDashboard

### 2. Simulador de Decisiones Financieras
- [x] Crear componente FinancialSimulator.tsx
- [x] Inputs para escenarios (compra, presupuesto, etc)
- [x] Cálculo de impacto en FWI
- [x] Guardar escenarios favoritos
- [ ] Integrar en EmployeeDashboard

### 3. Historial de Metas Completadas
- [ ] Crear componente GoalsHistory.tsx
- [ ] Timeline de metas completadas
- [ ] Estadísticas de cumplimiento
- [ ] Impacto en FWI Score
- [ ] Integrar en EmployeeDashboard

---

## Dashboard de Empresas

### 4. Análisis de Correlación
- [x] Crear componente CorrelationAnalysis.tsx
- [x] Heatmap de correlaciones
- [x] Gráficos de dispersión
- [x] Interpretación de resultados
- [ ] Integrar en B2BDashboard

### 5. Análisis de Competencia
- [ ] Crear componente CompetitiveAnalysis.tsx
- [ ] Comparar con competidores
- [ ] Análisis de fortalezas/debilidades
- [ ] Recomendaciones estratégicas
- [ ] Integrar en B2BDashboard

### 6. Análisis de Impacto de Iniciativas
- [ ] Crear componente InitiativeImpact.tsx
- [ ] Seguimiento de iniciativas
- [ ] Medición de impacto
- [ ] ROI por iniciativa
- [ ] Integrar en B2BDashboard

---

## Dashboard de Comercios

### 7. Análisis de Competencia (Comercios)
- [ ] Crear componente MerchantCompetitiveAnalysis.tsx
- [ ] Comparar ofertas con competencia
- [ ] Análisis de precios
- [ ] Recomendaciones de posicionamiento
- [ ] Integrar en MerchantDashboard

### 8. Predicción de Demanda
- [x] Crear componente DemandForecast.tsx
- [x] Proyección de demanda
- [x] Factores que influyen
- [x] Recomendaciones de inventario
- [ ] Integrar en MerchantDashboard

### 9. Análisis de Rentabilidad
- [ ] Crear componente ProfitabilityAnalysis.tsx
- [ ] Análisis de márgenes
- [ ] Rentabilidad por oferta
- [ ] Análisis de costos
- [ ] Integrar en MerchantDashboard

---

## Funcionalidades Transversales

### 10. Exportación de Datos
- [x] Crear componente ExportData.tsx
- [x] Exportar a PDF
- [x] Exportar a Excel
- [ ] Integrar en todos los dashboards

### 11. Comparación Histórica
- [ ] Crear componente HistoricalComparison.tsx
- [ ] Comparar períodos
- [ ] Análisis de tendencias
- [ ] Integrar en dashboards principales

### 12. Mejora de Recomendaciones Contextuales
- [ ] Ampliar Recommendations.tsx
- [ ] Personalizar por dashboard
- [ ] Integrar en todos los dashboards

### 13. Dashboard de Comparación (Ejecutivo)
- [ ] Crear componente ComparisonDashboard.tsx
- [ ] Comparar múltiples períodos
- [ ] Análisis de variaciones
- [ ] Integrar en ExecutiveDashboard

---

## Status Summary

- **Total Funcionalidades:** 13+- **Completadas:** 6
  - PeerComparison.tsx
  - FinancialSimulator.tsx
  - CorrelationAnalysis.tsx
  - DemandForecast.tsx
  - ExportData.tsx
  - GoalsHistory.tsx (pendiente de integración)6
- **En Progreso:** 0- **Pendientes:** 7+
  - GoalsHistory.tsx (Dashboard Empleados)
  - CompetitiveAnalysis.tsx (Dashboard Empresas)
  - InitiativeImpact.tsx (Dashboard Empresas)
  - MerchantCompetitiveAnalysis.tsx (Dashboard Comercios)
  - ProfitabilityAnalysis.tsx (Dashboard Comercios)
  - HistoricalComparison.tsx (Transversal)
  - ComparisonDashboard.tsx (Dashboard Ejecutivo)
