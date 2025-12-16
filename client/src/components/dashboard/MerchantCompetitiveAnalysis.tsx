import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Users } from "lucide-react";

export default function MerchantCompetitiveAnalysis({ isLoading = false }: { isLoading?: boolean }) {
  const competitorData = [
    { merchant: "Tu Tienda", conversionRate: 8.5, avgOrderValue: 125, customerRetention: 68 },
    { merchant: "Competidor A", conversionRate: 6.2, avgOrderValue: 95, customerRetention: 52 },
    { merchant: "Competidor B", conversionRate: 7.1, avgOrderValue: 110, customerRetention: 58 },
    { merchant: "Promedio Mercado", conversionRate: 5.8, avgOrderValue: 85, customerRetention: 45 },
  ];

  const pricePositioning = [
    { category: "Electrónica", yourPrice: 100, competitorA: 105, competitorB: 98, market: 102 },
    { category: "Ropa", yourPrice: 50, competitorA: 52, competitorB: 48, market: 51 },
    { category: "Alimentos", yourPrice: 30, competitorA: 32, competitorB: 28, market: 30 },
    { category: "Servicios", yourPrice: 75, competitorA: 80, competitorB: 72, market: 76 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
              Ventaja de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+47%</div>
            <p className="text-xs text-gray-500 mt-1">vs promedio mercado</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-500" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+47%</div>
            <p className="text-xs text-gray-500 mt-1">Mayor que competencia</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Retención de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+51%</div>
            <p className="text-xs text-gray-500 mt-1">Sobre promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Comparativa de Desempeño</CardTitle>
          <CardDescription>Métricas clave vs competencia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="merchant" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Bar dataKey="conversionRate" fill="#3b82f6" name="Conversión %" />
              <Bar dataKey="customerRetention" fill="#10b981" name="Retención %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Positioning */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Posicionamiento de Precios</CardTitle>
          <CardDescription>Comparativa de precios por categoría</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pricePositioning}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="category" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Line type="monotone" dataKey="yourPrice" stroke="#3b82f6" strokeWidth={2} name="Tu Precio" />
              <Line type="monotone" dataKey="competitorA" stroke="#f59e0b" strokeWidth={2} name="Competidor A" />
              <Line type="monotone" dataKey="market" stroke="#6b7280" strokeWidth={2} name="Promedio Mercado" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Strategic Insights */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recomendaciones Estratégicas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Mantén Ventaja de Conversión</p>
                <p className="text-xs text-gray-400">Tu tasa es 47% superior, enfócate en retenerla</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Optimiza Precios en Electrónica</p>
                <p className="text-xs text-gray-400">Tienes margen para aumentar sin perder competitividad</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
              <div>
                <p className="text-sm font-medium text-white">Amplía Oferta de Servicios</p>
                <p className="text-xs text-gray-400">Categoría con menor saturación y márgenes altos</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
