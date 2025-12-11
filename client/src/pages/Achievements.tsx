import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Star,
  Zap,
  Target,
  Flame,
  Crown,
  Gift,
  TrendingUp,
  Wallet,
  Users,
  Calendar,
  Shield,
  Sparkles,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';
import ThemeToggle from '@/components/ThemeToggle';

// Achievement definitions
const ACHIEVEMENTS = [
  // Financial
  { id: 1, code: 'first_expense', name: 'Primer Paso', description: 'Registra tu primer gasto', icon: 'Wallet', category: 'financial', rarity: 'common', pointsReward: 10 },
  { id: 2, code: 'expense_tracker', name: 'Rastreador', description: 'Registra 50 gastos', icon: 'TrendingUp', category: 'financial', rarity: 'rare', pointsReward: 50 },
  { id: 3, code: 'fwi_70', name: 'Bienestar Financiero', description: 'Alcanza un FWI Score de 70', icon: 'Star', category: 'financial', rarity: 'epic', pointsReward: 100 },
  { id: 4, code: 'fwi_90', name: 'Maestro Financiero', description: 'Alcanza un FWI Score de 90', icon: 'Crown', category: 'financial', rarity: 'legendary', pointsReward: 250 },
  
  // Savings
  { id: 5, code: 'first_goal', name: 'Soñador', description: 'Crea tu primera meta de ahorro', icon: 'Target', category: 'savings', rarity: 'common', pointsReward: 10 },
  { id: 6, code: 'goal_completed', name: 'Logrador', description: 'Completa tu primera meta', icon: 'CheckCircle2', category: 'savings', rarity: 'rare', pointsReward: 75 },
  { id: 7, code: 'five_goals', name: 'Ambicioso', description: 'Completa 5 metas de ahorro', icon: 'Trophy', category: 'savings', rarity: 'epic', pointsReward: 150 },
  { id: 8, code: 'emergency_fund', name: 'Previsor', description: 'Crea un fondo de emergencia', icon: 'Shield', category: 'savings', rarity: 'rare', pointsReward: 50 },
  
  // Engagement
  { id: 9, code: 'streak_7', name: 'Constante', description: 'Mantén una racha de 7 días', icon: 'Flame', category: 'engagement', rarity: 'common', pointsReward: 25 },
  { id: 10, code: 'streak_30', name: 'Dedicado', description: 'Mantén una racha de 30 días', icon: 'Flame', category: 'engagement', rarity: 'rare', pointsReward: 100 },
  { id: 11, code: 'streak_100', name: 'Imparable', description: 'Mantén una racha de 100 días', icon: 'Zap', category: 'engagement', rarity: 'legendary', pointsReward: 500 },
  { id: 12, code: 'first_ewa', name: 'Adelantado', description: 'Solicita tu primer adelanto EWA', icon: 'Wallet', category: 'engagement', rarity: 'common', pointsReward: 15 },
  
  // Social
  { id: 13, code: 'first_redeem', name: 'Canjeador', description: 'Canjea tu primera oferta', icon: 'Gift', category: 'social', rarity: 'common', pointsReward: 10 },
  { id: 14, code: 'points_1000', name: 'Coleccionista', description: 'Acumula 1,000 TreePoints', icon: 'Sparkles', category: 'social', rarity: 'rare', pointsReward: 50 },
  { id: 15, code: 'points_10000', name: 'Magnate de Puntos', description: 'Acumula 10,000 TreePoints', icon: 'Crown', category: 'social', rarity: 'legendary', pointsReward: 200 },
  
  // Milestones
  { id: 16, code: 'level_5', name: 'Aprendiz', description: 'Alcanza el nivel 5', icon: 'Star', category: 'milestone', rarity: 'common', pointsReward: 25 },
  { id: 17, code: 'level_10', name: 'Experto', description: 'Alcanza el nivel 10', icon: 'Trophy', category: 'milestone', rarity: 'rare', pointsReward: 75 },
  { id: 18, code: 'level_25', name: 'Leyenda', description: 'Alcanza el nivel 25', icon: 'Crown', category: 'milestone', rarity: 'legendary', pointsReward: 300 },
  { id: 19, code: 'one_year', name: 'Veterano', description: 'Usa Treevü por un año', icon: 'Calendar', category: 'milestone', rarity: 'epic', pointsReward: 200 },
  { id: 20, code: 'early_adopter', name: 'Pionero', description: 'Únete durante el lanzamiento', icon: 'Zap', category: 'milestone', rarity: 'legendary', pointsReward: 100, isHidden: true },
];

// Simulated user achievements (in real app, this comes from API)
const USER_ACHIEVEMENTS = [1, 5, 9, 12, 13, 16]; // IDs of unlocked achievements

const ICON_MAP: Record<string, any> = {
  Wallet,
  TrendingUp,
  Star,
  Crown,
  Target,
  CheckCircle2,
  Trophy,
  Shield,
  Flame,
  Zap,
  Gift,
  Sparkles,
  Calendar,
};

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-gray-100 text-gray-700 border-gray-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  epic: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-amber-100 text-amber-700 border-amber-300',
};

const RARITY_BG: Record<string, string> = {
  common: 'from-gray-50 to-gray-100',
  rare: 'from-blue-50 to-blue-100',
  epic: 'from-purple-50 to-purple-100',
  legendary: 'from-amber-50 to-amber-100',
};

