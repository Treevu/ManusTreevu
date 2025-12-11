import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, TrendingUp, TrendingDown, DollarSign, Users, 
  AlertTriangle, Target, Brain, Heart, Briefcase, 
  Calculator, ArrowRight, CheckCircle2, XCircle
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface ImpactExplainerModalProps {
  type: 'fwi' | 'roi' | 'risk' | 'savings' | 'engagement';
  currentValue?: number;
  previousValue?: number;
  targetValue?: number;
  children?: React.ReactNode;
}

// Color palette
const COLORS = {
  primary: '#22C55E',
  secondary: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#8B5CF6',
  muted: '#6B7280'
};

// Sample data for charts
const fwiDistributionData = [
  { name: 'Crítico (0-30)', value: 8, color: COLORS.danger },
  { name: 'En Riesgo (31-50)', value: 15, color: COLORS.warning },
  { name: 'Moderado (51-70)', value: 35, color: COLORS.info },
  { name: 'Saludable (71-100)', value: 42, color: COLORS.primary },
];

const roiBreakdownData = [
  { category: 'Reducción Ausentismo', value: 45000, percentage: 35 },
  { category: 'Menor Rotación', value: 52000, percentage: 40 },
  { category: 'Mayor Productividad', value: 32000, percentage: 25 },
];

const riskTrendData = [
  { month: 'Ene', highRisk: 25, mediumRisk: 35, lowRisk: 40 },
  { month: 'Feb', highRisk: 22, mediumRisk: 33, lowRisk: 45 },
  { month: 'Mar', highRisk: 20, mediumRisk: 30, lowRisk: 50 },
  { month: 'Abr', highRisk: 18, mediumRisk: 28, lowRisk: 54 },
  { month: 'May', highRisk: 15, mediumRisk: 25, lowRisk: 60 },
  { month: 'Jun', highRisk: 12, mediumRisk: 23, lowRisk: 65 },
];

const savingsProjectionData = [
  { month: 'Mes 1', actual: 5000, projected: 8000 },
  { month: 'Mes 2', actual: 12000, projected: 16000 },
  { month: 'Mes 3', actual: 22000, projected: 24000 },
  { month: 'Mes 4', actual: 35000, projected: 32000 },
  { month: 'Mes 5', actual: 48000, projected: 40000 },
  { month: 'Mes 6', actual: 65000, projected: 48000 },
];

