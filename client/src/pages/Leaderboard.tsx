import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp,
  Coins,
  Target,
  Flame,
  Crown,
  Loader2,
  ChevronUp,
  ChevronDown,
  Minus,
  Building2,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const RANK_COLORS = {
  1: 'from-yellow-400 to-amber-500',
  2: 'from-gray-300 to-gray-400',
  3: 'from-amber-600 to-amber-700',
};

const RANK_ICONS = {
  1: Crown,
  2: Medal,
  3: Medal,
};

function getRankBadge(rank: number) {
  if (rank === 1) return { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-yellow-900', icon: Crown };
  if (rank === 2) return { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-700', icon: Medal };
  if (rank === 3) return { bg: 'bg-gradient-to-r from-amber-600 to-amber-700', text: 'text-amber-100', icon: Medal };
  return { bg: 'bg-gray-100', text: 'text-gray-600', icon: null };
}

interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  level: number;
  treePoints: number;
  fwiScore: number;
  streakDays: number;
  goalsCompleted: number;
  change: number; // Position change from last period
}

// Mock data for demonstration
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 1, name: 'María García', level: 12, treePoints: 15420, fwiScore: 92, streakDays: 45, goalsCompleted: 8, change: 0 },
  { rank: 2, userId: 2, name: 'Carlos López', level: 11, treePoints: 14200, fwiScore: 88, streakDays: 38, goalsCompleted: 7, change: 2 },
  { rank: 3, userId: 3, name: 'Ana Martínez', level: 10, treePoints: 12800, fwiScore: 85, streakDays: 30, goalsCompleted: 6, change: -1 },
  { rank: 4, userId: 4, name: 'Pedro Sánchez', level: 9, treePoints: 11500, fwiScore: 82, streakDays: 25, goalsCompleted: 5, change: 1 },
  { rank: 5, userId: 5, name: 'Laura Rodríguez', level: 9, treePoints: 10900, fwiScore: 80, streakDays: 22, goalsCompleted: 5, change: -2 },
  { rank: 6, userId: 6, name: 'Miguel Torres', level: 8, treePoints: 9800, fwiScore: 78, streakDays: 18, goalsCompleted: 4, change: 0 },
  { rank: 7, userId: 7, name: 'Sofia Hernández', level: 8, treePoints: 9200, fwiScore: 76, streakDays: 15, goalsCompleted: 4, change: 3 },
  { rank: 8, userId: 8, name: 'Diego Flores', level: 7, treePoints: 8500, fwiScore: 74, streakDays: 12, goalsCompleted: 3, change: -1 },
  { rank: 9, userId: 9, name: 'Valentina Cruz', level: 7, treePoints: 7800, fwiScore: 72, streakDays: 10, goalsCompleted: 3, change: 0 },
  { rank: 10, userId: 10, name: 'Andrés Morales', level: 6, treePoints: 7200, fwiScore: 70, streakDays: 8, goalsCompleted: 2, change: 1 },
];

