# Análisis Semántico y Semiótico de Treevü

## Resumen Ejecutivo

Este documento presenta un análisis profundo de la semántica (significado de términos y mensajes) y semiótica (signos, símbolos y comunicación visual) de la plataforma Treevü, identificando oportunidades de mejora para fortalecer la coherencia narrativa y la experiencia de usuario.

---

## 1. ANÁLISIS SEMÁNTICO

### 1.1 Terminología Clave - Consistencia

| Término | Uso Actual | Problema Detectado | Recomendación |
|---------|------------|-------------------|---------------|
| **FWI** | "FWI Score", "FWI", "Financial Wellness Index" | Se usa indistintamente sin explicación consistente | Estandarizar: primera mención siempre "FWI (Índice de Bienestar Financiero)", después solo "FWI" |
| **TreePoints** | "TreePoints", "puntos", "pts" | Mezcla de términos en la misma pantalla | Usar siempre "TreePoints" como nombre propio, nunca abreviar a "pts" |
| **EWA** | "EWA", "Adelanto de Salario", "adelanto" | El acrónimo no se explica en todos los contextos | Siempre usar "Adelanto de Salario (EWA)" en primera mención |
| **Asistente IA** | "Treevü Brain", "Asesor IA", "asesor financiero", "chatbot" | Múltiples nombres para el mismo concepto | Estandarizar a "Treevü Brain" en toda la plataforma |

### 1.2 Microcopy - Oportunidades de Mejora

#### CTAs (Llamadas a la Acción)
| Ubicación | Texto Actual | Problema | Propuesta |
|-----------|--------------|----------|-----------|
| Landing Hero | "Calcular ROI y Agenda Demo" | Dos acciones en un botón | "Calcular mi ROI" (primario) + "Agendar Demo" (secundario) |
| Navbar | "Calcular ROI \| Demo" | Confuso, usa pipe | "Calcular ROI" |
| EWA | "Solicitar Adelanto" | Genérico | "Solicitar mi Adelanto" (más personal) |
| TreePoints | "Canjear" | Muy corto, sin contexto | "Canjear ahora" o "Usar mis TreePoints" |

#### Estados Vacíos
| Pantalla | Mensaje Actual | Problema | Propuesta |
|----------|----------------|----------|-----------|
| Transacciones | "No hay transacciones registradas" | Frío, no guía al usuario | "Aún no tienes transacciones. ¡Registra tu primer gasto para empezar a ganar TreePoints!" |
| Metas | "No tienes metas configuradas" | No explica beneficio | "Crea tu primera meta financiera y gana 100 TreePoints al completarla" |
| Ofertas | "No hay ofertas disponibles" | Pasivo | "Estamos preparando ofertas increíbles. ¡Vuelve pronto!" |
| EWA | "No tienes monto disponible" | No explica por qué | "Tu monto disponible se actualiza cada quincena según tu salario devengado" |

#### Mensajes de Error
| Contexto | Mensaje Actual | Problema | Propuesta |
|----------|----------------|----------|-----------|
| EWA | "Error al procesar la solicitud" | Genérico | "No pudimos procesar tu adelanto. Por favor intenta de nuevo o contacta a soporte." |
| TreePoints | "No tienes suficientes puntos" | Negativo | "Te faltan X TreePoints. ¡Sigue ganando puntos para desbloquear esta oferta!" |
| FWI bajo | "Tu FWI Score debe ser al menos 40" | Restrictivo | "Mejora tu FWI a 40+ para desbloquear adelantos. ¡Estás a X puntos!" |

### 1.3 Tono de Voz - Inconsistencias

**Problema identificado:** El tono varía entre formal/técnico (landing B2B) y casual/empático (dashboards de empleado).

**Recomendación:** Definir dos registros claros:
1. **B2B (Empresas):** Profesional, orientado a ROI, datos concretos
2. **B2C (Empleados):** Empático, motivacional, celebratorio

---

## 2. ANÁLISIS SEMIÓTICO

### 2.1 Iconografía - Coherencia

| Concepto | Icono Actual | Problema | Recomendación |
|----------|--------------|----------|---------------|
| **Logo Treevü** | Leaf (hoja) | Consistente ✓ | Mantener |
| **FWI Score** | TrendingUp (flecha arriba) | No evoca "bienestar" | Considerar Heart + TrendingUp o crear icono custom |
| **TreePoints** | Gift (regalo) | No conecta con "árbol" | Usar Coins con estilo de hoja, o Sparkles con verde |
| **EWA** | Wallet/CreditCard | Inconsistente entre pantallas | Estandarizar a Wallet con flecha hacia arriba |
| **Metas** | Target | Correcto ✓ | Mantener |
| **Treevü Brain** | Brain/Sparkles | Inconsistente | Estandarizar a Brain con color verde marca |

### 2.2 Metáfora Visual del Árbol - Oportunidades

**Observación:** El nombre "Treevü" evoca un árbol (tree + view), pero la metáfora no se explota visualmente.

