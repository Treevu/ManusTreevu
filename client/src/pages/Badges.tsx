import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, Filter, Sparkles, Trophy, Lock } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeCard } from '@/components/BadgeCard';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

// Category labels
const categoryLabels: Record<string, string> = {
  education: 'Educación',
  financial: 'Finanzas',
  engagement: 'Compromiso',
  social: 'Social',
  merchant: 'Comerciante',
  b2b: 'B2B',
};

export default function BadgesPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [celebratingBadge, setCelebratingBadge] = useState<number | null>(null);
  
  // Fetch all badges
  const { data: allBadges, isLoading: loadingBadges } = trpc.badges.list.useQuery();
  
  // Fetch user's earned badges
  const { data: userBadges, isLoading: loadingUserBadges } = trpc.badges.getUserBadges.useQuery();
  
  // Fetch unnotified badges for celebration
  const { data: unnotifiedBadges } = trpc.badges.getUnnotified.useQuery();
  
  // Mark badge as notified mutation
  const markNotified = trpc.badges.markNotified.useMutation();
  
  // Show celebration for first unnotified badge
  useEffect(() => {
    if (unnotifiedBadges && unnotifiedBadges.length > 0 && !celebratingBadge) {
      const firstUnnotified = unnotifiedBadges[0];
      setCelebratingBadge(firstUnnotified.badgeId);
    }
  }, [unnotifiedBadges, celebratingBadge]);
  
  const handleCelebrationEnd = (badgeId: number) => {
    markNotified.mutate({ badgeId });
    setCelebratingBadge(null);
  };
  
  const isLoading = loadingBadges || loadingUserBadges;
  
  // Create a map of earned badges
  const earnedBadgeMap = new Map(
    (userBadges || []).map((ub) => [ub.badge.code, ub])
  );
  
  // Filter badges by category
  const filteredBadges = (allBadges || []).filter(
    (badge) => selectedCategory === 'all' || badge.category === selectedCategory
  );
  
  // Stats
  const totalBadges = allBadges?.length || 0;
  const earnedCount = userBadges?.length || 0;
  const totalPoints = userBadges?.reduce((sum, ub) => sum + ub.badge.pointsReward, 0) || 0;
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set((allBadges || []).map((b) => b.category)))];
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/employee">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Mis Insignias
              </h1>
              <p className="text-sm text-gray-400">
                Colecciona insignias completando logros
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {earnedCount}/{totalBadges}
              </p>
              <p className="text-sm text-gray-400">Obtenidas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">
                {totalPoints.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Puntos ganados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-400">
                {totalBadges - earnedCount}
              </p>
              <p className="text-sm text-gray-400">Por desbloquear</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Progress bar */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progreso total</span>
              <span className="text-sm font-medium text-emerald-400">
                {totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalBadges > 0 ? (earnedCount / totalBadges) * 100 : 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'border-gray-700'
              }
            >
              {category === 'all' ? 'Todas' : categoryLabels[category] || category}
            </Button>
          ))}
        </div>
        
        {/* Badges Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredBadges.map((badge) => {
                const earned = earnedBadgeMap.get(badge.code);
                const isCelebrating = celebratingBadge === badge.id;
                
                return (
                  <motion.div
                    key={badge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <BadgeCard
                      badge={badge}
                      earned={!!earned}
                      earnedAt={earned?.earnedAt}
                      showCelebration={isCelebrating}
                      onCelebrationEnd={() => handleCelebrationEnd(badge.id)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No hay insignias en esta categoría
            </h3>
            <p className="text-sm text-gray-500">
              Prueba seleccionando otra categoría
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
