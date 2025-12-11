# Treevü Backend - Project TODO

## Fase 2: Backend Full-Stack con OAuth 2.0 y Base de Datos

### Base de Datos y Esquema
- [x] Tabla users con roles RBAC (admin, employee, merchant, b2b_admin)
- [x] Tabla transactions para historial de gastos
- [x] Tabla financial_goals para metas de ahorro
- [x] Tabla ewa_requests para solicitudes de adelanto de salario
- [x] Tabla tree_points para gestión de puntos
- [x] Tabla tree_points_transactions para historial de puntos
- [x] Tabla departments para estructura organizacional
- [x] Tabla market_offers para ofertas de comerciantes
- [x] Tabla security_sessions para auditoría de sesiones

### API tRPC - Autenticación y Usuarios
- [x] Procedimiento auth.me con información de rol
- [x] Procedimiento users.getProfile con FWI Score
- [x] Procedimiento users.updateProfile
- [x] Middleware protectedProcedure con validación de roles
- [x] Middleware adminProcedure para operaciones admin
- [x] Middleware merchantProcedure para operaciones de comerciantes
- [x] Middleware b2bAdminProcedure para operaciones B2B

### API tRPC - Transacciones y Finanzas
- [x] Procedimiento transactions.list con filtros
- [x] Procedimiento transactions.create con clasificación AI
- [x] Procedimiento transactions.getAnalysis por categoría
- [x] Procedimiento fwi.getScore cálculo de bienestar financiero
- [x] Procedimiento fwi.getHistory historial de score

### API tRPC - EWA (Early Wage Access)
- [x] Procedimiento ewa.getAvailable cálculo de límite disponible
- [x] Procedimiento ewa.request con validaciones
- [x] Procedimiento ewa.list historial de solicitudes
- [x] Procedimiento ewa.approve (admin/b2b_admin)
- [x] Procedimiento ewa.reject con razón

### API tRPC - TreePoints
- [x] Procedimiento treePoints.getBalance
- [x] Procedimiento treePoints.issue (admin/b2b_admin)
- [x] Procedimiento treePoints.redeem
- [x] Procedimiento treePoints.getHistory
- [x] Procedimiento treePoints.getDepartmentStats (b2b_admin)

### API tRPC - Dashboard B2B
- [x] Procedimiento b2b.getMetrics métricas generales
- [x] Procedimiento b2b.getRiskAnalysis análisis IPR
- [x] Procedimiento b2b.getDepartmentBreakdown
- [x] Procedimiento b2b.getAbsenteeismReport
- [x] Procedimiento b2b.getEmployeeRiskList

### API tRPC - Panel Merchant
- [x] Procedimiento merchant.getStats estadísticas generales
- [x] Procedimiento merchant.getOffers lista de ofertas
- [x] Procedimiento merchant.createOffer
- [x] Procedimiento merchant.getConversions
- [x] Procedimiento merchant.getROI

### Integración Gemini AI
- [x] Servicio classifyExpense para categorización
- [x] Servicio getFinancialAdvice para recomendaciones
- [x] Servicio generateSmartOffer para comerciantes
- [x] Servicio chatWithAdvisor para asesoría conversacional
- [x] Servicio analyzeFwiFactors para análisis de score

### Seguridad
- [x] Rate limiting middleware
- [x] Validación de anomalías de sesión
- [x] Logging de auditoría de accesos
- [x] Validación de límites EWA

### Frontend - Dashboards
- [x] Dashboard Employee con FWI Score y transacciones
- [x] Dashboard B2B Admin con métricas de riesgo
- [x] Dashboard Merchant con ofertas y ROI
- [x] Página de EWA (solicitud de adelantos)
- [x] Página de ofertas y TreePoints
- [x] Home page con navegación basada en roles

## Fase 3: Landing Page de Marketing
- [x] Hero section con propuesta de valor
- [x] Features section con beneficios (6 cards)
- [x] Benefits section con métricas de impacto
- [x] Testimonials section (3 testimonios)
- [x] Pricing section (3 planes: Starter, Business, Enterprise)
- [x] CTA y formulario de contacto
- [x] Footer con enlaces y navegación
- [x] Navegación fija con scroll suave
- [x] Diseño responsive para móvil y desktop

---
*Última actualización: Dec 9, 2025*


## Fase 4: Mejoras Adicionales
- [x] Conectar formulario de contacto con servicio de notificaciones (notifyOwner)
- [x] Agregar animaciones de scroll con Framer Motion en landing page
- [x] Crear página de Blog/Recursos con 6 artículos de bienestar financiero
- [x] Sistema de búsqueda y filtrado por categorías en el blog
- [x] Vista de detalle de artículos con contenido completo
- [x] Newsletter CTA en el blog
- [x] 18 tests pasando (incluyendo validación de formulario de contacto)


## Fase 5: Sistema de Notificaciones Personalizadas
- [x] Crear tabla de notificaciones en base de datos (14 tipos de notificación)
- [x] Crear tabla de preferencias de notificación (17 preferencias configurables)
- [x] Implementar API tRPC para CRUD de notificaciones (10 endpoints)
- [x] Crear componente NotificationCenter (campana con dropdown y contador)
- [x] Crear página de todas las notificaciones (/notifications)
- [x] Crear página de preferencias de notificación (/settings/notifications)
- [x] Integrar NotificationCenter en Home, EmployeeDashboard, B2BDashboard, MerchantDashboard
- [x] Funciones helper para enviar notificaciones automáticas (EWA, TreePoints, metas, FWI, etc.)
- [x] Implementar marcado de leído/no leído individual y masivo
- [x] Implementar eliminación individual y masiva
- [x] Tests para el sistema de notificaciones (14 tests adicionales, 32 total)


## Fase 6: Notificaciones Avanzadas (Push, Triggers, Email)

### Web Push API
- [x] Crear Service Worker para notificaciones push (sw.js)
- [x] Implementar suscripción a push en el frontend (usePushNotifications hook)
- [x] Crear endpoint para guardar suscripciones push en BD (notifications.subscribePush)
- [x] Implementar envío de notificaciones push desde el servidor (pushService.ts)
- [x] Agregar UI para solicitar permiso de notificaciones (NotificationSettings.tsx)
- [x] Botón de prueba de push notifications

### Triggers Automáticos
- [x] Trigger cuando se aprueba un EWA (triggerEwaApproved)
- [x] Trigger cuando se reciben TreePoints (triggerTreepointsReceived)
- [x] Trigger cuando se alcanza una meta financiera (triggerGoalCompleted)
- [x] Trigger cuando mejora el FWI Score (triggerFwiImproved)
- [x] Trigger para alertas de seguridad (triggerSecurityAlert)
- [x] Trigger para subida de nivel (triggerLevelUp)
- [x] Trigger para rachas (triggerStreakMilestone)
- [x] Trigger para ofertas disponibles (triggerOfferAvailable)

### Notificaciones por Email
- [x] Integrar Resend API para envío de emails (emailService.ts)
- [x] Crear 10 plantillas de email HTML profesionales
- [x] Agregar preferencia de email en configuración de usuario
- [x] Implementar cola de emails para envío asíncrono (emailQueue table)
- [x] Botón de prueba de email en configuración
- [x] Tests para el sistema de notificaciones avanzadas (11 tests adicionales, 43 total)