**Oportunidades:**
1. **Crecimiento:** Mostrar el FWI como un árbol que crece (raíces = estabilidad, ramas = metas)
2. **TreePoints:** Visualizar como hojas o frutos que se acumulan
3. **Niveles:** Representar niveles como etapas de crecimiento del árbol
4. **Logros:** Badges con forma de hojas, frutos, flores

### 2.3 Paleta de Colores - Significado Semiótico

| Color | Uso Actual | Significado Semiótico | Coherencia |
|-------|------------|----------------------|------------|
| **Verde esmeralda (#34D399)** | Marca principal, FWI, éxito | Crecimiento, dinero, naturaleza | ✓ Excelente |
| **Azul (#3B82F6)** | Empresas (B2B) | Confianza, profesionalismo | ✓ Correcto |
| **Naranja (#F97316)** | Comercios | Energía, ofertas | ✓ Correcto |
| **Púrpura (#8B5CF6)** | TreePoints, recompensas | Lujo, gamificación | ⚠️ Podría ser verde para coherencia con "Tree" |
| **Rojo (#EF4444)** | Alertas, riesgo | Peligro, urgencia | ✓ Correcto |

**Recomendación:** Considerar cambiar TreePoints de púrpura a un verde dorado (gold-green) para reforzar la metáfora del árbol (hojas doradas = recompensas).

### 2.4 Señales de Estado - Mejoras

| Estado | Señal Actual | Problema | Propuesta |
|--------|--------------|----------|-----------|
| **FWI Bajo (<40)** | Número rojo | Solo color, sin contexto | Agregar icono de alerta + mensaje motivacional |
| **FWI Medio (40-70)** | Número amarillo | No hay transición visual | Agregar barra de progreso con meta visible |
| **FWI Alto (>70)** | Número verde | No celebra suficiente | Agregar efecto de glow + confetti en logros |
| **EWA Disponible** | Número verde | Pasivo | Agregar badge pulsante "Disponible ahora" |
| **Oferta Expirando** | Sin señal | Urgencia no comunicada | Agregar countdown timer + color ámbar |

### 2.5 Jerarquía Visual - Observaciones

**Problema:** En algunos dashboards, la información secundaria compite visualmente con la primaria.

**Ejemplos:**
- EmployeeDashboard: El consejo de IA tiene el mismo peso visual que el FWI Score
- B2BDashboard: Las métricas de riesgo no destacan suficiente

**Recomendación:** Aplicar regla 60-30-10:
- 60% espacio para métrica principal (FWI, métricas clave)
- 30% para acciones secundarias (tabs, filtros)
- 10% para información contextual (consejos, alertas)

---

## 3. COHERENCIA NARRATIVA

### 3.1 Historia de Usuario - Gaps Identificados

**Narrativa ideal del empleado:**
1. Descubro mi FWI Score → Entiendo mi situación
2. Registro gastos → Gano TreePoints
3. Cumplo metas → Subo de nivel
4. Necesito dinero → Uso EWA
5. Tengo TreePoints → Canjeo ofertas

**Gaps detectados:**
- No hay onboarding que explique esta narrativa
- Los niveles no tienen beneficios claros comunicados
- La conexión entre FWI y EWA no es evidente

### 3.2 Propuesta de Narrativa Unificada

> "En Treevü, tu bienestar financiero es un árbol que crece contigo. Tu FWI Score son las raíces (estabilidad), tus metas son las ramas (crecimiento), y tus TreePoints son los frutos (recompensas). Cuida tu árbol y florecerá."

---

## 4. PLAN DE IMPLEMENTACIÓN PRIORITARIA

### Alta Prioridad (Impacto inmediato)
1. [ ] Estandarizar nombre del asistente a "Treevü Brain" en toda la plataforma
2. [ ] Mejorar estados vacíos con mensajes motivacionales y CTAs claros
3. [ ] Agregar explicación de FWI en primera mención
4. [ ] Corregir CTAs del landing (separar "Calcular ROI" de "Agendar Demo")

### Media Prioridad (Mejora de experiencia)
5. [ ] Unificar iconografía de EWA (usar Wallet consistentemente)
6. [ ] Agregar badges pulsantes para estados "disponible"
7. [ ] Mejorar mensajes de error con contexto y soluciones
8. [ ] Agregar countdown a ofertas que expiran

### Baja Prioridad (Refinamiento)
9. [ ] Explorar cambio de color de TreePoints a verde-dorado
10. [ ] Desarrollar visualización de "árbol de bienestar"
11. [ ] Crear sistema de badges con metáfora de naturaleza
12. [ ] Agregar micro-animaciones de celebración

---

## 5. MÉTRICAS DE ÉXITO

| Métrica | Baseline Actual | Meta Post-Implementación |
|---------|-----------------|--------------------------|
| Comprensión de FWI (survey) | Por medir | >80% entienden qué es |
| Uso de estados vacíos como CTA | Por medir | >30% click en CTA |
| Satisfacción con mensajes de error | Por medir | >4/5 estrellas |
| Reconocimiento de "Treevü Brain" | Inconsistente | 100% consistente |

---

*Documento generado: 10 Dic 2025*
*Próxima revisión: Después de implementación de prioridades altas*
