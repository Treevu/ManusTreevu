
import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Lock, Unlock, ArrowRight, TrendingUp, Users, DollarSign, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type CalculationStep = 'INPUT' | 'TEASER' | 'REVEALED';

const RoiCalculator: React.FC = () => {
  const [step, setStep] = useState<CalculationStep>('INPUT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inputs
  const [employees, setEmployees] = useState(200);
  const [turnoverRate, setTurnoverRate] = useState(25); // %
  const [salary, setSalary] = useState(1200); // USD
  const [replacementFactor, setReplacementFactor] = useState(1.5); // 1.0 - 2.0

  // Lead Form
  const [leadForm, setLeadForm] = useState({
    name: '',
    role: '',
    email: ''
  });

  // Hidden Constants
  const REDUCTION_FACTOR = 0.15; // 15% impact
  const TREEVU_COST_PER_USER = 4.0; // $4.00 USD (Average between Core $2.5 and Proactive $5)

  // Calculated Values
  const turnoverCount = Math.round(employees * (turnoverRate / 100));
  const costPerReplacement = salary * replacementFactor;
  const totalTurnoverCost = turnoverCount * costPerReplacement; // CTR
  const grossSavings = totalTurnoverCost * REDUCTION_FACTOR; // ABT
  
  // Annual Treevu Cost
  const treevuAnnualCost = employees * TREEVU_COST_PER_USER * 12;
  
  // Net ROI
  const netRoi = grossSavings - treevuAnnualCost;
  const roiMultiplier = (netRoi / treevuAnnualCost).toFixed(1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleCalculate = () => {
    setStep('TEASER');
    setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('REVEALED');
  };

  return (
    <section id="roi-calculator" className="py-24 bg-[#0f1014] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-segment-empresa to-transparent opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-segment-empresa opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-segment-empresa/10 border border-segment-empresa/20 text-segment-empresa font-bold uppercase tracking-widest text-xs mb-4">
            <Calculator className="w-3 h-3" /> Herramienta B2B
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Calculadora de ROI de la Retención
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Descubre cuánto le cuesta realmente la rotación a tu empresa y cuánto podrías ahorrar implementando Treevü Proactive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" ref={scrollRef}>
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-5 bg-treevu-surface border border-treevu-active rounded-3xl p-8 shadow-xl h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-treevu-base border border-treevu-active flex items-center justify-center text-sm mr-3 text-gray-300">1</span>
              Datos de tu Empresa
            </h3>

            <div className="space-y-6">
              {/* Input 1 */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Empleados Totales (Nómina)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-segment-empresa" />
                  <input 
                    type="number" 
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full bg-treevu-base border border-treevu-active rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-segment-empresa outline-none font-mono"
                  />
                </div>
              </div>

              {/* Input 2 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Tasa de Rotación Anual</label>
                  <span className="text-xs font-bold text-segment-empresa">{turnoverRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="1"
                  value={turnoverRate}
                  onChange={(e) => setTurnoverRate(Number(e.target.value))}
                  className="w-full h-2 bg-treevu-active rounded-lg appearance-none cursor-pointer accent-segment-empresa"
                />
                <p className="text-[10px] text-gray-500 mt-1">Promedio LATAM: 20-30%</p>
              </div>

              {/* Input 3 */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Salario Promedio Mensual (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-segment-empresa" />
                  <input 
                    type="number" 
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full bg-treevu-base border border-treevu-active rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-segment-empresa outline-none font-mono"
                  />
                </div>
              </div>

              {/* Input 4 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Factor Costo Reemplazo</label>
                  <span className="text-xs font-bold text-segment-empresa">{replacementFactor}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="2.5" 
                  step="0.1"
                  value={replacementFactor}
                  onChange={(e) => setReplacementFactor(Number(e.target.value))}
                  className="w-full h-2 bg-treevu-active rounded-lg appearance-none cursor-pointer accent-segment-empresa"
                />
                <p className="text-[10px] text-gray-500 mt-1">Incluye reclutamiento, capacitación y curva de aprendizaje.</p>
              </div>

              <button 
                onClick={handleCalculate}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    step === 'INPUT' 
                    ? 'bg-segment-empresa text-treevu-base hover:bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.3)]' 
                    : 'bg-treevu-active text-gray-400 cursor-default'
                }`}
              >
                {step === 'INPUT' ? 'Calcular Impacto' : 'Datos Actualizados'}
                {step === 'INPUT' && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-7">
            {step === 'INPUT' && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-treevu-active border-dashed rounded-3xl opacity-50">
                    <div className="w-20 h-20 bg-treevu-surface rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">Esperando datos...</h3>
                    <p className="text-gray-500">Completa el formulario para ver tu proyección.</p>
                </div>
            )}

            {step !== 'INPUT' && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* 1. THE PROBLEM (Visible) */}
                    <div className="bg-[#1a1515] border border-red-900/30 rounded-3xl p-8 relative overflow-hidden">
                         <div className="flex justify-between items-start relative z-10">
                             <div>
                                 <div className="flex items-center gap-2 text-brand-danger mb-2">
                                     <AlertCircle className="w-5 h-5" />
                                     <span className="font-bold uppercase text-xs tracking-wider">Costo Total de Rotación (Anual)</span>
                                 </div>
                                 <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
                                     {formatCurrency(totalTurnoverCost)}
                                 </div>
                                 <p className="text-sm text-gray-500">
                                     Tu empresa pierde este monto anualmente reemplazando a ~{turnoverCount} personas.
                                 </p>
                             </div>
                         </div>
                    </div>

                    {/* 2. THE SAVINGS (Teaser) */}
                    <div className="bg-[#0f1c15] border border-green-900/30 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                             <div>
                                 <div className="flex items-center gap-2 text-brand-primary mb-2">
                                     <CheckCircle2 className="w-5 h-5" />
                                     <span className="font-bold uppercase text-xs tracking-wider">Ahorro Bruto Estimado (Treevü)</span>
                                 </div>
                                 <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2">
                                     {formatCurrency(grossSavings)}
                                 </div>
                                 <p className="text-sm text-gray-500">
                                     Proyectado con una reducción conservadora del 15% en la rotación.
                                 </p>
                             </div>
                         </div>
                    </div>

                    {/* 3. NET ROI (GATED) */}
                    <div className="bg-treevu-surface border border-segment-empresa rounded-3xl p-8 relative overflow-hidden">
                        {step === 'TEASER' ? (
                            /* GATED VIEW */
                            <div className="relative z-10 flex flex-col items-center text-center py-6">
                                <div className="w-16 h-16 bg-segment-empresa/20 text-segment-empresa rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Desbloquear ROI Neto</h3>
                                <p className="text-gray-400 mb-8 max-w-md">
                                    Tu ROI NETO es la clave. Revela cuánto ganarás tras deducir el costo del Plan Proactive de Treevü.
                                </p>
                                
                                <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-4">
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Nombre y Apellido"
                                        className="w-full px-4 py-3 bg-treevu-base border border-treevu-active rounded-xl text-white focus:ring-2 focus:ring-segment-empresa outline-none"
                                        value={leadForm.name}
                                        onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                                    />
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Cargo (Ej. HR Manager)"
                                        className="w-full px-4 py-3 bg-treevu-base border border-treevu-active rounded-xl text-white focus:ring-2 focus:ring-segment-empresa outline-none"
                                        value={leadForm.role}
                                        onChange={e => setLeadForm({...leadForm, role: e.target.value})}
                                    />
                                    <input 
                                        required
                                        type="email" 
                                        placeholder="Correo Corporativo"
                                        className="w-full px-4 py-3 bg-treevu-base border border-treevu-active rounded-xl text-white focus:ring-2 focus:ring-segment-empresa outline-none"
                                        value={leadForm.email}
                                        onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-segment-empresa hover:bg-blue-400 text-treevu-base font-bold py-4 rounded-xl shadow-lg shadow-segment-empresa/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Unlock className="w-5 h-5" />}
                                        {isSubmitting ? 'Calculando...' : 'Revelar Análisis Completo'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* REVEALED VIEW */
                            <div className="animate-fade-in-up relative z-10">
                                <div className="flex items-center gap-2 text-segment-empresa mb-6">
                                     <Unlock className="w-5 h-5" />
                                     <span className="font-bold uppercase text-xs tracking-wider">Análisis de Rentabilidad</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-4 rounded-xl bg-treevu-base border border-treevu-active">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Inversión Anual Treevü</p>
                                        <p className="text-xl font-bold text-white">{formatCurrency(treevuAnnualCost)}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Plan Proactive (~$4/user)</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-segment-empresa/10 border border-segment-empresa/30">
                                        <p className="text-xs text-segment-empresa uppercase mb-1">Multiplicador ROI</p>
                                        <p className="text-xl font-bold text-white">{roiMultiplier}x</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Retorno por cada $1 invertido</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-segment-empresa to-blue-600 rounded-2xl p-6 text-center shadow-lg shadow-blue-900/50">
                                    <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">ROI Neto Anual Proyectado</p>
                                    <p className="text-5xl font-display font-extrabold text-white mb-4">{formatCurrency(netRoi)}</p>
                                    <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">
                                        Este es el capital que recuperas directamente al P&L reduciendo la rotación en solo un 15%.
                                    </p>
                                    <button 
                                        onClick={() => window.location.href = '#founders-offer'}
                                        className="bg-white text-segment-empresa px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Agendar Demo sobre estos números
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Blur effect for blocked state */}
                        {step === 'TEASER' && (
                            <div className="absolute inset-0 bg-treevu-surface/60 backdrop-blur-sm z-0"></div>
                        )}
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
