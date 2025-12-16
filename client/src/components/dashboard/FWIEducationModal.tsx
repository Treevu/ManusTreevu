import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Info, TrendingUp, Target, Lightbulb, CheckCircle2 } from "lucide-react";
import { ChartHelpButton } from "@/components/ChartExplanationModal";
import { employeeDashboardExplanations } from "@/lib/chartExplanations";

interface FWIEducationModalProps {
  currentScore?: number;
  onClose?: () => void;
}

const FWI_RANGES = [
  { min: 0, max: 20, label: "Crítico", color: "#ef4444", description: "Riesgo muy alto de deuda" },
  { min: 21, max: 40, label: "Bajo", color: "#f97316", description: "Riesgo significativo de deuda" },
  { min: 41, max: 60, label: "Medio", color: "#f59e0b", description: "Necesita mejora" },
  { min: 61, max: 80, label: "Alto", color: "#10b981", description: "Buen control financiero" },
  { min: 81, max: 100, label: "Excelente", color: "#06b6d4", description: "Excelente salud financiera" },
];

const FWI_FACTORS = [
  {
    name: "Ingresos",
    weight: 20,
    description: "Estabilidad y consistencia de tus ingresos mensuales",
    tips: [
      "Mantén un ingreso regular y predecible",
      "Busca aumentar tus ingresos con habilidades adicionales",
      "Diversifica tus fuentes de ingresos si es posible",
    ],
  },
  {
    name: "Gastos",
    weight: 25,
    description: "Control y proporción de gastos vs ingresos",
    tips: [
      "Mantén gastos por debajo del 80% de tus ingresos",
      "Identifica y elimina gastos hormiga",
      "Presupuesta por categorías de gasto",
    ],
  },
  {
    name: "Deuda",
    weight: 25,
    description: "Cantidad y tipo de deuda que tienes",
    tips: [
      "Reduce deuda de alto interés primero",
      "Mantén deuda por debajo del 30% de ingresos anuales",
      "Evita deuda de consumo innecesaria",
    ],
  },
  {
    name: "Ahorros",
    weight: 20,
    description: "Fondo de emergencia y ahorros disponibles",
    tips: [
      "Crea un fondo de emergencia de 3-6 meses de gastos",
      "Ahorra al menos 10% de tus ingresos",
      "Automatiza tus ahorros",
    ],
  },
  {
    name: "Comportamiento",
    weight: 10,
    description: "Hábitos financieros y disciplina",
    tips: [
      "Registra tus gastos regularmente",
      "Revisa tu presupuesto mensualmente",
      "Celebra pequeños logros de ahorro",
    ],
  },
];

const IMPROVEMENT_SCENARIOS = [
  {
    title: "Reducir gastos hormiga",
    impact: "+5 a +10 puntos",
    effort: "Bajo",
    timeframe: "1-2 semanas",
    description: "Identifica y elimina pequeños gastos recurrentes",
  },
  {
    title: "Crear fondo de emergencia",
    impact: "+15 a +20 puntos",
    effort: "Medio",
    timeframe: "3-6 meses",
    description: "Acumula 3 meses de gastos en ahorros",
  },
  {
    title: "Pagar deuda de alto interés",
    impact: "+10 a +15 puntos",
    effort: "Medio",
    timeframe: "2-4 meses",
    description: "Enfócate en deuda con interés > 20%",
  },
  {
    title: "Aumentar ingresos",
    impact: "+20 a +30 puntos",
    effort: "Alto",
    timeframe: "3-12 meses",
    description: "Busca ascenso, trabajo adicional o emprendimiento",
  },
];

export function FWIEducationModal({ currentScore = 50, onClose }: FWIEducationModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  // Datos para gráfico radar
  const radarData = FWI_FACTORS.map((factor) => ({
    name: factor.name,
    value: Math.random() * 100,
    fullMark: 100,
  }));

  // Datos para gráfico de mejora
  const improvementData = IMPROVEMENT_SCENARIOS.map((scenario) => ({
    name: scenario.title,
    impact: parseInt(scenario.impact.split(" ")[1]),
  }));

  const currentRange = FWI_RANGES.find((r) => currentScore >= r.min && currentScore <= r.max);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-slate-400 hover:text-green-400"
          title="Entender FWI Score"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Entender tu FWI Score
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Aprende cómo se calcula tu Índice de Bienestar Financiero y cómo mejorarlo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="factors" className="text-xs">
              Factores
            </TabsTrigger>
            <TabsTrigger value="ranges" className="text-xs">
              Rangos
            </TabsTrigger>
            <TabsTrigger value="improve" className="text-xs">
              Mejorar
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            {/* Tu Score Actual */}
            <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tu FWI Score Actual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="text-5xl font-bold text-white mb-2">{currentScore}</div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: currentRange?.color }}
                    >
                      {currentRange?.label}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{currentRange?.description}</p>
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="flex-1">
                    <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${currentScore}%`,
                          backgroundColor: currentRange?.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    El FWI Score es un índice de 0-100 que mide tu salud financiera general. Cuanto mayor sea, mejor
                    control tienes sobre tus finanzas.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Qué es el FWI */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base">¿Qué es el FWI?</CardTitle>
                  <ChartHelpButton explanation={employeeDashboardExplanations.fwiScore} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-300">
                <p>
                  El <strong>Financial Wellness Index (FWI)</strong> es un indicador que mide tu bienestar financiero
                  considerando 5 factores clave:
                </p>
                <ul className="space-y-2 ml-4">
                  {FWI_FACTORS.map((factor, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-green-500">•</span>
                      <span>
                        <strong>{factor.name}</strong> ({factor.weight}%) - {factor.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Factores */}
          <TabsContent value="factors" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Los 5 Factores del FWI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {FWI_FACTORS.map((factor, idx) => (
                    <div key={idx} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{factor.name}</h4>
                        <span className="text-green-500 font-bold">{factor.weight}%</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{factor.description}</p>

                      <div className="bg-slate-600/50 rounded p-3">
                        <p className="text-xs text-slate-300 font-semibold mb-2">Consejos para mejorar:</p>
                        <ul className="space-y-1">
                          {factor.tips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="text-xs text-slate-400 flex gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráfico Radar */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Análisis de Factores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar name="Tu Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Rangos */}
          <TabsContent value="ranges" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Rangos de FWI Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FWI_RANGES.map((range, idx) => (
                  <div key={idx} className="p-4 rounded-lg border-l-4" style={{ borderColor: range.color }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{range.label}</h4>
                        <p className="text-slate-400 text-sm">{range.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-slate-300">
                          {range.min} - {range.max}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded h-2">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${((range.max - range.min) / 100) * 100}%`,
                          backgroundColor: range.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Mejorar */}
          <TabsContent value="improve" className="space-y-4">
            <Alert className="bg-green-500/10 border-green-500/30">
              <Lightbulb className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Aquí hay acciones que puedes tomar para mejorar tu FWI Score
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMPROVEMENT_SCENARIOS.map((scenario, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-400 text-sm">{scenario.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Impacto:</span>
                        <span className="text-green-500 font-semibold">{scenario.impact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Esfuerzo:</span>
                        <span className="text-amber-500 font-semibold">{scenario.effort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timeframe:</span>
                        <span className="text-blue-500 font-semibold">{scenario.timeframe}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráfico de impacto */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">Impacto Potencial de Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={improvementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Bar dataKey="impact" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
