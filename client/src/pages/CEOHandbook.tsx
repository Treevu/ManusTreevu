import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  DollarSign, 
  Calendar,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Briefcase,
  Shield,
  BarChart3,
  TrendingUp,
  ArrowLeft,
  Lightbulb,
  MessageSquare,
  Building2,
  AlertTriangle,
  BookOpen,
  Zap,
  Heart,
  Scale,
  Rocket,
  Brain,
  Handshake,
  PieChart,
  Settings
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SectionType = 'role' | 'decisions' | 'fundraising' | 'team' | 'metrics' | 'calendar' | 'sales' | 'communication' | 'legal' | 'crisis';

export default function CEOHandbook() {
  const [activeSection, setActiveSection] = useState<SectionType>('role');

  const sections = [
    { id: 'role' as SectionType, label: 'Tu Rol', icon: Target },
    { id: 'decisions' as SectionType, label: 'Decisiones', icon: Brain },
    { id: 'fundraising' as SectionType, label: 'Fundraising', icon: DollarSign },
    { id: 'team' as SectionType, label: 'Equipo', icon: Users },
    { id: 'metrics' as SectionType, label: 'Métricas', icon: BarChart3 },
    { id: 'calendar' as SectionType, label: 'Calendario', icon: Calendar },
    { id: 'sales' as SectionType, label: 'Ventas B2B', icon: Handshake },
    { id: 'communication' as SectionType, label: 'Comunicación', icon: MessageSquare },
    { id: 'legal' as SectionType, label: 'Legal', icon: Scale },
    { id: 'crisis' as SectionType, label: 'Crisis', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0B0B0C]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/investor-hub">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Investor Hub
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <h1 className="text-xl font-bold">
                <span className="text-emerald-400">CEO</span> Handbook
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>Guía Operativa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Manual del Fundador-CEO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tu guía completa para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              liderar Treevü
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Frameworks de decisión, playbooks de fundraising, gestión de equipo, métricas clave y todo lo que necesitas para escalar.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="border-b border-gray-800 sticky top-[73px] bg-[#0B0B0C]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                  activeSection === section.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeSection === 'role' && <RoleSection />}
        {activeSection === 'decisions' && <DecisionsSection />}
        {activeSection === 'fundraising' && <FundraisingSection />}
        {activeSection === 'team' && <TeamSection />}
        {activeSection === 'metrics' && <MetricsSection />}
        {activeSection === 'calendar' && <CalendarSection />}
        {activeSection === 'sales' && <SalesSection />}
        {activeSection === 'communication' && <CommunicationSection />}
        {activeSection === 'legal' && <LegalSection />}
        {activeSection === 'crisis' && <CrisisSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Treevü CEO Handbook © 2024</p>
          <p className="mt-2">Próxima revisión: Marzo 2025</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// ROLE SECTION
// ============================================
function RoleSection() {
  const responsibilities = [
    { name: 'Visión y Estrategia', preSeed: '20%', serieA: '25%', color: 'emerald' },
    { name: 'Fundraising y Finanzas', preSeed: '30%', serieA: '20%', color: 'blue' },
    { name: 'Ventas y Clientes Clave', preSeed: '30%', serieA: '15%', color: 'yellow' },
    { name: 'Reclutamiento de A-Players', preSeed: '15%', serieA: '25%', color: 'purple' },
    { name: 'Cultura y Comunicación', preSeed: '5%', serieA: '15%', color: 'pink' },
  ];

  const dontDo = [
    { task: 'Operaciones del día a día', delegate: 'COO o Operations Manager (10+ empleados)' },
    { task: 'Desarrollo de producto', delegate: 'CTO o Tech Lead (tú defines el "qué")' },
    { task: 'Marketing táctico', delegate: 'Growth Marketer (tú defines la narrativa)' },
    { task: 'Administración', delegate: 'Gusto, Deel, o Office Manager' },
    { task: 'Soporte al cliente', delegate: 'Sistemas de autoservicio + CSMs' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Las 5 Responsabilidades Fundamentales</h3>
        <p className="text-gray-400 mb-6">
          Como CEO de una startup en etapa temprana, tu trabajo se reduce a cinco funciones críticas que nadie más puede hacer por ti.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Responsabilidad</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">% Tiempo (Pre-Seed)</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">% Tiempo (Serie A)</th>
              </tr>
            </thead>
            <tbody>
              {responsibilities.map((r, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 text-gray-500">{i + 1}</td>
                  <td className="py-4 px-4 font-semibold text-white">{r.name}</td>
                  <td className="py-4 px-4 text-yellow-400">{r.preSeed}</td>
                  <td className="py-4 px-4 text-emerald-400">{r.serieA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Lo que NO Debes Hacer</h3>
        <p className="text-gray-400 mb-6">
          Cada hora que pasas en tareas operativas es una hora que no inviertes en las cinco prioridades anteriores.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {dontDo.map((item, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">{item.task}</p>
                  <p className="text-sm text-gray-400 mt-1">Delegar a: {item.delegate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Lightbulb className="w-5 h-5" />
            El Test del CEO
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <blockquote className="border-l-4 border-purple-500 pl-4 italic">
            "¿Estoy trabajando EN el negocio o PARA el negocio?"
          </blockquote>
          <p className="mt-4">
            Si más del 50% de tu tiempo está en tareas que alguien más podría hacer, tienes un problema de delegación. 
            Si menos del 20% está en fundraising o ventas, tienes un problema de priorización.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// DECISIONS SECTION
// ============================================
function DecisionsSection() {
  const decisionTypes = [
    { type: 'Tipo 1', desc: 'Irreversible (fundraising, despidos, pivots)', time: 'Días/Semanas', who: 'CEO + Board', color: 'red' },
    { type: 'Tipo 2', desc: 'Difícil de revertir (contrataciones senior, pricing)', time: 'Horas/Días', who: 'CEO + Equipo', color: 'yellow' },
    { type: 'Tipo 3', desc: 'Fácil de revertir (features, campañas)', time: 'Minutos/Horas', who: 'Equipo', color: 'emerald' },
  ];

  const rules = [
    { name: 'Regla del 70%', desc: 'Si tienes 70% de la información que necesitas, decide. Esperar al 100% es parálisis.' },
    { name: 'Regla de las 48 horas', desc: 'Las decisiones Tipo 2 no deben tomar más de 48 horas. Si no puedes decidir, te falta información.' },
    { name: 'Disagree and Commit', desc: 'Una vez tomada la decisión, todos la ejecutan con compromiso total, incluso quienes no estaban de acuerdo.' },
    { name: 'Regla del Post-Mortem', desc: 'Después de cada decisión Tipo 1, programa una revisión a los 90 días para aprender.' },
  ];

  const checklist = [
    '¿Cuál es el peor escenario si esta decisión falla?',
    '¿Es reversible? ¿A qué costo?',
    '¿Tengo al menos 70% de la información necesaria?',
    '¿He consultado a las personas correctas?',
    '¿Estoy decidiendo por miedo o por estrategia?',
    '¿Puedo explicar esta decisión en una oración?',
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Tipos de Decisiones</h3>
        <p className="text-gray-400 mb-6">
          No todas las decisiones son iguales. Clasifícalas para saber cuánto tiempo invertir.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {decisionTypes.map((d, i) => (
            <div key={i} className={`bg-${d.color}-500/10 rounded-xl p-5 border border-${d.color}-500/30`}>
              <h4 className={`text-lg font-bold text-${d.color}-400 mb-2`}>{d.type}</h4>
              <p className="text-gray-300 text-sm mb-3">{d.desc}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tiempo:</span>
                  <span className="text-white">{d.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quién:</span>
                  <span className="text-white">{d.who}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Reglas de Decisión del CEO</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {rules.map((rule, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
              <h4 className="font-bold text-purple-400 mb-2">{rule.name}</h4>
              <p className="text-gray-300 text-sm">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
            Checklist Pre-Decisión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// FUNDRAISING SECTION
// ============================================
function FundraisingSection() {
  const rounds = [
    { round: 'Pre-Seed', amount: '$300-600K', valuation: '$2-4M', dilution: '15-20%', use: 'MVP + Primeros clientes', timeline: 'Q1 2025' },
    { round: 'Seed', amount: '$1.5-3M', valuation: '$10-15M', dilution: '15-20%', use: 'PMF + Equipo core', timeline: 'Q3 2025' },
    { round: 'Serie A', amount: '$8-15M', valuation: '$40-60M', dilution: '20-25%', use: 'Escala México', timeline: 'Q2 2026' },
  ];

  const metrics = [
    { metric: 'MRR', min: '$5K', ideal: '$20K+' },
    { metric: 'Crecimiento MoM', min: '15%', ideal: '30%+' },
    { metric: 'Empresas activas', min: '3', ideal: '10+' },
    { metric: 'Empleados cubiertos', min: '500', ideal: '2,000+' },
    { metric: 'NPS', min: '>30', ideal: '>50' },
    { metric: 'Churn mensual', min: '<5%', ideal: '<2%' },
    { metric: 'LTV:CAC', min: '>3:1', ideal: '>5:1' },
  ];

  const terms = [
    { term: 'Valuación', what: 'Precio de tu empresa', range: '3-5x ARR (Seed)', redFlag: 'Valuación "down round"' },
    { term: 'Liquidation Preference', what: 'Quién cobra primero en exit', range: '1x non-participating', redFlag: '>1x o participating' },
    { term: 'Board Seats', what: 'Control del board', range: '2 founders, 1 investor', redFlag: 'Mayoría de inversores' },
    { term: 'Anti-dilution', what: 'Protección en down rounds', range: 'Weighted average', redFlag: 'Full ratchet' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Etapas de Fundraising para Treevü</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Ronda</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Monto</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Valuación</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Dilución</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Uso</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((r, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-emerald-400">{r.round}</td>
                  <td className="py-4 px-4 text-white">{r.amount}</td>
                  <td className="py-4 px-4 text-gray-300">{r.valuation}</td>
                  <td className="py-4 px-4 text-yellow-400">{r.dilution}</td>
                  <td className="py-4 px-4 text-gray-300">{r.use}</td>
                  <td className="py-4 px-4 text-gray-400">{r.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Métricas que los VCs Quieren Ver</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">{m.metric}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-400">Mínimo:</span>
                  <span className="text-white">{m.min}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Ideal:</span>
                  <span className="text-white">{m.ideal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Negociación de Term Sheet</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Término</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Qué es</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Rango Aceptable</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">🚩 Red Flag</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-white">{t.term}</td>
                  <td className="py-4 px-4 text-gray-300">{t.what}</td>
                  <td className="py-4 px-4 text-emerald-400">{t.range}</td>
                  <td className="py-4 px-4 text-red-400">{t.redFlag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEAM SECTION
// ============================================
function TeamSection() {
  const hires = [
    { num: 1, role: 'CTO/Tech Lead', why: 'Construir el producto', when: 'Día 1' },
    { num: 2, role: 'Full-Stack Dev #1', why: 'Velocidad de desarrollo', when: 'Con funding' },
    { num: 3, role: 'Full-Stack Dev #2', why: 'Redundancia y escala', when: 'MRR $5K' },
    { num: 4, role: 'Head of Sales', why: 'Cerrar primeros clientes', when: 'MRR $10K' },
    { num: 5, role: 'SDR #1', why: 'Pipeline de leads', when: 'MRR $15K' },
    { num: 6, role: 'Customer Success', why: 'Retención y expansión', when: '10 clientes' },
    { num: 7, role: 'SDR #2', why: 'Escalar pipeline', when: 'MRR $25K' },
    { num: 8, role: 'Product Manager', why: 'Liberar al CTO', when: '15 clientes' },
    { num: 9, role: 'Marketing/Growth', why: 'Escalar adquisición', when: 'MRR $40K' },
    { num: 10, role: 'Operations/Finance', why: 'Escalar operaciones', when: '20 empleados' },
  ];

  const values = [
    { value: 'Impacto Real', meaning: 'Medimos éxito por vidas mejoradas', behavior: 'Cada feature tiene métrica de impacto' },
    { value: 'Velocidad con Calidad', meaning: 'Rápido no significa descuidado', behavior: 'Entregamos en días, no semanas' },
    { value: 'Transparencia Radical', meaning: 'Compartimos todo, bueno y malo', behavior: 'Métricas visibles para todos' },
    { value: 'Ownership', meaning: 'Actuamos como dueños', behavior: 'No esperamos instrucciones' },
    { value: 'Empatía', meaning: 'Entendemos antes de resolver', behavior: 'Escuchamos a usuarios y equipo' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Los Primeros 10 Hires</h3>
        <p className="text-gray-400 mb-6">
          El orden importa. Cada contratación debe resolver un cuello de botella específico.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Rol</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Por qué</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Cuándo</th>
              </tr>
            </thead>
            <tbody>
              {hires.map((h, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 text-purple-400 font-bold">{h.num}</td>
                  <td className="py-4 px-4 font-semibold text-white">{h.role}</td>
                  <td className="py-4 px-4 text-gray-300">{h.why}</td>
                  <td className="py-4 px-4 text-emerald-400">{h.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Valores de Treevü</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((v, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <h4 className="font-bold text-white">{v.value}</h4>
              </div>
              <p className="text-gray-400 text-sm mb-2">{v.meaning}</p>
              <p className="text-emerald-400 text-sm">→ {v.behavior}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <MessageSquare className="w-5 h-5" />
            Preguntas para One-on-Ones
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-3">
          <p>• "¿Qué es lo más importante que deberías estar haciendo que no estás haciendo?"</p>
          <p>• "Si pudieras cambiar una cosa de cómo trabajamos, ¿cuál sería?"</p>
          <p>• "¿Hay algo que te gustaría que yo hiciera diferente?"</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// METRICS SECTION
// ============================================
function MetricsSection() {
  const ceoMetrics = [
    { metric: 'Cash Balance', freq: 'Diario', source: 'Banco', alert: '<6 meses runway' },
    { metric: 'MRR', freq: 'Diario', source: 'Stripe/Sistema', alert: 'Cae >5% WoW' },
    { metric: 'Nuevos Leads', freq: 'Diario', source: 'CRM', alert: '<5/día' },
    { metric: 'Churn', freq: 'Semanal', source: 'Sistema', alert: '>3% mensual' },
    { metric: 'NPS', freq: 'Mensual', source: 'Encuestas', alert: '<30' },
    { metric: 'Employee Satisfaction', freq: 'Mensual', source: 'Encuestas', alert: '<7/10' },
  ];

  const productMetrics = [
    { metric: 'MAU/Empleado', target: '>50%' },
    { metric: 'Feature Adoption', target: '>30%' },
    { metric: 'Time to Value', target: '<7 días' },
    { metric: 'Bug Resolution', target: '<48h' },
  ];

  const salesMetrics = [
    { metric: 'Pipeline Coverage', target: '3x' },
    { metric: 'Win Rate', target: '>25%' },
    { metric: 'Sales Cycle', target: '<45 días' },
    { metric: 'ACV', target: '>$30K' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Dashboard del CEO (Revisar Diariamente)</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Métrica</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Frecuencia</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Fuente</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">🚨 Alerta Si</th>
              </tr>
            </thead>
            <tbody>
              {ceoMetrics.map((m, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-white">{m.metric}</td>
                  <td className="py-4 px-4 text-gray-300">{m.freq}</td>
                  <td className="py-4 px-4 text-gray-400">{m.source}</td>
                  <td className="py-4 px-4 text-red-400">{m.alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Métricas de Producto
          </h3>
          <div className="space-y-3">
            {productMetrics.map((m, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-300">{m.metric}</span>
                <span className="text-emerald-400 font-semibold">{m.target}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-blue-400" />
            Métricas de Ventas
          </h3>
          <div className="space-y-3">
            {salesMetrics.map((m, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                <span className="text-gray-300">{m.metric}</span>
                <span className="text-blue-400 font-semibold">{m.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CALENDAR SECTION
// ============================================
function CalendarSection() {
  const weekSchedule = [
    { time: '8-9', mon: 'Revisión métricas', tue: 'Deep work', wed: 'Deep work', thu: 'Deep work', fri: 'Revisión semana' },
    { time: '9-10', mon: 'All-hands', tue: '1:1s', wed: 'Calls inversores', thu: '1:1s', fri: 'Calls clientes' },
    { time: '10-12', mon: 'Calls ventas', tue: 'Producto', wed: 'Calls inversores', thu: 'Estrategia', fri: 'Admin/Email' },
    { time: '13-15', mon: 'Calls clientes', tue: '1:1s', wed: 'Calls clientes', thu: 'Reclutamiento', fri: 'Aprendizaje' },
    { time: '15-17', mon: 'Producto', tue: 'Estrategia', wed: 'Networking', thu: 'Calls ventas', fri: 'Preparar semana' },
  ];

  const dailyRoutines = [
    { time: 'Mañana', tasks: ['Revisar métricas clave (5 min)', 'Revisar calendario del día (5 min)', 'Identificar la "ONE Thing" (5 min)'] },
    { time: 'Noche', tasks: ['Procesar inbox a cero (15 min)', 'Actualizar to-do list (5 min)', 'Reflexión: ¿Qué aprendí? (5 min)'] },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Semana Tipo del CEO</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Hora</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Lunes</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Martes</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Miércoles</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Jueves</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Viernes</th>
              </tr>
            </thead>
            <tbody>
              {weekSchedule.map((row, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 px-3 text-purple-400 font-semibold">{row.time}</td>
                  <td className="py-3 px-3 text-gray-300">{row.mon}</td>
                  <td className="py-3 px-3 text-gray-300">{row.tue}</td>
                  <td className="py-3 px-3 text-gray-300">{row.wed}</td>
                  <td className="py-3 px-3 text-gray-300">{row.thu}</td>
                  <td className="py-3 px-3 text-gray-300">{row.fri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {dailyRoutines.map((routine, i) => (
          <Card key={i} className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-emerald-400" />
                Rutina de {routine.time}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routine.tasks.map((task, j) => (
                  <div key={j} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SALES SECTION
// ============================================
function SalesSection() {
  const icp = [
    { criteria: 'Tamaño', ideal: '200-1,000 empleados', acceptable: '100-2,000', avoid: '<50 o >5,000' },
    { criteria: 'Industria', ideal: 'Manufactura, Retail, Servicios', acceptable: 'Cualquiera formal', avoid: 'Gobierno, ONGs' },
    { criteria: 'Geografía', ideal: 'CDMX, MTY, GDL', acceptable: 'México urbano', avoid: 'Rural, fuera de MX' },
    { criteria: 'Rotación', ideal: '>20% anual', acceptable: '>10% anual', avoid: '<5% anual' },
  ];

  const objections = [
    { objection: '"Es muy caro"', response: '¿Cuánto les cuesta la rotación hoy? Nuestros clientes ven ROI de 5x en el primer año.' },
    { objection: '"Ya tenemos beneficios"', response: '¿Cuál es la tasa de uso? La mayoría tiene <10% de adopción. Treevü tiene >40%.' },
    { objection: '"Necesito pensarlo"', response: '¿Qué información adicional necesitas para tomar la decisión?' },
    { objection: '"El timing no es bueno"', response: '¿Cuándo sería mejor? ¿Te gustaría ver un caso de estudio mientras tanto?' },
  ];

  const pricing = [
    { plan: 'Starter', price: '$3 USD', includes: 'EWA básico, dashboard empleado' },
    { plan: 'Professional', price: '$6 USD', includes: '+ Analytics B2B, alertas de riesgo' },
    { plan: 'Enterprise', price: '$10 USD', includes: '+ API, integraciones, soporte dedicado' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Ideal Customer Profile (ICP)</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Criterio</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">✅ Ideal</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">⚠️ Aceptable</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">❌ No Perseguir</th>
              </tr>
            </thead>
            <tbody>
              {icp.map((row, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-white">{row.criteria}</td>
                  <td className="py-4 px-4 text-emerald-400">{row.ideal}</td>
                  <td className="py-4 px-4 text-yellow-400">{row.acceptable}</td>
                  <td className="py-4 px-4 text-red-400">{row.avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Manejo de Objeciones</h3>
        <div className="space-y-4">
          {objections.map((obj, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
              <p className="text-red-400 font-semibold mb-2">{obj.objection}</p>
              <p className="text-emerald-400">→ {obj.response}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Pricing Strategy</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pricing.map((p, i) => (
            <div key={i} className={`rounded-xl p-5 border ${i === 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/30 border-gray-700'}`}>
              <h4 className="font-bold text-white text-lg">{p.plan}</h4>
              <p className="text-2xl font-bold text-emerald-400 my-2">{p.price}<span className="text-sm text-gray-400">/empleado/mes</span></p>
              <p className="text-gray-400 text-sm">{p.includes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMMUNICATION SECTION
// ============================================
function CommunicationSection() {
  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Investor Updates (Mensual)</h3>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="pt-6">
            <div className="font-mono text-sm space-y-4">
              <p className="text-gray-400">Asunto: <span className="text-white">Treevü Update - [Mes Año] - [🟢🟡🔴]</span></p>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-emerald-400 font-bold">TL;DR</p>
                <p className="text-gray-300">- Highlight #1</p>
                <p className="text-gray-300">- Highlight #2</p>
                <p className="text-gray-300">- Biggest challenge</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-blue-400 font-bold">MÉTRICAS</p>
                <p className="text-gray-300">- MRR: $X (+Y% MoM)</p>
                <p className="text-gray-300">- Empresas: X (+Y)</p>
                <p className="text-gray-300">- Runway: X meses</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-purple-400 font-bold">ASKS</p>
                <p className="text-gray-300">- [Intro específica que necesitas]</p>
                <p className="text-gray-300">- [Recurso que buscas]</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Board Meetings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Frecuencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300">
              <p>• <span className="text-emerald-400">Pre-Seed:</span> Mensual</p>
              <p>• <span className="text-blue-400">Seed:</span> Bimensual</p>
              <p>• <span className="text-purple-400">Serie A+:</span> Trimestral</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Agenda Tipo (2h)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300 text-sm">
              <p>1. Estado del negocio (20 min)</p>
              <p>2. Deep dive en un área (30 min)</p>
              <p>3. Decisiones pendientes (30 min)</p>
              <p>4. Closed session (20 min)</p>
              <p>5. Feedback al CEO (20 min)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LEGAL SECTION
// ============================================
function LegalSection() {
  const checklist = [
    { item: 'Constitución de empresa (SAPI)', priority: 'Alta', cost: '$5-10K USD' },
    { item: 'Registro ante SAT', priority: 'Alta', cost: '$0' },
    { item: 'Aviso de privacidad (LFPDPPP)', priority: 'Alta', cost: '$2-5K USD' },
    { item: 'Términos y condiciones', priority: 'Alta', cost: '$2-5K USD' },
    { item: 'Registro CONDUSEF', priority: 'Alta', cost: '$1-2K USD' },
    { item: 'Análisis regulatorio CNBV', priority: 'Alta', cost: '$5-10K USD' },
    { item: 'Contratos con clientes B2B', priority: 'Media', cost: '$3-5K USD' },
    { item: 'Política PLD', priority: 'Media', cost: '$5-10K USD' },
    { item: 'Registro de marca', priority: 'Media', cost: '$1-2K USD' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Checklist Legal para Fintech en México</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Requisito</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Prioridad</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Costo Estimado</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 text-white">{item.item}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${item.priority === 'Alta' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Building2 className="w-5 h-5" />
            Estructura Corporativa Recomendada
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <div className="font-mono text-sm bg-gray-900/50 rounded-lg p-4">
            <p>Treevü Inc. (Delaware, USA)</p>
            <p className="ml-4">└── Treevü México, SAPI de CV</p>
            <p className="ml-8">└── Operaciones</p>
          </div>
          <p className="mt-4 text-sm">
            <span className="text-emerald-400">Ventajas:</span> VCs de EE.UU. prefieren Delaware, protección legal robusta, facilita futuras rondas.
          </p>
          <p className="text-sm mt-2">
            <span className="text-yellow-400">Costo:</span> $15-25K USD para setup inicial
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// CRISIS SECTION
// ============================================
function CrisisSection() {
  const crisisTypes = [
    { type: 'Producto', example: 'Caída del sistema, bug crítico', severity: 'Alta', response: '<1 hora' },
    { type: 'Seguridad', example: 'Breach de datos, hack', severity: 'Crítica', response: '<30 min' },
    { type: 'Financiera', example: 'Quedarse sin runway', severity: 'Alta', response: '<1 semana' },
    { type: 'Reputacional', example: 'PR negativo, cliente enojado', severity: 'Media', response: '<4 horas' },
    { type: 'Legal', example: 'Demanda, investigación', severity: 'Alta', response: '<24 horas' },
    { type: 'Equipo', example: 'Renuncia clave, conflicto', severity: 'Media', response: '<24 horas' },
  ];

  const contingency = [
    { runway: '6 meses', action: 'Acelerar fundraising, reducir gastos no esenciales' },
    { runway: '4 meses', action: 'Congelar contrataciones, renegociar contratos' },
    { runway: '3 meses', action: 'Reducir equipo 20-30%, buscar bridge financing' },
    { runway: '2 meses', action: 'Reducir a equipo mínimo, buscar acqui-hire o venta' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Tipos de Crisis y Respuesta</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Tipo</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Ejemplo</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Severidad</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Tiempo de Respuesta</th>
              </tr>
            </thead>
            <tbody>
              {crisisTypes.map((c, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-4 px-4 font-semibold text-white">{c.type}</td>
                  <td className="py-4 px-4 text-gray-300">{c.example}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.severity === 'Crítica' ? 'bg-red-500/20 text-red-400' :
                      c.severity === 'Alta' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-emerald-400">{c.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Plan de Contingencia Financiera</h3>
        <div className="space-y-4">
          {contingency.map((c, i) => (
            <div key={i} className={`rounded-xl p-5 border ${
              i === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
              i === 1 ? 'bg-orange-500/10 border-orange-500/30' :
              i === 2 ? 'bg-red-500/10 border-red-500/30' :
              'bg-red-900/20 border-red-500/50'
            }`}>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${
                  i === 0 ? 'text-yellow-400' :
                  i === 1 ? 'text-orange-400' :
                  'text-red-400'
                }`}>{c.runway}</span>
                <p className="text-gray-300">{c.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Protocolo de Crisis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div>
            <p className="font-semibold text-white">Paso 1: Contener (primeros 30 min)</p>
            <p className="text-sm">Identificar alcance, activar equipo de crisis, detener el daño</p>
          </div>
          <div>
            <p className="font-semibold text-white">Paso 2: Comunicar (primeras 2 horas)</p>
            <p className="text-sm">Comunicación interna y externa según sea necesario</p>
          </div>
          <div>
            <p className="font-semibold text-white">Paso 3: Resolver (horas/días)</p>
            <p className="text-sm">Root cause analysis, implementar fix, verificar resolución</p>
          </div>
          <div>
            <p className="font-semibold text-white">Paso 4: Aprender (siguiente semana)</p>
            <p className="text-sm">Post-mortem documentado, cambios en procesos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
