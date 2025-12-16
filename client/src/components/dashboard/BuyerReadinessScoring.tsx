import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from "recharts";
import { AlertCircle, TrendingUp, Users, Target, Zap, Clock } from "lucide-react";
import { useState } from "react";
import { ChartHelpButton } from "@/components/ChartExplanationModal";
import { merchantDashboardExplanations } from "@/lib/chartExplanations";
import { MetricTooltip, MetricBadge } from "@/components/MetricTooltip";
import { merchantTooltips } from "@/lib/tooltipTexts";
import { TableHeaderTooltip, tableHeaderTooltips } from "@/components/TableHeaderTooltip";
import { ContextualTooltip } from "@/components/ContextualTooltip";

interface BuyerSegment {
  id: string;
  name: string;
  score: number;
  count: number;
  color: string;
  closureRate: number;
  avgDaysToClose: number;
  description: string;
}

interface BuyerData {
  id: string;
  name: string;
  score: number;
  segment: string;
  financialCapacity: number;
  purchaseIntent: number;
  urgency: number;
  compatibility: number;
  lastInteraction: string;
  daysInFunnel: number;
}

const SEGMENTS: BuyerSegment[] = [
  {
    id: "very-ready",
    name: "Muy Listo",
    score: 85,
    count: 24,
    color: "#10b981",
    closureRate: 75,
    avgDaysToClose: 7,
    description: "Compradores con alta probabilidad de cierre en 7 días"
  },
  {
    id: "ready",
    name: "Listo",
    score: 70,
    count: 58,
    color: "#3b82f6",
    closureRate: 45,
    avgDaysToClose: 21,
    description: "Compradores con buena probabilidad de cierre en 21 días"
  },
  {
    id: "potential",
    name: "Potencial",
    score: 45,
    count: 142,
    color: "#f59e0b",
    closureRate: 20,
    avgDaysToClose: 45,
    description: "Compradores con potencial, requieren nurturing"
  },
  {
    id: "not-ready",
    name: "No Listo",
    score: 15,
    count: 276,
    color: "#6b7280",
    closureRate: 5,
    avgDaysToClose: 90,
    description: "Compradores sin capacidad o intención actual"
  }
];

const SAMPLE_BUYERS: BuyerData[] = [
  {
    id: "buyer-1",
    name: "Juan Pérez",
    score: 92,
    segment: "very-ready",
    financialCapacity: 95,
    purchaseIntent: 90,
    urgency: 88,
    compatibility: 92,
    lastInteraction: "Hace 2 horas",
    daysInFunnel: 5
  },
  {
    id: "buyer-2",
    name: "María García",
    score: 88,
    segment: "very-ready",
    financialCapacity: 85,
    purchaseIntent: 92,
    urgency: 85,
    compatibility: 88,
    lastInteraction: "Hace 1 día",
    daysInFunnel: 3
  },
  {
    id: "buyer-3",
    name: "Carlos López",
    score: 72,
    segment: "ready",
    financialCapacity: 75,
    purchaseIntent: 70,
    urgency: 68,
    compatibility: 75,
    lastInteraction: "Hace 3 días",
    daysInFunnel: 12
  },
  {
    id: "buyer-4",
    name: "Ana Martínez",
    score: 65,
    segment: "ready",
    financialCapacity: 68,
    purchaseIntent: 62,
    urgency: 65,
    compatibility: 68,
    lastInteraction: "Hace 5 días",
    daysInFunnel: 18
  },
  {
    id: "buyer-5",
    name: "Roberto Silva",
    score: 48,
    segment: "potential",
    financialCapacity: 50,
    purchaseIntent: 45,
    urgency: 48,
    compatibility: 50,
    lastInteraction: "Hace 1 semana",
    daysInFunnel: 35
  },
];

const SEGMENT_DISTRIBUTION = [
  { name: "Muy Listo", value: 24, fill: "#10b981" },
  { name: "Listo", value: 58, fill: "#3b82f6" },
  { name: "Potencial", value: 142, fill: "#f59e0b" },
  { name: "No Listo", value: 276, fill: "#6b7280" }
];

