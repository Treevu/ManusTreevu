
import React from 'react';
import { Eye, Brain, Bot, Sparkles, ArrowRight, Target, Receipt, TrendingUp, Share2 } from 'lucide-react';

const TechStack: React.FC = () => {
  return (
    <section id="ai-logic" className="py-32 bg-[#161618] text-white overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="px-4 py-1 rounded-full border border-segment-empresa/30 bg-segment-empresa/10 text-segment-empresa font-semibold tracking-wider uppercase text-xs">
            Powered by Proprietary Multi-Modal AI
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mt-6 mb-6 text-white">
            Inteligencia que trabaja <br/><span className="text-treevu-muted">mientras duermes</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connecting Lines (Desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-brand-primary via-segment-empresa to-segment-socio opacity-20 z-0"></div>

          {/* Step 1: Percepción */}
          <div className="relative z-10 bg-treevu-surface border border-treevu-active p-8 rounded-3xl hover:border-brand-primary transition-all duration-300 hover:-translate-y-2 group">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary opacity-[0.03] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-[0.08]"></div>
            
            <div className="bg-treevu-base p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 border border-treevu-active shadow-lg shadow-brand-primary/5 group-hover:border-brand-primary/30 transition-colors">
              <Eye className="w-8 h-8 text-brand-primary" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-center mb-1 text-white">1. Percepción</h3>
            <p className="text-brand-primary text-center text-xs font-bold uppercase tracking-widest mb-8">TREEVÜ VISION ENGINE™</p>
            
            <div className="h-px w-full bg-treevu-active mb-6"></div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 mr-3 text-brand-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">Detección de formalidad</span>
              </li>
              <li className="flex items-start">
                <Receipt className="w-5 h-5 mr-3 text-brand-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">Extracción de ítems</span>
              </li>
            </ul>
          </div>

          {/* Step 2: Cognición */}
          <div className="relative z-10 bg-treevu-surface border border-treevu-active p-8 rounded-3xl hover:border-segment-empresa transition-all duration-300 hover:-translate-y-2 group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-segment-empresa opacity-[0.03] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-[0.08]"></div>

             <div className="bg-treevu-base p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 border border-treevu-active shadow-lg shadow-segment-empresa/5 group-hover:border-segment-empresa/30 transition-colors">
              <Brain className="w-8 h-8 text-segment-empresa" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-center mb-1 text-white">2. Cognición</h3>
            <p className="text-segment-empresa text-center text-xs font-bold uppercase tracking-widest mb-8">TREEVÜ GRAPH™</p>
            
            <div className="h-px w-full bg-treevu-active mb-6"></div>

             <ul className="space-y-4">
              <li className="flex items-start">
                <Share2 className="w-5 h-5 mr-3 text-segment-empresa flex-shrink-0" />
                <span className="text-gray-300 text-sm">Construcción del Graph</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 mr-3 text-segment-empresa flex-shrink-0" />
                <span className="text-gray-300 text-sm">Retention Signals (FWI)</span>
              </li>
            </ul>
          </div>

          {/* Step 3: Asistencia */}
          <div className="relative z-10 bg-treevu-surface border border-treevu-active p-8 rounded-3xl hover:border-segment-socio transition-all duration-300 hover:-translate-y-2 group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-segment-socio opacity-[0.03] rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-[0.08]"></div>

             <div className="bg-treevu-base p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-8 border border-treevu-active shadow-lg shadow-segment-socio/5 group-hover:border-segment-socio/30 transition-colors">
              <Bot className="w-8 h-8 text-segment-socio" />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-center mb-1 text-white">3. Asistencia</h3>
            <p className="text-segment-socio text-center text-xs font-bold uppercase tracking-widest mb-8">AGENTS ORCHESTRATOR™</p>
            
            <div className="h-px w-full bg-treevu-active mb-6"></div>

             <ul className="space-y-4">
              <li className="flex items-start">
                <Bot className="w-5 h-5 mr-3 text-segment-socio flex-shrink-0" />
                <span className="text-gray-300 text-sm">Coach Financiero 24/7</span>
              </li>
              <li className="flex items-start">
                <Target className="w-5 h-5 mr-3 text-segment-socio flex-shrink-0" />
                <span className="text-gray-300 text-sm">Asistente de Marketing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
