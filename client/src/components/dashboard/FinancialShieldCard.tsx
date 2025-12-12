import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shield, TrendingDown, CreditCard, Zap, ChevronRight, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency } from "@/lib/locale";

interface FinancialShieldCardProps {
  savedInterest?: number;
  creditCardRate?: number;
  treevuFee?: number;
}

export function FinancialShieldCard({ 
  savedInterest = 2450, 
  creditCardRate = 45.9, 
  treevuFee = 3.99 
}: FinancialShieldCardProps) {
  const [showModal, setShowModal] = useState(false);

  // Datos comparativos para el gráfico
  const comparisonData = [
    { name: "Tarjeta de Crédito", costo: 459, fill: "#ef4444" },
    { name: "Préstamo Personal", costo: 280, fill: "#f97316" },
    { name: "Prestamista", costo: 720, fill: "#dc2626" },
    { name: "Treevü EWA", costo: 3.99, fill: "#10b981" },
  ];

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-emerald-300 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Escudo Financiero
            <Info className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(savedInterest)}</p>
              <p className="text-xs text-emerald-400">Ahorro acumulado en intereses</p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingDown className="h-3 w-3 text-emerald-400" />
              <span>vs. {creditCardRate}% TAE promedio de tarjetas</span>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Tarifa Treevü</span>
                <span className="text-sm font-semibold text-emerald-400">{formatCurrency(treevuFee)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-emerald-400 group-hover:text-emerald-300">
            <span>Ver comparativa completa</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              Tu Escudo Financiero
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Comparativa de costos: Treevü vs. alternativas tradicionales
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Ahorro destacado */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-300">Has ahorrado en intereses</p>
                  <p className="text-4xl font-bold text-white mt-1">{formatCurrency(savedInterest)}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Gráfico comparativo */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Costo por S/ 1,000 de adelanto (anualizado)
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" tickFormatter={(v) => `S/${v}`} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} />
                    <Tooltip 
                      formatter={(value: number) => [`S/ ${value.toFixed(2)}`, "Costo"]}
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    />
                    <Bar dataKey="costo" radius={[0, 4, 4, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Explicación */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <CreditCard className="h-5 w-5 text-red-400 mb-2" />
                <p className="text-sm font-medium text-red-300">Tarjetas de Crédito</p>
                <p className="text-xs text-gray-400 mt-1">
                  TAE promedio del {creditCardRate}%. Un adelanto de S/ 1,000 puede costarte S/ 459 en intereses anuales.
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <Zap className="h-5 w-5 text-emerald-400 mb-2" />
                <p className="text-sm font-medium text-emerald-300">Treevü EWA</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tarifa fija de S/ {treevuFee} por operación. Sin intereses, sin sorpresas. Es tu dinero trabajado.
                </p>
              </div>
            </div>

            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowModal(false)}
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
