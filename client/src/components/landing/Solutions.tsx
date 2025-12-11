import React from 'react';
import { User, Building2, Store, AlertTriangle, CheckCircle2, RefreshCw, Zap, Heart, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';

interface SolutionCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  themeColor: 'primary' | 'empresa' | 'socio'; // Maps to tailwind colors
  problems: string[];
  solutions: string[];
}

const themeConfig = {
  primary: {
    text: 'text-brand-primary',
    bg: 'bg-brand-primary',
    border: 'hover:border-brand-primary',
    gradient: 'from-treevu-base via-emerald-900/20 to-treevu-base'
  },
  empresa: {
    text: 'text-segment-empresa',
    bg: 'bg-segment-empresa',
    border: 'hover:border-segment-empresa',
    gradient: 'from-treevu-base via-blue-900/20 to-treevu-base'
  },
  socio: {
    text: 'text-segment-socio',
    bg: 'bg-segment-socio',
    border: 'hover:border-segment-socio',
    gradient: 'from-treevu-base via-purple-900/20 to-treevu-base'
  }
};

const SolutionCard: React.FC<SolutionCardProps> = ({ icon: Icon, title, subtitle, themeColor, problems, solutions }) => {
  const theme = themeConfig[themeColor];

  return (
    <div className={`bg-treevu-surface rounded-3xl p-8 border border-treevu-active ${theme.border} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden h-full`}>
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} opacity-[0.03] rounded-full blur-3xl -mr-20 -mt-20 transition-opacity group-hover:opacity-[0.08]`}></div>
      
      <div className="mb-8 relative">
        <div className={`inline-flex p-3 rounded-2xl bg-treevu-base border border-treevu-active mb-4 ${theme.text}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-3xl font-display font-bold text-white mb-1">{title}</h3>
        <p className={`${theme.text} font-medium text-sm tracking-wider uppercase`}>{subtitle}</p>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="bg-treevu-base/50 p-5 rounded-2xl border border-red-900/30">
          <h4 className="flex items-center text-brand-danger font-semibold mb-4 text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 mr-2" /> El Dolor
          </h4>
          <ul className="space-y-3">
            {problems.map((item, idx) => (
              <li key={idx} className="text-treevu-muted text-sm flex items-start">
                <span className="mr-2 text-brand-danger/60 mt-1">×</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pl-2 border-l-2 border-treevu-active group-hover:border-opacity-100 transition-colors" style={{ borderColor: 'var(--tw-border-opacity)' }}>
          <h4 className={`flex items-center ${theme.text} font-semibold mb-4 text-sm uppercase tracking-wider`}>
            <CheckCircle2 className="w-4 h-4 mr-2" /> Solución Treevü
          </h4>
          <ul className="space-y-3">
            {solutions.map((item, idx) => (
              <li key={idx} className="text-white font-medium text-sm flex items-start">
                 <CheckCircle2 className={`w-4 h-4 mr-2 ${theme.text} opacity-80 flex-shrink-0 mt-0.5`} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Solutions: React.FC = () => {
  return (
    <section id="solutions" className="py-32 bg-treevu-base relative overflow-hidden">
       {/* Decorative background blob */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-treevu-surface opacity-30 rounded-full blur-[120px] pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="text-brand-primary font-semibold tracking-widest uppercase text-sm">El Ecosistema</span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mt-3 mb-6">
            Conectando necesidades reales
          </h2>
          <p className="text-xl text-treevu-muted max-w-3xl mx-auto">
            Un ciclo virtuoso donde el bienestar financiero genera valor compartido para todos.
          </p>
        </div>

        {/* CIRCULAR VALUE LOOP (Desktop & Mobile Responsive) */}
        <div className="relative w-full max-w-4xl mx-auto mb-32 hidden md:block h-[550px]">
           
           {/* Central Core - Adjusted to top-[58%] for visual centroid */}
           <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 flex items-center justify-center z-0 bg-treevu-base/50 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full border border-brand-primary/20 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-segment-empresa/20 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="text-center">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sinergia</p>
                 <h3 className="text-xl font-display font-extrabold text-white tracking-tight leading-none">
                   TREEVÜ<br/>DATA LOOP
                 </h3>
              </div>
           </div>

           {/* SVG Connecting Lines (Symmetric Triangle) */}
           {/* Coordinates based on ViewBox 0 0 900 550 */}
           {/* Top Center: 450, 80 */}
           {/* Right Bottom: 780, 450 */}
           {/* Left Bottom: 120, 450 */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" viewBox="0 0 900 550">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              
              {/* Path Empresa -> Persona (Top -> Right) */}
              {/* Curve outward to right */}
              <path d="M450 80 Q 750 180 780 450" fill="none" stroke="url(#grad2)" strokeWidth="2" strokeDasharray="8 4" className="opacity-40" />
              <circle r="4" fill="#34D399">
                <animateMotion dur="8s" repeatCount="indefinite" path="M450 80 Q 750 180 780 450" />
              </circle>

              {/* Path Persona -> Comercio (Right -> Left) */}
              {/* Curve downward */}
              <path d="M780 450 Q 450 600 120 450" fill="none" stroke="url(#grad3)" strokeWidth="2" strokeDasharray="8 4" className="opacity-40" />
              <circle r="4" fill="#C084FC">
                 <animateMotion dur="8s" repeatCount="indefinite" path="M780 450 Q 450 600 120 450" />
              </circle>

              {/* Path Comercio -> Empresa (Left -> Top) */}
              {/* Curve outward to left */}
              <path d="M120 450 Q 150 180 450 80" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="8 4" className="opacity-40" />
              <circle r="4" fill="#60A5FA">
                 <animateMotion dur="8s" repeatCount="indefinite" path="M120 450 Q 150 180 450 80" />
              </circle>
           </svg>

           {/* Node 1: EMPRESA (Top) */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 text-center z-10 hover:scale-105 transition-transform duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-4">
                 <div className="absolute inset-0 bg-segment-empresa/20 rounded-full blur-xl group-hover:bg-segment-empresa/40 transition-colors"></div>
                 <div className="relative bg-treevu-base border border-segment-empresa text-segment-empresa rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-segment-empresa/20">
                    <Building2 className="w-8 h-8" />
                 </div>
                 {/* Pulse indicator */}
                 <div className="absolute -bottom-8 -right-8 text-segment-empresa rotate-45 animate-pulse opacity-50">
                    <RefreshCw className="w-6 h-6" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white">Empresa</h3>
              <div className="mt-2 bg-treevu-surface/90 backdrop-blur border border-segment-empresa/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                 <div className="font-bold text-white mb-1 border-b border-white/10 pb-1">Driver: Productividad</div>
                 Inyecta <span className="text-segment-empresa font-bold">Capital</span>
                 <br/>Gana <span className="text-white font-bold">Retención</span>
              </div>
           </div>

           {/* Node 2: PERSONA (Bottom Right) */}
           {/* Positioned to match SVG coords (780, 450) visually in 900x550 container */}
           <div className="absolute bottom-4 right-[5%] w-64 text-center z-10 hover:scale-105 transition-transform duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-4">
                 <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-xl group-hover:bg-brand-primary/40 transition-colors"></div>
                 <div className="relative bg-treevu-base border border-brand-primary text-brand-primary rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-brand-primary/20">
                    <User className="w-8 h-8" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white">Persona</h3>
              <div className="mt-2 bg-treevu-surface/90 backdrop-blur border border-brand-primary/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                 <div className="font-bold text-white mb-1 border-b border-white/10 pb-1">Driver: Bienestar</div>
                 Usa <span className="text-brand-primary font-bold">Liquidez</span>
                 <br/>Recibe <span className="text-segment-socio font-bold">Beneficios</span>
              </div>
           </div>

           {/* Node 3: COMERCIO (Bottom Left) */}
           {/* Positioned to match SVG coords (120, 450) visually in 900x550 container */}
           <div className="absolute bottom-4 left-[5%] w-64 text-center z-10 hover:scale-105 transition-transform duration-300 group">
              <div className="relative w-20 h-20 mx-auto mb-4">
                 <div className="absolute inset-0 bg-segment-socio/20 rounded-full blur-xl group-hover:bg-segment-socio/40 transition-colors"></div>
                 <div className="relative bg-treevu-base border border-segment-socio text-segment-socio rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-segment-socio/20">
                    <Store className="w-8 h-8" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white">Comercio</h3>
              <div className="mt-2 bg-treevu-surface/90 backdrop-blur border border-segment-socio/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                 <div className="font-bold text-white mb-1 border-b border-white/10 pb-1">Driver: Ventas</div>
                 Da <span className="text-segment-socio font-bold">Descuentos</span>
                 <br/>Obtiene <span className="text-white font-bold">Fidelidad</span>
              </div>
           </div>

        </div>

        {/* MOBILE STACKED VIEW (Simplified) */}
        <div className="md:hidden flex flex-col gap-4 mb-20 max-w-xs mx-auto">
           <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active text-center relative">
              <Building2 className="w-8 h-8 text-segment-empresa mx-auto mb-2" />
              <h3 className="text-white font-bold">Empresa</h3>
              <p className="text-xs text-gray-400 mt-1">Inyecta incentivos</p>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 bg-treevu-base p-1 rounded-full border border-treevu-active">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
           </div>
           
           <div className="h-4"></div>

           <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active text-center relative">
              <User className="w-8 h-8 text-brand-primary mx-auto mb-2" />
              <h3 className="text-white font-bold">Persona</h3>
              <p className="text-xs text-gray-400 mt-1">Recupera poder adquisitivo</p>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 bg-treevu-base p-1 rounded-full border border-treevu-active">
                <Zap className="w-4 h-4 text-white" />
              </div>
           </div>

           <div className="h-4"></div>

           <div className="bg-treevu-surface p-6 rounded-2xl border border-treevu-active text-center relative">
              <Store className="w-8 h-8 text-segment-socio mx-auto mb-2" />
              <h3 className="text-white font-bold">Comercio</h3>
              <p className="text-xs text-gray-400 mt-1">Vende más y mejor</p>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 bg-treevu-base p-1 rounded-full border border-treevu-active">
                <Heart className="w-4 h-4 text-white" />
              </div>
           </div>
           
           <div className="h-4"></div>
           
           <div className="text-center">
             <span className="text-xs text-brand-primary font-bold uppercase tracking-widest">↺ El ciclo se repite</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SolutionCard 
            icon={User}
            title="Personas"
            subtitle="Bienestar & Ahorro"
            themeColor="primary"
            problems={[
              "Registro manual tedioso (Excel/Apps)",
              "Desconocimiento de beneficio fiscal",
              "Estrés financiero crónico"
            ]}
            solutions={[
              "OCR Treevü Vision™ (Foto y listo)",
              "Radar Fiscal 3 UIT Automático",
              "Monetiza tu ahorro: Cashback y Descuentos reales"
            ]}
          />
          <SolutionCard 
            icon={Building2}
            title="Empresas"
            subtitle="Productividad & Retención"
            themeColor="empresa"
            problems={[
              "Alta rotación de talento joven",
              "Baja productividad por stress financiero",
              "Desconexión cultura-empleado"
            ]}
            solutions={[
              "FWI (Financial Wellness Index)",
              "Alertas de fuga (Cognitive Core™)",
              "Morning Brief Inteligente"
            ]}
          />
          <SolutionCard 
            icon={Store}
            title="Comercios"
            subtitle="Conversión & Lealtad"
            themeColor="socio"
            problems={[
              "Campañas masivas de bajo retorno",
              "Sin acceso a clientes 'Prime'",
              "Falta de insights competitivos"
            ]}
            solutions={[
              "Ofertas hiper-segmentadas",
              "Benchmarking sectorial con IA",
              "Venta directa a usuarios con liquidez"
            ]}
          />
        </div>
       </div>
    </section>
  );
};

export default Solutions;