const TIMELINE_DATA = [
  { day: "Día 1-7", veryReady: 75, ready: 25, potential: 8, notReady: 2 },
  { day: "Día 8-14", veryReady: 70, ready: 35, potential: 12, notReady: 3 },
  { day: "Día 15-21", veryReady: 65, ready: 45, potential: 18, notReady: 5 },
  { day: "Día 22-30", veryReady: 60, ready: 40, potential: 20, notReady: 8 },
  { day: "Día 31+", veryReady: 50, ready: 30, potential: 15, notReady: 10 }
];

export function BuyerReadinessScoring() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "interaction" | "days">("score");

  const filteredBuyers = selectedSegment 
    ? SAMPLE_BUYERS.filter(b => b.segment === selectedSegment)
    : SAMPLE_BUYERS;

  const sortedBuyers = [...filteredBuyers].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "interaction":
        return a.daysInFunnel - b.daysInFunnel;
      case "days":
        return a.daysInFunnel - b.daysInFunnel;
      default:
        return 0;
    }
  });

  const totalBuyers = SAMPLE_BUYERS.length;
  const readyBuyers = SAMPLE_BUYERS.filter(b => b.score >= 80).length;
  const potentialBuyers = SAMPLE_BUYERS.filter(b => b.score >= 40 && b.score < 80).length;
  const projectedClosures = Math.round(readyBuyers * 0.75 + potentialBuyers * 0.20);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <ContextualTooltip
                  label="Compradores Listos"
                  value={readyBuyers}
                  status={readyBuyers > 50 ? 'good' : readyBuyers > 20 ? 'warning' : 'critical'}
                  tooltip={merchantTooltips.readyBuyers}
                  contextualAction={readyBuyers > 50 ? 'Contacta inmediatamente para cerrar ventas' : 'Enfócate en nurturing de leads potenciales'}
                  trend={readyBuyers > 30 ? 'up' : 'down'}
                />
                <p className="text-xs text-gray-400 mt-2">{Math.round((readyBuyers/totalBuyers)*100)}% del total</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <ContextualTooltip
                  label="Compradores Potenciales"
                  value={potentialBuyers}
                  status={potentialBuyers > 100 ? 'good' : potentialBuyers > 50 ? 'warning' : 'critical'}
                  tooltip={merchantTooltips.potentialBuyers}
                  contextualAction={potentialBuyers > 100 ? 'Excelente pipeline. Mantén el nurturing' : 'Aumenta actividades de marketing'}
                  trend={potentialBuyers > 80 ? 'up' : 'down'}
                />
                <p className="text-xs text-gray-400 mt-2">{Math.round((potentialBuyers/totalBuyers)*100)}% del total</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <ContextualTooltip
                  label="Cierres Proyectados"
                  value={projectedClosures}
                  status={projectedClosures > 50 ? 'good' : projectedClosures > 20 ? 'warning' : 'critical'}
                  tooltip={merchantTooltips.projectedClosures}
                  contextualAction={projectedClosures > 50 ? 'Excelente proyección. Prepara recursos' : 'Acelera el proceso de venta'}
                  trend={projectedClosures > 30 ? 'up' : 'down'}
                />
                <p className="text-xs text-gray-400 mt-2">En próximos 30 días</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <ContextualTooltip
                  label="Total Interesados"
                  value={totalBuyers}
                  status={totalBuyers > 300 ? 'good' : totalBuyers > 150 ? 'warning' : 'critical'}
                  tooltip={merchantTooltips.buyerReadinessScore}
                  contextualAction={totalBuyers > 300 ? 'Excelente base de clientes potenciales' : 'Aumenta visibilidad de tu anuncio'}
                  trend={totalBuyers > 250 ? 'up' : 'down'}
                />
                <p className="text-xs text-gray-400 mt-2">En el funnel</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segmentation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Distribución de Compradores por Segmento
                </CardTitle>
                <CardDescription>
                  Análisis de readiness score de {totalBuyers} compradores interesados
                </CardDescription>
              </div>
              <ChartHelpButton explanation={merchantDashboardExplanations.buyerReadinessScore} />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={SEGMENTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                  formatter={(value) => [value, "Compradores"]}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-base">Composición del Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={SEGMENT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {SEGMENT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Compradores"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segment Details */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Detalles por Segmento</CardTitle>
          <CardDescription>
            Métricas clave de conversión y tiempo de cierre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SEGMENTS.map((segment) => (
              <div
                key={segment.id}
                onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSegment === segment.id
                    ? `border-${segment.color === "#10b981" ? "green" : segment.color === "#3b82f6" ? "blue" : segment.color === "#f59e0b" ? "amber" : "gray"}-500 bg-white/5`
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{
                  borderColor: selectedSegment === segment.id ? segment.color : undefined,
                  backgroundColor: selectedSegment === segment.id ? `${segment.color}20` : undefined
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{segment.name}</h3>
                  <Badge style={{ backgroundColor: segment.color }}>
                    {segment.count}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Score Promedio</span>
                      <span className="text-white font-semibold">{segment.score}/100</span>
                    </div>
                    <Progress value={segment.score} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Tasa de Cierre</span>
                      <span className="text-white font-semibold">{segment.closureRate}%</span>
                    </div>
                    <Progress value={segment.closureRate} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{segment.avgDaysToClose} días promedio</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buyer List */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compradores por Readiness Score</CardTitle>
              <CardDescription>
                {selectedSegment ? `Mostrando ${sortedBuyers.length} compradores en segmento seleccionado` : `Mostrando todos los ${sortedBuyers.length} compradores`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white"
              >
                <option value="score">Ordenar por Score</option>
                <option value="interaction">Últimas Interacciones</option>
                <option value="days">Días en Funnel</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedBuyers.map((buyer) => {
              const segment = SEGMENTS.find(s => s.id === buyer.segment)!;
              return (
                <div key={buyer.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{buyer.name}</h4>
                        <Badge style={{ backgroundColor: segment.color }}>
                          {buyer.score}/100
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{segment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Última interacción</p>
                      <p className="font-semibold text-white">{buyer.lastInteraction}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <TableHeaderTooltip header="Capacidad" tooltip={tableHeaderTooltips.buyerCapacity} />
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={buyer.financialCapacity} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-white">{buyer.financialCapacity}%</span>
                      </div>
                    </div>
                    <div>
                      <TableHeaderTooltip header="Intención" tooltip={tableHeaderTooltips.buyerIntention} />
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={buyer.purchaseIntent} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-white">{buyer.purchaseIntent}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Urgencia</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={buyer.urgency} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-white">{buyer.urgency}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Compatibilidad</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={buyer.compatibility} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-white">{buyer.compatibility}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-sm">
                    <span className="text-gray-400">
                      📊 {buyer.daysInFunnel} días en funnel
                    </span>
                    {buyer.score >= 80 && (
                      <span className="text-green-400 flex items-center gap-1">
                        ✓ Contactar hoy
                      </span>
                    )}
                    {buyer.score >= 60 && buyer.score < 80 && (
                      <span className="text-blue-400 flex items-center gap-1">
                        ℹ Contactar esta semana
                      </span>
                    )}
                    {buyer.score < 60 && (
                      <span className="text-amber-400 flex items-center gap-1">
                        ⏱ Nurturing semanal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Timeline */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Proyección de Conversión por Período</CardTitle>
          <CardDescription>
            Tasa de cierre esperada por segmento en diferentes períodos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={TIMELINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                formatter={(value) => [value, "Cierres Esperados"]}
              />
              <Legend />
              <Line type="monotone" dataKey="veryReady" stroke="#10b981" strokeWidth={2} name="Muy Listo" />
              <Line type="monotone" dataKey="ready" stroke="#3b82f6" strokeWidth={2} name="Listo" />
              <Line type="monotone" dataKey="potential" stroke="#f59e0b" strokeWidth={2} name="Potencial" />
              <Line type="monotone" dataKey="notReady" stroke="#6b7280" strokeWidth={2} name="No Listo" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Recomendaciones de Acción
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Contacta a {readyBuyers} compradores "Muy Listos"</p>
              <p className="text-sm text-gray-400">Espera una tasa de cierre del 75% en los próximos 7 días</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Implementa nurturing para {potentialBuyers} compradores "Potenciales"</p>
              <p className="text-sm text-gray-400">Envía contenido educativo y ofertas personalizadas semanalmente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Proyección de ingresos: +S/ {projectedClosures * 5000}</p>
              <p className="text-sm text-gray-400">Basado en {projectedClosures} cierres esperados en 30 días (S/ 5,000 promedio)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
