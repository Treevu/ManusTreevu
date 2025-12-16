# Análisis de Enriquecimiento de Propuesta de Valor para Colaboradores

## Resumen Ejecutivo

Este documento analiza oportunidades para enriquecer significativamente la propuesta de valor de Treevü para colaboradores, enfocándose en tres áreas clave:

1. **Insights Avanzados** - Análisis predictivo y recomendaciones personalizadas
2. **Detección de Patrones Nocivos** - Identificación automática de comportamientos financieros peligrosos
3. **OCR para Registro de Gastos** - Captura automática de recibos y facturas

---

## 1. ANÁLISIS DE ESTADO ACTUAL

### Funcionalidades Existentes del Colaborador

**Dashboard Actual:**
- FWI Score (0-100) con 5 factores
- Registro manual de gastos (texto o formulario)
- Análisis de patrones de gasto (histórico)
- Detección de gastos hormiga
- Metas financieras
- TreePoints y recompensas
- EWA (Early Wage Access)
- Asesor IA (Treevü Brain)

**Gaps Identificados:**

| Área | Gap | Impacto | Prioridad |
|------|-----|--------|-----------|
| Insights | Sin predicciones de comportamiento futuro | Colaborador no sabe qué esperar | Alta |
| Insights | Sin recomendaciones contextuales automáticas | Requiere acción manual del usuario | Alta |
| Patrones | Sin alertas de comportamientos de riesgo | Detecta problemas demasiado tarde | Alta |
| Patrones | Sin análisis de causalidad de gastos | No entiende por qué gasta | Media |
| Captura | Registro manual es friccionante (70% abandono) | Bajo engagement | Alta |
| Captura | Sin OCR para recibos/facturas | Experiencia pobre vs competencia | Alta |
| Análisis | Sin segmentación de gastos por contexto | Análisis superficial | Media |
| Análisis | Sin comparación con pares anónimos | Falta perspectiva | Media |

---

## 2. OPORTUNIDADES DE INSIGHTS AVANZADOS

### 2.1 Predicción de Comportamiento Financiero

**Descripción:** Usar ML para predecir comportamiento futuro del usuario basado en histórico

**Implementación:**

```
Modelo: Gradient Boosting (XGBoost/LightGBM)
Features:
  - Histórico de gastos (últimos 90 días)
  - Patrones estacionales (día de semana, mes)
  - FWI Score histórico
  - Cambios en ingresos
  - Eventos (fin de mes, fines de semana)

Predicciones:
  1. Gasto esperado próximos 7 días (±15% accuracy)
  2. Riesgo de exceder presupuesto (0-100%)
  3. Probabilidad de usar EWA (0-100%)
  4. Tendencia de FWI Score (↑/→/↓)
```

**Casos de Uso:**
- "Basado en tu patrón, gastarás ~S/ 450 esta semana"
- "Riesgo 78% de exceder tu presupuesto - ¿necesitas ayuda?"
- "Tu FWI Score bajará a 42 si continúas con este ritmo"

**Impacto:** +25% engagement, +15% retención

---

### 2.2 Recomendaciones Contextuales Automáticas

**Descripción:** Sistema de recomendaciones inteligentes basadas en contexto actual

**Tipos de Recomendaciones:**

```
1. PREVENCIÓN (Proactivo)
   - "Detectamos 3 gastos hormiga nuevos esta semana"
   - "Tu categoría 'Entretenimiento' está 40% arriba del promedio"
   - "Ahorraste S/ 200 reduciendo delivery - continúa así"

2. OPORTUNIDAD (Optimización)
   - "Podrías ahorrar S/ 150/mes cancelando suscripción inactiva"
   - "Cambiar de operador móvil te ahorraría S/ 45/mes"
   - "Comprar en bulk te ahorraría 20% en alimentos"

3. ACCIÓN (Urgente)
   - "Tu FWI bajó 12 puntos - necesitas actuar"
   - "Riesgo alto de usar EWA en 5 días - ajusta gastos"
   - "Deuda acumulada alcanzó S/ 2,500 - es momento de pagar"

4. CELEBRACIÓN (Motivación)
   - "¡Lograste 15 días sin gastos hormiga!"
   - "Tu FWI mejoró 8 puntos este mes - ¡sigue así!"
   - "Ahorraste S/ 1,200 en 30 días - ¡increíble!"
```

**Algoritmo de Priorización:**

```
Score = (Impacto_Financiero × 0.4) + 
        (Probabilidad_Éxito × 0.3) + 
        (Urgencia × 0.2) + 
        (Relevancia_Usuario × 0.1)

Mostrar top 3 recomendaciones por día
```