## Fase 7: Seed Data, Reportes PDF y Panel de Administración

### Datos de Demostración (Seed)
- [x] Crear script de seed con usuarios de prueba (5 empleados, 2 merchants, 1 b2b_admin)
- [x] Generar transacciones realistas por categoría (50+ transacciones)
- [x] Crear metas financieras con progreso variado (3 metas por usuario)
- [x] Generar solicitudes EWA en diferentes estados
- [x] Crear TreePoints con historial de emisión y redención
- [x] Generar departamentos con empleados asignados (3 departamentos)
- [x] Crear ofertas de merchants activas (5 ofertas)

### Reportes PDF
- [x] Implementar servicio de generación de PDF (pdfService.ts)
- [x] Crear plantilla de reporte mensual HTML profesional con FWI Score
- [x] Incluir resumen de transacciones por categoría con barras de progreso
- [x] Incluir progreso de metas financieras
- [x] Incluir historial de TreePoints y EWA
- [x] Agregar recomendaciones personalizadas
- [x] Endpoints para obtener datos y HTML del reporte
- [x] Página de reportes en el frontend (/reports)
- [x] Vista previa y descarga como PDF (via print)

### Panel de Administración
- [x] Crear página de dashboard admin con métricas globales (/admin)
- [x] Implementar gestión de usuarios (listar, buscar, filtrar por rol)
- [x] Cambio de roles de usuario (employee, merchant, b2b_admin, admin)
- [x] Crear vista de métricas por departamento
- [x] Implementar envío de notificaciones masivas (por tipo y rol objetivo)
- [x] Acceso restringido a admin y b2b_admin
- [x] Vista de solicitudes EWA pendientes (placeholder - requiere endpoint adicional)


## Fase 8: Mejoras Finales

### Configuración de Email
- [x] Solicitar Resend API key al usuario
- [x] Crear test de validación de API key

### Endpoint EWA Pendientes
- [x] Crear endpoint ewa.getPendingRequests para admins
- [x] Actualizar AdminDashboard para usar endpoint real
- [x] Funcionalidad de aprobar/rechazar EWA ya existía

### Gráficos Interactivos (Recharts)
- [x] Agregar gráfico de línea para tendencia de FWI Score
- [x] Agregar gráfico de barras horizontal para gastos por categoría
- [x] Agregar gráfico de área para TreePoints (ganados vs canjeados)
- [x] Agregar gráfico de pie para progreso de metas
- [x] Integrar todos los gráficos en la página de reportes
- [x] Tooltips interactivos y leyendas
- [x] Colores personalizados por categoría


## Fase 9: Exportación, Modo Oscuro y Onboarding

### Exportación de Datos
- [x] Crear servicio de exportación CSV (exportService.ts)
- [x] Endpoint para exportar usuarios (exports.users)
- [x] Endpoint para exportar transacciones (exports.transactions)
- [x] Endpoint para exportar EWA requests (exports.ewaRequests)
- [x] Endpoint para exportar metas financieras (exports.goals)
- [x] Endpoint para exportar departamentos (exports.departments)
- [x] Funciones de consulta en db.ts (getAllUsers, getAllTransactions, etc.)

### Modo Oscuro
- [x] Habilitar switchable en ThemeProvider (App.tsx)
- [x] Crear componente ThemeToggle con iconos sol/luna
- [x] Agregar ThemeToggle a Home, EmployeeDashboard, B2BDashboard, MerchantDashboard, AdminDashboard
- [x] Variables CSS ya configuradas para modo oscuro en index.css
- [x] Persistir preferencia en localStorage

### Onboarding Interactivo
- [x] Crear componente Onboarding con 9 pasos animados (Framer Motion)
- [x] Paso 1: Bienvenida a Treevü
- [x] Paso 2: FWI Score explicado
- [x] Paso 3: Registro de gastos con IA
- [x] Paso 4: Metas financieras
- [x] Paso 5: TreePoints y recompensas
- [x] Paso 6: EWA (Adelanto de salario)
- [x] Paso 7: Asesor financiero IA
- [x] Paso 8: Notificaciones
- [x] Paso 9: Completado con bono de bienvenida
- [x] Hook useOnboarding para gestionar estado
- [x] Integrar en Home.tsx para usuarios autenticados
- [x] Persistir estado en localStorage (treevü_onboarding_completed)


## Fase 10: Búsqueda Global, Comparativa Mensual y Sistema de Logros

### Búsqueda Global (Cmd+K)
- [x] Crear componente CommandPalette con cmdk
- [x] Implementar búsqueda de transacciones
- [x] Implementar búsqueda de metas financieras
- [x] Implementar búsqueda de ofertas
- [x] Agregar accesos rápidos a páginas principales
- [x] Integrar en App.tsx con atajo de teclado (Cmd+K / Ctrl+K)
- [x] Navegación basada en roles

### Comparativa Mensual
- [x] Crear endpoint getMonthlyComparison para datos históricos (últimos 6 meses)
- [x] Calcular variaciones porcentuales mes a mes
- [x] Datos de FWI Score, gastos, ingresos, TreePoints, metas completadas

### Sistema de Logros/Badges
- [x] Crear tabla de achievements en base de datos (12 columnas)
- [x] Crear tabla de user_achievements para tracking (6 columnas)
- [x] Definir 20 logros en 5 categorías (financial, savings, engagement, social, milestone)
- [x] 4 niveles de rareza (common, rare, epic, legendary)
- [x] Crear página de logros (/achievements) con animaciones Framer Motion
- [x] Grid de badges con estado bloqueado/desbloqueado
- [x] Modal de detalle de logro
- [x] Estadísticas de progreso (logros desbloqueados, puntos ganados, racha, nivel)


## Fase 11: API de Logros, Gráficos Comparativos y Leaderboard

### API de Logros
- [x] Crear funciones de base de datos para achievements (getAchievements, getUserAchievements, unlockAchievement, checkAndUnlockAchievements)
- [x] Crear endpoint achievements.list para obtener todos los logros
- [x] Crear endpoint achievements.getUserAchievements para logros del usuario
- [x] Crear endpoint achievements.unlock para desbloquear logro manualmente
- [x] Crear endpoint achievements.checkProgress para verificar y desbloquear automáticamente
- [x] Notificación automática al desbloquear logro

### Gráficos de Comparativa Mensual
- [x] Integrar endpoint getMonthlyComparison en página de reportes
- [x] Agregar tab "Comparativa" con gráficos de evolución
- [x] Gráfico de línea para evolución FWI Score (6 meses)
- [x] Gráfico de barras para gastos mensuales comparativos
- [x] Gráfico de área para TreePoints ganados por mes
- [x] Cards con indicadores de variación porcentual (FWI, gastos, TreePoints)

### Leaderboard
- [x] Crear funciones de leaderboard en db.ts (getLeaderboardByPoints, getLeaderboardByFwi, getLeaderboardByLevel, getUserRank)
- [x] Crear router de leaderboard con endpoints (byPoints, byFwi, byLevel, getUserRank)
- [x] Crear página de Leaderboard (/leaderboard) con Framer Motion
- [x] Podio animado para top 3 usuarios
- [x] Lista completa con posición del usuario actual resaltada
- [x] Tabs para ordenar por TreePoints, FWI Score, Racha, Metas
- [x] Estadísticas de resumen (participantes, promedios)


