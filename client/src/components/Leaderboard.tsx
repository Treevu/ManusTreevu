import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

// Position icons and styles
const positionStyles = {
  1: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', ring: 'ring-yellow-500/50' },
  2: { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-500/20', ring: 'ring-gray-500/50' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/20', ring: 'ring-amber-600/50' },
};

interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string | null;
  treePoints: number;
  level: number;
  fwiScore: number;
  departmentId?: number | null;
}

interface LeaderboardProps {
  compact?: boolean;
  showMyPosition?: boolean;
  departmentId?: number;
  maxEntries?: number;
}

export function Leaderboard({
  compact = false,
  showMyPosition = true,
  departmentId,
  maxEntries = 10,
}: LeaderboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'points' | 'fwi' | 'level'>('points');
  
  // Fetch leaderboard data
  const { data: pointsLeaderboard, isLoading: loadingPoints } = trpc.leaderboard.treePointsRanking.useQuery({
    limit: maxEntries,
    departmentId,
  });
  
  const { data: fwiLeaderboard, isLoading: loadingFwi } = trpc.leaderboard.byFwi.useQuery({
    limit: maxEntries,
  });
  
  const { data: levelLeaderboard, isLoading: loadingLevel } = trpc.leaderboard.byLevel.useQuery({
    limit: maxEntries,
  });
  
  const { data: myPosition } = trpc.leaderboard.getMyPosition.useQuery(
    departmentId ? { departmentId } : undefined,
    { enabled: showMyPosition }
  );
  
  const isLoading = loadingPoints || loadingFwi || loadingLevel;
  
  const getLeaderboardData = () => {
    switch (activeTab) {
      case 'points':
        return pointsLeaderboard || [];
      case 'fwi':
        return fwiLeaderboard || [];
      case 'level':
        return levelLeaderboard || [];
      default:
        return [];
    }
  };
  
  const getValueLabel = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'points':
        return `${entry.treePoints.toLocaleString()} pts`;
      case 'fwi':
        return `FWI ${entry.fwiScore}`;
      case 'level':
        return `Nivel ${entry.level}`;
      default:
        return '';
    }
  };
  
  const leaderboardData = getLeaderboardData();
  
  if (compact) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top TreePoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(pointsLeaderboard || []).slice(0, 5).map((entry, index) => {
                const isCurrentUser = user?.id === entry.userId;
                const position = positionStyles[entry.rank as keyof typeof positionStyles];
                
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg',
                      isCurrentUser ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50' : 'bg-gray-800/50'
                    )}
                  >
                    {/* Rank */}
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      position?.bg || 'bg-gray-700',
                      position?.color || 'text-gray-400'
                    )}>
                      {position ? (
                        <position.icon className="w-4 h-4" />
                      ) : (
                        entry.rank
                      )}
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isCurrentUser ? 'text-emerald-400' : 'text-white'
                      )}>
                        {entry.name || 'Usuario'}
                        {isCurrentUser && ' (Tú)'}
                      </p>
                    </div>
                    
                    {/* Points */}
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-sm font-medium">
                        {entry.treePoints.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* My position if not in top 5 */}
              {showMyPosition && myPosition && myPosition.rank > 5 && (
                <>
                  <div className="text-center text-gray-500 text-sm py-1">• • •</div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/50">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-400">
                      {myPosition.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-400">Tú</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Top {myPosition.percentile}%
                    </Badge>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="points" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              TreePoints
            </TabsTrigger>
            <TabsTrigger value="fwi" className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              FWI Score
            </TabsTrigger>
            <TabsTrigger value="level" className="flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Nivel
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboardData.map((entry, index) => {
                    const isCurrentUser = user?.id === entry.userId;
                    const position = positionStyles[entry.rank as keyof typeof positionStyles];
                    
                    return (
                      <motion.div
                        key={entry.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'flex items-center gap-4 p-3 rounded-lg transition-all',
                          isCurrentUser 
                            ? 'bg-emerald-500/20 ring-2 ring-emerald-500/50' 
                            : 'bg-gray-800/50 hover:bg-gray-800'
                        )}
                      >
                        {/* Rank */}
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-bold',
                          position?.bg || 'bg-gray-700',
                          position?.ring && `ring-2 ${position.ring}`,
                          position?.color || 'text-gray-400'
                        )}>
                          {position ? (
                            <position.icon className="w-6 h-6" />
                          ) : (
                            <span className="text-lg">{entry.rank}</span>
                          )}
                        </div>
                        
                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'font-medium truncate',
                            isCurrentUser ? 'text-emerald-400' : 'text-white'
                          )}>
                            {entry.name || 'Usuario'}
                            {isCurrentUser && ' (Tú)'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Nivel {entry.level} • FWI {entry.fwiScore}
                          </p>
                        </div>
                        
                        {/* Value */}
                        <div className={cn(
                          'text-right',
                          activeTab === 'points' && 'text-emerald-400',
                          activeTab === 'fwi' && 'text-blue-400',
                          activeTab === 'level' && 'text-purple-400'
                        )}>
                          <p className="font-bold text-lg">
                            {getValueLabel(entry)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {/* My position if not in list */}
                  {showMyPosition && myPosition && myPosition.rank > maxEntries && (
                    <>
                      <div className="flex items-center justify-center gap-2 py-2 text-gray-500">
                        <span>•</span>
                        <span>•</span>
                        <span>•</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/20 ring-2 ring-emerald-500/50">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                          {myPosition.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-emerald-400">Tu posición</p>
                          <p className="text-sm text-gray-500">
                            De {myPosition.totalUsers} usuarios
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          Top {myPosition.percentile}%
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Compact widget for dashboard sidebar
export function LeaderboardWidget() {
  const { data: leaderboard, isLoading } = trpc.leaderboard.treePointsRanking.useQuery({
    limit: 3,
  });
  
  const { data: myPosition } = trpc.leaderboard.getMyPosition.useQuery();
  
  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-4">
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-900/50 border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Top 3
        </h3>
        {myPosition && (
          <Badge variant="outline" className="text-xs">
            #{myPosition.rank}
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        {(leaderboard || []).map((entry) => {
          const position = positionStyles[entry.rank as keyof typeof positionStyles];
          
          return (
            <div
              key={entry.userId}
              className="flex items-center gap-2 text-sm"
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center',
                position?.bg || 'bg-gray-700',
                position?.color || 'text-gray-400'
              )}>
                {position ? (
                  <position.icon className="w-3 h-3" />
                ) : (
                  entry.rank
                )}
              </div>
              <span className="flex-1 truncate text-gray-300">
                {entry.name || 'Usuario'}
              </span>
              <span className="text-emerald-400 font-medium">
                {entry.treePoints.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