**Impacto:** +30% acciones correctivas, +40% ahorro promedio

---

### 2.3 Dashboard de Insights Personalizados

**Secciones:**

```
1. RESUMEN DE SALUD FINANCIERA
   ├─ FWI Score con tendencia (7 días)
   ├─ Métrica de "Salud": Excelente/Buena/Regular/Crítica
   ├─ Cambio vs semana anterior (%)
   └─ Próximas acciones recomendadas (3 items)

2. PREDICCIONES
   ├─ Gasto esperado próximos 7 días
   ├─ Riesgo de exceder presupuesto
   ├─ Proyección de FWI Score (fin de mes)
   └─ Probabilidad de necesitar EWA

3. OPORTUNIDADES DE AHORRO
   ├─ Gastos hormiga detectados
   ├─ Suscripciones inactivas
   ├─ Categorías sobre presupuesto
   └─ Potencial de ahorro mensual (S/)

4. ANÁLISIS COMPARATIVO
   ├─ Tu gasto vs promedio (anónimo)
   ├─ Tu FWI vs percentil de pares
   ├─ Categorías donde ahorras más
   └─ Categorías donde gastas más

5. METAS Y PROGRESO
   ├─ Metas activas con % completado
   ├─ Velocidad de progreso
   ├─ Proyección de fecha de logro
   └─ Recomendaciones para acelerar
```

**Impacto:** +50% visualización de datos, +35% comprensión de situación

---

## 3. DETECCIÓN DE PATRONES NOCIVOS

### 3.1 Patrones de Riesgo Identificables

**Matriz de Patrones Nocivos:**

```
PATRÓN                          | INDICADORES                    | RIESGO | ACCIÓN
--------------------------------|--------------------------------|--------|------------------
Espiral de Deuda               | Gastos > ingresos 3+ meses     | Crítico| Alerta + Plan
Dependencia de EWA             | EWA 3+ veces/mes               | Alto   | Intervención
Gasto Impulsivo                | Varianza >60% semana a semana  | Alto   | Educación
Consumo Compulsivo             | Mismo merchant 10+ veces/mes   | Medio  | Recomendación
Negligencia Financiera         | Sin registro 2+ semanas        | Medio  | Recordatorio
Sobre-endeudamiento            | Deuda > 50% ingresos anuales   | Crítico| Alerta urgente
Ciclo de Pobreza               | Gastos esenciales > 80%        | Alto   | Recursos
Adicción a Suscripciones       | 8+ suscripciones activas       | Medio  | Auditoría
Gasto Emocional                | Picos después de eventos       | Medio  | Mindfulness
Falta de Fondo Emergencia      | Ahorros < 1 mes gastos         | Alto   | Plan de ahorro
```

---

### 3.2 Sistema de Alertas Inteligentes

**Niveles de Alerta:**

```
NIVEL    | COLOR | TRIGGER                        | ACCIÓN
---------|-------|--------------------------------|------------------
CRÍTICO  | Rojo  | Deuda > 50% ingresos           | Notificación inmediata
         |       | Gastos > ingresos 3 meses      | Bloqueo de EWA
         |       | FWI < 20                       | Llamada de soporte
         |       |                                |
ALTO     | Ámbar | Gasto impulsivo detectado      | Notificación + Plan
         |       | EWA 3+ veces/mes               | Intervención
         |       | FWI bajó >15 puntos            | Recomendación
         |       |                                |
MEDIO    | Azul  | Gastos hormiga nuevos          | Sugerencia
         |       | Categoría sobre presupuesto    | Recomendación
         |       | Suscripción inactiva           | Notificación
         |       |                                |
BAJO     | Verde | Buen progreso en metas         | Celebración
         |       | FWI mejoró                     | Motivación
         |       | Ahorro detectado               | Reconocimiento
```

**Ejemplo de Alerta Crítica:**

```
Título: "⚠️ Situación Financiera Crítica"

Cuerpo:
"Detectamos que tus gastos superan tus ingresos hace 3 meses.
Tu deuda acumulada es S/ 3,200 (45% de ingresos anuales).

Acciones recomendadas:
1. Habla con nuestro asesor (chat en vivo)
2. Revisa nuestro plan de recuperación
3. Considera consolidar deuda con EWA

Impacto: Si actúas hoy, podrías recuperarte en 4 meses.
Si no actúas, el riesgo de insolvencia es 85%."
```

---

### 3.3 Análisis de Causalidad de Gastos

**Técnica: Análisis de Eventos y Contexto**