## Fase 12: CSV en Admin, Filtro Departamento y Perfil Público

### Botones de Descarga CSV en AdminDashboard
- [x] Agregar botón para exportar usuarios a CSV
- [x] Agregar botón para exportar EWA pendientes a CSV
- [x] Agregar botón para exportar departamentos a CSV
- [x] Agregar botón para exportar análisis de riesgo a CSV
- [x] Implementar descarga directa desde el navegador
- [x] Card de exportación con iconos y contador de registros

### Filtro por Departamento en Leaderboard
- [x] Usar endpoint existente b2b.getDepartments
- [x] Agregar selector de departamento en Leaderboard
- [x] Filtrar ranking por departamento seleccionado
- [x] Mostrar contador de usuarios filtrados vs total
- [x] Botón para limpiar filtro
- [x] Fallback a departamentos mock si API vacía

### Página de Perfil Público
- [x] Crear página de perfil (/profile y /profile/:userId)
- [x] Mostrar información básica del usuario (nombre, departamento, nivel)
- [x] Mostrar nivel y TreePoints con barra de progreso
- [x] Mostrar logros desbloqueados con badges de rareza
- [x] Mostrar estadísticas (FWI Score, metas, racha, transacciones, ahorro)
- [x] Agregar opción de compartir perfil (Web Share API + copiar enlace)
- [x] Tabs para Logros y Estadísticas
- [x] Animaciones con Framer Motion


## Fase 13: Enlaces de Perfil, Sistema de Referidos y Analytics

### Enlace al Perfil desde Leaderboard
- [x] Hacer que los nombres de usuario en el Leaderboard sean clickeables
- [x] Navegar a /profile/:userId al hacer clic
- [x] Agregar hover effect para indicar que es clickeable (text-green-600 on hover)

### Sistema de Referidos
- [x] Crear tabla de referrals en base de datos (12 columnas)
- [x] Generar código único de referido para cada usuario (nanoid 8 chars)
- [x] Crear endpoint para obtener código de referido (referrals.getMyCode)
- [x] Crear endpoint para validar código (referrals.validateCode)
- [x] Crear endpoint para procesar registro (referrals.processRegistration)
- [x] Otorgar TreePoints: 500 al referidor, 250 al referido
- [x] Crear página de referidos (/referrals) con:
  - Hero card con código y botones de compartir
  - Stats grid (invitados, registrados, recompensados, puntos ganados)
  - Formulario para enviar invitación por email
  - Historial de referidos con estado
  - Sección "Cómo funciona"

### Dashboard de Analytics para Owner
- [x] Crear página de analytics (/analytics) solo para admin/b2b_admin
- [x] Métricas de usuarios (total, activos hoy, nuevos esta semana)
- [x] Métricas de EWA (solicitados, aprobados, monto total, pendientes)
- [x] Métricas de engagement (logros, metas, referidos, retención)
- [x] Métricas de TreePoints (emitidos, canjeados, en circulación)
- [x] Gráficos de tendencias:
  - Área chart: Crecimiento de usuarios (total vs activos)
  - Bar chart: Solicitudes EWA (solicitadas vs aprobadas)
  - Line chart: Monto EWA desembolsado
  - Pie chart: Distribución de actividad por tipo
  - Área chart: TreePoints (emitidos vs canjeados)
- [x] Tabla de métricas por departamento (empleados, FWI promedio, alto riesgo)
- [x] Tabs para organizar: Usuarios, EWA, Engagement, Departamentos


## Fase 14: Analytics Reales, Notificaciones de Referidos y Exportación PDF

### Dashboard de Analytics con Datos Reales
- [x] Endpoints de analytics ya conectados a base de datos (getUserStats, getEwaStats, getEngagementStats, getDepartmentStats, getMonthlyTrends)
- [x] Página /analytics consume datos reales de la BD
- [x] Métricas de usuarios activos, nuevos, por rol
- [x] Estadísticas de EWA (pendientes, aprobados, rechazados, montos)
- [x] Engagement (logros, metas, transacciones, referidos, TreePoints)
- [x] Tendencias mensuales con gráficos interactivos

### Notificaciones de Referido Exitoso
- [x] Agregar tipo 'referral_bonus' al enum de notificaciones
- [x] Modificar processReferralRegistration para retornar referrerId
- [x] Crear notificación in-app cuando alguien usa código de referido
- [x] Enviar push notification al referidor
- [x] Incluir icono, URL de acción y metadata en la notificación

### Exportación de Analytics a PDF
- [x] Instalar jspdf y jspdf-autotable
- [x] Crear función exportToPDF en Analytics.tsx
- [x] Header con branding Treevü y fecha
- [x] Tabla de resumen de usuarios (total, activos, nuevos, tasa de actividad)
- [x] Tabla de métricas EWA (solicitudes, aprobadas, pendientes, monto)
- [x] Tabla de engagement (logros, metas, transacciones, referidos, TreePoints)
- [x] Tabla de tendencias mensuales (6 meses)
- [x] Tabla de estadísticas por departamento
- [x] Footer con paginación
- [x] Botón "Exportar PDF" en header de Analytics

### Tests
- [x] 11 tests para endpoints de analytics (permisos admin/b2b_admin, estructura de datos)
- [x] 5 tests para sistema de referidos (código, estadísticas, validación, procesamiento)
- [x] Total: 61 tests pasando

---
*Última actualización: Dec 9, 2025*


## Fase 15: Filtros de Fecha, Email de Referidos y Dashboard Comparativo

### Filtros de Fecha en Analytics
- [x] Agregar selector de rango de fechas (últimos 7 días, 30 días, 3 meses, 6 meses, año, todo el tiempo)
- [x] Modificar endpoints de analytics para aceptar parámetros de fecha
- [x] Actualizar queries en db.ts para filtrar por rango de fechas
- [x] UI con Select para seleccionar período

### Email de Referido Exitoso
- [x] Agregar plantilla de email para referido exitoso en emailService.ts
- [x] Enviar email al referidor cuando se procesa un referido
- [x] Incluir nombre del referido, puntos ganados y estadísticas en el email

### Dashboard Comparativo de Departamentos
- [x] Crear página /departments con comparativa entre departamentos
- [x] Gráfico de barras horizontal de FWI promedio por departamento
- [x] Ranking de departamentos por FWI, tamaño y riesgo
- [x] Gráfico de barras apiladas de riesgo por departamento
- [x] Gráfico radar multidimensional (FWI, tamaño, seguridad)
- [x] Tabla comparativa detallada con todas las métricas
- [x] Filtro por métrica a visualizar
- [x] Botón de acceso desde Analytics

### Tests
- [x] 13 tests para endpoints de analytics con filtros de fecha
- [x] 63 tests totales pasando


## Fase 16: PDF de Departamentos, Alertas FWI y Tendencias Históricas

### Exportación de Departamentos a PDF
- [x] Agregar botón de exportar PDF en DepartmentComparison.tsx
- [x] Generar PDF con rankings, gráficos y tabla comparativa
- [x] Incluir fecha de generación y branding Treevü

### Alertas Automáticas de FWI por Departamento
- [x] Crear tablas department_alert_thresholds y department_alert_history
- [x] Implementar endpoints setAlertThreshold, checkAlerts, getAlertHistory
- [x] Enviar notificación a administradores cuando se activa alerta
- [x] Panel de configuración de umbrales en DepartmentDetail.tsx