const CATEGORY_LABELS: Record<string, string> = {
  financial: 'Finanzas',
  savings: 'Ahorro',
  engagement: 'Participación',
  social: 'Social',
  milestone: 'Hitos',
};

export default function Achievements() {
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);

  // Calculate stats
  const unlockedCount = USER_ACHIEVEMENTS.length;
  const totalCount = ACHIEVEMENTS.filter(a => !a.isHidden).length;
  const totalPoints = ACHIEVEMENTS
    .filter(a => USER_ACHIEVEMENTS.includes(a.id))
    .reduce((sum, a) => sum + a.pointsReward, 0);
  const progress = Math.round((unlockedCount / totalCount) * 100);

  // Filter achievements
  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (a.isHidden && !USER_ACHIEVEMENTS.includes(a.id)) return false;
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Logros</h1>
                <p className="text-sm text-gray-500">Desbloquea badges y gana TreePoints</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificationCenter />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Logros Desbloqueados</p>
                  <p className="text-3xl font-bold">{unlockedCount}/{totalCount}</p>
                </div>
                <Trophy className="w-10 h-10 text-amber-200" />
              </div>
              <Progress value={progress} className="mt-3 bg-amber-400/30" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Puntos Ganados</p>
                  <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
                </div>
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Racha Actual</p>
                  <p className="text-2xl font-bold text-orange-600">{user?.streakDays || 0} días</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Nivel</p>
                  <p className="text-2xl font-bold text-purple-600">{user?.level || 1}</p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid grid-cols-6 w-full max-w-2xl">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="financial">Finanzas</TabsTrigger>
            <TabsTrigger value="savings">Ahorro</TabsTrigger>
            <TabsTrigger value="engagement">Actividad</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="milestone">Hitos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = USER_ACHIEVEMENTS.includes(achievement.id);
              const IconComponent = ICON_MAP[achievement.icon] || Trophy;

              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedAchievement(achievement)}
                  className="cursor-pointer"
                >
                  <Card className={`relative overflow-hidden transition-all ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${RARITY_BG[achievement.rarity]} border-2 ${RARITY_COLORS[achievement.rarity].split(' ')[2]}`
                      : 'bg-gray-100 dark:bg-gray-800 opacity-60'
                  }`}>
                    {/* Rarity Badge */}
                    <Badge 
                      variant="outline" 
                      className={`absolute top-2 right-2 text-xs ${
                        isUnlocked ? RARITY_COLORS[achievement.rarity] : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {achievement.rarity}
                    </Badge>

                    <CardContent className="pt-8 pb-4 text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        isUnlocked 
                          ? 'bg-white shadow-lg' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {isUnlocked ? (
                          <IconComponent className={`w-8 h-8 ${
                            achievement.rarity === 'legendary' ? 'text-amber-500' :
                            achievement.rarity === 'epic' ? 'text-purple-500' :
                            achievement.rarity === 'rare' ? 'text-blue-500' :
                            'text-gray-600'
                          }`} />
                        ) : (
                          <Lock className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      <h3 className={`font-semibold text-sm mb-1 ${
                        isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {achievement.description}
                      </p>

                      <div className="flex items-center justify-center gap-1 text-xs">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className={isUnlocked ? 'text-amber-600 font-medium' : 'text-gray-400'}>
                          +{achievement.pointsReward} pts
                        </span>
                      </div>

                      {isUnlocked && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className={`overflow-hidden ${
                  USER_ACHIEVEMENTS.includes(selectedAchievement.id)
                    ? `bg-gradient-to-br ${RARITY_BG[selectedAchievement.rarity]}`
                    : ''
                }`}>
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                      USER_ACHIEVEMENTS.includes(selectedAchievement.id)
                        ? 'bg-white shadow-xl'
                        : 'bg-gray-200'
                    }`}>
                      {USER_ACHIEVEMENTS.includes(selectedAchievement.id) ? (
                        (() => {
                          const IconComponent = ICON_MAP[selectedAchievement.icon] || Trophy;
                          return <IconComponent className={`w-12 h-12 ${
                            selectedAchievement.rarity === 'legendary' ? 'text-amber-500' :
                            selectedAchievement.rarity === 'epic' ? 'text-purple-500' :
                            selectedAchievement.rarity === 'rare' ? 'text-blue-500' :
                            'text-gray-600'
                          }`} />;
                        })()
                      ) : (
                        <Lock className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    <Badge className={RARITY_COLORS[selectedAchievement.rarity]}>
                      {selectedAchievement.rarity.toUpperCase()}
                    </Badge>

                    <CardTitle className="mt-3">{selectedAchievement.name}</CardTitle>
                    <CardDescription>{selectedAchievement.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-600">Categoría</span>
                      <Badge variant="outline">{CATEGORY_LABELS[selectedAchievement.category]}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-600">Recompensa</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-amber-600">+{selectedAchievement.pointsReward} TreePoints</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <span className="text-sm text-gray-600">Estado</span>
                      {USER_ACHIEVEMENTS.includes(selectedAchievement.id) ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Desbloqueado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          <Lock className="w-3 h-3 mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setSelectedAchievement(null)}
                    >
                      Cerrar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
