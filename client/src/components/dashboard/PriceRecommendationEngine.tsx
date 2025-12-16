import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area
} from "recharts";
import { AlertCircle, TrendingUp, DollarSign, Target, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { ChartHelpButton } from "@/components/ChartExplanationModal";
import { merchantDashboardExplanations } from "@/lib/chartExplanations";
import { MetricTooltip } from "@/components/MetricTooltip";
import { merchantTooltips } from "@/lib/tooltipTexts";

interface PriceRecommendation {
  currentPrice: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  impactOnVolume: number;
  impactOnMargin: number;
  projectedRevenue: number;
  rationale: string;
}

interface CompetitorData {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  features: number;
}

const SAMPLE_PRICE_HISTORY = [
  { date: "Hace 30d", price: 45000, volume: 12, revenue: 540000, margin: 18 },
  { date: "Hace 25d", price: 45000, volume: 14, revenue: 630000, margin: 18 },
  { date: "Hace 20d", price: 42000, volume: 18, revenue: 756000, margin: 15 },
  { date: "Hace 15d", price: 42000, volume: 22, revenue: 924000, margin: 15 },
  { date: "Hace 10d", price: 48000, volume: 10, revenue: 480000, margin: 22 },
  { date: "Hace 5d", price: 48000, volume: 9, revenue: 432000, margin: 22 },
  { date: "Hoy", price: 48000, volume: 8, revenue: 384000, margin: 22 }
];

const COMPETITORS: CompetitorData[] = [
  { name: "Competidor A", price: 45000, rating: 4.2, reviews: 156, features: 8 },
  { name: "Competidor B", price: 42000, rating: 3.8, reviews: 89, features: 6 },
  { name: "Competidor C", price: 50000, rating: 4.5, reviews: 234, features: 10 },
  { name: "Competidor D", price: 43000, rating: 4.0, reviews: 112, features: 7 },
  { name: "Tú", price: 48000, rating: 4.3, reviews: 145, features: 9 }
];

const PRICE_ELASTICITY = [
  { price: 35000, expectedVolume: 35, margin: 8, revenue: 1225000 },
  { price: 40000, expectedVolume: 28, margin: 12, revenue: 1120000 },
  { price: 42000, expectedVolume: 24, margin: 14, revenue: 1008000 },
  { price: 44000, expectedVolume: 20, margin: 16, revenue: 880000 },
  { price: 45000, expectedVolume: 18, margin: 17, revenue: 810000 },
  { price: 46000, expectedVolume: 16, margin: 18, revenue: 736000 },
  { price: 48000, expectedVolume: 12, margin: 20, revenue: 576000 },
  { price: 50000, expectedVolume: 10, margin: 22, revenue: 500000 },
  { price: 55000, expectedVolume: 6, margin: 26, revenue: 330000 }
];

const PAYMENT_PLANS = [
  {
    name: "Plan Rápido",
    downPayment: 30,
    months: 12,
    monthlyPayment: 3500,
    suitability: 85,
    description: "Para compradores con capacidad inmediata"
  },
  {
    name: "Plan Estándar",
    downPayment: 20,
    months: 24,
    monthlyPayment: 1950,
    suitability: 72,
    description: "Opción más popular y equilibrada"
  },
  {
    name: "Plan Flexible",
    downPayment: 10,
    months: 36,
    monthlyPayment: 1350,
    suitability: 68,
    description: "Para compradores con menor capacidad"
  },
  {
    name: "Plan Máximo",
    downPayment: 0,
    months: 48,
    monthlyPayment: 1100,
    suitability: 55,
    description: "Máxima flexibilidad, menor margen"
  }
];

export function PriceRecommendationEngine() {
  const [currentPrice, setCurrentPrice] = useState(48000);
  const [selectedRecommendation, setSelectedRecommendation] = useState<PriceRecommendation | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate recommendation
  const recommendation: PriceRecommendation = {
    currentPrice: 48000,
    recommendedPrice: 44500,
    minPrice: 40000,
    maxPrice: 52000,
    confidence: 82,
    impactOnVolume: 35,
    impactOnMargin: -8,
    projectedRevenue: 1557500,
    rationale: "Precio óptimo basado en elasticidad de demanda, análisis competitivo y capacidad de compradores"
  };

  const currentRevenue = 384000;
  const projectedRevenue = recommendation.projectedRevenue;
  const revenueIncrease = projectedRevenue - currentRevenue;
  const revenueIncreasePercent = Math.round((revenueIncrease / currentRevenue) * 100);

  return (
    <div className="space-y-6">
      {/* Main Recommendation Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Recomendación de Precio Óptimo
              </CardTitle>
              <CardDescription>
                Basada en análisis de elasticidad, competencia y capacidad de compradores
              </CardDescription>
            </div>
            <ChartHelpButton explanation={merchantDashboardExplanations.priceRecommendationEngine} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Price */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <MetricTooltip tooltip={merchantTooltips.recommendedPrice}>
                <p className="text-sm text-gray-400 mb-2">Precio Actual</p>
              </MetricTooltip>
              <p className="text-3xl font-bold text-white">S/ {recommendation.currentPrice.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">Tu precio actual en el mercado</p>
            </div>

            {/* Recommended Price */}
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-500/30">
              <MetricTooltip tooltip={merchantTooltips.recommendedPrice}>
                <p className="text-sm text-gray-400 mb-2">Precio Recomendado</p>
              </MetricTooltip>
              <p className="text-3xl font-bold text-green-400">S/ {recommendation.recommendedPrice.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-2">
                {recommendation.currentPrice > recommendation.recommendedPrice ? "↓" : "↑"} {Math.abs(recommendation.currentPrice - recommendation.recommendedPrice).toLocaleString()} soles
              </p>
            </div>

            {/* Projected Revenue Impact */}
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30">
              <MetricTooltip tooltip={merchantTooltips.revenueImpact}>
                <p className="text-sm text-gray-400 mb-2">Impacto en Ingresos</p>
              </MetricTooltip>
              <p className="text-3xl font-bold text-purple-400">
                {revenueIncreasePercent > 0 ? "+" : ""}{revenueIncreasePercent}%
              </p>
              <p className="text-xs text-purple-400 mt-2">
                +S/ {revenueIncrease.toLocaleString()} proyectado
              </p>
            </div>
          </div>

          {/* Confidence and Details */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-white">Confianza del Modelo</span>
                <span className="text-sm font-bold text-blue-400">{recommendation.confidence}%</span>
              </div>
              <Progress value={recommendation.confidence} className="h-2" />
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Rationale</p>
              <p className="text-white">{recommendation.rationale}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400">Impacto en Volumen</p>
                <p className="text-xl font-bold text-white">+{recommendation.impactOnVolume}%</p>
                <p className="text-xs text-gray-400">Más unidades vendidas</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400">Impacto en Margen</p>
                <p className="text-xl font-bold text-white">{recommendation.impactOnMargin}%</p>
                <p className="text-xs text-gray-400">Margen por unidad</p>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Aplicar Precio Recomendado
          </Button>
        </CardContent>
      </Card>

      {/* Price Range Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rango de Precio Óptimo</CardTitle>
              <CardDescription>
                Análisis de elasticidad de demanda y margen
              </CardDescription>
            </div>
            <ChartHelpButton explanation={merchantDashboardExplanations.priceRecommendationEngine} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Precio Mínimo</span>
                <span className="font-semibold text-white">S/ {recommendation.minPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Precio Recomendado</span>
                <span className="font-semibold text-green-400">S/ {recommendation.recommendedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Precio Máximo</span>
                <span className="font-semibold text-white">S/ {recommendation.maxPrice.toLocaleString()}</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500" style={{
                  left: `${((recommendation.minPrice - 35000) / (55000 - 35000)) * 100}%`,
                  right: `${100 - ((recommendation.maxPrice - 35000) / (55000 - 35000)) * 100}%`
                }} />
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={PRICE_ELASTICITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="price" 
                stroke="#9ca3af"
                tickFormatter={(value) => `S/ ${(value/1000).toFixed(0)}K`}
              />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                formatter={(value, name) => {
                  if (name === "expectedVolume") return [value, "Volumen Esperado"];
                  if (name === "margin") return [value + "%", "Margen %"];
                  if (name === "revenue") return ["S/ " + value.toLocaleString(), "Ingresos"];
                  return [value, name];
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="expectedVolume" fill="#3b82f6" stroke="#3b82f6" name="Volumen Esperado" opacity={0.3} />
              <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} name="Margen %" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Competitive Analysis */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Análisis Competitivo
              </CardTitle>
              <CardDescription>
                Comparativa de precios y posicionamiento
              </CardDescription>
            </div>
            <ChartHelpButton explanation={merchantDashboardExplanations.competitiveAnalysis} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                type="number" 
                dataKey="price" 
                stroke="#9ca3af"
                name="Precio"
                tickFormatter={(value) => `S/ ${(value/1000).toFixed(0)}K`}
              />
              <YAxis 
                type="number" 
                dataKey="rating" 
                stroke="#9ca3af"
                name="Rating"
                domain={[3.5, 4.6]}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                formatter={(value, name) => {
                  if (name === "price") return ["S/ " + (typeof value === 'number' ? value.toLocaleString() : value), "Precio"];
                  if (name === "rating") return [typeof value === 'number' ? value.toFixed(1) : value, "Rating"];
                  return [value, name];
                }}
              />
              <Scatter 
                name="Competidores" 
                data={COMPETITORS.filter(c => c.name !== "Tú")} 
                fill="#6b7280"
                opacity={0.6}
              />
              <Scatter 
                name="Tu Posición" 
                data={COMPETITORS.filter(c => c.name === "Tú")} 
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {COMPETITORS.map((comp) => (
              <div key={comp.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-1">
                  <p className="font-semibold text-white">{comp.name}</p>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    <span>⭐ {typeof comp.rating === 'number' ? comp.rating.toFixed(1) : comp.rating} ({comp.reviews} reviews)</span>
                    <span>🎯 {comp.features} features</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">S/ {comp.price.toLocaleString()}</p>
                  {comp.name === "Tú" && (
                    <Badge className="mt-1 bg-blue-600">Tu Precio</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Plans */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Planes de Pago Personalizados
          </CardTitle>
          <CardDescription>
            Opciones de financiamiento para aumentar conversión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYMENT_PLANS.map((plan) => (
              <div key={plan.name} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  <Badge className="bg-green-600">{plan.suitability}% apto</Badge>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cuota Inicial</span>
                    <span className="font-semibold text-white">{plan.downPayment}% (S/ {Math.round(recommendation.recommendedPrice * plan.downPayment / 100).toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cuotas</span>
                    <span className="font-semibold text-white">{plan.months} meses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cuota Mensual</span>
                    <span className="font-semibold text-white">S/ {plan.monthlyPayment.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Suitability Score</span>
                  <span className="text-white">{plan.suitability}%</span>
                </div>
                <Progress value={plan.suitability} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price History */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle>Historial de Precios e Impacto</CardTitle>
          <CardDescription>
            Seguimiento de cambios de precio y su efecto en volumen y margen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={SAMPLE_PRICE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                formatter={(value, name) => {
                  if (name === "price") return ["S/ " + value.toLocaleString(), "Precio"];
                  if (name === "volume") return [value, "Volumen"];
                  if (name === "revenue") return ["S/ " + value.toLocaleString(), "Ingresos"];
                  if (name === "margin") return [value + "%", "Margen"];
                  return [value, name];
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} name="Precio" />
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} name="Volumen" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recomendaciones Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Implementa el precio recomendado</p>
              <p className="text-sm text-gray-400">Cambiar de S/ 48,000 a S/ 44,500 aumentaría ingresos en {revenueIncreasePercent}%</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Ofrece planes de pago flexibles</p>
              <p className="text-sm text-gray-400">El plan "Flexible" (0% inicial, 36 meses) aumentaría conversión en 28%</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
            <div>
              <p className="font-semibold text-white">Posiciónate competitivamente</p>
              <p className="text-sm text-gray-400">Tu precio está 5% arriba del promedio, pero tu rating (4.3) es superior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