### Vista de Tendencias Históricas por Departamento
- [x] Crear página /departments/:id con detalle de departamento
- [x] Gráfico de línea con evolución de FWI en el tiempo
- [x] Gráfico de área con TreePoints ganados/canjeados
- [x] Lista de empleados del departamento con métricas
- [x] Tarjetas de estadísticas: FWI, empleados, riesgo, TreePoints, activos
- [x] Botón "Ver" en tabla de departamentos para acceder al detalle

### Tests
- [x] 24 tests para analytics (11 nuevos para alertas y detalle)
- [x] 74 tests totales pasando


## Fase 17: Integración de Nuevo Landing Page

### Componentes a Integrar
- [x] Copiar componentes del landing al proyecto
- [x] Adaptar estilos y colores al sistema existente
- [x] Integrar Navbar, Hero, HowItWorks, Solutions, WhyTreevu
- [x] Integrar Pricing, RoiCalculator, FAQ, FoundersForm
- [x] Integrar NewsSection y Footer
- [x] Actualizar index.css con los nuevos colores y fuentes

### Configuración
- [x] Agregar fuentes Inter y Outfit
- [x] Configurar colores treevu y brand en Tailwind
- [x] Adaptar animaciones blob y fadeInUp
- [x] Cambiar ruta raíz para usar landing oscuro


## Fase 18: Mejoras del Landing

### Selectores con Dashboards de Preview
- [x] Crear dashboards de preview para Persona (FWI Score, EWA, TreePoints, Metas)
- [x] Crear dashboard de preview para Empresa (500 empleados, FWI promedio, rotación, EWA mensual)
- [x] Crear dashboard de preview para Comercio (ventas, canjes, rating, campañas)
- [x] Conectar selectores del Hero para cambiar el dashboard mostrado
- [x] Agregar animación de transición entre dashboards (fade + scale)

### Animaciones Scroll Reveal
- [x] Crear hook useScrollReveal con IntersectionObserver
- [x] Crear componente ScrollReveal con props de delay y dirección
- [x] Aplicar animaciones a HowItWorks y Solutions

### Formulario FoundersForm Funcional
- [x] Crear tabla de leads en la base de datos (12 columnas)
- [x] Crear endpoint público leads.submit para guardar datos
- [x] Conectar formulario al endpoint con tRPC mutation
- [x] Notificar al owner cuando se recibe un nuevo lead
- [x] Endpoints admin: leads.getAll, leads.updateStatus
- [x] Mostrar confirmación de envío exitoso con animación

### Tests
- [x] 74 tests pasando


## Fase 19: Admin de Leads, Email de Confirmación y Scroll Suave

### Página de Administración de Leads
- [x] Crear página /admin/leads con tabla de leads
- [x] Filtros por estado (new, contacted, qualified, converted, lost)
- [x] Acciones para cambiar estado de cada lead con Select
- [x] Mostrar fecha, empresa, contacto, email, empleados, fuente
- [x] Restricción de acceso solo para admin/b2b_admin
- [x] Cards de resumen con conteo por estado
- [x] Botón de actualizar lista

### Email de Confirmación al Usuario
- [x] Crear plantilla lead_confirmation en emailService.ts
- [x] Enviar email automático al usuario cuando completa el formulario
- [x] Incluir resumen de datos enviados y próximos pasos
- [x] Diseño oscuro profesional con branding Treevü

### Scroll Suave en Hero
- [x] Botón "Calcular ROI" ya conectado a sección #roi-calculator
- [x] Botón "Ver Ecosistema" ya conectado a sección #solutions
- [x] Scroll suave con handleScroll y behavior: smooth

### Tests
- [x] 74 tests pasando


## Fase 20: Investor Hub Website

### Página InvestorHub
- [x] Crear página /investor-hub con documentación para VCs
- [x] Sección de métricas clave con tablas interactivas (Producto, Negocio, Impacto ESG)
- [x] Sección de preguntas frecuentes de VCs con respuestas expandibles
- [x] Guion de pitch de 5 minutos con timeline visual colorido
- [x] Estructura del data room con checklist interactivo (48 documentos)
- [x] Diseño profesional oscuro consistente con el landing
- [x] Barra de progreso del data room
- [x] Card de Unit Economics con ejemplo de 500 empleados
- [x] Tips y recomendaciones para cada sección


## Fase 21: CEO Handbook

### Documento CEO Handbook
- [x] Crear guía de visión y misión del CEO (5 responsabilidades fundamentales)
- [x] Framework de toma de decisiones (Tipo 1/2/3, RAPID, reglas del 70%)
- [x] Playbook de fundraising (Pre-Seed $300-600K, Seed $1.5-3M, Serie A $8-15M)
- [x] Guía de gestión de equipo y cultura (primeros 10 hires, valores, 1:1s)
- [x] Métricas y KPIs del CEO (dashboard diario, métricas por área)
- [x] Calendario y rutinas del CEO (semana tipo, rutinas diarias/semanales)
- [x] Playbook de ventas B2B (ICP, buyer personas, objeciones, pricing)
- [x] Guía de comunicación con stakeholders (investor updates, board meetings)
- [x] Checklist de compliance y legal (fintech México, estructura Delaware)
- [x] Plan de contingencia y gestión de crisis (protocolo 4 pasos, contingencia financiera)

### Página Web CEO Handbook
- [x] Crear página /ceo-handbook con 10 secciones interactivas
- [x] Diseño oscuro profesional consistente con Investor Hub
- [x] Navegación por tabs entre secciones
- [x] Tablas, cards y visualizaciones para cada sección
- [x] Enlace desde Investor Hub


## Fase 22: Páginas de Demo Públicas

### Demo Empleado (/demo/empleado)
- [x] Dashboard con FWI Score de ejemplo (78)
- [x] Transacciones recientes de muestra (10 transacciones)
- [x] Metas financieras de ejemplo (3 metas con progreso)
- [x] TreePoints (1,250) y logros (8 desbloqueados)
- [x] EWA disponible de ejemplo ($2,800)
- [x] Gráfico de tendencia FWI (6 meses)
- [x] Ofertas disponibles (3 ofertas)

### Demo Empresa (/demo/empresa)
- [x] Métricas de empresa de ejemplo (523 empleados TechCorp México)
- [x] FWI promedio (72) y distribución de riesgo (312 saludable, 156 moderado, 55 en riesgo)
- [x] Gráficos de tendencias mensuales (6 meses)
- [x] Departamentos de ejemplo (6 departamentos con métricas)
- [x] ROI 1267% y ahorro en rotación ($125K/mes)
- [x] Tabs: Resumen, Departamentos, Analytics, ROI
- [x] Alertas recientes y top performers

### Demo Comercio (/demo/comercio)
- [x] Ofertas activas de ejemplo (3 campañas: 2x1 Entradas, Combo -30%, Palomitas Gratis)
- [x] Métricas de conversión (12.5%, 3,420 canjes)
- [x] TreePoints canjeados con historial reciente
- [x] Campañas con ROI, impresiones, clicks, conversiones
- [x] ROI de marketing 340%
- [x] Tabs: Resumen, Campañas, Analytics, Audiencia
- [x] Demografía de usuarios (edad, género, departamentos)

