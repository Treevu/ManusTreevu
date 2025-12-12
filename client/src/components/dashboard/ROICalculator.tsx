import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  Calculator, TrendingUp, DollarSign, Users, ChevronRight, 
  Info, Percent, Target
} from "lucide-react";
import { formatCurrency } from "@/lib/locale";

interface ROICalculatorProps {
  currentROI?: number;
  totalRedemptions?: number;
  totalRevenue?: number;
}

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

export function ROICalculator({ 
  currentROI = 3.8, 
  totalRedemptions = 1247,
  totalRevenue = 45680
}: ROICalculatorProps) {
  const [showModal, setShowModal] = useState(false);
  const [discount, setDiscount] = useState(15);
  const [avgTicket, setAvgTicket] = useState(45);
  const [conversionRate, setConversionRate] = useState(12);

  // Calculated values
  const estimatedRedemptions = Math.round(totalRedemptions * (conversionRate / 10));
  const grossRevenue = estimatedRedemptions * avgTicket;
  const discountCost = grossRevenue * (discount / 100);
  const netRevenue = grossRevenue - discountCost;
  const calculatedROI = netRevenue / discountCost;

  const monthlyData = [
    { month: "Sep", roi: 2.8, redemptions: 890 },
    { month: "Oct", roi: 3.2, redemptions: 1050 },
    { month: "Nov", roi: 3.5, redemptions: 1180 },
    { month: "Dic", roi: currentROI, redemptions: totalRedemptions },
  ];

  const categoryData = [
    { name: "Almuerzos", value: 45, revenue: 20556 },
    { name: "Cenas", value: 25, revenue: 11420 },
    { name: "Delivery", value: 18, revenue: 8222 },
    { name: "Bebidas", value: 12, revenue: 5482 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white">{payload[0].payload.month}</p>
          <p className="text-purple-400">ROI: {payload[0].payload.roi}x</p>
          <p className="text-gray-400">Canjes: {payload[0].payload.redemptions}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-emerald-300 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculadora ROI
            <Info className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-white">{currentROI}x</p>
                <p className="text-xs text-emerald-400">ROI actual del mes</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-300">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-gray-400">Ingresos generados</p>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="h-16 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <Bar dataKey="roi" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{totalRedemptions} canjes este mes</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +18% vs mes anterior
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-emerald-400 group-hover:text-emerald-300">
            <span>Simular escenarios</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-400" />
              Calculadora de ROI Interactiva
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Simula diferentes escenarios y optimiza tus campañas de TreePoints
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Left: Simulator */}
            <div className="space-y-6">
              <h4 className="text-sm font-medium text-gray-300">Simulador de Escenarios</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Descuento ofrecido</span>
                    <span className="text-purple-400 font-medium">{discount}%</span>
                  </div>
                  <Slider
                    value={[discount]}
                    onValueChange={(v) => setDiscount(v[0])}
                    min={5}
                    max={40}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Ticket promedio</span>
                    <span className="text-purple-400 font-medium">{formatCurrency(avgTicket)}</span>
                  </div>
                  <Slider
                    value={[avgTicket]}
                    onValueChange={(v) => setAvgTicket(v[0])}
                    min={20}
                    max={150}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Tasa de conversión</span>
                    <span className="text-purple-400 font-medium">{conversionRate}%</span>
                  </div>
                  <Slider
                    value={[conversionRate]}
                    onValueChange={(v) => setConversionRate(v[0])}
                    min={5}
                    max={30}
                    step={1}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{calculatedROI.toFixed(1)}x</p>
                  <p className="text-xs text-gray-400">ROI Proyectado</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">{formatCurrency(netRevenue)}</p>
                  <p className="text-xs text-gray-400">Ingreso Neto</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{estimatedRedemptions}</p>
                  <p className="text-xs text-gray-400">Canjes Estimados</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(discountCost)}</p>
                  <p className="text-xs text-gray-400">Costo Descuento</p>
                </div>
              </div>
            </div>

            {/* Right: Charts */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Tendencia ROI Mensual</h4>
                <div className="h-48 bg-gray-800/50 rounded-lg p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="roi" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Distribución por Categoría</h4>
                <div className="h-48 bg-gray-800/50 rounded-lg p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend 
                        formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowModal(false)}
          >
            Cerrar Calculadora
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
