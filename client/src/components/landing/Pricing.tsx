import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Database, Zap, Building2, Users, Store, Brain, Heart, Wallet, TrendingUp, Award, Bell, BarChart3, Headphones, Globe, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PlanType = 'EMPRESA' | 'PERSONA' | 'COMERCIO';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  badge?: string;
  savings?: string;
}

const plans: Record<PlanType, PricingPlan[]> = {
  EMPRESA: [
    {
      name: 'Starter',
      price: '$1.99',
      period: '/ usuario / mes',
      description: 'Ideal para empresas que inician su programa de bienestar financiero.',
      features: [
        'FWI Score Dashboard (Índice de Bienestar)',
        'Reportes básicos de bienestar por departamento',
        'Onboarding digital para empleados',
        'Alertas de riesgo financiero básicas',
        'Acceso a marketplace de descuentos',
        'Soporte por email'
      ],
      cta: 'Comenzar Prueba Gratis',
      highlight: false,
      badge: 'Sin integración requerida'
    },
    {
      name: 'Professional',
      price: '$4.50',
      period: '/ usuario / mes',
      description: 'La solución completa para empresas que buscan resultados medibles.',
      features: [
        'Todo lo de Starter +',
        'EWA (Adelanto de Salario) sin intereses',
        'IA Predictiva: Alertas de riesgo de fuga',
        'Torre de Control: Dashboard ejecutivo',
        'Risk Clustering por departamento',
        'Gamificación: TreePoints, Badges, Leaderboard',
        'Telemedicina básica incluida',
        'API integración con HRIS',
        'Soporte prioritario'
      ],
      cta: 'Agendar Demo',
      highlight: true,
      badge: 'Más Popular',
      savings: 'Ahorra 20% vs. competencia'
    },
    {
      name: 'Enterprise',
      price: 'Desde $7',
      period: '/ usuario / mes',
      description: 'Para grandes empresas con necesidades de personalización.',
      features: [
        'Todo lo de Professional +',
        'Intervención automatizada con IA',
        'Data as a Service (DaaS)',
        'Integración HRIS premium (SAP, Oracle)',
        'Caja de ahorro con rendimiento 8%+',
        'Telemedicina completa + salud mental',
        'Customer Success Manager dedicado',
        'SLA garantizado 99.9%',
        'Reportes personalizados'
      ],
      cta: 'Contactar Ventas',
      highlight: false,
      badge: '+500 empleados'
    }
  ],
  PERSONA: [
    {
      name: 'Básico',
      price: 'Gratis',
      period: 'Siempre',
      description: 'Todo lo que necesitas para mejorar tu salud financiera.',
      features: [
        'Dashboard FWI personal',
        'Seguimiento de gastos e ingresos',
        'Metas de ahorro ilimitadas',
        'Acceso a marketplace de descuentos',
        'Alertas de pagos y vencimientos',
        'Educación financiera básica',
        'Gamificación: Rachas y logros'
      ],
      cta: 'Descargar App Gratis',
      highlight: false,
      badge: 'Sin costo para empleados'
    },
    {
      name: 'Premium',
      price: '$2.99',
      period: '/ mes',
      description: 'Potencia tu bienestar con IA y coaching personalizado.',
      features: [
        'Todo lo de Básico +',
        'Treevü Brain: Asesor financiero IA 24/7',
        'Alertas predictivas personalizadas',
        'Coaching financiero con expertos',
        'Micro-tarifas EWA preferenciales',
        'Reportes detallados de progreso',
        'Acceso anticipado a nuevas features',
        'Sin publicidad'
      ],
      cta: 'Prueba 14 días gratis',
      highlight: true,
      badge: 'Opcional'
    }
  ],
  COMERCIO: [
    {
      name: 'Marketplace',
      price: '5%',
      period: 'comisión por venta',
      description: 'Llega a miles de empleados con liquidez validada.',
      features: [
        'Listado en marketplace Treevü',
        'Validación FWI de compradores',
        'Panel de ventas en tiempo real',
        'Redención de cupones QR',
        'Pagos semanales garantizados',
        'Soporte básico'
      ],
      cta: 'Registrar Mi Comercio',
      highlight: false,
      badge: 'Sin costo fijo'
    },
    {
      name: 'Partner',
      price: '3%',
      period: '+ $99/mes',
      description: 'Maximiza conversiones con IA y posicionamiento premium.',
      features: [
        'Todo lo de Marketplace +',
        'Comisión reducida (3% vs 5%)',
        'IA Marketing Studio: Campañas segmentadas',
        'Smart Offers basadas en historial',
        'Posicionamiento destacado',
        'Badge "Comercio Aliado Treevü"',
        'Benchmarking vs. competencia',
        'Account Manager dedicado'
      ],
      cta: 'Aplicar como Partner',
      highlight: true,
      badge: 'ROI Garantizado'
    }
  ]
};