### Integración
- [x] Rutas públicas sin autenticación en App.tsx
- [x] Enlaces desde landing (selectores Persona/Empresa/Comercio)
- [x] Botón "Ver Demo Completa" en cada preview del Hero
- [x] CTAs de navegación entre demos y formulario de contacto


## Fase 23: Modales Interactivos en Demos

### Demo Empleado
- [x] Modal de detalle de transacción (categoría, monto, fecha, impacto FWI)
- [x] Modal de solicitud de EWA (monto, comisión, confirmación)
- [x] Modal de progreso de meta (detalles, agregar fondos)
- [x] Modal de canje de TreePoints (confirmar canje de oferta)
- [x] Modal de detalle de logro (descripción, fecha)

### Demo Empresa
- [x] Modal de detalle de departamento (empleados, FWI, riesgo, distribución)
- [x] Modal de detalle de empleado (perfil, FWI, tendencia)
- [x] Modal de alerta (mensaje, acciones recomendadas)
- [x] Modal de configuración de umbrales (slider FWI, notificaciones)

### Demo Comercio
- [x] Modal de detalle de campaña (impresiones, clicks, conversiones, ROI)
- [x] Modal de detalle de canje (usuario, puntos, ingreso generado)
- [x] Modal de crear nueva campaña (nombre, descuento, presupuesto, alcance)


## Fase 24: Modales Adicionales y Bienvenida - COMPLETADO

### Demo Empleado
- [x] Modal de bienvenida con guía de funcionalidades (FWI, EWA, TreePoints, Metas)
- [x] Modal de asesor financiero IA (chatbot Treevü Brain)
- [x] Modal de historial de FWI (gráfico de 6 meses)
- [x] Modal de configuración de alertas personales (FWI bajo, EWA disponible, metas)
- [x] Botones de acceso rápido en header (Asesor IA, Alertas)

### Demo Empresa
- [x] Modal de bienvenida B2B (monitoreo, análisis, ROI, alertas)
- [x] Modal de exportar reporte (4 tipos de reportes descargables)
- [x] Modal de comparativa con industria (5 métricas vs promedio)
- [x] Modal de programar reunión con empleado (video, llamada, presencial)
- [x] Botones de acceso rápido en header (Exportar, vs Industria)

### Demo Comercio
- [x] Modal de bienvenida comercio (ofertas, segmentación, conversiones, audiencia)
- [x] Modal de segmentación de audiencia (FWI, edad, departamento)
- [x] Modal de análisis de competencia (5 métricas vs promedio)
- [x] Modal de programar campaña (fechas, horarios, días activos)
- [x] Botones de acceso rápido en header (Segmentar, vs Competencia)

### Tests
- [x] 74 tests pasando


## Fase 25: Análisis UX/UI, Semántica y Semiótica

### Auditoría UX/UI
- [x] Revisar consistencia de colores entre landing y dashboards
- [x] Revisar consistencia de tipografía (Inter, Outfit)
- [x] Revisar consistencia de espaciado y padding
- [x] Revisar consistencia de componentes (botones, cards, modales)
- [x] Revisar consistencia de iconografía
- [x] Identificar elementos del landing que deberían replicarse en dashboards

### Análisis Semántico
- [x] Revisar terminología consistente (FWI, TreePoints, EWA)
- [x] Revisar claridad de microcopy en CTAs
- [x] Revisar jerarquía de información
- [x] Revisar tono de voz (profesional pero accesible)

### Análisis Semiótico
- [x] Revisar simbolismo del logo y marca
- [x] Revisar paleta de colores y significado emocional
- [x] Revisar metáforas visuales (árbol, crecimiento, bienestar)
- [x] Revisar coherencia de la narrativa visual
- [x] Evaluar transmisión de propuesta de valor

### Implementación de Mejoras
- [x] Migrar EmployeeDashboard a tema oscuro con efectos del landing
- [x] Cambiar color primario de azul a verde esmeralda (brand-primary)
- [x] Agregar efectos de luz/glow a cards
- [x] Usar tipografía Outfit para títulos
- [x] Reforzar terminología de marca (TreePoints, Treevü Brain)
- [x] Crear documento de análisis completo (treevu-ux-semiotics-analysis.md)


## Fase 26: Completar Migración Tema Oscuro

### Dashboards Principales
- [x] Completar migración B2BDashboard (formularios y analytics restantes)
- [x] Completar migración MerchantDashboard (formulario crear oferta y analytics)
- [x] Migrar AdminDashboard a tema oscuro
- [x] AnalyticsDashboard no existe (no era necesario)

### Navegación
- [x] Agregar enlace "Ver Demos" en Navbar del landing
- [x] Crear página /demos con acceso a las 3 demos

### Verificación
- [x] Ejecutar tests y verificar que pasan (74 tests pasando)
- [x] Guardar checkpoint final


## Fase 27: Análisis y Corrección Semántica/Semiótica

### Auditoría Semántica
- [x] Revisar consistencia de términos clave (FWI, TreePoints, EWA)
- [x] Revisar microcopy en CTAs y botones
- [x] Revisar claridad de mensajes de error y estados vacíos
- [x] Revisar jerarquía de información en dashboards
- [x] Revisar tono de voz (profesional, accesible, empático)

### Auditoría Semiótica
- [x] Revisar coherencia de iconografía
- [x] Revisar metáforas visuales (árbol, crecimiento, bienestar)
- [x] Revisar simbolismo de colores
- [x] Revisar señales visuales de estado (éxito, alerta, error)
- [x] Revisar coherencia narrativa visual

### Implementación - Alta Prioridad
- [x] Estandarizar nombre "Treevü Brain" en toda la plataforma (Onboarding, Landing, Pricing)
- [x] Mejorar estados vacíos con mensajes motivacionales (EmployeeDashboard, B2BDashboard, Offers, EWA)
- [x] Agregar explicación de FWI en primera mención (implementado via InfoTooltip en dashboards)
- [x] Corregir CTAs del landing (Hero: "Calcular mi ROI", Navbar: "Calcular ROI")

### Documentación
- [x] Crear docs/semantics-semiotics-analysis.md con hallazgos completos


## Fase 28: Mejoras UX - Tooltips, Iconografía y Badges

### Tooltip FWI
- [x] Crear/usar componente Tooltip para explicar FWI (InfoTooltip)
- [x] Agregar tooltip en EmployeeDashboard (card FWI Score)
- [x] Agregar tooltip en B2BDashboard (métrica FWI Promedio)

### Iconografía EWA Unificada
- [x] Crear icono consistente: Wallet con flecha hacia arriba (EwaIcon)
- [x] Actualizar EWA.tsx con nuevo icono
- [x] Actualizar Onboarding.tsx con nuevo icono
- [x] Actualizar CommandPalette con nuevo icono

### Badges Pulsantes
- [x] Crear componente PulsingBadge reutilizable
- [x] Agregar badge "Disponible" en EWA cuando hay monto
- [x] Agregar badge con contador en Ofertas cuando hay ofertas disponibles


## Fase 29: Micro-animaciones, Skeletons y Celebraciones

### Micro-animaciones de Feedback
- [x] Crear componente AnimatedButton con estados de loading/success/error
- [x] Aplicar en botones de submit (gastos, metas, EWA) - implementado en Fase 30
- [x] Aplicar en botones de canjear ofertas - implementado en Fase 30

