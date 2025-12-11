
import React from 'react';
import { X, Check, Brain, ShieldCheck, Zap, Layers, Lock, TrendingUp, AlertTriangle } from 'lucide-react';

const WhyTreevu: React.FC = () => {
  return (
    <section className="py-24 bg-[#131315] relative overflow-hidden border-t border-treevu-active">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary opacity-[0.02] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold tracking-widest uppercase text-xs mb-2 block">
            Diferenciación Estratégica
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            No somos otra App de Préstamos.<br />
            <span className="text-gray-500">Somos una Capa de Inteligencia.</span>
          </h2>
          <p className="text-treevu-muted max-w-3xl mx-auto text-lg">
            La mayoría de soluciones se enfocan en endeudar al usuario o gestionar planillas manualmente. 
            Treevü cambia el paradigma hacia la proactividad y la data.
          </p>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* THE OLD WAY */}
          <div className="bg-treevu-surface/50 border border-treevu-active/50 rounded-3xl p-8 relative overflow-hidden grayscale opacity-80 hover:opacity-100 transition-opacity">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertTriangle className="w-24 h-24" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-400 mb-8 flex items-center gap-3">
              <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
              Enfoque Tradicional
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Reactivo (Fuego)</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Solo actúan cuando el empleado ya tiene problemas financieros o solicita un adelanto urgentemente.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Riesgo Financiero</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Modelos custodios donde la plataforma presta su propio capital, generando intereses y deuda.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Manual & Lento</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Registro de gastos en Excel o Apps manuales que nadie usa después de la primera semana.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* THE TREEVU WAY */}
          <div className="bg-treevu-surface border border-brand-primary/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-24 h-24 text-brand-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
              </span>
              Ecosistema Treevü
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Proactivo (Predictivo)</h4>
                  <p className="text-sm text-treevu-muted leading-relaxed">Detectamos el estrés financiero antes de que ocurra mediante patrones de comportamiento y FWI.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">No-Custodio (SaaS)</h4>
                  <p className="text-sm text-treevu-muted leading-relaxed">Solo orquestamos la data. El dinero fluye directo de la empresa al empleado o comercio. Cero riesgo de balance.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Automatización IA</h4>
                  <p className="text-sm text-treevu-muted leading-relaxed">OCR instantáneo y categorización automática. "Flash" hace el trabajo sucio por el usuario.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* USP HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/5 hover:border-brand-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-primary text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Bienestar como Activo</h4>
            <p className="text-sm text-gray-500">Transformamos el bienestar financiero de un "gasto de RRHH" a un driver de ROI medible.</p>
          </div>

          <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/5 hover:border-segment-empresa/50 transition-colors group">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-segment-empresa text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Seguridad Primero</h4>
            <p className="text-sm text-gray-500">Arquitectura "Zero-Knowledge" en datos sensibles. Cumplimiento normativo sin fricción.</p>
          </div>

          <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/5 hover:border-segment-socio/50 transition-colors group">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-segment-socio text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-lg mb-2">Integración Total</h4>
            <p className="text-sm text-gray-500">Conectamos Nómina (HRIS), Banca y Comercios en una sola experiencia fluida.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyTreevu;
