import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Award, TrendingUp } from 'lucide-react';

interface DispersionGamificationProps {
  isLoading?: boolean;
}

export default function DispersionGamification({ isLoading = false }: DispersionGamificationProps) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  // Badges del usuario
  const userBadges = [
    {
      id: 'debt-free',
      name: 'Debt-Free Champion',
      description: '30+ días sin acudir a deuda',
      icon: '🏆',
      earned: true,
      earnedDate: '2024-06-15',
      progress: 100,
    },
    {
      id: 'dispersion-master',
      name: 'Dispersión Master',
      description: '5+ dispersiones exitosas',
      icon: '⭐',
      earned: true,
      earnedDate: '2024-06-10',
      progress: 100,
    },
    {
      id: 'savings-hero',
      name: 'Savings Hero',
      description: '$1000+ ahorrados',
      icon: '💰',
      earned: true,
      earnedDate: '2024-06-05',
      progress: 100,
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: '10 dispersiones en 30 días',
      icon: '👑',
      earned: false,
      progress: 70, // 7 de 10
    },
    {
      id: 'financial-genius',
      name: 'Financial Genius',
      description: '$5000+ ahorrados',
      icon: '🧠',
      earned: false,
      progress: 35, // $1750 de $5000
    },
    {
      id: 'team-leader',
      name: 'Team Leader',
      description: 'Referir 3 amigos a dispersión',
      icon: '👥',
      earned: false,
      progress: 33, // 1 de 3
    },
  ];

  // Tier system
  const tiers = [
    { name: 'Bronze', minPoints: 0, maxPoints: 500, color: 'bg-amber-700', icon: '🥉' },
    { name: 'Silver', minPoints: 500, maxPoints: 1500, color: 'bg-gray-400', icon: '🥈' },
    { name: 'Gold', minPoints: 1500, maxPoints: 3000, color: 'bg-yellow-500', icon: '🥇' },
    { name: 'Platinum', minPoints: 3000, maxPoints: Infinity, color: 'bg-blue-400', icon: '💎' },
  ];

  const userPoints = 2450;
  const currentTier = tiers.find(t => userPoints >= t.minPoints && userPoints < t.maxPoints) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const pointsToNextTier = nextTier ? nextTier.minPoints - userPoints : 0;

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: 'María García', savings: 5200, dispersions: 15, tier: 'Platinum' },
    { rank: 2, name: 'Juan López', savings: 4800, dispersions: 14, tier: 'Gold' },
    { rank: 3, name: 'Tú', savings: 2450, dispersions: 8, tier: 'Gold' },
    { rank: 4, name: 'Carlos Rodríguez', savings: 2100, dispersions: 7, tier: 'Silver' },
    { rank: 5, name: 'Ana Martínez', savings: 1800, dispersions: 6, tier: 'Silver' },
    { rank: 6, name: 'Pedro Sánchez', savings: 1200, dispersions: 4, tier: 'Bronze' },
    { rank: 7, name: 'Laura Fernández', savings: 950, dispersions: 3, tier: 'Bronze' },
    { rank: 8, name: 'Miguel Díaz', savings: 650, dispersions: 2, tier: 'Bronze' },
  ];

  return (
    <div className="space-y-4">
      {/* Tier System */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tu Nivel de Maestría</CardTitle>
          <CardDescription>Sube de nivel ganando puntos con cada dispersión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Nivel Actual</p>
              <p className="text-4xl font-bold">{currentTier.icon} {currentTier.name}</p>
              <p className="text-sm text-gray-400 mt-2">{userPoints} puntos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Próximo Nivel</p>
              <p className="text-2xl font-bold text-blue-400">{nextTier?.icon} {nextTier?.name}</p>
              <p className="text-sm text-blue-300 mt-2">Faltan {pointsToNextTier} puntos</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{currentTier.name}</span>
              <span>{nextTier?.name}</span>
            </div>
            <Progress value={(userPoints - currentTier.minPoints) / (nextTier!.minPoints - currentTier.minPoints) * 100} className="h-3" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {tiers.map((tier, idx) => (
              <div
                key={tier.name}
                className={`p-3 rounded text-center ${
                  userPoints >= tier.minPoints ? tier.color : 'bg-gray-700/30'
                } transition-all`}
              >
                <p className="text-2xl mb-1">{tier.icon}</p>
                <p className="text-xs font-bold text-white">{tier.name}</p>
                <p className="text-xs text-gray-400">{tier.minPoints}+</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Tus Logros (Badges)
          </CardTitle>
          <CardDescription>Gana badges cumpliendo desafíos de dispersión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  badge.earned
                    ? 'bg-yellow-500/10 border-yellow-500/50 hover:border-yellow-500'
                    : 'bg-gray-500/10 border-gray-500/30 hover:border-gray-500'
                } ${selectedBadge === badge.id ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">{badge.icon}</p>
                  <p className="font-bold text-white text-sm mb-1">{badge.name}</p>
                  {badge.earned ? (
                    <p className="text-xs text-green-400">✓ Ganado</p>
                  ) : (
                    <div className="space-y-2">
                      <Progress value={badge.progress} className="h-2" />
                      <p className="text-xs text-gray-400">{badge.progress}%</p>
                    </div>
                  )}
                </div>

                {selectedBadge === badge.id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-300">{badge.description}</p>
                    {badge.earned && (
                      <p className="text-xs text-green-400 mt-2">Ganado: {badge.earnedDate}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Leaderboard de Ahorros
          </CardTitle>
          <CardDescription>Top 8 empleados por ahorros generados con dispersión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.rank === 3;
              return (
                <div
                  key={entry.rank}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    isCurrentUser
                      ? 'bg-blue-500/10 border-blue-500/50'
                      : entry.rank <= 2
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">
                        {entry.name}
                        {isCurrentUser && <span className="text-xs text-blue-400 ml-2">(Tú)</span>}
                      </p>
                      <p className="text-xs text-gray-400">{entry.dispersions} dispersiones</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">${entry.savings}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {entry.tier}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-sm text-green-300">
              <strong>Tu Posición:</strong> Estás en el top 3 de tu departamento. ¡Sigue así para alcanzar Platinum!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Points Breakdown */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Cómo Ganar Puntos</CardTitle>
          <CardDescription>Acciones que te dan TreePoints y puntos de nivel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Usar Dispersión</p>
                <p className="text-xs text-gray-400">Cada dispersión exitosa</p>
              </div>
              <p className="text-lg font-bold text-green-400">+10 pts</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Ahorrar $100</p>
                <p className="text-xs text-gray-400">Por cada $100 ahorrado</p>
              </div>
              <p className="text-lg font-bold text-green-400">+5 pts</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Ganar Badge</p>
                <p className="text-xs text-gray-400">Cuando completas un desafío</p>
              </div>
              <p className="text-lg font-bold text-green-400">+25 pts</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Referir Amigo</p>
                <p className="text-xs text-gray-400">Cuando alguien usa tu código</p>
              </div>
              <p className="text-lg font-bold text-green-400">+50 pts</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Racha de 7 Días</p>
                <p className="text-xs text-gray-400">Usar dispersión 7 días seguidos</p>
              </div>
              <p className="text-lg font-bold text-green-400">+100 pts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