function FWIExplainer({ currentValue = 68 }: { currentValue?: number }) {
  return (
    <div className="space-y-6">
      {/* What is FWI */}
      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <h4 className="font-semibold text-emerald-400 flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" />
          ¿Qué es el FWI?
        </h4>
        <p className="text-sm text-gray-300">
          El <strong>Financial Wellness Index (FWI)</strong> es un indicador compuesto que mide 
          la salud financiera de los empleados en una escala de 0 a 100. Considera factores como 
          ahorro, deuda, planificación y comportamiento financiero.
        </p>
      </div>

      {/* Current Score Visual */}
      <div className="text-center py-4">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(currentValue / 100) * 352} 352`}
              className={currentValue >= 70 ? 'text-emerald-500' : currentValue >= 50 ? 'text-amber-500' : 'text-red-500'}
            />
          </svg>
          <span className="absolute text-3xl font-bold text-white">{currentValue}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">FWI Promedio Actual</p>
      </div>

      {/* Distribution Chart */}
      <div>
        <h4 className="font-semibold text-white mb-3">Distribución de Empleados por FWI</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fwiDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {fwiDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend 
                formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Impact Factors */}
      <div>
        <h4 className="font-semibold text-white mb-3">Factores que Impactan el FWI</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Target, label: 'Metas de Ahorro', impact: '+15%', positive: true },
            { icon: DollarSign, label: 'Uso de EWA', impact: '-8%', positive: false },
            { icon: Heart, label: 'Engagement', impact: '+12%', positive: true },
            { icon: Briefcase, label: 'Antigüedad', impact: '+5%', positive: true },
          ].map((factor, i) => (
            <div key={i} className="p-3 rounded-lg bg-black/30 flex items-center gap-3">
              <factor.icon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">{factor.label}</p>
                <p className={`text-sm font-semibold ${factor.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {factor.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ROIExplainer({ currentValue = 1680 }: { currentValue?: number }) {
  const totalSavings = roiBreakdownData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-6">
      {/* What is ROI */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <h4 className="font-semibold text-blue-400 flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5" />
          ¿Cómo se Calcula el ROI?
        </h4>
        <p className="text-sm text-gray-300">
          El ROI de Treevü se calcula comparando el <strong>costo de la plataforma</strong> contra 
          los <strong>ahorros generados</strong> por reducción de ausentismo, menor rotación de 
          personal y aumento de productividad.
        </p>
      </div>

      {/* ROI Formula */}
      <div className="p-4 rounded-lg bg-black/30 text-center">
        <p className="text-xs text-gray-400 mb-2">Fórmula de ROI</p>
        <p className="text-lg font-mono text-white">
          ROI = <span className="text-emerald-400">(Ahorros - Costo)</span> / <span className="text-blue-400">Costo</span> × 100
        </p>
        <p className="text-3xl font-bold text-emerald-400 mt-3">{currentValue}%</p>
      </div>

      {/* Savings Breakdown */}
      <div>
        <h4 className="font-semibold text-white mb-3">Desglose de Ahorros Estimados</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roiBreakdownData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="category" width={120} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ahorro']}
              />
              <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          Total estimado: <span className="text-emerald-400 font-semibold">${totalSavings.toLocaleString()}</span> anuales
        </p>
      </div>

      {/* Methodology */}
      <div className="space-y-2">
        <h4 className="font-semibold text-white">Metodología de Cálculo</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
            <p className="text-gray-300">
              <strong>Ausentismo:</strong> Reducción del 2% en días perdidos × costo promedio diario
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
            <p className="text-gray-300">
              <strong>Rotación:</strong> Reducción del 15% en turnover × costo de reemplazo (30% salario)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
            <p className="text-gray-300">
              <strong>Productividad:</strong> Aumento del 5% en output × valor hora promedio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskExplainer({ currentValue = 12 }: { currentValue?: number }) {
  return (
    <div className="space-y-6">
      {/* What is Risk */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <h4 className="font-semibold text-amber-400 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5" />
          ¿Qué Significa "En Riesgo"?
        </h4>
        <p className="text-sm text-gray-300">
          Un empleado se considera <strong>en riesgo</strong> cuando su FWI está por debajo de 40, 
          indicando estrés financiero significativo que puede afectar su desempeño, salud y 
          permanencia en la empresa.
        </p>
      </div>

      {/* Current Risk Indicator */}
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-amber-400">{currentValue}%</p>
          <p className="text-sm text-gray-400">Empleados en Riesgo</p>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-500" />
        <div className="text-center">
          <p className="text-4xl font-bold text-emerald-400">&lt;10%</p>
          <p className="text-sm text-gray-400">Meta Recomendada</p>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <div>
        <h4 className="font-semibold text-white mb-3">Evolución del Riesgo (6 meses)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="highRisk" stackId="1" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.6} name="Alto Riesgo" />
              <Area type="monotone" dataKey="mediumRisk" stackId="1" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.6} name="Riesgo Medio" />
              <Area type="monotone" dataKey="lowRisk" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Bajo Riesgo" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Consequences */}
      <div>
        <h4 className="font-semibold text-white mb-3">Consecuencias del Estrés Financiero</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Ausentismo', value: '+40%', icon: XCircle },
            { label: 'Rotación', value: '+25%', icon: Users },
            { label: 'Errores', value: '+30%', icon: AlertTriangle },
            { label: 'Productividad', value: '-20%', icon: TrendingDown },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <item.icon className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-red-400">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavingsExplainer() {
  return (
    <div className="space-y-6">
      {/* What are Savings */}
      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <h4 className="font-semibold text-emerald-400 flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5" />
          ¿Cómo se Generan los Ahorros?
        </h4>
        <p className="text-sm text-gray-300">
          Los ahorros se generan cuando los empleados mejoran su bienestar financiero, 
          lo que reduce costos operativos asociados a problemas de salud, ausentismo y rotación.
        </p>
      </div>

      {/* Savings vs Projection Chart */}
      <div>
        <h4 className="font-semibold text-white mb-3">Ahorros Reales vs Proyectados</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsProjectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="projected" stroke={COLORS.muted} fill={COLORS.muted} fillOpacity={0.3} name="Proyectado" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="actual" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.6} name="Real" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-emerald-400 mt-2">
          ¡Superando proyecciones en 35%!
        </p>
      </div>

      {/* Savings Categories */}
      <div>
        <h4 className="font-semibold text-white mb-3">Categorías de Ahorro</h4>
        <div className="space-y-3">
          {[
            { label: 'Reducción de Ausentismo', amount: 45000, description: '120 días menos de ausencia' },
            { label: 'Menor Rotación', amount: 52000, description: '8 empleados retenidos' },
            { label: 'Mayor Productividad', amount: 32000, description: '+5% en output general' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-black/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <p className="text-lg font-semibold text-emerald-400">${item.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EngagementExplainer() {
  const engagementData = [
    { metric: 'Uso Diario', value: 78, target: 70 },
    { metric: 'Metas Activas', value: 65, target: 60 },
    { metric: 'EWA Responsable', value: 82, target: 75 },
    { metric: 'Educación', value: 45, target: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* What is Engagement */}
      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <h4 className="font-semibold text-purple-400 flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5" />
          ¿Qué es el Engagement?
        </h4>
        <p className="text-sm text-gray-300">
          El engagement mide qué tan activamente los empleados utilizan Treevü para mejorar 
          su bienestar financiero. Mayor engagement = mejores resultados de FWI.
        </p>
      </div>

      {/* Engagement Metrics */}
      <div>
        <h4 className="font-semibold text-white mb-3">Métricas de Engagement</h4>
        <div className="space-y-4">
          {engagementData.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{item.metric}</span>
                <span className={item.value >= item.target ? 'text-emerald-400' : 'text-amber-400'}>
                  {item.value}% <span className="text-gray-500">/ {item.target}%</span>
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${item.value >= item.target ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Impact */}
      <div className="p-4 rounded-lg bg-black/30">
        <h4 className="font-semibold text-white mb-3">Impacto del Engagement en FWI</h4>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-400">45</p>
            <p className="text-xs text-gray-500">FWI Bajo Engagement</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">72</p>
            <p className="text-xs text-gray-500">FWI Alto Engagement</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          Empleados con alto engagement tienen un FWI 60% mayor en promedio
        </p>
      </div>
    </div>
  );
}

export function ImpactExplainerModal({ 
  type, 
  currentValue, 
  previousValue, 
  targetValue,
  children 
}: ImpactExplainerModalProps) {
  const [open, setOpen] = useState(false);

  const titles = {
    fwi: 'Índice de Bienestar Financiero (FWI)',
    roi: 'Retorno sobre Inversión (ROI)',
    risk: 'Análisis de Riesgo',
    savings: 'Impacto Financiero',
    engagement: 'Engagement de Empleados'
  };

  const descriptions = {
    fwi: 'Entiende cómo se calcula y qué factores lo afectan',
    roi: 'Descubre cómo Treevü genera valor para tu organización',
    risk: 'Comprende el impacto del estrés financiero en tu equipo',
    savings: 'Visualiza los ahorros generados por el programa',
    engagement: 'Analiza la adopción y uso de la plataforma'
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#1F2937] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{titles[type]}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {descriptions[type]}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {type === 'fwi' && <FWIExplainer currentValue={currentValue} />}
          {type === 'roi' && <ROIExplainer currentValue={currentValue} />}
          {type === 'risk' && <RiskExplainer currentValue={currentValue} />}
          {type === 'savings' && <SavingsExplainer />}
          {type === 'engagement' && <EngagementExplainer />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImpactExplainerModal;