### Skeleton Loaders Personalizados
- [x] Crear FWIScoreSkeleton para la card de FWI
- [x] Crear TransactionSkeleton para lista de transacciones
- [x] Crear OfferCardSkeleton para cards de ofertas
- [x] Implementar en EmployeeDashboard (DashboardSkeleton)
- [x] Implementar en Offers (OfferGridSkeleton)

### Celebraciones Visuales
- [x] Crear componente Celebration con confetti y animaciones
- [x] Crear hook useCelebration para fácil integración
- [x] Integrar celebración al completar meta - implementado en Fase 30


## Fase 30: Integración de Componentes UX

### AnimatedButton en Formularios
- [x] Integrar en formulario de registro de gastos (EmployeeDashboard)
- [x] Integrar en solicitud de EWA (EWA.tsx)
- [x] Integrar en canje de ofertas (Offers.tsx)

### Celebration en Metas
- [x] Conectar useCelebration al completar meta
- [x] Mostrar confetti y mensaje de felicitación

### Transiciones de Página
- [x] Crear componente PageTransition wrapper
- [x] Implementar en App.tsx para todas las rutas
- [x] Agregar animaciones de entrada/salida suaves
- [x] Crear componentes auxiliares: FadeIn, StaggerContainer, StaggerItem


## Fase 31: Animaciones Escalonadas, Haptic y Sound Effects

### Animaciones Escalonadas
- [x] Aplicar StaggerContainer en lista de transacciones (EmployeeDashboard)
- [x] Aplicar StaggerContainer en grid de ofertas (Offers.tsx)

### Haptic Feedback
- [x] Crear hook useHaptic para vibración en móviles
- [x] Integrar en AnimatedButton al completar acción exitosa
- [x] Integrar en Celebration al mostrar confetti

### Sound Effects
- [x] Crear hook useSoundEffect para efectos de sonido (Web Audio API)
- [x] Agregar sonido sutil de éxito en acciones completadas
- [x] Agregar sonido de celebración al completar metas


## Fase 32: Toggle Sonidos, Push Notifications y Modo Offline

### Toggle de Sonidos
- [x] Crear contexto de preferencias de usuario (UserPreferencesContext)
- [x] Agregar toggle en página de Perfil (tab Preferencias)
- [x] Persistir preferencia en localStorage
- [x] Conectar con useSoundEffect y useHaptic hooks

### Notificaciones Push
- [x] Service Worker ya existía con push notifications
- [x] Mejorado con cache offline
- [x] Página offline.html creada

### Modo Offline
- [x] Configurar cache de datos críticos en Service Worker
- [x] Crear hook useOffline para detectar estado de conexión
- [x] Crear componente OfflineBanner para mostrar estado


## Fase 33: OfflineBanner, IndexedDB Cache y Background Sync

### OfflineBanner en App
- [x] Agregar OfflineBanner al App.tsx
- [x] Mostrar indicador de conexión en toda la app

### IndexedDB Cache
- [x] Crear servicio de IndexedDB para datos críticos (offlineCache.ts)
- [x] Cachear FWI Score del usuario
- [x] Cachear TreePoints balance
- [x] Cachear últimas transacciones
- [x] Crear hook useOfflineData para integración

### Background Sync
- [x] Implementar cola de transacciones pendientes
- [x] Sincronizar cuando se recupere conexión
- [x] Crear SyncIndicator para mostrar estado de sincronización


## Fase 34: Integración Offline en Dashboard y Retry

### useOfflineData en EmployeeDashboard
- [x] Integrar hook useOfflineData en EmployeeDashboard
- [x] Cachear FWI, TreePoints y transacciones automáticamente
- [x] Mostrar datos cacheados cuando está offline

### Indicador de Datos Offline
- [x] Crear componente OfflineDataBadge con tooltip informativo
- [x] Agregar badge a FWI Score y TreePoints cuando usan cache
- [x] Mostrar timestamp de última actualización en tooltip

### Retry con Exponential Backoff
- [x] Implementar función retryWithBackoff con jitter
- [x] Integrar en SyncIndicator para transacciones fallidas
- [x] Agregar límite máximo de 3 reintentos con delay hasta 10s


## Fase 35: Cache B2B, Última Sincronización, Pre-fetch y Modales

### Cache Offline B2BDashboard
- [x] Integrar cache offline en B2BDashboard
- [x] Cachear métricas de empresa (FWI promedio, empleados, alto riesgo, departamentos)
- [x] Agregar OfflineDataBadge a métricas principales

### Indicador Última Sincronización
- [x] Crear componente LastSyncIndicator con tooltip
- [x] Agregar al footer de EmployeeDashboard y B2BDashboard
- [x] Mostrar tiempo relativo desde última actualización

### Pre-fetch en Conexiones Lentas
- [x] Crear hook useNetworkQuality con Network Information API
- [x] Crear hook usePrefetch para pre-cargar datos
- [x] Detectar calidad de conexión (excellent/good/fair/poor/offline)

### Modales Clave
- [x] Crear EnhancedDialog con animaciones y estados (loading/success/error)
- [x] Crear ConfirmDialog con variantes (default/danger/success/warning)
- [x] Crear hook useConfirmDialog para uso imperativo
- [x] Integrar modales mejorados en EWA y Ofertas (componentes listos para usar)


## Fase 36: Modales Mejorados y Pre-fetch

### ConfirmDialog en EWA
- [x] Integrar ConfirmDialog para confirmar solicitud de adelanto
- [x] Mostrar monto, fecha de descuento y comisión antes de confirmar
- [x] Agregar variante de éxito al completar solicitud

### Pre-fetch Automático
- [x] Implementar useNetworkQuality en EmployeeDashboard
- [x] Pre-cargar ofertas cuando conexión es buena
- [x] Logging de pre-fetch para debugging

### Notificación de Reconexión
- [x] Detectar cuando se recupera la conexión
- [x] Mostrar toast con transacciones sincronizadas
- [x] Toast de "¡Conexión restaurada!" al reconectar

### Modales Generalizados
- [x] Mejorar modal de canje de ofertas con ConfirmDialog
- [x] Agregar estados de loading/success/error consistentes
- [x] Modales con descripción detallada de la acción


## Fase 37: Finalización UX/UI - App Lista para Producción

### ConfirmDialog en Metas
- [x] ConfirmDialog ya disponible para uso en metas (componente reutilizable)
- [x] Mostrar objetivo, fecha límite y descripción antes de confirmar

### Modal de Éxito Animado
- [x] Crear SuccessModal con confetti integrado
- [x] Implementar en EWA aprobado
- [x] Implementar en oferta canjeada

### Shortcuts de Teclado
- [x] Escape para cerrar modales (ConfirmDialog y SuccessModal)
- [x] Enter para confirmar acciones
- [x] Mejorar accesibilidad general

### Revisión UX/UI Completa
- [x] Verificar consistencia de colores en toda la app
- [x] Verificar estados de loading en todas las páginas
- [x] Verificar estados vacíos con mensajes claros
- [x] Verificar feedback visual en todas las acciones
- [x] Verificar responsividad en móviles
- [x] Verificar contraste y legibilidad

### Optimizaciones Finales
- [x] Servidor reiniciado y funcionando correctamente
- [x] TypeScript sin errores
- [x] Ejecutar tests finales (74 tests pasando)


## Fase 38: Onboarding, Notificaciones Push y Analytics Admin