const tabConfig = {
  EMPRESA: { 
    icon: Building2, 
    label: 'Empresas (B2B)', 
    color: 'text-blue-400 border-blue-400',
    bgColor: 'bg-blue-400',
    lightBg: 'bg-blue-400/10'
  },
  PERSONA: { 
    icon: Users, 
    label: 'Empleados (B2C)', 
    color: 'text-emerald-400 border-emerald-400',
    bgColor: 'bg-emerald-400',
    lightBg: 'bg-emerald-400/10'
  },
  COMERCIO: { 
    icon: Store, 
    label: 'Comercios', 
    color: 'text-purple-400 border-purple-400',
    bgColor: 'bg-purple-400',
    lightBg: 'bg-purple-400/10'
  }
};

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PlanType>('EMPRESA');

  const currentConfig = tabConfig[activeTab];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm mb-6">
            <TrendingUp className="w-4 h-4" />
            {t('pricing.transparent')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> {t('pricing.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800/50 p-1.5 rounded-2xl border border-gray-700 inline-flex gap-1">
            {(Object.keys(tabConfig) as PlanType[]).map((type) => {
              const config = tabConfig[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === type
                      ? `bg-gray-900 ${config.color} border border-current shadow-lg`
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans[activeTab].map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-gray-900/50 rounded-3xl transition-all duration-300 overflow-hidden flex flex-col ${
                plan.highlight 
                  ? 'border-2 shadow-2xl scale-[1.02] z-10' 
                  : 'border border-gray-800 hover:border-gray-700'
              }`}
              style={{ borderColor: plan.highlight ? (activeTab === 'EMPRESA' ? '#60A5FA' : activeTab === 'PERSONA' ? '#34D399' : '#A78BFA') : '' }}
            >
              {/* Badge */}
              {plan.badge && (
                <div 
                  className={`absolute top-0 left-0 right-0 text-center py-2 text-xs font-bold uppercase tracking-wider ${
                    plan.highlight ? 'text-gray-900' : 'text-white bg-gray-800'
                  }`}
                  style={{ backgroundColor: plan.highlight ? (activeTab === 'EMPRESA' ? '#60A5FA' : activeTab === 'PERSONA' ? '#34D399' : '#A78BFA') : '' }}
                >
                  <div className="flex justify-center items-center gap-1">
                    {plan.highlight && <Sparkles className="w-3 h-3" />}
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="p-8 pt-14 flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6 min-h-[48px]">{plan.description}</p>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 ml-2 text-sm">{plan.period}</span>
                </div>
                
                {plan.savings && (
                  <p className="text-emerald-400 text-sm mb-6">{plan.savings}</p>
                )}
                
                <a 
                  href="#contact"
                  className={`block w-full py-4 px-4 rounded-xl text-center font-bold transition-all mt-6 ${
                    plan.highlight 
                      ? `${currentConfig.bgColor} text-gray-900 hover:opacity-90` 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>

              <div className="px-8 pb-8">
                <div className="h-px w-full bg-gray-800 mb-6"></div>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
                        activeTab === 'EMPRESA' ? 'text-blue-400' : 
                        activeTab === 'PERSONA' ? 'text-emerald-400' : 'text-purple-400'
                      }`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 text-center">
            <Lock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Sin Custodia</h4>
            <p className="text-gray-500 text-sm">Nunca tocamos tu dinero</p>
          </div>
          <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 text-center">
            <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">ISO 27001</h4>
            <p className="text-gray-500 text-sm">Seguridad certificada</p>
          </div>
          <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">LATAM Ready</h4>
            <p className="text-gray-500 text-sm">México, Colombia, Chile, Perú</p>
          </div>
          <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 text-center">
            <Headphones className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Soporte 24/7</h4>
            <p className="text-gray-500 text-sm">En español siempre</p>
          </div>
        </div>

        {/* Comparison with Competition */}
        <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-2xl font-bold text-white text-center mb-8">¿Por qué Treevü vs. la competencia?</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 text-emerald-400 font-bold">Treevü</th>
                  <th className="text-center py-4 px-4 text-gray-500">Minu</th>
                  <th className="text-center py-4 px-4 text-gray-500">Wagestream</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">FWI Score (Índice propietario)</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">IA Predictiva de Riesgo</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                  <td className="text-center py-3 px-4 text-gray-600">Básico</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Gamificación (TreePoints, Badges)</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Marketplace B2B2C</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-gray-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Torre de Control Ejecutiva</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">Básico</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-gray-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Precio por empleado/mes</td>
                  <td className="text-center py-3 px-4 text-emerald-400 font-bold">Desde $1.99</td>
                  <td className="text-center py-3 px-4">~$6.50</td>
                  <td className="text-center py-3 px-4">$0.50-$2</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Sin custodia de fondos</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                  <td className="text-center py-3 px-4 text-gray-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <details className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                ¿Hay contratos de largo plazo?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">No. Todos nuestros planes son mes a mes. Puedes cancelar en cualquier momento sin penalidades.</p>
            </details>
            <details className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                ¿Cuánto tiempo toma la implementación?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">El plan Starter se activa en 24 horas sin integración. Professional y Enterprise típicamente toman 2-4 semanas dependiendo de la complejidad de tu HRIS.</p>
            </details>
            <details className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                ¿El EWA genera deuda para el empleado?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">No. El EWA (Earned Wage Access) es un adelanto del salario ya trabajado, no un préstamo. No genera intereses ni afecta el historial crediticio del empleado.</p>
            </details>
            <details className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                ¿Qué pasa con la seguridad de los datos?
                <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-4">Treevü cuenta con certificación ISO 27001 y cumple con regulaciones de protección de datos de México, Colombia y Chile. Nunca vendemos datos de usuarios a terceros.</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
