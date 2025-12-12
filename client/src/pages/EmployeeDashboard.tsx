import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Loader2, TrendingUp, Wallet, Target, Gift, ArrowLeft, 
  Plus, MessageCircle, Send, Sparkles, AlertCircle, Settings, ClipboardList, Shield
} from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { DashboardSkeleton } from "@/components/ui/skeletons";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Celebration, useCelebration } from "@/components/ui/celebration";
import { StaggerContainer, StaggerItem } from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOfflineData } from "@/hooks/useOfflineData";
import { useOffline } from "@/hooks/useOffline";
import { useNetworkQuality } from "@/hooks/useNetworkQuality";
import { OfflineDataBadge } from "@/components/ui/offline-data-badge";
import { LastSyncIndicator } from "@/components/LastSyncIndicator";
import { cacheSet, cacheGet } from "@/lib/offlineCache";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductTour } from "@/components/ProductTour";
import { NotificationPermission } from "@/components/NotificationPermission";
import { FinancialShieldCard } from "@/components/dashboard/FinancialShieldCard";
import { AntExpenseDetector } from "@/components/dashboard/AntExpenseDetector";
import { EWASlider } from "@/components/dashboard/EWASlider";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ProgressiveDisclosure, FWI_EDUCATION_STEPS, EWA_EDUCATION_STEPS } from "@/components/dashboard/ProgressiveDisclosure";
import { EducationGamification } from "@/components/EducationGamification";
import { allTutorials } from "@/lib/educationalContent";
import { Leaderboard } from "@/components/Leaderboard";
import { BadgeShowcase } from "@/components/BadgeCard";
import { Award, Trophy } from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [expenseInput, setExpenseInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const { celebrationState, celebrate, hideCelebration } = useCelebration();
  const [previousCompletedGoals, setPreviousCompletedGoals] = useState<number>(0);
  const [pendingGoal, setPendingGoal] = useState<{ name: string; target: number; deadline: string } | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [showFwiEducation, setShowFwiEducation] = useState(false);
  const [showEwaEducation, setShowEwaEducation] = useState(false);

  // Offline state and network quality
  const { isOnline } = useOffline();
  const { shouldPrefetch, quality } = useNetworkQuality();
  const [cachedData, setCachedData] = useState<{
    fwiScore?: number;
    treePoints?: number;
    transactions?: Array<{ id: number; amount: number; category: string; description: string; createdAt: string }>;
  }>({});
  const [usingCache, setUsingCache] = useState(false);

  // Queries
  const { data: profile, isLoading: profileLoading } = trpc.users.getProfile.useQuery();
  const { data: fwiData } = trpc.fwi.getScore.useQuery();
  const { data: transactions, isLoading: txLoading } = trpc.transactions.list.useQuery({ limit: 10 });
  const { data: goals } = trpc.goals.list.useQuery();
  const { data: treePoints } = trpc.treePoints.getBalance.useQuery();
  const { data: advice } = trpc.ai.getAdvice.useQuery();

  // Offline data caching
  const { getCachedData, saveTransaction } = useOfflineData({
    fwiScore: fwiData?.score,
    treePoints: treePoints?.balance,
    transactions: transactions?.map(t => ({
      id: t.id,
      amount: Number(t.amount),
      category: t.category,
      description: t.description || '',
      createdAt: t.createdAt.toISOString(),
    })),
    userName: profile?.name || undefined,
    userEmail: profile?.email || undefined,
  });

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline && !fwiData) {
      getCachedData().then(data => {
        if (data.fwiScore || data.treePoints) {
          setCachedData(data);
          setUsingCache(true);
        }
      });
    } else if (isOnline) {
      setUsingCache(false);
    }
  }, [isOnline, fwiData, getCachedData]);

  // Pre-fetch data when connection is good
  useEffect(() => {
    if (shouldPrefetch && isOnline) {
      // Pre-cache offers for offline access
      const prefetchOffers = async () => {
        try {
          const cached = await cacheGet('offers_list');
          if (!cached) {
            console.log(`[Prefetch] Caching offers (network: ${quality})`);
            // The actual offers will be cached when user visits Offers page
            // This just logs the intent for now
          }
        } catch (e) {
          console.warn('[Prefetch] Failed to prefetch offers:', e);
        }
      };
      
      // Delay to not interfere with initial load
      const timer = setTimeout(prefetchOffers, 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldPrefetch, isOnline, quality]);

  // Mutations
  const createTransaction = trpc.transactions.create.useMutation({
    onSuccess: (data) => {
      toast.success("Gasto registrado correctamente");
      setExpenseInput("");
      if (data.classification) {
        toast.info(`Clasificado como: ${data.classification.category} (${data.classification.confidence}% confianza)`);
      }
    },
    onError: () => toast.error("Error al registrar el gasto"),
  });

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  const handleAddExpense = () => {
    if (!expenseInput.trim()) return;
    createTransaction.mutate({ description: expenseInput });
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: chatInput }]);
    chatMutation.mutate({ message: chatInput, history: chatHistory });
    setChatInput("");
  };

  // Detectar metas completadas y mostrar celebración
  useEffect(() => {
    if (goals) {
      const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
      if (completedGoals > previousCompletedGoals && previousCompletedGoals > 0) {
        celebrate("¡Meta completada!", "Sigue así, estás construyendo tu bienestar financiero");
      }
      setPreviousCompletedGoals(completedGoals);
    }
  }, [goals, previousCompletedGoals, celebrate]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] relative">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Use cached data when offline
  const fwiScore = fwiData?.score || cachedData.fwiScore || profile?.fwiScore || 50;
  const fwiLevel = fwiData?.level || profile?.level || 1;
  const streakDays = fwiData?.streakDays || profile?.streakDays || 0;
  const displayTreePoints = treePoints?.balance || cachedData.treePoints || 0;
  const displayTransactions = transactions || cachedData.transactions?.map(t => ({
    ...t,
    amount: t.amount.toString(),
    createdAt: new Date(t.createdAt),
  })) || [];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects - Same as Landing */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-segment-empresa/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 data-tour="welcome" className="text-xl font-display font-bold text-white">Mi Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div data-tour="treepoints" className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <Gift className="h-5 w-5 text-brand-primary" />
              <span className="font-semibold text-brand-primary">{displayTreePoints} TreePoints</span>
              {usingCache && <OfflineDataBadge size="sm" />}
            </div>
            <ThemeToggle />
            <NotificationCenter />
            <Link href="/survey">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-teal-500/10" title="Encuesta de bienestar">
                <ClipboardList className="h-5 w-5 text-teal-400" />
              </Button>
            </Link>
            <Link href="/settings/security">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-blue-500/10" title="Seguridad">
                <Shield className="h-5 w-5 text-blue-400" />
              </Button>
            </Link>
            <Link href="/settings/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Settings className="h-5 w-5 text-gray-400" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* FWI Score Card */}
        <Card data-tour="fwi-score" className="mb-8 border-0 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-gradient-to-r from-brand-primary/20 to-segment-empresa/20 backdrop-blur-sm border border-brand-primary/20 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  FWI Score
                  <EducationGamification
                    data-tour="education"
                    tutorialType="fwi"
                    steps={allTutorials.employee.fwi.basic.steps}
                    onComplete={() => toast.success('¡Felicidades! Has ganado 50 TreePoints por completar el tutorial de FWI')}
                  />
                  {usingCache && <OfflineDataBadge size="sm" />}
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold">{fwiScore}</span>
                  <span className="text-xl text-emerald-100">/100</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Nivel {fwiLevel} • {streakDays} días de racha
                </p>
              </div>
              <div className="text-right">
                <TrendingUp className="h-16 w-16 text-white/30" />
              </div>
            </div>
            <Progress value={fwiScore} className="mt-4 bg-white/10" />
          </CardContent>
        </Card>

        {/* AI Advice Card */}
        {advice && (
          <Card className="mb-8 border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="bg-brand-primary/20 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white">Treevü Brain - Consejo del día</p>
                  <p className="text-gray-400 text-sm mt-1">{advice.advice}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    advice.priority === 'high' ? 'bg-red-100 text-red-700' :
                    advice.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Prioridad {advice.priority}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Copiloto Financiero - Nuevos componentes premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FinancialShieldCard 
            savedInterest={2450} 
            creditCardRate={45.9} 
            treevuFee={3.99} 
          />
          <AntExpenseDetector 
            onCreateGoal={(name, target) => {
              setPendingGoal({ name, target, deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
              setIsCreatingGoal(true);
            }}
          />
          <EWASlider 
            data-tour="ewa"
            maxAvailable={500} 
            operativeFee={3.99}
            onRequest={(amount) => {
              toast.success(`Solicitud de S/ ${amount.toFixed(2)} procesada`);
            }}
            onLearnMore={() => setShowEwaEducation(true)}
          />
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="transactions">Gastos</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
            <TabsTrigger value="points">TreePoints</TabsTrigger>
            <TabsTrigger value="chat">Treevü Brain</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {/* Quick Add Expense */}
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Plus className="h-5 w-5 mr-2 text-brand-primary" />
                  Registrar Gasto
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Describe tu gasto y Treevü Brain lo clasificará automáticamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ej: Café en Starbucks $5.50"
                    value={expenseInput}
                    onChange={(e) => setExpenseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                  />
                  <AnimatedButton 
                    onClick={async () => {
                      if (!expenseInput.trim()) return;
                      await createTransaction.mutateAsync({ description: expenseInput });
                      setExpenseInput("");
                    }}
                    disabled={!expenseInput.trim()}
                    successMessage="¡+10 pts!"
                    className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Transacciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {txLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <StaggerContainer className="space-y-3">
                    {transactions.map((tx) => (
                      <StaggerItem key={tx.id}>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div>
                          <p className="font-medium text-white">{tx.merchant}</p>
                          <p className="text-sm text-gray-400">{tx.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            ${(tx.amount / 100).toFixed(2)}
                          </p>
                          {tx.isDiscretionary && (
                            <span className="text-xs text-orange-600">Discrecional</span>
                          )}
                        </div>
</div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-400">¡Aún no tienes transacciones!</p>
                    <p className="text-sm text-gray-500 mt-1">Registra tu primer gasto para empezar a ganar TreePoints</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card data-tour="goals" className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Target className="h-5 w-5 mr-2 text-brand-primary" />
                  Mis Metas Financieras
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goals && goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{goal.name}</span>
                              {goal.isPriority && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                  Prioritaria
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-400">{goal.category}</span>
                          </div>
                          <Progress value={progress} className="h-2 mb-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              ${(goal.currentAmount / 100).toFixed(2)} de ${(goal.targetAmount / 100).toFixed(2)}
                            </span>
                            <span className="font-medium text-brand-primary">{progress.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-400">¡Crea tu primera meta financiera!</p>
                    <p className="text-sm text-gray-500 mt-1">Gana 100 TreePoints al completar cada meta</p>
                    <Button variant="outline" className="mt-4 border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Meta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TreePoints Tab */}
          <TabsContent value="points" className="space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-primary/80 to-emerald-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Gift className="h-12 w-12 mx-auto mb-2 text-white/80" />
                  <p className="text-emerald-100">Tu Balance</p>
                  <p className="text-4xl font-bold">{treePoints?.balance || 0}</p>
                  <p className="text-emerald-100">TreePoints</p>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Widget */}
            <Leaderboard compact showMyPosition />

            {/* Badges Quick View */}
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Mis Insignias
                </CardTitle>
                <Link href="/badges">
                  <Button variant="ghost" size="sm" className="text-brand-primary">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-3">Completa tutoriales y logros para ganar insignias</p>
                <Link href="/badges">
                  <Button variant="outline" className="w-full border-brand-primary/50 text-brand-primary hover:bg-brand-primary/10">
                    <Trophy className="h-4 w-4 mr-2" />
                    Ver colección de insignias
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Cómo ganar más TreePoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <span className="text-gray-300">Registrar gastos diariamente</span>
                    <span className="font-semibold text-brand-primary">+10 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <span className="text-gray-300">Mantener racha de 7 días</span>
                    <span className="font-semibold text-brand-primary">+50 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <span className="text-gray-300">Alcanzar una meta de ahorro</span>
                    <span className="font-semibold text-brand-primary">+100 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <span className="text-gray-300">Mejorar tu FWI Score</span>
                    <span className="font-semibold text-brand-primary">+25 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <span className="text-gray-300">Obtener insignias</span>
                    <span className="font-semibold text-yellow-400">+100-500 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <MessageCircle className="h-5 w-5 mr-2 text-brand-primary" />
                  Treevü Brain
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Tu asesor financiero con IA. Pregúntame sobre tus finanzas o cómo mejorar tu FWI Score
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto mb-4 space-y-3 p-3 bg-black/30 rounded-lg border border-white/5">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-brand-primary" />
                      <p className="text-white">¡Hola! Soy Treevü Brain, tu asesor financiero.</p>
                      <p className="text-sm text-gray-400">¿En qué puedo ayudarte hoy?</p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-brand-primary text-white rounded-br-none'
                              : 'bg-white/10 border border-white/10 text-gray-200 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 border border-white/10 p-3 rounded-lg rounded-bl-none">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Escribe tu pregunta..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  />
                  <Button onClick={handleChat} disabled={chatMutation.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer with Sync Status */}
      <footer className="fixed bottom-0 left-0 right-0 bg-treevu-surface/80 backdrop-blur-md border-t border-white/10 py-2 px-4 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-500">Treevü © 2024</p>
          <LastSyncIndicator />
        </div>
      </footer>

      {/* Celebration Modal */}
      <Celebration
        show={celebrationState.show}
        message={celebrationState.message}
        subMessage={celebrationState.subMessage}
        onComplete={hideCelebration}
      />

      {/* Product Tour for new users */}
      <ProductTour />

      {/* Notification Permission Prompt */}
      <NotificationPermission />

      {/* Educational Modals */}
      <ProgressiveDisclosure
        isOpen={showFwiEducation}
        onClose={() => setShowFwiEducation(false)}
        title="Aprende sobre tu FWI Score"
        description="Descubre cómo funciona tu Índice de Bienestar Financiero y cómo mejorarlo"
        steps={FWI_EDUCATION_STEPS}
        onComplete={() => toast.success("¡Ahora entiendes mejor tu FWI! +10 TreePoints")}
      />

      <ProgressiveDisclosure
        isOpen={showEwaEducation}
        onClose={() => setShowEwaEducation(false)}
        title="Aprende sobre EWA"
        description="Todo lo que necesitas saber sobre el Adelanto de Salario Devengado"
        steps={EWA_EDUCATION_STEPS}
        onComplete={() => toast.success("¡Ahora entiendes cómo funciona EWA! +10 TreePoints")}
      />
    </div>
  );
}