```
Pregunta: "¿Por qué gasté S/ 450 en entretenimiento esta semana?"

Análisis:
1. Evento Contextual
   - Fin de semana largo (viernes a domingo)
   - Recibiste bono (evento positivo)
   - Estrés laboral alto (emails después de horas)

2. Patrón Histórico
   - Después de estrés, gastas 2.5x más en entretenimiento
   - Los viernes gastas 40% más que otros días
   - Bonos correlacionan con gasto 60% mayor

3. Recomendación
   - "Detectamos que gastas más después de estrés"
   - "Alternativa: Ejercicio, meditación, tiempo con amigos"
   - "Ahorro potencial: S/ 150/mes si cambias patrón"
```

**Impacto:** +45% comprensión de comportamiento, +25% cambio de hábitos

---

## 4. OCR PARA REGISTRO DE GASTOS

### 4.1 Arquitectura de Solución OCR

**Flujo de Captura:**

```
1. CAPTURA
   ├─ Foto de recibo/factura (cámara móvil)
   ├─ Validación de calidad (brillo, enfoque)
   └─ Compresión y envío a servidor

2. PROCESAMIENTO OCR
   ├─ Google Vision API / AWS Textract
   ├─ Extracción de campos:
   │  ├─ Monto total
   │  ├─ Fecha
   │  ├─ Comerciante/Tienda
   │  ├─ Categoría (automática)
   │  └─ Descripción de items
   └─ Validación de datos extraídos

3. ENRIQUECIMIENTO
   ├─ Clasificación automática de categoría (ML)
   ├─ Detección de duplicados
   ├─ Análisis de items (¿gasto hormiga?)
   └─ Sugerencias de etiquetas

4. CONFIRMACIÓN
   ├─ Usuario revisa datos extraídos
   ├─ Opción de editar/confirmar
   ├─ Guardado en base de datos
   └─ Análisis automático

5. ANÁLISIS
   ├─ Actualización de FWI Score
   ├─ Detección de patrones
   ├─ Alertas si aplica
   └─ Recomendaciones
```

---

### 4.2 Implementación Técnica

**Stack Recomendado:**

```
Frontend (React Native/Web):
├─ react-native-camera (captura)
├─ react-native-image-crop-picker (edición)
└─ Validación local (brillo, tamaño)

Backend (Node.js/Python):
├─ Google Cloud Vision API (OCR)
├─ AWS Textract (alternativa)
├─ OpenAI Vision (validación/enriquecimiento)
└─ Custom ML model (categorización)

Database:
├─ Tabla: receipt_images (almacenar imagen)
├─ Tabla: receipt_extractions (datos OCR)
├─ Tabla: receipt_validations (confirmación usuario)
└─ Índices para búsqueda rápida
```

**Campos Extraídos:**

```sql
CREATE TABLE receipt_extractions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  receiptImageUrl VARCHAR(500),
  
  -- Datos extraídos por OCR
  extractedAmount DECIMAL(10,2),
  extractedDate DATETIME,
  extractedMerchant VARCHAR(200),
  extractedCategory VARCHAR(50),
  extractedItems JSON, -- Array de items con precio
  
  -- Confianza del OCR
  ocrConfidence FLOAT, -- 0-1
  requiresManualReview BOOLEAN,
  
  -- Enriquecimiento
  suggestedCategory VARCHAR(50),
  suggestedDescription TEXT,
  detectedAntExpense BOOLEAN,
  
  -- Confirmación usuario
  isConfirmed BOOLEAN,
  confirmedAmount DECIMAL(10,2),
  confirmedCategory VARCHAR(50),
  confirmedDescription TEXT,
  
  -- Auditoría
  createdAt TIMESTAMP,
  confirmedAt TIMESTAMP,
  linkedTransactionId INT
);
```

---

### 4.3 Casos de Uso OCR

**Caso 1: Compra en Supermercado**

```
Usuario toma foto de recibo de Carrefour

OCR Extrae:
├─ Monto: S/ 234.50
├─ Fecha: 2025-01-15
├─ Comerciante: Carrefour - Surco
├─ Items:
│  ├─ Arroz (2kg): S/ 18.50
│  ├─ Pollo (1kg): S/ 32.00
│  ├─ Café (500g): S/ 24.00
│  ├─ Bebidas (6 pack): S/ 28.00
│  └─ ... (otros items)
└─ Categoría sugerida: Alimentos

Sistema analiza:
├─ Detecta gasto hormiga: Bebidas (S/ 28) - compra frecuente
├─ Sugiere: "Compra en bulk para ahorrar 15%"
└─ Recomendación: "Marca como 'Alimentos esenciales' para presupuesto"

Usuario confirma en 3 segundos
```

