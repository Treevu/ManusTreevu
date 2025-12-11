import React, { useMemo } from 'react';
import { Expense, SubscriptionTier, SavingsGoal, ExpenseCategory } from './types';
import { PieChart, AlertTriangle, Zap, Calendar, Scale, FileSearch, Sparkles, Banknote, Store, Tag } from 'lucide-react';

// Alias for compatibility
const ChartPieIcon = PieChart;
const ExclamationTriangleIcon = AlertTriangle;
const BoltIcon = Zap;
const CalendarDaysIcon = Calendar;
const ScaleIcon = Scale;
const DocumentMagnifyingGlassIcon = FileSearch;
const SparklesIcon = Sparkles;
const BanknotesIcon = Banknote;
const BuildingStorefrontIcon = Store;
const TagIcon = Tag;
import FlipCard from './FlipCard';
import { ScoreBadge } from './UIAtoms';
import Tooltip from './Tooltip';

interface Props {
  expenses: Expense[];
  budget: number;
  subscriptionTier: SubscriptionTier;
  onUpgrade: () => void;
  savingsGoals?: SavingsGoal[]; 
}

// Local Sparkline Component
const Sparkline = ({ data, color = "text-emerald-400" }: { data: number[], color?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
    return (<svg viewBox="0 0 100 100" className="w-full h-8 opacity-70" preserveAspectRatio="none"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className={color} /></svg>);
};

const B2CAnalytics: React.FC<Props> = ({ expenses, budget, subscriptionTier, onUpgrade, savingsGoals = [] }) => {
  const isPremium = subscriptionTier !== SubscriptionTier.FREE;

  const metrics = useMemo(() => {
    const total: number = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Category Breakdown
    const byCategory = expenses.reduce((acc, curr) => {
      const categoryName = String(curr.category);
      const currentVal = acc[categoryName] || 0;
      acc[categoryName] = currentVal + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    const sortedCategories = Object.entries(byCategory).map(([cat, amount]: [string, number]) => ({ cat, amount, pct: total ? (amount / total) * 100 : 0 })).sort((a, b) => b.amount - a.amount);
    
    // Formal vs Informal
    const formalTotal: number = expenses.filter(e => e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const informalTotal: number = expenses.filter(e => !e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const lostSavings: number = expenses.filter(e => !e.isFormal).reduce((acc, e) => acc + (e.lostSavings || 0), 0);
    
    // Trends (Mocked for demo based on total)
    const trendHistory = [total * 0.8, total * 0.9, total * 0.85, total * 1.1, total * 0.95, total];
    const formalHistory = [formalTotal * 0.7, formalTotal * 0.8, formalTotal * 0.75, formalTotal * 0.9, formalTotal];
    const dailyFreq = [10, 45, 20, 15, 60, 90, 80]; // Mock distribution
    const maxDaily = Math.max(...dailyFreq);
    
    // Budget Logic
    const daysPassed = Math.max(1, new Date().getDate());
    const budgetToDate = budget > 0 ? (budget / 30) * daysPassed : 0;
    const deviationPct = budget > 0 
        ? ((total - budgetToDate) / budgetToDate) * 100 
        : 0;

    // Tax Logic
    const maxDeductible = 15450; 
    const currentDeductible = formalTotal * 0.15; 
    const deductibleProgress = Math.min(100, (currentDeductible / maxDeductible) * 100);
    
    // 50/30/20 Rule Logic (Needs vs Wants)
    const needsCategories = [ExpenseCategory.UTILITIES, ExpenseCategory.TRANSPORT, ExpenseCategory.HEALTH, ExpenseCategory.EDUCATION];
    const wantsCategories = [ExpenseCategory.FOOD, ExpenseCategory.ENTERTAINMENT, ExpenseCategory.SHOPPING, ExpenseCategory.OTHER];
    
    const needsTotal = expenses.filter(e => needsCategories.includes(e.category)).reduce((acc, e) => acc + e.amount, 0);
    const wantsTotal = expenses.filter(e => wantsCategories.includes(e.category)).reduce((acc, e) => acc + e.amount, 0);
    const savingsTotal = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0); // Total saved so far
    
    // For the monthly view, we estimate "Monthly Savings" as a portion of total budget or income proxy
    const estimatedIncome = budget > 0 ? budget : total * 1.2; 
    const monthlySavings = Math.max(0, estimatedIncome - total); // Simple cash flow proxy

    const structure = {
        needs: (needsTotal / estimatedIncome) * 100,
        wants: (wantsTotal / estimatedIncome) * 100,
        savings: (monthlySavings / estimatedIncome) * 100
    };

    // Ant Expenses (Gastos Hormiga)
    // Logic: Transaction < 20 soles AND (Food OR Other)
    const antExpenses = expenses.filter(e => e.amount < 20 && (e.category === ExpenseCategory.FOOD || e.category === ExpenseCategory.OTHER));
    const antTotal = antExpenses.reduce((acc, e) => acc + e.amount, 0);
    const antCount = antExpenses.length;

    // Deductible Breakdown (Granularity)
    const deductibleBreakdown = {
        restaurants: expenses.filter(e => e.isFormal && e.category === ExpenseCategory.FOOD).reduce((acc, e) => acc + (e.amount * 0.15), 0),
        hotels: expenses.filter(e => e.isFormal && e.category === ExpenseCategory.OTHER && e.merchant.toLowerCase().includes('hotel')).reduce((acc, e) => acc + (e.amount * 0.25), 0) // Mock heuristic
    };

    // Recovered Savings (Mocked for MVP - Logic would be sum of offer discounts)
    const recoveredSavings = 45.00; 

    // AI Analysis Logic for Deviation
    let deviationAnalysis = "";
    if (budget === 0) {
        deviationAnalysis = "Define tu presupuesto mensual para que la IA pueda analizar tu ritmo de gasto.";
    } else if (deviationPct > 20) {
        deviationAnalysis = "¡Alerta! Estás gastando muy por encima del ritmo sostenible. Revisa tus 'Gastos Hormiga' y comidas fuera.";
    } else if (deviationPct > 0) {
        deviationAnalysis = "Ligero exceso (+). Un par de días de austeridad te pondrán de nuevo en zona verde.";
    } else if (deviationPct > -10) {
        deviationAnalysis = "¡Perfecto! Estás en negativo (-), lo cual es bueno: significa que estás ahorrando respecto al plan.";
    } else {
        deviationAnalysis = "Excelente disciplina (-). Estás muy por debajo del límite. Considera aumentar tu aporte a Metas.";
    }

    const savingsRate = (monthlySavings + total) > 0 ? (monthlySavings / (monthlySavings + total)) * 100 : 0;

    return { 
        total, sortedCategories, formalTotal, informalTotal, lostSavings, 
        trendHistory, formalHistory, dailyFreq, maxDaily, 
        deviationPct, currentDeductible, maxDeductible, deductibleProgress, deviationAnalysis, 
        savingsRate, totalSaved: savingsTotal, recoveredSavings,
        structure, antTotal, antCount, deductibleBreakdown
    };
  }, [expenses, budget, savingsGoals]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2"><h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><ChartPieIcon className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> Analítica de Gastos</h2></div>
      
      {/* KPI GRID - REORDERED FOR VISIBILITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. TASA DE AHORRO (PRIORITY) */}
        <div className="md:col-span-1 lg:col-span-1">
            <FlipCard themeColor="emerald" heightClass="h-48" frontContent={
                <div className="h-full flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between mb-2 relative z-10 pr-6">
                        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            <BanknotesIcon className="w-5 h-5" /> Tasa de Ahorro <Tooltip content="Porcentaje de tus ingresos destinado a metas." />
                        </h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-4 relative z-10">
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-gray-200 dark:text-gray-800 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                                <circle className="text-emerald-500 progress-ring__circle stroke-current" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={`${metrics.savingsRate * 2.51} 251`}></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{metrics.savingsRate.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Acumulado</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">S/ {metrics.totalSaved.toFixed(0)}</p>
                        </div>
                    </div>
                </div>
            } backContent="Porcentaje de tus ingresos (o presupuesto) que logras destinar a tus metas de ahorro cada mes." />
        </div>

        {/* 2. AHORRO RECUPERADO (PRIORITY) */}
        <div className="md:col-span-1 lg:col-span-1">
             <FlipCard themeColor="emerald" heightClass="h-48" frontContent={
                 <div className="h-full flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-30 transition-opacity"><TagIcon className="w-24 h-24 text-yellow-500" /></div>
                      <div className="flex justify-between items-center mb-1 pr-6 relative z-10">
                         <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                             <TagIcon className="w-5 h-5" /> Ahorro Recuperado <Tooltip content="Dinero ahorrado gracias a descuentos." />
                         </h3>
                         {!isPremium && <span className="text-[10px] text-black font-bold bg-yellow-400 dark:bg-accent px-2 py-1 rounded shadow-lg">Explorer</span>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">
                          <p className="text-4xl font-bold text-white mb-1 drop-shadow-lg">S/ {metrics.recoveredSavings.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">En ofertas este mes</p>
                          
                          {!isPremium && (<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 backdrop-blur-[2px] p-6 text-center"><div className="bg-surface p-3 rounded-full border border-gray-200 dark:border-white/10 mb-3 shadow-xl"><TagIcon className="w-8 h-8 text-yellow-500 dark:text-accent" /></div><p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-medium">Mira cuánto has ahorrado con nuestras ofertas exclusivas.</p><button onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="px-4 py-2 bg-yellow-400 dark:bg-accent text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg">Desbloquear</button></div>)}
                      </div>
                 </div>
             } backContent="Dinero real que has dejado de gastar gracias a los descuentos y beneficios canjeados en el Marketplace." />
        </div>

        {/* 3. VELOCIDAD DE CAPTURA */}
        <FlipCard themeColor="emerald" heightClass="h-48" frontContent={<div className="h-full flex flex-col justify-between relative overflow-hidden group"><div className="absolute top-0 right-0 opacity-10 group-hover:opacity-30 transition-opacity"><BoltIcon className="w-16 h-16 text-yellow-500 dark:text-accent" /></div><div><div className="flex items-center gap-1 mb-1"><h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">Velocidad <Tooltip content="Tiempo de procesamiento IA." /></h3></div><div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-gray-900 dark:text-white">1.2s</span><span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Récord</span></div></div><div><p className="text-[10px] text-gray-500 mt-2 mb-2">Tiempo de procesamiento OCR.</p><div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-yellow-400 dark:bg-accent animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div></div></div></div>} backContent="Nuestro motor de IA 'Flash' lee tus recibos en tiempo real." />

        {/* 4. RITMO DE GASTO (WIDE) */}
        <FlipCard 
            themeColor="emerald" 
            heightClass="h-48 md:col-span-1 lg:col-span-3" 
            frontContent={
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-3 pr-6">
                        <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                Frecuencia Semanal <Tooltip content="Distribución diaria de gastos." />
                            </h3>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 pb-2">
                        {['L','M','M','J','V','S','D'].map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer h-full justify-end">
                                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-t relative overflow-hidden transition-all hover:bg-gray-300 dark:hover:bg-gray-700 flex items-end" style={{ height: '100%' }}>
                                    <div className="w-full bg-emerald-400/60 group-hover/bar:bg-emerald-500 transition-all" style={{ height: `${(metrics.dailyFreq[i] / metrics.maxDaily) * 100}%` }}></div>
                                </div>
                                <span className="text-[9px] text-gray-500 font-bold">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            } 
            backContent="Este histograma muestra qué días gastas más dinero, ayudándote a identificar patrones de consumo." 
        />

        {/* 5. GASTO POR CATEGORÍA */}
        <FlipCard themeColor="emerald" heightClass="h-80 md:col-span-1 lg:col-span-1" frontContent={<div className="h-full flex flex-col"><div className="flex justify-between items-start mb-2"><div className="flex flex-col"><h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">Gasto Total <Tooltip content="Total acumulado mes actual." /></h3><span className="text-3xl font-bold text-gray-900 dark:text-white">S/ {metrics.total.toFixed(0)}</span></div><div className="w-24"><Sparkline data={metrics.trendHistory} color="text-emerald-500" /></div></div><div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-4"></div><div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">{metrics.sortedCategories.length > 0 ? metrics.sortedCategories.map((item, idx) => (<div key={idx} className="group"><div className="flex justify-between text-xs mb-1"><span className="text-gray-700 dark:text-white font-bold tracking-wide truncate w-2/3">{item.cat}</span><span className="text-emerald-600 dark:text-emerald-300 font-mono">S/ {item.amount.toFixed(0)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-300 dark:border-white/5"><div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover:bg-emerald-400 transition-colors" style={{ width: `${item.pct}%` }} /></div></div>)) : <div className="flex h-full items-center justify-center text-gray-500 text-sm italic">Registra gastos para ver tu desglose.</div>}</div></div>} backContent="Visualiza en qué categorías se concentra tu dinero." />

        {/* 6. REGLA 50/30/20 */}
        <FlipCard themeColor="emerald" heightClass="h-80 md:col-span-1 lg:col-span-1" frontContent={
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 pr-6">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <ScaleIcon className="w-5 h-5 text-emerald-400" /> Estructura 50/30/20 <Tooltip content="Ideal: 50% Necesidades, 30% Deseos, 20% Ahorro." />
                    </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                    {/* Bar */}
                    <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-800">
                        <div className="bg-blue-500 h-full" style={{ width: `${metrics.structure.needs}%` }}></div>
                        <div className="bg-purple-500 h-full" style={{ width: `${metrics.structure.wants}%` }}></div>
                        <div className="bg-emerald-500 h-full" style={{ width: `${metrics.structure.savings}%` }}></div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> <span className="text-gray-300">Necesidades (50%)</span></div>
                            <span className="font-bold text-white">{metrics.structure.needs.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> <span className="text-gray-300">Deseos (30%)</span></div>
                            <span className="font-bold text-white">{metrics.structure.wants.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> <span className="text-gray-300">Ahorro (20%)</span></div>
                            <span className="font-bold text-white">{metrics.structure.savings.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        } backContent="La regla ideal: 50% para gastos fijos (Necesidades), 30% para estilo de vida (Deseos) y 20% para Ahorro/Inversión." />

        {/* 7. RADAR DE AHORRO TRIBUTARIO */}
        <div className="md:col-span-1 lg:col-span-1">
            <FlipCard themeColor="emerald" heightClass="h-80" frontContent={<div className="h-full flex flex-col relative overflow-hidden"><div className="flex justify-between mb-4 relative z-10"><h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2"><DocumentMagnifyingGlassIcon className="w-5 h-5" /> Radar 3 UIT <Tooltip content="Deducción de impuestos (SUNAT)." /></h3>{!isPremium && <span className="text-[10px] text-black font-bold bg-yellow-400 dark:bg-accent px-2 py-1 rounded shadow-lg animate-pulse">Explorer</span>}</div><div className={`flex-1 flex flex-col justify-center items-center relative z-10 ${!isPremium ? 'blur-[2px]' : ''}`}><div className="text-center mb-4"><p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Deducible Acumulado</p><p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">S/ {metrics.currentDeductible.toFixed(2)}</p></div><div className="w-full bg-gray-200 dark:bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-300 dark:border-white/5 mb-2 relative"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div><div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${metrics.deductibleProgress}%` }}></div></div><div className="flex justify-between w-full text-[10px] text-gray-500 font-mono"><span>0%</span><span>Meta: S/ 15,450</span></div></div>{!isPremium && (<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 backdrop-blur-[1px]"><p className="text-gray-900 dark:text-white font-bold text-center px-6 text-sm mb-3">Calcula tu devolución de impuestos anual</p><button onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="px-4 py-2 bg-yellow-400 dark:bg-accent text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg">Ver Mi Radar</button></div>)}</div>} 
            backContent={
                <div className="w-full">
                    <h4 className="font-bold text-emerald-400 text-xs mb-2 uppercase">Desglose de Deducción</h4>
                    <div className="space-y-2">
                         <div className="flex justify-between text-xs border-b border-white/10 pb-1">
                             <span>Restaurantes & Bares (15%)</span>
                             <span className="font-mono">S/ {metrics.deductibleBreakdown.restaurants.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-xs border-b border-white/10 pb-1">
                             <span>Hoteles (25%)</span>
                             <span className="font-mono">S/ {metrics.deductibleBreakdown.hotels.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-xs border-b border-white/10 pb-1 opacity-50">
                             <span>Servicios (30%)</span>
                             <span className="font-mono">S/ 0.00</span>
                         </div>
                    </div>
                </div>
            } />
        </div>

        {/* 8. GASTO HORMIGA */}
        <div className="md:col-span-1 lg:col-span-1">
             <FlipCard themeColor="emerald" heightClass="h-80" frontContent={
                 <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-4 pr-6">
                         <h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                             <BuildingStorefrontIcon className="w-5 h-5 text-red-400" /> Gasto Hormiga <Tooltip content="Gastos menores a S/20 no esenciales." />
                         </h3>
                         {metrics.antTotal > 50 && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/30 animate-pulse">Alerta</span>}
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                              <span className="text-3xl">🐜</span>
                          </div>
                          <p className="text-3xl font-bold text-white mb-1">S/ {metrics.antTotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{metrics.antCount} transacciones menores</p>
                      </div>
                 </div>
             } backContent="Detectamos gastos menores a S/20 en categorías no esenciales. ¡Aquí se fuga tu dinero!" />
        </div>

        {/* 9. DESVIACIÓN VS IA */}
        <div className="md:col-span-1 lg:col-span-1">
             {isPremium ? (
                <FlipCard themeColor="emerald" heightClass="h-80" frontContent={
                    <div className="h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between mb-4 relative z-10 pr-6">
                            <h3 className="text-sm font-bold text-yellow-600 dark:text-accent uppercase tracking-wider flex items-center gap-2">
                                <ScaleIcon className="w-5 h-5" /> Desviación IA <Tooltip content="Comparativa Gasto Real vs Presupuesto Ideal." />
                            </h3>
                            <span className="text-[10px] text-black font-bold bg-yellow-400 dark:bg-accent px-2 py-1 rounded shadow-lg">Explorer</span>
                        </div>
                        
                        {/* Main Graphic */}
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative mb-2 shadow-inner">
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-white z-10"></div>
                                <div 
                                    className={`h-full transition-all duration-1000 ${metrics.deviationPct > 0 ? 'bg-red-500 ml-[50%]' : 'bg-emerald-500 mr-[50%]'}`} 
                                    style={{ 
                                        width: `${Math.min(50, Math.abs(metrics.deviationPct))}%`, 
                                        marginLeft: metrics.deviationPct > 0 ? '50%' : undefined, 
                                        marginRight: metrics.deviationPct <= 0 ? '50%' : undefined, 
                                        alignSelf: metrics.deviationPct <= 0 ? 'flex-end' : 'flex-start' 
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between w-full text-[10px] text-gray-500 px-1 font-mono">
                                <span>Ahorro</span>
                                <span>Exceso</span>
                            </div>
                            <div className={`mt-2 text-4xl font-bold ${metrics.deviationPct > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {metrics.deviationPct > 0 ? '+' : ''}{metrics.deviationPct.toFixed(1)}%
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-1 uppercase tracking-wide">Vs. Presupuesto Óptimo</p>
                        </div>

                        {/* AI Detailed Insight Box */}
                        <div className="mt-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400 dark:bg-accent"></div>
                             <div className="flex gap-2">
                                 <SparklesIcon className="w-4 h-4 text-yellow-600 dark:text-accent shrink-0 mt-0.5" />
                                 <div>
                                     <p className="text-[10px] text-yellow-600 dark:text-accent font-bold uppercase mb-0.5">Análisis Explorer</p>
                                     <p className="text-xs text-gray-700 dark:text-gray-200 leading-snug">"{metrics.deviationAnalysis}"</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                } backContent={
                    <span>
                        La IA compara tu gasto real vs. ideal. <br/><br/>
                        <strong className="text-emerald-500 dark:text-emerald-400">Negativo (-):</strong> ¡Bien! Significa AHORRO (gastas menos de lo planeado).<br/>
                        <strong className="text-red-500 dark:text-red-400">Positivo (+):</strong> ¡Cuidado! Significa SOBREGASTO.
                    </span>
                } />
             ) : (
                <FlipCard themeColor="emerald" heightClass="h-80" frontContent={<div className="h-full flex flex-col relative"><div className="flex justify-between mb-4"><h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><ScaleIcon className="w-5 h-5" /> Desviación IA <Tooltip content="Requiere plan Explorer." /></h3></div><div className="flex-1 flex flex-col items-center justify-center opacity-30"><div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded-full mb-4"></div><div className="text-4xl font-bold text-gray-400 dark:text-gray-500">+15%</div></div><div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 backdrop-blur-[2px] p-6 text-center z-10"><div className="bg-surface p-3 rounded-full border border-gray-200 dark:border-white/10 mb-3 shadow-xl"><ScaleIcon className="w-8 h-8 text-yellow-500 dark:text-accent" /></div><p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-medium">Compara tu gasto real vs. sugerencia IA.</p><button onClick={(e) => {e.stopPropagation(); onUpgrade();}} className="px-4 py-2 bg-yellow-400 dark:bg-accent text-black font-bold rounded-full text-xs hover:scale-105 transition-transform shadow-lg">Desbloquear</button></div></div>} backContent="La métrica de Desviación requiere el plan Explorer." />
             )}
        </div>

      </div>
    </div>
  );
};

export default B2CAnalytics;
