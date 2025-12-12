import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, Coffee, Car, Home, Smartphone, 
  Heart, Gamepad2, Utensils, Shirt, Plane,
  ArrowDownLeft, ArrowUpRight
} from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/locale";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  createdAt: Date;
  type: "need" | "want";
}

interface ActivityFeedProps {
  transactions?: Transaction[];
}

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; type: "need" | "want" }> = {
  alimentacion: { icon: <Utensils className="h-4 w-4" />, color: "#10b981", type: "need" },
  transporte: { icon: <Car className="h-4 w-4" />, color: "#3b82f6", type: "need" },
  vivienda: { icon: <Home className="h-4 w-4" />, color: "#8b5cf6", type: "need" },
  salud: { icon: <Heart className="h-4 w-4" />, color: "#ec4899", type: "need" },
  entretenimiento: { icon: <Gamepad2 className="h-4 w-4" />, color: "#f97316", type: "want" },
  restaurantes: { icon: <Coffee className="h-4 w-4" />, color: "#f59e0b", type: "want" },
  compras: { icon: <ShoppingCart className="h-4 w-4" />, color: "#ef4444", type: "want" },
  ropa: { icon: <Shirt className="h-4 w-4" />, color: "#a855f7", type: "want" },
  viajes: { icon: <Plane className="h-4 w-4" />, color: "#06b6d4", type: "want" },
  tecnologia: { icon: <Smartphone className="h-4 w-4" />, color: "#6366f1", type: "want" },
};

const defaultTransactions: Transaction[] = [
  { id: 1, description: "Supermercado Metro", amount: 185.50, category: "alimentacion", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), type: "need" },
  { id: 2, description: "Starbucks", amount: 18.90, category: "restaurantes", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), type: "want" },
  { id: 3, description: "Uber", amount: 12.50, category: "transporte", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), type: "need" },
  { id: 4, description: "Netflix", amount: 44.90, category: "entretenimiento", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), type: "want" },
  { id: 5, description: "Farmacia", amount: 65.00, category: "salud", createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), type: "need" },
  { id: 6, description: "Zara", amount: 289.00, category: "ropa", createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), type: "want" },
];

export function ActivityFeed({ transactions = defaultTransactions }: ActivityFeedProps) {
  const needs = transactions.filter(t => {
    const config = categoryConfig[t.category.toLowerCase()];
    return config?.type === "need" || t.type === "need";
  });
  
  const wants = transactions.filter(t => {
    const config = categoryConfig[t.category.toLowerCase()];
    return config?.type === "want" || t.type === "want";
  });

  const needsTotal = needs.reduce((sum, t) => sum + t.amount, 0);
  const wantsTotal = wants.reduce((sum, t) => sum + t.amount, 0);
  const total = needsTotal + wantsTotal;
  const needsPercent = total > 0 ? (needsTotal / total) * 100 : 50;

  const TransactionItem = ({ tx }: { tx: Transaction }) => {
    const config = categoryConfig[tx.category.toLowerCase()] || { 
      icon: <ShoppingCart className="h-4 w-4" />, 
      color: "#6b7280",
      type: "want" as const
    };
    
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <span style={{ color: config.color }}>{config.icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{tx.description}</p>
            <p className="text-xs text-gray-400">{formatRelativeTime(tx.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">- {formatCurrency(tx.amount)}</p>
          <Badge 
            variant="outline" 
            className={`text-[10px] ${config.type === "need" ? "border-emerald-500/50 text-emerald-400" : "border-amber-500/50 text-amber-400"}`}
          >
            {config.type === "need" ? "Necesidad" : "Deseo"}
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300 flex items-center justify-between">
          <span>Actividad Reciente</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400">{needsPercent.toFixed(0)}% Necesidades</span>
            <span className="text-gray-500">|</span>
            <span className="text-amber-400">{(100 - needsPercent).toFixed(0)}% Deseos</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barra de proporción */}
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${needsPercent}%` }}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="all" className="text-xs">
              Todos ({transactions.length})
            </TabsTrigger>
            <TabsTrigger value="needs" className="text-xs">
              <ArrowDownLeft className="h-3 w-3 mr-1 text-emerald-400" />
              Necesidades ({needs.length})
            </TabsTrigger>
            <TabsTrigger value="wants" className="text-xs">
              <ArrowUpRight className="h-3 w-3 mr-1 text-amber-400" />
              Deseos ({wants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 max-h-80 overflow-y-auto">
            {transactions.map(tx => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </TabsContent>

          <TabsContent value="needs" className="mt-4 max-h-80 overflow-y-auto">
            {needs.length > 0 ? (
              needs.map(tx => <TransactionItem key={tx.id} tx={tx} />)
            ) : (
              <p className="text-center text-gray-500 py-8">No hay gastos de necesidades</p>
            )}
            <div className="pt-3 border-t border-gray-800 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Necesidades</span>
                <span className="text-emerald-400 font-semibold">{formatCurrency(needsTotal)}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wants" className="mt-4 max-h-80 overflow-y-auto">
            {wants.length > 0 ? (
              wants.map(tx => <TransactionItem key={tx.id} tx={tx} />)
            ) : (
              <p className="text-center text-gray-500 py-8">No hay gastos de deseos</p>
            )}
            <div className="pt-3 border-t border-gray-800 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Deseos</span>
                <span className="text-amber-400 font-semibold">{formatCurrency(wantsTotal)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