**Caso 2: Restaurante/Delivery**

```
Usuario toma foto de factura de Uber Eats

OCR Extrae:
├─ Monto: S/ 89.90
├─ Fecha: 2025-01-15 20:30
├─ Comerciante: Restaurante XYZ via Uber Eats
├─ Items:
│  ├─ Ceviche: S/ 45.00
│  ├─ Bebida: S/ 12.00
│  ├─ Delivery: S/ 12.90
│  └─ Propina: S/ 20.00
└─ Categoría: Entretenimiento/Comida

Sistema analiza:
├─ Detecta patrón: 4ta vez esta semana (gasto hormiga)
├─ Calcula: "Gastarás S/ 1,800/mes si continúas"
├─ Alerta: "FWI bajará 8 puntos si continúas"
└─ Recomendación: "Cocina en casa 3 días/semana = S/ 600 ahorro"

Usuario confirma y recibe plan de acción
```

**Caso 3: Suscripción/Servicio**

```
Usuario toma foto de factura de Netflix

OCR Extrae:
├─ Monto: S/ 49.90
├─ Fecha: 2025-01-15
├─ Comerciante: Netflix
├─ Descripción: "Suscripción Premium"
└─ Categoría: Suscripciones

Sistema analiza:
├─ Detecta: Suscripción activa (registrada previamente)
├─ Compara: Precio igual al mes anterior
├─ Verifica: ¿Estás usando Netflix? (engagement data)
└─ Recomendación: "Cambiar a plan compartido = S/ 20 ahorro"

Usuario confirma o marca como "No usar"
```

---

### 4.4 Beneficios de OCR

| Beneficio | Impacto | Métrica |
|-----------|---------|---------|
| Reducción de fricción | +60% usuarios registran gastos | Engagement |
| Captura automática de detalles | +45% precisión de categorización | Calidad datos |
| Detección de patrones | +30% alertas tempranas | Prevención |
| Análisis de items | +25% identificación de gastos hormiga | Ahorro |
| Velocidad de registro | 3 segundos vs 30 segundos manual | UX |
| Cobertura de gastos | +40% gastos registrados | Completitud |

---

## 5. MATRIZ DE PRIORIZACIÓN

### 5.1 Impacto vs Esfuerzo

```
ALTO IMPACTO, BAJO ESFUERZO (Hacer Primero):
├─ Alertas de patrones nocivos críticos
├─ Recomendaciones contextuales automáticas
├─ Dashboard de insights personalizados
└─ Análisis de causalidad simple

ALTO IMPACTO, MEDIO ESFUERZO (Hacer Segundo):
├─ OCR para recibos (Google Vision)
├─ Predicción de comportamiento (ML simple)
└─ Sistema de alertas inteligentes

ALTO IMPACTO, ALTO ESFUERZO (Hacer Después):
├─ ML avanzado (XGBoost)
├─ Análisis de causalidad complejo
└─ Integración con APIs externas (operadores, bancos)

BAJO IMPACTO (No Hacer):
├─ Análisis de astrología/numerología
├─ Predicciones de mercado
└─ Recomendaciones de inversión
```

---

### 5.2 Roadmap de Implementación (6 Meses)

**Mes 1-2: Fundamentos**
- [ ] Alertas de patrones nocivos críticos
- [ ] Dashboard de insights básicos
- [ ] Recomendaciones contextuales (reglas)

**Mes 2-3: OCR**
- [ ] Integración Google Vision API
- [ ] Captura y extracción de recibos
- [ ] Validación y confirmación usuario

**Mes 3-4: ML y Predicciones**
- [ ] Modelo de predicción de gastos
- [ ] Análisis de causalidad
- [ ] Segmentación de usuarios

**Mes 4-5: Optimización**
- [ ] A/B testing de recomendaciones
- [ ] Mejora de precisión OCR
- [ ] Integración con APIs externas

**Mes 5-6: Escalado**
- [ ] Soporte móvil nativo
- [ ] Análisis en tiempo real
- [ ] Reportes avanzados

---

## 6. MÉTRICAS DE ÉXITO

### 6.1 Métricas de Adopción