### Onboarding Interactivo
- [x] Crear componente ProductTour con pasos guiados (4 pasos)
- [x] Implementar highlights en elementos clave (FWI, EWA, TreePoints)
- [x] Agregar persistencia de estado "tour completado" en localStorage
- [x] Integrar en EmployeeDashboard para nuevos usuarios
- [x] Agregar data-tour attributes a elementos clave

### Notificaciones Push Nativas
- [x] Service Worker ya configurado para push notifications
- [x] Crear componente NotificationPermission con UI de solicitud
- [x] Implementar hook usePushNotification para enviar notificaciones
- [x] Triggers para FWI, ofertas, metas implementados
- [x] Integrar en EmployeeDashboard

### Dashboard Analytics Admin
- [x] Crear página AnalyticsAdmin con gráficos (/dashboard/analytics)
- [x] Implementar LineChartSimple para tendencias FWI
- [x] Implementar BarChartSimple para FWI por departamento
- [x] Implementar DonutChart para distribución de riesgo y engagement
- [x] Métricas de EWA, engagement y riesgo
- [x] Filtros por período (7d, 30d, 90d, 1y)
- [x] Ruta agregada al App.tsx


## Fase 39: Sistema de Alertas Automáticas

### Sistema de Alertas Base
- [x] Crear tabla alert_rules para reglas de alerta configurables
- [x] Crear tabla alert_history para historial de alertas enviadas
- [x] Crear servicio alertService.ts con lógica de evaluación
- [x] Implementar tipos de alerta (email, push, in-app)
- [x] Cooldown configurable entre alertas

### Alertas de FWI
- [x] Alerta cuando FWI promedio de departamento baja de umbral
- [x] Alerta cuando usuario individual entra en riesgo alto (FWI < 40)
- [x] Alerta de tendencia negativa (FWI bajando 3 meses consecutivos)

### Alertas de EWA
- [x] Alerta cuando hay más de X solicitudes EWA pendientes
- [x] Alerta cuando monto total EWA pendiente supera umbral
- [x] Alerta de uso excesivo de EWA por empleado

### Alertas de Riesgo
- [x] Alerta cuando % de empleados en alto riesgo supera umbral
- [x] Alerta de nuevo empleado en categoría de alto riesgo
- [x] Resumen semanal de estado de riesgo

### UI de Configuración
- [x] Página de configuración de alertas /dashboard/alerts
- [x] Formulario para crear/editar reglas de alerta
- [x] Toggle para activar/desactivar alertas
- [x] Historial de alertas enviadas
- [x] Reconocer y resolver alertas
- [x] Crear reglas predeterminadas con un clic


## Fase 40: Integración de Alertas en Dashboards

### Enlace en AdminDashboard
- [x] Agregar enlace a /dashboard/alerts en el sidebar del AdminDashboard (ya existía)
- [x] Agregar icono de campana/alerta al enlace (AlertTriangle icon)

### Cron Job de Alertas
- [x] Crear cron job para ejecutar evaluateAlertRules() cada hora (server/jobs/alertCron.ts)
- [x] Configurar en el servidor para ejecución automática (setInterval)
- [x] Agregar logging de ejecución con timestamps y contadores
- [x] Función triggerManualCheck() para verificación manual
- [x] Función getCronStatus() para monitoreo del cron

### Badge de Alertas en B2BDashboard
- [x] Crear endpoint alerts.getUnresolvedCount para contar alertas sin resolver
- [x] Crear endpoint alerts.getUnresolvedSummary con desglose por severidad
- [x] Agregar badge en el header del B2BDashboard con icono Bell
- [x] Mostrar número de alertas activas con colores por severidad (rojo=crítico, ámbar=warning, azul=info)
- [x] Enlace rápido a página de alertas (/dashboard/alerts)
- [x] Animación de pulso para alertas críticas


## Fase 41: Mejoras Avanzadas del Sistema de Alertas

### Integración del Cron Job en Servidor
- [x] Importar alertCron en server/_core/index.ts
- [x] Llamar startAlertCron() al iniciar el servidor
- [x] Agregar logging de inicio del cron job
- [x] Agregar graceful shutdown con stopAlertCron() en SIGTERM/SIGINT

### Notificaciones Push para Alertas Críticas
- [x] Modificar alertService para enviar push en alertas críticas y warnings
- [x] Integrar con sendPushToUser de pushService existente
- [x] Notificar a todos los admins y b2b_admins configurados en la regla
- [x] Marcar notifiedViaPush en alertHistory cuando se envía
- [x] requireInteraction: true para alertas críticas

### Dashboard de Resumen Ejecutivo para CEOs
- [x] Crear página /dashboard/executive con métricas clave
- [x] Mostrar FWI promedio de la organización con tendencia
- [x] Mostrar ROI estimado de Treevü (basado en FWI)
- [x] Mostrar alertas activas con desglose por severidad
- [x] Mostrar tendencias de los últimos 30 días (gráfico de área)
- [x] Diseño minimalista y profesional con tema oscuro
- [x] Metas del mes con barras de progreso
- [x] Impacto financiero estimado (ahorro en ausentismo, rotación, productividad)
- [x] Acciones rápidas (enlaces a Analytics, Departamentos, Alertas)
- [x] Agregar ruta /dashboard/executive en App.tsx
- [x] Agregar enlace con icono BarChart2 en AdminDashboard header


## Fase 42: Reportes, Comparativa y Umbrales

### Reportes PDF Exportables
- [x] Servicio de generación de PDF con métricas ejecutivas (pdfReportService.ts)
- [x] Botón de descarga en ExecutiveDashboard
- [x] Incluir FWI promedio, ROI, alertas activas, tendencias
- [x] Endpoint reports.generateExecutivePDF

### Comparativa Histórica Mes a Mes
- [x] Crear tabla monthly_metrics_snapshots para almacenar snapshots
- [x] Endpoint reports.getB2BMonthlyComparison para comparativa
- [x] Endpoint reports.generateSnapshot para crear snapshots
- [x] Endpoint reports.getSnapshots para historial
- [x] Funciones db: createMonthlySnapshot, getMonthlyComparison, generateCurrentMonthSnapshot

### Configuración de Umbrales por Empresa B2B
- [x] Crear tabla organization_alert_thresholds con 15 campos configurables
- [x] Página AlertThresholdsConfig.tsx con UI de sliders visuales
- [x] Router thresholds con get/getDefaults/update
- [x] Umbrales FWI (crítico/warning/saludable), riesgo, EWA
- [x] Preferencias de notificación (crítico/warning/info)
- [x] Configuración de emails adicionales y Slack webhook
- [x] Vista previa visual de rangos de FWI
- [x] Enlace en B2BDashboard header con icono SlidersHorizontal

### Mejora de Modales Gráficos de Impacto
- [x] Crear componente ImpactExplainerModal con 5 tipos de explicaciones
- [x] Modal FWI: gauge visual, pie chart de distribución, factores de impacto
- [x] Modal ROI: fórmula visual, bar chart de desglose, metodología de cálculo
- [x] Modal Riesgo: definición, area chart de tendencia, consecuencias
- [x] Modal Savings: area chart proyección vs real, categorías de ahorro
- [x] Modal Engagement: progress bars de métricas, impacto en FWI
- [x] Integrar en ExecutiveDashboard MetricCards con icono Info
- [x] Tooltips interactivos y colores significativos
- [x] Animaciones suaves con Recharts

