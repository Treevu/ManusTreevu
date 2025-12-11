
import React from 'react';
import { Building2, Globe2, Briefcase, Award } from 'lucide-react';

const SocialProof: React.FC = () => {
  return (
    <section className="py-12 bg-treevu-surface border-y border-treevu-active overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Impulsando la retención en:
            </p>
            
            {/* Logos Placeholders - Usando iconos Lucide para simular logos corporativos abstractos */}
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 group">
                    <Building2 className="w-8 h-8 text-segment-empresa group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-xl text-white">Corp<span className="text-gray-500">Logistics</span></span>
                </div>
                <div className="flex items-center gap-2 group">
                    <Globe2 className="w-8 h-8 text-brand-primary group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-xl text-white">Global<span className="text-gray-500">Retail</span></span>
                </div>
                <div className="flex items-center gap-2 group">
                    <Briefcase className="w-8 h-8 text-segment-socio group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-xl text-white">Talent<span className="text-gray-500">Hub</span></span>
                </div>
                <div className="flex items-center gap-2 group">
                    <Award className="w-8 h-8 text-brand-accent group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-xl text-white">Best<span className="text-gray-500">Place</span></span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
