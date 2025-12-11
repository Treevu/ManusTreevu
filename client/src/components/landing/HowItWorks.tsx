
import React from 'react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Calculator, Smartphone, Server, Landmark } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Cálculo del Disponible",
      description: "Nuestro motor (Treevü Core) calcula automáticamente el monto disponible basado en días trabajados y salario devengado.",
      icon: Calculator,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      border: "border-brand-primary/20",
      role: "Treevü (IA)"
    },
    {
      id: 2,
      title: "Solicitud Digital",
      description: "El colaborador solicita un monto desde la App y firma digitalmente una 'Cesión de Derechos de Cobro'.",
      icon: Smartphone,
      color: "text-white",
      bg: "bg-white/10",
      border: "border-white/20",
      role: "Colaborador"
    },
    {
      id: 3,
      title: "Enrutamiento",
      description: "Treevü valida las reglas de negocio y envía una instrucción de pago encriptada a la tesorería de la empresa.",
      icon: Server,
      color: "text-segment-empresa",
      bg: "bg-segment-empresa/10",
      border: "border-segment-empresa/20",
      role: "Plataforma"
    },
    {
      id: 4,
      title: "Dispersión Directa",
      description: "La empresa ejecuta el pago directamente al colaborador. Treevü nunca toca ni custodia los fondos.",
      icon: Landmark,
      color: "text-segment-socio",
      bg: "bg-segment-socio/10",
      border: "border-segment-socio/20",
      role: "Tesorería Empresa"
    }
  ];

  return (
    <section className="py-24 bg-treevu-base relative overflow-hidden">
      {/* Background Flow Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-treevu-active to-transparent -translate-y-1/2 hidden lg:block border-t border-dashed border-gray-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <span className="text-segment-empresa font-semibold tracking-widest uppercase text-xs mb-2 block">
            Modelo Operativo EWA Lite
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Un Motor de Inteligencia, <br/>
            <span className="text-gray-500">No un Banco.</span>
          </h2>
          <p className="text-treevu-muted max-w-2xl mx-auto">
            Nuestro modelo <span className="text-white font-bold">No-Custodio</span> separa el flujo de información del flujo de dinero.
            La tesorería mantiene el control total.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                    {/* Connecting Arrow for Desktop */}
                    {idx < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20 text-gray-600">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                        </div>
                    )}

                    <div className={`bg-treevu-surface p-6 rounded-2xl border border-treevu-active transition-all duration-300 h-full flex flex-col hover:-translate-y-2 ${step.border} group-hover:shadow-2xl relative overflow-hidden`}>
                        {/* Role Tag */}
                        <div className="absolute top-4 right-4 bg-treevu-base border border-treevu-active px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {step.role}
                        </div>

                        <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mb-6 ${step.color} shadow-inner`}>
                            <step.icon className="w-7 h-7" />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-treevu-base border border-treevu-active text-xs font-bold text-gray-500">
                                 {step.id}
                             </span>
                             <h3 className="text-lg font-bold text-white leading-tight">{step.title}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Zero Balance Risk para Treevü
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