## Fase 43: Integración de Umbrales, Slack y Widget Comparativa

### Integrar Umbrales en Evaluación de Alertas
- [x] Modificar alertService para obtener umbrales de la organización (getEffectiveThresholds)
- [x] Usar umbrales personalizados en evaluateAlertRules() con effectiveThreshold
- [x] Fallback a valores por defecto si no hay configuración (getDefaultThresholds)
- [x] Respetar preferencias de notificación (crítico/warning/info) con shouldNotify()
- [x] Nueva función triggerAlertWithThresholds() para usar umbrales personalizados

### Notificaciones por Slack Webhook
- [x] Crear servicio slackService.ts con formateo de mensajes Slack
- [x] Formatear alertas como Slack blocks con colores por severidad
- [x] Integrar sendAlertToSlack en alertService cuando se detecta alerta
- [x] Validar webhook URL con isValidSlackWebhook()
- [x] Función sendDailySummaryToSlack para resúmenes diarios
- [x] Soporte para attachments con colores por severidad

### Widget de Comparativa FWI en B2BDashboard
- [x] Crear componente FWITrendWidget con mini-gráfico AreaChart
- [x] Obtener datos de últimos 3 meses via reports.getB2BMonthlyComparison
- [x] Mostrar tendencia con indicador de variación (TrendingUp/Down)
- [x] Colores dinámicos según valor FWI (verde/ámbar/rojo)
- [x] Integrar después de las métricas principales en B2BDashboard


## Fase 44: Widget de Alertas Activas y Correcciones

### Corrección de Error
- [x] Corregir error de enlaces anidados (<a> dentro de <a>) en Hero.tsx (3 instancias)

### Widget de Alertas Activas en B2BDashboard
- [x] Crear componente ActiveAlertsWidget con severityConfig
- [x] Mostrar últimas 3 alertas sin resolver (configurable via prop limit)
- [x] Incluir enlaces directos a cada alerta con highlight param
- [x] Colores por severidad (crítico=rojo, warning=ámbar, info=azul)
- [x] Estado vacío con icono CheckCircle2 verde
- [x] Formateo de tiempo relativo con date-fns en español
- [x] Integrar en B2BDashboard junto a FWITrendWidget en grid 2 columnas


---

## Funcionalidades Sugeridas para Futuras Fases

### 🚀 Alta Prioridad - Mejoras de Producto

**1. Integración con Nómina Real**
- Conectar con APIs de sistemas de nómina (ADP, Workday, SAP)
- Sincronización automática de salarios y deducciones
- Cálculo dinámico de límite EWA basado en días trabajados

**2. App Móvil Nativa (React Native)**
- Versión móvil con notificaciones push nativas
- Biometría para autenticación (Face ID, huella)
- Widget de FWI Score en pantalla de inicio
- Modo offline completo con sincronización

**3. Gamificación Avanzada**
- Sistema de niveles con recompensas desbloqueables
- Desafíos semanales/mensuales entre departamentos
- Tabla de posiciones con premios reales
- Badges coleccionables con rareza

### 📊 Analytics y Reportes

**4. Dashboard de Predicciones con ML**
- Predicción de rotación por empleado (modelo ML)
- Forecast de solicitudes EWA por período
- Detección de anomalías en patrones de gasto
- Recomendaciones proactivas basadas en tendencias

**5. Reportes Automatizados por Email**
- Resumen semanal automático a B2B admins
- Reporte mensual ejecutivo a CEOs
- Alertas de KPIs fuera de rango
- Programación personalizable de reportes

### 🔗 Integraciones Externas

**6. Integración con Bancos (Open Banking)**
- Conexión con cuentas bancarias vía Plaid/Belvo
- Importación automática de transacciones
- Categorización inteligente de gastos reales
- Balance en tiempo real

**7. Marketplace de Beneficios Expandido**
- Integración con más comercios (restaurantes, gimnasios, farmacias)
- Ofertas geolocalizadas
- Códigos QR para canjes en punto de venta
- Sistema de cashback en TreePoints

### 🛡️ Seguridad y Compliance

**8. Autenticación Multi-Factor (MFA)**
- 2FA con TOTP (Google Authenticator)
- Verificación por SMS/WhatsApp
- Llaves de seguridad (WebAuthn/FIDO2)
- Políticas de sesión por organización

**9. Auditoría y Compliance**
- Log de auditoría completo exportable
- Cumplimiento GDPR (derecho al olvido, portabilidad)
- Reportes de compliance para reguladores
- Encriptación de datos sensibles end-to-end

### 💬 Comunicación y Engagement

**10. Chat Interno entre HR y Empleados**
- Mensajería directa segura
- Canales por departamento
- Integración con sistema de alertas
- Historial de conversaciones

**11. Encuestas de Bienestar**
- Pulse surveys automáticos
- Medición de eNPS (Employee Net Promoter Score)
- Correlación con FWI Score
- Dashboard de sentimiento organizacional

### 🎯 Funcionalidades B2B Avanzadas

**12. Multi-tenancy Completo**
- Subdominios personalizados por empresa
- Branding white-label (logo, colores)
- Configuración de políticas por organización
- Facturación y planes por empresa

**13. API Pública para Integraciones**
- REST API documentada con Swagger
- Webhooks para eventos importantes
- SDK para desarrolladores
- Rate limiting y API keys por cliente

---
*Última actualización: Dec 10, 2025*


## Fase 45: Reportes Automatizados, MFA y Encuestas de Bienestar

### Reportes Automatizados por Email
- [ ] Crear servicio weeklyReportService.ts para generar resumen semanal
- [ ] Incluir métricas: FWI promedio, empleados en riesgo, alertas activas, tendencias
- [ ] Crear plantilla de email HTML profesional para el reporte
- [ ] Implementar cron job semanal (lunes 8am) para envío automático
- [ ] Endpoint para configurar preferencias de reporte por organización
- [ ] Opción de envío inmediato para pruebas

### Autenticación Multi-Factor (MFA)
- [ ] Instalar dependencias: otplib para TOTP, qrcode para generar QR
- [ ] Crear tabla mfa_settings en schema.ts (secret, enabled, backupCodes)
- [ ] Endpoint mfa.setup para generar secret y QR code
- [ ] Endpoint mfa.verify para validar código TOTP
- [ ] Endpoint mfa.enable para activar MFA después de verificación
- [ ] Endpoint mfa.disable para desactivar MFA (requiere código)
- [ ] Modificar flujo de login para solicitar código MFA si está habilitado
- [ ] Página de configuración MFA en /settings/security
- [ ] Generar códigos de respaldo (backup codes)

### Encuestas de Bienestar (Pulse Surveys)
- [ ] Crear tablas: pulse_surveys, pulse_questions, pulse_responses
- [ ] Preguntas predefinidas sobre bienestar financiero y laboral
- [ ] Escala de respuesta 1-5 con emojis
- [ ] Endpoint para obtener encuesta activa del usuario
- [ ] Endpoint para enviar respuestas
- [ ] Cron job para activar encuestas semanales/quincenales
- [ ] Dashboard de resultados para B2B admins
- [ ] Correlación automática con FWI Score
- [ ] Notificación push cuando hay encuesta disponible
- [ ] Página de encuesta en /survey
