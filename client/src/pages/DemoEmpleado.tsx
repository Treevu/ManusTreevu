import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Wallet, TrendingUp, Target, Award, ArrowUpRight, ArrowDownRight,
  Coffee, ShoppingCart, Car, Utensils, Smartphone, Home, Zap,
  TreePine, Gift, ChevronRight, Sparkles, Shield, Clock
} from 'lucide-react';
import { Link } from 'wouter';

// Datos de demostración
const DEMO_DATA = {
  user: {
    name: 'María García',
    company: 'TechCorp México',
    department: 'Ingeniería',
    avatar: '👩‍💻'
  },
  fwi: {
    score: 78,
    trend: '+5',
    level: 'Saludable',
    factors: [
      { name: 'Tasa de Ahorro', value: 82, weight: 25 },
      { name: 'Gasto Discrecional', value: 75, weight: 20 },
      { name: 'Progreso de Metas', value: 85, weight: 25 },
      { name: 'Uso de EWA', value: 70, weight: 15 },
      { name: 'Consistencia', value: 78, weight: 15 }
    ]
  },
  ewa: {
    available: 8500,
    used: 1500,
    limit: 10000,
    nextPayday: '15 Dic'
  },
  treePoints: {
    balance: 2450,
    thisMonth: 350,
    level: 'Árbol Dorado',
    nextLevel: 3000
  },
  transactions: [
    { id: 1, merchant: 'Starbucks', category: 'food', amount: -85, date: 'Hoy', icon: Coffee, isDiscretionary: true },
    { id: 2, merchant: 'Uber', category: 'transport', amount: -120, date: 'Ayer', icon: Car, isDiscretionary: false },
    { id: 3, merchant: 'Amazon', category: 'shopping', amount: -450, date: 'Hace 2 días', icon: ShoppingCart, isDiscretionary: true },
    { id: 4, merchant: 'Restaurante El Bajío', category: 'food', amount: -280, date: 'Hace 3 días', icon: Utensils, isDiscretionary: true },
    { id: 5, merchant: 'Telcel', category: 'utilities', amount: -399, date: 'Hace 5 días', icon: Smartphone, isDiscretionary: false },
    { id: 6, merchant: 'CFE', category: 'utilities', amount: -850, date: 'Hace 7 días', icon: Zap, isDiscretionary: false }
  ],
  goals: [
    { id: 1, name: 'Fondo de Emergencia', target: 30000, current: 22500, icon: Shield, deadline: 'Mar 2025' },
    { id: 2, name: 'Vacaciones Cancún', target: 15000, current: 9800, icon: TreePine, deadline: 'Jun 2025' },
    { id: 3, name: 'Enganche Auto', target: 80000, current: 35000, icon: Car, deadline: 'Dic 2025' }
  ],
  achievements: [
    { id: 1, name: 'Primer Ahorro', icon: '🌱', earned: true },
    { id: 2, name: '7 Días Sin Gastos Hormiga', icon: '🐜', earned: true },
    { id: 3, name: 'Meta Completada', icon: '🎯', earned: true },
    { id: 4, name: 'Racha de 30 Días', icon: '🔥', earned: false }
  ],
  offers: [
    { id: 1, merchant: 'Cinépolis', discount: '2x1', points: 200, expires: '20 Dic' },
    { id: 2, merchant: 'Liverpool', discount: '15% OFF', points: 500, expires: '31 Dic' },
    { id: 3, merchant: 'Spotify', discount: '3 meses gratis', points: 300, expires: '15 Ene' }
  ]
};

function FWIGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-yellow-400';
    if (s >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700"
        />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${score * 2.51} 251`}
          strokeLinecap="round"
          className={getColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-sm text-gray-400">FWI Score</span>
      </div>
    </div>
  );
}

type Transaction = typeof DEMO_DATA.transactions[0];
type Goal = typeof DEMO_DATA.goals[0];
type Offer = typeof DEMO_DATA.offers[0];
type Achievement = typeof DEMO_DATA.achievements[0];

export default function DemoEmpleado() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'goals' | 'rewards'>('overview');
  
  // Estados para modales
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showEwaModal, setShowEwaModal] = useState(false);
  const [ewaAmount, setEwaAmount] = useState([2000]);
  const [goalContribution, setGoalContribution] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showFwiHistoryModal, setShowFwiHistoryModal] = useState(false);
  const [showAlertsConfigModal, setShowAlertsConfigModal] = useState(false);
  const [advisorMessage, setAdvisorMessage] = useState('');
  const [advisorChat, setAdvisorChat] = useState<{role: 'user' | 'ai', message: string}[]>([]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <TreePine className="w-6 h-6 text-emerald-400" />
              Treevü
            </Link>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
              Demo Empleado
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-emerald-400"
              onClick={() => setShowAdvisorModal(true)}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Asesor IA</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-blue-400"
              onClick={() => setShowAlertsConfigModal(true)}
            >
              <Shield className="w-4 h-4" />
            </Button>
            <div className="text-right hidden sm:block ml-2">
              <p className="text-white font-medium">{DEMO_DATA.user.name}</p>
              <p className="text-gray-400 text-sm">{DEMO_DATA.user.company}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl">
              {DEMO_DATA.user.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen', icon: Home },
              { id: 'transactions', label: 'Transacciones', icon: Wallet },
              { id: 'goals', label: 'Metas', icon: Target },
              { id: 'rewards', label: 'Recompensas', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FWI Score Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 lg:row-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Tu Bienestar Financiero
                </CardTitle>
                <CardDescription>Powered by Treevü AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FWIGauge score={DEMO_DATA.fwi.score} />
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                    {DEMO_DATA.fwi.level}
                  </Badge>
                  <span className="text-emerald-400 text-sm flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {DEMO_DATA.fwi.trend} este mes
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 font-medium">Factores del Score</p>
                  {DEMO_DATA.fwi.factors.map((factor) => (
                    <div key={factor.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{factor.name}</span>
                        <span className="text-white font-medium">{factor.value}%</span>
                      </div>
                      <Progress value={factor.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => setShowFwiHistoryModal(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Ver Historial Completo
                </Button>
              </CardContent>
            </Card>

            {/* EWA Card */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  Salario Disponible (EWA)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-white">${DEMO_DATA.ewa.available.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">de ${DEMO_DATA.ewa.limit.toLocaleString()} disponibles</p>
                  </div>
                  <Progress value={(DEMO_DATA.ewa.available / DEMO_DATA.ewa.limit) * 100} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Usado este periodo: ${DEMO_DATA.ewa.used.toLocaleString()}</span>
                    <span className="text-emerald-400">Próximo pago: {DEMO_DATA.ewa.nextPayday}</span>
                  </div>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => setShowEwaModal(true)}
                  >
                    Solicitar Adelanto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* TreePoints Card */}
            <Card className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-amber-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-amber-400" />
                  TreePoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-white">{DEMO_DATA.treePoints.balance.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">+{DEMO_DATA.treePoints.thisMonth} este mes</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-400">{DEMO_DATA.treePoints.level}</span>
                      <span className="text-gray-400">{DEMO_DATA.treePoints.nextLevel - DEMO_DATA.treePoints.balance} para siguiente nivel</span>
                    </div>
                    <Progress value={(DEMO_DATA.treePoints.balance / DEMO_DATA.treePoints.nextLevel) * 100} className="h-2 bg-amber-950" />
                  </div>
                  <Button variant="outline" className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                    Canjear Puntos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    Transacciones Recientes
                  </span>
                  <Button variant="ghost" size="sm" className="text-emerald-400">
                    Ver todas <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DEMO_DATA.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.isDiscretionary ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <tx.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{tx.merchant}</p>
                          <p className="text-gray-400 text-sm">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                        </p>
                        {tx.isDiscretionary && (
                          <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                            Discrecional
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Goals */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Mis Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEMO_DATA.goals.map((goal) => (
                    <div key={goal.id} className="space-y-2 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg -mx-2 transition-colors" onClick={() => setSelectedGoal(goal)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <goal.icon className="w-4 h-4 text-purple-400" />
                          <span className="text-white text-sm font-medium">{goal.name}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{goal.deadline}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>${goal.current.toLocaleString()}</span>
                        <span>${goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offers */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-400" />
                  Ofertas para Ti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {DEMO_DATA.offers.map((offer) => (
                    <div key={offer.id} className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-colors cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                      <p className="text-white font-medium">{offer.merchant}</p>
                      <p className="text-2xl font-bold text-pink-400 my-2">{offer.discount}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-400">{offer.points} pts</span>
                        <span className="text-gray-400">Exp: {offer.expires}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {DEMO_DATA.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform ${
                        achievement.earned
                          ? 'bg-yellow-500/20 border border-yellow-500/50'
                          : 'bg-gray-800 opacity-40'
                      }`}
                      title={achievement.name}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Todas las Transacciones</CardTitle>
              <CardDescription>Historial completo de movimientos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_DATA.transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.isDiscretionary ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        <tx.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.merchant}</p>
                        <p className="text-gray-400 text-sm">{tx.date} • {tx.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-medium ${tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                      {tx.isDiscretionary && (
                        <Badge variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                          Discrecional
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_DATA.goals.map((goal) => (
              <Card key={goal.id} className="bg-gray-900 border-gray-800 cursor-pointer hover:border-purple-500/50 transition-colors" onClick={() => setSelectedGoal(goal)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <goal.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{goal.name}</CardTitle>
                      <CardDescription>Meta: {goal.deadline}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-2xl font-bold text-white">${goal.current.toLocaleString()}</span>
                      <span className="text-gray-400">${goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">{Math.round((goal.current / goal.target) * 100)}% completado</span>
                    <span className="text-gray-400">${(goal.target - goal.current).toLocaleString()} restantes</span>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Agregar Fondos
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card className="bg-gray-900 border-gray-800 border-dashed flex items-center justify-center min-h-[250px]">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Target className="w-6 h-6 mr-2" />
                Crear Nueva Meta
              </Button>
            </Card>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_DATA.offers.map((offer) => (
                <Card key={offer.id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-pink-500/50 transition-all hover:scale-105 cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">{offer.merchant}</p>
                    <p className="text-4xl font-bold text-pink-400 mb-4">{offer.discount}</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <TreePine className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 font-medium">{offer.points} TreePoints</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expira: {offer.expires}
                    </p>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      Canjear Oferta
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Mis Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {DEMO_DATA.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform ${
                        achievement.earned
                          ? 'bg-yellow-500/20 border border-yellow-500/50'
                          : 'bg-gray-800 opacity-40'
                      }`}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <p className={`text-sm font-medium ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* CTA Footer */}
      <div className="border-t border-gray-800 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">¿Te gustaría tener esto para tus empleados?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#founders-form" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-emerald-500 hover:bg-emerald-600 text-white">
              Solicitar Demo para mi Empresa
            </Link>
            <Link href="/demo/empresa" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
              Ver Demo Empresa
            </Link>
          </div>
        </div>
      </div>

      {/* Modal: Solicitar EWA */}
      <Dialog open={showEwaModal} onOpenChange={setShowEwaModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Solicitar Adelanto de Salario
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Recibe parte de tu salario ganado antes del día de pago
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monto a solicitar</span>
                <span className="text-emerald-400 font-bold text-xl">${ewaAmount[0].toLocaleString()}</span>
              </div>
              <Slider
                value={ewaAmount}
                onValueChange={setEwaAmount}
                max={DEMO_DATA.ewa.available}
                min={500}
                step={100}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mín: $500</span>
                <span>Máx: ${DEMO_DATA.ewa.available.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monto solicitado</span>
                <span className="text-white">${ewaAmount[0].toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Comisión (2.5%)</span>
                <span className="text-white">-${(ewaAmount[0] * 0.025).toFixed(0)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                <span className="text-gray-300">Recibirás</span>
                <span className="text-emerald-400">${(ewaAmount[0] * 0.975).toFixed(0)}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>El monto se depositará en tu cuenta en menos de 5 minutos y se descontará de tu próximo pago el {DEMO_DATA.ewa.nextPayday}</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEwaModal(false)} className="border-gray-600">
              Cancelar
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                toast.success(`¡Solicitud enviada! Recibirás $${(ewaAmount[0] * 0.975).toFixed(0)} en tu cuenta`);
                setShowEwaModal(false);
              }}
            >
              Confirmar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Transacción */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTransaction && <selectedTransaction.icon className="w-5 h-5 text-emerald-400" />}
              Detalle de Transacción
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{selectedTransaction.merchant}</span>
                <span className={`text-2xl font-bold ${selectedTransaction.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${Math.abs(selectedTransaction.amount).toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Categoría</span>
                  <span className="text-white capitalize">{selectedTransaction.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fecha</span>
                  <span className="text-white">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo de gasto</span>
                  <Badge className={selectedTransaction.isDiscretionary ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}>
                    {selectedTransaction.isDiscretionary ? 'Discrecional' : 'Esencial'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impacto en FWI</span>
                  <span className={selectedTransaction.isDiscretionary ? 'text-orange-400' : 'text-emerald-400'}>
                    {selectedTransaction.isDiscretionary ? '-0.5 puntos' : 'Neutral'}
                  </span>
                </div>
              </div>
              {selectedTransaction.isDiscretionary && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-sm text-orange-300">
                  <p className="font-medium">Consejo de Treevü AI:</p>
                  <p className="text-orange-200/80 mt-1">Este gasto es discrecional. Considera reducir gastos similares para mejorar tu FWI Score.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTransaction(null)} className="border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Meta */}
      <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGoal && <selectedGoal.icon className="w-5 h-5 text-emerald-400" />}
              {selectedGoal?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Meta financiera • Fecha límite: {selectedGoal?.deadline}
            </DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">
                  {Math.round((selectedGoal.current / selectedGoal.target) * 100)}%
                </div>
                <p className="text-gray-400 text-sm mt-1">completado</p>
              </div>
              <Progress value={(selectedGoal.current / selectedGoal.target) * 100} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ahorrado: <span className="text-white font-medium">${selectedGoal.current.toLocaleString()}</span></span>
                <span className="text-gray-400">Meta: <span className="text-white font-medium">${selectedGoal.target.toLocaleString()}</span></span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <p className="text-sm text-gray-400 font-medium">Historial de aportes</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Hace 1 semana</span><span className="text-emerald-400">+$2,500</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Hace 2 semanas</span><span className="text-emerald-400">+$1,800</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Hace 1 mes</span><span className="text-emerald-400">+$3,000</span></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Agregar aporte</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="$0" 
                    value={goalContribution}
                    onChange={(e) => setGoalContribution(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => {
                      if (goalContribution) {
                        toast.success(`¡Aporte de $${goalContribution} agregado a ${selectedGoal.name}!`);
                        setGoalContribution('');
                        setSelectedGoal(null);
                      }
                    }}
                  >
                    Aportar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Canjear Oferta */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Canjear Oferta
            </DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-4 py-4">
              <div className="text-center bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-xl p-6">
                <p className="text-3xl font-bold text-amber-400">{selectedOffer.discount}</p>
                <p className="text-xl text-white mt-2">{selectedOffer.merchant}</p>
                <p className="text-gray-400 text-sm mt-1">Válido hasta {selectedOffer.expires}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Costo en TreePoints</span>
                  <span className="text-amber-400 font-bold">{selectedOffer.points} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tu balance actual</span>
                  <span className="text-white font-medium">{DEMO_DATA.treePoints.balance} pts</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between">
                  <span className="text-gray-400">Balance después del canje</span>
                  <span className="text-emerald-400 font-medium">{DEMO_DATA.treePoints.balance - selectedOffer.points} pts</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedOffer(null)} className="border-gray-600">
              Cancelar
            </Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => {
                toast.success(`¡Oferta canjeada! Revisa tu email para el código de ${selectedOffer?.merchant}`);
                setSelectedOffer(null);
              }}
            >
              Canjear por {selectedOffer?.points} pts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Detalle de Logro */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">{selectedAchievement?.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{selectedAchievement?.name}</h3>
            {selectedAchievement?.earned ? (
              <>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                  ¡Desbloqueado!
                </Badge>
                <p className="text-gray-400 text-sm mt-4">Ganaste este logro por tu excelente progreso financiero. ¡Sigue así!</p>
                <p className="text-amber-400 font-medium mt-2">+50 TreePoints ganados</p>
              </>
            ) : (
              <>
                <Badge className="bg-gray-700 text-gray-400">
                  Bloqueado
                </Badge>
                <p className="text-gray-400 text-sm mt-4">Continúa mejorando tus hábitos financieros para desbloquear este logro.</p>
                <Progress value={65} className="mt-4 h-2" />
                <p className="text-xs text-gray-500 mt-1">65% completado</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAchievement(null)} className="w-full border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Bienvenida */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-emerald-900/30 border-emerald-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              ¡Bienvenida a tu Dashboard, María!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-300">Este es tu centro de control financiero personal. Aquí puedes:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monitorear tu FWI Score</p>
                  <p className="text-sm text-gray-400">Tu indicador de bienestar financiero en tiempo real</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Wallet className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Solicitar Adelantos (EWA)</p>
                  <p className="text-sm text-gray-400">Accede a tu salario ganado cuando lo necesites</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Gestionar tus Metas</p>
                  <p className="text-sm text-gray-400">Ahorra para lo que más te importa</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-3">
                <Gift className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Canjear TreePoints</p>
                  <p className="text-sm text-gray-400">Obtén recompensas por tus buenos hábitos</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm">
              <p className="text-emerald-300"><strong>Tip:</strong> Haz clic en cualquier elemento para ver más detalles y realizar acciones.</p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => setShowWelcomeModal(false)}>
              ¡Comenzar a Explorar!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Asesor Financiero IA */}
      <Dialog open={showAdvisorModal} onOpenChange={setShowAdvisorModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Treevü AI Advisor
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Tu asesor financiero personal disponible 24/7
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 py-4">
            {advisorChat.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-gray-400">Hola María, soy tu asesor financiero IA.</p>
                <p className="text-gray-500 text-sm mt-2">Pregúntame sobre tu FWI, cómo ahorrar más, o cualquier duda financiera.</p>
              </div>
            )}
            {advisorChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-gray-800 text-gray-200'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu pregunta..."
                value={advisorMessage}
                onChange={(e) => setAdvisorMessage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && advisorMessage.trim()) {
                    setAdvisorChat([...advisorChat, { role: 'user', message: advisorMessage }]);
                    const question = advisorMessage.toLowerCase();
                    setAdvisorMessage('');
                    setTimeout(() => {
                      let response = '¡Excelente pregunta! ';
                      if (question.includes('fwi') || question.includes('score')) {
                        response += 'Tu FWI Score de 78 está en rango saludable. Para mejorarlo, te recomiendo reducir gastos discrecionales en un 10% y aumentar tus aportes a metas de ahorro.';
                      } else if (question.includes('ahorra') || question.includes('ahorrar')) {
                        response += 'Basado en tus gastos, podrías ahorrar $2,500 más al mes si reduces comidas fuera de casa. Considera llevar almuerzo 3 días a la semana.';
                      } else if (question.includes('ewa') || question.includes('adelanto')) {
                        response += 'Tienes $8,500 disponibles para adelanto. Te sugiero usar EWA solo para emergencias y no más del 30% de tu límite para mantener un FWI saludable.';
                      } else {
                        response += 'Tu situación financiera es estable. Enfocarte en completar tu meta de Fondo de Emergencia te dará mayor tranquilidad. ¿Te gustaría que te ayude con un plan específico?';
                      }
                      setAdvisorChat(prev => [...prev, { role: 'ai', message: response }]);
                    }, 1000);
                  }
                }}
              />
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  if (advisorMessage.trim()) {
                    setAdvisorChat([...advisorChat, { role: 'user', message: advisorMessage }]);
                    setAdvisorMessage('');
                    setTimeout(() => {
                      setAdvisorChat(prev => [...prev, { role: 'ai', message: 'Gracias por tu pregunta. Basado en tu perfil financiero, te recomiendo mantener tus buenos hábitos de ahorro y considerar aumentar tu fondo de emergencia.' }]);
                    }, 1000);
                  }
                }}
              >
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Historial de FWI */}
      <Dialog open={showFwiHistoryModal} onOpenChange={setShowFwiHistoryModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Historial de FWI Score
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Evolución de tu bienestar financiero en los últimos 6 meses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {[
                { month: 'Diciembre', score: 78, change: '+5' },
                { month: 'Noviembre', score: 73, change: '+3' },
                { month: 'Octubre', score: 70, change: '+2' },
                { month: 'Septiembre', score: 68, change: '-1' },
                { month: 'Agosto', score: 69, change: '+4' },
                { month: 'Julio', score: 65, change: '+2' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <span className="text-gray-300">{item.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{item.score}</span>
                    <span className={`text-sm ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-emerald-300 text-sm">
                <strong>¡Excelente progreso!</strong> Tu FWI ha mejorado 13 puntos en 6 meses. Sigue así para alcanzar el nivel "Óptimo" (85+).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFwiHistoryModal(false)} className="border-gray-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Configuración de Alertas */}
      <Dialog open={showAlertsConfigModal} onOpenChange={setShowAlertsConfigModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Configurar Alertas Personales
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Personaliza las notificaciones que quieres recibir
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              { name: 'Alerta de gasto alto', desc: 'Cuando un gasto supere $500', enabled: true },
              { name: 'Recordatorio de metas', desc: 'Recordatorio semanal de aportes', enabled: true },
              { name: 'Cambio en FWI', desc: 'Cuando tu FWI cambie significativamente', enabled: false },
              { name: 'Ofertas disponibles', desc: 'Nuevas ofertas para canjear TreePoints', enabled: true },
              { name: 'Próximo día de pago', desc: '2 días antes de tu pago', enabled: false }
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <div>
                  <p className="text-white font-medium">{alert.name}</p>
                  <p className="text-gray-400 text-sm">{alert.desc}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={alert.enabled ? 'border-emerald-500 text-emerald-400' : 'border-gray-600 text-gray-400'}
                  onClick={() => toast.success(`Alerta ${alert.enabled ? 'desactivada' : 'activada'}`)}
                >
                  {alert.enabled ? 'Activa' : 'Inactiva'}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => {
              toast.success('Preferencias guardadas');
              setShowAlertsConfigModal(false);
            }}>
              Guardar Preferencias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