```
Métrica                          | Baseline | Target (6m) | Target (12m)
---------------------------------|----------|-------------|-------------
% Usuarios con OCR activado      | 0%       | 40%         | 70%
Gastos registrados vía OCR       | 0        | 30% del total| 50% del total
Tiempo promedio de registro      | 30s      | 5s          | 3s
Tasa de confirmación OCR         | N/A      | 95%         | 98%
Usuarios recibiendo alertas      | 20%      | 60%         | 80%
Tasa de acción en alertas        | 15%      | 40%         | 55%
```

### 6.2 Métricas de Impacto Financiero

```
Métrica                          | Baseline | Target (6m) | Target (12m)
---------------------------------|----------|-------------|-------------
Ahorro promedio/usuario/mes      | S/ 150   | S/ 350      | S/ 500
Reducción de gastos hormiga       | -        | 25%         | 40%
Mejora promedio FWI Score        | +2       | +8          | +15
Reducción de uso EWA             | -        | 20%         | 35%
Retención a 6 meses              | 60%      | 75%         | 85%
NPS (Net Promoter Score)         | 35       | 55          | 70
```

### 6.3 Métricas Técnicas

```
Métrica                          | Target
---------------------------------|--------
Precisión OCR (monto)            | 98%+
Precisión OCR (categoría)        | 92%+
Latencia de OCR                  | <2 segundos
Disponibilidad del servicio      | 99.9%
Tasa de error en alertas         | <2%
Tiempo de respuesta API          | <500ms
```

---

## 7. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|-----------|
| Baja precisión OCR | Media | Alto | Validación usuario, fallback manual |
| Privacidad de datos | Baja | Crítico | Encriptación, GDPR compliance |
| Costo de APIs | Media | Medio | Caché inteligente, límites de uso |
| Sobrecarga de alertas | Alta | Medio | Filtrado inteligente, preferencias usuario |
| Adopción lenta | Media | Medio | Gamificación, incentivos, educación |
| Falsos positivos | Media | Bajo | Ajuste de umbrales, feedback loop |

---

## 8. RECOMENDACIONES FINALES

### 8.1 Prioridades Inmediatas (Próximas 2 Semanas)

1. **Implementar Alertas de Patrones Críticos**
   - Detectar: Deuda > 50% ingresos, gastos > ingresos 3+ meses
   - Acción: Notificación + plan de recuperación
   - Esfuerzo: 3-5 días
   - Impacto: Prevención de crisis financiera

2. **Crear Dashboard de Insights**
   - Mostrar: FWI tendencia, predicción de gastos, oportunidades de ahorro
   - Esfuerzo: 5-7 días
   - Impacto: +50% comprensión de situación

3. **Recomendaciones Contextuales Automáticas**
   - Mostrar: Top 3 recomendaciones personalizadas
   - Esfuerzo: 4-6 días
   - Impacto: +30% acciones correctivas

### 8.2 Iniciativas de Corto Plazo (1-2 Meses)

1. **OCR para Recibos**
   - Integrar Google Vision API
   - Crear flujo de captura y validación
   - Esfuerzo: 10-15 días
   - Impacto: +60% engagement, +40% cobertura de gastos

2. **Análisis de Causalidad**
   - Identificar eventos y contexto de gastos
   - Mostrar correlaciones
   - Esfuerzo: 7-10 días
   - Impacto: +45% comprensión de comportamiento

3. **Sistema de Alertas Inteligentes**
   - Implementar 5 tipos de alertas
   - Integrar con notificaciones push/email
   - Esfuerzo: 8-12 días
   - Impacto: +40% prevención de problemas

### 8.3 Iniciativas de Mediano Plazo (2-4 Meses)

1. **Modelo de Predicción ML**
   - Predecir gastos futuros
   - Predecir riesgo de EWA
   - Esfuerzo: 15-20 días
   - Impacto: +25% engagement

2. **Integración con APIs Externas**
   - Operadores móviles (Claro, Movistar, Entel)
   - Bancos (BCP, BBVA, Scotiabank)
   - Esfuerzo: 20-30 días
   - Impacto: +30% automatización

---

## 9. CONCLUSIÓN

La propuesta de valor para colaboradores puede enriquecerse significativamente a través de:

1. **Insights Avanzados** que permitan entender y predecir comportamiento
2. **Detección de Patrones Nocivos** que prevengan problemas financieros
3. **OCR para Gastos** que elimine fricción y aumente engagement

Estas iniciativas pueden aumentar:
- **Engagement**: +60%
- **Retención**: +25%
- **Ahorro promedio**: +230% (S/ 150 → S/ 350)
- **FWI Score**: +13 puntos

Con un roadmap claro y ejecución disciplinada, Treevü puede posicionarse como la plataforma más inteligente y útil para bienestar financiero de colaboradores en LATAM.
