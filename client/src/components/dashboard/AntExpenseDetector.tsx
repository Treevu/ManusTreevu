import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Bug, TrendingUp, Target, AlertTriangle, Coffee, ShoppingBag, Smartphone, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/locale";
import { toast } from "sonner";

interface AntExpense {
  name: string;
  dailyCost: number;
  icon: React.ReactNode;
  color: string;
}

interface AntExpenseDetectorProps {
  antExpenses?: AntExpense[];
  onCreateGoal?: (name: string, target: number) => void;
}

const defaultAntExpenses: AntExpense[] = [
  { name: "Café diario", dailyCost: 8, icon: <Coffee className="h-4 w-4" />, color: "#f97316" },
  { name: "Delivery", dailyCost: 25, icon: <ShoppingBag className="h-4 w-4" />, color: "#ef4444" },
  { name: "Suscripciones", dailyCost: 5, icon: <Smartphone className="h-4 w-4" />, color: "#8b5cf6" },
];

export function AntExpenseDetector({ 
  antExpenses = defaultAntExpenses,
  onCreateGoal 
}: AntExpenseDetectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<AntExpense | null>(null);

  const totalDaily = antExpenses.reduce((sum, exp) => sum + exp.dailyCost, 0);
  const totalAnnual = totalDaily * 365;
  const totalMonthly = totalDaily * 30;

  const pieData = antExpenses.map(exp => ({
    name: exp.name,
    value: exp.dailyCost * 365,
    color: exp.color,
  }));

  const handleCreateGoal = (expense: AntExpense) => {
    const annualAmount = expense.dailyCost * 365;
    if (onCreateGoal) {
      onCreateGoal(`Ahorro: ${expense.name}`, annualAmount);
    }
    toast.success(`Meta creada: Ahorrar ${formatCurrency(annualAmount)} reduciendo ${expense.name}`);
    setShowModal(false);
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-300 flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Detector de Gasto Hormiga
            <AlertTriangle className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalAnnual)}</p>
              <p className="text-xs text-amber-400">Potencial de ahorro anual</p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp className="h-3 w-3 text-amber-400" />
              <span>{formatCurrency(totalDaily)}/día en pequeños gastos</span>
            </div>

            <div className="flex gap-1 pt-2">
              {antExpenses.slice(0, 3).map((exp, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: `${exp.color}20`, color: exp.color }}
                >
                  {exp.icon}
                  <span>{exp.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-amber-400 group-hover:text-amber-300">
            <span>Analizar y crear metas</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Bug className="h-5 w-5 text-amber-400" />
              Tus Gastos Hormiga
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Pequeños gastos diarios que suman grandes cantidades al año
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Resumen de impacto */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalDaily)}</p>
                  <p className="text-xs text-amber-300">Por día</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalMonthly)}</p>
                  <p className="text-xs text-amber-300">Por mes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalAnnual)}</p>
                  <p className="text-xs text-amber-300">Por año</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Gráfico de distribución */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Distribución anual</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Anual"]}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lista de gastos con acciones */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Convertir en metas de ahorro</h4>
                <div className="space-y-2">
                  {antExpenses.map((expense, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${expense.color}20` }}
                        >
                          <span style={{ color: expense.color }}>{expense.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{expense.name}</p>
                          <p className="text-xs text-gray-400">
                            {formatCurrency(expense.dailyCost)}/día → {formatCurrency(expense.dailyCost * 365)}/año
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                        onClick={() => handleCreateGoal(expense)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Meta
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-emerald-300">
                💡 Si reduces estos gastos a la mitad, podrías ahorrar <strong>{formatCurrency(totalAnnual / 2)}</strong> al año
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
