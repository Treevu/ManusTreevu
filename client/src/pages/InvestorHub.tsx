import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Briefcase,
  Shield,
  BarChart3,
  Folder,
  Download,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Building2,
  Cpu
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TabType = 'metrics' | 'questions' | 'pitch' | 'dataroom';

export default function InvestorHub() {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const tabs = [
    { id: 'metrics' as TabType, label: 'Métricas Clave', icon: BarChart3 },
    { id: 'questions' as TabType, label: '5 Preguntas VC', icon: MessageSquare },
    { id: 'pitch' as TabType, label: 'Guion 5 Min', icon: Clock },
    { id: 'dataroom' as TabType, label: 'Data Room', icon: Folder },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0B0B0C]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-xl font-bold">
                <span className="text-emerald-400">Treevü</span> Investor Hub
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Confidencial</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Briefcase className="w-4 h-4 mr-2" />
            Material para Inversores
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Todo lo que necesitas para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              evaluar Treevü
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Métricas clave, respuestas a preguntas frecuentes, guion de pitch y estructura del data room en un solo lugar.
          </p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-800 sticky top-[73px] bg-[#0B0B0C]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'metrics' && <MetricsSection />}
        {activeTab === 'questions' && (
          <QuestionsSection 
            expandedQuestion={expandedQuestion} 
            setExpandedQuestion={setExpandedQuestion} 
          />
        )}
        {activeTab === 'pitch' && <PitchSection />}
        {activeTab === 'dataroom' && (
          <DataRoomSection 
            checkedItems={checkedItems} 
            toggleCheck={toggleCheck} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Treevü © 2024 - Material Confidencial para Inversores</p>
          <p className="mt-2">Última actualización: Diciembre 2024</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// METRICS SECTION
// ============================================
function MetricsSection() {
  const productMetrics = [
    { name: 'MAU/Empleado', definition: '% de empleados activos mensualmente', targetPilot: '>40%', targetSerieA: '>60%' },
    { name: 'FWI Score Promedio', definition: 'Índice de bienestar financiero', targetPilot: 'Baseline → +15pts', targetSerieA: '+20pts en 6 meses' },
    { name: 'EWA Take Rate', definition: '% de empleados que usan adelanto', targetPilot: '15-25%', targetSerieA: '30-40%' },
    { name: 'EWA Frequency', definition: 'Solicitudes por usuario/mes', targetPilot: '1.5-2x', targetSerieA: '2-3x' },
  ];

  const businessMetrics = [
    { name: 'ARPE', definition: 'Revenue per Employee', formula: '(EWA fees + suscripción) / total empleados' },
    { name: 'Net Revenue Retention', definition: 'Retención de ingresos netos', formula: 'MRR mes actual de clientes existentes / MRR mes anterior' },
    { name: 'CAC', definition: 'Costo de adquisición por empresa', formula: 'Gasto ventas+marketing / nuevas empresas' },
    { name: 'LTV', definition: 'Valor de vida del cliente', formula: 'ARPE × empleados × meses promedio × margen' },
    { name: 'Payback Period', definition: 'Meses para recuperar CAC', formula: 'CAC / (ARPE × empleados × margen)' },
  ];

  const impactMetrics = [
    { name: 'Reducción de Rotación', definition: '% reducción vs baseline', why: 'Ahorro directo para empresa ($15K-$25K por empleado)' },
    { name: 'Reducción de Ausentismo', definition: 'Días menos de ausencia', why: 'Productividad recuperada' },
    { name: 'Ahorro en Préstamos Informales', definition: '$ ahorrado vs gota-gota', why: 'Impacto social medible' },
    { name: 'Mejora de FWI Score', definition: 'Puntos ganados promedio', why: 'Bienestar financiero real' },
  ];

  return (
    <div className="space-y-12">
      {/* Product Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold">Métricas de Producto (North Star)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Métrica</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Definición</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Target Piloto</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Target Serie A</th>
              </tr>
            </thead>
            <tbody>
              {productMetrics.map((metric, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-emerald-400">{metric.name}</td>
                  <td className="py-4 px-4 text-gray-300">{metric.definition}</td>
                  <td className="py-4 px-4 text-yellow-400">{metric.targetPilot}</td>
                  <td className="py-4 px-4 text-emerald-400">{metric.targetSerieA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold">Métricas de Negocio</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Métrica</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Definición</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Cómo Calcular</th>
              </tr>
            </thead>
            <tbody>
              {businessMetrics.map((metric, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-blue-400">{metric.name}</td>
                  <td className="py-4 px-4 text-gray-300">{metric.definition}</td>
                  <td className="py-4 px-4 text-gray-400 font-mono text-sm">{metric.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold">Métricas de Impacto (ESG)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Métrica</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Definición</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Por qué Importa</th>
              </tr>
            </thead>
            <tbody>
              {impactMetrics.map((metric, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-purple-400">{metric.name}</td>
                  <td className="py-4 px-4 text-gray-300">{metric.definition}</td>
                  <td className="py-4 px-4 text-gray-400">{metric.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unit Economics Card */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Unit Economics Ejemplo (500 empleados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-emerald-400">Por Empleado</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">EWA Take Rate:</span><span>25%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Monto promedio:</span><span>$3,000 MXN</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Fee:</span><span>4%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Suscripción B2B:</span><span>$80 MXN/mes</span></div>
                <div className="flex justify-between border-t border-gray-700 pt-2 font-semibold">
                  <span className="text-emerald-400">ARPE Total:</span>
                  <span className="text-emerald-400">$110 MXN (~$5.50 USD)</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-400">Por Empresa</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">MRR:</span><span>$55,000 MXN</span></div>
                <div className="flex justify-between"><span className="text-gray-400">ARR:</span><span>$660,000 MXN</span></div>
                <div className="flex justify-between"><span className="text-gray-400">CAC:</span><span>$60,000 MXN</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Payback:</span><span>1.1 meses</span></div>
                <div className="flex justify-between border-t border-gray-700 pt-2 font-semibold">
                  <span className="text-blue-400">LTV:CAC:</span>
                  <span className="text-blue-400">29.7x</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-400">Márgenes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Gross Margin:</span><span>75-80%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Costo fondeo EWA:</span><span>15-20%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Infraestructura:</span><span>3-5%</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Soporte:</span><span>2-3%</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// QUESTIONS SECTION
// ============================================
function QuestionsSection({ 
  expandedQuestion, 
  setExpandedQuestion 
}: { 
  expandedQuestion: number | null; 
  setExpandedQuestion: (q: number | null) => void;
}) {
  const questions = [
    {
      question: "¿Por qué ahora?",
      answer: `Tres factores convergen: (1) Post-pandemia, el 78% de empleados en LATAM reporta estrés financiero que afecta su productividad. (2) Las empresas están desesperadas por retener talento y reducir rotación que les cuesta 150% del salario anual. (3) La infraestructura de pagos en tiempo real (SPEI, PIX, transferencias inmediatas) finalmente permite EWA sin fricción. Treevü es el sistema operativo que conecta estos tres puntos.`,
      icon: Clock,
      color: 'emerald'
    },
    {
      question: "¿Cuál es tu moat/defensibilidad?",
      answer: `Tres capas de defensibilidad: (1) Data moat: Cada transacción entrena nuestro modelo de FWI Score, haciendo predicciones más precisas con más uso. (2) Network effects: Más empleados = más comercios quieren ofrecer descuentos = más valor para empleados. (3) Switching costs: Una vez integrados con nómina y RRHH, cambiar tiene costo operativo alto. Además, nuestro AI de clasificación de gastos con Gemini nos da 6-12 meses de ventaja técnica.`,
      icon: Shield,
      color: 'blue'
    },
    {
      question: "¿Cómo monetizan?",
      answer: `Tres revenue streams: (1) EWA fees: 3-5% del monto adelantado, pagado por empleado o subsidiado por empresa. En un piloto de 500 empleados con 25% take rate y $200 promedio, son $7,500/mes. (2) Suscripción B2B: $3-8 por empleado/mes por acceso a analytics, alertas de riesgo y dashboard. (3) Comisión de comercios: 2-3% de transacciones con TreePoints. El blended ARPE target es $5-8 por empleado.`,
      icon: DollarSign,
      color: 'yellow'
    },
    {
      question: "¿Quién es tu competencia y por qué ganarás?",
      answer: `Competencia directa: Minu, Payflow, Symmetrical en EWA puro. Competencia indirecta: Prestadero, Kueski en préstamos. Nuestra diferencia: ellos son productos transaccionales (adelanto y ya). Nosotros somos un sistema operativo de bienestar financiero que incluye EWA + gamificación + AI advisor + marketplace de beneficios. Es la diferencia entre un cajero automático y una app de banca digital. Además, nuestro modelo B2B2C nos da CAC 10x menor que D2C.`,
      icon: Users,
      color: 'purple'
    },
    {
      question: "¿Cuál es tu ask y uso de fondos?",
      answer: `Buscamos $600K para 18 meses de runway. Uso: 40% producto (2 ingenieros senior), 30% ventas (Head of Sales + 2 SDRs para cerrar 20 empresas), 20% operaciones (compliance, legal, licencias), 10% buffer. Milestones: 5,000 empleados cubiertos, $50K MRR, y métricas de retención para levantar Serie Seed de $2-3M.`,
      icon: Target,
      color: 'red'
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  };

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Las 5 Preguntas que te Harán los VCs</h3>
        <p className="text-gray-400">Respuestas preparadas para las preguntas más comunes en reuniones con inversores.</p>
      </div>

      {questions.map((q, i) => {
        const colors = colorClasses[q.color];
        const isExpanded = expandedQuestion === i;
        
        return (
          <div 
            key={i}
            className={`border rounded-xl overflow-hidden transition-all ${
              isExpanded ? colors.border : 'border-gray-700'
            }`}
          >
            <button
              onClick={() => setExpandedQuestion(isExpanded ? null : i)}
              className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${
                isExpanded ? colors.bg : 'hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <q.icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <span className="flex-1 font-semibold text-lg">
                Pregunta {i + 1}: "{q.question}"
              </span>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {isExpanded && (
              <div className="px-5 pb-5">
                <div className="pl-14">
                  <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-emerald-500">
                    <p className="text-gray-300 leading-relaxed">{q.answer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// PITCH SECTION
// ============================================
function PitchSection() {
  const pitchMinutes = [
    {
      minute: 1,
      title: "El Problema (Hook + Pain Point)",
      content: `"María gana $12,000 pesos al mes. El día 20, ya no tiene dinero. Pide prestado a un 'gota-gota' al 10% semanal. Llega estresada al trabajo, falta 2 días al mes, y está buscando otro empleo.

El 78% de los empleados en Latinoamérica vive esto. El estrés financiero le cuesta a las empresas el 15% de su nómina en rotación, ausentismo y baja productividad.

Las empresas gastan millones en beneficios que nadie usa. Mientras tanto, sus empleados están ahogándose financieramente."`,
      slide: "Estadística impactante",
      color: 'red'
    },
    {
      minute: 2,
      title: "La Solución",
      content: `"Treevü es el sistema operativo de bienestar financiero para empresas.

Para el empleado: Una app donde puede acceder a su salario ganado antes del día de pago, ver su 'FWI Score' de salud financiera calculado con IA, recibir consejos personalizados, y ganar TreePoints por buenos hábitos financieros.

Para la empresa: Un dashboard que muestra el bienestar financiero de su equipo, alertas tempranas de empleados en riesgo, y métricas de impacto en retención.

No es un préstamo. Es su propio dinero, ganado pero no cobrado. Sin deuda, sin intereses abusivos."`,
      slide: "Demo del producto",
      color: 'emerald'
    },
    {
      minute: 3,
      title: "El Mercado y Modelo de Negocio",
      content: `"El mercado de bienestar financiero en LATAM es de $50 mil millones. Solo en México hay 56 millones de empleados formales.

Nuestro modelo B2B2C:
• La empresa paga $3-8 por empleado/mes por el dashboard y analytics
• El empleado usa gratis la app y paga 3-5% solo si usa EWA
• Los comercios pagan 2-3% por acceso a nuestra base de usuarios

Con 500 empleados promedio por empresa y $6 ARPE, cada cliente vale $36K/año. Nuestro CAC es $3K. LTV:CAC de 12:1."`,
      slide: "TAM/SAM/SOM",
      color: 'blue'
    },
    {
      minute: 4,
      title: "Tracción y Equipo",
      content: `"Lo que hemos construido:
• Plataforma completa: 3 dashboards, EWA, gamificación, IA integrada
• [X] empresas en pipeline, [Y] en piloto activo
• [Z]% de empleados activos en pilotos
• FWI Score promedio mejoró [N] puntos en [M] semanas

El equipo:
• [Tu nombre], CEO: [Tu background relevante]
• [CTO/Cofundador]: [Background técnico]
• Advisors: [Nombres relevantes en fintech/HR]

Somos el equipo que puede ejecutar esto porque [razón específica]."`,
      slide: "Métricas y fotos del equipo",
      color: 'purple'
    },
    {
      minute: 5,
      title: "El Ask y Visión",
      content: `"Estamos levantando $600K para:
• Cerrar 20 empresas (10,000 empleados)
• Alcanzar $50K MRR
• Obtener licencias regulatorias

En 18 meses, seremos el estándar de bienestar financiero para empresas medianas en México. En 5 años, el sistema operativo financiero de 10 millones de trabajadores en LATAM.

La pregunta no es si las empresas van a invertir en bienestar financiero. La pregunta es quién va a ser el sistema operativo que lo habilite.

Nosotros ya lo construimos. Solo necesitamos escalar.

¿Preguntas?"`,
      slide: "Roadmap y uso de fondos",
      color: 'yellow'
    },
  ];

  const colorClasses: Record<string, string> = {
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Guion de Pitch de 5 Minutos</h3>
        <p className="text-gray-400">Estructura minuto a minuto para tu presentación a inversores.</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {pitchMinutes.map((minute, i) => (
          <div key={i} className="relative pl-8 pb-12 last:pb-0">
            {/* Timeline line */}
            {i < pitchMinutes.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-700" />
            )}
            
            {/* Timeline dot */}
            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${colorClasses[minute.color]} flex items-center justify-center text-white font-bold text-sm`}>
              {minute.minute}
            </div>

            {/* Content */}
            <div className="ml-4">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-xl font-bold">Minuto {minute.minute}: {minute.title}</h4>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                  Slide: {minute.slide}
                </span>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <pre className="whitespace-pre-wrap text-gray-300 font-sans leading-relaxed">
                  {minute.content}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            Tips para el Pitch
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• Personaliza los campos marcados con [X], [Y], [Z] con tus datos reales</p>
          <p>• Practica hasta que puedas hacerlo en exactamente 5 minutos</p>
          <p>• Prepara una demo en vivo del producto para el minuto 2</p>
          <p>• Lleva 3-5 slides de backup para preguntas comunes</p>
          <p>• Termina siempre con una pregunta para abrir el diálogo</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// DATA ROOM SECTION
// ============================================
function DataRoomSection({ 
  checkedItems, 
  toggleCheck 
}: { 
  checkedItems: Set<string>; 
  toggleCheck: (id: string) => void;
}) {
  const folders = [
    {
      id: '1',
      name: '1. Resumen Ejecutivo',
      icon: FileText,
      color: 'emerald',
      items: [
        { id: '1.1', name: 'Executive Summary (2 páginas)' },
        { id: '1.2', name: 'Pitch Deck (15-20 slides)' },
        { id: '1.3', name: 'One-Pager / Teaser' },
        { id: '1.4', name: 'FAQ para Inversores' },
      ]
    },
    {
      id: '2',
      name: '2. Equipo y Organización',
      icon: Users,
      color: 'blue',
      items: [
        { id: '2.1', name: 'Bios de Fundadores (CV + LinkedIn)' },
        { id: '2.2', name: 'Organigrama Actual' },
        { id: '2.3', name: 'Plan de Hiring (18 meses)' },
        { id: '2.4', name: 'Advisors y Board' },
        { id: '2.5', name: 'Referencias de Fundadores' },
      ]
    },
    {
      id: '3',
      name: '3. Producto y Tecnología',
      icon: Cpu,
      color: 'purple',
      items: [
        { id: '3.1', name: 'Product Demo (video o link)' },
        { id: '3.2', name: 'Roadmap de Producto (12-18 meses)' },
        { id: '3.3', name: 'Arquitectura Técnica' },
        { id: '3.4', name: 'Stack Tecnológico' },
        { id: '3.5', name: 'Propiedad Intelectual' },
        { id: '3.6', name: 'Seguridad y Compliance Técnico' },
      ]
    },
    {
      id: '4',
      name: '4. Mercado y Competencia',
      icon: TrendingUp,
      color: 'yellow',
      items: [
        { id: '4.1', name: 'Análisis de Mercado (TAM/SAM/SOM)' },
        { id: '4.2', name: 'Análisis Competitivo (matriz)' },
        { id: '4.3', name: 'Tendencias de la Industria' },
        { id: '4.4', name: 'Barreras de Entrada' },
      ]
    },
    {
      id: '5',
      name: '5. Modelo de Negocio',
      icon: DollarSign,
      color: 'emerald',
      items: [
        { id: '5.1', name: 'Business Model Canvas' },
        { id: '5.2', name: 'Pricing Strategy' },
        { id: '5.3', name: 'Unit Economics Detallado' },
        { id: '5.4', name: 'Go-to-Market Strategy' },
        { id: '5.5', name: 'Sales Playbook' },
      ]
    },
    {
      id: '6',
      name: '6. Tracción y Métricas',
      icon: BarChart3,
      color: 'blue',
      items: [
        { id: '6.1', name: 'Dashboard de KPIs (actualizado)' },
        { id: '6.2', name: 'Cohort Analysis' },
        { id: '6.3', name: 'Pipeline de Ventas' },
        { id: '6.4', name: 'Testimoniales de Clientes' },
        { id: '6.5', name: 'Case Studies de Pilotos' },
      ]
    },
    {
      id: '7',
      name: '7. Financieros',
      icon: DollarSign,
      color: 'purple',
      items: [
        { id: '7.1', name: 'Financial Model (3-5 años)' },
        { id: '7.2', name: 'Estados Financieros Históricos' },
        { id: '7.3', name: 'Proyecciones Mensuales (18 meses)' },
        { id: '7.4', name: 'Burn Rate y Runway Actual' },
        { id: '7.5', name: 'Uso de Fondos Detallado' },
        { id: '7.6', name: 'Escenarios (Base, Optimista, Pesimista)' },
      ]
    },
    {
      id: '8',
      name: '8. Legal y Corporativo',
      icon: Shield,
      color: 'red',
      items: [
        { id: '8.1', name: 'Acta Constitutiva' },
        { id: '8.2', name: 'Cap Table Actual' },
        { id: '8.3', name: 'Contratos con Fundadores (vesting)' },
        { id: '8.4', name: 'Contratos con Empleados Clave' },
        { id: '8.5', name: 'Contratos con Clientes' },
        { id: '8.6', name: 'Términos y Condiciones / Privacy Policy' },
        { id: '8.7', name: 'Licencias y Permisos Regulatorios' },
        { id: '8.8', name: 'Litigios Pendientes' },
      ]
    },
    {
      id: '9',
      name: '9. Ronda Actual',
      icon: Target,
      color: 'yellow',
      items: [
        { id: '9.1', name: 'Term Sheet (borrador o firmado)' },
        { id: '9.2', name: 'Valuación y Justificación' },
        { id: '9.3', name: 'Inversores Actuales / Comprometidos' },
        { id: '9.4', name: 'Calendario de Cierre' },
        { id: '9.5', name: 'SAFE/Convertible Note' },
      ]
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };

  const totalItems = folders.reduce((sum, f) => sum + f.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Estructura del Data Room</h3>
        <p className="text-gray-400">Checklist interactivo de documentos para due diligence. Haz clic para marcar como completado.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">Progreso del Data Room</span>
          <span className="text-emerald-400 font-bold">{completedItems}/{totalItems} documentos ({progress}%)</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => {
          const colors = colorClasses[folder.color];
          const folderCompleted = folder.items.filter(item => checkedItems.has(item.id)).length;
          
          return (
            <div key={folder.id} className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
              <div className={`p-4 ${colors.bg} border-b border-gray-700`}>
                <div className="flex items-center gap-3">
                  <folder.icon className={`w-5 h-5 ${colors.text}`} />
                  <span className="font-semibold">{folder.name}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {folderCompleted}/{folder.items.length}
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1">
                {folder.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
                  >
                    {checkedItems.has(item.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${checkedItems.has(item.id) ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                      {item.id} {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Lightbulb className="w-5 h-5" />
            Recomendaciones para el Data Room
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• Usa DocSend o Notion para trackear qué documentos revisan los VCs</p>
          <p>• Todos los documentos en PDF (no editables)</p>
          <p>• Actualiza métricas semanalmente durante el proceso</p>
          <p>• Prepara versión "light" para primer contacto, completa después de NDA</p>
          <p>• Anonimiza información sensible de clientes</p>
        </CardContent>
      </Card>
    </div>
  );
}
