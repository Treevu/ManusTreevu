
import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Database, Link, Zap } from 'lucide-react';
import { PlanType, PricingPlan } from './types';

const plans: Record<PlanType, PricingPlan[]> = {
  [PlanType.PERSONA]: [
    {
      name: 'Freemium',
      price: 'Gratis',
      period: 'Siempre',
      description: 'Funciones esenciales para tu bienestar financiero.',
      features: [
        'Dashboard FWI (Estado Financiero)', 
        'Simulador de Adelantos (Pay stub preview)',
        'EWA Lite (Tarifa transaccional solo si >50%)',
        'Gamificación Básica (Rachas)', 
        'Alertas Legales Básicas'
      ],
      cta: 'Empezar Gratis',
      highlight: false
    },
    {
      name: 'Treevü Plus',
      price: '$4.99',
      period: '/ mes',
      description: 'Potencia tu salud financiera con IA y Coaching.',
      features: [
        'Todo lo de Freemium', 
        'Treevü Brain (Asesor IA)', 
        'Alertas Avanzadas y Predictivas', 
        'Micro-tarifas EWA preferenciales',
        'Gamificación Extendida (Logros y TreePoints)'
      ],
      cta: 'Prueba 30 días',
      highlight: true
    }
  ],
  [PlanType.EMPRESA]: [
    {
      name: 'Core SaaS',
      price: '$2.50',
      period: '/ usuario / mes',
      description: 'Optimiza la retención y visibilidad básica.',
      features: [
        'Dashboard Predictivo FWI', 
        'Reportes de ROI en Retención', 
        'API Integración HRIS Standard', 
        'Onboarding Digital'
      ],
      cta: 'Contactar Ventas',
      highlight: false
    },
    {
      name: 'Proactive',
      price: '$5.00',
      period: '/ usuario / mes',
      description: 'Inteligencia predictiva de riesgo laboral.',
      features: [
        'Todo lo de Core', 
        'Risk Clustering (Clusters Críticos)', 
        'Intervention Studio (Acciones)', 
        'Risk Engine & Alertas de Fuga',
        'Soporte Prioritario'
      ],
      cta: 'Agendar Demo',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Anual',
      description: 'Para grandes nóminas y necesidades complejas.',
      features: [
        'DaaS (Data as a Service)', 
        'Integración HRIS Premium', 
        'Intervención Automatizada', 
        'Customer Success Dedicado'
      ],
      cta: 'Cotizar',
      highlight: false
    }
  ],
  [PlanType.COMERCIO]: [
    {
      name: 'Performance',
      price: '5-10%',
      period: 'Take Rate / Venta',
      description: 'Monetiza llegando a usuarios con liquidez validada.',
      features: [
        'Listado en Marketplace', 
        'Validación FWI de Usuarios', 
        'Redención No-Custodio', 
        'Reportes de Ventas Básicos'
      ],
      cta: 'Registrar Comercio',
      highlight: false
    },
    {
      name: 'Smart Growth',
      price: 'Suscripción',
      period: 'Opcional / mes',
      description: 'Campañas de IA y alta conversión.',
      features: [
        'Todo lo de Performance', 
        'IA Marketing Studio: Crea campañas hiper-segmentadas y mejora la conversión', 
        'Smart Offers (Historial de Compras)', 
        'Benchmarking Sectorial',
        'Badge "Comercio Aliado"'
      ],
      cta: 'Potenciar Ventas',
      highlight: true
    }
  ]
};

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlanType>(PlanType.EMPRESA); // Default to Empresa as per "SaaS First" approach

  // Helper to get active color based on tab
  const getActiveColor = () => {
    switch(activeTab) {
      case PlanType.PERSONA: return 'text-brand-primary border-brand-primary shadow-[0_0_15px_rgba(52,211,153,0.3)]';
      case PlanType.EMPRESA: return 'text-segment-empresa border-segment-empresa shadow-[0_0_15px_rgba(96,165,250,0.3)]';
      case PlanType.COMERCIO: return 'text-segment-socio border-segment-socio shadow-[0_0_15px_rgba(192,132,252,0.3)]';
    }
  };

  const getButtonColor = (isHighlight: boolean) => {
    if (!isHighlight) return 'bg-treevu-active text-white hover:bg-gray-600';
    switch(activeTab) {
      case PlanType.PERSONA: return 'bg-brand-primary text-treevu-base hover:bg-brand-secondary';
      case PlanType.EMPRESA: return 'bg-segment-empresa text-treevu-base hover:bg-blue-400';
      case PlanType.COMERCIO: return 'bg-segment-socio text-white hover:bg-purple-500';
    }
  };

  return (
    <section id="pricing" className="py-32 bg-treevu-base border-t border-treevu-active">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-segment-empresa font-semibold tracking-widest uppercase text-xs mb-2 block">
            Estrategia Treevü Proactive
          </span>
          <h2 className="text-4xl font-display font-bold text-white mb-4">SaaS Primero, Transaccional Después</h2>
          <p className="text-treevu-muted max-w-2xl mx-auto text-lg">
            Un modelo de monetización escalonado: Engagement → Data → Transacción → Loyalty. Sin riesgo financiero, sin custodia.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="bg-treevu-surface p-1.5 rounded-2xl border border-treevu-active inline-flex">
            {Object.values(PlanType).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === type
                    ? `bg-treevu-base border border-treevu-active ${getActiveColor()}`
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase() + (type === PlanType.PERSONA ? 's (B2C)' : type === PlanType.EMPRESA ? 's (B2B)' : 's (Merchants)')}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid (Flexbox for centering) */}
        <div className="flex flex-wrap justify-center gap-8 items-stretch mb-24">
          {plans[activeTab].map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative w-full md:max-w-[48%] lg:max-w-[32%] min-w-[320px] bg-treevu-surface rounded-3xl transition-all duration-300 overflow-hidden flex flex-col ${
                plan.highlight 
                  ? 'border-2 shadow-2xl z-10 scale-105' 
                  : 'border border-treevu-active hover:border-gray-600'
              }`}
              style={{ borderColor: plan.highlight ? (activeTab === PlanType.PERSONA ? '#34D399' : activeTab === PlanType.EMPRESA ? '#60A5FA' : '#C084FC') : '' }}
            >
              {plan.highlight && (
                <div className={`absolute top-0 left-0 w-full text-center py-2 text-xs font-bold uppercase tracking-widest text-treevu-base`}
                     style={{ backgroundColor: activeTab === PlanType.PERSONA ? '#34D399' : activeTab === PlanType.EMPRESA ? '#60A5FA' : '#C084FC' }}>
                  <div className="flex justify-center items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recomendado
                  </div>
                </div>
              )}
              
              <div className="p-8 pt-12 flex-1">
                <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-treevu-muted text-sm mb-8 min-h-[40px] leading-relaxed">{plan.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                  <span className="text-treevu-muted ml-2 text-xs font-medium uppercase tracking-wide">{plan.period}</span>
                </div>
                
                <a 
                  href="#founders-offer"
                  className={`block w-full py-4 px-4 rounded-xl text-center font-bold transition-all shadow-lg hover:shadow-xl ${getButtonColor(!!plan.highlight)}`}
                >
                  {plan.cta}
                </a>
              </div>

              <div className="px-8 pb-8">
                <div className="h-px w-full bg-treevu-active mb-6"></div>
                <ul className="space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${activeTab === PlanType.PERSONA ? 'text-brand-primary' : activeTab === PlanType.EMPRESA ? 'text-segment-empresa' : 'text-segment-socio'}`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CORPORATE FAQ / STRATEGIC NOTES */}
        <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-white text-center mb-10">Pilares Estratégicos</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active hover:border-segment-empresa transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-segment-empresa/10 flex items-center justify-center mb-4 text-segment-empresa group-hover:bg-segment-empresa group-hover:text-treevu-base transition-colors">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold mb-2">Arquitectura No-Custodio</h4>
                    <p className="text-sm text-treevu-muted leading-relaxed">
                        Treevü nunca toca el dinero. El modelo "EWA Lite" y la redención de cupones operan sin intermediación financiera, permitiendo escalabilidad masiva sin riesgo regulatorio.
                    </p>
                </div>
                <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active hover:border-brand-primary transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary group-hover:bg-brand-primary group-hover:text-treevu-base transition-colors">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold mb-2">Gamificación & Stickiness</h4>
                    <p className="text-sm text-treevu-muted leading-relaxed">
                        Los TreePoints y las rachas crean un hábito diario. Esto potencia el cross-selling B2B2C y mantiene el engagement alto en todos los segmentos.
                    </p>
                </div>
                <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active hover:border-segment-socio transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-segment-socio/10 flex items-center justify-center mb-4 text-segment-socio group-hover:bg-segment-socio group-hover:text-white transition-colors">
                        <Database className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold mb-2">SaaS + Micro-tarifas</h4>
                    <p className="text-sm text-treevu-muted leading-relaxed">
                        Precios PEPM escalables para empresas y micro-tarifas transaccionales para usuarios power-users, maximizando el LTV sin barreras de entrada.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
