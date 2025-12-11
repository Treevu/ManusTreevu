
import React from 'react';
import { Leaf, QrCode, TrendingUp } from 'lucide-react';

const TreevuCard: React.FC = () => {
  return (
    <div className="w-full h-52 rounded-2xl bg-gradient-to-br from-[#1c1c1e] via-[#2C2C2E] to-black border border-white/10 p-6 relative overflow-hidden shadow-2xl group transition-all hover:scale-[1.01]">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-segment-socio/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
      
      {/* Holographic Overlay Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
             <div className="bg-brand-primary/20 p-1.5 rounded-lg border border-brand-primary/30 backdrop-blur-md">
                <Leaf className="w-5 h-5 text-brand-primary" />
             </div>
             <div>
                 <span className="font-display font-bold text-xl text-white tracking-tight">Treevü<span className="text-brand-primary">ID</span></span>
                 <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Member Pass</p>
             </div>
          </div>
          
          <div className="text-right">
              <span className="block text-[10px] text-brand-accent font-bold uppercase tracking-wider mb-0.5">Nivel Actual</span>
              <div className="bg-gradient-to-r from-brand-accent via-yellow-200 to-brand-accent bg-clip-text text-transparent font-bold italic text-lg shadow-sm">
                  GOLD MEMBER
              </div>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex items-center gap-6 pl-1">
             <div>
                 <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Tu Score FWI</p>
                 <div className="flex items-baseline gap-1">
                     <span className="text-4xl font-display font-bold text-white">78</span>
                     <span className="text-xs text-brand-primary font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +2.4
                     </span>
                 </div>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                 <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">TreePoints</p>
                 <span className="text-xl font-mono font-bold text-gray-200">1,250</span>
             </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
             <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Titular</p>
                <p className="text-sm text-white font-bold tracking-wide">JUAN PÉREZ</p>
             </div>
             
             {/* QR Code Simulation */}
             <div className="bg-white p-1 rounded-lg shadow-lg border border-gray-200">
                 <QrCode className="w-10 h-10 text-black" />
             </div>
        </div>
      </div>
    </div>
  );
};

export default TreevuCard;