function LeaderboardRow({ entry, currentUserId, index }: { entry: LeaderboardEntry; currentUserId?: number; index: number }) {
  const isCurrentUser = entry.userId === currentUserId;
  const rankBadge = getRankBadge(entry.rank);
  const RankIcon = rankBadge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        isCurrentUser 
          ? 'bg-green-50 border-2 border-green-500 shadow-lg' 
          : 'bg-white border border-gray-100 hover:border-green-200 hover:shadow-md'
      }`}
    >
      {/* Rank */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${rankBadge.bg} ${rankBadge.text}`}>
        {RankIcon ? <RankIcon className="w-6 h-6" /> : entry.rank}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-green-100 text-green-700">
              {entry.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${entry.userId}`}>
              <div className="font-semibold text-gray-900 flex items-center gap-2 hover:text-green-600 cursor-pointer transition-colors">
                {entry.name}
                {isCurrentUser && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Tú</span>
                )}
              </div>
            </Link>
            <div className="text-sm text-gray-500">Nivel {entry.level}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="text-center">
          <div className="flex items-center gap-1 text-green-600 font-bold">
            <Coins className="w-4 h-4" />
            {entry.treePoints.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">TreePoints</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-blue-600 font-bold">
            <TrendingUp className="w-4 h-4" />
            {entry.fwiScore}
          </div>
          <div className="text-xs text-gray-500">FWI Score</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-orange-600 font-bold">
            <Flame className="w-4 h-4" />
            {entry.streakDays}
          </div>
          <div className="text-xs text-gray-500">Racha</div>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-purple-600 font-bold">
            <Target className="w-4 h-4" />
            {entry.goalsCompleted}
          </div>
          <div className="text-xs text-gray-500">Metas</div>
        </div>
      </div>

      {/* Position Change */}
      <div className="w-12 text-center">
        {entry.change > 0 ? (
          <div className="flex items-center justify-center text-green-600">
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-medium">{entry.change}</span>
          </div>
        ) : entry.change < 0 ? (
          <div className="flex items-center justify-center text-red-600">
            <ChevronDown className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.abs(entry.change)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-400">
            <Minus className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TopThreePodium({ entries }: { entries: LeaderboardEntry[] }) {
  const [first, second, third] = [entries[0], entries[1], entries[2]];

  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {/* Second Place */}
      {second && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-16 h-16 border-4 border-gray-300 mb-2">
            <AvatarFallback className="bg-gray-100 text-gray-700 text-xl">
              {second.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium text-gray-700 text-center max-w-20 truncate">{second.name}</div>
          <div className="text-xs text-gray-500">{second.treePoints.toLocaleString()} pts</div>
          <div className="w-20 h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2 flex items-center justify-center">
            <div className="text-3xl font-bold text-gray-600">2</div>
          </div>
        </motion.div>
      )}

      {/* First Place */}
      {first && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <Crown className="w-8 h-8 text-yellow-500 absolute -top-6 left-1/2 -translate-x-1/2" />
            <Avatar className="w-20 h-20 border-4 border-yellow-400 mb-2">
              <AvatarFallback className="bg-yellow-100 text-yellow-700 text-2xl">
                {first.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium text-gray-900 text-center max-w-24 truncate">{first.name}</div>
          <div className="text-xs text-gray-500">{first.treePoints.toLocaleString()} pts</div>
          <div className="w-24 h-32 bg-gradient-to-t from-yellow-400 to-amber-300 rounded-t-lg mt-2 flex items-center justify-center">
            <div className="text-4xl font-bold text-yellow-800">1</div>
          </div>
        </motion.div>
      )}

      {/* Third Place */}
      {third && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-14 h-14 border-4 border-amber-600 mb-2">
            <AvatarFallback className="bg-amber-100 text-amber-700 text-lg">
              {third.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium text-gray-700 text-center max-w-20 truncate">{third.name}</div>
          <div className="text-xs text-gray-500">{third.treePoints.toLocaleString()} pts</div>
          <div className="w-20 h-16 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg mt-2 flex items-center justify-center">
            <div className="text-2xl font-bold text-amber-100">3</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Leaderboard() {
  const { user, loading: authLoading } = useAuth();
  const [sortBy, setSortBy] = useState<'treePoints' | 'fwiScore' | 'streakDays' | 'goalsCompleted'>('treePoints');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Fetch departments for filter
  const { data: departments } = trpc.b2b.getDepartments.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Use API data when available, fallback to mock
  const { data: apiLeaderboard, isLoading } = trpc.leaderboard.byPoints.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  // Merge API data with mock structure and add department info
  const leaderboard = apiLeaderboard?.map((entry: any, index: number) => ({
    rank: index + 1,
    userId: entry.userId,
    name: entry.name || `Usuario ${entry.userId}`,
    level: entry.level,
    treePoints: entry.treePoints,
    fwiScore: entry.fwiScore,
    streakDays: entry.streakDays,
    goalsCompleted: entry.goalsCompleted,
    departmentId: entry.departmentId || null,
    departmentName: entry.departmentName || null,
    change: 0, // Would need historical data
  })) || mockLeaderboard.map(e => ({ ...e, departmentId: Math.ceil(e.userId / 3), departmentName: ['Tecnología', 'Ventas', 'Operaciones', 'Marketing'][Math.ceil(e.userId / 3) - 1] || 'General' }));

  // Filter by department
  const filteredLeaderboard = selectedDepartment === 'all' 
    ? leaderboard 
    : leaderboard.filter(e => String(e.departmentId) === selectedDepartment);

  // Sort leaderboard
  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    switch (sortBy) {
      case 'fwiScore': return b.fwiScore - a.fwiScore;
      case 'streakDays': return b.streakDays - a.streakDays;
      case 'goalsCompleted': return b.goalsCompleted - a.goalsCompleted;
      default: return b.treePoints - a.treePoints;
    }
  }).map((entry, index) => ({ ...entry, rank: index + 1 }));

  // Find current user's position
  const userPosition = user ? sortedLeaderboard.find(e => e.userId === user.id) : null;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Leaderboard
                </h1>
                <p className="text-sm text-gray-500">Ranking de bienestar financiero</p>
              </div>
            </div>

            {userPosition && (
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <span className="text-sm text-green-700">Tu posición:</span>
                <span className="font-bold text-green-800">#{userPosition.rank}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Top 3 del Mes</h2>
            <p className="text-green-100">Los empleados con mejor bienestar financiero</p>
          </div>
          <CardContent className="pt-8 pb-4">
            <TopThreePodium entries={sortedLeaderboard.slice(0, 3)} />
          </CardContent>
        </Card>

        {/* Department Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filtrar por:</span>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[200px]">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments?.map((dept: any) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                  {/* Fallback mock departments if API returns empty */}
                  {(!departments || departments.length === 0) && (
                    <>
                      <SelectItem value="1">Tecnología</SelectItem>
                      <SelectItem value="2">Ventas</SelectItem>
                      <SelectItem value="3">Operaciones</SelectItem>
                      <SelectItem value="4">Marketing</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {selectedDepartment !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDepartment('all')}>
                  Limpiar filtro
                </Button>
              )}
              <div className="ml-auto text-sm text-gray-500">
                Mostrando {filteredLeaderboard.length} de {leaderboard.length} usuarios
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="treePoints" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span className="hidden sm:inline">TreePoints</span>
            </TabsTrigger>
            <TabsTrigger value="fwiScore" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">FWI Score</span>
            </TabsTrigger>
            <TabsTrigger value="streakDays" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Racha</span>
            </TabsTrigger>
            <TabsTrigger value="goalsCompleted" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking Completo</CardTitle>
            <CardDescription>
              Ordenado por {
                sortBy === 'treePoints' ? 'TreePoints' :
                sortBy === 'fwiScore' ? 'FWI Score' :
                sortBy === 'streakDays' ? 'Días de racha' :
                'Metas completadas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedLeaderboard.map((entry, index) => (
              <LeaderboardRow 
                key={entry.userId} 
                entry={entry} 
                currentUserId={user?.id}
                index={index}
              />
            ))}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{sortedLeaderboard.length}</div>
              <div className="text-sm text-gray-500">Participantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Coins className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(sortedLeaderboard.reduce((sum, e) => sum + e.treePoints, 0) / sortedLeaderboard.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Promedio TreePoints</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(sortedLeaderboard.reduce((sum, e) => sum + e.fwiScore, 0) / sortedLeaderboard.length)}
              </div>
              <div className="text-sm text-gray-500">Promedio FWI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {sortedLeaderboard.reduce((sum, e) => sum + e.goalsCompleted, 0)}
              </div>
              <div className="text-sm text-gray-500">Metas Totales</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
